import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const titleBadge = cva(
  "flex pt-2 pb-2 pl-[16px] pr-[22px] justify-center items-center gap-[6px] rounded-[10px] self-start typography-headers-medium-medium text-[#F4F4F4]",
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

const body = cva("flex w-full flex-col", {
  variants: {
    variant: {
      Default: "px-[42px] gap-[2px]",
      // Full bleed, with the rule that separates the header from the table.
      Table: "mt-[6px] border-t border-border-presentation-global-primary overflow-hidden",
    },
  },
  defaultVariants: { variant: "Default" },
});

const rail = cva("flex w-full min-w-[300px] flex-col items-start", {
  variants: {
    variant: {
      // Hairline between each direct child (form rows).
      Default: "divide-y divide-gray-300",
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
