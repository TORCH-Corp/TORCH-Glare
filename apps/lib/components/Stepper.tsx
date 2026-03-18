"use client";

import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

// ─── Context ─────────────────────────────────────────────────────────────────

interface StepperContextValue {
  activeStep: number;
  orientation: "horizontal" | "vertical";
  size: "S" | "M" | "L";
}

const StepperContext = createContext<StepperContextValue>({
  activeStep: 0,
  orientation: "horizontal",
  size: "M",
});

const useStepperContext = () => useContext(StepperContext);

// ─── Stepper Root ────────────────────────────────────────────────────────────

const stepperStyles = cva(["flex gap-0"], {
  variants: {
    orientation: {
      horizontal: "flex-row items-start",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

interface StepperProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof stepperStyles> {
  theme?: Themes;
  activeStep?: number;
  size?: "S" | "M" | "L";
}

const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    {
      className,
      orientation = "horizontal",
      theme,
      activeStep = 0,
      size = "M",
      ...props
    },
    ref,
  ) => (
    <StepperContext.Provider
      value={{
        activeStep,
        orientation: orientation ?? "horizontal",
        size: size ?? "M",
      }}
    >
      <div
        ref={ref}
        data-theme={theme}
        data-orientation={orientation}
        className={cn(stepperStyles({ orientation }), className)}
        {...props}
      />
    </StepperContext.Provider>
  ),
);
Stepper.displayName = "Stepper";

// ─── Step ────────────────────────────────────────────────────────────────────

interface StepProps extends HTMLAttributes<HTMLDivElement> {
  index?: number;
  isCompleted?: boolean;
  isActive?: boolean;
  isError?: boolean;
}

const Step = forwardRef<HTMLDivElement, StepProps>(
  (
    {
      className,
      index = 0,
      isCompleted,
      isActive,
      isError,
      children,
      ...props
    },
    ref,
  ) => {
    const { activeStep, orientation } = useStepperContext();

    const computedActive = isActive ?? index === activeStep;
    const computedCompleted = isCompleted ?? index < activeStep;
    const computedError = isError ?? false;

    return (
      <div
        ref={ref}
        data-active={computedActive || undefined}
        data-completed={computedCompleted || undefined}
        data-error={computedError || undefined}
        data-orientation={orientation}
        className={cn(
          "flex group/step",
          orientation === "horizontal"
            ? "shrink-0 flex-col items-center gap-2"
            : "flex-row gap-3",
          className,
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as React.ReactElement<any>, {
            _active: computedActive,
            _completed: computedCompleted,
            _error: computedError,
            _index: index,
          });
        })}
      </div>
    );
  },
);
Step.displayName = "Step";

// ─── Step Indicator ──────────────────────────────────────────────────────────

const stepIndicatorStyles = cva(
  [
    "flex items-center justify-center shrink-0 rounded-full",
    "border",
    "transition-all duration-200 ease-in-out",
    "typography-body-small-medium",
    "[&_i]:leading-none [&_i]:flex [&_i]:items-center [&_i]:justify-center",
  ],
  {
    variants: {
      state: {
        pending: [
          "bg-background-presentation-action-disabled",
          "border-border-presentation-action-disabled",
          "text-content-presentation-state-disabled",
        ],
        active: [
          "bg-background-presentation-state-information-primary",
          "border-border-presentation-state-focus",
          "text-content-presentation-state-information",
        ],
        completed: [
          "bg-background-presentation-state-success-primary",
          "border-border-presentation-state-success",
          "text-content-presentation-state-success",
        ],
        error: [
          "bg-background-presentation-state-negative-primary",
          "border-border-presentation-state-negative",
          "text-content-presentation-state-negative",
        ],
      },
      size: {
        S: "w-[22px] h-[22px] text-[10px] [&_i]:text-[12px]",
        M: "w-[28px] h-[28px] text-[12px] [&_i]:text-[14px]",
        L: "w-[34px] h-[34px] text-[14px] [&_i]:text-[16px]",
      },
    },
    defaultVariants: {
      state: "pending",
      size: "M",
    },
  },
);

interface StepIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  completedIcon?: ReactNode;
  errorIcon?: ReactNode;
  _active?: boolean;
  _completed?: boolean;
  _error?: boolean;
  _index?: number;
}

const StepIndicator = forwardRef<HTMLDivElement, StepIndicatorProps>(
  (
    {
      className,
      icon,
      completedIcon,
      errorIcon,
      _active,
      _completed,
      _error,
      _index = 0,
      children,
      ...props
    },
    ref,
  ) => {
    const { size } = useStepperContext();

    const state = _error
      ? "error"
      : _completed
        ? "completed"
        : _active
          ? "active"
          : "pending";

    const renderContent = () => {
      if (_error && errorIcon) return errorIcon;
      if (_error) return <i className="ri-close-line" />;
      if (_completed && completedIcon) return completedIcon;
      if (_completed) return <i className="ri-check-line" />;
      if (icon) return icon;
      if (children) return children;
      return _index + 1;
    };

    return (
      <div
        ref={ref}
        className={cn(stepIndicatorStyles({ state, size }), className)}
        {...props}
      >
        {renderContent()}
      </div>
    );
  },
);
StepIndicator.displayName = "StepIndicator";

// ─── Step Connector (the line between steps) ────────────────────────────────

const connectorStyles = cva(["transition-all duration-200 ease-in-out"], {
  variants: {
    orientation: {
      horizontal: "h-[2px] flex-1 mx-2 mt-[13px]",
      vertical: "w-[2px] flex-1 min-h-[24px] my-2",
    },
    state: {
      pending: "bg-border-presentation-action-disabled",
      completed: "bg-border-presentation-state-focus",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    state: "pending",
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      className: "self-start",
    },
  ],
});

interface StepConnectorProps extends HTMLAttributes<HTMLDivElement> {
  _completed?: boolean;
  _active?: boolean;
  _error?: boolean;
  _index?: number;
}

const StepConnector = forwardRef<HTMLDivElement, StepConnectorProps>(
  (
    { className, _completed, _active: _a, _error: _e, _index: _i, ...props },
    ref,
  ) => {
    const { orientation } = useStepperContext();

    return (
      <div
        ref={ref}
        className={cn(
          connectorStyles({
            orientation,
            state: _completed ? "completed" : "pending",
          }),
          className,
        )}
        {...props}
      />
    );
  },
);
StepConnector.displayName = "StepConnector";

// ─── Step Label ──────────────────────────────────────────────────────────────

interface StepLabelProps extends HTMLAttributes<HTMLDivElement> {
  _active?: boolean;
  _completed?: boolean;
  _error?: boolean;
  _index?: number;
}

const StepLabel = forwardRef<HTMLDivElement, StepLabelProps>(
  ({ className, _active, _completed, _error, _index: _i, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "typography-body-small-medium transition-colors duration-200 ease-in-out",
        _active
          ? "text-content-presentation-state-information"
          : _error
            ? "text-content-presentation-state-negative"
            : _completed
              ? "text-content-presentation-global-primary"
              : "text-content-presentation-state-disabled",
        className,
      )}
      {...props}
    />
  ),
);
StepLabel.displayName = "StepLabel";

// ─── Step Description ────────────────────────────────────────────────────────

interface StepDescriptionProps extends HTMLAttributes<HTMLDivElement> {
  _active?: boolean;
  _completed?: boolean;
  _error?: boolean;
  _index?: number;
}

const StepDescription = forwardRef<HTMLDivElement, StepDescriptionProps>(
  (
    { className, _active, _completed: _c, _error: _e, _index: _i, ...props },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "typography-body-small-regular",
        _active
          ? "text-content-presentation-global-secondary"
          : "text-content-presentation-state-disabled",
        className,
      )}
      {...props}
    />
  ),
);
StepDescription.displayName = "StepDescription";

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
  Stepper,
  Step,
  StepIndicator,
  StepConnector,
  StepLabel,
  StepDescription,
  stepperStyles,
  stepIndicatorStyles,
  connectorStyles,
};
