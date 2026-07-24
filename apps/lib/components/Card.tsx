import { cn } from "../utils/cn";
import React, { HTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

export const cardStyles = cva(
  [
    "flex flex-col justify-start",
    "gap-2 rounded-[12px] border",
    "transition-all ease-in-out duration-200",
    "p-[16px]",
    "border-border-presentation-global-primary",
    "bg-background-presentation-form-radiocard-base",
    "focus:border-border-presentation-state-focus",
  ],
  {
    variants: {
      variant: {
        /** Static container — no hover affordance. */
        default: [],
        /** Interactive card (a link/label/button surface) — highlights on hover. */
        clickable: ["cursor-pointer", "hover:border-border-presentation-state-focus"],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface Props
  extends
    Omit<
      HTMLAttributes<HTMLDivElement | HTMLHeadingElement | HTMLParagraphElement | HTMLLabelElement>,
      "htmlFor"
    >,
    VariantProps<typeof cardStyles> {
  as?: React.ElementType;
  asChild?: boolean;
  htmlFor?: string;
}

/**
 * A surface container. Defaults to a **static** card; pass `variant="clickable"` when the whole
 * card is an interactive target so it gets the hover highlight + pointer cursor.
 */
export const Card = ({
  className,
  htmlFor,
  asChild,
  variant,
  as: Tag = "section",
  ...props
}: Props) => {
  const Component = asChild ? Slot : Tag;
  return (
    <Component htmlFor={htmlFor} {...props} className={cn(cardStyles({ variant }), className)} />
  );
};

interface GeneralProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardHeader = ({ className, ...props }: GeneralProps) => {
  return (
    <div
      {...props}
      className={cn(
        "text-content-presentation-global-primary m-0 typography-headers-medium-semibold",
        className,
      )}
    ></div>
  );
};

export const CardDescription = ({ className, ...props }: GeneralProps) => {
  return (
    <div
      {...props}
      className={cn(
        "text-content-presentation-global-primary m-0 typography-body-medium-semibold",
        className,
      )}
    ></div>
  );
};

export const CardContent = ({ className, ...props }: GeneralProps) => {
  return (
    <section
      {...props}
      className={cn("flex gap-1 flex-col items-start flex-1", className)}
    ></section>
  );
};
