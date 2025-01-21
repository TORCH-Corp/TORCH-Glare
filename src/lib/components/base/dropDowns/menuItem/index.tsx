import React, { HTMLAttributes } from "react";
import { cn } from "@/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

export const MenuItemStyles = cva(
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
          "bg-[#131415]",
          "text-[#E5E5E5]",
          "hover:!bg-[#3E1E69]",
          "hover:!text-[#F9F9F9]",
          "hover:!border-[#9748FF]",
          "focus:bg-[#252729]",
          "focus:border-transparent",
          "active:border-transparent",
          "active:bg-[#252729]",
          "disabled:bg-[#1C1D1F]",
          "disabled:text-[#797C7F]",
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

      defaultVariants: {
        variant: "SystemStyle",
        size: "M",
        disabled: false,
      },
    },
    compoundVariants: [
      {
        disabled: true,
        variant: "SystemStyle",
        className: ["bg-[#1C1D1F]", "text-[#797C7F]"],
      },
    ],
  }
);
interface Props
  extends HTMLAttributes<HTMLLIElement>,
    VariantProps<typeof MenuItemStyles> {
  asChild?: boolean;
}
export const MenuItem = function ({
  variant = "SystemStyle",
  size = "M",
  asChild,
  className,
  children,
  ...props
}: Props) {
  const Component = asChild ? Slot : "li";

  // default
  return (
    <Component
      {...props}
      className={cn(
        MenuItemStyles({
          variant,
          size,
        }),
        className
      )}
    >
      {children}
    </Component>
  );
};
