"use client"

import { useMemo } from "react"
import type { FieldConfig } from "../types"
import type { TreeNode } from "../../../utils/dataViews/treeUtils"
import { getByPath } from "../../../utils/dataViews/pathUtils"
import { TreeFolder } from "../../TreeFolder"
import type {
  TreeFolderMoveArgs,
  TreeFolderNode,
} from "../../TreeFolder"

type Props = {
  roots: TreeNode[]
  expanded: Set<string>
  selectedId: string | null
  labelField: FieldConfig
  dndEnabled: boolean
  onToggle: (id: string) => void
  onSelect: (id: string) => void
  onMove?: (args: TreeFolderMoveArgs) => void
}

function toFolderNode(node: TreeNode, labelField: FieldConfig): TreeFolderNode {
  const labelValue = getByPath(node.record, labelField.path)
  const name = labelValue == null ? node.id : String(labelValue)
  const children = node.children.length
    ? node.children.map((c) => toFolderNode(c, labelField))
    : undefined
  return {
    id: node.id,
    name,
    type: children ? "folder" : "file",
    data: node.record,
    children,
  }
}

export function TreeSidebar({
  roots,
  expanded,
  selectedId,
  labelField,
  dndEnabled,
  onToggle,
  onSelect,
  onMove,
}: Props) {
  const folderData = useMemo(
    () => roots.map((r) => toFolderNode(r, labelField)),
    [roots, labelField],
  )

  const expandedIds = useMemo(() => Array.from(expanded), [expanded])

  return (
    <TreeFolder
      data={folderData}
      selectedId={selectedId}
      onSelectionChange={(id) => {
        if (id) onSelect(id)
      }}
      expandedIds={expandedIds}
      onExpandedChange={(next) => {
        const before = new Set(expandedIds)
        const after = new Set(next)
        for (const id of after) if (!before.has(id)) onToggle(id)
        for (const id of before) if (!after.has(id)) onToggle(id)
      }}
      dndEnabled={dndEnabled}
      onMove={onMove}
      showHeader={false}
      showBreadcrumb={true}
      highlightAncestors={true}
    />
  )
}
