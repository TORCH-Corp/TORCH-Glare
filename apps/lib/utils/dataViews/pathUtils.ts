export type Path = string;

const PATH_CACHE = new Map<string, string[]>();

function splitPath(path: Path): string[] {
  const cached = PATH_CACHE.get(path);
  if (cached) return cached;
  const parts = path.split(".");
  PATH_CACHE.set(path, parts);
  return parts;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic path accessor returns arbitrary runtime values
export function getByPath(obj: unknown, path: Path | undefined | null): any {
  if (obj == null || path == null || path === "") return undefined;
  if (typeof obj !== "object") return undefined;

  const parts = splitPath(path);
  let cur: unknown = obj;
  for (let i = 0; i < parts.length; i++) {
    if (cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[parts[i]];
  }
  return cur;
}

export function setByPath<T extends Record<string, unknown>>(
  obj: T,
  path: Path,
  value: unknown,
): T {
  if (!path) return obj;
  const parts = splitPath(path);
  if (parts.length === 0) return obj;

  const root = (Array.isArray(obj) ? [...obj] : { ...obj }) as Record<string, unknown>;
  let cur: Record<string, unknown> = root;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const next = cur[key];
    const cloned = (
      next != null && typeof next === "object" && !Array.isArray(next)
        ? { ...next }
        : Array.isArray(next)
          ? [...next]
          : {}
    ) as Record<string, unknown>;
    cur[key] = cloned;
    cur = cloned;
  }

  cur[parts[parts.length - 1]] = value;
  return root as T;
}

export function hasPath(obj: unknown, path: Path | undefined | null): boolean {
  return getByPath(obj, path) !== undefined;
}

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
 * Stable identity for a record.
 *
 * Prefers a literal `id`, then the value at `fallbackPath` (usually the first
 * visible field), and finally a namespaced index. Views use this for React
 * keys, selection matching, and drag-and-drop targeting, so it must agree
 * across every view rendering the same data — hence one implementation, not
 * one per view.
 *
 * The index fallback is `__row<n>` rather than the bare number because callers
 * compare identities as strings: a record whose id is the string `"2"` and the
 * record sitting at index `2` would otherwise collide, and selecting one would
 * check both. The prefix matches the convention already used by
 * `treeUtils.recordId`, so tree drag-and-drop and view selection agree.
 */
export function getRecordId(item: unknown, fallbackPath: Path | undefined, index: number): unknown {
  const id = (item as Record<string, unknown> | null)?.id;
  if (id != null) return id;
  if (fallbackPath) {
    const v = getByPath(item, fallbackPath);
    if (v != null) return v;
  }
  return `__row${index}`;
}

/**
 * `getRecordId` coerced to a string — the form used for React keys, DOM ids,
 * and selection sets. Prefer this over `String(getRecordId(...))` at call
 * sites so the coercion rule lives in one place.
 */
export function recordKey(item: unknown, fallbackPath: Path | undefined, index: number): string {
  return String(getRecordId(item, fallbackPath, index));
}

export function findFirstDefined(data: readonly unknown[], path: Path): unknown {
  for (const item of data) {
    const v = getByPath(item, path);
    if (v != null) return v;
  }
  return undefined;
}

export function matchesFilterValues(
  item: unknown,
  path: Path,
  filter:
    | string[]
    | { kind: "number"; min?: number; max?: number }
    | { kind: "date"; from?: string; to?: string }
    | undefined,
): boolean {
  if (filter == null) return true;

  if (Array.isArray(filter)) {
    if (filter.length === 0) return true;
    const value = getByPath(item, path);
    if (Array.isArray(value)) {
      const set = new Set(value.map((v) => String(v)));
      return filter.some((s) => set.has(s));
    }
    if (typeof value === "boolean") {
      return filter.includes(value ? "true" : "false");
    }
    return filter.includes(String(value ?? ""));
  }

  if (filter.kind === "number") {
    if (filter.min == null && filter.max == null) return true;
    const raw = getByPath(item, path);
    const n = typeof raw === "number" ? raw : Number(raw);
    if (!Number.isFinite(n)) return false;
    if (filter.min != null && n < filter.min) return false;
    if (filter.max != null && n > filter.max) return false;
    return true;
  }

  if (filter.kind === "date") {
    if (filter.from == null && filter.to == null) return true;
    const raw = getByPath(item, path);
    if (raw == null) return false;
    const ms = raw instanceof Date ? raw.getTime() : Date.parse(String(raw));
    if (!Number.isFinite(ms)) return false;
    if (filter.from != null) {
      const fromMs = Date.parse(filter.from);
      if (Number.isFinite(fromMs) && ms < fromMs) return false;
    }
    if (filter.to != null) {
      const toMs = Date.parse(filter.to);
      if (Number.isFinite(toMs) && ms > toMs + 24 * 60 * 60 * 1000 - 1) return false;
    }
    return true;
  }

  return true;
}
