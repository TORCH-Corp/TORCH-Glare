import type { ReactNode } from "react"

export type TreeFolderNodeType =
  | "folder"
  | "file"
  | "frame"
  | "group"
  | "component"
  | "instance"
  | "text"
  | "image"
  | "vector"
  | "link"
  | "section"
  | "container"
  | (string & {})

export type TreeFolderNode = {
  id: string
  name: string
  type?: TreeFolderNodeType
  icon?: ReactNode
  meta?: ReactNode
  disabled?: boolean
  draggable?: boolean
  droppable?: boolean
  data?: unknown
  children?: TreeFolderNode[]
}

export type TreeFolderMoveArgs = {
  dragIds: string[]
  parentId: string | null
  index: number
}

export type TreeFolderIconResolver = (
  node: TreeFolderNode,
  state: { isOpen: boolean; isInternal: boolean; isSelected: boolean },
) => ReactNode

export type TreeFolderBreadcrumb = Array<{ id: string; name: string }>

// ---------------------------------------------------------------------------
// Visible-row + DnD primitives.
// ---------------------------------------------------------------------------

export type TreeFolderVisibleRow = {
  node: TreeFolderNode
  level: number
  /** Resolved parent id (null for roots). */
  parentId: string | null
  /** Position of this node among its siblings in the source tree (0-based). */
  childIndex: number
  /** True when the node is internal AND open. */
  isOpen: boolean
  /** True for internal nodes (any node with non-empty children). */
  isInternal: boolean
  /**
   * Connector-line geometry. `isLastChild` toggles the row's own bend between L
   * (last) and T (non-last). `ancestorHasMoreSiblings[d]` is true when the
   * ancestor at depth `d` still has visible siblings after this row — that
   * controls whether the vertical guide renders in that ancestor's gutter.
   * Length === `level`.
   */
  isLastChild: boolean
  ancestorHasMoreSiblings: boolean[]
}

/** Where the pointer is dropping relative to the hovered row. */
export type TreeFolderDropPosition = "before" | "after" | "inside"

export type TreeFolderDropTarget = {
  /** The id whose `parentId` the drop will resolve to. */
  rowId: string
  position: TreeFolderDropPosition
}
