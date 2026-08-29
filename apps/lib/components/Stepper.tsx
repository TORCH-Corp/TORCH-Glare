"use client";

import React, { forwardRef, HTMLAttributes, ReactNode, createContext, useContext } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

/**
 * Stepper — the pill-shaped multi-step indicator from Figma `FormStepper-1.0`.
 *
 * This is the single stepper in the library: it merges the Figma pill (three semantic types with
 * resting/hover/selected states and a corner badge) with the orientation, sizes and connector that
 * used to live in a separate generic component.
 *
 * `type` + `selected` express the four states the generic one had:
 *   pending → type="default" unselected · active → type="default" selected
 *   completed → type="success"          · error  → type="negative"
 *
 * Not to be confused with `FormRenderer.Stepper`, which is the wizard *behaviour* (step state,
 * validation, Back/Next) and renders this component as its rail.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

type StepperType = "default" | "success" | "negative";
type StepperOrientation = "horizontal" | "vertical";
type StepperSize = "S" | "M" | "L";

// ─── Context ─────────────────────────────────────────────────────────────────

interface StepperContextValue {
  activeStep: number;
  orientation: StepperOrientation;
  size: StepperSize;
}

const StepperContext = createContext<StepperContextValue>({
  activeStep: 0,
  orientation: "horizontal",
  size: "M",
});

const useStepperContext = () => useContext(StepperContext);

// ─── Stepper Root ────────────────────────────────────────────────────────────

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  theme?: Themes;
  activeStep?: number;
  /** Direction the step pills flow. Vertical is the FormRenderer rail. */
  orientation?: StepperOrientation;
  /** Scales the pill, indicator and label. Figma defines M; S and L scale from it. */
  size?: StepperSize;
}

const stepperStyles = cva(["flex"], {
  variants: {
    orientation: {
      horizontal: "flex-row items-center gap-3",
      vertical: "flex-col items-start gap-[4px]",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ className, theme, activeStep = 0, orientation = "horizontal", size = "M", ...props }, ref) => (
    <StepperContext.Provider value={{ activeStep, orientation, size }}>
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

// ─── Step (the pill wrapper) ─────────────────────────────────────────────────

const stepStyles = cva(
  [
    "group/step inline-flex items-center shrink-0",
    "rounded-full p-[2px] max-w-[144px]",
    "transition-all duration-200 ease-in-out",
    "cursor-pointer select-none outline-none",
  ],
  {
    variants: {
      // M is the size Figma draws (28px pill / 24px indicator); S and L scale from it.
      size: {
        S: "h-[24px]",
        M: "h-[28px]",
        L: "h-[34px]",
      },
      // Selection drives the pill background; a raised surface appears on hover for unselected
      // pills. `drop-shadow` rather than `shadow`: Figma draws a filter that follows the pill's
      // rounded silhouette, where a box-shadow would ring the layout box.
      selected: {
        true: [
          "bg-background-presentation-button-hover",
          // Figma's onSelect and onSelect-Hoverd carry the same shadow — a selected pill does not
          // deepen when you hover it.
          "drop-shadow-[0_0_16px_rgba(0,0,0,0.2)]",
        ],
        false: [
          "bg-transparent",
          // Figma binds this to the raw palette colour `White/00`, which would stay solid white in
          // dark theme. `form-base` is the themable equivalent — identical in light, and a raised
          // surface rather than a white slab in dark.
          "hover:bg-background-presentation-form-base",
          "hover:drop-shadow-[0_0_16px_rgba(0,0,0,0.05)]",
        ],
      },
    },
    defaultVariants: {
      selected: false,
      size: "M",
    },
  },
);

interface StepProps extends Omit<HTMLAttributes<HTMLDivElement>, "type"> {
  index?: number;
  type?: StepperType;
  selected?: boolean;
}

const Step = forwardRef<HTMLDivElement, StepProps>(
  ({ className, index = 0, type = "default", selected, children, ...props }, ref) => {
    const { activeStep, size } = useStepperContext();
    const isSelected = selected ?? index === activeStep;

    return (
      <div
        ref={ref}
        data-selected={isSelected || undefined}
        data-type={type}
        className={cn(stepStyles({ selected: isSelected, size }), className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
            _selected: isSelected,
            _type: type,
            _index: index,
          });
        })}
      </div>
    );
  },
);
Step.displayName = "Step";

// ─── StepIndicator (circle badge) ────────────────────────────────────────────

const stepIndicatorStyles = cva(
  [
    "relative inline-flex items-center justify-center shrink-0",
    "rounded-full",
    "transition-colors duration-200 ease-in-out",
    "typography-body-medium-medium",
  ],
  {
    variants: {
      // The pill is `p-[2px]`, so the indicator is always the pill height minus 4. It is a capsule,
      // not a circle: `min-w` + `px` let a two-digit step number widen it, as Figma draws.
      size: {
        S: "h-[20px] min-w-[20px] px-[5px] text-[12px]",
        M: "h-[24px] min-w-[24px] px-[6px] text-[14px]",
        L: "h-[30px] min-w-[30px] px-[7px] text-[16px]",
      },
      type: {
        // `ring` rather than `border`: a ring is a box-shadow and takes no layout space, so the
        // `min-w`/`px` capsule above lands on Figma's exact width. A 3px border would eat the
        // content box under `border-box` and push a single digit past it.
        default: ["ring-[3px] ring-inset"],
        success: [
          "bg-background-presentation-state-success-primary text-content-presentation-global-primary-inverse",
        ],
        negative: [
          "bg-background-presentation-state-negative-primary text-content-presentation-global-primary-inverse",
        ],
      },
      // Only meaningful for type=default. Selected = filled blue, otherwise
      // ring color comes from the resting/hover compound variants below.
      selected: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      type: "default",
      selected: false,
      size: "M",
    },
    compoundVariants: [
      // Default type, not selected: gray ring + gray number at rest;
      // hover (driven by parent .group/step) flips ring blue, number primary.
      {
        type: "default",
        selected: false,
        className: [
          "bg-transparent ring-border-presentation-stepper-default text-content-presentation-global-secondary",
          "group-hover/step:ring-content-presentation-state-information",
          "group-hover/step:text-content-presentation-global-primary",
        ],
      },
      // Default type, selected: solid blue fill, inverse number, no ring.
      {
        type: "default",
        selected: true,
        className: [
          "bg-background-presentation-state-information-primary ring-transparent text-content-presentation-global-primary-inverse",
        ],
      },
    ],
  },
);

const stepIndicatorBadgeStyles = cva(
  [
    "absolute",
    "rounded-full",
    "inline-flex items-center justify-center",
    "border border-background-presentation-body-primary",
    // Figma sits the glyph in a fixed square frame. Without pinning the box, a Remix icon's
    // advance width is wider than its font-size and pushes the badge past its designed 15px.
    "[&_i]:leading-none [&_i]:flex [&_i]:items-center [&_i]:justify-center",
    // LTR: badge top-right; RTL: badge top-left
    "ltr:right-[-4.94px] rtl:left-[-4.94px]",
  ],
  {
    variants: {
      size: {
        // Padding absorbs the 1px ring: Figma draws its stroke inside the 15px frame, where
        // `border-box` adds it on top. Its documented 2.667px would render a 16.9px badge.
        S: "h-[13px] min-w-[13px] px-[1.35px] -top-[4px] [&_i]:text-[8.3px] [&_i]:size-[8.3px]",
        M: "h-[15px] min-w-[15px] px-[1.7px] -top-[5px] [&_i]:text-[9.6px] [&_i]:size-[9.6px]",
        L: "h-[18px] min-w-[18px] px-[2.25px] -top-[6px] [&_i]:text-[11.5px] [&_i]:size-[11.5px]",
      },
      type: {
        success:
          "bg-background-presentation-state-success-primary text-content-presentation-global-primary-inverse",
        negative:
          "bg-background-presentation-state-negative-primary text-content-presentation-global-primary-inverse",
      },
    },
    defaultVariants: {
      size: "M",
    },
  },
);

interface StepIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Icon in the corner badge (success/negative types only). */
  badgeIcon?: ReactNode;
  /** Replaces the step number in the circle. */
  icon?: ReactNode;
  /** Replaces the circle's content when the step is `success`. */
  completedIcon?: ReactNode;
  /** Replaces the circle's content when the step is `negative`. */
  errorIcon?: ReactNode;
  _selected?: boolean;
  _type?: StepperType;
  _index?: number;
}

const StepIndicator = forwardRef<HTMLDivElement, StepIndicatorProps>(
  (
    {
      className,
      badgeIcon,
      icon,
      completedIcon,
      errorIcon,
      _selected,
      _type = "default",
      _index = 0,
      children,
      ...props
    },
    ref,
  ) => {
    const { size } = useStepperContext();
    const showBadge = _type === "success" || _type === "negative";
    const defaultBadgeIcon =
      _type === "success" ? <i className="ri-check-line" /> : <i className="ri-information-fill" />;

    // Most specific first: a per-state icon, then a general one, then children, then the number.
    const content =
      (_type === "negative" && errorIcon) ||
      (_type === "success" && completedIcon) ||
      icon ||
      children ||
      _index + 1;

    return (
      <div
        ref={ref}
        className={cn(stepIndicatorStyles({ type: _type, selected: !!_selected, size }), className)}
        {...props}
      >
        {content}
        {showBadge && (
          <span
            className={cn(
              stepIndicatorBadgeStyles({
                type: _type as "success" | "negative",
                size,
              }),
            )}
            aria-hidden
          >
            {badgeIcon ?? defaultBadgeIcon}
          </span>
        )}
      </div>
    );
  },
);
StepIndicator.displayName = "StepIndicator";

// ─── StepLabel ───────────────────────────────────────────────────────────────

const stepLabelStyles = cva(
  [
    // Figma caps the label and ellipsizes it, so a long step title clips inside the pill rather
    // than stretching it. Callers that need more room pass their own `max-w`.
    "max-w-[106px] truncate",
    "transition-[padding,color] duration-200 ease-in-out",
    // At rest the label sits 6px from the circle. On hover (parent pill
    // hovered) the gap grows to 9px — matches figma onHover/onSelect-Hoverd.
    // The outer edge keeps a constant 12px.
    "ltr:pl-[6px] ltr:pr-[12px] rtl:pr-[6px] rtl:pl-[12px]",
    "group-hover/step:ltr:pl-[9px] group-hover/step:rtl:pr-[9px]",
  ],
  {
    variants: {
      size: {
        S: "typography-body-small-medium",
        M: "typography-body-small-medium",
        L: "typography-body-medium-medium",
      },
      selected: {
        true: "text-content-presentation-global-primary-light",
        false: "",
      },
      // Resting colour depends on the type, which is why this cannot be driven by `selected` alone:
      // a default step reads de-emphasized until you hover it, while a success/negative step is
      // already resolved and reads at full strength.
      type: {
        default: "",
        success: "",
        negative: "",
      },
    },
    defaultVariants: {
      selected: false,
      type: "default",
      size: "M",
    },
    compoundVariants: [
      {
        selected: false,
        type: "default",
        className: [
          "text-content-presentation-global-secondary",
          "group-hover/step:text-content-presentation-global-primary",
        ],
      },
      {
        selected: false,
        type: "success",
        className: "text-content-presentation-global-primary",
      },
      {
        selected: false,
        type: "negative",
        className: "text-content-presentation-global-primary",
      },
    ],
  },
);

interface StepLabelProps extends HTMLAttributes<HTMLDivElement> {
  _selected?: boolean;
  _type?: StepperType;
  _index?: number;
}

const StepLabel = forwardRef<HTMLDivElement, StepLabelProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- excluded from {...props} spread
  ({ className, _selected, _type = "default", _index: _i, ...props }, ref) => {
    const { size } = useStepperContext();
    return (
      <div
        ref={ref}
        className={cn(stepLabelStyles({ selected: !!_selected, type: _type, size }), className)}
        {...props}
      />
    );
  },
);
StepLabel.displayName = "StepLabel";

// ─── StepConnector (the bar between steps) ───────────────────────────────────

const stepConnectorStyles = cva(
  ["shrink-0 rounded-full transition-colors duration-200 ease-in-out"],
  {
    variants: {
      orientation: {
        horizontal: "h-[3px] w-[16px] self-center",
        vertical: "w-[3px] h-[16px] mt-[2px]",
      },
      size: {
        S: "",
        M: "",
        L: "",
      },
      completed: {
        true: "bg-border-presentation-state-focus",
        false: "bg-border-presentation-stepper-default",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "M",
      completed: false,
    },
    compoundVariants: [
      // Vertical: centre the bar under the indicator — the pill's 2px padding, plus half the
      // indicator, minus half the bar. Which is why the inset tracks the size.
      { orientation: "vertical", size: "S", className: "ms-[10.5px]" },
      { orientation: "vertical", size: "M", className: "ms-[12.5px]" },
      { orientation: "vertical", size: "L", className: "ms-[15.5px]" },
    ],
  },
);

interface StepConnectorProps extends HTMLAttributes<HTMLDivElement> {
  /** Draws the bar in the focus colour, for the run of steps already passed. */
  completed?: boolean;
}

const StepConnector = forwardRef<HTMLDivElement, StepConnectorProps>(
  ({ className, completed = false, ...props }, ref) => {
    const { orientation, size } = useStepperContext();
    return (
      <div
        ref={ref}
        aria-hidden
        className={cn(stepConnectorStyles({ orientation, size, completed }), className)}
        {...props}
      />
    );
  },
);
StepConnector.displayName = "StepConnector";

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
  Stepper,
  Step,
  StepIndicator,
  StepLabel,
  StepConnector,
  stepperStyles,
  stepStyles,
  stepIndicatorStyles,
  stepLabelStyles,
  stepConnectorStyles,
};
