import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/utils";

const buttonVariants = cva(
  "flex items-center justify-center  transition-[background,color] duration-200 ease-in-out border border-transparent outline-none [&-i]:!leading-0",
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
          "text-[var(--content-presentation-action-light-primary)]",
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
          "text-[var(--content-presentation-action-light-primary)]",
          "border-transparent bg-transparent",
          "hover:bg-[var(--background-presentation-action-contstyle-hover)]",
          "hover:text-[var(--content-presentation-action-light-primary)]",
          "focus:border focus:border-[var(--border-presentation-state-focus)]",
          "focus:bg-[var(--background-presentation-action-borderstyle)]",
          "active:border active:border-[var(--border-presentation-state-focus)]",
        ],
        BlueContStyle: [
          "text-[var(--content-presentation-action-light-primary)]",
          "border-transparent bg-transparent",
          "hover:bg-[var(--background-presentation-action-contstyle-hover)]",
          "hover:text-[var(--content-presentation-action-information-hover)]",
          "focus:border focus:border-[var(--border-presentation-state-focus)]",
          "focus:bg-[var(--background-presentation-action-borderstyle)]",
          "active:border active:border-[var(--border-presentation-state-focus)]",
        ],
        RedContStyle: [
          "text-[var(--content-presentation-action-light-primary)]",
          "border-transparent bg-transparent",
          "hover:bg-[var(--background-presentation-action-contstyle-hover)]",
          "hover:text-[var(--content-presentation-action-negative-hover)]",
          "focus:border focus:border-[var(--border-presentation-state-focus)]",
          "focus:bg-[var(--background-presentation-action-borderstyle)]",
          "active:border active:border-[var(--border-presentation-state-focus)]",
        ],
      },
      size: {
        S: "h-[22px] px-[6px] typography-body-small-medium rounded-[4px]",
        M: "h-[26px] px-[8px] typography-body-medium-medium rounded-[4px]",
        L: "h-[28px] px-[15px] typography-body-large-medium rounded-[6px]",
      },
      is_loading: {
        true: "",
      },
      disabled: {
        true: "",
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
          "bg-[--background-presentation-action-hover]",
          "text-[--content-presentation-action-hover]",
          "hover:bg-[--background-presentation-action-hover]",
          "hover:text-[--content-presentation-action-hover]",
          "focus:border focus:border-transparent",
          "active:border active:border-transparent",
        ],
      },
      {
        disabled: true,
        className: [
          "cursor-not-allowed",
          "pointer-events-none",
          "bg-[--background-presentation-action-disabled]",
          "text-[--content-presentation-state-disabled]",
          "border-[--border-presentation-state-disabled]",
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
        className: "w-[26px] h-[26px] p-0 leading-[0]",
      },
      {
        buttonType: "icon",
        size: "L",
        className: "w-[28px] h-[28px] p-0 leading-[0]",
      },
    ],
  }
);

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  is_loading?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  as?: React.ElementType;
  theme?: "dark" | "light" | "default"
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
      theme,
      children,
      ...props
    },
    ref
  ) => {
    const Component = asChild ? Slot : Tag;

    const wrapTextContent = (children: React.ReactNode) => {
      if (Array.isArray(children)) {
        return children.map((child, index) => {
          if (typeof child === "string" && child.trim() !== "") {
            return (
              <p key={index} className="px-[3px]">
                {child}
              </p>
            );
          }
          return child;
        });
      }

      if (children && typeof children === "string" && children.trim() !== "") {
        return <p className="px-[3px]">{children}</p>;
      }

      return children;
    };

    return (
      <Component
        {...props}
        data-theme={theme}
        ref={ref}
        className={cn(
          buttonVariants({
            variant,
            size,
            is_loading,
            buttonType,
            disabled,
          }),
          className
        )}
      >
        {asChild ? (
          React.cloneElement(
            children as React.ReactElement,
            {},
            <>
              {(children as React.ReactElement).props.children}
              {is_loading && <LoadingIcon size={size} />}
            </>
          )
        ) : (
          <>
            {wrapTextContent(children)}
            {is_loading && <LoadingIcon size={size} />}
          </>
        )}
      </Component>
    );
  }
);

Button.displayName = "Button"
interface IconProps {
  size?: "S" | "M" | "L" | null;
  className?: string;
}

export function LoadingIcon({ size, className }: IconProps) {
  const iconVariants = cva("animate-spin ", {
    variants: {
      size: {
        S: "w-[12px] h-[12px]",
        M: "w-[14px] h-[14px]",
        L: "w-[16px] h-[16px]",
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
