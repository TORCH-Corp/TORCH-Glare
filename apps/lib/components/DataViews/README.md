# DataViews

One dataset, several ways to look at it — table, board, tree, inbox — with a shared header,
filters and settings rail. Rows load as you scroll.

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

  {/* The settings rail. Filters live in it, which is why the header toggle reads
      "Filter & Config." — not as a separate bar. */}
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

That rail is the product UI, not one arrangement among many: every example under
`app/data-views/` renders it.

## The three rules

**A part exists because you rendered it.** There is no `views={{ table: true, board: false }}` map
and no `showFilters` flag. Render `<DataViews.Tree/>` and a Tree tab appears; wrap it in
`{canSeeTree && …}` and it disappears, switching away from it if it was open. The same goes for
panel tabs.

Two things are *not* parts you render: empty and loading. Nothing to show is shown as **nothing** —
the table keeps its header band and has no rows, the board keeps its columns and has no cards. A
message in place of the view threw the chrome away, and it could not tell "no results" from "not
fetched yet", so the first load announced that nothing matched before anything had been asked for.
Loading is answered by each view painting a skeleton in its own shape, driven by the `loading`
prop.

**It is pure UI.** DataViews never filters, searches, sorts, groups, paginates, builds a tree,
infers a schema or mutates a row. It paints the `rows` you hand it, in the order you hand them.
Nothing on screen moves until you hand back different data — which is the point: a drag that fails
to save leaves the board showing the truth.

So you supply: `rows` (already queried), `total`, `fields`, filter options and slider bounds,
board `groups`, tree `nodes`.

**Only the query leaves.** Search, filters, sort, page and page size are one object, reported
through `onQueryChange`, because they are one question — and because a query with a new filter and
a stale page number is not a query anyone meant to ask. Everything else the user can change —
which view is showing, which tab is open, how the columns are arranged, what is selected, which
row is open — changes nothing but the picture, so the component keeps it.

| The user… | You get |
| --- | --- |
| types, filters, sorts, turns a page | `onQueryChange(query)` → go and fetch |
| drags a card, a row or a node | `onRowMove({id, from, to, index})` → save, hand back updated rows |
| selects rows / opens one | `onSelectionChange` / `onActiveIdChange` — told, not asked |

Changing a filter resets `page` to 1 internally. Only the component can do that: by the time you
see the change, "new filter" and "new page" have already become one object.

## Custom rendering

Four seams, from narrowest to widest:

| Want | Use |
| --- | --- |
| one field painted your way, everywhere | `FieldConfig.render(value, row)` |
| one cell, in the table only | `<DataViews.Table renderCell={…} />` (return `undefined` to fall through) |
| the board's card, the inbox row, a tree node | `renderCard` · `renderItem` · `renderNode` |
| a whole new view | `markView(MyView, { defaultId, defaultLabel })` — it registers in the switcher |

The inbox's detail pane is simply `children`; `useActiveRow()` resolves whatever is open, and
`Cell` paints a field the way every other view paints it.

The tree's `children` are its **pane tabs** — `DataViews.Tree.Table`, `.Cards` and `.Tab` — and a
tab exists because you rendered it: pass none and there is no pane at all. Anything in there that
is not a tab *is* the pane, which is the whole-pane escape hatch.

A view of your own gets the loading state the built-in four get — read it from the same context and
lay out the same pieces, so it shimmers in its own shape rather than inventing a second look:

```tsx
const MyView = markView(function MyView() {
  const { rows, visibleFields, loading } = useDataViewsData();
  if (loading) return <>{skeletonKeys(6).map((i) => <SkeletonBar key={i} className="w-[70%]" />)}</>;
  return …;
}, { defaultId: "gallery", defaultLabel: "Gallery" });
```

`renderNode` returns `{ name?, icon?, meta? }` rather than markup, because `TreeFolder` owns the
row — indent, connectors, selection band, drag grip — and takes its label as text.

## Files

| Path | What is in it |
| --- | --- |
| `data-views.tsx` | the root: splits children into slots, registers views, owns the query and the UI state |
| `context.ts` | the only file that calls `createContext` — Data · View · Panel · PanelTabs · Filters |
| `slots.ts` | the markers and guards the root recognises its children by |
| `types.ts` | every props interface; zero runtime imports |
| `header.tsx` | `Header` · `ViewSwitch` · `Search` · `Actions` · `PanelToggle` |
| `views/` | `table-view` · `board-view` · `tree-view` · `inbox-view` · `pane-views` (the tree pane's tabs) · `card-rows` (the card body the board and the pane share) |
| `panel/` | the rail: `panel` · `tab` · `section` · `columns` · `sort` · `saved-views` · `controls` |
| `filters/` | `filters` · `children` (the walk) · `sync` · `presets` · `custom` · `summary` · `labelled` · `values` |
| `cell.tsx` | paints one field of one row — every view goes through it |
| `states.tsx` | `SkeletonBar` · `skeletonKeys` — the shared pieces each view's skeleton is built from |
| `hooks/` | `useControllable` (controlled/uncontrolled latching) · `useActiveRow` (resolves what is open) |

`utils/dataViews/` holds `types.ts` (the vocabulary), `path.ts` (reading a value by path) and
`query.ts` (the query's wire format — `emptyQuery`, `queryToParams`, `parseQuery`). The last is
imported by both the client and the route handler on purpose: an encoder and a decoder that live
apart drift the first time either gains a field.

## Large datasets

Rows load **as you scroll**. There is no pager: hand over `onLoadMore` and append each page to
`rows`, and every view asks for the next one as it nears its end.

Accumulating is the app's job, as ever — the component paints what it is handed and asks for more.
Whether there *is* more is not a prop: it is `rows.length < total`, which the component already
knows. Changing the search, a filter or the sort resets `page` to 1, which is what starts the
accumulation over. See `app/data-views/scale/page.tsx` for the `useInfiniteQuery` wiring: the key
deliberately excludes `page`, since that is what `pageParam` drives.

**The table also virtualizes**, past 300 rows. Below that it renders every row exactly as it always
has, so the row drag, the column resize and small tables are untouched. Above it the DOM holds a
window of about forty rows however many are loaded.

Crossing that line is not free, and the mechanism is worth knowing before changing this file:
`Table` is `table-layout: auto` with a 200px per-cell minimum, so column widths come from the rows
that are *mounted*. `usePinnedColumnWidths` therefore remembers the widths on every render while
the table is whole, and pins those — plus the table's own width — at the moment it stops being
whole. Measure after the swap instead and you pin the collapsed widths: the table halves in width
and the content spills between columns.

The board and inbox load on scroll but do not virtualize — variable-height cards and list items,
and far fewer of them. The **tree does neither**: a tree wants its children fetched when a node is
expanded, not its siblings paged in, and that is not built. It is the one view that cannot yet take
a large dataset.

## Dragging

Four surfaces drag: board cards between columns, table rows into a manual order, the config rail's
column list, and tree nodes into a new parent. All four go through one hook,
`lib/hooks/useDragDrop.tsx`, and all four **work with a finger and with the keyboard** — hold to
pick up, swipe to scroll; or Space, arrows, Space.

That is the reason the hook exists. Each surface used to implement drag itself on the HTML5 Drag
and Drop API, which mobile browsers never fire from touch: on a phone none of it worked at all.

Each is opt-in by handing over a callback, and none of them move anything on their own:

| Surface | Turn it on with | Reports |
| --- | --- | --- |
| board | `<DataViews.Board onRowMove>` | which column, at which index |
| table | `<DataViews.Table onRowMove>` — adds a grip column | the row it was dropped on |
| tree | `<DataViews.Tree onNodeMove>` | the new parent and index |
| column rail | always on | the new column order (internal state) |

A table's manual order and a sort are two different orders, and the component cannot know which
one you meant. It reports the drop; deciding is yours — the `views` example clears the sort.

## Two colour worlds

The chrome is always dark and the content is not. `data-theme="dark"` is scoped to the header bar
and the settings rail, so their `#252729` / `#1C1D1F` literals — all picked against pure black in
Figma — resolve correctly no matter what theme the host app runs in. The views inside keep the
host theme, which is why the table reads white and the board grey.

Wrapping the whole component in `data-theme="dark"` would flip the content surface too, which it
never was. The `theme` prop sets `data-theme` on the root for the content; the chrome stays dark
regardless.

The Master Container carries the surface — `background-presentation-form-base`, a 1px
`border-presentation-global-primary` and a 16px radius — matching Figma's `Master Container`. Views
paint over it where they want something else, which is why the board reads grey. Anything the root
positions *around* a view (an extras bar, say) inherits it and needs no background of its own.

The views compose the shared components — `Table`, `DataViewCard`, `TabSwitch`, `TreeFolder`,
`Checkbox`, `Badge` — rather than re-implementing them. The 44px header band, the 50px rows, the
cell fade mask, the drag-resize handles and the tree's connector lines all come from those, and
hand-rolling them is how this component drifts away from the rest of the product.

## Filters are FormBuilder fields

Not a config array describing fields — the fields themselves, one JSX child each, exactly as any
other form in this library is written. The `<FormBuilder>` lives *inside* `Filters`; you supply only
its fields. They render inside `<CellContext.Provider value="bare">`, the mode that strips the
`FieldSection` label row and the table-cell border, leaving the control alone.

What each child *means* comes from the field, not from you: `FormBuilder` stamps every field with a
`FieldKind` (see `fieldKindOf`), so a `MultiSelect` becomes a list of values, a `Slider` a numeric
range, a `DateRange` a date range. Nothing is inferred from the rows.

Four details that matter if you extend it:

- react-hook-form reads `.` in a field name as nesting, so a filter on `customer.name` is
  registered as `customer__name`. `toName` in `filters/values.ts` does the escaping, and `Filters`
  applies it — you write the real path.
- Changes are debounced ~200ms and compared before emitting. Without both, `watch` → emit → new
  `values` → re-render is a loop that eats keystrokes.
- The controls own only the paths they declare. Every other key in `FilterState` — anything
  `Filters.Custom` wrote, anything you seeded — is merged through untouched.
- A control at its neutral position emits **no key**: a slider dragged back to exactly `[min,max]`
  removes its filter rather than sending "everything".

## One caveat

`DataViews.Detail` resolves `activeId` against `rows` via `getRowId`. The tree selects a **node**
id, so `Detail` fills in only when the node's id is also a row id. Select a synthetic grouping node
— a "Pending" branch you built to hold children — and there is no matching row, so it renders
nothing. Either key your leaf nodes by row id, or render your own pane and say which case you are
in; the `views` example does the latter.
