import type {
  DynamicRecord,
  FieldConfig,
  FieldPreset,
  FilterValue,
  NumericRangeFilter,
  DateRangeFilter,
  RangeFilter,
} from "../../components/DataViews/types"
import { getByPath } from "./pathUtils"

export function isRangeFilter(v: unknown): v is RangeFilter {
  return (
    !!v &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    ((v as RangeFilter).kind === "number" || (v as RangeFilter).kind === "date")
  )
}

export function isNumericRange(v: FilterValue | undefined | null): v is NumericRangeFilter {
  return !!v && !Array.isArray(v) && (v as RangeFilter).kind === "number"
}

export function isDateRange(v: FilterValue | undefined | null): v is DateRangeFilter {
  return !!v && !Array.isArray(v) && (v as RangeFilter).kind === "date"
}

export function isFilterActive(v: FilterValue | undefined): boolean {
  if (v == null) return false
  if (Array.isArray(v)) return v.length > 0
  if (isNumericRange(v)) return v.min != null || v.max != null
  if (isDateRange(v)) return v.from != null || v.to != null
  return false
}

export function countActiveFilters(state: Record<string, FilterValue>): number {
  let n = 0
  for (const v of Object.values(state)) {
    if (isFilterActive(v)) n++
  }
  return n
}

export function describeFilterValue(v: FilterValue): string {
  if (Array.isArray(v)) return v.join(", ")
  if (isNumericRange(v)) {
    if (v.min != null && v.max != null) return `${v.min} – ${v.max}`
    if (v.min != null) return `≥ ${v.min}`
    if (v.max != null) return `≤ ${v.max}`
    return "any"
  }
  if (isDateRange(v)) {
    if (v.from && v.to) return `${v.from} → ${v.to}`
    if (v.from) return `from ${v.from}`
    if (v.to)   return `until ${v.to}`
    return "any"
  }
  return ""
}

export type NumericExtremes = { min: number; max: number }

export function computeNumericExtremes(
  data: DynamicRecord[],
  path: string,
): NumericExtremes | null {
  let min = Number.POSITIVE_INFINITY
  let max = Number.NEGATIVE_INFINITY
  let found = false
  for (const item of data) {
    const v = getByPath(item, path)
    const n = typeof v === "number" ? v : Number(v)
    if (!Number.isFinite(n)) continue
    if (n < min) min = n
    if (n > max) max = n
    found = true
  }
  return found ? { min, max } : null
}

export function inferStep(field: FieldConfig, extremes: NumericExtremes): number {
  if (field.rangeStep != null) return field.rangeStep
  switch (field.type) {
    case "star-rating":  return 0.1
    case "progress-bar": return 1
    case "currency": {
      const span = extremes.max - extremes.min
      if (span >= 10000) return 100
      if (span >= 1000)  return 10
      return 1
    }
    default: {
      const span = extremes.max - extremes.min
      if (span >= 10000) return 10
      if (span >= 100)   return 1
      return 0.1
    }
  }
}

export type DateExtremes = { from: string; to: string }

export function computeDateExtremes(
  data: DynamicRecord[],
  path: string,
): DateExtremes | null {
  let minMs = Number.POSITIVE_INFINITY
  let maxMs = Number.NEGATIVE_INFINITY
  let found = false
  for (const item of data) {
    const v = getByPath(item, path)
    if (v == null) continue
    const ms = v instanceof Date ? v.getTime() : Date.parse(String(v))
    if (!Number.isFinite(ms)) continue
    if (ms < minMs) minMs = ms
    if (ms > maxMs) maxMs = ms
    found = true
  }
  if (!found) return null
  return { from: toIsoDate(new Date(minMs)), to: toIsoDate(new Date(maxMs)) }
}

const RELATIVE = /^(-?\d+)([dwmy])$/

export function resolveRelativeDate(token: string | undefined): string | undefined {
  if (!token) return undefined
  if (token === "today" || token === "now") return toIsoDate(new Date())
  if (token === "start-of-year") {
    const now = new Date()
    return toIsoDate(new Date(now.getFullYear(), 0, 1))
  }
  const m = RELATIVE.exec(token)
  if (m) {
    const n = parseInt(m[1], 10)
    const unit = m[2]
    const d = new Date()
    switch (unit) {
      case "d": d.setDate(d.getDate() + n); break
      case "w": d.setDate(d.getDate() + n * 7); break
      case "m": d.setMonth(d.getMonth() + n); break
      case "y": d.setFullYear(d.getFullYear() + n); break
    }
    return toIsoDate(d)
  }
  const ms = Date.parse(token)
  if (Number.isFinite(ms)) return toIsoDate(new Date(ms))
  return token
}

export function toIsoDate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export function presetToFilterValue(preset: FieldPreset): RangeFilter {
  if ("from" in preset || "to" in preset) {
    return {
      kind: "date",
      from: resolveRelativeDate(preset.from),
      to: resolveRelativeDate(preset.to),
    }
  }
  return {
    kind: "number",
    min: (preset as { min?: number }).min,
    max: (preset as { max?: number }).max,
  }
}

export function isPresetActive(preset: FieldPreset, current: FilterValue | undefined): boolean {
  if (!current) return false
  if (Array.isArray(current)) return false
  if (current.kind === "number" && !("from" in preset) && !("to" in preset)) {
    return (
      ((preset as { min?: number }).min ?? null) === (current.min ?? null) &&
      ((preset as { max?: number }).max ?? null) === (current.max ?? null)
    )
  }
  if (current.kind === "date" && (("from" in preset) || ("to" in preset))) {
    const want = presetToFilterValue(preset) as DateRangeFilter
    return (want.from ?? null) === (current.from ?? null) && (want.to ?? null) === (current.to ?? null)
  }
  return false
}

const DEFAULT_PRESETS: Record<string, FieldPreset[]> = {
  currency: [
    { label: "<$100",      max: 100 },
    { label: "$100–$500",  min: 100, max: 500 },
    { label: "$500–$2k",   min: 500, max: 2000 },
    { label: "$2k+",       min: 2000 },
  ],
  "progress-bar": [
    { label: "0%",      min: 0,   max: 0 },
    { label: "1–40%",   min: 1,   max: 40 },
    { label: "40–70%",  min: 40,  max: 70 },
    { label: "70–99%",  min: 70,  max: 99 },
    { label: "100%",    min: 100, max: 100 },
  ],
  "star-rating": [
    { label: "≥4★", min: 4 },
    { label: "≥3★", min: 3 },
    { label: "<3★", max: 3 },
  ],
  date: [
    { label: "Today",         from: "today" },
    { label: "Last 7 days",   from: "-7d" },
    { label: "Last 30 days",  from: "-30d" },
    { label: "This year",     from: "start-of-year" },
  ],
  "date-format": [
    { label: "Today",         from: "today" },
    { label: "Last 7 days",   from: "-7d" },
    { label: "Last 30 days",  from: "-30d" },
    { label: "This year",     from: "start-of-year" },
  ],
}

export function resolvePresets(field: FieldConfig): FieldPreset[] {
  if (field.presets) return field.presets
  return DEFAULT_PRESETS[field.type ?? ""] ?? []
}
