import { ReactNode } from "react";
import type {
  DefaultValues,
  FieldErrors,
  FieldValues,
  Resolver,
  UseFormReturn,
} from "react-hook-form";

/**
 * FormRenderer — the chrome around a `FormBuilder`. You author the fields as **JSX children**
 * (`FormRenderer.Section`, `FormBuilder.Text`, …); the renderer owns everything drawn around
 * them: page-vs-drawer display, the absolute title header, the `actions` bar, the titled section
 * cards, the page gutters and scroll shell, the wizard rail, the `summary` column, and vertical
 * field layout inside a drawer.
 */

export type FormRendererDisplay = "page" | "drawer";
export type FieldDirection = "horizontal" | "vertical" | "flexible";

export interface FormRendererProps<T extends FieldValues = FieldValues> {
  /** The form body — `FormRenderer.Section` / field / `FormRenderer.Stepper` JSX. */
  children: ReactNode;

  // --- react-hook-form root (forwarded to FormBuilder) ---
  /** Submit handler. Optional — a display-only detail-tabs view (`FormRenderer.Sidebar`) has no form. */
  onSubmit?: (values: T) => void | Promise<void>;
  onInvalid?: (errors: FieldErrors<T>) => void;
  resolver?: Resolver<T>;
  defaultValues?: DefaultValues<T>;
  values?: T;
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
   * Lands on the form's outermost element (page display). Use it to let the form fill its
   * parent — e.g. `"flex-1 min-h-0"` inside a flex column that has a height.
   */
  className?: string;
  /**
   * Absolute title header + action bar. Used by **both** displays — the page and the
   * drawer render the same `HeaderBar` title pill, so a form looks identical in either.
   */
  header?: { title: string; label?: string; variant?: "new" | "edit" | "detail" };
  /**
   * The form's action bar — rendered in the header's right-hand action pill (page) or the drawer
   * header (drawer). Put the Save here: `actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}`.
   * A bare `FormBuilder.Submit` auto-targets this form (see `FormBuilder`'s form-id context), so it
   * submits even though the header sits outside the `<form>`.
   */
  actions?: ReactNode;
  /** `id` on the underlying `<form>`. Optional — FormRenderer generates and wires one otherwise. */
  id?: string;

  /** Drawer control (when `display === "drawer"`). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Overrides `header.title` for the drawer. Plain text — it renders via `HeaderBar`. */
  title?: string;
  /** Overrides `header.label` for the drawer. */
  badge?: string;
  onOpenInNewTab?: () => void;
}
