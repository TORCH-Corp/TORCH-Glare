import { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import './variants/_variants.scss';
import '../../../../styles/typography_2/index.scss';
import { cn } from "../../../../../utils";

const buttonVariants = cva(
  "flex items-center justify-center gap-1 transition-all duration-200 ease-in-out",
  {
    variants: {
      component_style: {
        PrimeStyle: "bg-[--background-system-body-tertiary]",
        BlueSecStyle: "BlueSecStyle",
        YelSecStyle: "YelSecStyle",
        RedSecStyle: "RedSecStyle",
        BorderStyle: "BorderStyle",
        PrimeContStyle: "PrimeContStyle",
        BlueContStyle: "BlueContStyle",
        RedContStyle: "RedContStyle",
      },
      component_size: {
        S: "h-[22px] px-[6px] Body-typography-Small-Medium rounded-[4px]",
        M: "h-[26px] px-[8px] Body-typography-Medium-Medium rounded-[4px]",
        L: "h-[28px] px-[18px] Body-typography-Large-Medium rounded-[6px]",
      },
      is_loading: {
        true: "",
      },
      disabled: {
        true: "button-disabled",
      },
    },
    defaultVariants: {
      component_size: "L",
      component_style: "PrimeStyle",
    },
    compoundVariants: [
      {
        is_loading: true,
        className: "cursor-wait"
      }
    ]
  }
);

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  is_loading?: boolean;
  disabled?: boolean;
}

export const Button = function ({
  is_loading = false,
  component_style,
  component_size,
  className,
  disabled,
  ...props
}: Props) {
  return (
    <button
      className={cn(buttonVariants({
        component_style,
        component_size,
        is_loading,
        disabled,
        className,
      }))}
      disabled={disabled}
      {...props}
    >
      {props.children}
    </button>
  );
};


