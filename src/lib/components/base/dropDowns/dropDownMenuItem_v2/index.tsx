import React from 'react';
import { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react';
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { cn } from '@/utils';


interface Props extends ButtonHTMLAttributes<HTMLButtonElement | HTMLInputElement> {
    component_size?: 'M'; // this props will change the button style size see on figma design file
    component_label: string;
    element_name: string; // this will be the name of the input and this is important to link the input with the label
    required_label?: string;
    secondary_label?: string;
    right_side_icon?: ReactNode; // this will show the right side icon
    onRightSideIconClick?: MouseEventHandler; // this will be the click event of the right side icon if you pass right side icon
    component_style?: "Presentation-Warning-Style" | "Presentation-Negative-Style" | "System-Style"; // this props will change the button style see on figma design file
    icon?: ReactNode; // this will show the default icon if you pass it
    component_type?: "checkbox" | "radio";
    isChecked?: boolean // this will check the input if you select component type radio or checkbox
}

export const DropdownMenuItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
        inset?: boolean
    }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
            inset && "pl-8",
            className
        )}
        {...props}
    />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName