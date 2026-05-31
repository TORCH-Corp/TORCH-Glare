---
title: Render a backend response with DataViews
description: Recipes for turning common backend JSON shapes into a DataViewsLayout — flat lists, nested hierarchies, inbox/message shapes, and server-driven filtering.
group: how-to
keywords: [data-views, recipes, backend, json, api, flat, nested, hierarchy, inbox, server-side, filtering, pagination, how-to]
---

# Render a backend response with DataViews

The goal of [`DataViewsLayout`](../components/data-views-layout.md) is "one
backend response → many UI shapes." This guide maps the JSON shapes you get
back from an API to the props that turn them into a working view.

## TL;DR

```tsx
import { DataViewsLayout } from "torch-glare"

// the simplest possible case — just pass the array
<DataViewsLayout title="Records" data={await api.get("/records")} />
```

Everything below is about refining that default for specific shapes.

## Recipe 1 — Flat list of objects

The most common API response. Pass it straight in; every primitive field
becomes a column and the Table/Kanban/Inbox tabs all work. The Tree tab
auto-hides because there's no hierarchy.

```tsx
// GET /employees → [{ id, name, role, salary, joinDate }, ...]
<DataViewsLayout title="Employees" data={employees} />
```

Add a declarative `fields` map when you want typed rendering (currencies,
badges, dates) and filters:

```tsx
import type { FieldConfig } from "torch-glare"

const fields: FieldConfig[] = [
  { path: "name", label: "Name", type: "text" },
  { path: "role", type: "text", filterable: true },
  { path: "salary", type: "currency", currency: "USD", filterable: true },
  { path: "joinDate", type: "date-format", dateFormat: "YYYY-MM-DD" },
]

<DataViewsLayout title="Employees" data={employees} fields={fields} />
```

## Recipe 2 — Status field → Kanban board

When a record has a status-like field, group it into a board. Use
`enum-badge` + `kanbanVariants` to color each column.

```tsx
// GET /tasks → [{ id, title, status: "Todo" | "In Progress" | "Done" }, ...]
const fields: FieldConfig[] = [
  { path: "title", type: "text" },
  {
    path: "status",
    type: "enum-badge",
    kanbanVariants: {
      Todo: { label: "To Do", color: "gray" },
      "In Progress": { label: "In Progress", color: "blue" },
      Done: { label: "Done", color: "green" },
    },
  },
]

<DataViewsLayout
  title="Tasks"
  data={tasks}
  fields={fields}
  views={{ table: true, kanban: true }}
  kanbanGroupBy="status"
/>
```

## Recipe 3 — Nested objects (dot-paths)

APIs often nest related data. Reference it with dot-paths — no flattening
needed.

```tsx
// GET /orders → [{ id, total, customer: { name, email } }, ...]
const fields: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "customer.name", label: "Customer", type: "text" },
  { path: "customer.email", label: "Email", type: "link", linkType: "mailto" },
  { path: "total", type: "currency", currency: "USD" },
]

<DataViewsLayout title="Orders" data={orders} fields={fields} />
```

## Recipe 4 — Hierarchy (nested `children[]` or flat `parentId`)

When records form a tree, the Tree tab appears automatically. Both shapes work:

```tsx
// Nested: GET /departments → [{ id, name, children: [...] }]
<DataViewsLayout
  data={departments}
  treeConfig={{ childrenField: "children", nodeLabel: "name", defaultExpanded: "roots" }}
/>

// Flat / adjacency list: GET /nodes → [{ id, name, parentId }]
<DataViewsLayout
  data={nodes}
  treeConfig={{ parentField: "parentId", idField: "id", nodeLabel: "name" }}
/>
```

## Recipe 5 — Message/inbox shape

For mailbox-like data, the Inbox view auto-detects `isRead`, `isStarred`,
`hasAttachment`, and `priority`. Map title/preview/date with `inboxConfig`.

```tsx
// GET /messages → [{ id, subject, from: { name }, isRead, isStarred, sentAt }]
<DataViewsLayout
  data={messages}
  views={{ inbox: true }}
  inboxConfig={{ titlePath: "subject", previewPath: "from.name", dateField: "sentAt" }}
/>
```

## Recipe 6 — Server-driven filtering & pagination

Make the layout controlled: hold `filterState` yourself and refetch when it
changes. This keeps the URL/server as the source of truth.

```tsx
import { useState, useEffect } from "react"
import type { FilterState } from "torch-glare"

function ServerDriven() {
  const [rows, setRows] = useState([])
  const [filterState, setFilterState] = useState<FilterState>({})

  useEffect(() => {
    api.get("/records", { params: { filters: filterState } }).then(setRows)
  }, [filterState])

  return (
    <DataViewsLayout
      data={rows}
      fields={fields}
      filterState={filterState}
      onFilterChange={setFilterState}
    />
  )
}
```

## Recipe 7 — Custom layout (composable mode)

When tabs aren't what you want — e.g. a table beside a kanban — bypass
`DataViewsLayout` and compose the views with `useDataViewsState`.

```tsx
import { TableView, KanbanView, useDataViewsState } from "torch-glare"

function SplitScreen({ data, fields }) {
  const state = useDataViewsState({ data, fields })
  return (
    <div className="grid grid-cols-2 gap-4 h-screen">
      <TableView data={state.flatItems} fields={state.resolvedFields} config={state.config} showFilters={false} />
      <KanbanView data={state.flatItems} fields={state.resolvedFields} config={state.config} groupByField="status" />
    </div>
  )
}
```

See each view's reference: [TableView](../components/table-view.md) ·
[KanbanView](../components/kanban-view.md) ·
[InboxView](../components/inbox-view.md) ·
[TreeView](../components/tree-view.md).

## Gotchas

- **Empty `data`** → all views render their empty state; pass `isLoading` upstream if you fetch async.
- **Tree tab missing?** No hierarchy was detected. Supply `treeConfig` explicitly or check your `childrenField` / `parentField`.
- **Saved Views don't persist** in tab mode — that's a known limitation documented in [`DataViewsConfigPanel`](../components/data-views-config-panel.md). Use composable mode for real persistence.

## Related

- [`DataViewsLayout`](../components/data-views-layout.md) — full prop reference
- [`DataViewsConfigPanel`](../components/data-views-config-panel.md) — settings/filters panel
