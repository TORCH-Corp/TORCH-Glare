"use client"

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { cn } from "../../utils/cn"
import type { Themes } from "../../utils/types"
import { TreeFolderBreadcrumb } from "./TreeFolderBreadcrumb"
import { TreeFolderRow } from "./TreeFolderRow"
import { TreeFolderStyles } from "./TreeFolderStyles"
import {
  applyMove,
  descendantIds,
  findNode,
  findPath,
  toBreadcrumb,
} from "./treeFolderUtils"
import type {
  TreeFolderIconResolver,
  TreeFolderMoveArgs,
  TreeFolderNode,
  TreeFolderVisibleRow,
} from "./types"
import { useTreeFolderDnD } from "./useTreeFolderDnD"

export type TreeFolderProps = {
  data: TreeFolderNode[]
  selectedId?: string | null
  defaultSelectedId?: string | null
  onSelectionChange?: (id: string | null) => void

  expandedIds?: string[]
  defaultExpanded?: "all" | "roots" | "none" | string[]
  onExpandedChange?: (ids: string[]) => void

  dndEnabled?: boolean
  onMove?: (args: TreeFolderMoveArgs) => void
  onDataChange?: (next: TreeFolderNode[]) => void

  iconFor?: TreeFolderIconResolver

  title?: string
  showBreadcrumb?: boolean
  showHeader?: boolean
  highlightAncestors?: boolean
  highlightSubtree?: boolean
  headerAccessory?: ReactNode
  emptyState?: ReactNode

  rowHeight?: number
  indent?: number
  /** Optional. If set, the row strip will be at least this wide (in px) — useful
   *  when you want the band to extend across a wider canvas regardless of content. */
  contentMinWidth?: number

  className?: string
  theme?: Themes
}

export type TreeFolderHandle = {
  selectId: (id: string | null) => void
  expandAll: () => void
  collapseAll: () => void
  scrollToId: (id: string) => void
}

const ROW_HEIGHT_DEFAULT = 28
const INDENT_DEFAULT = 14

function collectIds(nodes: TreeFolderNode[], out: string[] = []): string[] {
  for (const n of nodes) {
    out.push(n.id)
    if (n.children) collectIds(n.children, out)
  }
  return out
}

function rootIds(nodes: TreeFolderNode[]): string[] {
  return nodes.map((n) => n.id)
}

function flattenVisible(
  data: TreeFolderNode[],
  expanded: Set<string>,
): TreeFolderVisibleRow[] {
  const out: TreeFolderVisibleRow[] = []
  const walk = (
    nodes: TreeFolderNode[],
    level: number,
    parentId: string | null,
  ) => {
    nodes.forEach((node, idx) => {
      const isInternal = !!(node.children && node.children.length > 0)
      const isOpen = isInternal && expanded.has(node.id)
      out.push({ node, level, parentId, childIndex: idx, isOpen, isInternal })
      if (isOpen && node.children) walk(node.children, level + 1, node.id)
    })
  }
  walk(data, 0, null)
  return out
}

export const TreeFolder = forwardRef<TreeFolderHandle, TreeFolderProps>(
  function TreeFolder(props, ref) {
    const {
      data,
      selectedId: controlledSelected,
      defaultSelectedId = null,
      onSelectionChange,
      expandedIds: controlledExpanded,
      defaultExpanded = "roots",
      onExpandedChange,
      dndEnabled = true,
      onMove,
      onDataChange,
      iconFor,
      title = "Layers",
      showBreadcrumb = true,
      showHeader = true,
      highlightAncestors = true,
      highlightSubtree = true,
      headerAccessory,
      emptyState,
      rowHeight = ROW_HEIGHT_DEFAULT,
      indent = INDENT_DEFAULT,
      contentMinWidth,
      className,
      theme,
    } = props

    const scrollRef = useRef<HTMLDivElement | null>(null)

    // ---- Selection state ----
    const [internalSelected, setInternalSelected] = useState<string | null>(
      defaultSelectedId,
    )
    const selectedId =
      controlledSelected !== undefined ? controlledSelected : internalSelected
    const isSelectionControlled = controlledSelected !== undefined

    // ---- Expansion state ----
    const [internalExpanded, setInternalExpanded] = useState<string[]>(() => {
      if (Array.isArray(defaultExpanded)) return defaultExpanded
      if (defaultExpanded === "all") return collectIds(data)
      if (defaultExpanded === "none") return []
      return rootIds(data)
    })
    const expandedIds = controlledExpanded ?? internalExpanded
    const isExpansionControlled = controlledExpanded !== undefined
    const expandedSet = useMemo(() => new Set(expandedIds), [expandedIds])

    // ---- Visible rows ----
    const visibleRows = useMemo(
      () => flattenVisible(data, expandedSet),
      [data, expandedSet],
    )
    const rowsById = useMemo(() => {
      const m = new Map<string, TreeFolderVisibleRow>()
      for (const r of visibleRows) m.set(r.node.id, r)
      return m
    }, [visibleRows])

    // ---- Ancestor + subtree highlight ----
    const ancestorPath = useMemo(
      () => (selectedId ? findPath(data, selectedId) : null),
      [data, selectedId],
    )
    const ancestorIdSet = useMemo(
      () => new Set((ancestorPath ?? []).slice(0, -1).map((n) => n.id)),
      [ancestorPath],
    )
    const isAncestorFn = useCallback(
      (id: string) => highlightAncestors && ancestorIdSet.has(id),
      [highlightAncestors, ancestorIdSet],
    )

    const descendantIdSet = useMemo(() => {
      if (!highlightSubtree || !selectedId) return new Set<string>()
      const node = findNode(data, selectedId)
      if (!node) return new Set<string>()
      return descendantIds(node, false)
    }, [data, selectedId, highlightSubtree])
    const isDescendantOfSelected = useCallback(
      (id: string) => descendantIdSet.has(id),
      [descendantIdSet],
    )

    const breadcrumbItems = useMemo(
      () => (ancestorPath ? toBreadcrumb(ancestorPath) : []),
      [ancestorPath],
    )

    // ---- Handlers ----
    const handleSelect = useCallback(
      (id: string | null) => {
        if (!isSelectionControlled) setInternalSelected(id)
        onSelectionChange?.(id)
      },
      [isSelectionControlled, onSelectionChange],
    )

    const handleToggle = useCallback(
      (id: string) => {
        const next = expandedIds.includes(id)
          ? expandedIds.filter((x) => x !== id)
          : [...expandedIds, id]
        if (!isExpansionControlled) setInternalExpanded(next)
        onExpandedChange?.(next)
      },
      [expandedIds, isExpansionControlled, onExpandedChange],
    )

    const handleMoveInternal = useCallback(
      (args: TreeFolderMoveArgs) => {
        onMove?.(args)
        if (onDataChange) onDataChange(applyMove(data, args))
      },
      [data, onMove, onDataChange],
    )

    const scrollToId = useCallback((id: string) => {
      const el = scrollRef.current?.querySelector<HTMLElement>(
        `[data-row-id="${CSS.escape(id)}"]`,
      )
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }, [])

    // ---- DnD ----
    const { dragIds, dropTarget, getRowDragHandlers } = useTreeFolderDnD({
      data,
      rowsById,
      scrollContainerRef: scrollRef,
      enabled: dndEnabled,
      onMove: handleMoveInternal,
      canDrop: ({ parentId }) => {
        // Honor per-node `droppable: false` on the resolved parent.
        if (parentId == null) return true
        const target = findNode(data, parentId)
        if (!target) return false
        if (target.disabled || target.droppable === false) return false
        return true
      },
    })
    const dragIdSet = useMemo(() => new Set(dragIds), [dragIds])

    // ---- Imperative handle ----
    useImperativeHandle(
      ref,
      () => ({
        selectId: (id: string | null) => {
          if (!isSelectionControlled) setInternalSelected(id)
          onSelectionChange?.(id)
          if (id) scrollToId(id)
        },
        expandAll: () => {
          const all = collectIds(data)
          if (!isExpansionControlled) setInternalExpanded(all)
          onExpandedChange?.(all)
        },
        collapseAll: () => {
          if (!isExpansionControlled) setInternalExpanded([])
          onExpandedChange?.([])
        },
        scrollToId,
      }),
      [
        data,
        isSelectionControlled,
        isExpansionControlled,
        onSelectionChange,
        onExpandedChange,
        scrollToId,
      ],
    )

    const isEmpty = data.length === 0
    const stripStyle = contentMinWidth
      ? { minWidth: contentMinWidth }
      : undefined

    return (
      <div
        data-theme={theme}
        className={cn(
          "flex h-full w-full flex-col bg-background-presentation-body-overlay-primary text-content-presentation-global-primary",
          className,
        )}
      >
        {showHeader && (
          <div className="px-3 py-2 border-b border-border-presentation-global-primary flex items-center justify-between gap-2 shrink-0">
            <span className="text-xs font-semibold text-content-presentation-global-secondary uppercase tracking-wide truncate">
              {title}
            </span>
            {headerAccessory}
          </div>
        )}

        {showBreadcrumb && (
          <div className="border-b border-border-presentation-global-primary shrink-0">
            <TreeFolderBreadcrumb
              items={breadcrumbItems}
              onSelect={(id) => {
                handleSelect(id)
                scrollToId(id)
              }}
            />
          </div>
        )}

        <TreeFolderStyles />
        <div
          ref={scrollRef}
          role="tree"
          className="tf-scroll flex-1 min-h-0 overflow-auto"
        >
          {isEmpty ? (
            emptyState ?? (
              <div className="text-xs text-content-presentation-global-tertiary p-3">
                Nothing here yet.
              </div>
            )
          ) : (
            <div className="min-w-max" style={stripStyle}>
              {visibleRows.map((row, idx) => {
                const prevRow = visibleRows[idx - 1]
                const nextRow = visibleRows[idx + 1]
                const isSelected = selectedId === row.node.id
                const isDescendant = isDescendantOfSelected(row.node.id) && !isSelected
                const inBand = isSelected || isDescendant

                // Neighbour-aware band rounding: a row is "in-band" if it's the selected
                // node itself or one of its descendants. The Set lookup handles deep nesting.
                const prevInBand =
                  inBand &&
                  !!prevRow &&
                  (prevRow.node.id === selectedId ||
                    descendantIdSet.has(prevRow.node.id))
                const nextInBand =
                  inBand &&
                  !!nextRow &&
                  (nextRow.node.id === selectedId ||
                    descendantIdSet.has(nextRow.node.id))

                const isDragging = dragIdSet.has(row.node.id)
                const isDropTargetInside =
                  dropTarget?.rowId === row.node.id && dropTarget.position === "inside"
                const isDropBefore =
                  dropTarget?.rowId === row.node.id && dropTarget.position === "before"
                const isDropAfter =
                  dropTarget?.rowId === row.node.id && dropTarget.position === "after"

                return (
                  <TreeFolderRow
                    key={row.node.id}
                    row={row}
                    rowHeight={rowHeight}
                    indent={indent}
                    iconFor={iconFor}
                    isSelected={isSelected}
                    isAncestor={isAncestorFn(row.node.id) && !isSelected}
                    isDescendantOfSelected={isDescendant}
                    isPrevInBand={prevInBand}
                    isNextInBand={nextInBand}
                    isDragging={isDragging}
                    isDropTargetInside={isDropTargetInside}
                    isDropBefore={isDropBefore}
                    isDropAfter={isDropAfter}
                    dndEnabled={dndEnabled}
                    onSelect={handleSelect}
                    onToggle={handleToggle}
                    dragHandlers={getRowDragHandlers(row.node.id)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  },
)
