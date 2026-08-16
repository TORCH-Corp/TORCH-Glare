---
title: Render a backend response with DataViews
description: Recipes for turning common backend JSON shapes into a DataViews screen — flat lists, status fields, nested objects, hierarchies, message shapes, and server-driven filtering and paging.
group: how-to
keywords: [data-views, dataviews, recipes, backend, json, api, flat, nested, hierarchy, inbox, board, kanban, server-side, filtering, pagination, how-to]
---

# Render a backend response with DataViews

[`DataViews`](./index.md) shows one dataset as a table, a kanban board, an inbox or
a tree. This guide maps the JSON you get back from an API to what you render.

One rule governs every recipe below, so it is worth stating first: **DataViews never reshapes your
data.** It does not group rows into columns, build a hierarchy, infer a schema, filter, sort or
page. It paints the `rows` you hand it, in the order you hand them, using the `fields` you describe.
Anything shaped — `groups`, `nodes` — you build. That is what makes a failed save leave the screen
showing the truth.

## TL;DR

```tsx
const { data } = useQuery({ queryKey: ["records"], queryFn: () => api.get("/records") });

<DataViews rows={data?.rows ?? []} total={data?.total ?? 0} fields={FIELDS}>
  <DataViews.Header title="Records">
    <DataViews.ViewSwitch />
    <DataViews.Search />
    <DataViews.PanelToggle />
  </DataViews.Header>
  <DataViews.Table />
</DataViews>
```

`fields` is the one thing with no default — DataViews will not guess your columns:

```ts
const FIELDS: FieldConfig[] = [
  { path: "id", label: "ID", type: "number" },
  { path: "name", label: "Name" },
  { path: "createdAt", label: "Created", type: "date-format", dateFormat: "YYYY-MM-DD" },
];
```

## Recipe 1 — A flat list of objects

The common case. Every field you list becomes a column, in the order you list it.

```json
[{ "id": 1, "name": "Acme", "total": 1240, "createdAt": "2025-09-10" }]
```

```tsx
const FIELDS: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "name", label: "Customer" },
  { path: "total", label: "Total", type: "currency", currency: "USD" },
  { path: "createdAt", label: "Created", type: "date-format", dateFormat: "YYYY-MM-DD" },
];

<DataViews rows={rows} total={rows.length} fields={FIELDS}>
  <DataViews.Header title="Orders"><DataViews.ViewSwitch /></DataViews.Header>
  <DataViews.Table selectable />
</DataViews>
```

If your rows have no `id`, tell the component what identity is — selection, drag and the open row
all key off it:

```tsx
<DataViews rows={rows} fields={FIELDS} getRowId={(row) => String(row.sku)}>
```

## Recipe 2 — A status field → a board

The board takes **columns you built**. Grouping is a decision (which statuses exist, in what order,
what an empty column means) that only you can make correctly.

```json
[{ "id": 1, "status": "Pending" }, { "id": 2, "status": "Shipped" }]
```

```tsx
const STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"] as const;

const groups = useMemo<RowGroup[]>(
  () =>
    STATUSES.map((status) => ({
      id: status,
      label: status,
      color: ({ Pending: "gray", Shipped: "blue", Delivered: "green", Cancelled: "red" } as const)[status],
      rows: rows.filter((row) => row.status === status),
    })),
  [rows],
);

<DataViews.Board
  groups={groups}
  titlePath="name"
  onRowMove={(intent) => {
    if (intent.to) move.mutate({ id: Number(intent.id), status: intent.to });
  }}
/>
```

`onRowMove` reports **intent**. The card settles where it landed only once your refetched rows
agree — which is exactly why a rejected move snaps back on its own.

Paint the same field as a coloured chip in the table by giving it a type:

```ts
{ path: "status", label: "Status", type: "enum-badge",
  variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" } }
```

## Recipe 3 — Nested objects → dotted paths

No flattening step. A `path` reads as deep as you need.

```json
[{ "id": 1, "customer": { "name": "Acme", "email": "a@acme.com" }, "brand": { "name": "Bosch" } }]
```

```ts
const FIELDS: FieldConfig[] = [
  { path: "customer.name", label: "Customer" },
  { path: "customer.email", label: "Email", type: "link", linkType: "mailto" },
  { path: "brand.name", label: "Brand" },
];
```

Dotted paths work anywhere a path is taken — `titlePath`, `datePath`, `labelPath`, `sort.path` and
the keys of `filters`.

> **The one place `.` is special.** `DataViews.Filters` builds its controls with `FormBuilder`, and
> react-hook-form reads `.` as object nesting — so a filter on `customer.name` registers as
> `customer__name`. You still write the real path; only a hand-rolled `setValue` needs the escaped
> name.

## Recipe 4 — A hierarchy → `nodes`

Nested `children[]` or a flat `parentId` list both become `TreeNode[]`, and **you** do the
conversion: which field is the parent key, whether orphans become roots and how cycles are handled
are decisions the component cannot make for you.

```json
[{ "id": "1", "name": "Tools", "children": [{ "id": "2", "name": "Drills", "children": [] }] }]
```

```tsx
const toNodes = (items: ApiCategory[], depth = 0): TreeNode[] =>
  items.map((item) => ({
    id: item.id,
    row: item as Row,
    depth,
    children: toNodes(item.children ?? [], depth + 1),
  }));
```

From a flat `parentId` list:

```tsx
const toNodes = (items: ApiCategory[]): TreeNode[] => {
  const byId = new Map(items.map((i) => [i.id, { id: i.id, row: i as Row, depth: 0, children: [] as TreeNode[] }]));
  const roots: TreeNode[] = [];
  for (const item of items) {
    const node = byId.get(item.id)!;
    const parent = item.parentId ? byId.get(item.parentId) : undefined;
    // An orphan becoming a root is a decision — make it deliberately.
    (parent ? parent.children : roots).push(node);
  }
  return roots;
};
```

Then render the tree, and say what its pane shows — **the pane's tabs are children, and passing
none means there is no pane at all**:

```tsx
<DataViews.Tree nodes={nodes} labelPath="name">
  <DataViews.Tree.Table selectable />
  <DataViews.Tree.Cards />
</DataViews.Tree>
```

When the tree holds one kind of thing and the pane must list another — categories in the rail,
items in the pane — that is `paneRows`:

```tsx
<DataViews.Tree nodes={categories} paneRows={(node) => itemsInCategory(node.id)}>
  <DataViews.Tree.Table />
</DataViews.Tree>
```

## Recipe 5 — A message shape → the inbox

```json
[{ "id": 1, "subject": "Delivery delayed", "from": "ops@acme.com", "createdAt": "2025-09-10" }]
```

```tsx
<DataViews.Inbox titlePath="subject" datePath="createdAt">
  <DataViews.Detail />
</DataViews.Inbox>
```

`DataViews.Detail` renders every visible field of the open row. For anything richer, the pane is
`children` and `useActiveRow()` resolves what is open.

If the open message should be a **URL** — a back button, a shareable link — make the items links:

```tsx
<DataViews.Inbox titlePath="subject" datePath="createdAt"
                 itemHref={(row, id) => `/inbox/${id}`} linkComponent={Link} />
```

## Recipe 6 — Server-driven filtering, sorting and paging

Everything the user can ask for arrives as one object, because a query with a new filter and a
stale page number is not a query anyone meant to ask.

```tsx
const [query, setQuery] = useState(emptyQuery());
const { data, isPending } = useQuery({
  queryKey: ["orders", query],
  queryFn: () => fetch(`/api/orders?${queryToParams(query)}`).then((r) => r.json()),
});

<DataViews
  rows={data?.rows ?? []}
  total={data?.total ?? 0}
  fields={FIELDS}
  loading={isPending}
  onQueryChange={setQuery}
>
```

The route handler decodes with `parseQuery`, so the encoder and the decoder cannot drift:

```ts
// app/api/orders/route.ts
import { parseQuery } from "@/components/DataViews";

export async function GET(request: Request) {
  const { search, filters, sort, page, pageSize } = parseQuery(new URL(request.url));
  // your matcher, your ORM
  return Response.json({ rows, total });
}
```

`filters` is `Record<path, string[] | { kind: "number", min?, max? } | { kind: "date", from?, to? }>`.
How the constraints combine — AND across fields, OR within one, fuzzy or exact — is your matcher's
business. The component reports what was chosen and nothing more.

**Paging is scrolling.** There is no pager: hand over `onLoadMore` and **append** each page.
Whether there is more is derived from `rows.length < total`, so there is no flag to keep in sync.

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

## Recipe 7 — A response nothing built-in fits

Two seams, in increasing order of commitment.

**Repaint a field** — the narrowest, and it applies in every view at once:

```ts
{ path: "health", label: "Health", render: (value, row) => <HealthPill value={Number(value)} row={row} /> }
```

**Add a view of your own.** `markView` registers it in the switcher beside the built-in four; it
reads the same context, loading state included:

```tsx
const GalleryView = markView(function GalleryView() {
  const { rows, visibleFields, loading, getRowId } = useDataViewsData();
  if (loading) return <SkeletonBar className="h-40" />;
  return <div className="grid grid-cols-3 gap-3">{rows.map((row, i) => <Tile key={getRowId(row, i)} row={row} />)}</div>;
}, { defaultId: "gallery", defaultLabel: "Gallery" });

<DataViews …>
  <DataViews.Table />
  <GalleryView icon={<i className="ri-layout-grid-line" />} />
</DataViews>
```

## Gotchas

- **Nothing filters itself.** If the rows do not change, nothing on screen changes. That is the
  contract, not a bug.
- **`total` is the server's count**, not `rows.length`. Scroll loading stops when
  `rows.length >= total`, so a wrong `total` either stops early or loops.
- **Append, never replace**, when paging — replacing resets the list and the sentinel fires again.
- **Memoize `groups` and `nodes`.** They are rebuilt on every render otherwise, and both are
  diffed.
- **A part exists because you rendered it.** There is no `views={{ … }}` map; wrap a view in a
  condition to hide it, and the component switches away if it was open.
- **Booleans have no filter section.** Use a Yes/No `RadioList`, or `Filters.Custom`.

## Related

- [`DataViews` component reference](./index.md) — every part, prop and type
- [Build a DataViews screen](./guide.md) — the same ground as scenarios, start to finish
- [Migrating to the DataViews component](./migration.md) — if you are coming from
  `DataViewsLayout`
