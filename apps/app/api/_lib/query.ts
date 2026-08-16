import { getByPath } from "@/utils/dataViews/path";
import type { DataViewsQuery, Row } from "@/utils/dataViews/types";

/**
 * The querying every endpoint does.
 *
 * This is the half of a DataViews app that is *not* DataViews: searching, filtering, sorting and
 * paging all happen here, on the server, and the component is handed one page of finished rows.
 * The examples exist to show that split, so this is the only place in the suite where a row is
 * compared against anything.
 *
 * It speaks the same `FilterState` the component emits — `DataViews.Filters` produces exactly the
 * JSON that arrives in the query string — so there is no translation layer between what the user
 * touched and what the endpoint reads. The query string itself is decoded by `parseQuery`, which
 * lives beside the encoder in `lib/utils/dataViews/query.ts` so the two cannot drift.
 */

/** What every endpoint answers with. */
export interface PageResult<T> {
  rows: T[];
  /** After filtering, before paging — the pager cannot work this out for itself. */
  total: number;
  page: number;
  pageSize: number;
}


export interface QueryOptions {
  /** Which paths the search box looks in. A search with none declared matches everything. */
  searchPaths?: readonly string[];
  /**
   * Paths whose `string[]` filter means "contains this text" rather than "is one of these".
   * The two arrive identically — a text filter is a one-element array — so the endpoint has to be
   * told which is which.
   */
  textPaths?: readonly string[];
}

const asString = (value: unknown) => (value === null || value === undefined ? "" : String(value));

export function runQuery<T extends Row>(
  source: readonly T[],
  q: DataViewsQuery,
  { searchPaths = [], textPaths = [] }: QueryOptions = {},
): PageResult<T> {
  let rows = [...source];

  const needle = q.search.trim().toLowerCase();
  if (needle && searchPaths.length > 0) {
    rows = rows.filter((row) =>
      searchPaths.some((path) => asString(getByPath(row, path)).toLowerCase().includes(needle)),
    );
  }

  for (const [path, value] of Object.entries(q.filters)) {
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      if (textPaths.includes(path)) {
        const text = String(value[0] ?? "").toLowerCase();
        rows = rows.filter((row) => asString(getByPath(row, path)).toLowerCase().includes(text));
      } else {
        rows = rows.filter((row) => value.includes(asString(getByPath(row, path))));
      }
    } else if (value.kind === "number") {
      rows = rows.filter((row) => {
        const n = Number(getByPath(row, path));
        if (Number.isNaN(n)) return false;
        return (value.min === undefined || n >= value.min) && (value.max === undefined || n <= value.max);
      });
    } else {
      rows = rows.filter((row) => {
        const d = asString(getByPath(row, path));
        return (!value.from || d >= value.from) && (!value.to || d <= value.to);
      });
    }
  }

  const sort = q.sort;
  if (sort) {
    const dir = sort.direction === "asc" ? 1 : -1;
    rows.sort((a, b) => {
      const x = getByPath(a, sort.path);
      const y = getByPath(b, sort.path);
      if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
      return asString(x).localeCompare(asString(y)) * dir;
    });
  }

  const total = rows.length;
  // Clamp rather than 404: deleting the rows under someone sitting on the last page should show
  // them the new last page, not an error.
  const lastPage = Math.max(1, Math.ceil(total / q.pageSize));
  const page = Math.min(q.page, lastPage);
  const start = (page - 1) * q.pageSize;

  return { rows: rows.slice(start, start + q.pageSize), total, page, pageSize: q.pageSize };
}

/** Every endpoint is slow on purpose, so loading states and `keepPreviousData` are visible. */
export const latency = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
