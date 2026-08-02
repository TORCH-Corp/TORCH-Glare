"use client";

import { useState } from "react";

import { DataViews, type FieldConfig, type FilterState } from "@/components/DataViews";
import { orders } from "../_data";
import { Callout, ExampleFrame, StateReadout } from "../_shared";

/**
 * One dataset, one field per filter kind.
 *
 * A field becomes filterable when `filterable: true`, when its type is
 * inherently categorical (`enum-badge`, `boolean`, `badge-array`, `icon-text`),
 * or when it is plain text with ≤10 distinct values. Numeric and date fields
 * always need the explicit opt-in.
 */
const fields: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "customer", label: "Customer", type: "text", filterable: false },

  // Multi-select checkboxes — the default for a categorical field.
  {
    path: "status",
    label: "Status",
    type: "enum-badge",
    variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" },
    filterable: true,
  },

  // Single-select radios: exactly one value at a time.
  {
    path: "priority",
    label: "Priority",
    type: "enum-badge",
    variants: { High: "redOrange", Medium: "purple", Low: "gray" },
    filterable: true,
    filterMode: "single",
  },

  // A searchable dropdown, for fields with more options than fit a list.
  // Inherently single-select, so `filterMode` is not accepted alongside it.
  {
    path: "region",
    label: "Region",
    type: "text",
    filterable: true,
    filterVariant: "searchable-select",
  },

  // Numeric range: slider + min/max inputs + quick-preset chips.
  {
    path: "total",
    label: "Total",
    type: "currency",
    currency: "USD",
    filterable: true,
    rangeMin: 0,
    rangeMax: 13000,
    rangeStep: 20,
    presets: [
      { label: "Under $500", max: 500 },
      { label: "$500–$3k", min: 500, max: 3000 },
      { label: "Over $3k", min: 3000 },
    ],
  },

  // Date range: a from→to span picked on the calendar.
  {
    path: "createdAt",
    label: "Created",
    type: "date-format",
    dateFormat: "YYYY-MM-DD",
    filterable: true,
  },

  { path: "isStarred", type: "hidden" },
  { path: "hasAttachment", type: "hidden" },
];

export default function FiltersPage() {
  const [filterState, setFilterState] = useState<FilterState>({});

  return (
    <ExampleFrame
      title="Filter kinds"
      description={
        <>
          Every filter control on one dataset. They live in the config rail&apos;s{" "}
          <strong>Filters</strong> tab and narrow whichever view is active.
        </>
      }
      padded
    >
      <div className="flex h-full min-h-0 gap-4">
        <div className="min-h-0 flex-1">
          <DataViews.Root
            data={orders}
            fields={fields}
            filterState={filterState}
            onFilterChange={setFilterState}
            className="h-full"
          >
            <DataViews.Header title="Orders">
              <DataViews.ViewSwitch />
              <DataViews.Spacer />
              <DataViews.ConfigTrigger />
            </DataViews.Header>

            <DataViews.Table />
            <DataViews.Kanban groupBy="status" />

            <DataViews.ConfigPanel />
          </DataViews.Root>
        </div>

        <aside className="flex w-80 shrink-0 flex-col gap-3 overflow-auto">
          <Callout>
            <strong>Try it.</strong> Open <em>Filter &amp; Config.</em> → <em>Filters</em>. Status
            is multi-select checkboxes, Priority is single-select radios, Region is a searchable
            dropdown, Total is a slider with preset chips, Created is a date range.
          </Callout>

          <Callout>
            <code>Customer</code> is marked <code>filterable: false</code> — without it, the
            ≤10-distinct-values heuristic would have offered it as a checkbox list.
          </Callout>

          <StateReadout label="filterState" value={filterState} />
        </aside>
      </div>
    </ExampleFrame>
  );
}
