---
title: DataViews example — Scale
description: Virtualization and scroll loading at size.
group: examples
component: DataViews
keywords: [data-views, example, examples, scale]
---

# DataViews example — Scale

Virtualization and scroll loading at size.

Complete and runnable — this is the page itself, not an excerpt. In the monorepo it lives at `apps/app/data-views/scale/page.tsx`.

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
} from "@/utils/dataViews/types";

// ─── How the two datasets are painted ─────────────────────────────────────────

/**
 * The rows themselves are generated and paged by `app/api/scale/route.ts`. What stays here is how
 * to paint them — that is presentation, and it is the same whether one row comes back or a
 * thousand.
 */
const ROW_FIELDS: FieldConfig[] = [
  { path: "reference", label: "Reference", type: "text" },
  { path: "customer", label: "Customer", type: "text" },
  { path: "status", label: "Status", type: "enum-badge", variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" } },
  { path: "priority", label: "Priority", type: "enum-badge", variants: { High: "redOrange", Medium: "purple", Low: "gray" } },
  { path: "total", label: "Total", type: "currency", currency: "USD" },
  { path: "items", label: "Items", type: "number" },
  { path: "progress", label: "Progress", type: "progress-bar", max: 100, thresholds: [30, 80] },
  { path: "createdAt", label: "Created", type: "date-format", dateFormat: "YYYY-MM-DD" },
];

/** Forty columns, generated — hand-writing them guarantees one ends up subtly different. */
const WIDE_FIELDS: FieldConfig[] = Array.from({ length: 40 }, (_, i) => ({
  path: `col${i}`,
  label: i % 5 === 0 ? `Column ${i} with a deliberately long header label` : `Column ${i}`,
  type: "text" as const,
}));

/** Generated data, so the option sets are the generator's own vocabulary. */
const PRIORITY_OPTIONS = ["High", "Medium", "Low"].map((v) => ({ label: v, value: v }));
const CUSTOMER_OPTIONS = ["Acme", "Globex", "Initech", "Umbrella", "Hooli", "Soylent", "Stark", "Wayne", "Cyberdyne"]
  .flatMap((c) => ["Inc.", "Ltd", "SA", "GmbH", "BV"].map((sfx) => `${c} ${sfx}`))
  .map((v) => ({ label: v, value: v }));

const STATUS_OPTIONS = [
  { label: "Pending", value: "Pending" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
];

// ─── The request ──────────────────────────────────────────────────────────────

/**
 * The request this page makes. Generating, filtering, sorting and paging all happen in
 * `app/api/scale/route.ts`.
 *
 * This is the case where the two large-dataset answers both show up. Rows arrive a page at a time
 * as you scroll — `useInfiniteQuery` accumulates them and the component only ever paints what it
 * was handed — and once enough have accumulated the table virtualises, so the DOM holds a window
 * of rows rather than all of them.
 */
async function fetchScale(q: DataViewsQuery & {
  shape: "rows" | "wide";
  count: number;
}): Promise<{ rows: Row[]; total: number }> {
  const params = queryToParams(q);
  params.set("shape", q.shape);
  params.set("count", String(q.count));
  const res = await fetch(`/api/scale?${params}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * This example starts bigger than the default ten, and a hundred at a time is enough that a few
 * scrolls carry it past the table's virtualization threshold — which is the thing this page is
 * here to exercise. The same object seeds the page's state and the component's, because two
 * literals saying "100" is precisely how they come to disagree.
 */
const INITIAL_QUERY = emptyQuery({ pageSize: 100 });

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * The two axes that hurt.
 *
 * **Rows.** There is no virtualisation: every row handed in is rendered. With the endpoint paging,
 * that is fifty at a time no matter how large the table gets — which is what the component was
 * built for. Set the page size to 500 and you can feel the difference the paging was making.
 *
 * **Columns.** Forty of them scroll inside the view rather than growing the page, cells do not
 * truncate, and the rail's column list carries all forty. Paging does nothing for this axis.
 */
export default function ScaleExample() {
  const [kase, setCase] = useState<"rows" | "columns">("rows");
  const [count, setCount] = useState(1000);
  const [narrow, setNarrow] = useState(false);

  const [query, setQuery] = useState(INITIAL_QUERY);
  const [saved, setSaved] = useState<SavedView[]>([]);

  const wideCase = kase === "columns";
  const shape = wideCase ? "wide" : "rows";

  const { data, isPending, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    // `shape` and `count` are part of the question, so switching case or size refetches rather
    // than handing back a cached answer to a different one. `page` is deliberately *not* in the
    // key — it is what `pageParam` drives, and keying on it would throw the accumulation away on
    // every load.
    queryKey: ["scale", { ...query, page: undefined, shape, count }],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchScale({ ...query, page: pageParam, shape, count }),
    // Undefined means "no more", which is what `hasMore` on the component resolves to.
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((n, page) => n + page.rows.length, 0);
      return loaded < last.total ? pages.length + 1 : undefined;
    },
  });

  // The component is handed every row loaded so far, in order. Accumulating is the app's job —
  // DataViews paints what it is given and asks for more when the user reaches the end.
  const rows = useMemo(() => data?.pages.flatMap((page) => page.rows) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;

  return (
    <div className="flex h-full min-h-0 flex-col p-4">
      <div className={narrow && wideCase ? "flex min-h-0 w-[320px] flex-1" : "flex min-h-0 flex-1"}>
        <DataViews
          // Remounting per case keeps columns and filters from leaking between datasets.
          key={kase}
          rows={rows}
          fields={wideCase ? WIDE_FIELDS : ROW_FIELDS}
          total={total}
          loading={isPending}
          onLoadMore={fetchNextPage}
          loadingMore={isFetchingNextPage}
          onQueryChange={setQuery}
          defaultQuery={INITIAL_QUERY}
          className="h-full"
        >
          <DataViews.Header title={wideCase ? "Wide" : `${total.toLocaleString("en-US")} rows`}>
            <DataViews.ViewSwitch />
            <DataViews.Search />
            <DataViews.Actions>
              <Button variant="BluColStyle" size="M" onClick={() => setCase("rows")}>
                1,000 rows
              </Button>
              <Button variant="BluColStyle" size="M" onClick={() => setCase("columns")}>
                40 columns
              </Button>
              {!wideCase &&
                [100, 1000].map((n) => (
                  <Button variant="BluColStyle"
                    size="M"
                    key={n}
                    onClick={() => setCount(n)}
                  >
                    {n.toLocaleString("en-US")}
                  </Button>
                ))}
              {wideCase && (
                <Button variant="BluColStyle" size="M" onClick={() => setNarrow((v) => !v)}>
                  {narrow ? "Full width" : "Squeeze"}
                </Button>
              )}
            </DataViews.Actions>
            <DataViews.PanelToggle />
          </DataViews.Header>

          <DataViews.Table />

          {/* `total` is the filtered count from the endpoint — the component holds fifty rows and
              could not work out that there are 1,000. */}

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
              {/* The two cases offer different columns, so they offer different filters. */}
              <DataViews.Filters
                title={null}
                className="border-b-0 p-0"
              >
              {/* The same section types, over this page's own fields. There is no second dynamic
                  categorical here, so the searchable single-select has nothing to bind to. */}
              <FormBuilder.CheckboxGroup name="status" label="Status" options={STATUS_OPTIONS} />
              <FormBuilder.RadioList name="priority" label="Priority" options={PRIORITY_OPTIONS} />
              <FormBuilder.MultiSelect name="customer" label="Customer" options={CUSTOMER_OPTIONS} />
              <FormBuilder.Slider name="total" label="Total" range min={0} max={25000} step={500} />
              <FormBuilder.DateRange name="createdAt" label="Created" />
              </DataViews.Filters>
            </DataViews.Panel.Tab>
          </DataViews.Panel>
        </DataViews>
      </div>
    </div>
  );
}
```
