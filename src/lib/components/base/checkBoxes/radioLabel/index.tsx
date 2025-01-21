import { InputHTMLAttributes, forwardRef } from "react";
import { Label } from "@/components/base/labels/label";
import { cn } from "@/utils";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  name: string;
  secondaryLabel?: string;
  requiredLabel?: string;
  size?: "S" | "M" | "L";
  directions?: "vertical" | "horizontal";
}

export const RadioLabel = forwardRef<HTMLInputElement, Props>(
  (
    {
      name,
      label,
      secondaryLabel,
      requiredLabel,
      size = "M",
      directions,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("flex items-center  gap-1", props.className)}>
        <input ref={ref} name={name} type="radio" className="" {...props} />
        <Label
          htmlFor={name}
          label={label}
          secondaryLabel={secondaryLabel}
          requiredLabel={requiredLabel}
          size={size}
          directions={directions}
        ></Label>
      </div>
    );
  }
);

RadioLabel.displayName = "RadioLabel";
