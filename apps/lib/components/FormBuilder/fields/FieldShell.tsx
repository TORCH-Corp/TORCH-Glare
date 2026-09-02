"use client";

import { ReactNode, useEffect } from "react";
import {
  useFormContext,
  useFormState,
  type ControllerRenderProps,
  type ControllerFieldState,
  type FieldErrors,
  type FieldValues,
  type FieldPath,
} from "react-hook-form";

import { FieldSection } from "../../../layouts/FieldSection";
import { FormField, FormItem, FormControl } from "../../Form";
import { FieldHint } from "../../FieldHint";
import { Tooltip } from "../../Tooltip";
import { useDirection, useStepRegistry, useBare } from "../context";
import type { FieldHintSpec } from "../types";

export interface FieldShellProps {
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  hidden?: boolean;
  /** Force the field's layout direction, overriding the form's `useDirection()` context. */
  direction?: "horizontal" | "vertical" | "flexible";
  /** Alerts stacked under the validation error. See `FieldHintSpec`. */
  hints?: FieldHintSpec[];
  /** The input, wired to the react-hook-form field. */
  children: (
    field: ControllerRenderProps<FieldValues, string>,
    fieldState: ControllerFieldState,
  ) => ReactNode;
}

/**
 * Shared wrapper for every `FormBuilder.*` field: the FieldSection row + the RHF
 * `FormField`/`FormItem`/`FormControl`/`FormMessage` scaffolding. Also registers the
 * field name into the enclosing `FormRenderer.Step` (if any) so the stepper can
 * validate per step.
 */
export function FieldShell({
  name,
  label,
  description,
  required,
  fullWidth,
  hidden,
  direction: directionProp,
  hints,
  children,
}: FieldShellProps) {
  const form = useFormContext();
  const bare = useBare();
  const ctxDirection = useDirection();
  // A field may pin its own direction (e.g. RichText forces vertical), else the form's. When
  // neither is set this stays `undefined` — FieldSection then falls back to its responsive
  // `flexible` layout rather than a fixed two-column one.
  const direction = directionProp ?? ctxDirection;
  const step = useStepRegistry();

  // Read this field's error at the shell level (not inside the FormField render) so
  // the FieldHint can go in FieldSection's `childrenUnderLabel` — under the label.
  // Subscribe to the whole `errors` object and resolve the field's path ourselves:
  // `getFieldState(name)` misses controls that register late (DatePicker, RichText),
  // whereas the errors object always carries every failing key from the resolver.
  const { errors } = useFormState({ control: form.control });
  const fieldError = resolveFieldError(errors, name);

  useEffect(() => {
    if (!step) return;
    step.register(name);
    return () => step.unregister(name);
  }, [step, name]);

  if (hidden) return null;

  // Chrome-less mode — a `FormBuilder.Table` cell (`"table"`) or a panel field (`"bare"`).
  // Render just the control: no FieldSection label/row, and errors surface as a tooltip on the
  // control rather than a stacked FieldHint, so a row stays one line tall. Step registration
  // above still applies. The control's border treatment is the caller's call, via `useOnTable`.
  if (bare) {
    return (
      <FormField
        control={form.control}
        name={name as FieldPath<FieldValues>}
        render={({ field, fieldState }) => (
          <FormItem className="w-full">
            <FormControl>
              <Tooltip
                open={Boolean(fieldError)}
                text={fieldError ?? ""}
                toolTipSide="top"
                variant="highlight"
              >
                <div className="w-full">{children(field, fieldState)}</div>
              </Tooltip>
            </FormControl>
          </FormItem>
        )}
      />
    );
  }

  return (
    <FieldSection
      label={label}
      requiredLabel={required ? "(Required)" : undefined}
      secondaryLabel={description}
      direction={direction}
      className={fullWidth ? "max-w-full" : undefined}
      childrenUnderLabel={<FieldMessages message={fieldError} hints={hints} />}
    >
      <FormField
        control={form.control}
        name={name as FieldPath<FieldValues>}
        render={({ field, fieldState }) => (
          <FormItem className="w-full">
            <FormControl>
              <div className="w-full">{children(field, fieldState)}</div>
            </FormControl>
          </FormItem>
        )}
      />
    </FieldSection>
  );
}

/**
 * The stack under a field: the validation error first (it is the actionable one), then any author
 * `hints` in order. Renders nothing when there is neither, so a field without hints is unchanged.
 */
function FieldMessages({ message, hints }: { message?: string; hints?: FieldHintSpec[] }) {
  if (!message && !hints?.length) return null;
  return (
    <div className="flex flex-col items-start gap-[4px]">
      {message && <FieldHint state="error" label={message} />}
      {hints?.map((hint, i) => (
        <FieldHint key={i} state={hint.state ?? "info"} label={hint.label} icon={hint.icon} />
      ))}
    </div>
  );
}

/**
 * Resolve a field's error message from the RHF `errors` tree by its dotted `name`
 * (handles nested field-array paths like `contacts.0.email`). Reading the errors
 * object directly is more reliable than `getFieldState` for controls that register
 * late (DatePicker, RichText), whose hints were otherwise missing.
 */
function resolveFieldError(errors: FieldErrors, name: string): string | undefined {
  const node = name
    .split(".")
    .reduce<unknown>(
      (acc, key) => (acc == null ? undefined : (acc as Record<string, unknown>)[key]),
      errors,
    );
  const message = (node as { message?: unknown } | undefined)?.message;
  return typeof message === "string" ? message : undefined;
}
