---
title: FormBuilder 2.5.2 — the chrome moved to FormRenderer
description: FormBuilder now holds only the fields. The section cards, title header and stepper moved to FormRenderer. What to rename, and why.
group: migration
keywords:
  [migration, breaking, form-builder, form-renderer, section, stepper, header, 2.5.2, upgrade]
---

# FormBuilder 2.5.2 — the chrome moved to FormRenderer

**`FormBuilder` is now the fields and nothing else.** Everything drawn *around* the fields —
titled section cards, the page title header, the stepper and its rail, the page gutters, the
scroll shell, the summary column — now lives on [`FormRenderer`](../components/form-renderer.md).

## Why

The split was already documented this way; the code just did not honour it. `FormBuilder` owned a
`rounded-2xl` page shell, a title header that a *child element* switched on, a stepper rail, and a
`conclusion` panel rendered outside its own `<form>` — while its own doc comment described it as
"drawer-unaware". The tell was the `layout="bare"` prop: page framing had been baked in, and
anything embedding a form (a 260px settings rail, a `DataViews` filter panel) needed an escape
hatch to turn it off.

Now there is nothing to escape. A bare `<FormBuilder>` renders a `<form>` and your fields, and
fills whatever it is placed in. `FormRenderer` draws the page.

## What to rename

| Before                  | After                    |
| ----------------------- | ------------------------ |
| `FormBuilder.Section`   | `FormRenderer.Section`   |
| `FormBuilder.Stepper`   | `FormRenderer.Stepper`   |
| `FormBuilder.Step`      | `FormRenderer.Step`      |
| `FormBuilder.Back`      | `FormRenderer.Back`      |
| `FormBuilder.Next`      | `FormRenderer.Next`      |
| `FormBuilder.Header`    | `FormRenderer`'s `header` prop (see below) |

**`FormBuilder.Submit` does not move.** It is the form's own submit button and still
auto-associates with the `<form>` by id, so it works from the header action bar as before.

### Two root props are gone

| Removed                     | Replacement                                                        |
| --------------------------- | ------------------------------------------------------------------ |
| `layout="page" \| "bare"`    | Nothing — bare is the only behaviour. The 1100px cap and 48px gutters are `FormRenderer`'s. Delete the prop. |
| `conclusion={<FormSummary/>}` | `FormRenderer`'s `summary` prop.                                   |

`className` now lands on the `<form>` element itself rather than an outer page wrapper. On
`FormRenderer` it still lands on the outermost element, so `className="min-h-0 flex-1"` behaves
exactly as before.

### `FormBuilder.Header` → the `header` prop

The header was a child that silently reconfigured the root into a scroll-shell layout. It is now
a prop, so a child can no longer change the page around it:

```tsx
// Before
<FormBuilder onSubmit={save} resolver={r} defaultValues={d}>
  <FormBuilder.Header title="Item" variant="new">
    <FormBuilder.Submit>Save</FormBuilder.Submit>
  </FormBuilder.Header>
  <FormBuilder.Section title="Identity" color="Blue">
    <FormBuilder.Text name="name" label="Name" required />
  </FormBuilder.Section>
</FormBuilder>

// After
<FormRenderer
  onSubmit={save}
  resolver={r}
  defaultValues={d}
  header={{ title: "Item", variant: "new" }}
  actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}
>
  <FormRenderer.Section title="Identity" color="Blue">
    <FormBuilder.Text name="name" label="Name" required />
  </FormRenderer.Section>
</FormRenderer>
```

## Doing the upgrade

There is no compatibility shim: the removed parts are gone, so **TypeScript finds every call site
for you**. Re-run the CLI, then let the compiler drive:

```bash
npx torch-glare@latest add FormBuilder FormRenderer --force
npx tsc --noEmit
```

Each error is one of the renames in the table above. If a form used raw `FormBuilder` for a real
page, wrap it in `FormRenderer` — that is where its header, gutters and section cards now come
from.

### Field layout is unchanged

`FieldSection` — the per-field row (label · control · hint) that every field draws for itself — did
**not** move, and no field component changed. After the rename, fields land on exactly the same
pixels; only the `<form>` element's own box changed, because the gutters that used to sit inside it
now sit outside it.

## Installing

`FormRenderer` still depends on `FormBuilder`, never the reverse — `add FormRenderer` pulls both.

The registry moved to match. `FormBuilder` **dropped** `FormStepper` and `HeaderBar`, so
`add FormBuilder` on its own now installs a smaller tree: the fields, and no chrome. `FormRenderer`
**gained** those two plus `SectionBlock` and `Button`.

Note that `FormBuilder` **keeps** its `SectionBlock` dependency even though `FormRenderer.Section`
moved away — `FormBuilder.Table` renders a `SectionBlock variant="Table"` shell of its own, so a
standalone `add FormBuilder` still gets a working table field.
