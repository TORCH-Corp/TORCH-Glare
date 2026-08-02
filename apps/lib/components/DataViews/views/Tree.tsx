"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DynamicRecord, FieldConfig, TreeConfig } from "../types";
import {
  allIds,
  applyMove,
  autoDetectTreeShape,
  buildTree,
  findNodeById,
  flatten,
  initialExpansion,
  pruneTree,
  reconcileExpansion,
  type TreeNode,
} from "../../../utils/dataViews/treeUtils";
import { getByPath, recordKey, matchesFilterValues } from "../../../utils/dataViews/pathUtils";
import { visibleFields } from "../../../utils/dataViews/fieldUtils";
import { renderField } from "../fieldRenderers";
import { useIsMobile } from "../../../hooks/useIsMobile";
import { useViewData } from "../../../hooks/useViewData";
import { useDataViews, useRegisterView } from "../context";
import { TableGrid } from "./Table";
import { ViewSurface } from "./ViewSurface";
import { TreeSidebar } from "./tree/TreeSidebar";
import { TreeDrawer, TreeDrawerTrigger } from "./tree/TreeDrawer";
import { Card, CardContent, CardHeader } from "../../Card";
import { Table2, LayoutGrid, Network } from "lucide-react";
import { RAW } from "../styles";
import { cn } from "../../../utils/cn";

/** Set equality, so a reconciliation that changes nothing keeps the previous
 *  reference and avoids a pointless re-render. */
function sameSet(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

export type TreeProps = TreeConfig & {
  label?: string;
  className?: string;
};

/**
 * Two-pane explorer: hierarchy on the left, the selected node's subtree on the
 * right. Registers itself as the `tree` view — but only when the data actually
 * has a hierarchy, so the tab auto-hides for flat data unless the consumer
 * declares `childrenField` / `parentField` explicitly.
 */
export function DataViewsTree({
  label = "Tree",
  className,
  childrenField,
  parentField,
  idField,
  orderField,
  nodeLabel,
  defaultExpanded,
  defaultRightPane,
  dndEnabled,
}: TreeProps) {
  const { treeShape } = useDataViews();

  // Rebuilt only when a field actually changes. A rest-spread (`...treeConfig`)
  // would hand a fresh object down on every render, which cascades through
  // `autoDetectTreeShape` → `buildTree` and wipes the user's expansion state.
  const treeConfig = useMemo<TreeConfig>(
    () => ({
      childrenField,
      parentField,
      idField,
      orderField,
      nodeLabel,
      defaultExpanded,
      defaultRightPane,
      dndEnabled,
    }),
    [
      childrenField,
      parentField,
      idField,
      orderField,
      nodeLabel,
      defaultExpanded,
      defaultRightPane,
      dndEnabled,
    ],
  );

  const declared = childrenField != null || parentField != null;
  const available = declared || !!treeShape.childrenField || !!treeShape.parentField;

  return available ? (
    <TreeRegistered label={label} className={className} treeConfig={treeConfig} />
  ) : null;
}

function TreeRegistered({
  label,
  className,
  treeConfig,
}: {
  label: string;
  className?: string;
  treeConfig: TreeConfig;
}) {
  const active = useRegisterView({ id: "tree", label, icon: <Network /> });
  return active ? <TreeBodyView treeConfig={treeConfig} className={className} /> : null;
}

function TreeBodyView({ treeConfig, className }: { treeConfig: TreeConfig; className?: string }) {
  const { fields, onDataUpdate, filterState: activeFilters } = useDataViews();
  // Tree filters its own forest via `pruneTree` (a flat filter would orphan
  // descendants), so it takes the unfiltered tree-shaped records.
  const { records: data, displayFields: display } = useViewData({
    source: "tree",
    filter: false,
  });
  const isMobile = useIsMobile();

  const resolvedTree = useMemo(() => autoDetectTreeShape(data, treeConfig), [data, treeConfig]);

  const labelField: FieldConfig = useMemo(() => {
    const path = resolvedTree.nodeLabel;
    if (path) {
      const f = fields.find((x) => x.path === path);
      if (f) return f;
      return { path, label: path, type: "text" };
    }
    return display[0] ?? { path: resolvedTree.idField, type: "text" };
  }, [resolvedTree, fields, display]);

  const fullForest = useMemo(() => buildTree(data, resolvedTree), [data, resolvedTree]);

  const filterEntries = useMemo(() => Object.entries(activeFilters), [activeFilters]);

  const visibleForest: TreeNode[] = useMemo(() => {
    if (filterEntries.length === 0) return fullForest;
    return pruneTree(fullForest, (record) =>
      filterEntries.every(([path, value]) => matchesFilterValues(record, path, value)),
    );
  }, [fullForest, filterEntries]);

  const [expanded, setExpanded] = useState<Set<string>>(() =>
    initialExpansion(fullForest, resolvedTree.defaultExpanded),
  );

  // Every node we have already made an expansion decision about. Without this,
  // reconciliation cannot tell "the user deliberately collapsed this" from
  // "this node is new and should follow `defaultExpanded`".
  const seenNodes = useRef<Set<string>>(allIds(fullForest));

  useEffect(() => {
    // Reconcile, don't reset: keep what the user has open and only apply
    // `defaultExpanded` to nodes that have appeared since. Recomputing from
    // scratch here collapsed the whole tree on every unrelated Root re-render.
    setExpanded((prev) => {
      const next = reconcileExpansion(
        prev,
        fullForest,
        resolvedTree.defaultExpanded,
        seenNodes.current,
      );
      seenNodes.current = allIds(fullForest);
      return sameSet(prev, next) ? prev : next;
    });
  }, [fullForest, resolvedTree.defaultExpanded]);

  const [selectedId, setSelectedId] = useState<string | null>(() => fullForest[0]?.id ?? null);

  useEffect(() => {
    if (selectedId && !findNodeById(visibleForest, selectedId)) {
      setSelectedId(visibleForest[0]?.id ?? null);
    }
  }, [visibleForest, selectedId]);

  const selectedNode = selectedId ? findNodeById(visibleForest, selectedId) : null;
  const recordsForRightPane = useMemo(
    () => (selectedNode ? flatten(selectedNode) : []),
    [selectedNode],
  );

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const [drawerOpen, setDrawerOpen] = useState(false);

  type RightPaneMode = "table" | "card";
  const [rightPaneMode, setRightPaneMode] = useState<RightPaneMode>(
    // "details" is a deprecated alias of "card".
    treeConfig.defaultRightPane === "details" ? "card" : (treeConfig.defaultRightPane ?? "table"),
  );

  const dndEnabled = treeConfig.dndEnabled !== false;

  const handleMove = ({
    dragIds,
    parentId,
    index,
  }: {
    dragIds: string[];
    parentId: string | null;
    index: number;
  }) => {
    onDataUpdate(applyMove(data, resolvedTree, { dragIds, parentId, index }));
  };

  const treeContent = (
    <TreeSidebar
      roots={visibleForest}
      expanded={expanded}
      selectedId={selectedId}
      labelField={labelField}
      dndEnabled={dndEnabled}
      onToggle={toggle}
      onSelect={(id) => {
        setSelectedId(id);
        if (isMobile) setDrawerOpen(false);
      }}
      onMove={handleMove}
    />
  );

  return (
    <ViewSurface className={className}>
      <div className="flex h-full gap-2 p-2">
        {!isMobile && (
          <div className="w-64 rounded-[16px] border border-border-presentation-global-primary bg-background-presentation-form-base overflow-hidden flex flex-col">
            <div className="px-3 py-2 border-b border-border-presentation-global-primary">
              <span
                style={{ fontFeatureSettings: "'cv05' on" }}
                className="typography-display-medium-medium uppercase text-content-presentation-global-primary"
              >
                categories
              </span>
            </div>
            <div className="flex-1 overflow-hidden">{treeContent}</div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden rounded-[16px] border border-border-presentation-global-primary bg-background-presentation-form-base">
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-border-presentation-global-primary bg-background-presentation-form-base">
            <div className="flex items-center gap-2 min-w-0">
              {isMobile && <TreeDrawerTrigger onClick={() => setDrawerOpen(true)} />}
              <span
                style={{ fontFeatureSettings: "'cv05' on" }}
                className="typography-display-medium-medium uppercase text-content-presentation-global-primary truncate"
              >
                {selectedNode
                  ? String(getByPath(selectedNode.record, labelField.path) ?? "Items")
                  : "Items"}
              </span>
              <div className="h-6 w-px bg-border-presentation-global-primary shrink-0" />
              <span className="text-sm text-content-presentation-global-secondary truncate">
                {selectedNode
                  ? `${recordsForRightPane.length} record${recordsForRightPane.length === 1 ? "" : "s"}`
                  : "Select an item"}
              </span>
            </div>

            {/* Segmented switcher — same style as the main view switcher
              (DataViews.Header): themed track, white active pill, divider
              between two inactive tabs only. */}
            <div className="flex items-center gap-[2px] rounded-[10px] bg-background-presentation-body-primary p-[2px] shadow-[inset_0_0_4px_0_rgba(0,0,0,0.08)] shrink-0">
              {(
                [
                  { id: "table", label: "List", icon: <Table2 /> },
                  { id: "card", label: "Cards", icon: <LayoutGrid /> },
                ] as const
              ).map((tab, idx) => {
                const active = rightPaneMode === tab.id;
                const prevActive = idx > 0 && rightPaneMode === "table";
                const showDivider = idx > 0 && !active && !prevActive;
                return (
                  <div key={tab.id} className="flex items-center">
                    {showDivider && (
                      <div
                        className="mx-[3px] h-3 w-px"
                        style={{ backgroundColor: RAW.chromeDivider }}
                      />
                    )}
                    <button
                      type="button"
                      aria-label={`${tab.label} mode`}
                      aria-pressed={active}
                      onClick={() => setRightPaneMode(tab.id)}
                      className={cn(
                        "flex h-6 items-center gap-[6px] rounded-[8px] px-3 text-[14px] font-[510] leading-none transition-all duration-200 ease-in-out",
                        active
                          ? "bg-white text-black shadow-[0_0_10px_2px_rgba(0,0,0,0.25)]"
                          : "bg-transparent text-content-presentation-global-primary hover:bg-background-presentation-action-contstyle-hover",
                      )}
                    >
                      <span className="flex h-[14px] w-[14px] items-center justify-center [&_svg]:h-[14px] [&_svg]:w-[14px]">
                        {tab.icon}
                      </span>
                      <span className="max-w-[80px] truncate">{tab.label}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {selectedNode ? (
              rightPaneMode === "table" ? (
                <RightPaneTable records={recordsForRightPane} fields={display} />
              ) : (
                <CardGrid records={recordsForRightPane} fields={fields} labelField={labelField} />
              )
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-content-presentation-global-tertiary">
                No node selected.
              </div>
            )}
          </div>
        </div>

        {isMobile && (
          <TreeDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            {treeContent}
          </TreeDrawer>
        )}
      </div>
    </ViewSurface>
  );
}

/**
 * Table mode for the Tree right pane. Reuses the presentational `TableGrid`
 * over the selected node's subtree, with its own sort + selection state — the
 * Root's `config.sortBy` belongs to the standalone table view, not this
 * embedded one.
 */
function RightPaneTable({ records, fields }: { records: DynamicRecord[]; fields: FieldConfig[] }) {
  const [sortPath, setSortPath] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selection, setSelection] = useState<string[]>([]);

  const idPath = fields[0]?.path;
  const rowIds = useMemo(
    () => records.map((item, idx) => recordKey(item, idPath, idx)),
    [records, idPath],
  );

  const sorted = useMemo(() => {
    if (!sortPath) return records;
    const modifier = sortDirection === "asc" ? 1 : -1;
    return [...records].sort((a, b) => {
      const av = getByPath(a, sortPath);
      const bv = getByPath(b, sortPath);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * modifier;
      return String(av).localeCompare(String(bv)) * modifier;
    });
  }, [records, sortPath, sortDirection]);

  const selectedKeys = useMemo(() => new Set(selection), [selection]);
  const allSelected = rowIds.length > 0 && rowIds.every((id) => selectedKeys.has(id));

  return (
    <TableGrid
      records={sorted}
      rowIds={rowIds}
      fields={fields}
      sortPath={sortPath}
      sortDirection={sortDirection}
      onSort={(path) => {
        if (sortPath === path) setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
        else {
          setSortPath(path);
          setSortDirection("asc");
        }
      }}
      selectedKeys={selectedKeys}
      allSelected={allSelected}
      onToggleAll={() => setSelection(allSelected ? [] : rowIds)}
      onToggleRow={(id) =>
        setSelection((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
      }
    />
  );
}

/**
 * Card mode for the Tree right pane: renders the same record set as Table
 * mode, one library <Card> per record. The label field is the card header;
 * the remaining visible fields are key/value rows in the card body.
 */
function CardGrid({
  records,
  fields,
  labelField,
}: {
  records: readonly DynamicRecord[];
  fields: readonly FieldConfig[];
  labelField: FieldConfig;
}) {
  const bodyFields = visibleFields(fields)
    .filter((f) => f.path !== labelField.path)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (records.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-content-presentation-global-tertiary">
        No records.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 bg-background-presentation-body-primary">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {records.map((record, idx) => {
          const labelValue = getByPath(record, labelField.path);
          return (
            <Card key={(record.id ?? idx) as string | number} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="text-xs uppercase tracking-wide text-content-presentation-global-tertiary">
                  {labelField.label ?? labelField.path}
                </div>
                <div className="text-base font-semibold text-content-presentation-global-primary">
                  {renderField(labelValue, labelField, record)}
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {bodyFields.map((f) => {
                  const value = getByPath(record, f.path);
                  if (value == null) return null;
                  return (
                    <div key={f.path} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-content-presentation-global-tertiary">
                        {f.label ?? f.path}
                      </span>
                      <span className="text-content-presentation-global-primary text-right">
                        {renderField(value, f, record)}
                      </span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
