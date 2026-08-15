"use client";

import { cn } from "../../../utils/cn";
import { formatPathLabel } from "../../../utils/dataViews/path";
import type { FilterValue } from "../../../utils/dataViews/types";
import { useDataViewsFilters, useDataViewsView } from "../context";

/**
 * `DataViews.Filters.Summary` — the active filters as removable chips. Useful when the controls
 * themselves live in the panel and you still want the current query visible above the rows.
 *
 * Its labels come from the same descriptors `Filters` reads off its children — the **root** collects
 * those as well, so this works wherever it is rendered, including as `Filters`' sibling. A path no
 * control covers falls back to a label derived from the path.
 */
export function Summary({ className }: { className?: string }) {
  const { filters, setFilters, filterFields } = useDataViewsFilters();
  const { search, setSearch } = useDataViewsView();
  const entries = Object.entries(filters);

  if (entries.length === 0 && !search) return null;

  const chip = cn(
    "typography-body-small-regular flex items-center gap-1 rounded-[6px] px-2 py-[2px]",
    "bg-background-presentation-action-selected text-content-presentation-global-primary",
  );

  const describe = (path: string, value: FilterValue) => {
    const label = filterFields.find((f) => f.path === path)?.label ?? formatPathLabel(path);
    if (Array.isArray(value)) return `${label}: ${value.join(", ")}`;
    if (value.kind === "number") return `${label}: ${value.min ?? "…"}–${value.max ?? "…"}`;
    return `${label}: ${value.from ?? "…"} → ${value.to ?? "…"}`;
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* The search term narrows the result set exactly as a filter does, so it belongs in the
          summary of what is currently narrowing it — and it has to be clearable from here too. */}
      {search && (
        <span className={chip}>
          {`Search: ${search}`}
          <button type="button" aria-label="Clear search" onClick={() => setSearch("")}>
            <i className="ri-close-line text-[12px]" />
          </button>
        </span>
      )}
      {entries.map(([path, value]) => (
        <span key={path} className={chip}>
          {describe(path, value)}
          <button
            type="button"
            aria-label={`Remove ${path} filter`}
            onClick={() => {
              const copy = { ...filters };
              delete copy[path];
              setFilters(copy);
            }}
          >
            <i className="ri-close-line text-[12px]" />
          </button>
        </span>
      ))}
    </div>
  );
}
