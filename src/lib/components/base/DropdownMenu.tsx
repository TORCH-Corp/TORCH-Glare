import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "./utils";

export const MenuItemStyles = cva(
  [
    "text-[--content-presentation-action-light-primary]",
    "outline-none",
    "border",
    "border-transparent",
    "flex",
    "gap-[8px]",
    "items-center",
    "justify-start",
    "text-overflow",
    "overflow-hidden",
    "px-[12px]",
    "rounded-[4px]",
    "transition-all",
    "ease-in-out",
    "duration-300",
  ],
  {
    variants: {
      variant: {
        Default: [
          "text-[--content-presentation-action-light-primary]",
          "bg-[--background-presentation-action-dropdown-primary]",
          "hover:bg-[--background-presentation-action-hover]",
          "hover:text-[--content-presentation-action-hover]",
          "focus:bg-[--background-presentation-action-selected]",
          "focus:text-[--content-presentation-action-light-primary]",
          "active:border-[--border-presentation-action-disabled]",
          "active:bg-[--background-presentation-action-selected]",
          "active:text-[--content-presentation-action-light-primary]",
          "active:border-[--border-presentation-action-disabled]",
          "disabled:text-[--content-presentation-state-disabled]",
          "disabled:bg-[--white-00]",
        ],
        Warning: [
          "bg-[--background-presentation-action-dropdown-primary]",
          "text-[--content-presentation-state-information]",
          "hover:bg-[--background-presentation-state-information-primary]",
          "hover:text-[--content-presentation-action-hover]",
        ],
        Negative: [
          "bg-[--background-presentation-action-dropdown-primary]",
          "text-[--content-presentation-state-negative]",
          "hover:bg-[--background-presentation-state-negative-primary]",
          "hover:!text-[--content-presentation-action-hover]",
          "focus:text-[--content-presentation-state-negative]",
          "active:text-[--content-presentation-state-negative]",
        ],
        SystemStyle: [
          "bg-[#131415]",
          "text-[#E5E5E5]",
          "hover:!bg-[#3E1E69]",
          "hover:!text-[#F9F9F9]",
          "hover:!border-[#9748FF]",
          "focus:bg-[#252729]",
          "focus:border-transparent",
          "active:border-transparent",
          "active:bg-[#252729]",
          "disabled:bg-[#1C1D1F]",
          "disabled:text-[#797C7F]",
        ],
      },
      size: {
        S: ["typography-body-small-regular", "h-[24px]"],
        M: ["typography-body-medium-regular", "h-[32px]"],
      },

      disabled: {
        true: [
          "text-[--content-presentation-state-disabled]",
          "bg-[--white-00]",
        ],
      },

      active: {
        true: [
          "bg-[--background-presentation-action-selected]",
          "text-[--content-presentation-action-light-primary]",
        ],
      },

      defaultVariants: {
        variant: "SystemStyle",
        size: "M",
        active: false,
        disabled: false,
      },
    },
    compoundVariants: [
      {
        disabled: true,
        variant: "SystemStyle",
        className: ["bg-[#1C1D1F]", "text-[#797C7F]"],
      },
      {
        active: true,
        variant: "SystemStyle",
        className: ["bg-[#252729]", "text-[#F9F9F9]", "border-transparent"],
      },
      {
        active: true,
        variant: "Warning",
        className: ["text-[--content-presentation-state-negative]"],
      },
    ],
  }
);
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
