"use client";

import { DataViewsPreset } from "./preset";
import { DataViewsRoot } from "./root";
import { DataViewsHeader, DataViewsHeaderSpacer } from "./header/Header";
import { DataViewsSearch } from "./header/Search";
import { DataViewsViewSwitch } from "./header/ViewSwitch";
import { DataViewsAction } from "./header/Action";
import { DataViewsConfigTrigger } from "./header/ConfigTrigger";
import { Table as DataViewsTable } from "./views/table";
import { DataViewsKanban } from "./views/Kanban";
import { DataViewsInbox } from "./views/Inbox";
import { DataViewsTree } from "./views/Tree";
import { DataViewsConfigPanel } from "./config/ConfigPanel";

/**
 * DataViews — one record set, rendered as any combination of table, board,
 * inbox, and tree.
 *
 * Call it directly for the standard screen:
 *
 * ```tsx
 * <DataViews title="Orders" data={orders} fields={orderFields} />
 * ```
 *
 * …or compose the parts when you need a different arrangement. `Root` owns the
 * state; each view registers itself with the tab bar, in JSX order:
 *
 * ```tsx
 * <DataViews.Root data={orders} fields={orderFields}>
 *   <DataViews.Header title="Orders">
 *     <DataViews.ViewSwitch />
 *     <DataViews.Spacer />
 *     <DataViews.ConfigTrigger />
 *   </DataViews.Header>
 *
 *   <DataViews.Table />
 *   <DataViews.Kanban groupBy="status" />
 *
 *   <DataViews.ConfigPanel />
 * </DataViews.Root>
 * ```
 */
export const DataViews = Object.assign(DataViewsPreset, {
  Root: DataViewsRoot,

  Header: DataViewsHeader,
  Spacer: DataViewsHeaderSpacer,
  Search: DataViewsSearch,
  ViewSwitch: DataViewsViewSwitch,
  Action: DataViewsAction,
  ConfigTrigger: DataViewsConfigTrigger,

  Table: DataViewsTable,
  Kanban: DataViewsKanban,
  Inbox: DataViewsInbox,
  Tree: DataViewsTree,

  ConfigPanel: DataViewsConfigPanel,
});

// --- escape hatches ---------------------------------------------------------
// State and rendering primitives, for consumers building something the
// compound parts don't cover.

export { useDataViews, useRegisterView } from "./context";
export type { DataViewsContextValue, RegisteredView } from "./context";

export { useDataViewsState } from "../../hooks/useDataViewsState";
export type { UseDataViewsStateOptions } from "../../hooks/useDataViewsState";

export { useViewData } from "../../hooks/useViewData";
export type { UseViewDataOptions, ViewData } from "../../hooks/useViewData";

export { TableGrid } from "./views/table";

// --- headless layer ---------------------------------------------------------
// The behaviour behind each view, for building your own UI on top.

export { useTableView } from "../../hooks/dataViews/useTableView";
export type { UseTableViewResult, TableRow } from "../../hooks/dataViews/useTableView";
export { useSelection } from "../../hooks/dataViews/useSelection";
export type { SelectionApi } from "../../hooks/dataViews/useSelection";
export { ViewSurface } from "./views/ViewSurface";
export { InboxViewCard } from "./views/InboxCard";
export { DataViewRadio } from "./DataViewRadio";
export { FilterPanel } from "./filters/FilterPanel";

export { renderField } from "./fieldRenderers";
export { resolveBadgeVariant } from "./badgeAdapter";
export type { ResolvedBadgeProps } from "./badgeAdapter";

// --- types ------------------------------------------------------------------

export type { DataViewsProps } from "./preset";
export type { DataViewsRootProps } from "./root";
export type { HeaderProps } from "./header/Header";
export type { SearchProps } from "./header/Search";
export type { ViewSwitchProps } from "./header/ViewSwitch";
export type { ActionProps } from "./header/Action";
export type { ConfigTriggerProps } from "./header/ConfigTrigger";
export type { TableProps } from "./views/Table";
export type { KanbanProps } from "./views/Kanban";
export type { InboxProps } from "./views/Inbox";
export type { TreeProps } from "./views/Tree";
export type { InboxViewCardProps } from "./views/InboxCard";
export type { ConfigPanelProps } from "./config/ConfigPanel";
export type { DataViewRadioProps } from "./DataViewRadio";

export * from "./types";
