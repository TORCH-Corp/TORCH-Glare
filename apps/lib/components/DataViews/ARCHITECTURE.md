# DataViews — Architecture & Component Map

Internal reference for the DataViews feature. Use this when changing UI, debugging, or syncing
with the designer.

**Demo route:** `/data-views` (shell in `apps/app/data-views/layout.tsx`)
**Library root:** `apps/lib/components/DataViews/`
**Public docs:** `docs/components/data-views.md` (mirrored into `mcp/docs/` by `sync-docs.mjs`)

---

## 1. What is DataViews?

A compound multi-view layout. One backend response (array of records) renders as any combination
of **Table**, **Kanban**, **Inbox**, **Tree**.

```tsx
// Preset — the standard screen
<DataViews title="Orders" data={orders} fields={fields} />

// Compound — the same thing, spelled out
<DataViews.Root data={orders} fields={fields}>
  <DataViews.Header title="Orders">
    <DataViews.ViewSwitch />
    <DataViews.Spacer />
    <DataViews.ConfigTrigger />
  </DataViews.Header>

  <DataViews.Table />
  <DataViews.Kanban groupBy="status" />

  <DataViews.ConfigPanel />
</DataViews.Root>
```

### The two rules that shape everything

1. **Root owns state; parts read it from context.** No data/config/filter props are threaded
   through the tree. A part that needs state calls `useDataViews()`.
2. **Tabs come from the JSX.** Each view calls `useRegisterView({ id, label, icon })` on mount,
   and the switcher maps over the registrations in order. There is no view list to keep in sync —
   reorder the elements to reorder the tabs, delete an element to drop a tab.

---

## 2. Layout

`DataViewsRoot` is a 2×2 CSS grid. That is what lets the header, the active view, and the config
rail be **flat siblings** in the consumer's JSX while still landing in the right cells — no
`React.Children` introspection, no slot props.

```
┌─────────────────────────────┬──────────┐
│ Header      (col 1, row 1)  │          │
├─────────────────────────────┤  Config  │
│ ViewSurface (col 1, row 2)  │   rail   │
│  └─ the one active view     │ (col 2,  │
│                             │  row 1-2)│
└─────────────────────────────┴──────────┘
```

Each part positions itself: `Header` carries `col-start-1 row-start-1`, `ViewSurface` carries
`col-start-1 row-start-2`, `ConfigPanel` carries `col-start-2 row-span-2`.

`ViewSurface` (`views/ViewSurface.tsx`) is the white "Master Container" card. Every view wraps
its body in one, so the card chrome — radius, clipping, scroll container — is defined once.

---

## 3. File map

```
components/DataViews/
├── index.ts              namespace export (Object.assign) + escape hatches
├── preset.tsx            <DataViews> — config-driven arrangement of the parts
├── root.tsx              <DataViews.Root> — state owner + grid shell
├── context.ts            DataViewsContext, useDataViews, useRegisterView
├── types.ts              all shared types
├── styles.ts             cva definitions + the only place hexes live
├── fieldRenderers.tsx    FieldType → JSX
├── badgeAdapter.ts       BadgeVariant → glare Badge props
├── DataViewRadio.tsx     shared radio row (config rail + single-select filters)
├── header/
│   ├── Header.tsx        the bar + <Spacer>
│   ├── Search.tsx        collapsible, controlled
│   ├── ViewSwitch.tsx    thin wrapper over the library <TabSwitch>
│   ├── Action.tsx        primary header button
│   └── ConfigTrigger.tsx opens the rail; hides while open
├── views/
│   ├── ViewSurface.tsx   the Master Container card
│   ├── Table.tsx         <DataViews.Table> + the reusable <TableGrid>
│   ├── Kanban.tsx  Inbox.tsx  InboxCard.tsx  Tree.tsx
│   └── tree/             TreeSidebar.tsx  TreeDrawer.tsx
├── config/
│   ├── ConfigPanel.tsx   the right rail; owns its own open/close animation
│   └── controls.tsx      the green-checked Switch
└── filters/
    ├── FilterPanel.tsx   filterable-field detection + the three filter kinds
    ├── RangeSliderWithInputs.tsx  DatePickerRangeFilter.tsx
    └── DateRangePopover.tsx  PresetChips.tsx

utils/dataViews/          pure data, no React UI imports
├── pathUtils.ts          getByPath, setByPath, getRecordId, matchesFilterValues, formatPathLabel
├── fieldUtils.ts         detectFields, mergeFields, inferFieldType, visibleFields, resolveInboxConfig
├── rangeUtils.ts         computeNumericExtremes, inferStep, resolvePresets, countActiveFilters
├── treeUtils.ts          autoDetectTreeShape, buildTree, pruneTree, flattenAll, applyMove
└── nestedDataUtils.tsx   renderDetailView, renderNestedObject (returns JSX — the one impure file)

hooks/
├── useDataViewsState.ts  the state machine Root mounts
├── useViewData.ts        filter → sort → visible-fields, for every view
└── useIsMobile.ts        <768px
```

---

## 4. Where state lives

| State | Owner | Notes |
| --- | --- | --- |
| `items` / `flatItems` | `useDataViewsState` | The source dataset. **Only ever written through `updateRecord` or `onDataUpdate`** — see §5 |
| `fields` | `useDataViewsState` | `detectFields` merged with consumer overrides, then column visibility/order |
| `config` | `useDataViewsState` | Sort, column state, kanban group-by, preview pane |
| `filterState` | `useDataViewsState` OR consumer | Controlled when `onFilterChange` is passed |
| `currentView` | `useDataViewsState` | |
| `registeredViews` | `root.tsx` | Populated by `useRegisterView` |
| `panel.open` | `root.tsx` | Intent only — `ConfigPanel` owns the animation |
| selection | `DataViews.Table` | Controlled via `selectedIds` / `onSelectionChange`, else internal |
| `inboxFilter`, `selectedItem` | `views/Inbox.tsx` | |
| `expanded`, `selectedId`, `rightPaneMode` | `views/Tree.tsx` | |

**Identity discipline matters here.** `setConfig`, `setFilterState`, `onDataUpdate`, and
`updateRecord` are `useCallback`-stable and the context value is `useMemo`d. They land in context
and feed every `useMemo` downstream; a fresh identity per render would defeat all of them. Don't
"simplify" them back into inline arrows.

The same rule applies to **object props that reach a memo dependency**. `treeShape` is memoized on
the individual `treeConfig` fields, not on the object, and `DataViews.Tree` rebuilds its config
object with `useMemo` rather than a rest-spread. Consumers routinely pass an inline
`treeConfig={{…}}`, whose identity changes every render; without this the context value churned on
every Root render and the tree's expansion state was recomputed from scratch each time — which
collapsed the whole tree whenever anything else on the page changed.

---

## 5. The shared pipeline

`useViewData()` is the filter → sort → visible-fields pipeline, written once:

```ts
const { records, displayFields, idPath } = useViewData({ sort: true });
```

| Option | Default | Meaning |
| --- | --- | --- |
| `source` | `"flat"` | `"tree"` gives the hierarchy-preserving records |
| `filter` | `true` | Tree passes `false` — it prunes its own forest |
| `sort` | `false` | Table passes `true` |

Tree is the one exception, and for a real reason: a flat filter drops a matching node's ancestors
and orphans it, so it uses `pruneTree` (keep a node if it matches *or any descendant does*).

### Writing data back

A view never holds the whole dataset — `useViewData` hands it a filtered, usually flattened
projection. So **a view must not build a new array and pass it to `onDataUpdate`**: that deletes
every record the current filter is hiding, and flattens the hierarchy on tree-shaped data. Edit by
id instead:

```ts
const { updateRecord } = useDataViews();
updateRecord(id, (record) => setByPath(record, "status", "Shipped"));
```

`updateRecord` walks `items` — the complete, still-nested source — via
`treeUtils.updateRecordById`. `onDataUpdate` remains on the context for genuinely wholesale
rewrites; `DataViews.Tree`'s drag-to-reparent (`applyMove`) is the only legitimate caller.

### Record identity

`recordKey(item, fallbackPath, index)` in `pathUtils.ts` — a literal `id`, else the first visible
field's value, else `__row<index>`. One implementation, because keys, selection, and drag
targeting must agree across views.

The index fallback is namespaced rather than a bare number on purpose: callers compare identities
as strings, so a record whose id is `"2"` and the record at index `2` would otherwise collide and
selecting one would tick both.

---

## 6. Styling & theming

**All colour values live in `styles.ts`.** A hex anywhere else is a regression:

```bash
grep -rn '#[0-9A-Fa-f]\{6\}' apps/lib/components/DataViews --include=*.tsx   # should be empty
```

The header and config rail are **always dark** by design (Figma) — both carry `data-theme="dark"`
even when the host app is light. That is also what makes them tokenised rather than hardcoded:
inside a dark subtree the presentation variables already resolve to the Figma hexes.

| Figma hex | token (under `data-theme="dark"`) |
| --- | --- |
| `#1C1D1F` | `background-presentation-body-overlay-primary` |
| `#252729` | `background-presentation-body-primary` |
| `#2C2D2E` | `border-presentation-global-primary` |
| `#0075FF` | `border-presentation-state-focus` |
| `#005ECC` | `background-presentation-button-fill-blue-primary` |
| `#FFFFFF` | `content-presentation-global-primary` |

A few Figma colours have no token (`#330C69`, `#0AC713`, `#AE71FF`, `#434446`). They stay as
literals in `styles.ts` — as **complete Tailwind class strings** in `RAW_CLASS`, never as
interpolated `bg-[${hex}]` at a call site, because Tailwind's JIT scans source text and would
never generate a dynamic class.

**Never use `bg-background-presentation-global-*`.** Those variables don't exist and render
transparent. Only the *text* and *border* `global` families are real.

---

## 7. Field types

`fieldRenderers.tsx` maps `FieldType` → JSX: `text`, `number`, `date`, `date-format`, `boolean`,
`currency`, `number-format`, `enum-badge`, `badge-array`, `progress-bar`, `star-rating`,
`icon-text`, `two-line`, `avatar`, `link`, `image`, `hidden`.

Auto-inference lives in `inferFieldType()` (`fieldUtils.ts`): `status`/`priority` → `enum-badge`,
`email`/`phone`/`url` → `link`, `tags`/`labels` → `badge-array`, `*date`/`*time` → `date-format`,
money-ish keys → `currency`, `rating`/`score` ≤ 5 → `star-rating`, arrays → `badge-array`,
booleans → `boolean`.

`field.render = (value, row) => <YourJSX />` always wins.

---

## 8. Filter rules

A field becomes filterable when `filterable: true`, or its type is
`enum-badge | boolean | badge-array | icon-text`, or it is plain text with ≤10 distinct values.
Numeric and date fields require explicit opt-in.

```ts
type FilterValue =
  | string[]                                       // categorical
  | { kind: "number"; min?: number; max?: number }  // numeric range
  | { kind: "date"; from?: string; to?: string };   // date range, ISO YYYY-MM-DD
```

Filters live **only** in the config rail. There is no per-view inline filter panel; if you find
yourself adding a `showFilters` prop back, that is the thing this refactor removed.

---

## 9. Common change checklist

1. **New field type** — add the renderer in `fieldRenderers.tsx`, register it in the `RENDERERS`
   table, extend `FieldType` in `types.ts`.
2. **New badge variant** — add to `BadgeVariant` (`types.ts`) *and* the switch in
   `badgeAdapter.ts`. Don't bypass `resolveBadgeVariant()`.
3. **New colour** — `styles.ts`, nowhere else. Check §6 for an existing token first.
4. **New view** — a component that calls `useRegisterView` and returns `null` when inactive; wrap
   its body in `<ViewSurface>`. Keep hooks in an inner component so they don't run while inactive.
5. **New shared state** — `useDataViewsState`, then the context value in `root.tsx`. Keep the
   setter `useCallback`-stable, and memoize any object on the *fields* it is built from.
6. **New misuse worth catching** — `devWarn(key, message)` in `devWarn.ts`. It is dropped from
   production builds and fires once per key. Current warnings: duplicate view id, `groupBy` naming
   a field that doesn't exist, `selectedIds` without `onSelectionChange`.
7. **Docs** — `docs/components/*.md` (canonical; `mcp/docs/` is generated) and
   `docs/how-to/data-views-from-backend-response.md` if the consumer API changed.

---

## 9a. Tests

`apps/tests/dataViews.utils.test.ts` covers the pure helpers; `dataViews.mutation.test.tsx` pins
the behaviours that regressed during the compound refactor — editing under an active filter must
not drop records, tree expansion must survive a Root re-render, the inbox rails must survive a
filter that empties the list. Run with `pnpm test`.

Note `dataViews.mutation.test.tsx` stubs `window.matchMedia`: jsdom has no implementation and
`useIsMobile` needs it.

---

## 10. CLI distribution

`DataViews` is registered in `apps/lib/registry.json` as a folder component
(`"path": "components/DataViews"`), so `npx torch-glare add DataViews` copies the whole folder
plus its `registryDependencies` — `utils/dataViews`, `hooks/useDataViewsState`,
`hooks/useViewData`, `hooks/useIsMobile`, and the component deps — and installs the npm peers
(`@radix-ui/react-slider`, `react-day-picker`, `vaul`, …).
