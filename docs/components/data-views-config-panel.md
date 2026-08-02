---
title: DataViews.ConfigPanel
description: The slide-in right rail for DataViews — Saved View list, show/hide & drag-reorder columns, default sort, and a Filters tab.
group: Data Display
keywords: [data-views, config-panel, settings, filters, columns, reorder, sort, saved-view, side-panel, compound]
---

# DataViews.ConfigPanel

> The config rail. Two tabs: **Config.** (saved views, column visibility and order, default sort)
> and **Filters** (every filterable field).

## Usage

Render it as a child of `DataViews.Root`, alongside a trigger in the header. It reads everything
it needs from the Root — there are no data, config, or filter props to thread.

```tsx
<DataViews.Root data={orders} fields={fields}>
  <DataViews.Header title="Orders">
    <DataViews.ViewSwitch />
    <DataViews.Spacer />
    <DataViews.ConfigTrigger />
  </DataViews.Header>

  <DataViews.Table />
  <DataViews.ConfigPanel />
</DataViews.Root>
```

`<DataViews />` (the preset) includes both unless you pass `showConfig={false}`.

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `savedViews` | `{ id: string; label: string }[]` | Defaults to a single "Default View" row |
| `activeSavedView` | `string` | Controlled selection. Falls back to internal state when omitted |
| `onSavedViewChange` | `(id: string) => void` | |
| `onSaveNewView` | `() => void` | Fires from the "Save a New View" button |
| `className` | `string` | Applied to the rail wrapper |

Saved View is a **presentational shell** — the radio list and button are wired, but nothing is
persisted. Supply the four props above and back them with your own store to make it real.

## Open / close

The Root owns the open/closed intent (`panel.open`), exposed through context; the panel owns its
own mount-through-close animation, so nothing is in the DOM when the rail is shut.

`DataViews.ConfigTrigger` opens it and hides itself while open — the rail has its own close
button, so a second trigger would be redundant. To drive it from elsewhere:

```tsx
const { panel } = useDataViews();
<button onClick={panel.toggle}>Settings</button>;
```

## Config tab

| Section | Writes to | Behaviour |
| --- | --- | --- |
| Saved View | `savedViews` props | Radio list + "Save a New View" |
| Table Columns | `config.tableColumns` | `Switch` per column; drag a row to reorder, with a single insertion line |
| Default Sort | `config.sortBy` | Radio list; direction keeps `config.sortOrder` |

Column changes flow back through the Root, so the table re-renders with the new visibility and
order immediately.

## Filters tab

Renders `FilterPanel` over every filterable field — categorical checkbox lists, numeric range
sliders, and date-range pickers, with a count badge and a Clear control. Because filter state
lives on the Root, a filter set here narrows whichever view is active.

## Theming

The rail is always dark by design (Figma), even in a light host app: it carries
`data-theme="dark"` so child components resolve dark tokens. Style values live in
`components/DataViews/styles.ts`.

## Related

- [`data-views`](./data-views.md) — the root and the full parts list
