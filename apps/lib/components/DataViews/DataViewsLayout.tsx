"use client"

import { forwardRef, useState } from "react"
import { Table2, Kanban as KanbanIcon, Inbox as InboxIcon, Settings, Network } from "lucide-react"
import type {
  DynamicRecord,
  DynamicColumnConfig,
  DynamicFilterConfig,
  FilterState,
  FieldConfig,
  InboxConfig,
  TreeConfig,
  ViewConfig,
  ViewVisibility,
} from "./types"
import { Button } from "../Button"
import TabFormItem from "../TabFormItem"
import { TableView } from "./TableView"
import { KanbanView } from "./KanbanView"
import { InboxView } from "./InboxView"
import { TreeView } from "./TreeView"
import { SettingsPanel } from "./SettingsPanel"
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

  className?: string
  theme?: Themes
}

export const DataViewsLayout = forwardRef<HTMLDivElement, DataViewsLayoutProps>(
  function DataViewsLayout(props, ref) {
    const {
      title = "Data Views",
      description = "Unified data visualization across multiple views",
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
      showFilters = true,
      showSettings = true,
      showTitle = true,
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

    const [showSettingsPanel, setShowSettingsPanel] = useState(false)

    const effectiveKanbanGroupBy = kanbanGroupBy ?? config.kanbanGroupBy
    const effectiveShowFilters = showFilters && config.showFilters !== false
    const effectiveConfig: ViewConfig = { ...config, showFilters: effectiveShowFilters }

    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "flex h-screen flex-col bg-background-presentation-body-primary text-content-presentation-global-primary",
          className,
        )}
      >
        {showTitle && (
          <header className="border-b border-border-presentation-global-primary bg-background-presentation-body-primary">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h1 className="text-2xl font-semibold text-content-presentation-global-primary">{title}</h1>
                {description && (
                  <p className="text-sm text-content-presentation-global-secondary">{description}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-background-presentation-form-field-primary p-1">
                  {enabledViews.table && (
                    <TabFormItem
                      componentType="top"
                      active={currentView === "table"}
                      onClick={() => setCurrentView("table")}
                      className="gap-2"
                    >
                      <Table2 className="h-4 w-4" />
                      Table
                    </TabFormItem>
                  )}
                  {enabledViews.kanban && (
                    <TabFormItem
                      componentType="top"
                      active={currentView === "kanban"}
                      onClick={() => setCurrentView("kanban")}
                      className="gap-2"
                    >
                      <KanbanIcon className="h-4 w-4" />
                      Kanban
                    </TabFormItem>
                  )}
                  {enabledViews.inbox && (
                    <TabFormItem
                      componentType="top"
                      active={currentView === "inbox"}
                      onClick={() => setCurrentView("inbox")}
                      className="gap-2"
                    >
                      <InboxIcon className="h-4 w-4" />
                      Inbox
                    </TabFormItem>
                  )}
                  {enabledViews.tree && (
                    <TabFormItem
                      componentType="top"
                      active={currentView === "tree"}
                      onClick={() => setCurrentView("tree")}
                      className="gap-2"
                    >
                      <Network className="h-4 w-4" />
                      Tree
                    </TabFormItem>
                  )}
                </div>

                {showSettings && (
                  <Button
                    variant="PrimeStyle"
                    size="M"
                    onClick={() => setShowSettingsPanel((v) => !v)}
                    className="gap-2 bg-transparent"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                )}
              </div>
            </div>
          </header>
        )}

        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden">
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
                showFilters={effectiveShowFilters}
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
                showFilters={effectiveShowFilters}
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
                showFilters={effectiveShowFilters}
              />
            )}
          </div>

          {showSettings && showSettingsPanel && (
            <SettingsPanel
              config={config}
              onConfigChange={setConfig}
              onClose={() => setShowSettingsPanel(false)}
              currentView={currentView}
              fields={resolvedFields}
            />
          )}
        </main>
      </div>
    )
  }
)
