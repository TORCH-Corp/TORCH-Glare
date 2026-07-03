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

// Inner row: order is reversed for "detail" so the badge ends up on the right.
const rowStyles = cva(["flex", "items-center"], {
  variants: {
    variant: {
      new: "flex-row",
      edit: "flex-row",
      detail: "flex-row-reverse",
    },
  },
  defaultVariants: {
    variant: "new",
  },
});

// Colored pill holding `label`.
const badgeStyles = cva(
  [
    "flex",
    "h-8",
    "items-center",
    "justify-center",
    "gap-2.5",
    "rounded-lg",
    "px-1",
  ],
  {
    variants: {
      variant: {
        new: "bg-blue-sparkle-alpha-50",
        edit: "bg-orange-alpha-50",
        detail: "bg-white-alpha-30",
      },
    },
    defaultVariants: {
      variant: "new",
    },
  },
);

// Text inside the colored pill.
const badgeTextStyles = cva(
  [
    "font-sans",
    "text-[28px]",
    "font-[510]",
    "leading-normal",
    "uppercase",
    "[font-feature-settings:'cv05'_on]",
  ],
  {
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
  },
);

interface HeaderBarProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof rowStyles> {
  theme?: Themes;
  /** The colored emphasis pill text. */
  label: string;
  /** The plain text. */
  title: string;
}

const HeaderBar = forwardRef<HTMLDivElement, HeaderBarProps>(
  ({ variant = "new", label, title, theme, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-theme={theme}
        className={cn(
          "inline-flex flex-col items-start rounded-[14px] border border-black-600 bg-black-1000 p-1.5 shadow-[0_0_32px_2px_rgba(0,0,0,0.05),0_0_32px_2px_rgba(0,0,0,0.05)]",
          className,
        )}
        {...props}
      >
        <div className={cn(rowStyles({ variant }))}>
          <div className={cn(badgeStyles({ variant }))}>
            <p className={cn(badgeTextStyles({ variant }))}>{label}</p>
          </div>
          <div className="flex h-8 items-center justify-center px-1.5">
            <p className="font-sans text-[28px] font-[510] leading-normal uppercase text-white-00 [font-feature-settings:'cv05'_on]">
              {title}
            </p>
          </div>
        </div>
      </div>
    );
  },
);

HeaderBar.displayName = "HeaderBar";

export default HeaderBar;
export { HeaderBar };
