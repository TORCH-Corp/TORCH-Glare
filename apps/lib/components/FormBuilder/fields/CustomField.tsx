"use client";

import type { CustomFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/** `FormBuilder.Custom` — render any control, keeping the FieldSection + validation wiring. */
export function CustomField(props: CustomFieldProps) {
  return (
    <FieldShell
      {...props}
      view={(v) => ({ valueNode: props.formatView ? props.formatView(v) : String(v ?? "—") })}
    >
      {(field, fieldState) => props.render({ field, fieldState })}
    </FieldShell>
  );
}
