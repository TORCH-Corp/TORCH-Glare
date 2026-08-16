"use client";

import React from "react";
import { cn } from "../../../utils/cn";
import { DragList, useDragDrop, useDragItem } from "../../../hooks/useDragDrop";
import { formatPathLabel } from "../../../utils/dataViews/path";
import type { ColumnState } from "../../../utils/dataViews/types";
import { useDataViewsData, useDataViewsView } from "../context";
import { DataViewsSwitch } from "./controls";
import { Section } from "./section";
import type { PanelColumnsProps } from "../types";

/** The 2×3 grip dots on a draggable column row. Hand-drawn — there is no icon for this shape. */
function GripDots() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className="text-white/60" fill="currentColor">
      {[5.33, 9.33].flatMap((cx) =>
        [3.33, 8, 12.67].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" />),
      )}
    </svg>
  );
}

/** The insertion line shown between rows while dragging one. */
function DropLine() {
  return (
    <div className="pointer-events-none relative h-0">
      <div className="absolute -top-[1px] left-0 right-0 h-[2px] rounded-full bg-[#005ECC]" />
    </div>
  );
}

/**
 * `DataViews.Panel.Columns` — show/hide and reorder the columns.
 *
 * The column list is the root's, read and written through `useDataViewsView()` — this part takes
 * no `value`/`onValueChange` of its own. The root is what turns `columns` into the ordered
 * `visibleFields` every view paints from, so hiding a column here also retitles the board's cards. When `columns` has never been set, the list is seeded from
 * `fields` on first edit, so you are not forced to declare a redundant array to get this working.
 */
export function Columns({
  title = "Table Columns",
  // Figma writes this line under the header; it is the section's own words, so it is the default
  // rather than something every caller has to remember to pass.
  description = "Show or hide columns in table view",
  className,
}: PanelColumnsProps) {
  const { fields } = useDataViewsData();
  const { columns, setColumns } = useDataViewsView();

  // What the panel shows: the user's arrangement if there is one, otherwise the declared fields.
  const current: ColumnState[] =
    columns.length > 0
      ? columns.slice()
      : fields
          .filter((f) => f.type !== "hidden")
          .map((f) => ({
            path: f.path,
            label: f.label ?? formatPathLabel(f.path),
            visible: f.visible !== false,
          }));

  // Rows are identified by path — the same key the table and every other view uses.
  const ids = current.map((c) => c.path);

  const { DndContext, contextProps, activeId, overId } = useDragDrop({
    mode: "list",
    onMove: ({ id, to }) => {
      const from = ids.indexOf(id);
      const target = ids.indexOf(String(to));
      if (from < 0 || target < 0 || from === target) return;
      const next = current.slice();
      const [moved] = next.splice(from, 1);
      next.splice(target, 0, moved);
      setColumns(next);
    },
  });

  const toggle = (path: string) =>
    setColumns(current.map((c) => (c.path === path ? { ...c, visible: !c.visible } : c)));

  return (
    <Section title={title} description={description} className={className}>
      <DndContext {...contextProps}>
        <DragList ids={ids}>
          <div data-theme="dark" className="flex flex-col gap-2">
            {current.map((column, index) => (
              <ColumnRow
                key={`${column.path}-${index}`}
                column={column}
                onToggle={() => toggle(column.path)}
                showDropLine={overId === column.path && activeId !== null && activeId !== column.path}
              />
            ))}
          </div>
        </DragList>
      </DndContext>
    </Section>
  );
}

/**
 * One column row.
 *
 * A separate component because `useDragItem` is a hook, and a hook cannot be called inside the
 * `.map()` that paints the list.
 */
function ColumnRow({
  column,
  onToggle,
  showDropLine,
}: {
  column: ColumnState;
  onToggle: () => void;
  showDropLine: boolean;
}) {
  const { ref, handleProps, style, isDragging } = useDragItem(column.path);

  return (
    <React.Fragment>
      {showDropLine && <DropLine />}
      <div
        ref={ref}
        style={style}
        {...handleProps}
        className={cn(
                // SB-Column-Item: a standalone #1C1D1F pill with a #252729 border, rounded hard
                // on the trailing edge and softly on the leading one.
                "flex cursor-grab items-center gap-2 rounded-e-[99px] rounded-s-[60px] border",
                "border-[#252729] bg-[#1C1D1F] p-[8.8px] transition-colors active:cursor-grabbing",
          isDragging ? "opacity-50" : "hover:bg-[#252729]",
        )}
      >
        <span className="flex shrink-0 items-center justify-center">
          <GripDots />
        </span>
        <span className="flex-1 text-[14px] text-white">{column.label}</span>
        {/* Stop the switch from starting a drag: the row is the handle, and a press on the
            toggle is not a press on the row. */}
        <span
          className="flex shrink-0 items-center"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <DataViewsSwitch
            checked={column.visible}
            onCheckedChange={onToggle}
            aria-label={`Show ${column.label}`}
          />
        </span>
      </div>
    </React.Fragment>
  );
}
