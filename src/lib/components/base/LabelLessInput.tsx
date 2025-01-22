"use client";

import { forwardRef, InputHTMLAttributes, ReactNode, useState } from "react";
import { cva } from "class-variance-authority";
import { InputField } from "./InputField";
import { ToolTipSide } from "./Tooltip";
import { cn } from "./utils";

const labelLessInputStyles = cva(
  [
    "px-[3px]",
    "typography-body-small-regular",
    "text-[--content-presentation-global-primary]",
    "flex",
    "items-center",
  ],
  {
    variants: {
      variant: {},
      size: {
        S: [""],
        M: [""],
      },
    },
    defaultVariants: {
      size: "S",
    },
  }
);

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "variant"> {
  size?: "S" | "M"; // this is used to change the size style of the component
  variant?: "SystemStyle";
  icon?: ReactNode; // to add left side icon if you pass it
  childrenSide?: ReactNode; // to add action button to the end of the input
  popoverChildren?: ReactNode; // to add drop down list if you pass it
  errorMessage?: string; // to show tooltip component when error_message not null
  onTable?: boolean; // to change the border style of the component when it is on table
  label?: string; // to show label
  required?: boolean; // to show required icon
  toolTipSide?: ToolTipSide;
}

export const LabelLessInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      size = "S",
      icon,
      childrenSide,
      popoverChildren,
      errorMessage,
      onTable,
      variant,
      className,
      label,
      required,
      toolTipSide,
      ...props
    },
    ref
  ) => {
    const [fucus, setFucus] = useState(false);

    return (
      <InputField
        {...props}
        onFocus={(e) => {
          setFucus(true);
          props.onFocus && props.onFocus(e);
        }}
        onBlur={(e) => {
          setFucus(false);
          props.onBlur && props.onBlur(e);
        }}
        ref={ref}
        toolTipSide={toolTipSide}
        size={size}
        variant={variant}
        childrenSide={childrenSide}
        popoverChildren={popoverChildren}
        errorMessage={errorMessage}
        onTable={onTable}
        icon={
          <section className="flex items-center">
            <section className={cn(labelLessInputStyles({}), className)}>
              <p
                className={cn(
                  "transition-all",
                  "duration-300",
                  "ease-in-out",
                  { "text-[--content-presentation-global-secondary]": fucus },
                  { "typography-labels-small-regular": fucus }
                )}
              >
                {label}
              </p>
              {required && (
                <p className="text-[--content-presentation-state-negative]">
                  *
                </p>
              )}
            </section>
            <span
              className={cn(
                "w-[1px]",
                "h-[12px]",
                "bg-[--border-presentation-action-primary] ",
                "transition-all",
                "duration-300",
                "ease-in-out",
                "rounded-full",
                { "h-[22px]": fucus },
                { "bg-[--border-presentation-action-hover]": fucus }
              )}
            />
          </section>
        }
      />
    );
  }
);
