'use client';
import { InputHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "../utils/cn";
import { cva } from "class-variance-authority";


interface CheckBoxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "S" | "M" | "L";
  children?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ size = "M", children, ...props }, ref) => {
    const [checked, setChecked] = useState(props.checked);
    return (
      children ?
        <label htmlFor={props.id} className="flex items-center justify-center gap-1">
          <input
            {...props}
            children={null}
            id={props.id}
            onChange={(e) => {
              props.onChange?.(e);
              setChecked(e.target.checked);
            }}
            type="checkbox"
            hidden
            ref={ref}
          />
          <CheckboxIcon size={size} checked={checked} disabled={props.disabled} />
          {children}
        </label>
        :
        <div>
          <input
            {...props}
            children={null}
            id={props.id}
            onChange={(e) => {
              props.onChange?.(e);
              setChecked(e.target.checked);
            }}
            type="checkbox"
            hidden
            ref={ref}
          />
          <CheckboxIcon size={size} checked={checked} disabled={props.disabled} />
        </div>

    );
  }
);

Checkbox.displayName = "Checkbox";



const glareCheckBoxStyles = cva(
  [
    "w-[16px]",
    "h-[16px]",
    "rounded-[3px]",
    "border",
    "border-border-presentation-action-checkbox-primary",
    "bg-background-presentation-action-borderstyle",
    "flex",
    "items-center",
    "justify-center",
    "transition-colors",
    "group-hover:bg-blue-sparkle-alpha-15 group-hover:border-border-presentation-state-focus",
  ],
  {
    variants: {
      checked: {
        true: [
          "bg-background-presentation-state-information-primary border-transparent",
          "group-hover:bg-background-presentation-state-information-primary group-hover:border-transparent",
        ],
      },
      disabled: {
        true: [
          "border-border-presentation-global-primary",
          "!bg-background-presentation-action-disabled",
          "cursor-not-allowed",
          "hover:!border-border-presentation-global-primary",
        ],
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);


const CheckboxIcon = ({ size, checked, disabled }: { size: "S" | "M" | "L", checked?: boolean, disabled?: boolean }) => {
  return (
    <div
      className={cn(
        glareCheckBoxStyles({
          disabled: disabled,
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
      />
    </div>
  )
};