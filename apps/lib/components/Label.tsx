import { LabelHTMLAttributes, ReactNode } from "react";
import React from "react";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { Themes } from "../utils/types";

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
  extends LabelHTMLAttributes<HTMLDivElement>,
  VariantProps<typeof labelComponentVariants> {
  label?: ReactNode; // main label
  requiredLabel?: ReactNode; // normal text with required style
  secondaryLabel?: ReactNode; // normal text with secondary style
  as?: React.ElementType;
  asChild?: boolean;
  size?: "S" | "M" | "L";
  variant?: "SystemStyle" | "PresentationStyle";
  theme?: Themes
}

export const Label = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      label,
      secondaryLabel,
      requiredLabel,
      size = "M",
      directions,
      className,
      variant = "PresentationStyle",
      theme,
      ...props
    },
    forwardedRef
  ) => {
    return (
      <div
        data-theme={theme}
        className={cn(labelComponentVariants({ directions }), className)} // Merge generated and custom classNames
        ref={forwardedRef}
        {...props}
      >
        {label && (
          <p
            className={cn(
              "text-start !leading-none",
              {
                "typography-body-small-regular": size === "S",
                "typography-body-medium-regular": size === "M",
                "typography-body-large-regular": size === "L",
              },
              {
                "text-content-presentation-global-primary ":
                  variant === "PresentationStyle",
                "text-[#E5E5E5]": variant === "SystemStyle",
              }
            )}
          >
            {label}
          </p>
        )}
        {secondaryLabel && (
          <p
            className={cn(
              "text-content-presentation-global-secondary text-start !leading-none",
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
              "text-content-presentation-state-negative text-start !leading-none",
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
      </div>
    );
  }
);
Label.displayName = "Label";
