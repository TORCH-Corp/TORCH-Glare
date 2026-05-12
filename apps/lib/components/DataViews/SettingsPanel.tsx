"use client"

import { useMemo, useState } from "react"
import { X, GripVertical, ArrowUp, ArrowDown, Minus } from "lucide-react"
import type {
  ViewConfig,
  ViewType,
  FieldConfig,
} from "./types"
import { Button } from "../Button"
import { Switch } from "../Switch"
import { Divider } from "../Divider"
import { Label } from "../Label"
import { RadioGroup, Radio } from "../Radio"

type SettingsPanelProps = {
  config: ViewConfig
  onConfigChange: (config: Partial<ViewConfig>) => void
  onClose: () => void
  currentView: ViewType
  fields: FieldConfig[]
}

export function SettingsPanel({
  config,
  onConfigChange,
  onClose,
  currentView,
  fields,
}: SettingsPanelProps) {
  const visibleFields = useMemo(
    () => fields.filter((f) => f.type !== "hidden"),
    [fields],
  )

  const groupableFields = useMemo(
    () => fields.filter((f) => f.type === "enum-badge"),
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

  return (
    <div className="w-80 border-l border-border-presentation-global-primary bg-background-presentation-body-overlay-primary overflow-y-auto">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border-presentation-global-primary bg-background-presentation-body-overlay-primary p-4">
        <h2 className="font-semibold text-content-presentation-global-primary">Settings</h2>
        <Button variant="BorderStyle" buttonType="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6 p-4">
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-content-presentation-global-primary">General</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-filters">Show Filters</Label>
              <Switch
                id="show-filters"
                checked={config.showFilters}
                onCheckedChange={(checked) => onConfigChange({ showFilters: checked })}
              />
            </div>
          </div>
        </div>

        <Divider />

        {currentView === "table" && (
          <>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-content-presentation-global-primary">Table Columns</h3>
              <p className="text-xs text-content-presentation-global-tertiary">
                Show or hide columns in table view
              </p>
              {orderedColumns.length === 0 ? (
                <p className="text-xs text-content-presentation-global-tertiary">No fields detected.</p>
              ) : (
                <div className="space-y-2">
                  {orderedColumns.map((col) => {
                    const field = fieldByPath.get(col.id)
                    const isDragging = dragPath === col.id
                    const isDropTarget = dragOverPath === col.id && dragPath !== col.id
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
                        className={
                          "flex items-center gap-2 rounded-lg border p-2 cursor-grab active:cursor-grabbing transition-colors " +
                          (isDragging
                            ? "opacity-50 border-border-presentation-global-primary "
                            : isDropTarget
                              ? "border-content-presentation-action-light-primary bg-background-presentation-form-field-primary "
                              : "border-border-presentation-global-primary ")
                        }
                      >
                        <GripVertical className="h-4 w-4 text-content-presentation-global-tertiary" />
                        <span className="flex-1 text-sm text-content-presentation-global-primary">
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
            <Divider />
          </>
        )}

        {currentView === "kanban" && (
          <>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-content-presentation-global-primary">Kanban Grouping</h3>
              <p className="text-xs text-content-presentation-global-tertiary">Group cards by field</p>
              {groupableFields.length === 0 ? (
                <p className="text-xs text-content-presentation-global-tertiary">
                  No groupable fields detected. Declare a field with type "enum-badge" to enable grouping.
                </p>
              ) : (
                <RadioGroup
                  value={config.kanbanGroupBy}
                  onValueChange={(value) => onConfigChange({ kanbanGroupBy: value })}
                >
                  {groupableFields.map((field) => (
                    <div key={field.path} className="flex items-center space-x-2">
                      <Radio value={field.path} id={`group-${field.path}`} />
                      <Label htmlFor={`group-${field.path}`}>{field.label ?? field.path}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
            <Divider />
          </>
        )}

        {currentView === "inbox" && (
          <>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-content-presentation-global-primary">Inbox Layout</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="preview-pane" className="text-sm">
                  Show Preview Pane
                </Label>
                <Switch
                  id="preview-pane"
                  checked={config.showPreviewPane}
                  onCheckedChange={(checked) => onConfigChange({ showPreviewPane: checked })}
                />
              </div>
            </div>
            <Divider />
          </>
        )}

        {orderedColumns.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-content-presentation-global-primary">Sort</h3>
            <p className="text-xs text-content-presentation-global-tertiary">
              Pick a column and direction. Only one column sorts at a time.
            </p>
            <div className="space-y-2">
              {orderedColumns.map((col) => {
                const field = fieldByPath.get(col.id)
                const isActive = config.sortBy === col.id
                const dir: "asc" | "desc" | "none" = isActive ? config.sortOrder : "none"
                const setDir = (next: "asc" | "desc" | "none") => {
                  if (next === "none") {
                    onConfigChange({ sortBy: "" })
                  } else {
                    onConfigChange({ sortBy: col.id, sortOrder: next })
                  }
                }
                const btn = (
                  mode: "none" | "asc" | "desc",
                  Icon: typeof Minus,
                  label: string,
                ) => (
                  <button
                    type="button"
                    aria-label={`${label} ${col.label || col.id}`}
                    aria-pressed={dir === mode}
                    onClick={() => setDir(mode)}
                    className={
                      "flex h-7 w-7 items-center justify-center rounded-md border transition-colors " +
                      (dir === mode
                        ? "border-content-presentation-action-light-primary bg-background-presentation-form-field-primary text-content-presentation-global-primary"
                        : "border-border-presentation-global-primary text-content-presentation-global-tertiary hover:text-content-presentation-global-primary")
                    }
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </button>
                )
                return (
                  <div
                    key={col.id}
                    className="flex items-center gap-2 rounded-lg border border-border-presentation-global-primary p-2"
                  >
                    <span className="flex-1 text-sm text-content-presentation-global-primary">
                      {col.label || field?.label || col.id}
                    </span>
                    <div className="flex items-center gap-1">
                      {btn("none", Minus, "No sort")}
                      {btn("asc", ArrowUp, "Sort ascending")}
                      {btn("desc", ArrowDown, "Sort descending")}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
