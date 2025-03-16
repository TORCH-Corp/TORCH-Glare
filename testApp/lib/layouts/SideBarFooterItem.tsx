import { cn } from "../utils/cn";
import React, { ButtonHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { Themes } from "../utils/types";
import { Slot } from "@radix-ui/react-slot";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: Themes
  as?: React.ElementType;
  asChild?: boolean;
  variant?: "primary" | "secondary"
}

export const glareFeedbackItem = cva(
  [
    "h-[40px] w-full flex justify-center items-center rounded-[4px] px-2",
    "text-content-system-global-primary typography-body-small-medium",
    "border border-transparent outline-none bg-background-system-body-base",
    "focus:bg-background-system-action-primary-selected",
    "transition-all duration-200 ease-in-out",
  ], {
  variants: {
    variant: {
      primary:
        [
          "hover:bg-background-system-action-primary-hover hover:border-border-system-action-primary-hover",
          "active:bg-background-system-action-primary-hover active:border-border-system-action-primary-hover "],
      secondary: [
        "hover:bg-wavy-navy-1000  hover:border-border-system-action-field-hover-selected",
        "active:bg-wavy-navy-1000 active:border-border-system-action-field-hover-selected"],
    }
  },
  defaultVariants: {
    variant: "primary"
  }
}
);


export const SideBarFooterItem: React.FC<Props> = ({ asChild,
  as: Tag = "button", theme, variant, ...props }) => {
  const Component = asChild ? Slot : Tag;

  return (
    <Component
      data-theme={theme}
      {...props}
      className={cn(glareFeedbackItem({ variant }), props.className)}
    >
    </Component>
  );
};
