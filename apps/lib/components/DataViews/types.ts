import type React from "react"

export type ViewType = "table" | "kanban" | "inbox" | "tree"

export type TreeConfig = {
  childrenField?: string
  parentField?: string
  idField?: string
  orderField?: string
  nodeLabel?: string
  defaultExpanded?: "all" | "roots" | "none"
  /** Right-pane mode for the selected tree node. `"details"` is accepted as a
   *  deprecated alias of `"card"` for backward compatibility. */
  defaultRightPane?: "table" | "card" | "details"
  dndEnabled?: boolean
}

export type ViewVisibility = {
  table?: boolean
  kanban?: boolean
  inbox?: boolean
  tree?: boolean
}

export type DynamicRecord = Record<string, any>

export type DynamicColumnConfig = {
  id: string
  label: string
  visible: boolean
  order: number
  type?: "text" | "number" | "date" | "badge" | "array" | "boolean"
  render?: (value: any, row: DynamicRecord) => React.ReactNode
}

export type DynamicFilterConfig = {
  id: string
  label?: string
  enabled?: boolean
  order?: number
  options?: string[] | { label: string; value: string }[]
  render?: (value: string, isSelected: boolean) => React.ReactNode
  onChange?: (selectedValues: string[]) => void
}

export type NumericRangeFilter = { kind: "number"; min?: number; max?: number }
export type DateRangeFilter = { kind: "date"; from?: string; to?: string }
export type RangeFilter = NumericRangeFilter | DateRangeFilter
export type FilterValue = string[] | RangeFilter
export type FilterState = Record<string, FilterValue>

export type FieldPreset =
  | { label: string; min?: number; max?: number }
  | { label: string; from?: string; to?: string }

// Palette keys for the Kanban column header pill. Kept in lockstep with
// `COLUMN_PALETTE` in KanbanView.tsx so consumers can pick a color per status
// via `FieldConfig.kanbanVariants`.
export type KanbanColumnColor =
  | "gray"
  | "purple"
  | "orange"
  | "blue"
  | "green"
  | "red"

export type BadgeVariant =
  | "green"
  | "greenLight"
  | "cocktailGreen"
  | "yellow"
  | "redOrange"
  | "redLight"
  | "rose"
  | "purple"
  | "bluePurple"
  | "blue"
  | "navy"
  | "gray"
  | "highlight"

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "hidden"
  | "enum-badge"
  | "badge-array"
  | "currency"
  | "number-format"
  | "progress-bar"
  | "star-rating"
  | "icon-text"
  | "two-line"
  | "avatar"
  | "link"
  | "image"
  | "date-format"

export type CurrencyOptions = {
  symbol?: string
  locale?: string
  decimals?: number
  code?: string
}

export type FieldConfig = {
  path: string
  label?: string
  type?: FieldType
  visible?: boolean
  order?: number

  variants?: Record<string, BadgeVariant>
  defaultVariant?: BadgeVariant

  // Per-status overrides for the Kanban board view. Keys must match
  // `variants` keys (or any value present in the data). Lets consumers set a
  // human-friendly column title and pick a column pill color without affecting
  // the badge color used elsewhere.
  kanbanVariants?: Record<
    string,
    { label?: string; color?: KanbanColumnColor }
  >


  variant?: BadgeVariant
  limit?: number

  currency?: string | CurrencyOptions
  format?: Intl.NumberFormatOptions

  thresholds?: [number, number]

  max?: number

  icon?: string
  iconPosition?: "before" | "after"

  secondaryPath?: string

  linkType?: "mailto" | "tel" | "url"

  fallbackPath?: string

  dateFormat?: string | Intl.DateTimeFormatOptions

  trueLabel?: string
  falseLabel?: string
  trueVariant?: BadgeVariant
  falseVariant?: BadgeVariant

  filterable?: boolean
  filterLabel?: string
  filterOptions?: string[] | { label: string; value: string }[]
  /**
   * Categorical filter selection mode.
   * - "multi" (default): checkboxes, multi-select. FilterValue is the array of picked options.
   * - "single": radios, single-select. FilterValue is a 1-element array.
   */
  filterMode?: "single" | "multi"
  presets?: FieldPreset[]
  rangeMin?: number
  rangeMax?: number
  rangeStep?: number
  onFilterChange?: (value: FilterValue) => void

  render?: (value: any, row: DynamicRecord) => React.ReactNode
}

export type InboxConfig = {
  starredField?: string | null
  readField?: string | null
  attachmentField?: string | null
  priorityField?: string | null
  titlePath?: string
  previewPath?: string
}

export type ColumnConfig = {
  id: string
  label: string
  visible: boolean
  order: number
}

export type ViewConfig = {
  defaultView: ViewType
  tableColumns: ColumnConfig[]
  kanbanGroupBy: string
  showFilters: boolean
  showPreviewPane: boolean
  sortBy: string
  sortOrder: "asc" | "desc"
}

export const defaultConfig: ViewConfig = {
  defaultView: "table",
  tableColumns: [],
  kanbanGroupBy: "",
  showFilters: true,
  showPreviewPane: true,
  sortBy: "",
  sortOrder: "desc",
}
