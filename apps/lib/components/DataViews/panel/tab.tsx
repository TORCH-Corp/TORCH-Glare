"use client";

import React from "react";
import { useDataViewsPanelTabs } from "../context";
import type { PanelTabProps } from "../types";

const TAB_MARKER = "__dvPanelTab";

/**
 * One tab in the panel. It renders its own children when it is the open tab and nothing when it
 * is not, so a tab is declared and filled in one place:
 *
 * ```tsx
 * <DataViews.Panel.Tab value="columns" label="Columns">
 *   <DataViews.Panel.Columns />
 * </DataViews.Panel.Tab>
 * ```
 */
export function Tab({ value, children }: PanelTabProps) {
  const { tab } = useDataViewsPanelTabs();
  if (tab !== value) return null;
  return <>{children}</>;
}
(Tab as unknown as Record<string, boolean>)[TAB_MARKER] = true;

export function isTabElement(node: React.ReactNode): node is React.ReactElement<PanelTabProps> {
  return (
    React.isValidElement(node) &&
    (node.type as unknown as Record<string, unknown>)?.[TAB_MARKER] === true
  );
}
