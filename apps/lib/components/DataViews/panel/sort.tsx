"use client";

import { formatPathLabel } from "../../../utils/dataViews/path";
import { useDataViewsData, useDataViewsView } from "../context";
import { RadioGroup } from "./controls";
import { Section } from "./section";
import type { PanelSortProps } from "../types";

/**
 * `DataViews.Panel.Sort` — the same intent the table headers emit, reachable from views that have
 * no headers. Picking an option calls `onValueChange`; nothing is reordered here.
 */
export function Sort({ title = "Default Sort", className }: PanelSortProps) {
  const { fields } = useDataViewsData();
  const { sort, setSort } = useDataViewsView();
  const sortable = fields.filter((f) => f.type !== "hidden");

  return (
    <Section title={title} className={className}>
      {sortable.length === 0 ? (
        <p className="text-content-presentation-global-tertiary text-xs">No sortable columns.</p>
      ) : (
        <RadioGroup
          value={sort?.path ?? ""}
          onValueChange={(path) =>
            // Re-picking the active field flips the direction, as clicking a header twice does.
            setSort(
              sort?.path === path && sort.direction === "asc"
                ? { path, direction: "desc" }
                : { path, direction: "asc" },
            )
          }
          items={sortable.map((field) => ({
            value: field.path,
            label: field.label ?? formatPathLabel(field.path),
          }))}
        />
      )}
    </Section>
  );
}
