"use client";

import { Children, useId, type ReactElement, type ReactNode } from "react";
import { useForm, type Control, type FieldValues } from "react-hook-form";

import { cn } from "../../utils/cn";
import { FormBuilder } from "../FormBuilder";
import { FormIdContext, LoadingContext } from "../FormBuilder/context";
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
import { FormHeaderBar } from "./header";
import { Section } from "./section";
import {
  Back,
  Next,
  Step,
  StepSlot,
  Stepper,
  StepperActions,
  StepperContext,
  StepperNav,
  isStepElement,
  isStepperElement,
  useStepperState,
  type StepProps,
} from "./stepper";
import type { FormRendererProps } from "./types";

/**
 * FormRenderer — the chrome around a `FormBuilder`.
 *
 * `FormBuilder` is the fields and nothing else: a `<form>`, its react-hook-form context, and the
 * field components. Every pixel drawn *around* those fields is here — page-vs-drawer display, the
 * absolute title header, the `actions` bar, titled `FormRenderer.Section` cards, the page gutters,
 * the scroll shell, the wizard rail (`FormRenderer.Stepper`), and the `summary` column.
 *
 * FormRenderer never manufactures a Submit — you compose it and hand it to `actions`
 * (`actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}`). It renders in the form's header
 * action pill (page) or the drawer header (drawer), and auto-targets this form.
 *
 * Give it `FormRenderer.Sidebar` + `FormRenderer.Tab` children instead of fields and it switches to
 * a **detail-tabs** view: a display-only page (no `<form>`) whose sidebar swaps
 * `FormRenderer.Section` panels — the sidebar sits where a stepper's rail would.
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

  // The form instance is created HERE, not in FormBuilder, because the stepper needs `trigger` to
  // validate a step before advancing — and the rail that calls it renders outside the `<form>`.
  // Same pattern FormBuilder uses: one is always created (hooks can't be conditional), the
  // caller's hoisted instance wins when given.
  const ownForm = useForm<T>({ resolver, defaultValues, values });
  const formInstance = form ?? ownForm;

  const childArray = Children.toArray(children);

  // Detail-tabs mode: a `FormRenderer.Sidebar` + `FormRenderer.Tab` children mean a display-only
  // detail page (no `<form>`) — the sidebar swaps Section panels via Radix Tabs. Detected here so
  // the form props below are simply unused.
  const detailSidebar = childArray.find(isDetailSidebarElement);
  const detailTabs = childArray.filter(isDetailTabElement);

  // Split out a `FormRenderer.Stepper`: its Steps become the visibility-toggled slots inside the
  // `<form>`, its non-Step children a footer, and its state drives the rail beside them.
  const stepperEl = childArray.find(isStepperElement);
  const stepChildren = stepperEl ? Children.toArray(stepperEl.props.children) : [];
  const steps = stepChildren.filter(isStepElement) as ReactElement<StepProps>[];
  const stepExtras = stepChildren.filter((n) => !isStepElement(n));
  const isStepper = !!stepperEl;

  // Called unconditionally (inert when there are no steps) to keep hooks order stable.
  const stepper = useStepperState(
    steps,
    formInstance.trigger as Parameters<typeof useStepperState>[1],
  );

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

  // The fields the `<form>` wraps: the stepper's steps (+ any custom footer extras), or the
  // children as authored. Every step stays mounted so the whole form is registered at all times.
  const fields: ReactNode = isStepper ? (
    <>
      {steps.map((step, i) => (
        <StepSlot key={i} index={i} active={i === stepper.currentStep}>
          {step.props.children}
        </StepSlot>
      ))}
      {stepExtras}
    </>
  ) : (
    children
  );

  const formEl = (
    <FormBuilder
      id={formId}
      form={formInstance}
      onSubmit={onSubmit ?? (() => {})}
      onInvalid={onInvalid}
      loading={loading}
      fieldDirection={effectiveDirection}
      resetOnSuccess={resetOnSuccess}
    >
      {fields}
    </FormBuilder>
  );

  // The fields column caps at 1100px and centres — standalone, and as the middle column of the
  // stepper grid. This is page framing, which is why it wraps FormBuilder rather than living
  // inside it: a form embedded in a 260px rail has no room to give up 96px to gutters.
  const fieldsColumn = <div className="mx-auto w-full max-w-[1100px] px-[48px]">{formEl}</div>;

  // Inside the form surface: the stepper rail beside the fields. Columns never wrap — the
  // layout stays side-by-side at every screen size (the fields column shrinks instead).
  const bodyInner = isStepper ? (
    <div className="grid w-full grid-cols-[1fr_minmax(0,1100px)_1fr] gap-8">
      <StepperNav control={formInstance.control as Control<FieldValues>} />
      {fieldsColumn}
      {/* Empty third column — balances the rail's gutter so the middle column is centred. */}
      <div />
    </div>
  ) : (
    fieldsColumn
  );

  const surface = useHeader ? (
    // Scroll shell: the absolute header floats over the scrollable body. No fixed height — it
    // fills whatever the parent gives it (like the drawer's panel fills its tray) and the body
    // scrolls internally.
    <div className="relative isolate flex h-full w-full flex-col overflow-hidden rounded-2xl bg-background-presentation-body-primary">
      <FormHeaderBar title={header!.title} label={header!.label} variant={header!.variant}>
        {/* A stepper form prepends chevron Back/Next + a divider before the Submit. */}
        {actions && <StepperActions>{actions}</StepperActions>}
      </FormHeaderBar>
      <div className="relative z-[1] flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-6 py-6 pt-[72px] scrollbar-hide">
        {bodyInner}
      </div>
    </div>
  ) : (
    bodyInner
  );

  // The summary (right) lives OUTSIDE the scroll surface — its own panel beside it (mirroring the
  // drawer's tray, a 6px gutter). Only the surface's body scrolls; the summary stays put. In a
  // drawer it goes to FormDrawer's tray instead.
  const pageBody =
    summary && !isDrawer ? (
      <div className="flex h-full flex-row items-stretch">
        <div className="min-h-0 min-w-0 flex-1">{surface}</div>
        <div className="ml-[6px] flex min-h-0">{summary}</div>
      </div>
    ) : (
      surface
    );

  // `className` lands on the OUTERMOST element — the one a parent lays out (e.g. `flex-1 min-h-0`
  // to fill a flex column). `h-full` fills a parent that has a definite height.
  //
  // The form-id and loading contexts are supplied HERE as well as inside FormBuilder, because the
  // header's action pill renders outside the `<FormBuilder>` subtree: a bare `FormBuilder.Submit`
  // in `actions` reads the id from context to target the `<form>` by native form-association.
  // Same reason the drawer branch below re-provides them around its own header.
  const inner = (
    <LoadingContext.Provider value={!!loading}>
      <FormIdContext.Provider value={formId}>
        <div className={cn("h-full w-full", !isDrawer && className)}>{pageBody}</div>
      </FormIdContext.Provider>
    </LoadingContext.Provider>
  );

  // One provider around the whole tree: the rail renders outside the `<form>`, the step slots
  // inside it, and both read the same state.
  const tree = isStepper ? (
    <StepperContext.Provider value={stepper}>{inner}</StepperContext.Provider>
  ) : (
    inner
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
        {tree}
      </FormDrawer>
    );
  }

  return tree;
}

/**
 * FormRenderer — see {@link FormRendererRoot}. The compound statics are the form's chrome:
 *
 * - `FormRenderer.Section` — a titled card grouping fields (or display rows).
 * - `FormRenderer.Stepper` / `.Step` — the wizard; `.Back` / `.Next` are the chevron controls,
 *   which the header's action bar already prepends for you.
 * - `FormRenderer.Sidebar` / `.Tab` / `.Grid` / `.Row` — the display-only **detail-tabs** view.
 */
export const FormRenderer = Object.assign(FormRendererRoot, {
  Section,
  Stepper,
  Step,
  Back,
  Next,
  Sidebar: DetailSidebar,
  Tab: DetailTab,
  Grid: DetailGrid,
  Row: DetailRow,
});
