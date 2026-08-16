import type { Path, Row } from "./types";

/**
 * Split cache. Bounded on purpose — the previous implementation used an unbounded module-level
 * `Map`, which in a long-lived app grows for every distinct path string it ever sees. Paths come
 * from a fixed field config in practice, so a small cap costs nothing and removes the leak.
 */
const CACHE_LIMIT = 512;
const cache = new Map<string, string[]>();

function split(path: Path): string[] {
  const hit = cache.get(path);
  if (hit) return hit;
  const parts = path.split(".");
  if (cache.size >= CACHE_LIMIT) cache.clear();
  cache.set(path, parts);
  return parts;
}

/** Read a dotted path off a row. Returns `undefined` for any missing link in the chain. */
export function getByPath(obj: unknown, path: Path | undefined | null): unknown {
  if (obj == null || path == null || path === "") return undefined;
  if (typeof obj !== "object") return undefined;
  let cur: unknown = obj;
  for (const key of split(path)) {
    if (cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}

/** Read a path and coerce to string for display/compare. `undefined`/`null` become `""`. */
export function getString(obj: unknown, path: Path | undefined | null): string {
  const v = getByPath(obj, path);
  return v == null ? "" : String(v);
}

/** `"created_at"` / `"createdAt"` → `"Created At"`. Uses the last segment of a dotted path. */
export function formatPathLabel(path: Path): string {
  if (!path) return "";
  const tail = path.includes(".") ? path.split(".").pop()! : path;

  if (tail.includes("_")) {
    return tail
      .split("_")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  return tail
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

/**
 * The default row identity: the first of `row.id`, `row._id`, `row.uuid`, else the array index.
 *
 * The previous implementation fell back through three candidates ending in the array index, so
 * selection and drag-and-drop both broke the moment rows were reordered. Pass `getRowId` when
 * your id lives elsewhere.
 */
export function defaultGetRowId(row: Row, index: number): string {
  const id = row.id ?? row._id ?? row.uuid;
  return id == null ? String(index) : String(id);
}
