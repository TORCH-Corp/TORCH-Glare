"use client";

import { Children, isValidElement, useId } from "react";
import { FieldValues } from "react-hook-form";

import { FormBuilder } from "../FormBuilder";
import { Button } from "../Button";
import { FormDrawer } from "./FormDrawer";
import type { FormRendererProps } from "./types";

/** True when a `FormBuilder.Stepper` is a direct child (it renders its own Submit). */
function hasStepper(children: React.ReactNode): boolean {
  return Children.toArray(children).some(
    (child) => isValidElement(child) && child.type === FormBuilder.Stepper,
  );
}

/**
 * FormRenderer — a thin wrapper around the compound `FormBuilder`. Author the
 * fields as JSX children; FormRenderer owns page-vs-drawer display, the absolute
 * title header, drawer field direction, and Submit placement.
 */
export function FormRenderer<T extends FieldValues = FieldValues>({
  children,
  onSubmit,
  onInvalid,
  resolver,
  defaultValues,
  values,
  mode = "edit",
  loading,
  resetOnSuccess,
  fieldDirection,
  form,
  display = "page",
  header,
  summary,
  submitLabel = "Save",
  open = false,
  onOpenChange,
  title,
  badge,
  onOpenInNewTab,
}: FormRendererProps<T>) {
  const isView = mode === "view";
  const isDrawer = display === "drawer";
  const isStepper = hasStepper(children) && !isView;

  // FormRenderer owns the display decision: a drawer form lays out vertically.
  const effectiveDirection = fieldDirection ?? (isDrawer ? "vertical" : undefined);
  // The absolute title header is a page concern — the drawer has its own header.
  const useHeader = !!header && !isDrawer;
  // In a drawer, the Save action sits in the drawer header (outside the form),
  // submitting via the `form={formId}` association.
  const formId = useId();
  const drawerSubmitInHeader = isDrawer && !isStepper && !isView;

  const inner = (
    <FormBuilder
      id={formId}
      form={form}
      onSubmit={onSubmit}
      onInvalid={onInvalid}
      resolver={resolver}
      defaultValues={defaultValues}
      values={values}
      mode={mode}
      loading={loading}
      fieldDirection={effectiveDirection}
      resetOnSuccess={resetOnSuccess}
    >
      {useHeader && (
        <FormBuilder.Header title={header!.title} label={header!.label} variant={header!.variant}>
          {!isStepper && !isView && <FormBuilder.Submit>{submitLabel}</FormBuilder.Submit>}
        </FormBuilder.Header>
      )}

      {children}

      {/* The stepper renders its own Submit on the last step; the drawer puts it in
          the drawer header; a page with a header puts it in the action bar. */}
      {!isStepper && !isView && !useHeader && !isDrawer && (
        <div className="flex justify-end">
          <FormBuilder.Submit>{submitLabel}</FormBuilder.Submit>
        </div>
      )}
    </FormBuilder>
  );

  if (isDrawer) {
    return (
      <FormDrawer
        open={open}
        onOpenChange={onOpenChange ?? (() => {})}
        title={title ?? header?.title}
        badge={badge ?? header?.label}
        variant={header?.variant}
        summary={summary}
        actions={
          drawerSubmitInHeader ? (
            <Button type="submit" form={formId} variant="PrimeStyle" is_loading={loading}>
              {submitLabel}
            </Button>
          ) : undefined
        }
        onOpenInNewTab={onOpenInNewTab}
      >
        {inner}
      </FormDrawer>
    );
  }

  // Page display: a `summary` panel (e.g. FormSummary) sits beside the form column.
  if (summary) {
    return (
      <div className="flex flex-col gap-[16px] lg:flex-row">
        <div className="min-w-0 flex-1">{inner}</div>
        {summary}
      </div>
    );
  }

  return inner;
}
