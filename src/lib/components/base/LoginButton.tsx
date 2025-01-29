import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils"; // Assuming you have a `cn` utility
import { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "flex-1 w-full h-[42px] rounded-[8px] text-base font-medium flex justify-center items-center transition-all duration-250 ease-in-out border-none border border-1",
  {
    variants: {
      variant: {
        default: [
          "bg-[var(--background-system-body-primary)]",
          "text-[rgba(229,229,229,1)]",
          "border-[var(--border-system-global-primary)]",
          "hover:border-[var(--border-system-action-hover-primary)]",
          "focus:border-[var(--border-system-action-hover-primary)]",
          "active:border-[var(--border-system-action-hover-primary)]",
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
    VariantProps<typeof buttonVariants> {}

export function LoginButton({ variant, className, ...props }: ButtonProps) {
  return (
    <button {...props} className={cn(buttonVariants({ variant, className }))} />
  );
}
