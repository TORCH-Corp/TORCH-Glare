"use client";

import { useState } from "react";

import { DataViews } from "@/components/DataViews";
import { orders, orderFields } from "../_data";
import { Callout, ExampleFrame } from "../_shared";

/**
 * `orderFields.status` carries `kanbanVariants`, which renames the columns and
 * picks each header pill's colour without touching the badge colour the same
 * field uses in the table.
 */
export default function KanbanPage() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <ExampleFrame
      title="Kanban"
      description={
        <>
          Records grouped into columns by one field. Dropping a card writes the new value back
          through <code>updateRecord</code>, so the table and inbox see it too.
        </>
      }
      padded
    >
      <div className="flex h-full min-h-0 gap-4">
        <div className="min-h-0 flex-1">
          <DataViews.Root data={orders} fields={orderFields} className="h-full">
            <DataViews.Header title="Orders">
              <DataViews.ViewSwitch />
              <DataViews.Spacer />
              <DataViews.ConfigTrigger />
            </DataViews.Header>

            <DataViews.Kanban
              groupBy="status"
              titleField="customer"
              onColumnAction={(columnId) => setLastAction(columnId)}
            />
            <DataViews.Table />

            <DataViews.ConfigPanel />
          </DataViews.Root>
        </div>

        <aside className="flex w-72 shrink-0 flex-col gap-3 overflow-auto">
          <Callout>
            <strong>Try it.</strong> Drag a card to another column, then switch to the <em>List</em>{" "}
            tab — the status followed it. Filter by priority in the config rail first and the hidden
            orders still survive the drop.
          </Callout>

          <Callout>
            Columns come from <code>variants</code> on the group-by field, so a status with no
            records still gets a column. <code>kanbanVariants</code> then renames it (
            <em>Pending → To pack</em>) and sets the pill colour.
          </Callout>

          <div className="rounded-[10px] border border-border-presentation-global-primary p-3">
            <p className="typography-body-small-medium text-content-presentation-global-tertiary">
              onColumnAction
            </p>
            <p className="typography-body-small-regular text-content-presentation-global-primary">
              {lastAction ? `Last: ${lastAction}` : "Click a column's ⋯ button."}
            </p>
          </div>
        </aside>
      </div>
    </ExampleFrame>
  );
}
