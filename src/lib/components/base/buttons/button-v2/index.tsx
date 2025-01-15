import React, { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import '@/styles/typography_2/index.scss';
import { cn } from "@/utils";
import { Slot } from "@radix-ui/react-slot";
import { LoadingIcon } from "./loadingIcon";

const buttonVariants = cva(
  "flex items-center justify-center gap-1 transition-[background,color] duration-200 ease-in-out border border-transparent outline-none",
  {
    variants: {
      variant: {
        PrimeStyle: [
          "bg-[var(--background-presentation-action-secondary)]",
          "text-[var(--content-presentation-action-light-primary)]",
          "hover:bg-[var(--background-presentation-action-hover)]",
          "hover:text-[var(--content-presentation-action-hover)]",
          "focus:border focus:border-[var(--border-presentation-state-focus)]",
          "active:border active:border-[var(--border-presentation-state-focus)]",
        ],
        BlueSecStyle: [
          "bg-[var(--background-presentation-action-secondary)]",
          "text-[var(--content-presentation-action-light-primary)]",
          "hover:bg-[var(--background-presentation-state-information-primary)]",
          "hover:text-[var(--content-presentation-action-hover)]",
          "focus:border focus:border-[var(--border-presentation-state-focus)]",
          "active:border active:border-[var(--border-presentation-state-focus)]",
        ],
        YelSecStyle: [
          "bg-[var(--background-presentation-action-secondary)]",
          "text-[var(--content-presentation-action-light-primary)]",
          "hover:bg-[var(--background-presentation-state-warning-primary)]",
          "hover:text-[var(--content-presentation-action-light-primary)]",
          "focus:border focus:border-[var(--border-presentation-state-focus)]",
          "active:border active:border-[var(--border-presentation-state-focus)]",
        ],
        RedSecStyle: [
          "bg-[var(--background-presentation-action-secondary)]",
          "text-[var(--content-presentation-action-light-primary)]",
          "hover:bg-[var(--background-presentation-state-negative-primary)]",
          "hover:text-[var(--content-presentation-action-hover)]",
          "focus:border focus:border-[var(--border-presentation-state-focus)]",
          "active:border active:border-[var(--border-presentation-state-focus)]",
        ],
        BorderStyle: [
          "border border-[var(--border-presentation-action-disabled)]",
          "bg-[var(--background-presentation-action-borderstyle)]",
          "hover:bg-[var(--background-presentation-action-hover)]",
          "hover:text-[var(--content-presentation-action-hover)]",
          "focus:border focus:border-[var(--border-presentation-state-focus)]",
          "focus:text-[var(--content-presentation-action-light-primary)]",
          "focus:hover:text-[var(--content-presentation-action-hover)]",
          "active:border active:border-[var(--border-presentation-state-focus)]",
        ],
        PrimeContStyle: [
          "border-transparent bg-transparent",
          "hover:bg-[var(--background-presentation-action-contstyle-hover)]",
          "hover:text-[var(--content-presentation-action-light-primary)]",
          "focus:border focus:border-[var(--border-presentation-state-focus)]",
          "focus:bg-[var(--background-presentation-action-borderstyle)]",
          "active:border active:border-[var(--border-presentation-state-focus)]",
        ],
        BlueContStyle: [
          "border-transparent bg-transparent",
          "hover:bg-[var(--background-presentation-action-contstyle-hover)]",
          "hover:text-[var(--content-presentation-action-information-hover)]",
          "focus:border focus:border-[var(--border-presentation-state-focus)]",
          "focus:bg-[var(--background-presentation-action-borderstyle)]",
          "active:border active:border-[var(--border-presentation-state-focus)]",
        ],
        RedContStyle: [
          "border-transparent bg-transparent",
          "hover:bg-[var(--background-presentation-action-contstyle-hover)]",
          "hover:text-[var(--content-presentation-action-negative-hover)]",
          "focus:border focus:border-[var(--border-presentation-state-focus)]",
          "focus:bg-[var(--background-presentation-action-borderstyle)]",
          "active:border active:border-[var(--border-presentation-state-focus)]",
        ],
      },
      size: {
        S: "h-[22px] px-[6px] Body-typography-Small-Medium rounded-[4px]",
        M: "h-[26px] px-[8px] Body-typography-Medium-Medium rounded-[4px]",
        L: "h-[28px] px-[18px] Body-typography-Large-Medium rounded-[6px]",
      },
      is_loading: {
        true: "",
      },
      disabled: {
        true: ""
      },
      buttonType: {
        button: "",
        icon: "",
      }
    },
    defaultVariants: {
      size: "M",
      variant: "PrimeStyle",
      buttonType: "button"
    },
    compoundVariants: [
      {
        is_loading: true,
        className: ["cursor-wait",
          "bg-[--background-presentation-action-hover]",
          "text-[--content-presentation-action-hover]",
          "hover:bg-[--background-presentation-action-hover]",
          "hover:text-[--content-presentation-action-hover]",
          "focus:border focus:border-transparent",
          "active:border active:border-transparent",
        ]
      },
      {
        disabled: true,
        className:
          [
            "cursor-not-allowed",
            "pointer-events-none",
            "bg-[--background-presentation-action-disabled]",
            "text-[--content-presentation-state-disabled]",
            "border-[--border-presentation-state-disabled]"
          ],
      },
      {
        buttonType: "icon",
        size: "S",
        className: "w-[22px] h-[22px] p-0 leading-[0] "
      },
      {
        buttonType: "icon",
        size: "M",
        className: "w-[26px] h-[26px] p-0 leading-[0]"
      },
      {
        buttonType: "icon",
        size: "L",
        className: "w-[28px] h-[28px] p-0 leading-[0]"
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
  disabled,
  children,
  ...props
}: Props) {
  const Component = asChild ? Slot : Tag;


  // default 
  return (
    <Component
      {...props}
      className={cn(buttonVariants({
        variant,
        size,
        is_loading,
        buttonType,
        className,
        disabled
      }))}
    >
      {/* to prevent error when using asChild with loading state */}
      {asChild ?
        React.cloneElement(children as React.ReactElement, {},
          <>
            {(children as React.ReactElement).props.children}
            {is_loading && <LoadingIcon size={size} />}
          </>
        )
        :
        <>
          {children}
          {is_loading && <LoadingIcon size={size} />}
        </>
      }

    </Component>
  );
};


