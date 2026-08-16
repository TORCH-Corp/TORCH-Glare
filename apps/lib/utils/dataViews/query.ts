import type { DataViewsQuery, FilterState, Sort } from "./types";

/**
 * The wire format for a `DataViewsQuery`, both directions.
 *
 * A query is written in the browser and read on the server, and the two have to agree exactly.
 * Keeping the encoder and the decoder in one file is what makes that true by construction —
 * split across a page and a route handler, they drift the first time either side gains a field.
 *
 * No React here, like its neighbours `path.ts` and `types.ts`, so a route handler can import it.
 */

/** A query nobody has touched yet: everything, first page. */
export function emptyQuery(overrides?: Partial<DataViewsQuery>): DataViewsQuery {
  return { search: "", filters: {}, sort: null, page: 1, pageSize: 10, ...overrides };
}

/**
 * Browser → wire.
 *
 * `filters` goes as JSON because it is a nested structure, not a flat list of values. `sort` goes
 * as `total:desc` — one parameter rather than two, since neither half means anything alone.
 *
 * Extra parameters an endpoint of your own needs are yours to append:
 *
 * ```ts
 * const params = queryToParams(query);
 * params.set("shape", "wide");
 * ```
 */
export function queryToParams(query: DataViewsQuery): URLSearchParams {
  return new URLSearchParams({
    search: query.search,
    filters: JSON.stringify(query.filters),
    sort: query.sort ? `${query.sort.path}:${query.sort.direction}` : "",
    page: String(query.page),
    pageSize: String(query.pageSize),
  });
}

/**
 * Wire → server.
 *
 * Malformed `filters` is treated as "no filters" rather than a 400: a filter you cannot parse
 * should not take the page down. `pageSize` is clamped, because it arrives from the client and a
 * request for a million rows is a request to fall over.
 */
export function parseQuery(url: URL): DataViewsQuery {
  const params = url.searchParams;

  let filters: FilterState = {};
  const raw = params.get("filters");
  if (raw) {
    try {
      filters = JSON.parse(raw) as FilterState;
    } catch {
      filters = {};
    }
  }

  const [sortPath, sortDir] = (params.get("sort") ?? "").split(":");
  const sort: Sort = sortPath
    ? { path: sortPath, direction: sortDir === "desc" ? "desc" : "asc" }
    : null;

  return {
    search: params.get("search") ?? "",
    filters,
    sort,
    page: Math.max(1, Number(params.get("page")) || 1),
    pageSize: Math.min(500, Math.max(1, Number(params.get("pageSize")) || 10)),
  };
}
