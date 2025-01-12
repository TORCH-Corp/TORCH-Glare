import React, { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";
import { Button } from "../button-v2";

const buttonVariants = cva(
    "",
    {
        variants: {
            size: {
                XS: "h-[18px] w-[18px] text-[12px]",
                S: "h-[22px] w-[22px] text-[12px]",
                M: "h-[32px] w-[32px] text-[18px]",
            }
        },
        defaultVariants: {
            size: "M",
        }
    }
);

interface Props
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    is_loading?: boolean;
    disabled?: boolean;
    asChild?: boolean;
    as?: React.ElementType;
}
export const ActionButton = function ({
    size,
    asChild,
    as: Tag = 'button',
    className,
    children,
    ...props
}: Props) {
    return (
        <Button
            asChild={asChild}
            buttonType="icon"
            className={cn(buttonVariants({
                size,
                className,
            }))}  {...props}
        >
            {children}
        </Button>
    );
};


