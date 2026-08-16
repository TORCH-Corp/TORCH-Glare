"use client";

import { useMemo, useState } from "react";
import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Filter, Settings } from "lucide-react";
import { Button } from "@/components/Button";
import { DataViews, emptyQuery, queryToParams, type SavedView } from "@/components/DataViews";
import { FormBuilder } from "@/components/FormBuilder";
import type {
  DataViewsQuery,
  FieldConfig,
  Row,
  RowGroup,
  TreeNode,
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

/** The other half of `onRowMove`: the board emits intent, this is what persists it. */
async function moveOrder(body: { id?: number; status?: string; reset?: boolean }) {
  const res = await fetch("/api/orders", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

const groupByStatus = (rows: readonly Order[]): RowGroup[] =>
  (["Pending", "Shipped", "Delivered", "Cancelled"] as const).map((status) => ({
    id: status,
    label: status,
    color: ({ Pending: "gray", Shipped: "blue", Delivered: "green", Cancelled: "red" } as const)[status],
    rows: rows.filter((row) => row.status === status),
  }));

/** Every node is a real row here, so the detail pane fills whichever one you select. */
const nodesFromRows = (rows: readonly Order[]): TreeNode[] => {
  const [first, ...rest] = rows;
  if (!first) return [];
  return [
    {
      id: String(first.id),
      row: first,
      depth: 0,
      children: rest.slice(0, 4).map((row) => ({ id: String(row.id), row, depth: 1, children: [] })),
    },
    ...rest.slice(4).map((row) => ({ id: String(row.id), row, depth: 0, children: [] })),
  ];
};

// ─── Page ─────────────────────────────────────────────────────────────────────

/** Every part at once: four views, the rail, filters, an empty state and a drag round-trip. */
export default function OverviewExample() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState(emptyQuery());
  const [saved, setSaved] = useState<SavedView[]>([]);



  const { data, isPending, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    // The key *is* the query: touch any part of it and TanStack refetches, and a response that
    // has been superseded is discarded rather than landing on top of a newer one.
    queryKey: ["overview-orders", { ...query, page: undefined }],
    queryFn: ({ pageParam }) => fetchOrders({ ...query, page: pageParam }),
    initialPageParam: 1,
    // Undefined means "no more" — which is what the component's `hasMore` resolves to.
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((n, page) => n + page.rows.length, 0);
      return loaded < last.total ? pages.length + 1 : undefined;
    },
  });

  // Memoised because `data?.rows ?? []` is a new array on every render, which would make the
  // `groups`/`nodes` memos below miss every time and hand the board a new array to diff.
  const rows = useMemo(() => data?.pages.flatMap((page) => page.rows) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;
  const groups = useMemo(() => groupByStatus(rows), [rows]);
  const nodes = useMemo(() => nodesFromRows(rows), [rows]);

  // Dropping a card emits intent; this is what persists it. The card settles where it landed
  // only once the refetched rows agree.
  const move = useMutation({
    mutationFn: moveOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["overview-orders"] }),
  });

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
            <Button variant="BluColStyle" size="M">New order</Button>
            <Button variant="BluColStyle" size="M" onClick={() => move.mutate({ reset: true })}>
              Reset
            </Button>
          </DataViews.Actions>
          <DataViews.PanelToggle />
        </DataViews.Header>

        <DataViews.Table selectable />
        <DataViews.Board
          groups={groups}
          titlePath="customer.name"
          // A drop outside any column has nowhere to go, so there is nothing to persist.
          onRowMove={(intent) => {
            if (intent.to) move.mutate({ id: Number(intent.id), status: intent.to });
          }}
        />
        <DataViews.Inbox
          titlePath="customer.name"
          datePath="createdAt"
        >
          <DataViews.Detail />
        </DataViews.Inbox>
        <DataViews.Tree
          nodes={nodes}
          labelPath="customer.name"
        >
          <DataViews.Detail />
        </DataViews.Tree>

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
