import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Label } from "./Label";
import { cn } from "./utils";
import { cva } from "class-variance-authority";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  id: string;
  secondaryLabel?: string;
  requiredLabel?: string;
  directions?: "vertical" | "horizontal";
  size?: "S" | "M" | "L";
}

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

export const CheckboxLabel = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label,
      secondaryLabel,
      requiredLabel,
      type = "checkbox",
      directions,
      size = "M",
      ...props
    },
    ref
  ) => {
    const [checked, setChecked] = useState(props.checked);
    return (
      <label
        htmlFor={id}
        className={cn("flex items-center gap-1  group", props.className)}
      >
        <input
          {...props}
          hidden
          onChange={(e) => {
            props.onChange?.(e);
            setChecked(e.target.checked);
          }}
          ref={ref}
          id={id}
          disabled={props.disabled}
          type={type}
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

CheckboxLabel.displayName = "RadioLabel";
