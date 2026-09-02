"use client";

import { forwardRef, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

/**
 * TabSwitch — a segmented control for picking one option from a small set.
 *
 * The classic "List / Cards"-style pill switcher: a rounded track holding one
 * button per option, with the active option rendered as a raised pill. Thin
 * dividers sit between adjacent inactive options (never flanking the active
 * pill). Generic over the option value, controlled via `value`/`onValueChange`,
 * theme-aware, and built on semantic presentation tokens so it adapts to
 * light/dark/default themes.
 */

export interface TabSwitchOption<T extends string = string> {
  value: T;
  label?: ReactNode;
  /** Optional leading icon (Remix `<i>`, lucide svg, etc.). */
  icon?: ReactNode;
  disabled?: boolean;
}

// The track (outer container) holds the segmented buttons.
const trackStyles = cva(
  [
    "inline-flex items-center w-fit",
    "rounded-[10px]",
    "bg-background-presentation-body-primary",
    "shadow-[inset_0_0_4px_0_rgba(0,0,0,0.08)]",
    // Contains the active pill's drop-shadow: it is clipped at the track's rounded edge instead
    // of bleeding onto whatever sits behind the switcher.
    "overflow-hidden",
  ],
  {
    variants: {
      size: {
        S: ["p-[2px]"],
        M: ["p-[2px]"],
        L: ["p-[3px] rounded-[12px]"],
      },
    },
    defaultVariants: { size: "M" },
  },
);

// Each option button. The active pill is raised; inactive options are
// transparent and lighten on hover.
const optionStyles = cva(
  [
    "flex items-center justify-center",
    "rounded-[8px]",
    "font-[510] leading-none",
    "transition-all duration-200 ease-in-out",
    "outline-none",
    "focus-visible:ring-2 focus-visible:ring-border-presentation-state-focus",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        S: ["h-5 px-2 text-[12px]", "[&_svg]:h-3 [&_svg]:w-3", "[&_i]:text-[12px]"],
        M: ["h-6 px-3 text-[14px]", "[&_svg]:h-[14px] [&_svg]:w-[14px]", "[&_i]:text-[14px]"],
        L: ["h-8 px-4 text-[16px] rounded-[10px]", "[&_svg]:h-4 [&_svg]:w-4", "[&_i]:text-[16px]"],
      },
      active: {
        // Active option = a solid raised WHITE pill with dark text, in every
        // theme. The selected-tab design tokens encode a different look per
        // theme (black pill on light, translucent-white on dark), but the
        // intended switcher is always a white pill — and it must stay visible
        // on the always-dark DataViews header bar — so the active pill is
        // theme-independent here. The track + inactive options remain
        // theme-aware.
        true: [
          "bg-white",
          "text-[#1C1D1F]",
          // The border is not in the design. It stays because its transparent twin below is what
          // keeps both states the same width — without it, selecting a tab resizes the pill and
          // shoves its neighbours. The design's own 4px gap absorbs the 1px.
          "border border-black/5",
          // The pill casts outward to look raised; the track clips it (`overflow-hidden` on
          // `trackStyles`) so the shadow never spills past the container.
          "drop-shadow-[0px_0px_5px_rgba(0,0,0,0.25)]",
        ],
        false: [
          "border border-transparent",
          "bg-transparent",
          "text-content-presentation-global-primary",
          "hover:bg-background-presentation-tab-hover",
        ],
      },
    },
    defaultVariants: { size: "M", active: false },
  },
);

interface Props<T extends string = string>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">, VariantProps<typeof trackStyles> {
  options: TabSwitchOption<T>[];
  /** Controlled selected value. */
  value: T;
  onValueChange: (value: T) => void;
  theme?: Themes;
  disabled?: boolean;
}

function TabSwitchInner<T extends string = string>(
  { options, value, onValueChange, size, theme, disabled, className, ...props }: Props<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      role="tablist"
      data-theme={theme}
      className={cn(trackStyles({ size }), className)}
      {...props}
    >
      {options.map((option, idx) => {
        const active = option.value === value;
        const isDisabled = disabled || option.disabled;
        // A divider is drawn only between two INACTIVE options — the raised pill is never flanked
        // by a rule, so the two dividers touching it fade out.
        const prevActive = idx > 0 && options[idx - 1].value === value;
        const showDivider = idx > 0 && !active && !prevActive;

        return (
          <div key={option.value} className="flex items-center">
            {idx > 0 && (
              <div
                aria-hidden
                // The slot is ALWAYS rendered and only its ink changes. Unmounting it instead cost
                // the track 7px (`w-px` + `mx-[3px]`) every time one went away, so picking a tab
                // resized the track and shoved its neighbours — with three options, selecting the
                // middle one dropped both dividers and moved the track 14px.
                className={cn(
                  "h-3 w-px",
                  showDivider ? "bg-border-presentation-action-disabled" : "bg-transparent",
                )}
              />
            )}
            <button
              type="button"
              role="tab"
              aria-selected={active}
              aria-pressed={active}
              disabled={isDisabled}
              onClick={() => onValueChange(option.value)}
              className={cn(optionStyles({ size, active }))}
            >
              {option.icon && (
                <span className="flex items-center justify-center">{option.icon}</span>
              )}
              {option.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// forwardRef loses the generic, so we cast to preserve `<TabSwitch<T> />` typing.
export const TabSwitch = forwardRef(TabSwitchInner) as <T extends string = string>(
  props: Props<T> & { ref?: React.ForwardedRef<HTMLDivElement> },
) => ReturnType<typeof TabSwitchInner>;

// @ts-expect-error — attach displayName to the cast function for devtools.
TabSwitch.displayName = "TabSwitch";
