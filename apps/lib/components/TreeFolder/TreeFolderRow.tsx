"use client";

import { ChevronRight, ChevronDown, GripVertical } from "lucide-react";
import type { DragEvent } from "react";
import { cn } from "../../utils/cn";
import { resolveIcon } from "./icons";
import type { TreeFolderIconResolver, TreeFolderVisibleRow } from "./types";

export type TreeFolderRowDragHandlers = {
  draggable: boolean;
  onDragStart: (e: DragEvent<HTMLElement>) => void;
  onDragEnd: (e: DragEvent<HTMLElement>) => void;
  onDragOver: (e: DragEvent<HTMLElement>) => void;
  onDragLeave: (e: DragEvent<HTMLElement>) => void;
  onDrop: (e: DragEvent<HTMLElement>) => void;
};

export type TreeFolderRowProps = {
  row: TreeFolderVisibleRow;
  rowHeight: number;
  indent: number;
  iconFor?: TreeFolderIconResolver;

  isSelected: boolean;
  isAncestor: boolean;
  isDescendantOfSelected: boolean;
  /** True when the previous visible row is part of the same selected-subtree band. */
  isPrevInBand: boolean;
  /** True when the next visible row is part of the same selected-subtree band. */
  isNextInBand: boolean;

  isDragging: boolean;
  isDropTargetInside: boolean;
  isDropBefore: boolean;
  isDropAfter: boolean;

  dndEnabled: boolean;
  onSelect: (id: string | null) => void;
  onToggle: (id: string) => void;
  dragHandlers: TreeFolderRowDragHandlers;
};

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
  const { node, level, isOpen, isInternal, ancestorHasMoreSiblings } = row;
  const data = node;
  const hasChildren = isInternal;

  const willReceiveDrop = isDropTargetInside && dndEnabled;
  const inSubtreeOfSelected = isDescendantOfSelected;
  const inAncestorChain = isAncestor;
  // Selected row gets the strong fill; direct children get a softer overlay so
  // they read as "members of the selected group" without competing with the
  // selection itself. Rows stand alone — no neighbor-aware joining anymore.
  const showSelected = isSelected && !willReceiveDrop;
  const showChildOfSelected =
    inSubtreeOfSelected && !isSelected && !willReceiveDrop;
  // A row is "in the selection group" if it's the selected node itself or a
  // descendant tinted by it. Neighbor-aware rounding then merges adjacent rows
  // into one continuous pill instead of stacked individual chips.
  const inGroup = showSelected || showChildOfSelected;
  const isGroupStart = inGroup && !isPrevInBand;
  const isGroupEnd = inGroup && !isNextInBand;

  const icon = resolveIcon(iconFor, data, {
    isOpen,
    isInternal,
    isSelected,
  });

  const outerClassName = cn(
    "relative w-full min-w-max",
    isDragging && "opacity-40",
    data.disabled && "opacity-50 pointer-events-none",
  );

  const bandClassName = cn(
    "pointer-events-none absolute inset-y-0 inset-x-[2px] z-0 rounded-md transition-colors duration-100",
    inGroup && !isGroupStart && "rounded-t-none",
    inGroup && !isGroupEnd && "rounded-b-none",
    !willReceiveDrop &&
      !inGroup &&
      "group-hover/row:bg-background-presentation-form-field-hover group-active/row:bg-background-presentation-action-hover/20",
    showSelected && "bg-background-presentation-state-information-primary",
    // Token isn't exposed as channels, so Tailwind's /alpha modifier doesn't
    // work on it — paint the descendant tint with the same hex at 30% alpha.
    showChildOfSelected && "bg-[#005ECC]/30",
    inAncestorChain &&
      !inGroup &&
      "bg-background-presentation-state-information-secondary",
    willReceiveDrop && "bg-background-presentation-state-information-primary",
  );

  const rowClassName = cn(
    "relative z-10 flex items-center gap-1 py-1 pr-2 cursor-pointer text-sm min-w-max",
    showSelected && "text-white",
    willReceiveDrop && "text-white",
  );

  // Grip occupies a fixed slot at the outer-left edge. `contentStart` is where
  // the indent-padding origin (depth 0) begins, leaving breathing room between
  // the grip column and the first connector / chevron.
  const gripSlotWidth = 16;
  const gripGutterPad = 6;
  const contentStart = gripSlotWidth + gripGutterPad; // 22px

  const rowStyle = {
    paddingLeft: contentStart + level * indent,
    height: rowHeight,
  };

  const handleRowClick = () => {
    if (data.disabled) return;
    onSelect(node.id);
  };

  // Insert lines for "between" drops (above/below sibling). Inset to the row's
  // indent so they line up with the new sibling's level.
  const insertLineInset = contentStart + level * indent;

  return (
    <div
      data-row-id={node.id}
      className={cn("select-none group/row", outerClassName)}
      style={{ height: rowHeight }}
      {...dragHandlers}
    >
      <span aria-hidden className={bandClassName} />

      {/* Drag handle sits in a fixed slot at the outer-left of the row so it
          never collides with the connector verticals — those start to the
          right of this 16px reserved column. Hidden until row hover. */}
      {dndEnabled && (
        <span
          className="absolute left-1.5 top-0 z-[6] flex h-full w-4 items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-150 cursor-grab active:cursor-grabbing"
          aria-hidden
        >
          <GripVertical
            className={cn(
              "w-3.5 h-3.5",
              showSelected
                ? "text-white/80"
                : "text-content-presentation-global-tertiary",
            )}
          />
        </span>
      )}

      {level > 0 && (
        <div className="pointer-events-none absolute inset-0 z-[5]">
          <TreeConnectors
            level={level}
            indent={indent}
            rowHeight={rowHeight}
            contentStart={contentStart}
            ancestorHasMoreSiblings={ancestorHasMoreSiblings}
          />
        </div>
      )}

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
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
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
            showSelected
              ? "text-white/90"
              : "text-content-presentation-global-tertiary",
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
              showSelected
                ? "text-white/80"
                : "text-content-presentation-global-tertiary",
            )}
          >
            ({countDescendants(node)})
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Connector lines (T/L bends) aligned to where each ancestor's chevron sits in
 * the row layout, so verticals drop directly from the parent's twisty rather
 * than floating in the indent column. Geometry:
 *
 *   row paddingLeft = 4 + level * indent
 *   row content order = [grip?(16)] [chevron(16)] [icon(16)] [text]
 *
 * So the chevron of a row at depth D is centered at:
 *   chevronX(D) = 4 + D * indent + (dndEnabled ? 16 : 0) + 8
 *
 * A child at depth D+1 hangs its vertical at chevronX(D) and runs a horizontal
 * stub from there out to (paddingLeft - 2) — landing just before the child's
 * own grip/chevron. Last child renders an "L" (vertical stops at midline);
 * other siblings render a "T" (vertical runs full height). Ancestor gutters
 * keep their verticals only when that ancestor still has siblings below.
 */
function TreeConnectors({
  level,
  indent,
  rowHeight,
  contentStart,
  ancestorHasMoreSiblings,
}: {
  level: number;
  indent: number;
  rowHeight: number;
  contentStart: number;
  ancestorHasMoreSiblings: boolean[];
}) {
  // Grip handle sits in a fixed outer-left slot, so the chevron column for a
  // row at depth D is: contentStart + D*indent + chevron-half(8).
  const chevronX = (depth: number) => contentStart + depth * indent + 8;
  // Connector color is theme-aware: black/20 on default+light, white/20 on dark.
  // The dark swap relies on a `data-theme="dark"` ancestor (set by TreeFolder).
  const lineClass = "bg-black-alpha-20 [[data-theme=dark]_&]:bg-white-alpha-20";
  const segments: React.ReactNode[] = [];

  // Ancestor verticals: full-height line at each ancestor's chevron column,
  // skipped when the ancestor at that depth has no more siblings below.
  // ancestorHasMoreSiblings[d] === "ancestor at depth d still has siblings
  // below this row," so it controls whether to draw the vertical in that
  // ancestor's chevron gutter (chevronX(d)).
  for (let d = 0; d < level - 1; d++) {
    if (!ancestorHasMoreSiblings[d]) continue;
    segments.push(
      <span
        key={`v-${d}`}
        aria-hidden
        className={cn("pointer-events-none absolute top-0 bottom-0 w-px", lineClass)}
        style={{ left: chevronX(d) }}
      />,
    );
  }

  // Parent's gutter (depth = level - 1). T or L vertical, plus horizontal stub
  // landing just before this row's own grip/chevron starts.
  const parentDepth = level - 1;
  const parentX = chevronX(parentDepth);
  const midY = rowHeight / 2;
  const ownContentX = contentStart + level * indent + 2; // extend 4px further toward the row content

  segments.push(
    <span
      key="v-own"
      aria-hidden
      className={cn("pointer-events-none absolute w-px", lineClass)}
      style={{
        left: parentX,
        top: 0,
        height: "100%",
      }}
    />,
  );
  segments.push(
    <span
      key="h-own"
      aria-hidden
      className={cn("pointer-events-none absolute h-px", lineClass)}
      style={{
        left: parentX,
        top: midY,
        width: Math.max(4, ownContentX - parentX),
      }}
    />,
  );

  return <>{segments}</>;
}

function countDescendants(node: {
  children?: { children?: any[] }[] | null;
}): number {
  if (!node.children) return 0;
  let n = 0;
  const stack: any[] = [...node.children];
  while (stack.length) {
    n++;
    const top = stack.pop();
    if (top.children) for (const c of top.children) stack.push(c);
  }
  return n;
}
