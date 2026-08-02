"use client";

import { useEffect, useMemo, useState, type ElementType, type ReactNode } from "react";
import { Badge } from "../../Badge";
import {
  Star,
  Archive,
  Trash2,
  MoreHorizontal,
  Reply,
  Forward,
  Paperclip,
  InboxIcon,
  AlertCircle,
} from "lucide-react";
import { cn } from "../../../utils/cn";
import type { DynamicRecord, InboxConfig } from "../types";
import TabFormItem from "../../TabFormItem";
import { Button } from "../../Button";
import { Avatar, AvatarFallback } from "../../Avatar";
import { Card } from "../../Card";
import { Divider } from "../../Divider";
import { renderDetailView } from "../../../utils/dataViews/nestedDataUtils";
import { getByPath, recordKey, setByPath } from "../../../utils/dataViews/pathUtils";
import { renderField } from "../fieldRenderers";
import { resolveInboxConfig } from "../../../utils/dataViews/fieldUtils";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useViewData } from "../../../hooks/useViewData";
import { useDataViews, useRegisterView } from "../context";
import { resolveBadgeVariant } from "../badgeAdapter";
import { InboxViewCard } from "./InboxCard";
import { ViewSurface } from "./ViewSurface";

export type InboxProps = {
  /** Which record fields carry the starred / read / attachment / priority
   *  flags. Auto-detected from the data when omitted. */
  config?: InboxConfig;
  itemHref?: (item: DynamicRecord, id: unknown) => string;
  /**
   * Component used to render each item's link when `itemHref` is set. Defaults
   * to a plain `<a>` (full-page navigation). Pass your router's link
   * (e.g. Next.js `Link`, React Router `Link`) for client-side navigation.
   */
  linkComponent?: ElementType;
  selectedId?: unknown;
  renderDetail?: (item: DynamicRecord | null) => ReactNode;
  label?: string;
  className?: string;
};

type InboxFilter = "all" | "starred" | "priority";

/** Inbox flag predicates. Module-level and `inboxCfg`-parameterised so the
 *  filtering memo can list its real dependencies instead of suppressing the
 *  exhaustive-deps rule. */
type ResolvedInboxConfig = ReturnType<typeof resolveInboxConfig>;

function isStarred(item: DynamicRecord, cfg: ResolvedInboxConfig): boolean {
  return cfg.starredField ? !!getByPath(item, cfg.starredField) : false;
}

function isHighPriority(item: DynamicRecord, cfg: ResolvedInboxConfig): boolean {
  if (!cfg.priorityField) return false;
  return String(getByPath(item, cfg.priorityField)).toLowerCase() === "high";
}

function hasAttachment(item: DynamicRecord, cfg: ResolvedInboxConfig): boolean {
  if (!cfg.attachmentField) return false;
  const v = getByPath(item, cfg.attachmentField);
  if (typeof v === "boolean") return v;
  if (Array.isArray(v)) return v.length > 0;
  return v != null;
}

function getInitials(name: unknown): string {
  const s = String(name ?? "?").trim();
  if (!s) return "?";
  return (
    s
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

/** Three-pane mail-style list. Registers itself as the `inbox` view; renders
 *  only while it is the active one. */
export function DataViewsInbox({ label = "Inbox", ...props }: InboxProps) {
  const active = useRegisterView({ id: "inbox", label, icon: <InboxIcon /> });
  return active ? <InboxBodyView {...props} /> : null;
}

function InboxBodyView({
  config: userInboxConfig,
  itemHref,
  linkComponent,
  selectedId,
  renderDetail,
  className,
}: InboxProps) {
  const { fields, config, flatItems, updateRecord } = useDataViews();
  const { records: data, displayFields, idPath } = useViewData();
  const isMobile = useIsMobile();
  const [selectedItem, setSelectedItem] = useState<DynamicRecord | null>(data[0] || null);
  const [inboxFilter, setInboxFilter] = useState<InboxFilter>("all");

  // Detection reads `flatItems`, not the filtered `data`: a filter that empties
  // the list would otherwise resolve every flag field to null and make the
  // Starred / Priority rails disappear mid-session.
  const inboxCfg = useMemo(
    () => resolveInboxConfig(flatItems, userInboxConfig),
    [flatItems, userInboxConfig],
  );
  useEffect(() => {
    if (selectedId == null) return;
    const match = data.find((item, idx) => {
      const cur = recordKey(item, idPath, idx);
      return String(cur) === String(selectedId);
    });
    if (match) setSelectedItem(match);
  }, [selectedId, data, idPath]);

  const titleField = useMemo(() => {
    const path = inboxCfg.titlePath;
    if (path)
      return (
        fields.find((f) => f.path === path) ?? {
          path,
          label: path,
          type: "text" as const,
        }
      );
    return displayFields[0];
  }, [inboxCfg.titlePath, displayFields, fields]);

  const previewField = useMemo(() => {
    const path = inboxCfg.previewPath;
    if (path)
      return (
        fields.find((f) => f.path === path) ?? {
          path,
          label: path,
          type: "text" as const,
        }
      );
    return displayFields[1];
  }, [inboxCfg.previewPath, displayFields, fields]);

  const toggleStar = (itemId: string) => {
    const starredField = inboxCfg.starredField;
    if (!starredField) return;

    // Edit by id against the source dataset. Mapping over `data` and writing
    // the result back would delete every record the active filter is hiding.
    updateRecord(itemId, (record) =>
      setByPath(record, starredField, !getByPath(record, starredField)),
    );

    if (selectedItem && recordKey(selectedItem, idPath, -1) === itemId) {
      setSelectedItem((prev) =>
        prev ? setByPath(prev, starredField, !getByPath(prev, starredField)) : prev,
      );
    }
  };

  const handleSelectItem = (item: DynamicRecord) => {
    setSelectedItem(item);
  };

  // Field filters are already applied by `useViewData`; this narrows further by
  // the All / Starred / Priority rail selection.
  const filteredData = useMemo(() => {
    if (inboxFilter === "all") return data;
    const predicate = inboxFilter === "starred" ? isStarred : isHighPriority;
    return data.filter((item) => predicate(item, inboxCfg));
  }, [data, inboxFilter, inboxCfg]);

  const starredCount = inboxCfg.starredField
    ? data.filter((i) => isStarred(i, inboxCfg)).length
    : 0;
  const priorityCount = inboxCfg.priorityField
    ? data.filter((i) => isHighPriority(i, inboxCfg)).length
    : 0;

  const countBadge = resolveBadgeVariant("gray");

  return (
    <ViewSurface className={className}>
      <div className="flex h-full flex-col md:flex-row gap-2 p-2">
        {/* Quick-filter rail: All / Starred / Priority. Field filters live in the
          DataViews config rail, not here. */}
        {!isMobile && (
          <div className="w-56 shrink-0 rounded-[16px] border border-border-presentation-global-primary bg-background-presentation-body-overlay-primary p-2">
            <div className="space-y-1">
              <TabFormItem
                componentType="side"
                active={inboxFilter === "all"}
                onClick={() => setInboxFilter("all")}
                className="w-full justify-start gap-2"
              >
                <InboxIcon className="h-4 w-4" />
                All Items
                <Badge {...countBadge} label={String(data.length)} className="ml-auto" size="XS" />
              </TabFormItem>
              {inboxCfg.starredField && (
                <TabFormItem
                  componentType="side"
                  active={inboxFilter === "starred"}
                  className="w-full justify-start gap-2"
                  onClick={() => setInboxFilter("starred")}
                >
                  <Star className="h-4 w-4" />
                  Starred
                  {starredCount > 0 && (
                    <Badge
                      {...countBadge}
                      label={String(starredCount)}
                      className="ml-auto"
                      size="XS"
                    />
                  )}
                </TabFormItem>
              )}
              {inboxCfg.priorityField && (
                <TabFormItem
                  componentType="side"
                  active={inboxFilter === "priority"}
                  className="w-full justify-start gap-2"
                  onClick={() => setInboxFilter("priority")}
                >
                  <AlertCircle className="h-4 w-4" />
                  Priority
                  {priorityCount > 0 && (
                    <Badge
                      {...countBadge}
                      label={String(priorityCount)}
                      className="ml-auto"
                      size="XS"
                    />
                  )}
                </TabFormItem>
              )}
            </div>
          </div>
        )}

        <div
          className={cn(
            "border rounded-[16px]  border-border-presentation-global-primary flex flex-col  bg-background-presentation-form-base overflow-hidden",
            isMobile ? "flex-1" : "w-full md:w-96",
          )}
        >
          <div className="px-3 py-2  border-b border-border-presentation-global-primary">
            <span
              style={{ fontFeatureSettings: "'cv05' on" }}
              className="typography-display-medium-medium  uppercase text-content-presentation-global-primary"
            >
              inbox
            </span>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto gap-1 py-1 bg-background-presentation-button-disabled">
            {filteredData.map((item, idx) => {
              const itemId = recordKey(item, idPath, idx);
              const selected =
                (selectedId != null && String(selectedId) === String(itemId)) ||
                (selectedItem != null && recordKey(selectedItem, idPath, -1) === itemId);

              return (
                <InboxViewCard
                  key={itemId as string | number}
                  item={item}
                  rowFields={displayFields}
                  selected={selected}
                  onSelect={() => handleSelectItem(item)}
                  href={itemHref?.(item, itemId)}
                  linkComponent={linkComponent}
                />
              );
            })}
          </div>
        </div>

        {renderDetail && !isMobile ? (
          <div className="flex-1 flex flex-col bg-background-presentation-form-base overflow-hidden rounded-[16px]">
            {renderDetail(selectedItem)}
          </div>
        ) : config.showPreviewPane && !isMobile && selectedItem ? (
          <div className="flex-1 flex flex-col bg-background-presentation-form-base overflow-hidden rounded-[16px] border border-border-presentation-global-primary">
            <div className="flex items-center justify-between gap-4 p-4 border-b border-border-presentation-global-primary bg-background-presentation-form-base">
              <div className="flex items-center gap-2">
                <Button variant="BorderStyle" buttonType="icon">
                  <Archive className="h-4 w-4" />
                </Button>
                <Button variant="BorderStyle" buttonType="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Divider orientation="vertical" className="h-6" />
                <Button variant="BorderStyle" buttonType="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <Card>
                <div className="flex items-start gap-4 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-background-presentation-action-primary text-content-presentation-action-primary">
                      {getInitials(previewField ? getByPath(selectedItem, previewField.path) : "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h2 className="text-xl font-semibold text-content-presentation-global-primary mb-1">
                          {String(titleField ? getByPath(selectedItem, titleField.path) : "")}
                        </h2>
                        {previewField && (
                          <p className="text-sm text-content-presentation-global-tertiary">
                            {previewField.label}:{" "}
                            <span className="text-content-presentation-global-primary">
                              {String(getByPath(selectedItem, previewField.path))}
                            </span>
                          </p>
                        )}
                      </div>
                      {inboxCfg.starredField && (
                        <button
                          onClick={() => toggleStar(recordKey(selectedItem, idPath, -1))}
                          className="hover:text-content-presentation-badge-yellow transition-colors"
                          aria-label="Toggle star"
                        >
                          <Star
                            className={cn(
                              "h-5 w-5",
                              isStarred(selectedItem, inboxCfg)
                                ? "fill-content-presentation-badge-yellow text-content-presentation-badge-yellow"
                                : "text-content-presentation-global-tertiary",
                            )}
                          />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {displayFields.slice(3).map((field) => {
                        const value = getByPath(selectedItem, field.path);
                        if (value == null) return null;
                        return (
                          <span key={field.path}>{renderField(value, field, selectedItem)}</span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <Divider className="my-6" />

                {renderDetailView(selectedItem, displayFields, (value, field, row) =>
                  renderField(value, field, row),
                )}

                {hasAttachment(selectedItem, inboxCfg) && (
                  <>
                    <Divider className="my-6" />
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-background-presentation-form-field-primary">
                      <Paperclip className="h-4 w-4 text-content-presentation-global-tertiary" />
                      <span className="text-sm text-content-presentation-global-primary">
                        attachment.pdf
                      </span>
                      <span className="text-xs text-content-presentation-global-tertiary">
                        (2.4 MB)
                      </span>
                    </div>
                  </>
                )}
              </Card>
            </div>

            <div className="flex items-center gap-2 p-4 border-t border-border-presentation-global-primary bg-background-presentation-form-base">
              <Button className="gap-2">
                <Reply className="h-4 w-4" />
                Reply
              </Button>
              <Button variant="BorderStyle" className="gap-2 bg-transparent">
                <Forward className="h-4 w-4" />
                Forward
              </Button>
            </div>
          </div>
        ) : (
          !isMobile && (
            <div className="flex-1 flex items-center justify-center bg-background-presentation-form-base overflow-hidden rounded-[16px] border border-border-presentation-global-primary">
              <p className="text-content-presentation-global-tertiary">
                Select an item to view details
              </p>
            </div>
          )
        )}
      </div>
    </ViewSurface>
  );
}
