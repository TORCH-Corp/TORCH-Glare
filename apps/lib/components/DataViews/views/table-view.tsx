"use client";

import React from "react";
import { Plus } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "../../../utils/cn";
import { formatPathLabel } from "../../../utils/dataViews/path";
import type { Sort } from "../../../utils/dataViews/types";
import { Checkbox } from "../../Checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableEndAction,
  TableHead,
  TableHeader,
  TableRow,
} from "../../Table";
import { DragList, useDragDrop, useDragItem } from "../../../hooks/useDragDrop";
import { Cell } from "../cell";
import { SkeletonBar, skeletonKeys } from "../states";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { useDataViewsData, useDataViewsView } from "../context";
import { markView } from "../slots";
import type { TableViewProps } from "../types";

/**
 * `DataViews.Table` — rows and columns.
 *
 * Built on the shared `Table` component rather than a bare `<table>`, which is where the 44px
 * header band, the 50px rows, the cell grid, the right-edge fade and the drag-resize handles all
 * come from. Rebuilding those by hand is how this view drifts away from every other table in the
 * product.
 *
 * Columns come from `visibleFields`, which the root resolved once from `fields` + `columns`. The
 * header cells are sort *buttons*: clicking one puts a `sort` in the query and nothing else. The table
 * paints `rows` in the order you handed them over, always — if the arrow points down and the rows
 * are not descending, that is your query's business, not the table's.
 */
function TableViewImpl({
  selectable = false,
  onRowClick,
  onRowMove,
  onAddRow,
  addRowLabel = "Add New",
  renderCell,
  className,
}: TableViewProps) {
  const { rows, visibleFields, getRowId, loading, loadingMore, hasMore, onLoadMore } =
    useDataViewsData();
  const { sort, setSort, selection, setSelection } = useDataViewsView();

  const ids = rows.map((row, i) => getRowId(row, i));

  const { DndContext, contextProps, activeId: activeDragId } = useDragDrop({
    mode: "list",
    disabled: !onRowMove,
    onMove: ({ id, to }) => {
      const index = ids.indexOf(String(to));
      if (index < 0) return;
      onRowMove?.({ id, from: null, to: null, index });
    },
  });
  const allSelected = ids.length > 0 && ids.every((id) => selection.includes(id));
  const someSelected = !allSelected && ids.some((id) => selection.includes(id));

  const toggleRow = (id: string) =>
    setSelection(selection.includes(id) ? selection.filter((s) => s !== id) : [...selection, id]);

  const toggleAll = () => setSelection(allSelected ? [] : ids);

  // asc → desc → unsorted, so a third click gets you back to the server's natural order.
  const cycle = (path: string): Sort => {
    if (sort?.path !== path) return { path, direction: "asc" };
    return sort.direction === "asc" ? { path, direction: "desc" } : null;
  };

  // ── Virtualization ────────────────────────────────────────────────────────
  //
  // A mode the table *enters*, not how it always renders. Below the threshold this whole block is
  // inert and the markup below is exactly what it has always been — which is what keeps the row
  // drag, the column resize and every existing example untouched.
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const tableRef = React.useRef<HTMLTableElement | null>(null);
  const virtualize = rows.length > VIRTUALIZE_AFTER;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    // Exact, not an estimate: rows are 40px by design (Figma's `Table-RowBackgroand-1.1`), so
    // there is nothing to measure and no correction pass.
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
    enabled: virtualize,
  });

  usePinnedColumnWidths(tableRef, virtualize);

  const virtualItems = virtualizer.getVirtualItems();
  const padTop = virtualItems.length ? virtualItems[0].start : 0;
  const padBottom = virtualItems.length
    ? virtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end
    : 0;

  // Which rows to actually render. The dragged row is always included even when it has scrolled
  // out of the window: dnd-kit tracks a live node, and unmounting it mid-drag drops the drag.
  const windowIndexes = virtualize ? virtualItems.map((v) => v.index) : rows.map((_, i) => i);
  const activeIndex = activeDragId ? ids.indexOf(activeDragId) : -1;
  const renderIndexes =
    activeIndex >= 0 && !windowIndexes.includes(activeIndex)
      ? [...windowIndexes, activeIndex].sort((a, b) => a - b)
      : windowIndexes;

  const { sentinelRef } = useInfiniteScroll({ onLoadMore, hasMore, loading: loading || loadingMore });

  return (
    <DndContext {...contextProps}>
      <div className={cn("bg-background-presentation-form-base flex h-full", className)}>
        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <div
            ref={scrollRef}
            // `min-w-0` so the scroller can be narrower than the table inside it. Without it a flex
            // item refuses to shrink below its content, so pinning the table to its natural width
            // pushes the whole component wide instead of scrolling within it.
            className="min-w-0 flex-1 overflow-auto rounded-lg"
          >
            <Table ref={tableRef} className="w-full">
              <TableHeader>
                <TableRow>
                  {onRowMove && <TableHead isDummy className="w-8" />}
                  {selectable && (
                    <TableHead isDummy className="w-12">
                      <Checkbox
                        checked={allSelected ? true : someSelected ? "indeterminate" : false}
                        onCheckedChange={toggleAll}
                        aria-label="Select all rows"
                      />
                    </TableHead>
                  )}
                  {/* Keyed by position: two fields may share a `path` — the same value shown two
                    ways — and keying on it would collide. */}
                  {visibleFields.map((field, i) => (
                    <TableHead
                      key={`${field.path}-${i}`}
                      size="M"
                      sortType={sort?.path === field.path ? sort.direction : undefined}
                      onSort={() => setSort(cycle(field.path))}
                      // Without this every sort control announces itself as a bare "Sort ascending",
                      // so a screen reader hears one identical button per column.
                      sortLabel={field.label ?? formatPathLabel(field.path)}
                    >
                      {field.label ?? field.path}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading && <SkeletonRows fields={visibleFields} grip={Boolean(onRowMove)} selectable={selectable} />}
                {virtualize && padTop > 0 && (
                  <tr aria-hidden style={{ height: padTop }} />
                )}
                <DragList ids={ids}>
                  {renderIndexes.map((index) => {
                    const row = rows[index];
                    const id = ids[index];
                    const selected = selection.includes(id);
                    return (
                      <DraggableRow
                        key={id}
                        id={id}
                        draggable={Boolean(onRowMove)}
                        state={selected ? "selected" : undefined}
                        onClick={onRowClick ? () => onRowClick(row, id) : undefined}
                        // A clickable row has to be reachable without a mouse. `<tr>` carries no
                        // implicit role, so a bare `onClick` is invisible to the keyboard and to a
                        // screen reader; these only appear when the row is actually interactive.
                        tabIndex={onRowClick ? 0 : undefined}
                        role={onRowClick ? "button" : undefined}
                        onKeyDown={
                          onRowClick
                            ? (e) => {
                              if (e.key !== "Enter" && e.key !== " ") return;
                              if (e.target !== e.currentTarget) return;
                              e.preventDefault();
                              onRowClick(row, id);
                            }
                            : undefined
                        }
                        className={cn(
                          // 40px per Figma's `Table-RowBackgroand-1.1`. `Table`'s body cells default
                          // to 50, and the two live on different elements, so the cells below must be
                          // told as well or CSS keeps the larger.
                          "h-[40px]",
                          "focus-visible:ring-border-presentation-state-focus outline-none focus-visible:ring-2",
                          onRowClick && "cursor-pointer",
                        )}
                      >
                        {onRowMove && <GripCell />}
                        {selectable && (
                          <TableCell isDummy className="h-[40px] w-12" onClick={(e) => e.stopPropagation()}>
                            {/* What `TableCheckbox` renders, inlined: its props are typed as button
                            attributes, so it cannot express a controlled checkbox. */}
                            <div className="flex items-center justify-center">
                              <Checkbox
                                size="S"
                                checked={selected}
                                onCheckedChange={() => toggleRow(id)}
                                aria-label="Select row"
                              />
                            </div>
                          </TableCell>
                        )}
                        {visibleFields.map((field, i) => {
                          // `undefined` means "you paint it" — distinct from `null`, which is a
                          // deliberate blank.
                          const custom = renderCell?.({ field, row, id, index, fields: visibleFields });
                          return (
                            <TableCell key={`${field.path}-${i}`} className="h-[40px]">
                              {/* `isolate` confines the Badge's mix-blend-luminosity to a local
                              stacking context and `transform-gpu` promotes it to its own layer, so
                              the table's post-mount column reflow repaints cleanly instead of
                              leaving a ghosted badge frame. */}
                              <span className="isolate inline-flex transform-gpu">
                                {custom === undefined ? <Cell field={field} row={row} /> : custom}
                              </span>
                            </TableCell>
                          );
                        })}
                      </DraggableRow>
                    );
                  })}
                </DragList>
                {virtualize && padBottom > 0 && (
                  <tr aria-hidden style={{ height: padBottom }} />
                )}
                {/* The trigger. A row of its own rather than an element after the table, so it sits
                  inside the same scroller the rows do. */}
                {hasMore && !loading && (
                  <tr ref={sentinelRef as React.Ref<HTMLTableRowElement>} aria-hidden>
                    <td style={{ height: 1, padding: 0, border: 0 }} colSpan={100} />
                  </tr>
                )}
                {loadingMore && (
                  <SkeletonRows
                    rows={2}
                    fields={visibleFields}
                    grip={Boolean(onRowMove)}
                    selectable={selectable}
                  />
                )}
              </TableBody>
            </Table>
            {onAddRow && (
              <TableEndAction onClick={onAddRow}>
                <Plus className="h-4 w-4" aria-hidden />
                {addRowLabel}
              </TableEndAction>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
}

/**
 * A row that can be picked up.
 *
 * `TableRow` forwards its ref, so the `<tr>` itself is the draggable — no wrapper element, which
 * a table would not accept between `<tbody>` and `<tr>` anyway.
 *
 * The drag listeners go on the grip, not the row: a row is clickable, and a row that is also a
 * drag handle makes selecting text or hitting a button inside it a gamble.
 */
function DraggableRow({
  id,
  draggable,
  children,
  ...props
}: React.ComponentProps<typeof TableRow> & { id: string; draggable: boolean }) {
  const { ref, handleProps, style, isDragging } = useDragItem(id, !draggable);

  return (
    <DragHandleContext.Provider value={draggable ? handleProps : null}>
      <TableRow
        ref={ref}
        style={style}
        {...props}
        className={cn(props.className, isDragging && "opacity-40")}
      >
        {children}
      </TableRow>
    </DragHandleContext.Provider>
  );
}

/** The listeners the grip needs, handed down from the row that owns them. */
const DragHandleContext = React.createContext<Record<string, unknown> | null>(null);

/** How many shimmer rows to lay down. Enough to fill the fold — not a guess at what is coming. */
const SKELETON_ROWS = 8;

/** Figma's `Table-RowBackgroand-1.1`. Exact, which is what makes virtualization measurement-free. */
const ROW_HEIGHT = 50;

/**
 * Below this many rows the table renders every one of them, exactly as it always has.
 *
 * Virtualization is not free here: the table is `table-layout: auto` with a 200px per-cell
 * minimum, so column widths are computed from whatever rows are currently mounted. Rendering only
 * a window of them makes the widths change as you scroll — unless they are pinned first, which is
 * what `usePinnedColumnWidths` does. None of that is worth doing to a table of 40 rows.
 */
const VIRTUALIZE_AFTER = 300;

/**
 * Freeze the column widths before the rows start disappearing.
 *
 * The order matters and is the whole difficulty. `table-layout: auto` sizes columns from the rows
 * that are *mounted*, so by the time virtualization has swapped thousands of rows for a window of
 * thirty, the widths have already collapsed to fit that window — measuring then pins the collapsed
 * numbers, and the table ends up about half its width with content spilling between columns. So
 * the widths are remembered on every render while the table is still whole, and those remembered
 * numbers are what get pinned at the moment it stops being whole.
 *
 * The table's own width is pinned too: under `fixed` the column widths are read as proportions of
 * it, and the table is `w-full`, so leaving it alone squeezes every column into the container.
 */
function usePinnedColumnWidths(
  tableRef: React.RefObject<HTMLTableElement | null>,
  virtualize: boolean,
) {
  const naturalWidths = React.useRef<number[] | null>(null);
  const pinned = React.useRef(false);

  // Deliberately no dependency array: the widths have to be re-read as rows accumulate, right up
  // to the render before the threshold is crossed.
  React.useLayoutEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    const heads = [...table.querySelectorAll("thead th")] as HTMLTableCellElement[];

    if (!virtualize) {
      naturalWidths.current = heads.map((th) => th.getBoundingClientRect().width);
      if (pinned.current) {
        table.style.tableLayout = "";
        table.style.removeProperty("width");
        heads.forEach((th) => th.style.removeProperty("width"));
        pinned.current = false;
      }
      return;
    }

    if (pinned.current) return;
    const widths = naturalWidths.current;
    if (!widths || widths.length !== heads.length) return;
    heads.forEach((th, i) => {
      th.style.width = `${widths[i]}px`;
    });
    table.style.width = `${widths.reduce((sum, w) => sum + w, 0)}px`;
    table.style.tableLayout = "fixed";
    pinned.current = true;
  });
}

/**
 * The loading table.
 *
 * Built from the same `TableRow`/`TableCell` a real row uses, with one cell per visible field, so
 * the columns sit at exactly the widths the data will land in and nothing shifts when it does.
 * The header above is untouched — it comes from `visibleFields`, not from `rows`.
 */
function SkeletonRows({
  fields,
  grip,
  selectable,
  rows = SKELETON_ROWS,
}: {
  fields: readonly { path: string }[];
  grip: boolean;
  selectable: boolean;
  rows?: number;
}) {
  return (
    <>
      {skeletonKeys(rows).map((row) => (
        <TableRow key={`skeleton-${row}`} className="h-[40px]">
          {grip && <TableCell isDummy className="h-[40px] w-8" />}
          {selectable && <TableCell isDummy className="h-[40px] w-12" />}
          {fields.map((field, i) => (
            <TableCell key={`${field.path}-${i}`} className="h-[40px]">
              {/* Widths cycle rather than repeat, so a column of bars reads as text that has not
                  arrived instead of as a grid. */}
              <SkeletonBar className={["w-[70%]", "w-[45%]", "w-[85%]", "w-[60%]"][(row + i) % 4]} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

/** The 2×3 grip. Only rendered when the table is reorderable. */
function GripCell() {
  const handleProps = React.useContext(DragHandleContext);
  return (
    <TableCell isDummy className="h-[40px] w-8" onClick={(e) => e.stopPropagation()}>
      <span
        {...handleProps}
        aria-label="Reorder row"
        className={cn(
          "text-content-presentation-global-tertiary flex cursor-grab items-center justify-center",
          "active:cursor-grabbing",
        )}
      >
        <i className="ri-draggable text-[16px]" aria-hidden />
      </span>
    </TableCell>
  );
}

export const TableView = markView(TableViewImpl, {
  defaultId: "table",
  defaultLabel: "List",
});
