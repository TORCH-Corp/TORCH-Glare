import { cva, VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { dropdownMenuStyles } from "./DropdownMenu";
import { HTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";

interface LocalPopOverProps extends VariantProps<typeof dropdownMenuStyles> {
  variant?: "SystemStyle" | "PresentationStyle";
  className?: string;
}

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
  LocalPopOverProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      variant = "SystemStyle",
      ...props
    },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(dropdownMenuStyles({ variant }), className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

interface Props
  extends HTMLAttributes<HTMLLIElement>,
  VariantProps<typeof PopoverItemStyles> {
  asChild?: boolean;
}
const PopoverItem = function ({
  variant = "SystemStyle",
  size = "M",
  asChild,
  className,
  children,
  active,
  ...props
}: Props) {
  const Component = asChild ? Slot : "li";

  // default
  return (
    <Component
      {...props}
      className={cn(
        PopoverItemStyles({
          variant,
          size,
          active,
        }),
        className
      )}
    >
      {children}
    </Component>
  );
};


export { Popover, PopoverTrigger, PopoverContent, PopoverItem };


export const PopoverItemStyles = cva(
  [
    "text-[--content-presentation-action-light-primary]",
    "outline-none",
    "border",
    "border-transparent",
    "flex",
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
          "text-[--content-presentation-action-light-primary]",
          "bg-[--background-presentation-action-dropdown-primary]",
          "hover:bg-[--background-presentation-action-hover]",
          "hover:text-[--content-presentation-action-hover]",
          "focus:bg-[--background-presentation-action-selected]",
          "focus:text-[--content-presentation-action-light-primary]",
          "active:border-[--border-presentation-action-disabled]",
          "active:bg-[--background-presentation-action-selected]",
          "active:text-[--content-presentation-action-light-primary]",
          "active:border-[--border-presentation-action-disabled]",
          "disabled:text-[--content-presentation-state-disabled]",
          "disabled:bg-[--white-00]",
        ],
        Warning: [
          "bg-[--background-presentation-action-dropdown-primary]",
          "text-[--content-presentation-state-information]",
          "hover:bg-[--background-presentation-state-information-primary]",
          "hover:text-[--content-presentation-action-hover]",
        ],
        Negative: [
          "bg-[--background-presentation-action-dropdown-primary]",
          "text-[--content-presentation-state-negative]",
          "hover:bg-[--background-presentation-state-negative-primary]",
          "hover:!text-[--content-presentation-action-hover]",
          "focus:text-[--content-presentation-state-negative]",
          "active:text-[--content-presentation-state-negative]",
        ],
        SystemStyle: [
          "bg-[--background-system-body-primary]",
          "text-[--content-system-global-primary]",
          "hover:!bg-[--background-system-action-secondary-hover]",
          "hover:!text-[--content-system-action-primary-hover]",
          "hover:!border-[--border-system-action-primary-hover]",
          "focus:bg-[--background-System-Action-Primary-Selected]",
          "focus:border-transparent",
          "active:border-transparent",
          "active:bg-[--background-System-Action-Primary-Selected]",
          "disabled:bg-[--background-system-body-secondary]",
          "disabled:text-[--content-system-global-disabled]",
        ],
      },
      size: {
        S: ["typography-body-small-regular", "h-[24px]"],
        M: ["typography-body-medium-regular", "h-[32px]"],
      },

      disabled: {
        true: [
          "text-[--content-presentation-state-disabled]",
          "bg-[--white-00]",
        ],
      },

      active: {
        true: [
          "bg-[--background-presentation-action-selected]",
          "text-[--content-presentation-action-light-primary]",
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
      /*       {
              disabled: true,
              variant: "SystemStyle",
              className: ["bg-[#1C1D1F]", "text-[#797C7F]"],
            },
            {
              active: true,
              variant: "SystemStyle",
              className: ["bg-[#252729]", "text-[#F9F9F9]", "border-transparent"],
            }, */
      {
        active: true,
        variant: "Warning",
        className: ["text-[--content-presentation-state-negative]"],
      },
    ],
  }
);