'use client';
import { forwardRef } from "react";
import { Label } from "./Label";
import { Themes } from "../utils/types";
import { Checkbox } from "./Checkbox";
import { cn } from "../utils/cn";
interface Props extends Omit<React.ComponentProps<typeof Checkbox>, "size"> {
  label: string;
  id: string;
  secondaryLabel?: string;
  requiredLabel?: string;
  size?: "S" | "M" | "L";
  theme?: Themes
}

export const LabeledCheckBox = forwardRef<HTMLButtonElement, Props>(
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
      <Label
        label={label}
        labelDirections="horizontal"
        childrenDirections="horizontal"
        secondaryLabel={secondaryLabel}
        requiredLabel={requiredLabel}
        size={size}
        className={cn(className)}
        reverseChildren
      >
        <Checkbox
          {...props}
          size={size === "L" ? "M" : size}
          ref={ref}
        />
      </Label>


    );
  }
);

LabeledCheckBox.displayName = "LabeledCheckBox";

