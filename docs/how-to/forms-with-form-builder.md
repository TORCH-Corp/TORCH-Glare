---
title: Forms with FormBuilder, FormRenderer & FormSummary
description: The canonical way to build forms in TORCH Glare. Author fields as JSX with FormBuilder, add page/drawer chrome with FormRenderer, and show live computed totals with FormSummary. Covers single, stepper, drawer, editing a record, and a full invoice example combining all three.
keywords:
  [
    form,
    forms,
    formbuilder,
    formrenderer,
    formsummary,
    form-builder,
    form-renderer,
    form-summary,
    validation,
    zod,
    resolver,
    stepper,
    drawer,
    totals,
    invoice,
    calculation,
    react-hook-form,
  ]
---

# Forms with FormBuilder, FormRenderer & FormSummary

**This is the way to build forms in TORCH Glare.** Do not hand-wire
`FormField` → `FormItem` → `FormControl` → `InputField` rows, and never track field state
with `useState` — that boilerplate is exactly what `FormBuilder` exists to remove.

Three components, layered:

| Component          | Use it for                                                                                                                             | When                                            |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **`FormBuilder`**  | The fields themselves, authored as JSX children. Owns react-hook-form and validation — and nothing else: no cards, no header, no frame. | Always. This is the base.                       |
| **`FormRenderer`** | All the **chrome**: page-vs-drawer display, the title header, an `actions` slot for the Save, the titled `Section` cards, the stepper, and a `summary` slot. | Real forms — prefer it over raw `FormBuilder`.  |
| **`FormSummary`**  | A read-only **calculation panel beside the form** — totals that recompute live as the user types.                                      | Invoices, orders, anything with a "conclusion". |

Validation is **resolver-agnostic**: pass any react-hook-form resolver
(`zodResolver(schema)` is typical). The library never depends on zod.

---

## 1. A single-page form

Each `FormBuilder.*` field is one JSX child taking at least a `name`, plus `label`,
`placeholder`, `required`, `disabled`, `hidden`, `fullWidth`. Wrap them in `FormRenderer`,
give it a `header` for the title bar, and pass the Save via `actions`.

```tsx
"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormBuilder } from "@/components/FormBuilder";
import { FormRenderer } from "@/components/FormRenderer";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  category: z.string().min(1, "Pick a category"),
  price: z.number().positive("Must be positive").optional(),
  active: z.boolean(),
  agree: z.boolean().refine((v) => v === true, "You must agree to continue"),
});
type Values = z.infer<typeof schema>;

const DEFAULTS: Values = {
  name: "",
  description: "",
  category: "",
  price: undefined,
  active: true,
  agree: false,
};

const CATEGORY = [
  { label: "Hardware", value: "hardware" },
  { label: "Software", value: "software" },
];

export function ItemForm({
  onSave,
  saving,
}: {
  onSave: (v: Values) => Promise<void>;
  saving?: boolean;
}) {
  return (
    <FormRenderer<Values>
      onSubmit={onSave}
      loading={saving}
      resolver={zodResolver(schema)}
      defaultValues={DEFAULTS}
      header={{ title: "New item", variant: "new" }}
      actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}
    >
      <FormRenderer.Section title="Identity" color="Blue">
        <FormBuilder.Text name="name" label="Name" required placeholder="e.g. Acme Widget" />
        <FormBuilder.Textarea name="description" label="Description" fullWidth />
      </FormRenderer.Section>

      <FormRenderer.Section title="Classification" color="Red">
        <FormBuilder.Select name="category" label="Category" required options={CATEGORY} />
        <FormBuilder.Currency name="price" label="Base price" currencySymbol="$" />
      </FormRenderer.Section>

      <FormRenderer.Section title="Settings" color="Purple">
        <FormBuilder.SwitchBox name="active" label="Active" subLabel="Enabled" />
        <FormBuilder.Checkbox name="agree" label="I agree to the terms" required />
      </FormRenderer.Section>
    </FormRenderer>
  );
}
```

`FormRenderer.Section` groups fields in a `SectionBlock` (`color` is one of `Blue`, `Yellow`,
`Green`, `Red`, `Orange`, `Purple`, `Pink`, `Gray`). It also takes `icon`, `action`
(right-aligned buttons on the title row) and `variant` — `variant="Table"` switches to the
full-bleed table shell that `FormBuilder.Table` uses internally. Pass the Save via `actions` — a
`FormBuilder.Submit`, which is loading-aware; it renders in the header action pill.

> The section card belongs to `FormRenderer`, not `FormBuilder`: it is presentation, and it groups
> read-only detail rows just as happily as fields. A bare `<FormBuilder>` renders its fields with
> no card around them.

### Field types

Every field, its underlying control, and the value your `onSubmit` receives:

| Component                                                        | Value                                                          |
| ---------------------------------------------------------------- | -------------------------------------------------------------- |
| `.Text` / `.Email` / `.Password` (`strengthMeter`)               | `string`                                                       |
| `.Number`                                                        | `number`                                                       |
| `.Currency` (`currencySymbol`)                                   | `number`                                                       |
| `.Textarea`                                                      | `string`                                                       |
| `.Select` / `.SearchableSelect` (`options`)                      | `string`                                                       |
| `.MultiSelect` / `.Tags` (`options`)                             | `string[]`                                                     |
| `.RadioList` (`options`, optional per-option `description`)      | `string`                                                       |
| `.CheckboxGroup` (`options`)                                     | `string[]`                                                     |
| `.RadioCards` (`options` with `description`)                     | `string`                                                       |
| `.Checkbox` (`subLabel`)                                         | `boolean`                                                      |
| `.SwitchBox` (`subLabel`)                                        | `boolean`                                                      |
| `.Otp` (`length`)                                                | `string`                                                       |
| `.Slider` (`min`, `max`, `step`, `range`, `suffix`)              | `number` (or `[number, number]` with `range`)                  |
| `.Color` (`presets`, `alpha`)                                    | hex `string`                                                   |
| `.Phone` (`defaultCountry`, defaults to `+964`)                  | `string` (`"+<dial> <number>"`) — collapses to a plain number input inside a `.Table` cell, where `defaultCountry` does not apply |
| `.Date`                                                          | `Date`                                                         |
| `.DateRange`                                                     | `{ from, to }`                                                 |
| `.DateMultiple`                                                  | `Date[]`                                                       |
| `.DateTime`                                                      | `Date`                                                         |
| `.TreeSelect` (`nodes`, `getNodeId`, `getNodeLabel`)             | node id (`string`)                                             |
| `.File` / `.Image` (`accept`, `multiple`)                        | `File \| File[]`                                               |
| `.RichText`                                                      | EditorJS `OutputData`                                          |
| `.Signature` (`penColor`)                                        | PNG data-URL `string`                                          |
| `.FieldArray` (`children` render fn, `defaultItem`)              | `object[]`                                                     |
| `.Table` (`columns`, `selectable`, `reorderable`, `defaultItem`) | `object[]` — editable grid; top-level child (not in a Section) |
| `.Custom` (`render`)                                             | anything                                                       |

See the [FormBuilder](../components/form-builder.md) doc for the full prop tables.

---

## 2. Title header + action bar

`FormRenderer`'s `header` prop renders a title pill on the left: `header={{ title: 'Acme Widget
Pro', variant: 'edit' }}` (variants: `new`, `edit`, `detail`). The **action pill** on the right is
whatever you pass to `actions` — put the Save there:
`actions={<FormBuilder.Submit>Save invoice</FormBuilder.Submit>}`. A bare `FormBuilder.Submit`
auto-targets the form (via a form-id context), so it submits even though the header renders
_outside_ the `<form>`.

There is no header on raw `FormBuilder` — the title bar is FormRenderer's.

---

## 3. Stepper (steps are components)

Every step's fields stay **mounted and registered** — the whole form is live regardless of
which step shows; the stepper only toggles visibility. **Navigation is the step buttons
themselves**: backward is free, clicking forward validates the steps in between and stops at
the first one with errors. The Save is the header `actions` — it submits every step's fields at
once, from any step.

You pass just the Submit as `actions`; for a stepper, FormRenderer **auto-prepends chevron
Back/Next controls + a divider** before it (`[◀] [▶] │ Save`). Back is disabled on the first
step; Next validates then advances (disabled on the last). A step that **passes validation stays
checked** in the rail even after you navigate back — a live error still shows it red.

```tsx
<FormRenderer<Values>
  onSubmit={save}
  resolver={zodResolver(schema)}
  defaultValues={DEFAULTS}
  header={{ title: "New item", variant: "new" }}
  actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}
>
  <FormRenderer.Stepper>
    <FormRenderer.Step title="Identity">
      <FormRenderer.Section title="Identity" color="Blue">
        <FormBuilder.Text name="name" label="Name" required />
      </FormRenderer.Section>
    </FormRenderer.Step>

    <FormRenderer.Step title="Classification">
      <FormRenderer.Section title="Classification" color="Red">
        <FormBuilder.Select name="category" label="Category" required options={CATEGORY} />
      </FormRenderer.Section>
    </FormRenderer.Step>
  </FormRenderer.Stepper>
</FormRenderer>
```

---

## 4. Editing a record

Pass `values` (not just `defaultValues`) — the form repopulates when the data loads. Add a
remount `key` so initial-only inputs (date, rich text) re-seed.

```tsx
<FormRenderer<Values>
  key={record?.id ?? "new"}
  values={record} // arrives async
  onSubmit={save}
  resolver={zodResolver(schema)}
  defaultValues={DEFAULTS}
  header={{ title: record?.name ?? "New", variant: record ? "edit" : "new" }}
  actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}
>
  …the same fields…
</FormRenderer>
```

---

## 5. A form in a drawer

Set `display="drawer"` and drive it with `open` / `onOpenChange`. Pass the Save via `actions` —
it renders in the drawer header, with no manual `id` / `form={id}` wiring:

```tsx
<FormRenderer<Values>
  display="drawer"
  open={open}
  onOpenChange={setOpen}
  header={{ title: "New item", label: "New", variant: "new" }}
  onSubmit={save}
  resolver={zodResolver(schema)}
  defaultValues={DEFAULTS}
  actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}
>
  <FormRenderer.Section title="Identity" color="Blue">
    …
  </FormRenderer.Section>
</FormRenderer>
```

Inside a drawer the fields default to a vertical (narrow) layout automatically. A drawer can be
wide, though — pass `fieldDirection="flexible"` to hand the decision back to the container query,
which goes label-beside-control once a field row passes the container `md` breakpoint.

---

## 6. The conclusion panel — live totals beside the form

`FormSummary` is a read-only panel of computed rows. Each `FormSummary.Row` declares a
**`compute(values)`** that runs against the **live** form values, so totals recalculate as the
user types. Pass it to `FormRenderer`'s `summary` prop.

Both the form and the panel must read the same values, so **hoist `useForm`** and hand the
instance to `FormRenderer` **and** `FormSummary` via their `form` prop:

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormBuilder } from "@/components/FormBuilder";
import { FormRenderer } from "@/components/FormRenderer";
import { FormSummary } from "@/components/FormSummary";

// The calculations — plain functions of the form values. Keep them out of the JSX.
const subTotal = (v: Invoice) => v.items.reduce((s, i) => s + (i.qty ?? 0) * (i.price ?? 0), 0);
const totalDiscount = (v: Invoice) => v.items.reduce((s, i) => s + (i.discount ?? 0), 0);
const taxable = (v: Invoice) => Math.max(0, subTotal(v) - totalDiscount(v));
const totalTax = (v: Invoice) => taxable(v) * ((v.taxRate ?? 0) / 100);
const overallTotal = (v: Invoice) => taxable(v) + totalTax(v);

export function InvoiceForm({ save }: { save: (v: Invoice) => Promise<void> }) {
  // Hoisted so both the form and the summary beside it share the same values.
  const form = useForm<Invoice>({ resolver: zodResolver(schema), defaultValues: DEFAULTS });

  return (
    <FormRenderer<Invoice>
      form={form}
      onSubmit={save}
      fieldDirection="vertical"
      header={{ title: "Invoice", variant: "new" }}
      actions={<FormBuilder.Submit>Save invoice</FormBuilder.Submit>}
      summary={
        <FormSummary form={form} title="Invoice" subtitle="Summary">
          <FormSummary.Group title="Total">
            <FormSummary.Row label="Total Discount" compute={totalDiscount} />
            <FormSummary.Row label="Overall Total" emphasized compute={overallTotal} />
            <FormSummary.Row
              label="Overall Total"
              currency="IQD"
              tone="success"
              decimals={0}
              compute={(v) => overallTotal(v) * (v.iqdRate ?? 0)}
            />
            <FormSummary.Row
              label="Overall Total"
              currency="USD"
              tone="info"
              compute={overallTotal}
            />
          </FormSummary.Group>

          <FormSummary.Group title="Tax">
            <FormSummary.Row label="Sub Total" compute={subTotal} />
            <FormSummary.Row label="Total Tax" compute={totalTax} />
          </FormSummary.Group>
        </FormSummary>
      }
    >
      <FormRenderer.Section title="Line items" color="Green">
        <FormBuilder.FieldArray
          name="items"
          label="Items"
          addLabel="Add item"
          defaultItem={{ name: "", qty: 1, price: 0, discount: 0 }}
        >
          {(rowName) => (
            <>
              <FormBuilder.Text name={`${rowName}.name`} label="Item" />
              <FormBuilder.Number name={`${rowName}.qty`} label="Qty" />
              <FormBuilder.Currency name={`${rowName}.price`} label="Price" currencySymbol="$" />
              <FormBuilder.Currency
                name={`${rowName}.discount`}
                label="Discount"
                currencySymbol="$"
              />
            </>
          )}
        </FormBuilder.FieldArray>
      </FormRenderer.Section>

      <FormRenderer.Section title="Rates" color="Purple">
        <FormBuilder.Number name="taxRate" label="Tax rate (%)" />
        <FormBuilder.Number name="iqdRate" label="USD → IQD rate" />
      </FormRenderer.Section>
    </FormRenderer>
  );
}
```

Row options: `emphasized` (the primary result), `currency` + `tone`
(`'neutral' | 'success' | 'info'`), `decimals` (default `2` → `0.00`), `action` (a trailing
button), `format` (override the number formatting), `value` (a static row).

The panel is **read-only** — it contributes nothing to the submitted values. On a page it sits
beside the form (a `summary` **plus** a `FormRenderer.Stepper` becomes three columns: nav ·
fields · summary).

---

## 7. Conclusion panel + drawer

The same `summary` prop works with `display="drawer"` — `FormRenderer` moves the panel into the
drawer's tray, beside the form:

```tsx
<FormRenderer<Invoice>
  display="drawer"
  open={open}
  onOpenChange={setOpen}
  form={form}
  onSubmit={save}
  header={{ title: "New item", label: "New", variant: "new" }}
  summary={
    <FormSummary form={form} title="Item" subtitle="Summary">
      <FormSummary.Group title="Pricing">
        <FormSummary.Row label="Base price" compute={basePrice} />
        <FormSummary.Row label="Overall Total" emphasized compute={overallTotal} />
      </FormSummary.Group>
    </FormSummary>
  }
>
  <FormRenderer.Section title="Identity" color="Blue">
    …
  </FormRenderer.Section>
</FormRenderer>
```

---

## 8. A detail (view) page — sidebar tabs, not a form

Sometimes you want to **display** a record, not edit it. Give `FormRenderer` `FormRenderer.Sidebar`
+ `FormRenderer.Tab` children (instead of fields) and it switches to a display-only detail page: a
left **sidebar** where each item swaps in its matching tab panel — no `<form>`, no submit. The
sidebar sits where a stepper's rail would; only the active panel shows.

**Every tab's content is `FormRenderer.Section` blocks.** Inside a Section, use the default
`FormRenderer.Grid` + `FormRenderer.Row` display cells (the read-only counterpart of form fields), or
render **your own component** — anything goes inside a Section.

```tsx
<FormRenderer
  header={{ title: "Order DE-344", variant: "detail" }} // "View" badge
  actions={<Button variant="BorderStyle">Print</Button>}
>
  {/* Rail — each Item's `value` ties to a Tab. */}
  <FormRenderer.Sidebar>
    <FormRenderer.Sidebar.Item value="overview" icon={<i className="ri-layout-grid-line" />}>
      Overview
    </FormRenderer.Sidebar.Item>
    <FormRenderer.Sidebar.Item value="activity" icon={<i className="ri-pulse-line" />}>
      Activity log
    </FormRenderer.Sidebar.Item>
  </FormRenderer.Sidebar>

  {/* Default display cells */}
  <FormRenderer.Tab value="overview">
    <FormRenderer.Section title="Main Information" color="Blue">
      <FormRenderer.Grid columns={2}>
        <FormRenderer.Row label="PO Number" value={record.poNumber} />
        <FormRenderer.Row label="Status" value={<Badge label="Submitted" color="yellow" />} />
      </FormRenderer.Grid>
    </FormRenderer.Section>
  </FormRenderer.Tab>

  {/* Or bring your own component — still inside a Section */}
  <FormRenderer.Tab value="activity">
    <FormRenderer.Section title="Activity log" color="Green">
      <YourTimeline items={record.activity} />
    </FormRenderer.Section>
  </FormRenderer.Tab>
</FormRenderer>
```

`FormRenderer.Grid` takes `columns` (1–3, default 2) and spans the full section width; `FormRenderer.Row`
takes `label` + `value` (any node). The first `Tab` is active by default.

> Generating one? Call the `create-form` tool with `layout="detail"` — it returns this exact wiring
> with your fields pre-filled as display rows.

---

## Gotchas

- **Hoisting `useForm` disables the remount-`key` reset.** Once the form instance lives in
  your component, a changing `key` no longer resets it. Call `form.reset(DEFAULTS)` instead
  (e.g. when opening a drawer).
- **`FormSummary` needs the same hoisted `form`** — that's the react-hook-form context it reads
  live values from. Pass the identical instance to `FormRenderer` and `FormSummary`.
- **Number/currency values are real numbers**, not strings — `onSubmit` receives
  `price: 1299`, not `"1299"`.
- **`required` is cosmetic.** It renders the "(Required)" tag; actual enforcement is your
  resolver — keep the two in sync.
- **Never use `variant="SystemStyle"` or `*-system-*` tokens** in app code.

## Related

- [FormBuilder](../components/form-builder.md) — every field type and its value shape
- [FormRenderer](../components/form-renderer.md) — display, header, `actions`, `summary`
- [FormSummary](../components/form-summary.md) — the calculation panel
- [FormBuilder 2.5.2 migration](../migration/form-builder-2.5.2.md) — what moved from
  `FormBuilder` to `FormRenderer`, and the rename table
