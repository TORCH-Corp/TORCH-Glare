"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import { Badge } from "../Badge"
import { FilterPanel } from "./FilterPanel"
import {
  Search,
  Star,
  Archive,
  Trash2,
  MoreHorizontal,
  Reply,
  Forward,
  Paperclip,
  InboxIcon,
  AlertCircle,
} from "lucide-react"
import { cn } from "../../utils/cn"
import type {
  DynamicRecord,
  ViewConfig,
  DynamicColumnConfig,
  DynamicFilterConfig,
  FilterState,
  FilterValue,
  FieldConfig,
  InboxConfig,
} from "./types"
import TabFormItem from "../TabFormItem"
import { Button } from "../Button"
import { Avatar, AvatarFallback } from "../Avatar"
import { Card } from "../Card"
import { InputField } from "../InputField"
import { Divider } from "../Divider"
import { renderDetailView } from "../../utils/dataViews/nestedDataUtils"
import { getByPath, setByPath, matchesFilterValues } from "../../utils/dataViews/pathUtils"
import { renderField } from "./fieldRenderers"
import { resolveInboxConfig, visibleFields } from "../../utils/dataViews/fieldUtils"
import { useIsMobile } from "../../hooks/useIsMobile"
import { resolveBadgeVariant } from "./badgeAdapter"

export type InboxViewProps = {
  data: DynamicRecord[]
  columns?: DynamicColumnConfig[]
  fields: FieldConfig[]
  inboxConfig?: InboxConfig
  config: ViewConfig
  onDataUpdate?: (data: DynamicRecord[]) => void
  filters?: DynamicFilterConfig[]
  filterState?: FilterState
  onFilterChange?: (filters: FilterState) => void
  showFilters?: boolean
  itemHref?: (item: DynamicRecord, id: any) => string
  selectedItemId?: any
  renderDetail?: (item: DynamicRecord | null) => ReactNode
}

type InboxFilter = "all" | "starred" | "priority"

function getId(item: DynamicRecord, fallbackPath: string | undefined, idx: number): any {
  if (item?.id != null) return item.id
  if (fallbackPath) {
    const v = getByPath(item, fallbackPath)
    if (v != null) return v
  }
  return idx
}

function getInitials(name: any): string {
  const s = String(name ?? "?").trim()
  if (!s) return "?"
  return s
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?"
}

export function InboxView({
  data,
  columns,
  fields,
  inboxConfig: userInboxConfig,
  config,
  onDataUpdate,
  filters: filterConfig,
  filterState: externalFilterState,
  onFilterChange,
  showFilters = true,
  itemHref,
  selectedItemId,
  renderDetail,
}: InboxViewProps) {
  const isMobile = useIsMobile()
  const [selectedItem, setSelectedItem] = useState<DynamicRecord | null>(data[0] || null)
  const [searchQuery, setSearchQuery] = useState("")
  const [inboxFilter, setInboxFilter] = useState<InboxFilter>("all")
  const [internalFilters, setInternalFilters] = useState<FilterState>({})

  const activeFilters = externalFilterState ?? internalFilters

  const displayFields = useMemo(
    () => visibleFields(fields).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [fields],
  )

  const inboxCfg = useMemo(() => resolveInboxConfig(data, userInboxConfig), [data, userInboxConfig])
  const idPath = displayFields[0]?.path

  useEffect(() => {
    if (selectedItemId == null) return
    const match = data.find((item, idx) => {
      const cur = getId(item, idPath, idx)
      return String(cur) === String(selectedItemId)
    })
    if (match) setSelectedItem(match)
  }, [selectedItemId, data, idPath])

  const titleField = useMemo(() => {
    const path = inboxCfg.titlePath
    if (path) return fields.find((f) => f.path === path) ?? { path, label: path, type: "text" as const }
    return displayFields[0]
  }, [inboxCfg.titlePath, displayFields, fields])

  const previewField = useMemo(() => {
    const path = inboxCfg.previewPath
    if (path) return fields.find((f) => f.path === path) ?? { path, label: path, type: "text" as const }
    return displayFields[1]
  }, [inboxCfg.previewPath, displayFields, fields])

  const detailField = useMemo(() => displayFields[2], [displayFields])

  const isStarred = (item: DynamicRecord) =>
    inboxCfg.starredField ? !!getByPath(item, inboxCfg.starredField) : false
  const hasAttachment = (item: DynamicRecord) => {
    if (!inboxCfg.attachmentField) return false
    const v = getByPath(item, inboxCfg.attachmentField)
    if (typeof v === "boolean") return v
    if (Array.isArray(v)) return v.length > 0
    return v != null
  }
  const isHighPriority = (item: DynamicRecord) => {
    if (!inboxCfg.priorityField) return false
    const v = getByPath(item, inboxCfg.priorityField)
    return String(v).toLowerCase() === "high"
  }

  const toggleStar = (itemId: any) => {
    if (!inboxCfg.starredField) return
    const updatedData = data.map((item, idx) => {
      const cur = getId(item, idPath, idx)
      if (cur === itemId) {
        const next = !getByPath(item, inboxCfg.starredField!)
        return setByPath(item, inboxCfg.starredField!, next)
      }
      return item
    })
    onDataUpdate?.(updatedData)

    if (selectedItem && getId(selectedItem, idPath, -1) === itemId) {
      setSelectedItem((prev) =>
        prev && inboxCfg.starredField
          ? setByPath(prev, inboxCfg.starredField, !getByPath(prev, inboxCfg.starredField))
          : prev,
      )
    }
  }

  const handleSelectItem = (item: DynamicRecord) => {
    setSelectedItem(item)
  }

  const handleFilterChange = (path: string, value: FilterValue) => {
    const newFilters: FilterState = { ...activeFilters, [path]: value }
    if (onFilterChange) onFilterChange(newFilters)
    else setInternalFilters(newFilters)
  }

  const clearAllFilters = () => {
    if (onFilterChange) onFilterChange({})
    else setInternalFilters({})
  }

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = !searchQuery
        ? true
        : displayFields.some((f) => {
          const value = getByPath(item, f.path)
          if (value == null) return false
          return String(value).toLowerCase().includes(searchQuery.toLowerCase())
        })

      const matchesInboxFilter =
        inboxFilter === "all" ||
        (inboxFilter === "starred" && isStarred(item)) ||
        (inboxFilter === "priority" && isHighPriority(item))

      const matchesFilters = Object.entries(activeFilters).every(([path, filterValues]) =>
        matchesFilterValues(item, path, filterValues),
      )

      return matchesSearch && matchesInboxFilter && matchesFilters
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, searchQuery, inboxFilter, activeFilters, displayFields, inboxCfg])

  const starredCount = inboxCfg.starredField ? data.filter((i) => isStarred(i)).length : 0
  const priorityCount = inboxCfg.priorityField ? data.filter((i) => isHighPriority(i)).length : 0

  const filtersEnabled = showFilters && config.showFilters !== false
  const countBadge = resolveBadgeVariant("gray")
  const fallbackColumns: DynamicColumnConfig[] = columns ?? displayFields.map((f, i) => ({
    id: f.path,
    label: f.label ?? f.path,
    visible: true,
    order: i,
  }))

  return (
    <div className="flex h-full flex-col md:flex-row gap-2">
      {filtersEnabled && !isMobile && (
        <div className="w-64 border-r border-border-presentation-global-primary bg-background-presentation-body-overlay-primary flex flex-col">
          <div className="p-4 space-y-1">
            <TabFormItem
              componentType="side"
              onClick={() => setInboxFilter("all")}
              className="w-full justify-start gap-2"
            >
              <InboxIcon className="h-4 w-4" />
              All Items
              <Badge {...countBadge} label={String(data.length)} className="ml-auto" size="XS" />
            </TabFormItem>
            {inboxCfg.starredField && (
              <TabFormItem
                componentType="side"
                className="w-full justify-start gap-2"
                onClick={() => setInboxFilter("starred")}
              >
                <Star className="h-4 w-4" />
                Starred
                {starredCount > 0 && (
                  <Badge {...countBadge} label={String(starredCount)} className="ml-auto" size="XS" />
                )}
              </TabFormItem>
            )}
            {inboxCfg.priorityField && (
              <TabFormItem
                componentType="side"
                className="w-full justify-start gap-2"
                onClick={() => setInboxFilter("priority")}
              >
                <AlertCircle className="h-4 w-4" />
                Priority
                {priorityCount > 0 && (
                  <Badge {...countBadge} label={String(priorityCount)} className="ml-auto" size="XS" />
                )}
              </TabFormItem>
            )}
          </div>

          <Divider />

          <div className="flex-1 overflow-y-auto">
            <FilterPanel
              data={data}
              fields={fields}
              filters={activeFilters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              filterConfig={filterConfig}
            />
          </div>
        </div>
      )}

      <div className={cn(
        "border rounded-[16px] border-border-presentation-global-primary flex flex-col bg-background-presentation-form-base",
        isMobile ? "flex-1" : "w-full md:w-96",
      )}>
        <div className="p-4 border-b border-border-presentation-global-primary">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-presentation-global-tertiary z-10" />
            <InputField
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredData.map((item, idx) => {
            const itemId = getId(item, idPath, idx)
            const titleValue = titleField ? getByPath(item, titleField.path) : ""
            const previewValue = previewField ? getByPath(item, previewField.path) : ""
            const detailValue = detailField ? getByPath(item, detailField.path) : ""
            const selected =
              (selectedItemId != null && String(selectedItemId) === String(itemId)) ||
              (selectedItem != null && getId(selectedItem, idPath, -1) === itemId)

            const rowClass = cn(
              "flex items-start gap-3 py-4 px-[18px] border-b border-2 border-border-presentation-global-primary cursor-pointer transition-colors hover:bg-background-presentation-action-contstyle-hover",
              selected &&
              "bg-blue-sparkle-alpha-5 border-y-2 border-y-border-presentation-state-focus",
            )
            const href = itemHref?.(item, itemId)

            const rowContent = (
              <>
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-background-presentation-action-primary text-content-presentation-action-primary text-sm">
                    {getInitials(previewValue || titleValue)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm truncate font-semibold text-content-presentation-global-primary">
                      {String(previewValue ?? "")}
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      {hasAttachment(item) && (
                        <Paperclip className="h-3 w-3 text-content-presentation-global-tertiary" />
                      )}
                      {inboxCfg.starredField && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleStar(itemId)
                          }}
                          className="hover:text-content-presentation-badge-yellow transition-colors"
                          aria-label="Toggle star"
                        >
                          <Star
                            className={cn(
                              "h-4 w-4",
                              isStarred(item)
                                ? "fill-content-presentation-badge-yellow text-content-presentation-badge-yellow"
                                : "text-content-presentation-global-tertiary",
                            )}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm mb-1 truncate font-medium text-content-presentation-global-primary">
                    {String(titleValue ?? "")}
                  </p>
                  {detailField && detailValue != null && (
                    <p className="text-xs text-content-presentation-global-secondary truncate leading-relaxed">
                      {String(detailValue)}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {displayFields.slice(3, 5).map((field) => {
                      const value = getByPath(item, field.path)
                      if (value == null) return null
                      return (
                        <span key={field.path} className="text-xs">
                          {renderField(value, field, item)}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </>
            )

            return href ? (
              <Link
                key={itemId}
                href={href}
                className={cn(rowClass, "no-underline text-inherit")}
              >
                {rowContent}
              </Link>
            ) : (
              <div
                key={itemId}
                onClick={() => handleSelectItem(item)}
                className={rowClass}
              >
                {rowContent}
              </div>
            )
          })}
        </div>
      </div>

      {renderDetail && !isMobile ? (
        <div className="flex-1 flex flex-col bg-background-presentation-form-base overflow-hidden rounded-[16px]">
          {renderDetail(selectedItem)}
        </div>
      ) : config.showPreviewPane && !isMobile && selectedItem ? (
        <div className="flex-1 flex flex-col bg-background-presentation-form-base overflow-hidden rounded-[16px] border border-border-presentation-global-primary">
          <div className="flex items-center justify-between gap-4 p-4 border-b border-border-presentation-global-primary bg-background-presentation-form-base">
            <div className="flex items-center gap-2">
              <Button variant="BorderStyle" buttonType="icon">
                <Archive className="h-4 w-4" />
              </Button>
              <Button variant="BorderStyle" buttonType="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Divider orientation="vertical" className="h-6" />
              <Button variant="BorderStyle" buttonType="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <Card>
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-background-presentation-action-primary text-content-presentation-action-primary">
                    {getInitials(previewField ? getByPath(selectedItem, previewField.path) : "")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h2 className="text-xl font-semibold text-content-presentation-global-primary mb-1">
                        {String(titleField ? getByPath(selectedItem, titleField.path) : "")}
                      </h2>
                      {previewField && (
                        <p className="text-sm text-content-presentation-global-tertiary">
                          {previewField.label}:{" "}
                          <span className="text-content-presentation-global-primary">
                            {String(getByPath(selectedItem, previewField.path))}
                          </span>
                        </p>
                      )}
                    </div>
                    {inboxCfg.starredField && (
                      <button
                        onClick={() => toggleStar(getId(selectedItem, idPath, -1))}
                        className="hover:text-content-presentation-badge-yellow transition-colors"
                        aria-label="Toggle star"
                      >
                        <Star
                          className={cn(
                            "h-5 w-5",
                            isStarred(selectedItem)
                              ? "fill-content-presentation-badge-yellow text-content-presentation-badge-yellow"
                              : "text-content-presentation-global-tertiary",
                          )}
                        />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {displayFields.slice(3).map((field) => {
                      const value = getByPath(selectedItem, field.path)
                      if (value == null) return null
                      return <span key={field.path}>{renderField(value, field, selectedItem)}</span>
                    })}
                  </div>
                </div>
              </div>

              <Divider className="my-6" />

              {renderDetailView(
                selectedItem,
                fallbackColumns.filter((c) => c.visible),
                (value, column, row) => {
                  const f = fields.find((field) => field.path === column.id)
                  if (f) return renderField(value, f, row)
                  return <span>{String(value ?? "")}</span>
                },
              )}

              {hasAttachment(selectedItem) && (
                <>
                  <Divider className="my-6" />
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-background-presentation-form-field-primary">
                    <Paperclip className="h-4 w-4 text-content-presentation-global-tertiary" />
                    <span className="text-sm text-content-presentation-global-primary">attachment.pdf</span>
                    <span className="text-xs text-content-presentation-global-tertiary">(2.4 MB)</span>
                  </div>
                </>
              )}
            </Card>
          </div>

          <div className="flex items-center gap-2 p-4 border-t border-border-presentation-global-primary bg-background-presentation-form-base">
            <Button className="gap-2">
              <Reply className="h-4 w-4" />
              Reply
            </Button>
            <Button variant="BorderStyle" className="gap-2 bg-transparent">
              <Forward className="h-4 w-4" />
              Forward
            </Button>
          </div>
        </div>
      ) : !isMobile && (
        <div className="flex-1 flex items-center justify-center bg-background-presentation-form-base overflow-hidden rounded-[16px] border border-border-presentation-global-primary">
          <p className="text-content-presentation-global-tertiary">Select an item to view details</p>
        </div>
      )}
    </div>
  )
}
