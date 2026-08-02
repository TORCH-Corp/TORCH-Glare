import type React from "react";

export type ViewType = "table" | "kanban" | "inbox" | "tree";

/**
 * A view's identity in the tab bar. The four built-ins autocomplete; the
 * `string & {}` arm keeps the door open for a consumer-authored view without
 * widening the type to a bare `string`, which would collapse the union and drop
 * the suggestions.
 */
// eslint-disable-next-line @typescript-eslint/ban-types -- deliberate: the standard "literals, or any other string" idiom
export type ViewId = ViewType | (string & {});

export type TreeConfig = {
  childrenField?: string;
  parentField?: string;
  idField?: string;
  orderField?: string;
  nodeLabel?: string;
  defaultExpanded?: "all" | "roots" | "none";
  /** Right-pane mode for the selected tree node. `"details"` is accepted as a
   *  deprecated alias of `"card"` for backward compatibility. */
  defaultRightPane?: "table" | "card" | "details";
  dndEnabled?: boolean;
};

export type ViewVisibility = {
  table?: boolean;
  kanban?: boolean;
  inbox?: boolean;
  tree?: boolean;
};

export type DynamicRecord = Record<string, unknown>;

export type NumericRangeFilter = { kind: "number"; min?: number; max?: number };
export type DateRangeFilter = { kind: "date"; from?: string; to?: string };
export type RangeFilter = NumericRangeFilter | DateRangeFilter;
export type FilterValue = string[] | RangeFilter;
export type FilterState = Record<string, FilterValue>;

export type FieldPreset =
  { label: string; min?: number; max?: number } | { label: string; from?: string; to?: string };

// Palette keys for the Kanban column header pill. Kept in lockstep with
// `COLUMN_PALETTE` in KanbanView.tsx so consumers can pick a color per status
// via `FieldConfig.kanbanVariants`.
export type KanbanColumnColor = "gray" | "purple" | "orange" | "blue" | "green" | "red";

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

export type CurrencyOptions = {
  symbol?: string;
  locale?: string;
  decimals?: number;
  code?: string;
};

export type FieldConfig = {
  path: string;
  label?: string;
  type?: FieldType;
  visible?: boolean;
  order?: number;

  variants?: Record<string, BadgeVariant>;
  defaultVariant?: BadgeVariant;

  // Per-status overrides for the Kanban board view. Keys must match
  // `variants` keys (or any value present in the data). Lets consumers set a
  // human-friendly column title and pick a column pill color without affecting
  // the badge color used elsewhere.
  kanbanVariants?: Record<string, { label?: string; color?: KanbanColumnColor }>;

  variant?: BadgeVariant;
  limit?: number;

  currency?: string | CurrencyOptions;
  format?: Intl.NumberFormatOptions;

  thresholds?: [number, number];

  max?: number;

  icon?: string;
  iconPosition?: "before" | "after";

  secondaryPath?: string;

  linkType?: "mailto" | "tel" | "url";

  fallbackPath?: string;

  dateFormat?: string | Intl.DateTimeFormatOptions;

  trueLabel?: string;
  falseLabel?: string;
  trueVariant?: BadgeVariant;
  falseVariant?: BadgeVariant;

  filterable?: boolean;
  filterLabel?: string;
  filterOptions?: string[] | { label: string; value: string }[];
  presets?: FieldPreset[];
  rangeMin?: number;
  rangeMax?: number;
  rangeStep?: number;
  onFilterChange?: (value: FilterValue) => void;

  render?: (value: unknown, row: DynamicRecord) => React.ReactNode;
} & CategoricalFilterStyle;

/**
 * How a categorical filter is presented.
 *
 * A discriminated union rather than two independent optional props, because
 * `searchable-select` is inherently single-select: pairing it with
 * `filterMode: "multi"` used to typecheck and then be silently ignored at
 * runtime. Now it doesn't compile.
 */
export type CategoricalFilterStyle =
  | {
      /**
       * Inline list of checkboxes (multi) or radios (single). The default when
       * neither prop is given.
       */
      filterVariant?: "checkbox";
      /**
       * - "multi" (default): checkboxes. `FilterValue` is the array of picked options.
       * - "single": radios. `FilterValue` is a 1-element array.
       */
      filterMode?: "single" | "multi";
    }
  | {
      /**
       * A single-select `SearchableSelect` dropdown — useful when a field has
       * many options. `FilterValue` is a 1-element array (empty when cleared).
       */
      filterVariant: "searchable-select";
      /** Not applicable: `searchable-select` is always single-select. */
      filterMode?: never;
    };

export type InboxConfig = {
  starredField?: string | null;
  readField?: string | null;
  attachmentField?: string | null;
  priorityField?: string | null;
  titlePath?: string;
  previewPath?: string;
};

/**
 * Persisted per-column visibility + order, edited by the config panel.
 * Deliberately separate from `FieldConfig`: a field describes *what* a value is
 * and how to render it, a `ColumnState` describes the user's current view
 * preference for it.
 */
export type ColumnState = {
  id: string;
  label: string;
  visible: boolean;
  order: number;
};

export type ViewConfig = {
  /** `ViewId`, not `ViewType`, so a consumer-authored view can be the default. */
  defaultView: ViewId;
  tableColumns: ColumnState[];
  kanbanGroupBy: string;
  showPreviewPane: boolean;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

export const defaultConfig: ViewConfig = {
  defaultView: "table",
  tableColumns: [],
  kanbanGroupBy: "",
  showPreviewPane: true,
  sortBy: "",
  sortOrder: "desc",
};
