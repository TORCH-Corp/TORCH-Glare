---
title: DataViews example — State
description: Controlled versus uncontrolled query.
group: examples
component: DataViews
keywords: [data-views, example, examples, state]
---

# DataViews example — State

Controlled versus uncontrolled query.

Complete and runnable — this is the page itself, not an excerpt. In the monorepo it lives at `apps/app/data-views/state/page.tsx`.

See the [component reference](../index.md) for what each prop does, or the [guide](../guide.md) for the same ground as scenarios.

```tsx
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
  RowGroup,
} from "@/utils/dataViews/types";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Order extends Row {
  id: number;
  customer: { name: string };
  status: "Pending" | "Shipped" | "Delivered";
  priority: "High" | "Medium" | "Low";
  total: number;
  createdAt: string;
}

const FIELDS: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "customer.name", label: "Customer", type: "text" },
  { path: "brand.name", label: "Brand", type: "text" },
  { path: "status", label: "Status", type: "enum-badge", variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" } },
  { path: "priority", label: "Priority", type: "enum-badge", variants: { High: "redOrange", Medium: "purple", Low: "gray" } },
  { path: "total", label: "Total", type: "currency", currency: "USD" },
  { path: "createdAt", label: "Created", type: "date-format", dateFormat: "YYYY-MM-DD" },
];

/** Dynamic sets — in a real app these come from the endpoint that also does the filtering. */
const CUSTOMER_OPTIONS = [
  "Acme Inc.", "Globex Corp.", "Initech", "Umbrella",
  "Hooli", "Stark Industries", "Wayne Enterprises", "Cyberdyne",
].map((v) => ({ label: v, value: v }));

const BRAND_OPTIONS = ["Bosch", "Makita", "DeWalt", "Hilti"].map((v) => ({ label: v, value: v }));

const PRIORITY_OPTIONS = ["High", "Medium", "Low"].map((v) => ({ label: v, value: v }));

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
async function fetchOrders(q: DataViewsQuery): Promise<{ rows: Order[]; total: number }> {
  const params = queryToParams(q);
  const res = await fetch(`/api/orders?${params}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

const groupByStatus = (rows: readonly Order[]): RowGroup[] =>
  (["Pending", "Shipped", "Delivered"] as const).map((status) => ({
    id: status,
    label: status,
    color: ({ Pending: "gray", Shipped: "blue", Delivered: "green" } as const)[status],
    rows: rows.filter((row) => row.status === status),
  }));

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * Every piece of interaction state owned by this page, and the two states that replace the view.
 *
 * Supply all nine pairs and there is no second copy to fall out of step; omit them all and the
 * same component runs uncontrolled. The buttons drive it from the outside, which only works
 * because the props are honoured rather than used as initial values.
 */
export default function StateExample() {
  const [query, setQuery] = useState(emptyQuery());
  // The observers: told what the component decided, not driving it.
  const [seenView, setSeenView] = useState("");
  const [seenSelection, setSeenSelection] = useState<readonly string[]>([]);
  const [saved, setSaved] = useState<SavedView[]>([]);

  const [empty, setEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withViews, setWithViews] = useState(true);


  const { data, isPending, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    // The key *is* the query: touch any part of it and TanStack refetches, and a response that
    // has been superseded is discarded rather than landing on top of a newer one.
    queryKey: ["state-orders", { ...query, page: undefined }],
    queryFn: ({ pageParam }) => fetchOrders({ ...query, page: pageParam }),
    initialPageParam: 1,
    // Undefined means "no more" — which is what the component's `hasMore` resolves to.
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((n, page) => n + page.rows.length, 0);
      return loaded < last.total ? pages.length + 1 : undefined;
    },
  });

  // Memoised because `data?.rows ?? []` is a new array on every render, which would make the
  // `groups` memo below miss every time and hand the board a new array to diff.
  const queried = useMemo(() => data?.pages.flatMap((page) => page.rows) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;
  const rows = empty ? [] : queried;
  // The board reads `groups`, never `rows`, so its columns stay full even when `rows` is emptied
  // — and `Empty` keys off `rows`, which is why it takes over anyway. Keep `rows` populated
  // alongside `groups`/`nodes`.
  const groups = useMemo(() => groupByStatus(queried), [queried]);

  return (
    <div className="flex h-full min-h-0 flex-col p-4">
      <DataViews
        rows={rows}
        fields={FIELDS}
        total={total}
        loading={loading || isPending}
        onLoadMore={fetchNextPage}
        loadingMore={isFetchingNextPage}
        query={query}
        onQueryChange={setQuery}
        onViewChange={setSeenView}
        onSelectionChange={setSeenSelection}
        className="h-full"
      >
        <DataViews.Header title="Orders">
          <DataViews.ViewSwitch />
          <DataViews.Search />
          <DataViews.Actions>
            {/* The query is controlled here, so it can be driven from outside — which is what
                a URL-synced list does. */}
            <Button
              variant="BluColStyle"
              size="M"
              onClick={() => setQuery((q) => ({ ...q, sort: { path: "total", direction: "desc" } }))}
            >
              Sort by total
            </Button>
            <Button
              variant="BluColStyle"
              size="M"
              onClick={() => setQuery((q) => ({ ...q, filters: { status: ["Pending"] }, page: 1 }))}
            >
              Filter to pending
            </Button>
            <Button variant="BluColStyle" size="M" onClick={() => setQuery(emptyQuery())}>
              Clear the query
            </Button>
            <Button variant="BluColStyle" size="M" onClick={() => setEmpty((v) => !v)}>
              {empty ? "Restore rows" : "Empty the rows"}
            </Button>
            <Button variant="BluColStyle" size="M" onClick={() => setLoading((v) => !v)}>
              {loading ? "Stop loading" : "Start loading"}
            </Button>
            <Button variant="BluColStyle" size="M" onClick={() => setWithViews((v) => !v)}>
              {withViews ? "Remove every view" : "Restore the views"}
            </Button>
          </DataViews.Actions>
          <DataViews.PanelToggle />
        </DataViews.Header>

        {/* What the component reported back. Nothing here drives it. */}
        <div
          data-testid="observed"
          className="typography-body-small-regular text-content-presentation-global-secondary border-border-presentation-global-primary border-b px-4 py-2"
        >
          view: {seenView || "—"} · selected: {seenSelection.length}
        </div>

        {withViews && (
          <DataViews.Table selectable />
        )}
        {withViews && (
          <DataViews.Board
            groups={groups}
            titlePath="customer.name"
          />
        )}

        {/* `loading` only swaps in a child you rendered — drop this and the prop does nothing. */}

        <DataViews.Panel>
          <DataViews.Panel.Tab value="config" label="Config." icon={<Settings />}>
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
              {/* One control per section type. Which one a field gets is decided by the data:
                  can the option set grow, and can the user pick more than one. */}
              <FormBuilder.CheckboxGroup name="status" label="Status" options={STATUS_OPTIONS} />
              <FormBuilder.RadioList name="priority" label="Priority" options={PRIORITY_OPTIONS} />
              <FormBuilder.SearchableSelect
                name="customer.name"
                label="Customer"
                options={CUSTOMER_OPTIONS}
              />
              <FormBuilder.MultiSelect name="brand.name" label="Brand" options={BRAND_OPTIONS} />
              <FormBuilder.Slider name="total" label="Total" range min={0} max={15000} step={100} />
              <FormBuilder.DateRange name="createdAt" label="Created" />
            </DataViews.Filters>
          </DataViews.Panel.Tab>
        </DataViews.Panel>
      </DataViews>
    </div>
  );
}
```
