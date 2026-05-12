"use client"

import type { FieldConfig } from "../types"
import type { TreeNode } from "../../../utils/dataViews/treeUtils"
import { TreeNodeRow } from "./TreeNodeRow"

type Props = {
  roots: TreeNode[]
  expanded: Set<string>
  selectedId: string | null
  labelField: FieldConfig
  onToggle: (id: string) => void
  onSelect: (id: string) => void
}

export function TreeSidebar({ roots, expanded, selectedId, labelField, onToggle, onSelect }: Props) {
  if (roots.length === 0) {
    return (
      <div className="text-xs text-content-presentation-global-tertiary p-3">
        No matching items.
      </div>
    )
  }

  return (
    <div role="tree" className="py-1">
      {roots.map((root) => (
        <TreeNodeRow
          key={root.id}
          node={root}
          expanded={expanded}
          selectedId={selectedId}
          labelField={labelField}
          onToggle={onToggle}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
