import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "./utils";
import { cva, VariantProps } from "class-variance-authority";
import { Circle } from "lucide-react";

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

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  } & VariantProps<typeof MenuItemStyles>
>(
  (
    {
      className,
      inset,
      variant = "Default",
      size = "M",
      disabled,
      active,
      ...props
    },
    ref
  ) => (
    <DropdownMenuPrimitive.Item
      {...props}
      ref={ref}
      className={cn(
        MenuItemStyles({ variant, size, disabled, active }),
        className
      )}
    />
  )
);
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> &
  VariantProps<typeof MenuItemStyles>
>(
  (
    {
      className,
      children,
      checked,
      variant = "Default",
      size = "M",
      disabled,
      ...props
    },
    ref
  ) => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        MenuItemStyles({ variant, size, disabled }),
        "relative pl-8",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <i className="ri-radio-button-fill text-white text-[16px]"></i>
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
);
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> &
  VariantProps<typeof MenuItemStyles>
>(
  (
    {
      className,
      children,
      variant = "Default",
      size = "M",
      disabled,
      ...props
    },
    ref
  ) => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        MenuItemStyles({ variant, size, disabled }),
        "relative pl-8",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
);
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "text-[--content-presentation-state-disabled] typography-body-medium-regular px-[12px] h-[32px] flex justify-start items-center",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn(
      "mx-[8px] my-[4px] border-b border-b-[rgba(255, 255, 255, 0.00)] flex-1",
      className
    )}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuItem,
};
