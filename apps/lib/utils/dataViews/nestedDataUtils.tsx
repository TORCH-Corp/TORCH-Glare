import type { ReactElement } from "react"
import { Badge } from "../../components/Badge"
import { Divider } from "../../components/Divider"
import { cn } from "../cn"
import type { DynamicRecord, DynamicColumnConfig } from "../../components/DataViews/types"

export type NestedFieldMetadata = {
  key: string
  label: string
  type: 'object' | 'array' | 'primitive'
  valueType?: 'string' | 'number' | 'boolean' | 'date'
  isArrayOfObjects?: boolean
  depth: number
}

export function isPlainObject(value: any): boolean {
  return value !== null &&
         typeof value === 'object' &&
         !Array.isArray(value) &&
         !(value instanceof Date) &&
         Object.keys(value).length > 0
}

export function formatFieldName(fieldName: string): string {
  if (fieldName.includes("_")) {
    return fieldName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

export function analyzeNestedFields(
  item: DynamicRecord,
  visibleColumnIds: Set<string> = new Set(),
  excludeKeys: string[] = ['id', 'isRead', 'isStarred', 'hasAttachment', 'priority']
): NestedFieldMetadata[] {
  const nestedFields: NestedFieldMetadata[] = []

  Object.entries(item).forEach(([key, value]) => {
    if (visibleColumnIds.has(key) || excludeKeys.includes(key)) {
      return
    }

    if (isPlainObject(value)) {
      nestedFields.push({
        key,
        label: formatFieldName(key),
        type: 'object',
        depth: 0
      })
    } else if (Array.isArray(value) && value.length > 0) {
      nestedFields.push({
        key,
        label: formatFieldName(key),
        type: 'array',
        isArrayOfObjects: isPlainObject(value[0]),
        depth: 0
      })
    }
  })

  return nestedFields
}

export function isCurrencyField(key: string): boolean {
  const lowerKey = key.toLowerCase()
  return lowerKey.includes('salary') ||
         lowerKey.includes('price') ||
         lowerKey.includes('cost') ||
         lowerKey.includes('amount') ||
         lowerKey.includes('pay') ||
         lowerKey.includes('fee')
}

export function isRatingField(key: string): boolean {
  const lowerKey = key.toLowerCase()
  return lowerKey.includes('rating') ||
         lowerKey.includes('score')
}

export function renderPrimitiveValue(
  key: string,
  value: any,
  options: {
    showLabel?: boolean
    labelClassName?: string
    valueClassName?: string
  } = {}
): ReactElement | null {
  const {
    showLabel = true,
    labelClassName = "text-content-presentation-global-tertiary",
    valueClassName = "text-content-presentation-global-primary"
  } = options

  if (value == null) return null

  const label = showLabel ? formatFieldName(key) : null

  if (typeof value === 'boolean') {
    return (
      <div className="flex items-center gap-2">
        {label && <span className={labelClassName}>{label}:</span>}
        <Badge
          color={value ? "green" : "gray"}
          badgeStyle={value ? "solid" : "subtle"}
          label={value ? "Yes" : "No"}
          size="XS"
         
        />
      </div>
    )
  }

  if (typeof value === 'number') {
    const isCurrency = isCurrencyField(key)
    const isRating = isRatingField(key)

    if (isRating && value <= 5) {
      return (
        <div className="flex items-center gap-2">
          {label && <span className={labelClassName}>{label}:</span>}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(value) ? 'text-yellow-500' : 'text-gray-300'}>
                  ⭐
                </span>
              ))}
            </div>
            <span className="font-semibold text-sm">{value}</span>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        {label && <span className={labelClassName}>{label}:</span>}
        <span className={cn(
          valueClassName,
          isCurrency && "font-semibold text-green-600"
        )}>
          {isCurrency ? `$${value.toLocaleString()}` : value.toLocaleString()}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {label && <span className={labelClassName}>{label}:</span>}
      <span className={valueClassName}>{String(value)}</span>
    </div>
  )
}

export function renderArrayValue(
  key: string,
  value: any[],
  options: {
    showLabel?: boolean
    maxItems?: number
    renderItem?: (item: any, index: number) => ReactElement
  } = {}
): ReactElement | null {
  const { showLabel = true, maxItems, renderItem } = options

  if (!Array.isArray(value) || value.length === 0) return null

  const label = showLabel ? formatFieldName(key) : null
  const displayItems = maxItems ? value.slice(0, maxItems) : value

  if (isPlainObject(value[0])) {
    return (
      <div className="space-y-2">
        {label && (
          <div className="text-xs font-semibold text-content-presentation-global-primary uppercase tracking-wide">
            {label} ({value.length})
          </div>
        )}
        <div className="space-y-2">
          {displayItems.map((item: any, idx: number) => {
            if (renderItem) {
              return renderItem(item, idx)
            }
            return (
              <div key={idx} className="p-2 rounded bg-background-presentation-form-field-primary">
                {renderNestedObject(item, 1)}
              </div>
            )
          })}
          {maxItems && value.length > maxItems && (
            <div className="text-xs text-content-presentation-global-tertiary">
              +{value.length - maxItems} more
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2">
      {label && <span className="text-content-presentation-global-tertiary">{label}:</span>}
      <div className="flex flex-wrap gap-1">
        {displayItems.map((item: any, idx: number) => (
          <Badge key={idx} color="blue" badgeStyle="solid" label={String(item)} size="XS" />
        ))}
        {maxItems && value.length > maxItems && (
          <Badge color="gray" badgeStyle="subtle" label={`+${value.length - maxItems}`} size="XS" />
        )}
      </div>
    </div>
  )
}

export function renderNestedObject(
  obj: any,
  depth: number = 0,
  options: {
    maxDepth?: number
    showSeparators?: boolean
  } = {}
): ReactElement {
  const { maxDepth = 3 } = options

  if (depth >= maxDepth) {
    return <div className="text-xs text-content-presentation-global-tertiary">...</div>
  }

  return (
    <div className="space-y-2 text-sm">
      {Object.entries(obj).map(([key, value]) => {
        if (isPlainObject(value)) {
          return (
            <div key={key} className="space-y-1">
              <div className="text-xs font-semibold text-content-presentation-global-primary uppercase tracking-wide">
                {formatFieldName(key)}
              </div>
              <div className="pl-3 border-l-2 border-border-presentation-global-primary">
                {renderNestedObject(value, depth + 1, options)}
              </div>
            </div>
          )
        }

        if (Array.isArray(value)) {
          return <div key={key}>{renderArrayValue(key, value)}</div>
        }

        return <div key={key}>{renderPrimitiveValue(key, value)}</div>
      })}
    </div>
  )
}

export function renderDetailView(
  selectedItem: DynamicRecord,
  visibleColumns: DynamicColumnConfig[],
  renderCellValue: (value: any, column: DynamicColumnConfig, row: DynamicRecord) => React.ReactNode
): ReactElement {
  const visibleColumnIds = new Set(visibleColumns.map(col => col.id))
  const nestedFields = analyzeNestedFields(selectedItem, visibleColumnIds)

  return (
    <div className="space-y-6">
      {visibleColumns.slice(2).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleColumns.slice(2).map((col) => {
            const value = selectedItem[col.id]
            if (value == null && value !== 0 && value !== false) return null
            return (
              <div key={col.id} className="space-y-1">
                <dt className="text-xs font-medium text-content-presentation-global-tertiary uppercase tracking-wide">
                  {col.label}
                </dt>
                <dd className="text-sm text-content-presentation-global-primary">
                  {renderCellValue(value, col, selectedItem)}
                </dd>
              </div>
            )
          })}
        </div>
      )}

      {nestedFields.map((field, index) => {
        const value = selectedItem[field.key]

        if (field.type === 'object' && isPlainObject(value)) {
          return (
            <div key={field.key}>
              {index > 0 && <Divider />}
              <div>
                <h3 className="text-sm font-semibold text-content-presentation-global-primary mb-3">
                  {field.label}
                </h3>
                {renderNestedObject(value)}
              </div>
            </div>
          )
        }

        if (field.type === 'array' && Array.isArray(value)) {
          return (
            <div key={field.key}>
              {index > 0 && <Divider />}
              <div>
                <h3 className="text-sm font-semibold text-content-presentation-global-primary mb-3">
                  {field.label}
                </h3>
                {renderArrayValue(field.key, value, { showLabel: false })}
              </div>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

export function getDataStructureSummary(data: DynamicRecord[]): {
  totalFields: number
  nestedFields: string[]
  arrayFields: string[]
  primitiveFields: string[]
} {
  if (!data || data.length === 0) {
    return { totalFields: 0, nestedFields: [], arrayFields: [], primitiveFields: [] }
  }

  const allKeys = new Set<string>()
  const nestedKeys = new Set<string>()
  const arrayKeys = new Set<string>()
  const primitiveKeys = new Set<string>()

  data.forEach(item => {
    Object.entries(item).forEach(([key, value]) => {
      allKeys.add(key)
      if (isPlainObject(value)) {
        nestedKeys.add(key)
      } else if (Array.isArray(value)) {
        arrayKeys.add(key)
      } else {
        primitiveKeys.add(key)
      }
    })
  })

  return {
    totalFields: allKeys.size,
    nestedFields: Array.from(nestedKeys),
    arrayFields: Array.from(arrayKeys),
    primitiveFields: Array.from(primitiveKeys)
  }
}
