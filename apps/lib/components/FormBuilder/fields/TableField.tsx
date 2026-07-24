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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../Table";
import { Checkbox } from "../../Checkbox";
import { Button } from "../../Button";
import { CellContext, useLoading, useMode } from "../context";
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
  const mode = useMode();
  const loading = useLoading();
  const isView = mode === "view";

  const { fields, append, remove, move, replace } = useFieldArray({
    control: form.control,
    name: name as ArrayPath<FieldValues>,
  });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  if (props.hidden) return null;

  const showHandle = reorderable && !isView;
  const showSelect = selectable && !isView;

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
          style={col.width ? { width: col.width } : undefined}
          childrenClassName={cn(
            "min-w-0 w-full [&:has(input)]:bg-transparent",
            col.align && ALIGN[col.align],
          )}
        >
          <CellContext.Provider value={true}>{col.cell(rowName, index)}</CellContext.Provider>
        </TableCell>
      ))}
    </>
  );

  const table = (
    <Table>
      <TableHeader>
        <TableRow>
          {showHandle && <TableHead isDummy />}
          {showSelect && (
            <TableHead isDummy>
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
              sortType={col.sortKey && sort?.key === col.sortKey ? sort.dir : undefined}
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
            <TableCell colSpan={totalCols}>
              <span className="typography-body-small-regular text-content-presentation-global-secondary">
                No rows yet.
              </span>
            </TableCell>
          </TableRow>
        )}

        {!isView && (
          <TableRow className="h-[40px]">
            <TableCell
              colSpan={totalCols}
              className="border-t-2 border-transparent hover:border-border-presentation-table-action-hover hover:bg-background-presentation-table-acton-hover"
            >
              <button
                type="button"
                disabled={loading}
                onClick={() => append((props.defaultItem ?? {}) as never)}
                className="flex w-full items-center justify-start gap-2 typography-body-medium-semibold text-content-presentation-action-light-primary [&_i]:text-[20px]"
              >
                <i className="ri-add-line" />
                {props.addLabel ?? "Add New"}
              </button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  // Header actions on the right of the SectionBlock title row (edit mode only): a "Delete Row"
  // that's disabled until rows are selected, and a primary "Add New".
  const headerActions = !isView ? (
    <>
      {selectable && (
        <Button
          type="button"
          size="S"
          variant="BorderStyle"
          disabled={loading || selected.size === 0}
          onClick={deleteSelected}
        >
          <i className="ri-delete-bin-line" />
          Delete Row
        </Button>
      )}
      <Button
        type="button"
        size="S"
        variant="BluColStyle"
        disabled={loading}
        onClick={() => append((props.defaultItem ?? {}) as never)}
      >
        <i className="ri-add-line" />
        {props.addLabel ?? "Add New"}
      </Button>
    </>
  ) : undefined;

  return (
    <SectionBlock
      title={props.title}
      color={props.color}
      icon={props.icon}
      action={headerActions}
      bodyClassName="px-[16px]"
      // The bottom "Add New" footer is the last element, so drop SectionBlock's default
      // bottom padding to keep the table flush with the card edge (matches the Figma).
      containerClassName="pb-0"
    >
      <div className="flex w-full flex-col gap-2">
        {props.description && (
          <p className="typography-body-small-regular text-content-presentation-global-secondary">
            {props.description}
          </p>
        )}

        <div className="w-full overflow-x-auto">
          {showHandle ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              {table}
            </DndContext>
          ) : (
            table
          )}
        </div>
      </div>
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
