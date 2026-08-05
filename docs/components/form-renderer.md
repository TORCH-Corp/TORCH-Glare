---
title: FormRenderer
description: A thin wrapper around FormBuilder. Author fields as JSX children; FormRenderer owns page-vs-drawer display, the absolute title header, and drawer field layout. You compose the Save and pass it via the actions prop.
component: true
group: Forms
keywords: [form-renderer, form, drawer, header, display, actions, react-hook-form]
---

# FormRenderer

A thin wrapper around the compound [FormBuilder](./form-builder.md). You author the
fields as **JSX children** exactly as you would with `FormBuilder`; `FormRenderer`
takes care of the surrounding concerns:

- **page vs drawer** display (`display="drawer"` hosts the form in a `FormDrawer`),
- the **absolute title header** + action bar (page display),
- **vertical field layout** inside a drawer.

FormRenderer has **two modes**: a **form** (author fields as children, as below), or a display-only
**detail page** — give it `FormRenderer.Sidebar` + `FormRenderer.Tab` children instead of fields and the
sidebar swaps `FormBuilder.Section` panels (no `<form>`, no submit — see [Detail tabs](#detail-tabs-sidebar)).

FormRenderer never manufactures a Submit — **you compose the Save and hand it to `actions`**.
It renders in the form's header action pill (page) or the drawer header (drawer), and a bare
`<FormBuilder.Submit>` auto-targets this form (even though the header sits outside the `<form>`).

Reach for `FormBuilder` directly when you just want the form. Reach for
`FormRenderer` when you want the same form to render as a page _or_ a drawer with
the standard chrome.

```tsx
<FormRenderer
  onSubmit={save}
  resolver={zodResolver(schema)}
  defaultValues={d}
  header={{ title: "Item", variant: "new" }}
  actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}
>
  <FormBuilder.Section title="Identity" color="Blue">
    <FormBuilder.Text name="name" label="Name" required />
    <FormBuilder.Currency name="price" label="Price" currencySymbol="$" />
  </FormBuilder.Section>
</FormRenderer>
```

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
| `children`                                                     | `ReactNode`                   | The form body — `FormBuilder.Section` / field / `FormBuilder.Stepper` JSX.                                                                                                                                                                                                       |
| `onSubmit?` / `onInvalid?`                                     | fns                           | Submit / validation-fail callbacks. Optional — a detail-tabs view has no form, so omit them there.                                                                                                                                                                               |
| `resolver`                                                     | `Resolver`                    | Any react-hook-form resolver, e.g. `zodResolver(schema)`.                                                                                                                                                                                                                        |
| `defaultValues` / `values`                                     | `DefaultValues` / `T`         | Initial values; `values` re-syncs on change (edit).                                                                                                                                                                                                                              |
| `loading` / `resetOnSuccess`                                   | `boolean`                     | Forwarded to `FormBuilder`.                                                                                                                                                                                                                                                      |
| `fieldDirection`                                               | `'horizontal' \| 'vertical'`  | Defaults to vertical inside a drawer.                                                                                                                                                                                                                                            |
| `form`                                                         | `UseFormReturn<T>`            | A hoisted `useForm` to bind to — pass when a sibling (e.g. a `summary` `FormSummary`) must read the same live values; the caller owns `resolver`/`defaultValues` on it. Omit to let FormRenderer create its own.                                                                 |
| `display`                                                      | `'page' \| 'drawer'`          | `'drawer'` wraps the form in `FormDrawer`.                                                                                                                                                                                                                                       |
| `header`                                                       | `{ title; label?; variant? }` | Absolute title header + action bar (page display); `actions` render in it.                                                                                                                                                                                                       |
| `summary`                                                      | `ReactNode`                   | A live panel (typically `FormSummary`) rendered beside the form (page) or in the drawer tray (drawer). Give the same hoisted `form` so it reads live values. On a page, a `summary` **plus** a `FormBuilder.Stepper` lays out as three columns — stepper nav · fields · summary. |
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

Drop a `FormBuilder.Stepper` in as the child. The Save lives in the header `actions` and
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
  <FormBuilder.Stepper>
    <FormBuilder.Step title="Basics">
      <FormBuilder.Text name="name" label="Name" required />
    </FormBuilder.Step>
  </FormBuilder.Stepper>
</FormRenderer>
```

## Detail tabs (sidebar)

Give FormRenderer `FormRenderer.Sidebar` + `FormRenderer.Tab` children (instead of fields) and it
switches to a **display-only detail page**: a left **sidebar** where each item swaps in its matching
tab panel — no `<form>`, no submit. The sidebar sits **where a stepper's rail would**, and only the
active panel shows (built on the same Radix Tabs primitive shadcn uses, so it's keyboard-accessible).
Pair it with `header` (`variant="detail"` → a "View" badge) + `actions` (Print / Approve / …).

Each `Tab` holds read-only `FormBuilder.Section` blocks; `FormRenderer.Grid` + `FormRenderer.Row` lay
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
    <FormBuilder.Section title="Main Information" color="Blue">
      <FormRenderer.Grid>
        <FormRenderer.Row label="PO Number" value="PO-000123" />
        <FormRenderer.Row label="Status" value={<Badge label="Submitted" color="yellow" />} />
      </FormRenderer.Grid>
    </FormBuilder.Section>
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

> `childrenOutside` is the deprecated former name for `summary`. It still works.

`FormRenderer` forwards `summary` straight into the drawer tray, so you rarely need
`FormDrawer` directly — reach for it only when you want the drawer without a form.
