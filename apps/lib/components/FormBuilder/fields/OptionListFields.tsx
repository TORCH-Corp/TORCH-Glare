"use client";

import { ReactNode } from "react";

import { cn } from "../../../utils/cn";
import { Label } from "../../Label";
import { RadioGroup, Radio } from "../../Radio";
import { Checkbox } from "../../Checkbox";
import { useLoading } from "../context";
import type { OptionItem, OptionsFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/**
 * The `#f9f9f9` rounded box that holds the option rows, with a full-width divider
 * between each (design nodes 8999:170512 / 8999:170546).
 */
function OptionBox({ children }: { children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col rounded-[8px] px-[10px]",
        "bg-background-presentation-form-field-primary",
        "divide-y divide-border-presentation-global-primary",
      )}
    >
      {children}
    </div>
  );
}

/**
 * One option row: control on the **left**, then the primary label and an optional
 * secondary label. Uses the `Label` component so the row is a real `<label>` — the
 * whole row is clickable and toggles the control (same mechanism as `LabeledCheckBox`
 * / `LabeledRadio`). `w-full` makes the entire row width tappable; `reverseChildren`
 * puts the control first (left) and `justify-end` keeps the content left-packed.
 */
function OptionRow({
  control,
  label,
  description,
}: {
  control: ReactNode;
  label?: string;
  description?: string;
}) {
  return (
    <Label
      label={label}
      secondaryLabel={description}
      labelDirections="horizontal"
      childrenDirections="horizontal"
      reverseChildren
      className="w-full cursor-pointer justify-end gap-[6px] py-[8px]"
    >
      {control}
    </Label>
  );
}

/**
 * `FormBuilder.RadioList` — single-select options (`string`) as a boxed, divided list
 * (design nodes 8999:170512). Uses the Radix `RadioGroup` for roving-focus / arrow-key nav.
 */
export function RadioListField(props: OptionsFieldProps) {
  const loading = useLoading();
  return (
    <FieldShell {...props}>
      {(field) => (
        <RadioGroup value={field.value ?? ""} onValueChange={field.onChange} className="w-full">
          <OptionBox>
            {props.options.map((opt: OptionItem) => (
              <OptionRow
                key={opt.value}
                label={opt.label}
                description={opt.description}
                control={
                  <Radio
                    id={`${props.name}-${opt.value}`}
                    value={opt.value}
                    size="S"
                    disabled={props.disabled || loading}
                  />
                }
              />
            ))}
          </OptionBox>
        </RadioGroup>
      )}
    </FieldShell>
  );
}

/**
 * `FormBuilder.CheckboxGroup` — multi-select options as a boxed, divided list (design
 * node 8999:170546). Value is a `string[]` of the selected option values.
 */
export function CheckboxGroupField(props: OptionsFieldProps) {
  const loading = useLoading();
  return (
    <FieldShell {...props}>
      {(field) => {
        const selected: string[] = Array.isArray(field.value) ? field.value : [];
        const toggle = (value: string, checked: boolean) => {
          field.onChange(checked ? [...selected, value] : selected.filter((v) => v !== value));
        };
        return (
          <div role="group" aria-label={typeof props.label === "string" ? props.label : undefined}>
            <OptionBox>
              {props.options.map((opt: OptionItem) => (
                <OptionRow
                  key={opt.value}
                  label={opt.label}
                  description={opt.description}
                  control={
                    <Checkbox
                      id={`${props.name}-${opt.value}`}
                      size="S"
                      checked={selected.includes(opt.value)}
                      onCheckedChange={(checked) => toggle(opt.value, checked === true)}
                      disabled={props.disabled || loading}
                    />
                  }
                />
              ))}
            </OptionBox>
          </div>
        );
      }}
    </FieldShell>
  );
}
