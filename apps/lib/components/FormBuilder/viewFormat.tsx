import { ReactNode } from "react";
import type { OutputData } from "@editorjs/editorjs";

import { Badge } from "../Badge";
import { RichTextField } from "../TextEditor/RichTextField";
import { formatNumber } from "./numberFormat";

/** A read-only value for `DisplayField`: a plain string, or a rich node. */
export interface FieldView {
  value?: string;
  valueNode?: ReactNode;
}

export interface OptionItem {
  label: string;
  value: string;
  icon?: ReactNode;
}

/** The read-only "kind" a field formats as (a superset grouping of field types). */
export type ViewKind =
  | "text"
  | "number"
  | "currency"
  | "option"
  | "boolean"
  | "date"
  | "daterange"
  | "dates"
  | "multi"
  | "richtext"
  | "file";

export interface ViewFormatOptions {
  kind: ViewKind;
  value: unknown;
  options?: OptionItem[];
  currencySymbol?: ReactNode;
}

function optionLabel(options: OptionItem[] | undefined, value: unknown): string {
  const found = options?.find((o) => o.value === value);
  return found ? found.label : value == null ? "" : String(value);
}

function formatDate(value: unknown): string {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return "";
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const d = String(value.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

function multiLabels(options: OptionItem[] | undefined, value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => {
    if (v != null && typeof v === "object") {
      const o = v as { name?: string; label?: string; value?: string };
      return o.name ?? o.label ?? optionLabel(options, o.value);
    }
    return optionLabel(options, v);
  });
}

/** Formats a field value as read-only content for `mode: "view"`. */
export function formatFieldView({
  kind,
  value,
  options,
  currencySymbol,
}: ViewFormatOptions): FieldView {
  switch (kind) {
    case "number":
      return { value: formatNumber(value) };

    case "currency":
      return {
        value:
          value == null || value === ""
            ? ""
            : `${currencySymbol ? `${currencySymbol} ` : ""}${formatNumber(value)}`,
      };

    case "option":
      return { value: optionLabel(options, value) };

    case "boolean":
      return {
        valueNode: <Badge size="S" color={value ? "green" : "gray"} label={value ? "Yes" : "No"} />,
      };

    case "date":
      return { value: formatDate(value) };

    case "daterange": {
      const r = value as { from?: unknown; to?: unknown } | null | undefined;
      if (!r || (!r.from && !r.to)) return { value: "" };
      return { value: `${formatDate(r.from)} – ${formatDate(r.to)}` };
    }

    case "dates": {
      const arr = Array.isArray(value) ? value : [];
      return { value: arr.map(formatDate).filter(Boolean).join(", ") };
    }

    case "multi": {
      const labels = multiLabels(options, value);
      if (labels.length === 0) return { value: "" };
      return {
        valueNode: (
          <div className="flex flex-wrap gap-1">
            {labels.map((label, i) => (
              <Badge key={`${label}-${i}`} size="S" color="ocean" label={label} />
            ))}
          </div>
        ),
      };
    }

    case "richtext":
      if (!value) return { value: "" };
      return { valueNode: <RichTextField readOnly data={value as OutputData} /> };

    case "file": {
      const files = Array.isArray(value) ? value : value ? [value] : [];
      if (files.length === 0) return { value: "" };
      const names = files.map((f) =>
        f instanceof File ? f.name : typeof f === "string" ? f : "file",
      );
      return { value: names.join(", ") };
    }

    case "text":
    default:
      return { value: value == null ? "" : String(value) };
  }
}
