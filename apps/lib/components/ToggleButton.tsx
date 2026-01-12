"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

// ============================================================================
// ToggleButton Styles
// ============================================================================

const toggleButtonStyles = cva(
  [
    "inline-flex items-center justify-center",
    "whitespace-nowrap",
    "transition-all duration-200 ease-in-out",
    "border border-transparent",
    "outline-none",
    "disabled:cursor-not-allowed",
    "disabled:pointer-events-none",
    "disabled:bg-background-presentation-action-disabled",
    "disabled:text-content-presentation-state-disabled",
  ],
  {
    variants: {
      variant: {
        PrimeStyle: [
          "bg-background-presentation-action-secondary",
          "text-content-presentation-action-light-primary",
          "hover:bg-background-presentation-action-hover",
          "hover:text-content-presentation-action-hover",
          "focus-visible:ring-2 focus-visible:ring-border-presentation-state-focus",
          "data-[state=on]:bg-background-presentation-action-hover",
          "data-[state=on]:text-content-presentation-action-hover",
        ],
        BlueSecStyle: [
          "bg-background-presentation-action-secondary",
          "text-content-presentation-action-light-primary",
          "hover:bg-background-presentation-state-information-primary",
          "hover:text-content-presentation-action-hover",
          "focus-visible:ring-2 focus-visible:ring-border-presentation-state-focus",
          "data-[state=on]:bg-background-presentation-state-information-primary",
          "data-[state=on]:text-content-presentation-action-hover",
        ],
        BorderStyle: [
          "bg-background-presentation-action-borderstyle",
          "text-content-presentation-action-light-primary",
          "border-border-presentation-action-disabled",
          "hover:bg-background-presentation-action-hover",
          "hover:text-content-presentation-action-hover",
          "focus-visible:ring-2 focus-visible:ring-border-presentation-state-focus",
          "data-[state=on]:bg-background-presentation-action-hover",
          "data-[state=on]:text-content-presentation-action-hover",
        ],
        PrimeContStyle: [
          "bg-transparent",
          "text-content-presentation-action-light-primary",
          "hover:bg-background-presentation-action-contstyle-hover",
          "focus-visible:ring-2 focus-visible:ring-border-presentation-state-focus",
          "data-[state=on]:bg-background-presentation-action-contstyle-hover",
        ],
        SystemStyle: [
          "bg-black-alpha-20",
          "text-white",
          "border-[#2C2D2E]",
          "hover:bg-white/10",
          "focus-visible:ring-2 focus-visible:ring-white/50",
          "data-[state=on]:bg-white/20",
        ],
      },
      size: {
        S: "h-[22px] px-[8px] typography-body-small-medium rounded-[4px] [&_i]:text-[12px]",
        M: "h-[28px] px-[12px] typography-body-large-medium rounded-[4px] [&_i]:text-[18px]",
        L: "h-[34px] px-[16px] typography-body-large-medium rounded-[6px] [&_i]:text-[20px]",
        XL: "h-[40px] px-[20px] typography-headers-medium-medium rounded-[6px] [&_i]:text-[22px]",
      },
      buttonType: {
        default: "",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "PrimeStyle",
      size: "M",
      buttonType: "default",
    },
    compoundVariants: [
      {
        buttonType: "icon",
        size: "S",
        className: "w-[22px] px-0",
      },
      {
        buttonType: "icon",
        size: "M",
        className: "w-[28px] px-0",
      },
      {
        buttonType: "icon",
        size: "L",
        className: "w-[34px] px-0",
      },
      {
        buttonType: "icon",
        size: "XL",
        className: "w-[40px] px-0",
      },
    ],
  }
);

// ============================================================================
// ToggleButton Component
// ============================================================================

type ToggleButtonProps = React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleButtonStyles> & {
    theme?: Themes;
  };

const ToggleButton = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  ToggleButtonProps
>(({ className, variant, size, buttonType, theme, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    data-theme={theme}
    className={cn(toggleButtonStyles({ variant, size, buttonType }), className)}
    {...props}
  />
));
ToggleButton.displayName = "ToggleButton";

// ============================================================================
// Exports
// ============================================================================

export { ToggleButton, toggleButtonStyles };
export type { ToggleButtonProps };
