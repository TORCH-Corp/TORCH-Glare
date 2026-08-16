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

Import from your project's local path — the alias configured in `glare.json` (e.g. `@/*`):

```tsx
import { DataViews, emptyQuery, queryToParams } from "@/components/DataViews";
```

## Quick start

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

| Part | What it renders |
| --- | --- |
| `DataViews.Table` | rows and columns; `selectable`, `onRowClick`, `renderCell`, `onRowMove`, `onAddRow` |
| `DataViews.Board` | a kanban board from `groups`; `titlePath`, `renderCard`, `onRowMove` |
| `DataViews.Inbox` | a master list with a detail pane; `renderItem`, `itemHref` |
| `DataViews.Tree` | a hierarchy from `nodes` beside a pane; `labelPath`, `renderNode`, `onNodeMove` |

Each takes `id`, `label` and `icon` to control how it appears in the switcher, so the same view can
be registered twice with different data.

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

**Two rules you cannot guess from the markup.****Two rules you cannot guess from the markup.** react-hook-form reads `.` as object nesting, so a
filter on `customer.name` is registered as `customer__name` — you write the real path and `Filters`
escapes it, but anything calling `setValue` yourself must use the escaped name. And a control at
its **neutral position emits no key at all**: a slider dragged back to exactly `[min, max]` removes
its filter rather than sending "everything".

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

### Header

| Part | Prop | Type | Description |
| --- | --- | --- | --- |
| `Header` | `title` | `ReactNode` | The uppercase title pill. |
| | `children` · `className` | | `ViewSwitch`, `Search`, `Actions`, `PanelToggle`. |
| `ViewSwitch` | `className` | `string` | Renders nothing when fewer than two views are registered. |
| `Search` | `placeholder` | `string` | Defaults to `"Search..."`. Reports into the query; matches nothing itself. |
| `Actions` | `children` · `className` | | Your buttons, pushed to the end of the bar. |
| `PanelToggle` | `children` · `className` | | Defaults to a gear + "Filter & Config.". |

### Views

Every view also takes `ViewBaseProps` — `id`, `label`, `icon`, `className` — which control how it
appears in the switcher.

**`DataViews.Table`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `selectable` | `boolean` | `false` | Per-row checkboxes and select-all. |
| `onRowClick` | `(row, id) => void` | — | Also makes rows keyboard-reachable. |
| `onRowMove` | `(intent: MoveIntent) => void` | — | Row reordering. Adds a grip column; moves nothing itself. |
| `onAddRow` | `() => void` | — | Shows the `+ Add New` row at the foot of the table. |
| `addRowLabel` | `string` | `"Add New"` | |
| `renderCell` | `(args) => ReactNode` | — | Return `undefined` to fall through to the default cell. |

**`DataViews.Board`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `groups` * | `readonly RowGroup[]` | — | The columns. The board never groups rows itself. |
| `titlePath` | `string` | first visible field | Which field is the card title. |
| `renderCard` | `(args & { group, isDragging }) => ReactNode` | — | Replaces the card; the wrapper keeps the drag. |
| `onRowMove` | `(intent: MoveIntent) => void` | — | A card was dropped. |
| `onColumnAction` | `(groupId: string) => void` | — | The per-column action button in its header. |

**`DataViews.Inbox`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | The detail pane — often `<DataViews.Detail/>`. |
| `renderItem` | `(args & { isActive }) => ReactNode` | — | Replaces the list item. |
| `titlePath` · `datePath` | `string` | — | Which field leads the item, and which shows as its date chip. |
| `itemHref` | `(row, id) => string` | — | Makes items links rather than buttons. |
| `linkComponent` | `React.ElementType` | `<a>` | Your router's link — e.g. `next/link`. |
| `placeholder` | `ReactNode` | — | Shown in the pane while nothing is open. |

**`DataViews.Tree`**

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `nodes` * | `readonly TreeNode[]` | — | The hierarchy. The component never builds one. |
| `labelPath` | `string` | first visible field | Which field labels a node. |
| `renderNode` | `(args) => { name?, icon?, meta? }` | — | Returns parts, not markup — `TreeFolder` owns the row. |
| `expanded` · `onExpandedChange` | `readonly string[]` | — | Controlled expansion. |
| `onNodeMove` | `(intent: MoveIntent) => void` | — | A node was dropped into a new parent. |
| `children` | `ReactNode` | — | The right-hand pane. |

**`DataViews.Detail`** — `className` only. Renders the open row's visible fields, or nothing.

### Panel

| Part | Prop | Type | Description |
| --- | --- | --- | --- |
| `Panel` | `defaultTab` · `title` · `className` | | The 260px rail. |
| `Panel.Section` | `collapsible` · `defaultOpen` | `boolean` | Titled sections fold from a `ConclusionHeader`. Both default `true`, so nothing starts folded. |
| | `description` | `ReactNode` | A small line under the title. Sits with the header, so it still reads when the group is shut. |
| `Panel.Tab` * | `value` * · `label` * · `icon` · `children` | | One tab. |
| `Panel.Section` | `title` · `className` | | A titled group inside a tab. |
| `Panel.Columns` | `title` · `description` · `className` | | Show/hide and drag-reorder columns. Describes itself by default — "Show or hide columns in table view". |
| `Panel.Sort` | `title` · `className` | | Default sort picker. |
| `Panel.SavedViews` | `views` | `readonly SavedView[]` | The list you persisted. |
| | `onValueChange` | `(id: string) => void` | A saved view was picked. |
| | `onSave` | `(snapshot: SavedViewSnapshot) => void` | Persisting is yours — a view outlives the component. |
| | `saveLabel` · `title` · `className` | | |

### Filters

| Part | Prop | Type | Description |
| --- | --- | --- | --- |
| `Filters` | `children` | `ReactNode` | **FormBuilder fields.** The `<FormBuilder>` is inside. |
| | `collapsible` · `defaultOpen` | `boolean` | Fold the fields from the title. Both default `true`. |
| | `description` | `ReactNode` | A small line under the title, above the fields. |
| | `title` | `ReactNode` | Pass `null` to drop the header row. |
| | `clearLabel` | `ReactNode` | Defaults to `"Clear"`. |
| `Filters.Presets` | `for` * · `items` * | `string` · `readonly Preset[]` | Quick-set chips for one field. |
| `Filters.Custom` | `path` * · `label` · `render` * | | A filter no FormBuilder field covers. |
| `Filters.Summary` | `className` | | Active filters as removable chips. |

## TypeScript

The shapes you construct:

```ts
type Row = Record<string, unknown>;

interface FieldConfig {
  path: string;                       // "customer.name" — dotted paths are read for you
  label?: string;
  type?: "text" | "number" | "date" | "boolean" | "hidden" | "enum-badge" | "badge-array"
       | "currency" | "number-format" | "progress-bar" | "star-rating" | "icon-text";
  visible?: boolean;
  variants?: Record<string, BadgeVariant>;   // enum-badge: value → colour
  currency?: string | CurrencyOptions;
  dateFormat?: string | Intl.DateTimeFormatOptions;
  secondaryPath?: string;
  render?: (value: unknown, row: Row) => ReactNode;   // the widest per-field seam
  // …plus limit, thresholds, max, icon, linkType, trueLabel/falseLabel and friends
}

interface DataViewsQuery {
  search: string;
  filters: FilterState;                       // Record<path, string[] | RangeValue>
  sort: { path: string; direction: "asc" | "desc" } | null;
  page: number;
  pageSize: number;
}

type RowGroup = { id: string; label: string; color?: ColumnColor; rows: Row[] };
type TreeNode = { id: string; row: Row; children: TreeNode[]; depth: number };
type MoveIntent = { id: string; from: string | null; to: string | null; index?: number };
type ColumnState = { path: string; label: string; visible: boolean };
type Preset = { label: string; min?: number; max?: number }
            | { label: string; from?: string; to?: string };
```

The loose exports, for writing a part of your own:

```tsx
import {
  DataViews,
  emptyQuery, queryToParams, parseQuery,       // the query's wire format, both directions
  useDataViewsData,                            // rows, visibleFields, getRowId, loading, hasMore…
  useDataViewsView,                            // view, sort, selection, activeId
  useDataViewsPanel, useDataViewsFilters,
  useActiveRow,                                // the row behind activeId
  Cell,                                        // paint one field the way the views do
  markView, markHeader, markPanel,             // register a part of your own
  SkeletonBar, skeletonKeys,                   // the shared loading pieces
  resolveBadgeVariant,
} from "@/components/DataViews";
```

`parseQuery` is the server half — a route handler imports it so the encoder and decoder cannot
drift.

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
| the detail pane beside the inbox or tree | `children` |
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

## Related Components

| Component | When |
| --- | --- |
| [`Table`](./table.md) | You need one table, not several views of one dataset. `DataViews.Table` composes it. |
| [`DataTable`](./data-table.md) | A self-contained TanStack table that sorts, filters and pages **client-side**. Reach for it when the data is already in the browser; reach for `DataViews` when the server owns the query. |
| [`TreeFolder`](./tree-folder.md) | The tree on its own, without the surrounding views. |
| [`FormBuilder`](./form-builder.md) | Writes the filter controls — `DataViews.Filters` takes its fields as children. |
| `DataViewCard` | The card the board renders (a layout, `@/layouts/DataViewCard`), usable directly. |

## One caveat

`DataViews.Detail` resolves `activeId` against `rows` via `getRowId`. The tree selects a **node**
id, so `Detail` fills in only when the node's id is also a row id. Select a synthetic grouping node
and there is no matching row, so it renders nothing. Either key your leaf nodes by row id, or
render your own pane.
