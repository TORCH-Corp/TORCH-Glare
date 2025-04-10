"use client"

import * as React from "react"
import { cn } from "../utils/cn"

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical"
    decorative?: boolean
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
    (
        { className, orientation = "horizontal", decorative = true, ...props },
        ref
    ) => (
        <div
            ref={ref}
            role={decorative ? "none" : "separator"}
            aria-orientation={decorative ? undefined : orientation}
            className={cn(
                "bg-border-presentation-global-primary",
                orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
                className
            )}
            {...props}
        />
    )
)
Divider.displayName = "Divider"

export { Divider }
