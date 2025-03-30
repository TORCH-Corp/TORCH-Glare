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
      theme,
      className,
      size = "M",
      ...props
    },
    ref
  ) => {
    return (
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
          label={label}
          as={"div"}
          secondaryLabel={secondaryLabel}
          requiredLabel={requiredLabel}
          size={size}
        />
      </Checkbox>
    );
  }
);

LabeledCheckBox.displayName = "LabeledCheckBox";

