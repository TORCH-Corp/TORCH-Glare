"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "../../../utils/cn";
import { Button } from "../../Button";
import { ConclusionHeader } from "../../ConclusionHeader";
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
 * There is no `value`/`onValueChange` here: the filters live in the root's query, and this reads
 * and writes them through `useDataViewsFilters()`. What leaves the component is `onQueryChange`.
 *
 * ```tsx
 * <DataViews.Filters>
 *   <FormBuilder.MultiSelect name="status" label="Status" options={STATUS} />
 *   <FormBuilder.Slider name="total" label="Total" range min={0} max={15000} step={100} />
 *   <DataViews.Filters.Presets for="total" items={[{ label: "Under $500", max: 500 }]} />
 * </DataViews.Filters>
 * ```
 */
function FiltersRoot({
  children,
  title = "Filters",
  description,
  clearLabel = "Clear",
  collapsible = true,
  defaultOpen = true,
  className,
}: FiltersProps) {
  const { filters, setFilters } = useDataViewsFilters();

  const fields = useMemo(() => collectFilterFields(children), [children]);

  const value = useMemo(
    () => ({ filters, setFilters, filterFields: fields }),
    [filters, setFilters, fields],
  );

  const values = useMemo(() => toFormValues(filters, fields), [filters, fields]);
  const active = Object.keys(filters).length > 0;

  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  const isCollapsible = collapsible && title != null;
  const shown = !isCollapsible || open;

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
          // `ConclusionHeader` renders a `<button>`, so Clear cannot live inside it — nesting a
          // button in a button is invalid and swallows the inner click. They are siblings.
          <div className="flex items-center gap-2">
            {title != null &&
              (isCollapsible ? (
                <ConclusionHeader
                  label={title}
                  open={open}
                  onOpenChange={setOpen}
                  aria-controls={bodyId}
                  className="flex-1"
                />
              ) : (
                // Reading the colour from a token rather than a `text-white` literal is what lets
                // the same controls sit in the dark rail and in the light content area.
                <h3 className="text-content-presentation-global-primary text-[18px] font-[510] leading-[1.32] tracking-[-0.01em]">
                  {title}
                </h3>
              ))}
            {active && (
              <Button
                size="S"
                variant="BorderStyle"
                className="ms-auto"
                onClick={() => setFilters({})}
              >
                {clearLabel}
              </Button>
            )}
          </div>
        )}

        {/* Below the header *row*, not inside it — that row is a flex line holding the header and
            Clear as siblings, and the description belongs to the section, not beside the button. */}
        {description != null && (
          <p className="typography-body-small-regular text-content-presentation-global-primary">
            {description}
          </p>
        )}

        {/* `onSubmit` is required by FormBuilder but never reached — there is no submit button and
            no Enter target. Filters emit as you touch them. */}
        <FormBuilder onSubmit={() => {}} values={values} fieldDirection="vertical">
          <Sync fields={fields} />
          <CellContext.Provider value="bare">
            {/* Same fold as `Panel.Section`: a 0fr→1fr grid row, and `inert` so a collapsed
                filter's control leaves the tab order rather than staying focusable. */}
            <div
              id={bodyId}
              inert={!shown}
              aria-hidden={!shown}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
                "motion-reduce:transition-none",
                shown ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="flex flex-wrap items-start gap-3">{renderFields(children)}</div>
              </div>
            </div>
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
