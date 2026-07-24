"use client";

import { Switch } from "../../Switch";
import { useLoading } from "../context";
import { formatFieldView } from "../viewFormat";
import type { SwitchBoxFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/**
 * `FormBuilder.SwitchBox` — a switch inside a `#f9f9f9` field box (design node
 * 8999:170563). Value is a `boolean`.
 *
 * Renders like any other field: the field `label` sits in the normal `FieldShell` label
 * column. The control is the box, which holds an optional inline `subLabel` (the design's
 * "Sub-Field-Header"), a vertical divider, and the switch on the right.
 */
export function SwitchBoxField({ subLabel, ...props }: SwitchBoxFieldProps) {
  const loading = useLoading();
  const hasSubLabel = subLabel != null && subLabel !== "";
  return (
    <FieldShell {...props} view={(v) => formatFieldView({ kind: "boolean", value: v })}>
      {(field) => (
        <div className="flex w-full items-center justify-end gap-[10px] rounded-[8px] bg-background-presentation-form-field-primary px-[10px] py-[6px]">
          {hasSubLabel && (
            <>
              <span className="min-w-0 flex-1 typography-headers-small-regular text-content-presentation-global-primary">
                {subLabel}
              </span>
              <div className="h-[20px] w-px shrink-0 bg-border-presentation-global-primary" />
            </>
          )}
          <Switch
            id={props.name}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={props.disabled || loading}
          />
        </div>
      )}
    </FieldShell>
  );
}
