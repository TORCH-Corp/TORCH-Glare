import { cn } from '@/utils/cn';
import React, { HTMLAttributes } from 'react'
import { Slot } from "@radix-ui/react-slot";


interface Props extends Omit<HTMLAttributes<HTMLDivElement | HTMLHeadingElement | HTMLParagraphElement | HTMLLabelElement>, 'htmlFor'> {
    as?: React.ElementType;
    asChild?: boolean;
    htmlFor?: string;
}
export const Card = ({ className, htmlFor, asChild, as: Tag = "section", ...props }: Props) => {
    const Component = asChild ? Slot : Tag;
    return (
        <Component htmlFor={htmlFor} {...props} className={cn(
            "flex flex-col justify-start",
            "gap-2 rounded-[12px] border",
            "transition-all ease-in-out duration-200",
            "p-[16px]",
            "border-border-presentation-global-primary",
            "bg-background-presentation-form-radiocard-base",
            "hover:border-border-presentation-state-focus",
            className
        )} />
    )
}



interface GeneralProps extends HTMLAttributes<HTMLHeadingElement> { }

export const CardHeader = ({ className, ...props }: GeneralProps) => {
    return (
        <h1
            {...props}
            className={cn(
                "text-content-presentation-global-primary m-0 typography-headers-medium-semibold",
                className
            )}
        >
        </h1>
    )
}

export const CardDescription = ({ className, ...props }: GeneralProps) => {
    return (
        <article
            {...props}
            className={cn(
                "text-content-presentation-global-primary m-0 typography-body-medium-semibold",
                className
            )}
        >
        </article>
    )
}

export const CardContent = ({ className, ...props }: GeneralProps) => {
    return (
        <section {...props} className={cn("flex gap-1 flex-col items-start flex-1", className)}>
        </section>
    )
}

