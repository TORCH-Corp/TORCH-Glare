"use client";

import { getByPath } from "../../../utils/dataViews/path";
import type { FieldConfig, Row } from "../../../utils/dataViews/types";
import type { DataViewCardRow } from "../../../layouts/DataViewCard";
import { Cell } from "../cell";

/**
 * Turn a row's fields into the `DataViewCard` body.
 *
 * Shared by the board's cards and the tree pane's, so the same row looks the same in both rather
 * than drifting into two nearly-identical builders.
 *
 * Pair the body fields two per row so the card grid keeps its rhythm even when one side is
 * missing: a lone survivor spans both columns, and fully empty pairs are dropped rather than
 * rendering a phantom row of hairlines.
 */
export function buildCardRows(fields: readonly FieldConfig[], row: Row): DataViewCardRow[] {
  const rows: DataViewCardRow[] = [];
  for (let i = 0; i < fields.length; i += 2) {
    const pair = [fields[i], fields[i + 1]];
    const cells: DataViewCardRow = [];
    for (const [offset, field] of pair.entries()) {
      if (!field) continue;
      if (getByPath(row, field.path) == null) continue;
      cells.push({
        // Position, not path — two fields may share one.
        key: `${field.path}-${i + offset}`,
        label: field.label ?? field.path,
        value: <Cell field={field} row={row} />,
      });
    }
    if (cells.length > 0) rows.push(cells);
  }
  return rows;
}
