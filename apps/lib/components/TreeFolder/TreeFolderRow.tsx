"use client"

import { ChevronRight, ChevronDown, GripVertical } from "lucide-react"
import type { DragEvent } from "react"
import { cn } from "../../utils/cn"
import { resolveIcon } from "./icons"
import type {
  TreeFolderIconResolver,
  TreeFolderVisibleRow,
} from "./types"

export type TreeFolderRowDragHandlers = {
  draggable: boolean
  onDragStart: (e: DragEvent<HTMLElement>) => void
  onDragEnd: (e: DragEvent<HTMLElement>) => void
  onDragOver: (e: DragEvent<HTMLElement>) => void
  onDragLeave: (e: DragEvent<HTMLElement>) => void
  onDrop: (e: DragEvent<HTMLElement>) => void
}

export type TreeFolderRowProps = {
  row: TreeFolderVisibleRow
  rowHeight: number
  indent: number
  iconFor?: TreeFolderIconResolver

  isSelected: boolean
  isAncestor: boolean
  isDescendantOfSelected: boolean
  /** True when the previous visible row is part of the same selected-subtree band. */
  isPrevInBand: boolean
  /** True when the next visible row is part of the same selected-subtree band. */
  isNextInBand: boolean

  isDragging: boolean
  isDropTargetInside: boolean
  isDropBefore: boolean
  isDropAfter: boolean

  dndEnabled: boolean
  onSelect: (id: string | null) => void
  onToggle: (id: string) => void
  dragHandlers: TreeFolderRowDragHandlers
}

export function TreeFolderRow({
  row,
  rowHeight,
  indent,
  iconFor,
  isSelected,
  isAncestor,
  isDescendantOfSelected,
  isPrevInBand,
  isNextInBand,
  isDragging,
  isDropTargetInside,
  isDropBefore,
  isDropAfter,
  dndEnabled,
  onSelect,
  onToggle,
  dragHandlers,
}: TreeFolderRowProps) {
  const { node, level, isOpen, isInternal } = row
  const data = node
  const hasChildren = isInternal

  const willReceiveDrop = isDropTargetInside && dndEnabled
  const inSubtreeOfSelected = isDescendantOfSelected
  const inAncestorChain = isAncestor
  // Selected row gets the strong fill; direct children get a softer overlay so
  // they read as "members of the selected group" without competing with the
  // selection itself. Rows stand alone — no neighbor-aware joining anymore.
  const showSelected = isSelected && !willReceiveDrop
  const showChildOfSelected = inSubtreeOfSelected && !isSelected && !willReceiveDrop
  // A row is "in the selection group" if it's the selected node itself or a
  // descendant tinted by it. Neighbor-aware rounding then merges adjacent rows
  // into one continuous pill instead of stacked individual chips.
  const inGroup = showSelected || showChildOfSelected
  const isGroupStart = inGroup && !isPrevInBand
  const isGroupEnd = inGroup && !isNextInBand

  const icon = resolveIcon(iconFor, data, {
    isOpen,
    isInternal,
    isSelected,
  })

  const outerClassName = cn(
    "relative w-full min-w-max",
    isDragging && "opacity-40",
    data.disabled && "opacity-50 pointer-events-none",
  )

  const bandClassName = cn(
    "pointer-events-none absolute inset-y-0 inset-x-[2px] rounded-md transition-colors duration-100",
    inGroup && !isGroupStart && "rounded-t-none",
    inGroup && !isGroupEnd && "rounded-b-none",
    !willReceiveDrop && !inGroup &&
      "group-hover/row:bg-background-presentation-form-field-hover group-active/row:bg-background-presentation-action-hover/20",
    showSelected && "bg-background-presentation-state-information-primary",
    // Token isn't exposed as channels, so Tailwind's /alpha modifier doesn't
    // work on it — paint the descendant tint with the same hex at 30% alpha.
    showChildOfSelected && "bg-[#005ECC]/30",
    inAncestorChain && !inGroup &&
      "bg-background-presentation-state-information-secondary",
    willReceiveDrop && "bg-background-presentation-state-information-primary",
  )

  const rowClassName = cn(
    "relative z-10 flex items-center gap-1 py-1 pr-2 cursor-pointer text-sm min-w-max",
    showSelected && "text-white",
    willReceiveDrop && "text-white",
  )

  const rowStyle = {
    paddingLeft: 4 + level * indent,
    height: rowHeight,
  }

  const handleRowClick = () => {
    if (data.disabled) return
    onSelect(node.id)
  }

  // Insert lines for "between" drops (above/below sibling). Inset to the row's
  // indent so they line up with the new sibling's level.
  const insertLineInset = 4 + level * indent

  return (
    <div
      data-row-id={node.id}
      className={cn("select-none group/row", outerClassName)}
      {...dragHandlers}
    >
      <span aria-hidden className={bandClassName} />

      {isDropBefore && (
        <span
          aria-hidden
          className="pointer-events-none absolute -top-px left-0 right-0 z-20 h-0.5 bg-background-presentation-state-information-primary"
          style={{ marginLeft: insertLineInset }}
        />
      )}
      {isDropAfter && (
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-px left-0 right-0 z-20 h-0.5 bg-background-presentation-state-information-primary"
          style={{ marginLeft: insertLineInset }}
        />
      )}

      <div
        role="treeitem"
        aria-expanded={isInternal ? isOpen : undefined}
        aria-selected={isSelected}
        aria-disabled={data.disabled || undefined}
        aria-level={level + 1}
        onClick={handleRowClick}
        className={rowClassName}
        style={rowStyle}
      >
        {dndEnabled && (
          <span
            className="shrink-0 w-4 h-4 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-150 cursor-grab active:cursor-grabbing"
            aria-hidden
          >
            <GripVertical
              className={cn(
                "w-3.5 h-3.5",
                showSelected ? "text-white/80" : "text-content-presentation-global-tertiary",
              )}
            />
          </span>
        )}

        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggle(node.id)
            }}
            className={cn(
              "shrink-0 w-4 h-4 flex items-center justify-center rounded",
              showSelected
                ? "text-white/80 hover:text-white"
                : "text-content-presentation-global-tertiary hover:text-content-presentation-global-primary",
            )}
            aria-label={isOpen ? "Collapse" : "Expand"}
          >
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        ) : (
          <span className="shrink-0 w-4 h-4" />
        )}

        <span
          className={cn(
            "shrink-0 w-4 h-4 flex items-center justify-center",
            showSelected ? "text-white/90" : "text-content-presentation-global-tertiary",
          )}
          aria-hidden
        >
          {icon}
        </span>

        <span className="whitespace-nowrap pr-2" title={data.name}>
          {data.name}
        </span>

        {hasChildren && !isOpen && (
          <span
            className={cn(
              "shrink-0 text-xs tabular-nums",
              showSelected ? "text-white/80" : "text-content-presentation-global-tertiary",
            )}
          >
            ({countDescendants(node)})
          </span>
        )}
      </div>
    </div>
  )
}

function countDescendants(node: {
  children?: { children?: any[] }[] | null
}): number {
  if (!node.children) return 0
  let n = 0
  const stack: any[] = [...node.children]
  while (stack.length) {
    n++
    const top = stack.pop()
    if (top.children) for (const c of top.children) stack.push(c)
  }
  return n
}
