"use client";

import { type ReactNode, useState } from "react";
import { useFormContext, useFieldArray, type FieldValues, type ArrayPath } from "react-hook-form";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { cn } from "../../../utils/cn";
import { SectionBlock } from "../../SectionBlock";
import {
  Table,
  TableBody,
  TableCell,
  TableEndAction,
  TableHead,
  TableHeader,
  TableRow,
  TableScroller,
} from "../../Table";
import { Checkbox } from "../../Checkbox";
import { Button } from "../../Button";
import { CellContext, useLoading } from "../context";
import type { TableColumn, TableFieldProps } from "../types";

const ALIGN: Record<NonNullable<TableColumn["align"]>, string> = {
  start: "justify-start text-start",
  center: "justify-center text-center",
  end: "justify-end text-end",
};

/**
 * `FormBuilder.Table` — an editable data-grid field built on the FieldArray pattern.
 * Rows are records; each column cell is any `FormBuilder.*` field, rendered "bare" via
 * `CellContext`. Rows can be checkbox-selected, drag-reordered, added and removed.
 */
export function TableField(props: TableFieldProps) {
  const { name, columns, selectable = true, reorderable = true } = props;
  const form = useFormContext<FieldValues>();
  const loading = useLoading();

  const { fields, append, remove, move, replace } = useFieldArray({
    control: form.control,
    name: name as ArrayPath<FieldValues>,
  });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  // Drag-resized column widths, keyed by column index; falls back to `column.width`.
  const [resized, setResized] = useState<Record<number, number>>({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  if (props.hidden) return null;

  const showHandle = reorderable;
  const showSelect = selectable;

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allSelected = fields.length > 0 && fields.every((f) => selected.has(f.id));
  const someSelected = fields.some((f) => selected.has(f.id));
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(fields.map((f) => f.id)));

  const deleteSelected = () => {
    if (loading) return;
    const indices = fields.map((f, i) => (selected.has(f.id) ? i : -1)).filter((i) => i >= 0);
    remove(indices);
    setSelected(new Set());
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    if (oldIndex >= 0 && newIndex >= 0) move(oldIndex, newIndex);
  };

  // Sort the rows by a column's key (asc/desc toggle). `replace` re-keys the field ids,
  // so selection (keyed by id) is cleared afterwards.
  const applySort = (key: string) => {
    if (loading) return;
    const dir: "asc" | "desc" = sort?.key === key && sort.dir === "asc" ? "desc" : "asc";
    const rows = (form.getValues(name) as Record<string, unknown>[] | undefined) ?? [];
    const sorted = [...rows].sort((a, b) => {
      const av = a?.[key];
      const bv = b?.[key];
      if (av == null) return bv == null ? 0 : 1;
      if (bv == null) return -1;
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return dir === "asc" ? cmp : -cmp;
    });
    replace(sorted);
    setSort({ key, dir });
    setSelected(new Set());
  };

  const totalCols = columns.length + (showHandle ? 1 : 0) + (showSelect ? 1 : 0);

  // Under the browser's default `table-layout: auto`, a column's `width` is only a hint —
  // content (an input's intrinsic size, a currency prefix) silently widens it, which is why
  // a `width: 110` column used to render at 200-odd px. When every column declares a width
  // we can switch to fixed layout and have them honoured exactly. Mixed/absent widths keep
  // auto layout, since under fixed layout an unsized column would collapse to nothing.
  //
  // Fixed layout also needs a *definite* table width — with `width: auto` the browser sizes
  // the table from content and then redistributes, throwing the declared widths (and any
  // drag-resize) away. So the widths are owned here and totalled onto the table, which is
  // what lets a drag grow the table instead of stealing space from the next column.
  const DUMMY_COL_WIDTH = 40; // the design's onset / selector columns
  const colWidth = (col: TableColumn, ci: number) => resized[ci] ?? col.width;
  const fixedLayout = columns.length > 0 && columns.every((col, ci) => !!colWidth(col, ci));
  const tableWidth = fixedLayout
    ? columns.reduce((sum, col, ci) => sum + (colWidth(col, ci) ?? 0), 0) +
      (showHandle ? DUMMY_COL_WIDTH : 0) +
      (showSelect ? DUMMY_COL_WIDTH : 0)
    : undefined;

  const rowCells = (rowName: string, index: number) => (
    <>
      {showSelect && (
        <TableCell isDummy>
          <Checkbox
            size="S"
            checked={selected.has(fields[index].id)}
            onCheckedChange={() => toggleRow(fields[index].id)}
          />
        </TableCell>
      )}
      {columns.map((col, ci) => (
        <TableCell
          key={ci}
          style={colWidth(col, ci) ? { width: colWidth(col, ci) } : undefined}
          // Column widths come from `col.width`, so opt out of TableCell's 200px floor —
          // otherwise a narrow column (e.g. `width: 110`) silently renders at 200px.
          minWidth={0}
          // Every cell here holds a form control, and the right-edge fade washes out whatever
          // sits at its end — a Select's chevron, a date picker's button.
          fade={false}
          childrenClassName={cn("min-w-0 w-full", col.align && ALIGN[col.align])}
        >
          <CellContext.Provider value="table">{col.cell(rowName, index)}</CellContext.Provider>
        </TableCell>
      ))}
    </>
  );

  const table = (
    // `min-w-full` so the grid still spans the card when the columns are narrower than it,
    // while staying free to overflow (and scroll) when they aren't.
    <Table
      className={cn("min-w-full", fixedLayout && "[table-layout:fixed]")}
      style={tableWidth ? { width: tableWidth } : undefined}
    >
      <TableHeader>
        <TableRow>
          {/* Fixed 40px, per the design — and so these unsized columns can't absorb the
              table's slack width and push the data columns off-screen. */}
          {showHandle && <TableHead isDummy style={{ width: DUMMY_COL_WIDTH }} />}
          {showSelect && (
            <TableHead isDummy style={{ width: DUMMY_COL_WIDTH }}>
              <Checkbox
                size="S"
                checked={allSelected ? true : someSelected ? "indeterminate" : false}
                onCheckedChange={toggleAll}
              />
            </TableHead>
          )}
          {columns.map((col, ci) => (
            <TableHead
              key={ci}
              // Width goes on the <th> too, so header and body columns agree.
              style={colWidth(col, ci) ? { width: colWidth(col, ci) } : undefined}
              onResize={(w) => setResized((prev) => ({ ...prev, [ci]: w }))}
              sortType={col.sortKey && sort?.key === col.sortKey ? sort.dir : undefined}
              sortLabel={typeof col.header === "string" ? col.header : undefined}
              onSort={col.sortKey ? () => applySort(col.sortKey as string) : undefined}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {showHandle ? (
          <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            {fields.map((f, index) => (
              <SortableRow key={f.id} id={f.id} state={selected.has(f.id) ? "selected" : undefined}>
                {rowCells(`${name}.${index}`, index)}
              </SortableRow>
            ))}
          </SortableContext>
        ) : (
          fields.map((f, index) => (
            <TableRow key={f.id} state={selected.has(f.id) ? "selected" : undefined}>
              {rowCells(`${name}.${index}`, index)}
            </TableRow>
          ))
        )}

        {fields.length === 0 && (
          <TableRow>
            <TableCell colSpan={totalCols} minWidth={0}>
              <span className="typography-body-small-regular text-content-presentation-global-secondary">
                No rows yet.
              </span>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  // Header actions on the right of the SectionBlock title row: a "Delete Row" that's disabled
  // until rows are selected, and a primary "Add New". They live outside the scroll container,
  // so they stay put while the grid scrolls sideways.
  const headerActions = (
    <>
      {selectable && (
        <Button
          type="button"
          size="M"
          variant="BorderStyle"
          disabled={loading || selected.size === 0}
          onClick={deleteSelected}
        >
          Delete Row
        </Button>
      )}
      <Button
        type="button"
        size="M"
        variant="BluColStyle"
        disabled={loading}
        onClick={() => append((props.defaultItem ?? {}) as never)}
      >
        {props.addLabel ?? "Add New"}
      </Button>
    </>
  );

  return (
    <SectionBlock
      variant="Table"
      title={props.title}
      color={props.color}
      icon={props.icon}
      action={headerActions}
    >
      {props.description && (
        <p className="px-[16px] pt-[12px] typography-body-small-regular text-content-presentation-global-secondary">
          {props.description}
        </p>
      )}

      {/* The table is the only horizontally scrolling element … */}
      <TableScroller>
        {showHandle ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            {table}
          </DndContext>
        ) : (
          table
        )}
      </TableScroller>

      {/* … so this stays visible no matter how far right the columns are scrolled. */}
      <TableEndAction disabled={loading} onClick={() => append((props.defaultItem ?? {}) as never)}>
        <i className="ri-add-line" />
        {props.addLabel ?? "Add New"}
      </TableEndAction>
    </SectionBlock>
  );
}

/** A draggable table row — the drag handle lives in the leading `isDummy` cell. */
function SortableRow({
  id,
  state,
  children,
}: {
  id: string;
  state?: "selected";
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} state={state}>
      <TableCell
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
        isDummy
      >
        <i className="ri-draggable text-[18px] text-content-presentation-global-secondary" />
      </TableCell>
      {children}
    </TableRow>
  );
}
