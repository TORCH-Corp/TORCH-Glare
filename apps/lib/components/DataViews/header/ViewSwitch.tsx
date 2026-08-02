"use client";

import { TabSwitch } from "../../TabSwitch";
import { useDataViews } from "../context";

export type ViewSwitchProps = {
  className?: string;
};

/**
 * Segmented tab bar over the registered views.
 *
 * Renders one tab per view the consumer actually mounted, in the order they
 * wrote them — reorder the `<DataViews.Table />` / `<DataViews.Kanban />`
 * elements to reorder the tabs, and pass each a `label` to relabel it.
 *
 * Built on the library's `TabSwitch`, which is already generic, controlled,
 * cva-styled, and theme-aware.
 */
export function DataViewsViewSwitch({ className }: ViewSwitchProps) {
  const { registeredViews, currentView, setCurrentView } = useDataViews();

  if (registeredViews.length < 2) return null;

  return (
    <TabSwitch
      // The header bar is always dark, so the switcher resolves dark-theme
      // tokens regardless of the host app's theme.
      theme="dark"
      className={className}
      value={currentView}
      onValueChange={setCurrentView}
      options={registeredViews.map((view) => ({
        value: view.id,
        label: view.label,
        icon: view.icon,
      }))}
    />
  );
}
