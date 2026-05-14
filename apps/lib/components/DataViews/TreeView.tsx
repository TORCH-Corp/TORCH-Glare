"use client"

import { useEffect, useMemo, useState } from "react"
import type {
  DynamicRecord,
  ViewConfig,
  DynamicColumnConfig,
  DynamicFilterConfig,
  FieldConfig,
  FilterState,
  FilterValue,
  TreeConfig,
} from "./types"
import {
  applyMove,
  autoDetectTreeShape,
  buildTree,
  findNodeById,
  flatten,
  initialExpansion,
  pruneTree,
  type TreeNode,
} from "../../utils/dataViews/treeUtils"
import { getByPath, matchesFilterValues } from "../../utils/dataViews/pathUtils"
import { visibleFields } from "../../utils/dataViews/fieldUtils"
import { renderField } from "./fieldRenderers"
import { renderDetailView } from "../../utils/dataViews/nestedDataUtils"
import { useIsMobile } from "../../hooks/useIsMobile"
import { TableView } from "./TableView"
import { FilterPanel } from "./FilterPanel"
import { TreeSidebar } from "./tree/TreeSidebar"
import { TreeDrawer, TreeDrawerTrigger } from "./tree/TreeDrawer"
import { Table2, FileText } from "lucide-react"
import { cn } from "../../utils/cn"

export type TreeViewProps = {
  data: DynamicRecord[]
  columns?: DynamicColumnConfig[]
  fields: FieldConfig[]
  config: ViewConfig
  treeConfig?: TreeConfig
  onDataUpdate?: (data: DynamicRecord[]) => void
  filters?: DynamicFilterConfig[]
  filterState?: FilterState
  onFilterChange?: (filters: FilterState) => void
  showFilters?: boolean
}

export function TreeView({
  data,
  columns,
  fields,
  config,
  treeConfig,
  onDataUpdate,
  filters: filterConfig,
  filterState: externalFilterState,
  onFilterChange,
  showFilters = true,
}: TreeViewProps) {
  const isMobile = useIsMobile()
  const [internalFilters, setInternalFilters] = useState<FilterState>({})
  const activeFilters = externalFilterState ?? internalFilters

  const resolvedTree = useMemo(
    () => autoDetectTreeShape(data, treeConfig ?? {}),
    [data, treeConfig],
  )

  const display = useMemo(
    () => visibleFields(fields).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [fields],
  )

  const labelField: FieldConfig = useMemo(() => {
    const path = resolvedTree.nodeLabel
    if (path) {
      const f = fields.find((x) => x.path === path)
      if (f) return f
      return { path, label: path, type: "text" }
    }
    return display[0] ?? { path: resolvedTree.idField, type: "text" }
  }, [resolvedTree, fields, display])

  const fullForest = useMemo(
    () => buildTree(data, resolvedTree),
    [data, resolvedTree],
  )

  const filterEntries = useMemo(() => Object.entries(activeFilters), [activeFilters])

  const visibleForest: TreeNode[] = useMemo(() => {
    if (filterEntries.length === 0) return fullForest
    return pruneTree(fullForest, (record) =>
      filterEntries.every(([path, value]) => matchesFilterValues(record, path, value)),
    )
  }, [fullForest, filterEntries])

  const [expanded, setExpanded] = useState<Set<string>>(() =>
    initialExpansion(fullForest, resolvedTree.defaultExpanded),
  )

  useEffect(() => {
    setExpanded(initialExpansion(fullForest, resolvedTree.defaultExpanded))
  }, [fullForest, resolvedTree.defaultExpanded])

  const [selectedId, setSelectedId] = useState<string | null>(() =>
    fullForest[0]?.id ?? null,
  )

  useEffect(() => {
    if (selectedId && !findNodeById(visibleForest, selectedId)) {
      setSelectedId(visibleForest[0]?.id ?? null)
    }
  }, [visibleForest, selectedId])

  const selectedNode = selectedId ? findNodeById(visibleForest, selectedId) : null
  const recordsForRightPane = useMemo(
    () => (selectedNode ? flatten(selectedNode) : []),
    [selectedNode],
  )

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const handleFilterChange = (path: string, value: FilterValue) => {
    const next: FilterState = { ...activeFilters, [path]: value }
    if (onFilterChange) onFilterChange(next)
    else setInternalFilters(next)
  }
  const clearAllFilters = () => {
    if (onFilterChange) onFilterChange({})
    else setInternalFilters({})
  }

  const [drawerOpen, setDrawerOpen] = useState(false)

  type RightPaneMode = "table" | "details"
  const [rightPaneMode, setRightPaneMode] = useState<RightPaneMode>(
    treeConfig?.defaultRightPane ?? "table",
  )

  const dndEnabled = treeConfig?.dndEnabled !== false && !!onDataUpdate

  const handleMove = ({
    dragIds,
    parentId,
    index,
  }: {
    dragIds: string[]
    parentId: string | null
    index: number
  }) => {
    if (!onDataUpdate) return
    const next = applyMove(data, resolvedTree, { dragIds, parentId, index })
    onDataUpdate(next)
  }

  const treeContent = (
    <TreeSidebar
      roots={visibleForest}
      expanded={expanded}
      selectedId={selectedId}
      labelField={labelField}
      dndEnabled={dndEnabled}
      onToggle={toggle}
      onSelect={(id) => {
        setSelectedId(id)
        if (isMobile) setDrawerOpen(false)
      }}
      onMove={handleMove}
    />
  )

  const filtersEnabled = showFilters && config.showFilters !== false

  const fallbackColumns: DynamicColumnConfig[] = columns ?? fields.map((f, i) => ({
    id: f.path,
    label: f.label ?? f.path,
    visible: f.visible !== false && f.type !== "hidden",
    order: f.order ?? i,
  }))

  return (
    <div className="flex h-full bg-background-presentation-body-primary">
      {!isMobile && (
        <div className="w-64 border-r border-border-presentation-global-primary bg-background-presentation-body-overlay-primary flex flex-col">
          <div className="px-3 py-2 border-b border-border-presentation-global-primary">
            <span className="text-xs font-semibold text-content-presentation-global-secondary uppercase tracking-wide">
              Tree
            </span>
          </div>
          <div className="flex-1 overflow-hidden">{treeContent}</div>
        </div>
      )}

      {!isMobile && filtersEnabled && (
        <FilterPanel
          data={data}
          fields={fields}
          filters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearAll={clearAllFilters}
          filterConfig={filterConfig}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border-presentation-global-primary bg-background-presentation-body-primary">
          {isMobile && <TreeDrawerTrigger onClick={() => setDrawerOpen(true)} />}

          <div className="flex items-center gap-1 rounded-md border border-border-presentation-global-primary bg-background-presentation-body-overlay-primary p-0.5">
            <button
              type="button"
              onClick={() => setRightPaneMode("table")}
              aria-label="Table mode"
              aria-pressed={rightPaneMode === "table"}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded text-xs",
                rightPaneMode === "table"
                  ? "bg-content-presentation-action-primary text-white"
                  : "text-content-presentation-global-secondary hover:text-content-presentation-global-primary",
              )}
            >
              <Table2 className="h-3.5 w-3.5" />
              Table
            </button>
            <button
              type="button"
              onClick={() => setRightPaneMode("details")}
              aria-label="Details mode"
              aria-pressed={rightPaneMode === "details"}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded text-xs",
                rightPaneMode === "details"
                  ? "bg-content-presentation-action-primary text-white"
                  : "text-content-presentation-global-secondary hover:text-content-presentation-global-primary",
              )}
            >
              <FileText className="h-3.5 w-3.5" />
              Details
            </button>
          </div>

          <span className="ml-auto text-sm text-content-presentation-global-secondary truncate">
            {selectedNode
              ? rightPaneMode === "table"
                ? `${recordsForRightPane.length} record${recordsForRightPane.length === 1 ? "" : "s"}`
                : `1 record`
              : "Select an item"}
          </span>
        </div>

        <div className="flex-1 overflow-hidden">
          {selectedNode ? (
            rightPaneMode === "table" ? (
              <TableView
                data={recordsForRightPane}
                columns={columns}
                fields={fields}
                config={{ ...config, showFilters: false }}
                onDataUpdate={onDataUpdate}
                filters={filterConfig}
                filterState={activeFilters}
                onFilterChange={(next) => {
                  if (onFilterChange) onFilterChange(next)
                  else setInternalFilters(next)
                }}
                showFilters={false}
              />
            ) : (
              <DetailsBody
                node={selectedNode}
                fields={fields}
                columns={fallbackColumns}
                labelField={labelField}
              />
            )
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-content-presentation-global-tertiary">
              No node selected.
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <TreeDrawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          {treeContent}
        </TreeDrawer>
      )}
    </div>
  )
}

function DetailsBody({
  node,
  fields,
  columns,
  labelField,
}: {
  node: TreeNode
  fields: FieldConfig[]
  columns: DynamicColumnConfig[]
  labelField: FieldConfig
}) {
  const record = node.record
  const labelValue = getByPath(record, labelField.path)
  const displayFields = visibleFields(fields)
    .filter((f) => f.path !== labelField.path)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return (
    <div className="h-full overflow-y-auto p-6 bg-background-presentation-body-primary">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wide text-content-presentation-global-tertiary">
            {labelField.label ?? labelField.path}
          </div>
          <h2 className="text-2xl font-semibold text-content-presentation-global-primary">
            {renderField(labelValue, labelField, record)}
          </h2>
        </div>

        {displayFields.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 border-b border-border-presentation-global-primary">
            {displayFields.map((f) => {
              const value = getByPath(record, f.path)
              if (value == null) return null
              return (
                <div key={f.path} className="space-y-1">
                  <dt className="text-xs font-medium uppercase tracking-wide text-content-presentation-global-tertiary">
                    {f.label ?? f.path}
                  </dt>
                  <dd className="text-sm text-content-presentation-global-primary">
                    {renderField(value, f, record)}
                  </dd>
                </div>
              )
            })}
          </div>
        )}

        <div>
          {renderDetailView(
            record,
            columns.filter((c) => c.visible),
            (value, column, row) => {
              const f = fields.find((x) => x.path === column.id)
              if (f) return renderField(value, f, row)
              return <span>{String(value ?? "")}</span>
            },
          )}
        </div>
      </div>
    </div>
  )
}
