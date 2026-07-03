"use client";

import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  createContext,
  useContext,
} from "react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

// ─── Types ───────────────────────────────────────────────────────────────────

type FormStepperType = "default" | "success" | "negative";

// ─── Context ─────────────────────────────────────────────────────────────────

interface FormStepperContextValue {
  activeStep: number;
}

const FormStepperContext = createContext<FormStepperContextValue>({
  activeStep: 0,
});

const useFormStepperContext = () => useContext(FormStepperContext);

// ─── FormStepper Root ────────────────────────────────────────────────────────

interface FormStepperProps extends HTMLAttributes<HTMLDivElement> {
  theme?: Themes;
  activeStep?: number;
}

const FormStepper = forwardRef<HTMLDivElement, FormStepperProps>(
  ({ className, theme, activeStep = 0, ...props }, ref) => (
    <FormStepperContext.Provider value={{ activeStep }}>
      <div
        ref={ref}
        data-theme={theme}
        className={cn("flex items-center gap-3", className)}
        {...props}
      />
    </FormStepperContext.Provider>
  ),
);
FormStepper.displayName = "FormStepper";

// ─── FormStep (the pill wrapper) ─────────────────────────────────────────────

const formStepStyles = cva(
  [
    "group/form-step inline-flex items-center shrink-0",
    "h-[28px] rounded-full p-[2px]",
    "transition-all duration-200 ease-in-out",
    "cursor-pointer select-none outline-none",
  ],
  {
    variants: {
      // Selection drives the pill background. Hover drives a white bg + soft
      // shadow for non-selected pills, and a stronger shadow for selected pills.
      selected: {
        true: [
          "bg-[#000000]",
          "shadow-[0_0_32px_2px_rgba(0,0,0,0.05)]",
          "hover:shadow-[0_0_32px_2px_rgba(0,0,0,0.2)]",
        ],
        false: [
          "bg-transparent",
          "hover:bg-[#FFFFFF]",
          "hover:shadow-[0_0_32px_2px_rgba(0,0,0,0.05)]",
        ],
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

interface FormStepProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "type"> {
  index?: number;
  type?: FormStepperType;
  selected?: boolean;
}

const FormStep = forwardRef<HTMLDivElement, FormStepProps>(
  (
    { className, index = 0, type = "default", selected, children, ...props },
    ref,
  ) => {
    const { activeStep } = useFormStepperContext();
    const isSelected = selected ?? index === activeStep;

    return (
      <div
        ref={ref}
        data-selected={isSelected || undefined}
        data-type={type}
        className={cn(formStepStyles({ selected: isSelected }), className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as React.ReactElement<any>, {
            _selected: isSelected,
            _type: type,
            _index: index,
          });
        })}
      </div>
    );
  },
);
FormStep.displayName = "FormStep";

// ─── FormStepIndicator (circle badge) ───────────────────────────────────────

const formStepIndicatorStyles = cva(
  [
    "relative inline-flex items-center justify-center shrink-0",
    "w-[24px] h-[24px] text-[14px]",
    "rounded-full",
    "transition-colors duration-200 ease-in-out",
    "typography-body-medium-medium",
  ],
  {
    variants: {
      type: {
        default: ["border-[3px]"],
        success: ["bg-[#047854] text-[#FFFFFF]", "border border-transparent"],
        negative: ["bg-[#E30C30] text-[#FFFFFF]", "border border-transparent"],
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
    },
    compoundVariants: [
      // Default type, not selected: gray ring + gray number at rest;
      // hover (driven by parent .group/form-step) flips ring blue, number black.
      {
        type: "default",
        selected: false,
        className: [
          "bg-transparent border-[#A0A0A0] text-[#626467]",
          "group-hover/form-step:border-[#004699]",
          "group-hover/form-step:text-[#000000]",
        ],
      },
      // Default type, selected: solid blue fill, white number, no ring color.
      {
        type: "default",
        selected: true,
        className: ["bg-[#005ECC] border-transparent text-[#FFFFFF]"],
      },
    ],
  },
);

const formStepIndicatorBadgeStyles = cva(
  [
    "absolute -top-[7px]",
    "w-[15px] h-[15px]",
    "rounded-full",
    "inline-flex items-center justify-center",
    "border border-[#F0F0F0]",
    "[&_i]:leading-none [&_i]:flex [&_i]:text-[11px]",
    // LTR: badge top-right; RTL: badge top-left
    "ltr:right-[-4px] rtl:left-[-4px]",
  ],
  {
    variants: {
      type: {
        success: "bg-[#047854] text-[#FFFFFF]",
        negative: "bg-[#E30C30] text-[#FFFFFF]",
      },
    },
  },
);

interface FormStepIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  badgeIcon?: ReactNode;
  _selected?: boolean;
  _type?: FormStepperType;
  _index?: number;
}

const FormStepIndicator = forwardRef<HTMLDivElement, FormStepIndicatorProps>(
  (
    {
      className,
      badgeIcon,
      _selected,
      _type = "default",
      _index = 0,
      children,
      ...props
    },
    ref,
  ) => {
    const showBadge = _type === "success" || _type === "negative";
    const defaultBadgeIcon =
      _type === "success" ? (
        <i className="ri-check-line" />
      ) : (
        <i className="ri-information-fill" />
      );

    return (
      <div
        ref={ref}
        className={cn(
          formStepIndicatorStyles({ type: _type, selected: !!_selected }),
          className,
        )}
        {...props}
      >
        {children ?? _index + 1}
        {showBadge && (
          <span
            className={cn(
              formStepIndicatorBadgeStyles({
                type: _type as "success" | "negative",
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
FormStepIndicator.displayName = "FormStepIndicator";

// ─── FormStepLabel ──────────────────────────────────────────────────────────

const formStepLabelStyles = cva(
  [
    "typography-body-small-medium whitespace-nowrap",
    "transition-[padding,color] duration-200 ease-in-out",
    // At rest the label sits 6px from the circle. On hover (parent pill
    // hovered) the gap grows to 9px — matches figma onHover/onSelect-Hoverd.
    // The outer edge keeps a constant 12px.
    "ltr:pl-[6px] ltr:pr-[12px] rtl:pr-[6px] rtl:pl-[12px]",
    "group-hover/form-step:ltr:pl-[9px] group-hover/form-step:rtl:pr-[9px]",
  ],
  {
    variants: {
      selected: {
        true: "text-[#FFFFFF]",
        false: "text-[#000000]",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

interface FormStepLabelProps extends HTMLAttributes<HTMLDivElement> {
  _selected?: boolean;
  _type?: FormStepperType;
  _index?: number;
}

const FormStepLabel = forwardRef<HTMLDivElement, FormStepLabelProps>(
  ({ className, _selected, _type: _t, _index: _i, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        formStepLabelStyles({ selected: !!_selected }),
        className,
      )}
      {...props}
    />
  ),
);
FormStepLabel.displayName = "FormStepLabel";

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
  FormStepper,
  FormStep,
  FormStepIndicator,
  FormStepLabel,
  formStepStyles,
  formStepIndicatorStyles,
  formStepLabelStyles,
};
