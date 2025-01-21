import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/utils";
import { MenuItemStyles } from "../menuItem";

export const dropdownMenuStyles = cva(
  [
    "p-1",
    "rounded-[8px]",
    "border",
    "max-h-[200px]",
    "min-w-[240px]",
    "outline-none",
    "overflow-scroll",
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0",
    "data-[state=open]:fade-in-0",
    "scrollbar-hide",
  ],
  {
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
        ],
      },
      defaultVariants: {
        variant: "SystemStyle",
      },
    },
  }
);

interface DropdownMenuProps {
  variant?: "SystemStyle" | "PresentationStyle";
  className?: string;
}

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> &
    DropdownMenuProps
>(
  (
    { className, sideOffset = 4, variant = "PresentationStyle", ...props },
    ref
  ) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(dropdownMenuStyles({ variant }), className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
);
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  } & VariantProps<typeof MenuItemStyles>
>(
  (
    {
      className,
      inset,
      children,
      variant = "Default",
      size = "M",
      disabled,
      ...props
    },
    ref
  ) => (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        MenuItemStyles({ variant, size, disabled }),
        "justify-between",
        className
      )}
      {...props}
    >
      {children}
      <i className="ri-arrow-right-s-line text-[16px]"></i>
    </DropdownMenuPrimitive.SubTrigger>
  )
);
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> & {
    variant?: "SystemStyle" | "PresentationStyle";
  }
>(({ className, variant = "PresentationStyle", ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(dropdownMenuStyles({ variant }), className)}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSubTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuSubContent,
};
