---
title: DataViews.Table
description: The table view of DataViews — sortable columns, row selection, responsive card fallback. Registers itself as the "table" tab.
group: Data Display
keywords: [data-views, table-view, table, sortable, columns, selection, compound, dynamic-data, fields]
---

# DataViews.Table

> Sortable record table. Renders inside `<DataViews.Root>`; registers itself with the tab bar and
> shows only while it is the active view.

## Usage

```tsx
<DataViews.Root data={orders} fields={fields}>
  <DataViews.Header title="Orders">
    <DataViews.ViewSwitch />
  </DataViews.Header>

  <DataViews.Table />
</DataViews.Root>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `selectedIds` | `readonly unknown[]` | — | Checked row ids. Omit to let the table own selection internally |
| `onSelectionChange` | `(ids: unknown[]) => void` | — | Pass with `selectedIds` for controlled selection |
| `label` | `string` | `"List"` | Tab label in the view switcher |
| `className` | `string` | — | Applied to the view surface |

Row identity comes from `getRecordId` — a literal `id` on the record, else the first visible
field's value, else the array index. Selection, React keys, and drag targeting all agree because
every view uses that one helper.

## Sorting

Column headers are sortable and write through to `config.sortBy` / `config.sortOrder` on the
Root, so header clicks and the config rail's **Default Sort** section stay in sync. Set an
initial sort with:

```tsx
<DataViews.Root data={orders} fields={fields} config={{ sortBy: "total", sortOrder: "desc" }}>
```

## Which columns render

Visible fields in `order`, driven by `config.tableColumns` — which the config rail edits (toggle
visibility, drag to reorder). Fields typed `hidden` or with `visible: false` never render.

## Responsive

Below 768px the table collapses to one `Card` per record: the first visible field becomes the
title, the rest become key/value rows.

## Reusing the grid

`TableGrid` is the presentational table with no dependency on the DataViews context — it takes
records, fields, sort state, and selection state as props. `DataViews.Tree` uses it for its
right pane; use it directly if you need a table over an arbitrary record subset.

```tsx
import { TableGrid } from "@/components/DataViews";
```

## Related

- [`data-views`](./data-views.md) — the root and the full parts list
- [`data-views-config-panel`](./data-views-config-panel.md) — column visibility and order
