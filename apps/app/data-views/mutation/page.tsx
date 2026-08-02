"use client";

import { useCallback, useEffect, useState } from "react";

import { DataViews, useDataViews, type FilterState } from "@/components/DataViews";
import { Button } from "@/components/Button";
import { setByPath } from "@/utils/dataViews/pathUtils";
import { orders, orderFields } from "../_data";
import { Callout, ExampleFrame } from "../_shared";

/**
 * Reports the Root's source dataset back out, so the page can prove no records
 * were lost. Same trick the regression test uses.
 */
function RecordCount({ onCount }: { onCount: (n: number, ids: unknown[]) => void }) {
  const { items } = useDataViews();

  useEffect(() => {
    onCount(
      items.length,
      items.map((i) => i.id),
    );
  }, [items, onCount]);

  return null;
}

/**
 * Edits one record from inside the Root — the correct way. Lives here rather
 * than in the sidebar because `useDataViews` only works under the provider.
 */
function ToggleFirstStatus() {
  const { updateRecord, items } = useDataViews();
  const first = items[0];
  if (!first) return null;

  return (
    <Button
      size="S"
      variant="BorderStyle"
      onClick={() =>
        updateRecord(first.id, (record) =>
          setByPath(record, "status", record.status === "Delivered" ? "Pending" : "Delivered"),
        )
      }
    >
      updateRecord on #{String(first.id)}
    </Button>
  );
}

export default function MutationPage() {
  const [filterState, setFilterState] = useState<FilterState>({ status: ["Pending"] });
  const [count, setCount] = useState(orders.length);
  const [ids, setIds] = useState<unknown[]>(orders.map((o) => o.id));

  // Stable, so `RecordCount`'s effect doesn't re-fire every render.
  const handleCount = useCallback((n: number, nextIds: unknown[]) => {
    setCount(n);
    setIds(nextIds);
  }, []);

  return (
    <ExampleFrame
      title="Editing records"
      description={
        <>
          A view only ever holds a filtered projection of the data — so an edit has to target the
          original dataset by id, not rebuild the array from what the view can see.
        </>
      }
      padded
    >
      <div className="flex h-full min-h-0 gap-4">
        <div className="min-h-0 flex-1">
          <DataViews.Root
            data={orders}
            fields={orderFields}
            filterState={filterState}
            onFilterChange={setFilterState}
            className="h-full"
          >
            <RecordCount onCount={handleCount} />

            <DataViews.Header title="Orders">
              <DataViews.ViewSwitch />
              <DataViews.Spacer />
              <ToggleFirstStatus />
              <DataViews.ConfigTrigger />
            </DataViews.Header>

            <DataViews.Kanban groupBy="status" />
            <DataViews.Table />
            <DataViews.Inbox config={{ starredField: "isStarred" }} />

            <DataViews.ConfigPanel />
          </DataViews.Root>
        </div>

        <aside className="flex w-80 shrink-0 flex-col gap-3 overflow-auto">
          <Callout>
            <strong>Try it.</strong> A <code>status: Pending</code> filter is already applied, so
            the board shows 3 of {orders.length} orders. Drag a card to another column, or star a
            row in the Inbox tab — then check the count below.
          </Callout>

          <div className="rounded-[10px] border border-border-presentation-global-primary p-3">
            <p className="typography-body-small-medium text-content-presentation-global-tertiary">
              Records in the source dataset
            </p>
            <p
              className={
                count === orders.length
                  ? "typography-headers-medium-medium text-content-presentation-global-primary"
                  : "typography-headers-medium-medium text-content-presentation-state-negative"
              }
            >
              {count} / {orders.length}
            </p>
            <p className="typography-body-small-regular text-content-presentation-global-secondary">
              ids: {ids.join(", ")}
            </p>
          </div>

          <Button size="M" variant="BorderStyle" onClick={() => setFilterState({})}>
            Clear the filter
          </Button>

          <Callout>
            <strong>Why it matters.</strong> Views used to do{" "}
            <code>onDataUpdate(records.map(…))</code>, where <code>records</code> was the{" "}
            <em>filtered</em> set — so one edit under a filter deleted every hidden record. They now
            call <code>updateRecord(id, updater)</code>, which walks the original <code>items</code>{" "}
            and recurses into nested children.
          </Callout>

          <Callout>
            <code>onDataUpdate</code> still exists for genuinely wholesale rewrites — the
            tree&apos;s drag-to-reparent is the only legitimate caller.
          </Callout>
        </aside>
      </div>
    </ExampleFrame>
  );
}
