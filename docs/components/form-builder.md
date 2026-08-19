---
title: FormBuilder
description: The fields. A compound, composition-based form — author fields as JSX children (FormBuilder.Text, FormBuilder.Select, …) wired to any react-hook-form resolver. All chrome around the fields lives in FormRenderer.
component: true
group: Forms
keywords:
  [
    form-builder,
    form,
    compound,
    composition,
    react-hook-form,
    resolver,
    fields,
    validation,
    table,
    field-array,
    submit,
  ]
---

# FormBuilder

A **compound, composition-based** form. You author a form as JSX children — each
field is a `FormBuilder.*` component wired to [react-hook-form](https://react-hook-form.com/)
for you.

```tsx
<FormBuilder onSubmit={save} resolver={zodResolver(schema)} defaultValues={d}>
  <FormBuilder.Text name="name" label="Name" required />
  <FormBuilder.Currency name="price" label="Price" currencySymbol="$" />
</FormBuilder>
```

## FormBuilder is the fields — nothing else

FormBuilder renders a `<form>`, its react-hook-form context, and your fields. Each field draws
its own row (label, required marker, hint). Beyond that it draws **no frame at all**: no titled
section cards, no page gutters, no scroll shell, no title header, no stepper rail, no summary
column. Rendered bare it simply fills its container — which is what an embedded form wants (a
settings rail, a `DataViews` filter panel).

Everything drawn *around* the fields lives in **[FormRenderer](./form-renderer.md)**:

| You want                              | Use                                                  |
| ------------------------------------- | ---------------------------------------------------- |
| A titled card grouping fields         | `FormRenderer.Section`                               |
| A page title header + Save action bar | `FormRenderer`'s `header` and `actions` props        |
| A wizard                              | `FormRenderer.Stepper` + `FormRenderer.Step`         |
| A drawer                              | `FormRenderer` with `display="drawer"`               |
| Live totals beside the form           | `FormRenderer`'s `summary` prop + [FormSummary](./form-summary.md) |
| A read-only detail page               | `FormRenderer.Sidebar` + `FormRenderer.Tab`          |

> **For real forms, reach for [FormRenderer](./form-renderer.md), not raw FormBuilder.** You still
> author the fields as `FormBuilder.*` children — FormRenderer just wraps them.

`FormBuilder.Submit` is the one non-field part that stays here — see
[Field components](#field-components) for what it does.

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
| `fieldDirection` | `'horizontal' \| 'vertical' \| 'flexible'` | Row layout. Unset is responsive; a `FormRenderer` drawer pins `'vertical'`, and `'flexible'` asks for the responsive layout back.                                                                                |
| `resetOnSuccess` | `boolean`                           | Reset to defaults after a successful submit.                                                                               |
| `form`           | `UseFormReturn`                     | A hoisted `useForm` to bind to — pass when something outside the form must read the same values.                           |
| `id`             | `string`                            | Sets the underlying `<form id>`, so a button outside the form can submit it via `form={id}` (e.g. a drawer header's Save). |
| `className`      | `string`                            | Lands on the `<form>` element itself — e.g. `"min-w-0 flex-1"` to fill a flex parent.                                      |

There is no `layout` prop and no `conclusion` prop: the fields always fill their container, and a
panel beside the form is `FormRenderer`'s `summary`.

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
| `FormBuilder.Select` (`options`)                                            | `Select`                                                                              | `string`                                                     |
| `FormBuilder.SearchableSelect` (`options`, async: `onSearchChange`/`onLoadMore`/`hasMore`) | `SearchableSelect`                                                      | `string`                                                     |
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
| `FormBuilder.Custom` (`render`)                                             | your control                                                                          | anything                                                     |

`FormBuilder.Password` accepts `strengthMeter` (shows a `PasswordLevel` meter). `FormBuilder.FieldArray`
renders a repeating list — its `children` is a render fn `(rowName, index, remove) => …` and sub-fields
are named `${rowName}.field`.

`FormBuilder.Table` is the **table-shaped** counterpart of `FieldArray` (value `object[]`): an editable
grid where each row is a record and each column cell is any `FormBuilder.*` field. It renders its own
`SectionBlock` (`variant="Table"` — the full-bleed table shell), so place it as a **top-level child** of
the form, **not** inside a `FormRenderer.Section` — nesting produces a card inside a card. When you need a
table that isn't a form field, compose the shell yourself with `SectionBlock variant="Table"` (see
[SectionBlock → Table Variant](./section-block.md#table-variant)).

Each column pairs a `header` with a `cell(rowName, index)` renderer — name the cell's field
`${rowName}.<key>`. Set `width` to size a column; it is applied to both the header and the body cells.
The section header carries the actions: an **Add New** button and a **Delete Row** button that's disabled
until rows are checkbox-selected. A second **＋ Add New** sits below the grid. Both live *outside* the
horizontal scroll container, so they stay put when a wide table is scrolled sideways. Rows support
**checkbox selection** (+ select-all), **drag-drop reordering**, and — per column, via `sortKey` — a
sort toggle in the header. Cells render
"bare" (control only) with validation errors shown as a tooltip on the control, so a row stays one line
tall, and each field passes `onTable` so it's borderless and blends into the grid. Practical cell fields
are the compact ones — `Text`, `Number`, `Currency`, `Select`, `SearchableSelect`, `Date`, `Phone`,
`Checkbox`, `SwitchBox`; wide fields (`RichText`, `Signature`, `File`) work but aren't suited to a cell.
`FormBuilder.Phone` collapses to a **plain number input** in a cell — two controls in one cell is not a
table column, so add a separate column (e.g. a `FormBuilder.Select` of dial codes) if you need the
country code.

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

To group fields into a titled card, use [`FormRenderer.Section`](./form-renderer.md) — it is
presentation, so it lives there.

`FormBuilder.Submit` is a loading-aware submit button. It **auto-associates with the enclosing
form** (via context), so it submits even when placed in a header / action bar that renders
_outside_ the `<form>` — no manual `form={id}` wiring.

## Moved to FormRenderer

These all used to live here. They are chrome, so they now live on
[FormRenderer](./form-renderer.md):

| Was | Now |
| --- | --- |
| `FormBuilder.Section` | `FormRenderer.Section` |
| `FormBuilder.Stepper` / `.Step` / `.Back` / `.Next` | `FormRenderer.Stepper` / `.Step` / `.Back` / `.Next` |
| `FormBuilder.Header` | `FormRenderer`'s `header` prop |
| the `layout` prop | gone — the fields always fill their container |
| the `conclusion` prop | `FormRenderer`'s `summary` prop |

See [the migration note](../migration/form-builder-2.5.2.md) for the full upgrade path.

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
