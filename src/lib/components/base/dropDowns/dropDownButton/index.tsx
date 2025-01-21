"use client";
import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { dropdownMenuStyles } from "../dropdownMenu";
import { cva, VariantProps } from "class-variance-authority";
import { MenuItemStyles } from "../menuItem";
import { Button } from "@/components/base/buttons/button";

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

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
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
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
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
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
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
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
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
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
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

SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
