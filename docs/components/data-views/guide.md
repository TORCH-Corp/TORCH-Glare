---
title: Build a screen with DataViews
description: The canonical way to build a list screen in TORCH Glare. One dataset as a table, board, inbox or tree behind a shared header, filters and settings rail — with scroll loading, drag and drop, custom cells, custom pane tabs and a view of your own.
group: how-to
keywords:
  [
    data-views,
    dataviews,
    table,
    board,
    kanban,
    inbox,
    tree,
    pane,
    views,
    filters,
    panel,
    saved-views,
    columns,
    sort,
    search,
    infinite-scroll,
    virtualization,
    drag-drop,
    server-side,
    query,
    custom-view,
    markView,
  ]
---

# Build a screen with DataViews

`DataViews` is how a list screen is built in this library: one dataset, several ways to look at it,
behind a shared header, filter set and settings rail. This guide goes from the smallest useful
screen to every seam the component has, in the order you are likely to need them.

Every snippet below is lifted from a complete, runnable page, linked at the end of each section —
so you can read the whole file rather than a fragment. Those pages ship with the docs; see the
[example index](./examples/index.md).

**Three rules govern everything here.** They are worth reading once before the code.

1. **A part exists because you rendered it.** There is no `views={{ table: true }}` map and no
   `showFilters` flag. Render `<DataViews.Board/>` and a Board tab appears; wrap it in a condition
   and it disappears, switching away if it was open.
2. **It is pure UI.** DataViews never filters, searches, sorts, groups, paginates, builds a tree or
   mutates a row. It paints the `rows` you hand it, in the order you hand them. Nothing on screen
   moves until you hand back different data.
3. **Only the query leaves.** Search, filters, sort, page and page size are one object, reported
   through `onQueryChange`. Everything else the user can change — which view is showing, what is
   selected, how columns are arranged — changes nothing but the picture, so the component keeps it.

## 1. The smallest screen

Rows, fields, a header and a table.

```tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataViews, emptyQuery, queryToParams } from "@/components/DataViews";
import type { FieldConfig } from "@/components/DataViews";

const FIELDS: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "customer.name", label: "Customer" },
  { path: "status", label: "Status", type: "enum-badge",
    variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" } },
  { path: "total", label: "Total", type: "currency", currency: "USD" },
  { path: "createdAt", label: "Created", type: "date-format", dateFormat: "YYYY-MM-DD" },
];

export default function Orders() {
  const [query, setQuery] = useState(emptyQuery());
  const { data, isPending } = useQuery({
    queryKey: ["orders", query],
    queryFn: () => fetch(`/api/orders?${queryToParams(query)}`).then((r) => r.json()),
  });

  return (
    <div className="h-full p-4">
      <DataViews
        rows={data?.rows ?? []}
        total={data?.total ?? 0}
        fields={FIELDS}
        loading={isPending}
        onQueryChange={setQuery}
        className="h-full"
      >
        <DataViews.Header title="Orders">
          <DataViews.ViewSwitch />
          <DataViews.Search />
          <DataViews.PanelToggle />
        </DataViews.Header>

        <DataViews.Table selectable />
      </DataViews>
    </div>
  );
}
```

Three things are already true: typing in the search box reports a new query and you refetch; the
table has no empty state, because nothing to show is shown as nothing; and while `loading` is set
it paints a skeleton in the table's own shape.

→ [the full page](./examples/overview.md)

## 2. Four views over one dataset

Add views by rendering them. The switcher builds itself.

```tsx
<DataViews.Table selectable onRowClick={(row, id) => open(id)} />
<DataViews.Board groups={groups} titlePath="customer.name" onRowMove={move} />
<DataViews.Inbox titlePath="customer.name" datePath="createdAt">
  <DataViews.Detail />
</DataViews.Inbox>
<DataViews.Tree nodes={nodes} labelPath="customer.name">
  <DataViews.Tree.Table />
  <DataViews.Tree.Cards />
</DataViews.Tree>
```

`groups` and `nodes` are yours to build, and worth memoizing:

```tsx
const groups = useMemo<RowGroup[]>(
  () => STATUSES.map((status) => ({
    id: status, label: status, rows: rows.filter((r) => r.status === status),
  })),
  [rows],
);
```

Register the same view twice with different data by giving each an `id` and `label`:

```tsx
<DataViews.Board id="by-status" label="Status" groups={byStatus} />
<DataViews.Board id="by-owner"  label="Owner"  groups={byOwner} />
```

→ [the full page](./examples/views.md)

## 3. Filters — they are FormBuilder fields

`DataViews.Filters` takes **the fields themselves**, one JSX child each, exactly as any form in this
library is written. The `<FormBuilder>` is inside; you write only its fields. What each child means
comes from the field, not from a config: a `MultiSelect` becomes a list of values, a `Slider` a
numeric range, a `DateRange` a date range.

```tsx
<DataViews.Panel>
  <DataViews.Panel.Tab value="filters" label="Filters" icon={<Filter />}>
    <DataViews.Filters title={null} className="border-b-0 p-0">
      <FormBuilder.CheckboxGroup name="status" label="Status" options={STATUS_OPTIONS} />
      <FormBuilder.RadioList name="priority" label="Priority" options={PRIORITY_OPTIONS} />
      <FormBuilder.SearchableSelect name="customer.name" label="Customer" options={CUSTOMERS} />
      <FormBuilder.MultiSelect name="brand.name" label="Brand" options={BRANDS} />
      <FormBuilder.Slider name="total" label="Total" range min={0} max={15000} step={100} />
      <FormBuilder.DateRange name="createdAt" label="Created" />
      <DataViews.Filters.Presets for="total" items={[{ label: "Under $500", max: 500 }]} />
    </DataViews.Filters>
  </DataViews.Panel.Tab>
</DataViews.Panel>
```

Which control to reach for is two questions — can the option set grow, and can the user pick more
than one:

| | Single | Multiple |
| --- | --- | --- |
| **Fixed, short list** | `RadioList` | `CheckboxGroup` |
| **Dynamic or long** | `SearchableSelect` | `MultiSelect` |

`Filters` does not filter. It reports into the query, you fetch, and the rows change when you hand
back different ones. Two things to know: a control at its neutral position emits **no key at all**,
so a slider dragged back to `[min, max]` removes its filter rather than sending "everything"; and
booleans have no filter section — use a Yes/No `RadioList` or `Filters.Custom`.

→ [the full page](./examples/filters.md)

## 4. The settings rail

The rail is `DataViews.Panel`, opened by the `PanelToggle` in the header. Its tabs are children,
like everything else.

```tsx
<DataViews.Panel>
  <DataViews.Panel.Tab value="config" label="Config." icon={<Settings />}>
    <DataViews.Panel.SavedViews
      views={saved}
      onSave={(snapshot) => setSaved((prev) => [...prev, { id: crypto.randomUUID(), label: `View ${prev.length + 1}`, snapshot }])}
    />
    <DataViews.Panel.Columns />
    <DataViews.Panel.Sort />
  </DataViews.Panel.Tab>

  <DataViews.Panel.Tab value="filters" label="Filters" icon={<Filter />}>
    …
  </DataViews.Panel.Tab>
</DataViews.Panel>
```

Saving a view is yours — a view outlives the component. Restoring is not: hand the snapshot back
and picking it puts filters, sort and columns back internally.

→ [the full page](./examples/panel.md)

## 5. Large datasets — scroll, don't page

There is no pager. Hand over `onLoadMore` and **append** each page; whether there is more is derived
from `rows.length < total`, so there is no flag to keep in sync.

```tsx
const { data, fetchNextPage, isPending, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ["orders", { ...query, page: undefined }],   // not `page` — pageParam drives that
  initialPageParam: 1,
  queryFn: ({ pageParam }) =>
    fetch(`/api/orders?${queryToParams({ ...query, page: pageParam })}`).then((r) => r.json()),
  getNextPageParam: (last, pages) => {
    const loaded = pages.reduce((n, p) => n + p.rows.length, 0);
    return loaded < last.total ? pages.length + 1 : undefined;
  },
});

<DataViews
  rows={data?.pages.flatMap((p) => p.rows) ?? []}
  total={data?.pages[0]?.total ?? 0}
  loading={isPending}
  onLoadMore={fetchNextPage}
  loadingMore={isFetchingNextPage}
  fields={FIELDS}
  onQueryChange={setQuery}
/>
```

The table also **virtualizes past 300 rows**, so the DOM stays small however many are loaded. Below
that it renders every row, which is what keeps row drag and column resize simple. The board and
inbox load on scroll but do not virtualize; the tree does neither.

→ [the full page](./examples/scale.md)

## 6. Server-side, end to end

The query goes out through `queryToParams` and comes back in through `parseQuery` — one encoder,
one decoder, imported from the same module so they cannot drift.

```ts
// app/api/orders/route.ts
import { parseQuery } from "@/components/DataViews";

export async function GET(request: Request) {
  const { search, filters, sort, page, pageSize } = parseQuery(new URL(request.url));

  let rows = ALL.filter((row) => matches(row, search, filters));
  if (sort) rows = [...rows].sort(by(sort));
  const total = rows.length;
  return Response.json({ rows: rows.slice((page - 1) * pageSize, page * pageSize), total });
}
```

`filters` is `Record<path, string[] | { kind: "number", min?, max? } | { kind: "date", from?, to? }>`.
How constraints combine is your matcher's business.

→ [the full page](./examples/server-side.md)

## 7. Drag and drop

Four surfaces drag — board cards, table rows, tree nodes and the rail's column list — and each is
**opt-in by passing the handler**. All of them report intent and move nothing themselves:

```tsx
<DataViews.Table onRowMove={(intent) => reorder.mutate(intent)} />
<DataViews.Board groups={groups} onRowMove={({ id, to }) => to && move.mutate({ id: Number(id), status: to })} />
<DataViews.Tree nodes={nodes} onNodeMove={(intent) => reparent.mutate(intent)} />
```

A card settles where it landed only once your refetched rows agree — which is what makes a rejected
move snap back with no rollback code. Touch drags activate on a 200ms hold so a swipe still scrolls,
and every surface is keyboard-operable: Space, arrows, Space.

## 8. Custom cells, cards and rows

Each seam hands you `{ row, id, index, fields }` — `fields` being what the panel left visible, in
order — and `Cell` paints one the way every other view paints it.

```tsx
// one field, everywhere it appears
{ path: "health", label: "Health", render: (value) => <HealthPill value={Number(value)} /> }

// one cell, table only — return `undefined` to fall through to the default
<DataViews.Table renderCell={({ field, row }) =>
  field.path === "total" ? <TotalBar value={Number(row.total)} /> : undefined
} />

// the board's card
<DataViews.Board groups={groups} renderCard={({ row, isDragging }) => <OrderCard row={row} dim={isDragging} />} />

// the inbox row
<DataViews.Inbox renderItem={({ row, isActive }) => <MailRow row={row} active={isActive} />} />

// a tree node — parts, not markup: TreeFolder owns the row
<DataViews.Tree nodes={nodes} renderNode={({ row }) => ({ meta: <Badge label={String(row.status)} color="blue" /> })} />
```

→ [the full page](./examples/fields.md)

## 9. The tree's pane, and a tab of your own

The tree's `children` are its **pane tabs**, on the same bargain as everything else: a tab exists
because you rendered it, the switch shows exactly what you passed, one tab draws no switch, and
**no tabs means no pane at all** — the rail then takes the full width.

```tsx
<DataViews.Tree
  nodes={nodes}
  labelPath="brand.name"
  paneRows={(node) => node.children.map((child) => child.row)}
  paneActions={<Button variant="BluColStyle" size="M">New order</Button>}
>
  <DataViews.Tree.Table selectable renderCell={cell} />
  <DataViews.Tree.Cards renderCard={({ row }) => <OrderCard row={row} />} />
  <DataViews.Tree.Tab value="timeline" label="Timeline" icon={<Clock />}>
    <Timeline />
  </DataViews.Tree.Tab>
</DataViews.Tree>
```

`Tree.Table` **is** `DataViews.Table`, rendered over the selected node's rows — sortable headers,
selection, `renderCell`, the grip, `+ Add New` and virtualization all come with it.

A tab of your own reads the node's rows from the same context every other part uses, because the
pane scopes them:

```tsx
function Timeline() {
  const { rows } = useDataViewsData();   // the selected node's rows, narrowed by `paneRows`
  return <ol>{rows.map((row) => <li key={String(row.id)}>{String(row.createdAt)}</li>)}</ol>;
}
```

And when none of that fits, anything in `children` that is **not** a tab *is* the pane — header,
switch and all.

→ [the full page](./examples/tree-custom.md)

## 10. A view of your own

`markView` registers a component in the switcher beside the built-in four. It reads the same
context, so it gets the rows, the visible fields, the loading state and scroll loading for free.

```tsx
const GalleryView = markView(
  function GalleryView() {
    const { rows, visibleFields, loading, getRowId } = useDataViewsData();
    if (loading) return <div className="grid grid-cols-3 gap-3 p-4">{skeletonKeys(6).map((k) => <SkeletonBar key={k} className="h-40" />)}</div>;

    return (
      <div className="grid grid-cols-3 gap-3 p-4">
        {rows.map((row, i) => (
          <article key={getRowId(row, i)} className="rounded-[12px] border p-4">
            {visibleFields.map((field, n) => <Cell key={`${field.path}-${n}`} field={field} row={row} />)}
          </article>
        ))}
      </div>
    );
  },
  { defaultId: "gallery", defaultLabel: "Gallery" },
);

<DataViews …>
  <DataViews.Table />
  <GalleryView icon={<i className="ri-layout-grid-line" />} />
</DataViews>
```

Wrapping a **built-in** part in a component of your own hides the marker the root recognises it by,
so the wrapper carries the marker itself — `markPanel`, `markHeader`, `markView`.

→ [the full page](./examples/view-registry.md)

## Gotchas

- **Nothing filters, sorts or pages itself.** If the rows do not change, the screen does not change.
- **Append pages, never replace** — replacing resets the list and the sentinel fires again.
- **Exclude `page` from your query key** with `useInfiniteQuery`, or every page refetches the lot.
- **Memoize `groups` and `nodes`**; `data?.rows ?? []` is a new array every render.
- **`total` is the server's count.** Scroll loading stops at `rows.length >= total`.
- **A filter on `customer.name` registers as `customer__name`** inside the form — you write the real
  path, but a hand-rolled `setValue` needs the escaped one.
- **The chrome is always dark**; `theme` themes the content. Never use `system` tokens or
  `variant="SystemStyle"` — use the `presentation` equivalents.
- **`DataViews.Detail` is row-keyed.** In a tree it fills in only when the node's id is also a row
  id; a synthetic grouping node has no row, so it renders nothing.

## Related

- [`DataViews` component reference](./index.md) — every part, prop and type
- [Render a backend response with DataViews](./backend-response.md) — JSON shape →
  what to render
- [Forms with FormBuilder](../../how-to/forms-with-form-builder.md) — the fields `DataViews.Filters` takes
- [Migrating to the DataViews component](./migration.md)
