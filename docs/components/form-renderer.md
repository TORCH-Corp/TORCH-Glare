---
title: FormRenderer
description: The chrome around a FormBuilder. Author fields as JSX children; FormRenderer owns page-vs-drawer display, the title header, the actions bar, titled Sections, the stepper, and the summary panel. Prefer it over raw FormBuilder for real forms.
component: true
group: Forms
keywords:
  [form-renderer, form, drawer, header, display, actions, section, stepper, summary, react-hook-form]
---

# FormRenderer

The **chrome** around a [FormBuilder](./form-builder.md). You author the fields as **JSX
children** (`FormBuilder.Text`, `FormBuilder.Select`, …); `FormRenderer` draws everything
around them:

- **page vs drawer** display (`display="drawer"` hosts the form in a `FormDrawer`),
- the **absolute title header** + `actions` bar,
- **`FormRenderer.Section`** — the titled cards that group fields,
- the **stepper** (`FormRenderer.Stepper` / `.Step`) and its nav rail,
- the **`summary`** panel beside the form,
- the page gutters and scroll shell, and **vertical field layout** inside a drawer.

`FormBuilder` on its own is the fields and nothing else — no card, no header, no frame — so it
fills whatever it is placed in. **For real forms, use `FormRenderer`**; reach for bare
`FormBuilder` only when you are embedding fields inside something that already provides its own
chrome (a settings rail, a filter panel).

FormRenderer has **two modes**: a **form** (author fields as children, as below), or a display-only
**detail page** — give it `FormRenderer.Sidebar` + `FormRenderer.Tab` children instead of fields and the
sidebar swaps `FormRenderer.Tab` panels, whose content is `FormRenderer.Section` blocks (no `<form>`,
no submit — see [Detail tabs](#detail-tabs-sidebar)).

FormRenderer never manufactures a Submit — **you compose the Save and hand it to `actions`**.
It renders in the form's header action pill (page) or the drawer header (drawer), and a bare
`<FormBuilder.Submit>` auto-targets this form (even though the header sits outside the `<form>`).

```tsx
<FormRenderer
  onSubmit={save}
  resolver={zodResolver(schema)}
  defaultValues={d}
  header={{ title: "Item", variant: "new" }}
  actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}
>
  <FormRenderer.Section title="Identity" color="Blue">
    <FormBuilder.Text name="name" label="Name" required />
    <FormBuilder.Currency name="price" label="Price" currencySymbol="$" />
  </FormRenderer.Section>
</FormRenderer>
```

## Compound parts

| Part                                        | What it is                                                                     |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| `FormRenderer.Section`                      | A titled `SectionBlock` card grouping fields (or display rows).                 |
| `FormRenderer.Stepper` / `.Step`            | The wizard — see [Stepper](#stepper).                                          |
| `FormRenderer.Back` / `.Next`               | Chevron step controls. The header's action bar prepends them for you.           |
| `FormRenderer.Sidebar` / `.Tab`             | The display-only [detail-tabs](#detail-tabs-sidebar) view.                     |
| `FormRenderer.Grid` / `.Row`                | Read-only display cells inside a detail tab.                                    |

### `FormRenderer.Section`

Props `title`, `color`, `icon`, `action`, `variant`. It groups fields in a Glare `SectionBlock`:
`color` is one of `Blue`, `Yellow`, `Green`, `Red`, `Orange`, `Purple`, `Pink`, `Gray`; `action`
puts buttons on the title row; `variant="Table"` switches to the full-bleed table shell (what
`FormBuilder.Table` uses internally).

It holds no form state, which is why it lives here and not on `FormBuilder` — the same component
groups editable fields on a form and read-only `FormRenderer.Row` cells on a detail page.

Because it reads no context, it also works **outside** `<FormRenderer>` — e.g. wrapping fields in a
bare `<FormBuilder>` that you are laying out yourself. It is the one compound part that does.

> Not to be confused with `FieldSection`, the per-field row layout (label · control) that every
> field draws for itself. That one stays inside FormBuilder.

## Installation

```bash
npx torch-glare@latest init
npx torch-glare@latest add FormRenderer
```

`add` also pulls in `FormBuilder`, which FormRenderer renders through.

## Imports

```tsx
import { FormRenderer, FormDrawer } from "@/components/FormRenderer";
import { FormBuilder } from "@/components/FormBuilder";
```

## Props

| Prop                                                           | Type                          | Notes                                                                                                                                                                                                                                                                            |
| -------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children`                                                     | `ReactNode`                   | The form body — `FormRenderer.Section` / field / `FormRenderer.Stepper` JSX.                                                                                                                                                                                                       |
| `onSubmit?` / `onInvalid?`                                     | fns                           | Submit / validation-fail callbacks. Optional — a detail-tabs view has no form, so omit them there.                                                                                                                                                                               |
| `resolver`                                                     | `Resolver`                    | Any react-hook-form resolver, e.g. `zodResolver(schema)`.                                                                                                                                                                                                                        |
| `defaultValues` / `values`                                     | `DefaultValues` / `T`         | Initial values; `values` re-syncs on change (edit).                                                                                                                                                                                                                              |
| `loading` / `resetOnSuccess`                                   | `boolean`                     | Forwarded to `FormBuilder`.                                                                                                                                                                                                                                                      |
| `fieldDirection`                                               | `'horizontal' \| 'vertical' \| 'flexible'`  | Unset means responsive: stacked, then label-beside-control once the field row passes the container `md` breakpoint. A drawer defaults to `'vertical'` — pass `'flexible'` there to get the responsive layout back.                                                                                                                                                                                                                                            |
| `form`                                                         | `UseFormReturn<T>`            | A hoisted `useForm` to bind to — pass when a sibling (e.g. a `summary` `FormSummary`) must read the same live values; the caller owns `resolver`/`defaultValues` on it. Omit to let FormRenderer create its own.                                                                 |
| `className`                                                    | `string`                      | Lands on FormRenderer's outermost element (page display) — e.g. `"min-h-0 flex-1"` to fill a flex column. Note this is the page frame, not the `<form>`; `FormBuilder`'s own `className` lands on the `<form>` element itself.                                                    |
| `display`                                                      | `'page' \| 'drawer'`          | `'drawer'` wraps the form in `FormDrawer`.                                                                                                                                                                                                                                       |
| `header`                                                       | `{ title; label?; variant? }` | Absolute title header + action bar (page display); `actions` render in it.                                                                                                                                                                                                       |
| `summary`                                                      | `ReactNode`                   | A live panel (typically `FormSummary`) rendered beside the form (page) or in the drawer tray (drawer). Give the same hoisted `form` so it reads live values. On a page, a `summary` **plus** a `FormRenderer.Stepper` lays out as three columns — stepper nav · fields · summary. |
| `actions`                                                      | `ReactNode`                   | The form's action bar — rendered in the header action pill (page) or drawer header (drawer). Put the Save here: `actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}`. A bare `FormBuilder.Submit` auto-targets this form.                                                   |
| `id`                                                           | `string`                      | `id` on the underlying `<form>`. Optional — FormRenderer generates and wires one otherwise.                                                                                                                                                                                      |
| `open` / `onOpenChange` / `title` / `badge` / `onOpenInNewTab` | —                             | Drawer control (when `display="drawer"`). `title` / `badge` are strings that override `header.title` / `header.label`.                                                                                                                                                           |

## Drawer

```tsx
// drawer — pass the Save via `actions`; it renders in the drawer header
<FormRenderer
  display="drawer"
  open={open}
  onOpenChange={setOpen}
  title="New item"
  badge="New"
  onSubmit={save}
  resolver={r}
  defaultValues={d}
  actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}
>
  {fields}
</FormRenderer>
```

## Stepper

Drop a `FormRenderer.Stepper` in as the child. The Save lives in the header `actions` and
submits every step's registered fields at once (steps stay mounted, so the whole form is live).

For a stepper, FormRenderer **automatically prepends chevron Back/Next nav + a divider** before
your Submit, so the action bar reads `[◀] [▶] │ Save`. Back is disabled on the first step; Next
validates the current step, then advances (disabled on the last step). A step that passes
validation **stays checked** in the rail — even after you navigate back — while a live validation
error overrides it to red. You still pass just the Submit; the nav is wired for you:

```tsx
<FormRenderer
  onSubmit={save}
  resolver={r}
  defaultValues={d}
  header={{ title: "New item", variant: "new" }}
  actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}
>
  <FormRenderer.Stepper>
    <FormRenderer.Step title="Basics">
      <FormBuilder.Text name="name" label="Name" required />
    </FormRenderer.Step>
  </FormRenderer.Stepper>
</FormRenderer>
```

## Detail tabs (sidebar)

Give FormRenderer `FormRenderer.Sidebar` + `FormRenderer.Tab` children (instead of fields) and it
switches to a **display-only detail page**: a left **sidebar** where each item swaps in its matching
tab panel — no `<form>`, no submit. The sidebar sits **where a stepper's rail would**, and only the
active panel shows (built on the same Radix Tabs primitive shadcn uses, so it's keyboard-accessible).
Pair it with `header` (`variant="detail"` → a "View" badge) + `actions` (Print / Approve / …).

Each `Tab` holds read-only `FormRenderer.Section` blocks; `FormRenderer.Grid` + `FormRenderer.Row` lay
out the label/value display cells (the display counterpart of form fields).

```tsx
<FormRenderer
  header={{ title: "Order DE-344", variant: "detail" }}
  actions={<Button variant="BorderStyle">Print</Button>}
>
  {/* The rail — one Item per tab, tied to a Tab by `value`. */}
  <FormRenderer.Sidebar>
    <FormRenderer.Sidebar.Item value="overview" icon={<i className="ri-layout-grid-line" />}>
      Overview
    </FormRenderer.Sidebar.Item>
    <FormRenderer.Sidebar.Item value="items" icon={<i className="ri-table-line" />}>
      Items Table
    </FormRenderer.Sidebar.Item>
  </FormRenderer.Sidebar>

  {/* One panel per tab — read-only Section blocks. */}
  <FormRenderer.Tab value="overview">
    <FormRenderer.Section title="Main Information" color="Blue">
      <FormRenderer.Grid>
        <FormRenderer.Row label="PO Number" value="PO-000123" />
        <FormRenderer.Row label="Status" value={<Badge label="Submitted" color="yellow" />} />
      </FormRenderer.Grid>
    </FormRenderer.Section>
  </FormRenderer.Tab>

  <FormRenderer.Tab value="items">…</FormRenderer.Tab>
</FormRenderer>
```

| Component      | Props                      | Renders                                                            |
| -------------- | -------------------------- | ------------------------------------------------------------------ |
| `Sidebar`      | `children`                 | The tab rail (a Radix `Tabs.List`), fixed at the stepper's place.  |
| `Sidebar.Item` | `value`, `icon?`, children | A rail nav row (a `Tabs.Trigger`); the active one is a black pill. |
| `Tab`          | `value`, children          | A content panel (a `Tabs.Content`) shown when its tab is active.   |
| `Grid`         | `columns?` (1–3), children | A padded grid of display `Row`s (default 2 columns).               |
| `Row`          | `label`, `value`           | A read-only label/value display cell.                              |

The first `Tab` is active by default. Only the active panel is visible; the rail stays fixed while the
content column scrolls.

## Summary panel

Pass a hoisted `useForm` as `form` and a `FormSummary` as `summary` — FormRenderer binds
the form to that instance and lays the panel beside the form (page) or in the drawer tray
(drawer), so it recomputes live as fields change.

```tsx
const form = useForm<Invoice>({ resolver, defaultValues })

<FormRenderer
  form={form}
  onSubmit={save}
  header={{ title: 'Invoice', variant: 'new' }}
  actions={<FormBuilder.Submit>Save invoice</FormBuilder.Submit>}
  summary={
    <FormSummary form={form} title="Invoice" subtitle="Summary">
      <FormSummary.Group title="Total">
        <FormSummary.Row label="Overall Total" emphasized compute={overallTotal} />
      </FormSummary.Group>
    </FormSummary>
  }
>
  {fields}
</FormRenderer>
```

Works with `display="drawer"` too — the summary moves into the drawer's tray.

## `FormDrawer` — the drawer wrapper

`FormRenderer` uses `FormDrawer` internally for `display: 'drawer'`. It's also exported
so you can put a hand-composed `FormBuilder` in a drawer directly. Since the header sits
outside the `<form>`, wire the Save button to the form via `id` / `form={id}`:

```tsx
<FormDrawer
  open={open}
  onOpenChange={setOpen}
  title="New item"
  badge="New"
  actions={
    <Button type="submit" form="item-form" is_loading={saving}>
      Save
    </Button>
  }
>
  <FormBuilder
    id="item-form"
    onSubmit={save}
    resolver={r}
    defaultValues={d}
    fieldDirection="vertical"
  >
    …fields…
  </FormBuilder>
</FormDrawer>
```

`FormDrawer` props: `open`, `onOpenChange`, `title`, `badge`, `variant`, `actions`,
`onOpenInNewTab`, `children`, `summary`. It owns no form state.

### The title

The drawer renders the **same floating header as the page form** — a [HeaderBar](./header-bar.md)
title pill on the left, a dark action pill on the right — so a form's title looks identical in
either display. `title` is the plain (uppercased) text, `badge` the colored emphasis pill, and
`variant` (`new` / `edit` / `detail`) picks the badge colors; `badge` defaults from it
(New / Edit / View).

```tsx
<FormDrawer title="Sales Invoice" badge="New" variant="new" … />
```

Driving it through `FormRenderer`, the `header` prop feeds both displays — including
`header.variant`, which the drawer previously ignored:

```tsx
<FormRenderer display="drawer" header={{ title: "Sales Invoice", variant: "edit" }} … />
```

`title` and `badge` are **plain strings** (they were `ReactNode` before this shared-header
change) because they render through `HeaderBar`'s uppercase text treatment.

### A summary beside the form

`summary` renders a conclusion panel — typically a [FormSummary](./form-summary.md) — _beside_
the form rather than inside its scrollable body. `FormDrawer` puts the form in a
[`DrawerPanel`](./drawer.md#drawerpanel) (the light surface) and the summary next to it with a
6px gutter; the tray paints nothing, so the summary keeps its own dark background and full
height, scrolling internally when it outruns the drawer.

Hoist the form so both read the same instance:

```tsx
const form = useForm({ resolver, defaultValues })

<FormDrawer
  open={open} onOpenChange={setOpen} title="New item" badge="New"
  summary={
    <FormSummary form={form} title="Item" subtitle="Summary">
      <FormSummary.Group title="Pricing">…rows…</FormSummary.Group>
    </FormSummary>
  }
>
  <FormBuilder form={form} id="item-form" onSubmit={save} fieldDirection="vertical">
    …fields…
  </FormBuilder>
</FormDrawer>
```

> `childrenOutside` is the deprecated former name for `FormDrawer`'s `summary`. It still
> works — it long predates the FormBuilder/FormRenderer split and is unrelated to it (that
> move ships no aliases; see the
> [migration note](../migration/form-builder-2.5.2.md)).

`FormRenderer` forwards `summary` straight into the drawer tray, so you rarely need
`FormDrawer` directly — reach for it only when you want the drawer without a form.
