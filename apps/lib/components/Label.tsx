import { LabelHTMLAttributes, ReactNode } from "react";
import React from "react";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { Themes } from "../utils/types";

const labelComponentVariants = cva("flex", {
  variants: {
    labelDirections: {
      vertical: "flex-col justify-start items-start",
      horizontal: "flex-row justify-start items-center gap-1",
    },
  },
  defaultVariants: {
    labelDirections: "horizontal",
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
  variant?: "SystemStyle" | "PresentationStyle";
  theme?: Themes
  labelsClassName?: string;
  labelDirections?: "vertical" | "horizontal";
  childrenDirections?: "vertical" | "horizontal";
}

export const Label = React.forwardRef<HTMLLabelElement, Props>(
  (
    {
      children,
      label,
      secondaryLabel,
      requiredLabel,
      size = "M",
      labelDirections = "horizontal",
      childrenDirections = "vertical",
      className,
      labelsClassName,
      variant = "PresentationStyle",
      theme,
      asChild,
      as: Tag = "label",
      ...props
    },
    forwardedRef
  ) => {

    const Component = Tag;

    return (
      <Component
        data-theme={theme}
        ref={forwardedRef}
        className={cn(className, "flex", {
          "flex-col justify-start items-start gap-1": childrenDirections === "vertical",
          "flex-row justify-start items-center gap-1": childrenDirections === "horizontal",
        })}
        {...props}
      >
        <div className={cn(labelComponentVariants({ labelDirections }), labelsClassName)} >
          {label && (
            <p
              className={cn(
                "text-start",
                {
                  "typography-body-small-regular": size === "S",
                  "typography-body-medium-regular": size === "M",
                  "typography-body-large-regular": size === "L",
                },
                {
                  "text-content-presentation-global-primary":
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
                "text-content-presentation-global-secondary text-start",
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
                "text-content-presentation-state-negative text-start",
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
        </div>
        {children}
      </Component >
    );
  }
);
Label.displayName = "Label";
