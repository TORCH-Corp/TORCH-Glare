/**
 * The vocabulary DataViews speaks — nothing more.
 *
 * DataViews does no data work: it never filters, searches, sorts, groups, or infers a schema.
 * Those are the app's job, almost always server-side. What is described here is only what the
 * component needs in order to **paint** rows and to **emit intent** back to you:
 * `FilterState` and `Sort` are things it hands you so you can go and query, not things it applies.
 *
 * These types live in the utils layer so the dependency runs one way — the component imports its
 * vocabulary from here, and nothing here imports React or any component.
 */

import type { ReactNode } from "react";

/** A row is any record. DataViews never assumes a shape beyond the id resolved by `getRowId`. */
export type Row = Record<string, unknown>;

/** A dotted accessor into a row, e.g. `"customer.name"`. */
export type Path = string;

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "boolean"
  | "hidden"
  | "enum-badge"
  | "badge-array"
  | "currency"
  | "number-format"
  | "progress-bar"
  | "star-rating"
  | "icon-text"
  | "two-line"
  | "avatar"
  | "link"
  | "image"
  | "date-format";

export type BadgeVariant =
  | "green"
  | "greenLight"
  | "cocktailGreen"
  | "yellow"
  | "redOrange"
  | "redLight"
  | "rose"
  | "purple"
  | "bluePurple"
  | "blue"
  | "navy"
  | "gray"
  | "highlight";

/** Palette keys for a board column pill. */
export type ColumnColor = "gray" | "purple" | "orange" | "blue" | "green" | "red";

export type CurrencyOptions = {
  symbol?: string;
  locale?: string;
  decimals?: number;
  code?: string;
};

/** How one field is read and painted. You author these — nothing is inferred from the data. */
export type FieldConfig = {
  path: Path;
  label?: string;
  type?: FieldType;
  visible?: boolean;

  /** Value → badge colour, for `enum-badge` / `badge-array`. */
  variants?: Record<string, BadgeVariant>;
  defaultVariant?: BadgeVariant;
  variant?: BadgeVariant;

  limit?: number;
  currency?: string | CurrencyOptions;
  format?: Intl.NumberFormatOptions;
  thresholds?: [number, number];
  max?: number;
  icon?: string;
  iconPosition?: "before" | "after";
  secondaryPath?: Path;
  linkType?: "mailto" | "tel" | "url";
  fallbackPath?: Path;
  dateFormat?: string | Intl.DateTimeFormatOptions;
  trueLabel?: string;
  falseLabel?: string;
  trueVariant?: BadgeVariant;
  falseVariant?: BadgeVariant;

  /** Paint this field yourself. Wins over `type`. */
  render?: (value: unknown, row: Row) => ReactNode;
};

/** A column as the user has arranged it — the projection the config panel edits. */
export type ColumnState = {
  path: Path;
  label: string;
  visible: boolean;
};

type SortDirection = "asc" | "desc";
/** Which column the header shows as sorted. Emitted on click; the component never re-orders rows. */
export type Sort = { path: Path; direction: SortDirection } | null;

type NumericRange = { kind: "number"; min?: number; max?: number };
type DateRange = { kind: "date"; from?: string; to?: string };
type RangeValue = NumericRange | DateRange;
/** A categorical selection, or a range. */
export type FilterValue = string[] | RangeValue;
/** Keyed by field path. */
export type FilterState = Record<Path, FilterValue>;

/** A one-click shortcut on a numeric filter, e.g. "Under 500". */
export type NumberPreset = { label: string; min?: number; max?: number };
/** A one-click shortcut on a date filter, e.g. "Last 30 days". */
export type DatePreset = { label: string; from?: string; to?: string };
/** `Filters.Presets` takes both shapes; each control renders the ones it understands. */
export type Preset = NumberPreset | DatePreset;

/**
 * Everything the user asked for, in one object.
 *
 * This is the whole contract between `DataViews` and your data layer. The component collects it —
 * a search typed in the header, filters set in the rail, a column header clicked, a page turned —
 * and hands it over whole; going and fetching the matching rows is your half.
 *
 * It is one object rather than five callbacks because it is one question. A query with a new
 * filter and a stale page number is not a query anyone meant to ask, and keeping the parts
 * together is what lets the component keep them consistent — changing a filter resets `page` to 1,
 * because a different result set has no page 4 to stay on.
 */
export interface DataViewsQuery {
  search: string;
  filters: FilterState;
  sort: Sort;
  /** 1-based. */
  page: number;
  pageSize: number;
}

/** How a filter maps between its control's value and `FilterState`. */
type FilterKind = "choice" | "number" | "date" | "text";

/**
 * What `DataViews.Filters` learned about one of its children.
 *
 * You never write these: filters are authored as `FormBuilder` fields, and `Filters` reads each
 * child's `name`, `label` and bounds off the element to build this. It exists because the mapping
 * to `FilterState` needs to know a slider from a multi-select — a `[0, 500]` is a numeric range,
 * while `["a", "b"]` is a selection, and the two are indistinguishable once they are just values.
 */
export type FilterFieldDescriptor = {
  path: Path;
  label?: string;
  kind: FilterKind;
  /** Single-valued choice (`FormBuilder.Select`) rather than multi (`.MultiSelect`). */
  single?: boolean;
  /** Slider bounds, read from the child. A slider resting on them emits no filter at all. */
  min?: number;
  max?: number;
};

export type TreeNode = {
  id: string;
  row: Row;
  children: TreeNode[];
  depth: number;
};

/** Emitted by a board or tree drag. The component never applies it. */
export type MoveIntent = {
  id: string;
  from: string | null;
  to: string | null;
  index?: number;
};

/** A pre-grouped column for the board view. You build these; the component only paints them. */
export type RowGroup = {
  id: string;
  label: string;
  color?: ColumnColor;
  rows: Row[];
};
