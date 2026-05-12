"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Badge } from "../Badge"
import { Plus, MoreHorizontal } from "lucide-react"
import type {
  DynamicRecord,
  ViewConfig,
  DynamicColumnConfig,
  FieldConfig,
} from "./types"
import { Button } from "../Button"
import { Card, CardContent, CardHeader } from "../Card"
import { getByPath, setByPath } from "../../utils/dataViews/pathUtils"
import { renderField } from "./fieldRenderers"
import { visibleFields } from "../../utils/dataViews/fieldUtils"
import { useIsMobile } from "../../hooks/useIsMobile"
import { resolveBadgeVariant } from "./badgeAdapter"

export type KanbanViewProps = {
  data: DynamicRecord[]
  columns?: DynamicColumnConfig[]
  fields: FieldConfig[]
  config: ViewConfig
  onDataUpdate?: (data: DynamicRecord[]) => void
  groupByField?: string
}

type KanbanColumn = {
  id: string
  title: string
  color: string
  items: DynamicRecord[]
}

const COLUMN_COLORS = [
  "bg-background-presentation-badge-gray-primary",
  "bg-background-presentation-badge-blue-primary",
  "bg-background-presentation-badge-purple-primary",
  "bg-background-presentation-badge-success-primary",
  "bg-background-presentation-badge-yellow-primary",
  "bg-background-presentation-badge-red-primary",
]

function getId(item: DynamicRecord, fallbackPath: string | undefined, idx: number): any {
  if (item?.id != null) return item.id
  if (fallbackPath) {
    const v = getByPath(item, fallbackPath)
    if (v != null) return v
  }
  return idx
}

export function KanbanView({
  data,
  fields,
  onDataUpdate,
  groupByField = "status",
}: KanbanViewProps) {
  const isMobile = useIsMobile()
  const [draggedItem, setDraggedItem] = useState<{ item: DynamicRecord; columnId: string } | null>(null)

  const displayFields = useMemo(
    () => visibleFields(fields).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [fields],
  )

  const groupField = useMemo(
    () => fields.find((f) => f.path === groupByField),
    [fields, groupByField],
  )

  const kanbanColumns = useMemo<KanbanColumn[]>(() => {
    const groups: Record<string, KanbanColumn> = {}

    if (groupField?.variants) {
      Object.keys(groupField.variants).forEach((value, index) => {
        groups[value] = {
          id: value,
          title: value,
          color: COLUMN_COLORS[index % COLUMN_COLORS.length],
          items: [],
        }
      })
    }

    let nextColorIdx = Object.keys(groups).length
    for (const item of data) {
      const value = String(getByPath(item, groupByField) ?? "Uncategorized")
      if (!groups[value]) {
        groups[value] = {
          id: value,
          title: value,
          color: COLUMN_COLORS[nextColorIdx++ % COLUMN_COLORS.length],
          items: [],
        }
      }
      groups[value].items.push(item)
    }

    return Object.values(groups)
  }, [data, groupByField, groupField])

  const handleDragStart = (item: DynamicRecord, columnId: string) => {
    setDraggedItem({ item, columnId })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const idPath = displayFields[0]?.path

  const handleDrop = (targetColumnId: string) => {
    if (!draggedItem) return
    const draggedId = getId(draggedItem.item, idPath, -1)

    const updatedData = data.map((item, idx) => {
      const itemId = getId(item, idPath, idx)
      if (itemId === draggedId) {
        return setByPath(item, groupByField, targetColumnId)
      }
      return item
    })

    onDataUpdate?.(updatedData)
    setDraggedItem(null)
  }

  const renderCard = (item: DynamicRecord, idx: number) => {
    const itemId = getId(item, idPath, idx)
    const titleField = displayFields[0]
    const descField = displayFields[1]
    const titleValue = titleField ? getByPath(item, titleField.path) : ""
    const descValue = descField ? getByPath(item, descField.path) : null

    return (
      <Card
        key={itemId}
        draggable={!isMobile}
        onDragStart={!isMobile ? () => handleDragStart(item, String(getByPath(item, groupByField) ?? "Uncategorized")) : undefined}
        className={isMobile ? "cursor-pointer" : "cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {titleField && renderField(titleValue, titleField, item)}
            </div>
            <Button variant="BorderStyle" buttonType="icon" className="h-6 w-6 -mt-1 -mr-1">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
          {descField && descValue != null && (
            <div className="text-xs text-content-presentation-global-tertiary leading-relaxed">
              {renderField(descValue, descField, item)}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="space-y-2">
            {displayFields.slice(2).map((field) => {
              if (field.path === groupByField) return null
              const value = getByPath(item, field.path)
              if (value == null) return null
              return (
                <div key={field.path} className="flex items-center justify-between text-xs">
                  <span className="text-content-presentation-global-tertiary">{field.label}:</span>
                  {renderField(value, field, item)}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isMobile) {
    return (
      <div className="h-full overflow-y-auto p-4 bg-background-presentation-body-primary">
        <div className="flex flex-col gap-4">
          {kanbanColumns.map((column) => (
            <div key={column.id} className="flex flex-col gap-3">
              <ColumnHeader column={column} />
              <div className="flex flex-col gap-3">
                {column.items.map((item, idx) => renderCard(item, idx))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-x-auto p-6 bg-background-presentation-body-primary">
      <div className="flex h-full gap-4 pb-4" style={{ minWidth: "max-content" }}>
        {kanbanColumns.map((column) => (
          <div
            key={column.id}
            className="flex w-80 flex-col gap-3"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <ColumnHeader column={column} />
            <div className="flex flex-col gap-3 overflow-y-auto">
              {column.items.map((item, idx) => renderCard(item, idx))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ColumnHeader({ column }: { column: KanbanColumn }) {
  const countBadge = resolveBadgeVariant("gray")
  return (
    <div className="flex items-center justify-between rounded-lg p-3 border border-border-presentation-global-primary bg-background-presentation-body-overlay-primary">
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full ${column.color}`} />
        <h3 className="font-semibold text-content-presentation-global-primary">{column.title}</h3>
        <Badge
          {...countBadge}
          label={String(column.items.length)}
          className="h-5 rounded-full p-0 text-xs"
          size="XS"
         
        />
      </div>
      <div className="flex items-center gap-1">
        <Button variant="BorderStyle" buttonType="icon" className="h-7 w-7">
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="BorderStyle" buttonType="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
