"use client";
import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "./utils";
import { dropdownMenuStyles } from "./DropdownMenu";
import { cva, VariantProps } from "class-variance-authority";
import { Button } from "./Button";

// NOTE: radix select as DropDownButton

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
          "bg-[--background-system-body-primary]",
          "text-[--content-system-global-primary]",
          "hover:!bg-[--background-system-action-secondary-hover]",
          "hover:!text-[--content-system-action-primary-hover]",
          "hover:!border-[--border-system-action-primary-hover]",
          "focus:bg-[--background-System-Action-Primary-Selected]",
          "focus:border-transparent",
          "active:border-transparent",
          "active:bg-[--background-System-Action-Primary-Selected]",
          "disabled:bg-[--background-system-body-secondary]",
          "disabled:text-[--content-system-global-disabled]",
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
        active: true,
        variant: "Warning",
        className: ["text-[--content-presentation-state-negative]"],
      },
    ],
  }
);

export const dropdownButtonStyles = cva(
  [
    "flex flex-row rounded-[4px] justify-between items-center outline-none border-none",
    "rounded-[4px]",
    "text-[--content-presentation-action-light-primary]",
    "typography-body-small-regular",
    "[&_p]:px-[10px]",
    "group",
    "w-fit",
    "border",
    "bg-[--background-presentation-form-field-primary]",
    "transition-all duration-200 ease-in-out",
    "hover:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
    "hover:bg-[--background-presentation-form-field-hover]",
  ],
  {
    variants: {
      size: {
        S: [
          "[&_button]:h-[22px] [&_button]:w-[22px] [&_p]:typography-body-small-medium",
        ],
        M: [
          "[&_button]:h-[26px] [&_button]:w-[26px] [&_p]:typography-body-medium-medium",
        ],
        L: [
          "[&_button]:h-[28px] [&_button]:w-[28px] [&_p]:typography-body-large-medium",
        ],
      },
    },
    defaultVariants: {
      size: "M",
    },
  }
);

const DropDownButton = SelectPrimitive.Root;

const DropDownButtonGroup = SelectPrimitive.Group;

const DropDownButtonValue = SelectPrimitive.Value;

const DropDownButtonTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
    VariantProps<typeof dropdownButtonStyles>
>(({ className, children, size = "M", ...props }, ref) => {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(dropdownButtonStyles({ size }), className)}
      {...props}
    >
      <p>{children}</p>
      <Button
        buttonType="icon"
        className={cn(
          [
            "group-aria-expanded:bg-[--background-presentation-action-hover]",
            "group-aria-expanded:text-white",
          ],
          {
            "text-[12px]": size === "S",
            "text-[16px]": size === "M",
            "text-[18px]": size === "L",
          }
        )}
      >
        <i
          className={cn(
            "ri-arrow-down-s-line transition-all duration-100 ease-in-out group-aria-expanded:rotate-180"
          )}
        ></i>
      </Button>
    </SelectPrimitive.Trigger>
  );
});
DropDownButtonTrigger.displayName = "DropDownButtonTrigger";

const DropDownButtonScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1 ",
      className
    )}
    {...props}
  >
    <ChevronUp
      className="h-4 w-4"
      color={"var(--content-presentation-action-light-primary)"}
    />
  </SelectPrimitive.ScrollUpButton>
));
DropDownButtonScrollUpButton.displayName = "DropDownButtonScrollUpButton";

const DropDownButtonScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown
      color={"var(--content-presentation-action-light-primary)"}
      className="h-4 w-4"
    />
  </SelectPrimitive.ScrollDownButton>
));
DropDownButtonScrollDownButton.displayName = "DropDownButtonScrollDownButton";

const DropDownButtonContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> &
    VariantProps<typeof dropdownMenuStyles>
>(
  (
    {
      className,
      children,
      variant = "PresentationStyle",
      position = "popper",
      ...props
    },
    ref
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(dropdownMenuStyles({ variant }), className)}
        position={position}
        {...props}
      >
        <DropDownButtonScrollUpButton />
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        <DropDownButtonScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
DropDownButtonContent.displayName = "DropDownButtonContent";

const DropDownButtonLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
DropDownButtonLabel.displayName = "DropDownButtonLabel";

const DropDownButtonItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> &
    VariantProps<typeof MenuItemStyles>
>(({ className, children, variant = "Default", active, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      MenuItemStyles({
        variant,
        active,
      }),
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

DropDownButtonItem.displayName = "DropDownButtonItem";

const DropDownButtonSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropDownButtonSeparator.displayName = "DropDownButtonSeparator";

export {
  DropDownButton,
  DropDownButtonGroup,
  DropDownButtonValue,
  DropDownButtonTrigger,
  DropDownButtonContent,
  DropDownButtonLabel,
  DropDownButtonItem,
  DropDownButtonSeparator,
  DropDownButtonScrollUpButton,
  DropDownButtonScrollDownButton,
};
