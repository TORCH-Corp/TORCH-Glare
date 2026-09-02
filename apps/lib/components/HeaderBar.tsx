import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";

/**
 * HeaderBar
 *
 * A variant-driven header chip showing two text pieces inside a single
 * rounded container:
 *  - `label` -> the colored emphasis pill (BADGE piece)
 *  - `title` -> the plain text (PLAIN piece)
 *
 * The `variant` controls BOTH the colors AND the DOM order:
 *  - "new"  / "edit"  -> [badge(label)] [plain(title)]   (badge on the LEFT)
 *  - "detail"         -> [plain(title)] [badge(label)]    (badge on the RIGHT)
 *
 * Example usage:
 *  - new:    <HeaderBar variant="new"    label="New"   title="sales iNVOICE" />
 *  - edit:   <HeaderBar variant="edit"   label="edit"  title="sales iNVOICE" />
 *  - detail: <HeaderBar variant="detail" label="de-344" title="sales iNVOICE" />
 *            (renders plain "sales iNVOICE" on the LEFT, colored "de-344" on the RIGHT)
 */

// 28px / weight 510 — the design's `Font/Size/Display/Medium`, which is exactly what this class
// carries. Shared by the badge and the plain title so the two pieces cannot drift apart.
const headerTextStyles = "typography-display-medium-medium uppercase [font-feature-settings:'cv05'_on]";

// Colored pill holding `label`. 32px tall, 4px side padding, 8px radius — Figma `Header.Badge`.
const badgeStyles = cva(["flex", "h-8", "items-center", "justify-center", "rounded-lg", "px-1"], {
  variants: {
    variant: {
      new: "bg-blue-sparkle-alpha-50",
      edit: "bg-orange-alpha-50",
      // `White Alpha/15`, not /30 — the detail chip is the faintest of the three.
      detail: "bg-white-alpha-15",
    },
  },
  defaultVariants: {
    variant: "new",
  },
});

// Text inside the colored pill.
const badgeTextStyles = cva([headerTextStyles], {
  variants: {
    variant: {
      new: "text-blue-sparkle-200",
      edit: "text-orange-200",
      detail: "text-white-00",
    },
  },
  defaultVariants: {
    variant: "new",
  },
});

interface HeaderBarProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeStyles> {
  theme?: Themes;
  /** The colored emphasis pill text. */
  label: string;
  /** The plain text. */
  title: string;
}

const HeaderBar = forwardRef<HTMLDivElement, HeaderBarProps>(
  ({ variant = "new", label, title, theme, className, ...props }, ref) => {
    const badge = (
      <div className={cn(badgeStyles({ variant }))}>
        <p className={cn(badgeTextStyles({ variant }))}>{label}</p>
      </div>
    );

    // The plain title sits in its own 32px box with 6px side padding — that padding, not a row
    // `gap`, is what separates it from the badge (matching the design's `padding` frame).
    const plain = (
      <div className="flex h-8 items-center justify-center px-1.5">
        <p className={cn(headerTextStyles, "text-white-00")}>{title}</p>
      </div>
    );

    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "inline-flex flex-col items-start overflow-hidden rounded-[14px] border border-black-600 bg-black-1000 p-1.5 shadow-[0_0_32px_2px_rgba(0,0,0,0.05),0_0_32px_2px_rgba(0,0,0,0.05)]",
          className,
        )}
        {...props}
      >
        {/* `detail` genuinely swaps the two children rather than using `flex-row-reverse`. The
            visual result is the same in LTR, but reversing the row would flip the pair the wrong
            way under `dir="rtl"` and would read out of order to a screen reader. */}
        <div className="flex items-center">
          {variant === "detail" ? (
            <>
              {plain}
              {badge}
            </>
          ) : (
            <>
              {badge}
              {plain}
            </>
          )}
        </div>
      </div>
    );
  },
);

HeaderBar.displayName = "HeaderBar";

export default HeaderBar;
export { HeaderBar };
