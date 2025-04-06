"use client";

import { forwardRef, InputHTMLAttributes, ReactNode, useState } from "react";
import { InputField } from "./InputField";
import { ToolTipSide } from "./Tooltip";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "variant"> {
  size?: "S" | "M"; // this is used to change the size style of the component
  variant?: "SystemStyle" | "PresentationStyle";
  icon?: ReactNode; // to add left side icon if you pass it
  childrenSide?: ReactNode; // to add action button to the end of the input
  popoverChildren?: ReactNode; // to add drop down list if you pass it
  errorMessage?: string; // to show tooltip component when error_message not null
  onTable?: boolean; // to change the border style of the component when it is on table
  label?: string; // to show label
  required?: boolean; // to show required icon
  toolTipSide?: ToolTipSide;
  theme?: Themes
}

export const InnerLabelField = forwardRef<HTMLInputElement, Props>(
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
      theme,
      required,
      toolTipSide,
      ...props
    },
    ref
  ) => {
    const [focus, setFocus] = useState(false);
    const [isEmpty, setIsEmpty] = useState(!props.value);

    return (
      <InputField
        {...props}
        theme={theme}
        onFocus={(e) => {
          setFocus(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocus(false);
          props.onBlur?.(e);
        }}
        onChange={(e) => {
          setIsEmpty(!e.target.value);
          props.onChange?.(e);
        }}
        className={cn(className, "group")}
        ref={ref}
        toolTipSide={toolTipSide}
        size={size}
        variant={variant}
        childrenSide={childrenSide}
        popoverChildren={popoverChildren}
        errorMessage={errorMessage}
        onTable={onTable}
        icon={
          <Label
            focus={focus}
            isEmpty={isEmpty}
            label={label}
            required={required}
            disabled={props.disabled}
            error={!errorMessage}
          />
        }
      />
    );
  }
);

InnerLabelField.displayName = "LabelLessInput"



const Label = ({

  focus,
  isEmpty,
  label,
  required,
  disabled,
  error,
}: {
  focus: boolean;
  isEmpty: boolean;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
}) => {
  return (
    <section className="flex items-center">
      <section
        className={cn([
          "px-[3px]",
          "typography-labels-small-regular",
          "text-content-presentation-global-secondary",
          "flex",
          "items-center",
        ])}
      >
        <p
          className={cn(
            "transition-all",
            "duration-300",
            "ease-in-out",
            "group-hover:text-content-presentation-global-primary group-hover:typography-body-small-regular",
            { "text-content-presentation-global-primary typography-body-small-regular": isEmpty },
            { "text-content-presentation-global-primary typography-body-small-regular": focus && isEmpty },
            { "text-content-presentation-global-primary typography-body-small-regular": error && isEmpty },
            { "text-content-presentation-global-primary typography-body-small-regular": disabled && isEmpty },
          )}
        >
          {label}
        </p>
        {required && (
          <p className="text-content-presentation-state-negative">*</p>
        )}
      </section>
      <span
        className={cn(
          "w-[1px]",
          "h-[12px]",
          "bg-border-presentation-action-primary ",
          "transition-all",
          "duration-300",
          "ease-in-out",
          "rounded-full",
          "group-hover:bg-border-presentation-action-hover",
          "group-hover:h-[22px]",
        )}
      />
    </section>
  );
};
