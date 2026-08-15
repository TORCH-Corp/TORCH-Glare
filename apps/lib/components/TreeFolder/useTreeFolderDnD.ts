"use client";

import { useCallback, useMemo } from "react";
import { useDragDrop, type DragMove } from "../../hooks/useDragDrop";
import { isAncestor } from "./treeFolderUtils";
import type { TreeFolderDropTarget, TreeFolderMoveArgs, TreeFolderNode } from "./types";
import type { TreeFolderVisibleRow } from "./types";

type RowLookup = Map<string, TreeFolderVisibleRow>;

export type UseTreeFolderDnDOptions = {
  data: TreeFolderNode[];
  rowsById: RowLookup;
  enabled: boolean;
  onMove?: (args: TreeFolderMoveArgs) => void;
  /**
   * Predicate. Return false to forbid the drop. Defaults to allow except for
   * dropping a node into itself or a descendant.
   */
  canDrop?: (args: { dragIds: string[]; parentId: string | null; index: number }) => boolean;
};

/**
 * The tree's drag, expressed as a translation.
 *
 * All this does is turn one `DragMove` — an id, a target row and whether the pointer sat above,
 * on or below it — into the `{dragIds, parentId, index}` a tree move is written in. Picking the
 * item up, following the pointer, deciding which row is underneath, scrolling when the drag nears
 * an edge and answering the keyboard all belong to `useDragDrop`, which every other draggable
 * surface in the library now shares.
 *
 * What stays here is the part only a tree knows: that "inside" means the end of the target's
 * children, that "before" and "after" are indices in the target's parent, and that a branch
 * dropped into its own descendant would detach itself from the root.
 */
export function useTreeFolderDnD({
  data,
  rowsById,
  enabled,
  onMove,
  canDrop,
}: UseTreeFolderDnDOptions) {
  /** A row can only take children if it is a folder; a file's middle band is not a drop zone. */
  const canNestInto = useCallback(
    (id: string) => rowsById.get(id)?.isInternal ?? false,
    [rowsById],
  );

  /** `{row, position}` → `{parentId, index}`, or null if the move is impossible or pointless. */
  const resolve = useCallback(
    (dragIds: string[], move: DragMove): TreeFolderMoveArgs | null => {
      const targetRow = move.to ? rowsById.get(move.to) : undefined;
      if (!targetRow) return null;

      const position = move.position ?? "after";
      const parentId = position === "inside" ? targetRow.node.id : targetRow.parentId;
      const index =
        position === "inside"
          ? // Dropped onto a folder: land at the end of what it already holds.
            (targetRow.node.children?.length ?? 0)
          : position === "before"
            ? targetRow.childIndex
            : targetRow.childIndex + 1;

      // A node cannot become its own descendant's child — that severs the branch from the root.
      for (const id of dragIds) {
        const node = rowsById.get(id)?.node;
        if (!node) continue;
        if (parentId && (node.id === parentId || isAncestor(node, parentId))) return null;
      }

      if (canDrop && !canDrop({ dragIds, parentId, index })) return null;

      // "Drop where you already are" is not a move; reporting it would churn the caller's data.
      if (dragIds.length === 1) {
        const only = rowsById.get(dragIds[0]);
        if (
          only &&
          only.parentId === parentId &&
          (only.childIndex === index || only.childIndex + 1 === index)
        ) {
          return null;
        }
      }

      return { dragIds, parentId, index };
    },
    [rowsById, canDrop],
  );

  const { contextProps, activeId, overId, position } = useDragDrop({
    mode: "tree",
    disabled: !enabled,
    canNestInto,
    onMove: (move) => {
      const args = resolve([move.id], move);
      if (args) onMove?.(args);
    },
  });

  /**
   * Kept as a list because a move is defined over a set of nodes: a tree that gains multi-select
   * drag changes what fills this, and nothing downstream — the guard, the resolver, `onMove` — has
   * to change with it.
   */
  const dragIds = useMemo(() => (activeId ? [activeId] : []), [activeId]);

  /** Where the indicator is painted. Null while nothing is over a valid row. */
  const dropTarget: TreeFolderDropTarget | null =
    activeId && overId && position && overId !== activeId
      ? { rowId: overId, position }
      : null;

  /** The rows the tree can drop on, in painted order — `data` is what changes them. */
  const ids = useMemo(() => [...rowsById.keys()], [rowsById, data]); // eslint-disable-line react-hooks/exhaustive-deps

  return { dragIds, dropTarget, contextProps, ids, enabled };
}
