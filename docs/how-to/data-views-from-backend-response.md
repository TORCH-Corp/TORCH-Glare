---
title: Rendering a backend response with DataViews
description: Recipes for turning common backend JSON shapes into a DataViews screen — flat lists, nested hierarchies, inbox/message shapes, and server-driven filtering.
group: How-to
keywords: [data-views, backend, json, recipe, fields, nested, hierarchy, inbox, server-filtering, pagination]
---

# Rendering a backend response with DataViews

The goal of [`DataViews`](../components/data-views.md) is "one response, many UI shapes". You
hand it an array of plain objects; it detects the fields and renders them.

## 1. The zero-config case

```tsx
import { DataViews } from "@/components/DataViews";

<DataViews title="Records" data={await api.get("/records")} />;
```

Field types are inferred from key names and values — `status` / `priority` become badges,
`email` / `phone` / `url` become links, ISO date strings become formatted dates, arrays become
badge rows, numbers under money-ish keys become currency. Good enough to see your data; not good
enough to ship.

## 2. Declare the fields you care about

```tsx
const fields: FieldConfig[] = [
  { path: "id", label: "Employee #", type: "number" },
  { path: "name", label: "Name", type: "text" },
  {
    path: "department",
    label: "Department",
    type: "enum-badge",
    variants: { Engineering: "blue", Sales: "green", Support: "yellow" },
    filterable: true,
  },
  { path: "salary", label: "Salary", type: "currency", currency: "USD", filterable: true },
  { path: "internalNotes", type: "hidden" },
];

<DataViews title="Employees" data={employees} fields={fields} />;
```

Declared fields are **merged** over detected ones, so you only describe what you want to change.
`type: "hidden"` drops a field from every view and from the config rail.

### Dot paths for nested values

```tsx
{ path: "manager.name", label: "Manager" }
{ path: "address.city", label: "City", filterable: true }
```

### The escape hatch

`render` always wins:

```tsx
{
  path: "score",
  render: (value, row) => <MyScoreDial value={Number(value)} tier={row.tier as string} />,
}
```

## 3. Nested hierarchies

A response with a children key gets a Tree tab automatically:

```json
[{ "id": 1, "name": "Hardware", "children": [{ "id": 2, "name": "Laptops" }] }]
```

```tsx
<DataViews title="Catalogue" data={categories} fields={fields} />
```

Non-tree views see the **flattened** records, so the same response fills the table and board too.
For a parent-pointer shape, or a non-conventional key, say so:

```tsx
<DataViews.Root data={employees} fields={fields}>
  {/* … */}
  <DataViews.Tree parentField="managerId" nodeLabel="name" defaultExpanded="roots" />
</DataViews.Root>
```

## 4. Message / inbox shapes

```tsx
<DataViews.Root data={messages} fields={fields}>
  <DataViews.Header title="Inbox">
    <DataViews.ViewSwitch />
  </DataViews.Header>
  <DataViews.Inbox
    config={{
      starredField: "flagged",
      priorityField: "urgency",
      titlePath: "subject",
      previewPath: "from.name",
    }}
  />
</DataViews.Root>
```

## 5. Detail on its own URL

Put the DataViews shell in a **layout** so it survives navigation into the detail route:

```tsx
// app/orders/layout.tsx
"use client";

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id?: string }>();

  return (
    <DataViews.Root data={orders} fields={fields} config={id ? { defaultView: "inbox" } : undefined}>
      <DataViews.Header title="Orders">
        <DataViews.ViewSwitch />
        <DataViews.Spacer />
        <DataViews.ConfigTrigger />
      </DataViews.Header>

      <DataViews.Table />
      <DataViews.Inbox
        itemHref={(_item, orderId) => `/orders/${orderId}`}
        linkComponent={Link}
        selectedId={id}
        renderDetail={id ? () => children : undefined}
      />

      <DataViews.ConfigPanel />
    </DataViews.Root>
  );
}
```

## 6. Server-driven filtering and search

**DataViews always filters in memory.** `filterState` / `onFilterChange` change *who owns the
filter state*, not *where filtering happens* — the rows you pass as `data` are still narrowed by
`matchesFilterValues` before a view sees them.

That matters if your endpoint filters too, because the two predicates have to agree. DataViews
compares exact strings over a dot-path. If your backend does anything else, its correct rows get
dropped by the second pass:

| Your endpoint | What the in-memory pass then does |
| --- | --- |
| Case-insensitive match | Drops rows whose case differs |
| Full-text search across columns | Drops nearly everything — it only checks one path |
| Returns a projection without the filtered column | `getByPath` → `undefined` → **drops every row** |
| `total >= 500` with an inclusive bound | Agrees; safe |

So there are two workable shapes:

**A — filter on the server, keep it out of `filterState`.** Own the controls yourself and pass
pre-filtered `data`. No second pass, because DataViews has no filters to apply:

```tsx
const [status, setStatus] = useState<string[]>([]);
const { data } = useQuery(["orders", status], () => api.get("/orders", { params: { status } }));

<DataViews.Root data={data ?? []} fields={fields}>
  <DataViews.Header title="Orders">
    <MyStatusFilter value={status} onChange={setStatus} />
  </DataViews.Header>
  …
</DataViews.Root>
```

**B — use `filterState` and make the predicates match.** Keeps the config rail's filter UI. Your
endpoint must mirror `matchesFilterValues` semantics *and* always return the filtered fields:

```tsx
const [filters, setFilters] = useState<FilterState>({});
const { data } = useQuery(["orders", filters], () => api.get("/orders", { params: filters }));

<DataViews.Root data={data ?? []} fields={fields} filterState={filters} onFilterChange={setFilters}>
```

### Search

Search is genuinely yours — `DataViews.Search` is controlled and DataViews never filters on the
query, because in practice search hits the backend:

```tsx
<DataViews.Search value={q} onChange={setQ} placeholder="Search orders…" />
```

Hand back a narrowed `data` and every view follows.

## 7. When the layout doesn't fit

Compose the parts directly, or drop to the hooks:

```tsx
import { useDataViews, useViewData, ViewSurface } from "@/components/DataViews";

function TimelineView() {
  const active = useRegisterView({ id: "timeline", label: "Timeline", icon: <Clock /> });
  if (!active) return null;
  return <TimelineBody />;
}

function TimelineBody() {
  const { records, displayFields } = useViewData(); // filtered + sorted for you
  return <ViewSurface>{/* your rendering */}</ViewSurface>;
}
```

Written as a child of `DataViews.Root`, it gets a tab like any built-in view.

## Related

- [`data-views`](../components/data-views.md) — full API
- [`table-view`](../components/table-view.md), [`kanban-view`](../components/kanban-view.md),
  [`inbox-view`](../components/inbox-view.md), [`tree-view`](../components/tree-view.md)
