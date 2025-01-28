import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Label } from "./Label";
import { cn } from "./utils";
import { cva } from "class-variance-authority";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  secondaryLabel?: string;
  requiredLabel?: string;
  size?: "S" | "M" | "L";
  directions?: "vertical" | "horizontal";
}

export const RadioLabel = forwardRef<HTMLInputElement, Props>(
  (
    {
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
    return (
      <label
        htmlFor={props.id}
        className={cn("flex items-center gap-1 group", props.className)}
      >
        <Radio {...props} size={size} ref={ref} />
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

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "S" | "M" | "L";
}

export const Radio = forwardRef<HTMLInputElement, Props>(
  ({ size = "M", ...props }, ref) => {
    const [checked, setChecked] = useState(props.checked);
    return (
      <label htmlFor={props.id} className="flex items-center justify-center">
        <input
          {...props}
          hidden
          onChange={(e) => {
            props.onChange?.(e);
            setChecked(e.target.checked);
          }}
          ref={ref}
          id={props.id}
          type={"radio"}
        />
        <div
          className={cn(
            glareRadioLabelStyles({
              disabled: props.disabled,
              checked,
            }),
            {
              "w-[12px] h-[12px]": size === "S",
              "w-[24px] h-[24px]": size === "M" || size === "L",
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
      </label>
    );
  }
);
