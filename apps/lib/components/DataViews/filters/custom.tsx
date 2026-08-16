"use client";

import { formatPathLabel } from "../../../utils/dataViews/path";
import type { FilterValue } from "../../../utils/dataViews/types";
import { useDataViewsFilters } from "../context";
import { Labelled } from "./labelled";
import type { FilterCustomProps } from "../types";

/**
 * `Filters.Custom` — the escape hatch. Renders whatever you return against this filter's slot in
 * `FilterState`, bypassing the form entirely.
 *
 * Use it when no FormBuilder field produces the value you need — a bucket picker, a map region, a
 * tri-state toggle.
 *
 * ```tsx
 * <DataViews.Filters.Custom path="tags" render={({ value, setValue }) => (
 *   <MyTagPicker value={value as string[]} onChange={setValue} />
 * )} />
 * ```
 */
export function Custom({ path, label, render }: FilterCustomProps) {
  const { filters, setFilters } = useDataViewsFilters();
  const text = label ?? formatPathLabel(path);

  const setValue = (next: FilterValue | undefined) => {
    const copy = { ...filters };
    if (next === undefined) delete copy[path];
    else copy[path] = next;
    setFilters(copy);
  };

  return <Labelled label={text}>{render({ value: filters[path], setValue })}</Labelled>;
}
