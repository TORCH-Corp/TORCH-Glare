"use client";

import { useState } from "react";

import { DataViews } from "@/components/DataViews";
import { Button } from "@/components/Button";
import { orders, orderFields } from "../_data";
import { Callout, ExampleFrame } from "../_shared";

type Arrangement = "board-first" | "list-first" | "table-only";

const ARRANGEMENTS: { id: Arrangement; label: string; note: string }[] = [
  {
    id: "board-first",
    label: "Board first",
    note: "Kanban written before Table → Board is tab 1.",
  },
  { id: "list-first", label: "List first", note: "Swap the JSX order → List is tab 1." },
  {
    id: "table-only",
    label: "Table only",
    note: "Drop the other elements → one view, switcher hides.",
  },
];

/**
 * Tabs are not configured anywhere: each view registers itself on mount, so the
 * tab bar is a reflection of the JSX. Reorder the elements and the tabs follow.
 */
export default function TabsPage() {
  const [arrangement, setArrangement] = useState<Arrangement>("board-first");

  return (
    <ExampleFrame
      title="Tabs & labels"
      description={
        <>
          There is no <code>views</code> list to keep in sync. Each view calls{" "}
          <code>useRegisterView</code> on mount, and <code>DataViews.ViewSwitch</code> renders the
          registrations in order — so JSX order <em>is</em> tab order.
        </>
      }
      padded
    >
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {ARRANGEMENTS.map((a) => (
            <Button
              key={a.id}
              size="M"
              variant={arrangement === a.id ? "PrimeStyle" : "BorderStyle"}
              onClick={() => setArrangement(a.id)}
            >
              {a.label}
            </Button>
          ))}
        </div>

        <Callout>{ARRANGEMENTS.find((a) => a.id === arrangement)!.note}</Callout>

        <div className="min-h-0 flex-1">
          <DataViews.Root data={orders} fields={orderFields} className="h-full">
            <DataViews.Header title="Orders">
              <DataViews.ViewSwitch />
            </DataViews.Header>

            {arrangement === "board-first" && (
              <>
                <DataViews.Kanban groupBy="status" />
                <DataViews.Table />
                {/* `label` renames the tab without touching the view id. */}
                <DataViews.Inbox label="Mail" />
              </>
            )}

            {arrangement === "list-first" && (
              <>
                <DataViews.Table label="Rows" />
                <DataViews.Kanban groupBy="status" label="Pipeline" />
                <DataViews.Inbox label="Mail" />
              </>
            )}

            {arrangement === "table-only" && <DataViews.Table />}
          </DataViews.Root>
        </div>
      </div>
    </ExampleFrame>
  );
}
