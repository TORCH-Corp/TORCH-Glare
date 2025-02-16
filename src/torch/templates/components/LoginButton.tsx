import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils"; // Assuming you have a `cn` utility
import { ButtonHTMLAttributes } from "react";
import { LoadingIcon } from "./Button";

const buttonVariants = cva(
  "w-full h-[42px] rounded-[8px] typography-body-large-regular flex justify-center items-center transition-all duration-250 ease-in-out border",
  {
    variants: {
      variant: {
        default: [
          "bg-[--background-system-body-primary]",
          "text-[--content-system-global-primary]",
          "border-[--border-system-global-primary]",
          "hover:border-[#9748FF]",
        ],
        noBg: [
          "bg-transparent",
          "border-[--border-system-global-primary]",
          "text-[--content-system-global-primary]",
          "hover:border-[#9748FF]",
          "no-underline",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  theme?: "dark" | "light" | "default"
}

export function LoginButton({
  variant = "default",
  className,
  isLoading,
  theme,
  ...props
}: ButtonProps) {
  return (
    <button data-theme={theme} {...props} className={cn(buttonVariants({ variant, className }))}>
      {isLoading ? (
        <LoadingIcon className="w-[20px] h-[20px]" />
      ) : (
        props.children
      )}
    </button>
  );
}
