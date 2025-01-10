import { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import './variants/_variants.scss';
import '@/styles/typography_2/index.scss';
import { cn } from "@/utils";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
  "flex items-center justify-center gap-1 transition-[background,color] duration-200 ease-in-out outline-none",
  {
    variants: {
      variant: {
        PrimeStyle: "PrimeStyle",
        BlueSecStyle: "BlueSecStyle",
        YelSecStyle: "YelSecStyle",
        RedSecStyle: "RedSecStyle",
        BorderStyle: "BorderStyle",
        PrimeContStyle: "PrimeContStyle",
        BlueContStyle: "BlueContStyle",
        RedContStyle: "RedContStyle",
      },
      size: {
        S: "h-[22px] px-[6px] Body-typography-Small-Medium rounded-[4px]",
        M: "h-[26px] px-[8px] Body-typography-Medium-Medium rounded-[4px]",
        L: "h-[28px] px-[18px] Body-typography-Large-Medium rounded-[6px]",
      },
      is_loading: {
        true: "cursor-wait",
      },
      disabled: {
        true: "button-disabled",
      },
      buttonType: {
        button: "",
        icon: "",
      }
    },
    defaultVariants: {
      size: "L",
      variant: "PrimeStyle",
      buttonType: "button"
    },
    compoundVariants: [
      {
        buttonType: "icon",
        size: "S",
        className: ""
      },
      {
        buttonType: "icon",
        size: "M",
        className: ""
      },
      {
        buttonType: "icon",
        size: "L",
        className: ""
      }
    ]
  }
);

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  is_loading?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  as?: React.ElementType;
}
export const Button = function ({
  is_loading = false,
  variant,
  size,
  asChild,
  as: Tag = 'button',
  buttonType,
  className,
  ...props
}: Props) {

  const Component = asChild ? Slot : Tag;

  return (
    <Component
      className={cn(buttonVariants({
        variant,
        size,
        is_loading,
        buttonType,
        className
      }))}
      {...props}
    >
      {props.children}
    </Component>
  );
};


