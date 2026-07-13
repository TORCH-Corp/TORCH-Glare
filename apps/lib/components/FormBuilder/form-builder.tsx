"use client";

import * as React from "react";
import { ReactNode } from "react";
import { useForm, type FieldValues } from "react-hook-form";

import { cn } from "../../utils/cn";
import { Form } from "../Form";
import { SectionBlock, type SectionColor } from "../SectionBlock";
import { LoadingContext, ModeContext, DirectionContext } from "./context";
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
  SwitchField,
  CheckboxField,
  RadioField,
  SegmentedField,
  ToggleGroupField,
  RadioCardsField,
  ToggleButtonField,
  DateField,
  CalendarField,
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
import { Stepper, Step, Back, Next } from "./stepper";
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
  className,
}: FormBuilderRootProps<T>) {
  // Hooks can't be conditional, so always create one; `formProp` wins when given
  // (the caller hoisted `useForm` to share values with something outside the form).
  const ownForm = useForm<T>({ resolver, defaultValues, values });
  const form = formProp ?? ownForm;
  const direction = fieldDirection ?? "horizontal";

  const handleValid = async (v: T) => {
    await onSubmit(v);
    if (resetOnSuccess) form.reset();
  };

  // Split out a FormBuilder.Header (if any): it renders absolutely and the rest
  // of the form scrolls beneath it.
  const childArray = React.Children.toArray(children);
  const header = childArray.find(isHeaderElement);
  const rest = header ? childArray.filter((n) => !isHeaderElement(n)) : childArray;

  const content = <div className="flex w-full flex-col gap-4">{rest}</div>;

  const body = header ? (
    // Scroll shell: absolute header floats over a scrollable, centered body.
    <div className="relative isolate flex size-full flex-col overflow-hidden rounded-2xl bg-background-presentation-body-primary">
      {header}
      <div className="relative z-[1] flex h-full w-full flex-col items-center overflow-y-auto px-6 py-6 pt-[72px] max-h-[85vh] scrollbar-hide">
        <div className="flex w-full max-w-[1100px] flex-col gap-4">{content}</div>
      </div>
    </div>
  ) : (
    content
  );

  // `className` lands on the OUTERMOST element — that's the one a parent lays out
  // (e.g. `flex-1` beside a FormSummary). Putting it on an inner div would leave
  // the <form> itself sizing to its content.
  const outerClassName = cn("w-full", className);

  return (
    <LoadingContext.Provider value={loading}>
      <ModeContext.Provider value={mode}>
        <DirectionContext.Provider value={direction}>
          <Form {...form}>
            {mode === "view" ? (
              <div className={outerClassName}>{body}</div>
            ) : (
              <form
                id={id}
                className={outerClassName}
                onSubmit={form.handleSubmit(handleValid, onInvalid)}
              >
                {body}
              </form>
            )}
          </Form>
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
  SearchableSelect: (props: Parameters<typeof SelectField>[0]) => (
    <SelectField {...props} async />
  ),
  MultiSelect: MultiSelectField,
  Tags: MultiSelectField,
  Radio: RadioField,
  RadioCards: RadioCardsField,
  Segmented: SegmentedField,
  ToggleGroup: ToggleGroupField,
  ToggleButton: ToggleButtonField,
  Checkbox: CheckboxField,
  Switch: SwitchField,
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
  InlineCalendar: CalendarField,
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
