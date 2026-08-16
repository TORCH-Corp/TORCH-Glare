---
title: DataViews
description: One dataset shown as a table, kanban board, inbox or tree — with a shared header, view switcher, filters, settings rail, scroll loading and drag-and-drop.
group: Data Display
keywords: [data-views, dataviews, table, board, kanban, inbox, tree, views, filters, panel, columns, saved-views, infinite-scroll, virtualization, drag-drop, server-side]
---

# DataViews

> One dataset, several ways to look at it — table, board, tree, inbox — behind a shared header,
> filter set and settings rail. It is pure UI: you query, it paints.

## Installation

TORCH Glare is a copy-in library: the CLI copies this component's source into your project
(you do **not** install it from the npm package). Run `init` once, then `add`:

```bash
npx torch-glare@latest init
npx torch-glare@latest add DataViews
```

`DataViews` is a folder component — the CLI copies the whole directory, plus everything it depends
on: `Table`, `Checkbox`, `Badge`, `Button`, `Switch`, `Divider`, `Skeleton`, `TabSwitch`, `Avatar`,
`FormBuilder`, `TreeFolder`, the `DataViewCard` layout, the `useDragDrop` and `useInfiniteScroll`
hooks, and the `dataViews` utilities.

## Import

Import from your project's local path — the alias configured in `glare.json` (e.g. `@/*`).
**One path covers everything**: the component, the hooks, the query helpers, and the types you
construct.

```tsx
import {
  DataViews,                                   // the compound root — every part hangs off it
  emptyQuery, queryToParams, parseQuery,       // the query's wire format, both directions
  useDataViewsData, useDataViewsView,          // read the component's state from your own part
  useDataViewsFilters, useDataViewsPanel, useDataViewsPanelTabs,
  useActiveRow,                                // the row behind `activeId`
  Cell,                                        // paint one field the way the views paint it
  markView, markHeader, markPanel,             // register a part of your own
  SkeletonBar, skeletonKeys,                   // the loading pieces every view is built from
  getByPath, formatPathLabel, defaultGetRowId, // read a value by dotted path
  buildCardRows, resolveBadgeVariant,
} from "@/components/DataViews";

import type {
  Row, FieldConfig, FieldType, DataViewsQuery, // the shapes you construct
  RowGroup, TreeNode, MoveIntent, Sort, ColumnState,
  FilterState, FilterValue, Preset, SavedView,
} from "@/components/DataViews";
```

Two things come from elsewhere, because they are not DataViews' own:

```tsx
import { DataViewCard } from "@/layouts/DataViewCard";      // the card the board and pane paint
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useDragDrop } from "@/hooks/useDragDrop";
```

## Quick Examples

Four screens, each a complete page that ships with the docs. Start from
[`overview`](./examples/overview.md) — it is every part at once.

```tsx
const [query, setQuery] = useState(emptyQuery());
const { data, isPending } = useQuery({
  queryKey: ["orders", query],
  queryFn: () => fetch(`/api/orders?${queryToParams(query)}`).then((r) => r.json()),
});

<DataViews
  rows={data?.rows ?? []}
  total={data?.total ?? 0}
  fields={fields}
  loading={isPending}
  onQueryChange={setQuery}
>
  <DataViews.Header title="Orders">
    <DataViews.ViewSwitch />
    <DataViews.Search />
    <DataViews.PanelToggle />
  </DataViews.Header>

  <DataViews.Table selectable />
  <DataViews.Board groups={groups} onRowMove={move} />

  <DataViews.Panel>
    <DataViews.Panel.Tab value="config" label="Config." icon={<Settings />}>
      <DataViews.Panel.SavedViews views={saved} onSave={persist} />
      <DataViews.Panel.Columns />
      <DataViews.Panel.Sort />
    </DataViews.Panel.Tab>
    <DataViews.Panel.Tab value="filters" label="Filters" icon={<Filter />}>
      <DataViews.Filters title={null} className="border-b-0 p-0">
        <FormBuilder.MultiSelect name="status" label="Status" options={STATUS} />
        <FormBuilder.Slider name="total" label="Total" range min={0} max={15000} />
      </DataViews.Filters>
    </DataViews.Panel.Tab>
  </DataViews.Panel>
</DataViews>
```

## The three rules

**A part exists because you rendered it.** There is no `views={{ table: true }}` map and no
`showFilters` flag. Render `<DataViews.Tree/>` and a Tree tab appears; wrap it in
`{canSeeTree && …}` and it disappears, switching away from it if it was open. The same goes for
panel tabs.

**It is pure UI.** DataViews never filters, searches, sorts, groups, paginates, builds a tree,
infers a schema or mutates a row. It paints the `rows` you hand it, in the order you hand them.
Nothing on screen moves until you hand back different data — which is the point: a drag that fails
to save leaves the board showing the truth. So you supply `rows` (already queried), `total`,
`fields`, filter options and slider bounds, board `groups` and tree `nodes`.

**Only the query leaves.** Search, filters, sort, page and page size are one object reported
through `onQueryChange`, because they are one question — and because a query with a new filter and
a stale page number is not a query anyone meant to ask. Everything else the user can change (which
view is showing, which tab is open, how columns are arranged, what is selected, which row is open)
changes nothing but the picture, so the component keeps it.

| The user… | You get |
| --- | --- |
| types, filters, sorts | `onQueryChange(query)` → go and fetch |
| reaches the end of a list | `onLoadMore()` → fetch the next page and append it |
| drags a card, a row or a node | `onRowMove` / `onNodeMove` → save, hand back updated rows |
| selects rows / opens one | `onSelectionChange` / `onActiveIdChange` — told, not asked |

Changing a filter resets `page` to 1 internally. Only the component can do that: by the time you
see the change, "new filter" and "new page" have already become one object.

## Empty and loading

Neither is a part you render. When there is nothing to show, the view shows **nothing** — the table
keeps its header band and has no rows; the board keeps its columns and has no cards. While
`loading` is set, each view paints a **skeleton in its own shape**: the table shimmers rows at the
real row height and column widths, the board shimmers cards inside its columns.

## Large datasets

Rows load **as you scroll**; there is no pager. Hand over `onLoadMore` and append each page to
`rows`. Whether there is more is not a prop — it is `rows.length < total`, which the component
already knows.

```tsx
const { data, fetchNextPage, isPending, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ["orders", { ...query, page: undefined }], // not `page` — that is what pageParam drives
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
  fields={fields}
  onQueryChange={setQuery}
/>
```

The table also **virtualizes past 300 rows** — below that it renders every row, so small tables,
row drag and column resize behave exactly as before; above it the DOM holds a window of rows
however many are loaded. The board and inbox load on scroll but do not virtualize. The **tree does
neither**: a tree wants its children fetched when a node is expanded, not its siblings paged in,
and that is not built.

## Views

| Part | What it renders | You supply | Runnable |
| --- | --- | --- | --- |
| `DataViews.Table` | rows and columns, virtualized past 300 | nothing beyond `rows` | [`views`](./examples/views.md) |
| `DataViews.Board` | a kanban board | `groups` — it never groups rows itself | [`views`](./examples/views.md) |
| `DataViews.Inbox` | a master list beside a detail pane | the pane, as `children` | [`inbox-routing`](./examples/inbox-routing.md) |
| `DataViews.Tree` | a hierarchy, optionally beside a pane | `nodes` — it never builds one | [`tree-custom`](./examples/tree-custom.md) |

Each takes `id`, `label` and `icon` to control how it appears in the switcher, so the same view can
be registered twice with different data. Full props are under
[API Reference](#api-reference) — one heading per part.

### The tree's pane

Pick a node and the pane beside it lists what that node holds. Its header names the selected node
and counts its records, and it stays up before you have picked anything, so the tabs are always
reachable.

**The pane's tabs are children**, the same bargain the component's own views strike: a tab exists
because you rendered it, and the switch shows exactly what you passed. Pass one and there is no
switch at all — a switch with a single option is a label. Pass **none** and there is no pane
either; the tree is then a hierarchy and nothing else, and the rail takes the whole width:

```tsx
<DataViews.Tree nodes={nodes} labelPath="status" />   // a rail, no pane
```

```tsx
<DataViews.Tree nodes={nodes} labelPath="status">
  <DataViews.Tree.Table selectable onRowClick={open} renderCell={cell} />
  <DataViews.Tree.Cards renderCard={card} />
  <DataViews.Tree.Tab value="timeline" label="Timeline" icon={<Clock />}>
    <Timeline />
  </DataViews.Tree.Tab>
</DataViews.Tree>
```

| Part | What it is |
| --- | --- |
| `DataViews.Tree.Table` | the **real `DataViews.Table`** over the node's rows — `selectable`, `onRowClick`, `renderCell`, `onRowMove`, `onAddRow`, virtualization past 300 rows |
| `DataViews.Tree.Cards` | the board's `DataViewCard`; `renderCard` replaces it, `className` replaces the grid |
| `DataViews.Tree.Tab` | a mode of your own — its `children` are the pane while it is selected |

All three take `value`, `label` and `icon` to name themselves in the switch, exactly as the
component's views take `id`, `label` and `icon`. The two built-in ones fill those in, so you pass
them only to rename a tab or to register the same view twice.

**A tab sees the node's rows.** Everything inside the pane runs in a data scope whose `rows` are
the ones the pane lists, so a tab of your own reads them the same way any other part does — no
props to thread:

```tsx
function Timeline() {
  const { rows } = useDataViewsData(); // the selected node's rows, already narrowed by paneRows
  return <ol>{rows.map((row) => <li key={String(row.id)}>{String(row.createdAt)}</li>)}</ol>;
}
```

**Which rows.** By default a node shows its **descendants** — a branch lists what is under it, a
leaf lists itself. A synthetic grouping branch has no meaningful row of its own, which is why
descendants are the default. Override with `paneRows` when the tree and the pane hold different
things — a tree of categories whose pane must list that category's items:

```tsx
<DataViews.Tree nodes={categories} paneRows={(node) => itemsUnder(node.id)} />
```

`paneRows` is also where sorting belongs if you want the pane self-contained. The pane's table
headers sort by writing to the **query**, like every other sort in this component — so a pane sort
re-fetches the dataset and only reorders the pane once re-sorted nodes come back.

**Mode.** `defaultPaneMode` seeds it, `onPaneModeChange` reports every switch, `paneMode` takes it
over entirely. The value is a tab's `value` — `"table"`, `"cards"`, or your own. Seed and persist
is the round-trip:

```tsx
<DataViews.Tree
  nodes={nodes}
  defaultPaneMode={loadPref() ?? "table"}
  onPaneModeChange={savePref}
/>
```

**The header** takes your markup through `paneActions` — an Add button, a menu, a count of your
own. It sits between the record count and the switch.

**And when none of it fits**, any child that is *not* one of those three tabs **is** the pane:
header, switch and all. That is the escape hatch, and what every tree written before these tabs
existed passes.

```tsx
<DataViews.Tree nodes={nodes}>
  <MyOwnPane />
</DataViews.Tree>
```

A full working example of every seam above — `renderNode`, `paneRows`, a custom cell, a custom
card, a custom tab, `paneActions` and a whole-pane override — is `app/data-views/tree-custom`.

**`DataViews.Detail`** is the ready-made detail pane for the inbox and tree. Drop it in as
`children` and it renders every visible field of whatever row is open, as a `<dl>`, painted through
the same `Cell` the views use. It renders **nothing** when no row is open — including when the open
id belongs to a node that is not a row (see [One caveat](#one-caveat)).

```tsx
<DataViews.Inbox titlePath="subject" datePath="createdAt">
  <DataViews.Detail />
</DataViews.Inbox>
```

## Header, panel and filters

`DataViews.Header` holds `ViewSwitch`, `Search`, `Actions` and `PanelToggle`. The bar is always
dark, scoped with `data-theme="dark"`, so it reads correctly whatever theme the host app runs in.

`DataViews.Panel` is the 260px settings rail: `Panel.Tab` for each tab, with `Panel.SavedViews`,
`Panel.Columns` (show/hide and drag-reorder) and `Panel.Sort` inside.

`DataViews.Filters` takes **FormBuilder fields as children** — not a config array describing
fields, the fields themselves. The `<FormBuilder>` lives inside `Filters`; you supply only its
fields, and what each one *means* comes from the field, never from the rows.

Five field kinds become filters. Anything else renders but filters nothing — a checkbox is not a
query, and a file is not a value you can filter by.

**Filters are not derived from `fields`.** There is no `filterable`, `filterMode`, `filterVariant`,
`filterOptions` or `filterLabel` — a filter exists because you wrote the control, and what it
*means* comes from that field's `FieldKind`. Hiding a column (`visible: false`, `type: "hidden"`)
has no effect on filters at all; they are independent surfaces.

### Choosing a control

Two questions pick it, and **the first is about the data, not the UI**:

1. **Can the option set grow?** Not how many values it has today — whether it can scale. A set the
   system's own model fixes (four order statuses) will never grow without a release. A set the org
   configures, or a workflow editor can extend, is **dynamic** — and a dynamic set with four values
   today can have sixteen next quarter.
2. **Can the user pick more than one?**

|  | **Fixed** — bounded by the model | **Dynamic** — org-configurable |
| --- | --- | --- |
| **Multi-pick** | `CheckboxGroup` | `MultiSelect` / `Tags` |
| **Single-pick** | `RadioList` | `SearchableSelect` |

A closed lifecycle (`Draft · Active · Discontinued`) is fixed. Brand, Owner, Vendor, Assignee, Tags
and Category are dynamic unconditionally. A *status* can be either — if an org can extend it
through an approval chain, treat it as dynamic, because sixteen stacked checkboxes is not a control.

### The section types

| Control | Use when | Renders | Lands in `FilterState` as |
| --- | --- | --- | --- |
| `FormBuilder.CheckboxGroup` | fixed set, multi-pick | checkbox list | `string[]` |
| `FormBuilder.RadioList` | fixed set, single-pick | radio list | one-element `string[]` |
| `FormBuilder.SearchableSelect` | dynamic set, single-pick | searchable combobox | one-element `string[]` |
| `FormBuilder.MultiSelect` · `FormBuilder.Tags` | dynamic set, multi-pick | **`BadgeField`** — search + chips | `string[]` |
| `FormBuilder.Slider range` | numeric | range slider | `{ kind: "number", min, max }` |
| `FormBuilder.DateRange` | date | date pair | `{ kind: "date", from, to }` |
| `FormBuilder.Text` | free text | text input | one-element `string[]` |
| ~~toggle / switch~~ | boolean | — | **not supported** |

`MultiSelect` and `Tags` are the **same field**: both render `BadgeField`, so the searchable
multi-select case needs nothing extra.

**Booleans do not filter yet.** `FormBuilder.SwitchBox` and `FormBuilder.Checkbox` are stamped
`boolean`, but the filter map (`filters/children.tsx`) recognises only `text · choice ·
multiChoice · date · slider`. A switch placed in `Filters` renders and writes nothing. Until that
kind is added, express an on/off narrowing with `Filters.Custom`, which can write any shape you
like to one path.

Every control here is live on `app/data-views/filters/page.tsx`:

```tsx
<DataViews.Filters>
  {/* fixed set, multi-pick — the four statuses are fixed by the model */}
  <FormBuilder.CheckboxGroup name="status" label="Status" options={STATUS_OPTIONS} />

  {/* fixed set, single-pick — High/Medium/Low are mutually exclusive */}
  <FormBuilder.RadioList name="priority" label="Priority" options={PRIORITY_OPTIONS} />

  {/* dynamic set, single-pick — customers are data-fed, one per record */}
  <FormBuilder.SearchableSelect name="customer.name" label="Customer" options={CUSTOMER_OPTIONS} />

  {/* dynamic set, multi-pick — renders BadgeField: search *and* several values, as chips */}
  <FormBuilder.MultiSelect name="brand.name" label="Brand" options={BRAND_OPTIONS} />

  <FormBuilder.Slider name="total" label="Total" range min={0} max={15000} step={100} />
  <FormBuilder.DateRange name="createdAt" label="Created" />
</DataViews.Filters>
```

**One rule you cannot guess from the markup.** react-hook-form reads `.` as object nesting, so a
filter on `customer.name` is registered as `customer__name` — you write the real path and `Filters`
escapes it, but anything calling `setValue` yourself must use the escaped name. (The other, that a
control at its neutral position emits no key at all, is under
[Questions this design gets asked](#questions-this-design-gets-asked).)

### Presets, custom filters and the summary

```tsx
<DataViews.Filters>
  <FormBuilder.Slider name="total" label="Total" range min={0} max={15000} />
  {/* Quick-set chips for one field. Number presets take min/max, date presets from/to. */}
  <DataViews.Filters.Presets
    for="total"
    items={[
      { label: "Under $500", max: 500 },
      { label: "$5k+", min: 5000 },
    ]}
  />

  {/* The escape hatch: any control you like, driving one filter path yourself. */}
  <DataViews.Filters.Custom
    path="items"
    label="Item count"
    render={({ value, setValue }) => (
      <ItemsPicker value={value} onChange={(next) => setValue(next)} />
    )}
  />
</DataViews.Filters>
```

`Filters.Summary` paints whatever is active as removable chips. It reads the same context, so it
works anywhere — most usefully **outside** the rail, where it tells the user what is filtering the
rows they are looking at:

```tsx
<DataViews.Filters.Summary className="px-4 py-2" />
```

### Questions this design gets asked

| Question | Answer |
| --- | --- |
| Is there an in-view filter panel *and* a Filters tab — which is canonical? | **One surface.** `DataViews.Filters` is a single component. Render it inside a `Panel.Tab` or as a standalone bar; author against the component, not against a tab. |
| What orders the sections? | **The order you write the children.** There is no `order` prop for filters. |
| Does the applied-count badge count constrained *fields* or selected *values*? | **There is no count badge.** `PanelToggle` carries none. `Filters.Summary` is the equivalent, and it renders **one chip per constrained field** — Status with three values selected is one chip. |
| Do `BadgeField` chip colours and `FieldConfig.variants` share a token set? | **They never meet.** Chips come from the field's own `options`; `variants` (`BadgeVariant`) styles `enum-badge` **columns**. Filters and columns are independent. |

And the behaviours worth stating because they are easy to assume wrongly:

- **Empty is unconstrained.** A control at its neutral position emits **no key** — a slider dragged
  back to exactly `[min, max]` removes its filter rather than sending "everything". Filters never
  narrow to zero rows because a section was touched and cleared.
- **Filter state is one object.** `onQueryChange` receives the whole next query, not a per-field
  delta.
- **Filters survive a view switch.** Table, board, inbox and tree share one query.
- **Persistence is yours.** The component holds the query only as long as it is mounted.
- **How constraints combine is *your* matcher's business,** not the component's — it reports what
  the user asked for and nothing more. The reference endpoint in `app/api/_lib/query.ts` intersects
  across fields (AND) and unions within one field (OR), which is what most callers want.

### Filters outside the settings rail

Nothing requires `Filters` to live in a `Panel.Tab`. Rendered as a plain child it becomes a bar
above the views, inside the light surface — which is what you want when filtering is the main task
rather than a setting:

```tsx
<DataViews rows={rows} fields={fields} total={total} onQueryChange={setQuery}>
  <DataViews.Header title="Orders">
    <DataViews.ViewSwitch />
  </DataViews.Header>

  {/* A bar, not a tab. `title` and the bottom border are on by default here. */}
  <DataViews.Filters title="Filters">
    <FormBuilder.MultiSelect name="status" label="Status" options={STATUS} />
    <FormBuilder.DateRange name="createdAt" label="Created" />
  </DataViews.Filters>

  <DataViews.Table />
</DataViews>
```

Inside a tab you normally turn that chrome off — `<DataViews.Filters title={null}
className="border-b-0 p-0">` — because the tab already provides it.

## API Reference

### `<DataViews>` (root)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` * | `readonly Row[]` | — | The rows to paint, already queried, in the order they should appear. |
| `fields` * | `readonly FieldConfig[]` | — | How to paint each field. Order here is the default column order. |
| `children` * | `ReactNode` | — | The parts to render — the header, views, panel, filters. |
| `getRowId` | `(row, index) => string` | `row.id ?? index` | Stable identity. Selection, drag and the active row all key off it. |
| `total` | `number` | `0` | Total matching rows on the server. `hasMore` is derived from `rows.length < total`. |
| `loading` | `boolean` | `false` | First load. Each view paints its own skeleton. |
| `onLoadMore` | `() => void` | — | A view reached its end. Fetch the next page and **append** it to `rows`. |
| `loadingMore` | `boolean` | `false` | That next page is in flight — distinct from `loading`. |
| `query` | `DataViewsQuery` | — | Controlled query. Omit to let the component hold it. |
| `onQueryChange` | `(query) => void` | — | Search, filters, sort, page or page size changed. Go and fetch. |
| `defaultQuery` | `Partial<DataViewsQuery>` | — | Seed for the uncontrolled query — e.g. a starting `pageSize`. |
| `defaultView` | `string` | first registered | Which view opens. |
| `defaultPanelOpen` | `boolean` | `false` | Start with the settings rail open. |
| `onViewChange` | `(view: string) => void` | — | Told which view is showing; the component still owns it. |
| `onSelectionChange` | `(ids: readonly string[]) => void` | — | Told what is selected. |
| `onActiveIdChange` | `(id: string \| null) => void` | — | Told which row is open. |
| `theme` | `Themes` | — | `data-theme` for the **content**. The chrome stays dark regardless. |
| `className` | `string` | — | |

`page` resets to 1 internally whenever the search, filters, sort or page size change — a new
result set has no page 4 to stay on.

Every part below has its own heading, so you can ask for one on its own — with the MCP server,
`get-component-api DataViews part="Board"`. Columns are the same throughout:
**Prop · Type · Default · Required · Notes**.

### DataViews.Header

The dark bar across the top. Its children are the four parts below, in whatever order you write
them.

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `title` | `ReactNode` | — | no | The uppercase title pill. |
| `children` | `ReactNode` | — | no | `ViewSwitch`, `Search`, `Actions`, `PanelToggle`. |
| `className` | `string` | — | no | |

### DataViews.ViewSwitch

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | no | |

Renders a spacer instead of a switcher when fewer than two views are registered — one option is a
label, not a choice.

### DataViews.Search

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `placeholder` | `string` | `"Search..."` | no | |
| `className` | `string` | — | no | |

An icon button that expands into a field. It writes `search` into the query and matches nothing
itself; it collapses on an outside click only while empty, so an active term is never thrown away.

### DataViews.Actions

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | no | Your buttons, pushed to the end of the bar. |
| `className` | `string` | — | no | |

### DataViews.PanelToggle

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | `"Filter & Config."` | no | The label beside the gear. |
| `className` | `string` | — | no | |

Renders `null` while the rail is open — the rail carries its own close button.

### DataViews.Table

Rows and columns. Virtualizes past 300 rows.
Example: [`views`](./examples/views.md).

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `selectable` | `boolean` | `false` | no | Per-row checkboxes and select-all. |
| `onRowClick` | `(row: Row, id: string) => void` | — | no | Also makes rows keyboard-reachable. |
| `onRowMove` | `(intent: MoveIntent) => void` | — | no | Row reordering. Adds a grip column; moves nothing itself. |
| `onAddRow` | `() => void` | — | no | Shows the `+ Add New` row at the foot of the table. |
| `addRowLabel` | `string` | `"Add New"` | no | |
| `renderCell` | `(args: RowRenderArgs & { field: FieldConfig }) => ReactNode` | — | no | Return `undefined` to fall through to the default cell. |
| `id` · `label` · `icon` · `className` | `ViewBaseProps` | `"table"` · `"List"` | no | How it appears in the switcher. |

### DataViews.Board

A kanban board. **You** build the columns — the board never groups rows itself.
Example: [`views`](./examples/views.md).

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `groups` | `readonly RowGroup[]` | — | **yes** | The columns, in order. |
| `titlePath` | `string` | first visible field | no | Which field is the card title. |
| `renderCard` | `(args: RowRenderArgs & { group: RowGroup; isActive: boolean; isDragging: boolean }) => ReactNode` | — | no | Replaces the card; the wrapper keeps the drag. |
| `onRowMove` | `(intent: MoveIntent) => void` | — | no | A card was dropped. `intent.to` is the group id, or `null` outside any column. |
| `onColumnAction` | `(groupId: string) => void` | — | no | The per-column action button in its header. |
| `id` · `label` · `icon` · `className` | `ViewBaseProps` | `"board"` · `"Board"` | no | |

### DataViews.Inbox

A master list beside a detail pane.
Example: [`inbox-routing`](./examples/inbox-routing.md), which drives the
pane from the URL.

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | no | The detail pane — often `<DataViews.Detail/>`. |
| `renderItem` | `(args: RowRenderArgs & { isActive: boolean }) => ReactNode` | — | no | Replaces the list item. |
| `titlePath` | `string` | — | no | Which field leads the item. |
| `datePath` | `string` | first `date`/`date-format` field | no | Which field shows as the date chip. |
| `itemHref` | `(row: Row, id: string) => string` | — | no | Makes items links rather than buttons — that is what gives them a back button and a shareable URL. |
| `linkComponent` | `React.ElementType` | `"a"` | no | Your router's link — e.g. `next/link`. |
| `placeholder` | `ReactNode` | built-in empty pane | no | Shown while nothing is open. |
| `id` · `label` · `icon` · `className` | `ViewBaseProps` | `"inbox"` · `"Inbox"` | no | |

### DataViews.Tree

A hierarchy beside a pane. **You** build `nodes` — which field is the parent key, whether orphans
become roots, how cycles are handled are decisions only you can make correctly.
Example: [`tree-custom`](./examples/tree-custom.md).

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `nodes` | `readonly TreeNode[]` | — | **yes** | The hierarchy. |
| `labelPath` | `string` | first visible field | no | Which field labels a node. |
| `renderNode` | `(args: { node: TreeNode; row: Row; fields: readonly FieldConfig[] }) => { name?: string; icon?: ReactNode; meta?: ReactNode }` | — | no | Returns parts, not markup — `TreeFolder` owns the row. |
| `expanded` | `readonly string[]` | root nodes that have children | no | Controlled expansion. |
| `onExpandedChange` | `(ids: readonly string[]) => void` | — | no | |
| `onNodeMove` | `(intent: MoveIntent) => void` | — | no | A node was dropped into a new parent. Passing it is what turns drag on. |
| `paneMode` | `TreePaneMode` | — | no | Controls the pane's tab. Omit to let the view hold it. |
| `defaultPaneMode` | `TreePaneMode` | **the first tab's `value`** | no | Not a hardcoded `"table"` — a pane whose only tab is yours opens on it. |
| `onPaneModeChange` | `(mode: TreePaneMode) => void` | — | no | The user switched. Persist it and seed `defaultPaneMode` back. |
| `paneRows` | `(node: TreeNode) => readonly Row[]` | the node's descendants; a leaf yields itself | no | Which rows the pane lists. |
| `paneActions` | `ReactNode` | — | no | Your markup in the pane's header, before the tab switch. |
| `children` | `ReactNode` | — | no | The pane's tabs. **None means no pane**; anything that is not a tab **is** the pane. |
| `id` · `label` · `icon` · `className` | `ViewBaseProps` | `"tree"` · `"Tree"` | no | |

`TreePaneMode` is `"table" | "cards" | (string & {})` — any string, because a `Tree.Tab` of yours
names its own mode.

### DataViews.Tree.Table

The pane as a table. It **is** `DataViews.Table`, rendered over the selected node's rows, so it
keeps sortable headers, selection, `renderCell`, the grip, `+ Add New` and virtualization.

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `value` | `string` | `"table"` | no | What `paneMode` becomes while this tab shows. |
| `label` | `string` | `"List"` | no | |
| `icon` | `ReactNode` | `<Table2/>` | no | |
| *…all of `DataViews.Table`'s* | | | no | `selectable`, `onRowClick`, `onRowMove`, `onAddRow`, `addRowLabel`, `renderCell`. |

**Gotcha.** Its headers sort by writing to the **query**, like every other sort here — so a pane
sort re-fetches the dataset and only reorders the pane once re-sorted nodes come back. Sort inside
`paneRows` if you want the pane self-contained. It takes no `className` (that is a `ViewBaseProps`
key, omitted).

### DataViews.Tree.Cards

The pane as a grid of cards — the same `DataViewCard` the board paints.

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `value` | `string` | `"cards"` | no | |
| `label` | `string` | `"Cards"` | no | |
| `icon` | `ReactNode` | `<LayoutGrid/>` | no | |
| `renderCard` | `(args: RowRenderArgs) => ReactNode` | — | no | Replaces `DataViewCard` outright. |
| `className` | `string` | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4` | no | **Replaces** the grid classes; it is not merged. |

### DataViews.Tree.Tab

A mode of your own. Its `children` are the pane while it is selected, and nothing while it is not.

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | **yes** | A tab only you know about has no default name. |
| `label` | `string` | — | **yes** | |
| `icon` | `ReactNode` | — | no | |
| `children` | `ReactNode` | — | no | Reads the node's rows from `useDataViewsData()` — the pane scopes them. |

### DataViews.Detail

The ready-made detail pane for the inbox and tree: every visible field of the open row, as a `<dl>`,
painted through `Cell`.

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | no | |

Renders **nothing** when no row is open — including when the open id belongs to a node that is not
a row (see [One caveat](#one-caveat)).

### DataViews.Panel

The 260px settings rail, opened by `PanelToggle`. Always dark.
Example: [`panel`](./examples/panel.md).

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | no | `Panel.Tab`s. |
| `defaultTab` | `string` | first rendered tab | no | |
| `title` | `ReactNode` | the single tab's label | no | Shown only when there is one tab or none. |
| `className` | `string` | — | no | |

### DataViews.Panel.Tab

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `value` | `string` | — | **yes** | |
| `label` | `string` | — | **yes** | |
| `icon` | `ReactNode` | — | no | |
| `children` | `ReactNode` | — | no | Rendered only while this tab is open. |

The strip disappears when there is only one tab.

### DataViews.Panel.Section

A titled, collapsible group inside a tab — the same `ConclusionHeader` `FormSummary` uses.

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `title` | `ReactNode` | — | no | Without one there is no header and no fold. |
| `description` | `ReactNode` | — | no | Sits with the header, outside the fold, so it still reads when shut. |
| `collapsible` | `boolean` | `true` | no | |
| `defaultOpen` | `boolean` | `true` | no | Nothing starts folded. |
| `children` · `className` | | — | no | |

A collapsed body keeps its controls in the DOM but marks them `inert`, so focus cannot reach them.

### DataViews.Panel.Columns

Show/hide and drag-reorder the columns. Takes no `value`/`onValueChange` — the column list is the
root's, reached through `useDataViewsView()`.

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `title` | `ReactNode` | `"Table Columns"` | no | |
| `description` | `ReactNode` | `"Show or hide columns in table view"` | no | |
| `className` | `string` | — | no | |

Hiding a column here changes `visibleFields` everywhere — it also retitles the board's cards.

### DataViews.Panel.Sort

The default-sort picker, for views that have no column headers. Writes into the query.

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `title` | `ReactNode` | `"Default Sort"` | no | |
| `className` | `string` | — | no | |

### DataViews.Panel.SavedViews

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `views` | `readonly SavedView[]` | `[]` | no | The list you persisted. |
| `onValueChange` | `(id: string) => void` | — | no | A saved view was picked. |
| `onSave` | `(snapshot: SavedViewSnapshot) => void` | — | no | The Save button appears only when you pass this. |
| `saveLabel` | `ReactNode` | `"Save a New View"` | no | |
| `title` | `ReactNode` | `"Saved View"` | no | |
| `className` | `string` | — | no | |

Saving is yours — a view outlives the component. Restoring is not: hand the snapshot back and
selecting it puts filters, sort and columns back internally.

### DataViews.Filters

The filter controls, written as a form. Takes **no** `value`/`onValueChange`: it reads and writes
the root's query through `useDataViewsFilters()`, and what leaves the component is `onQueryChange`.
Example: [`filters`](./examples/filters.md).

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | no | **FormBuilder fields.** The `<FormBuilder>` is inside. |
| `title` | `ReactNode` | `"Filters"` | no | Pass `null` to drop the header row. |
| `description` | `ReactNode` | — | no | A small line under the title, above the fields. |
| `clearLabel` | `ReactNode` | `"Clear"` | no | The Clear button appears only while a filter is set. |
| `collapsible` | `boolean` | `true` | no | |
| `defaultOpen` | `boolean` | `true` | no | |
| `className` | `string` | — | no | |

### DataViews.Filters.Presets

Quick-set chips for one numeric or date field.

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `for` | `string` | — | **yes** | The field's path. Renders `null` if no field there. |
| `items` | `readonly Preset[]` | — | **yes** | `{ label, min?, max? }` or `{ label, from?, to? }`. |
| `className` | `string` | — | no | |

### DataViews.Filters.Custom

A filter no FormBuilder field covers.

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `path` | `string` | — | **yes** | The key it writes into `filters`. |
| `render` | `(args: { value: FilterValue \| undefined; setValue: (v: FilterValue \| undefined) => void }) => ReactNode` | — | **yes** | |
| `label` | `ReactNode` | derived from `path` | no | |

### DataViews.Filters.Summary

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `className` | `string` | — | no | |

Active filters — and the search term — as removable chips. Renders `null` when there are none.

### Cell

Paint one field of one row exactly as the views paint it.

| Prop | Type | Default | Required | Notes |
| --- | --- | --- | --- | --- |
| `field` | `FieldConfig` | — | **yes** | `field.render` wins over `field.type`. |
| `row` | `Row` | — | **yes** | |
| `className` | `string` | — | no | |

`type: "hidden"` renders `null`; a blank value renders `-`, except for `boolean` and
`progress-bar`, which have a meaningful zero.

### Hooks

All five throw if called outside `<DataViews>`.

| Hook | Returns |
| --- | --- |
| `useDataViewsData()` | `{ rows, fields, visibleFields, getRowId, loading, loadingMore, hasMore, onLoadMore? }` |
| `useDataViewsView()` | `{ view, setView, views, search, setSearch, sort, setSort, selection, setSelection, activeId, setActiveId, columns, setColumns }` |
| `useDataViewsPanel()` | `{ open, setOpen }` |
| `useDataViewsPanelTabs()` | `{ tab, setTab, tabs }` |
| `useDataViewsFilters()` | `{ filters, setFilters, filterFields }` |
| `useActiveRow()` | `Row \| null` — the row behind `activeId` |

Inside the tree's pane, `useDataViewsData().rows` is **the selected node's rows**, not the whole
set: the pane scopes the context. That is what lets a `Tree.Tab` of yours read them with no props.

### Utilities

| Export | Signature | What it is for |
| --- | --- | --- |
| `emptyQuery` | `(overrides?: Partial<DataViewsQuery>) => DataViewsQuery` | `{ search: "", filters: {}, sort: null, page: 1, pageSize: 10 }`. |
| `queryToParams` | `(query: DataViewsQuery) => URLSearchParams` | `search` · `filters` (JSON) · `sort` (`"path:direction"`) · `page` · `pageSize`. |
| `parseQuery` | `(url: URL) => DataViewsQuery` | The server half. Malformed filters → `{}`; `pageSize` clamped to 1–500. |
| `getByPath` | `(obj: unknown, path?: string) => unknown` | Reads `"customer.name"`. |
| `getString` | `(obj: unknown, path: string) => string` | |
| `formatPathLabel` | `(path: string) => string` | `"created_at"` → `"Created At"`. |
| `defaultGetRowId` | `(row: Row, index: number) => string` | `id ?? _id ?? uuid ?? index`. |
| `buildCardRows` | `(fields: readonly FieldConfig[], row: Row) => DataViewCardRow[]` | The card body, paired two per row. |
| `resolveBadgeVariant` | `(variant?: BadgeVariant) => { color, badgeStyle }` | |
| `SkeletonBar` · `skeletonKeys` | `({ className })` · `(n: number) => number[]` | The pieces every view's skeleton is built from. |
| `markView` · `markHeader` · `markPanel` | `(component, meta?) => component` | Register a part of your own. |

## TypeScript

Every type below is exported from `@/components/DataViews`.

### Row

```ts
type Row = Record<string, unknown>;
```

Your object, untouched. DataViews never reshapes it — dotted paths are read on the way out.

### FieldConfig

One entry per field. The order of the array is the default column order.

```ts
type FieldConfig = {
  path: string;              // "customer.name" — dotted paths are read for you
  label?: string;            // defaults to a title-cased `path`
  type?: FieldType;          // how to paint it — see the table below
  visible?: boolean;         // false hides it from `visibleFields`
  render?: (value: unknown, row: Row) => ReactNode;   // wins over `type`; the widest per-field seam
  // …plus the per-type keys below
};
```

### Field types

All seventeen, with the extra keys each one reads. Anything unrecognised falls back to `text`.

| `type` | Extra keys it reads | Default when omitted |
| --- | --- | --- |
| `text` | — | `String(value)`; also the fallback for any unknown type |
| `number` | — | `value.toLocaleString()` |
| `date` | — | the raw string |
| `date-format` | `dateFormat` — token string (`YYYY MM DD HH mm ss`) or `Intl.DateTimeFormatOptions` | `{ year: "numeric", month: "short", day: "numeric" }` |
| `boolean` | `trueLabel` · `falseLabel` · `trueVariant` · `falseVariant` | `"Yes"`/`"No"`, green/gray. Never shows the `-` placeholder |
| `enum-badge` | `variants` (value → colour) · `defaultVariant` | `"gray"`; badge size `S` |
| `badge-array` | `variant` · `limit` | `"blue"`, no limit; the overflow chip is `+N` in gray, size `XS` |
| `currency` | `currency` — `"USD"` or `{ symbol, locale, decimals, code }` | symbol `"$"`; `Intl` currency style when `code` is set |
| `number-format` | `format: Intl.NumberFormatOptions` | plain `Intl.NumberFormat` |
| `progress-bar` | `thresholds: [warn, ok]` | `[40, 70]`; clamped 0–100; never shows the placeholder |
| `star-rating` | `max` | `5` |
| `icon-text` | `icon` (a `ri-*` class, else literal text) · `iconPosition` | `"before"` |
| `two-line` | `secondaryPath` | — |
| `avatar` | `fallbackPath` — where the initials come from | initials `"?"` |
| `link` | `linkType: "mailto" \| "tel" \| "url"` | `url` opens in a new tab with `rel="noopener noreferrer"`; `mailto:`/`tel:` are prefixed if absent |
| `image` | — | 40×40 rounded |
| `hidden` | — | renders `null` **and** is dropped from `visibleFields` |

`BadgeVariant` is one of `green · greenLight · cocktailGreen · yellow · redOrange · redLight ·
rose · purple · bluePurple · blue · navy · gray · highlight`.

### DataViewsQuery

The only state that leaves the component.

```ts
interface DataViewsQuery {
  search: string;
  filters: FilterState;                                  // Record<path, FilterValue>
  sort: { path: string; direction: "asc" | "desc" } | null;
  page: number;                                          // 1-based
  pageSize: number;
}
```

### FilterValue

Three kinds, and which one a field produces is decided by the FormBuilder field you rendered — see
[The section types](#the-section-types).

```ts
type FilterValue =
  | string[]                                        // choice / multi-choice / text
  | { kind: "number"; min?: number; max?: number }  // slider
  | { kind: "date"; from?: string; to?: string };   // date range, ISO YYYY-MM-DD, local time

type FilterState = Record<string, FilterValue>;
```

A cleared filter is **removed** from the object, never set to an empty value — so
`Object.keys(filters).length` is a truthful "is anything filtered".

### The rest

```ts
type RowGroup = { id: string; label: string; color?: ColumnColor; rows: Row[] };
type TreeNode = { id: string; row: Row; children: TreeNode[]; depth: number };
type MoveIntent = { id: string; from: string | null; to: string | null; index?: number };
type ColumnState = { path: string; label: string; visible: boolean };
type Sort = { path: string; direction: "asc" | "desc" } | null;
type Preset = { label: string; min?: number; max?: number }
            | { label: string; from?: string; to?: string };
type SavedViewSnapshot = { filters: FilterState; sort: Sort; columns: readonly ColumnState[] };
type SavedView = { id: string; label: string; snapshot?: SavedViewSnapshot };
type ColumnColor = "gray" | "purple" | "orange" | "blue" | "green" | "red";
type TreePaneMode = "table" | "cards" | (string & {});
type RowRenderArgs = { row: Row; id: string; index: number; fields: readonly FieldConfig[] };
```

`TreeNode.depth` is required by the type but the view does not read it — it measures depth from the
nesting. Pass `0` and forget it.

`parseQuery` is the server half of `queryToParams` — a route handler imports it so the encoder and
the decoder cannot drift.
## Custom rendering

Every view can be repainted, and each seam hands you the same `{ row, id, index, fields }` — plus
whatever that view knows. `fields` is what the panel left **visible, in order**, and `Cell` paints
one the way every other view paints it, so a custom UI keeps the currency, badge colours and date
formats the rest of the component uses.

| Want | Use |
| --- | --- |
| one field, everywhere it appears | `FieldConfig.render(value, row)` |
| one cell, in the table only | `renderCell` — return `undefined` to fall through |
| the board's card | `renderCard` |
| the inbox list row | `renderItem` |
| a tree node's label / icon / meta | `renderNode` |
| a cell or card **inside the tree's pane** | `DataViews.Tree.Table renderCell` · `DataViews.Tree.Cards renderCard` |
| a whole extra mode in the tree's pane | `DataViews.Tree.Tab` |
| something in the pane's header | `paneActions` |
| the inbox's detail pane, or the tree's pane entirely | `children` |
| a whole new view | `markView(MyView, { defaultId, defaultLabel })` |

### A table cell

Return `undefined` for anything you do not want to touch — that cell falls through to the default,
so you only describe the exception.

```tsx
<DataViews.Table
  renderCell={({ field, row }) =>
    field.path === "total" ? (
      <span className="flex items-center gap-2">
        <Cell field={field} row={row} />
        {Number(row.total) > 5000 && (
          <Badge label="large" color="purple" badgeStyle="subtle" showIcon={false} />
        )}
      </span>
    ) : undefined
  }
/>
```

`undefined` means "you paint it" and falls through to the default cell. `null` does not — it is a
deliberate blank, which is how you hide a value without hiding the column. One `renderCell` can
handle several fields:

```tsx
renderCell={({ field, row }) => {
  if (field.path === "status" && row.archived) return null;      // deliberately empty
  if (field.path === "customer.name")
    return (
      <span className="flex items-center gap-2">
        <Avatar src={String(row.avatar ?? "")} size="S" />
        <Cell field={field} row={row} />
      </span>
    );
  return undefined;                                              // everything else: default
}}
```

### A board card

`renderCard` replaces the card's **content**; the board keeps the wrapper, so dragging, selection
and the click target keep working without wiring any of it. It also receives `group` and
`isDragging`.

```tsx
<DataViews.Board
  groups={groups}
  renderCard={({ row, fields, isActive }) => (
    <div
      className={cn(
        "bg-background-presentation-form-base flex flex-col gap-1 rounded-[10px] border p-3",
        isActive ? "border-border-presentation-state-focus" : "border-border-presentation-global-primary",
      )}
    >
      <span className="typography-headers-large-semibold">
        <Cell field={fields[1]} row={row} />
      </span>
      <Cell field={fields[2]} row={row} />
    </div>
  )}
/>
```

It also receives `group` and `isDragging` — the column the card is in, and whether this card is the
one being dragged:

```tsx
renderCard={({ row, fields, group, isDragging }) => (
  <div className={cn("rounded-[10px] border p-3", isDragging && "opacity-40")}>
    <Cell field={fields[1]} row={row} />
    <span className="typography-body-small-regular">{group.label}</span>
  </div>
)}
```

### An inbox row

Same idea: the row keeps its own hover, selected and link behaviour, and `renderItem` fills it.

```tsx
<DataViews.Inbox
  renderItem={({ row, fields, isActive }) => (
    <div className="flex items-center justify-between gap-2">
      <Cell field={fields[1]} row={row} />
      <span className="flex items-center gap-2">
        <Cell field={fields[2]} row={row} />
        {isActive && <i className="ri-arrow-right-line" aria-hidden />}
      </span>
    </div>
  )}
/>
```

`isActive` is the open row, which is what you hang a read/unread treatment on. With `itemHref` the
item becomes a link, and `linkComponent` makes it your router's:

```tsx
<DataViews.Inbox
  itemHref={(row, id) => `/orders/${id}`}
  linkComponent={Link}
  placeholder={<p className="p-6">Pick an order.</p>}
  renderItem={({ row, fields, isActive }) => (
    <div className={cn("flex justify-between", !isActive && !row.read && "font-semibold")}>
      <Cell field={fields[1]} row={row} />
      <Cell field={fields[2]} row={row} />
    </div>
  )}
/>
```

### A tree node

`renderNode` is the one that does **not** return markup. `TreeFolder` owns the row — the indent,
the connector lines, the selection band, the drag grip — so it returns only the pieces that can
vary, and anything richer belongs in the pane beside it.

```tsx
<DataViews.Tree
  nodes={nodes}
  renderNode={({ row }) =>
    row.status ? { meta: <Badge label={String(row.status)} color="blue" badgeStyle="subtle" /> } : {}
  }
/>
```

It may return `name`, `icon` and `meta` — anything omitted keeps the default, and returning `{}`
leaves the node entirely alone:

```tsx
renderNode={({ row, node }) => ({
  name: `${row.customer.name} (${node.children.length})`,
  icon: <i className={row.status === "Delivered" ? "ri-check-line" : "ri-time-line"} />,
  meta: <Badge label={String(row.status)} color="blue" badgeStyle="subtle" showIcon={false} />,
})}
```

### A pane tab

The tree's pane takes a mode of your own beside List and Cards. A tab renders its children only
while it is selected, and reads the **selected node's** rows — the pane scopes the data context, so
nothing is threaded through props:

```tsx
function Timeline() {
  const { rows } = useDataViewsData();   // the node's rows, already narrowed by `paneRows`
  return (
    <ol className="p-6">
      {rows.map((row) => (
        <li key={String(row.id)}>{String(row.createdAt)} — {String(row.customer.name)}</li>
      ))}
    </ol>
  );
}

<DataViews.Tree nodes={nodes} labelPath="name">
  <DataViews.Tree.Table selectable />
  <DataViews.Tree.Cards renderCard={({ row }) => <OrderCard row={row} />} />
  <DataViews.Tree.Tab value="timeline" label="Timeline" icon={<Clock />}>
    <Timeline />
  </DataViews.Tree.Tab>
</DataViews.Tree>
```

The switch shows exactly what you rendered. Render one tab and there is no switch; render none and
there is no pane. See [`tree-custom`](./examples/tree-custom.md).

### The detail pane

The `children` of `Inbox` and `Tree` **are** the pane. `DataViews.Detail` is a sensible default,
not a requirement — write your own and `useActiveRow()` resolves whatever is open:

```tsx
function OrderDetail() {
  const row = useActiveRow();
  const { visibleFields } = useDataViewsData();
  if (!row) return <p className="p-6">Select an order.</p>;
  return (
    <div className="flex flex-col gap-3 p-6">
      {visibleFields.map((field, i) => (
        <Cell key={`${field.path}-${i}`} field={field} row={row} />
      ))}
    </div>
  );
}

<DataViews.Inbox>
  <OrderDetail />
</DataViews.Inbox>
```

In a tree, `useActiveRow()` returns nothing when the selected node is a synthetic branch rather
than a row — say so in the pane rather than rendering an empty shell. See
[One caveat](#one-caveat).

### A whole new view

`markView` registers it in the switcher beside the built-in four. A view is not a decoration — it
is handed the same context they are, and is expected to honour the same contract: paint the fields
the panel left visible, key rows by `getRowId`, show the house skeleton while `loading`, set
`activeId` when one is opened, and ask for more when it runs out.

Here is a complete one — a timeline grouped by date, built on the library's own `Timeline`:

```tsx
import {
  Cell, markView, skeletonKeys, SkeletonBar,
  useDataViewsData, useDataViewsView, type ViewBaseProps,
} from "@/components/DataViews";
import {
  Timeline, TimelineItem, TimelineIndicator,
  TimelineSeparator, TimelineConnector, TimelineContent, TimelineHeading,
} from "@/components/Timeline";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";   // not on the DataViews barrel
import { getByPath } from "@/utils/dataViews/path";
import { cn } from "@/utils/cn";

export const TimelineView = markView(
  function TimelineView({ className }: ViewBaseProps) {
    const { rows, visibleFields, getRowId, loading, loadingMore, hasMore, onLoadMore } =
      useDataViewsData();
    const { activeId, setActiveId } = useDataViewsView();

    // Asks for the next page as the list nears its end. `hasMore` is derived by the root.
    const { sentinelRef } = useInfiniteScroll({
      onLoadMore,
      hasMore,
      loading: loading || loadingMore,
    });

    const [title, ...rest] = visibleFields;

    // One bucket per day, in the order the rows arrived — the component never sorts.
    const byDay = new Map<string, typeof rows>();
    for (const row of rows) {
      const day = String(getByPath(row, "createdAt") ?? "—").slice(0, 10);
      byDay.set(day, [...(byDay.get(day) ?? []), row]);
    }

    if (loading) {
      return (
        <div className={cn("bg-background-presentation-form-base flex flex-col gap-4 p-6", className)}>
          {skeletonKeys(6).map((i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBar className="h-[14px] w-[14px] shrink-0 rounded-full" />
              <SkeletonBar className={i % 2 ? "w-[45%]" : "w-[65%]"} />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={cn("bg-background-presentation-form-base h-full overflow-y-auto p-6", className)}>
        {[...byDay].map(([day, dayRows]) => (
          <section key={day}>
            <h3 className="typography-body-small-semibold text-content-presentation-global-secondary py-2">
              {day}
            </h3>
            <Timeline>
              {dayRows.map((row, index) => {
                const id = getRowId(row, index);
                return (
                  <TimelineItem key={id}>
                    <TimelineSeparator>
                      <TimelineIndicator variant={activeId === id ? "active" : "default"} />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveId(activeId === id ? null : id)}
                      className="cursor-pointer"
                    >
                      <TimelineHeading>
                        {title && <Cell field={title} row={row} />}
                      </TimelineHeading>
                      <div className="flex items-center gap-2">
                        {rest.slice(0, 2).map((field, i) => (
                          <Cell key={`${field.path}-${i}`} field={field} row={row} />
                        ))}
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </Timeline>
          </section>
        ))}

        {/* The trigger, inside the scroller the rows live in. */}
        {hasMore && <div ref={sentinelRef as React.Ref<HTMLDivElement>} className="h-px" />}
      </div>
    );
  },
  { defaultId: "timeline", defaultLabel: "Timeline" },
);
```

Render it like any other view — it appears in the switcher, and disappears if you stop rendering it:

```tsx
<DataViews rows={rows} fields={fields} total={total} onLoadMore={fetchNextPage}>
  <DataViews.Header title="Orders">
    <DataViews.ViewSwitch />
  </DataViews.Header>
  <DataViews.Table />
  <TimelineView icon={<i className="ri-time-line" />} />
</DataViews>
```

Accept `ViewBaseProps` so the caller keeps `id`, `label`, `icon` and `className`.

### The chrome

Buttons you put in `Actions` are `<Button variant="BluColStyle" size="M">` by convention — the
solid blue Figma uses for the bar's action, with `Search` and `PanelToggle` left ghost beside them.

Every titled group in the rail folds: `Panel.Columns`, `Panel.Sort` and `Panel.SavedViews` all
render through `Panel.Section`, and `Filters` folds its fields the same way. Pass
`collapsible={false}` to pin one open, or `defaultOpen={false}` to start it closed.

The surrounding parts take content too: `Header`'s `title` and `Actions`/`PanelToggle` children,
any markup inside a `Panel.Tab` (with `Panel.Section` to group it), `Filters.Custom` for a filter
no FormBuilder field covers, and `Inbox`'s `placeholder` for the empty pane.

## Dragging

Four surfaces drag — board cards between columns, table rows into a manual order, the rail's
column list, and tree nodes into a new parent — and all four **work with a finger and with the
keyboard**: hold to pick up and swipe to scroll, or Space, arrows, Space. Each is opt-in by handing
over a callback, and none of them move anything on their own; the item settles where it landed only
once you hand back reordered data.

A table's manual order and a sort are two different orders, and the component cannot know which one
you meant. It reports the drop; deciding is yours.

## Two colour worlds

The chrome is always dark and the content is not. `data-theme="dark"` is scoped to the header bar
and the settings rail so their literals resolve correctly no matter what theme the host app runs
in. The views inside keep the host theme, which is why the table reads white and the board grey.
The Master Container carries the surface — a form base, a 1px global border and a 16px radius — so
anything positioned around a view inherits it.

## Accessibility

What is actually implemented, rather than what a data grid usually claims:

- **Sorting is buttons.** Each column header is a real button carrying its own `sortLabel`, so a
  screen reader hears "Customer, sort ascending" rather than one identical "Sort ascending" per
  column. Clicking cycles asc → desc → unsorted, so a third press returns the server's own order.
- **Rows are only focusable when they do something.** `<tr>` has no implicit role, so a row gains
  `role="button"`, `tabIndex` and Enter/Space handling **only** when `onRowClick` is passed —
  otherwise it stays out of the tab order instead of being an announced control that does nothing.
- **Dragging works without a pointer.** Space lifts, arrows move, Space drops, Escape cancels — on
  all four draggable surfaces. Grips are labelled (`"Reorder row"`), and touch drags start on a
  200ms hold so a swipe still scrolls the list.
- **The view switcher is a tablist** (`role="tab"` / `aria-selected`), and the tree exposes
  `aria-expanded` on branches and `aria-current` on the open node.
- **RTL** works from logical properties (`ms-*`, `ps-*`, `start-*`) rather than left/right, so the
  whole component mirrors under `dir="rtl"` — including the panel rail, the filter controls and the
  tree's indentation. `app/data-views/a11y-rtl/page.tsx` toggles it live.
- **Decorative things are hidden.** Connector lines, drag grips, skeletons and layout spacers all
  carry `aria-hidden`, so the reading order is the data.

The one thing to supply yourself: `fields[].label`. Without it a column falls back to its `path`,
and `customer.name` is what the sort control will announce.

## Common Patterns

### Fetch on every query change

The whole component in one line of plumbing: the query is the query key, so TanStack refetches when
it changes and discards a superseded response.

```tsx
const [query, setQuery] = useState(emptyQuery());
const { data, isPending } = useQuery({
  queryKey: ["orders", query],
  queryFn: () => fetch(`/api/orders?${queryToParams(query)}`).then((r) => r.json()),
});

<DataViews rows={data?.rows ?? []} total={data?.total ?? 0} fields={FIELDS}
           loading={isPending} onQueryChange={setQuery}>…</DataViews>
```

### Decode it on the server

`parseQuery` is the other half, so the two cannot drift:

```ts
// app/api/orders/route.ts
export async function GET(request: Request) {
  const { search, filters, sort, page, pageSize } = parseQuery(new URL(request.url));
  // …your matcher, your ORM. Return { rows, total }.
}
```

### Persist what the user chose

Only the query leaves, so persistence is a two-line round trip — seed with a `default*` prop, save
from the `on*Change`:

```tsx
<DataViews defaultQuery={loadQuery()} onQueryChange={(q) => { save(q); setQuery(q); }}>
<DataViews.Tree defaultPaneMode={loadPref()} onPaneModeChange={savePref} />
```

Saved views are the same shape at a larger grain: `Panel.SavedViews` hands you a
`SavedViewSnapshot` on save, and restores whatever you hand back.

### Drag that survives a failed save

`onRowMove` reports intent; nothing moves until you hand back rows that agree. That is what makes a
failed save leave the board showing the truth:

```tsx
<DataViews.Board groups={groups} onRowMove={(intent) => {
  if (intent.to) move.mutate({ id: Number(intent.id), status: intent.to });
}} />
```

### One dataset, two tabs of the same view

Views are registered by rendering them, and `id`/`label` name them — so the same view twice is just
two elements:

```tsx
<DataViews.Board id="by-status" label="Status" groups={byStatus} />
<DataViews.Board id="by-owner"  label="Owner"  groups={byOwner} />
```

## Testing

The component is pure UI, so the assertions worth writing are about **what left** and **what was
painted** — never about internal state.

```tsx
it("reports a filter through onQueryChange", async () => {
  const onQueryChange = vi.fn();
  render(<Orders onQueryChange={onQueryChange} />);
  await userEvent.click(screen.getByRole("button", { name: /filter & config/i }));
  await userEvent.click(screen.getByRole("checkbox", { name: "Shipped" }));

  expect(onQueryChange).toHaveBeenLastCalledWith(
    expect.objectContaining({ filters: { status: ["Shipped"] }, page: 1 }),  // page reset
  );
});

it("paints nothing when there is nothing", () => {
  render(<DataViews rows={[]} total={0} fields={FIELDS}><DataViews.Table /></DataViews>);
  expect(screen.getByRole("columnheader", { name: "Order #" })).toBeInTheDocument();
  expect(screen.queryAllByRole("row")).toHaveLength(1);   // the header band only
});
```

Notes that save time:

- The search box is an **input inside an expanding button** — click the button first.
- A combobox filter renders as `role="combobox"` on an `<input>`, not a `<button>`.
- Sortable column headers are **buttons inside the `columnheader`**.
- The tree's pane has its own `role="tablist"`, distinct from the header's view switcher — scope
  the query or you will assert against the wrong one.
- Drag is `@dnd-kit`: it needs pointer events with an 8px move, not `fireEvent.dragStart`. Keyboard
  drag (Space, arrows, Space) is usually the cheaper test.

## Performance

| Concern | What the component already does | What is yours |
| --- | --- | --- |
| Large row counts | The table renders a window past **300 rows**; below that every row is real, which is what keeps row drag and column resize simple | Keep `rows` a stable reference — `data?.rows ?? []` is a new array every render and will re-run every memo downstream |
| Paging | `onLoadMore` fires once per arrival at the end, latched until the sentinel leaves | Append pages; never replace |
| Re-renders | `visibleFields`, `groups` and `nodes` are read straight through | `useMemo` your `groups`/`nodes` builders — they run on every render otherwise |
| Query churn | `page` resets internally when the query narrows | Exclude `page` from your query key when using `useInfiniteQuery`, or every page refetches the lot |
| Cell cost | `Cell` is a switch on `type` | A `render` that mounts a heavy subtree runs per visible cell — keep it cheap or memoize it |

The board and inbox load on scroll but do **not** virtualize. The tree does neither: a tree wants
its children fetched when a node expands, not its siblings paged in, and that is not built.

## Styling

`className` on any part is merged through `cn`, so a Tailwind class wins over the default. Two
things are worth knowing before you reach for it.

**The chrome is always dark.** The header bar and the settings rail carry `data-theme="dark"`
regardless of the `theme` you pass; `theme` themes the **content**. See
[Two colour worlds](#two-colour-worlds).

**Colour comes from tokens, never literals.** Use `presentation` tokens
(`bg-background-presentation-*`, `text-content-presentation-*`, `border-border-presentation-*`) so a
part sits correctly in both worlds. Never use `system` tokens or `variant="SystemStyle"`.

Two `className`s **replace** rather than merge, because they are layout, not decoration:
`DataViews.Tree.Cards`'s grid classes, and `Filters`'s when you pass `title={null}`.

## Known Limitations

| Limitation | Why | What to do |
| --- | --- | --- |
| No boolean filter section | `AS_FILTER` maps FormBuilder kinds to `text · choice · multiChoice · date · slider`; a checkbox has no filter meaning | Use a `RadioList` of Yes/No, or `Filters.Custom` |
| The tree does not virtualize or page | Trees want lazy children, not paged siblings | Fetch a node's children on expand and hand back new `nodes` |
| `Detail` is row-keyed, not node-keyed | It resolves `activeId` against `rows` | See [One caveat](#one-caveat) |
| A pane sort re-queries | The pane's table writes sort into the shared query | Sort inside `paneRows` for a self-contained pane |
| Filters cannot express OR | The component reports what was chosen; combining is your matcher's business | Interpret `FilterState` however you like server-side |
| Two views of one dataset share one query | That is the design — a switch must not lose the user's filters | Mount two `DataViews` if they genuinely need separate queries |

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Nothing renders, or "DataViews parts must be rendered inside `<DataViews>`" | A part is outside the root, or wrapped in a component of your own | Wrap the wrapper with `markView`/`markHeader`/`markPanel` |
| A view has no tab | The element is not rendered, or is behind a falsy condition | A part exists because you rendered it |
| Filtering does nothing | You are waiting for the component to filter | It does not. Fetch with the new query and hand back new `rows` |
| A filter never appears in `filters` | The field's kind has no filter meaning (`Checkbox`, `File`, `Custom`) | Use a supported control or `Filters.Custom` |
| `setValue("customer.name", …)` does nothing | react-hook-form reads `.` as nesting | Use the escaped name — `customer__name` |
| Scroll loading fires repeatedly | `hasMore` never goes false | It is derived from `rows.length < total` — check `total` |
| Scroll loading never fires | Rows were replaced instead of appended | Append each page |
| The tree shows no pane | No tabs were passed | Render `<DataViews.Tree.Table/>` / `.Cards`, or anything else as the pane |
| A pane tab shows the whole dataset | It read rows from outside the pane | Read `useDataViewsData()` **inside** the tab — the pane scopes it |
| Drag does nothing on a phone | Nothing is wrong; hold 200ms first | A shorter delay cannot be told apart from a scroll |
| Types will not import | Reaching into `@/utils/dataViews/types` | Everything is re-exported from `@/components/DataViews` |

## Example pages

Every one is a complete, runnable page — generated into the docs from the app, so the code below
travels with the package rather than living in a repo you may not have.

| Page | Shows |
| --- | --- |
| [`overview`](./examples/overview.md) | Every part at once — the fastest way to see the whole shape |
| [`views`](./examples/views.md) | All four views over one dataset, with drag round-trips |
| [`tree-custom`](./examples/tree-custom.md) | Every custom-UI seam of the tree: `renderNode`, `paneRows`, a custom cell, card, tab, `paneActions`, and a whole-pane override |
| [`inbox-routing`](./examples/inbox-routing.md) | `itemHref` + `linkComponent` — the pane driven by the URL |
| [`fields`](./examples/fields.md) | The field types, painted |
| [`filters`](./examples/filters.md) | Every filter control, presets, custom filters, the summary |
| [`server-side`](./examples/server-side.md) | `queryToParams` out, `parseQuery` in |
| [`scale`](./examples/scale.md) | Virtualization and scroll loading at size |
| [`panel`](./examples/panel.md) | The rail: saved views, columns, sort — and the pane-mode round trip |
| [`state`](./examples/state.md) | Controlled vs uncontrolled query |
| [`view-registry`](./examples/view-registry.md) | A view of your own via `markView`, beside the built-in four |
| [`a11y-rtl`](./examples/a11y-rtl.md) | Keyboard paths and the RTL mirror |

## Related Components

| Component | When |
| --- | --- |
| [`Table`](../table.md) | You need one table, not several views of one dataset. `DataViews.Table` composes it. |
| [`DataTable`](../data-table.md) | A self-contained TanStack table that sorts, filters and pages **client-side**. Reach for it when the data is already in the browser; reach for `DataViews` when the server owns the query. |
| [`TreeFolder`](../tree-folder.md) | The tree on its own, without the surrounding views. |
| [`FormBuilder`](../form-builder.md) | Writes the filter controls — `DataViews.Filters` takes its fields as children. |
| `DataViewCard` | The card the board renders (a layout, `@/layouts/DataViewCard`), usable directly. |

## One caveat

`DataViews.Detail` resolves `activeId` against `rows` via `getRowId`. The tree selects a **node**
id, so `Detail` fills in only when the node's id is also a row id. Select a synthetic grouping node
and there is no matching row, so it renders nothing. Either key your leaf nodes by row id, or
render your own pane.
