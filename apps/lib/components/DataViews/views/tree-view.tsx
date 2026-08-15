"use client";

import React, { useMemo } from "react";
import { cn } from "../../../utils/cn";
import { getByPath } from "../../../utils/dataViews/path";
import type { FieldConfig, TreeNode } from "../../../utils/dataViews/types";
import { TreeFolder, type TreeFolderNode } from "../../TreeFolder";
import { SkeletonBar } from "../states";
import { useControllable } from "../hooks/useControllable";
import { useDataViewsData, useDataViewsView } from "../context";
import { markView } from "../slots";
import type { TreeViewProps } from "../types";

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

  return (
    // A split view, so the gap between the rail and the pane is part of the design: it paints the
    // shell's black over the Master Container's surface, and the two cards float on it. The table
    // and board fill their container instead, which is why only these two do this.
    <div className={cn("flex h-full gap-2 bg-black", className)}>
      <div className="border-border-presentation-global-primary bg-background-presentation-form-base flex w-64 shrink-0 flex-col overflow-hidden rounded-[16px] border">
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

      {children && (
        <div className="border-border-presentation-global-primary bg-background-presentation-form-base flex min-w-0 flex-1 flex-col overflow-hidden rounded-[16px] border">
          <div className="min-h-0 flex-1 overflow-auto">{children}</div>
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

export const TreeView = markView(TreeViewImpl, {
  defaultId: "tree",
  defaultLabel: "Tree",
});
