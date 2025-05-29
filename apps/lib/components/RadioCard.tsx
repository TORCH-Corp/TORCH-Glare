import { forwardRef, ReactNode } from "react";
import { cn } from "../utils/cn";
import { Radio } from "./Radio";
import { Card, CardContent, CardDescription, CardHeader } from "./Card";


interface Props extends Omit<React.ComponentProps<typeof Radio>, "size" | "value"> {
  headerLabel?: ReactNode;
  id: string;
  description?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
  theme?: "dark" | "light" | "default";
  value: string;
}

export const RadioCard = forwardRef<HTMLInputElement, Props>(
  (
    { headerLabel, description, disabled, className, id, children, theme, value, ...props },
    ref
  ) => {
    return (
      <Card
        data-theme={theme}
        htmlFor={id}
        as="label"
        className={cn(
          "relative [&>button]:data-[state=checked]:!border-none",
          '[&:has(button[data-state="checked"])]:border-border-presentation-state-focus',
          // Disabled state
          disabled && "!bg-background-presentation-action-disabled",
          disabled && "cursor-not-allowed",
          disabled && "hover:border-border-presentation-global-primary",
          className
        )}
      >
        <section
          className={"absolute top-0 left-0 w-full p-[10px] flex justify-end"}
        >
          <Radio
            {...props}
            value={value}
            size="M"
            id={id}
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
      </Card>
    );
  }
);


RadioCard.displayName = "RadioCard"