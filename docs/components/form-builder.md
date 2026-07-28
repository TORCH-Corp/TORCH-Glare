---
title: FormBuilder
description: A compound, composition-based form. Author forms as JSX children (FormBuilder.Text, FormBuilder.Select, …) with steps-as-components, a drawer wrapper, and any react-hook-form resolver.
component: true
group: Forms
keywords:
  [form-builder, form, compound, composition, react-hook-form, resolver, stepper, drawer, fields]
---

# FormBuilder

A **compound, composition-based** form. You author a form as JSX children — each
field is a `FormBuilder.*` component wired to [react-hook-form](https://react-hook-form.com/)
for you. Steps are components and the drawer is a wrapper.

```tsx
<FormBuilder onSubmit={save} resolver={zodResolver(schema)} defaultValues={d}>
  <FormBuilder.Section title="Identity" color="Blue">
    <FormBuilder.Text name="name" label="Name" required />
    <FormBuilder.Currency name="price" label="Price" currencySymbol="$" />
  </FormBuilder.Section>
  <FormBuilder.Submit>Save</FormBuilder.Submit>
</FormBuilder>
```

> Need the same form to render as a page _or_ a drawer, with a title header and an
> `actions` slot for the Save? Wrap these same children in
> [FormRenderer](./form-renderer.md).

## Installation

TORCH Glare is a copy-in library: the CLI copies this component's source into your project.

```bash
npx torch-glare@latest init
npx torch-glare@latest add FormBuilder
```

## Imports

```tsx
import { FormBuilder } from "@/components/FormBuilder";
```

## Root props

| Prop             | Type                                | Notes                                                                                                                      |
| ---------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `onSubmit`       | `(values) => void \| Promise<void>` | Called on a valid submit.                                                                                                  |
| `onInvalid`      | `(errors) => void`                  | Called when validation fails.                                                                                              |
| `resolver`       | `Resolver`                          | Any react-hook-form resolver, e.g. `zodResolver(schema)`.                                                                  |
| `defaultValues`  | `DefaultValues`                     | Initial values (create).                                                                                                   |
| `values`         | `T`                                 | Controlled values (edit) — the form re-syncs when this changes.                                                            |
| `loading`        | `boolean`                           | Submit shows a spinner; inputs disable.                                                                                    |
| `fieldDirection` | `'horizontal' \| 'vertical'`        | Row layout (auto-vertical inside a drawer).                                                                                |
| `resetOnSuccess` | `boolean`                           | Reset to defaults after a successful submit.                                                                               |
| `form`           | `UseFormReturn`                     | A hoisted `useForm` to bind to — pass when a `conclusion` panel must read the same values.                                 |
| `conclusion`     | `ReactNode`                         | A live panel (e.g. `FormSummary`) rendered **outside** the `<form>` as the grid's right column.                            |
| `id`             | `string`                            | Sets the underlying `<form id>`, so a button outside the form can submit it via `form={id}` (e.g. a drawer header's Save). |
| `className`      | `string`                            | Lands on the form's outermost element — e.g. `"min-w-0 flex-1"` to fill the space beside a `conclusion` panel.             |

**Adaptive layout.** FormBuilder lays out responsively: a `FormBuilder.Stepper` puts its nav rail in
a **left** column beside the fields (both inside the form surface, under the title header), and a
`conclusion` renders as its own panel **outside** the form surface, beside it — the same structure
`FormDrawer` uses in the drawer tray (6px gutter). So a stepper + conclusion reads as three columns
(nav · fields · conclusion), a conclusion alone as two, and a plain form as one. The fields column
caps at 1100px and centers. The conclusion is outside the `<form>` and reads values via its own
`form` prop.

## Field components

Each is a JSX child taking at least `name`, plus `label`, `placeholder`,
`description`, `required`, `disabled`, `hidden`, `fullWidth`.

| Component                                                                   | Input                                                                                 | Value                                                        |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `FormBuilder.Text` / `.Email` / `.Password`                                 | `InputField`                                                                          | `string`                                                     |
| `FormBuilder.Number`                                                        | numeric `InputField`                                                                  | `number`                                                     |
| `FormBuilder.Currency` (`currencySymbol`)                                   | `InputField` + symbol                                                                 | `number`                                                     |
| `FormBuilder.Textarea`                                                      | `Textarea`                                                                            | `string`                                                     |
| `FormBuilder.Slider` (`min,max,step,range`)                                 | `@radix-ui/react-slider`                                                              | `number` / `[number,number]`                                 |
| `FormBuilder.Color` (`presets`, `alpha`)                                    | `ColorPicker` (full palette: SV area, hue, opacity, eyedropper, HEX/RGB/HSL, presets) | hex `string` (`#rrggbb`, or `#rrggbbaa` when opacity < 100%) |
| `FormBuilder.Phone` (`defaultCountry`)                                      | `SearchableSelect` + `InputField`                                                     | `string`                                                     |
| `FormBuilder.Select` / `.SearchableSelect` (`options`, async props)         | `SearchableSelect`                                                                    | `string`                                                     |
| `FormBuilder.MultiSelect` / `.Tags` (`options`)                             | `BadgeField`                                                                          | `string[]`                                                   |
| `FormBuilder.RadioList` (`options`, each with optional `description`)       | boxed radio list                                                                      | `string`                                                     |
| `FormBuilder.CheckboxGroup` (`options`, each with optional `description`)   | boxed checkbox list                                                                   | `string[]`                                                   |
| `FormBuilder.RadioCards` (`options` with `description`)                     | `RadioCard`                                                                           | `string`                                                     |
| `FormBuilder.Checkbox` (`subLabel`)                                         | `Checkbox` + inline label                                                             | `boolean`                                                    |
| `FormBuilder.SwitchBox` (`subLabel`)                                        | `Switch` in a `#f9f9f9` box                                                           | `boolean`                                                    |
| `FormBuilder.Otp` (`length`)                                                | `InputOTP`                                                                            | `string`                                                     |
| `FormBuilder.Date`                                                          | `DatePicker`                                                                          | `Date`                                                       |
| `FormBuilder.DateRange`                                                     | `DatePicker` (range)                                                                  | `{from,to}`                                                  |
| `FormBuilder.DateMultiple`                                                  | `DatePicker` (multiple)                                                               | `Date[]`                                                     |
| `FormBuilder.DateTime`                                                      | `DatePicker` (timePicker)                                                             | `Date`                                                       |
| `FormBuilder.TreeSelect` (`nodes`, `getNodeId`, `getNodeLabel`, …)          | `SearchableTree`                                                                      | node id (`string`)                                           |
| `FormBuilder.File` / `.Image` (`accept`, `multiple`)                        | `ImageAttachment`                                                                     | `File \| File[]`                                             |
| `FormBuilder.RichText`                                                      | `TextEditor` (EditorJS)                                                               | `OutputData`                                                 |
| `FormBuilder.Signature` (`penColor`)                                        | canvas pad                                                                            | PNG data-URL `string`                                        |
| `FormBuilder.FieldArray` (`children` render fn, `defaultItem`)              | RHF `useFieldArray`                                                                   | `object[]`                                                   |
| `FormBuilder.Table` (`columns`, `selectable`, `reorderable`, `defaultItem`) | editable grid in a `SectionBlock`                                                     | `object[]`                                                   |
| `FormBuilder.Custom` (`render`, `formatView`)                               | your control                                                                          | anything                                                     |

`FormBuilder.Password` accepts `strengthMeter` (shows a `PasswordLevel` meter). `FormBuilder.FieldArray`
renders a repeating list — its `children` is a render fn `(rowName, index, remove) => …` and sub-fields
are named `${rowName}.field`.

`FormBuilder.Table` is the **table-shaped** counterpart of `FieldArray` (value `object[]`): an editable
grid where each row is a record and each column cell is any `FormBuilder.*` field. It renders **inside a
`SectionBlock`**, so place it as a **top-level child** of the form (not inside a `FormBuilder.Section`).
Each column pairs a `header` with a `cell(rowName, index)` renderer — name the cell's field
`${rowName}.<key>`. The section header carries the actions: a **Add New** button (also repeated as the
bottom footer) and a **Delete Row** button that's disabled until rows are checkbox-selected. Rows support
**checkbox selection** (+ select-all), **drag-drop reordering**, and — per column, via `sortKey` — a
sort toggle in the header. Cells render
"bare" (control only) with validation errors shown as a tooltip on the control, so a row stays one line
tall, and each field passes `onTable` so it's borderless and blends into the grid. Practical cell fields
are the compact ones — `Text`, `Number`, `Currency`, `Select`, `SearchableSelect`, `Date`, `Phone`,
`Checkbox`, `SwitchBox`; wide fields (`RichText`, `Signature`, `File`) work but aren't suited to a cell.

```tsx
<FormBuilder.Table
  name="items"
  title="Items"
  color="Green"
  addLabel="Add item"
  defaultItem={{ item: "", category: "hardware", qty: 1, price: 0 }}
  columns={[
    {
      header: "Item",
      width: 200,
      cell: (row) => <FormBuilder.Text name={`${row}.item`} required />,
    },
    {
      header: "Category",
      cell: (row) => <FormBuilder.Select name={`${row}.category`} options={CATEGORY} required />,
    },
    {
      header: "Qty",
      width: 110,
      cell: (row) => <FormBuilder.Number name={`${row}.qty`} required />,
    },
    {
      header: "Price",
      width: 140,
      cell: (row) => <FormBuilder.Currency name={`${row}.price`} currencySymbol="$" required />,
    },
  ]}
/>
```

`FormBuilder.RadioList` (single-select, `string`) and `FormBuilder.CheckboxGroup` (multi-select,
`string[]`) render their `options` as a boxed, divided list — control on the left, primary
label, and an optional per-option `description` shown as a secondary label. The whole row is
clickable. Multi-select is also available as `.MultiSelect` / `.Tags` (a tag-chip picker).

`FormBuilder.SwitchBox` (value `boolean`) is a switch wrapped in a `#f9f9f9` field box. It
renders like any other field — the `label` sits in the normal label column — and the box holds
an optional inline `subLabel`, a vertical divider, and the switch.

`FormBuilder.Section` (props `title`, `color`, `icon`) groups fields in a Glare
`SectionBlock`. `FormBuilder.Submit` is a loading-aware submit button. It
**auto-associates with the enclosing form** (via context), so it submits even when placed in a
header / action bar that renders _outside_ the `<form>` — no manual `form={id}` wiring.

## Title header + action bar

`FormBuilder.Header` renders a **title pill** (Glare `HeaderBar`) on the left and an
**action bar** (your buttons) on the right, **absolutely positioned** over a
scrollable form body — the products-services item-edit look. Place it as a direct
child of `<FormBuilder>`; the root then switches to the scroll-shell layout.

```tsx
<FormBuilder onSubmit={save} resolver={r} defaultValues={d}>
  <FormBuilder.Header title="Item" variant="new">
    <FormBuilder.Submit>Save</FormBuilder.Submit>
    {/* add more actions, e.g. a "Save as draft" Button */}
  </FormBuilder.Header>

  <FormBuilder.Section title="Identity" color="Blue">
    <FormBuilder.Text name="name" label="Name" required />
  </FormBuilder.Section>
</FormBuilder>
```

- `title` — plain text (uppercased). `label` — badge text (defaults from `variant`).
- `variant` — `"new" | "edit" | "detail"` (badge color; default `"new"`). `children` are
  the action buttons; `FormBuilder.Submit` submits the form (it auto-associates with it, even
  though the header sits outside `<form>`).

## Stepper (steps are components)

Wrap steps in `FormBuilder.Stepper`; each `FormBuilder.Step` holds a step's fields.
**Every step's fields are always mounted and registered** — the whole form is live
regardless of which step is showing; the stepper only toggles _visibility_.
**Navigation is the step buttons themselves**: click a step to go there. Backward is
free; clicking forward validates the steps in between and stops at the first one with
errors (shown with a red indicator). A step that **passes validation stays checked** even
after you navigate back to it. Put the **Submit** in the `FormBuilder.Header` (or the
`FormRenderer` `actions`) — it submits every step's fields at once, from any step.

`FormBuilder.Back` / `FormBuilder.Next` are **chevron step-nav buttons** (previous / next,
disabled at the ends; `Next` validates the current step first). Place them in a
`FormBuilder.Header`, or use `FormRenderer` — it prepends them before your Submit for a stepper
automatically.

```tsx
<FormBuilder onSubmit={save} resolver={r} defaultValues={d}>
  <FormBuilder.Header title="Item" variant="new">
    <FormBuilder.Submit>Save</FormBuilder.Submit>
  </FormBuilder.Header>

  <FormBuilder.Stepper>
    <FormBuilder.Step title="Basics">
      <FormBuilder.Text name="name" label="Name" required />
    </FormBuilder.Step>
    <FormBuilder.Step title="Details">
      <FormBuilder.Select name="category" label="Category" required options={cats} />
    </FormBuilder.Step>
  </FormBuilder.Stepper>
</FormBuilder>
```

> **In a drawer?** `FormBuilder` is drawer-unaware — it only displays inputs. To
> show a form in a drawer, wrap it in `FormDrawer` from
> [FormRenderer](./form-renderer.md) (pass `fieldDirection="vertical"` to the
> form), or use `FormRenderer` with `display="drawer"`.

> Building a **detail page** with a sidebar of tabs (not a form)? That lives on `FormRenderer`
> (`FormRenderer.Sidebar` / `.Tab`) — see the FormRenderer docs. `FormBuilder` itself stays form-only.

## Calculation panel

To show computed totals **beside** the form, render a [FormSummary](./form-summary.md)
next to it (not inside it) and share one hoisted form via the `form` prop:

```tsx
const form = useForm({ resolver: r, defaultValues: d })

<div className="flex items-start gap-4">
  <FormBuilder form={form} onSubmit={save} className="min-w-0 flex-1">…fields…</FormBuilder>
  <FormSummary form={form} title="Invoice">…rows…</FormSummary>
</div>
```

`form` makes FormBuilder use an existing react-hook-form instance instead of creating its
own — that's what lets something outside the form read the same live values.

## Editing a record

Pass `values` (not just `defaultValues`); the form repopulates when the data loads. Use a
remount `key` so initial-only inputs (date, rich text) re-seed.

```tsx
<FormBuilder key={entity.id} values={entity} onSubmit={save} resolver={r} defaultValues={d}>
  …the same fields…
</FormBuilder>
```

## Validation

Resolver-agnostic — pass any react-hook-form `resolver` (`zodResolver`, a plain
resolver function, etc.). The library never depends on zod.
