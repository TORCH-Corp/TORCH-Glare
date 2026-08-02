"use client";

import { DataViews } from "@/components/DataViews";
import { orders } from "../_data";
import { ExampleFrame } from "../_shared";

/**
 * Zero configuration: no `fields` prop at all. Types are inferred from key
 * names and values — `status` / `priority` become badges, `createdAt` becomes a
 * formatted date, `total` reads as currency.
 */
export default function BasicPage() {
  return (
    <ExampleFrame
      title="Basic"
      description={
        <>
          The config-driven preset with nothing but <code>data</code>. Fields are auto-detected, so
          this is what a raw API response looks like before you describe it. Compare the{" "}
          <strong>Field types</strong> page for what declaring them buys you.
        </>
      }
    >
      <DataViews title="Orders" data={orders} className="h-full" />
    </ExampleFrame>
  );
}
