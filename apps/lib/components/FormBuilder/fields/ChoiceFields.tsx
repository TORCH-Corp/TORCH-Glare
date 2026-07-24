"use client";

import { LabeledCheckBox } from "../../LabeledCheckBox";
import { RadioGroup } from "../../Radio";
import { RadioCard } from "../../RadioCard";
import { useLoading } from "../context";
import { formatFieldView } from "../viewFormat";
import type { CheckboxFieldProps, RadioCardsFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/**
 * `FormBuilder.Checkbox` — a single boolean checkbox. The field `label` sits in the
 * normal label column; an optional `subLabel` renders inline beside the checkbox (via
 * the clickable `LabeledCheckBox`).
 */
export function CheckboxField({ subLabel, ...props }: CheckboxFieldProps) {
  const loading = useLoading();
  return (
    <FieldShell {...props} view={(v) => formatFieldView({ kind: "boolean", value: v })}>
      {(field) => (
        <div className="flex w-full items-center ps-2.5">
          <LabeledCheckBox
            id={props.name}
            label={subLabel ?? ""}
            checked={!!field.value}
            size="S"
            onCheckedChange={(checked) => field.onChange(checked === true)}
            disabled={props.disabled || loading}
          />
        </div>
      )}
    </FieldShell>
  );
}

/** `FormBuilder.RadioCards` — radio options rendered as cards (Glare `RadioCard`). */
export function RadioCardsField(props: RadioCardsFieldProps) {
  const loading = useLoading();
  const options = props.options.map((o) => ({
    label: typeof o.label === "string" ? o.label : String(o.value),
    value: o.value,
  }));
  return (
    <FieldShell {...props} view={(v) => formatFieldView({ kind: "option", value: v, options })}>
      {(field) => (
        <RadioGroup
          value={field.value ?? ""}
          onValueChange={field.onChange}
          className="grid w-full grid-cols-2 gap-3"
        >
          {props.options.map((opt) => (
            <RadioCard
              key={opt.value}
              id={`${props.name}-${opt.value}`}
              value={opt.value}
              headerLabel={opt.label}
              description={opt.description}
              disabled={opt.disabled || props.disabled || loading}
            />
          ))}
        </RadioGroup>
      )}
    </FieldShell>
  );
}
