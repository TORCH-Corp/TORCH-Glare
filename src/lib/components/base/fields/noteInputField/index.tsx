import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/base/labels/label";
import { cva, VariantProps } from "class-variance-authority";

// Define the styles for the textarea using cva
const textareaStyles = cva(
  [
    "w-full",
    "border",
    "rounded-lg",
    "px-[4px]",
    "py-[12px]",
    "outline-none",
    "!min-h-[36px]",
    "transition-[border,background-color,color,caret-color]",
    "ease-in-out",
    "duration-150",
    "text-[var(--content-presentation-action-light-primary)]",
    "caret-[var(--border-presentation-state-focus)]",
    "focus:ring-2",
  ],
  {
    variants: {
      state: {
        default: [
          "border-[var(--border-presentation-action-primary)]",
          "bg-[var(--background-presentation-form-field-primary)]",
          "hover:border-[var(--border-presentation-action-hover)]",
          "focus:border-[var(--border-presentation-state-focus)]",
          "focus:ring-[var(--border-presentation-state-focus)]",
        ],
        negative: [
          "border-[var(--border-presentation-state-negative)]",
          "caret-[var(--border-presentation-state-negative)]",
          "hover:border-[var(--border-presentation-state-negative)]",
          "focus:border-[var(--border-presentation-state-negative)]",
          "focus:ring-[var(--border-presentation-state-negative)]",
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
    defaultVariants: {
      state: "default",
    },
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
      state = "default", // Default state for textarea
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
