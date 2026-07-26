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
 * Cell mode — set to `true` by `FormBuilder.Table` around each cell's field so `FieldShell`
 * renders just the control (no label/row chrome) and surfaces validation errors as a tooltip
 * on the control instead of a stacked hint. Off (`false`) everywhere else, so normal fields
 * keep their full `FieldSection` layout.
 */
export const CellContext = createContext<boolean>(false);
export const useCell = () => useContext(CellContext);

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
}
export const StepperContext = createContext<StepperContextValue | null>(null);
export const useStepper = () => {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error("FormBuilder.Step/Back/Next must be used within FormBuilder.Stepper");
  return ctx;
};
