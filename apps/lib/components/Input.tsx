import React, { forwardRef, HTMLAttributes, InputHTMLAttributes } from "react";
import { cn } from "../utils/cn";
import { cva } from "class-variance-authority";

interface InputGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "size"> {
  size?: "S" | "M";
  variant?: "PresentationStyle" | "SystemStyle";
  error?: boolean;
  onTable?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  className?: string;
}

export const Group = forwardRef<HTMLDivElement, InputGroupProps>(
  (
    {
      size = "M",
      variant = "PresentationStyle",
      error = false,
      onTable = false,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(GroupStyles({ size, variant, error, onTable }), className)}
        ref={ref}
        {...props}
      ></div>
    );
  },
);

Group.displayName = "Group";

interface IconProps {
  children: React.ReactNode;
  className?: string;
}

export const Icon = ({ children, className }: IconProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        "transition-all duration-200 ease-in-out",
        "leading-0 text-content-presentation-action-light-secondary",
        className,
      )}
      data-role="icon"
    >
      {children}
    </div>
  );
};

interface TrillingProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}
export const Trilling = ({ children, className, ...props }: TrillingProps) => {
  return (
    // `ps-1` mirrors the inner side of Figma's `EndField-Container` (`p-[4px]`), keeping the field's
    // text clear of the end button instead of running straight into it.
    //
    // Logical, not physical: this slot flips to the left edge in RTL, so a `pl-1` would put the
    // padding on the outside — measured as 0px of clearance and the button 8px from the edge
    // instead of 4px. `padding-inline-start` follows the slot.
    <div
      {...props}
      className={cn("flex items-center justify-center h-full gap-1 py-1 ps-1", className)}
    >
      {children}
    </div>
  );
};

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Force scroll to the end
    const input = e.target;
    input.scrollLeft = input.scrollWidth;
    // Call the original onFocus if it exists
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // Force scroll to the end
    const input = e.target as HTMLInputElement;
    input.scrollLeft = input.scrollWidth;
    // Call the original onClick if it exists
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <input
      {...props}
      autoComplete="off"
      className={cn(
        // Base styles
        "typography-body-large-regular",
        "text-content-presentation-action-light-primary",
        "bg-transparent",
        "h-full",
        "px-[4px]",
        "flex-[1_1_0%]",
        "min-w-[30px]",
        "outline-none",
        "transition-all duration-200 ease-in-out",
        // Remove mask image completely when focused
        "[mask-image:linear-gradient(to_right,black_0%,black_0%,black_85%,transparent_100%)]",
        "focus:[mask-image:none]",
        "rtl:[mask-image:linear-gradient(to_left,black_0%,black_0%,black_85%,transparent_100%)]",
        "focus:rtl:[mask-image:none]",
        "hover:placeholder:text-content-presentation-action-light-primary",
        className,
      )}
      onFocus={handleFocus}
      onClick={handleClick}
      ref={ref}
    />
  );
});

Input.displayName = "Input";

/* // solution to fix autofill issue
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition: "color 1000s ease-out, background-color 1000s ease-out";
  -webkit-transition-delay: 1000s;
}
*/

export const GroupStyles = cva(
  [
    // 3px, not 4: Figma's `EndField-Container` is `p-[4px]` and its stroke sits *inside* that
    // padding, so the end button lands 4px from the field's outer edge. CSS `border-box` adds the
    // 1px border on top of the padding, so 4px here would render 5px. 1 + 3 = 4.
    "flex w-full min-w-0 px-[3px] justify-center items-center",
    "typography-body-small-regular",
    "border",
    "transition-all duration-200 ease-in-out",
    "hover:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
    "[&_i]:leading-[0px] leading-[0px]",
    "[&:has(input[disabled])]:!border-border-presentation-action-disabled",
    "[&:has(input[disabled])]:!bg-background-presentation-action-disabled",
    "[&:has(input[disabled])]:hover:border-border-presentation-action-disabled",
    "[&:has(input[disabled])]:hover:bg-background-presentation-action-disabled",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          "bg-background-presentation-form-field-primary",
          "border-border-presentation-action-primary",
          "hover:bg-background-presentation-form-field-hover",
          "hover:border-border-presentation-action-hover",
          "hover:text-content-presentation-action-light-primary",
          "focus-within:border-border-presentation-state-focus",
          "focus-within:bg-background-presentation-form-field-primary",
          "focus-within:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
          "focus-within:hover:border-border-presentation-state-focus",
          "focus-within:caret-border-presentation-state-focus",
          "focus-within:hover:caret-border-presentation-state-focus",
        ],
        SystemStyle: [
          "bg-black-alpha-20",
          "text-white",
          "border-[#2C2D2E]",
          "hover:border-[#9748FF]",
          "hover:bg-purple-alpha-10",
          "focus-within:border-border-presentation-state-focus",
          "focus-within:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
          "focus-within:hover:border-border-presentation-state-focus",
          "focus-within:caret-border-presentation-state-focus",
          "focus-within:hover:caret-border-presentation-state-focus",
          "focus-within:hover:bg-black-alpha-20",
          "[&_div[data-role='icon']]:focus-within:text-white",
          "[&_input]:placeholder:text-[#A0A0A0]",
          "[&_input]:hover:placeholder:text-[#A0A0A0]",
          "[&_input]:text-white",
        ],
      },
      // Radius per Figma's `radius/*` collection: S is `radius/lg` (8px) and M is `radius/xl`
      // (12px) — a deliberate jump, not consecutive steps. This `Group` is the shared field root,
      // so it is also what gives `InputField` and `InnerLabelField` their corners.
      size: {
        S: [
          "h-[30px] min-h-[30px]",
          "rounded-radius-lg [&_input]:h-[30px] [&_div[data-role='icon']]:text-[16px]",
        ],
        M: [
          "h-[40px] min-h-[40px]",
          "rounded-radius-xl [&_input]:h-[40px] [&_div[data-role='icon']]:text-[18px] [&_div[data-role='icon']]:px-[2px]",
        ],
      },
      error: {
        true: [
          "border-border-presentation-state-negative",
          "caret-border-presentation-state-negative",
          "hover:border-border-presentation-state-negative",
          "hover:caret-border-presentation-state-negative",
        ],
      },
      // Transparent border/background so the control blends into a table cell. The hover and
      // focus shadows are deliberately left alone — a cell control lifts exactly like any
      // other field.
      onTable: {
        true: ["border-transparent", "bg-transparent"],
      },
    },
  },
);
