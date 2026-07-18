"use client";

import React, { forwardRef, useState, ButtonHTMLAttributes, ReactNode } from "react";
import { Badge } from "./Badge";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

export interface ConclusionHeaderProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> {
  /** The header text. */
  label: ReactNode;
  /** Controlled open state. Omit to let the header manage its own (uncontrolled). */
  open?: boolean;
  /** Initial open state when uncontrolled (default `true`). */
  defaultOpen?: boolean;
  /** Called with the next open state when the header is clicked. */
  onOpenChange?: (open: boolean) => void;
  /** Disabled — greys the label and shows a "Disabled" badge instead of the chevron. */
  disabled?: boolean;
  /** Badge text shown when `disabled` (default `"Disabled"`). */
  disabledLabel?: string;
  theme?: Themes;
  className?: string;
}

/**
 * `ConclusionHeader` — a clickable section header, per the "Conclusion-Header-2.0" design.
 *
 * The surfaces are **button overlays**, not an input field: at rest the label stands alone;
 * on hover the row gains a `Button/ContStyle-Hover` pill and the chevron a `Button/Secondary`
 * box. The chevron is hidden at rest while open, shows sideways when closed (left in LTR,
 * right in RTL), and flips to down on hover. When `disabled` the label greys out, truncates
 * at 120px, and a gray-subtle `Badge` replaces the chevron.
 *
 * Direction is inherited from the ambient `dir` — the RTL design variants are the LTR ones
 * mirrored, which the logical properties here produce automatically.
 *
 * Works controlled (`open` + `onOpenChange`) or uncontrolled.
 *
 * ```tsx
 * <ConclusionHeader label="Total" defaultOpen onOpenChange={setOpen} />
 * {open && <section>…</section>}
 * ```
 */
export const ConclusionHeader = forwardRef<HTMLButtonElement, ConclusionHeaderProps>(
  (
    {
      label,
      open: openProp,
      defaultOpen = true,
      onOpenChange,
      disabled = false,
      disabledLabel = "Disabled",
      theme,
      className,
      ...props
    },
    ref,
  ) => {
    // Controlled when `open` is passed; otherwise manage state internally.
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const open = openProp ?? internalOpen;

    const toggle = () => {
      if (disabled) return;
      if (openProp === undefined) setInternalOpen((o) => !o);
      onOpenChange?.(!open);
    };

    return (
      <button
        {...props}
        ref={ref}
        type="button"
        disabled={disabled}
        aria-expanded={disabled ? undefined : open}
        data-theme={theme}
        data-state={open ? "open" : "closed"}
        onClick={toggle}
        className={cn(
          // The hover surface is ONE full-width pill (design: 216×28, r6); the chevron box
          // sits flush inside its trailing end, 6px off the label.
          "group/collapsible flex h-[28px] w-full items-center gap-[6px] overflow-hidden rounded-[6px]",
          "transition-all duration-200 ease-in-out",
          "outline-none focus-visible:ring-1 focus-visible:ring-border-presentation-state-focus",
          disabled
            ? "cursor-not-allowed"
            : // Design insets the label by 4px once the pill appears.
              "cursor-pointer hover:bg-background-presentation-button-contstyle-hover hover:ps-[4px]",
          className,
        )}
      >
        {disabled ? (
          <>
            {/* Design: label shrinks to 120px and the badge sits right beside it, not at the end. */}
            <span
              className={cn(
                "max-w-[120px] shrink-0 truncate text-start",
                "typography-headers-medium-medium",
                "text-content-presentation-global-secondary",
              )}
            >
              {label}
            </span>
            <Badge label={disabledLabel} badgeStyle="subtle" color="gray" size="S" />
          </>
        ) : (
          <>
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-start",
                // Design: En/Header/Medium/Medium — 18px / 510 / 132% / -0.18px.
                "typography-headers-medium-medium",
                "text-content-presentation-global-primary",
              )}
            >
              {label}
            </span>

            {/* Chevron — bare when closed at rest; gains a Button/Secondary box on hover. */}
            <span
              className={cn(
                "flex size-[28px] shrink-0 items-center justify-center rounded-[6px] p-[5px]",
                "text-content-presentation-global-primary",
                "transition-all duration-200 ease-in-out",
                "group-hover/collapsible:bg-background-presentation-button-secondary",
                // Hidden at rest while open; always visible when closed; hover reveals.
                open ? "opacity-0 group-hover/collapsible:opacity-100" : "opacity-100",
              )}
            >
              <i
                className={cn(
                  "ri-arrow-down-s-line text-[18px] transition-transform duration-200 ease-in-out",
                  // Down when open; sideways when closed (left LTR / right RTL); hover → down.
                  !open && "ltr:rotate-90 rtl:-rotate-90 group-hover/collapsible:!rotate-0",
                )}
              />
            </span>
          </>
        )}
      </button>
    );
  },
);

ConclusionHeader.displayName = "ConclusionHeader";
