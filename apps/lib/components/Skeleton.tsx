import { cn } from "../utils/cn"

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-border-presentation-global-primary", className)}
            {...props}
        />
    )
}

export { Skeleton }
