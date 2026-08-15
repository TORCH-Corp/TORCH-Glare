// Enumerated, never `export *` — the same convention as `FormBuilder/index.ts`, so what this
// folder offers is readable in one screen.
//
// Almost everything is reached through the compound root: `DataViews.Table`, `DataViews.Panel`,
// `DataViews.Filters`, and so on. The loose exports below are the pieces you need when writing a
// part of your own.

export { DataViews } from "./data-views";

// The query's wire format, both directions. A page needs the first two; a route handler that
// serves one of these lists needs `parseQuery`.
export { emptyQuery, parseQuery, queryToParams } from "../../utils/dataViews/query";

// Reach into the component's state from inside a custom child — a detail pane, a bespoke filter,
// a toolbar button that clears the selection.
export {
  useDataViewsData,
  useDataViewsFilters,
  useDataViewsPanel,
  useDataViewsView,
} from "./context";
export { useActiveRow } from "./hooks";

// Paint one field the way the views paint it, in your own layout.
export { Cell } from "./cell";

// A view of your own gets the loading state the built-in four get: read `loading` from
// `useDataViewsData()` and lay these out in your own shape. There is no `Empty` counterpart —
// nothing to show is shown as nothing.
export { SkeletonBar, skeletonKeys } from "./states";

// Wrapping a part in a component of your own — a preset panel, a project-standard header — hides
// the marker the root recognises it by, so the wrapper has to carry the marker itself:
//
// ```tsx
// const AppPanel = markPanel(function AppPanel() { return <DataViews.Panel>…</DataViews.Panel>; });
// ```
export { markHeader, markPanel, markView } from "./slots";
export { resolveBadgeVariant } from "./badge";

export type { ResolvedBadgeProps } from "./badge";
export type {
  DataContextValue,
  FiltersContextValue,
  PanelContextValue,
  PanelTabsContextValue,
  RegisteredView,
  ViewContextValue,
} from "./context";
export type * from "./types";
