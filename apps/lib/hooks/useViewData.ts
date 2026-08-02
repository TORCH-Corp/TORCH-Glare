"use client";

import { useMemo } from "react";
import { useDataViews } from "../components/DataViews/context";
import type { DynamicRecord, FieldConfig } from "../components/DataViews/types";
import { getByPath, matchesFilterValues } from "../utils/dataViews/pathUtils";
import { visibleFields } from "../utils/dataViews/fieldUtils";

export type UseViewDataOptions = {
  /**
   * `"flat"` (default) gets the tree-flattened records every list-shaped view
   * wants. `"tree"` gets the source records with their hierarchy intact — only
   * `DataViews.Tree` needs that, and it does its own `pruneTree` filtering, so
   * it also passes `filter: false`.
   */
  source?: "flat" | "tree";
  /** Apply the active filter state. Default `true`. */
  filter?: boolean;
  /** Apply `config.sortBy` / `config.sortOrder`. Default `false` — only the
   *  table exposes sortable headers. */
  sort?: boolean;
};

export type ViewData = {
  /** Filtered (and optionally sorted) records for this view. Read-only: it is
   *  a projection of the Root's state, not a copy you may edit. */
  records: readonly DynamicRecord[];
  /** Visible fields in display order — the columns/rows a view should render. */
  displayFields: FieldConfig[];
  /** Dot-path used as the record-identity fallback, for `getRecordId`. */
  idPath: string | undefined;
};

function compareValues(a: unknown, b: unknown, modifier: number): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "string" && typeof b === "string") return a.localeCompare(b) * modifier;
  if (typeof a === "number" && typeof b === "number") return (a - b) * modifier;
  return String(a).localeCompare(String(b)) * modifier;
}

/**
 * The filter → sort → visible-fields pipeline, in one place.
 *
 * Every view used to re-implement this (plus its own internal filter-state
 * fallback). They now all read the same filter state from the Root, so a filter
 * set in the config rail narrows whichever view happens to be showing.
 */
export function useViewData({
  source = "flat",
  filter = true,
  sort = false,
}: UseViewDataOptions = {}): ViewData {
  const { items, flatItems, fields, filterState, config } = useDataViews();

  const data = source === "tree" ? items : flatItems;

  const displayFields = useMemo(
    () => visibleFields(fields).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [fields],
  );

  const sortPath = sort ? config.sortBy || null : null;
  const sortOrder = config.sortOrder ?? "asc";

  const records = useMemo<readonly DynamicRecord[]>(() => {
    let out: readonly DynamicRecord[] = data;

    if (filter) {
      const active = Object.entries(filterState);
      if (active.length > 0) {
        out = out.filter((item) =>
          active.every(([path, value]) => matchesFilterValues(item, path, value)),
        );
      }
    }

    if (sortPath) {
      const modifier = sortOrder === "asc" ? 1 : -1;
      out = [...out].sort((a, b) =>
        compareValues(getByPath(a, sortPath), getByPath(b, sortPath), modifier),
      );
    }

    return out;
  }, [data, filter, filterState, sortPath, sortOrder]);

  return { records, displayFields, idPath: displayFields[0]?.path };
}
