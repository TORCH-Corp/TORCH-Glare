'use client';
import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Label } from "./Label";
import { cn } from "../utils/cn";
import { cva } from "class-variance-authority";
import { Themes } from "../utils/types";
import { Checkbox } from "./Checkbox";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  id: string;
  secondaryLabel?: string;
  requiredLabel?: string;
  directions?: "vertical" | "horizontal";
  size?: "S" | "M" | "L";
  theme?: Themes
}

export const LabeledCheckBox = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label,
      secondaryLabel,
      requiredLabel,
      type = "checkbox",
      directions,
      theme,
      className,
      size = "M",
      ...props
    },
    ref
  ) => {
    return (
      <label
        htmlFor={id}
        data-theme={theme}
        className={cn("flex items-center gap-1  group", className)}
      >
        <Checkbox
          {...props}
          id={id}
          disabled={props.disabled}
          type={type}
          size={size}
          ref={ref}
        >
          <Label
            className="leading-none"
            htmlFor={id}
            label={label}
            secondaryLabel={secondaryLabel}
            requiredLabel={requiredLabel}
            size={size}
            directions={directions}
          />
        </Checkbox>
      </label>
    );
  }
);

LabeledCheckBox.displayName = "LabeledCheckBox";

