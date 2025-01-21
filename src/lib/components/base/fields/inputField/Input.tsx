import { forwardRef, InputHTMLAttributes } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils";

const inputFieldStyles = cva(
  [
    "typography-body-small-regular",
    "text-[--content-presentation-action-light-primary]",
    "bg-transparent",
    "h-full",
    "px-[4px]",
    "flex-[1_1_0%]",
    "min-w-[30px]",
    "outline-none",
    "transition-all duration-200 ease-in-out",
    "[mask-image:linear-gradient(to_right,black_0%,black_0%,black_85%,transparent_100%)]",
    "rtl:[mask-image:linear-gradient(to_left,black_0%,black_0%,black_85%,transparent_100%)]",
    "hover:placeholder:text-[--content-presentation-action-light-primary]",
  ],
  {
    variants: {
      variant: {
        SystemStyle: [
          "placeholder:text-[#A0A0A0]",
          "hover:placeholder:text-[#A0A0A0]",
        ],
      },
      size: {
        S: ["rounded-[6px]"],
        M: ["rounded-[8px]"],
      },
    },
    defaultVariants: {
      size: "M",
    },
  }
);
interface Props extends InputHTMLAttributes<HTMLInputElement> {
  fucusSetter?: (fucus: boolean) => void;
  variant?: "SystemStyle";
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ fucusSetter, className, variant, size, ...props }, ref) => {
    return (
      <input
        {...props}
        className={cn(inputFieldStyles({ variant }), className)}
        onFocus={(e) => {
          fucusSetter && fucusSetter(true);
          props.onFocus && props.onFocus(e);
        }}
        onBlur={(e) => {
          fucusSetter && fucusSetter(false);
          props.onBlur && props.onBlur(e);
        }}
        ref={ref}
      />
    );
  }
);
