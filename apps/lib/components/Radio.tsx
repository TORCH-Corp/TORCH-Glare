'use client'
import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../utils/cn";
import { cva } from "class-variance-authority";


const glareRadioStyles = cva(
  [
    "w-[12px]",
    "h-[12px]",
    "rounded-full",
    "border",
    "border-border-presentation-action-checkbox-primary",
    "bg-background-presentation-action-borderstyle",
    "transition-[background,border-color,background-color] duration-200",
    "hover:bg-blue-sparkle-alpha-15 hover:border-border-presentation-state-focus",
    "appearance-none",
    "checked:border-background-presentation-state-information-primary checked:hover:bg-white checked:bg-white",
    "disabled:bg-background-presentation-action-disabled disabled:border-border-presentation-global-primary",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        S: ["w-[12px] checked:border-[5px]", "h-[12px]"],
        M: ["w-[24px] checked:border-[9px]", "h-[24px]"],
        L: ["w-[24px] checked:border-[9px]", "h-[24px]"],
      },
    },
    defaultVariants: {
      size: "M",
    },
  }
);

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "children"> {
  size?: "S" | "M" | "L";
  children?: React.ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, Props>(
  ({ size = "M", className, children, ...props }, ref) => {
    return (
      <label htmlFor={props.id} className={cn("flex items-center justify-start gap-1", className)}>
        <input
          {...props}
          onChange={(e) => {
            props.onChange?.(e);
          }}
          ref={ref}
          id={props.id}
          type="radio"
          className={cn(
            glareRadioStyles({
              size,
            }),
          )}
        />
        {children}
      </label>
    );
  }
);
Radio.displayName = "Radio";