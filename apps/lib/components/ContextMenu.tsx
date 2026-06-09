"use client";

import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

/**
 * ContextMenu — a right-click (or long-press) menu.
 *
 * Same surface as DropdownMenu (items, groups, the boxed look, auto-grouping),
 * built on @radix-ui/react-context-menu so it opens at the pointer on
 * right-click instead of anchoring to a clicked trigger button. The styling and
 * auto-group logic are kept self-contained here (mirrored in DropdownMenu).
 */

interface ContextMenuContentProps {
  variant?: "PresentationStyle";
  className?: string;
  theme?: Themes;
}

// A second right-click while the menu is open should simply close it. Radix
// would otherwise keep it open (re-anchoring is unreliable), so we make the Root
// controlled, track `open` in context, and let the Trigger close + swallow the
// event on re-click.
const ContextMenuOpenContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

const ContextMenu = ({
  open: openProp,
  onOpenChange,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Root>) => {
  const [open, setOpenState] = React.useState(false);
  const isControlled = openProp !== undefined;
  const actualOpen = isControlled ? openProp : open;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setOpenState(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  return (
    <ContextMenuOpenContext.Provider value={{ open: actualOpen, setOpen }}>
      <ContextMenuPrimitive.Root
        open={actualOpen}
        onOpenChange={setOpen}
        {...props}
      >
        {children}
      </ContextMenuPrimitive.Root>
    </ContextMenuOpenContext.Provider>
  );
};
ContextMenu.displayName = "ContextMenu";

// The right-click zone. Wrap it around the target the menu should open from.
const ContextMenuTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Trigger>
>(({ onContextMenuCapture, ...props }, ref) => {
  const ctx = React.useContext(ContextMenuOpenContext);

  return (
    <ContextMenuPrimitive.Trigger
      ref={ref}
      // Capture phase runs before Radix's bubble-phase open handler. If the menu
      // is already open, close it and swallow the event so Radix doesn't reopen
      // it — a second right-click just dismisses the menu.
      onContextMenuCapture={(event) => {
        onContextMenuCapture?.(event);
        if (ctx?.open) {
          event.preventDefault();
          event.stopPropagation();
          ctx.setOpen(false);
        }
      }}
      {...props}
    />
  );
});
ContextMenuTrigger.displayName = ContextMenuPrimitive.Trigger.displayName;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = ContextMenuPrimitive.Sub;

const ContextMenuGroup = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Group> &
  VariantProps<typeof menuGroupStyles>
>(({ className, variant = "Boxed", ...props }, ref) => (
  <ContextMenuPrimitive.Group
    ref={ref}
    className={cn(menuGroupStyles({ variant }), className)}
    {...props}
  />
));
ContextMenuGroup.displayName = ContextMenuPrimitive.Group.displayName;

const ContextMenuRadioGroup = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioGroup>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioGroup> &
  VariantProps<typeof menuGroupStyles>
>(({ className, variant = "Boxed", ...props }, ref) => (
  <ContextMenuPrimitive.RadioGroup
    ref={ref}
    className={cn(menuGroupStyles({ variant }), className)}
    {...props}
  />
));
ContextMenuRadioGroup.displayName = ContextMenuPrimitive.RadioGroup.displayName;

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> &
  ContextMenuContentProps & { autoGroup?: boolean }
>(
  (
    {
      theme,
      className,
      variant = "PresentationStyle",
      autoGroup = true,
      collisionPadding = 8,
      children,
      ...props
    },
    ref
  ) => (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-theme={theme}
        ref={ref}
        collisionPadding={collisionPadding}
        className={cn(
          menuContentStyles({ variant }),
          // Cap to the space Radix has after collision handling so a tall menu
          // scrolls instead of overflowing off-screen.
          "max-h-[var(--radix-context-menu-content-available-height)]",
          className
        )}
        {...props}
      >
        {autoGroup ? autoGroupChildren(children) : children}
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Portal>
  )
);
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  } & VariantProps<typeof MenuItemStyles>
>(
  ({ className, inset, children, variant = "Default", size = "M", ...props }, ref) => (
    <ContextMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(MenuItemStyles({ variant, size }), "justify-between", className)}
      {...props}
    >
      <div className="justify-between">
        <div className="flex gap-2">{children}</div>
        <i className="ri-arrow-right-s-line text-[16px] rtl:rotate-180"></i>
      </div>
    </ContextMenuPrimitive.SubTrigger>
  )
);
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent> & {
    variant?: "PresentationStyle";
    autoGroup?: boolean;
  }
>(
  ({ className, variant = "PresentationStyle", autoGroup = true, children, ...props }, ref) => (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.SubContent
        ref={ref}
        className={cn(menuContentStyles({ variant }), className)}
        {...props}
      >
        {autoGroup ? autoGroupChildren(children) : children}
      </ContextMenuPrimitive.SubContent>
    </ContextMenuPrimitive.Portal>
  )
);
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
  } & VariantProps<typeof MenuItemStyles>
>(
  ({ className, inset, children, variant = "Default", size = "M", active, ...props }, ref) => (
    <ContextMenuPrimitive.Item
      {...props}
      ref={ref}
      className={cn(MenuItemStyles({ variant, size, active }), className)}
    >
      <div>{children}</div>
    </ContextMenuPrimitive.Item>
  )
);
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem> &
  VariantProps<typeof MenuItemStyles>
>(
  ({ className, children, checked, variant = "Default", size = "M", onSelect, ...props }, ref) => (
    <ContextMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(MenuItemStyles({ variant, size }), "relative", className)}
      checked={checked}
      // Keep the menu open when toggling; preventDefault stops Radix's auto-close.
      onSelect={(event) => {
        event.preventDefault();
        onSelect?.(event);
      }}
      {...props}
    >
      <div className="relative flex items-center">
        <span className="h-full flex items-center justify-center">
          {/* Unchecked box; hidden once the item is checked. */}
          <div className="flex justify-center items-center h-full [[data-state=checked]_&]:hidden">
            <div className="w-[16px] h-[16px] rounded-[3px] border border-white-alpha-40 bg-black-alpha-15 group-hover:border-white-700 group-hover:bg-black-alpha-075"></div>
          </div>

          {/* Checked indicator only renders when checked. */}
          <ContextMenuPrimitive.ItemIndicator>
            <div className="bg-blue-sparkle-600 flex justify-center items-center w-[16px] h-[16px] rounded-[3px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5.8339 8.84977L11.1961 3.48755L12.0211 4.3125L5.8339 10.4997L2.12158 6.7874L2.94654 5.96245L5.8339 8.84977Z" fill="#F9F9F9" />
              </svg>
            </div>
          </ContextMenuPrimitive.ItemIndicator>
        </span>{" "}
        {children}
      </div>
    </ContextMenuPrimitive.CheckboxItem>
  )
);
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem> &
  VariantProps<typeof MenuItemStyles>
>(({ className, children, variant = "Default", size = "M", onSelect, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(MenuItemStyles({ variant, size }), "relative", className)}
    // Keep the menu open when selecting; preventDefault stops Radix's auto-close.
    onSelect={(event) => {
      event.preventDefault();
      onSelect?.(event);
    }}
    {...props}
  >
    <div className="relative flex items-center">
      <span className="h-full left-2 flex h-3.5 w-3.5 items-center justify-center">
        {/* Unselected dot; hidden once the item is selected. */}
        <div className="flex justify-center items-center h-full [[data-state=checked]_&]:hidden">
          <div className="w-[14px] h-[14px] rounded-[100px] border border-white-alpha-40 bg-black-alpha-15 group-hover:border-white-700 group-hover:bg-black-alpha-075"></div>
        </div>
        <ContextMenuPrimitive.ItemIndicator>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 14" fill="none">
            <rect width="14" height="14" rx="7" fill="#005ECC" />
            <rect x="5" y="5" width="4" height="4" rx="2" fill="white" />
          </svg>
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </div>
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

// Item types that should be boxed together when sitting loose in the menu.
// ContextMenuSub is included because its trigger renders as an inline row.
const GROUPABLE_TYPES = [
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuSub,
] as const;

const isGroupable = (child: React.ReactNode): child is React.ReactElement =>
  React.isValidElement(child) &&
  (GROUPABLE_TYPES as readonly React.ElementType[]).includes(
    child.type as React.ElementType
  );

// Wraps consecutive runs of loose items in a Boxed ContextMenuGroup so items
// render inside a container even when the consumer doesn't write one. Labels,
// separators and explicit groups act as boundaries and pass through unchanged.
function autoGroupChildren(children: React.ReactNode): React.ReactNode {
  const out: React.ReactNode[] = [];
  let run: React.ReactElement[] = [];

  const flush = (key: string) => {
    if (run.length === 0) return;
    out.push(
      <ContextMenuGroup key={key} variant="Boxed">
        {run}
      </ContextMenuGroup>
    );
    run = [];
  };

  React.Children.toArray(children).forEach((child, index) => {
    if (isGroupable(child)) {
      run.push(child);
    } else {
      flush(`auto-group-${index}`);
      out.push(child);
    }
  });
  flush("auto-group-last");

  return out;
}

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "text-content-presentation-global-primary-light typography-body-small-medium px-[12px] pt-1 flex justify-start items-center",
      className
    )}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto ltr:ml-0 rtl:mr-auto text-xs tracking-widest opacity-60", className)}
    {...props}
  />
);
ContextMenuShortcut.displayName = "ContextMenuShortcut";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuRadioGroup,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuShortcut,
};

const MenuItemStyles = cva(
  [
    "text-content-presentation-global-primary-light typography-body-medium-regular",
    "outline-none",
    "border",
    "border-transparent",
    "flex",
    "items-center",
    "justify-start",
    "text-overflow",
    "overflow-hidden",
    "p-[2px]",
    "transition-all",
    "bg-[rgba(184,192,204,0.36)]",
    "ease-in-out",
    "duration-300",
    "[&>div]:flex",
    "[&>div]:px-[12px]",
    "[&>div]:py-[4px]",
    "[&>div]:gap-2",
    "[&>div]:w-full",
    "[&>div]:rounded-[8px]",
    "[&>div]:items-center ",
    "group",
  ],
  {
    variants: {
      variant: {
        Default: [
          "text-content-presentation-global-primary-light",
          "[&>div]:hover:bg-white-50 [&>div]:hover:shadow-[0_0_16px_0_rgba(0,0,0,0.36)]",
          "[&>div]:hover:text-black-1000",
          "[&[data-highlighted]>div]:bg-white-alpha-75",
          "[&[data-highlighted]>div]:text-black-1000",
          "[&[data-disabled]>div]:text-content-presentation-global-primary-light",
          "[&[data-disabled]>div]:opacity-50",
          // Disabled items are pointer-events:none by default (Radix), so
          // re-enable them to allow hover styling without making them selectable.
          "[&[data-disabled]]:pointer-events-auto",
          "[&[data-disabled]>div]:hover:text-content-presentation-global-primary-light",
          "[&[data-disabled]>div]:hover:bg-transparent",
          "[&[data-disabled]>div]:hover:shadow-none",
        ],
        info: [
          "text-blue-sparkle-200",
          "[&>div]:hover:bg-white-50 [&>div]:hover:shadow-[0_0_16px_0_rgba(0,0,0,0.36)]",
          "[&>div]:hover:text-blue-sparkle-700",
          "[&[data-highlighted]>div]:bg-white-alpha-75",
          "[&[data-highlighted]>div]:text-blue-sparkle-700",
          "[&[data-disabled]>div]:text-content-presentation-global-primary-light",
          "[&[data-disabled]>div]:opacity-50",
          "[&[data-disabled]]:pointer-events-auto",
          "[&[data-disabled]>div]:hover:text-content-presentation-global-primary-light",
          "[&[data-disabled]>div]:hover:bg-transparent",
          "[&[data-disabled]>div]:hover:shadow-none",
        ],
        Negative: [
          "text-medium-red-200",
          "[&>div]:hover:bg-white-50 [&>div]:hover:shadow-[0_0_16px_0_rgba(0,0,0,0.36)]",
          "[&>div]:hover:text-medium-red-600",
          "[&[data-highlighted]>div]:bg-white-alpha-75",
          "[&[data-highlighted]>div]:text-medium-red-600",
          "[&[data-disabled]>div]:text-content-presentation-global-primary-light",
          "[&[data-disabled]>div]:opacity-50",
          "[&[data-disabled]]:pointer-events-auto",
          "[&[data-disabled]>div]:hover:text-content-presentation-global-primary-light",
          "[&[data-disabled]>div]:hover:bg-transparent",
          "[&[data-disabled]>div]:hover:shadow-none",
        ],
      },
      size: {
        S: ["typography-body-small-regular", "h-[24px]"],
        M: ["typography-body-medium-regular", "h-[32px]"],
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
      },
    },
    compoundVariants: [
      {
        active: true,
        variant: "info",
        className: ["text-content-presentation-state-negative"],
      },
    ],
  }
);

const menuContentStyles = cva(
  [
    "p-1",
    "rounded-[14px]",
    "min-w-[240px]",
    "outline-none",
    "overflow-scroll",
    // Only animate the OPEN (enter) state. An exit animation on [data-state=closed]
    // holds the old DOM node during close, which breaks close/reposition on a
    // second right-click (Radix issue #2572).
    "data-[state=open]:animate-in",
    "data-[state=open]:fade-in-0",
    "overflow-x-hidden",
    "scrollbar-hide",
    "backdrop-blur-[21px]",
    "flex gap-1 flex-col",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          "bg-[rgba(61,64,69,0.72)]",
          "shadow-[0_0_32px_2px_rgba(0,0,0,0.20),0_0_48px_2px_rgba(0,0,0,0.05)]",
        ],
      },
      defaultVariants: {
        variant: "PresentationStyle",
      },
    },
  }
);

const menuGroupStyles = cva(["flex", "flex-col"], {
  variants: {
    variant: {
      // Visually contains its items in a bordered card.
      Boxed: ["gap-[1px]", "rounded-[10px]", "bg-bldue-500", "overflow-hidden"],
      // No container — semantic grouping only (Radix default behavior).
      Plain: [],
    },
  },
  defaultVariants: {
    variant: "Boxed",
  },
});
