"use client";

import { useMemo } from "react";
import { cn } from "../../../utils/cn";
import { Button } from "../../Button";
import { FormBuilder } from "../../FormBuilder";
import { CellContext } from "../../FormBuilder/context";
import { FiltersContext, useDataViewsFilters } from "../context";
import { collectFilterFields, renderFields } from "./children";
import { Custom } from "./custom";
import { Presets } from "./presets";
import { Summary } from "./summary";
import { Sync } from "./sync";
import { toFormValues } from "./values";
import type { FiltersProps } from "../types";

/**
 * `DataViews.Filters` — the filter controls, written as a form.
 *
 * Three things to be clear about.
 *
 * **It does not filter.** It collects what the user asked for and calls `onValueChange`. Going and
 * fetching the matching rows is your job, almost certainly server-side. The rows on screen change
 * when you hand back different `rows` — never before.
 *
 * **The children are FormBuilder fields.** Not a config array describing fields — the fields
 * themselves, one JSX child each, exactly as any other form in this library is written. They
 * render through `CellContext` in `"bare"` mode: no `FieldSection` label row, no table borders,
 * errors as tooltips.
 *
 * **What each child means comes from the field, not from you.** `FormBuilder` stamps every field
 * with a `FieldKind` — see `fieldKindOf` — so a `MultiSelect` becomes a list of values, a `Slider`
 * a numeric range, a `DateRange` a date range. Nothing is inferred from the rows.
 *
 * ```tsx
 * <DataViews.Filters value={filters} onValueChange={setFilters}>
 *   <FormBuilder.MultiSelect name="status" label="Status" options={STATUS} />
 *   <FormBuilder.Slider name="total" label="Total" range min={0} max={15000} step={100} />
 *   <DataViews.Filters.Presets for="total" items={[{ label: "Under $500", max: 500 }]} />
 * </DataViews.Filters>
 * ```
 */
function FiltersRoot({ children, title = "Filters", clearLabel = "Clear", className }: FiltersProps) {
  const { filters, setFilters } = useDataViewsFilters();

  const fields = useMemo(() => collectFilterFields(children), [children]);

  const value = useMemo(
    () => ({ filters, setFilters, filterFields: fields }),
    [filters, setFilters, fields],
  );

  const values = useMemo(() => toFormValues(filters, fields), [filters, fields]);
  const active = Object.keys(filters).length > 0;

  return (
    <FiltersContext.Provider value={value}>
      <div
        className={cn(
          "flex shrink-0 flex-col gap-3 px-4 py-3",
          "border-border-presentation-global-primary border-b",
          className,
        )}
      >
        {(title || active) && (
          <div className="flex items-center gap-2">
            {title && (
              // The rail's section-header treatment. Reading the colour from a token rather than
              // a literal `text-white` is what lets the same controls sit in the dark panel and
              // in the light content area without a second variant.
              <h3 className="text-content-presentation-global-primary text-[18px] font-[510] leading-[1.32] tracking-[-0.01em]">
                {title}
              </h3>
            )}
            {active && (
              <Button size="S" variant="BorderStyle" className="ms-auto" onClick={() => setFilters({})}>
                {clearLabel}
              </Button>
            )}
          </div>
        )}

        {/* `onSubmit` is required by FormBuilder but never reached — there is no submit button and
            no Enter target. Filters emit as you touch them. */}
        {/* `layout="bare"` because this form is embedded, not a page: FormBuilder's default
            centres the fields at 1100px behind 48px gutters, which in a 260px rail leaves the
            controls less room than their own minimum width and overflows them. */}
        <FormBuilder
          onSubmit={() => {}}
          values={values}
          fieldDirection="vertical"
          layout="bare"
        >
          <Sync fields={fields} />
          <CellContext.Provider value="bare">
            <div className="flex flex-wrap items-start gap-3">{renderFields(children)}</div>
          </CellContext.Provider>
        </FormBuilder>
      </div>
    </FiltersContext.Provider>
  );
}


/**
 * The filter surface, assembled in one place. `Presets` and `Custom` are ours because FormBuilder
 * has no field for them; everything else you write is a FormBuilder field.
 */
export const Filters = Object.assign(FiltersRoot, {
  Presets,
  Custom,
  Summary,
});
