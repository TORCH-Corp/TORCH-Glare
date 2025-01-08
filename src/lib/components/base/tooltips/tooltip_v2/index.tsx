import { cva } from "class-variance-authority";
import { ReactNode } from "react";
import { twMerge } from 'tailwind-merge'


export enum TooltipType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    SECONDARY = 'secondary',
}

export enum ContentSide {
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    LEFT = 'left',
}

export enum ContentAlign {
    START = 'start',
    CENTER = 'center',
    END = 'end',
}


const tooltip = cva(["font-semibold", "border", "rounded"], {
    variants: {
        intent: {
            primary: ["bg-blue-500", "text-white", "border-transparent"],
            // **or**
            // primary: "bg-blue-500 text-white border-transparent hover:bg-blue-600",
            secondary: ["bg-white", "text-gray-800", "border-gray-400"],
        },
        size: {
            small: ["text-sm", "py-1", "px-2"],
            medium: ["text-base", "py-2", "px-4"],
        },
        // `boolean` variants are also supported!
        disabled: {
            false: null,
            true: ["opacity-50", "cursor-not-allowed"],
        },
    },
    compoundVariants: [
        {
            intent: "primary",
            disabled: false,
            class: "hover:bg-blue-600",
        },
        {
            intent: "secondary",
            disabled: false,
            class: "hover:bg-gray-100",
        },
        {
            intent: "primary",
            size: "medium",
            // **or** if you're a React.js user, `className` may feel more consistent:
            // className: "uppercase"
            class: "uppercase",
        },
    ],
    defaultVariants: {
        intent: "primary",
        size: "medium",
        disabled: false,
    },
});


interface Props {
    text: ReactNode;
    children: ReactNode | ReactNode[];
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    contentSide?: ContentSide;
    contentAlign?: ContentAlign;
    avoidCollisions?: boolean;
    tip?: boolean;
    delay?: number;
    invertColors?: boolean;
    centerText?: boolean;
    type?: TooltipType;
}

const Tooltip: React.FC<any> = ({
    text,
    children,
    onOpenChange,
    open,
    type,
    contentSide = ContentSide.BOTTOM,
    contentAlign = ContentAlign.CENTER,
    avoidCollisions = true,
    delay = 400,
    tip = true,
    invertColors = true,
    centerText = true,
}) => {


    return (
        <span className={twMerge(tooltip({ intent: "primary", size: "medium", disabled: false }))} >
            {children}
        </span>
    )
};

export default Tooltip;
