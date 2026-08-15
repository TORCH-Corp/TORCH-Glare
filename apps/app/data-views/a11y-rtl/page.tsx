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
  TreeNode,
} from "@/utils/dataViews/types";
import type { Themes } from "@/utils/types";

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

/** Arabic labels, so a right-to-left layout is legible rather than mirrored English. */
const ARABIC_FIELDS: FieldConfig[] = [
  { path: "id", label: "رقم الطلب", type: "number" },
  { path: "customer.name", label: "العميل", type: "text" },
  { path: "status", label: "الحالة", type: "enum-badge", variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" } },
  { path: "total", label: "المجموع", type: "currency", currency: "USD" },
  { path: "createdAt", label: "التاريخ", type: "date-format", dateFormat: "YYYY-MM-DD" },
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
 * Keyboard: tab through it with the mouse down. A row with `onRowClick` takes a `tabIndex`, a
 * button role and Enter/Space handling — press Enter on one and it selects. Without the handler a
 * row stays a plain row and is skipped, which is right: a row that does nothing is not a tab stop.
 *
 * The tree handles `←`/`→` and Enter but not yet `↑`/`↓`, `Home`/`End` or roving tabindex, so
 * every node is its own tab stop. Drag-and-drop has no keyboard equivalent at all — if moving
 * records matters, give people a menu action that emits the same intent.
 *
 * Direction comes from the DOM, not a prop: the component is built from logical properties, so
 * `dir="rtl"` moves the rail left and aligns the table to the start edge. `theme` sets
 * `data-theme` — but the filter dropdowns and the date calendar portal to `document.body`, so
 * they follow the *page's* theme rather than this one.
 */
export default function AccessibilityExample() {
  const [rtl, setRtl] = useState(false);
  const [theme, setTheme] = useState<Themes>("default");

  const [query, setQuery] = useState(emptyQuery());
  const [activated, setActivated] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedView[]>([]);


  const { data, isPending, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    // The key *is* the query: touch any part of it and TanStack refetches, and a response that
    // has been superseded is discarded rather than landing on top of a newer one.
    queryKey: ["a11y-orders", { ...query, page: undefined }],
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
    <div dir={rtl ? "rtl" : "ltr"} className="flex h-full min-h-0 flex-col p-4">
      <DataViews
        key={rtl ? "rtl" : "ltr"}
        rows={rows}
        fields={rtl ? ARABIC_FIELDS : FIELDS}
        theme={theme}
        total={total}
        loading={isPending}
        onLoadMore={fetchNextPage}
        loadingMore={isFetchingNextPage}
        onQueryChange={setQuery}
        className="h-full"
      >
        <DataViews.Header title={rtl ? "الطلبات" : "Orders"}>
          <DataViews.ViewSwitch />
          <DataViews.Search />
          <DataViews.Actions>
            {/* Proof the keyboard path works: Enter on a focused row fires `onRowClick`. */}
            <span
              data-testid="activated"
              className="typography-body-small-regular text-content-presentation-global-secondary"
            >
              {activated ? `row ${activated}` : "no row activated"}
            </span>
            {/* Two buttons rather than one toggle: a single button labelled with the current
                direction is ambiguous — it reads as either the state or the action. */}
            <Button size="S" variant={!rtl ? "BluSecStyle" : "BorderStyle"} onClick={() => setRtl(false)}>
              LTR
            </Button>
            <Button size="S" variant={rtl ? "BluSecStyle" : "BorderStyle"} onClick={() => setRtl(true)}>
              RTL
            </Button>
            {(["default", "dark", "light"] as const).map((t) => (
              <Button
                key={t}
                size="S"
                variant={theme === t ? "BluSecStyle" : "BorderStyle"}
                onClick={() => setTheme(t)}
              >
                {t}
              </Button>
            ))}
          </DataViews.Actions>
          <DataViews.PanelToggle />
        </DataViews.Header>

        {/* Enter on a focused row fires `onRowClick` — the visible proof the row is reachable
            without a mouse. What to do about it is the app's call; here it is a readout. */}
        <DataViews.Table selectable onRowClick={(_row, id) => setActivated(id)} />
        <DataViews.Board
          groups={groups}
          titlePath="customer.name"
        />
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
                this library uses. Filters reads each child's name, label and bounds to learn
                what it is; there is no second description of the form. */}
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
