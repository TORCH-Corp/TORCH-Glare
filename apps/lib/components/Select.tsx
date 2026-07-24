"use client";
import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "../utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import { Button } from "./Button";
import { Tooltip } from "./Tooltip";
import { MenuItemStyles } from "./DropdownMenu";
import { Themes } from "../utils/types";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
    VariantProps<typeof PopoverTriggerStyles> & {
      errors?: string;
      icon?: string;
      theme?: Themes;
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
      onTable,
      ...props
    },
    ref,
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
              onTable,
            }),
            className,
          )}
          {...props}
        >
          <p
            className={cn({
              "[&_span]:text-[#A0A0A0]": !props.value,
            })}
          >
            {children}
          </p>

          <Button
            as={"span"}
            buttonType="icon"
            size={"L"}
            className={cn([
              "group-aria-expanded:bg-background-presentation-action-hover",
              "group-aria-expanded:text-white",
            ])}
          >
            <i
              className={cn(
                "ri-arrow-down-s-line transition-all duration-100 ease-in-out group-aria-expanded:rotate-180",
                { "!text-[12px]": size === "S" },
                { "!text-[16px]": size === "M" },
                { "!text-[18px]": size === "L" },
                { "!text-[26px]": size === "XL" },
                { icon: icon },
              )}
            />
          </Button>
        </SelectPrimitive.Trigger>
      </Tooltip>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1 ", className)}
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
    className={cn("flex cursor-default items-center justify-center py-1", className)}
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
      theme?: Themes;
    }
>(
  (
    { className, children, variant = "PresentationStyle", position = "popper", theme, ...props },
    ref,
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-theme={theme}
        ref={ref}
        className={cn(SelectContentStyles({ variant }), className)}
        position={position}
        {...props}
      >
        {/* Dedicated scroll viewport + boxed group, matching SearchableSelect's menu surface. */}
        <SelectPrimitive.Viewport className="overflow-y-auto overflow-x-hidden rounded-[10px] scrollbar-hide">
          <div className="flex flex-col gap-[1px] overflow-hidden rounded-[10px]">{children}</div>
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  ),
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
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & VariantProps<typeof MenuItemStyles>
>(({ className, children, size = "M", variant = "Default", active, ...props }, ref) => (
  // Same structure as DropdownMenuItem / SearchableSelect: MenuItemStyles on the element
  // + a single inner <div> the styles target via [&>div], and a check on the selected row.
  <SelectPrimitive.Item
    ref={ref}
    className={cn(MenuItemStyles({ variant, active, size }), "shrink-0", className)}
    {...props}
  >
    <div>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="ml-auto flex shrink-0">
        <i className="ri-check-line text-[16px]" />
      </SelectPrimitive.ItemIndicator>
    </div>
  </SelectPrimitive.Item>
));

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

// Panel surface mirrors SearchableSelect's `menuContentStyles` (translucent, backdrop-blurred,
// borderless, rounded-14). `min-w`/`z-index` are kept for the Radix Select portal.
const SelectContentStyles = cva(
  [
    "p-1",
    "rounded-[14px]",
    // Match the dropdown to the trigger's width (Radix popper exposes it as a CSS var),
    // but never narrower than 240px.
    "w-[var(--radix-select-trigger-width)]",
    "min-w-[240px]",
    "border-0",
    "outline-none",
    "overflow-hidden",
    "backdrop-blur-[21px]",
    "flex flex-col gap-1",
    "data-[state=open]:animate-in",
    "data-[state=open]:fade-in-0",
    "z-[1000]",
    "max-h-[368px]",
  ],
  {
    variants: {
      variant: {
        SystemStyle: [
          "bg-background-system-body-primary",
          "shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)]",
        ],
        PresentationStyle: [
          "bg-[rgba(61,64,69,0.72)]",
          "shadow-[0_0_32px_2px_rgba(0,0,0,0.20),0_0_48px_2px_rgba(0,0,0,0.05)]",
        ],
      },
      defaultVariants: {
        variant: "PresentationStyle",
      },
    },
  },
);

const PopoverTriggerStyles = cva(
  [
    "flex flex-row rounded-[8px] justify-between items-center outline-none",
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
          "border-border-presentation-action-primary",
          "hover:bg-background-presentation-form-field-hover",
          "hover:border-border-presentation-action-hover",
          "focus:bg-background-presentation-form-field-hover",
          "focus:border-border-presentation-state-focus",
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
      // Transparent border/background so the trigger blends into a table cell.
      onTable: {
        true: ["border-transparent", "bg-transparent"],
      },
      size: {
        S: ["rounded-[6px] [&_span]:h-[22px] [&_span]:w-[22px] [&_p]:typography-body-small-medium"],
        M: ["[&_span]:h-[26px] [&_span]:w-[26px] [&_p]:typography-body-medium-medium"],
        L: ["[&_span]:h-[28px] [&_span]:w-[28px] [&_p]:typography-body-large-medium"],
        XL: [
          "h-[40px] p-[4px] rounded-[8px] [&_span]:h-[32px] [&_span]:w-[32px] [&_p]:typography-body-large-regular [&_p]:px-[4px]",
        ],
      },
    },
    defaultVariants: {
      size: "M",
    },
  },
);
