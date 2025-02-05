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
          "bg-[#131415]",
          "text-[#E5E5E5]",
          "border-[#2C2D2E]",
          "hover:border-[#9748FF]",
        ],
        noBg: [
          "bg-transparent",
          "border-transparent",
          "text-[rgba(229,229,229,1)]",
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
}

export function LoginButton({
  variant = "default",
  className,
  isLoading,
  ...props
}: ButtonProps) {
  return (
    <button {...props} className={cn(buttonVariants({ variant, className }))}>
      {isLoading ? (
        <LoadingIcon className="w-[20px] h-[20px]" />
      ) : (
        props.children
      )}
    </button>
  );
}
