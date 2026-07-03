"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { isAncestor } from "./treeFolderUtils"
import type {
  TreeFolderDropPosition,
  TreeFolderDropTarget,
  TreeFolderMoveArgs,
  TreeFolderNode,
  TreeFolderVisibleRow,
} from "./types"

type RowLookup = Map<string, TreeFolderVisibleRow>

const SCROLL_EDGE_PX = 32
const SCROLL_SPEED_PX_PER_FRAME = 8
const DRAG_DATA_MIME = "application/x-treefolder-ids"

export type UseTreeFolderDnDOptions = {
  data: TreeFolderNode[]
  rowsById: RowLookup
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
  enabled: boolean
  onMove?: (args: TreeFolderMoveArgs) => void
  /**
   * Predicate. Return false to forbid the drop. Defaults to allow except for
   * dropping a node into itself or a descendant.
   */
  canDrop?: (args: {
    dragIds: string[]
    parentId: string | null
    index: number
  }) => boolean
}

export type UseTreeFolderDnDResult = {
  dragIds: string[]
  dropTarget: TreeFolderDropTarget | null
  getRowDragHandlers: (rowId: string) => {
    draggable: boolean
    onDragStart: (e: React.DragEvent<HTMLElement>) => void
    onDragEnd: (e: React.DragEvent<HTMLElement>) => void
    onDragOver: (e: React.DragEvent<HTMLElement>) => void
    onDragLeave: (e: React.DragEvent<HTMLElement>) => void
    onDrop: (e: React.DragEvent<HTMLElement>) => void
  }
}

export function useTreeFolderDnD({
  data,
  rowsById,
  scrollContainerRef,
  enabled,
  onMove,
  canDrop,
}: UseTreeFolderDnDOptions): UseTreeFolderDnDResult {
  const [dragIds, setDragIds] = useState<string[]>([])
  const [dropTarget, setDropTarget] = useState<TreeFolderDropTarget | null>(null)

  // Auto-scroll loop while the user is dragging near a container edge.
  const autoScrollDeltaRef = useRef(0)
  const autoScrollRafRef = useRef<number | null>(null)

  const stopAutoScroll = useCallback(() => {
    autoScrollDeltaRef.current = 0
    if (autoScrollRafRef.current != null) {
      cancelAnimationFrame(autoScrollRafRef.current)
      autoScrollRafRef.current = null
    }
  }, [])

  const tickAutoScroll = useCallback(() => {
    const el = scrollContainerRef.current
    const delta = autoScrollDeltaRef.current
    if (!el || delta === 0) {
      autoScrollRafRef.current = null
      return
    }
    el.scrollTop += delta
    autoScrollRafRef.current = requestAnimationFrame(tickAutoScroll)
  }, [scrollContainerRef])

  const maybeAutoScroll = useCallback(
    (clientY: number) => {
      const el = scrollContainerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      let delta = 0
      if (clientY - rect.top < SCROLL_EDGE_PX) delta = -SCROLL_SPEED_PX_PER_FRAME
      else if (rect.bottom - clientY < SCROLL_EDGE_PX) delta = SCROLL_SPEED_PX_PER_FRAME
      autoScrollDeltaRef.current = delta
      if (delta !== 0 && autoScrollRafRef.current == null) {
        autoScrollRafRef.current = requestAnimationFrame(tickAutoScroll)
      } else if (delta === 0) {
        stopAutoScroll()
      }
    },
    [scrollContainerRef, stopAutoScroll, tickAutoScroll],
  )

  useEffect(() => stopAutoScroll, [stopAutoScroll])

  const computePosition = useCallback(
    (target: HTMLElement, clientY: number, isInternal: boolean): TreeFolderDropPosition => {
      const rect = target.getBoundingClientRect()
      const offset = clientY - rect.top
      const ratio = offset / rect.height
      // Leaves can't accept "inside" drops — squash that zone into before/after.
      if (!isInternal) return ratio < 0.5 ? "before" : "after"
      if (ratio < 0.25) return "before"
      if (ratio > 0.75) return "after"
      return "inside"
    },
    [],
  )

  const resolveMoveArgs = useCallback(
    (drag: string[], drop: TreeFolderDropTarget): TreeFolderMoveArgs | null => {
      const targetRow = rowsById.get(drop.rowId)
      if (!targetRow) return null

      let parentId: string | null
      let index: number

      if (drop.position === "inside") {
        parentId = targetRow.node.id
        // Drop at the end of the target's children.
        index = targetRow.node.children?.length ?? 0
      } else {
        parentId = targetRow.parentId
        index = drop.position === "before" ? targetRow.childIndex : targetRow.childIndex + 1
      }

      // Reject: dropping into self or any descendant.
      for (const id of drag) {
        const node = rowsById.get(id)?.node
        if (!node) continue
        if (parentId && (node.id === parentId || isAncestor(node, parentId))) return null
      }

      if (canDrop && !canDrop({ dragIds: drag, parentId, index })) return null

      // No-op safety: skipping the equivalent of "drop where you already are".
      if (drag.length === 1) {
        const onlyDrag = rowsById.get(drag[0])
        if (
          onlyDrag &&
          onlyDrag.parentId === parentId &&
          (onlyDrag.childIndex === index || onlyDrag.childIndex + 1 === index)
        ) {
          return null
        }
      }

      return { dragIds: drag, parentId, index }
    },
    [rowsById, canDrop],
  )

  const getRowDragHandlers = useCallback(
    (rowId: string) => {
      if (!enabled) {
        return {
          draggable: false,
          onDragStart: () => {},
          onDragEnd: () => {},
          onDragOver: () => {},
          onDragLeave: () => {},
          onDrop: () => {},
        }
      }
      return {
        draggable: true,
        onDragStart: (e: React.DragEvent<HTMLElement>) => {
          const ids = [rowId]
          setDragIds(ids)
          e.dataTransfer.effectAllowed = "move"
          try {
            e.dataTransfer.setData(DRAG_DATA_MIME, ids.join(","))
            // Required for Firefox to initiate the drag at all.
            e.dataTransfer.setData("text/plain", ids.join(","))
          } catch {
            // setData can throw in some sandboxed contexts; ignore.
          }
        },
        onDragEnd: () => {
          setDragIds([])
          setDropTarget(null)
          stopAutoScroll()
        },
        onDragOver: (e: React.DragEvent<HTMLElement>) => {
          if (dragIds.length === 0) return
          // Reject self-drops upfront so the cursor reflects "no drop" outside the tree.
          if (dragIds.includes(rowId)) {
            e.dataTransfer.dropEffect = "none"
            return
          }
          const row = rowsById.get(rowId)
          if (!row) return
          // Reject dropping onto a descendant of any dragged node.
          for (const dragId of dragIds) {
            const dragNode = rowsById.get(dragId)?.node
            if (dragNode && isAncestor(dragNode, rowId)) {
              e.dataTransfer.dropEffect = "none"
              return
            }
          }
          e.preventDefault()
          e.dataTransfer.dropEffect = "move"
          const position = computePosition(e.currentTarget, e.clientY, row.isInternal)
          // Only setState when something actually changed (avoids re-render storms).
          setDropTarget((prev) =>
            prev && prev.rowId === rowId && prev.position === position
              ? prev
              : { rowId, position },
          )
          maybeAutoScroll(e.clientY)
        },
        onDragLeave: () => {
          // No-op: onDragOver on the next row will overwrite dropTarget. Clearing
          // here would flicker the indicator during normal row-to-row hovering.
        },
        onDrop: (e: React.DragEvent<HTMLElement>) => {
          if (dragIds.length === 0) return
          e.preventDefault()
          const row = rowsById.get(rowId)
          if (!row) {
            setDragIds([])
            setDropTarget(null)
            stopAutoScroll()
            return
          }
          const position = computePosition(e.currentTarget, e.clientY, row.isInternal)
          const moveArgs = resolveMoveArgs(dragIds, { rowId, position })
          if (moveArgs) onMove?.(moveArgs)
          setDragIds([])
          setDropTarget(null)
          stopAutoScroll()
        },
      }
    },
    [
      enabled,
      dragIds,
      rowsById,
      computePosition,
      resolveMoveArgs,
      onMove,
      maybeAutoScroll,
      stopAutoScroll,
    ],
  )

  // If the data tree changes mid-drag, clear stale targets.
  useEffect(() => {
    if (dragIds.length === 0) return
    setDropTarget((prev) => (prev && rowsById.has(prev.rowId) ? prev : null))
  }, [data, rowsById, dragIds.length])

  return { dragIds, dropTarget, getRowDragHandlers }
}
