'use client'
import { forwardRef } from "react";
import { Label } from "./Label";
import { Radio, RadioGroup } from "./Radio";
import { cn } from "../utils/cn";
interface Props extends Omit<React.ComponentProps<typeof Radio>, "size"> {
  label?: string;
  secondaryLabel?: string;
  requiredLabel?: string;
  size?: "S" | "M" | "L";
  theme?: "dark" | "light" | "default";
  name?: string;
}

export const LabeledRadio = forwardRef<HTMLButtonElement, Props>(
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
      <Label
        label={label}
        secondaryLabel={secondaryLabel}
        requiredLabel={requiredLabel}
        size={size === "L" ? "M" : size}
        labelDirections="horizontal"
        childrenDirections="horizontal"
        className={cn(className)}
        id={id}
        reverseChildren
      >
        <Radio id={id}  {...props} data-theme={theme} ref={ref} />
      </Label>
    );
  }
);

LabeledRadio.displayName = "LabeledRadio";