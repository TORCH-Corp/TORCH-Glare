import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Label } from "./Label";
import { cn } from "../utils/cn";
import { cva } from "class-variance-authority";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  id: string;
  secondaryLabel?: string;
  requiredLabel?: string;
  directions?: "vertical" | "horizontal";
  size?: "S" | "M" | "L";
  theme?: "dark" | "light" | "default"
}

export const CheckboxLabel = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label,
      secondaryLabel,
      requiredLabel,
      type = "checkbox",
      directions,
      theme,
      size = "M",
      ...props
    },
    ref
  ) => {
    return (
      <label
        htmlFor={id}
        data-theme={theme}
        className={cn("flex items-center gap-1  group", props.className)}
      >
        <Checkbox
          {...props}
          id={id}
          disabled={props.disabled}
          type={type}
          size={size}
          ref={ref}
        />
        {label && (
          <Label
            htmlFor={id}
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

CheckboxLabel.displayName = "CheckboxLabel";

export const glareRadioLabelStyles = cva(
  [
    "w-[16px]",
    "h-[16px]",
    "rounded-[3px]",
    "border",
    "border-[--border-presentation-action-checkbox-primary]",
    "bg-[--background-presentation-action-borderstyle]",
    "flex",
    "items-center",
    "justify-center",
    "transition-colors",
    "group-hover:bg-[--blue-sparkle-alpha-15] group-hover:border-[--border-presentation-state-focus]",
  ],
  {
    variants: {
      checked: {
        true: [
          "bg-[--background-presentation-state-information-primary] border-transparent",
          "group-hover:bg-[--background-presentation-state-information-primary] group-hover:border-transparent",
        ],
      },
      disabled: {
        true: [
          "border-[--border-presentation-global-primary]",
          "!bg-[--background-presentation-action-disabled]",
          "cursor-not-allowed",
          "hover:!border-[--border-presentation-global-primary]",
        ],
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

interface CheckBoxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "S" | "M" | "L";
}

export const Checkbox = forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ size = "M", ...props }, ref) => {
    const [checked, setChecked] = useState(props.checked);
    return (
      <label htmlFor={props.id} className="flex items-center justify-center">
        <input
          {...props}
          id={props.id}
          onChange={(e) => {
            props.onChange?.(e);
            setChecked(e.target.checked);
          }}
          type="checkbox"
          hidden
          ref={ref}
        />
        <div
          className={cn(
            glareRadioLabelStyles({
              disabled: props.disabled,
              checked,
            }),
            {
              "w-[14px] h-[14px]": size === "S",
              "w-[16px] h-[16px]": size === "M" || size === "L",
            }
          )}
        >
          <i
            className={cn(
              "ri-check-line",
              "text-white transition-opacity opacity-0",
              {
                "opacity-100": checked,
              }
            )}
          ></i>
        </div>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
