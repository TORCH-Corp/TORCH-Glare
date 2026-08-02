"use client";

import { CalendarClock } from "lucide-react";

import {
  DataViews,
  ViewSurface,
  useRegisterView,
  useViewData,
  renderField,
} from "@/components/DataViews";
import { getByPath } from "@/utils/dataViews/pathUtils";
import { orders, orderFields } from "../_data";
import { Callout, ExampleFrame } from "../_shared";

/**
 * A consumer-authored view.
 *
 * The whole contract is `useRegisterView` — announce an id, label, and icon,
 * and it returns whether you are the active view. That is all `DataViews.Table`
 * and friends do; there is no privileged built-in path.
 */
function TimelineView({ label = "Timeline" }: { label?: string }) {
  const active = useRegisterView({ id: "timeline", label, icon: <CalendarClock /> });
  return active ? <TimelineBody /> : null;
}

/**
 * Hooks live in an inner component so they only run while the view is on
 * screen — the same split every built-in view uses.
 */
function TimelineBody() {
  // Filtering and field resolution come free; `sort: true` also honours the
  // config rail's Default Sort.
  const { records, displayFields } = useViewData({ sort: true });

  const dateField = displayFields.find((f) => f.path === "createdAt");
  const titleField = displayFields.find((f) => f.path === "customer");

  return (
    <ViewSurface>
      <div className="h-full overflow-auto bg-background-presentation-form-base p-6">
        {records.length === 0 ? (
          <p className="text-content-presentation-global-tertiary">Nothing matches the filters.</p>
        ) : (
          <ol className="relative flex flex-col gap-4 border-l border-border-presentation-global-primary pl-6">
            {records.map((record, idx) => (
              <li key={idx} className="relative">
                <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full bg-border-presentation-state-focus" />
                <div className="flex flex-col gap-1">
                  <span className="typography-body-small-regular text-content-presentation-global-tertiary">
                    {dateField
                      ? renderField(getByPath(record, dateField.path), dateField, record)
                      : null}
                  </span>
                  <span className="typography-body-large-medium text-content-presentation-global-primary">
                    {titleField ? String(getByPath(record, titleField.path)) : `#${idx + 1}`}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {displayFields
                      .filter((f) => f.path !== "createdAt" && f.path !== "customer")
                      .map((f) => (
                        <span key={f.path}>
                          {renderField(getByPath(record, f.path), f, record)}
                        </span>
                      ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </ViewSurface>
  );
}

export default function CustomViewPage() {
  return (
    <ExampleFrame
      title="Custom view"
      description={
        <>
          A view DataViews knows nothing about, rendered as a tab beside the built-ins. It reads
          filtered records from <code>useViewData</code> and wraps itself in{" "}
          <code>ViewSurface</code> so it inherits the same card chrome.
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

            {/* Written first, so it is the first tab. */}
            <TimelineView />
            <DataViews.Table />

            <DataViews.ConfigPanel />
          </DataViews.Root>
        </div>

        <aside className="flex w-72 shrink-0 flex-col gap-3 overflow-auto">
          <Callout>
            <strong>Try it.</strong> Filter by status in the config rail — the timeline narrows too,
            because <code>useViewData</code> applies the same filter pipeline the built-in views
            use. Change the Default Sort and the order follows.
          </Callout>

          <Callout>
            The <code>ViewId</code> type is <code>ViewType | (string &amp; {})</code>, so{" "}
            <code>&quot;timeline&quot;</code> is accepted while the four built-in ids still
            autocomplete.
          </Callout>
        </aside>
      </div>
    </ExampleFrame>
  );
}
