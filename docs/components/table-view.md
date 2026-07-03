---
title: TableView
description: Standalone table view for DataViews — sortable columns, row selection, and an integrated filter panel. Use inside DataViewsLayout (tab mode) or directly in Composable Mode.
group: Data Display
keywords: [data-views, table-view, table, sortable, columns, selection, filter, composable, dynamic-data, fields]
---

# TableView

> The table renderer behind `DataViewsLayout`'s "List" tab. In tab mode the layout renders it for you. Render it directly only in **Composable Mode** (custom layouts), wiring it with `useDataViewsState`.

## Installation

Part of `torch-glare`. Ships with the `DataViews` folder when you run `npx torch-glare add DataViews` — no separate install. It depends on the shared `Card`, `Checkbox`, and `Table` components plus the colocated `FilterPanel`.

## Import

```tsx
import { TableView, useDataViewsState } from "torch-glare"
import type { TableViewProps, FieldConfig } from "torch-glare"
```

## When to use it directly

| Situation | Use |
|---|---|
| You want the standard tabbed multi-view UI | `DataViewsLayout` — it mounts `TableView` for you. Don't render this yourself. |
| You want a custom layout (e.g. table beside a kanban) | Render `TableView` directly with state from `useDataViewsState`. |
| You only ever need a table and nothing else | Render `TableView` directly, or just use the simpler [`Table`](./table.md) / [`DataTable`](./data-table.md). |

## Composable Mode example

`TableView` is controlled — it does not own field detection or config. Pull those from `useDataViewsState` (which auto-detects fields and columns from your data) and pass them down.

```tsx
import { TableView, useDataViewsState } from "torch-glare"
import type { FieldConfig } from "torch-glare"

const employees = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", salary: 120000, joinDate: "2024-04-12" },
  { id: 2, name: "Linus Torvalds", role: "Engineer", salary: 145000, joinDate: "2023-09-01" },
]

const fields: FieldConfig[] = [
  { path: "name", label: "Name", type: "text" },
  { path: "role", type: "text", filterable: true },
  { path: "salary", type: "currency", currency: "USD" },
  { path: "joinDate", type: "date-format", dateFormat: "YYYY-MM-DD" },
]

function EmployeesTable() {
  const state = useDataViewsState({ data: employees, fields })
  return (
    <TableView
      data={state.flatItems}
      fields={state.resolvedFields}
      config={state.config}
      onSortChange={(sortBy, sortOrder) =>
        state.setConfig({ ...state.config, sortBy, sortOrder })
      }
      filterState={state.filterState}
      onFilterChange={state.setFilterState}
    />
  )
}
```

### Hide the inline filter panel

```tsx
<TableView
  data={state.flatItems}
  fields={state.resolvedFields}
  config={state.config}
  showFilters={false}
/>
```

### Controlled sorting

`TableView` does not sort internally — it calls `onSortChange` and reads the
active sort from `config.sortBy` / `config.sortOrder`. Wire it to your config
state (or your backend) to make headers interactive.

```tsx
<TableView
  data={rows}
  fields={fields}
  config={{ defaultView: "table", sortBy: "name", sortOrder: "asc" }}
  onSortChange={(sortBy, sortOrder) => refetch({ sortBy, sortOrder })}
/>
```

## API Reference

### `TableViewProps`

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `DynamicRecord[]` | — (required) | Flat array of rows to render. In composable mode pass `state.flatItems`. |
| `fields` | `FieldConfig[]` | — (required) | Field map controlling which columns render and how cells format. Pass `state.resolvedFields` for auto-detected fields. |
| `config` | `ViewConfig` | — (required) | View config. `sortBy` / `sortOrder` drive the active sort indicator. |
| `columns` | `DynamicColumnConfig[]` | `undefined` | Explicit column overrides (visibility/order). Usually derived from `fields`. |
| `onDataUpdate` | `(data: DynamicRecord[]) => void` | `undefined` | Called when row data changes (e.g. inline selection). |
| `onSortChange` | `(sortBy: string, sortOrder: "asc" \| "desc") => void` | `undefined` | Fires on header click. When omitted, headers are not sortable. |
| `filters` | `DynamicFilterConfig[]` | `undefined` | Explicit filter definitions. Usually inferred from `filterable` fields. |
| `filterState` | `FilterState` | uncontrolled | Controlled filter state. Pair with `onFilterChange`. |
| `onFilterChange` | `(filters: FilterState) => void` | `undefined` | Fires when a filter changes. When provided, the view is controlled. |
| `showFilters` | `boolean` | `true` | Show the integrated filter panel. |

`DynamicColumnConfig`, `DynamicFilterConfig`, `FilterState`, and `FieldConfig`
share the same shapes documented in
[`DataViewsLayout`](./data-views-layout.md#api-reference).

## Accessibility

- Built on the accessible [`Table`](./table.md) primitive (semantic `<table>` markup, sortable headers).
- Row selection uses `TableCheckbox` with proper labelling.
- Filter checkboxes carry labels and `htmlFor` linkage.

## Theming

Uses only `*-presentation-*` design tokens. Wrap with `ThemeProvider` or pass a
`theme` to the parent `DataViewsLayout` to control the color scheme.

## Related

- [`DataViewsLayout`](./data-views-layout.md) — the tabbed multi-view container that renders this for you
- [`KanbanView`](./kanban-view.md) · [`InboxView`](./inbox-view.md) · [`TreeView`](./tree-view.md) — the sibling views
- [`Table`](./table.md) / [`DataTable`](./data-table.md) — lower-level table components
- [How-to: Render a backend response with DataViews](../how-to/data-views-from-backend-response.md)
