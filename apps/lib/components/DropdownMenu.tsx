import { VariantProps } from "class-variance-authority";
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";
import {
  MenuItemStyles,
  menuContentStyles,
  menuGroupStyles,
  autoGroupChildren,
  markGroupable,
} from "./menu-shared";


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
        {autoGroup ? autoGroupChildren(children, DropdownMenuGroup) : children}
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
        <i className="ri-arrow-right-s-line text-[16px]"></i></div>

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
        {autoGroup ? autoGroupChildren(children, DropdownMenuGroup) : children}
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

// Tag the components whose rows should be boxed together when sitting loose in
// the menu. A SubTrigger isn't groupable on its own — DropdownMenuSub (which
// contains it) carries the flag, since the SubContent is portaled out and only
// the trigger renders inline. autoGroupChildren reads these flags.
markGroupable(DropdownMenuItem);
markGroupable(DropdownMenuCheckboxItem);
markGroupable(DropdownMenuRadioItem);
markGroupable(DropdownMenuSub);

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
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
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

// Re-export shared menu styling under the historical names so existing
// imports (e.g. `import { MenuItemStyles } from "./DropdownMenu"`) keep working.
export { MenuItemStyles };
export { menuContentStyles as dropdownMenuStyles };
export { menuGroupStyles as dropdownMenuGroupStyles };
