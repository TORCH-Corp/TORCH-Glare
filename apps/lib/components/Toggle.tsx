"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../utils/cn"

const Toggle = React.forwardRef<
    React.ElementRef<typeof TogglePrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
    <TogglePrimitive.Root
        ref={ref}
        className={cn(toggleVariants({ variant, size, className }))}
        {...props}
    />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }



const toggleVariants = cva(
    [
        "flex items-center whitespace-nowrap justify-center  transition-[background,color] duration-200 ease-in-out border border-transparent outline-none leading-none [&-i]:!leading-none",
        "disabled:cursor-not-allowed disabled:pointer-events-none disabled:bg-background-presentation-action-disabled disabled:text-content-presentation-state-disabled disabled:border-transparent",
        "",
    ], {
    variants: {
        variant: {
            // fucus styles for medium screens and above
            PrimeStyle: [
                "bg-background-presentation-action-secondary",
                "text-content-presentation-action-light-primary",
                "hover:bg-background-presentation-action-hover",
                "hover:text-content-presentation-action-hover",
                "focus:lg:focus:md:border lg:focus:md:border-border-presentation-state-focus", // Focus style only for medium screens and above
                "active:bg-background-presentation-action-hover active:text-content-presentation-action-hover",
                "data-[state=on]:bg-background-presentation-action-hover data-[state=on]:text-content-presentation-action-hover",
            ],
            BlueSecStyle: [
                "bg-background-presentation-action-secondary",
                "text-content-presentation-action-light-primary",
                "hover:bg-background-presentation-state-information-primary",
                "hover:text-content-presentation-action-hover",
                "focus:lg:border focus:lg:border-border-presentation-state-focus",
                "active:bg-background-presentation-state-information-primary active:text-content-presentation-action-hover",
                "data-[state=on]:bg-background-presentation-state-information-primary data-[state=on]:text-content-presentation-action-hover",
            ],
            YelSecStyle: [
                "bg-background-presentation-action-secondary",
                "text-content-presentation-action-light-primary",
                "hover:bg-background-presentation-state-warning-primary",
                "hover:text-content-presentation-action-light-primary",
                "focus:lg:border focus:lg:border-border-presentation-state-focus",
                "active:bg-background-presentation-state-warning-primary active:text-content-presentation-action-light-primary",
                "data-[state=on]:bg-background-presentation-state-warning-primary data-[state=on]:text-content-presentation-action-light-primary",
            ],
            RedSecStyle: [
                "bg-background-presentation-action-secondary",
                "text-content-presentation-action-light-primary",
                "hover:bg-background-presentation-state-negative-primary",
                "hover:text-content-presentation-action-hover",
                "focus:lg:border focus:lg:border-border-presentation-state-focus",
                "active:bg-background-presentation-state-negative-primary active:text-content-presentation-action-hover",
                "data-[state=on]:bg-background-presentation-state-negative-primary data-[state=on]:text-content-presentation-action-hover",
            ],
            BorderStyle: [
                "text-content-presentation-action-light-primary",
                "border border-border-presentation-action-disabled",
                "bg-background-presentation-action-borderstyle",
                "hover:bg-background-presentation-action-hover",
                "hover:text-content-presentation-action-hover",
                "focus:lg:border focus:lg:border-border-presentation-state-focus",
                "focus:lg:text-content-presentation-action-light-primary",
                "focus:hover:lg:text-content-presentation-action-hover",
                "active:bg-background-presentation-action-hover active:text-content-presentation-action-hover",
                "data-[state=on]:bg-background-presentation-action-hover data-[state=on]:text-content-presentation-action-hover",
            ],
            PrimeContStyle: [
                "text-content-presentation-action-light-primary",
                "border-transparent bg-transparent",
                "hover:bg-background-presentation-action-contstyle-hover",
                "hover:text-content-presentation-action-light-primary",
                "focus:lg:border focus:lg:border-border-presentation-state-focus",
                "focus:lg:bg-background-presentation-action-borderstyle",
                "active:bg-background-presentation-action-contstyle-hover active:text-content-presentation-action-light-primary",
                "data-[state=on]:bg-background-presentation-action-contstyle-hover data-[state=on]:text-content-presentation-action-light-primary",
            ],
            BlueContStyle: [
                "text-content-presentation-action-light-primary",
                "border-transparent bg-transparent",
                "hover:bg-background-presentation-action-contstyle-hover",
                "hover:text-content-presentation-action-information-hover",
                "focus:lg:border focus:lg:border-border-presentation-state-focus",
                "focus:lg:bg-background-presentation-action-borderstyle",
                "active:bg-background-presentation-action-contstyle-hover active:text-content-presentation-action-information-hover",
                "data-[state=on]:bg-background-presentation-action-contstyle-hover data-[state=on]:text-content-presentation-action-information-hover",
            ],
            RedContStyle: [
                "text-content-presentation-action-light-primary",
                "border-transparent bg-transparent",
                "hover:bg-background-presentation-action-contstyle-hover",
                "hover:text-content-presentation-action-negative-hover",
                "focus:lg:border focus:lg:border-border-presentation-state-focus",
                "focus:lg:bg-background-presentation-action-borderstyle",
                "active:bg-background-presentation-action-contstyle-hover active:text-content-presentation-action-negative-hover",
                "data-[state=on]:bg-background-presentation-action-contstyle-hover data-[state=on]:text-content-presentation-action-negative-hover",
            ],
        },
        size: {
            S: "h-[22px] w-[22px]  typography-body-small-medium rounded-[4px] [&_i]:text-[12px]",
            M: "h-[28px] w-[28px]  typography-body-large-medium rounded-[4px] [&_i]:text-[18px]",
            L: "h-[34px] w-[34px]  typography-body-large-medium rounded-[6px] [&_i]:text-[20px]",
            XL: "h-[40px] w-[40px]  typography-headers-medium-medium rounded-[6px] [&_i]:text-[22px]",
        },
    },
    defaultVariants: {
        size: "M",
        variant: "PrimeStyle",
    }
}
);
