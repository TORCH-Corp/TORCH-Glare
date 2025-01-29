import { LabelHTMLAttributes, ReactNode } from "react";
import React from "react";
import { cn } from "./utils";
import { cva, type VariantProps } from "class-variance-authority";

const labelComponentVariants = cva("flex", {
  variants: {
    directions: {
      vertical: "flex-col justify-start items-start",
      horizontal: "flex-row justify-start items-center gap-1",
    },
  },
  defaultVariants: {
    directions: "horizontal",
  },
});

interface Props
  extends LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelComponentVariants> {
  label?: ReactNode; // main label
  requiredLabel?: ReactNode; // normal text with required style
  secondaryLabel?: ReactNode; // normal text with secondary style
  as?: React.ElementType;
  asChild?: boolean;
  size?: "S" | "M" | "L";
}

export const Label = React.forwardRef<HTMLLabelElement, Props>(
  (
    {
      children,
      label,
      secondaryLabel,
      requiredLabel,
      size = "M",
      directions,
      className,
      ...props
    },
    forwardedRef
  ) => {
    return (
      <label
        className={cn(labelComponentVariants({ directions }), className)} // Merge generated and custom classNames
        ref={forwardedRef}
        {...props}
      >
        {label && (
          <p
            className={cn(
              "text-[--content-presentation-global-primary] text-start",
              {
                "typography-body-small-regular": size === "S",
                "typography-body-medium-regular": size === "M",
                "typography-body-large-regular": size === "L",
              }
            )}
          >
            {label}
          </p>
        )}
        {secondaryLabel && (
          <p
            className={cn(
              "text-[--content-presentation-global-secondary] text-start",
              {
                "typography-labels-small-regular": size === "S",
                "typography-labels-medium-regular": size === "M",
                "typography-body-small-regular": size === "L",
              }
            )}
          >
            {secondaryLabel}
          </p>
        )}
        {requiredLabel && (
          <p
            className={cn(
              "text-[--content-presentation-state-negative] text-start",
              {
                "typography-labels-small-medium": size === "S",
                "typography-labels-medium-medium": size === "M",
                "typography-body-small-medium": size === "L",
              }
            )}
          >
            {requiredLabel}
          </p>
        )}
        {children}
      </label>
    );
  }
);
Label.displayName = "Label";
