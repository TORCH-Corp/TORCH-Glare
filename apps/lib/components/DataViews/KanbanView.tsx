"use client";

import type React from "react";
import { Fragment, useMemo, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import type {
  DynamicRecord,
  ViewConfig,
  DynamicColumnConfig,
  FieldConfig,
  KanbanColumnColor,
} from "./types";
import { Button } from "../Button";
import { DataViewCard, type DataViewCardRow } from "../../layouts/DataViewCard";
import { getByPath, setByPath } from "../../utils/dataViews/pathUtils";
import { renderField } from "./fieldRenderers";
import { visibleFields } from "../../utils/dataViews/fieldUtils";
import { useIsMobile } from "../../hooks/useIsMobile";
import { cn } from "../../utils/cn";

export type KanbanViewProps = {
  data: DynamicRecord[];
  columns?: DynamicColumnConfig[];
  fields: FieldConfig[];
  config: ViewConfig;
  onDataUpdate?: (data: DynamicRecord[]) => void;
  groupByField?: string;
  // Path of the field to render as the card title. Defaults to the first
  // visible non-group-by field. Use this to opt out of the "first field wins"
  // heuristic when consumers want a specific field (e.g. "name", "id").
  titleField?: string;
  // Click handler for the column header's overflow button. When omitted the
  // button is hidden so app-less columns stay clean.
  onColumnAction?: (columnId: string) => void;
};

const COLUMN_PALETTE: readonly KanbanColumnColor[] = [
  "gray",
  "purple",
  "orange",
  "blue",
  "green",
  "red",
] as const;
type ColumnColor = KanbanColumnColor;

// Figma kanban header pills use deeply saturated dark fills (#131415, #330C69,
// #532200, #002F66). We match each to the closest existing raw-color token in
// `glare-torch-mode`. Purple has no presentation-layer match close enough, so
// we use the exact Figma hex inline.
const COLUMN_BG: Record<ColumnColor, string> = {
  gray: "bg-black-900",
  purple: "bg-[#330C69]",
  orange: "bg-orange-900",
  blue: "bg-blue-sparkle-900",
  green: "bg-green-cyan-900",
  red: "bg-red-orange-900",
};

const colorIndexFor = (key: string) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return Math.abs(h) % COLUMN_PALETTE.length;
};

type KanbanColumn = {
  id: string;
  title: string;
  color: ColumnColor;
  items: DynamicRecord[];
};

function getId(
  item: DynamicRecord,
  fallbackPath: string | undefined,
  idx: number,
): any {
  if (item?.id != null) return item.id;
  if (fallbackPath) {
    const v = getByPath(item, fallbackPath);
    if (v != null) return v;
  }
  return idx;
}

export function KanbanView({
  data,
  fields,
  onDataUpdate,
  groupByField = "status",
  titleField,
  onColumnAction,
}: KanbanViewProps) {
  const isMobile = useIsMobile();
  const [draggedItem, setDraggedItem] = useState<{
    item: DynamicRecord;
    columnId: string;
  } | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  const displayFields = useMemo(
    () => visibleFields(fields).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [fields],
  );

  const groupField = useMemo(
    () => fields.find((f) => f.path === groupByField),
    [fields, groupByField],
  );

  const kanbanColumns = useMemo<KanbanColumn[]>(() => {
    const groups: Record<string, KanbanColumn> = {};
    const overrides = groupField?.kanbanVariants;

    // Resolve a column's visible title + pill color. Consumer-supplied
    // `kanbanVariants[key]` wins; otherwise fall back to the raw key and the
    // palette rotation.
    const resolve = (key: string, paletteIdx: number) => ({
      title: overrides?.[key]?.label ?? key,
      color:
        overrides?.[key]?.color ??
        COLUMN_PALETTE[paletteIdx % COLUMN_PALETTE.length],
    });

    if (groupField?.variants) {
      Object.keys(groupField.variants).forEach((value, index) => {
        groups[value] = {
          id: value,
          ...resolve(value, index),
          items: [],
        };
      });
    }

    for (const item of data) {
      const value = String(getByPath(item, groupByField) ?? "Uncategorized");
      if (!groups[value]) {
        groups[value] = {
          id: value,
          ...resolve(value, colorIndexFor(value)),
          items: [],
        };
      }
      groups[value].items.push(item);
    }

    return Object.values(groups);
  }, [data, groupByField, groupField]);

  const handleDragStart = (item: DynamicRecord, columnId: string) => {
    setDraggedItem({ item, columnId });
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumnId !== columnId) setDragOverColumnId(columnId);
  };

  const handleDragLeave = (e: React.DragEvent, columnId: string) => {
    // Only clear when the pointer actually exits this column — moving over a
    // child element fires dragleave on the parent before dragenter on the child.
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverColumnId === columnId) setDragOverColumnId(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverColumnId(null);
  };

  const idPath = displayFields[0]?.path;

  const handleDrop = (targetColumnId: string) => {
    if (!draggedItem) {
      setDragOverColumnId(null);
      return;
    }
    const draggedId = getId(draggedItem.item, idPath, -1);

    const updatedData = data.map((item, idx) => {
      const itemId = getId(item, idPath, idx);
      if (itemId === draggedId) {
        return setByPath(item, groupByField, targetColumnId);
      }
      return item;
    });

    onDataUpdate?.(updatedData);
    setDraggedItem(null);
    setDragOverColumnId(null);
  };

  // Resolve the title field: consumer-supplied `titleField` wins, else fall
  // back to the first visible non-group-by field.
  const resolvedTitleField = useMemo(() => {
    if (titleField) return displayFields.find((f) => f.path === titleField);
    return displayFields.find((f) => f.path !== groupByField);
  }, [displayFields, titleField, groupByField]);

  const renderCard = (item: DynamicRecord, idx: number) => {
    const itemId = getId(item, idPath, idx);
    const isDraggingThis =
      draggedItem != null && getId(draggedItem.item, idPath, -1) === itemId;
    const titleFieldResolved = resolvedTitleField;
    const titleValue = titleFieldResolved
      ? getByPath(item, titleFieldResolved.path)
      : "";
    const bodyFields = displayFields.filter(
      (f) => f.path !== groupByField && f.path !== titleFieldResolved?.path,
    );

    // Pair body fields two-per-row so the grid keeps its alternating rhythm
    // even when one side is missing. If a pair has only one non-null value, the
    // surviving cell spans both columns. Fully empty pairs are dropped so we
    // don't render a phantom row with only hairlines.
    const rows: DataViewCardRow[] = [];
    for (let i = 0; i < bodyFields.length; i += 2) {
      const left = bodyFields[i];
      const right = bodyFields[i + 1];
      const leftValue = left ? getByPath(item, left.path) : null;
      const rightValue = right ? getByPath(item, right.path) : null;
      const cells: DataViewCardRow = [];
      if (left && leftValue != null) {
        cells.push({
          key: left.path,
          label: left.label,
          value: renderField(leftValue, left, item),
        });
      }
      if (right && rightValue != null) {
        cells.push({
          key: right.path,
          label: right.label,
          value: renderField(rightValue, right, item),
        });
      }
      if (cells.length > 0) rows.push(cells);
    }

    return (
      <DataViewCard
        key={itemId}
        draggable={!isMobile}
        onDragStart={
          !isMobile
            ? () =>
                handleDragStart(
                  item,
                  String(getByPath(item, groupByField) ?? "Uncategorized"),
                )
            : undefined
        }
        onDragEnd={!isMobile ? handleDragEnd : undefined}
        className={cn(
          isMobile
            ? "cursor-pointer"
            : "cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow",
          !isMobile && isDraggingThis && "opacity-40",
        )}
        title={
          titleFieldResolved &&
          renderField(titleValue, titleFieldResolved, item)
        }
        rows={rows}
      />
    );
  };

  if (isMobile) {
    return (
      <div className="h-full overflow-y-auto p-4 bg-background-presentation-body-primary">
        <div className="flex flex-col gap-4">
          {kanbanColumns.map((column) => (
            <div key={column.id} className="flex flex-col gap-3">
              <ColumnHeader column={column} onAction={onColumnAction} />
              <div className="flex flex-col gap-3">
                {column.items.map((item, idx) => renderCard(item, idx))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-x-auto p-2 bg-background-presentation-body-primary">
      <div className="flex h-full gap-4" style={{ minWidth: "max-content" }}>
        {kanbanColumns.map((column, i) => {
          const isDropTarget =
            draggedItem != null && dragOverColumnId === column.id;
          return (
            <Fragment key={column.id}>
              <div
                className={cn(
                  "flex w-[279px] flex-col gap-2 rounded-[12px] p-1 transition-colors duration-150 ease-in-out border-2 border-transparent",
                  isDropTarget &&
                    "bg-background-presentation-cardbutton-blue-hover border-dashed border-border-presentation-state-focus",
                )}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={(e) => handleDragLeave(e, column.id)}
                onDrop={() => handleDrop(column.id)}
              >
                <ColumnHeader column={column} onAction={onColumnAction} />
                <div className="flex flex-col gap-2 overflow-y-auto py-1">
                  {column.items.map((item, idx) => renderCard(item, idx))}
                </div>
              </div>
              {i < kanbanColumns.length - 1 && (
                <div
                  aria-hidden
                  className="self-stretch mt-[42px] border-dashed border-l-[2px]  border-border-presentation-global-primary"
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

function ColumnHeader({
  column,
  onAction,
}: {
  column: KanbanColumn;
  onAction?: (columnId: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-[8px] px-[6px] py-[4px]",
        COLUMN_BG[column.color],
      )}
    >
      <h3 className="typography-headers-small-medium text-content-presentation-global-primary-light">
        {column.title}
      </h3>
      {onAction && (
        <Button
          variant="BorderStyle"
          buttonType="icon"
          className="h-5 w-5 border-0 bg-transparent text-content-presentation-global-primary-light hover:bg-white/10"
          onClick={() => onAction(column.id)}
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
