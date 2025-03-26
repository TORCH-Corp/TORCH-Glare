'use client'
import { InputHTMLAttributes, forwardRef } from "react";
import { Label } from "./Label";
import { Radio } from "./Radio";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  secondaryLabel?: string;
  requiredLabel?: string;
  size?: "S" | "M" | "L";
  directions?: "vertical" | "horizontal";
  theme?: "dark" | "light" | "default";
}

export const RadioLabel = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      theme,
      secondaryLabel,
      requiredLabel,
      size = "M",
      type = "radio",
      directions,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Radio {...props} data-theme={theme} checked={props.checked} size={size} ref={ref} >
        <Label
          htmlFor={props.id}
          label={label}
          secondaryLabel={secondaryLabel}
          requiredLabel={requiredLabel}
          size={size}
          directions={directions}
        />
      </Radio>
    );
  }
);

RadioLabel.displayName = "RadioLabel";