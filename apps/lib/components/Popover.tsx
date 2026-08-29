"use client";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import React, { cloneElement, isValidElement, useEffect, useRef } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Slot } from "@radix-ui/react-slot";
import { Themes } from "../utils/types";


interface LocalPopOverProps extends VariantProps<typeof popoverStyles> {
  variant?: "SystemStyle" | "PresentationStyle";
  className?: string;
  overlayBlur?: boolean;
}

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Trigger
    ref={ref}
    className={cn("z-[20] transition-all duration-300 data-[state=open]:z-[49]", className)}
    {...props}
  />
));

PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
  LocalPopOverProps & {
    theme?: Themes;
  }
>(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      variant = "PresentationStyle",
      overlayBlur = false,
      theme,
      children,
      ...props
    },
    ref,
  ) => (
    <PopoverPrimitive.Portal>
      {overlayBlur ? (
        <div className="relative z-[42]" data-theme={theme}>
          <div className="fixed top-0 left-0 flex h-full w-full items-center flex-shrink-0 bg-[rgba(16,7,25,0.32)] backdrop-blur-[8px] transition-all duration-300"></div>
          <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(popoverStyles({ variant, overlayBlur }), className)}
            {...props}
          >
            {children}
          </PopoverPrimitive.Content>
        </div>
      ) : (
        <PopoverPrimitive.Content
          data-theme={theme}
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn(popoverStyles({ variant, overlayBlur }), className)}
          {...props}
        >
          {children}
        </PopoverPrimitive.Content>
      )}
    </PopoverPrimitive.Portal>
  ),
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// Define the Props interface with a generic type parameter
interface Props<T extends React.ElementType = "li">
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof PopoverItemStyles> {
  asChild?: boolean;
  as?: T; // The `as` prop can be any valid HTML element or React component
}

// Define the PopoverItem component with a generic type parameter
const PopoverItem = <T extends React.ElementType = "li">({
  variant = "Default",
  size = "M",
  asChild,
  className,
  children,
  active,
  as = "button" as T, // Default to "li" if `as` is not provided
  ...props
}: Props<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof Props<T>>) => {
  const Component = asChild ? Slot : as;
  const ref = useRef<HTMLLIElement>(null);

  // Scroll to the selected item when the dropdown is opened
  useEffect(() => {
    if (active && ref.current) {
      ref.current.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }, [active]);

  const itemClassName = cn(PopoverItemStyles({ variant, size, active }), className);

  // The styles are a two-layer chip (see `PopoverItemStyles`): this element is the container and
  // the inner div is the row that lights up, which every `[&>div]:` rule targets. It therefore has
  // to exist in both branches.
  if (asChild && isValidElement(children)) {
    // Slot merges the item's props onto the consumer's element (e.g. a Link), so the row div has to
    // be injected as that element's child — wrapping the Link instead would move the class onto the
    // wrapper and leave the anchor nested inside the item rather than being it.
    const child = children as React.ReactElement<{ children?: React.ReactNode }>;
    return (
      <Slot className={itemClassName} ref={ref as React.Ref<HTMLElement>}>
        {cloneElement(child, {}, <div>{child.props.children}</div>)}
      </Slot>
    );
  }

  return (
    <Component
      {...(props as React.ComponentPropsWithoutRef<T>)} // Spread the props dynamically
      className={itemClassName}
      ref={ref}
    >
      <div>{children}</div>
    </Component>
  );
};

export { Popover, PopoverTrigger, PopoverContent, PopoverItem };


const PopoverItemStyles = cva(
  // Ported from `MenuItemStyles` (ContextMenu/DropdownMenu) so a popover row and a menu row are the
  // same object, minus the menu's grey `rgba(184,192,204,0.36)` container — a popover row sits
  // directly on the panel. The inner `<div>` is still the row that lights up on hover/focus, and
  // `PopoverItem` always renders it, including through `asChild`.
  [
    "text-content-presentation-global-primary-light typography-body-medium-regular",
    "outline-none",
    "border",
    "border-transparent",
    "flex w-full",
    "shrink-0", // keep full row height so the popover scrolls instead of squishing
    "items-center",
    "justify-start",
    "text-overflow",
    "overflow-hidden",
    "p-[2px]",
    "transition-all",
    "ease-in-out",
    "duration-300",
    "[&>div]:flex",
    "[&>div]:px-[12px]",
    "[&>div]:py-[4px]",
    "[&>div]:gap-2",
    "[&>div]:w-full",
    "[&>div]:rounded-[8px]",
    "[&>div]:items-center",
    "group",
  ],
  {
    variants: {
      variant: {
        // The menu uses Radix's `data-highlighted`; a PopoverItem is a plain button, so the
        // keyboard-highlight equivalent here is `:focus`.
        Default: [
          "text-content-presentation-global-primary-light",
          "[&>div]:hover:bg-white-50 [&>div]:hover:shadow-[0_0_16px_0_rgba(0,0,0,0.36)]",
          "[&>div]:hover:text-black-1000",
          "[&:focus>div]:bg-white-alpha-75",
          "[&:focus>div]:text-black-1000",
          "[&:disabled>div]:text-content-presentation-global-primary-light",
          "[&:disabled>div]:opacity-50",
          "[&:disabled>div]:hover:bg-transparent",
          "[&:disabled>div]:hover:shadow-none",
        ],
        Warning: [
          "text-blue-sparkle-200",
          "[&>div]:hover:bg-white-50 [&>div]:hover:shadow-[0_0_16px_0_rgba(0,0,0,0.36)]",
          "[&>div]:hover:text-blue-sparkle-700",
          "[&:focus>div]:bg-white-alpha-75",
          "[&:focus>div]:text-blue-sparkle-700",
        ],
        Negative: [
          "text-medium-red-200",
          "[&>div]:hover:bg-white-50 [&>div]:hover:shadow-[0_0_16px_0_rgba(0,0,0,0.36)]",
          "[&>div]:hover:text-medium-red-600",
          "[&:focus>div]:bg-white-alpha-75",
          "[&:focus>div]:text-medium-red-600",
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
        true: ["text-content-presentation-state-disabled", "bg-white-00"],
      },

      active: {
        true: [
          "bg-background-presentation-action-selected",
          "text-content-presentation-action-light-primary",
        ],
      },
    },
    // Same misplacement as `popoverStyles` — a sibling of `variants`, not one of them.
    defaultVariants: {
      variant: "Default",
      size: "M",
      active: false,
      disabled: false,
    },
    compoundVariants: [
      {
        active: true,
        variant: "Warning",
        className: ["text-content-presentation-state-negative"],
      },
    ],
  },
);

const popoverStyles = cva(
  [
    "p-1 max-h-[200px] z-[1000] shrink-0",
    "rounded-[8px]",
    "border",
    "min-w-[240px]",
    "outline-none",
    "overflow-scroll",
    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0",
    "data-[state=open]:fade-in-0",
    "scrollbar-hide",
    "overflow-x-hidden",
  ],
  {
    variants: {
      variant: {
        SystemStyle: [
          "border-border-system-global-secondary",
          "bg-background-system-body-primary",
          "shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)]",
        ],
        // Figma `Dropdown-Menu-1.0` (1735:159246) — the same surface `menuContentStyles` renders,
        // so a popover and a dropdown menu are indistinguishable panels.
        PresentationStyle: [
          // `border-0`, not `border-transparent`: the base sets `border`, and with `border-box`
          // that 1px sits on top of the 4px padding, making the panel 2px wider than the design.
          "border-0",
          "rounded-[14px]",
          "backdrop-blur-[21px]",
          // The design's fill is a raw `rgba(61,64,69,0.72)` with no Figma variable behind it, so it
          // is spelled out exactly as DropdownMenu/ContextMenu already spell it. It has to be
          // translucent: over the previous opaque `form-base` the backdrop-blur painted nothing.
          "bg-[rgba(61,64,69,0.72)]",
          "shadow-[0_0_32px_2px_rgba(0,0,0,0.20),0_0_48px_2px_rgba(0,0,0,0.05)]",
          // Figma's group-container stacks its rows with a 4px gutter.
          "flex flex-col gap-1",
        ],
      },
      overlayBlur: {
        true: ["h-fit"],
      },
    },
    // Was nested inside `variants`, where cva reads it as a variant group called
    // "defaultVariants" and no default is ever applied.
    defaultVariants: {
      variant: "PresentationStyle",
    },
  },
);
