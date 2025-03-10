import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cva } from "class-variance-authority";
import { RadioLabel } from "./RadioLabel";
import { cn } from "../utils/cn";

export const glareRadioCard = cva(
  [
    "flex",
    "flex-col",
    "justify-start",
    "flex-1",
    "gap-2",
    "rounded-[12px]",
    "border",
    "transition-all",
    "ease-in-out",
    "duration-200",
    "relative",
    "p-[16px]",
    "border-border-presentation-global-primary",
    "bg-background-presentation-form-radiocard-base",
    "hover:border-border-presentation-state-focus",
  ],
  {
    variants: {
      checked: {
        true: ""
      },
      disabled: {
        true: [
          "border-border-presentation-global-primary",
          "!bg-background-presentation-action-disabled",
          "cursor-not-allowed",
          "hover:border-border-presentation-global-primary",
        ],
      },
    },
    compoundVariants: [
      {
        checked: true,
        className: [
          "border-border-presentation-global-primary",
          "hover:border-border-presentation-global-primary",
        ],
      }
    ]
  }
);

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  headerLabel?: ReactNode;
  id: string;
  description?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  theme?: "dark" | "light" | "default";
}

export const RadioCard = forwardRef<HTMLInputElement, Props>(
  (
    { headerLabel, description, disabled, className, id, children, theme, ...props },
    ref
  ) => {
    return (
      <label
        data-theme={theme}
        htmlFor={id}
        className={cn(
          glareRadioCard({
            className,
            disabled,
            checked: props.checked
          })
        )}
      >
        <section
          className={"absolute top-0 left-0 w-full p-[10px] flex justify-end"}
        >
          <RadioLabel
            {...props}
            theme={theme}
            size="M"
            ref={ref}
            id={id}
            checked={props.checked}
            disabled={disabled}
          />
        </section>

        <h1
          className={
            "text-content-presentation-global-primary m-0 typography-headers-medium-semibold"
          }
        >
          {headerLabel}
        </h1>

        <section className={"flex gap-1 flex-col items-start"}>
          {description && (
            <p
              className={
                "text-content-presentation-global-primary m-0 typography-body-medium-semibold"
              }
            >
              {description}
            </p>
          )}
          {children}
        </section>
      </label>
    );
  }
);


RadioCard.displayName = "RadioCard"