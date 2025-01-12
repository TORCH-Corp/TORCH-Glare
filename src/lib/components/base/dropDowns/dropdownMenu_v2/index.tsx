import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import '@styles/globals.css'

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

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

interface DropdownMenuProps extends VariantProps<typeof dropdownMenuStyles> {
    variant?: "SystemStyle" | "PresentationStyle";
}

const DropdownMenu = PopoverPrimitive.Root

const DropdownMenuTrigger = PopoverPrimitive.Trigger

const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & Pick<DropdownMenuProps, 'variant'>
>(({ className, align = "center", sideOffset = 4, variant, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(dropdownMenuStyles({ variant: variant }),
                className
            )}

            {...props}
        />
    </PopoverPrimitive.Portal>
))
DropdownMenuContent.displayName = "DropdownMenuContent"

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent }
