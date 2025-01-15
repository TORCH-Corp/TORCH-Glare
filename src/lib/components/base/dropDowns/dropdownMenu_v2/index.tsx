import { cva } from "class-variance-authority";
import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from "@/lib/utils"


const dropdownMenuStyles = cva([
    "p-1",
    "rounded-[8px]",
    "border",
    "max-h-[200px]",
    "min-w-[150px]",
    "flex",
    "flex-col",
    "gap-[2px]",
    "overflow-scroll",
    "outline-none",
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0",
    "data-[state=open]:fade-in-0",
    "scrollbar-hide",
    "z-50",
], {
    variants: {
        variant: {
            SystemStyle: [
                "border-[--border-system-global-secondary]",
                "bg-[--background-system-body-primary]",
                "shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)]",
            ],
            PresentationStyle: [
                "border-[--border-presentation-global-primary]",
                "bg-[--background-presentation-form-base]",
                "shadow-[0px_0px_10px_0px_rgba(0,0,0,0.4),0px_4px_4px_0px_rgba(0,0,0,0.2)]",
            ]
        },
        defaultVariants: {
            variant: "SystemStyle",
        }
    }
})

interface DropdownMenuProps {
    variant?: "SystemStyle" | "PresentationStyle";
    className?: string
}

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & DropdownMenuProps
>(({ className, sideOffset = 4, variant = "SystemStyle", ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(dropdownMenuStyles({ variant }), className)}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName



export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
}
