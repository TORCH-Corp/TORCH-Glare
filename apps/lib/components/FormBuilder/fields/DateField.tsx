"use client";

import { DatePicker } from "../../DatePicker";
import { useCell } from "../context";
import { formatFieldView } from "../viewFormat";
import type { DateFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/**
 * `FormBuilder.Date` (single) — and, via `mode`/`timePicker`, the presets
 * `.DateRange` (value `{from,to}`), `.DateMultiple` (value `Date[]`), and
 * `.DateTime` (date + time). All back onto the one Glare `DatePicker`.
 */
export function DateField(props: DateFieldProps) {
  const kind = props.mode === "range" ? "daterange" : props.mode === "multiple" ? "dates" : "date";
  const cell = useCell();

  return (
    <FieldShell {...props} view={(v) => formatFieldView({ kind, value: v })}>
      {(field) => (
        <DatePicker
          mode={props.mode ?? "single"}
          timePicker={props.timePicker}
          dateFormat={props.dateFormat}
          value={field.value}
          onTable={cell}
          onChange={(e) =>
            field.onChange((e as unknown as { target: { value: unknown } }).target.value)
          }
        />
      )}
    </FieldShell>
  );
}
