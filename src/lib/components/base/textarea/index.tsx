import * as React from "react";
import { cn } from "../utils";
import { Label } from "../label";
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
    "text-[var(--content-presentation-action-light-primary)]",
    "caret-[var(--border-presentation-state-focus)]",
    "border-[var(--border-presentation-action-primary)]",
    "bg-[var(--background-presentation-form-field-primary)]",
    "hover:border-[var(--border-presentation-action-hover)]",
    "hover:bg-[var(--background-presentation-form-field-hover)]",
    "focus:border-[var(--border-presentation-state-focus)]",
    "hover:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
  ],
  {
    variants: {
      state: {
        negative: [
          "border-[var(--border-presentation-state-negative)]",
          "caret-[var(--border-presentation-state-negative)]",
          "hover:border-[var(--border-presentation-state-negative)]",
          "focus:border-[var(--border-presentation-state-negative)]",
        ],
        disabled: [
          "border-[var(--border-presentation-action-disabled)]",
          "bg-[var(--background-presentation-action-disabled)]",
          "text-[var(--border-presentation-action-disabled)]",
          "cursor-not-allowed",
          "placeholder-[var(--border-presentation-action-disabled)]",
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
      ...props
    },
    ref
  ) => {
    return (
      <Label
        label={label}
        requiredLabel={requiredLabel}
        secondaryLabel={secondaryLabel}
      >
        <textarea
          className={cn(textareaStyles({ state }), className)}
          ref={ref}
          {...props}
        />
      </Label>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
