"use client";

import { DataViews, type FieldConfig } from "@/components/DataViews";
import { Badge } from "@/components/Badge";
import { showcase, showcaseFields } from "../_data";
import { Callout, ExampleFrame } from "../_shared";

/**
 * Every `FieldType` in one table, plus the `render` escape hatch.
 *
 * `showcaseFields` in `_data.ts` declares the 17 built-in renderers with the
 * options each one reads; this page appends a custom-rendered column so the two
 * sit side by side.
 */
const fields: FieldConfig[] = [
  ...showcaseFields,
  {
    // `render` wins over `type` entirely — you get the raw value and the row.
    path: "completion",
    label: "Custom render",
    render: (value, row) => {
      const pct = Number(value);
      const tone = pct >= 70 ? "green" : pct >= 40 ? "yellow" : "red";
      return (
        <div className="flex items-center gap-2">
          <Badge color={tone} badgeStyle="subtle" label={`${pct}%`} size="XS" />
          <span className="text-xs text-content-presentation-global-secondary">
            {String(row.name)}
          </span>
        </div>
      );
    },
  },
];

export default function FieldsPage() {
  return (
    <ExampleFrame
      title="Field types"
      description={
        <>
          All 17 renderers, each configured with the options it actually reads. Scroll the table
          horizontally — every column is a different <code>type</code>.
        </>
      }
      padded
    >
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <Callout>
            <strong>two-line</strong> pulls its second line from <code>secondaryPath</code>.{" "}
            <strong>avatar</strong> falls back to initials from <code>fallbackPath</code> — row 3
            has no image URL. <strong>badge-array</strong> caps at <code>limit</code> and shows{" "}
            <code>+N</code>. <strong>progress-bar</strong> colours by <code>thresholds</code>.{" "}
            <strong>hidden</strong> renders nothing and is absent from the config rail&apos;s column
            list.
          </Callout>
        </div>

        <div className="min-h-0 flex-1">
          <DataViews.Root data={showcase} fields={fields} className="h-full">
            <DataViews.Header title="Field types">
              <DataViews.Spacer />
              <DataViews.ConfigTrigger />
            </DataViews.Header>

            <DataViews.Table />

            <DataViews.ConfigPanel />
          </DataViews.Root>
        </div>
      </div>
    </ExampleFrame>
  );
}
