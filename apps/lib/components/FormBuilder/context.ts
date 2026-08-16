"use client";

import { createContext, useContext } from "react";

export type FieldDirection = "horizontal" | "vertical";

/** Loading flag — drives the Submit spinner and disables inputs. */
export const LoadingContext = createContext<boolean>(false);
export const useLoading = () => useContext(LoadingContext);

/**
 * The `<form>`'s `id`. Provided by the FormBuilder root so a `FormBuilder.Submit` rendered
 * **outside** the `<form>` element — the absolute header's action pill, or the drawer header —
 * can still submit it via native `form={id}` association without the caller wiring an id by hand.
 */
export const FormIdContext = createContext<string | undefined>(undefined);
export const useFormId = () => useContext(FormIdContext);

/**
 * Field row direction — set via `FormBuilder`'s `fieldDirection` prop. `undefined` (the default)
 * means "don't force one": `FieldSection` then uses its own responsive `flexible` layout, which
 * stacks on small screens and goes two-column at `lg`. Only set this to pin a direction.
 */
export const DirectionContext = createContext<FieldDirection | undefined>(undefined);
export const useDirection = () => useContext(DirectionContext);

/**
 * Field chrome mode — how much layout a field draws around its control.
 *
 * - `false` (the default) — the full `FieldSection` row: label, required marker, stacked hint.
 * - `"table"` — a `FormBuilder.Table` cell: no row chrome, errors as a tooltip on the control,
 *   and the control takes the flush table border treatment via `onTable`.
 * - `"bare"` — chrome-less anywhere else, e.g. a `DataViews` filter or config panel: no row and
 *   no stacked hint, but the control keeps its normal standalone border.
 *
 * The two chrome-less modes are deliberately distinct: dropping the label row and taking the
 * table border are different decisions, and only a real table cell wants both.
 */
export type CellMode = "table" | "bare" | false;

export const CellContext = createContext<CellMode>(false);

/** The raw mode. Prefer `useBare` / `useOnTable` — they express the two real questions. */
export const useCellMode = () => useContext(CellContext);
/** True when the field renders without `FieldSection` chrome — `"table"` **or** `"bare"`. */
export const useBare = () => useContext(CellContext) !== false;
/** True only inside a `FormBuilder.Table` cell — drives the control's `onTable` border style. */
export const useOnTable = () => useContext(CellContext) === "table";

/**
 * Step registry — a `FormBuilder.Step` provides this so the fields rendered
 * inside it can register their `name`. `FormBuilder.Next` then validates just
 * those names before advancing. `null` when not inside a stepper.
 */
export interface StepRegistry {
  register: (name: string) => void;
  unregister: (name: string) => void;
}
export const StepContext = createContext<StepRegistry | null>(null);
export const useStepRegistry = () => useContext(StepContext);

/** Stepper state shared by the nav + Back/Next/Submit buttons. */
export interface StepperContextValue {
  currentStep: number;
  totalSteps: number;
  titles: string[];
  isFirstStep: boolean;
  isLastStep: boolean;
  goToNext: () => void | Promise<void>;
  goToPrevious: () => void;
  goToStep: (index: number) => void;
  /** Field names registered per step, for per-step validation. */
  stepFields: Record<number, Set<string>>;
  /** Steps that have passed validation — stay checked even after navigating back. */
  completedSteps: Set<number>;
}
export const StepperContext = createContext<StepperContextValue | null>(null);
export const useStepper = () => {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error("FormBuilder.Step/Back/Next must be used within FormBuilder.Stepper");
  return ctx;
};
