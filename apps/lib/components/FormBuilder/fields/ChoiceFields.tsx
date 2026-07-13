"use client";

import { Switch } from "../../Switch";
import { LabeledCheckBox } from "../../LabeledCheckBox";
import { RadioGroup } from "../../Radio";
import { LabeledRadio } from "../../LabeledRadio";
import { TabSwitch } from "../../TabSwitch";
import { ButtonGroup, ButtonGroupItem } from "../../ButtonGroup";
import { RadioCard } from "../../RadioCard";
import { ToggleButton } from "../../ToggleButton";
import { useLoading } from "../context";
import { formatFieldView } from "../viewFormat";
import type {
  BaseFieldProps,
  OptionsFieldProps,
  SegmentedFieldProps,
  ToggleGroupFieldProps,
  RadioCardsFieldProps,
  ToggleButtonFieldProps,
} from "../types";
import { FieldShell } from "./FieldShell";

/** `FormBuilder.ToggleButton` — a pressed/unpressed button (Glare `ToggleButton`). */
export function ToggleButtonField(props: ToggleButtonFieldProps) {
  const loading = useLoading();
  return (
    <FieldShell {...props} inline view={(v) => formatFieldView({ kind: "boolean", value: v })}>
      {(field) => (
        <ToggleButton
          pressed={!!field.value}
          onPressedChange={(pressed: boolean) => field.onChange(pressed)}
          disabled={props.disabled || loading}
        >
          {props.label}
        </ToggleButton>
      )}
    </FieldShell>
  );
}

export function SwitchField(props: BaseFieldProps) {
  const loading = useLoading();
  return (
    <FieldShell {...props} inline view={(v) => formatFieldView({ kind: "boolean", value: v })}>
      {(field) => (
        <div className="flex w-fit items-center gap-2">
          <Switch
            id={props.name}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={props.disabled || loading}
          />
          {props.label != null && (
            <label
              htmlFor={props.name}
              className="cursor-pointer typography-body-medium-regular text-content-presentation-action-light-primary"
            >
              {props.label}
              {props.required && (
                <span className="ml-1 typography-body-small-medium text-content-presentation-state-negative">
                  (Required)
                </span>
              )}
            </label>
          )}
        </div>
      )}
    </FieldShell>
  );
}

export function CheckboxField(props: BaseFieldProps) {
  const loading = useLoading();
  return (
    <FieldShell {...props} inline view={(v) => formatFieldView({ kind: "boolean", value: v })}>
      {(field) => (
        <LabeledCheckBox
          id={props.name}
          label={typeof props.label === "string" ? props.label : ""}
          requiredLabel={props.required ? "(Required)" : undefined}
          checked={!!field.value}
          onCheckedChange={field.onChange}
          disabled={props.disabled || loading}
        />
      )}
    </FieldShell>
  );
}

export function RadioField(props: OptionsFieldProps) {
  const loading = useLoading();
  return (
    <FieldShell
      {...props}
      view={(v) => formatFieldView({ kind: "option", value: v, options: props.options })}
    >
      {(field) => (
        <RadioGroup
          value={field.value ?? ""}
          onValueChange={field.onChange}
          className="flex flex-col gap-2"
        >
          {props.options.map((opt) => (
            <LabeledRadio
              key={opt.value}
              id={`${props.name}-${opt.value}`}
              value={opt.value}
              label={opt.label}
              disabled={props.disabled || loading}
            />
          ))}
        </RadioGroup>
      )}
    </FieldShell>
  );
}

/** `FormBuilder.Segmented` — single-select segmented control (Glare `TabSwitch`). */
export function SegmentedField(props: SegmentedFieldProps) {
  const loading = useLoading();
  return (
    <FieldShell
      {...props}
      view={(v) => formatFieldView({ kind: "option", value: v, options: props.options })}
    >
      {(field) => (
        <TabSwitch
          options={props.options.map((o) => ({ value: o.value, label: o.label, icon: o.icon }))}
          value={field.value ?? ""}
          onValueChange={field.onChange}
          disabled={props.disabled || loading}
        />
      )}
    </FieldShell>
  );
}

/** `FormBuilder.ToggleGroup` — single or multi toggle group (Glare `ButtonGroup`). */
export function ToggleGroupField(props: ToggleGroupFieldProps) {
  return (
    <FieldShell
      {...props}
      view={(v) =>
        formatFieldView({ kind: props.multiple ? "multi" : "option", value: v, options: props.options })
      }
    >
      {(field) => {
        const items = props.options.map((o) => (
          <ButtonGroupItem key={o.value} value={o.value}>
            {o.icon}
            {o.label}
          </ButtonGroupItem>
        ));
        return props.multiple ? (
          <ButtonGroup
            type="multiple"
            value={Array.isArray(field.value) ? field.value : []}
            onValueChange={field.onChange}
          >
            {items}
          </ButtonGroup>
        ) : (
          <ButtonGroup type="single" value={field.value ?? ""} onValueChange={field.onChange}>
            {items}
          </ButtonGroup>
        );
      }}
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
