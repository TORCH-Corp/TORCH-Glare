"use client";

import { useMemo, useState } from "react";

import { DataViews } from "@/components/DataViews";
import { orders, orderFields } from "../_data";
import { ExampleFrame } from "../_shared";

/**
 * The full compound form. Everything the preset does, spelled out — plus the
 * header slots the preset does not expose in this arrangement.
 */
export default function CompoundPage() {
  const [query, setQuery] = useState("");

  // Search is the consumer's job: DataViews never filters on the query, because
  // in a real app it hits the backend. Here it filters locally.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) =>
      [o.id, o.customer, o.status, o.priority, o.total].some((v) =>
        String(v).toLowerCase().includes(q),
      ),
    );
  }, [query]);

  return (
    <ExampleFrame
      title="Compound"
      description={
        <>
          <code>DataViews.Root</code> owns the state; each part reads it from context. The header
          takes whatever children you give it — here the view switcher, a spacer, search, a primary
          action, and the config trigger.
        </>
      }
    >
      <DataViews.Root data={visible} fields={orderFields} className="h-full">
        <DataViews.Header title="Orders">
          <DataViews.ViewSwitch />
          <DataViews.Spacer />
          <DataViews.Search value={query} onChange={setQuery} placeholder="Search orders…" />
          <DataViews.Action onClick={() => alert("Create an order")}>New order</DataViews.Action>
          <DataViews.ConfigTrigger />
        </DataViews.Header>

        <DataViews.Table />
        <DataViews.Kanban groupBy="status" titleField="customer" />
        <DataViews.Inbox config={{ starredField: "isStarred", priorityField: "priority" }} />

        <DataViews.ConfigPanel />
      </DataViews.Root>
    </ExampleFrame>
  );
}
