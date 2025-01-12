import '@styles/globals.css'
import { cva, type VariantProps } from "class-variance-authority"
import { DropdownMenu, DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { cn } from '@/utils';

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
    className?: string
    children?: React.ReactNode
}

export function DropDownMenu({ variant, className, children, ...props }: DropdownMenuProps) {
    return (
        <DropdownMenu   >
            <DropdownMenuContent className={cn(dropdownMenuStyles({ variant }), className)} {...props}>
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
