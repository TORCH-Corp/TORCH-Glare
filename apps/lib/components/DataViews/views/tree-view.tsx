"use client";

import React, { useMemo } from "react";
import { cn } from "../../../utils/cn";
import { getByPath } from "../../../utils/dataViews/path";
import type { FieldConfig, Row, TreeNode } from "../../../utils/dataViews/types";
import { TreeFolder, type TreeFolderNode } from "../../TreeFolder";
import { TabSwitch } from "../../TabSwitch";
import {
  PaneCards,
  PaneTab,
  PaneTable,
  TreePaneProvider,
  flattenChildren,
  isPaneViewElement,
  paneViewOption,
  type PaneViewElement,
} from "./pane-views";
import { SkeletonBar } from "../states";
import { useControllable } from "../hooks/useControllable";
import { DataContext, useDataViewsData, useDataViewsView } from "../context";
import { markView } from "../slots";
import type { TreePaneMode, TreeViewProps } from "../types";

/** Depth-first lookup by id. The tree is a shape the caller built, so there is no index to keep. */
function findNode(nodes: readonly TreeNode[], id: string | null): TreeNode | null {
  if (!id) return null;
  for (const node of nodes) {
    if (node.id === id) return node;
    const hit = findNode(node.children, id);
    if (hit) return hit;
  }
  return null;
}

/**
 * The pane beside the tree — the selected node's rows, in whichever tab is showing.
 *
 * The pane holds three things and owns none of them: a header (the node's name, its record count,
 * your `paneActions`), a switch built from the tabs you rendered, and the tabs themselves. Each
 * tab decides on its own whether it is the one showing, so adding a mode is rendering a component
 * rather than extending a union here.
 *
 * Both scopes the tabs need are set up here: rows swapped to the node's, so a tab's
 * `useDataViewsData()` sees what the pane lists rather than the whole set; and the mode, so each
 * tab can self-select.
 */
function TreePane({
  node,
  rows,
  labelField,
  mode,
  onModeChange,
  actions,
  tabs,
}: {
  node: TreeNode | null;
  rows: readonly Row[];
  labelField?: FieldConfig;
  mode: TreePaneMode;
  onModeChange: (mode: TreePaneMode) => void;
  actions?: TreeViewProps["paneActions"];
  tabs: PaneViewElement[];
}) {
  const data = useDataViewsData();

  // The pane paints a different row set from the root's, and everything inside it reads `rows`
  // from context — so the swap happens here, once, rather than as a prop on each child.
  const scoped = useMemo(() => ({ ...data, rows }), [data, rows]);
  const paneCtx = useMemo(() => ({ mode: String(mode), labelField }), [mode, labelField]);

  // The title is the node's label as a **string**, not a `Cell`. A label field of kind
  // `enum-badge` would paint a Badge chip, and a chip inside display-size uppercase type is not a
  // title — it is a chip in the wrong place.
  const title =
    (node && labelField ? String(getByPath(node.row, labelField.path) ?? "") : "") || "Items";

  const options = tabs.map(paneViewOption);

  return (
    <DataContext.Provider value={scoped}>
      <TreePaneProvider value={paneCtx}>
        <div className="flex min-h-0 flex-1 flex-col">
          {/* The header belongs to the pane, not to the selection: it stays up with nothing chosen
              so the switch is reachable and the pane is not a blank rounded box. Same
              `display-medium-medium` + `uppercase` + `cv05` recipe as the rail's own header band,
              so the two read as one row across the screen. */}
          <div className="border-border-presentation-global-primary flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2">
            {/* `min-w-0` on the left group is what makes the title truncate before the switch
                starts shrinking. */}
            <div className="flex min-w-0 items-center gap-2">
              <span
                style={{ fontFeatureSettings: "'cv05' on" }}
                className="typography-display-medium-medium text-content-presentation-global-primary truncate uppercase"
              >
                {title}
              </span>
              <div className="bg-border-presentation-global-primary h-6 w-px shrink-0" />
              <span className="typography-body-medium-regular text-content-presentation-global-secondary truncate">
                {node ? `${rows.length} record${rows.length === 1 ? "" : "s"}` : "Select an item"}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {/* Your slot, before the switch so the switch keeps the corner it is drawn in. */}
              {actions}

              {/* One tab is a label, not a choice — the same rule `ViewSwitch` follows. The
                  `TabSwitch` default size is 24px tall with 14px icons, the metrics this pane is
                  drawn at, and it takes no `theme`: unlike `ViewSwitch` on the dark header bar,
                  the pane sits in the light content area. */}
              {options.length > 1 && (
                <TabSwitch
                  options={options}
                  value={String(mode)}
                  onValueChange={(next) => onModeChange(next)}
                />
              )}
            </div>
          </div>

          {/* Nothing selected is shown as nothing — the header already says "Select an item". */}
          <div className="min-h-0 flex-1 overflow-auto">{node ? tabs : null}</div>
        </div>
      </TreePaneProvider>
    </DataContext.Provider>
  );
}

/** The tree's own metrics, so a skeleton row occupies exactly what a real node will. */
const TREE_ROW_HEIGHT = 28;
const TREE_INDENT = 14;
const SKELETON_NODES = [0, 1, 1, 0, 1, 1, 0] as const;

/**
 * The loading tree.
 *
 * Depths alternate so it reads as a hierarchy rather than a list, and each row is `TreeFolder`'s
 * own 28px at its 14px indent — the nodes land exactly where the shimmer was.
 */
function SkeletonNodes() {
  return (
    <div className="flex flex-col px-2 py-1">
      {SKELETON_NODES.map((depth, i) => (
        <div
          key={`skeleton-${i}`}
          className="flex items-center gap-2"
          style={{ height: TREE_ROW_HEIGHT, paddingInlineStart: 6 + depth * TREE_INDENT }}
        >
          <SkeletonBar className="h-[14px] w-[14px] shrink-0 rounded-[3px]" />
          <SkeletonBar className={depth === 0 ? "w-[60%]" : "w-[45%]"} />
        </div>
      ))}
    </div>
  );
}

/**
 * `DataViews.Tree` — a hierarchy on the left, whatever you put in `children` on the right.
 *
 * The rail is the shared `TreeFolder`, which is where the row height, the indent, the connector
 * lines, the selection band, the breadcrumb and the drag grip come from. Hand-rolling those is how
 * this view stops looking like the file tree everywhere else in the product.
 *
 * You build `nodes`. The tree never derives a hierarchy from flat rows: which field is the parent
 * key, whether orphans become roots, how cycles are handled — those are decisions only you can
 * make correctly, and guessing them was most of what the old implementation got wrong.
 */
function TreeViewImpl({
  nodes,
  labelPath,
  renderNode,
  expanded,
  onExpandedChange,
  onNodeMove,
  paneMode,
  defaultPaneMode,
  onPaneModeChange,
  paneRows,
  paneActions,
  children,
  className,
}: TreeViewProps) {
  const { visibleFields, loading } = useDataViewsData();
  // Selection is the root's `activeId`, the same one the inbox and board use — so a detail pane
  // works the same wherever it is rendered, and there is one "what is selected" in the component.
  const { activeId, setActiveId } = useDataViewsView();

  const labelField =
    (labelPath && visibleFields.find((f) => f.path === labelPath)) || visibleFields[0];

  const [openIds, setOpenIds] = useControllable<readonly string[]>(
    expanded,
    onExpandedChange,
    nodes.filter((n) => n.children.length > 0).map((n) => n.id),
  );

  const folderData = useMemo(
    () => nodes.map((node) => toFolderNode(node, labelField, visibleFields, renderNode)),
    [nodes, labelField, visibleFields, renderNode],
  );

  // ── The pane ──────────────────────────────────────────────────────────────

  /**
   * Children split two ways: the pane's tabs, and everything else.
   *
   * Everything else *is* the pane — the whole-pane override, header and switch included, which is
   * what every tree written before these tabs existed passes.
   *
   * Pass **nothing** and there is no pane at all: a part exists because you rendered it, and the
   * pane is no more exempt from that than the table or the rail. A tree with no tabs is a
   * hierarchy, and it takes the whole width.
   */
  const { tabs, override } = useMemo(() => {
    const all = flattenChildren(children);
    return {
      tabs: all.filter(isPaneViewElement),
      override: all.filter((child) => !isPaneViewElement(child)),
    };
  }, [children]);

  const hasPane = override.length > 0 || tabs.length > 0;

  // The starting mode is the **first tab's**, not a hardcoded `"table"` — a pane whose only tab is
  // yours has to open on it, and would otherwise sit blank on a `"table"` that matches nothing and
  // is not reachable, since one tab draws no switch.
  const [mode, setMode] = useControllable(
    paneMode,
    onPaneModeChange,
    defaultPaneMode ?? (tabs[0] ? paneViewOption(tabs[0]).value : ""),
  );

  const selectedNode = useMemo(() => findNode(nodes, activeId), [nodes, activeId]);

  /**
   * What the pane lists. A branch shows what is **under** it — a synthetic grouping node has no
   * meaningful row of its own — and a leaf, having no descendants, shows itself.
   */
  const paneRowsForNode = useMemo<readonly Row[]>(() => {
    if (!selectedNode) return [];
    if (paneRows) return paneRows(selectedNode);
    const out: Row[] = [];
    const walk = (node: TreeNode) => {
      for (const child of node.children) {
        out.push(child.row);
        walk(child);
      }
    };
    walk(selectedNode);
    return out.length > 0 ? out : [selectedNode.row];
  }, [selectedNode, paneRows]);

  return (
    // A split view, so the gap between the rail and the pane is part of the design: it paints the
    // shell's black over the Master Container's surface, and the two cards float on it. The table
    // and board fill their container instead, which is why only these two do this.
    <div className={cn("flex h-full gap-2 bg-black", className)}>
      <div
        className={cn(
          "border-border-presentation-global-primary bg-background-presentation-form-base flex flex-col overflow-hidden rounded-[16px] border",
          // Beside a pane the rail is a fixed 256px column; with no pane there is nothing to
          // divide the width with, so it takes all of it.
          hasPane ? "w-64 shrink-0" : "min-w-0 flex-1",
        )}
      >
        <div className="border-border-presentation-global-primary border-b px-3 py-2">
          <span
            style={{ fontFeatureSettings: "'cv05' on" }}
            className="typography-display-medium-medium text-content-presentation-global-primary uppercase"
          >
            {labelField?.label ?? "categories"}
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <SkeletonNodes />
          ) : (
          <TreeFolder
            data={folderData}
            selectedId={activeId}
            onSelectionChange={(id) => setActiveId(id ?? null)}
            expandedIds={[...openIds]}
            onExpandedChange={(next) => setOpenIds(next)}
            dndEnabled={Boolean(onNodeMove)}
            onMove={({ dragIds, parentId, index }) =>
              // `TreeFolder` reports a drop as "these ids, into this parent, at this index".
              // `MoveIntent` is one row at a time, so a multi-select drag emits one intent each.
              dragIds.forEach((id) => onNodeMove?.({ id, from: null, to: parentId, index }))
            }
            showHeader={false}
            showBreadcrumb
            highlightAncestors
          />
          )}
        </div>
      </div>

      {/* No tabs and no pane of your own means no pane — not an empty one. */}
      {hasPane && (
        <div className="border-border-presentation-global-primary bg-background-presentation-form-base flex min-w-0 flex-1 flex-col overflow-hidden rounded-[16px] border">
          {/* A pane of your own still wins outright — see the split above. */}
          {override.length > 0 ? (
            override
          ) : (
            <TreePane
              node={selectedNode}
              rows={paneRowsForNode}
              mode={mode}
              onModeChange={setMode}
              labelField={labelField}
              actions={paneActions}
              tabs={tabs}
            />
          )}
        </div>
      )}
    </div>
  );
}

/** A `TreeNode` painted the way the rail wants it: a name, and folder-vs-file by having children. */
function toFolderNode(
  node: TreeNode,
  labelField: FieldConfig | undefined,
  fields: readonly FieldConfig[],
  renderNode: TreeViewProps["renderNode"],
): TreeFolderNode {
  const labelValue = labelField ? getByPath(node.row, labelField.path) : undefined;
  const children = node.children.length
    ? node.children.map((c) => toFolderNode(c, labelField, fields, renderNode))
    : undefined;

  // The row belongs to `TreeFolder` — indent, connectors, selection band, drag grip. What a
  // caller can vary is what sits *in* it, so this takes the three slots rather than markup.
  const custom = renderNode?.({ node, row: node.row, fields });

  return {
    id: node.id,
    name: custom?.name ?? (labelValue == null ? node.id : String(labelValue)),
    icon: custom?.icon,
    meta: custom?.meta,
    type: children ? "folder" : "file",
    data: node.row,
    children,
  };
}

/**
 * The tree, with its pane's tabs hanging off it — `DataViews.Tree.Table`, `.Cards` and `.Tab`.
 * They live here rather than on the root because they are the *pane's* views, not the
 * component's: rendering `DataViews.Table` adds a tab to the header's switcher, rendering
 * `DataViews.Tree.Table` adds one to the pane's.
 */
export const TreeView = Object.assign(
  markView(TreeViewImpl, {
    defaultId: "tree",
    defaultLabel: "Tree",
  }),
  {
    Table: PaneTable,
    Cards: PaneCards,
    Tab: PaneTab,
  },
);
