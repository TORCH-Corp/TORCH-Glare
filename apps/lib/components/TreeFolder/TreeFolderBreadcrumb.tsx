"use client"

import { ChevronRight } from "lucide-react"
import { cn } from "../../utils/cn"
import type { TreeFolderBreadcrumb as BreadcrumbItems } from "./types"

type Props = {
  items: BreadcrumbItems
  onSelect?: (id: string) => void
  className?: string
  maxItems?: number
}

export function TreeFolderBreadcrumb({
  items,
  onSelect,
  className,
  maxItems = 4,
}: Props) {
  if (items.length === 0) {
    return (
      <div
        className={cn(
          "px-3 py-1.5 text-xs text-content-presentation-global-tertiary truncate",
          className,
        )}
      >
        No selection
      </div>
    )
  }

  const display =
    items.length > maxItems
      ? [items[0], { id: "__ellipsis", name: "…" }, ...items.slice(-(maxItems - 2))]
      : items

  return (
    <nav
      aria-label="Tree path"
      className={cn(
        "px-3 py-1.5 flex items-center gap-1 text-xs text-content-presentation-global-secondary min-w-0",
        className,
      )}
    >
      <ol className="flex items-center gap-1 min-w-0 flex-1">
        {display.map((item, idx) => {
          const isLast = idx === display.length - 1
          const isEllipsis = item.id === "__ellipsis"
          return (
            <li key={`${item.id}-${idx}`} className="flex items-center gap-1 min-w-0">
              {idx > 0 && (
                <ChevronRight className="w-3 h-3 shrink-0 text-content-presentation-global-tertiary" />
              )}
              {isEllipsis ? (
                <span className="text-content-presentation-global-tertiary">…</span>
              ) : isLast ? (
                <span
                  className="truncate text-content-presentation-global-primary font-medium"
                  title={item.name}
                >
                  {item.name}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelect?.(item.id)}
                  className="truncate hover:text-content-presentation-global-primary"
                  title={item.name}
                >
                  {item.name}
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
