"use client";

import type { ReactNode } from "react";

import {
  Table as GlareTable,
  TableHeader,
  TableBody,
  TableHead,
  TableRow as GlareTableRow,
  TableCell,
} from "../../../Table";
import { Checkbox } from "../../../Checkbox";
import { getByPath } from "../../../../utils/dataViews/pathUtils";
import { renderField } from "../../fieldRenderers";
import { cn } from "../../../../utils/cn";
import type { DynamicRecord, FieldConfig } from "../../types";
import type { TableRow as TableRowData } from "../../../../hooks/dataViews/useTableView";
import {
  RowProvider,
  resolveField,
  useOptionalRowContext,
  useRowContext,
  useTableContext,
} from "./context";

/**
 * The `DataViews.Table.*` primitives.
 *
 * Each one is small on purpose: it reads the shared `useTableView()` instance
 * from context, renders the correct semantics (`aria-sort`, `aria-selected`,
 * the checkbox labels), and gets out of the way. Everything visual is
 * overridable via `className`; everything structural is yours to arrange.
 */

// ─── head ────────────────────────────────────────────────────────────────────

export function TableHeadRow({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const { columns } = useTableContext();
  return (
    <TableHeader>
      <GlareTableRow className={className}>
        {/* No children → every visible column, sortable. The common case
            without having to enumerate them. */}
        {children ?? columns.map((c) => <TableSortHeader key={c.path} field={c} />)}
      </GlareTableRow>
    </TableHeader>
  );
}

export function TableSortHeader({
  field,
  children,
  className,
}: {
  field: string | FieldConfig;
  children?: ReactNode;
  className?: string;
}) {
  const { columns, sort, getSortHeaderProps } = useTableContext();
  const resolved = resolveField(field, columns);
  const { onClick, onKeyDown, "aria-sort": ariaSort } = getSortHeaderProps(resolved.path);

  return (
    <TableHead
      size="M"
      className={className}
      aria-sort={ariaSort}
      tabIndex={0}
      onKeyDown={onKeyDown}
      sortType={sort.by === resolved.path ? sort.order : undefined}
      sortLabel={resolved.label ?? resolved.path}
      onSort={onClick}
    >
      {children ?? resolved.label ?? resolved.path}
    </TableHead>
  );
}

/** A non-sortable header, for a column of actions or a checkbox. */
export function TablePlainHeader({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <TableHead isDummy className={cn("w-12", className)}>
      {children}
    </TableHead>
  );
}

export function TableSelectAll({ className }: { className?: string }) {
  const { selection } = useTableContext();
  return (
    <TablePlainHeader className={className}>
      <Checkbox {...selection.getSelectAllProps()} />
    </TablePlainHeader>
  );
}

// ─── body ────────────────────────────────────────────────────────────────────

export function TableBodyRows({
  children,
  className,
}: {
  /** Render one row. Omit for the default row over every visible column. */
  children?: (row: TableRowData) => ReactNode;
  className?: string;
}) {
  const { rows } = useTableContext();
  return (
    <TableBody className={className}>
      {rows.map((row) =>
        children ? (
          <RowProvider key={row.id} value={row}>
            {children(row)}
          </RowProvider>
        ) : (
          <TableRecordRow key={row.id} record={row} />
        ),
      )}
    </TableBody>
  );
}

export function TableRecordRow({
  record,
  children,
  className,
}: {
  /** The row from `useTableView().rows`. Optional inside `Table.Body`. */
  record?: TableRowData;
  children?: ReactNode;
  className?: string;
}) {
  const { columns } = useTableContext();
  // Inside `Table.Body` the row comes from context; passing it explicitly is
  // for people rendering rows somewhere else entirely.
  const fromContext = useOptionalRowContext();
  const row = record ?? fromContext;
  if (!row) {
    throw new Error("<DataViews.Table.Row> needs a `record`, or to be inside <Table.Body>.");
  }

  const { getRowProps } = useTableContext();
  // `key` is React's, not a DOM attribute — the caller supplies it when mapping.
  const { key, ...rowProps } = getRowProps(row);
  void key;

  return (
    <RowProvider value={row}>
      <GlareTableRow {...rowProps} className={className}>
        {children ?? (
          <>
            <TableSelectCell />
            {columns.map((c) => (
              <TableFieldCell key={c.path} field={c} />
            ))}
          </>
        )}
      </GlareTableRow>
    </RowProvider>
  );
}

export function TableSelectCell({ className }: { className?: string }) {
  const { selection } = useTableContext();
  const row = useRowContext();
  return (
    <TableCell isDummy className={cn("w-12", className)}>
      {/* `Checkbox`, not `TableCheckbox`: the latter types its props as button
          attributes and so does not surface Radix's `checked` /
          `onCheckedChange`. */}
      <div className="flex items-center justify-center">
        <Checkbox size="S" {...selection.getCheckboxProps(row.id)} />
      </div>
    </TableCell>
  );
}

export function TableFieldCell({
  field,
  children,
  className,
}: {
  field: string | FieldConfig;
  /** Bypass `renderField` entirely for this cell. */
  children?: (value: unknown, record: DynamicRecord) => ReactNode;
  className?: string;
}) {
  const { columns } = useTableContext();
  const row = useRowContext();
  const resolved = resolveField(field, columns);
  const value = getByPath(row.record, resolved.path);

  return (
    <TableCell className={className}>
      {children ? (
        children(value, row.record)
      ) : (
        /* `isolate` confines the Badge's mix-blend-luminosity to a local
           stacking context and `transform-gpu` promotes it to its own layer, so
           the table's post-mount column reflow repaints cleanly instead of
           leaving a ghosted badge frame. */
        <span className="isolate inline-flex transform-gpu">
          {renderField(value, resolved, row.record)}
        </span>
      )}
    </TableCell>
  );
}

// ─── shell ───────────────────────────────────────────────────────────────────

/** The `<table>` element itself. Rarely needed directly. */
export function TableShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="flex h-full flex-col bg-background-presentation-form-base">
      <div className="flex-1 overflow-auto rounded-lg">
        <GlareTable className={cn("w-full", className)}>{children}</GlareTable>
      </div>
    </div>
  );
}
