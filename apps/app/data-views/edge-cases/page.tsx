"use client";

import { useState } from "react";

import { DataViews } from "@/components/DataViews";
import { Button } from "@/components/Button";
import { emptyOrders, orderFields, singleOrder, sparseFields, sparseRecords } from "../_data";
import { Callout, ExampleFrame } from "../_shared";

type Case = "empty" | "single" | "sparse" | "nested";

const CASES: { id: Case; label: string; note: React.ReactNode }[] = [
  {
    id: "empty",
    label: "Empty",
    note: (
      <>
        No records at all. Field detection has nothing to work from, so declared <code>fields</code>{" "}
        are what keep the columns and the config rail meaningful.
      </>
    ),
  },
  {
    id: "single",
    label: "One record",
    note: (
      <>
        A single row. The Kanban renders one column, and the ≤10-distinct-values filter heuristic
        offers every text field.
      </>
    ),
  },
  {
    id: "sparse",
    label: "Missing values",
    note: (
      <>
        Missing keys, explicit <code>null</code>s, and the values that are easy to get wrong:{" "}
        <code>0</code> and <code>&quot;&quot;</code> are real values and render as such, while{" "}
        <code>null</code>/<code>undefined</code> render the <code>-</code> placeholder.
      </>
    ),
  },
  {
    id: "nested",
    label: "Nested objects",
    note: (
      <>
        Object-valued keys are skipped by field detection — they would be meaningless in a table
        cell. The inbox detail pane picks them up instead, rendering each nested object as its own
        section via <code>renderDetailView</code>.
      </>
    ),
  },
];

export default function EdgeCasesPage() {
  const [active, setActive] = useState<Case>("empty");
  const current = CASES.find((c) => c.id === active)!;

  const usesOrders = active === "empty" || active === "single";

  const data = active === "empty" ? emptyOrders : active === "single" ? singleOrder : sparseRecords;
  const fields = usesOrders ? orderFields : sparseFields;

  return (
    <ExampleFrame
      title="Edge cases"
      description="The shapes real backends actually return — and what DataViews does with them."
      padded
    >
      <div className="flex h-full min-h-0 gap-4">
        <div className="min-h-0 flex-1">
          <DataViews.Root key={active} data={data} fields={fields} className="h-full">
            <DataViews.Header title="Records">
              <DataViews.ViewSwitch />
              <DataViews.Spacer />
              <DataViews.ConfigTrigger />
            </DataViews.Header>

            <DataViews.Table />
            {/* Only the order-shaped cases have a `status` field to group by.
                Pointing `groupBy` at a missing field is a dev warning, not a
                demo — see the sparse cases for what missing values look like. */}
            {usesOrders && <DataViews.Kanban groupBy="status" />}
            <DataViews.Inbox />

            <DataViews.ConfigPanel />
          </DataViews.Root>
        </div>

        <aside className="flex w-80 shrink-0 flex-col gap-3 overflow-auto">
          <div className="flex flex-wrap gap-2">
            {CASES.map((c) => (
              <Button
                key={c.id}
                size="S"
                variant={active === c.id ? "PrimeStyle" : "BorderStyle"}
                onClick={() => setActive(c.id)}
              >
                {c.label}
              </Button>
            ))}
          </div>

          <Callout>{current.note}</Callout>

          {active === "nested" && (
            <Callout>
              <strong>Try it.</strong> Open the <em>Inbox</em> tab and select the first record — its{" "}
              <code>metadata</code> object, the <code>pipeline</code> object nested inside it, and
              the <code>labels</code> array each render as their own section.
            </Callout>
          )}

          {active === "empty" && (
            <Callout tone="warn">
              With no data and no declared fields, there is nothing to detect and the table renders
              headerless. Declaring <code>fields</code> is what makes an empty state legible.
            </Callout>
          )}
        </aside>
      </div>
    </ExampleFrame>
  );
}
