---
title: TreeView
description: Standalone hierarchical tree view for DataViews — a sidebar tree of nodes with a right pane (table or card) for the selected node. Use inside DataViewsLayout (tab mode) or directly in Composable Mode.
group: Data Display
keywords: [data-views, tree-view, tree, hierarchy, nested, sidebar, parent-child, children, composable, dynamic-data]
---

# TreeView

> The tree renderer behind `DataViewsLayout`'s "Tree" tab. It builds a hierarchy from your records (via a `children[]` array or a `parentId` reference) and shows a sidebar tree with a right pane for the selected node. In tab mode the layout renders it for you — and auto-hides the Tree tab when no hierarchy is detected. Render it directly only in **Composable Mode**.

## Installation

Part of `torch-glare`. Ships with the `DataViews` folder when you run `npx torch-glare add DataViews` — no separate install. It reuses the sibling `TableView`, the `Card` component, a colocated tree sidebar/drawer, and `lucide-react`.

## Import

```tsx
import { TreeView, useDataViewsState } from "torch-glare"
import type { TreeViewProps, TreeConfig, FieldConfig } from "torch-glare"
```

## When to use it directly

| Situation | Use |
|---|---|
| You want the standard tabbed multi-view UI | `DataViewsLayout` — the Tree tab appears automatically when hierarchy is detected. |
| You want a custom layout with an always-on tree | Render `TreeView` directly with state from `useDataViewsState`. |
| You want a file/folder tree without the data-grid pane | Use [`TreeFolder`](./tree-drop-down.md) or [`TreeSubLayout`](./tree-sub-layout.md) instead. |

## Hierarchy detection

`TreeView` auto-detects shape from your data. Override with `treeConfig`:

- **Nested** — each record carries a `children: []` array.
- **Flat / adjacency list** — each record carries a `parentId` (or similar) pointing at its parent's id.

```tsx
// nested
const departments = [
  { id: 1, name: "Engineering", children: [
    { id: 2, name: "Platform" },
    { id: 3, name: "Product" },
  ]},
]

// flat
const rows = [
  { id: 1, name: "Engineering", parentId: null },
  { id: 2, name: "Platform", parentId: 1 },
]
```

## Composable Mode example

```tsx
import { TreeView, useDataViewsState } from "torch-glare"
import type { FieldConfig, TreeConfig } from "torch-glare"

const fields: FieldConfig[] = [
  { path: "name", type: "text" },
  { path: "headcount", type: "number" },
]

const treeConfig: TreeConfig = {
  childrenField: "children",
  nodeLabel: "name",
  defaultExpanded: "roots",      // "all" | "roots" | "none"
  defaultRightPane: "table",     // "table" | "card"
}

function OrgTree() {
  const state = useDataViewsState({ data: departments, fields, treeConfig })
  return (
    <TreeView
      data={state.items}
      fields={state.resolvedFields}
      config={state.config}
      treeConfig={treeConfig}
    />
  )
}
```

## API Reference

### `TreeViewProps`

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `DynamicRecord[]` | — (required) | Records to build the hierarchy from. Pass `state.items` (nested) in composable mode. |
| `fields` | `FieldConfig[]` | — (required) | Field map for the right-pane table/card. Pass `state.resolvedFields`. |
| `config` | `ViewConfig` | — (required) | View config from `useDataViewsState`. |
| `treeConfig` | `TreeConfig` | auto-detected | Hierarchy + expansion + right-pane config (see below). |
| `columns` | `DynamicColumnConfig[]` | `undefined` | Explicit column overrides for the right-pane table. |
| `onDataUpdate` | `(data: DynamicRecord[]) => void` | `undefined` | Called when nodes move (drag-and-drop reparent), if `dndEnabled`. |
| `filters` | `DynamicFilterConfig[]` | `undefined` | Explicit filter definitions. Usually inferred from `filterable` fields. |
| `filterState` | `FilterState` | uncontrolled | Controlled filter state. Pair with `onFilterChange`. |
| `onFilterChange` | `(filters: FilterState) => void` | `undefined` | Fires when a filter changes. |
| `showFilters` | `boolean` | `true` | Show the integrated filter panel. |

### `TreeConfig`

```ts
type TreeConfig = {
  childrenField?: string      // nested mode: array property holding children
  parentField?: string        // flat mode: property pointing at the parent id
  idField?: string            // id property (default "id")
  orderField?: string         // optional ordering within siblings
  nodeLabel?: string          // which field labels each tree node
  defaultExpanded?: "all" | "roots" | "none"
  defaultRightPane?: "table" | "card"   // "details" accepted as a deprecated alias of "card"
  dndEnabled?: boolean        // enable drag-and-drop reparenting
}
```

See [`DataViewsLayout`](./data-views-layout.md#fieldconfig) for `FieldConfig`,
`FilterState`, and related shapes.

## Accessibility

- Tree rows expose `role="treeitem"` with `aria-expanded` and `aria-selected`.
- On mobile the sidebar collapses into a drawer with a labelled trigger.
- The right-pane table inherits [`TableView`](./table-view.md)'s accessibility.

## Theming

Uses only `*-presentation-*` design tokens. Control the scheme via the parent
`DataViewsLayout`'s `theme`.

## Related

- [`DataViewsLayout`](./data-views-layout.md) — the tabbed container that renders this for you
- [`TableView`](./table-view.md) · [`KanbanView`](./kanban-view.md) · [`InboxView`](./inbox-view.md) — sibling views
- [`TreeFolder`](./tree-drop-down.md) / [`TreeSubLayout`](./tree-sub-layout.md) — non-grid tree navigation
- [How-to: Render a backend response with DataViews](../how-to/data-views-from-backend-response.md)
