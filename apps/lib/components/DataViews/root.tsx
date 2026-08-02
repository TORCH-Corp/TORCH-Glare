"use client";

import { forwardRef, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { DynamicRecord, FieldConfig, FilterState, TreeConfig, ViewConfig } from "./types";
import { DataViewsProvider, type DataViewsContextValue, type RegisteredView } from "./context";
import { useDataViewsState } from "../../hooks/useDataViewsState";
import { shellStyles } from "./styles";
import { devWarn } from "./devWarn";
import { cn } from "../../utils/cn";
import type { Themes } from "../../utils/types";

export type DataViewsRootProps = {
  data?: DynamicRecord[];
  fields?: FieldConfig[];
  config?: Partial<ViewConfig>;
  treeConfig?: TreeConfig;

  /** Controlled filter state. Pass `onFilterChange` to take ownership. */
  filterState?: FilterState;
  onFilterChange?: (filters: FilterState) => void;

  children?: ReactNode;
  className?: string;
  theme?: Themes;
};

/**
 * Owns all DataViews state and lays out the shell.
 *
 * The shell is a 2×2 grid so the header, the active view, and the config rail
 * can be flat siblings in the consumer's JSX while still landing in the right
 * cells — no `React.Children` introspection, no slot props:
 *
 *     ┌──────────────┬────────┐
 *     │ Header       │        │
 *     ├──────────────┤ Config │
 *     │ active view  │  rail  │
 *     └──────────────┴────────┘
 */
export const DataViewsRoot = forwardRef<HTMLDivElement, DataViewsRootProps>(function DataViewsRoot(
  {
    data,
    fields,
    config: initialConfig,
    treeConfig,
    filterState,
    onFilterChange,
    children,
    className,
    theme,
  },
  ref,
) {
  const {
    items,
    flatItems,
    resolvedFields,
    config,
    setConfig,
    currentView,
    setCurrentView,
    filterState: activeFilterState,
    setFilterState,
    onDataUpdate,
    updateRecord,
    treeShape,
  } = useDataViewsState({
    data,
    fields,
    config: initialConfig,
    treeConfig,
    filterState,
    onFilterChange,
  });

  // --- view registry -----------------------------------------------------
  const [registeredViews, setRegisteredViews] = useState<RegisteredView[]>([]);

  // Upsert, not insert-if-absent: a view whose `label` or `icon` changed must
  // update **in place**. Re-adding it would move the tab to the end of the bar,
  // silently reordering the switcher.
  const registerView = useCallback((view: RegisteredView) => {
    setRegisteredViews((prev) => {
      const at = prev.findIndex((v) => v.id === view.id);
      if (at === -1) return [...prev, view];

      const existing = prev[at];
      if (existing.token !== view.token) {
        devWarn(
          `duplicate-view:${view.id}`,
          `Two components registered the view id "${view.id}". Only one tab appears ` +
            `and the later registration wins. Give each view a distinct id.`,
        );
      }
      if (existing.label === view.label && existing.token === view.token) return prev;

      const next = [...prev];
      next[at] = view;
      return next;
    });

    // Match on the token, not just the id: when a view unmounts while a
    // replacement with the same id has already registered, removing by id alone
    // would take the replacement's tab with it.
    return () =>
      setRegisteredViews((prev) =>
        prev.filter((v) => !(v.id === view.id && v.token === view.token)),
      );
  }, []);

  // If `currentView` names a view nobody rendered (the default "table" when
  // the consumer only wrote a Kanban, or a view that just unmounted), fall
  // back to the first one that did register.
  useEffect(() => {
    if (registeredViews.length === 0) return;
    if (registeredViews.some((v) => v.id === currentView)) return;
    setCurrentView(registeredViews[0].id);
  }, [registeredViews, currentView, setCurrentView]);

  // --- config rail -------------------------------------------------------
  // Root owns only the open/closed intent. `DataViews.ConfigPanel` owns its
  // own mount-through-close animation, so the rail is absent from the DOM
  // entirely when no ConfigPanel was rendered.
  const [open, setOpen] = useState(false);

  const closePanel = useCallback(() => setOpen(false), []);
  const togglePanel = useCallback(() => setOpen((v) => !v), []);

  const panel = useMemo(
    () => ({ open, toggle: togglePanel, close: closePanel }),
    [open, togglePanel, closePanel],
  );

  const value = useMemo<DataViewsContextValue>(
    () => ({
      items,
      flatItems,
      fields: resolvedFields,
      config,
      setConfig,
      currentView,
      setCurrentView,
      filterState: activeFilterState,
      setFilterState,
      onDataUpdate,
      updateRecord,
      treeShape,
      registeredViews,
      registerView,
      panel,
    }),
    [
      items,
      flatItems,
      resolvedFields,
      config,
      setConfig,
      currentView,
      setCurrentView,
      activeFilterState,
      setFilterState,
      onDataUpdate,
      updateRecord,
      treeShape,
      registeredViews,
      registerView,
      panel,
    ],
  );

  return (
    <DataViewsProvider value={value}>
      <div ref={ref} data-theme={theme} className={cn(shellStyles(), className)}>
        {children}
      </div>
    </DataViewsProvider>
  );
});
