'use client'
import { cn } from "../utils/cn";
import { cva } from "class-variance-authority";
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"


const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const Radio = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & { size?: "S" | "M" }
>(({ className, size = "S", ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        glareRadioStyles({ size }),
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <i className="ri-record-circle-fill text-background-presentation-state-information-primary leading-none"></i>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
Radio.displayName = "Radio"

export { RadioGroup, Radio }


const glareRadioStyles = cva(
  [
    "rounded-full shadow focus:outline-none flex items-center justify-center",
    "border border-border-presentation-action-checkbox-primary",
    "bg-background-presentation-action-borderstyle",
    "transition-[background,border-color,background-color] duration-200",
    "hover:bg-blue-sparkle-alpha-15 hover:border-border-presentation-state-focus",
    "checked:border-background-presentation-state-information-primary checked:hover:bg-white checked:bg-white",
    "disabled:bg-background-presentation-action-disabled disabled:border-border-presentation-global-primary",
    "disabled:cursor-not-allowed",
    "data-[state=checked]:!border-none",
  ],
  {
    variants: {
      size: {
        S: ["w-[12px]", "h-[12px] [&_i]:text-[15px]"],
        M: ["w-[24px]", "h-[24px] [&_i]:text-[28px]"],
      },
    }
  }
);