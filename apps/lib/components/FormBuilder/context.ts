"use client";

import { createContext, useContext } from "react";

export type FormBuilderMode = "edit" | "view";
export type FieldDirection = "horizontal" | "vertical";

/** Loading flag — drives the Submit spinner and disables inputs. */
export const LoadingContext = createContext<boolean>(false);
export const useLoading = () => useContext(LoadingContext);

/** Edit vs read-only. Fields render `DisplayField` in `"view"`. */
export const ModeContext = createContext<FormBuilderMode>("edit");
export const useMode = () => useContext(ModeContext);

/** Field row direction — set via `FormBuilder`'s `fieldDirection` prop. */
export const DirectionContext = createContext<FieldDirection>("horizontal");
export const useDirection = () => useContext(DirectionContext);

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
