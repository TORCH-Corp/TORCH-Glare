"use client"

import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { List, LayoutGrid, Inbox as InboxIcon, Network } from "lucide-react"
import type {
  DynamicRecord,
  DynamicColumnConfig,
  DynamicFilterConfig,
  FilterState,
  FieldConfig,
  InboxConfig,
  TreeConfig,
  ViewConfig,
  ViewType,
  ViewVisibility,
} from "./types"
import { TableView } from "./TableView"
import { KanbanView } from "./KanbanView"
import { InboxView } from "./InboxView"
import { TreeView } from "./TreeView"
import { DataViewsHeader, type DataViewsHeaderView } from "./DataViewsHeader"
import { DataViewsConfigPanel } from "./DataViewsConfigPanel"
import { useDataViewsState } from "../../hooks/useDataViewsState"
import { cn } from "../../utils/cn"
import type { Themes } from "../../utils/types"

export type DataViewsLayoutProps = {
  data?: DynamicRecord[]
  config?: Partial<ViewConfig>
  title?: string
  description?: string

  fields?: FieldConfig[]
  inboxConfig?: InboxConfig
  treeConfig?: TreeConfig
  kanbanGroupBy?: string

  views?: ViewVisibility

  columns?: Partial<DynamicColumnConfig>[]
  filters?: DynamicFilterConfig[]

  filterState?: FilterState
  onFilterChange?: (filters: FilterState) => void

  showFilters?: boolean
  showSettings?: boolean
  showTitle?: boolean

  onAddNew?: () => void
  addNewLabel?: string

  className?: string
  theme?: Themes
}

const VIEW_META: Record<ViewType, { label: string; icon: DataViewsHeaderView["icon"] }> = {
  table: { label: "List", icon: <List /> },
  kanban: { label: "Board", icon: <LayoutGrid /> },
  inbox: { label: "Inbox", icon: <InboxIcon /> },
  tree: { label: "Tree", icon: <Network /> },
}

const VIEW_ORDER: ViewType[] = ["table", "kanban", "inbox", "tree"]

export const DataViewsLayout = forwardRef<HTMLDivElement, DataViewsLayoutProps>(
  function DataViewsLayout(props, ref) {
    const {
      title = "Data Views",
      data,
      config: initialConfig,
      fields,
      inboxConfig,
      treeConfig,
      kanbanGroupBy,
      views,
      columns,
      filters,
      filterState: externalFilterState,
      onFilterChange,
      // `showFilters` is retained on the public API but filters now live in the
      // right-side config rail rather than an inline per-view panel.
      showSettings = true,
      showTitle = true,
      onAddNew,
      addNewLabel,
      className,
      theme,
    } = props

    const {
      items,
      flatItems,
      resolvedFields,
      detectedColumns,
      config,
      setConfig,
      currentView,
      setCurrentView,
      filterState,
      setFilterState,
      onDataUpdate,
      enabledViews,
    } = useDataViewsState({
      data,
      fields,
      columns,
      config: initialConfig,
      treeConfig,
      views,
      filterState: externalFilterState,
      onFilterChange,
    })

    // `panelOpen` drives intent; `panelMounted` keeps the panel in the tree
    // through the close animation before unmounting.
    const [panelOpen, setPanelOpen] = useState(false)
    const [panelMounted, setPanelMounted] = useState(false)
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const openPanel = useCallback(() => {
      if (closeTimer.current) {
        clearTimeout(closeTimer.current)
        closeTimer.current = null
      }
      // Mount at width 0 first, then flip to open on the next frame so the
      // width transition animates from 0 → 260px instead of snapping.
      setPanelMounted(true)
      requestAnimationFrame(() => requestAnimationFrame(() => setPanelOpen(true)))
    }, [])

    const closePanel = useCallback(() => {
      setPanelOpen(false)
      if (closeTimer.current) clearTimeout(closeTimer.current)
      // Keep mounted through the width/fade animation (300ms) before unmounting.
      closeTimer.current = setTimeout(() => setPanelMounted(false), 300)
    }, [])

    const togglePanel = useCallback(() => {
      if (panelOpen) closePanel()
      else openPanel()
    }, [panelOpen, openPanel, closePanel])

    useEffect(() => {
      return () => {
        if (closeTimer.current) clearTimeout(closeTimer.current)
      }
    }, [])

    const effectiveKanbanGroupBy = kanbanGroupBy ?? config.kanbanGroupBy
    // Filters now live in the right-side rail, not as an inline per-view panel.
    const effectiveConfig: ViewConfig = { ...config, showFilters: false }

    const headerViews = useMemo<DataViewsHeaderView[]>(
      () =>
        VIEW_ORDER.filter((v) => enabledViews[v]).map((v) => ({
          id: v,
          label: VIEW_META[v].label,
          icon: VIEW_META[v].icon,
        })),
      [enabledViews],
    )

    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          // Shell is always black (matches Figma): the dark header and config
          // rail sit on it; the Master Container is the white surface inside.
          "flex h-screen gap-2 bg-black p-2 text-content-presentation-global-primary",
          className,
        )}
      >
        {/* Left column: header + content. Shrinks as the panel expands. */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {showTitle && (
            <DataViewsHeader
              title={title}
              views={headerViews}
              currentView={currentView}
              onViewChange={setCurrentView}
              showSettings={showSettings}
              settingsOpen={panelOpen}
              onToggleSettings={togglePanel}
              onAddNew={onAddNew}
              addNewLabel={addNewLabel}
            />
          )}

          <main className="flex min-h-0 flex-1 overflow-hidden">
            {/* Master Container — white card, 16px radius, #D4D4D4 hairline
                border. Fixed surface (matches header chrome). */}
            <div className="flex flex-1 overflow-hidden rounded-[16px] border border-[#D4D4D4] bg-white">
              <div className="flex-1 overflow-auto">
              {currentView === "table" && enabledViews.table && (
                <TableView
                  data={flatItems}
                  columns={detectedColumns}
                  fields={resolvedFields}
                  config={effectiveConfig}
                  onDataUpdate={onDataUpdate}
                  onSortChange={(sortBy, sortOrder) => setConfig({ sortBy, sortOrder })}
                  filters={filters}
                  filterState={filterState}
                  onFilterChange={setFilterState}
                  showFilters={false}
                />
              )}
              {currentView === "kanban" && enabledViews.kanban && (
                <KanbanView
                  data={flatItems}
                  columns={detectedColumns}
                  fields={resolvedFields}
                  config={effectiveConfig}
                  onDataUpdate={onDataUpdate}
                  groupByField={effectiveKanbanGroupBy}
                />
              )}
              {currentView === "inbox" && enabledViews.inbox && (
                <InboxView
                  data={flatItems}
                  columns={detectedColumns}
                  fields={resolvedFields}
                  inboxConfig={inboxConfig}
                  config={effectiveConfig}
                  onDataUpdate={onDataUpdate}
                  filters={filters}
                  filterState={filterState}
                  onFilterChange={setFilterState}
                  showFilters={false}
                />
              )}
              {currentView === "tree" && enabledViews.tree && (
                <TreeView
                  data={items}
                  columns={detectedColumns}
                  fields={resolvedFields}
                  treeConfig={treeConfig}
                  config={effectiveConfig}
                  onDataUpdate={onDataUpdate}
                  filters={filters}
                  filterState={filterState}
                  onFilterChange={setFilterState}
                  showFilters={false}
                />
              )}
              </div>
            </div>
          </main>
        </div>

        {/* Right rail: full-height sibling of the [header + content] column, so
            opening it pushes the header as well as the content. The wrapper
            animates its width so the left column reflows in sync with the
            panel's slide-in. */}
        {showSettings && panelMounted && (
          <div
            className={cn(
              "shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out",
              panelOpen ? "w-[260px]" : "w-0",
            )}
          >
            <DataViewsConfigPanel
              state={panelOpen ? "open" : "closed"}
              config={config}
              onConfigChange={setConfig}
              onClose={closePanel}
              currentView={currentView}
              fields={resolvedFields}
              data={flatItems}
              filterState={filterState}
              onFilterChange={setFilterState}
              filterConfig={filters}
            />
          </div>
        )}
      </div>
    )
  }
)
