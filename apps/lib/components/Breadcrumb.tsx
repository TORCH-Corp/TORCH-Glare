"use client";

import React, { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import type { Themes } from "../utils/types";

// ============================================================================
// Breadcrumb Root
// ============================================================================

interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  theme?: Themes;
  separator?: React.ReactNode;
}

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, theme, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      data-theme={theme}
      className={cn("flex", className)}
      {...props}
    />
  )
);
Breadcrumb.displayName = "Breadcrumb";

// ============================================================================
// Breadcrumb List
// ============================================================================

const breadcrumbListStyles = cva(
  [
    "flex flex-wrap items-center gap-1.5",
    "break-words",
  ],
  {
    variants: {
      size: {
        S: ["text-[12px]", "gap-1"],
        M: ["text-[14px]", "gap-1.5"],
        L: ["text-[16px]", "gap-2"],
      },
    },
    defaultVariants: {
      size: "M",
    },
  }
);

interface BreadcrumbListProps
  extends React.ComponentPropsWithoutRef<"ol">,
    VariantProps<typeof breadcrumbListStyles> {
  theme?: Themes;
}

const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, size, theme, ...props }, ref) => (
    <ol
      ref={ref}
      data-theme={theme}
      className={cn(breadcrumbListStyles({ size }), className)}
      {...props}
    />
  )
);
BreadcrumbList.displayName = "BreadcrumbList";

// ============================================================================
// Breadcrumb Item
// ============================================================================

const BreadcrumbItem = forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

// ============================================================================
// Breadcrumb Link
// ============================================================================

const breadcrumbLinkStyles = cva(
  [
    "inline-flex items-center",
    "transition-colors duration-200 ease-in-out",
    "font-medium",
    "hover:underline",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-border-presentation-state-focus",
    "focus-visible:rounded-[2px]",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          "text-content-presentation-global-secondary",
          "hover:text-content-presentation-global-primary",
        ],
        SystemStyle: [
          "text-content-system-global-secondary",
          "hover:text-content-system-global-primary",
        ],
      },
    },
    defaultVariants: {
      variant: "PresentationStyle",
    },
  }
);

interface BreadcrumbLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    VariantProps<typeof breadcrumbLinkStyles> {
  asChild?: boolean;
  theme?: Themes;
}

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild, className, variant, theme, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref}
        data-theme={theme}
        className={cn(breadcrumbLinkStyles({ variant }), className)}
        {...props}
      />
    );
  }
);
BreadcrumbLink.displayName = "BreadcrumbLink";

// ============================================================================
// Breadcrumb Page (Current page - not a link)
// ============================================================================

const breadcrumbPageStyles = cva(
  [
    "inline-flex items-center",
    "font-medium",
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
      },
    },
    defaultVariants: {
      variant: "PresentationStyle",
    },
  }
);

interface BreadcrumbPageProps
  extends React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof breadcrumbPageStyles> {
  theme?: Themes;
}

const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, variant, theme, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      data-theme={theme}
      className={cn(breadcrumbPageStyles({ variant }), className)}
      {...props}
    />
  )
);
BreadcrumbPage.displayName = "BreadcrumbPage";

// ============================================================================
// Breadcrumb Separator
// ============================================================================

const breadcrumbSeparatorStyles = cva(
  [
    "flex items-center justify-center",
    "[&_i]:text-[12px]",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          "text-content-presentation-global-secondary",
        ],
        SystemStyle: [
          "text-content-system-global-secondary",
        ],
      },
    },
    defaultVariants: {
      variant: "PresentationStyle",
    },
  }
);

interface BreadcrumbSeparatorProps
  extends React.ComponentPropsWithoutRef<"li">,
    VariantProps<typeof breadcrumbSeparatorStyles> {
  theme?: Themes;
}

const BreadcrumbSeparator = forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ className, variant, theme, children, ...props }, ref) => (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      data-theme={theme}
      className={cn(breadcrumbSeparatorStyles({ variant }), className)}
      {...props}
    >
      {children ?? <i className="ri-arrow-right-s-line" />}
    </li>
  )
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

// ============================================================================
// Breadcrumb Ellipsis (For collapsed items)
// ============================================================================

const breadcrumbEllipsisStyles = cva(
  [
    "flex items-center justify-center",
    "w-6 h-6",
    "rounded-[4px]",
    "cursor-pointer",
    "transition-colors duration-200 ease-in-out",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          "text-content-presentation-global-secondary",
          "hover:bg-background-presentation-action-hover",
          "hover:text-content-presentation-action-hover",
        ],
        SystemStyle: [
          "text-content-system-global-secondary",
          "hover:bg-background-system-action-secondary-hover",
          "hover:text-content-system-action-secondary-hover",
        ],
      },
    },
    defaultVariants: {
      variant: "PresentationStyle",
    },
  }
);

interface BreadcrumbEllipsisProps
  extends React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof breadcrumbEllipsisStyles> {
  theme?: Themes;
}

const BreadcrumbEllipsis = forwardRef<HTMLSpanElement, BreadcrumbEllipsisProps>(
  ({ className, variant, theme, ...props }, ref) => (
    <span
      ref={ref}
      role="presentation"
      aria-hidden="true"
      data-theme={theme}
      className={cn(breadcrumbEllipsisStyles({ variant }), className)}
      {...props}
    >
      <i className="ri-more-line" />
      <span className="sr-only">More</span>
    </span>
  )
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

// ============================================================================
// Exports
// ============================================================================

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};

export {
  breadcrumbListStyles,
  breadcrumbLinkStyles,
  breadcrumbPageStyles,
  breadcrumbSeparatorStyles,
  breadcrumbEllipsisStyles,
};
