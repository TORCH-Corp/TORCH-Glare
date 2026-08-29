import React, { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "./Button";
import { cn } from "../utils/cn";
import { ButtonVariant, Themes } from "../utils/types";

/**
 * The button that sits at the end of an input field — Figma `ActionButton` (Type=DropDown).
 *
 * Sizes are Figma's exactly: Xs 18, S 22, M 32, with `radius/sm` on the two small ones and
 * `radius/lg` on M.
 *
 * The `!` on the radius is load-bearing. `twMerge` does not dedupe `rounded-radius-*` — they are
 * custom scale keys, not values it recognises — so this radius and the one coming from `Button`'s
 * own `size` variant both survive, and CSS source order picks the winner. Tailwind emits the scale
 * in config order (sm before md before lg), so without `!` size S would render Button M's 6px
 * instead of its own 4px.
 */
const buttonVariants = cva("", {
  variants: {
    size: {
      XS: "h-[18px] w-[18px] text-[12px] !rounded-radius-sm",
      S: "h-[22px] w-[22px] text-[12px] !rounded-radius-sm",
      M: "h-[32px] w-[32px] text-[18px] !rounded-radius-lg",
    },
  },
  defaultVariants: {
    size: "M",
  },
});

/**
 * Default/hover/disabled colours as Figma binds them. Applied only when the caller passes no
 * `variant`, so anything asking for a specific Button variant still gets it.
 *
 * `action-secondary` and `action-disabled` already match `Button`'s `PrimeStyle` equivalents; the
 * real difference is hover, where `PrimeStyle` uses `button-hover` and the design uses
 * `action-hover`.
 */
const actionTokens = [
  "bg-background-presentation-action-secondary",
  "text-content-presentation-action-light-primary",
  "hover:bg-background-presentation-action-hover",
  "hover:text-content-presentation-global-hover",
  "disabled:bg-background-presentation-action-disabled",
  "disabled:text-content-presentation-state-disabled",
];

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  is_loading?: boolean;
  disabled?: boolean;
  asChild?: boolean;
  as?: React.ElementType;
  theme?: Themes;
  variant?: ButtonVariant;
}
export const ActionButton = function ({
  size,
  asChild,
  as: Tag = "button",
  className,
  variant,
  type = "button",
  children,
  theme,
  ...props
}: Props) {
  return (
    <Button
      theme={theme}
      asChild={asChild}
      // Forwarded, not swallowed: the chevron inside a field renders `as="span"` because it is
      // nested in a clickable trigger, and a <button> cannot contain a <button>.
      as={Tag}
      buttonType="icon"
      // `type` is only meaningful on a real button; on a span it would be an invalid attribute.
      type={Tag === "button" ? type : undefined}
      size={size == "XS" ? "S" : size == "S" ? "M" : size == "M" ? "L" : "S"}
      variant={variant}
      className={cn(
        buttonVariants({
          size,
        }),
        !variant && actionTokens,
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
