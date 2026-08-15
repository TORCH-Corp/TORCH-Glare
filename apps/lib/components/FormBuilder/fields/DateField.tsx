"use client";

import { DatePicker } from "../../DatePicker";
import { useOnTable } from "../context";
import type { DateFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/**
 * `FormBuilder.Date` (single) — and, via `mode`/`timePicker`, the presets
 * `.DateRange` (value `{from,to}`), `.DateMultiple` (value `Date[]`), and
 * `.DateTime` (date + time). All back onto the one Glare `DatePicker`.
 */
export function DateField(props: DateFieldProps) {
  const onTable = useOnTable();

  return (
    <FieldShell {...props}>
      {(field) => (
        <DatePicker
          mode={props.mode ?? "single"}
          timePicker={props.timePicker}
          dateFormat={props.dateFormat}
          value={field.value}
          onTable={onTable}
          onChange={(e) =>
            field.onChange((e as unknown as { target: { value: unknown } }).target.value)
          }
        />
      )}
    </FieldShell>
  );
}
