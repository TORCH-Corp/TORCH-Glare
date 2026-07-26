"use client";

import * as React from "react";
import { useFormState, type FieldPath, type FieldValues } from "react-hook-form";

import { cn } from "../../utils/cn";
import { Button } from "../Button";
import { FormStepper, FormStep, FormStepIndicator, FormStepLabel } from "../FormStepper";
import { StepContext, useStepper, type StepperContextValue, type StepRegistry } from "./context";

// ─── Step (declaration only — the Stepper reads its props) ───────────────────

export interface StepProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Declares a wizard step. It renders nothing itself — `FormBuilder.Stepper`
 * collects Step elements as an array and renders every step's fields (so the
 * **whole form is registered**), toggling visibility per the active step.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- props are read by Stepper, not rendered here
export function Step(_props: StepProps) {
  return null;
}
(Step as unknown as { __isFormStep: boolean }).__isFormStep = true;

export function isStepElement(node: React.ReactNode): node is React.ReactElement<StepProps> {
  return (
    React.isValidElement(node) && (node.type as { __isFormStep?: boolean })?.__isFormStep === true
  );
}

// ─── StepSlot — mounts one step's fields; hidden when not active ─────────────

function StepSlot({
  index,
  active,
  children,
}: {
  index: number;
  active: boolean;
  children: React.ReactNode;
}) {
  const stepper = useStepper();
  const registry: StepRegistry = React.useMemo(
    () => ({
      register: (name) => {
        (stepper.stepFields[index] ??= new Set()).add(name);
      },
      unregister: (name) => {
        stepper.stepFields[index]?.delete(name);
      },
    }),
    [stepper, index],
  );

  // Always mounted (fields stay registered); CSS hides inactive steps.
  return (
    <div className={cn("flex flex-col gap-4", !active && "hidden")}>
      <StepContext.Provider value={registry}>{children}</StepContext.Provider>
    </div>
  );
}

// ─── Stepper navigation (style only) ─────────────────────────────────────────

/**
 * Vertical step rail (matches `Tabs.svg`): the numbered state badges stacked top
 * to bottom, joined by a short vertical connector between consecutive steps.
 */
function StepperNav() {
  const { titles, currentStep, goToStep, stepFields, completedSteps } = useStepper();
  const { errors } = useFormState();

  const stepHasError = (index: number) =>
    [...(stepFields[index] ?? [])].some((name) => name in errors);

  return (
    <FormStepper activeStep={currentStep} className="shrink-0 flex-col items-start gap-[4px]">
      {titles.map((title, index) => {
        // The step buttons ARE the navigation: click to move. Backward is free;
        // clicking forward validates the steps in between (goToStep) and stops at
        // the first one with errors. A live error shows red; a step that has passed
        // validation stays checked (success) even after navigating back to it.
        const type = stepHasError(index)
          ? "negative"
          : completedSteps.has(index)
            ? "success"
            : "default";
        return (
          <React.Fragment key={title}>
            <FormStep index={index} type={type} onClick={() => void goToStep(index)}>
              <FormStepIndicator />
              <FormStepLabel>{title}</FormStepLabel>
            </FormStep>
            {/* Connector between steps — a 3×16 rounded bar centred under the badge. */}
            {index < titles.length - 1 && (
              <div
                aria-hidden
                className="ms-[12.5px] mt-[2px] h-[16px] w-[3px] rounded-full bg-[#A0A0A0]"
              />
            )}
          </React.Fragment>
        );
      })}
    </FormStepper>
  );
}

// ─── Back / Next / default footer ────────────────────────────────────────────

export function Back({ children }: { children?: React.ReactNode }) {
  const { goToPrevious, isFirstStep } = useStepper();
  return (
    <Button type="button" variant="BorderStyle" disabled={isFirstStep} onClick={goToPrevious}>
      {children ?? "Back"}
    </Button>
  );
}

export function Next({ children }: { children?: React.ReactNode }) {
  const { goToNext, isLastStep } = useStepper();
  if (isLastStep) return null;
  return (
    <Button type="button" variant="PrimeStyle" onClick={() => void goToNext()}>
      {children ?? "Next"}
    </Button>
  );
}

// ─── Stepper root (marker) + state hook ──────────────────────────────────────

export interface StepperProps {
  children: React.ReactNode;
}

/**
 * `FormBuilder.Stepper` — declares a wizard. It renders **nothing itself**: the
 * FormBuilder root detects it, lifts its state (so the nav can live in its own
 * grid column *outside* the `<form>`), and renders `[nav | active step's fields]`.
 * Children are `FormBuilder.Step`s (plus an optional custom footer).
 *
 * Every step's fields stay registered with react-hook-form at all times — the
 * stepper only controls which step is *visible*. **Navigation is the step buttons
 * themselves**: click a step to move there. Backward is free; clicking forward
 * validates every step in between and stops at the first with errors (which shows a
 * red indicator). Only the last step shows the Submit button.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- children are read by the FormBuilder root
export function Stepper(_props: StepperProps) {
  return null;
}
(Stepper as unknown as { __isFormStepper: boolean }).__isFormStepper = true;

export function isStepperElement(node: React.ReactNode): node is React.ReactElement<StepperProps> {
  return (
    React.isValidElement(node) &&
    (node.type as { __isFormStepper?: boolean })?.__isFormStepper === true
  );
}

type TriggerFn = (names?: FieldPath<FieldValues>[]) => Promise<boolean>;

/**
 * Stepper state — lifted to the FormBuilder root so the nav (rail) and the step
 * fields can render in separate grid columns while sharing one state. `trigger` is
 * the form's `trigger` (passed in — no `useFormContext` needed). Inert when
 * `steps` is empty (a form without a stepper still calls this, for hooks order).
 */
export function useStepperState(
  steps: React.ReactElement<StepProps>[],
  trigger: TriggerFn,
): StepperContextValue {
  const [currentStep, setCurrentStep] = React.useState(0);
  // Steps that have passed their last validation — kept so their checkmark persists when the
  // user navigates back to an earlier step.
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set());
  const stepFieldsRef = React.useRef<Record<number, Set<string>>>({});
  const titles = steps.map((s) => s.props.title);
  const lastIndex = steps.length - 1;

  const markStep = (step: number, passed: boolean) =>
    setCompletedSteps((prev) => {
      if (passed === prev.has(step)) return prev; // no change
      const next = new Set(prev);
      if (passed) next.add(step);
      else next.delete(step);
      return next;
    });

  const validateStep = async (step: number) => {
    const names = [...(stepFieldsRef.current[step] ?? [])] as FieldPath<FieldValues>[];
    const passed = names.length === 0 ? true : await trigger(names);
    markStep(step, passed);
    return passed;
  };

  // Navigation runs through the step buttons. Backward is free; going forward
  // validates every step between the current one and the target, and stops at
  // the first step that has errors (so you can't skip past an invalid step).
  const goToStep = async (index: number) => {
    const target = Math.max(0, Math.min(index, Math.max(0, lastIndex)));
    if (target <= currentStep) {
      setCurrentStep(target);
      return;
    }
    for (let s = currentStep; s < target; s++) {
      if (!(await validateStep(s))) {
        setCurrentStep(s);
        return;
      }
    }
    setCurrentStep(target);
  };

  const goToNext = async () => {
    if (await validateStep(currentStep)) setCurrentStep((s) => Math.min(s + 1, lastIndex));
  };

  return {
    currentStep,
    totalSteps: steps.length,
    titles,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === lastIndex,
    goToNext,
    goToPrevious: () => setCurrentStep((s) => Math.max(s - 1, 0)),
    goToStep,
    stepFields: stepFieldsRef.current,
    completedSteps,
  };
}

export { StepperNav, StepSlot };
