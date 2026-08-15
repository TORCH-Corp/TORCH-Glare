"use client";

import { useFormContext } from "react-hook-form";
import { cn } from "../../../utils/cn";
import type { FilterFieldDescriptor, NumberPreset } from "../../../utils/dataViews/types";
import { useDataViewsFilters } from "../context";
import { datePresets, numberPresets, toName } from "./values";
import type { FilterPresetsProps } from "../types";

/** Look up what `Filters` learned about a path, so a sibling control can target it. */
function useDescriptor(path: string): FilterFieldDescriptor | undefined {
  const { filterFields } = useDataViewsFilters();
  return filterFields.find((f) => f.path === path);
}


/**
 * `DataViews.Filters.Presets` — named shortcuts for the field named in `for`.
 *
 * FormBuilder has no field for this, and it is not a filter of its own: it writes into a sibling's
 * value. Numeric presets fill the side they do not name from that slider's bounds, so
 * `{ label: "$5k+", min: 5000 }` means "5,000 to the top" rather than "5,000 to 100".
 */
export function Presets({ for: path, items, className }: FilterPresetsProps) {
  const form = useFormContext();
  const field = useDescriptor(path);
  const name = toName(path);

  if (!field) return null;

  const shortcuts =
    field.kind === "date"
      ? datePresets(items).map((preset) => ({
          label: preset.label,
          apply: () =>
            form.setValue(name, {
              from: preset.from ? new Date(preset.from) : undefined,
              to: preset.to ? new Date(preset.to) : undefined,
            }),
        }))
      : numberPresets(items).map((preset: NumberPreset) => ({
          label: preset.label,
          apply: () => form.setValue(name, [preset.min ?? field.min ?? 0, preset.max ?? field.max ?? 100]),
        }));

  if (shortcuts.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {shortcuts.map((preset) => (
        <button
          key={preset.label}
          type="button"
          onClick={preset.apply}
          className={cn(
            "typography-body-small-regular rounded-[4px] px-2 py-[2px] transition-colors",
            "text-content-presentation-global-secondary hover:bg-background-presentation-action-hover",
          )}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
