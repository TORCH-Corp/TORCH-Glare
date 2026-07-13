import { ReactNode } from "react";
import type {
  ControllerRenderProps,
  ControllerFieldState,
  DefaultValues,
  FieldErrors,
  FieldValues,
  Resolver,
} from "react-hook-form";
import type { FieldDirection, FormBuilderMode } from "./context";

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
}

/** `FormBuilder.Select` / `.SearchableSelect` — supports async option loading. */
export interface SelectFieldProps extends BaseFieldProps {
  options: OptionItem[];
  filterClientSide?: boolean;
  onSearchChange?: (query: string) => void;
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

/** `FormBuilder.Custom` — bring your own control + optional read-only render. */
export interface CustomFieldProps extends BaseFieldProps {
  render: (args: {
    field: ControllerRenderProps<FieldValues, string>;
    fieldState: ControllerFieldState;
  }) => ReactNode;
  formatView?: (value: unknown) => ReactNode;
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

/** `FormBuilder.Segmented` (TabSwitch) — single-select segmented control. */
export type SegmentedFieldProps = OptionsFieldProps;

/** `FormBuilder.ToggleGroup` (ButtonGroup) — single or multi toggle group. */
export interface ToggleGroupFieldProps extends OptionsFieldProps {
  /** Multi-select — value becomes `string[]`. */
  multiple?: boolean;
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

/** `FormBuilder.InlineCalendar` — always-visible calendar; value `Date`. */
export type CalendarFieldProps = BaseFieldProps;

/** `FormBuilder.ToggleButton` — a pressed/unpressed button; value `boolean`. */
export type ToggleButtonFieldProps = BaseFieldProps;

/** `FormBuilder.Slider` — numeric slider; value `number` (or `[number, number]` with `range`). */
export interface SliderFieldProps extends BaseFieldProps {
  min?: number;
  max?: number;
  step?: number;
  /** Two thumbs — value becomes `[number, number]`. */
  range?: boolean;
}

/** `FormBuilder.Color` — color picker; value hex `string`. */
export interface ColorFieldProps extends BaseFieldProps {
  presets?: string[];
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

/** Root `<FormBuilder>` props. */
export interface FormBuilderRootProps<T extends FieldValues = FieldValues> {
  children: ReactNode;
  /** `id` on the underlying `<form>` — lets an outside button submit it via `form={id}`. */
  id?: string;
  onSubmit: (values: T) => void | Promise<void>;
  onInvalid?: (errors: FieldErrors<T>) => void;
  /** RHF resolver — e.g. `zodResolver(schema)`. Library stays validation-agnostic. */
  resolver?: Resolver<T>;
  defaultValues?: DefaultValues<T>;
  /** Controlled values for edit — the form re-syncs when this changes. */
  values?: T;
  /** Loading flag — Submit shows a spinner and inputs disable. */
  loading?: boolean;
  /** `"edit"` (default) or read-only `"view"`. */
  mode?: FormBuilderMode;
  /** Field row direction. Defaults to horizontal (vertical inside a drawer). */
  fieldDirection?: FieldDirection;
  /** Reset to defaults after a successful submit. */
  resetOnSuccess?: boolean;
  className?: string;
}
