"use client";

import React, { Children, useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "../../utils/cn";
import { defaultGetRowId } from "../../utils/dataViews/path";
import { emptyQuery } from "../../utils/dataViews/query";
import type {
  ColumnState,
  DataViewsQuery,
  FieldConfig,
  FilterState,
  Sort,
} from "../../utils/dataViews/types";
import {
  DataContext,
  FiltersContext,
  PanelContext,
  ViewContext,
  type RegisteredView,
} from "./context";
import { Actions, Header, PanelToggle, Search, ViewSwitch } from "./header";
import {
  isHeaderElement,
  isPanelElement,
  isViewElement,
  viewMetaOf,
} from "./slots";
import { collectFilterFields, Filters } from "./filters";
import { Panel } from "./panel";
import { BoardView } from "./views/board-view";
import { Detail, InboxView } from "./views/inbox-view";
import { TableView } from "./views/table-view";
import { TreeView } from "./views/tree-view";
import { useControllable } from "./hooks/useControllable";
import type { DataViewsRootProps } from "./types";

/**
 * A cheap identity for a node used only as a memo key. React elements have no stable identity
 * across renders, so an inline `<i className="ri-table-line"/>` would look new every time; the
 * element's props are what actually distinguish one icon from another.
 */
function iconKey(icon: React.ReactNode): string {
  if (icon === null || icon === undefined || typeof icon === "boolean") return "";
  if (React.isValidElement(icon)) return JSON.stringify(icon.props ?? {});
  return String(icon);
}

// ─── Root ─────────────────────────────────────────────────────────────────────

/**
 * Resolve which fields to paint and in what order.
 *
 * The old code sorted `visibleFields` at five call sites with subtly different tie-breaks. There
 * is one rule now: if `columns` is supplied it decides both visibility and order; anything not
 * mentioned in it keeps its declaration order at the end.
 */
function resolveVisibleFields(
  fields: readonly FieldConfig[],
  columns: readonly ColumnState[] | undefined,
): FieldConfig[] {
  if (!columns || columns.length === 0) {
    return fields.filter((f) => f.visible !== false && f.type !== "hidden");
  }
  const byPath = new Map(fields.map((f) => [f.path, f]));
  const ordered: FieldConfig[] = [];
  for (const col of columns) {
    const field = byPath.get(col.path);
    if (field && col.visible) ordered.push(field);
    byPath.delete(col.path);
  }
  for (const field of byPath.values()) {
    if (field.visible !== false && field.type !== "hidden") ordered.push(field);
  }
  return ordered;
}

function DataViewsRoot({
  rows,
  fields,
  children,
  getRowId = defaultGetRowId,
  total = 0,
  loading = false,
  onLoadMore,
  loadingMore = false,
  query,
  onQueryChange,
  defaultQuery,
  defaultView,
  defaultPanelOpen = false,
  onViewChange,
  onSelectionChange,
  onActiveIdChange,
  theme,
  className,
}: DataViewsRootProps) {
  const childArray = Children.toArray(children);

  // A view exists because you rendered it. `Children.toArray` drops `false`/`null`, so
  // `{canSeeTree && <DataViews.Tree/>}` un-registers that view — which is the intent.
  const viewElements = childArray.filter(isViewElement);
  const headerEl = childArray.find(isHeaderElement);
  const panelEl = childArray.find(isPanelElement);
  // Anything the root does not position itself — a `Filters` bar, a toolbar of your own — sits
  // between the header and the views, in the order you wrote it.
  const extras = childArray.filter(
    (n) =>
      !isViewElement(n) && !isHeaderElement(n) && !isPanelElement(n),
  );

  // `viewElements` is a fresh array on every render, so memoising on its identity would never
  // hit. Key on what actually matters instead: which views are rendered and how they present.
  // `icon` is part of that — leave it out and swapping only an icon leaves a stale one showing.
  const viewKey = viewElements
    .map((el) => `${el.props.id}|${el.props.label}|${iconKey(el.props.icon)}`)
    .join(",");
  const registered = useMemo<RegisteredView[]>(
    () =>
      viewElements.map((el) => {
        const meta = viewMetaOf(el)!;
        return {
          id: el.props.id ?? meta.defaultId,
          label: el.props.label ?? meta.defaultLabel,
          icon: el.props.icon,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on `viewKey`, see above
    [viewKey],
  );

  const firstId = registered[0]?.id ?? "";

  // ── The query: the only state that leaves ──────────────────────────────────
  const [currentQuery, setQuery] = useControllable<DataViewsQuery>(
    query,
    onQueryChange,
    emptyQuery(defaultQuery),
  );

  /**
   * Change part of the query.
   *
   * Anything that changes *which* rows match starts a new result set, so the page goes back to 1 —
   * filter down to three rows while sitting on page 4 and there is no page 4 to stay on. Only the
   * component can do this: by the time a caller sees the change, the two have already been
   * conflated into one object.
   */
  const patchQuery = useCallback(
    (patch: Partial<DataViewsQuery>) => {
      setQuery((prev) => {
        const changesResultSet =
          ("search" in patch && patch.search !== prev.search) ||
          ("filters" in patch && patch.filters !== prev.filters) ||
          ("sort" in patch && patch.sort !== prev.sort) ||
          ("pageSize" in patch && patch.pageSize !== prev.pageSize);
        return { ...prev, ...patch, ...(changesResultSet ? { page: 1 } : null) };
      });
    },
    [setQuery],
  );

  // ── UI state: never leaves, so it is held rather than passed ───────────────
  const [currentView, setCurrentView] = useState(defaultView ?? firstId);
  const [currentColumns, setColumns] = useState<readonly ColumnState[]>([]);
  const [currentSelection, setSelectionState] = useState<readonly string[]>([]);
  const [currentActiveId, setActiveIdState] = useState<string | null>(null);
  const [isPanelOpen, setPanelOpen] = useState(defaultPanelOpen);

  // The observers are told, not asked: they report what the component decided, so an app can act
  // on a selection or follow the open row without owning either.
  const setSelection = useCallback(
    (ids: readonly string[]) => {
      setSelectionState(ids);
      onSelectionChange?.(ids);
    },
    [onSelectionChange],
  );
  const setActiveId = useCallback(
    (id: string | null) => {
      setActiveIdState(id);
      onActiveIdChange?.(id);
    },
    [onActiveIdChange],
  );
  const setView = useCallback(
    (id: string) => {
      setCurrentView(id);
      onViewChange?.(id);
    },
    [onViewChange],
  );

  // If the active view stops being rendered, converge on the first one — in an effect, never
  // during render, so a controlled consumer's state actually catches up.
  const known = registered.some((v) => v.id === currentView);
  useEffect(() => {
    if (!known && firstId) setView(firstId);
  }, [known, firstId, setView]);

  const activeView = known ? currentView : firstId;
  const activeElement = viewElements.find(
    (el) => (el.props.id ?? viewMetaOf(el)!.defaultId) === activeView,
  );

  const visibleFields = useMemo(
    () => resolveVisibleFields(fields, currentColumns),
    [fields, currentColumns],
  );

  const dataValue = useMemo(
    () => ({
      rows,
      fields,
      visibleFields,
      getRowId,
      loading,
      loadingMore,
      // Derived, never passed: the component has both halves already, and a `hasMore` prop that
      // disagreed with the rows on screen would be a second source of truth for the same fact.
      hasMore: rows.length < total,
      onLoadMore,
    }),
    [rows, fields, visibleFields, getRowId, loading, loadingMore, total, onLoadMore],
  );

  const setSearch = useCallback((search: string) => patchQuery({ search }), [patchQuery]);
  const setSort = useCallback((sort: Sort) => patchQuery({ sort }), [patchQuery]);

  const viewValue = useMemo(
    () => ({
      view: activeView,
      setView,
      views: registered,
      search: currentQuery.search,
      setSearch,
      sort: currentQuery.sort,
      setSort,
      selection: currentSelection,
      setSelection,
      activeId: currentActiveId,
      setActiveId,
      columns: currentColumns,
      setColumns,
    }),
    [
      activeView,
      setView,
      registered,
      currentQuery.search,
      setSearch,
      currentQuery.sort,
      setSort,
      currentSelection,
      setSelection,
      currentActiveId,
      setActiveId,
      currentColumns,
      setColumns,
    ],
  );

  const panelValue = useMemo(
    () => ({ open: isPanelOpen, setOpen: setPanelOpen }),
    [isPanelOpen, setPanelOpen],
  );

  // The descriptors as well as the value: `Filters.Summary` needs labels for its chips, and it is
  // routinely rendered outside `Filters` — above the table, in a toolbar — where it cannot reach
  // the context `Filters` provides to its own children.
  const filterFields = useMemo(() => collectFilterFields(children), [children]);

  const setFilters = useCallback(
    (filters: FilterState) => patchQuery({ filters }),
    [patchQuery],
  );

  const filtersValue = useMemo(
    () => ({ filters: currentQuery.filters, setFilters, filterFields }),
    [currentQuery.filters, setFilters, filterFields],
  );

  // The active view is always what renders. Nothing to show is shown as nothing — the view keeps
  // its chrome and paints no rows — and `loading` is answered by the view's own skeleton, so the
  // layout never swaps out from under the user.
  const body = activeElement;

  return (
    <DataContext.Provider value={dataValue}>
      <ViewContext.Provider value={viewValue}>
        <PanelContext.Provider value={panelValue}>
          <FiltersContext.Provider value={filtersValue}>
            <div
              data-theme={theme}
              className={cn(
                // The shell is always black: the dark header and the config rail sit on it, and
                // the Master Container is the light surface inside. `overflow-hidden` traps child
                // overflow — without it a tall panel body escapes and adds a page-level scrollbar
                // on top of the panel's own.
                "flex h-full min-h-0 gap-2 overflow-hidden bg-black",
                "text-content-presentation-global-primary",
                className,
              )}
            >
              {/* Left column: header + content. Shrinks as the panel expands. */}
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {headerEl}
                <main className="flex min-h-0 flex-1 overflow-hidden">
                  {/* Master Container. It carries the surface — a form base and a 16px radius —
                      so views paint over it where they want a different colour (the board reads
                      grey, the split views black) and anything the root positions around one
                      inherits it rather than landing on the black shell.

                      No border: Figma draws one, but every view already brings its own edge — the
                      table its header rule, the split views their panel borders — so it only ever
                      read as a second outline around the first. */}
                  <div className="bg-background-presentation-form-base flex flex-1 overflow-hidden rounded-[16px]">
                    {/* Clip the scrollable surface to the parent radius minus its 1px border
                        (16 − 1). At the full 16px the opaque view background sits flush with the
                        outer edge and bleeds past it as a hairline on the straight sides. */}
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[15px]">
                      {/* Anything the root does not position itself — a `Filters` bar, a toolbar
                          of your own — sits above the view and *inside* the light surface, since
                          its controls are host-themed and would be stranded on the black shell. */}
                      {extras.length > 0 && (
                        <div className="bg-background-presentation-form-base shrink-0">{extras}</div>
                      )}
                      {/* A column, so the active view stretches to the full width. As a row it
                          would size each view to its content and leave the shell showing beside
                          a narrow one. */}
                      <div className="flex min-h-0 flex-1 flex-col overflow-auto">{body}</div>
                    </div>
                  </div>
                </main>
              </div>

              {/* The rail is a sibling of the content, not a layer over it, so opening it narrows
                  the view rather than covering it. */}
              {panelEl}
            </div>
          </FiltersContext.Provider>
        </PanelContext.Provider>
      </ViewContext.Provider>
    </DataContext.Provider>
  );
}

/**
 * DataViews — a compound, composition-based multi-view data surface. Author a screen as JSX:
 *
 * ```tsx
 * <DataViews rows={rows} fields={fields} total={total} onQueryChange={setQuery}>
 *   <DataViews.Header title="Orders">
 *     <DataViews.ViewSwitch />
 *     <DataViews.Search />
 *   </DataViews.Header>
 *   <DataViews.Table />
 *   <DataViews.Board groups={groups} />
 * </DataViews>
 * ```
 *
 * A view exists **iff you render it** — there is no visibility map. DataViews is pure UI: it
 * never filters, searches, sorts, groups or mutates. Hand it rows and it paints them; it hands
 * you back what the user did so you can go and query.
 */
export const DataViews = Object.assign(DataViewsRoot, {
  // shell
  Header,
  ViewSwitch,
  Search,
  Actions,
  PanelToggle,
  // panels
  Panel,
  Filters,
  // views
  Table: TableView,
  Board: BoardView,
  Inbox: InboxView,
  Tree: TreeView,
  Detail,
  // states
  // paging
});
