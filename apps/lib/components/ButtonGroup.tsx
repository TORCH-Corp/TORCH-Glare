"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";
import { ToggleButton, toggleButtonStyles } from "./ToggleButton";

// ============================================================================
// ButtonGroup Root
// ============================================================================

const buttonGroupStyles = cva(
  [
    "inline-flex",
    "rounded-[4px]",
    "overflow-hidden",
  ],
  {
    variants: {
      variant: {
        PrimeStyle: [
          "bg-background-presentation-action-secondary",
          "border border-border-presentation-action-disabled",
        ],
        BorderStyle: [
          "bg-background-presentation-action-borderstyle",
          "border border-border-presentation-action-disabled",
        ],
        SystemStyle: [
          "bg-black-alpha-20",
          "border border-[#2C2D2E]",
        ],
      },
      size: {
        S: "h-[22px]",
        M: "h-[28px]",
        L: "h-[34px]",
        XL: "h-[40px]",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "PrimeStyle",
      size: "M",
    },
  }
);

type ButtonGroupSingleProps = {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type ButtonGroupMultipleProps = {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

type ButtonGroupProps = (ButtonGroupSingleProps | ButtonGroupMultipleProps) &
  Omit<React.ComponentPropsWithoutRef<"div">, "type" | "value" | "defaultValue"> &
  VariantProps<typeof buttonGroupStyles> & {
    theme?: Themes;
    children?: React.ReactNode;
  };

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, variant, size, fullWidth, theme, children, ...props }, ref) => (
    <ToggleGroupPrimitive.Root
      ref={ref}
      data-theme={theme}
      className={cn(buttonGroupStyles({ variant, size, fullWidth }), className)}
      {...(props as any)}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            _groupVariant: variant,
            _groupSize: size,
          });
        }
        return child;
      })}
    </ToggleGroupPrimitive.Root>
  )
);
ButtonGroup.displayName = "ButtonGroup";

// ============================================================================
// ButtonGroup Item
// ============================================================================

const buttonGroupItemStyles = cva(
  [
    "inline-flex items-center justify-center",
    "whitespace-nowrap",
    "transition-all duration-200 ease-in-out",
    "outline-none",
    "border-r last:border-r-0",
    "flex-1",
    "focus-visible:z-10",
    "focus-visible:ring-2 focus-visible:ring-inset",
    "focus-visible:ring-border-presentation-state-focus",
    "disabled:cursor-not-allowed",
    "disabled:pointer-events-none",
    "disabled:text-content-presentation-state-disabled",
  ],
  {
    variants: {
      variant: {
        PrimeStyle: [
          "bg-transparent",
          "text-content-presentation-action-light-primary",
          "border-border-presentation-action-disabled",
          "hover:bg-background-presentation-action-hover",
          "hover:text-content-presentation-action-hover",
          "data-[state=on]:bg-background-presentation-action-hover",
          "data-[state=on]:text-content-presentation-action-hover",
        ],
        BorderStyle: [
          "bg-transparent",
          "text-content-presentation-action-light-primary",
          "border-border-presentation-action-disabled",
          "hover:bg-background-presentation-action-hover",
          "hover:text-content-presentation-action-hover",
          "data-[state=on]:bg-background-presentation-action-hover",
          "data-[state=on]:text-content-presentation-action-hover",
        ],
        SystemStyle: [
          "bg-transparent",
          "text-white",
          "border-[#2C2D2E]",
          "hover:bg-white/10",
          "data-[state=on]:bg-white/20",
          "data-[state=on]:text-white",
          "disabled:text-white/50",
        ],
      },
      size: {
        S: "px-[8px] typography-body-small-medium [&_i]:text-[12px]",
        M: "px-[12px] typography-body-large-medium [&_i]:text-[18px]",
        L: "px-[16px] typography-body-large-medium [&_i]:text-[20px]",
        XL: "px-[20px] typography-headers-medium-medium [&_i]:text-[22px]",
      },
    },
    defaultVariants: {
      variant: "PrimeStyle",
      size: "M",
    },
  }
);

type ButtonGroupItemProps = React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof buttonGroupItemStyles> & {
    theme?: Themes;
    children?: React.ReactNode;
    _groupVariant?: "PrimeStyle" | "BorderStyle" | "SystemStyle" | null;
    _groupSize?: "S" | "M" | "L" | "XL" | null;
  };

const ButtonGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ButtonGroupItemProps
>(({ className, variant, size, theme, children, _groupVariant, _groupSize, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    data-theme={theme}
    className={cn(
      buttonGroupItemStyles({
        variant: variant ?? _groupVariant ?? "PrimeStyle",
        size: size ?? _groupSize ?? "M",
      }),
      className
    )}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Item>
));
ButtonGroupItem.displayName = "ButtonGroupItem";

// ============================================================================
// Exports
// ============================================================================

export {
  ToggleButton,
  ButtonGroup,
  ButtonGroupItem,
  toggleButtonStyles,
  buttonGroupStyles,
  buttonGroupItemStyles,
};
