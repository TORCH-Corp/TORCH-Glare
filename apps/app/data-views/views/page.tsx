"use client";

import { useMemo, useState } from "react";
import { useMutation, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Filter, Settings } from "lucide-react";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import {
  Cell,
  DataViews,
  emptyQuery,
  queryToParams,
  useActiveRow,
  useDataViewsData,
  useDataViewsView,
  type SavedView,
} from "@/components/DataViews";
import { cn } from "@/utils/cn";
import { FormBuilder } from "@/components/FormBuilder";
import type {
  DataViewsQuery,
  FieldConfig,
  MoveIntent,
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

/** How each field is painted. Nothing here says anything about filtering. */
const FIELDS: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "customer.name", label: "Customer", type: "text" },
  { path: "brand.name", label: "Brand", type: "text" },
  { path: "status", label: "Status", type: "enum-badge", variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" } },
  { path: "priority", label: "Priority", type: "enum-badge", variants: { High: "redOrange", Medium: "purple", Low: "gray" } },
  { path: "total", label: "Total", type: "currency", currency: "USD" },
  { path: "createdAt", label: "Created", type: "date-format", dateFormat: "YYYY-MM-DD" },
];

/** Options and bounds are supplied — DataViews never scans the dataset to find them. */
/** Dynamic sets — in a real app these come from the endpoint that also does the filtering. */
const CUSTOMER_OPTIONS = [
  "Acme Inc.", "Globex Corp.", "Initech", "Umbrella",
  "Hooli", "Stark Industries", "Wayne Enterprises", "Cyberdyne",
].map((v) => ({ label: v, value: v }));

const BRAND_OPTIONS = ["Bosch", "Makita", "DeWalt", "Hilti"].map((v) => ({ label: v, value: v }));

const STATUS_OPTIONS = [
  { label: "Pending", value: "Pending" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
];

const PRIORITY_OPTIONS = [
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
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

/**
 * Board columns. You build these — the board never groups rows itself, because which statuses
 * exist (including the empty one you still want a column for) is knowledge it does not have.
 */
const groupByStatus = (rows: readonly Order[]): RowGroup[] =>
  (["Pending", "Shipped", "Delivered", "Cancelled"] as const).map((status) => ({
    id: status,
    label: status,
    color: ({ Pending: "gray", Shipped: "blue", Delivered: "green", Cancelled: "red" } as const)[status],
    rows: rows.filter((row) => row.status === status),
  }));

/**
 * Tree nodes. The branches are synthetic groupings, so selecting one leaves the detail pane empty
 * — only the leaves are rows that `DataViews.Detail` can resolve.
 */
const STATUSES = ["Pending", "Shipped", "Delivered"];

const nodesByStatus = (rows: readonly Order[]): TreeNode[] =>
  STATUSES.map((status) => ({
    id: `group:${status}`,
    row: { id: `group:${status}`, customer: { name: status } },
    depth: 0,
    children: rows
      .filter((row) => row.status === status)
      .map((row) => ({ id: String(row.id), row, depth: 1, children: [] })),
  }));

/** Five levels, for checking indentation and the expand/collapse chain. */
const deepTree = (rows: readonly Order[]): TreeNode[] => {
  const build = (level: number): TreeNode[] =>
    level >= 5
      ? []
      : [
          {
            id: `level-${level}`,
            row: { ...rows[level % rows.length], id: `level-${level}` },
            depth: level,
            children: build(level + 1),
          },
        ];
  return build(0);
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ViewsExample() {
  const queryClient = useQueryClient();
  // All nine controlled pairs, plus the saved-view list the rail edits.
  const [query, setQuery] = useState(emptyQuery());
  const [opened, setOpened] = useState<string | null>(null);
  /** A hand-made row order, once someone drags one. Empty until then. */
  const [order, setOrder] = useState<string[]>([]);
  const [saved, setSaved] = useState<SavedView[]>([]);

  const [selectable, setSelectable] = useState(true);
  const [applyMoves, setApplyMoves] = useState(true);

  const [deep, setDeep] = useState(false);
  const [expanded, setExpanded] = useState<readonly string[]>(["group:Pending"]);


  const { data, isPending, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    // The key *is* the query: touch any part of it and TanStack refetches, and a response that
    // has been superseded is discarded rather than landing on top of a newer one.
    queryKey: ["views-orders", { ...query, page: undefined }],
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
  const fetched = useMemo(() => data?.pages.flatMap((page) => page.rows) ?? [], [data]);
  // The page owns the order it was given, so applying a drag is the page's job — the table only
  // reported it.
  const rows = useMemo(() => {
    if (!order.length) return fetched;
    const byId = new Map(fetched.map((r) => [String(r.id), r]));
    const ordered = order.map((id) => byId.get(id)).filter(Boolean) as typeof fetched;
    const rest = fetched.filter((r) => !order.includes(String(r.id)));
    return [...ordered, ...rest];
  }, [fetched, order]);
  const total = data?.pages[0]?.total ?? 0;
  const groups = useMemo(() => groupByStatus(rows), [rows]);
  const nodes = useMemo(() => (deep ? deepTree(rows) : nodesByStatus(rows)), [deep, rows]);

  // Dropping emits intent, nothing more. The card relocates only because this sends the new
  // status to the server and refetches — turn `Ignoring moves` on and the intent still fires
  // while the board stays exactly where it was.
  const move = useMutation({
    mutationFn: moveOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["views-orders"] }),
  });

  const onRowMove = (intent: MoveIntent) => {
    // A drop outside any column has nowhere to go, so there is nothing to persist.
    if (!applyMoves || !intent.to) return;
    move.mutate({ id: Number(intent.id), status: intent.to });
  };

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
            <span
              data-testid="activated"
              className="typography-body-small-regular text-content-presentation-global-secondary"
            >
              {opened ? `row ${opened}` : "no row activated"}
            </span>
            <ViewControls
              selectable={selectable}
              setSelectable={setSelectable}
              applyMoves={applyMoves}
              setApplyMoves={setApplyMoves}
              deep={deep}
              setDeep={setDeep}
              setExpanded={setExpanded}
              reset={() => move.mutate({ reset: true })}
            />
          </DataViews.Actions>
          <DataViews.PanelToggle />
        </DataViews.Header>

        {/* `onRowClick` is what makes a row a real tab stop: it takes a tabIndex, a button role
            and Enter handling only when there is something for it to do. */}
        {/* `renderCell` paints one cell *in this view only* — the board's cards and the tree's
            labels still use the field's own painting. Return undefined to fall through. */}
        <DataViews.Table
          selectable={selectable}
          onRowClick={(_row, id) => setOpened(id)}
          // The end-action row exists only because this prop was passed — same rule as every
          // other part of the component.
          onAddRow={() => window.alert("Add New pressed — wire this to your create flow.")}
          // Row order is this page's to keep, so the drag is applied here and nowhere else. A
          // sort and a hand-made order are different orders — clearing the sort is how this page
          // decides which one wins.
          onRowMove={({ id, index }) => {
            if (index === undefined) return;
            setOrder((prev) => {
              const ids = prev.length ? prev : rows.map((r) => String(r.id));
              const from = ids.indexOf(id);
              if (from < 0) return prev;
              const next = ids.slice();
              const [moved] = next.splice(from, 1);
              next.splice(index, 0, moved);
              return next;
            });
            setQuery((q) => ({ ...q, sort: null }));
          }}
          renderCell={({ field, row }) =>
            field.path === "total" ? (
              <span className="flex items-center gap-2">
                <Cell field={field} row={row} />
                {Number(row.total) > 5000 && (
                  <Badge label="large" color="purple" badgeStyle="subtle" showIcon={false} />
                )}
              </span>
            ) : undefined
          }
        />
        {/* `renderCard` replaces the card. The board keeps the wrapper, so dragging still works
            without wiring any of it here. */}
        <DataViews.Board
          groups={groups}
          titlePath="customer.name"
          onRowMove={onRowMove}
          renderCard={({ row, fields, isActive }) => (
            <div
              className={cn(
                "bg-background-presentation-form-base flex flex-col gap-1 rounded-[10px] border p-3",
                isActive
                  ? "border-border-presentation-state-focus"
                  : "border-border-presentation-global-primary",
              )}
            >
              <span className="typography-headers-large-semibold text-content-presentation-global-primary">
                <Cell field={fields[1]} row={row} />
              </span>
              <div className="flex items-center justify-between">
                <Cell field={fields[2]} row={row} />
                <span className="typography-body-small-medium text-content-presentation-global-secondary">
                  <Cell field={fields[4]} row={row} />
                </span>
              </div>
            </div>
          )}
        />
        {/* `renderItem` fills the list row; the row keeps its own hover, selected and link
            behaviour. */}
        <DataViews.Inbox
          titlePath="customer.name"
          datePath="createdAt"
          renderItem={({ row, fields, isActive }) => (
            <div className="flex items-center justify-between gap-2">
              <span className="typography-body-large-medium text-content-presentation-global-primary">
                <Cell field={fields[1]} row={row} />
              </span>
              <span className="flex items-center gap-2">
                <Cell field={fields[2]} row={row} />
                {isActive && <i className="ri-arrow-right-line" aria-hidden />}
              </span>
            </div>
          )}
        >
          {/* The children *are* the pane. `DataViews.Detail` is only a sensible default —
              here it is replaced with content of our own. */}
          <OrderDetail />
        </DataViews.Inbox>
        {/* `TreeFolder` owns the row, so `renderNode` returns the pieces it can vary: the name,
            an icon before it, and meta after it. Anything richer belongs in the pane. */}
        <DataViews.Tree
          nodes={nodes}
          labelPath="customer.name"
          expanded={expanded}
          onExpandedChange={setExpanded}
          // The tree's branches *are* the statuses, so dropping a node into another branch is the
          // same intent the board reports — and goes through the same mutation.
          onNodeMove={(intent) => {
            if (!applyMoves || !intent.to) return;
            const status = intent.to.replace(/^group:/, "");
            // A drop between two leaves reports their parent branch; a drop onto a leaf is not a
            // status change at all, so there is nothing to send.
            if (!STATUSES.includes(status)) return;
            move.mutate({ id: Number(intent.id), status });
          }}
          renderNode={({ row }) =>
            row.status
              ? { meta: <Badge label={String(row.status)} color="blue" badgeStyle="subtle" showIcon={false} /> }
              : {}
          }
        >
          {/* The same pane slot, and the tree has branches that are not rows at all — so this
              one has to say so rather than render an empty shell. */}
          <NodeDetail />
        </DataViews.Tree>


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

/**
 * The inbox's pane, written from scratch.
 *
 * `useActiveRow()` resolves whatever the list has open against the current rows, so this works
 * unchanged inside the inbox, the board or the tree — and returns `null` after a refetch drops
 * the row that was open, which is why the guard is not optional.
 *
 * `Cell` paints each value the way every other view paints it, so a custom pane still agrees with
 * the table it came from.
 */
function OrderDetail() {
  const row = useActiveRow();
  const { visibleFields } = useDataViewsData();
  if (!row) return null;

  const [, customer, status, priority, totalField] = visibleFields;

  return (
    <article className="flex h-full flex-col">
      <header className="border-border-presentation-global-primary flex items-center justify-between gap-3 border-b px-6 py-4">
        <div className="flex flex-col gap-1">
          <span className="typography-headers-medium-medium text-content-presentation-global-primary">
            <Cell field={customer} row={row} />
          </span>
          <span className="flex items-center gap-2">
            <Cell field={status} row={row} />
            <Cell field={priority} row={row} />
          </span>
        </div>
        <span className="typography-headers-large-semibold text-content-presentation-global-primary">
          <Cell field={totalField} row={row} />
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-auto p-6">
        <p className="typography-body-medium-regular text-content-presentation-global-secondary max-w-[60ch]">
          Anything belongs here — a timeline, an activity feed, a form. The pane is a plain child,
          so it is ordinary JSX with ordinary access to the open row.
        </p>
        <div className="flex gap-2">
          <Button size="M">Mark as shipped</Button>
          <Button size="M" variant="BorderStyle">
            Print label
          </Button>
        </div>
      </div>
    </article>
  );
}

/**
 * The tree's pane.
 *
 * The branches here are synthetic groupings rather than rows, so `useActiveRow()` returns `null`
 * for them even though something *is* selected. A pane that assumed otherwise would show an empty
 * shell; this says which case it is in.
 */
function NodeDetail() {
  const row = useActiveRow();
  const { visibleFields } = useDataViewsData();
  const { activeId } = useDataViewsView();

  if (!row) {
    return (
      <div className="text-content-presentation-global-tertiary flex h-full items-center justify-center p-6 text-center">
        {activeId
          ? "That is a grouping, not an order — pick a leaf."
          : "Select an order from the tree."}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-6">
      {visibleFields.map((field, i) => (
        <div key={`${field.path}-${i}`} className="flex items-baseline gap-3">
          <span className="typography-body-small-regular text-content-presentation-global-tertiary w-[90px] shrink-0">
            {field.label ?? field.path}
          </span>
          <span className="typography-body-medium-medium text-content-presentation-global-primary">
            <Cell field={field} row={row} />
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Only the controls that mean something for the view you are looking at.
 *
 * Reading `useDataViewsView()` from inside the header keeps five buttons off the bar — and shows
 * that a header child can reach the component's state like any other part.
 */
function ViewControls({
  selectable,
  setSelectable,
  applyMoves,
  setApplyMoves,
  deep,
  setDeep,
  setExpanded,
  reset,
}: {
  selectable: boolean;
  setSelectable: (v: boolean) => void;
  applyMoves: boolean;
  setApplyMoves: (v: boolean) => void;
  deep: boolean;
  setDeep: (v: boolean) => void;
  setExpanded: (v: readonly string[]) => void;
  reset: () => void;
}) {
  const { view, setActiveId } = useDataViewsView();

  if (view === "table") {
    return (
      <Button size="S" variant="BorderStyle" onClick={() => setSelectable(!selectable)}>
        {selectable ? "Hide checkboxes" : "Show checkboxes"}
      </Button>
    );
  }
  if (view === "board") {
    return (
      <>
        <Button
          size="S"
          variant={applyMoves ? "BluColStyle" : "BorderStyle"}
          onClick={() => setApplyMoves(!applyMoves)}
        >
          {applyMoves ? "Applying moves" : "Ignoring moves"}
        </Button>
        <Button size="S" variant="BorderStyle" onClick={reset}>
          Reset
        </Button>
      </>
    );
  }
  if (view === "inbox") {
    return (
      <Button size="S" variant="BorderStyle" onClick={() => setActiveId("does-not-exist")}>
        Bogus activeId
      </Button>
    );
  }
  return (
    <>
      <Button size="S" variant="BorderStyle" onClick={() => setDeep(!deep)}>
        {deep ? "Group by status" : "Five levels deep"}
      </Button>
      <Button size="S" variant="BorderStyle" onClick={() => setExpanded([])}>
        Collapse all
      </Button>
    </>
  );
}
