"use client";

import { createContext, useContext } from "react";
import type {
  ColumnState,
  FieldConfig,
  FilterFieldDescriptor,
  FilterState,
  Row,
  Sort,
} from "../../utils/dataViews/types";

/**
 * Every context DataViews uses. As in `FormBuilder`, this is the only file that calls
 * `createContext` — a part never invents its own provider, so there is one place to look when
 * asking "where does this part get its data".
 */

// ─── Data ─────────────────────────────────────────────────────────────────────

export interface DataContextValue {
  /** The rows to paint, exactly as handed in. Already filtered and sorted by the app. */
  rows: readonly Row[];
  /** How to paint each field. */
  fields: readonly FieldConfig[];
  /** The visible fields, in the order the user arranged them. Resolved once by the root. */
  visibleFields: readonly FieldConfig[];
  /** Stable identity for a row — selection and drag both key off this. */
  getRowId: (row: Row, index: number) => string;
  loading: boolean;
  /** True while the *next* page is in flight — `loading` is the first one. */
  loadingMore: boolean;
  /** Whether there is a next page: derived from `rows.length < total`, never passed in. */
  hasMore: boolean;
  /** Ask for the next page. Undefined when the caller did not opt into scroll loading. */
  onLoadMore?: () => void;
}

export const DataContext = createContext<DataContextValue | null>(null);

export function useDataViewsData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("DataViews parts must be rendered inside <DataViews>.");
  return ctx;
}

// ─── View ─────────────────────────────────────────────────────────────────────

/** One entry in the switcher. Registered by rendering the view, never by a visibility map. */
export interface RegisteredView {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

/** The root's interaction state — everything the user can change that is not a row. */
export interface ViewContextValue {
  view: string;
  setView: (id: string) => void;
  /** In the order the views were rendered. */
  views: readonly RegisteredView[];
  search: string;
  setSearch: (q: string) => void;
  sort: Sort;
  setSort: (sort: Sort) => void;
  selection: readonly string[];
  setSelection: (ids: readonly string[]) => void;
  /** The row the detail pane is showing, for the views that have one. */
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  /** Column visibility and order. The panel edits these; the root paints from them. */
  columns: readonly ColumnState[];
  setColumns: (columns: readonly ColumnState[]) => void;
}

export const ViewContext = createContext<ViewContextValue | null>(null);

export function useDataViewsView(): ViewContextValue {
  const ctx = useContext(ViewContext);
  if (!ctx) throw new Error("DataViews parts must be rendered inside <DataViews>.");
  return ctx;
}

// ─── Panel ────────────────────────────────────────────────────────────────────

/**
 * Whether the settings panel is showing. Provided by the **root**, not by `Panel` — the toggle
 * lives in the header, which is `Panel`'s sibling, so neither can own the state the other needs.
 */
export interface PanelContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const PanelContext = createContext<PanelContextValue | null>(null);

export function useDataViewsPanel(): PanelContextValue {
  const ctx = useContext(PanelContext);
  if (!ctx) throw new Error("DataViews parts must be rendered inside <DataViews>.");
  return ctx;
}

/** One entry in the panel's tab strip, registered by rendering a `DataViews.Panel.Tab`. */
export interface PanelTab {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

/** Which tab the panel is on. Owned by `Panel`, because only its own children care. */
export interface PanelTabsContextValue {
  tab: string;
  setTab: (tab: string) => void;
  tabs: readonly PanelTab[];
}

export const PanelTabsContext = createContext<PanelTabsContextValue | null>(null);

export function useDataViewsPanelTabs(): PanelTabsContextValue {
  const ctx = useContext(PanelTabsContext);
  if (!ctx) throw new Error("DataViews.Panel parts must be rendered inside <DataViews.Panel>.");
  return ctx;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface FiltersContextValue {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  /**
   * What each filter control is, read off the `FormBuilder` children of `DataViews.Filters` —
   * never derived from the rows. The root collects them as well, so `Filters.Summary` can label a
   * chip even when it is rendered outside `Filters`.
   */
  filterFields: readonly FilterFieldDescriptor[];
}

export const FiltersContext = createContext<FiltersContextValue | null>(null);

export function useDataViewsFilters(): FiltersContextValue {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("DataViews.Filters parts must be rendered inside <DataViews.Filters>.");
  return ctx;
}
