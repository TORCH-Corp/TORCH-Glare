import type {
  DatePreset,
  FilterFieldDescriptor,
  FilterState,
  FilterValue,
  NumberPreset,
  Preset,
} from "../../../utils/dataViews/types";

/**
 * Translating between `FilterState` (what you receive) and react-hook-form values (what the
 * inputs speak). Pure functions, no React — the fiddly half of `Filters` is here so the component
 * itself stays readable, and so this is testable without rendering anything.
 */

/**
 * RHF reads `.` in a field name as object nesting, so a filter on `customer.name` would arrive as
 * `{ customer: { name: … } }`. Names are escaped on the way in and unescaped on the way out.
 */
export const toName = (path: string) => path.replace(/\./g, "__");

const isRange = (v: FilterValue | undefined): v is Exclude<FilterValue, string[]> =>
  !!v && !Array.isArray(v);

/** `FilterState` → the values the inputs want. */
export function toFormValues(
  filters: FilterState,
  fields: readonly FilterFieldDescriptor[],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const field of fields) {
    const value = filters[field.path];
    const name = toName(field.path);

    switch (field.kind) {
      case "choice": {
        const selected = Array.isArray(value) ? value : [];
        out[name] = field.single ? (selected[0] ?? "") : selected;
        break;
      }
      case "number": {
        const lo = field.min ?? 0;
        const hi = field.max ?? 100;
        const range = isRange(value) && value.kind === "number" ? value : undefined;
        out[name] = [range?.min ?? lo, range?.max ?? hi];
        break;
      }
      case "date": {
        const range = isRange(value) && value.kind === "date" ? value : undefined;
        out[name] = {
          from: range?.from ? new Date(range.from) : undefined,
          to: range?.to ? new Date(range.to) : undefined,
        };
        break;
      }
      case "text":
        out[name] = Array.isArray(value) ? (value[0] ?? "") : "";
        break;
    }
  }

  return out;
}

/**
 * `YYYY-MM-DD` in the **user's** timezone.
 *
 * `toISOString()` converts to UTC first, so someone east of UTC picking "today" in the calendar
 * would emit yesterday's date — an off-by-one-day filter that only reproduces in some timezones.
 */
const iso = (d: unknown) => {
  const date = d instanceof Date ? d : d ? new Date(String(d)) : null;
  if (!date || Number.isNaN(date.getTime())) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/**
 * The inputs' values → `FilterState`.
 *
 * A control at its neutral position produces **no key at all** rather than an empty one. That
 * matters: the emitted query is a request to go and fetch, and `{ total: { min: 0, max: 100 } }`
 * when the slider has never been touched would narrow a query that the user never narrowed.
 *
 * `previous` is merged rather than replaced, and this is load-bearing: these `fields` own only
 * their own paths. `Filters.Custom` writes straight into `FilterState`, and a caller's initial
 * `filters` may carry keys no control was declared for. Rebuilding the state from `fields` alone
 * would silently drop both the moment any control changed.
 */
export function toFilterState(
  values: Record<string, unknown>,
  fields: readonly FilterFieldDescriptor[],
  previous: FilterState = {},
): FilterState {
  const owned = new Set(fields.map((f) => f.path));
  const out: FilterState = {};
  for (const [path, value] of Object.entries(previous)) {
    if (!owned.has(path)) out[path] = value;
  }

  for (const field of fields) {
    const raw = values[toName(field.path)];

    switch (field.kind) {
      case "choice": {
        const selected =
          field.single
            ? raw
              ? [String(raw)]
              : []
            : Array.isArray(raw)
              ? raw.map(String)
              : [];
        if (selected.length > 0) out[field.path] = selected;
        break;
      }
      case "number": {
        if (!Array.isArray(raw)) break;
        const lo = field.min ?? 0;
        const hi = field.max ?? 100;
        const [min, max] = raw as number[];
        // Untouched means "no constraint", not "everything".
        if (min === lo && max === hi) break;
        out[field.path] = { kind: "number", min, max };
        break;
      }
      case "date": {
        const range = (raw ?? {}) as { from?: unknown; to?: unknown };
        const from = iso(range.from);
        const to = iso(range.to);
        if (from || to) out[field.path] = { kind: "date", from, to };
        break;
      }
      case "text": {
        const text = typeof raw === "string" ? raw.trim() : "";
        if (text) out[field.path] = [text];
        break;
      }
    }
  }

  return out;
}

/**
 * Whether two filter states are the same. Used to break the `watch` → `onChange` → new `values`
 * → re-render loop that otherwise eats keystrokes: if nothing actually changed, nothing is
 * emitted.
 */
export function sameFilters(a: FilterState, b: FilterState): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    const x = a[key];
    const y = b[key];
    if (x === undefined || y === undefined) return false;
    if (Array.isArray(x) !== Array.isArray(y)) return false;
    if (Array.isArray(x) && Array.isArray(y)) {
      if (x.length !== y.length || x.some((v, i) => v !== y[i])) return false;
    } else if (JSON.stringify(x) !== JSON.stringify(y)) {
      return false;
    }
  }
  return true;
}

/** The numeric shortcuts out of a mixed `presets` list. */
export const numberPresets = (presets?: readonly Preset[]): NumberPreset[] =>
  (presets ?? []).filter((p): p is NumberPreset => "min" in p || "max" in p);

/** The date shortcuts out of a mixed `presets` list. */
export const datePresets = (presets?: readonly Preset[]): DatePreset[] =>
  (presets ?? []).filter((p): p is DatePreset => "from" in p || "to" in p);
