"use client";

import * as React from "react";
import { ReactNode } from "react";
import { useForm, type FieldValues } from "react-hook-form";

import { cn } from "../../utils/cn";
import { Form } from "../Form";
import { SectionBlock, type SectionColor } from "../SectionBlock";
import { LoadingContext, ModeContext, DirectionContext, StepperContext } from "./context";
import { Header } from "./header";
import type { FormBuilderRootProps } from "./types";
import {
  TextField,
  EmailField,
  PasswordField,
  NumberField,
  CurrencyField,
  TextareaField,
  SelectField,
  MultiSelectField,
  CheckboxField,
  RadioCardsField,
  RadioListField,
  CheckboxGroupField,
  SwitchBoxField,
  DateField,
  OtpField,
  TreeSelectField,
  SliderField,
  ColorField,
  SignatureField,
  PhoneField,
  FieldArray,
  FileField,
  RichTextField,
  CustomField,
} from "./fields";
import {
  Stepper,
  Step,
  Back,
  Next,
  StepperNav,
  StepSlot,
  StepFooter,
  useStepperState,
  isStepElement,
  isStepperElement,
} from "./stepper";
import { SubmitButton } from "./submit";

// ─── Section ─────────────────────────────────────────────────────────────────

export interface SectionProps {
  title?: ReactNode;
  color?: SectionColor;
  icon?: ReactNode;
  children: ReactNode;
}

/** `FormBuilder.Section` — a titled Glare SectionBlock grouping fields. */
function Section({ title, color, icon, children }: SectionProps) {
  return (
    <SectionBlock title={title} color={color} icon={icon}>
      {children}
    </SectionBlock>
  );
}

function isHeaderElement(node: React.ReactNode): node is React.ReactElement {
  return (
    React.isValidElement(node) &&
    (node.type as { __isFormHeader?: boolean })?.__isFormHeader === true
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

function FormBuilderRoot<T extends FieldValues = FieldValues>({
  children,
  id,
  form: formProp,
  onSubmit,
  onInvalid,
  resolver,
  defaultValues,
  values,
  loading = false,
  mode = "edit",
  fieldDirection,
  resetOnSuccess,
  conclusion,
  className,
}: FormBuilderRootProps<T>) {
  // Hooks can't be conditional, so always create one; `formProp` wins when given
  // (the caller hoisted `useForm` to share values with something outside the form).
  const ownForm = useForm<T>({ resolver, defaultValues, values });
  const form = formProp ?? ownForm;
  // Don't force a direction — left undefined, FieldSection uses its responsive `flexible`
  // layout (stacked on small screens, two-column at `lg`). Only a caller-set `fieldDirection`
  // (e.g. vertical inside a drawer) pins it.
  const direction = fieldDirection;

  const handleValid = async (v: T) => {
    await onSubmit(v);
    if (resetOnSuccess) form.reset();
  };

  // Split out a FormBuilder.Header (renders absolutely) and detect a Stepper child.
  const childArray = React.Children.toArray(children);
  const header = childArray.find(isHeaderElement);
  const rest = childArray.filter((n) => !isHeaderElement(n));

  const isView = mode === "view";
  const stepperEl = rest.find(isStepperElement);
  const stepChildren = stepperEl ? React.Children.toArray(stepperEl.props.children) : [];
  const steps = stepChildren.filter(isStepElement);
  const stepExtras = stepChildren.filter((n) => !isStepElement(n));
  const isStepper = !!stepperEl && !isView;

  // Stepper state is lifted HERE so the nav can live in its own grid column, outside the
  // `<form>`. Called unconditionally (inert when there are no steps) to keep hooks order stable.
  const stepper = useStepperState(steps, form.trigger as Parameters<typeof useStepperState>[1]);

  // The stepper nav is its own column beside the fields, inside the form surface.
  const nav = isStepper ? <StepperNav /> : null;

  // The fields the `<form>` wraps: the stepper's steps (+ footer), or the plain children.
  const fields = isStepper ? (
    <>
      {steps.map((step, i) => (
        <StepSlot key={i} index={i} active={i === stepper.currentStep}>
          {step.props.children}
        </StepSlot>
      ))}
      {stepExtras.length > 0 ? stepExtras : <StepFooter />}
    </>
  ) : (
    rest
  );

  // The fields column caps at 1200px and centers — as the middle column of the grid, and
  // standalone.
  const fieldsInner = (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-4">{fields}</div>
  );

  const formEl = isView ? (
    <div className="w-full min-w-0">{fieldsInner}</div>
  ) : (
    <form id={id} className="w-full min-w-0" onSubmit={form.handleSubmit(handleValid, onInvalid)}>
      {fieldsInner}
    </form>
  );

  // Inside the form surface: the stepper rail beside the fields. Columns never wrap — the
  // layout stays side-by-side at every screen size (the fields column shrinks instead).
  const bodyInner = nav ? (
    <div className="grid w-full grid-cols-[auto_minmax(0,1fr)] gap-8">
      {nav}
      {formEl}
    </div>
  ) : (
    formEl
  );

  const surface = header ? (
    // Scroll shell: the absolute header floats over the scrollable body. No fixed height — it
    // fills whatever the parent gives it (like the drawer's panel fills its tray) and the body
    // scrolls internally.
    <div className="relative isolate flex h-full w-full flex-col overflow-hidden rounded-2xl bg-background-presentation-body-primary">
      {header}
      <div className="relative z-[1] flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-6 py-6 pt-[72px] scrollbar-hide">
        {bodyInner}
      </div>
    </div>
  ) : (
    bodyInner
  );

  // The conclusion lives OUTSIDE the form surface — its own panel beside it, exactly like the
  // drawer's tray (`FormDrawer` puts the conclusion next to the form panel with a 6px gutter).
  // It never wraps below the form: the two stay side-by-side at every screen size.
  const body = conclusion ? (
    <div className="flex h-full flex-row items-stretch gap-[6px]">
      <div className="min-h-0 min-w-0 flex-1">{surface}</div>
      <div className="flex min-h-0">{conclusion}</div>
    </div>
  ) : (
    surface
  );

  // `className` lands on the OUTERMOST element — the one a parent lays out (e.g. `flex-1 min-h-0`
  // to fill a flex column). `h-full` fills a parent that has a definite height.
  const outerClassName = cn("h-full w-full", className);

  const tree = (
    <Form {...form}>
      <div className={outerClassName}>{body}</div>
    </Form>
  );

  return (
    <LoadingContext.Provider value={loading}>
      <ModeContext.Provider value={mode}>
        <DirectionContext.Provider value={direction}>
          {isStepper ? (
            <StepperContext.Provider value={stepper}>{tree}</StepperContext.Provider>
          ) : (
            tree
          )}
        </DirectionContext.Provider>
      </ModeContext.Provider>
    </LoadingContext.Provider>
  );
}

/**
 * FormBuilder — a compound, composition-based form. Author a form as JSX:
 *
 * ```tsx
 * <FormBuilder onSubmit={fn} resolver={r} defaultValues={d}>
 *   <FormBuilder.Section title="Identity" color="Blue">
 *     <FormBuilder.Text name="name" label="Name" required />
 *   </FormBuilder.Section>
 *   <FormBuilder.Submit>Save</FormBuilder.Submit>
 * </FormBuilder>
 * ```
 *
 * Steps are components (`FormBuilder.Stepper` + `FormBuilder.Step`) and
 * `mode="view"` renders read-only. FormBuilder is drawer-unaware — to show a form
 * in a drawer, wrap it in `FormRenderer`'s `FormDrawer` (or use `FormRenderer`
 * with `display: "drawer"`).
 */
export const FormBuilder = Object.assign(FormBuilderRoot, {
  // fields
  Text: TextField,
  Email: EmailField,
  Password: PasswordField,
  Number: NumberField,
  Currency: CurrencyField,
  Textarea: TextareaField,
  Select: SelectField,
  SearchableSelect: (props: Parameters<typeof SelectField>[0]) => <SelectField {...props} async />,
  MultiSelect: MultiSelectField,
  Tags: MultiSelectField,
  RadioList: RadioListField,
  RadioCards: RadioCardsField,
  Checkbox: CheckboxField,
  CheckboxGroup: CheckboxGroupField,
  SwitchBox: SwitchBoxField,
  Otp: OtpField,
  TreeSelect: TreeSelectField,
  Slider: SliderField,
  Color: ColorField,
  Signature: SignatureField,
  Phone: PhoneField,
  FieldArray: FieldArray,
  Date: DateField,
  DateRange: (props: Parameters<typeof DateField>[0]) => <DateField {...props} mode="range" />,
  DateMultiple: (props: Parameters<typeof DateField>[0]) => (
    <DateField {...props} mode="multiple" />
  ),
  DateTime: (props: Parameters<typeof DateField>[0]) => <DateField {...props} timePicker />,
  File: FileField,
  Image: (props: Parameters<typeof FileField>[0]) => <FileField {...props} image />,
  RichText: RichTextField,
  Custom: CustomField,
  // layout
  Section,
  Header,
  Submit: SubmitButton,
  // stepper
  Stepper,
  Step,
  Back,
  Next,
});
