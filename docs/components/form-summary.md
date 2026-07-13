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

```tsx
<FormBuilder onSubmit={save} resolver={r} defaultValues={d}>
  <FormBuilder.Section title="Line items">…fields…</FormBuilder.Section>

  <FormSummary title="Invoice" subtitle="Summary">
    <FormSummary.Group title="Total">
      <FormSummary.Row label="Total Discount" compute={totalDiscount} />
      <FormSummary.Row label="Overall Total" emphasized compute={overallTotal} />
      <FormSummary.Row label="Overall Total" currency="IQD" tone="success"
        compute={v => overallTotal(v) * v.iqdRate} decimals={0} />
      <FormSummary.Row label="Overall Total" currency="USD" tone="info" compute={overallTotal} />
    </FormSummary.Group>
  </FormSummary>
</FormBuilder>
```

> **Place it as a child of `FormBuilder`.** The root detects it and lays out
> form-left / panel-right automatically. It must be inside a `FormBuilder` — it reads
> the live values from the form context.

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
| `width` | `number \| string` | Panel width; default `229`. |
| `children` | `ReactNode` | `FormSummary.Group` children. |

## `FormSummary.Group` props

`title` — the group heading (Customer / Total / Tax / …). Groups are separated by a divider.

## `FormSummary.Row` props

| Prop | Type | Notes |
|---|---|---|
| `label` | `ReactNode` | Row label, above the value. |
| `compute` | `(values) => number \| string` | **The calculation** — receives the live form values. |
| `value` | `number \| string` | Static value, when there's nothing to compute. |
| `currency` | `ReactNode` | Currency code beside the label, e.g. `"IQD"`. |
| `tone` | `'neutral' \| 'success' \| 'info'` | Color of the currency code (green / blue). |
| `emphasized` | `boolean` | The primary result — lighter, emphasized border. |
| `decimals` | `number` | Decimal places; default `2` (→ `0.00`). |
| `action` | `ReactNode` | Trailing slot inside the field, e.g. an `ActionButton`. |
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
