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

// ─── Types ───────────────────────────────────────────────────────────────────

type FormStepperType = "default" | "success" | "negative";
type FormStepperSize = "S" | "M";

// ─── Context ─────────────────────────────────────────────────────────────────

interface FormStepperContextValue {
  activeStep: number;
  size: FormStepperSize;
}

const FormStepperContext = createContext<FormStepperContextValue>({
  activeStep: 0,
  size: "M",
});

const useFormStepperContext = () => useContext(FormStepperContext);

// ─── FormStepper Root ────────────────────────────────────────────────────────

const formStepperStyles = cva(["flex items-center"], {
  variants: {
    size: {
      S: "gap-2",
      M: "gap-3",
    },
  },
  defaultVariants: {
    size: "M",
  },
});

interface FormStepperProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formStepperStyles> {
  theme?: Themes;
  activeStep?: number;
  size?: FormStepperSize;
}

const FormStepper = forwardRef<HTMLDivElement, FormStepperProps>(
  ({ className, theme, activeStep = 0, size = "M", ...props }, ref) => (
    <FormStepperContext.Provider value={{ activeStep, size }}>
      <div
        ref={ref}
        data-theme={theme}
        className={cn(formStepperStyles({ size }), className)}
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
    "rounded-full p-[2px]",
    "transition-all duration-200 ease-in-out",
    "cursor-pointer select-none outline-none",
  ],
  {
    variants: {
      size: {
        S: "h-[24px]",
        M: "h-[28px]",
      },
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
      size: "M",
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
    const { activeStep, size } = useFormStepperContext();
    const isSelected = selected ?? index === activeStep;

    return (
      <div
        ref={ref}
        data-selected={isSelected || undefined}
        data-type={type}
        className={cn(
          formStepStyles({ size, selected: isSelected }),
          className,
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as React.ReactElement<any>, {
            _selected: isSelected,
            _type: type,
            _index: index,
            _size: size,
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
      size: {
        S: "w-[20px] h-[20px] text-[12px]",
        M: "w-[24px] h-[24px] text-[14px]",
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
      size: "M",
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
    "absolute -top-[5px]",
    "rounded-full",
    "inline-flex items-center justify-center",
    "border border-[#F0F0F0]",
    "[&_i]:leading-none [&_i]:flex",
    // LTR: badge top-right; RTL: badge top-left
    "ltr:right-[-3px] rtl:left-[-3px]",
  ],
  {
    variants: {
      type: {
        success: "bg-[#047854] text-[#FFFFFF]",
        negative: "bg-[#E30C30] text-[#FFFFFF]",
      },
      size: {
        S: "w-[12px] h-[12px] [&_i]:text-[8px]",
        M: "w-[14px] h-[14px] [&_i]:text-[10px]",
      },
    },
  },
);

interface FormStepIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  badgeIcon?: ReactNode;
  _selected?: boolean;
  _type?: FormStepperType;
  _index?: number;
  _size?: FormStepperSize;
}

const FormStepIndicator = forwardRef<HTMLDivElement, FormStepIndicatorProps>(
  (
    {
      className,
      badgeIcon,
      _selected,
      _type = "default",
      _index = 0,
      _size,
      children,
      ...props
    },
    ref,
  ) => {
    const { size: ctxSize } = useFormStepperContext();
    const size = _size ?? ctxSize;

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
          formStepIndicatorStyles({
            type: _type,
            size,
            selected: !!_selected,
          }),
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
FormStepIndicator.displayName = "FormStepIndicator";

// ─── FormStepLabel ──────────────────────────────────────────────────────────

const formStepLabelStyles = cva(
  [
    "typography-body-small-medium",
    "transition-colors duration-200 ease-in-out",
    "whitespace-nowrap",
  ],
  {
    variants: {
      selected: {
        true: "text-[#FFFFFF]",
        false: "text-[#000000]",
      },
      // Padding flips with direction: tight to circle, looser to outer edge
      size: {
        S: "ltr:pl-[6px] ltr:pr-[10px] rtl:pr-[6px] rtl:pl-[10px]",
        M: "ltr:pl-[6px] ltr:pr-[12px] rtl:pr-[6px] rtl:pl-[12px]",
      },
    },
    defaultVariants: {
      selected: false,
      size: "M",
    },
  },
);

interface FormStepLabelProps extends HTMLAttributes<HTMLDivElement> {
  _selected?: boolean;
  _type?: FormStepperType;
  _index?: number;
  _size?: FormStepperSize;
}

const FormStepLabel = forwardRef<HTMLDivElement, FormStepLabelProps>(
  (
    { className, _selected, _type: _t, _index: _i, _size, ...props },
    ref,
  ) => {
    const { size: ctxSize } = useFormStepperContext();
    const size = _size ?? ctxSize;

    return (
      <div
        ref={ref}
        className={cn(
          formStepLabelStyles({ selected: !!_selected, size }),
          className,
        )}
        {...props}
      />
    );
  },
);
FormStepLabel.displayName = "FormStepLabel";

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
  FormStepper,
  FormStep,
  FormStepIndicator,
  FormStepLabel,
  formStepperStyles,
  formStepStyles,
  formStepIndicatorStyles,
  formStepLabelStyles,
};
