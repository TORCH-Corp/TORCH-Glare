"use client";

import React, { createContext, useContext } from "react";
import { LayoutGrid, Table2 } from "lucide-react";
import { DataViewCard } from "../../../layouts/DataViewCard";
import type { FieldConfig } from "../../../utils/dataViews/types";
import { useDataViewsData } from "../context";
import { Cell } from "../cell";
import { buildCardRows } from "./card-rows";
import { TableView } from "./table-view";
import type {
  TreePaneCardsProps,
  TreePaneTabProps,
  TreePaneTableProps,
  TreePaneViewBase,
} from "../types";

/**
 * The tree pane's own views, written the way every other part of this component is: **you render
 * them, and that is what makes them exist**.
 *
 * ```tsx
 * <DataViews.Tree nodes={nodes} labelPath="name">
 *   <DataViews.Tree.Table selectable renderCell={cell} />
 *   <DataViews.Tree.Cards renderCard={card} />
 *   <DataViews.Tree.Tab value="timeline" label="Timeline" icon={<Clock />}>
 *     <Timeline />
 *   </DataViews.Tree.Tab>
 * </DataViews.Tree>
 * ```
 *
 * Render one and the switch disappears, exactly as the header's `ViewSwitch` does with a single
 * view — a switch with one option is a label. Render none and there is no pane at all: the tree
 * is then a hierarchy and nothing else, and it takes the whole width.
 *
 * All three sit inside the pane's data scope, so `useDataViewsData()` in any of them returns the
 * **selected node's** rows rather than the whole set.
 */

const PANE_VIEW = "__dvTreePaneView";

interface PaneViewMeta {
  defaultValue: string;
  defaultLabel: string;
  defaultIcon?: React.ReactNode;
}

/**
 * The tab's own props, stripped off before the rest reaches the view underneath.
 *
 * `label` and `icon` name the *tab*; `DataViews.Table` reads the same two to name itself in the
 * root's switcher, so leaving them on would register the pane's table up in the header.
 */
function withoutTabProps<T extends TreePaneViewBase>(props: T) {
  const rest = { ...props };
  delete rest.value;
  delete rest.label;
  delete rest.icon;
  return rest;
}

interface PaneContextValue {
  mode: string;
  /** Which field labels a row — the tree's `labelPath`, already resolved. */
  labelField?: FieldConfig;
}

const PaneContext = createContext<PaneContextValue>({ mode: "table" });

export const TreePaneProvider = PaneContext.Provider;

function markPaneView<P extends object>(component: React.ComponentType<P>, meta: PaneViewMeta) {
  (component as unknown as Record<string, PaneViewMeta>)[PANE_VIEW] = meta;
  return component;
}

export type PaneViewElement = React.ReactElement<{
  value?: string;
  label?: string;
  icon?: React.ReactNode;
}>;

export function paneViewMetaOf(node: React.ReactNode): PaneViewMeta | undefined {
  if (!React.isValidElement(node)) return undefined;
  return (node.type as unknown as Record<string, PaneViewMeta | undefined>)[PANE_VIEW];
}

export function isPaneViewElement(node: React.ReactNode): node is PaneViewElement {
  return paneViewMetaOf(node) !== undefined;
}

/**
 * Children, with fragments opened out.
 *
 * `React.Children.toArray` stops at a `<>…</>`, so tabs grouped in one — which is what writing
 * them behind a condition produces — would arrive as a single unrecognised child and be read as a
 * whole-pane override. Flattening first is what lets `{cond ? <><Table/><Cards/></> : <Mine/>}`
 * mean what it looks like.
 */
export function flattenChildren(children: React.ReactNode): React.ReactNode[] {
  return React.Children.toArray(children).flatMap((child) =>
    React.isValidElement(child) && child.type === React.Fragment
      ? flattenChildren((child.props as { children?: React.ReactNode }).children)
      : [child],
  );
}

/** `value`, `label` and `icon` as the switch will show them — defaults filled in. */
export function paneViewOption(element: PaneViewElement) {
  const meta = paneViewMetaOf(element)!;
  return {
    value: element.props.value ?? meta.defaultValue,
    label: element.props.label ?? meta.defaultLabel,
    icon: element.props.icon ?? meta.defaultIcon,
  };
}

/** True while this element is the pane's selected mode. */
function useIsActive(element: { value?: string }, defaultValue: string) {
  const { mode } = useContext(PaneContext);
  return mode === (element.value ?? defaultValue);
}

// ─── The three ────────────────────────────────────────────────────────────────

/**
 * The pane as a table — the **real `DataViews.Table`**, not a copy, so it keeps sortable headers,
 * selection, `renderCell`, the drag grip, `+ Add New` and virtualization past 300 rows. It reads
 * its rows from the pane's scope, which is what points it at the selected node.
 *
 * One consequence worth knowing: its headers sort by writing to the **query**, which is how the
 * root fetches. Sort the pane's rows in `paneRows` if you want the order self-contained.
 */
export const PaneTable = markPaneView(function PaneTable(props: TreePaneTableProps) {
  const active = useIsActive({ value: props.value }, "table");
  if (!active) return null;
  return <TableView {...withoutTabProps(props)} />;
}, { defaultValue: "table", defaultLabel: "List", defaultIcon: <Table2 /> });

/**
 * The pane as cards — the same `DataViewCard` the board paints, so a row looks the same in both.
 * `renderCard` replaces it outright with markup of your own.
 */
export const PaneCards = markPaneView(function PaneCards({
  value,
  renderCard,
  className,
}: TreePaneCardsProps) {
  const { labelField } = useContext(PaneContext);
  const { rows, visibleFields, getRowId } = useDataViewsData();
  const active = useIsActive({ value }, "cards");
  if (!active) return null;

  return (
    <div
      className={
        className ??
        "grid grid-cols-1 content-start gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {rows.map((row, index) => {
        const id = getRowId(row, index);
        return (
          <React.Fragment key={id}>
            {renderCard ? (
              renderCard({ row, id, index, fields: visibleFields })
            ) : (
              <DataViewCard
                title={labelField ? <Cell field={labelField} row={row} /> : undefined}
                rows={buildCardRows(
                  visibleFields.filter((f) => f.path !== labelField?.path),
                  row,
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}, { defaultValue: "cards", defaultLabel: "Cards", defaultIcon: <LayoutGrid /> });

/**
 * A mode of your own. Unlike the two above it has no default content — its `children` are the
 * pane while it is selected, and nothing while it is not.
 *
 * `value` is required here: there is no sensible default name for a view only you know about.
 */
export const PaneTab = markPaneView(function PaneTab({ value, children }: TreePaneTabProps) {
  if (!useIsActive({ value }, value)) return null;
  return <>{children}</>;
}, { defaultValue: "", defaultLabel: "Tab" });
