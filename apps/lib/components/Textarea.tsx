import * as React from "react";
import { cn } from "../utils/cn";
import { Label } from "./Label";
import { cva, VariantProps } from "class-variance-authority";

// Define the styles for the textarea using cva
const textareaStyles = cva(
  [
    "border",
    // `radius/xl` (12px). Figma's TextArea-Field has two sizes — S is `radius/lg` (8px) and M is
    // `radius/xl` — and this component has no size variant: it renders its `Label` wrapper at
    // `size="M"` below, so M is the size it actually is. Supporting S properly needs a real `size`
    // prop, which is an API change rather than a radius one.
    "rounded-radius-xl",
    "px-[8px]",
    "py-[12px]",
    "outline-none",
    "typography-body-large-regular",
    // A floor for the empty field — without one, `field-sizing: content` collapses it to a single
    // 50px line. No `!` — twMerge does not dedupe an important class against a plain one, so `!`
    // here would make the height impossible to override from a caller's `className`.
    "min-h-[200px]",
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
    "w-full min-w-[100px] max-w-[100%]",
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
  },
);

// Define the prop types for the Textarea component
interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof textareaStyles> {
  label?: string; // Optional label text
  requiredLabel?: string; // Text for required field indicator
  secondaryLabel?: string; // Additional label text
  direction?: "row" | "column";
  theme?: "dark" | "light" | "default";
  /**
   * Grow the field to fit its content as the user types, instead of scrolling inside a fixed box.
   * On by default, via CSS `field-sizing: content`. Set a `max-h-*` on the field to cap the growth —
   * past the cap it scrolls. Note `rows` has no effect while this is on: the browser sizes the field
   * from its content, so an empty field starts at one line. Pass `autoResize={false}` for the old
   * fixed-height box with a drag handle.
   */
  autoResize?: boolean;
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      theme, // excluded from ...props spread
      autoResize = true,
      ...props
    },
    ref,
  ) => {
    return (
      <Label
        label={label}
        requiredLabel={requiredLabel}
        secondaryLabel={secondaryLabel}
        labelDirections={direction === "row" ? "vertical" : "horizontal"}
        childrenDirections={direction === "row" ? "horizontal" : "vertical"}
        size={"M"}
        className={cn(className)}
      >
        <textarea
          // Auto-grow is pure CSS. Written as an arbitrary *property* rather than as
          // `field-sizing-content`: that utility only exists in Tailwind v4 and this project is on
          // v3, where it compiled to no rule at all and left the computed `field-sizing` at `fixed`.
          // The drag handle goes away with it — the height is content-driven, and a manual drag
          // would pin it and silently stop the growing.
          className={cn(textareaStyles({ state }), autoResize && "[field-sizing:content] resize-none")}
          ref={ref}
          {...props}
        />
      </Label>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
