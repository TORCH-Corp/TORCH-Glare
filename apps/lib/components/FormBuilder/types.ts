import { ReactNode } from "react";
import type {
  ControllerRenderProps,
  ControllerFieldState,
  DefaultValues,
  FieldErrors,
  FieldValues,
  Resolver,
  UseFormReturn,
} from "react-hook-form";
import type { FieldDirection } from "./context";
import type { SectionColor } from "../SectionBlock";

/** Props shared by every `FormBuilder.*` field. `name` is the RHF path. */
export interface BaseFieldProps {
  name: string;
  label?: ReactNode;
  placeholder?: string;
  description?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  /** Span the full section width. */
  fullWidth?: boolean;
}

export interface OptionItem {
  label: string;
  value: string;
  icon?: ReactNode;
  /** Secondary row label — shown by `FormBuilder.RadioList` / `.CheckboxGroup`. */
  description?: string;
}

/** `FormBuilder.Select` / `.SearchableSelect` — supports async option loading. */
/** `FormBuilder.Select` — the plain `Select` dropdown. */
export interface SelectFieldProps extends BaseFieldProps {
  options: OptionItem[];
}

/**
 * `FormBuilder.SearchableSelect` — the `SearchableSelect` combobox: a search box with
 * client-side filtering, or server-side search + infinite scroll via the async props.
 */
export interface SearchableSelectFieldProps extends SelectFieldProps {
  /** Filter `options` locally (default). Set false for server-side search. */
  filterClientSide?: boolean;
  /** Debounced as the user types — refetch your data here. */
  onSearchChange?: (query: string) => void;
  /** Called when the list bottom scrolls into view and `hasMore && !loading`. */
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

/** `FormBuilder.MultiSelect` / `.Tags`, `.Radio`. */
export interface OptionsFieldProps extends BaseFieldProps {
  options: OptionItem[];
}

/** `FormBuilder.Currency`. */
export interface CurrencyFieldProps extends BaseFieldProps {
  currencySymbol?: ReactNode;
}

/** `FormBuilder.File` / `.Image`. */
export interface FileFieldProps extends BaseFieldProps {
  accept?: string;
  multiple?: boolean;
}

/** `FormBuilder.Custom` — bring your own control, keeping the FieldSection + validation wiring. */
export interface CustomFieldProps extends BaseFieldProps {
  render: (args: {
    field: ControllerRenderProps<FieldValues, string>;
    fieldState: ControllerFieldState;
  }) => ReactNode;
}

/** `FormBuilder.Date` / `.DateRange` / `.DateMultiple` / `.DateTime`. */
export interface DateFieldProps extends BaseFieldProps {
  mode?: "single" | "multiple" | "range";
  timePicker?: boolean;
  /** Display format, e.g. "yyyy/MM/dd" (DatePicker default). */
  dateFormat?: string;
}

/** `FormBuilder.Otp` — code input; value is a string of `length` digits. */
export interface OtpFieldProps extends BaseFieldProps {
  /** Number of digit slots (default 6). */
  length?: number;
}

/** `FormBuilder.SwitchBox` — a switch inside a `#f9f9f9` field box. */
export interface SwitchBoxFieldProps extends BaseFieldProps {
  /** Text shown inside the box, left of the divider (the design's "Sub-Field-Header"). */
  subLabel?: string;
}

/** `FormBuilder.Checkbox` — a single boolean checkbox with an optional inline label. */
export interface CheckboxFieldProps extends BaseFieldProps {
  /** Text shown inline next to the checkbox (in addition to the field `label`). */
  subLabel?: string;
}

/** One option for `FormBuilder.RadioCards`. */
export interface RadioCardOption {
  label: ReactNode;
  value: string;
  description?: ReactNode;
  disabled?: boolean;
}

/** `FormBuilder.RadioCards` — radio options rendered as cards. */
export interface RadioCardsFieldProps extends BaseFieldProps {
  options: RadioCardOption[];
}

/** `FormBuilder.TreeSelect` (SearchableTree) — hierarchical single-select; value = node id. */
export interface TreeSelectFieldProps<T = unknown> extends BaseFieldProps {
  nodes: T[];
  getNodeId: (node: T) => string;
  getNodeLabel: (node: T) => ReactNode;
  /** Nested data: expose each node's children. */
  getNodeChildren?: (node: T) => T[] | undefined;
  /** Flat data: the key on each node pointing at its parent's id. */
  parentIdKey?: string;
  /** Allow selecting branch (folder) nodes too. */
  selectableFolders?: boolean;
}

/** `FormBuilder.Password` — optionally show a strength meter. */
export interface PasswordFieldProps extends BaseFieldProps {
  strengthMeter?: boolean;
}

/** `FormBuilder.Slider` — numeric slider; value `number` (or `[number, number]` with `range`). */
export interface SliderFieldProps extends BaseFieldProps {
  min?: number;
  max?: number;
  step?: number;
  /** Two thumbs — value becomes `[number, number]`. */
  range?: boolean;
  /** Appended to the value readout, e.g. `"%"` → `50%`. */
  suffix?: string;
}

/** `FormBuilder.Color` — color picker; value hex `string`. */
export interface ColorFieldProps extends BaseFieldProps {
  presets?: string[];
  /** Enable the opacity slider and `#rrggbbaa` output (default true). */
  alpha?: boolean;
}

/** `FormBuilder.Phone` — country dial-code + number; value `string`. */
export interface PhoneFieldProps extends BaseFieldProps {
  defaultCountry?: string;
}

/** `FormBuilder.Signature` — freehand signature pad; value is a PNG data-URL `string`. */
export interface SignatureFieldProps extends BaseFieldProps {
  /** Stroke color (default `#111827`). */
  penColor?: string;
}

/** `FormBuilder.FieldArray` — a repeating list of sub-fields (RHF `useFieldArray`). */
export interface FieldArrayProps {
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  hidden?: boolean;
  addLabel?: ReactNode;
  /** Value for a newly-added row. */
  defaultItem?: Record<string, unknown>;
  /** Render a row's sub-fields; use names like `${rowName}.field`. */
  children: (rowName: string, index: number, remove: () => void) => ReactNode;
}

/** One column of `FormBuilder.Table`. `cell` renders any `FormBuilder.*` field for a row. */
export interface TableColumn {
  header: ReactNode;
  /** Fixed column width in px (otherwise the column sizes to content). */
  width?: number;
  align?: "start" | "center" | "end";
  /**
   * The row-object key this column edits. Set it to make the column header **sortable** — a
   * sort toggle appears and clicking it reorders the rows by this key (asc/desc). Omit for
   * non-sortable columns.
   */
  sortKey?: string;
  /**
   * Render the cell's field. `rowName` is the array path for this row (e.g. `lines.0`), so name
   * sub-fields `${rowName}.<key>`. The field renders "bare" (control only, error as a tooltip).
   */
  cell: (rowName: string, index: number) => ReactNode;
}

/**
 * `FormBuilder.Table` — an editable table field (built on RHF `useFieldArray`). Each row is a
 * record; each column cell is any `FormBuilder.*` field. Supports per-row checkbox selection
 * (+ select-all + bulk delete), drag-drop reordering, and add/remove rows. Renders inside a
 * `SectionBlock`, so place it as a top-level child (not inside a `FormBuilder.Section`).
 */
export interface TableFieldProps {
  name: string;
  /** SectionBlock title. */
  title?: ReactNode;
  /** SectionBlock color badge (default `"Blue"`). */
  color?: SectionColor;
  icon?: ReactNode;
  description?: ReactNode;
  hidden?: boolean;
  columns: TableColumn[];
  /** Value for a newly-added row. */
  defaultItem?: Record<string, unknown>;
  addLabel?: ReactNode;
  /** Per-row checkboxes + select-all + bulk delete (default `true`). */
  selectable?: boolean;
  /** Drag-drop row reordering (default `true`). */
  reorderable?: boolean;
}

/** Root `<FormBuilder>` props. */
export interface FormBuilderRootProps<T extends FieldValues = FieldValues> {
  children: ReactNode;
  /** `id` on the underlying `<form>` — lets an outside button submit it via `form={id}`. */
  id?: string;
  /**
   * An existing react-hook-form instance. Pass one when something **outside** the
   * form needs the same values — e.g. a `FormSummary` rendered beside it:
   *
   * ```tsx
   * const form = useForm({ resolver, defaultValues })
   * <FormBuilder form={form} …>…</FormBuilder>
   * <FormSummary form={form}>…</FormSummary>
   * ```
   *
   * When omitted, FormBuilder creates its own from `resolver`/`defaultValues`/`values`.
   */
  form?: UseFormReturn<T>;
  onSubmit: (values: T) => void | Promise<void>;
  onInvalid?: (errors: FieldErrors<T>) => void;
  /** RHF resolver — e.g. `zodResolver(schema)`. Library stays validation-agnostic. */
  resolver?: Resolver<T>;
  defaultValues?: DefaultValues<T>;
  /** Controlled values for edit — the form re-syncs when this changes. */
  values?: T;
  /** Loading flag — Submit shows a spinner and inputs disable. */
  loading?: boolean;
  /** Field row direction. Defaults to horizontal (vertical inside a drawer). */
  fieldDirection?: FieldDirection;
  /** Reset to defaults after a successful submit. */
  resetOnSuccess?: boolean;
  /**
   * A live panel (e.g. `FormSummary`) rendered **outside** the `<form>`, as the right column of the
   * adaptive grid — with a stepper it makes a 3-column layout (nav · fields · conclusion), otherwise
   * 2 columns (fields · conclusion). It reads the shared values via its own `form` prop.
   */
  conclusion?: ReactNode;
  className?: string;
}
