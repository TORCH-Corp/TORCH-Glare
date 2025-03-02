import { cn } from '@/utils/cn';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react'
import { HTMLAttributes } from 'react';

const HeadingStyles = cva(" text-content-presentation-global-primary",
    {
        variants: {
            size: {
                h1: "typography-display-large-semibold",
                h2: "typography-display-medium-semibold",
                h3: "typography-display-small-semibold",
                h4: "typography-headers-large-semibold",
                h5: "typography-headers-medium-semibold",
                h6: "typography-headers-small-semibold",
            },

        },
        defaultVariants: {
            size: "h3",
        },
    });


interface Props
    extends HTMLAttributes<HTMLHeadingElement> {
    asChild?: boolean;
    as?: React.ElementType;
    theme?: "dark" | "light" | "default"
    size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}
export const Heading = ({
    asChild,
    as: Tag = "h1",
    theme,
    size = "h2",
    children,
    className,
    ...props
}: Props) => {

    const Component = asChild ? Slot : Tag;

    return (
        <Component
            {...props}
            data-theme={theme}
            className={cn(HeadingStyles({ size }),
                className, "typography-display-large-bold"
            )}
        >
            {children}
        </Component>

    )
}
