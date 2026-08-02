"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  DynamicRecord,
  FieldConfig,
  FilterState,
  TreeConfig,
  ViewConfig,
  ViewId,
} from "../components/DataViews/types";
import { defaultConfig } from "../components/DataViews/types";
import { detectFields, mergeFields } from "../utils/dataViews/fieldUtils";
import { autoDetectTreeShape, flattenAll, updateRecordById } from "../utils/dataViews/treeUtils";

export type UseDataViewsStateOptions = {
  data?: DynamicRecord[];
  fields?: FieldConfig[];
  config?: Partial<ViewConfig>;
  treeConfig?: TreeConfig;
  filterState?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
};

export function useDataViewsState({
  data,
  fields,
  config: initialConfig,
  treeConfig,
  filterState: externalFilterState,
  onFilterChange,
}: UseDataViewsStateOptions) {
  const [currentView, setCurrentView] = useState<ViewId>(
    initialConfig?.defaultView || defaultConfig.defaultView,
  );
  const [config, setConfig] = useState<ViewConfig>({ ...defaultConfig, ...initialConfig });
  const [items, setItems] = useState<DynamicRecord[]>(data || []);
  const [internalFilterState, setInternalFilterState] = useState<FilterState>({});

  useEffect(() => {
    setItems(data || []);
  }, [data]);

  /**
   * Keep the `config` prop live after mount.
   *
   * `useState` initialisers run once, so a changing `config` — e.g.
   * `config={routeId ? { defaultView: "inbox" } : undefined}` — would otherwise
   * never apply. We diff against the previously-*supplied* config rather than
   * against current state, so edits the user made through the config rail are
   * not clobbered on every unrelated re-render: only keys the consumer actually
   * changed are written through.
   */
  const lastSuppliedConfig = useRef<Partial<ViewConfig> | undefined>(initialConfig);
  useEffect(() => {
    const prev = lastSuppliedConfig.current;
    lastSuppliedConfig.current = initialConfig;
    if (!initialConfig || initialConfig === prev) return;

    const changed: Partial<ViewConfig> = {};
    for (const key of Object.keys(initialConfig) as Array<keyof ViewConfig>) {
      if (!prev || !Object.is(prev[key], initialConfig[key])) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- key-wise copy across a union of value types
        (changed as any)[key] = initialConfig[key];
      }
    }
    if (Object.keys(changed).length === 0) return;

    setConfig((cur) => ({ ...cur, ...changed }));
    if (changed.defaultView) setCurrentView(changed.defaultView);
  }, [initialConfig]);

  const activeFilterState = externalFilterState ?? internalFilterState;

  // Memoized on the individual config fields rather than the `treeConfig`
  // object: consumers routinely pass an inline literal, whose identity changes
  // every render. `treeShape` lands in the context value, so churn here would
  // re-render every view on every Root render.
  const {
    childrenField: cfgChildrenField,
    parentField: cfgParentField,
    idField: cfgIdField,
    orderField: cfgOrderField,
    nodeLabel: cfgNodeLabel,
    defaultExpanded: cfgDefaultExpanded,
  } = treeConfig ?? {};

  const treeShape = useMemo(
    () =>
      autoDetectTreeShape(items, {
        childrenField: cfgChildrenField,
        parentField: cfgParentField,
        idField: cfgIdField,
        orderField: cfgOrderField,
        nodeLabel: cfgNodeLabel,
        defaultExpanded: cfgDefaultExpanded,
      }),
    [
      items,
      cfgChildrenField,
      cfgParentField,
      cfgIdField,
      cfgOrderField,
      cfgNodeLabel,
      cfgDefaultExpanded,
    ],
  );
  const flatItems = useMemo<DynamicRecord[]>(() => {
    const cf = cfgChildrenField ?? treeShape.childrenField;
    if (!cf) return items;
    return flattenAll(items, cf);
  }, [items, cfgChildrenField, treeShape.childrenField]);

  const detectedFields = useMemo<FieldConfig[]>(() => {
    if (!flatItems || flatItems.length === 0) return [];
    const detected = detectFields(flatItems);
    return mergeFields(detected, fields);
  }, [flatItems, fields]);

  const resolvedFields = useMemo<FieldConfig[]>(() => {
    if (detectedFields.length === 0) return detectedFields;
    const overrides = new Map(config.tableColumns.map((c) => [c.id, c]));
    return detectedFields
      .map((f) => {
        const o = overrides.get(f.path);
        if (!o) return f;
        return { ...f, visible: o.visible, order: o.order };
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [detectedFields, config.tableColumns]);

  useEffect(() => {
    if (detectedFields.length === 0) return;
    setConfig((prev) => {
      const prevByPath = new Map(prev.tableColumns.map((c) => [c.id, c]));
      const next: typeof prev.tableColumns = [];
      let order = 0;
      for (const f of detectedFields) {
        if (f.type === "hidden") continue;
        const existing = prevByPath.get(f.path);
        next.push({
          id: f.path,
          label: f.label ?? f.path,
          visible: existing?.visible ?? f.visible !== false,
          order: existing?.order ?? order,
        });
        order++;
        prevByPath.delete(f.path);
      }
      const stale = Array.from(prevByPath.values());
      const carried = [...next, ...stale].slice(0, 100);
      if (
        carried.length === prev.tableColumns.length &&
        carried.every((c, i) => {
          const p = prev.tableColumns[i];
          return (
            p &&
            p.id === c.id &&
            p.label === c.label &&
            p.visible === c.visible &&
            p.order === c.order
          );
        })
      ) {
        return prev;
      }
      return { ...prev, tableColumns: carried };
    });
  }, [detectedFields]);

  // These three are stable across renders on purpose: they end up in the
  // DataViews context value, and a new identity on every render would defeat
  // every `useMemo` in every view downstream.
  const handleConfigChange = useCallback((newConfig: Partial<ViewConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const handleDataUpdate = useCallback((updatedData: DynamicRecord[]) => {
    setItems(updatedData);
  }, []);

  // The safe single-record write. Targets `items` — the complete, still-nested
  // dataset — so a view holding a filtered or flattened projection can edit one
  // record without deleting the ones it was hiding.
  const idField = treeShape.idField;
  const childrenField = treeShape.childrenField;

  const updateRecord = useCallback(
    (id: unknown, updater: (record: DynamicRecord) => DynamicRecord) => {
      setItems((prev) => updateRecordById(prev, id, idField, childrenField, updater));
    },
    [idField, childrenField],
  );

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      if (onFilterChange) onFilterChange(newFilters);
      else setInternalFilterState(newFilters);
    },
    [onFilterChange],
  );

  return {
    items,
    flatItems,
    resolvedFields,
    config,
    setConfig: handleConfigChange,
    currentView,
    setCurrentView,
    filterState: activeFilterState,
    setFilterState: handleFilterChange,
    onDataUpdate: handleDataUpdate,
    updateRecord,
    treeShape,
  };
}
