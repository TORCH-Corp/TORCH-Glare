"use client";

import { useEffect, useMemo, useState } from "react";

import { DataViews, type FilterState } from "@/components/DataViews";
import { orders, orderFields, type Order } from "../_data";
import { Callout, ExampleFrame, StateReadout } from "../_shared";

/**
 * Stands in for the endpoint. Deliberately mirrors `matchesFilterValues`
 * semantics — exact string comparison, inclusive numeric bounds — because
 * DataViews still applies its own pass over whatever this returns.
 */
async function fetchOrders(filters: FilterState): Promise<Order[]> {
  await new Promise((r) => setTimeout(r, 250));

  const status = Array.isArray(filters.status) ? filters.status : [];
  const total = filters.total && !Array.isArray(filters.total) ? filters.total : null;

  return orders.filter((o) => {
    if (status.length > 0 && !status.includes(o.status)) return false;
    if (total && total.kind === "number") {
      if (total.min != null && o.total < total.min) return false;
      if (total.max != null && o.total > total.max) return false;
    }
    return true;
  });
}

export default function ServerFiltersPage() {
  const [filterState, setFilterState] = useState<FilterState>({});
  const [rows, setRows] = useState<Order[]>(orders);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchOrders(filterState).then((result) => {
      if (cancelled) return;
      setRows(result);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [filterState]);

  const query = useMemo(() => toQueryString(filterState), [filterState]);

  return (
    <ExampleFrame
      title="Server filtering"
      description={
        <>
          Take ownership of the filters with <code>filterState</code> + <code>onFilterChange</code>,
          refetch, and hand back a narrowed <code>data</code>. Note what this does <em>not</em> do:
          DataViews still filters in memory afterwards.
        </>
      }
      padded
    >
      <div className="flex h-full min-h-0 gap-4">
        <div className="min-h-0 flex-1">
          <DataViews.Root
            data={rows}
            fields={orderFields}
            filterState={filterState}
            onFilterChange={setFilterState}
            className="h-full"
          >
            <DataViews.Header title={loading ? "Orders — loading…" : "Orders"}>
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
            <strong>Try it.</strong> Filter by status or total in the config rail. Each change
            triggers a 250&nbsp;ms fake request; the header shows the loading state and the query
            below is what you would send.
          </Callout>

          <Callout tone="warn">
            <strong>
              Controlling <code>filterState</code> does not switch filtering off.
            </strong>{" "}
            It changes who owns the state, not where the work happens — the rows this endpoint
            returns are still narrowed by <code>matchesFilterValues</code> before any view sees
            them.
            <br />
            <br />
            So the two predicates have to agree. This mock deliberately mirrors DataViews&apos;
            exact-match semantics. A real endpoint doing case-insensitive matching, full-text
            search, or returning a projection without the filtered column would have its correct
            rows silently dropped by the second pass. To filter purely on the server, keep the
            filters out of <code>filterState</code> and pass pre-filtered <code>data</code>.
          </Callout>

          <StateReadout label="filterState (from DataViews)" value={filterState} />

          <div className="flex flex-col gap-1">
            <span className="typography-body-small-medium text-content-presentation-global-tertiary">
              Request
            </span>
            <pre className="overflow-auto rounded-[8px] border border-border-presentation-global-primary bg-background-presentation-form-field-primary p-2 text-xs text-content-presentation-global-primary">
              GET /api/orders{query}
            </pre>
          </div>

          <Callout>
            {rows.length} of {orders.length} records returned.
          </Callout>
        </aside>
      </div>
    </ExampleFrame>
  );
}

function toQueryString(filters: FilterState): string {
  const params = new URLSearchParams();
  for (const [path, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      if (value.length > 0) params.set(path, value.join(","));
    } else if (value.kind === "number") {
      if (value.min != null) params.set(`${path}_min`, String(value.min));
      if (value.max != null) params.set(`${path}_max`, String(value.max));
    } else if (value.kind === "date") {
      if (value.from) params.set(`${path}_from`, value.from);
      if (value.to) params.set(`${path}_to`, value.to);
    }
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}
