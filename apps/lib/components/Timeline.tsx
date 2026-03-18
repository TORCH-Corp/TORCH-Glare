import React, { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

// ─── Timeline Root ───────────────────────────────────────────────────────────

const timelineStyles = cva(["flex gap-0"], {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row items-start",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

interface TimelineProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineStyles> {
  theme?: Themes;
}

const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, orientation, theme, ...props }, ref) => (
    <div
      ref={ref}
      data-theme={theme}
      data-orientation={orientation ?? "vertical"}
      className={cn(timelineStyles({ orientation }), className)}
      {...props}
    />
  )
);
Timeline.displayName = "Timeline";

// ─── Timeline Item ───────────────────────────────────────────────────────────

const timelineItemStyles = cva(["flex group/item"], {
  variants: {
    orientation: {
      vertical: "flex-row gap-3",
      horizontal: "flex-col items-center gap-3",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

interface TimelineItemProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
}

const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <div
      ref={ref}
      data-orientation={orientation}
      className={cn(timelineItemStyles({ orientation }), className)}
      {...props}
    />
  )
);
TimelineItem.displayName = "TimelineItem";

// ─── Timeline Indicator ──────────────────────────────────────────────────────

const indicatorStyles = cva(
  [
    "flex items-center justify-center shrink-0 rounded-full",
    "border",
    "transition-all duration-200 ease-in-out",
    "[&_i]:leading-none [&_i]:flex [&_i]:items-center [&_i]:justify-center",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-background-presentation-action-secondary",
          "border-border-presentation-action-primary",
          "text-content-presentation-action-light-primary",
        ],
        active: [
          "bg-background-presentation-state-information-primary",
          "border-border-presentation-state-focus",
          "text-content-presentation-state-information",
        ],
        completed: [
          "bg-background-presentation-state-success-primary",
          "border-border-presentation-state-success",
          "text-content-presentation-state-success",
        ],
        error: [
          "bg-background-presentation-state-negative-primary",
          "border-border-presentation-state-negative",
          "text-content-presentation-state-negative",
        ],
        warning: [
          "bg-background-presentation-state-warning-primary",
          "border-border-presentation-state-warning",
          "text-content-presentation-state-warning",
        ],
      },
      size: {
        S: "w-[22px] h-[22px] [&_i]:text-[12px]",
        M: "w-[28px] h-[28px] [&_i]:text-[14px]",
        L: "w-[34px] h-[34px] [&_i]:text-[16px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "M",
    },
  }
);

interface TimelineIndicatorProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof indicatorStyles> {
  icon?: ReactNode;
}

const TimelineIndicator = forwardRef<HTMLDivElement, TimelineIndicatorProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => {
    const renderContent = () => {
      if (icon) return icon;
      if (children) return children;
      if (variant === "completed") return <i className="ri-check-line" />;
      if (variant === "error") return <i className="ri-close-line" />;
      if (variant === "warning") return <i className="ri-alert-line" />;
      return <span className="block w-[6px] h-[6px] rounded-full bg-current" />;
    };

    return (
      <div
        ref={ref}
        className={cn(indicatorStyles({ variant, size }), className)}
        {...props}
      >
        {renderContent()}
      </div>
    );
  }
);
TimelineIndicator.displayName = "TimelineIndicator";

// ─── Timeline Separator (the connecting line) ────────────────────────────────

const separatorStyles = cva(
  [
    "bg-border-presentation-global-primary",
    "transition-all duration-200 ease-in-out",
  ],
  {
    variants: {
      orientation: {
        vertical: "w-[1px] flex-1 min-h-[24px] mx-auto",
        horizontal: "h-[1px] flex-1 min-w-[24px] my-auto",
      },
      active: {
        true: "bg-border-presentation-state-focus",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      active: false,
    },
  }
);

interface TimelineSeparatorProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorStyles> {}

const TimelineSeparator = forwardRef<HTMLDivElement, TimelineSeparatorProps>(
  ({ className, orientation = "vertical", active, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(separatorStyles({ orientation, active }), className)}
      {...props}
    />
  )
);
TimelineSeparator.displayName = "TimelineSeparator";

// ─── Timeline Connector (indicator + line container) ─────────────────────────

interface TimelineConnectorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal";
}

const TimelineConnector = forwardRef<HTMLDivElement, TimelineConnectorProps>(
  ({ className, orientation = "vertical", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center",
        orientation === "vertical"
          ? "flex-col"
          : "flex-row",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
TimelineConnector.displayName = "TimelineConnector";

// ─── Timeline Content ────────────────────────────────────────────────────────

interface TimelineContentProps extends HTMLAttributes<HTMLDivElement> {}

const TimelineContent = forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-1 pb-6 pt-[2px]",
        "group-last/item:pb-0",
        className
      )}
      {...props}
    />
  )
);
TimelineContent.displayName = "TimelineContent";

// ─── Timeline Heading ────────────────────────────────────────────────────────

interface TimelineHeadingProps extends HTMLAttributes<HTMLDivElement> {}

const TimelineHeading = forwardRef<HTMLDivElement, TimelineHeadingProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "typography-body-medium-medium text-content-presentation-global-primary",
        className
      )}
      {...props}
    />
  )
);
TimelineHeading.displayName = "TimelineHeading";

// ─── Timeline Description ────────────────────────────────────────────────────

interface TimelineDescriptionProps extends HTMLAttributes<HTMLDivElement> {}

const TimelineDescription = forwardRef<HTMLDivElement, TimelineDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "typography-body-small-regular text-content-presentation-global-secondary",
        className
      )}
      {...props}
    />
  )
);
TimelineDescription.displayName = "TimelineDescription";

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
  Timeline,
  TimelineItem,
  TimelineIndicator,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineHeading,
  TimelineDescription,
  timelineStyles,
  indicatorStyles,
  separatorStyles,
};
