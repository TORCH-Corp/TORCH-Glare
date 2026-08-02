"use client";

import type { ReactNode } from "react";
import { List } from "lucide-react";

import { Card, CardContent, CardHeader } from "../../../Card";
import { Checkbox } from "../../../Checkbox";
import { getByPath } from "../../../../utils/dataViews/pathUtils";
import { renderField } from "../../fieldRenderers";
import { useIsMobile } from "../../../../hooks/useIsMobile";
import { useTableView } from "../../../../hooks/dataViews/useTableView";
import { useRegisterView } from "../../context";
import { devWarn } from "../../devWarn";
import { ViewSurface } from "../ViewSurface";
import { TableProvider, useTableContext } from "./context";
import {
  TableBodyRows,
  TableHeadRow,
  TableRecordRow,
  TableSelectAll,
  TableShell,
  TableSortHeader,
} from "./parts";

export type TableProps = {
  /** Row ids that are checked. Omit to let the table own selection internally. */
  selectedIds?: ReadonlyArray<unknown>;
  onSelectionChange?: (ids: unknown[]) => void;
  label?: string;
  className?: string;
  /**
   * Compose the table yourself with `DataViews.Table.*`. Omit for the default
   * arrangement — a select-all header over every visible column, and a row per
   * record.
   */
  children?: ReactNode;
};

/**
 * The table view.
 *
 * Callable as-is for the standard table, or used as a namespace to build your
 * own — `DataViews.Table.Head`, `.Row`, `.Cell` and friends all read the same
 * `useTableView()` instance this component provides.
 */
export function DataViewsTable({ label = "List", ...props }: TableProps) {
  const active = useRegisterView({ id: "table", label, icon: <List /> });
  return active ? <TableRoot {...props} /> : null;
}

function TableRoot({ selectedIds, onSelectionChange, className, children }: TableProps) {
  const table = useTableView({ selectedIds, onSelectionChange });
  const isMobile = useIsMobile();

  if (selectedIds && !onSelectionChange) {
    devWarn(
      "table-selection-readonly",
      "<DataViews.Table selectedIds> was supplied without `onSelectionChange`, " +
        "so the checkboxes render but can never change. Add the handler, or drop " +
        "`selectedIds` to let the table own selection.",
    );
  }

  return (
    <TableProvider value={table}>
      <ViewSurface className={className}>
        {isMobile && !children ? (
          <MobileCards />
        ) : children ? (
          // You passed children, so you own the shell — wrapping them in our
          // own <table> here would nest one inside another.
          children
        ) : (
          <TableShell>
            <TableHeadRow>
              <TableSelectAll />
              {table.columns.map((c) => (
                <TableSortHeader key={c.path} field={c} />
              ))}
            </TableHeadRow>
            <TableBodyRows>{(row) => <TableRecordRow record={row} />}</TableBodyRows>
          </TableShell>
        )}
      </ViewSurface>
    </TableProvider>
  );
}

/**
 * Below 768px the table collapses to one card per record. Only used for the
 * default arrangement — if you passed `children` you own the responsive story,
 * because we cannot guess how your columns should stack.
 */
function MobileCards() {
  // Reads the provider's instance — calling `useTableView()` again here would
  // create a second, independent selection state.
  const { rows, columns, selection } = useTableContext();
  return (
    <div className="flex-1 overflow-auto">
      <div className="grid gap-3">
        {rows.map((row) => (
          <Card key={row.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Checkbox className="mt-1" {...selection.getCheckboxProps(row.id)} />
                <div className="flex-1">
                  {columns[0] && (
                    <p className="font-medium">
                      {String(getByPath(row.record, columns[0].path) ?? "")}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {columns.slice(1).map((field) => (
                <div key={field.path} className="flex items-center justify-between text-sm">
                  <span className="text-content-presentation-global-tertiary">{field.label}:</span>
                  <span>{renderField(getByPath(row.record, field.path), field, row.record)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
