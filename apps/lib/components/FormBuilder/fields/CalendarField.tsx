"use client";

import { Calendar } from "../../Calendar";
import { formatFieldView } from "../viewFormat";
import type { CalendarFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/** `FormBuilder.InlineCalendar` — an always-visible calendar (Glare `Calendar`). */
export function CalendarField(props: CalendarFieldProps) {
  return (
    <FieldShell {...props} view={(v) => formatFieldView({ kind: "date", value: v })}>
      {(field) => (
        <Calendar
          mode="single"
          selected={field.value as Date | undefined}
          onSelect={(d: Date | undefined) => field.onChange(d)}
        />
      )}
    </FieldShell>
  );
}
