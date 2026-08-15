"use client";

import React, { useMemo } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "../../../utils/cn";
import { getByPath } from "../../../utils/dataViews/path";
import type { ColumnColor, FieldConfig, Row, RowGroup } from "../../../utils/dataViews/types";
import { Button } from "../../Button";
import { DataViewCard, type DataViewCardRow } from "../../../layouts/DataViewCard";
import {
  DragGhost,
  DragList,
  useDragDrop,
  useDragItem,
  useDropContainer,
} from "../../../hooks/useDragDrop";
import { Cell } from "../cell";
import { SkeletonBar, skeletonKeys } from "../states";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { useDataViewsData, useDataViewsView } from "../context";
import { markView } from "../slots";
import type { BoardViewProps } from "../types";

/**
 * The Figma column pills are deeply saturated dark fills (#131415, #330C69, #532200, #002F66).
 * Each is matched to the closest raw-colour token; purple has no close presentation-layer match,
 * so it stays the exact Figma hex.
 */
const COLUMN_BG: Record<ColumnColor, string> = {
  gray: "bg-black-900",
  purple: "bg-[#330C69]",
  orange: "bg-orange-900",
  blue: "bg-blue-sparkle-900",
  green: "bg-green-cyan-900",
  red: "bg-red-orange-900",
};

/**
 * `DataViews.Board` — a kanban board.
 *
 * You hand it `groups`; it never groups rows itself. That is deliberate: grouping is a query, and
 * which statuses exist (including the empty ones you still want a column for) is knowledge the
 * board does not have.
 *
 * Dragging emits `onRowMove` and **does not move the card**. The card moves when you update
 * `rows`/`groups` in response — so a failed save leaves the board showing the truth instead of a
 * lie. If nothing seems to happen on drop, that round-trip is what is missing.
 */
function BoardViewImpl({
  groups,
  titlePath,
  renderCard,
  onRowMove,
  onColumnAction,
  className,
}: BoardViewProps) {
  const { visibleFields, getRowId, loading } = useDataViewsData();
  const { activeId, setActiveId } = useDataViewsView();

  const titleField = titlePath ? visibleFields.find((f) => f.path === titlePath) : visibleFields[0];
  const bodyFields = visibleFields.filter((f) => f.path !== titleField?.path);

  /**
   * Where every card currently sits. A drop reports only what it landed *on* — which may be a
   * column or another card — so this is what turns that into "which column, at what index".
   */
  const placement = useMemo(() => {
    const map = new Map<string, { group: string; index: number }>();
    for (const group of groups) {
      group.rows.forEach((row, index) => {
        map.set(getRowId(row, index), { group: group.id, index });
      });
    }
    return map;
  }, [groups, getRowId]);

  const { DndContext, contextProps, activeId: draggingId, overId } = useDragDrop({
    mode: "board",
    disabled: !onRowMove,
    containerOf: (id) => placement.get(id)?.group ?? null,
    onMove: ({ id, from, to }) => {
      if (!to) return;
      // Dropped on a card: take that card's column and slot in at its position. Dropped on the
      // column itself — which is what an empty column offers — append.
      const onCard = placement.get(to);
      onRowMove?.({
        id,
        from,
        to: onCard ? onCard.group : to,
        ...(onCard ? { index: onCard.index } : null),
      });
    },
  });

  /**
   * Which column the drop would land in. Not `useDropContainer`'s `isOver`: the nearest droppable
   * to the pointer is almost always a *card*, so a column with anything in it would never light
   * up. The card's own column is the answer.
   */
  const targetGroup = overId ? (placement.get(overId)?.group ?? overId) : null;

  /** The row under the pointer, so the ghost can be the card itself rather than an outline. */
  const dragging = draggingId
    ? groups
        .flatMap((group) =>
          group.rows.map((row, index) => ({ row, group, index, id: getRowId(row, index) })),
        )
        .find((r) => r.id === draggingId)
    : undefined;

  return (
    <DndContext {...contextProps}>
      <div
        className={cn(
          "bg-background-presentation-body-primary h-full overflow-x-auto p-2",
          className,
        )}
      >
        <div className="flex h-full gap-4" style={{ minWidth: "max-content" }}>
        {groups.map((group, i) => (
          <React.Fragment key={group.id}>
            <BoardColumn
              group={group}
              isTarget={targetGroup === group.id}
              onColumnAction={onColumnAction}
              ids={group.rows.map((row, index) => getRowId(row, index))}
            >
              {loading && <SkeletonCards />}
              {!loading && group.rows.map((row, index) => {
                // `index` is the position within this column. It only reaches `getRowId` as the
                // last-resort fallback for rows with no id of their own — give those a stable
                // `getRowId` if you drag them, or two columns will hand out the same key.
                const id = getRowId(row, index);
                return (
                  <BoardCard
                    key={id}
                    id={id}
                    draggable={Boolean(onRowMove)}
                    isActive={activeId === id}
                    onClick={() => setActiveId(activeId === id ? null : id)}
                  >
                    {(isDragging) =>
                      renderCard ? (
                        renderCard({
                          row,
                          id,
                          index,
                          fields: visibleFields,
                          group,
                          isActive: activeId === id,
                          isDragging,
                        })
                      ) : (
                        <DataViewCard
                          title={titleField ? <Cell field={titleField} row={row} /> : undefined}
                          rows={buildCardRows(bodyFields, row)}
                          className={cn(
                            onRowMove
                              ? "cursor-grab transition-shadow hover:shadow-md active:cursor-grabbing"
                              : "cursor-pointer",
                            activeId === id && "border-border-presentation-state-focus",
                          )}
                        />
                      )
                    }
                  </BoardCard>
                );
              })}
            </BoardColumn>

            {i < groups.length - 1 && (
              // Starts below the column header rather than at the top of the board.
              <div
                aria-hidden
                className="border-border-presentation-global-primary mt-[42px] self-stretch border-l-[2px] border-dashed"
              />
            )}
          </React.Fragment>
          ))}
        </div>
      </div>

      {/* The ghost is the card, drawn through whatever renders the real one — a custom
          `renderCard` included, or the ghost would announce itself as a different object. */}
      <DragGhost>
        {dragging && (
          <div className="w-[271px] cursor-grabbing opacity-95 shadow-lg">
            {renderCard ? (
              renderCard({
                row: dragging.row,
                id: dragging.id,
                index: dragging.index,
                fields: visibleFields,
                group: dragging.group,
                isActive: activeId === dragging.id,
                isDragging: true,
              })
            ) : (
              <DataViewCard
                title={titleField ? <Cell field={titleField} row={dragging.row} /> : undefined}
                rows={buildCardRows(bodyFields, dragging.row)}
                className="border-border-presentation-state-focus"
              />
            )}
          </div>
        )}
      </DragGhost>
    </DndContext>
  );
}

/**
 * Asks for the next page when *this* column is scrolled to its end.
 *
 * Every column calls the same `onLoadMore`, because the board is fed one shared page of rows and
 * regroups them — so a short column can end up asking for more on behalf of a long one. That is
 * the trade for not having to page each column separately.
 */
function ColumnSentinel() {
  const { loading, loadingMore, hasMore, onLoadMore } = useDataViewsData();
  const { sentinelRef } = useInfiniteScroll({
    onLoadMore,
    hasMore,
    loading: loading || loadingMore,
  });
  if (!hasMore || loading) return null;
  return (
    <>
      <div ref={sentinelRef as React.Ref<HTMLDivElement>} aria-hidden className="h-px shrink-0" />
      {loadingMore && <SkeletonCards count={1} />}
    </>
  );
}

/** Per column. Two is enough to read as "cards are coming" without pretending to know how many. */
const SKELETON_CARDS = 2;

/**
 * The loading column.
 *
 * A real `DataViewCard` with shimmer where its text goes, so the card's radius, border and padding
 * are the ones the data will land in. The column header above keeps its label and colour — only
 * the cards are unknown.
 */
function SkeletonCards({ count = SKELETON_CARDS }: { count?: number }) {
  return (
    <>
      {skeletonKeys(count).map((i) => (
        <DataViewCard
          key={`skeleton-${i}`}
          title={<SkeletonBar className="h-[18px] w-[60%]" />}
          rows={[
            [
              { key: "a", label: <SkeletonBar className="w-[54px]" />, value: <SkeletonBar className="w-[64px]" /> },
              { key: "b", label: <SkeletonBar className="w-[44px]" />, value: <SkeletonBar className="w-[72px]" /> },
            ],
          ]}
        />
      ))}
    </>
  );
}

/**
 * A column: a drop target in its own right, so a card can be dropped on an empty one.
 *
 * `DragList` is what lets a card be dropped *between* two others rather than only onto the column.
 */
function BoardColumn({
  group,
  ids,
  isTarget,
  onColumnAction,
  children,
}: {
  group: RowGroup;
  ids: string[];
  isTarget: boolean;
  onColumnAction?: (groupId: string) => void;
  children: React.ReactNode;
}) {
  const { ref, isOver, containerProps } = useDropContainer(group.id);

  return (
    <div
      ref={ref}
      {...containerProps}
      className={cn(
        // The transparent 2px border is permanent so the drop-target state costs no layout shift.
        "flex w-[279px] flex-col gap-2 rounded-[12px] border-2 border-transparent p-1",
        "transition-colors duration-150 ease-in-out",
        (isOver || isTarget) &&
          "bg-background-presentation-cardbutton-blue-hover border-border-presentation-state-focus border-dashed",
      )}
    >
      <ColumnHeader group={group} onAction={onColumnAction} />
      <div className="flex flex-col gap-2 overflow-y-auto py-1">
        <DragList ids={ids}>{children}</DragList>
        <ColumnSentinel />
      </div>
    </div>
  );
}

/**
 * The wrapper around a card — ours whichever card is shown, because dragging and the click that
 * opens a row are board behaviour, not card decoration.
 *
 * `children` is a function so a custom card can be told whether it is the one being dragged
 * without this component knowing what it renders.
 */
function BoardCard({
  id,
  draggable,
  isActive,
  onClick,
  children,
}: {
  id: string;
  draggable: boolean;
  isActive: boolean;
  onClick: () => void;
  children: (isDragging: boolean) => React.ReactNode;
}) {
  const { ref, handleProps, style, isDragging } = useDragItem(id, !draggable);

  return (
    <div
      ref={ref}
      style={style}
      {...handleProps}
      onClick={onClick}
      data-active={isActive || undefined}
      className={cn(
        draggable ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isDragging && "opacity-40",
      )}
    >
      {children(isDragging)}
    </div>
  );
}

/**
 * Pair the body fields two per row so the card grid keeps its rhythm even when one side is
 * missing: a lone survivor spans both columns, and fully empty pairs are dropped rather than
 * rendering a phantom row of hairlines.
 */
function buildCardRows(fields: readonly FieldConfig[], row: Row): DataViewCardRow[] {
  const rows: DataViewCardRow[] = [];
  for (let i = 0; i < fields.length; i += 2) {
    const pair = [fields[i], fields[i + 1]];
    const cells: DataViewCardRow = [];
    for (const [offset, field] of pair.entries()) {
      if (!field) continue;
      if (getByPath(row, field.path) == null) continue;
      cells.push({
        // Position, not path — two fields may share one.
        key: `${field.path}-${i + offset}`,
        label: field.label ?? field.path,
        value: <Cell field={field} row={row} />,
      });
    }
    if (cells.length > 0) rows.push(cells);
  }
  return rows;
}

/** The solid dark pill at the top of a column. No dot, no count — just the title and an action. */
function ColumnHeader({
  group,
  onAction,
}: {
  group: RowGroup;
  onAction?: (groupId: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-[8px] px-[6px] py-[4px]",
        COLUMN_BG[group.color ?? "gray"],
      )}
    >
      <h3 className="typography-headers-small-medium text-content-presentation-global-primary-light">
        {group.label}
      </h3>
      {onAction && (
        <Button
          variant="BorderStyle"
          buttonType="icon"
          className="text-content-presentation-global-primary-light h-5 w-5 border-0 bg-transparent hover:bg-white/10"
          onClick={() => onAction(group.id)}
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}

export const BoardView = markView(BoardViewImpl, {
  defaultId: "board",
  defaultLabel: "Board",
});
