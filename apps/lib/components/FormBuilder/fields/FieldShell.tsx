"use client";

import { ReactNode, useEffect } from "react";
import {
  useFormContext,
  type ControllerRenderProps,
  type ControllerFieldState,
  type FieldValues,
  type FieldPath,
} from "react-hook-form";

import { cn } from "../../../utils/cn";
import { FieldSection } from "../../../layouts/FieldSection";
import { FormField, FormItem, FormControl, FormMessage } from "../../Form";
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
  /**
   * Inline layout — the control renders its own label beside it (left-aligned),
   * with no separate left-hand label column. Used for checkbox / switch.
   */
  inline?: boolean;
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
  inline,
  children,
  view,
}: FieldShellProps) {
  const form = useFormContext();
  const mode = useMode();
  const direction = useDirection();
  const step = useStepRegistry();

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

  // Inline: the control renders its own label beside it (checkbox / switch), so
  // there's no left-hand label column — just a left-aligned row.
  if (inline) {
    return (
      <section
        className={cn("grid w-full max-w-[1200px] px-[12px] py-[16px]", fullWidth && "max-w-full")}
      >
        <FormField
          control={form.control}
          name={name as FieldPath<FieldValues>}
          render={({ field, fieldState }) => (
            <FormItem className="w-full">
              {children(field, fieldState)}
              <FormMessage />
            </FormItem>
          )}
        />
      </section>
    );
  }

  return (
    <FieldSection
      label={label}
      requiredLabel={required ? "(Required)" : undefined}
      secondaryLabel={description}
      direction={direction}
      className={fullWidth ? "max-w-full" : undefined}
    >
      <FormField
        control={form.control}
        name={name as FieldPath<FieldValues>}
        render={({ field, fieldState }) => (
          <FormItem className="w-full">
            <FormControl>
              <div className="w-full">{children(field, fieldState)}</div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FieldSection>
  );
}
