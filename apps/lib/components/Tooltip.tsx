import { cva, VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

export type ToolTipSide = "top" | "right" | "bottom" | "left";

export enum ContentAlign {
  START = "start",
  CENTER = "center",
  END = "end",
}

const tooltipStyles = cva("typography-body-medium-regular rounded-[4px] p-1", {
  variants: {
    variant: {
      primary: "bg-background-system-body-tertiary text-content-system-global-primary",
      highlight: "bg-gradient-to-r from-wavy-navy-900 to-wavy-navy-800 text-white"
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface TooltipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof tooltipStyles> {
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  toolTipSide?: ToolTipSide;
  contentAlign?: ContentAlign;
  avoidCollisions?: boolean;
  tip?: boolean;
  delay?: number;
  disabled?: boolean;
  text: ReactNode;
  theme?: Themes
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  open,
  text,
  theme = "dark",
  onOpenChange,
  toolTipSide,
  contentAlign = ContentAlign.CENTER,
  avoidCollisions = true,
  delay = 400,
  tip = true,
  variant,
  className,
  ...props
}) => {
  return (
    <TooltipProvider>
      <RadixTooltip.Root
        delayDuration={delay}
        {...(typeof open !== "undefined" && { open })}
        {...(onOpenChange && { onOpenChange })}
      >
        <RadixTooltip.Trigger aria-label="Open tooltip" asChild>
          {children}
        </RadixTooltip.Trigger>

        <RadixTooltip.Content
          data-theme={theme}
          sideOffset={2}
          side={toolTipSide}
          align={contentAlign}
          avoidCollisions={avoidCollisions}
          className={cn(tooltipStyles({ variant }), className)}
          {...props}
        >
          {text}
          {tip && <RadixTooltip.Arrow className={cn("fill-background-system-body-tertiary", {
            "fill-wavy-navy-900": variant === "highlight"
          })} />}
        </RadixTooltip.Content>
      </RadixTooltip.Root>
    </TooltipProvider>
  );
};
