import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { horizontalScrollerStyles } from "../utils/scroller";

// LOCAL PATCH (Contact Center): the pill's side padding is asymmetric (16 leading / 22 trailing),
// so it must be logical — `ps`/`pe` rather than `pl`/`pr`. This pill heads every section card, so
// mirrored the wrong way it reads as a systematic misalignment across the whole page.
const titleBadge = cva(
  "flex pt-2 pb-2 ps-[16px] pe-[22px] justify-center items-center gap-[6px] rounded-[10px] self-start typography-headers-medium-medium text-[#F4F4F4]",
  {
    variants: {
      color: {
        Blue: "bg-blue-sparkle-900",
        Yellow: "bg-yellow-950",
        Green: "bg-green-cyan-900",
        Red: "bg-medium-red-900",
        Orange: "bg-red-orange-900",
        Purple: "bg-violet-900",
        Pink: "bg-medium-violet-red-900",
        // Per Figma (`FormHeader10`, Color=Gray), which pairs two *variables*: the pill is
        // `background/presentation/button/primary` and its label `content/presentation/global/
        // primary-inverse`. They invert together — a light pill with dark text in the dark theme,
        // dark pill with white text in the light one — so the text token has to ride along on the
        // variant. It overrides the base `text-[#F4F4F4]` because `titleBadge` goes through `cn`
        // (tailwind-merge) below; the other seven are dark palette chips that still want that base.
        //
        // This previously read `bg-background-presentation-badge-gray`, which is not a token at all:
        // every badge colour has `-solid`/`-subtle` and none has a bare name, so the utility was
        // never generated and a Gray badge painted no background whatsoever.
        Gray: "bg-background-presentation-button-primary text-content-presentation-global-primary-inverse",
      },
    },
    defaultVariants: { color: "Blue" },
  },
);

const container = cva(
  "flex w-full px-0 flex-col rounded-[16px] bg-background-presentation-form-base shadow-[0_0_32px_2px_rgba(0,0,0,0.05)]",
  {
    variants: {
      variant: {
        Default: "pt-[6px] pb-[24px]",
        // No bottom padding — the table's end-action row is the last element and meets
        // the card edge; `overflow-hidden` clips it to the 16px radius.
        Table: "pt-[6px] pb-0 overflow-hidden",
      },
    },
    defaultVariants: { variant: "Default" },
  },
);

const header = cva("flex px-[6px] justify-between gap-3", {
  variants: {
    variant: {
      Default: "items-center",
      Table: "items-start",
    },
  },
  defaultVariants: { variant: "Default" },
});

// LOCAL PATCH (Contact Center): the body is the section's horizontal scrollport.
//
// `Table` renders `overflow-visible w-auto` (so its sticky header can reach a real scrollport), so
// a table wider than its card does not clip or scroll itself — it widens the card, and then the
// page. Only one call site in the app wraps its table in `TableScroller`; the rest drop a bare
// `<Table>` straight into a section. Owning the scroll here contains all of them at once, and
// replaces the `Table` variant's old `overflow-hidden`, which truncated instead of scrolling.
//
// `overflow-y-hidden` is required, not decorative: CSS computes `overflow-y: visible` to `auto`
// whenever `overflow-x` is not `visible`, so without it every section grows a spurious vertical
// scrollbar. The body is content-height, so nothing is clipped vertically. Same reasoning, and the
// same scrollbar styling, as `TableScroller`.
//
// The cost: a scrollport is the containing block for `position: sticky`, so a `<Table>`'s sticky
// header inside a section now pins to a box that never scrolls vertically — i.e. it stops
// sticking. Sections hold short tables, and in `variant="Table"` those headers were already inert
// under the old `overflow-hidden`.
const body = cva(`flex w-full flex-col ${horizontalScrollerStyles}`, {
  variants: {
    variant: {
      Default: "px-[42px] gap-[2px]",
      // Full bleed, with the rule that separates the header from the table.
      Table: "mt-[6px] border-t border-border-presentation-global-primary",
    },
  },
  defaultVariants: { variant: "Default" },
});

const rail = cva("flex w-full min-w-[300px] flex-col items-start", {
  variants: {
    variant: {
      // Hairline between each direct child (form rows).
      // `divide-gray-300` was a hardcoded light gray, so in the dark theme every row separator
      // rendered as a bright rgb(209,213,219) line. The token follows the theme.
      Default: "divide-y divide-border-presentation-global-primary",
      // The table draws its own row borders — a divide rule would double up on the
      // table / scroller / end-action siblings.
      Table: "",
    },
  },
  defaultVariants: { variant: "Default" },
});

export type SectionColor = NonNullable<VariantProps<typeof titleBadge>["color"]>;
export type SectionVariant = NonNullable<VariantProps<typeof container>["variant"]>;

export interface SectionBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof container> {
  color?: SectionColor;
  title?: ReactNode;
  icon?: ReactNode;
  /** Right-aligned content on the title row — e.g. action buttons. */
  action?: ReactNode;
  containerClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export const SectionBlock = forwardRef<HTMLDivElement, SectionBlockProps>(
  (
    {
      children,
      color,
      variant,
      title,
      action,
      className,
      containerClassName,
      headerClassName,
      bodyClassName,
      icon,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(container({ variant }), className, containerClassName)}
        {...props}
      >
        {(title || action) && (
          <div className={cn(header({ variant }), headerClassName)}>
            {title ? (
              <div className={cn(titleBadge({ color }))}>
                <span className="flex items-center gap-1.5">
                  {icon}
                  {title}
                </span>
              </div>
            ) : (
              <span />
            )}
            {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
          </div>
        )}
        <div className={cn(body({ variant }), bodyClassName)}>
          <div className={cn(rail({ variant }))}>{children}</div>
        </div>
      </div>
    );
  },
);

SectionBlock.displayName = "SectionBlock";
