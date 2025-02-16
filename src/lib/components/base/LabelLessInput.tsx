"use client";

import { forwardRef, InputHTMLAttributes, ReactNode, useState } from "react";
import { InputField } from "./InputField";
import { ToolTipSide } from "./Tooltip";
import { cn } from "./utils";

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
  theme?: "dark" | "light" | "default"
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
      theme,
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
        theme={theme}
        onFocus={(e) => {
          setFucus(true);
          props.onFocus && props.onFocus(e);
        }}
        onBlur={(e) => {
          setFucus(false);
          props.onBlur && props.onBlur(e);
        }}
        className={className}
        ref={ref}
        toolTipSide={toolTipSide}
        size={size}
        variant={variant}
        childrenSide={childrenSide}
        popoverChildren={popoverChildren}
        errorMessage={errorMessage}
        onTable={onTable}
        icon={
          <LabelLessSection fucus={fucus} label={label} required={required} />
        }
      />
    );
  }
);

LabelLessInput.displayName = "LabelLessInput"

export const LabelLessSection = ({
  fucus,
  label,
  required,
}: {
  fucus: boolean;
  label?: string;
  required?: boolean;
}) => {
  return (
    <section className="flex items-center">
      <section
        className={cn([
          "px-[3px]",
          "typography-body-small-regular",
          "text-[--content-presentation-global-primary]",
          "flex",
          "items-center",
        ])}
      >
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
          <p className="text-[--content-presentation-state-negative]">*</p>
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
  );
};
