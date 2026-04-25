import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../utils/cn";
import { ButtonVariant, Themes } from "../utils/types";

interface Props
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  is_loading?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  variant?: ButtonVariant;
  as?: React.ElementType;
  theme?: Themes;
  containerClassName?: string;
}
export const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      is_loading = false,
      variant,
      size,
      asChild,
      as: Tag = "button",
      buttonType,
      className,
      disabled,
      type = "button",
      theme,
      children,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    const Component = asChild ? Slot : Tag;

    return (
      <Component
        {...props}
        data-theme={theme}
        disabled={disabled || is_loading}
        ref={ref}
        type={type}
        className={cn(
          buttonVariants({
            variant,
            size,
            is_loading,
            buttonType,
            disabled,
          }),
          className,
        )}
      >
        {asChild ? (
          React.cloneElement(
            children as React.ReactElement,
            {},
            <div
              className={cn(
                "px-[3px] flex items-center justify-center bg-background-presentation-action-borderstyle gap-[3px] has-[>i]:p-0",
                containerClassName,
              )}
            >
              {(children as React.ReactElement<any>).props.children}
              {is_loading && <LoadingIcon size={size} />}
            </div>,
          )
        ) : (
          <div
            className={cn(
              "px-[3px] flex items-center justify-center gap-[3px] has-[>i]:p-0",
              containerClassName,
            )}
          >
            {children}
            {is_loading && <LoadingIcon size={size} />}
          </div>
        )}
      </Component>
    );
  },
);

Button.displayName = "Button";

export function LoadingIcon({
  size,
  className,
}: {
  size?: "S" | "M" | "L" | "XL" | null;
  className?: string;
}) {
  const iconVariants = cva("animate-spin ", {
    variants: {
      size: {
        S: "w-[12px] h-[12px]",
        M: "w-[18px] h-[18px]",
        L: "w-[20px] h-[20px]",
        XL: "w-[20px] h-[20px]",
      },
    },
    defaultVariants: {
      size: "M",
    },
  });

  return (
    <svg
      className={cn(iconVariants({ size, className }))}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 6C11 8.76142 8.76142 11 6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6ZM2.25 6C2.25 8.07107 3.92893 9.75 6 9.75C8.07107 9.75 9.75 8.07107 9.75 6C9.75 3.92893 8.07107 2.25 6 2.25C3.92893 2.25 2.25 3.92893 2.25 6Z"
        fill="#F4F4F4"
      />
      <path
        d="M11 6C11 5.34339 10.8707 4.69321 10.6194 4.08658C10.3681 3.47995 9.99983 2.92876 9.53553 2.46447C9.07124 2.00017 8.52004 1.63188 7.91342 1.3806C7.30679 1.12933 6.65661 1 6 1V2.25C6.49246 2.25 6.98009 2.347 7.43506 2.53545C7.89003 2.72391 8.30343 3.00013 8.65165 3.34835C8.99987 3.69657 9.27609 4.10997 9.46455 4.56494C9.653 5.01991 9.75 5.50754 9.75 6H11Z"
        fill="#0075FF"
      />
    </svg>
  );
}

export const buttonVariants = cva(
  "flex items-center whitespace-nowrap justify-center  transition-[background,color] duration-200 ease-in-out border border-transparent outline-none leading-none [&-i]:!leading-none",
  {
    variants: {
      variant: {
        // Sec variants: base = button-secondary, hover picks up fill color
        PrimeStyle: [
          "bg-background-presentation-button-secondary",
          "text-content-presentation-action-light-primary",
          "hover:bg-background-presentation-button-hover",
          "hover:text-content-presentation-global-hover",
          "focus:lg:focus:md:border lg:focus:md:border-border-presentation-state-focus",
          "active:bg-background-presentation-button-hover active:text-content-presentation-global-hover",
        ],
        BluSecStyle: [
          "bg-background-presentation-button-secondary",
          "text-content-presentation-action-light-primary",
          "hover:bg-background-presentation-button-fill-blue-primary",
          "hover:text-content-presentation-global-hover",
          "focus:lg:border focus:lg:border-border-presentation-state-focus",
          "active:bg-background-presentation-button-fill-blue-primary active:text-content-presentation-global-hover",
        ],
        YelSecStyle: [
          "bg-background-presentation-button-secondary",
          "text-content-presentation-action-light-primary",
          "hover:bg-background-presentation-button-fill-yellow-primary",
          "hover:text-content-presentation-action-light-primary",
          "focus:lg:border focus:lg:border-border-presentation-state-focus",
          "active:bg-background-presentation-button-fill-yellow-primary active:text-content-presentation-action-light-primary",
        ],
        RedSecStyle: [
          "bg-background-presentation-button-secondary",
          "text-content-presentation-action-light-primary",
          "hover:bg-background-presentation-button-fill-red-primary",
          "hover:text-content-presentation-global-hover",
          "focus:lg:border focus:lg:border-border-presentation-state-focus",
          "active:bg-background-presentation-button-fill-red-primary active:text-content-presentation-global-hover",
        ],
        BorderStyle: [
          "text-content-presentation-action-light-primary",
          "border border-border-presentation-action-disabled",
          "bg-background-presentation-button-borderstyle",
          "hover:bg-background-presentation-button-hover",
          "hover:text-content-presentation-global-hover",
          "focus:lg:border focus:lg:border-border-presentation-state-focus",
          "focus:lg:text-content-presentation-action-light-primary",
          "focus:hover:lg:text-content-presentation-global-hover",
          "active:bg-background-presentation-button-hover active:text-content-presentation-global-hover",
        ],
        // Cont variants: transparent base, hover shows button-contstyle-hover
        PrimeContStyle: [
          "text-content-presentation-action-light-primary",
          "border-transparent bg-transparent",
          "hover:bg-background-presentation-button-contstyle-hover",
          "hover:text-content-presentation-action-light-primary",
          "focus:lg:border focus:lg:border-border-presentation-state-focus",
          "focus:lg:bg-background-presentation-button-borderstyle",
          "active:bg-background-presentation-button-contstyle-hover active:text-content-presentation-action-light-primary",
        ],
        BluContStyle: [
          "text-content-presentation-action-light-primary",
          "border-transparent bg-transparent",
          "hover:bg-background-presentation-button-contstyle-hover",
          "hover:text-content-presentation-global-information-hover",
          "focus:lg:border focus:lg:border-border-presentation-state-focus",
          "focus:lg:bg-background-presentation-button-borderstyle",
          "active:bg-background-presentation-button-contstyle-hover active:text-content-presentation-global-information-hover",
        ],
        RedContStyle: [
          "text-content-presentation-action-light-primary",
          "border-transparent bg-transparent",
          "hover:bg-background-presentation-button-contstyle-hover",
          "hover:text-content-presentation-global-negative-hover",
          "focus:lg:border focus:lg:border-border-presentation-state-focus",
          "focus:lg:bg-background-presentation-button-borderstyle",
          "active:bg-background-presentation-button-contstyle-hover active:text-content-presentation-global-negative-hover",
        ],
        // Col variants: filled solid color base + always-white text, hover deepens to -secondary
        PrimeColStyle: [
          "bg-background-presentation-button-primary",
          "text-content-presentation-action-dark-primary",
          "hover:bg-background-presentation-button-hover",
          "hover:text-content-presentation-action-dark-primary",
          "focus:lg:border focus:lg:border-border-presentation-state-focus",
          "active:bg-background-presentation-button-hover active:text-content-presentation-action-dark-primary",
        ],
        BluColStyle: [
          "bg-background-presentation-button-fill-blue-primary",
          "text-content-presentation-action-dark-primary",
          "hover:bg-background-presentation-button-fill-blue-secondary",
          "hover:text-content-presentation-action-dark-primary",
          "focus:lg:border focus:lg:border-border-presentation-state-focus",
          "active:bg-background-presentation-button-fill-blue-secondary active:text-content-presentation-action-dark-primary",
        ],
        RedColStyle: [
          "bg-background-presentation-button-fill-red-primary",
          "text-content-presentation-action-dark-primary",
          "hover:bg-background-presentation-button-fill-red-secondary",
          "hover:text-content-presentation-action-dark-primary",
          "focus:lg:border focus:lg:border-border-presentation-state-focus",
          "active:bg-background-presentation-button-fill-red-secondary active:text-content-presentation-action-dark-primary",
        ],
        GreenColStyle: [
          "bg-background-presentation-button-fill-green-primary",
          "text-content-presentation-action-dark-primary",
          "hover:bg-background-presentation-button-fill-green-secondary",
          "hover:text-content-presentation-action-dark-primary",
          "focus:lg:border focus:lg:border-border-presentation-state-focus",
          "active:bg-background-presentation-button-fill-green-secondary active:text-content-presentation-action-dark-primary",
        ],
        YelColStyle: [
          "bg-background-presentation-button-fill-yellow-primary",
          "text-content-presentation-global-primary",
          "hover:bg-background-presentation-button-fill-yellow-secondary",
          "hover:text-content-presentation-global-primary",
          "focus:lg:border focus:lg:border-border-presentation-state-focus",
          "active:bg-background-presentation-button-fill-yellow-secondary active:text-content-presentation-global-primary",
        ],
      },
      size: {
        S: "h-[22px] px-[6px] typography-body-small-medium rounded-[4px] [&_i]:text-[12px]",
        M: "h-[28px] px-[14px] typography-body-large-medium rounded-[6px] [&_i]:text-[18px]",
        L: "h-[34px] px-[22px] typography-body-large-medium rounded-[8px] [&_i]:text-[20px]",
        XL: "h-[40px] px-[30px] typography-headers-medium-medium rounded-[8px] [&_i]:text-[22px]",
      },
      is_loading: {
        true: "[&_i]:hidden",
      },
      disabled: {
        true: "cursor-not-allowed",
      },
      buttonType: {
        button: "",
        icon: "",
      },
    },
    defaultVariants: {
      size: "M",
      variant: "PrimeStyle",
      buttonType: "button",
    },
    compoundVariants: [
      {
        is_loading: true,
        className: [
          "cursor-wait",
          "bg-background-presentation-button-hover",
          "text-content-presentation-global-hover",
          "hover:bg-background-presentation-button-hover",
          "hover:text-content-presentation-global-hover",
          "focus:lg:border focus:lg:border-transparent",
          "active:bg-background-presentation-button-hover active:text-content-presentation-global-hover",
        ],
      },
      {
        disabled: true,
        className: [
          "cursor-not-allowed",
          "pointer-events-none",
          "bg-background-presentation-button-disabled",
          "text-content-presentation-state-disabled",
          "border-transparent",
        ],
      },
      {
        buttonType: "icon",
        size: "S",
        className: "w-[22px] h-[22px] p-0 leading-[0]",
      },
      {
        buttonType: "icon",
        size: "M",
        className: "w-[28px] h-[28px] p-0 leading-[0]",
      },
      {
        buttonType: "icon",
        size: "L",
        className: "w-[34px] h-[34px] p-0 leading-[0]",
      },
      {
        buttonType: "icon",
        size: "XL",
        className: "w-[40px] h-[40px] p-0 leading-[0]",
      },
    ],
  },
);
