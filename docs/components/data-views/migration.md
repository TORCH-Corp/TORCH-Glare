---
title: Migrating to the DataViews component
description: The DataViewsLayout family was replaced by one compound DataViews component. What each old part maps to, and what was removed.
group: migration
keywords: [migration, data-views, dataviews-layout, kanban-view, table-view, inbox-view, tree-view, config-panel, upgrade, breaking]
---

# Migrating to the DataViews component

The `DataViewsLayout` family — a layout component plus one standalone component per view, wired
together with `useDataViewsState` — was replaced by a single compound component, `DataViews`.

If you never used those, there is nothing to do here: they were **folder components that the
registry never listed**, so `npx torch-glare add KanbanView` was never able to install one. The
docs described them, the CLI could not deliver them. That mismatch is what this release fixes.

## What maps to what

| Old | New |
| --- | --- |
| `DataViewsLayout` | `DataViews` |
| `TableView` | `DataViews.Table` |
| `KanbanView` | `DataViews.Board` |
| `InboxView` | `DataViews.Inbox` |
| `TreeView` | `DataViews.Tree` |
| `DataViewsConfigPanel` | `DataViews.Panel`, with `Panel.Tab` · `Panel.SavedViews` · `Panel.Columns` · `Panel.Sort` |
| `useDataViewsState` | the `query` prop + `onQueryChange` |

The shape of the change is that a view is no longer *configured*, it is *rendered*. There is no map
of which views to enable: render `<DataViews.Board/>` and a Board tab appears; wrap it in a
condition and it disappears, switching away from it if it was the open one.

```tsx
// before — composable mode, wired by hand
const state = useDataViewsState();
<DataViewsLayout state={state} views={{ table: true, kanban: true }}>
  <TableView state={state} />
  <KanbanView state={state} groups={groups} />
</DataViewsLayout>

// after
<DataViews rows={rows} total={total} fields={fields} onQueryChange={setQuery}>
  <DataViews.Header title="Orders">
    <DataViews.ViewSwitch />
  </DataViews.Header>
  <DataViews.Table />
  <DataViews.Board groups={groups} />
</DataViews>
```

## Also removed

Three parts of `DataViews` itself went in the same release.

**`DataViews.Pagination`** — rows now load as you scroll. Pass `onLoadMore` and append each page to
`rows`; whether there is more is derived from `rows.length < total`, so there is no `hasMore` prop.
See the *Large datasets* section of the [DataViews doc](./index.md).

**`DataViews.Empty`** — when there is nothing to show, the view shows nothing: the table keeps its
header band and has no rows, the board keeps its columns and has no cards. A centred message in
place of the view threw away the chrome, and it could not tell "no results" apart from "not fetched
yet" — so the first load of every page announced that nothing matched before anything had been
asked for.

**`DataViews.Loading`** — each view now paints its own skeleton, in its own shape, driven by the
`loading` prop. A custom view registered with `markView` gets the same thing: read `loading` from
`useDataViewsData()` and lay out the exported `SkeletonBar` / `skeletonKeys`.

## Upgrading a copied component

`DataViews` is copy-in like everything else, so upgrading means re-running `add` and re-applying any
local edits:

```bash
npx torch-glare@latest add DataViews
```

That copies the folder plus its dependencies — `Table`, `FormBuilder`, `TreeFolder`, the
`useDragDrop` and `useInfiniteScroll` hooks, and the `dataViews` utilities.
