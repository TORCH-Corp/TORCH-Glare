"use client"

import { useMemo, useState } from "react"
import { X, GripVertical, Settings as SettingsIcon, Filter as FilterIcon } from "lucide-react"
import type {
  ViewConfig,
  ViewType,
  FieldConfig,
  DynamicRecord,
  DynamicFilterConfig,
  FilterState,
  FilterValue,
} from "./types"
import { Switch } from "../Switch"
import { RadioGroup, Radio } from "../Radio"
import { Label } from "../Label"
import { FilterPanel } from "./FilterPanel"
import { cn } from "../../utils/cn"

type ConfigTab = "config" | "filters"

type SavedView = { id: string; label: string }

export type DataViewsConfigPanelProps = {
  config: ViewConfig
  onConfigChange: (config: Partial<ViewConfig>) => void
  onClose: () => void
  currentView: ViewType
  fields: FieldConfig[]

  // Filters tab
  data: DynamicRecord[]
  filterState: FilterState
  onFilterChange: (filters: FilterState) => void
  filterConfig?: DynamicFilterConfig[]

  // Saved views (presentational shell — wire to persistence when available)
  savedViews?: SavedView[]
  activeSavedView?: string
  onSavedViewChange?: (id: string) => void
  onSaveNewView?: () => void

  // Animation: drives slide-in/out. Parent keeps the panel mounted through
  // the close animation, then unmounts.
  state?: "open" | "closed"
}

const DEFAULT_SAVED_VIEWS: SavedView[] = [
  { id: "default", label: "Default View" },
]

function SectionHeader({
  title,
  action,
}: {
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-[18px] font-[510] leading-[1.32] tracking-[-0.01em] text-white">
        {title}
      </h3>
      {action}
    </div>
  )
}

export function DataViewsConfigPanel(props: DataViewsConfigPanelProps) {
  const {
    config,
    onConfigChange,
    onClose,
    fields,
    data,
    filterState,
    onFilterChange,
    filterConfig,
    savedViews = DEFAULT_SAVED_VIEWS,
    activeSavedView,
    onSavedViewChange,
    onSaveNewView,
    state = "open",
  } = props

  const [tab, setTab] = useState<ConfigTab>("config")

  const visibleFields = useMemo(
    () => fields.filter((f) => f.type !== "hidden"),
    [fields],
  )
  const visiblePaths = useMemo(
    () => new Set(visibleFields.map((f) => f.path)),
    [visibleFields],
  )
  const fieldByPath = useMemo(
    () => new Map(visibleFields.map((f) => [f.path, f])),
    [visibleFields],
  )
  const orderedColumns = useMemo(
    () =>
      [...config.tableColumns]
        .filter((c) => visiblePaths.has(c.id))
        .sort((a, b) => a.order - b.order),
    [config.tableColumns, visiblePaths],
  )

  const toggleColumnVisibility = (path: string) => {
    const next = config.tableColumns.map((c) =>
      c.id === path ? { ...c, visible: !c.visible } : c,
    )
    onConfigChange({ tableColumns: next })
  }

  const [dragPath, setDragPath] = useState<string | null>(null)
  const [dragOverPath, setDragOverPath] = useState<string | null>(null)

  const reorderColumn = (sourcePath: string, targetPath: string) => {
    if (sourcePath === targetPath) return
    const ids = orderedColumns.map((c) => c.id)
    const from = ids.indexOf(sourcePath)
    const to = ids.indexOf(targetPath)
    if (from === -1 || to === -1) return
    const reordered = [...ids]
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    const orderByPath = new Map(reordered.map((id, i) => [id, i]))
    const next = config.tableColumns.map((c) => {
      const newOrder = orderByPath.get(c.id)
      return newOrder == null ? c : { ...c, order: newOrder }
    })
    onConfigChange({ tableColumns: next })
  }

  const sortableColumns = orderedColumns

  const tabBtn = (id: ConfigTab, icon: React.ReactNode, label: string) => {
    const active = tab === id
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={() => setTab(id)}
        className={cn(
          "flex h-6 flex-1 items-center justify-center gap-1 rounded-[8px] px-3 text-[14px] font-[510] leading-none transition-all duration-200 ease-in-out",
          active
            ? "bg-white text-black shadow-[0_0_10px_2px_rgba(0,0,0,0.25)]"
            : "bg-transparent text-white hover:bg-white/5",
        )}
      >
        <span className="flex h-[14px] w-[14px] items-center justify-center [&_svg]:h-[14px] [&_svg]:w-[14px]">
          {icon}
        </span>
        {label}
      </button>
    )
  }

  return (
    <div
      data-state={state}
      // Panel is always dark (Figma `Cun` = #000000). data-theme="dark" makes
      // child themed components (Button, Switch, Radio, FilterPanel) resolve
      // dark tokens even when the host app runs in default/light theme.
      data-theme="dark"
      className={cn(
        "flex h-full w-[260px] flex-col overflow-hidden rounded-[16px] bg-black",
        "transition-opacity duration-200 ease-in-out",
        state === "open" ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Header: tab switcher + close */}
      <div className="flex items-center gap-2 px-3 py-3">
        <div className="flex flex-1 items-center gap-[2px] rounded-[10px] bg-[#252729] p-[2px] shadow-[inset_0_0_5px_0_rgba(0,0,0,0.16)]">
          {tabBtn("config", <SettingsIcon />, "Config.")}
          {tabBtn("filters", <FilterIcon />, "Filters")}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-white/[0.15] text-white transition-colors hover:bg-white/25"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="h-px w-full bg-[#2C2D2E]" />

      <div className="flex-1 overflow-y-auto">
        {tab === "config" ? (
          <div className="flex flex-col gap-6 px-3 py-4">
            {/* Saved View */}
            <div className="space-y-3">
              <SectionHeader title="Saved View" />
              <RadioGroup
                value={activeSavedView ?? savedViews[0]?.id}
                onValueChange={(v) => onSavedViewChange?.(v)}
                className="space-y-0 rounded-[12px] bg-[#1C1D1F] p-1"
              >
                {savedViews.map((sv, i) => (
                  <div key={sv.id}>
                    {i > 0 && <div className="mx-2 h-px bg-[#2C2D2E]" />}
                    <div className="flex items-center gap-2 px-2 py-2.5">
                      <Radio value={sv.id} id={`sv-${sv.id}`} />
                      <Label
                        htmlFor={`sv-${sv.id}`}
                        className="cursor-pointer text-white"
                      >
                        {sv.label}
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              <button
                type="button"
                onClick={onSaveNewView}
                className="flex w-full items-center justify-center gap-1.5 rounded-[10px] bg-[#1C1D1F] py-2.5 text-[14px] font-[510] text-white transition-colors hover:bg-[#252729]"
              >
                + Save a New View
              </button>
            </div>

            <div className="h-px w-full bg-[#2C2D2E]" />

            {/* Table Columns */}
            <div className="space-y-3">
              <SectionHeader title="Table Columns" />
              <p className="text-[14px] text-content-presentation-global-tertiary">
                Show or hide columns in table view
              </p>
              {orderedColumns.length === 0 ? (
                <p className="text-xs text-content-presentation-global-tertiary">
                  No fields detected.
                </p>
              ) : (
                <div className="space-y-1.5 rounded-[12px] bg-[#1C1D1F] p-1">
                  {orderedColumns.map((col) => {
                    const field = fieldByPath.get(col.id)
                    const isDragging = dragPath === col.id
                    const isDropTarget =
                      dragOverPath === col.id && dragPath !== col.id
                    return (
                      <div
                        key={col.id}
                        draggable
                        onDragStart={(e) => {
                          setDragPath(col.id)
                          e.dataTransfer.effectAllowed = "move"
                          e.dataTransfer.setData("text/plain", col.id)
                        }}
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.dataTransfer.dropEffect = "move"
                          if (dragOverPath !== col.id) setDragOverPath(col.id)
                        }}
                        onDragLeave={() => {
                          if (dragOverPath === col.id) setDragOverPath(null)
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          if (dragPath) reorderColumn(dragPath, col.id)
                          setDragPath(null)
                          setDragOverPath(null)
                        }}
                        onDragEnd={() => {
                          setDragPath(null)
                          setDragOverPath(null)
                        }}
                        className={cn(
                          "flex items-center gap-2 rounded-[10px] px-2 py-2 transition-colors cursor-grab active:cursor-grabbing",
                          isDragging
                            ? "opacity-50"
                            : isDropTarget
                              ? "bg-[#252729]"
                              : "hover:bg-[#252729]",
                        )}
                      >
                        <GripVertical className="h-4 w-4 text-content-presentation-global-tertiary" />
                        <span className="flex-1 text-[14px] text-white">
                          {col.label || field?.label || col.id}
                        </span>
                        <Switch
                          checked={col.visible}
                          onCheckedChange={() => toggleColumnVisibility(col.id)}
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="h-px w-full bg-[#2C2D2E]" />

            {/* Default Sort */}
            <div className="space-y-3">
              <SectionHeader title="Default Sort" />
              {sortableColumns.length === 0 ? (
                <p className="text-xs text-content-presentation-global-tertiary">
                  No sortable columns.
                </p>
              ) : (
                <div className="space-y-1.5 rounded-[12px] bg-[#1C1D1F] p-1">
                  {sortableColumns.map((col) => {
                    const field = fieldByPath.get(col.id)
                    const isActive = config.sortBy === col.id
                    return (
                      <div
                        key={col.id}
                        className="flex items-center gap-2 rounded-[10px] px-2 py-2"
                      >
                        <span className="flex-1 text-[14px] text-white">
                          {col.label || field?.label || col.id}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-pressed={isActive && config.sortOrder === "asc"}
                            onClick={() =>
                              onConfigChange({ sortBy: col.id, sortOrder: "asc" })
                            }
                            className={cn(
                              "h-6 rounded-md px-2 text-xs transition-colors",
                              isActive && config.sortOrder === "asc"
                                ? "bg-[#005ECC] text-white"
                                : "text-content-presentation-global-tertiary hover:text-white",
                            )}
                          >
                            Asc
                          </button>
                          <button
                            type="button"
                            aria-pressed={isActive && config.sortOrder === "desc"}
                            onClick={() =>
                              onConfigChange({ sortBy: col.id, sortOrder: "desc" })
                            }
                            className={cn(
                              "h-6 rounded-md px-2 text-xs transition-colors",
                              isActive && config.sortOrder === "desc"
                                ? "bg-[#005ECC] text-white"
                                : "text-content-presentation-global-tertiary hover:text-white",
                            )}
                          >
                            Desc
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="[&>div]:w-full [&>div]:border-r-0 [&>div]:bg-transparent">
            <FilterPanel
              data={data}
              fields={fields}
              filters={filterState}
              onFilterChange={(path: string, value: FilterValue) =>
                onFilterChange({ ...filterState, [path]: value })
              }
              onClearAll={() => onFilterChange({})}
              filterConfig={filterConfig}
            />
          </div>
        )}
      </div>
    </div>
  )
}
