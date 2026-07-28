"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../utils/cn";
import { formBarItemStyles } from "../TabFormItem";
import { FormHeaderBar, type HeaderVariant } from "../FormBuilder/header";

/**
 * Detail-tabs — a display-only view where a left **sidebar** switches the main area between
 * **`FormBuilder.Section` panels** (a detail page, not a form). It lives on `FormRenderer`
 * (`FormRenderer.Sidebar` / `.Sidebar.Item` / `.Tab`) so `FormBuilder` stays form-only. Built on
 * the same Radix Tabs primitive shadcn uses: the sidebar is the `Tabs.List`, each `Sidebar.Item` a
 * `Tabs.Trigger`, each `Tab` a `Tabs.Content` — so the fixed rail and the panels share tab state.
 */

export interface DetailSidebarProps {
  children: React.ReactNode;
}

/**
 * `FormRenderer.Sidebar` — the tab rail, sitting where a `FormBuilder.Stepper`'s nav would.
 * Renders **nothing itself**: the FormRenderer root detects it and places its `Sidebar.Item`
 * children (the tab triggers) into the fixed rail.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- children are read by the FormRenderer root
function DetailSidebarRoot(_props: DetailSidebarProps) {
  return null;
}
(DetailSidebarRoot as unknown as { __isDetailSidebar: boolean }).__isDetailSidebar = true;

export interface DetailSidebarItemProps {
  /** Ties this row to the `FormRenderer.Tab` of the same `value` — clicking it shows that panel. */
  value: string;
  /** Leading icon (e.g. a Remix `<i className="ri-…" />`). */
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * `FormRenderer.Sidebar.Item` — a rail nav row, rendered as a Radix `Tabs.Trigger` styled with the
 * `TabFormItem` `tree` look. Radix drives the active state (`data-state="active"` → black pill).
 */
function DetailSidebarItem({ value, icon, children }: DetailSidebarItemProps) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className={cn(
        formBarItemStyles({ componentType: "tree" }),
        "h-[32px] w-full justify-start gap-2 rounded-[10px] px-[6px] [&_i]:text-[16px]",
        // Radix sets `data-state` on the trigger; the active tab is the filled (black) pill.
        "data-[state=active]:bg-background-presentation-tab-topbar-selected data-[state=active]:text-content-presentation-tab-action-selected",
        "data-[state=active]:hover:bg-background-presentation-tab-topbar-selected data-[state=active]:hover:px-[6px]",
      )}
    >
      {icon}
      <span className="flex-1 truncate text-left typography-body-medium-medium">{children}</span>
    </TabsPrimitive.Trigger>
  );
}

export const DetailSidebar = Object.assign(DetailSidebarRoot, {
  Item: DetailSidebarItem,
});

export function isDetailSidebarElement(
  node: React.ReactNode,
): node is React.ReactElement<DetailSidebarProps> {
  return (
    React.isValidElement(node) &&
    (node.type as { __isDetailSidebar?: boolean })?.__isDetailSidebar === true
  );
}

export interface DetailRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

/**
 * `FormRenderer.Row` — a read-only label/value cell for detail content (the display counterpart of a
 * form field). Drop several inside a `FormRenderer.Grid` within a `FormBuilder.Section`.
 */
export function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="typography-body-small-regular text-content-presentation-global-secondary">
        {label}
      </span>
      <span className="typography-body-medium-medium text-content-presentation-global-primary">
        {value}
      </span>
    </div>
  );
}

export interface DetailGridProps {
  /** Column count (default 2). */
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
}

const GRID_COLS: Record<NonNullable<DetailGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

/**
 * `FormRenderer.Grid` — arranges `FormRenderer.Row`s in an equal-column grid spanning the **full
 * section width** (default 2 columns, so cells split in half). Padded so the rows breathe inside a
 * `FormBuilder.Section` (clear of the title badge, roomy row + column spacing).
 */
export function DetailGrid({ columns = 2, children }: DetailGridProps) {
  return (
    <div className={cn("grid w-full gap-x-12 gap-y-5 py-3", GRID_COLS[columns])}>{children}</div>
  );
}

export interface DetailTabProps {
  /** Ties this panel to the `Sidebar.Item` of the same `value`. */
  value: string;
  /** The panel body — typically `FormBuilder.Section` display blocks. */
  children: React.ReactNode;
}

/**
 * `FormRenderer.Tab` — a content panel shown when its `value` is the active tab. Renders
 * **nothing itself**: the FormRenderer root detects it and mounts it as a Radix `Tabs.Content`
 * (kept mounted, inactive ones hidden).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- read by the FormRenderer root
export function DetailTab(_props: DetailTabProps) {
  return null;
}
(DetailTab as unknown as { __isDetailTab: boolean }).__isDetailTab = true;

export function isDetailTabElement(
  node: React.ReactNode,
): node is React.ReactElement<DetailTabProps> {
  return (
    React.isValidElement(node) && (node.type as { __isDetailTab?: boolean })?.__isDetailTab === true
  );
}

export interface DetailTabsViewProps {
  header?: { title: string; label?: string; variant?: HeaderVariant };
  /** Header action buttons (Print / Approve / …). */
  actions?: React.ReactNode;
  /** The `FormRenderer.Sidebar` element — its children are the tab triggers. */
  sidebar: React.ReactElement<DetailSidebarProps>;
  /** The `FormRenderer.Tab` elements — the content panels. */
  tabs: React.ReactElement<DetailTabProps>[];
  className?: string;
}

/**
 * The detail-tabs surface: the floating header over a fixed left rail (the sidebar) + a scrolling
 * content column showing the active tab. Radix `Tabs.Root` owns the state (uncontrolled, defaults to
 * the first tab). The rail matches the stepper's rail position; only the content column scrolls.
 */
export function DetailTabsView({ header, actions, sidebar, tabs, className }: DetailTabsViewProps) {
  const defaultValue = tabs[0]?.props.value;

  return (
    <TabsPrimitive.Root
      orientation="vertical"
      defaultValue={defaultValue}
      className={cn("h-full w-full @container", className)}
    >
      {/* Scroll shell — mirrors FormBuilder's: the absolute header floats over the body. */}
      <div className="relative isolate flex h-full w-full flex-col overflow-hidden rounded-2xl bg-background-presentation-body-primary">
        {header && (
          <FormHeaderBar title={header.title} label={header.label} variant={header.variant}>
            {actions}
          </FormHeaderBar>
        )}

        <div className="relative z-[1] flex min-h-0 w-full flex-1 flex-row">
          {/* The fixed rail — the tab list. `pt-[72px]` clears the floating header. */}
          <TabsPrimitive.List asChild>
            <aside className="flex h-full w-[216px] shrink-0 flex-col gap-1 overflow-y-auto border-r border-border-presentation-global-primary bg-black-alpha-5 px-2 pb-6 pt-[72px] scrollbar-hide">
              {sidebar.props.children}
            </aside>
          </TabsPrimitive.List>

          {/* The only scrolling region — the active tab's Sections. */}
          <div className="flex min-h-0 w-full flex-1 flex-col overflow-y-auto px-6 py-6 pt-[72px] scrollbar-hide">
            <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-4">
              {tabs.map((panel) => (
                <TabsPrimitive.Content
                  key={panel.props.value}
                  value={panel.props.value}
                  forceMount
                  className="flex flex-col gap-4 outline-none data-[state=inactive]:hidden"
                >
                  {panel.props.children}
                </TabsPrimitive.Content>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TabsPrimitive.Root>
  );
}
