"use client";
import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "../utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import { ActionButton } from "./ActionButton";
import { MenuItemStyles } from "./DropdownMenu";
import { Themes } from "../utils/types";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
  VariantProps<typeof PopoverTriggerStyles> & {
    /** Marks the trigger invalid: any non-undefined value turns on the negative border. */
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

        {/* The shared in-field action button. Its box tracks the trigger height the same way
            InputField's does — a 30px field takes the 22px button, a 40px field the 32px one. */}
        <ActionButton
          as={"span"}
          size={size === "XL" ? "M" : size === "S" ? "XS" : "S"}
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
        </ActionButton>
      </SelectPrimitive.Trigger>
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
        // Never taller than 368px, and never taller than the space Radix has on screen. Valid because
        // `position` defaults to "popper", which is what publishes the variable.
        style={{
          maxHeight: "min(368px, var(--radix-select-content-available-height, 100vh))",
          ...props.style,
        }}
        {...props}
      >
        {/* Dedicated scroll viewport + boxed group, matching SearchableSelect's menu surface.
            `flex-1 min-h-0` is what makes it scroll: without `min-h-0` a flex item refuses to shrink
            below its content, so the list grew past the panel and `overflow-hidden` simply clipped
            the rows off with no scrollbar. */}
        <SelectPrimitive.Viewport className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden rounded-[10px] scrollbar-hide">
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
      <SelectPrimitive.ItemIndicator className="ms-auto flex shrink-0">
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
    // Panel height is set inline below from `min(368px, available-height)`; the class is kept off
    // deliberately so the inline value governs.
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
    // No radius here — every `size` variant sets its own. `twMerge` does NOT dedupe the
    // `rounded-radius-*` classes (they are custom scale keys, not values it recognises), so a
    // radius on the base would survive alongside the variant's and let CSS source order pick the
    // winner: `md` is generated before `lg`, so a base `lg` would silently beat size S's `md`.
    "flex flex-row justify-between items-center outline-none",
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
      // Transparent border/background so the trigger blends into a table cell. The hover and
      // focus shadows are deliberately left alone — a cell control lifts exactly like any
      // other field.
      onTable: {
        true: ["border-transparent", "bg-transparent"],
      },
      // No `[&_span]:h-/w-` here: the chevron is an `ActionButton` and sizes itself from its own
      // `size` prop. Those descendant rules used to force its box, and being descendant selectors
      // they outranked the button's own classes — they also hit the SelectValue text span, which
      // only escaped being squashed because an inline element ignores width/height.
      size: {
        // 24px tall — below the field scale's smallest step (30px), so it keeps its own
        // `radius/md` rather than being rounded up to the 8px a real field would use.
        // Heights are explicit because the trigger used to be sized by whichever chevron box the
        // `[&_span]` rules imposed; now that the chevron sizes itself, the field must state its own.
        //
        // Every size states its padding so that `2×border + 2×padding + chevron` is exactly the
        // trigger height — the chevron then sits an equal distance from all four edges instead of
        // being flush to the border horizontally and centred vertically. Only XL had any padding
        // before, which is why it was the only size that looked right.
        //
        // L and XL are the real field heights (30/40) and land on Figma's 4px. S and M have no
        // Figma counterpart, so they take 3px — the most that still fits their chevron exactly.
        S: ["h-[24px] p-[2px] rounded-radius-md [&_p]:typography-body-small-medium"],
        // 28px and 30px — the field scale's S step (30px) is `radius/lg`.
        M: ["h-[28px] p-[2px] rounded-radius-lg [&_p]:typography-body-medium-medium"],
        L: ["h-[30px] p-[3px] rounded-radius-lg [&_p]:typography-body-large-medium"],
        // 40px tall, so it is exactly InputField M and takes that size's `radius/xl` (12px).
        // It sat at 8px before — the one place a 40px field in the system rounded like a 30px one.
        XL: [
          "h-[40px] p-[3px] rounded-radius-xl [&_p]:typography-body-large-regular [&_p]:px-[4px]",
        ],
      },
    },
    defaultVariants: {
      size: "M",
    },
  },
);
