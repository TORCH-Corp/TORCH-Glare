---
title: FormSummary
description: A read-only calculation panel displayed beside a form. Each row declares a compute(values) that runs against the live form values, so totals recalculate as the user types.
component: true
group: Forms
keywords: [form-summary, summary, totals, calculation, invoice, panel, react-hook-form, useWatch]
---

# FormSummary

A read-only **calculation panel** that sits **beside a form** — the invoice-summary
look: grouped rows of computed totals, right-aligned, in Glare's dark `SystemStyle`
fields.

Each `FormSummary.Row` declares a **`compute(values)`** that runs against the **live**
form values, so every total recalculates as the user types.

The panel renders **outside** the form, beside it. Both read the same form, so
**hoist `useForm`** and hand the instance to each:

```tsx
const form = useForm({ resolver: zodResolver(schema), defaultValues })

<div className="flex gap-4">
  <FormBuilder form={form} onSubmit={save} className="min-w-0 flex-1">
    <FormBuilder.Section title="Line items">…fields…</FormBuilder.Section>
  </FormBuilder>

  <FormSummary form={form} title="Invoice" subtitle="Summary">
    <FormSummary.Group title="Total">
      <FormSummary.Row label="Total Discount" compute={totalDiscount} />
      <FormSummary.Row label="Overall Total" emphasized compute={overallTotal} />
      <FormSummary.Row label="Overall Total" currency="IQD" tone="success"
        compute={v => overallTotal(v) * v.iqdRate} decimals={0} />
      <FormSummary.Row label="Overall Total" currency="USD" tone="info" compute={overallTotal} />
    </FormSummary.Group>
  </FormSummary>
</div>
```

`FormBuilder` stays purely an input renderer — it knows nothing about the panel, and
**you** own the side-by-side layout. Passing `form` to `FormBuilder` makes it use that
instance instead of creating its own.

### Height

The panel is `h-full` and fills whatever height its parent gives it, scrolling its groups
(header pinned) once they outrun it. That means **the parent has to have a height** — the
usual mistake is `items-start` on the flex row, which collapses the panel to its content
instead. Leave the row at its default `items-stretch`, as above.

To make the panel own the viewport rather than grow with the form, bound the row:

```tsx
<div className="flex h-[calc(100vh-2rem)] gap-4">
  <FormBuilder … className="min-w-0 flex-1 overflow-y-auto" />
  <FormSummary … />
</div>
```

> Hoisting the form means a remount `key` no longer resets it. Call `form.reset(defaults)`
> instead (e.g. when opening a drawer).

## Installation

```bash
npx torch-glare@latest init
npx torch-glare@latest add FormSummary
```

## Imports

```tsx
import { FormSummary } from '@/components/FormSummary'
```

## `FormSummary` props

| Prop | Type | Notes |
|---|---|---|
| `title` | `ReactNode` | Panel title, e.g. `"Invoice"`. |
| `subtitle` | `ReactNode` | Muted text beside the title, e.g. `"Summary"`. |
| `form` | `UseFormReturn` | The form to read values from — required when rendered outside the `<FormBuilder>`. |
| `width` | `number \| string` | Panel width; default `228`. |
| `children` | `ReactNode` | `FormSummary.Group` children. |

## `FormSummary.Group` props

| Prop | Type | Notes |
|---|---|---|
| `title` | `ReactNode` | The group heading (Customer / Total / Tax / …). Groups are separated by a divider. |
| `collapsible` | `boolean` | When titled, the heading is a [ConclusionHeader](./conclusion-header.md) that opens/closes **this group's** rows; default `true`. |
| `defaultOpen` | `boolean` | Initial open state when collapsible; default `true`. |

The main panel title is a plain header — collapsing happens **per group**, not on the whole panel.

## `FormSummary.Row` props

| Prop | Type | Notes |
|---|---|---|
| `label` | `ReactNode` | Row label, above the value. |
| `compute` | `(values) => number \| string` | **The calculation** — receives the live form values. |
| `value` | `number \| string` | Static value, when there's nothing to compute. |
| `currency` | `ReactNode` | Currency code, e.g. `"IQD"` — rendered **inside** the field's trailing edge. |
| `tone` | `'neutral' \| 'success' \| 'info'` | Color of the currency code (green / blue). |
| `emphasized` | `boolean` | The primary result — lighter, emphasized border. |
| `decimals` | `number` | Decimal places; default `2` (→ `0.00`). |
| `action` | `ReactNode` | Trailing slot inside the field, e.g. an `ActionButton`. Shares the slot with `currency`. |
| `format` | `(value) => string` | Override the default number formatting. |

## Computing totals

`compute` is a plain function of the form values — keep the maths outside the JSX:

```tsx
const subTotal      = v => v.items.reduce((s, i) => s + i.qty * i.price, 0)
const totalDiscount = v => v.items.reduce((s, i) => s + i.discount, 0)
const taxable       = v => Math.max(0, subTotal(v) - totalDiscount(v))
const totalTax      = v => taxable(v) * (v.taxRate / 100)
const overallTotal  = v => taxable(v) + totalTax(v)
```

The panel is **read-only** — it contributes nothing to the submitted values.
