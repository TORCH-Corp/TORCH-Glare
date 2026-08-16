"use client";

import { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Filter, Settings } from "lucide-react";
import { DataViews, emptyQuery, queryToParams, type SavedView } from "@/components/DataViews";
import { FormBuilder } from "@/components/FormBuilder";
import type {
  DataViewsQuery,
  FieldConfig,
  Row,
  RowGroup,
  TreeNode,
} from "@/utils/dataViews/types";

// ─── How the rows are painted ─────────────────────────────────────────────────

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

/** The request this page makes. The querying happens in `app/api/orders/route.ts`. */
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

const nodesFromRows = (rows: readonly Order[]): TreeNode[] =>
  rows.map((row) => ({ id: String(row.id), row, depth: 0, children: [] }));

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * The rail: columns, sort and saved views, in tabs that exist because they are rendered.
 *
 * **None of what the rail edits is this page's business.** Column order and visibility, which tab
 * is open, whether the rail is open at all — those change the picture and nothing else, so the
 * component holds them. That is why there are two `useState`s here: the query, and the saved views
 * the app persists.
 *
 * Hiding `Customer` retitles the board's cards and the tree's nodes too: `columns` resolves to the
 * ordered `visibleFields` every view paints from, so it is shared by construction.
 *
 * **Saved views are the exception that proves the rule.** Persisting one is the app's job — it
 * outlives the component — so `onSave` hands over a snapshot to store. Restoring is *not*: hand the
 * snapshot back in `views` and selecting it puts the columns, sort and filters back internally. The
 * blob is opaque here on purpose.
 */
export default function PanelExample() {
  const [query, setQuery] = useState(emptyQuery());
  const [saved, setSaved] = useState<SavedView[]>([]);

  // The tree pane's shape, seeded from storage and written back on every switch. `defaultPaneMode`
  // is read once — the view holds the mode from then on — so this reads the store lazily rather
  // than in an effect, which would seed `"table"` for a frame and then flip.
  const [paneMode] = useState<"table" | "cards">(() =>
    (typeof window !== "undefined" && localStorage.getItem("panel-pane-mode")) === "cards"
      ? "cards"
      : "table",
  );

  const { data, isPending, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["panel-orders", { ...query, page: undefined }],
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
        defaultPanelOpen
        className="h-full"
      >
        <DataViews.Header title="Orders">
          <DataViews.ViewSwitch />
          <DataViews.Search />
          <DataViews.PanelToggle />
        </DataViews.Header>

        <DataViews.Table />
        <DataViews.Board groups={groups} titlePath="customer.name" />
        <DataViews.Tree
          nodes={nodes}
          labelPath="customer.name"
          defaultPaneMode={paneMode}
          onPaneModeChange={(mode) => localStorage.setItem("panel-pane-mode", mode)}
        >
          <DataViews.Tree.Table />
          <DataViews.Tree.Cards />
        </DataViews.Tree>

        <DataViews.Panel>
          <DataViews.Panel.Tab value="config" label="Config." icon={<Settings />}>
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
            <DataViews.Filters title={null} className="border-b-0 p-0">
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

          {/* Not inside a Tab, so it renders under whichever one is open. */}
          <div className="border-border-presentation-global-primary mt-auto border-t pt-2">
            <span className="typography-body-small-regular text-content-presentation-global-secondary">
              Shown on every tab.
            </span>
          </div>
        </DataViews.Panel>
      </DataViews>
    </div>
  );
}
