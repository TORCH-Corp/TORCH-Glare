"use client";

import * as React from "react";
import {
  useFormContext,
  useFormState,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "../../utils/cn";
import { Button } from "../Button";
import {
  FormStepper,
  FormStep,
  FormStepIndicator,
  FormStepLabel,
} from "../FormStepper";
import {
  StepperContext,
  StepContext,
  useStepper,
  type StepperContextValue,
  type StepRegistry,
} from "./context";
import { SubmitButton } from "./submit";

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

function isStepElement(node: React.ReactNode): node is React.ReactElement<StepProps> {
  return (
    React.isValidElement(node) &&
    (node.type as { __isFormStep?: boolean })?.__isFormStep === true
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
  const { titles, currentStep, goToStep, stepFields } = useStepper();
  const { errors } = useFormState();

  const stepHasError = (index: number) =>
    [...(stepFields[index] ?? [])].some((name) => name in errors);

  return (
    <FormStepper activeStep={currentStep} className="shrink-0 flex-col items-start gap-[4px]">
      {titles.map((title, index) => {
        // The step buttons ARE the navigation: click to move. Backward is free;
        // clicking forward validates the steps in between (goToStep) and stops at
        // the first one with errors. Errored steps show a red indicator.
        const type = stepHasError(index) ? "negative" : index < currentStep ? "success" : "default";
        return (
          <React.Fragment key={title}>
            <FormStep index={index} type={type} onClick={() => void goToStep(index)}>
              <FormStepIndicator />
              <FormStepLabel>{title}</FormStepLabel>
            </FormStep>
            {/* Connector between steps — a 3×16 rounded bar centred under the badge. */}
            {index < titles.length - 1 && (
              <div aria-hidden className="ms-[12.5px] mt-[2px] h-[16px] w-[3px] rounded-full bg-[#A0A0A0]" />
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

function StepFooter() {
  const { isLastStep } = useStepper();
  // Navigation is via the step buttons — the footer only holds the final Submit,
  // shown once you've reached (and validated your way to) the last step.
  if (!isLastStep) return null;
  return (
    <div className="flex justify-end">
      <SubmitButton>Submit</SubmitButton>
    </div>
  );
}

// ─── Stepper root ────────────────────────────────────────────────────────────

export interface StepperProps {
  children: React.ReactNode;
}

/**
 * Wizard container. Children are `FormBuilder.Step`s. Every step's fields are
 * rendered (and registered with react-hook-form) at all times — the stepper only
 * controls which step is *visible*. **Navigation is the step buttons themselves**:
 * click a step to move there. Backward is free; clicking forward validates every
 * step in between and stops at the first with errors (which shows a red
 * indicator). Only the last step shows the Submit button.
 */
export function Stepper({ children }: StepperProps) {
  const form = useFormContext();
  const [currentStep, setCurrentStep] = React.useState(0);
  const stepFieldsRef = React.useRef<Record<number, Set<string>>>({});

  const array = React.Children.toArray(children);
  const steps = array.filter(isStepElement);
  const extras = array.filter((n) => !isStepElement(n));
  const titles = steps.map((s) => s.props.title);
  const lastIndex = steps.length - 1;

  const validateStep = async (step: number) => {
    const names = [...(stepFieldsRef.current[step] ?? [])] as FieldPath<FieldValues>[];
    return names.length === 0 ? true : form.trigger(names);
  };

  // Navigation runs through the step buttons. Backward is free; going forward
  // validates every step between the current one and the target, and stops at
  // the first step that has errors (so you can't skip past an invalid step).
  const goToStep = async (index: number) => {
    const target = Math.max(0, Math.min(index, lastIndex));
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

  const value: StepperContextValue = {
    currentStep,
    totalSteps: steps.length,
    titles,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === lastIndex,
    goToNext,
    goToPrevious: () => setCurrentStep((s) => Math.max(s - 1, 0)),
    goToStep,
    stepFields: stepFieldsRef.current,
  };

  return (
    <StepperContext.Provider value={value}>
      {/* Vertical rail on the left, the active step's fields on the right. */}
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        <StepperNav />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {steps.map((step, i) => (
            <StepSlot key={i} index={i} active={i === currentStep}>
              {step.props.children}
            </StepSlot>
          ))}
          {extras.length > 0 ? extras : <StepFooter />}
        </div>
      </div>
    </StepperContext.Provider>
  );
}
