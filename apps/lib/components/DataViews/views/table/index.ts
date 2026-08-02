"use client";

import { DataViewsTable as TableComponent } from "./Table";
import {
  TableBodyRows,
  TableFieldCell,
  TableHeadRow,
  TablePlainHeader,
  TableRecordRow,
  TableSelectAll,
  TableSelectCell,
  TableShell,
  TableSortHeader,
} from "./parts";

/**
 * The table view, callable *and* a namespace.
 *
 * `<DataViews.Table />` renders the standard table; `DataViews.Table.Row`,
 * `.Cell` and friends let you build your own out of the same behaviour. Both
 * read one `useTableView()` instance, so selection and sort stay in step
 * whichever level you work at.
 */
export const Table = Object.assign(TableComponent, {
  Shell: TableShell,
  Head: TableHeadRow,
  SortHeader: TableSortHeader,
  PlainHeader: TablePlainHeader,
  SelectAll: TableSelectAll,
  Body: TableBodyRows,
  Row: TableRecordRow,
  SelectCell: TableSelectCell,
  Cell: TableFieldCell,
});

export { TableGrid } from "./TableGrid";
export { useTableContext } from "./context";
export type { TableProps } from "./Table";
