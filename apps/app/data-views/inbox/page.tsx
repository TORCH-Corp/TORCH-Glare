"use client";

import { useState } from "react";

import { DataViews } from "@/components/DataViews";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { orders, orderFields, type Order } from "../_data";
import { Callout, ExampleFrame } from "../_shared";

export default function InboxPage() {
  const [customDetail, setCustomDetail] = useState(false);

  return (
    <ExampleFrame
      title="Inbox"
      description={
        <>
          A quick-filter rail, the record list, and a detail pane. Which fields carry the starred /
          priority / attachment flags is either declared or auto-detected from the data.
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

            <DataViews.Inbox
              config={{
                starredField: "isStarred",
                priorityField: "priority",
                attachmentField: "hasAttachment",
                titlePath: "customer",
                previewPath: "region",
              }}
              renderDetail={customDetail ? renderOrderDetail : undefined}
            />

            <DataViews.ConfigPanel />
          </DataViews.Root>
        </div>

        <aside className="flex w-72 shrink-0 flex-col gap-3 overflow-auto">
          <Callout>
            <strong>Try it.</strong> Use the left rail to narrow to <em>Starred</em> or{" "}
            <em>Priority</em>, then star a row from the detail pane and watch the counts move.
          </Callout>

          <Button
            size="M"
            variant={customDetail ? "PrimeStyle" : "BorderStyle"}
            onClick={() => setCustomDetail((v) => !v)}
          >
            {customDetail ? "Using renderDetail" : "Use the built-in detail pane"}
          </Button>

          <Callout>
            Drop <code>config</code> entirely and the flags are detected from the first record —{" "}
            <code>isStarred</code>, <code>priority</code>, and <code>hasAttachment</code> all match
            known key patterns. Pass <code>null</code> for a field to switch that feature off rather
            than let detection find it.
          </Callout>

          <Callout>
            <em>Show Preview Pane</em> in the config rail toggles{" "}
            <code>config.showPreviewPane</code>.
          </Callout>
        </aside>
      </div>
    </ExampleFrame>
  );
}

/** A `renderDetail` override: you own the pane completely. */
function renderOrderDetail(item: Record<string, unknown> | null) {
  if (!item) {
    return (
      <div className="flex h-full items-center justify-center text-content-presentation-global-tertiary">
        Pick an order.
      </div>
    );
  }

  const order = item as unknown as Order;

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-6">
      <div className="flex items-center gap-3">
        <h2 className="typography-headers-medium-medium text-content-presentation-global-primary">
          {order.customer}
        </h2>
        <Badge color="blue" badgeStyle="subtle" label={order.status} size="S" />
      </div>
      <dl className="grid grid-cols-2 gap-3">
        {(
          [
            ["Order #", order.id],
            ["Region", order.region],
            ["Priority", order.priority],
            ["Created", order.createdAt],
            ["Total", `$${order.total.toLocaleString()}`],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="flex flex-col">
            <dt className="typography-body-small-medium text-content-presentation-global-tertiary">
              {label}
            </dt>
            <dd className="typography-body-medium-regular text-content-presentation-global-primary">
              {String(value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
