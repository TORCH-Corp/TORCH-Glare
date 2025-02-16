import { InputHTMLAttributes, forwardRef } from "react";
import { Label } from "./Label";
import { cn } from "../../utils/utils";
import { cva } from "class-variance-authority";

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
      ...props
    },
    ref
  ) => {
    return (
      <label
        data-theme={theme}
        htmlFor={props.id}
        className={cn("flex items-center gap-1 group", props.className)}
      >
        <Radio {...props} checked={props.checked} size={size} ref={ref} />
        {label && (
          <Label
            htmlFor={props.id}
            label={label}
            secondaryLabel={secondaryLabel}
            requiredLabel={requiredLabel}
            size={size}
            directions={directions}
          />
        )}
      </label>
    );
  }
);

RadioLabel.displayName = "RadioLabel";

export const glareRadioLabelStyles = cva(
  [
    "w-[12px]",
    "h-[12px]",
    "rounded-full",
    "border",
    "border-[--border-presentation-action-checkbox-primary]",
    "bg-[--background-presentation-action-borderstyle]",
    "transition-[background,border-color,background-color] duration-200",
    "hover:bg-[--blue-sparkle-alpha-15] hover:border-[--border-presentation-state-focus]",
    "appearance-none",
    "checked:border-[--background-presentation-state-information-primary] checked:hover:bg-white checked:bg-white",
    "disabled:bg-[--background-presentation-action-disabled] disabled:border-[--border-presentation-global-primary]",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        S: ["w-[12px] checked:border-[5px]", "h-[12px]"],
        M: ["w-[24px] checked:border-[9px]", "h-[24px]"],
        L: ["w-[24px] checked:border-[9px]", "h-[24px]"],
      },
    },
    defaultVariants: {
      size: "M",
    },
  }
);

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "S" | "M" | "L";
}

export const Radio = forwardRef<HTMLInputElement, Props>(
  ({ size = "M", ...props }, ref) => {
    return (
      <input
        {...props}
        onChange={(e) => {
          props.onChange?.(e);
        }}
        ref={ref}
        id={props.id}
        type="radio"
        className={cn(
          glareRadioLabelStyles({
            size,
          })
        )}
      />
    );
  }
);
