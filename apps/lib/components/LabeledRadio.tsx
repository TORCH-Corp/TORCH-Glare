'use client'
import { InputHTMLAttributes, forwardRef } from "react";
import { Label } from "./Label";
import { Radio } from "./Radio";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  secondaryLabel?: string;
  requiredLabel?: string;
  size?: "S" | "M" | "L";
  theme?: "dark" | "light" | "default";
}

export const LabeledRadio = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      theme,
      secondaryLabel,
      requiredLabel,
      size = "M",
      type = "radio",
      className,
      name,
      id,
      ...props
    },
    ref
  ) => {
    return (
      <Radio id={id} name={name} {...props} data-theme={theme} checked={props.checked} size={size} ref={ref} >
        <Label
          as={"div"}
          label={label}
          secondaryLabel={secondaryLabel}
          requiredLabel={requiredLabel}
          size={size}
        />
      </Radio>
    );
  }
);

LabeledRadio.displayName = "LabeledRadio";