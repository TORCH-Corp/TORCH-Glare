"use client";

import { useCallback, useMemo } from "react";

import { useDataViews } from "../../components/DataViews/context";
import type { DynamicRecord, FieldConfig } from "../../components/DataViews/types";
import { recordKey } from "../../utils/dataViews/pathUtils";
import { useViewData } from "../useViewData";
import { useSelection, type SelectionApi } from "./useSelection";

export type UseTableViewOptions = {
  selectedIds?: ReadonlyArray<unknown>;
  onSelectionChange?: (ids: unknown[]) => void;
};

export type TableRow = {
  /** Stable identity — React key, selection key, DOM id. */
  id: string;
  record: DynamicRecord;
  index: number;
};

export type UseTableViewResult = {
  rows: TableRow[];
  /** Visible fields in display order. */
  columns: readonly FieldConfig[];
  sort: {
    by: string | null;
    order: "asc" | "desc";
    /** Cycles asc → desc on the same column, starts asc on a new one. */
    toggle: (path: string) => void;
  };
  selection: SelectionApi;
  /** Props for a `<tr>`: key, and the selected state assistive tech reads. */
  getRowProps: (row: TableRow) => {
    key: string;
    "data-record-id": string;
    "aria-selected": boolean;
  };
  /** Props for a sortable column header, including `aria-sort`. */
  getSortHeaderProps: (path: string) => {
    onClick: () => void;
    "aria-sort": "ascending" | "descending" | "none";
    role: "columnheader";
    tabIndex: 0;
    onKeyDown: (e: { key: string; preventDefault: () => void }) => void;
  };
};

/**
 * Everything a table needs, with no markup attached.
 *
 * Use it directly when you want to render your own `<table>`; the
 * `DataViews.Table.*` primitives are a thin layer over exactly this.
 */
export function useTableView({
  selectedIds,
  onSelectionChange,
}: UseTableViewOptions = {}): UseTableViewResult {
  const { config, setConfig } = useDataViews();
  const { records, displayFields, idPath } = useViewData({ sort: true });

  const rows = useMemo<TableRow[]>(
    () =>
      records.map((record, index) => ({
        id: recordKey(record, idPath, index),
        record,
        index,
      })),
    [records, idPath],
  );

  const allIds = useMemo(() => rows.map((r) => r.id), [rows]);
  const selection = useSelection({ selectedIds, onSelectionChange, allIds });

  const by = config.sortBy || null;
  const order: "asc" | "desc" = config.sortOrder ?? "asc";

  const toggle = useCallback(
    (path: string) =>
      setConfig({ sortBy: path, sortOrder: by === path && order === "asc" ? "desc" : "asc" }),
    [setConfig, by, order],
  );

  const getRowProps = useCallback(
    (row: TableRow) => ({
      key: row.id,
      "data-record-id": row.id,
      "aria-selected": selection.isSelected(row.id),
    }),
    [selection],
  );

  const getSortHeaderProps = useCallback(
    (path: string) => ({
      onClick: () => toggle(path),
      "aria-sort": (by === path ? (order === "asc" ? "ascending" : "descending") : "none") as
        "ascending" | "descending" | "none",
      role: "columnheader" as const,
      tabIndex: 0 as const,
      // A clickable header must be operable from the keyboard; the library's
      // `TableHead` renders a `<th>`, which is not focusable on its own.
      onKeyDown: (e: { key: string; preventDefault: () => void }) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle(path);
        }
      },
    }),
    [toggle, by, order],
  );

  return {
    rows,
    columns: displayFields,
    sort: { by, order, toggle },
    selection,
    getRowProps,
    getSortHeaderProps,
  };
}
