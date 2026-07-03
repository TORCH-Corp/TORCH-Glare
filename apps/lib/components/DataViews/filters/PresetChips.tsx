"use client"

import { cn } from "../../../utils/cn"
import type { FieldPreset, FilterValue } from "../types"
import { isPresetActive, presetToFilterValue } from "../../../utils/dataViews/rangeUtils"

type PresetChipsProps = {
  presets: FieldPreset[]
  current: FilterValue | undefined
  onSelect: (value: FilterValue) => void
}

export function PresetChips({ presets, current, onSelect }: PresetChipsProps) {
  if (!presets || presets.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {presets.map((p) => {
        const active = isPresetActive(p, current)
        return (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              if (active) {
                const v = presetToFilterValue(p)
                onSelect(v.kind === "number" ? { kind: "number" } : { kind: "date" })
              } else {
                onSelect(presetToFilterValue(p))
              }
            }}
            className={cn(
              "text-xs px-2 py-1 rounded-md border transition-colors whitespace-nowrap",
              active
                ? "bg-content-presentation-action-primary text-white border-content-presentation-action-primary"
                : "bg-background-presentation-form-field-primary border-border-presentation-global-primary text-content-presentation-global-secondary hover:text-content-presentation-global-primary",
            )}
          >
            {p.label}
          </button>
        )
      })}
    </div>
  )
}
