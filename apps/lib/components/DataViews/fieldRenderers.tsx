"use client"

import type { ReactNode } from "react"
import { Badge } from "../Badge"
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar"
import { cn } from "../../utils/cn"
import type {
  CurrencyOptions,
  DynamicRecord,
  FieldConfig,
  FieldType,
} from "./types"
import { getByPath } from "../../utils/dataViews/pathUtils"
import { resolveBadgeVariant } from "./badgeAdapter"

type RenderArgs = {
  value: any
  field: FieldConfig
  row: DynamicRecord
}

const NULL_PLACEHOLDER = (
  <span className="text-content-presentation-global-tertiary">-</span>
)

export function renderField(
  value: any,
  field: FieldConfig,
  row: DynamicRecord,
): ReactNode {
  if (field.render) return field.render(value, row)

  const type = field.type ?? "text"
  if (type === "hidden") return null

  if (value == null && type !== "boolean" && type !== "progress-bar") {
    return NULL_PLACEHOLDER
  }

  const renderer = RENDERERS[type] ?? renderText
  return renderer({ value, field, row })
}

function renderText({ value }: RenderArgs): ReactNode {
  return (
    <span className="text-content-presentation-global-primary">{String(value)}</span>
  )
}

function renderNumber({ value }: RenderArgs): ReactNode {
  return (
    <span className="font-mono text-content-presentation-global-primary">
      {typeof value === "number" ? value.toLocaleString() : String(value)}
    </span>
  )
}

function renderDate({ value }: RenderArgs): ReactNode {
  return <span className="text-content-presentation-global-primary">{String(value)}</span>
}

function renderDateFormat({ value, field }: RenderArgs): ReactNode {
  const opts = field.dateFormat
  let formatted = String(value)
  try {
    const d = value instanceof Date ? value : new Date(value)
    if (!isNaN(d.getTime())) {
      if (typeof opts === "object" && opts) {
        formatted = new Intl.DateTimeFormat(undefined, opts).format(d)
      } else if (typeof opts === "string") {
        formatted = formatWithToken(d, opts)
      } else {
        formatted = new Intl.DateTimeFormat(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        }).format(d)
      }
    }
  } catch {
    /* fall through to raw string */
  }
  return <span className="text-content-presentation-global-primary">{formatted}</span>
}

function formatWithToken(d: Date, token: string): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return token
    .replace(/YYYY/g, String(d.getFullYear()))
    .replace(/MM/g, pad(d.getMonth() + 1))
    .replace(/DD/g, pad(d.getDate()))
    .replace(/HH/g, pad(d.getHours()))
    .replace(/mm/g, pad(d.getMinutes()))
    .replace(/ss/g, pad(d.getSeconds()))
}

function renderBoolean({ value, field }: RenderArgs): ReactNode {
  const isTrue = !!value
  const variant = isTrue ? field.trueVariant ?? "green" : field.falseVariant ?? "gray"
  const badgeProps = resolveBadgeVariant(variant)
  return (
    <Badge
      {...badgeProps}
      label={isTrue ? field.trueLabel ?? "Yes" : field.falseLabel ?? "No"}
      size="S"
     
    />
  )
}

function renderEnumBadge({ value, field }: RenderArgs): ReactNode {
  const key = String(value)
  const variant = field.variants?.[key] ?? field.defaultVariant ?? "gray"
  const badgeProps = resolveBadgeVariant(variant)
  // Use medium size so the glare badge dot indicator is clearly visible
  return <Badge {...badgeProps} label={key} size="S" />
}

function renderBadgeArray({ value, field }: RenderArgs): ReactNode {
  const badgeProps = resolveBadgeVariant(field.variant ?? "blue")
  if (!Array.isArray(value)) {
    return <Badge {...badgeProps} label={String(value)} size="XS" />
  }
  const limit = field.limit ?? value.length
  const head = value.slice(0, limit)
  const overflow = value.length - head.length
  const overflowProps = resolveBadgeVariant("gray")
  return (
    <div className="flex flex-wrap gap-1">
      {head.map((v, i) => (
        <Badge
          key={i}
          {...badgeProps}
          label={String(v)}
          size="XS"
         
        />
      ))}
      {overflow > 0 && (
        <Badge {...overflowProps} label={`+${overflow}`} size="XS" />
      )}
    </div>
  )
}

function renderCurrency({ value, field }: RenderArgs): ReactNode {
  const num = Number(value)
  if (Number.isNaN(num)) return renderText({ value, field, row: {} as any })

  const opts: CurrencyOptions =
    typeof field.currency === "string"
      ? { code: field.currency }
      : field.currency ?? {}

  let formatted: string
  if (opts.code) {
    try {
      formatted = new Intl.NumberFormat(opts.locale, {
        style: "currency",
        currency: opts.code,
        minimumFractionDigits: opts.decimals,
        maximumFractionDigits: opts.decimals,
      }).format(num)
    } catch {
      formatted = `${opts.symbol ?? "$"}${num.toLocaleString(opts.locale, {
        minimumFractionDigits: opts.decimals,
        maximumFractionDigits: opts.decimals,
      })}`
    }
  } else {
    formatted = `${opts.symbol ?? "$"}${num.toLocaleString(opts.locale, {
      minimumFractionDigits: opts.decimals,
      maximumFractionDigits: opts.decimals,
    })}`
  }

  return <span className="font-semibold text-green-600">{formatted}</span>
}

function renderNumberFormat({ value, field }: RenderArgs): ReactNode {
  const num = Number(value)
  if (Number.isNaN(num)) return renderText({ value, field, row: {} as any })
  const formatted = new Intl.NumberFormat(undefined, field.format).format(num)
  return <span className="font-mono text-content-presentation-global-primary">{formatted}</span>
}

function renderProgressBar({ value, field }: RenderArgs): ReactNode {
  const raw = Number(value)
  const num = Number.isFinite(raw) ? raw : 0
  const pct = Math.max(0, Math.min(100, num))
  const [warn, ok] = field.thresholds ?? [40, 70]
  const color =
    num >= ok ? "bg-green-500"
    : num >= warn ? "bg-yellow-500"
    : "bg-red-500"

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-2 rounded-full bg-background-presentation-form-field-primary overflow-hidden">
        <div className={cn("h-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium tabular-nums text-content-presentation-global-primary w-10 text-right">
        {Math.round(num)}%
      </span>
    </div>
  )
}

function renderStarRating({ value, field }: RenderArgs): ReactNode {
  const num = Number(value)
  const max = field.max ?? 5
  const filled = Math.max(0, Math.min(max, Math.floor(num)))

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={i < filled ? "text-yellow-500" : "text-gray-300"}
            aria-hidden
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm font-semibold tabular-nums">{Number.isFinite(num) ? num : "-"}</span>
    </div>
  )
}

function renderIconText({ value, field }: RenderArgs): ReactNode {
  const icon = field.icon ?? ""
  const after = field.iconPosition === "after"
  return (
    <span className="inline-flex items-center gap-1.5 text-content-presentation-global-primary">
      {!after && icon && <IconNode icon={icon} />}
      <span>{String(value)}</span>
      {after && icon && <IconNode icon={icon} />}
    </span>
  )
}

function IconNode({ icon }: { icon: string }) {
  if (/^ri-/.test(icon)) return <i className={icon} />
  return <span aria-hidden>{icon}</span>
}

function renderTwoLine({ value, field, row }: RenderArgs): ReactNode {
  const secondary =
    field.secondaryPath != null ? getByPath(row, field.secondaryPath) : null
  return (
    <div className="leading-tight">
      <div className="font-semibold text-content-presentation-global-primary">
        {String(value)}
      </div>
      {secondary != null && (
        <div className="text-xs text-content-presentation-global-secondary">
          {String(secondary)}
        </div>
      )}
    </div>
  )
}

function renderAvatar({ value, field, row }: RenderArgs): ReactNode {
  const src = typeof value === "string" ? value : null
  const fallbackSource =
    field.fallbackPath != null ? getByPath(row, field.fallbackPath) : null
  const initials = toInitials(fallbackSource ?? src ?? "?")

  return (
    <Avatar>
      {src && <AvatarImage src={src} alt={String(initials)} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}

function toInitials(s: string): string {
  if (!s) return "?"
  const parts = String(s).trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?"
}

function renderLink({ value, field }: RenderArgs): ReactNode {
  const v = String(value)
  let href = v
  if (field.linkType === "mailto" && !v.startsWith("mailto:")) href = `mailto:${v}`
  else if (field.linkType === "tel" && !v.startsWith("tel:")) href = `tel:${v}`

  return (
    <a
      href={href}
      target={field.linkType === "url" ? "_blank" : undefined}
      rel={field.linkType === "url" ? "noopener noreferrer" : undefined}
      className="text-blue-600 hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      {v}
    </a>
  )
}

function renderImage({ value }: RenderArgs): ReactNode {
  if (typeof value !== "string" || !value) return NULL_PLACEHOLDER
  return (
    <img
      src={value}
      alt=""
      className="h-10 w-10 rounded object-cover border border-border-presentation-global-primary"
    />
  )
}

const RENDERERS: Record<FieldType, (a: RenderArgs) => ReactNode> = {
  "text": renderText,
  "number": renderNumber,
  "date": renderDate,
  "boolean": renderBoolean,
  "hidden": () => null,
  "enum-badge": renderEnumBadge,
  "badge-array": renderBadgeArray,
  "currency": renderCurrency,
  "number-format": renderNumberFormat,
  "progress-bar": renderProgressBar,
  "star-rating": renderStarRating,
  "icon-text": renderIconText,
  "two-line": renderTwoLine,
  "avatar": renderAvatar,
  "link": renderLink,
  "image": renderImage,
  "date-format": renderDateFormat,
}
