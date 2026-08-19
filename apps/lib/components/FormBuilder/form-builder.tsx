"use client";

import { useForm, type FieldValues } from "react-hook-form";

import { cn } from "../../utils/cn";
import { Form } from "../Form";
import { LoadingContext, DirectionContext, FormIdContext } from "./context";
import { markFieldKind } from "./field-kind";
import type { FormBuilderRootProps } from "./types";
import {
  TextField,
  EmailField,
  PasswordField,
  NumberField,
  CurrencyField,
  TextareaField,
  SelectField,
  SearchableSelectField,
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
  TableField,
  FileField,
  RichTextField,
  CustomField,
} from "./fields";
import { SubmitButton } from "./submit";

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
  fieldDirection,
  resetOnSuccess,
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

  // The `<form>` IS the outermost element — FormBuilder draws no frame of its own. `gap-4` is the
  // spacing between sections, which is field structure; `@container` scopes any container query a
  // field wants to the form's own width. Everything that used to wrap this — the page gutters, the
  // scroll shell, the header, the stepper rail, the summary column — belongs to `FormRenderer`.
  //
  // `className` lands here, so a parent still lays the form out (e.g. `flex-1 min-h-0`).
  return (
    <FormIdContext.Provider value={id}>
      <LoadingContext.Provider value={loading}>
        <DirectionContext.Provider value={direction}>
          <Form {...form}>
            <form
              id={id}
              className={cn("flex w-full min-w-0 flex-col gap-4 @container", className)}
              onSubmit={form.handleSubmit(handleValid, onInvalid)}
            >
              {children}
            </form>
          </Form>
        </DirectionContext.Provider>
      </LoadingContext.Provider>
    </FormIdContext.Provider>
  );
}

/**
 * FormBuilder — a compound, composition-based form. Author a form as JSX:
 *
 * ```tsx
 * <FormBuilder onSubmit={fn} resolver={r} defaultValues={d}>
 *   <FormBuilder.Text name="name" label="Name" required />
 *   <FormBuilder.Select name="category" label="Category" options={CATEGORY} />
 * </FormBuilder>
 * ```
 *
 * **FormBuilder is the fields and nothing else** — the `<form>`, its react-hook-form context and
 * the field components. Each field draws its own `FieldSection` row (label, required marker,
 * hint); beyond that FormBuilder draws no frame at all: no titled section cards, no page gutters,
 * no scroll shell, no title header, no stepper rail, no summary column. Rendered bare it fills
 * whatever you put it in, which is what an embedded form — a settings rail, a `DataViews` filter
 * panel — wants.
 *
 * For a real page or drawer form, wrap it in `FormRenderer`, which owns all of that chrome:
 * `display` (page vs drawer), `header`, `actions`, `summary`, `FormRenderer.Section` and the
 * wizard (`FormRenderer.Stepper` + `FormRenderer.Step`).
 *
 * `FormBuilder.Submit` stays here — it is the form's own submit button, wired to the `<form>` by
 * id so it works even when the chrome renders it outside the element.
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
  SearchableSelect: SearchableSelectField,
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
  Table: TableField,
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
  // the form's own submit button
  Submit: SubmitButton,
});

/**
 * What each field produces, for consumers that read a form they did not author.
 *
 * Stamped here rather than on the field definitions because the aliases — `DateRange`, `Tags`,
 * `Image` — only exist in the table above, and a reader checking "is this list complete?" should
 * have one place to look. `Tags` and `MultiSelect` are the same component, so the repeat is
 * harmless.
 */
(
  [
    [FormBuilder.Text, "text"],
    [FormBuilder.Email, "text"],
    [FormBuilder.Password, "text"],
    [FormBuilder.Textarea, "text"],
    [FormBuilder.Otp, "text"],
    [FormBuilder.Color, "text"],
    [FormBuilder.Phone, "text"],
    [FormBuilder.Number, "number"],
    [FormBuilder.Currency, "number"],
    [FormBuilder.Select, "choice"],
    [FormBuilder.SearchableSelect, "choice"],
    [FormBuilder.RadioList, "choice"],
    [FormBuilder.RadioCards, "choice"],
    [FormBuilder.MultiSelect, "multiChoice"],
    [FormBuilder.Tags, "multiChoice"],
    [FormBuilder.CheckboxGroup, "multiChoice"],
    [FormBuilder.TreeSelect, "multiChoice"],
    [FormBuilder.Checkbox, "boolean"],
    [FormBuilder.SwitchBox, "boolean"],
    [FormBuilder.Date, "date"],
    [FormBuilder.DateRange, "date"],
    [FormBuilder.DateTime, "date"],
    [FormBuilder.DateMultiple, "date"],
    [FormBuilder.Slider, "slider"],
    [FormBuilder.Custom, "custom"],
    [FormBuilder.File, "custom"],
    [FormBuilder.Image, "custom"],
    [FormBuilder.Signature, "custom"],
    [FormBuilder.RichText, "custom"],
  ] as const
).forEach(([component, kind]) => markFieldKind(component, kind));
