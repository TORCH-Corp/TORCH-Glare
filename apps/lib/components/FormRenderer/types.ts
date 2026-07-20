import { ReactNode } from "react";
import type {
  DefaultValues,
  FieldErrors,
  FieldValues,
  Resolver,
  UseFormReturn,
} from "react-hook-form";

/**
 * FormRenderer — a thin wrapper around the compound `FormBuilder`. You author the
 * fields as **JSX children** (`FormBuilder.Section`, `FormBuilder.Text`, …); the
 * renderer owns the surrounding concerns: page-vs-drawer display, the absolute
 * title header, vertical field layout inside a drawer, and Submit placement.
 */

export type FormRendererMode = "edit" | "view";
export type FormRendererDisplay = "page" | "drawer";
export type FieldDirection = "horizontal" | "vertical";

export interface FormRendererProps<T extends FieldValues = FieldValues> {
  /** The form body — `FormBuilder.Section` / field / `FormBuilder.Stepper` JSX. */
  children: ReactNode;

  // --- react-hook-form root (forwarded to FormBuilder) ---
  onSubmit: (values: T) => void | Promise<void>;
  onInvalid?: (errors: FieldErrors<T>) => void;
  resolver?: Resolver<T>;
  defaultValues?: DefaultValues<T>;
  values?: T;
  mode?: FormRendererMode;
  loading?: boolean;
  resetOnSuccess?: boolean;
  /** Row layout; defaults to vertical inside a drawer. */
  fieldDirection?: FieldDirection;
  /**
   * A hoisted `useForm` instance to bind the form to. Pass this when something outside the
   * form (e.g. a `summary` `FormSummary`) must read the same live values; the caller owns
   * `resolver`/`defaultValues` on that instance. Omit to let FormRenderer create its own.
   */
  form?: UseFormReturn<T>;

  // --- display ---
  display?: FormRendererDisplay;
  /**
   * A live panel rendered beside the form (page) or in the drawer tray (drawer) — typically a
   * `FormSummary`. Give FormRenderer the same hoisted `form` so the panel reads live values.
   */
  summary?: ReactNode;
  /**
   * Absolute title header + action bar. Used by **both** displays — the page and the
   * drawer render the same `HeaderBar` title pill, so a form looks identical in either.
   */
  header?: { title: string; label?: string; variant?: "new" | "edit" | "detail" };
  submitLabel?: ReactNode;

  /** Drawer control (when `display === "drawer"`). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Overrides `header.title` for the drawer. Plain text — it renders via `HeaderBar`. */
  title?: string;
  /** Overrides `header.label` for the drawer. */
  badge?: string;
  onOpenInNewTab?: () => void;
}
