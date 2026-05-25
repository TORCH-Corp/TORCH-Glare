"use client";

import { forwardRef, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "../../utils/cn";
import { Divider } from "../Divider";
import { getByPath } from "../../utils/dataViews/pathUtils";
import { renderField } from "./fieldRenderers";
import type { DynamicRecord, FieldConfig } from "./types";

export interface InboxViewCardProps {
  item: DynamicRecord;
  rowFields?: FieldConfig[];
  titleField?: FieldConfig;
  previewField?: FieldConfig;
  detailField?: FieldConfig;
  metaFields?: FieldConfig[];
  dateField?: FieldConfig;
  dateLabel?: string;
  selected?: boolean;
  onSelect?: () => void;
  href?: string;
  className?: string;
}

function pickRowFields(props: InboxViewCardProps): FieldConfig[] {
  if (props.rowFields && props.rowFields.length) return props.rowFields;
  const collected: FieldConfig[] = [];
  if (props.previewField) collected.push(props.previewField);
  if (props.titleField && props.titleField.path !== props.previewField?.path) {
    collected.push(props.titleField);
  }
  if (props.detailField) collected.push(props.detailField);
  if (props.metaFields?.length) collected.push(...props.metaFields);
  return collected;
}

function pickDateField(
  rowFields: FieldConfig[],
  explicit?: FieldConfig,
): FieldConfig | undefined {
  if (explicit) return explicit;
  return rowFields.find((f) => f.type === "date");
}

export const InboxViewCard = forwardRef<HTMLDivElement, InboxViewCardProps>(
  (props, ref) => {
    const { item, selected = false, onSelect, href, className } = props;
    const allRowFields = pickRowFields(props);
    const dateField = pickDateField(allRowFields, props.dateField);
    const rowFields = dateField
      ? allRowFields.filter((f) => f.path !== dateField.path)
      : allRowFields;
    const dateLabel = props.dateLabel ?? "Created at:";

    const cardClass = cn(
      "flex flex-col gap-2 p-3 cursor-pointer transition-colors",
      "bg-background-presentation-form-base",
      "border-y-2 border-transparent",
      !selected &&
        "hover:bg-[image:linear-gradient(0deg,rgba(151,72,255,0.05)_0%,rgba(151,72,255,0.05)_100%)] hover:border-y-[#AE71FF]",
      selected &&
        "bg-[image:linear-gradient(0deg,rgba(0,117,255,0.05)_0%,rgba(0,117,255,0.05)_100%)] border-y-border-presentation-state-focus",
      className,
    );

    const content: ReactNode = (
      <>
        <div className="flex flex-col gap-1 w-full">
          {rowFields.map((field, idx) => {
            const value = getByPath(item, field.path);
            return (
              <div key={field.path ?? idx} className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="w-[100px] shrink-0 typography-body-large-semibold text-content-presentation-global-secondary">
                    {field.label ?? field.path}:
                  </span>
                  <span className="h-full py-0.5 flex items-center">
                    <span className="block h-full w-px bg-black-alpha-15" />
                  </span>
                  <span className="flex-1 min-w-0 truncate typography-body-large-medium text-content-presentation-global-primary">
                    {renderField(value, field, item)}
                  </span>
                </div>
                {idx < rowFields.length - 1 && <Divider className="mt-1" />}
              </div>
            );
          })}
        </div>

        {dateField && (
          <div className="flex items-center justify-end">
            <div className="inline-flex items-center gap-0.5 p-0.5 rounded-md bg-black-alpha-10">
              <div className="px-1 rounded-sm">
                <span className="typography-labels-medium-semibold text-content-presentation-global-primary">
                  {dateLabel}
                </span>
              </div>
              <div className="px-1 rounded-sm bg-black-alpha-075">
                <span className="typography-labels-medium-semibold text-content-presentation-global-primary">
                  {renderField(getByPath(item, dateField.path), dateField, item)}
                </span>
              </div>
            </div>
          </div>
        )}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={cn(cardClass, "no-underline text-inherit")}
        >
          {content}
        </Link>
      );
    }

    return (
      <div ref={ref} onClick={onSelect} className={cardClass}>
        {content}
      </div>
    );
  },
);

InboxViewCard.displayName = "InboxViewCard";
