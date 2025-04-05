import * as React from "react";
import { cn } from "../utils/cn";
import { Label } from "./Label";
import { cva, VariantProps } from "class-variance-authority";

// Define the styles for the textarea using cva
const textareaStyles = cva(
  [
    "w-full",
    "border",
    "rounded-[4px]",
    "px-[8px]",
    "py-[12px]",
    "outline-none",
    "typography-body-small-regular",
    "!min-h-[36px]",
    "transition-[border,background-color,color,caret-color,box-shadow]",
    "ease-in-out",
    "duration-150",
    "text-content-presentation-action-light-primary",
    "caret-border-presentation-state-focus",
    "border-border-presentation-action-primary",
    "bg-background-presentation-form-field-primary",
    "hover:border-border-presentation-action-hover",
    "hover:bg-background-presentation-form-field-hover",
    "focus:border-border-presentation-state-focus",
    "hover:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
    "disabled:border-border-presentation-action-disabled",
    "disabled:bg-background-presentation-action-disabled",
    "disabled:text-border-presentation-action-disabled",
    "disabled:cursor-not-allowed",
    "disabled:placeholder-border-presentation-action-disabled",
  ],
  {
    variants: {
      state: {
        negative: [
          "border-border-presentation-state-negative",
          "caret-border-presentation-state-negative",
          "hover:border-border-presentation-state-negative",
          "focus:border-border-presentation-state-negative",
        ],
      },
    },
    defaultVariants: {},
  }
);

// Define the prop types for the Textarea component
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  VariantProps<typeof textareaStyles> {
  label?: string; // Optional label text
  requiredLabel?: string; // Text for required field indicator
  secondaryLabel?: string; // Additional label text
  direction?: "row" | "column";
  theme?: "dark" | "light" | "default";
}

// Textarea component definition
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      state, // Default state for textarea
      label,
      requiredLabel,
      secondaryLabel,
      direction = "row",
      theme,
      ...props
    },
    ref
  ) => {
    return (
      <div
        data-theme={theme}
        className={cn(
          "flex gap-[4px]",
          {
            "flex-col": direction === "column",
            "flex-row items-start gap-[10px]": direction === "row",
          },
          className
        )}
      >
        <Label
          label={label}
          requiredLabel={requiredLabel}
          secondaryLabel={secondaryLabel}
          labelDirections={direction === "row" ? "vertical" : "horizontal"}
          className={cn({
            "pt-[9px]": direction === "row",
          })}
          size={"M"}
        />
        <textarea
          className={cn(textareaStyles({ state }), className)}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
