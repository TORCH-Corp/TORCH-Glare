"use client";

import { createContext, useContext } from "react";

import type { DynamicRecord, FieldConfig } from "../../types";
import type { UseTableViewResult, TableRow } from "../../../../hooks/dataViews/useTableView";

/** Published by `Table.Root` so every part below shares one hook instance. */
const TableContext = createContext<UseTableViewResult | null>(null);
export const TableProvider = TableContext.Provider;

export function useTableContext(): UseTableViewResult {
  const ctx = useContext(TableContext);
  if (!ctx) {
    throw new Error(
      "DataViews.Table.* must be rendered inside <DataViews.Table>. " +
        "Use `useTableView()` directly if you are building your own table shell.",
    );
  }
  return ctx;
}

/**
 * The row a cell belongs to. Set by `Table.Row` so `Table.Cell` can read its
 * record without the caller threading it through every cell.
 */
const RowContext = createContext<TableRow | null>(null);
export const RowProvider = RowContext.Provider;

export function useRowContext(): TableRow {
  const row = useContext(RowContext);
  if (!row) {
    throw new Error("DataViews.Table.Cell must be rendered inside <DataViews.Table.Row>.");
  }
  return row;
}

/** The row if there is one — for parts that accept it as a prop instead. */
export function useOptionalRowContext(): TableRow | null {
  return useContext(RowContext);
}

/** Resolve a `field` prop that may be a path string or a full config. */
export function resolveField(
  field: string | FieldConfig,
  columns: readonly FieldConfig[],
): FieldConfig {
  if (typeof field !== "string") return field;
  return columns.find((c) => c.path === field) ?? { path: field, label: field, type: "text" };
}

export type { DynamicRecord };
