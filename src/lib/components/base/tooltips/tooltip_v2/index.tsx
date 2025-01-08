import { cva } from "class-variance-authority";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import '../../../../styles/typography copy/index.scss';
export enum TooltipType {
    PRIMARY = "primary",
    SECONDARY = "secondary",
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

const tooltipStyles = cva("Body-typography-Medium-Regular rounded-[4px] px-2", {
    variants: {
        intent: {
            primary: "bg-[--black-600] text-[--content-system-global-primary] border-transparent",
            secondary: "bg-white text-gray-800 border-gray-400",
        },
        size: {
            small: "",
            medium: "",
        },
        disabled: {
            false: null,
            true: "opacity-50 cursor-not-allowed",
        },
    },
    compoundVariants: [
        {
            intent: "primary",
            disabled: false,
            class: "hover:bg-[--black-700]"
        },
        {
            intent: "secondary",
            disabled: false,
            class: "hover:bg-gray-100",
        },
        {
            intent: "primary",
            size: "medium",
            class: "uppercase",
        },
    ],
    defaultVariants: {
        intent: "primary",
        size: "medium",
        disabled: false,
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
    type?: TooltipType;
    size?: "small" | "medium";
    disabled?: boolean;
    text:ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({
    children,
    open,
    text,
    onOpenChange,
    type = TooltipType.PRIMARY,
    contentSide = ContentSide.TOP,
    contentAlign = ContentAlign.CENTER,
    avoidCollisions = true,
    delay = 100,
    tip = true,
    size = "medium",
    ...props
}) => {
    return (
        <RadixTooltip.Root
        delayDuration={delay}
        {...(typeof open !== 'undefined' && { open })}
        {...(onOpenChange && { onOpenChange })}
         >
            <RadixTooltip.Trigger aria-label="Open tooltip" asChild>
                <span className="text-blue-500 text-md">{children}</span>
            </RadixTooltip.Trigger>

            <RadixTooltip.Content
                sideOffset={10}
                side={contentSide}
                align={contentAlign}
                avoidCollisions={avoidCollisions}
                className={twMerge(tooltipStyles({ intent: type, size }))}
                {...props}
            >
                {text}
                {tip && <RadixTooltip.Arrow />}
            </RadixTooltip.Content>
        </RadixTooltip.Root>
    );
};

export default Tooltip;
