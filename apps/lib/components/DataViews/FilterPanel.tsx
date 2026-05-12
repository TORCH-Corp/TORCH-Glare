"use client"

import { Button } from "../Button"
import { Badge } from "../Badge"
import { X } from "lucide-react"
import { Checkbox } from "../Checkbox"
import { Divider } from "../Divider"
import { Label } from "../Label"
import type {
  DynamicRecord,
  DynamicFilterConfig,
  FieldConfig,
  FieldType,
  FilterState,
  FilterValue,
  NumericRangeFilter,
  DateRangeFilter,
} from "./types"
import { getByPath, formatPathLabel } from "../../utils/dataViews/pathUtils"
import {
  computeNumericExtremes,
  countActiveFilters,
  inferStep,
  isDateRange,
  isNumericRange,
  resolvePresets,
} from "../../utils/dataViews/rangeUtils"
import { RangeSliderWithInputs } from "./filters/RangeSliderWithInputs"
import { DateRangePopover } from "./filters/DateRangePopover"
import { PresetChips } from "./filters/PresetChips"
import { resolveBadgeVariant } from "./badgeAdapter"

type FilterPanelProps = {
  data: DynamicRecord[]
  fields: FieldConfig[]
  filters: FilterState
  onFilterChange: (path: string, value: FilterValue) => void
  onClearAll: () => void
  filterConfig?: DynamicFilterConfig[]
}

const NUMERIC_TYPES: FieldType[] = [
  "number",
  "number-format",
  "currency",
  "progress-bar",
  "star-rating",
]

const DATE_TYPES: FieldType[] = ["date", "date-format"]

type FilterKind = "categorical" | "numeric-range" | "date-range"

type Entry = {
  path: string
  label: string
  kind: FilterKind
  field?: FieldConfig
  legacy?: DynamicFilterConfig
}

function buildFilterableEntries(
  data: DynamicRecord[],
  fields: FieldConfig[],
  legacy?: DynamicFilterConfig[],
): Entry[] {
  const legacyByPath = new Map(
    (legacy ?? []).filter((f) => f.enabled !== false).map((f) => [f.id, f]),
  )

  const entries: Entry[] = []
  const seen = new Set<string>()

  for (const f of fields) {
    if (f.type === "hidden") continue
    if (f.filterable === false) continue

    const isExplicit = f.filterable === true
    const isCategoricalAuto =
      f.type === "enum-badge" ||
      f.type === "boolean" ||
      f.type === "badge-array" ||
      f.type === "icon-text"
    const isNumeric = f.type != null && NUMERIC_TYPES.includes(f.type)
    const isDate = f.type != null && DATE_TYPES.includes(f.type)

    let include = isExplicit || isCategoricalAuto

    if (!include) {
      if (f.type !== "text" && f.type !== undefined) continue
      const unique = new Set<string>()
      for (const item of data) {
        const v = getByPath(item, f.path)
        if (v == null) continue
        unique.add(String(v))
        if (unique.size > 10) break
      }
      include = unique.size > 0 && unique.size <= 10
    }

    if (!include) continue

    const kind: FilterKind = isNumeric ? "numeric-range" : isDate ? "date-range" : "categorical"

    entries.push({
      path: f.path,
      label: f.filterLabel ?? f.label ?? formatPathLabel(f.path),
      kind,
      field: f,
      legacy: legacyByPath.get(f.path),
    })
    seen.add(f.path)
  }

  for (const lf of legacyByPath.values()) {
    if (seen.has(lf.id)) continue
    entries.push({
      path: lf.id,
      label: lf.label ?? formatPathLabel(lf.id),
      kind: "categorical",
      legacy: lf,
    })
  }

  return entries
}

function getCategoricalOptions(
  data: DynamicRecord[],
  path: string,
  field?: FieldConfig,
  legacy?: DynamicFilterConfig,
): string[] {
  if (field?.filterOptions && field.filterOptions.length > 0) {
    return normalizeOptions(field.filterOptions)
  }
  if (legacy?.options && legacy.options.length > 0) {
    return normalizeOptions(legacy.options)
  }
  if (field?.variants) {
    const fromMap = Object.keys(field.variants)
    const fromData = collectUnique(data, path)
    return Array.from(new Set([...fromMap, ...fromData]))
  }
  return collectUnique(data, path)
}

function normalizeOptions(opts: NonNullable<FieldConfig["filterOptions"]>): string[] {
  if (opts.length === 0) return []
  if (typeof opts[0] === "string") return opts as string[]
  return (opts as { label: string; value: string }[]).map((o) => o.value)
}

function collectUnique(data: DynamicRecord[], path: string): string[] {
  const set = new Set<string>()
  for (const item of data) {
    const v = getByPath(item, path)
    if (v == null) continue
    if (Array.isArray(v)) {
      for (const x of v) set.add(String(x))
    } else {
      set.add(String(v))
    }
  }
  return Array.from(set).sort()
}

export function FilterPanel({
  data,
  fields,
  filters,
  onFilterChange,
  onClearAll,
  filterConfig,
}: FilterPanelProps) {
  const entries = buildFilterableEntries(data, fields, filterConfig)

  const setFilter = (path: string, value: FilterValue) => {
    onFilterChange(path, value)
    const field = fields.find((f) => f.path === path)
    field?.onFilterChange?.(value)
    if (Array.isArray(value)) {
      const legacy = filterConfig?.find((f) => f.id === path)
      legacy?.onChange?.(value)
    }
  }

  const toggleCategorical = (path: string, option: string) => {
    const current = filters[path]
    const arr = Array.isArray(current) ? current : []
    const next = arr.includes(option) ? arr.filter((v) => v !== option) : [...arr, option]
    setFilter(path, next)
  }

  const totalFilters = countActiveFilters(filters)

  if (entries.length === 0) return null

  const countBadge = resolveBadgeVariant("gray")

  return (
    <div className="w-64 border-r border-border-presentation-global-primary bg-background-presentation-body-overlay-primary p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-content-presentation-global-primary">Filters</h3>
          {totalFilters > 0 && (
            <Badge
              {...countBadge}
              label={String(totalFilters)}
              className="h-5 min-w-[20px] rounded-full p-0 text-xs"
              size="XS"
             
            />
          )}
        </div>
        {totalFilters > 0 && (
          <Button variant="PrimeStyle" size="M" onClick={onClearAll} className="h-7 gap-1 text-xs">
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div key={entry.path}>
            {index > 0 && <Divider className="mb-4" />}
            <div className="space-y-2">
              <Label className="text-content-presentation-global-primary">{entry.label}</Label>
              <FilterBody
                entry={entry}
                data={data}
                value={filters[entry.path]}
                onCategoricalToggle={(opt) => toggleCategorical(entry.path, opt)}
                onSetFilter={(v) => setFilter(entry.path, v)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FilterBody({
  entry,
  data,
  value,
  onCategoricalToggle,
  onSetFilter,
}: {
  entry: Entry
  data: DynamicRecord[]
  value: FilterValue | undefined
  onCategoricalToggle: (option: string) => void
  onSetFilter: (next: FilterValue) => void
}) {
  if (entry.kind === "numeric-range" && entry.field) {
    const extremes = computeNumericExtremes(data, entry.path)
    if (!extremes || extremes.min === extremes.max) {
      return <div className="text-xs text-content-presentation-global-tertiary">No range to filter.</div>
    }
    const step = inferStep(entry.field, extremes)
    const presets = resolvePresets(entry.field)
    const numericValue: NumericRangeFilter | undefined = isNumericRange(value) ? value : undefined
    return (
      <div className="space-y-3">
        {presets.length > 0 && (
          <PresetChips presets={presets} current={value} onSelect={onSetFilter} />
        )}
        <RangeSliderWithInputs
          field={entry.field}
          extremes={extremes}
          step={step}
          value={numericValue}
          onChange={onSetFilter}
        />
      </div>
    )
  }

  if (entry.kind === "date-range" && entry.field) {
    const presets = resolvePresets(entry.field)
    const dateValue: DateRangeFilter | undefined = isDateRange(value) ? value : undefined
    return (
      <DateRangePopover
        value={dateValue}
        onChange={onSetFilter}
        presets={presets.length > 0 ? presets : undefined}
      />
    )
  }

  const opts = getCategoricalOptions(data, entry.path, entry.field, entry.legacy)
  const selected = Array.isArray(value) ? value : []
  return (
    <div className="space-y-2">
      {opts.map((opt) => {
        const isSelected = selected.includes(opt)
        const variant = entry.field?.variants?.[opt]
        const badgeProps = variant ? resolveBadgeVariant(variant) : null
        return (
          <div key={opt} className="flex items-center space-x-2">
            <Checkbox
              id={`${entry.path}-${opt}`}
              checked={isSelected}
              onCheckedChange={() => onCategoricalToggle(opt)}
            />
            <label
              htmlFor={`${entry.path}-${opt}`}
              className="text-sm text-content-presentation-global-primary cursor-pointer leading-none flex-1"
            >
              {entry.legacy?.render
                ? entry.legacy.render(opt, isSelected)
                : badgeProps
                  ? <Badge {...badgeProps} label={opt} size="XS" />
                  : opt}
            </label>
          </div>
        )
      })}
    </div>
  )
}
