"use client";

import React, { forwardRef } from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

// ============================================================================
// Tabs Root
// ============================================================================

interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  theme?: Themes;
}

const Tabs = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ className, theme, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    data-theme={theme}
    className={cn("flex flex-col", className)}
    {...props}
  />
));
Tabs.displayName = "Tabs";

// ============================================================================
// Tabs List (Container for triggers)
// ============================================================================

const tabsListStyles = cva(
  [
    "inline-flex items-center justify-start",
    "transition-all duration-200 ease-in-out",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          "bg-background-presentation-tab-topbar-primary",
          "border-b border-border-presentation-global-primary",
          "p-1 gap-1",
        ],
        SystemStyle: [
          "bg-background-system-body-secondary",
          "border-b border-border-system-global-primary",
          "p-1 gap-1",
        ],
        Underline: [
          "bg-transparent",
          "border-b border-border-presentation-global-primary",
          "gap-2",
        ],
        Pills: [
          "bg-background-presentation-form-field-primary",
          "rounded-[6px]",
          "p-1 gap-1",
        ],
      },
      size: {
        S: ["h-[30px]"],
        M: ["h-[36px]"],
        L: ["h-[42px]"],
      },
    },
    defaultVariants: {
      variant: "PresentationStyle",
      size: "M",
    },
  }
);

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListStyles> {
  theme?: Themes;
}

const TabsList = forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, size, theme, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-theme={theme}
    className={cn(tabsListStyles({ variant, size }), className)}
    {...props}
  />
));
TabsList.displayName = "TabsList";

// ============================================================================
// Tabs Trigger (Individual tab button)
// ============================================================================

const tabsTriggerStyles = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "typography-body-small-medium",
    "transition-all duration-200 ease-in-out",
    "focus-visible:outline-none",
    "disabled:pointer-events-none",
    "disabled:text-content-presentation-state-disabled",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          "px-3 rounded-[4px]",
          "text-content-presentation-global-secondary",
          "hover:bg-background-presentation-tab-topbar-hover",
          "hover:text-content-presentation-tab-action-hover",
          "data-[state=active]:bg-background-presentation-tab-topbar-selected",
          "data-[state=active]:text-content-presentation-tab-action-selected",
        ],
        SystemStyle: [
          "px-3 rounded-[4px]",
          "text-content-presentation-global-secondary",
          "hover:bg-background-presentation-action-hover",
          "hover:text-content-presentation-action-hover",
          "data-[state=active]:bg-background-presentation-action-hover",
          "data-[state=active]:text-content-presentation-action-hover",
        ],
        Underline: [
          "px-3 pb-2 -mb-[1px]",
          "text-content-presentation-global-secondary",
          "border-b-2 border-transparent",
          "hover:text-content-presentation-global-primary",
          "hover:border-border-presentation-tab-topbar-hover",
          "data-[state=active]:text-content-presentation-global-primary",
          "data-[state=active]:border-border-presentation-state-focus",
        ],
        Pills: [
          "px-3 rounded-[4px]",
          "text-content-presentation-global-secondary",
          "hover:text-content-presentation-tab-action-hover",
          "data-[state=active]:bg-background-presentation-action-hover",
          "data-[state=active]:text-content-presentation-action-hover",
        ],
      },
      size: {
        S: ["h-[22px]", "text-[12px]"],
        M: ["h-[28px]", "text-[14px]"],
        L: ["h-[34px]", "text-[16px]"],
      },
    },
    defaultVariants: {
      variant: "PresentationStyle",
      size: "M",
    },
  }
);

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerStyles> {
  theme?: Themes;
}

const TabsTrigger = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, size, theme, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-theme={theme}
    className={cn(tabsTriggerStyles({ variant, size }), className)}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

// ============================================================================
// Tabs Content (Panel content for each tab)
// ============================================================================

const tabsContentStyles = cva(
  [
    "mt-2",
    "focus-visible:outline-none",
    "data-[state=inactive]:hidden",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          "text-content-presentation-global-primary",
        ],
        SystemStyle: [
          "text-content-system-global-primary",
        ],
        Underline: [
          "text-content-presentation-global-primary",
        ],
        Pills: [
          "text-content-presentation-global-primary",
        ],
      },
    },
    defaultVariants: {
      variant: "PresentationStyle",
    },
  }
);

interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    VariantProps<typeof tabsContentStyles> {
  theme?: Themes;
}

const TabsContent = forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, variant, theme, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-theme={theme}
    className={cn(tabsContentStyles({ variant }), className)}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

// ============================================================================
// Exports
// ============================================================================

export { Tabs, TabsList, TabsTrigger, TabsContent };
export { tabsListStyles, tabsTriggerStyles, tabsContentStyles };
