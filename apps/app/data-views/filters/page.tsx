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
  FilterState,
  FilterValue,
  Row,
} from "@/utils/dataViews/types";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Order extends Row {
  id: number;
  customer: { name: string };
  status: "Pending" | "Shipped" | "Delivered";
  priority: "High" | "Medium" | "Low";
  total: number;
  items: number;
  createdAt: string;
}

const FIELDS: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "customer.name", label: "Customer", type: "text" },
  { path: "brand.name", label: "Brand", type: "text" },
  { path: "status", label: "Status", type: "enum-badge", variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" } },
  { path: "priority", label: "Priority", type: "enum-badge", variants: { High: "redOrange", Medium: "purple", Low: "gray" } },
  { path: "items", label: "Items", type: "number" },
  { path: "total", label: "Total", type: "currency", currency: "USD" },
  { path: "createdAt", label: "Created", type: "date-format", dateFormat: "YYYY-MM-DD" },
];

/**
 * The options each control offers. Supplied — DataViews never scans the dataset to find them, and
 * in a real app they come from the same endpoint that does the filtering.
 */
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

/** Buckets for the custom control below — DataViews has no built-in for this. */
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

/**
 * The buckets this picker offers. What each one *means* — which item counts fall in it — is the
 * endpoint's business, in `app/api/orders/route.ts`. The page sends the label; the server decides.
 */
const BUCKETS = ["1–3", "4–10", "10+"];

/** `Filters.Custom` renders whatever you like against this path's slot in `FilterState`. */
function ItemsPicker({
  value,
  setValue,
}: {
  value: FilterValue | undefined;
  setValue: (v: FilterValue | undefined) => void;
}) {
  const selected = Array.isArray(value) ? value : [];
  return (
    <div className="flex gap-1">
      {BUCKETS.map((bucket) => (
        <button
          key={bucket}
          type="button"
          onClick={() => {
            const next = selected.includes(bucket)
              ? selected.filter((b) => b !== bucket)
              : [...selected, bucket];
            setValue(next.length ? next : undefined);
          }}
          className={[
            "typography-body-small-regular rounded-[6px] border px-2 py-1 transition-colors",
            selected.includes(bucket)
              ? "border-transparent bg-background-presentation-action-selected text-content-presentation-global-primary"
              : "border-border-presentation-global-primary text-content-presentation-global-secondary",
          ].join(" ")}
        >
          {bucket}
        </button>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * The controls are real FormBuilder fields — `Select`, `MultiSelect`, `Slider`, `DateRange` — in
 * `CellContext`'s `"bare"` mode: no label row, no table borders. One set of inputs across the
 * design system.
 *
 * Three behaviours worth knowing:
 *
 * - **A slider at its bounds emits nothing.** Drag *Total* away from 0–15,000 and a `total` key
 *   appears; drag it back and the key vanishes, because "the whole range" and "no constraint" are
 *   the same query. The cost is that a filter genuinely meaning "0 to 15,000" is inexpressible —
 *   use `Filters.Custom` if you need that distinction.
 * - **Dates are local, not UTC.** You get the day you clicked; `toISOString()` would hand back the
 *   previous day for anyone east of Greenwich.
 * - **A parent may rewrite what it is handed.** Turn on *Normalising*: every emitted array comes
 *   back sorted. Because `Filters` debounces and compares before emitting, the rewritten value
 *   settles instead of ping-ponging — a control that echoed immediately would loop and eat every
 *   keystroke.
 *
 * The custom `items` key is owned by no declared control, and survives anyway: the built-in
 * controls merge over the paths in `fields` and leave everything else alone.
 */
export default function FiltersExample() {
  // Controlled, because this page starts with a filter no control owns and then rewrites what it
  // is handed. Everywhere else `onQueryChange` alone is enough.
  const [query, setQuery] = useState<DataViewsQuery>({
    ...emptyQuery(),
    filters: { items: ["10+"] },
  });
  const [saved, setSaved] = useState<SavedView[]>([]);
  const [normalise, setNormalise] = useState(false);

  /**
   * A parent may rewrite what it is handed. With normalising on, every emitted list comes back
   * sorted — and it settles rather than ping-ponging, because `Filters` debounces and compares
   * before emitting again. A control that echoed immediately would loop and eat every keystroke.
   */
  const onQueryChange = (next: DataViewsQuery) => {
    if (!normalise) return setQuery(next);
    const filters: FilterState = {};
    for (const [path, value] of Object.entries(next.filters)) {
      filters[path] = Array.isArray(value) ? [...value].sort() : value;
    }
    setQuery({ ...next, filters });
  };

  const { data, isPending, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    // The key *is* the query: touch any part of it and TanStack refetches, and a response that
    // has been superseded is discarded rather than landing on top of a newer one.
    queryKey: ["filters-orders", { ...query, page: undefined }],
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
        query={query}
        onQueryChange={onQueryChange}
        className="h-full"
      >
        <DataViews.Header title="Orders">
          <DataViews.ViewSwitch />
          <DataViews.Search />
          <DataViews.Actions>
            <Button variant="BluColStyle"
              size="M"
              onClick={() => setNormalise((v) => !v)}
            >
              {normalise ? "Normalising on" : "Normalising off"}
            </Button>
            <Button
              variant="BluColStyle"
              size="M"
              onClick={() => setQuery({ ...emptyQuery(), filters: { items: ["10+"] } })}
            >
              Reset
            </Button>
          </DataViews.Actions>
          <DataViews.PanelToggle />
        </DataViews.Header>

        {/* The active query, as removable chips — including the search term. */}
        <div className="border-border-presentation-global-primary border-b px-4 py-2 empty:hidden">
          <DataViews.Filters.Summary />
        </div>

        <DataViews.Table />
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
            {/* Every kind of control, written as the FormBuilder fields they are. The
                <FormBuilder> itself lives inside Filters — you supply its fields and nothing
                else, and Filters reads each one's name, label and bounds to learn what it is. */}
            <DataViews.Filters
              title={null}
              className="border-b-0 p-0"
            >
              {/* ① FIXED set, multi-pick → a checkbox list. The four statuses are fixed by the
                  model; an org cannot add a fifth without a release. */}
              <FormBuilder.CheckboxGroup name="status" label="Status" options={STATUS_OPTIONS} />

              {/* ② FIXED set, single-pick → radios. High/Medium/Low are mutually exclusive, so
                  picking two would be meaningless. Writes a one-element array. */}
              <FormBuilder.RadioList name="priority" label="Priority" options={PRIORITY_OPTIONS} />

              {/* ③ DYNAMIC set, single-pick → a searchable combobox. Customers are data-fed, so
                  the list grows; one record has one customer, so one at a time is the natural pick. */}
              <FormBuilder.SearchableSelect
                name="customer.name"
                label="Customer"
                options={CUSTOMER_OPTIONS}
              />

              {/* ④ DYNAMIC set, multi-pick → BadgeField: search *and* several values, as chips.
                  This is the control the enhancement request asked for; `MultiSelect` and `Tags`
                  are the same field and both render it. */}
              <FormBuilder.MultiSelect name="brand.name" label="Brand" options={BRAND_OPTIONS} />
              <FormBuilder.Slider name="total" label="Total" range min={0} max={15000} step={100} />
              <DataViews.Filters.Presets
                for="total"
                items={[
                  { label: "Under $500", max: 500 },
                  { label: "$5k+", min: 5000 },
                ]}
              />
              <FormBuilder.DateRange name="createdAt" label="Created" />
              <DataViews.Filters.Presets
                for="createdAt"
                items={[{ label: "September", from: "2025-09-01", to: "2025-09-30" }]}
              />
              <DataViews.Filters.Custom
                path="items"
                label="Item count"
                render={({ value, setValue }) => <ItemsPicker value={value} setValue={setValue} />}
              />
            </DataViews.Filters>
          </DataViews.Panel.Tab>
        </DataViews.Panel>
      </DataViews>
    </div>
  );
}
