"use client";

import { useId } from "react";
import { FieldValues } from "react-hook-form";

import { FormBuilder } from "../FormBuilder";
import { FormIdContext, LoadingContext, ModeContext } from "../FormBuilder/context";
import { FormDrawer } from "./FormDrawer";
import type { FormRendererProps } from "./types";

/**
 * FormRenderer — a thin wrapper around the compound `FormBuilder`. Author the
 * fields as JSX children; FormRenderer owns page-vs-drawer display, the absolute
 * title header, and drawer field direction.
 *
 * FormRenderer never manufactures a Submit — you compose it and hand it to `actions`
 * (`actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}`). It renders in the form's
 * header action pill (page) or the drawer header (drawer), and auto-targets this form.
 */
export function FormRenderer<T extends FieldValues = FieldValues>({
  children,
  id,
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
  className,
  actions,
  open = false,
  onOpenChange,
  title,
  badge,
  onOpenInNewTab,
}: FormRendererProps<T>) {
  const isDrawer = display === "drawer";

  // FormRenderer owns the display decision: a drawer form lays out vertically.
  const effectiveDirection = fieldDirection ?? (isDrawer ? "vertical" : undefined);
  // The absolute title header is a page concern — the drawer has its own header.
  const useHeader = !!header && !isDrawer;
  // A stable `id` lets a button OUTSIDE the form submit it via `form={id}` (the header action
  // pill / drawer header). Falls back to a generated id, provided to the Submit via context.
  const autoId = useId();
  const formId = id ?? autoId;

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
      // Page display only — in a drawer the panel owns the sizing.
      className={!isDrawer ? className : undefined}
      // Page display: FormBuilder lays the conclusion as the grid's right column (a stepper adds
      // the left nav column too). In a drawer the summary goes to FormDrawer's tray instead.
      conclusion={!isDrawer ? summary : undefined}
    >
      {useHeader && (
        <FormBuilder.Header title={header!.title} label={header!.label} variant={header!.variant}>
          {actions}
        </FormBuilder.Header>
      )}

      {children}
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
        // The drawer header sits outside the `<form>`, so re-supply the form/loading/mode context
        // a bare `FormBuilder.Submit` reads (on the page it gets these from the FormBuilder tree).
        actions={
          actions ? (
            <ModeContext.Provider value={mode}>
              <LoadingContext.Provider value={!!loading}>
                <FormIdContext.Provider value={formId}>{actions}</FormIdContext.Provider>
              </LoadingContext.Provider>
            </ModeContext.Provider>
          ) : undefined
        }
        onOpenInNewTab={onOpenInNewTab}
      >
        {inner}
      </FormDrawer>
    );
  }

  // Page display: FormBuilder already placed `summary` as the grid's conclusion column.
  return inner;
}
