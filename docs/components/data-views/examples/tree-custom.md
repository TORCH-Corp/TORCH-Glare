---
title: DataViews example — Tree → custom UI
description: Every custom-UI seam of the tree: `renderNode`, `paneRows`, a custom cell, card and tab, `paneActions`, and a whole-pane override.
group: examples
component: DataViews
keywords: [data-views, example, examples, tree, custom]
---

# DataViews example — Tree → custom UI

Every custom-UI seam of the tree: `renderNode`, `paneRows`, a custom cell, card and tab, `paneActions`, and a whole-pane override.

Complete and runnable — this is the page itself, not an excerpt. In the monorepo it lives at `apps/app/data-views/tree-custom/page.tsx`.

See the [component reference](../index.md) for what each prop does, or the [guide](../guide.md) for the same ground as scenarios.

```tsx
"use client";

import { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Clock, Filter, Settings } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import {
  Cell,
  DataViews,
  emptyQuery,
  queryToParams,
  useActiveRow,
  useDataViewsData,
  type SavedView,
} from "@/components/DataViews";
import { FormBuilder } from "@/components/FormBuilder";
import type {
  DataViewsQuery,
  FieldConfig,
  Row,
  TreeNode,
} from "@/utils/dataViews/types";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Order extends Row {
  id: number;
  customer: { name: string };
  brand: { name: string };
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

async function fetchOrders(q: DataViewsQuery): Promise<{ rows: Order[]; total: number }> {
  const params = queryToParams(q);
  const res = await fetch(`/api/orders?${params}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * A tree of **brands**, each holding its orders — the shape that makes the pane worth
 * customising. A branch is a synthetic node: it stands for a brand, and the row it carries is
 * only there so the rail has something to label it with.
 */
const nodesByBrand = (rows: readonly Order[]): TreeNode[] => {
  const brands = [...new Set(rows.map((row) => row.brand?.name).filter(Boolean))];
  return brands.map((brand) => {
    const mine = rows.filter((row) => row.brand?.name === brand);
    return {
      id: `brand:${brand}`,
      // The branch borrows its first order's row so `labelPath` has a value to read. It is not
      // one of the orders — which is exactly why `paneRows` below never lists it.
      row: { ...mine[0], id: `brand:${brand}`, customer: { name: brand } } as Row,
      depth: 0,
      children: mine.map((row) => ({ id: String(row.id), row, depth: 1, children: [] })),
    };
  });
};

// ─── Custom UI ────────────────────────────────────────────────────────────────

/** A card of your own. `renderPaneCard` replaces `DataViewCard` outright — this is plain markup. */
function OrderCard({ row }: { row: Row }) {
  const order = row as Order;
  return (
    <article className="border-border-presentation-global-primary bg-background-presentation-form-base flex flex-col gap-2 rounded-[12px] border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="typography-body-small-medium text-content-presentation-global-tertiary">
            Order #{order.id}
          </div>
          <div className="typography-headers-medium-semibold text-content-presentation-global-primary truncate">
            {order.customer?.name}
          </div>
        </div>
        <Badge
          label={order.status}
          color={order.status === "Delivered" ? "green" : order.status === "Shipped" ? "blue" : "yellow"}
          badgeStyle="subtle"
          showIcon={false}
        />
      </div>
      {/* A bar is the sort of thing a card can show and a table cell cannot. */}
      <div className="bg-background-presentation-action-disabled h-[6px] w-full overflow-hidden rounded-full">
        <div
          className="bg-background-presentation-state-information-primary h-full rounded-full"
          style={{ width: `${Math.min(100, (order.total / 15000) * 100)}%` }}
        />
      </div>
      <div className="typography-body-medium-semibold text-content-presentation-global-primary">
        ${order.total?.toLocaleString()}
      </div>
    </article>
  );
}

/**
 * A tab of your own. It reads `useDataViewsData()` like any other part — and because a tab sits
 * inside the pane's scope, the `rows` it gets are the **selected node's**, already narrowed by
 * `paneRows`. No prop threading, no second copy of the row set.
 */
function Timeline() {
  const { rows } = useDataViewsData();
  const ordered = [...rows].sort(
    (a, b) => new Date(String(a.createdAt)).getTime() - new Date(String(b.createdAt)).getTime(),
  );

  return (
    <ol className="flex flex-col gap-0 p-6">
      {ordered.map((row, i) => {
        const order = row as Order;
        return (
          <li key={order.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="bg-background-presentation-state-information-primary mt-[6px] size-[10px] shrink-0 rounded-full" />
              {i < ordered.length - 1 && (
                <span className="bg-border-presentation-global-primary w-px flex-1" />
              )}
            </div>
            <div className="flex-1 pb-5">
              <div className="typography-body-small-regular text-content-presentation-global-tertiary">
                {order.createdAt}
              </div>
              <div className="typography-body-medium-semibold text-content-presentation-global-primary">
                Order #{order.id} · {order.customer?.name}
              </div>
              <div className="typography-body-small-regular text-content-presentation-global-secondary">
                ${order.total?.toLocaleString()} · {order.status}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * A pane of your own — anything that is not a tab replaces the built-in pane entirely, switch
 * and all.
 *
 * `useActiveRow()` resolves whatever the rail has selected, and returns nothing when that is a
 * synthetic branch rather than a row: a brand node has no order behind it, so say so rather than
 * rendering an empty shell.
 */
function BrandBrief() {
  const row = useActiveRow();
  const { visibleFields } = useDataViewsData();

  return (
    <div className="flex h-full flex-col gap-3 p-6">
      <h3 className="typography-headers-large-semibold text-content-presentation-global-primary">
        A pane of my own
      </h3>
      {row ? (
        <dl className="flex flex-col gap-2">
          {visibleFields.map((field, i) => (
            <div key={`${field.path}-${i}`} className="flex items-center justify-between gap-4">
              <dt className="typography-body-small-regular text-content-presentation-global-tertiary">
                {field.label ?? field.path}
              </dt>
              <dd className="typography-body-medium-semibold text-content-presentation-global-primary">
                <Cell field={field} row={row} />
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="typography-body-medium-regular text-content-presentation-global-tertiary">
          Pick an order — a brand is a branch, not a row.
        </p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * Custom UI in the tree, one seam at a time.
 *
 * The tree hands you five places to put your own markup, and this page uses every one of them:
 * `renderNode` for the rail, `paneRows` for what the pane lists, `paneTable.renderCell` for a
 * cell, `renderPaneCard` for a card, `paneActions` for the pane's header — and `children` when
 * you want none of it and would rather write the pane yourself.
 */
export default function TreeCustomExample() {
  const [query, setQuery] = useState(emptyQuery());
  const [saved, setSaved] = useState<SavedView[]>([]);
  const [ownPane, setOwnPane] = useState(false);

  const { data, isPending, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["tree-custom-orders", { ...query, page: undefined }],
    queryFn: ({ pageParam }) => fetchOrders({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((n, page) => n + page.rows.length, 0);
      return loaded < last.total ? pages.length + 1 : undefined;
    },
  });

  const rows = useMemo(() => data?.pages.flatMap((page) => page.rows) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;
  const nodes = useMemo(() => nodesByBrand(rows), [rows]);

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
        <DataViews.Header title="Brands">
          <DataViews.ViewSwitch />
          <DataViews.Search />
          <DataViews.Actions>
            <Button variant="BluColStyle" size="M" onClick={() => setOwnPane(!ownPane)}>
              {ownPane ? "Built-in pane" : "Write my own pane"}
            </Button>
          </DataViews.Actions>
          <DataViews.PanelToggle />
        </DataViews.Header>

        <DataViews.Tree
          nodes={nodes}
          labelPath="customer.name"
          // ① The rail. `renderNode` returns *parts*, not markup — `TreeFolder` owns the row.
          renderNode={({ node, row }) =>
            node.children.length > 0
              ? {
                  // `TreeFolder` already prints the child count, so the name carries what it
                  // cannot: what the brand is worth.
                  name: `${(row as Order).customer?.name} · $${node.children
                    .reduce((sum, child) => sum + Number(child.row.total ?? 0), 0)
                    .toLocaleString()}`,
                  icon: <i className="ri-price-tag-3-line" />,
                }
              : {
                  meta: (
                    <Badge
                      label={String(row.status)}
                      color={row.status === "Delivered" ? "green" : row.status === "Shipped" ? "blue" : "yellow"}
                      badgeStyle="subtle"
                      size="S"
                      showIcon={false}
                    />
                  ),
                }
          }
          // ② What the pane lists. The default is every descendant; this one drops the synthetic
          //    brand branch and sorts by value, which is also how you make the pane's order
          //    self-contained — the table's own headers sort by re-querying the dataset.
          paneRows={(node) =>
            (node.children.length > 0 ? node.children.map((child) => child.row) : [node.row])
              .filter((row) => typeof row.id === "number")
              .slice()
              .sort((a, b) => Number(b.total) - Number(a.total))
          }
          // ③ Your markup in the pane's header, beside the tab switch.
          paneActions={
            <Button variant="BluColStyle" size="M">
              New order
            </Button>
          }
        >
          {/* ④ The pane's tabs are children, the same bargain as the component's own views: the
              switch shows exactly what is rendered here. Pass none and you get these two anyway. */}
          {ownPane ? (
            // ⑦ …and anything that is not a tab is the pane itself — switch, header and all.
            <BrandBrief />
          ) : (
            <>
              <DataViews.Tree.Table
                selectable
                // A cell of your own. Return `undefined` for the fields you have no opinion
                // about and the default cell paints them.
                renderCell={({ field, row }) =>
                  field.path === "total" ? (
                    <span className="flex w-full items-center gap-2">
                      <span className="bg-background-presentation-action-disabled h-[6px] flex-1 overflow-hidden rounded-full">
                        <span
                          className="bg-background-presentation-state-information-primary block h-full rounded-full"
                          style={{ width: `${Math.min(100, (Number(row.total) / 15000) * 100)}%` }}
                        />
                      </span>
                      <span className="typography-body-small-medium shrink-0">
                        ${Number(row.total).toLocaleString()}
                      </span>
                    </span>
                  ) : undefined
                }
              />
              {/* ⑤ A card of your own in cards mode. */}
              <DataViews.Tree.Cards renderCard={({ row }) => <OrderCard row={row} />} />
              {/* ⑥ A tab that is entirely yours — no default content, just markup. */}
              <DataViews.Tree.Tab value="timeline" label="Timeline" icon={<Clock />}>
                <Timeline />
              </DataViews.Tree.Tab>
            </>
          )}
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
