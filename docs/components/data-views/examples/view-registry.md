---
title: DataViews example — View registry
description: A view of your own via `markView`, beside the built-in four.
group: examples
component: DataViews
keywords: [data-views, example, examples, view, registry]
---

# DataViews example — View registry

A view of your own via `markView`, beside the built-in four.

Complete and runnable — this is the page itself, not an excerpt. In the monorepo it lives at `apps/app/data-views/view-registry/page.tsx`.

See the [component reference](../index.md) for what each prop does, or the [guide](../guide.md) for the same ground as scenarios.

```tsx
"use client";

import { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Filter, Settings } from "lucide-react";
import { Button } from "@/components/Button";
import {
  Cell,
  DataViews,
  emptyQuery,
  markView,
  queryToParams,
  SkeletonBar,
  skeletonKeys,
  useDataViewsData,
  type SavedView,
} from "@/components/DataViews";
import { FormBuilder } from "@/components/FormBuilder";
import { cn } from "@/utils/cn";
import type {
  ViewBaseProps,
} from "@/components/DataViews";
import type {
  DataViewsQuery,
  FieldConfig,
  Row,
  RowGroup,
  TreeNode,
} from "@/utils/dataViews/types";

/**
 * A view the library does not ship — a gallery of cards — registered with `markView`.
 *
 * It is here to prove two things a custom view needs and could otherwise only be told about:
 * `useDataViewsData()` hands it the same `rows`/`visibleFields` the built-ins get, **and the same
 * `loading` flag**, so it can paint a skeleton in its own shape using the exported pieces rather
 * than inventing a second loading look.
 */
const GalleryView = markView(
  function GalleryView({ className }: ViewBaseProps) {
    const { rows, visibleFields, getRowId, loading } = useDataViewsData();
    const [title, ...rest] = visibleFields;

    return (
      <div
        className={cn(
          "bg-background-presentation-body-primary grid h-full content-start gap-3 overflow-y-auto p-3",
          "grid-cols-[repeat(auto-fill,minmax(220px,1fr))]",
          className,
        )}
      >
        {loading
          ? skeletonKeys(8).map((i) => (
              <div
                key={`skeleton-${i}`}
                className="border-border-presentation-global-primary bg-background-presentation-form-base flex flex-col gap-2 rounded-[12px] border p-3"
              >
                <SkeletonBar className="h-[18px] w-[70%]" />
                <SkeletonBar className="w-[45%]" />
              </div>
            ))
          : rows.map((row, index) => (
              <div
                key={getRowId(row, index)}
                className="border-border-presentation-global-primary bg-background-presentation-form-base flex flex-col gap-2 rounded-[12px] border p-3"
              >
                <span className="typography-body-large-semibold text-content-presentation-global-primary">
                  {title && <Cell field={title} row={row} />}
                </span>
                {rest.slice(0, 2).map((field, i) => (
                  <span key={`${field.path}-${i}`} className="typography-body-small-regular">
                    <Cell field={field} row={row} />
                  </span>
                ))}
              </div>
            ))}
      </div>
    );
  },
  { defaultId: "gallery", defaultLabel: "Gallery" },
);

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Order extends Row {
  id: number;
  customer: { name: string };
  status: "Pending" | "Shipped" | "Delivered";
  priority: "High" | "Medium" | "Low";
  total: number;
}

const FIELDS: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "customer.name", label: "Customer", type: "text" },
  { path: "brand.name", label: "Brand", type: "text" },
  { path: "status", label: "Status", type: "enum-badge", variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" } },
  { path: "priority", label: "Priority", type: "enum-badge", variants: { High: "redOrange", Medium: "purple", Low: "gray" } },
  { path: "total", label: "Total", type: "currency", currency: "USD" },
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

const byStatus = (rows: readonly Order[]): RowGroup[] =>
  (["Pending", "Shipped", "Delivered"] as const).map((status) => ({
    id: status,
    label: status,
    color: ({ Pending: "gray", Shipped: "blue", Delivered: "green" } as const)[status],
    rows: rows.filter((row) => row.status === status),
  }));

const byPriority = (rows: readonly Order[]): RowGroup[] =>
  (["High", "Medium", "Low"] as const).map((priority) => ({
    id: priority,
    label: priority,
    color: ({ High: "red", Medium: "purple", Low: "gray" } as const)[priority],
    rows: rows.filter((row) => row.priority === priority),
  }));

const nodesFromRows = (rows: readonly Order[]): TreeNode[] =>
  rows.map((row) => ({ id: String(row.id), row, depth: 0, children: [] }));

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * A view exists because you rendered it — the switcher is built from the views in the tree, so
 * there is no visibility map to keep in step and no way for the two to disagree.
 *
 * Each view defaults its own id and label, which is why the two boards below **must** carry
 * explicit `id`s: without them both would answer to `"board"` and the second would be
 * unreachable. Revoking the one you are looking at converges on the first registered view and
 * reports it through `onViewChange`, in an effect rather than during render.
 */
export default function ViewRegistryExample() {
  const [query, setQuery] = useState(emptyQuery());
  const [saved, setSaved] = useState<SavedView[]>([]);


  const [onlyOne, setOnlyOne] = useState(false);
  const [swapIcon, setSwapIcon] = useState(false);
  const [canSeeBoard, setCanSeeBoard] = useState(true);

  const { data, isPending, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    // The key *is* the query: touch any part of it and TanStack refetches, and a response that
    // has been superseded is discarded rather than landing on top of a newer one.
    queryKey: ["registry-orders", { ...query, page: undefined }],
    queryFn: ({ pageParam }) => fetchOrders({ ...query, page: pageParam }),
    initialPageParam: 1,
    // Undefined means "no more" — which is what the component's `hasMore` resolves to.
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((n, page) => n + page.rows.length, 0);
      return loaded < last.total ? pages.length + 1 : undefined;
    },
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
            <Button variant="BluColStyle" size="M" onClick={() => setOnlyOne((v) => !v)}>
              {onlyOne ? "All views" : "Only the table"}
            </Button>
            <Button variant="BluColStyle" size="M" onClick={() => setSwapIcon((v) => !v)}>
              Swap icons
            </Button>
            <Button variant="BluColStyle"
              size="M"
              onClick={() => setCanSeeBoard((v) => !v)}
            >
              {canSeeBoard ? "Revoke the board" : "Grant the board"}
            </Button>
          </DataViews.Actions>
          <DataViews.PanelToggle />
        </DataViews.Header>

        <DataViews.Table
          icon={<i className={swapIcon ? "ri-list-check" : "ri-table-line"} />}
        />

        {/* `{flag && <View/>}` is how a view disappears behind a permission check:
            `Children.toArray` drops the `false`, and the view unregisters. */}
        {!onlyOne && canSeeBoard && (
          <DataViews.Board
            id="board-status"
            label="By status"
            icon={<i className={swapIcon ? "ri-flag-line" : "ri-kanban-view"} />}
            groups={byStatus(rows)}
            titlePath="customer.name"
          />
        )}
        {!onlyOne && (
          <DataViews.Board
            id="board-priority"
            label="By priority"
            icon={<i className={swapIcon ? "ri-fire-line" : "ri-alarm-warning-line"} />}
            groups={byPriority(rows)}
            titlePath="customer.name"
          />
        )}
        {!onlyOne && (
          <DataViews.Tree nodes={nodesFromRows(rows)} labelPath="customer.name">
            <DataViews.Tree.Table />
            <DataViews.Tree.Cards />
          </DataViews.Tree>
        )}
        {/* Not one of the four — a view of this page's own, registered by `markView` and reading
            the same context, loading state included. */}
        {!onlyOne && <GalleryView icon={<i className="ri-layout-grid-line" />} />}

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
