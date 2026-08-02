---
title: DataViews
description: Compound multi-view layout that renders any backend response as Table, Kanban, Inbox, and/or Tree. Write the views you want as children; each registers its own tab.
group: Data Display
keywords: [data-views, compound, layout, table, kanban, inbox, tree, multi-view, filter, switcher, dashboard, dynamic-data, fields]
---

# DataViews

> One backend response → many UI shapes. Pass an array of records plus a declarative list of
> fields. Render `<DataViews />` for the standard screen, or compose `<DataViews.Root>` with the
> parts you want when you need a different arrangement.

## Installation

TORCH Glare is a copy-in library: the CLI copies this component's source into your project
(you do **not** install it from the npm package). Run `init` once, then `add`:

```bash
npx torch-glare@latest init
npx torch-glare@latest add DataViews
```

`DataViews` is a folder component — the CLI copies `components/DataViews/`,
`utils/dataViews/`, and the `useDataViewsState` / `useViewData` / `useIsMobile` hooks, and
installs the peer deps (`@radix-ui/react-slider`, `react-day-picker`, `vaul`, …).

## Quick start

```tsx
import { DataViews, type FieldConfig } from "@/components/DataViews";

const fields: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "customer", label: "Customer", type: "text" },
  {
    path: "status",
    type: "enum-badge",
    variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" },
    filterable: true,
  },
  { path: "total", type: "currency", currency: "USD", filterable: true },
];

<DataViews title="Orders" data={orders} fields={fields} />;
```

That renders the header, all four view tabs, and the config rail. To limit the tabs:

```tsx
<DataViews title="Orders" data={orders} fields={fields} views={{ table: true, kanban: true }} />
```

## Compound form

`<DataViews />` is a thin arrangement of the parts below — anything it does, you can write
yourself. Reach for the compound form when you need a different header, a different tab order,
or per-view options.

```tsx
<DataViews.Root data={orders} fields={fields}>
  <DataViews.Header title="Orders">
    <DataViews.ViewSwitch />
    <DataViews.Spacer />
    <DataViews.Search value={q} onChange={setQ} placeholder="Search orders…" />
    <DataViews.Action onClick={onCreate}>New order</DataViews.Action>
    <DataViews.ConfigTrigger />
  </DataViews.Header>

  <DataViews.Kanban groupBy="status" titleField="customer" />
  <DataViews.Table />
  <DataViews.Inbox itemHref={(item, id) => `/orders/${id}`} linkComponent={Link} />
  <DataViews.Tree childrenField="children" />

  <DataViews.ConfigPanel />
</DataViews.Root>
```

**Tabs come from the JSX.** Each view registers itself with the switcher on mount, in the order
you wrote it — above, "Board" is the first tab because `DataViews.Kanban` is written first. To
relabel a tab, pass `label`. To drop a view, delete its element. There is no separate `views`
list to keep in sync.

## Parts

| Part | Role |
| --- | --- |
| `DataViews` | Config-driven preset — the standard screen in one element |
| `DataViews.Root` | Owns all state; lays out the header / view / config-rail grid |
| `DataViews.Header` | The top bar. Takes a `title` and arbitrary children |
| `DataViews.Spacer` | Pushes subsequent header children to the right edge |
| `DataViews.ViewSwitch` | Segmented tab bar over the registered views |
| `DataViews.Search` | Collapsible search box (controlled) |
| `DataViews.Action` | Primary header button |
| `DataViews.ConfigTrigger` | Opens the config rail; hides itself while open |
| `DataViews.Table` | Sortable, selectable record table |
| `DataViews.Kanban` | Drag-and-drop board grouped by an enum field |
| `DataViews.Inbox` | Three-pane mail-style list |
| `DataViews.Tree` | Two-pane explorer; auto-hides when the data is flat |
| `DataViews.ConfigPanel` | Right rail: saved views, columns, sort, filters |

## `DataViews.Root` props

| Prop | Type | Notes |
| --- | --- | --- |
| `data` | `DynamicRecord[]` | Any array of plain objects |
| `fields` | `FieldConfig[]` | Declarative field map. Auto-detected when omitted |
| `config` | `Partial<ViewConfig>` | `defaultView`, `sortBy`, `sortOrder`, `kanbanGroupBy`, … |
| `treeConfig` | `TreeConfig` | Hierarchy hints; also drives tree auto-detection |
| `filterState` | `FilterState` | Controlled filters — pass `onFilterChange` to own them |
| `onFilterChange` | `(f: FilterState) => void` | |
| `theme` | `"dark" \| "light" \| "default"` | Applied as `data-theme` |

## Per-view props

Each view owns its own options — they are not threaded through the root.

```tsx
<DataViews.Table selectedIds={ids} onSelectionChange={setIds} label="Rows" />

<DataViews.Kanban groupBy="status" titleField="customer" onColumnAction={openMenu} />

<DataViews.Inbox
  config={{ starredField: "isStarred", priorityField: "priority" }}
  itemHref={(item, id) => `/orders/${id}`}
  linkComponent={Link}
  selectedId={routeId}
  renderDetail={(item) => <OrderDetail order={item} />}
/>

<DataViews.Tree childrenField="children" defaultExpanded="roots" defaultRightPane="table" />
```

`DataViews.Tree` spreads `TreeConfig` directly, so `childrenField`, `parentField`, `idField`,
`nodeLabel`, `defaultExpanded`, `defaultRightPane`, and `dndEnabled` are all top-level props.

## Filtering

Filters live in the config rail (`DataViews.ConfigPanel` → Filters tab) and apply to whichever
view is active. A field becomes filterable when:

1. `filterable: true` (explicit), or
2. its type is `enum-badge`, `boolean`, `badge-array`, or `icon-text` (automatic), or
3. it is plain text with ≤10 distinct values (heuristic).

Numeric and date fields require explicit `filterable: true`; they render range sliders and date
pickers respectively.

```ts
type FilterValue =
  | string[]                                      // categorical
  | { kind: "number"; min?: number; max?: number } // numeric range
  | { kind: "date"; from?: string; to?: string };  // date range, ISO YYYY-MM-DD
```

## Editing records

Views receive a **filtered** (and usually flattened) projection of your data, never the whole
set. So edit by id — `updateRecord` applies the change to the original dataset, recursing into
nested children:

```tsx
const { updateRecord } = useDataViews();

updateRecord(orderId, (record) => setByPath(record, "status", "Shipped"));
```

Building a new array from what a view can see and passing it to `onDataUpdate` would delete every
record the active filter is hiding. `onDataUpdate` exists for genuinely wholesale replacement
(reordering an entire tree) — not for single-record edits.

## Escape hatches

For a layout the compound parts don't cover:

```tsx
import { useDataViews, useViewData, TableGrid, ViewSurface } from "@/components/DataViews";

function MyView() {
  const { config, setConfig } = useDataViews();      // full Root state
  const { records, displayFields } = useViewData();  // filtered + sorted records
  return <ViewSurface>{/* … */}</ViewSurface>;
}
```

`useRegisterView({ id, label, icon })` registers a custom view with the tab bar and returns
whether it is currently active — that is all `DataViews.Table` and friends do.

## Development warnings

In development (stripped from production builds) DataViews warns about silent misconfiguration:
two views claiming the same id, a `groupBy` that matches no field, and `selectedIds` supplied
without `onSelectionChange`. Each fires once.

## Related

- [`table-view`](./table-view.md), [`kanban-view`](./kanban-view.md),
  [`inbox-view`](./inbox-view.md), [`tree-view`](./tree-view.md)
- [`data-views-config-panel`](./data-views-config-panel.md)
- How-to: [rendering a backend response](../how-to/data-views-from-backend-response.md)
