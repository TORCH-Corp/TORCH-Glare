import type { DynamicColumnConfig, DynamicRecord } from "../../components/DataViews/types"
import { isPlainObject } from "./nestedDataUtils"

export function detectColumns(data: DynamicRecord[]): DynamicColumnConfig[] {
  if (!data || data.length === 0) {
    return []
  }

  const allKeys = new Set<string>()
  data.forEach((item) => {
    Object.keys(item).forEach((key) => allKeys.add(key))
  })

  const columns: DynamicColumnConfig[] = []
  let order = 0

  allKeys.forEach((key) => {
    if (key.startsWith("_")) return

    const firstValue = data.find((item) => item[key] != null)?.[key]

    if (isPlainObject(firstValue)) return
    if (Array.isArray(firstValue) && firstValue.length > 0 && isPlainObject(firstValue[0])) return

    const type = inferColumnType(key, firstValue)

    columns.push({
      id: key,
      label: formatLabel(key),
      visible: true,
      order: order++,
      type,
    })
  })

  return columns.sort((a, b) => {
    if (a.id === "id") return -1
    if (b.id === "id") return 1
    return a.label.localeCompare(b.label)
  }).map((col, idx) => ({ ...col, order: idx }))
}

function inferColumnType(
  key: string,
  value: any
): "text" | "number" | "date" | "badge" | "array" | "boolean" {
  if (key.toLowerCase().includes("date") || key.toLowerCase().includes("time")) {
    return "date"
  }
  if (key.toLowerCase().includes("status") || key.toLowerCase().includes("priority")) {
    return "badge"
  }
  if (key.toLowerCase().includes("tag") || key.toLowerCase().includes("label")) {
    return "array"
  }

  if (value === null || value === undefined) {
    return "text"
  }

  if (typeof value === "boolean") {
    return "boolean"
  }

  if (typeof value === "number") {
    return "number"
  }

  if (Array.isArray(value)) {
    return "array"
  }

  if (typeof value === "string") {
    if (!isNaN(Date.parse(value)) && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return "date"
    }
    return "text"
  }

  return "text"
}

function formatLabel(key: string): string {
  if (key.includes("_")) {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

export function mergeColumns(
  detected: DynamicColumnConfig[],
  custom?: Partial<DynamicColumnConfig>[]
): DynamicColumnConfig[] {
  if (!custom || custom.length === 0) {
    return detected
  }

  const merged = [...detected]
  const customMap = new Map(custom.map((col) => [col.id, col]))

  merged.forEach((col, idx) => {
    const customCol = customMap.get(col.id)
    if (customCol) {
      merged[idx] = { ...col, ...customCol }
      customMap.delete(col.id)
    }
  })

  customMap.forEach((customCol) => {
    if (customCol.id) {
      merged.push({
        id: customCol.id,
        label: customCol.label || formatLabel(customCol.id),
        visible: customCol.visible ?? true,
        order: customCol.order ?? merged.length,
        type: customCol.type || "text",
        render: customCol.render,
      })
    }
  })

  return merged.sort((a, b) => a.order - b.order)
}
