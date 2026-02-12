'use client'
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import React, { useEffect, useRef } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Slot } from "@radix-ui/react-slot";
import type { Themes } from "../utils/types";

interface LocalPopOverProps extends VariantProps<typeof popoverStyles> {
  variant?: "SystemStyle" | "PresentationStyle";
  className?: string;
  overlayBlur?: boolean;
}


const Popover = PopoverPrimitive.Root;

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> & {
    className?: string
  }
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Trigger
    ref={ref}
    className={cn(
      "z-[20] transition-all duration-300 data-[state=open]:z-[49]",
      className
    )}
    {...props}
  />
));

PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
  LocalPopOverProps & {
    theme?: Themes
  }
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      variant = "SystemStyle",
      overlayBlur = false,
      theme,
      ...props
    },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      {overlayBlur ? (
        <div className="relative z-[42]" data-theme={theme}>
          <div className="fixed top-0 left-0 flex h-full w-full items-center flex-shrink-0 bg-[rgba(16,7,25,0.32)] backdrop-blur-[8px] transition-all duration-300"></div>
          <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(
              popoverStyles({ variant, overlayBlur }),
              className
            )}
            {...props}
          />
        </div>
      ) : (
        <PopoverPrimitive.Content
          data-theme={theme}
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            popoverStyles({ variant, overlayBlur }),
            className
          )}
          {...props}
        />
      )}
    </PopoverPrimitive.Portal>
  )
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// Define the Props interface with a generic type parameter
interface Props<T extends React.ElementType = "li">
  extends React.HTMLAttributes<HTMLElement>,
  VariantProps<typeof PopoverItemStyles> {
  asChild?: boolean;
  as?: T; // The `as` prop can be any valid HTML element or React component
}

// Define the PopoverItem component with a generic type parameter
const PopoverItem = <T extends React.ElementType = "li">({
  variant = "SystemStyle",
  size = "M",
  asChild,
  className,
  children,
  active,
  as = "button" as T, // Default to "li" if `as` is not provided
  ...props
}: Props<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof Props<T>>) => {
  const Component = asChild ? Slot : as;
  const ref = useRef<HTMLLIElement>(null);

  // Scroll to the selected item when the dropdown is opened
  useEffect(() => {
    if (active && ref.current) {
      ref.current.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }, [active]);

  return (
    <Component
      {...(props as React.ComponentPropsWithoutRef<T>)} // Spread the props dynamically
      className={cn(
        PopoverItemStyles({
          variant,
          size,
          active,
        }),
        className
      )}
      /// <reference path="" />
      ref={ref}
    >
      {children}
    </Component>
  );
};


export { Popover, PopoverTrigger, PopoverContent, PopoverItem };



const PopoverItemStyles = cva(
  [
    "text-content-presentation-action-light-primary",
    "outline-none",
    "border",
    "border-transparent",
    "flex w-full",
    "gap-[8px]",
    "items-center",
    "justify-start",
    "text-overflow",
    "overflow-hidden",
    "px-[12px]",
    "rounded-[4px]",
    "transition-all",
    "ease-in-out",
    "duration-300",

  ],
  {
    variants: {
      variant: {
        Default: [
          "text-content-presentation-action-light-primary",
          "bg-background-presentation-action-dropdown-primary",
          "hover:bg-background-presentation-action-hover",
          "hover:text-content-presentation-action-hover",
          "focus:bg-background-presentation-action-hover",
          "focus:text-content-presentation-action-hover",
          "disabled:text-content-presentation-state-disabled",
          "disabled:bg-white-00",
        ],
        Warning: [
          "text-content-presentation-state-information",
          "hover:bg-background-presentation-state-information-primary",
          "focus:bg-background-presentation-state-information-primary",
          "focus:text-content-presentation-action-hover",
          "hover:text-content-presentation-action-hover",
        ],
        Negative: [
          "text-content-presentation-state-negative",
          "hover:bg-background-presentation-state-negative-primary",
          "hover:text-content-presentation-action-hover",
          "focus:bg-background-presentation-state-negative-primary",
          "focus:text-content-presentation-action-hover",
          "active:text-content-presentation-state-negative",
        ],
        SystemStyle: [
          "bg-background-system-body-primary",
          "text-content-system-global-primary",
          "hover:bg-background-system-action-secondary-hover",
          "hover:text-content-system-action-primary-hover",
          "hover:border-border-system-action-primary-hover",
          "focus:bg-background-system-action-secondary-hover",
          "focus:text-content-system-action-primary-hover",
          "focus:border-border-system-action-primary-hover",
          "disabled:bg-background-system-body-secondary",
          "disabled:text-content-system-global-disabled",
        ],
      },
      size: {
        S: ["typography-body-small-regular", "h-[24px]"],
        M: ["typography-body-medium-regular", "h-[32px]"],
      },

      disabled: {
        true: [
          "text-content-presentation-state-disabled",
          "bg-white-00",
        ],
      },

      active: {
        true: [
          "bg-background-presentation-action-selected",
          "text-content-presentation-action-light-primary",
        ],
      },

      defaultVariants: {
        variant: "Default",
        size: "M",
        active: false,
        disabled: false,
      },
    },
    compoundVariants: [
      {
        active: true,
        variant: "Warning",
        className: ["text-content-presentation-state-negative"],
      },
    ],
  }
);

const popoverStyles = cva(
  [
    "p-1 max-h-[200px] z-[1000] shrink-0",
    "rounded-[8px]",
    "border",
    "min-w-[240px]",
    "outline-none",
    "overflow-scroll",
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0",
    "data-[state=open]:fade-in-0",
    "scrollbar-hide",
    "overflow-x-hidden",
  ],
  {
    variants: {
      variant: {
        SystemStyle: [
          "border-border-system-global-secondary",
          "bg-background-system-body-primary",
          "shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)]",
        ],
        PresentationStyle: [
          "border-border-presentation-global-primary",
          "bg-background-presentation-form-base",
          "shadow-[0px_0px_10px_0px_rgba(0,0,0,0.4),0px_4px_4px_0px_rgba(0,0,0,0.2)]",
        ],
      },
      overlayBlur: {
        true: ["h-fit"],
      },
      defaultVariants: {
        variant: "PresentationStyle",
      },
    },
  }
);
