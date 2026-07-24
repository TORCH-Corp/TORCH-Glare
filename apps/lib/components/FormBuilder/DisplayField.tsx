import { ReactNode } from "react";

import { cn } from "../../utils/cn";

export interface DisplayFieldProps {
  label?: ReactNode;
  /** Plain string value — falls back to an em-dash when empty. */
  value?: string | null;
  /** Rich value (badges, chips, formatted nodes) — takes precedence over `value`. */
  valueNode?: ReactNode;
  className?: string;
}

/**
 * Read-only field: a label above its value. Used by FormBuilder's `mode: "view"`
 * so the same config renders as a detail view. Mirrors the products-services
 * `DisplayField` (label + value/valueNode, em-dash fallback).
 */
export function DisplayField({ label, value, valueNode, className }: DisplayFieldProps) {
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label != null && (
        <p className="typography-body-small-regular text-content-presentation-global-secondary">
          {label}
        </p>
      )}
      {valueNode != null ? (
        <div className="typography-body-medium-medium text-content-presentation-global-primary">
          {valueNode}
        </div>
      ) : (
        <span className="typography-body-medium-medium text-content-presentation-global-primary">
          {value != null && value !== "" ? value : "—"}
        </span>
      )}
    </div>
  );
}

DisplayField.displayName = "DisplayField";
