"use client";

import { useEffect, useRef } from "react";
import { useWatch } from "react-hook-form";
import type { FilterFieldDescriptor } from "../../../utils/dataViews/types";
import { useDataViewsFilters } from "../context";
import { sameFilters, toFilterState } from "./values";

/**
 * Pushes what the user typed back out as `onValueChange`.
 *
 * Debounced, and guarded by an equality check: without both, `watch` → emit → new `values` →
 * re-render is a loop that swallows keystrokes mid-type.
 */
export function Sync({ fields }: { fields: readonly FilterFieldDescriptor[] }) {
  const { setFilters, filters } = useDataViewsFilters();
  const watched = useWatch();

  // Read the current filters through a ref so the effect does not re-run just because the parent
  // handed back a new (equal) object.
  const latest = useRef(filters);
  latest.current = filters;

  useEffect(() => {
    const timer = setTimeout(() => {
      // Merged onto the current state, not derived from scratch — these controls own only their
      // own paths. Anything else (a `Filters.Custom` value, a key the caller supplied) survives.
      const next = toFilterState(watched as Record<string, unknown>, fields, latest.current);
      if (!sameFilters(next, latest.current)) setFilters(next);
    }, 200);
    return () => clearTimeout(timer);
  }, [watched, fields, setFilters]);

  return null;
}
