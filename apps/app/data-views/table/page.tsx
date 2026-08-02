"use client";

import { useState } from "react";

import { DataViews } from "@/components/DataViews";
import { orders, orderFields } from "../_data";
import { Callout, ExampleFrame, StateReadout } from "../_shared";

/**
 * Selection is controlled here so the page can display it. Omit both
 * `selectedIds` and `onSelectionChange` and the table owns it internally —
 * passing only `selectedIds` gets you a dev warning, because the checkboxes
 * would render but never change.
 */
export default function TablePage() {
  const [selected, setSelected] = useState<unknown[]>([]);

  return (
    <ExampleFrame
      title="Table"
      description={
        <>
          Sortable headers, controlled row selection, and column visibility and order — the last of
          which lives in the config rail, not on the table.
        </>
      }
      padded
    >
      <div className="flex h-full min-h-0 gap-4">
        <div className="min-h-0 flex-1">
          <DataViews.Root
            data={orders}
            fields={orderFields}
            config={{ sortBy: "total", sortOrder: "desc" }}
            className="h-full"
          >
            <DataViews.Header title="Orders">
              <DataViews.ViewSwitch />
              <DataViews.Spacer />
              <DataViews.ConfigTrigger />
            </DataViews.Header>

            <DataViews.Table selectedIds={selected} onSelectionChange={setSelected} />

            <DataViews.ConfigPanel />
          </DataViews.Root>
        </div>

        <aside className="flex w-72 shrink-0 flex-col gap-3 overflow-auto">
          <Callout>
            <strong>Try it.</strong> Click a column header to sort — it writes through to{" "}
            <code>config.sortBy</code>, so the rail&apos;s <em>Default Sort</em> section moves with
            it. Open <em>Filter &amp; Config.</em> to hide a column or drag one to reorder.
          </Callout>

          <StateReadout label="selectedIds" value={selected} />

          <Callout>
            The table starts sorted by <code>total</code> descending via the <code>config</code>{" "}
            prop.
          </Callout>
        </aside>
      </div>
    </ExampleFrame>
  );
}
