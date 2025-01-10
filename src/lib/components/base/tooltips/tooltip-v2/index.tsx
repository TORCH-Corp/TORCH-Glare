import { cva, VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import '@/styles/typography_2/index.scss';
import { cn } from "@/utils";

export enum ContentSide {
    TOP = "top",
    RIGHT = "right",
    BOTTOM = "bottom",
    LEFT = "left",
}

export enum ContentAlign {
    START = "start",
    CENTER = "center",
    END = "end",
}

const tooltipStyles = cva("Body-typography-Medium-Regular rounded-[4px] p-1", {
    variants: {
        variant: {
            primary: "bg-[--background-system-body-tertiary] text-[--content-system-global-primary]",
        }
    },
    defaultVariants: {
        variant: "primary",
    },
});

interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof tooltipStyles> {
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    contentSide?: ContentSide;
    contentAlign?: ContentAlign;
    avoidCollisions?: boolean;
    tip?: boolean;
    delay?: number;
    disabled?: boolean;
    text: ReactNode
}

export const Tooltip: React.FC<TooltipProps> = ({
    children,
    open,
    text,
    onOpenChange,
    contentSide = ContentSide.TOP,
    contentAlign = ContentAlign.CENTER,
    avoidCollisions = true,
    delay = 400,
    tip = true,
    variant,
    ...props
}) => {
    return (
        <RadixTooltip.Root
            delayDuration={delay}
            {...(typeof open !== 'undefined' && { open })}
            {...(onOpenChange && { onOpenChange })}
        >
            <RadixTooltip.Trigger aria-label="Open tooltip" asChild >
                {children}
            </RadixTooltip.Trigger>

            <RadixTooltip.Content
                side={contentSide}
                align={contentAlign}
                avoidCollisions={avoidCollisions}
                className={cn(tooltipStyles({ variant }))}
                {...props}
            >
                {text}
                {tip && <RadixTooltip.Arrow className="fill-[--background-system-body-tertiary]" />}
            </RadixTooltip.Content>
        </RadixTooltip.Root>
    );
};


