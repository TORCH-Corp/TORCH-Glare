"use client"

import { useState } from "react"
import { DayPicker, type DateRange } from "react-day-picker"
import "react-day-picker/style.css"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Calendar, X } from "lucide-react"
import { cn } from "../../../utils/cn"
import type { DateRangeFilter, FieldConfig } from "../types"
import { toIsoDate } from "../../../utils/dataViews/rangeUtils"
import { PresetChips } from "./PresetChips"

type Props = {
  value: DateRangeFilter | undefined
  onChange: (next: DateRangeFilter) => void
  presets: FieldConfig["presets"]
}

export function DateRangePopover({ value, onChange, presets }: Props) {
  const [open, setOpen] = useState(false)

  const range: DateRange | undefined =
    value && (value.from || value.to)
      ? {
          from: value.from ? new Date(value.from + "T00:00:00") : undefined,
          to:   value.to   ? new Date(value.to   + "T00:00:00") : undefined,
        }
      : undefined

  const label =
    value?.from && value?.to ? `${value.from} → ${value.to}`
    : value?.from           ? `from ${value.from}`
    : value?.to             ? `until ${value.to}`
    : "Any date"

  const handleSelect = (next: DateRange | undefined) => {
    onChange({
      kind: "date",
      from: next?.from ? toIsoDate(next.from) : undefined,
      to:   next?.to   ? toIsoDate(next.to)   : undefined,
    })
  }

  const isActive = !!(value?.from || value?.to)

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 w-full text-xs px-2.5 py-2 rounded-md border bg-background-presentation-body-primary text-left",
            isActive
              ? "border-content-presentation-action-primary text-content-presentation-global-primary"
              : "border-border-presentation-global-primary text-content-presentation-global-secondary hover:text-content-presentation-global-primary",
          )}
        >
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1 truncate">{label}</span>
          {isActive && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear date filter"
              onClick={(e) => {
                e.stopPropagation()
                onChange({ kind: "date" })
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation()
                  e.preventDefault()
                  onChange({ kind: "date" })
                }
              }}
              className="text-content-presentation-global-tertiary hover:text-content-presentation-global-primary cursor-pointer"
            >
              <X className="w-3 h-3" />
            </span>
          )}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-50 bg-background-presentation-body-primary border border-border-presentation-global-primary rounded-lg shadow-lg p-3 space-y-3"
        >
          {presets && presets.length > 0 && (
            <PresetChips presets={presets} current={value} onSelect={onChange as any} />
          )}
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={1}
            showOutsideDays
            className="rdp-glare"
          />
          <div className="flex justify-end pt-1 border-t border-border-presentation-global-primary">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs px-3 py-1 rounded-md bg-content-presentation-action-primary text-white hover:opacity-90"
            >
              Done
            </button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
