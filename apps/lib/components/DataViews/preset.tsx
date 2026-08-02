"use client";

import { forwardRef, type ElementType, type ReactNode } from "react";
import type { DynamicRecord, InboxConfig, ViewVisibility } from "./types";
import { DataViewsRoot, type DataViewsRootProps } from "./root";
import { DataViewsHeader, DataViewsHeaderSpacer } from "./header/Header";
import { DataViewsSearch } from "./header/Search";
import { DataViewsViewSwitch } from "./header/ViewSwitch";
import { DataViewsAction } from "./header/Action";
import { DataViewsConfigTrigger } from "./header/ConfigTrigger";
import { DataViewsTable } from "./views/Table";
import { DataViewsKanban } from "./views/Kanban";
import { DataViewsInbox } from "./views/Inbox";
import { DataViewsTree } from "./views/Tree";
import { DataViewsConfigPanel } from "./config/ConfigPanel";

/** Frozen so the `?? ` fallback does not hand `DataViews.Tree` a fresh object
 *  on every render, which would churn its memoized tree shape. */
const NO_TREE_CONFIG = Object.freeze({});

export type DataViewsProps = Omit<DataViewsRootProps, "children"> & {
  title?: string;
  /** Which view tabs to render. Every view defaults to on; `tree` additionally
   *  requires the data to actually have a hierarchy. */
  views?: ViewVisibility;

  showHeader?: boolean;
  showConfig?: boolean;

  kanbanGroupBy?: string;
  kanbanTitleField?: string;
  onKanbanColumnAction?: (columnId: string) => void;

  inboxConfig?: InboxConfig;
  inboxItemHref?: (item: DynamicRecord, id: unknown) => string;
  inboxLinkComponent?: ElementType;
  inboxSelectedId?: unknown;
  inboxRenderDetail?: (item: DynamicRecord | null) => ReactNode;

  onAddNew?: () => void;
  addNewLabel?: string;

  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
};

/**
 * Config-driven DataViews — the default layout in one element.
 *
 * This is a thin arrangement of the compound parts, nothing more: everything it
 * does is reachable by writing `<DataViews.Root>` and the children yourself.
 * Reach for the compound form when you need a different arrangement (a custom
 * header, a view outside the tab bar, two views side by side); reach for this
 * when you want the standard screen.
 */
export const DataViewsPreset = forwardRef<HTMLDivElement, DataViewsProps>(
  function DataViews(props, ref) {
    const {
      title = "Data Views",
      views,
      showHeader = true,
      showConfig = true,
      kanbanGroupBy,
      kanbanTitleField,
      onKanbanColumnAction,
      inboxConfig,
      inboxItemHref,
      inboxLinkComponent,
      inboxSelectedId,
      inboxRenderDetail,
      onAddNew,
      addNewLabel,
      searchValue,
      onSearchChange,
      searchPlaceholder,
      ...rootProps
    } = props;

    const show = (view: keyof ViewVisibility) => views?.[view] ?? true;

    return (
      <DataViewsRoot ref={ref} {...rootProps}>
        {showHeader && (
          <DataViewsHeader title={title}>
            <DataViewsViewSwitch />
            <DataViewsHeaderSpacer />
            {onSearchChange && (
              <DataViewsSearch
                value={searchValue ?? ""}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
              />
            )}
            {onAddNew && <DataViewsAction onClick={onAddNew}>{addNewLabel}</DataViewsAction>}
            {showConfig && <DataViewsConfigTrigger />}
          </DataViewsHeader>
        )}

        {show("table") && <DataViewsTable />}
        {show("kanban") && (
          <DataViewsKanban
            groupBy={kanbanGroupBy}
            titleField={kanbanTitleField}
            onColumnAction={onKanbanColumnAction}
          />
        )}
        {show("inbox") && (
          <DataViewsInbox
            config={inboxConfig}
            itemHref={inboxItemHref}
            linkComponent={inboxLinkComponent}
            selectedId={inboxSelectedId}
            renderDetail={inboxRenderDetail}
          />
        )}
        {show("tree") && <DataViewsTree {...(rootProps.treeConfig ?? NO_TREE_CONFIG)} />}

        {showConfig && <DataViewsConfigPanel />}
      </DataViewsRoot>
    );
  },
);
