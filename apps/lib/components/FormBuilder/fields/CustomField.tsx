"use client";

import type { CustomFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/** `FormBuilder.Custom` — render any control, keeping the FieldSection + validation wiring. */
export function CustomField(props: CustomFieldProps) {
  return (
    <FieldShell {...props}>{(field, fieldState) => props.render({ field, fieldState })}</FieldShell>
  );
}
