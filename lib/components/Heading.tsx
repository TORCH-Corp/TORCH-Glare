import { cn } from '@/utils/cn';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import React from 'react'
import { HTMLAttributes } from 'react';

const HeadingStyles = cva(" text-content-presentation-global-primary",
    {
        variants: {
            size: {
                h1: "typography-display-medium-medium",
                h2: "typography-display-large-medium",
                h3: "typography-display-medium-medium",
                h4: "typography-display-small-medium",
                h5: "typography-display-small-small",
                h6: "typography-labels-medium-medium",
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
    size = "h3",
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
                className
            )}
        >
            {children}
        </Component>

    )
}
