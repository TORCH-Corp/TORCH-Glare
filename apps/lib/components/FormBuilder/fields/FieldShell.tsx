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
import { DisplayField } from "../DisplayField";
import { useMode, useDirection, useStepRegistry } from "../context";
import type { FieldView } from "../viewFormat";

export interface FieldShellProps {
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  hidden?: boolean;
  /** Force the field's layout direction, overriding the form's `useDirection()` context. */
  direction?: "horizontal" | "vertical" | "flexible";
  /** Edit-mode input, wired to the react-hook-form field. */
  children: (
    field: ControllerRenderProps<FieldValues, string>,
    fieldState: ControllerFieldState,
  ) => ReactNode;
  /** Read-only rendering (view mode) computed from the current value. */
  view?: (value: unknown) => FieldView;
}

/**
 * Shared wrapper for every `FormBuilder.*` field: the FieldSection row + the RHF
 * `FormField`/`FormItem`/`FormControl`/`FormMessage` scaffolding in edit mode, or
 * `DisplayField` in view mode. Also registers the field name into the enclosing
 * `FormBuilder.Step` (if any) so the stepper can validate per step.
 */
export function FieldShell({
  name,
  label,
  description,
  required,
  fullWidth,
  hidden,
  direction: directionProp,
  children,
  view,
}: FieldShellProps) {
  const form = useFormContext();
  const mode = useMode();
  const ctxDirection = useDirection();
  // A field may pin its own direction (e.g. RichText forces vertical); otherwise use the form's.
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

  if (mode === "view") {
    const value = form.getValues(name);
    const v = view ? view(value) : { value: value == null ? "" : String(value) };
    return (
      <FieldSection
        label={label}
        secondaryLabel={description}
        direction={direction}
        className={fullWidth ? "max-w-full" : undefined}
      >
        <DisplayField value={v.value} valueNode={v.valueNode} />
      </FieldSection>
    );
  }

  return (
    <FieldSection
      label={label}
      requiredLabel={required ? "(Required)" : undefined}
      secondaryLabel={description}
      direction={direction}
      className={fullWidth ? "max-w-full" : undefined}
      childrenUnderLabel={<FieldError message={fieldError} />}
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

/** Validation error, shown as a `FieldHint` alert (no tooltip); null when there's none. */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <FieldHint state="error" label={message} />;
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
