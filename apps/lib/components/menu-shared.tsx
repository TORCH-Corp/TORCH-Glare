import { cva } from "class-variance-authority";
import * as React from "react";

/**
 * Shared styling + behavior for menu surfaces (DropdownMenu, ContextMenu).
 *
 * Both menus are built on different Radix primitives but render an identical
 * surface — items, groups, the boxed look, and the auto-grouping behavior.
 * Keeping these here means the two stay visually in sync with no duplication.
 */

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
    // close/reposition on a second right-click (Radix issue #2572). Radix's own
    // animation examples never animate the closed state for this reason.
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

/**
 * Marker for components whose rendered row should be boxed together when
 * sitting loose in a menu (items, checkbox/radio items, sub-triggers).
 *
 * Each menu tags its own components with `markGroupable`, and `autoGroupChildren`
 * checks the flag instead of a hardcoded component-reference list — so the
 * single helper works across both DropdownMenu and ContextMenu.
 */
const GROUPABLE_FLAG = "__menuGroupable" as const;

type Groupable = { [GROUPABLE_FLAG]?: boolean };

export function markGroupable<T>(component: T): T {
  (component as T & Groupable)[GROUPABLE_FLAG] = true;
  return component;
}

const isGroupable = (child: React.ReactNode): child is React.ReactElement =>
  React.isValidElement(child) &&
  (child.type as Groupable)?.[GROUPABLE_FLAG] === true;

/**
 * Wraps consecutive runs of loose menu items in a Boxed group so items render
 * inside a container even when the consumer doesn't write one. Non-groupable
 * children (labels, separators, submenus, explicit groups) act as boundaries
 * and pass through unchanged.
 *
 * `Group` is the menu-specific Boxed group component (DropdownMenuGroup /
 * ContextMenuGroup) — passed in so the wrapper matches the calling menu.
 */
export function autoGroupChildren(
  children: React.ReactNode,
  Group: React.ElementType
): React.ReactNode {
  const out: React.ReactNode[] = [];
  let run: React.ReactElement[] = [];

  const flush = (key: string) => {
    if (run.length === 0) return;
    out.push(
      <Group key={key} variant="Boxed">
        {run}
      </Group>
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
