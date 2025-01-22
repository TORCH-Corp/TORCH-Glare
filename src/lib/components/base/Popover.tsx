import { VariantProps } from "class-variance-authority";
import { cn } from "./utils";
import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { dropdownMenuStyles } from "./DropdownMenu";

interface LocalPopOverProps extends VariantProps<typeof dropdownMenuStyles> {
  variant?: "SystemStyle" | "PresentationStyle";
  className?: string;
}

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
  LocalPopOverProps
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      variant = "SystemStyle",
      ...props
    },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(dropdownMenuStyles({ variant }), className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
