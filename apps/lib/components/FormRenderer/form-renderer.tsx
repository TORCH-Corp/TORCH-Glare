"use client";

import { Children, useId } from "react";
import { FieldValues } from "react-hook-form";

import { FormBuilder } from "../FormBuilder";
import { FormIdContext, LoadingContext } from "../FormBuilder/context";
import { StepperActions } from "../FormBuilder/stepper";
import {
  DetailSidebar,
  DetailTab,
  DetailGrid,
  DetailRow,
  DetailTabsView,
  isDetailSidebarElement,
  isDetailTabElement,
} from "./detail";
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
 *
 * Give it `FormRenderer.Sidebar` + `FormRenderer.Tab` children instead of fields and it switches to
 * a **detail-tabs** view: a display-only page (no `<form>`) whose sidebar swaps `FormBuilder.Section`
 * panels — the sidebar sits where a stepper's rail would.
 */
function FormRendererRoot<T extends FieldValues = FieldValues>({
  children,
  id,
  onSubmit,
  onInvalid,
  resolver,
  defaultValues,
  values,
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

  // Detail-tabs mode: a `FormRenderer.Sidebar` + `FormRenderer.Tab` children mean a display-only
  // detail page (no `<form>`) — the sidebar swaps Section panels via Radix Tabs. Detected here so
  // the form props below are simply unused.
  const childArray = Children.toArray(children);
  const detailSidebar = childArray.find(isDetailSidebarElement);
  const detailTabs = childArray.filter(isDetailTabElement);
  if (detailSidebar && detailTabs.length > 0) {
    return (
      <DetailTabsView
        header={header}
        actions={actions}
        sidebar={detailSidebar}
        tabs={detailTabs}
        className={className}
      />
    );
  }

  const inner = (
    <FormBuilder
      id={formId}
      form={form}
      onSubmit={onSubmit ?? (() => {})}
      onInvalid={onInvalid}
      resolver={resolver}
      defaultValues={defaultValues}
      values={values}
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
          {/* A stepper form prepends chevron Back/Next + a divider before the Submit. */}
          {actions && <StepperActions>{actions}</StepperActions>}
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
        // The drawer header sits outside the `<form>`, so re-supply the form-id and loading
        // context a bare `FormBuilder.Submit` reads (on the page it gets these from the tree).
        actions={
          actions ? (
            <LoadingContext.Provider value={!!loading}>
              <FormIdContext.Provider value={formId}>{actions}</FormIdContext.Provider>
            </LoadingContext.Provider>
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

/**
 * FormRenderer — see {@link FormRendererRoot}. The compound statics drive the display-only
 * **detail-tabs** view: `FormRenderer.Sidebar` (the rail) + `FormRenderer.Sidebar.Item` (a tab) +
 * `FormRenderer.Tab` (a `FormBuilder.Section` panel).
 */
export const FormRenderer = Object.assign(FormRendererRoot, {
  Sidebar: DetailSidebar,
  Tab: DetailTab,
  Grid: DetailGrid,
  Row: DetailRow,
});
