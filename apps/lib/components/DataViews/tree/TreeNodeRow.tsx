"use client"

import { ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "../../../utils/cn"
import type { FieldConfig } from "../types"
import type { TreeNode } from "../../../utils/dataViews/treeUtils"
import { renderField } from "../fieldRenderers"
import { getByPath } from "../../../utils/dataViews/pathUtils"

type Props = {
  node: TreeNode
  expanded: Set<string>
  selectedId: string | null
  labelField: FieldConfig
  onToggle: (id: string) => void
  onSelect: (id: string) => void
}

export function TreeNodeRow({ node, expanded, selectedId, labelField, onToggle, onSelect }: Props) {
  const isExpanded = expanded.has(node.id)
  const isSelected = selectedId === node.id
  const hasChildren = node.children.length > 0

  const labelValue = getByPath(node.record, labelField.path)

  return (
    <div className="select-none">
      <div
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        onClick={() => onSelect(node.id)}
        className={cn(
          "group flex items-center gap-1 py-1 pr-2 cursor-pointer rounded-sm text-sm",
          "hover:bg-background-presentation-form-field-primary",
          isSelected && "bg-content-presentation-action-primary/10 text-content-presentation-global-primary",
        )}
        style={{ paddingLeft: 4 + node.depth * 14 }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.id)
            }}
            className="shrink-0 w-4 h-4 flex items-center justify-center rounded text-content-presentation-global-tertiary hover:text-content-presentation-global-primary"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        ) : (
          <span className="shrink-0 w-4 h-4" />
        )}

        <span className="flex-1 truncate">
          {renderField(labelValue, labelField, node.record)}
        </span>

        {hasChildren && !isExpanded && (
          <span className="shrink-0 text-xs text-content-presentation-global-tertiary tabular-nums">
            ({countDescendants(node)})
          </span>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div role="group">
          {node.children.map((child) => (
            <TreeNodeRow
              key={child.id}
              node={child}
              expanded={expanded}
              selectedId={selectedId}
              labelField={labelField}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function countDescendants(node: TreeNode): number {
  let n = 0
  const stack = [...node.children]
  while (stack.length) {
    n++
    const top = stack.pop()!
    for (const c of top.children) stack.push(c)
  }
  return n
}
