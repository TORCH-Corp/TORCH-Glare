import { cva } from "class-variance-authority";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import '../../../../styles/typography_2/index.scss';


export enum TooltipType {
    PRIMARY = "primary",
}

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
        intent: {
            primary: "bg-[--background-system-body-tertiary] text-[--content-system-global-primary]",
        }
    },
    compoundVariants: [
        {
            intent: "primary",
            class: ""
        }
    ],
    defaultVariants: {
        intent: "primary",
    },
});

interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    contentSide?: ContentSide;
    contentAlign?: ContentAlign;
    avoidCollisions?: boolean;
    tip?: boolean;
    delay?: number;
    type?: TooltipType; disabled?: boolean;
    text: ReactNode
}

export const Tooltip: React.FC<TooltipProps> = ({
    children,
    open,
    text,
    onOpenChange,
    type = TooltipType.PRIMARY,
    contentSide = ContentSide.TOP,
    contentAlign = ContentAlign.CENTER,
    avoidCollisions = true,
    delay = 400,
    tip = true,
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
                className={twMerge(tooltipStyles({ intent: type }))}
                {...props}
            >
                {text}
                {tip && <RadixTooltip.Arrow className="fill-[--background-system-body-tertiary]" />}
            </RadixTooltip.Content>
        </RadixTooltip.Root>
    );
};


