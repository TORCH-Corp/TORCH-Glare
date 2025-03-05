import React, { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "./Button";
import { cn } from "../utils/cn";
import { ButtonVariant, Themes } from "../utils/types";

const buttonVariants = cva("", {
  variants: {
    size: {
      XS: "h-[18px] w-[18px] text-[12px]",
      S: "h-[22px] w-[22px] text-[12px]",
      M: "h-[32px] w-[32px] text-[18px]",
    },
  },
  defaultVariants: {
    size: "M",
  },
});


interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  is_loading?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  as?: React.ElementType;
  theme?: Themes
  variant?: ButtonVariant
}
export const ActionButton = function ({
  size,
  asChild,
  as: Tag = "button",
  className,
  variant,
  children,
  theme,
  ...props
}: Props) {
  return (
    <Button
      theme={theme}
      asChild={asChild}
      buttonType="icon"
      size={
        size == "XS" ? "S" :
          size == "S" ? "M" :
            size == "M" ? "L" : "S"
      }
      variant={variant}
      className={cn(
        buttonVariants({
          size,
        })
        , className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
