import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";


interface DropdownMenuProps {
  variant?: "PresentationStyle";
  className?: string;
  theme?: Themes
}


const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group> &
  VariantProps<typeof menuGroupStyles>
>(({ className, variant = "Boxed", ...props }, ref) => (
  <DropdownMenuPrimitive.Group
    ref={ref}
    className={cn(menuGroupStyles({ variant }), className)}
    {...props}
  />
));
DropdownMenuGroup.displayName = DropdownMenuPrimitive.Group.displayName;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioGroup>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioGroup> &
  VariantProps<typeof menuGroupStyles>
>(({ className, variant = "Boxed", ...props }, ref) => (
  <DropdownMenuPrimitive.RadioGroup
    ref={ref}
    className={cn(menuGroupStyles({ variant }), className)}
    {...props}
  />
));
DropdownMenuRadioGroup.displayName =
  DropdownMenuPrimitive.RadioGroup.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> &
  DropdownMenuProps & { autoGroup?: boolean }
>(
  (
    {
      theme,
      className,
      sideOffset = 4,
      variant = "PresentationStyle",
      autoGroup = true,
      collisionPadding = 8,
      children,
      ...props
    },
    ref
  ) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-theme={theme}
        ref={ref}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          menuContentStyles({ variant }),
          // Cap to the space Radix has after collision handling so a tall menu
          // scrolls instead of overflowing off-screen.
          "max-h-[var(--radix-dropdown-menu-content-available-height)]",
          className
        )}
        {...props}
      >
        {autoGroup ? autoGroupChildren(children) : children}
      </DropdownMenuPrimitive.Content>
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
      ...props
    },
    ref
  ) => (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        MenuItemStyles({ variant, size }),
        "justify-between",
        className
      )}
      {...props}
    >
      <div className="justify-between"><div className="flex gap-2">
        {children}
      </div>
        <i className="ri-arrow-right-s-line text-[16px] rtl:rotate-180"></i></div>

    </DropdownMenuPrimitive.SubTrigger>
  )
);
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> & {
    variant?: "PresentationStyle";
    autoGroup?: boolean;
  }
>(
  (
    {
      className,
      variant = "PresentationStyle",
      autoGroup = true,
      children,
      ...props
    },
    ref
  ) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        ref={ref}
        className={cn(menuContentStyles({ variant }), className)}
        {...props}
      >
        {autoGroup ? autoGroupChildren(children) : children}
      </DropdownMenuPrimitive.SubContent>
    </DropdownMenuPrimitive.Portal>
  )
);
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

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
      children,
      variant = "Default",
      size = "M",
      active,
      ...props
    },
    ref
  ) => (
    <DropdownMenuPrimitive.Item
      {...props}
      ref={ref}
      className={cn(
        MenuItemStyles({ variant, size, active }),
        className
      )}
    >
      <div >{children}</div>
    </DropdownMenuPrimitive.Item>
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
      onSelect,
      ...props
    },
    ref
  ) => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        MenuItemStyles({ variant, size }),
        "relative",
        className
      )}
      checked={checked}
      // Keep the menu open when toggling; preventDefault stops Radix's auto-close.
      onSelect={(event) => {
        event.preventDefault();
        onSelect?.(event);
      }}
      {...props}
    >

      <div className="relative flex   items-center">
        <span className="h-full flex  items-center justify-center">
          {/* Red dot is the default; hidden once the item is checked. */}
          <div className=" flex justify-center items-center h-full  [[data-state=checked]_&]:hidden">
            <div className="w-[16px] h-[16px] rounded-[3px] border border-white-alpha-40 bg-black-alpha-15  group-hover:border-white-700 group-hover:bg-black-alpha-075">
            </div>
          </div>

          {/* Blue dot only renders when the item is checked. */}
          <DropdownMenuPrimitive.ItemIndicator>
            <div className="bg-blue-sparkle-600 flex justify-center items-center w-[16px] h-[16px] rounded-[3px]">

              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5.8339 8.84977L11.1961 3.48755L12.0211 4.3125L5.8339 10.4997L2.12158 6.7874L2.94654 5.96245L5.8339 8.84977Z" fill="#F9F9F9" />
              </svg>
            </div>
          </DropdownMenuPrimitive.ItemIndicator>
        </span> {children}</div>
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
      onSelect,
      ...props
    },
    ref
  ) => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        MenuItemStyles({ variant, size }),
        "relative",
        className
      )}
      // Keep the menu open when selecting; preventDefault stops Radix's auto-close.
      onSelect={(event) => {
        event.preventDefault();
        onSelect?.(event);
      }}
      {...props}
    >
      <div className="relative flex   items-center">
        <span className="h-full left-2 flex h-3.5 w-3.5 items-center justify-center">
          {/* Red dot is the default; hidden once the item is checked. */}
          <div className=" flex justify-center items-center h-full  [[data-state=checked]_&]:hidden">
            <div className="w-[14px] h-[14px] rounded-[100px] border border-white-alpha-40 bg-black-alpha-15  group-hover:border-white-700 group-hover:bg-black-alpha-075">
            </div>
          </div>
          <DropdownMenuPrimitive.ItemIndicator>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 14" fill="none">
              <rect width="14" height="14" rx="7" fill="#005ECC" />
              <rect x="5" y="5" width="4" height="4" rx="2" fill="white" />
            </svg>        </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children} </div>
    </DropdownMenuPrimitive.RadioItem>
  )
);
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

// Item types that should be boxed together when sitting loose in the menu.
// DropdownMenuSub is included because its trigger renders as an inline row
// (the SubContent is portaled out), so it belongs in the box with the items.
const GROUPABLE_TYPES = [
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuSub,
] as const;

const isGroupable = (child: React.ReactNode): child is React.ReactElement =>
  React.isValidElement(child) &&
  (GROUPABLE_TYPES as readonly React.ElementType[]).includes(
    child.type as React.ElementType
  );

// Wraps consecutive runs of loose items in a Boxed DropdownMenuGroup so items
// render inside a container even when the consumer doesn't write one. Labels,
// separators and explicit groups act as boundaries and pass through unchanged.
function autoGroupChildren(children: React.ReactNode): React.ReactNode {
  const out: React.ReactNode[] = [];
  let run: React.ReactElement[] = [];

  const flush = (key: string) => {
    if (run.length === 0) return;
    out.push(
      <DropdownMenuGroup key={key} variant="Boxed">
        {run}
      </DropdownMenuGroup>
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

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "text-content-presentation-global-primary-light typography-body-small-medium px-[12px] pt-1 flex justify-start items-center",
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ltr:ml-auto rtl:mr-auto rtl:ml-0 text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

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
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuItem,
};

// Also export the styling under the historical names so existing imports
// (e.g. `import { dropdownMenuStyles } from "./DropdownMenu"`) keep working.
export { menuContentStyles as dropdownMenuStyles };
export { menuGroupStyles as dropdownMenuGroupStyles };

export const MenuItemStyles = cva(
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

export const menuContentStyles = cva(
  [
    "p-1",
    "rounded-[14px]",
    "min-w-[240px]",
    "outline-none",
    "overflow-scroll",
    // Only animate the OPEN (enter) state. An exit animation on [data-state=closed]
    // holds the old DOM node during close, which breaks the context menu's
    // close/reposition on a second right-click (Radix issue #2572).
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

export const menuGroupStyles = cva(["flex", "flex-col"], {
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
