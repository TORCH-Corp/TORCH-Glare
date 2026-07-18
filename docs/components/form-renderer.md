---
title: FormRenderer
description: A thin wrapper around FormBuilder. Author fields as JSX children; FormRenderer owns page-vs-drawer display, the absolute title header, drawer field layout, and Submit placement.
component: true
group: Forms
keywords: [form-renderer, form, drawer, header, display, view-mode, react-hook-form]
---

# FormRenderer

A thin wrapper around the compound [FormBuilder](./form-builder.md). You author the
fields as **JSX children** exactly as you would with `FormBuilder`; `FormRenderer`
takes care of the surrounding concerns:

- **page vs drawer** display (`display="drawer"` hosts the form in a `FormDrawer`),
- the **absolute title header** + action bar (page display),
- **vertical field layout** inside a drawer,
- **Submit placement** — in the header, in the drawer header (via `form={id}`), or a
  bottom row — including deferring to `FormBuilder.Stepper`, which renders its own.

Reach for `FormBuilder` directly when you just want the form. Reach for
`FormRenderer` when you want the same form to render as a page *or* a drawer with
the standard chrome.

```tsx
<FormRenderer
  onSubmit={save}
  resolver={zodResolver(schema)}
  defaultValues={d}
  header={{ title: 'Item', variant: 'new' }}
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
import { FormRenderer, FormDrawer } from '@/components/FormRenderer'
import { FormBuilder } from '@/components/FormBuilder'
```

## Props

| Prop | Type | Notes |
|---|---|---|
| `children` | `ReactNode` | The form body — `FormBuilder.Section` / field / `FormBuilder.Stepper` JSX. |
| `onSubmit` / `onInvalid` | fns | Submit / validation-fail callbacks. |
| `resolver` | `Resolver` | Any react-hook-form resolver, e.g. `zodResolver(schema)`. |
| `defaultValues` / `values` | `DefaultValues` / `T` | Initial values; `values` re-syncs on change (edit). |
| `mode` | `'edit' \| 'view'` | `'view'` renders read-only, no Submit. |
| `loading` / `resetOnSuccess` | `boolean` | Forwarded to `FormBuilder`. |
| `fieldDirection` | `'horizontal' \| 'vertical'` | Defaults to vertical inside a drawer. |
| `display` | `'page' \| 'drawer'` | `'drawer'` wraps the form in `FormDrawer`. |
| `header` | `{ title; label?; variant? }` | Absolute title header + action bar (page display); Submit moves into it. |
| `submitLabel` | `ReactNode` | Default `"Save"`. |
| `open` / `onOpenChange` / `title` / `badge` / `onOpenInNewTab` | — | Drawer control (when `display="drawer"`). `title` / `badge` are strings that override `header.title` / `header.label`. |

## Drawer & view

```tsx
// drawer — the Save action lands in the drawer header automatically
<FormRenderer
  display="drawer" open={open} onOpenChange={setOpen} title="New item" badge="New"
  onSubmit={save} resolver={r} defaultValues={d}
>
  {fields}
</FormRenderer>

// read-only view — same children
<FormRenderer mode="view" values={entity} onSubmit={() => {}}>
  {fields}
</FormRenderer>
```

## Stepper

Drop a `FormBuilder.Stepper` in as the child — `FormRenderer` detects it and skips
its own Submit (the stepper shows Submit on the last step).

```tsx
<FormRenderer onSubmit={save} resolver={r} defaultValues={d}>
  <FormBuilder.Stepper>
    <FormBuilder.Step title="Basics">
      <FormBuilder.Text name="name" label="Name" required />
    </FormBuilder.Step>
  </FormBuilder.Stepper>
</FormRenderer>
```

## `FormDrawer` — the drawer wrapper

`FormRenderer` uses `FormDrawer` internally for `display: 'drawer'`. It's also exported
so you can put a hand-composed `FormBuilder` in a drawer directly. Since the header sits
outside the `<form>`, wire the Save button to the form via `id` / `form={id}`:

```tsx
<FormDrawer
  open={open} onOpenChange={setOpen} title="New item" badge="New"
  actions={<Button type="submit" form="item-form" is_loading={saving}>Save</Button>}
>
  <FormBuilder id="item-form" onSubmit={save} resolver={r} defaultValues={d} fieldDirection="vertical">
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

`summary` renders a conclusion panel — typically a [FormSummary](./form-summary.md) — *beside*
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

`FormRenderer` does **not** forward `summary` — use `FormDrawer` directly when you need one.
