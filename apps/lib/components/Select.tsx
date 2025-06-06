"use client";
import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "../utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import { Button } from "./Button";
import { Tooltip } from "./Tooltip";
import { Themes } from "../utils/types";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
  VariantProps<typeof PopoverTriggerStyles> & {
    errors?: string;
    icon?: string
    theme?: Themes
  }
>(
  (
    {
      className,
      children,
      size = "M",
      variant = "PresentationStyle",
      errors,
      theme,
      icon,
      ...props
    },
    ref
  ) => {
    return (
      <Tooltip toolTipSide={"top"} open={errors !== undefined} text={errors}>
        <SelectPrimitive.Trigger
          data-theme={theme}
          ref={ref}
          className={cn(
            PopoverTriggerStyles({
              size,
              variant,
              error: errors !== undefined,
            }),
            className
          )}
          {...props}
        >
          <p className={cn({
            "[&_span]:text-[#A0A0A0]": !props.value
          })}>{children}</p>

          <Button
            as={"span"}
            buttonType="icon"
            className={cn(
              [
                "group-aria-expanded:bg-background-presentation-action-hover",
                "group-aria-expanded:text-white",
              ]
            )}
          >
            <i
              className={cn(
                "ri-arrow-down-s-line transition-all duration-100 ease-in-out group-aria-expanded:rotate-180",
                { "!text-[12px]": size === "S" },
                { "!text-[16px]": size === "M" },
                { "!text-[18px]": size === "L" },
                { "!text-[26px]": size === "XL" },
                { icon: icon }
              )}
            />
          </Button>
        </SelectPrimitive.Trigger>
      </Tooltip>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

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
    <i
      className="h-4 w-4 ri-arrow-up-s-line"
      color={"var(--content-presentation-action-light-primary)"}
    />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = "SelectScrollUpButton";

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
    <i
      color={"var(--content-presentation-action-light-primary)"}
      className="h-4 w-4 ri-arrow-down-s-line"
    />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = "SelectScrollDownButton";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> &
  VariantProps<typeof SelectContentStyles> & {
    theme?: Themes
  }
>(
  (
    {
      className,
      children,
      variant = "PresentationStyle",
      position = "popper",
      theme,
      ...props
    },
    ref
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-theme={theme}
        ref={ref}
        className={cn(SelectContentStyles({ variant }), className)}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = "SelectContent";

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
SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> &
  VariantProps<typeof SelectItemStyles>
>(
  (
    { className, children, size = "M", variant = "Default", active, ...props },
    ref
  ) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        SelectItemStyles({
          variant,
          active,
          size,
        }),
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
);

SelectItem.displayName = "SelectItem";

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
SelectSeparator.displayName = "SelectSeparator";

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


// NOTE: radix select as DropDownButton

const SelectContentStyles = cva(
  [
    "p-1",
    "rounded-[8px]",
    "min-w-[240px]",
    "border",
    "outline-none",
    "overflow-scroll",
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0",
    "data-[state=open]:fade-in-0",
    "overflow-x-hidden",
    "scrollbar-hide",
    "z-[1000]",
  ],
  {
    variants: {
      variant: {
        SystemStyle: [
          "border-border-system-global-secondary",
          "bg-background-system-body-primary",
          "shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)]",
        ],
        PresentationStyle: [
          "border-border-presentation-global-primary",
          "bg-background-presentation-form-base",
          "shadow-[0px_0px_10px_0px_rgba(0,0,0,0.4),0px_4px_4px_0px_rgba(0,0,0,0.2)]",
        ],
      },
      defaultVariants: {
        variant: "PresentationStyle",
      },
    },
  }
);

const SelectItemStyles = cva(
  [
    "text-content-presentation-action-light-primary",
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
          "text-content-presentation-action-light-primary",
          "bg-background-presentation-action-dropdown-primary",
          "hover:bg-background-presentation-action-hover",
          "hover:text-content-presentation-action-hover",
          "focus:bg-background-presentation-action-hover",
          "focus:text-content-presentation-action-hover",
          "disabled:text-content-presentation-state-disabled",
          "disabled:bg-white-00",
        ],
        Warning: [
          "text-content-presentation-state-information",
          "hover:bg-background-presentation-state-information-primary",
          "focus:bg-background-presentation-state-information-primary",
          "focus:text-content-presentation-action-hover",
          "hover:text-content-presentation-action-hover",
        ],
        Negative: [
          "text-content-presentation-state-negative",
          "hover:bg-background-presentation-state-negative-primary",
          "hover:text-content-presentation-action-hover",
          "focus:bg-background-presentation-state-negative-primary",
          "focus:text-content-presentation-action-hover",
          "active:text-content-presentation-state-negative",
        ],
        SystemStyle: [
          "bg-background-system-body-primary",
          "text-content-system-global-primary",
          "hover:bg-background-system-action-secondary-hover",
          "hover:text-content-system-action-primary-hover",
          "hover:border-border-system-action-primary-hover",
          "focus:bg-background-system-action-secondary-hover",
          "focus:text-content-system-action-primary-hover",
          "focus:border-border-system-action-primary-hover",
          "disabled:bg-background-system-body-secondary",
          "disabled:text-content-system-global-disabled",
        ],
      },
      size: {
        S: ["typography-body-small-regular", "h-[24px]"],
        M: ["typography-body-medium-regular", "h-[32px]"],
      },

      disabled: {
        true: [
          "text-content-presentation-state-disabled",
          "bg-white-00",
        ],
      },

      active: {
        true: [
          "bg-background-presentation-action-selected",
          "text-content-presentation-action-light-primary",
        ],
      },

      defaultVariants: {
        variant: "Default",
        size: "M",
        active: false,
        disabled: false,
      },
    },
    compoundVariants: [
      {
        active: true,
        variant: "Warning",
        className: ["text-content-presentation-state-negative"],
      },
    ],
  }
);

const PopoverTriggerStyles = cva(
  [
    "flex flex-row rounded-[4px] justify-between items-center outline-none",
    "rounded-[4px]",
    "[&_span]:text-content-presentation-action-light-primary",
    "typography-body-small-regular",
    "[&_p]:px-[10px] [&_p]:whitespace-nowrap",
    "group",
    "w-fit",
    "border",
    "transition-all duration-200 ease-in-out",
    "hover:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
    "focus:shadow-[0px_1px_6px_0px_rgba(0,0,0,0.30)]",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          "bg-background-presentation-form-field-primary",
          "hover:bg-background-presentation-form-field-hover",
          "focus:bg-background-presentation-form-field-hover",
          "border-none",
        ],
        SystemStyle: [
          "bg-black-alpha-20",
          "text-white",
          "border-[#2C2D2E]",
          "hover:border-[#9748FF]",
          "hover:bg-purple-alpha-10",
          "focus:border-[#9748FF]",
          "focus:bg-purple-alpha-10",
        ],
      },
      error: {
        true: [
          "border-border-presentation-state-negative",
          "caret-border-presentation-state-negative",
          "hover:border-border-presentation-state-negative",
          "hover:caret-border-presentation-state-negative",
        ],
      },
      size: {
        S: [
          "[&_span]:h-[22px] [&_span]:w-[22px] [&_p]:typography-body-small-medium",
        ],
        M: [
          "[&_span]:h-[26px] [&_span]:w-[26px] [&_p]:typography-body-medium-medium",
        ],
        L: [
          "[&_span]:h-[28px] [&_span]:w-[28px] [&_p]:typography-body-large-medium",
        ],
        XL: [
          "h-[40px] p-[4px] rounded-[6px] [&_span]:h-[32px] [&_span]:w-[32px] [&_p]:typography-body-large-regular [&_p]:px-[4px]",
        ],
      },
    },
    defaultVariants: {
      size: "M",
    },
  }
);