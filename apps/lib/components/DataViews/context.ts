"use client";

import { createContext, useContext, useEffect, useId, useRef, type ReactNode } from "react";
import type { DynamicRecord, FieldConfig, FilterState, ViewConfig, ViewId } from "./types";
import type { ResolvedTreeConfig } from "../../utils/dataViews/treeUtils";

/**
 * A view that has announced itself to the Root. `DataViews.ViewSwitch` renders
 * one tab per registration, in registration order — which is the order the
 * consumer wrote the views in their JSX. This is what replaces the old
 * hardcoded `VIEW_ORDER` / `VIEW_META` constants: to reorder, relabel, or
 * re-icon the tabs you move or configure the view elements themselves.
 */
export type RegisteredView = {
  id: ViewId;
  label: string;
  icon: ReactNode;
  /**
   * Identifies the *component instance* that registered, as opposed to the view
   * id. Lets the Root tell a legitimate re-registration (same instance, new
   * label) from two different components claiming the same id, and stops a
   * unmounting instance from unregistering its replacement.
   * @internal
   */
  token: string;
};

/**
 * Everything a DataViews part can read or do.
 *
 * The data-bearing fields are `readonly` on purpose: they are the Root's state,
 * and a view that mutates them in place would desynchronise every other view.
 * Go through `setConfig` / `setFilterState` / `updateRecord` / `onDataUpdate`.
 */
export type DataViewsContextValue = {
  /** Source records, tree shape preserved. Only `DataViews.Tree` wants these. */
  readonly items: readonly DynamicRecord[];
  /** Source records flattened — what every non-tree view reads. */
  readonly flatItems: readonly DynamicRecord[];
  /** Detected fields merged with consumer overrides and column visibility/order. */
  readonly fields: readonly FieldConfig[];

  readonly config: Readonly<ViewConfig>;
  setConfig: (patch: Partial<ViewConfig>) => void;

  readonly currentView: ViewId;
  setCurrentView: (id: ViewId) => void;

  readonly filterState: Readonly<FilterState>;
  setFilterState: (next: FilterState) => void;

  /**
   * Replace the whole dataset. Correct only for genuinely wholesale rewrites
   * (`DataViews.Tree`'s drag-to-reparent). **Do not** use it to save a
   * single-record edit: a view only ever holds a filtered, flattened
   * projection, so writing that projection back deletes every record the view
   * was hiding. Use `updateRecord` instead.
   */
  onDataUpdate: (next: DynamicRecord[]) => void;

  /**
   * Edit one record by id, against the original dataset.
   *
   * Safe from any view under any filter: the write targets `items`, recursing
   * into nested children, so neither filtered-out records nor hierarchy are
   * disturbed.
   */
  updateRecord: (id: unknown, updater: (record: DynamicRecord) => DynamicRecord) => void;

  /** Result of tree auto-detection — `DataViews.Tree` uses it to decide whether
   *  it can render at all. */
  readonly treeShape: Readonly<ResolvedTreeConfig>;

  readonly registeredViews: readonly RegisteredView[];
  registerView: (view: RegisteredView) => () => void;

  readonly panel: { readonly open: boolean; toggle: () => void; close: () => void };
};

const DataViewsContext = createContext<DataViewsContextValue | null>(null);

export const DataViewsProvider = DataViewsContext.Provider;

export function useDataViews(): DataViewsContextValue {
  const ctx = useContext(DataViewsContext);
  if (!ctx) {
    throw new Error(
      "DataViews components must be rendered inside <DataViews.Root>. " +
        "Wrap them, or use the config-driven <DataViews /> instead.",
    );
  }
  return ctx;
}

/**
 * Announce a view to the Root and report whether it is the active one.
 *
 * Active-ness is derived from `currentView` directly rather than from the
 * registry, so the correct view renders on the very first paint — the registry
 * only feeds the tab bar, which can tolerate settling one frame later.
 */
export function useRegisterView(view: Omit<RegisteredView, "token">): boolean {
  const { registerView, currentView } = useDataViews();
  const { id, label } = view;
  const token = useId();

  // `icon` is a fresh React element on every render, so it cannot be an effect
  // dependency without thrashing the registry. Read it through a ref instead:
  // the effect re-runs on id/label changes and picks up whatever icon is
  // current at that moment.
  const iconRef = useRef(view.icon);
  iconRef.current = view.icon;

  useEffect(() => {
    return registerView({ id, label, icon: iconRef.current, token });
  }, [registerView, id, label, token]);

  return currentView === id;
}
