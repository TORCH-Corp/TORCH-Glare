import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Label } from "./Label";
import { cn } from "./utils";
import { cva } from "class-variance-authority";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  id: string;
  secondaryLabel?: string;
  requiredLabel?: string;
  size?: "S" | "M" | "L";
  directions?: "vertical" | "horizontal";
}

export const glareRadioLabelStyles = cva(
  [
    "w-[12px]",
    "h-[12px]",
    "rounded-full",
    "border",
    "border-[--border-presentation-action-checkBox-primary]",
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

export const RadioLabel = forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      label,
      secondaryLabel,
      requiredLabel,
      size = "M",
      type = "radio",
      directions,
      ...props
    },
    ref
  ) => {
    const [checked, setChecked] = useState(props.checked);
    return (
      <label
        htmlFor={id}
        className={cn(
          "flex items-center gap-1 rounded-full group",
          props.className
        )}
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
            }), {
            "w-[12px] h-[12px]": size === "S",
            "w-[24px] h-[24px]": size === "M",
          }
          )}
        >
          <span
            className={cn(
              "opacity-0 w-[4px] h-[4px] rounded-full bg-white",
              "transition-opacity",
              {
                "opacity-100": checked,
              },
              size === "S" && "w-[3px] h-[3px]",
              size === "M" && "w-[6px] h-[6px]"
            )}
          ></span>
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

RadioLabel.displayName = "RadioLabel";
