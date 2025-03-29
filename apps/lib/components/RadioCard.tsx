import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";
import { Radio } from "./Radio";
import { Card, CardContent, CardDescription, CardHeader } from "./Card";


interface Props extends InputHTMLAttributes<HTMLInputElement> {
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
      <Card
        data-theme={theme}
        asChild
        className={cn(
          "relative border-border-presentation-global-primary group",
          // Disabled state
          disabled && "!bg-background-presentation-action-disabled",
          disabled && "cursor-not-allowed",
          disabled && "hover:border-border-presentation-global-primary",
          // Checked state
          props.checked && "border-border-presentation-global-primary",
          props.checked && "hover:border-border-presentation-global-primary"
        )}
      >
        <label htmlFor={id}
        >
          <section
            className={"absolute top-0 left-0 w-full p-[10px] flex justify-end"}
          >
            <Radio
              {...props}
              theme={theme}
              radioClassName="group-hover:border-border-presentation-state-focus"
              size="M"
              ref={ref}
              id={id}
              checked={props.checked}
              disabled={disabled}
            />
          </section>

          <CardHeader >
            {headerLabel}
          </CardHeader>

          <CardContent >
            {description && (
              <CardDescription >
                {description}
              </CardDescription>
            )}
            {children}
          </CardContent>
        </label >
      </Card>
    );
  }
);


RadioCard.displayName = "RadioCard"