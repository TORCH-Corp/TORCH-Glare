"use client";

import type { Row } from "../../../utils/dataViews/types";
import { useDataViewsData, useDataViewsView } from "../context";

/**
 * The row the inbox (or board, or tree) has open, ready to render in a detail pane. Returns
 * `null` when nothing is selected.
 *
 * ```tsx
 * function Detail() {
 *   const row = useActiveRow();
 *   return row ? <h2>{row.subject}</h2> : null;
 * }
 * ```
 */
export function useActiveRow(): Row | null {
  const { rows, getRowId } = useDataViewsData();
  const { activeId } = useDataViewsView();
  if (activeId === null) return null;
  return rows.find((row, i) => getRowId(row, i) === activeId) ?? null;
}
