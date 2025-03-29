import { cva, VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import React from "react";


const TooltipProvider = TooltipPrimitive.Provider

const ToolTipRoot = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

const TooltipArrow = TooltipPrimitive.Arrow
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

const Tooltip: React.FC<TooltipProps> = ({
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
      <ToolTipRoot delayDuration={delay} {...(typeof open !== "undefined" && { open })} {...(onOpenChange && { onOpenChange })}>
        <TooltipTrigger aria-label="Open tooltip" asChild>
          {children}
        </TooltipTrigger>

        <TooltipContent
          data-theme={theme}
          sideOffset={2}
          side={toolTipSide}
          align={contentAlign}
          avoidCollisions={avoidCollisions}
          className={cn(tooltipStyles({ variant, className }))}
          {...props}
        >
          {text}
          {tip && <TooltipArrow className={cn("fill-background-system-body-tertiary", {
            "fill-wavy-navy-900": variant === "highlight"
          })} />}
        </TooltipContent>
      </ToolTipRoot>
    </TooltipProvider>
  );
};


export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipArrow, ToolTipRoot }
