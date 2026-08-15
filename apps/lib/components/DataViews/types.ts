import type { ReactNode } from "react";
import type { Themes } from "../../utils/types";
import type {
  ColumnState,
  DataViewsQuery,
  FieldConfig,
  FilterState,
  MoveIntent,
  Row,
  RowGroup,
  Sort,
  TreeNode,
} from "../../utils/dataViews/types";

/**
 * Props for every DataViews part. No runtime imports — this file is types only, as in
 * `FormBuilder/types.ts`.
 *
 * Read every `on*Change` as intent: DataViews reports what the user did and applies none of it
 * itself. The only state that leaves the component is the query — see `DataViewsRootProps`.
 */

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface DataViewsRootProps {
  /** The rows to paint — already filtered, searched and sorted by you. */
  rows: readonly Row[];
  /** How to paint each field. Authored, never inferred. */
  fields: readonly FieldConfig[];
  children: ReactNode;

  /** Stable row identity (default `id ?? _id ?? uuid ?? index`). Selection and drag key off this. */
  getRowId?: (row: Row, index: number) => string;
  /**
   * How many rows match the query, before paging. Supplied by whatever ran it — the component is
   * handed one page and cannot count what it was never sent. It is what `hasMore` is derived from.
   */
  total?: number;
  /** Fetching. Each view paints skeletons in its own shape rather than emptying itself. */
  loading?: boolean;
  /**
   * Called when a view scrolls near its end. Fetch the next page and **append** it to `rows`.
   *
   * A request, not state — it deliberately does not go through `onQueryChange`, so `page` stays
   * the caller's business. With TanStack that is `fetchNextPage`, and `rows` is the flattened
   * pages. Leave it off and nothing loads on scroll.
   *
   * Whether there *is* a next page is not a prop: the component derives it from `rows.length` and
   * `total`, both of which it already has.
   */
  onLoadMore?: () => void;
  /** True while that next page is in flight. Distinct from `loading`, which is the first load. */
  loadingMore?: boolean;

  /**
   * What the user has asked for: search, filters, sort, page, page size.
   *
   * This is the only state that leaves the component, because it is the only state you can act on
   * — everything else (which view is showing, which tab is open, how the columns are arranged,
   * what is selected) changes nothing but the picture, so the component keeps it.
   *
   * Wire `onQueryChange` and go fetch. `query` itself is optional: pass it only when something
   * else genuinely owns the query, such as syncing it to the URL.
   */
  query?: DataViewsQuery;
  onQueryChange?: (query: DataViewsQuery) => void;
  /** Where the query starts. Partial — anything omitted takes its usual default. */
  defaultQuery?: Partial<DataViewsQuery>;

  /** Which view shows first. Defaults to the first one you rendered. */
  defaultView?: string;
  /** Whether the settings rail starts open. */
  defaultPanelOpen?: boolean;

  /**
   * Told, not asked. These report UI state the component owns, for the cases where an app has to
   * react to it — a bulk-action bar needs the selection, a router needs the open row. There is no
   * matching value prop: reporting is not the same as being driven.
   */
  onViewChange?: (view: string) => void;
  onSelectionChange?: (ids: readonly string[]) => void;
  onActiveIdChange?: (id: string | null) => void;

  /**
   * Applied as `data-theme`, as everywhere else in Glare. Note that the filter dropdowns and the
   * date calendar portal to `document.body`, so they follow the *page* theme rather than this one.
   */
  theme?: Themes;
  className?: string;
}

// ─── Shell ────────────────────────────────────────────────────────────────────

export interface HeaderProps {
  title?: ReactNode;
  /** `DataViews.ViewSwitch`, `.Search`, `.Actions`, `.PanelToggle` — in whatever order you like. */
  children?: ReactNode;
  className?: string;
}

export interface ViewSwitchProps {
  className?: string;
}

export interface SearchProps {
  placeholder?: string;
  className?: string;
}

export interface ActionsProps {
  children?: ReactNode;
  className?: string;
}

export interface PanelToggleProps {
  children?: ReactNode;
  className?: string;
}

// ─── Views ────────────────────────────────────────────────────────────────────

/**
 * What every view hands a render prop.
 *
 * `row` is your record, untouched. `id` is what `getRowId` resolved — the same id selection and
 * drag key off, so it is what you pass back to anything that identifies a row.
 */
export interface RowRenderArgs {
  row: Row;
  id: string;
  /** Position within the list this view is painting, not within the dataset. */
  index: number;
  /** The fields the panel left visible, in order — reuse them with `Cell` to stay consistent. */
  fields: readonly FieldConfig[];
}

/** Shared by every view: how it registers itself in the switcher. */
export interface ViewBaseProps {
  /** Switcher id. Defaults to the view's own name, so two boards need explicit ids. */
  id?: string;
  label?: string;
  icon?: ReactNode;
  className?: string;
}

export interface TableViewProps extends ViewBaseProps {
  /** Per-row checkboxes and select-all (default `false`). */
  selectable?: boolean;
  onRowClick?: (row: Row, id: string) => void;
  /**
   * Show a "+ Add New" row at the foot of the table, and what to do when it is pressed. Without
   * it there is no row — the same rule the rest of the component follows: a part exists because
   * you asked for it.
   */
  onAddRow?: () => void;
  /** The label on that row. Defaults to "Add New". */
  addRowLabel?: string;
  /**
   * Reorder rows by dragging. Passing it adds a grip column; leaving it off means no drag at all.
   *
   * Like every other drag here it emits intent and moves nothing — the row settles where it landed
   * only once you hand back reordered `rows`.
   *
   * **A manual order and a sort are two different orders**, and the component cannot reconcile
   * them: it paints whatever you give it. If a sort is active when someone drags a row, decide
   * which one wins — usually by clearing `sort` in the same update that persists the new position.
   */
  onRowMove?: (intent: MoveIntent) => void;
  /**
   * Paint one cell yourself, in this view only.
   *
   * `FieldConfig.render` is the other way to do this and usually the better one: it applies
   * wherever the field is painted, so the board's cards and the tree's labels agree with the
   * table. Reach for this when a field should look *different here* — wider, with an action, or
   * with context only the table has.
   *
   * Return `undefined` to fall through to the normal painting for that cell.
   */
  renderCell?: (args: RowRenderArgs & { field: FieldConfig }) => ReactNode;
}

export interface BoardViewProps extends ViewBaseProps {
  /** Pre-grouped columns. You build these — the board never groups rows itself. */
  groups: readonly RowGroup[];
  /** Which field to show as the card title. */
  titlePath?: string;
  /**
   * Replace the card.
   *
   * The board still owns the wrapper — dragging, the drop target, the click that opens a row —
   * and yours goes inside it, so a custom card keeps working with `onRowMove` without wiring any
   * of it yourself. `group` is the column it is sitting in.
   *
   * ```tsx
   * <DataViews.Board
   *   groups={groups}
   *   renderCard={({ row, fields, isActive }) => (
   *     <MyCard highlighted={isActive}>
   *       <Cell field={fields[0]} row={row} />
   *     </MyCard>
   *   )}
   * />
   * ```
   */
  renderCard?: (
    args: RowRenderArgs & { group: RowGroup; isActive: boolean; isDragging: boolean },
  ) => ReactNode;
  /** Drag-and-drop. Emits intent; the card does not move until you update `rows`. */
  onRowMove?: (intent: MoveIntent) => void;
  onColumnAction?: (groupId: string) => void;
}

export interface InboxViewProps extends ViewBaseProps {
  /** The detail pane. Rendered beside the list; yours to fill. */
  children?: ReactNode;
  /**
   * Replace the list item's contents. The row keeps its hover and selected treatment, its click
   * handling and its link — this fills the inside.
   */
  renderItem?: (args: RowRenderArgs & { isActive: boolean }) => ReactNode;
  /** Names the field whose label titles the list column. */
  titlePath?: string;
  /** Pulled out of the card body and shown as a pill. Defaults to the first date field. */
  datePath?: string;
  itemHref?: (row: Row, id: string) => string;
  /** Your router's Link, so selection navigates client-side. Defaults to a plain `<a>`. */
  linkComponent?: React.ElementType;
  placeholder?: ReactNode;
}

export interface TreeViewProps extends ViewBaseProps {
  /** Pre-built hierarchy. You build it — the tree never derives one from the rows. */
  nodes: readonly TreeNode[];
  labelPath?: string;
  /**
   * Dress a node in the rail.
   *
   * `TreeFolder` owns the row — the indent, the connector lines, the selection band, the drag
   * grip — and takes its label as text, so this returns the three pieces it *can* vary rather
   * than arbitrary markup. `icon` sits before the name, `meta` after it.
   *
   * ```tsx
   * renderNode={({ row }) => ({
   *   icon: <Avatar size="XS" src={row.avatar as string} />,
   *   meta: <Badge label={row.status as string} color="blue" />,
   * })}
   * ```
   *
   * For markup a row cannot hold, put it in `children` — that pane is entirely yours.
   */
  renderNode?: (args: { node: TreeNode; row: Row; fields: readonly FieldConfig[] }) => {
    name?: string;
    icon?: ReactNode;
    meta?: ReactNode;
  };
  expanded?: readonly string[];
  onExpandedChange?: (ids: readonly string[]) => void;
  /** Which node is selected is `activeId` — the tree keeps no second copy. */
  onNodeMove?: (intent: MoveIntent) => void;
  /** The right-hand pane. Yours to fill — commonly a table of the selected node's rows. */
  children?: ReactNode;
}

// ─── Panel ────────────────────────────────────────────────────────────────────

export interface PanelProps {
  children?: ReactNode;
  /** Which tab shows first. Defaults to the first one you rendered. */
  defaultTab?: string;
  title?: ReactNode;
  className?: string;
}

export interface PanelTabProps {
  value: string;
  label: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export interface PanelSectionProps {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export interface PanelColumnsProps {
  title?: ReactNode;
  /**
   * Column visibility and order — drag to reorder, toggle to hide. The component holds it: every
   * view paints from the same arrangement, so hiding a column here also retitles the board's
   * cards, and nothing outside the component can act on it.
   */
  className?: string;
}

export interface PanelSortProps {
  title?: ReactNode;
  /** The same sort the table's column headers set. Both write to the query. */
  className?: string;
}

/** What a saved view restores. Opaque to you — hand back whatever `onSave` gave you. */
export interface SavedViewSnapshot {
  filters: FilterState;
  sort: Sort;
  columns: readonly ColumnState[];
}

export interface SavedView {
  id: string;
  label: string;
  /** What `onSave` handed you. Selecting the view applies it. */
  snapshot?: SavedViewSnapshot;
}

export interface PanelSavedViewsProps {
  title?: ReactNode;
  views?: readonly SavedView[];
  /** Told which view was picked, after it has been applied. */
  onValueChange?: (id: string) => void;
  /**
   * Called with everything needed to persist a view. Store it against an id and hand it back in
   * `views` — selecting it puts the filters, sort and columns back.
   */
  onSave?: (snapshot: SavedViewSnapshot) => void;
  saveLabel?: ReactNode;
  className?: string;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface FiltersProps {
  /**
   * The controls, as `FormBuilder` fields — one JSX child per filter, exactly as a form is
   * written. `Filters` reads each child's `name`, `label` and bounds to learn what it is:
   *
   * ```tsx
   * <DataViews.Filters value={filters} onValueChange={setFilters}>
   *   <FormBuilder.MultiSelect name="status" label="Status" options={STATUS} />
   *   <FormBuilder.Slider name="total" label="Total" range min={0} max={15000} />
   * </DataViews.Filters>
   * ```
   *
   * Fields whose value has no filter meaning — `Checkbox`, `File`, `Custom` — are rendered but not
   * collected; use `Filters.Custom` for a control of your own.
   */
  children?: ReactNode;
  title?: ReactNode;
  clearLabel?: ReactNode;
  className?: string;
}

export interface FilterControlProps {
  path: string;
  label?: ReactNode;
}

/**
 * `DataViews.Filters.Presets` — one-click shortcuts for a slider or a date range, which
 * FormBuilder has no field for.
 *
 * ```tsx
 * <FormBuilder.Slider name="total" label="Total" range min={0} max={15000} />
 * <DataViews.Filters.Presets for="total" items={[{ label: "Under $500", max: 500 }]} />
 * ```
 */
export interface FilterPresetsProps {
  /** The `name` of the field these apply to. */
  for: string;
  items: readonly import("../../utils/dataViews/types").Preset[];
  className?: string;
}

export interface FilterCustomProps extends FilterControlProps {
  /** The escape hatch — render any control against this filter's value. */
  render: (args: {
    value: import("../../utils/dataViews/types").FilterValue | undefined;
    setValue: (v: import("../../utils/dataViews/types").FilterValue | undefined) => void;
  }) => ReactNode;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

// ─── States ───────────────────────────────────────────────────────────────────

