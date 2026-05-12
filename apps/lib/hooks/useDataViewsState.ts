"use client"

import { useEffect, useMemo, useState } from "react"
import type {
  DynamicRecord,
  DynamicColumnConfig,
  FieldConfig,
  FilterState,
  TreeConfig,
  ViewConfig,
  ViewType,
  ViewVisibility,
} from "../components/DataViews/types"
import { defaultConfig } from "../components/DataViews/types"
import { detectColumns, mergeColumns } from "../utils/dataViews/columnUtils"
import { detectFields, mergeFields } from "../utils/dataViews/fieldUtils"
import { autoDetectTreeShape, flattenAll } from "../utils/dataViews/treeUtils"

export type UseDataViewsStateOptions = {
  data?: DynamicRecord[]
  fields?: FieldConfig[]
  columns?: Partial<DynamicColumnConfig>[]
  config?: Partial<ViewConfig>
  treeConfig?: TreeConfig
  views?: ViewVisibility
  filterState?: FilterState
  onFilterChange?: (filters: FilterState) => void
}

export function useDataViewsState({
  data,
  fields,
  columns,
  config: initialConfig,
  treeConfig,
  views,
  filterState: externalFilterState,
  onFilterChange,
}: UseDataViewsStateOptions) {
  const [currentView, setCurrentView] = useState<ViewType>(
    initialConfig?.defaultView || defaultConfig.defaultView,
  )
  const [config, setConfig] = useState<ViewConfig>({ ...defaultConfig, ...initialConfig })
  const [items, setItems] = useState<DynamicRecord[]>(data || [])
  const [internalFilterState, setInternalFilterState] = useState<FilterState>({})

  useEffect(() => {
    setItems(data || [])
  }, [data])

  const activeFilterState = externalFilterState ?? internalFilterState

  const treeShape = useMemo(
    () => autoDetectTreeShape(items, treeConfig ?? {}),
    [items, treeConfig],
  )
  const treeAutoAvailable =
    !!treeConfig || !!treeShape.childrenField || !!treeShape.parentField

  const enabledViews = useMemo<Record<ViewType, boolean>>(() => {
    const v = views ?? {}
    return {
      table:  v.table  ?? true,
      kanban: v.kanban ?? true,
      inbox:  v.inbox  ?? true,
      tree:   v.tree   ?? treeAutoAvailable,
    }
  }, [views, treeAutoAvailable])

  useEffect(() => {
    if (!enabledViews[currentView]) {
      const fallback = (Object.entries(enabledViews) as Array<[ViewType, boolean]>)
        .find(([, on]) => on)?.[0]
      if (fallback) setCurrentView(fallback)
    }
  }, [enabledViews, currentView])

  const flatItems = useMemo<DynamicRecord[]>(() => {
    const cf = treeConfig?.childrenField ?? treeShape.childrenField
    if (!cf) return items
    return flattenAll(items, cf)
  }, [items, treeConfig?.childrenField, treeShape.childrenField])

  const detectedFields = useMemo<FieldConfig[]>(() => {
    if (!flatItems || flatItems.length === 0) return []
    const detected = detectFields(flatItems)
    return mergeFields(detected, fields)
  }, [flatItems, fields])

  const resolvedFields = useMemo<FieldConfig[]>(() => {
    if (detectedFields.length === 0) return detectedFields
    const overrides = new Map(config.tableColumns.map((c) => [c.id, c]))
    return detectedFields
      .map((f) => {
        const o = overrides.get(f.path)
        if (!o) return f
        return { ...f, visible: o.visible, order: o.order }
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [detectedFields, config.tableColumns])

  const detectedColumns = useMemo<DynamicColumnConfig[]>(() => {
    if (!flatItems || flatItems.length === 0) return []
    const detected = detectColumns(flatItems)
    return mergeColumns(detected, columns)
  }, [flatItems, columns])

  useEffect(() => {
    if (detectedFields.length === 0) return
    setConfig((prev) => {
      const prevByPath = new Map(prev.tableColumns.map((c) => [c.id, c]))
      const next: typeof prev.tableColumns = []
      let order = 0
      for (const f of detectedFields) {
        if (f.type === "hidden") continue
        const existing = prevByPath.get(f.path)
        next.push({
          id: f.path,
          label: f.label ?? f.path,
          visible: existing?.visible ?? f.visible !== false,
          order: existing?.order ?? order,
        })
        order++
        prevByPath.delete(f.path)
      }
      const stale = Array.from(prevByPath.values())
      const carried = [...next, ...stale].slice(0, 100)
      if (
        carried.length === prev.tableColumns.length &&
        carried.every((c, i) => {
          const p = prev.tableColumns[i]
          return p && p.id === c.id && p.label === c.label && p.visible === c.visible && p.order === c.order
        })
      ) {
        return prev
      }
      return { ...prev, tableColumns: carried }
    })
  }, [detectedFields])

  const handleConfigChange = (newConfig: Partial<ViewConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))
  }

  const handleDataUpdate = (updatedData: DynamicRecord[]) => {
    setItems(updatedData)
  }

  const handleFilterChange = (newFilters: FilterState) => {
    if (onFilterChange) onFilterChange(newFilters)
    else setInternalFilterState(newFilters)
  }

  return {
    items,
    flatItems,
    resolvedFields,
    detectedColumns,
    config,
    setConfig: handleConfigChange,
    currentView,
    setCurrentView,
    filterState: activeFilterState,
    setFilterState: handleFilterChange,
    onDataUpdate: handleDataUpdate,
    treeShape,
    enabledViews,
  }
}
