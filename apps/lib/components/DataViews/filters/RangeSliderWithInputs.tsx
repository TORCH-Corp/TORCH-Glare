"use client"

import { useEffect, useMemo, useState } from "react"
import * as Slider from "@radix-ui/react-slider"
import { cn } from "../../../utils/cn"
import type { FieldConfig, NumericRangeFilter } from "../types"
import type { NumericExtremes } from "../../../utils/dataViews/rangeUtils"

type Props = {
  field: FieldConfig
  extremes: NumericExtremes
  step: number
  value: NumericRangeFilter | undefined
  onChange: (next: NumericRangeFilter) => void
}

export function RangeSliderWithInputs({ field, extremes, step, value, onChange }: Props) {
  const min = field.rangeMin ?? extremes.min
  const max = field.rangeMax ?? extremes.max

  const lo = value?.min ?? min
  const hi = value?.max ?? max

  const [loInput, setLoInput] = useState(formatForInput(lo, field))
  const [hiInput, setHiInput] = useState(formatForInput(hi, field))

  useEffect(() => { setLoInput(formatForInput(lo, field)) }, [lo, field])
  useEffect(() => { setHiInput(formatForInput(hi, field)) }, [hi, field])

  const commit = (rawLo: number, rawHi: number) => {
    let nlo = clamp(rawLo, min, max)
    let nhi = clamp(rawHi, min, max)
    if (nlo > nhi) [nlo, nhi] = [nhi, nlo]
    const atFloor = nlo === min
    const atCeil  = nhi === max
    onChange({
      kind: "number",
      min: atFloor ? undefined : nlo,
      max: atCeil  ? undefined : nhi,
    })
  }

  const handleSliderChange = (vals: number[]) => {
    if (vals.length !== 2) return
    commit(vals[0], vals[1])
  }

  const commitFromInputs = () => {
    const nlo = parseFloat(loInput)
    const nhi = parseFloat(hiInput)
    commit(Number.isFinite(nlo) ? nlo : lo, Number.isFinite(nhi) ? nhi : hi)
  }

  const prefix = useMemo(() => prefixFor(field), [field])
  const suffix = useMemo(() => suffixFor(field), [field])

  return (
    <div className="space-y-3">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        min={min}
        max={max}
        step={step}
        value={[lo, hi]}
        onValueChange={handleSliderChange}
        minStepsBetweenThumbs={0}
      >
        <Slider.Track className="bg-background-presentation-form-field-primary relative grow rounded-full h-1">
          <Slider.Range className="absolute bg-content-presentation-action-primary rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          aria-label="Minimum"
          className="block w-4 h-4 bg-white border-2 border-content-presentation-action-primary rounded-full shadow hover:bg-background-presentation-body-overlay-primary focus:outline-none focus:ring-2 focus:ring-content-presentation-action-primary"
        />
        <Slider.Thumb
          aria-label="Maximum"
          className="block w-4 h-4 bg-white border-2 border-content-presentation-action-primary rounded-full shadow hover:bg-background-presentation-body-overlay-primary focus:outline-none focus:ring-2 focus:ring-content-presentation-action-primary"
        />
      </Slider.Root>

      <div className="flex items-center gap-2">
        <NumberCell
          label="Min"
          value={loInput}
          onChange={setLoInput}
          onCommit={commitFromInputs}
          prefix={prefix}
          suffix={suffix}
        />
        <span className="text-xs text-content-presentation-global-tertiary">–</span>
        <NumberCell
          label="Max"
          value={hiInput}
          onChange={setHiInput}
          onCommit={commitFromInputs}
          prefix={prefix}
          suffix={suffix}
        />
      </div>
    </div>
  )
}

function NumberCell({
  label, value, onChange, onCommit, prefix, suffix,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onCommit: () => void
  prefix?: string
  suffix?: string
}) {
  return (
    <label className="flex-1 flex items-center gap-1 text-xs bg-background-presentation-body-primary border border-border-presentation-global-primary rounded-md px-2 py-1.5 focus-within:border-content-presentation-action-primary">
      <span className="sr-only">{label}</span>
      {prefix && <span className="text-content-presentation-global-tertiary">{prefix}</span>}
      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onCommit}
        onKeyDown={(e) => { if (e.key === "Enter") (e.currentTarget as HTMLInputElement).blur() }}
        className={cn(
          "w-full bg-transparent outline-none tabular-nums text-content-presentation-global-primary",
        )}
      />
      {suffix && <span className="text-content-presentation-global-tertiary">{suffix}</span>}
    </label>
  )
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function formatForInput(n: number, field: FieldConfig): string {
  if (!Number.isFinite(n)) return ""
  if (field.type === "star-rating") return n.toFixed(1)
  if (Number.isInteger(n)) return String(n)
  return String(n)
}

function prefixFor(field: FieldConfig): string | undefined {
  if (field.type !== "currency") return undefined
  if (typeof field.currency === "string") return "$"
  return field.currency?.symbol ?? "$"
}

function suffixFor(field: FieldConfig): string | undefined {
  if (field.type === "progress-bar") return "%"
  if (field.type === "star-rating") return "★"
  return undefined
}
