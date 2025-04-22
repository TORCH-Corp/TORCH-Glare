'use client';
import { cn } from "../utils/cn";
import { cva } from "class-variance-authority";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import React from "react";


const glareCheckBoxStyles = cva(
  [
    "peer shrink-0 shadow focus-visible:outline-none rounded-[3px]",
    "flex items-center justify-center transition-colors",
    "border border-border-presentation-action-checkbox-primary",
    "bg-background-presentation-action-borderstyle",
    "focus:bg-blue-sparkle-alpha-15 focus:border-border-presentation-state-focus",
    'disabled:bg-background-presentation-action-disabled disabled:border-border-presentation-action-disabled disabled:cursor-not-allowed',
    "data-[state=checked]:bg-blue-sparkle-600 data-[state=checked]:border-blue-sparkle-600",
    "hover:border-border-presentation-action-hover",
  ],
  {
    variants: {
      size: {
        S: ["w-[14px] h-[14px]"],
        M: ["w-[16px] h-[16px]"],
      },
    }
  }
);


export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & { size?: "S" | "M" }
>(({ className, size = "M", ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      glareCheckBoxStyles({ size }),
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
    >
      <i className="ri-check-line text-white" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

