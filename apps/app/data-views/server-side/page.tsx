"use client";

import { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Filter, Settings } from "lucide-react";
import { Button } from "@/components/Button";
import { DataViews, emptyQuery, queryToParams, type SavedView } from "@/components/DataViews";
import { FormBuilder } from "@/components/FormBuilder";
import type {
  DataViewsQuery,
  FieldConfig,
  Row,
} from "@/utils/dataViews/types";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Order extends Row {
  id: number;
  customer: { name: string };
  status: "Pending" | "Shipped" | "Delivered";
  total: number;
  createdAt: string;
}

const FIELDS: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "customer.name", label: "Customer", type: "text" },
  { path: "status", label: "Status", type: "enum-badge", variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" } },
  { path: "total", label: "Total", type: "currency", currency: "USD" },
  { path: "createdAt", label: "Created", type: "date-format", dateFormat: "YYYY-MM-DD" },
];

const STATUS_OPTIONS = [
  { label: "Pending", value: "Pending" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
];

/**
 * The request this page makes. The querying itself happens in `app/api/orders/route.ts` —
 * nothing on this page filters, sorts or pages anything, which is the split DataViews is built
 * around.
 */
async function fetchOrders(q: DataViewsQuery & { fail: boolean }): Promise<{ rows: Order[]; total: number }> {
  const params = queryToParams(q);
  // The endpoint answers 502 for this — the failure is server-side, as it would be.
  if (q.fail) params.set("fail", "1");
  const res = await fetch(`/api/orders?${params}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * The shape the component is built for: filters, search and sort are three callbacks that trigger
 * one query, and nothing on screen changes until the response lands.
 *
 * The query key carries the whole query, so TanStack refetches when any part of it changes and
 * discards a response that has been superseded — the out-of-order problem you would otherwise
 * solve by hand with a request counter.
 *
 * `    keepPreviousData` is what makes it feel right: the previous rows stay while
 * the next query runs, instead of the table emptying on every keystroke. `isPending` is true only
 * for the very first load, which is why the skeletons appear once and not on every refetch.
 *
 * There is no `DataViews.Error` — an error is an ordinary child, rendered above the view so the
 * header and rail stay usable while the request is broken. Filter changes are already debounced
 * ~200ms inside `Filters`; sorting and searching are not, so add your own if the endpoint is
 * expensive.
 */
export default function ServerSideExample() {
  const [query, setQuery] = useState(emptyQuery());
  const [saved, setSaved] = useState<SavedView[]>([]);

  const [failNext, setFailNext] = useState(false);


  const { data, isPending, error, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    // `failNext` belongs in the key: flipping it asks a different question of the endpoint, and
    // without it the cached answer would come straight back unchanged.
    queryKey: ["server-side-orders", { ...query, page: undefined, failNext }],
    queryFn: ({ pageParam }) => fetchOrders({ ...query, page: pageParam, fail: failNext }),
    initialPageParam: 1,
    // Undefined means "no more" — which is what the component's `hasMore` resolves to.
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((n, page) => n + page.rows.length, 0);
      return loaded < last.total ? pages.length + 1 : undefined;
    },
    // A 502 here is the point of the example, not a blip to paper over.
    retry: false,
  });

  const rows = useMemo(() => data?.pages.flatMap((page) => page.rows) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;

  return (
    <div className="flex h-full min-h-0 flex-col p-4">
      <DataViews
        rows={rows}
        fields={FIELDS}
        total={total}
        loading={isPending}
        onLoadMore={fetchNextPage}
        loadingMore={isFetchingNextPage}
        onQueryChange={setQuery}
        className="h-full"
      >
        <DataViews.Header title="Orders">
          <DataViews.ViewSwitch />
          <DataViews.Search />
          <DataViews.Actions>
            <Button
              size="S"
              variant={failNext ? "RedSecStyle" : "BorderStyle"}
              onClick={() => setFailNext((v) => !v)}
            >
              {failNext ? "Stop failing" : "Make it fail"}
            </Button>
          </DataViews.Actions>
          <DataViews.PanelToggle />
        </DataViews.Header>

        {error && (
          <div
            data-testid="error"
            className="typography-body-small-regular border-border-presentation-state-negative bg-background-presentation-state-negative-secondary text-content-presentation-global-primary m-4 flex items-center gap-2 rounded-[8px] border px-3 py-2"
          >
            <i className="ri-error-warning-line" aria-hidden />
            Could not load orders — {error.message}
          </div>
        )}

        <DataViews.Table />

        <DataViews.Panel>
          <DataViews.Panel.Tab value="config" label="Config." icon={<Settings />}>
            {/* Saving is the app's job — a view outlives the component. Restoring is not:
                hand the snapshot back and selecting it puts everything back internally. */}
            {/* Saving is the app's job — a view outlives the component. Restoring is not:
                hand the snapshot back and selecting it puts everything back internally. */}
            <DataViews.Panel.SavedViews
              views={saved}
              onSave={(snapshot) =>
                setSaved((prev) => [
                  ...prev,
                  { id: `view-${prev.length + 1}`, label: `View ${prev.length + 1}`, snapshot },
                ])
              }
            />
            <DataViews.Panel.Columns />
            <DataViews.Panel.Sort />
          </DataViews.Panel.Tab>

          <DataViews.Panel.Tab value="filters" label="Filters" icon={<Filter />}>
            {/* The controls are FormBuilder fields — the same Select and Slider any form in
                this library uses. The <FormBuilder> itself lives inside Filters; you write only
                its fields, and Filters reads each one's name, label and bounds to learn what
                it is. */}
            <DataViews.Filters
              title={null}
              className="border-b-0 p-0"
            >
              <FormBuilder.MultiSelect name="status" label="Status" options={STATUS_OPTIONS} />
              <FormBuilder.Slider name="total" label="Total" range min={0} max={15000} step={100} />
            </DataViews.Filters>
          </DataViews.Panel.Tab>
        </DataViews.Panel>
      </DataViews>
    </div>
  );
}
