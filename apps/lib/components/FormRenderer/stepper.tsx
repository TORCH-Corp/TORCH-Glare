"use client";

import * as React from "react";
import { useFormState, type Control, type FieldPath, type FieldValues } from "react-hook-form";

import { cn } from "../../utils/cn";
import { Button } from "../Button";
// The step *registry* stays with the fields: `FieldShell` registers each field name into it, so
// it must ship with FormBuilder (which is installable on its own). Everything else about the
// stepper — the rail, the state, Back/Next — is chrome and lives here. The dependency only ever
// points this way: FormRenderer → FormBuilder, never back.
import { StepContext, type StepRegistry } from "../FormBuilder/context";
// Aliased: this module exports its own `Stepper` and `Step` (the wizard behaviour —
// `FormRenderer.Stepper` / `.Step`), which would otherwise collide with the presentational
// component of the same name.
import {
  Stepper as StepperRail,
  Step as StepPill,
  StepIndicator,
  StepLabel,
  StepConnector,
} from "../Stepper";

// ─── Stepper state context ───────────────────────────────────────────────────

/** Stepper state shared by the nav, the step slots and the Back/Next buttons. */
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

export const StepperContext = React.createContext<StepperContextValue | null>(null);

export const useStepper = () => {
  const ctx = React.useContext(StepperContext);
  if (!ctx) throw new Error("FormRenderer.Step/Back/Next must be used within FormRenderer.Stepper");
  return ctx;
};

// ─── Step (declaration only — the Stepper reads its props) ───────────────────

export interface StepProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Declares a wizard step. It renders nothing itself — `FormRenderer.Stepper`
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
 *
 * `control` is passed in rather than read from context: the rail renders in its own grid column
 * **outside** the `<form>`, so there is no `FormProvider` above it to read. Same reason
 * `useStepperState` takes `trigger` as an argument.
 */
function StepperNav({ control }: { control: Control<FieldValues> }) {
  const { titles, currentStep, goToStep, stepFields, completedSteps } = useStepper();
  const { errors } = useFormState({ control });

  const stepHasError = (index: number) =>
    [...(stepFields[index] ?? [])].some((name) => name in errors);

  return (
    // `min-w-0` so the rail can be squeezed: its grid track no longer grows to fit a long label
    // (see form-renderer.tsx), so the column has to be allowed to shrink and let the labels
    // truncate instead of spilling over the fields column.
    //
    // The rail is navigation, so it stays put while the fields scroll past it. Two of these three
    // classes are load-bearing in a way that is easy to get wrong:
    //
    // `self-start` is NOT optional. The rail is a grid item, and a grid item defaults to
    // `align-self: stretch` — its box is already the full row height, so `sticky` alone has no room
    // to move within and does exactly nothing. This is the silent-no-op version of this fix.
    //
    // `top-[72px]`, not `top-0`. `FormHeaderBar` is `absolute inset-x-0 top-0` over a 44px pill at a
    // 4px inset, so it covers the scrollport's first 48px, and the body's own `pt-[72px]` is inside
    // the scrollport and does not push sticky down. `top-0` parks the rail under the floating
    // header; 72px clears it and matches the offset used across this component family.
    //
    // No height cap: the scrollport is the form body, not the viewport, so a `100dvh`-based
    // `max-h` would be wrong in any bounded container (a drawer, the 640px docs frame). A rail
    // taller than the body simply scrolls until its end is reached, which is standard sticky
    // behaviour and correct here.
    <StepperRail
      activeStep={currentStep}
      orientation="vertical"
      className="min-w-0 shrink-0 sticky self-start top-[72px]"
    >
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
            {/* The shrink/truncate pair is passed in rather than changed in `Stepper`, so its
                other consumers keep sizing to their labels. `shrink` beats the pill's own
                `shrink-0` and `truncate` beats the label's `whitespace-nowrap` — both via
                tailwind-merge, which `Stepper` runs the caller's className through. */}
            <StepPill
              index={index}
              type={type}
              onClick={() => void goToStep(index)}
              // `max-w-full` is what actually makes the label truncate: the rail is
              // `items-start`, so without a cap the pill shrink-wraps its label and grows straight
              // past the track instead of clipping inside it.
              className="min-w-0 max-w-full shrink"
            >
              <StepIndicator />
              {/* `max-w-none` opts out of the component's 106px cap: the rail sizes to its own
                  grid track, so the label should truncate there rather than 106px early. */}
              <StepLabel className="max-w-none truncate">{title}</StepLabel>
            </StepPill>
            {/* Connector between steps — the component centres it under the indicator per size. */}
            {index < titles.length - 1 && <StepConnector />}
          </React.Fragment>
        );
      })}
    </StepperRail>
  );
}

// ─── Back / Next chevron nav (the Figma header action bar) ───────────────────

/**
 * Shared chevron nav button, matching the Figma header action bar (Body-HeaderBar-1.0) — the
 * Glare `Button` icon variant, the same control Select/SearchableSelect use for their chevrons.
 */
function StepNavButton({
  dir,
  onClick,
  disabled,
}: {
  dir: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Button
      type="button"
      buttonType="icon"
      size="M"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Previous step" : "Next step"}
    >
      <i
        className={cn(
          "text-[18px]",
          dir === "left" ? "ri-arrow-left-s-line" : "ri-arrow-right-s-line",
        )}
      />
    </Button>
  );
}

/** `FormRenderer.Back` — chevron to the previous step; disabled on the first. */
export function Back() {
  const { goToPrevious, isFirstStep } = useStepper();
  return <StepNavButton dir="left" onClick={goToPrevious} disabled={isFirstStep} />;
}

/** `FormRenderer.Next` — chevron to the next step (validates first); disabled on the last. */
export function Next() {
  const { goToNext, isLastStep } = useStepper();
  return <StepNavButton dir="right" onClick={() => void goToNext()} disabled={isLastStep} />;
}

// ─── Stepper action bar (Back/Next + divider, then the Submit) ────────────────

/**
 * The FormRenderer root wraps its `actions` in this. When the form is a stepper it prepends the
 * chevron `Back`/`Next` controls + a divider before the (user-provided) Submit — the Figma
 * `Body-HeaderBar-1.0` layout. Outside a stepper there's no `StepperContext`, so it renders
 * the actions untouched.
 */
export function StepperActions({ children }: { children?: React.ReactNode }) {
  const stepper = React.useContext(StepperContext);
  if (!stepper) return <>{children}</>;
  return (
    <div className="flex items-center gap-2">
      <Back />
      <Next />
      {/* Divider — white-alpha hairline between the nav and the Submit. */}
      <span aria-hidden className="mx-1 h-5 w-px rounded-[2px] bg-white-alpha-20" />
      {children}
    </div>
  );
}

// ─── Stepper root (marker) + state hook ──────────────────────────────────────

export interface StepperProps {
  children: React.ReactNode;
}

/**
 * `FormRenderer.Stepper` — declares a wizard. It renders **nothing itself**: the
 * FormRenderer root detects it, lifts its state (so the nav can live in its own
 * grid column *outside* the `<form>`), and renders `[nav | active step's fields]`.
 * Children are `FormRenderer.Step`s (plus an optional custom footer).
 *
 * Every step's fields stay registered with react-hook-form at all times — the
 * stepper only controls which step is *visible*. **Navigation is the step buttons
 * themselves**: click a step to move there. Backward is free; clicking forward
 * validates every step in between and stops at the first with errors (which shows a
 * red indicator). Only the last step shows the Submit button.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- children are read by the FormRenderer root
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
 * Stepper state — lifted to the FormRenderer root so the nav (rail) and the step
 * fields can render in separate grid columns while sharing one state. `trigger` is
 * the form's `trigger` (passed in — no `useFormContext` needed). Inert when
 * `steps` is empty (a form without a stepper still calls this, for hooks order).
 */
/**
 * LOCAL PATCH (Contact Center): optional external control of the active step.
 *
 * Upstream owns `currentStep` outright and advances it by clicking a step, gated on validating
 * every step in between. That is right for a wizard whose steps are pages of one form — but not
 * for one whose steps are owned by a SERVER: the import wizard goes upload → (job created) →
 * mapping → (columns mapped, import started) → progress, and the user cannot click ahead to a
 * step that does not exist yet.
 *
 * Passing `activeStep`/`onStepChange` makes the rail a display of someone else's state: internal
 * advancement is suppressed and click-to-navigate is reported rather than applied. Omit both and
 * every existing caller behaves exactly as before.
 */
export interface StepperControl {
  activeStep?: number;
  onStepChange?: (index: number) => void;
}

export function useStepperState(
  steps: React.ReactElement<StepProps>[],
  trigger: TriggerFn,
  control?: StepperControl,
): StepperContextValue {
  const [internalStep, setInternalStep] = React.useState(0);
  // LOCAL PATCH (Contact Center): controlled when `activeStep` is supplied — see `StepperControl`.
  const isControlled = control?.activeStep !== undefined;
  const currentStep = isControlled ? (control?.activeStep as number) : internalStep;
  const setCurrentStep: React.Dispatch<React.SetStateAction<number>> = (value) => {
    const next = typeof value === "function" ? (value as (p: number) => number)(currentStep) : value;
    if (isControlled) control?.onStepChange?.(next);
    else setInternalStep(next);
  };
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
    // LOCAL PATCH (Contact Center): controlled — the owner decides whether the move is allowed,
    // so report it and do not run the forward-validation gauntlet.
    if (isControlled) {
      control?.onStepChange?.(target);
      return;
    }
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
