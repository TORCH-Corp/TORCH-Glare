"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DataViews } from "@/components/DataViews";
import { orders, orderFields } from "../_data";
import { ExampleFrame } from "../_shared";

export default function DataViewsRouteLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ id?: string }>();
  const selectedId = params?.id;

  const [search, setSearch] = useState("");

  // Replace this local filter with a fetch to your endpoint when ready.
  const visibleOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) =>
      [o.id, o.customer, o.status, o.priority, o.total, o.createdAt]
        .map((v) => String(v).toLowerCase())
        .some((s) => s.includes(q)),
    );
  }, [search]);

  return (
    <ExampleFrame
      title="Inbox routing"
      description={
        <>
          The shell lives in <code>layout.tsx</code> so it survives navigation; only the detail pane
          is a route. Pick a row — the URL becomes <code>/data-views/inbox-routing/&lt;id&gt;</code>{" "}
          and the list keeps its state.
        </>
      }
    >
      <DataViews.Root
        data={visibleOrders}
        fields={orderFields}
        config={selectedId ? { defaultView: "inbox" } : undefined}
        className="h-full"
      >
        <DataViews.Header title="Orders">
          <DataViews.ViewSwitch />
          <DataViews.Spacer />
          <DataViews.Search value={search} onChange={setSearch} placeholder="Search orders..." />
          <DataViews.ConfigTrigger />
        </DataViews.Header>

        <DataViews.Table />
        <DataViews.Kanban groupBy="status" />
        <DataViews.Inbox
          itemHref={(_item, id) => `/data-views/inbox-routing/${id}`}
          linkComponent={Link}
          selectedId={selectedId}
          renderDetail={selectedId ? () => children : undefined}
        />
        <DataViews.Tree />

        <DataViews.ConfigPanel />
      </DataViews.Root>
    </ExampleFrame>
  );
}
