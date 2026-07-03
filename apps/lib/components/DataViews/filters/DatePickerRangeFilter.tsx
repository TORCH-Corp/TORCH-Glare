"use client"

import { type ChangeEventHandler } from "react"
import { DatePicker } from "../../DatePicker"
import { InputField } from "../../InputField"
import { ActionButton } from "../../ActionButton"
import type { DateRangeFilter } from "../types"
import { toIsoDate } from "../../../utils/dataViews/rangeUtils"

type Props = {
  value: DateRangeFilter | undefined
  onChange: (next: DateRangeFilter) => void
}

/** Parse an ISO `yyyy-MM-dd` string to a local Date (noon-safe, no TZ drift). */
function parseIso(iso?: string): Date | undefined {
  return iso ? new Date(iso + "T00:00:00") : undefined
}

/** One labeled single-date Glare DatePicker bound to one end of the range. */
function DateBound({
  caption,
  iso,
  placeholder,
  onPick,
}: {
  caption: string
  iso?: string
  placeholder: string
  onPick: (next?: string) => void
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="w-9 shrink-0 typography-body-small-regular text-content-presentation-global-secondary">
        {caption}
      </span>
      <div className="flex-1 min-w-0">
        <DatePicker
          mode="single"
          size="S"
          value={parseIso(iso) ?? (undefined as never)}
          dateFormat="yyyy-MM-dd"
          // Single mode reports `{ target: { value: Date } }` (it casts internally).
          onChange={((e: { target: { value: Date | undefined } }) => {
            const d = e?.target?.value
            onPick(d instanceof Date ? toIsoDate(d) : undefined)
          }) as unknown as ChangeEventHandler<HTMLInputElement>}
        >
          <InputField
            readOnly
            value={iso ?? ""}
            placeholder={placeholder}
            childrenSide={
              <ActionButton type="button" size="S" aria-label={`Pick ${caption} date`}>
                <i className="ri-calendar-event-line" />
              </ActionButton>
            }
          />
        </DatePicker>
      </div>
    </label>
  )
}

/**
 * Date-range filter as two separate Glare DatePickers — a "From" and a "To"
 * single-date picker. Each writes only its own bound, preserving the other, so
 * the result is still a `DateRangeFilter` ({ from, to }).
 */
export function DatePickerRangeFilter({ value, onChange }: Props) {
  const setBound = (key: "from" | "to") => (next?: string) =>
    onChange({ kind: "date", from: value?.from, to: value?.to, [key]: next })

  return (
    <div className="space-y-2">
      <DateBound caption="From" iso={value?.from} placeholder="Start date" onPick={setBound("from")} />
      <DateBound caption="To" iso={value?.to} placeholder="End date" onPick={setBound("to")} />
    </div>
  )
}
