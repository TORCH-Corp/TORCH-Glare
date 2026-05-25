"use client";

import { forwardRef, type ReactNode } from "react";
import Link from "next/link";
import { Star, Paperclip } from "lucide-react";
import { cn } from "../../utils/cn";
import { Avatar, AvatarFallback } from "../Avatar";
import { getByPath } from "../../utils/dataViews/pathUtils";
import { renderField } from "./fieldRenderers";
import type { DynamicRecord, FieldConfig } from "./types";

function getInitials(name: any): string {
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

export interface InboxViewCardProps {
  item: DynamicRecord;
  titleField?: FieldConfig;
  previewField?: FieldConfig;
  detailField?: FieldConfig;
  metaFields?: FieldConfig[];
  selected?: boolean;
  starred?: boolean;
  hasAttachment?: boolean;
  showStar?: boolean;
  onToggleStar?: () => void;
  onSelect?: () => void;
  href?: string;
  className?: string;
}

export const InboxViewCard = forwardRef<HTMLDivElement, InboxViewCardProps>(
  (
    {
      item,
      titleField,
      previewField,
      detailField,
      metaFields = [],
      selected = false,
      starred = false,
      hasAttachment = false,
      showStar = false,
      onToggleStar,
      onSelect,
      href,
      className,
    },
    ref,
  ) => {
    const titleValue = titleField ? getByPath(item, titleField.path) : "";
    const previewValue = previewField ? getByPath(item, previewField.path) : "";
    const detailValue = detailField ? getByPath(item, detailField.path) : "";

    const rowClass = cn(
      "flex items-start gap-3 py-4 px-[18px] border-b border-y-2 bg-background-presentation-form-base border-background-presentation-form-base cursor-pointer transition-colors hover:bg-background-presentation-action-contstyle-hover",
      selected &&
        "bg-blue-sparkle-alpha-5 border-y-2 border-y-border-presentation-state-focus",
      className,
    );

    const content: ReactNode = (
      <>
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-background-presentation-action-primary text-content-presentation-action-primary text-sm">
            {getInitials(previewValue || titleValue)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm truncate font-semibold text-content-presentation-global-primary">
              {String(previewValue ?? "")}
            </p>
            <div className="flex items-center gap-1 shrink-0">
              {hasAttachment && (
                <Paperclip className="h-3 w-3 text-content-presentation-global-tertiary" />
              )}
              {showStar && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar?.();
                  }}
                  className="hover:text-content-presentation-badge-yellow transition-colors"
                  aria-label="Toggle star"
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      starred
                        ? "fill-content-presentation-badge-yellow text-content-presentation-badge-yellow"
                        : "text-content-presentation-global-tertiary",
                    )}
                  />
                </button>
              )}
            </div>
          </div>
          <p className="text-sm mb-1 truncate font-medium text-content-presentation-global-primary">
            {String(titleValue ?? "")}
          </p>
          {detailField && detailValue != null && (
            <p className="text-xs text-content-presentation-global-secondary truncate leading-relaxed">
              {String(detailValue)}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            {metaFields.map((field) => {
              const value = getByPath(item, field.path);
              if (value == null) return null;
              return (
                <span key={field.path} className="text-xs">
                  {renderField(value, field, item)}
                </span>
              );
            })}
          </div>
        </div>
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={cn(rowClass, "no-underline text-inherit")}
        >
          {content}
        </Link>
      );
    }

    return (
      <div ref={ref} onClick={onSelect} className={rowClass}>
        {content}
      </div>
    );
  },
);

InboxViewCard.displayName = "InboxViewCard";
