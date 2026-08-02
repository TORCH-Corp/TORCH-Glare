/**
 * Back-compat barrel. The table now lives in `views/table/` as a hook plus a
 * set of primitives; this keeps `./Table` importable for anything that still
 * points here (notably `Tree.tsx`, which reuses `TableGrid`).
 */
export { Table as DataViewsTableNamespace, TableGrid, useTableContext } from "./table";
export { DataViewsTable } from "./table/Table";
export type { TableProps } from "./table/Table";
