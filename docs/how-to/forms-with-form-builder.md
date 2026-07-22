---
title: Forms with FormBuilder, FormRenderer & FormSummary
description: The canonical way to build forms in TORCH Glare. Author fields as JSX with FormBuilder, add page/drawer chrome with FormRenderer, and show live computed totals with FormSummary. Covers single, stepper, drawer, edit/view, and a full invoice example combining all three.
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

| Component          | Use it for                                                                                                                         | When                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **`FormBuilder`**  | The form itself — fields authored as JSX children. Owns react-hook-form, validation, edit/view, sections, steppers.                | Always. This is the base.                       |
| **`FormRenderer`** | Wraps `FormBuilder` to add **chrome**: page-vs-drawer display, the title header, automatic Submit placement, and a `summary` slot. | Real forms — prefer it over raw `FormBuilder`.  |
| **`FormSummary`**  | A read-only **calculation panel beside the form** — totals that recompute live as the user types.                                  | Invoices, orders, anything with a "conclusion". |

Validation is **resolver-agnostic**: pass any react-hook-form resolver
(`zodResolver(schema)` is typical). The library never depends on zod.

---

## 1. A single-page form

Each `FormBuilder.*` field is one JSX child taking at least a `name`, plus `label`,
`placeholder`, `required`, `disabled`, `hidden`, `fullWidth`. Wrap them in `FormRenderer`
and give it a `header` — it renders the title bar and places the Submit button for you.

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
    >
      <FormBuilder.Section title="Identity" color="Blue">
        <FormBuilder.Text name="name" label="Name" required placeholder="e.g. Acme Widget" />
        <FormBuilder.Textarea name="description" label="Description" fullWidth />
      </FormBuilder.Section>

      <FormBuilder.Section title="Classification" color="Red">
        <FormBuilder.Select name="category" label="Category" required options={CATEGORY} />
        <FormBuilder.Currency name="price" label="Base price" currencySymbol="$" />
      </FormBuilder.Section>

      <FormBuilder.Section title="Settings" color="Purple">
        <FormBuilder.SwitchBox name="active" label="Active" subLabel="Enabled" />
        <FormBuilder.Checkbox name="agree" label="I agree to the terms" required />
      </FormBuilder.Section>
    </FormRenderer>
  );
}
```

`FormBuilder.Section` groups fields in a `SectionBlock` (`color` is one of `Blue`, `Yellow`,
`Green`, `Red`, `Orange`, `Purple`, `Pink`, `Gray`). You don't add a Submit button yourself —
`FormRenderer` places one from the `header`. (If you use raw `FormBuilder`, add
`FormBuilder.Submit`, which is loading-aware and auto-hides in view mode.)

### Field types

Every field, its underlying control, and the value your `onSubmit` receives:

| Component                                                   | Value                                         |
| ----------------------------------------------------------- | --------------------------------------------- |
| `.Text` / `.Email` / `.Password` (`strengthMeter`)          | `string`                                      |
| `.Number`                                                   | `number`                                      |
| `.Currency` (`currencySymbol`)                              | `number`                                      |
| `.Textarea`                                                 | `string`                                      |
| `.Select` / `.SearchableSelect` (`options`)                 | `string`                                      |
| `.MultiSelect` / `.Tags` (`options`)                        | `string[]`                                    |
| `.RadioList` (`options`, optional per-option `description`) | `string`                                      |
| `.CheckboxGroup` (`options`)                                | `string[]`                                    |
| `.RadioCards` (`options` with `description`)                | `string`                                      |
| `.Checkbox` (`subLabel`)                                    | `boolean`                                     |
| `.SwitchBox` (`subLabel`)                                   | `boolean`                                     |
| `.Otp` (`length`)                                           | `string`                                      |
| `.Slider` (`min`, `max`, `step`, `range`, `suffix`)         | `number` (or `[number, number]` with `range`) |
| `.Color` (`presets`, `alpha`)                               | hex `string`                                  |
| `.Phone` (`defaultCountry`, defaults to `+964`)             | `string` (`"+<dial> <number>"`)               |
| `.Date`                                                     | `Date`                                        |
| `.DateRange`                                                | `{ from, to }`                                |
| `.DateMultiple`                                             | `Date[]`                                      |
| `.DateTime`                                                 | `Date`                                        |
| `.TreeSelect` (`nodes`, `getNodeId`, `getNodeLabel`)        | node id (`string`)                            |
| `.File` / `.Image` (`accept`, `multiple`)                   | `File \| File[]`                              |
| `.RichText`                                                 | EditorJS `OutputData`                         |
| `.Signature` (`penColor`)                                   | PNG data-URL `string`                         |
| `.FieldArray` (`children` render fn, `defaultItem`)         | `object[]`                                    |
| `.Custom` (`render`, `formatView`)                          | anything                                      |

See the [FormBuilder](../components/form-builder.md) doc for the full prop tables.

---

## 2. Title header + action bar

`FormRenderer`'s `header` prop renders a title pill on the left and the Submit action on the
right: `header={{ title: 'Acme Widget Pro', variant: 'edit' }}` (variants: `new`, `edit`,
`detail`). Set `submitLabel` to relabel Save.

If you use raw `FormBuilder`, the same bar is `FormBuilder.Header` with a `FormBuilder.Submit`
child — it works there because the header sits inside the `<form>`.

---

## 3. Stepper (steps are components)

Every step's fields stay **mounted and registered** — the whole form is live regardless of
which step shows; the stepper only toggles visibility. **Navigation is the step buttons
themselves**: backward is free, clicking forward validates the steps in between and stops at
the first one with errors. Submit appears on the last step.

```tsx
<FormRenderer<Values>
  onSubmit={save}
  resolver={zodResolver(schema)}
  defaultValues={DEFAULTS}
  header={{ title: "New item", variant: "new" }}
>
  <FormBuilder.Stepper>
    <FormBuilder.Step title="Identity">
      <FormBuilder.Section title="Identity" color="Blue">
        <FormBuilder.Text name="name" label="Name" required />
      </FormBuilder.Section>
    </FormBuilder.Step>

    <FormBuilder.Step title="Classification">
      <FormBuilder.Section title="Classification" color="Red">
        <FormBuilder.Select name="category" label="Category" required options={CATEGORY} />
      </FormBuilder.Section>
    </FormBuilder.Step>
  </FormBuilder.Stepper>
</FormRenderer>
```

---

## 4. Edit and read-only view — one markup, both modes

- **Edit**: pass `values` (not just `defaultValues`) — the form repopulates when the data
  loads. Add a remount `key` so initial-only inputs (date, rich text) re-seed.
- **View**: `mode="view"` renders the same children read-only, with no Submit.

```tsx
<FormRenderer<Values>
  key={record?.id ?? "new"}
  mode={mode} // 'edit' | 'view'
  values={record} // arrives async
  onSubmit={save}
  resolver={zodResolver(schema)}
  defaultValues={DEFAULTS}
  header={{ title: record?.name ?? "New", variant: mode === "view" ? "detail" : "edit" }}
>
  …the same fields…
</FormRenderer>
```

---

## 5. A form in a drawer

Set `display="drawer"` and drive it with `open` / `onOpenChange`. `FormRenderer` moves the
Save action into the drawer header for you — no manual `id` / `form={id}` wiring:

```tsx
<FormRenderer<Values>
  display="drawer"
  open={open}
  onOpenChange={setOpen}
  header={{ title: "New item", label: "New", variant: "new" }}
  onSubmit={save}
  resolver={zodResolver(schema)}
  defaultValues={DEFAULTS}
>
  <FormBuilder.Section title="Identity" color="Blue">
    …
  </FormBuilder.Section>
</FormRenderer>
```

Inside a drawer the fields default to a vertical (narrow) layout automatically.

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
      submitLabel="Save invoice"
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
      <FormBuilder.Section title="Line items" color="Green">
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
      </FormBuilder.Section>

      <FormBuilder.Section title="Rates" color="Purple">
        <FormBuilder.Number name="taxRate" label="Tax rate (%)" />
        <FormBuilder.Number name="iqdRate" label="USD → IQD rate" />
      </FormBuilder.Section>
    </FormRenderer>
  );
}
```

Row options: `emphasized` (the primary result), `currency` + `tone`
(`'neutral' | 'success' | 'info'`), `decimals` (default `2` → `0.00`), `action` (a trailing
button), `format` (override the number formatting), `value` (a static row).

The panel is **read-only** — it contributes nothing to the submitted values. On a page it sits
beside the form (a `summary` **plus** a `FormBuilder.Stepper` becomes three columns: nav ·
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
  header={{ title: "New item", badge: "New", variant: "new" }}
  summary={
    <FormSummary form={form} title="Item" subtitle="Summary">
      <FormSummary.Group title="Pricing">
        <FormSummary.Row label="Base price" compute={basePrice} />
        <FormSummary.Row label="Overall Total" emphasized compute={overallTotal} />
      </FormSummary.Group>
    </FormSummary>
  }
>
  <FormBuilder.Section title="Identity" color="Blue">
    …
  </FormBuilder.Section>
</FormRenderer>
```

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
- [FormRenderer](../components/form-renderer.md) — display, header, Submit placement, `summary`
- [FormSummary](../components/form-summary.md) — the calculation panel
