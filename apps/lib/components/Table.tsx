"use client";
import * as React from "react";
import { cn } from "../utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import { useRef } from "react";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { useResize } from "../hooks/useResize";

type TableHeadVariantsProps = VariantProps<typeof tableHeadVariants>;

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    theme?: "dark" | "light" | "default";
  }
>(({ className, theme, ...props }, ref) => (
  <table
    data-theme={theme}
    ref={ref}
    className={cn("overflow-hidden w-auto [border-collapse:separate] border-spacing-0", className)}
    {...props}
  >
    {props.children}
  </table>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    // The header band is one continuous bar, not a per-cell background — a background on each
    // `<th>` would paint over the half of the previous column's resize handle that overhangs
    // the boundary.
    className={cn(
      "bg-background-presentation-form-header backdrop-blur-[8px]",
      "shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15)]",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={className} {...props}>
    {props.children}
  </tbody>
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => <tfoot ref={ref} className={cn(className)} {...props} />);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    state?: "delete" | "update" | "add" | "selected" | "open";
  }
>(({ className, state = "", ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      [
        "[&_button]:hover:opacity-100 hover:bg-background-presentation-table-row-hover transition-colors",
        {
          "bg-background-presentation-table-row-negative border-border-presentation-badge-red":
            state === "delete",
        },
        {
          "bg-background-presentation-table-row-information border-border-presentation-badge-navy":
            state === "update",
        },
        {
          "bg-background-presentation-table-row-success border-border-presentation-badge-green":
            state === "add",
        },
        {
          "bg-background-presentation-table-row-selected border-t border-[2px] border-border-presentation-table-selected":
            state === "selected",
        },
        {
          "bg-background-presentation-table-row-hover border-t border-[2px] border-border-presentation-table-dropdown":
            state === "open",
        },
      ],
      className,
    )}
    {...props}
  >
    {props.children}
  </tr>
));
TableRow.displayName = "TableRow";

/** Floor for a drag-resized column, so dragging past the column's own left edge can't invert it. */
const MIN_COLUMN_WIDTH = 40;

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> &
    TableHeadVariantsProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      sortType?: "asc" | "desc" | undefined;
      onSort?: () => void;
      /** Column name for the sort button's accessible label. */
      sortLabel?: string;
      /**
       * Called with the new width (px) while the column is being drag-resized. Pass it to take
       * **control** of the width — the header then renders `style.width` and expects you to
       * feed the new value back. Required whenever the table needs a definite width
       * (`table-layout: fixed`), because only the owner of every column width can total them.
       * Omit for uncontrolled resizing, where the header keeps the width itself.
       */
      onResize?: (width: number) => void;
      /**
       * Classes for the inner layout box (the flex row holding the label and sort toggle).
       * `className` and every other prop go to the `<th>` — reach for this only when you need
       * to restyle the content box itself, e.g. its typography or colour.
       */
      contentClassName?: string;
      isDummy?: boolean;
    }
>(
  (
    {
      className,
      contentClassName,
      children,
      style,
      size = "M",
      disabled,
      sortType,
      onSort,
      sortLabel,
      onResize,
      isDummy,
      ...props
    },
    forwardedRef,
  ) => {
    const headRef = useRef<HTMLTableCellElement>(null);
    const { width, handleStartResize } = useResize(headRef as React.RefObject<HTMLElement>);

    const clampedWidth = width === undefined ? undefined : Math.max(width, MIN_COLUMN_WIDTH);

    React.useEffect(() => {
      if (clampedWidth !== undefined) onResize?.(clampedWidth);
      // `onResize` is intentionally not a dep — callers pass an inline closure, and re-firing
      // on every render would loop.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clampedWidth]);

    // Combine refs using useEffect
    React.useEffect(() => {
      if (!forwardedRef) return;
      if (typeof forwardedRef === "function") forwardedRef(headRef.current);
      else forwardedRef.current = headRef.current;
    }, [forwardedRef]);

    // The width has to land on the `<th>` — that is the element the browser sizes the column
    // from. Written to an inner div (as it once was) it did nothing at all. When `onResize` is
    // given the caller owns the value and feeds it back via `style.width`; otherwise the drag
    // result is applied here directly.
    const resolvedWidth = onResize ? style?.width : (clampedWidth ?? style?.width);

    return (
      <th
        ref={headRef}
        // EVERY caller prop lands here: `className`, `style`, `aria-*` and event handlers
        // alike. They have to share one element — dnd-kit's `useSortable` returns `attributes`
        // (role/tabIndex/aria-*) and `listeners` (onKeyDown/onPointerDown) as a matched pair,
        // and splitting them across the <th> and the inner div left the focusable node with no
        // key handler. Use `contentClassName` to reach the inner box.
        {...props}
        style={{ ...style, width: resolvedWidth }}
        className={cn(
          "relative h-[44px] py-[6px] px-[4px] border-b-[2px] border-border-presentation-table-header",
          className,
        )}
      >
        <div
          className={cn(
            tableHeadVariants({ size, disabled, isDummy }),
            {
              // Only when nothing has sized the column — otherwise this floor would overflow a
              // column narrower than 100px.
              "min-w-[100px]": !isDummy && resolvedWidth === undefined,
            },
            contentClassName,
          )}
        >
          <div
            className={cn("flex min-w-0 items-center justify-between flex-1", {
              "justify-center": isDummy,
            })}
          >
            {children}
            {isDummy || !onSort ? null : (
              <SortButton onSort={onSort} sortType={sortType} label={sortLabel} />
            )}
          </div>
        </div>
        {/* The grab target, straddling the column boundary. `z-10` keeps it above the next
            column's content — it deliberately overhangs by half its width. The drag handlers
            live here, not on the icon: the icon is `opacity-0` until hover, which made the
            8px-wide SVG a near-impossible thing to grab. */}
        <button
          type="button"
          disabled={isDummy}
          aria-label="Resize column"
          // Lets consumers exclude the grip from blanket `[&_button]` rules on a header row.
          data-slot="resize-handle"
          onMouseDown={handleStartResize}
          onTouchStart={handleStartResize}
          className={cn(
            "group/resize absolute top-[50%] translate-y-[-50%] z-10",
            "right-[-4px] rtl:left-[-4px] rtl:right-[unset]",
            // `absolute` already makes this the containing block for the grip icon.
            "flex h-[24px] w-[8px] items-center justify-center cursor-col-resize",
            "disabled:cursor-default",
          )}
        >
          <span className="h-[20px] w-[2px] rounded-full bg-border-presentation-action-primary" />
          <ResizeIcon
            className={cn("group-hover/resize:opacity-100", { "!opacity-0": isDummy })}
          />
        </button>
      </th>
    );
  },
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    isDummy?: boolean;
    childrenClassName?: string;
    className?: string;
    /**
     * Minimum width of the cell's content box, in px. Defaults to 200 — pass `0` when the
     * column width is driven by the caller (e.g. `FormBuilder.Table`'s `column.width`),
     * otherwise this floor silently overrides any narrower column.
     */
    minWidth?: number;
    /**
     * Fade the last 25% of the cell's content, to signal text clipped by the column width.
     * Defaults to `true`. Set `false` for cells holding a **control** rather than text — the
     * fade washes out whatever sits at the right edge (a Select's chevron, a date button).
     * The built-in `:has(input)` escape hatch can't catch those, since a Radix trigger is a
     * `<button>`, not an `<input>`.
     */
    fade?: boolean;
  }
>(({ className, childrenClassName, isDummy, minWidth = 200, fade = true, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      [
        "h-[50px] text-content-presentation-action-light-primary",
        "typography-body-small-regular relative",
        "border-r  border-b border-border-presentation-table-header px-[8px] rtl:border-l rtl:border-r-0",
        "break-all",
      ],
      className,
    )}
    {...props}
  >
    <div
      style={isDummy ? undefined : { minWidth }}
      className={cn(
        "flex justify-start items-center gap-1",
        // This div hugs the control exactly — same height, and the control is `w-full` — so
        // `overflow-hidden` clips every side of a drop shadow drawn on it. Text cells still
        // need the crop to feed the fade gradient; control cells need the shadow to escape.
        fade ? "overflow-hidden" : "overflow-visible",
        // Never fade a dummy cell — its content is a centred checkbox or drag handle, not
        // clippable text.
        fade &&
          !isDummy && [
            "[mask-image:linear-gradient(to_right,black_0%,black_0%,black_75%,transparent_100%)]",
            "rtl:[mask-image:linear-gradient(to_left,black_0%,black_0%,black_75%,transparent_100%)]",
            "[&:has(input)]:[mask-image:none]",
          ],
        { "min-w-fit justify-center": isDummy },
        childrenClassName,
      )}
    >
      {props.children}
    </div>
  </td>
));
TableCell.displayName = "TableCell";

const TableCheckbox = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    id: string;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- id destructured to exclude it from the props spread onto Checkbox
>(({ className, id, ...props }, ref) => {
  return (
    <div className={cn(["flex items-center justify-center"], className)}>
      <Checkbox {...props} ref={ref} size="S" />
    </div>
  );
});
TableCheckbox.displayName = "TableCheckbox";

/**
 * The full-width action bar that sits **below** a table — e.g. "＋ Add New".
 *
 * Deliberately not a `<tr>`: it renders as a sibling of the table's horizontal scroll
 * container, so it stays put while the columns scroll sideways under it. Use
 * `TableFooterButton` instead when the action must scroll with the grid.
 */
const TableEndAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "flex h-[40px] w-full items-center justify-start gap-[8px] px-[8px]",
      // No border. Figma's Table-End-Action-1.0 has none — it rounds its own bottom corners
      // so it can sit flush on the card edge. A rule here is invisible against the card until
      // the hover fill lands behind it, at which point it reads as a hard line cutting across
      // the bar.
      "rounded-bl-[16px] rounded-br-[16px]",
      "typography-body-medium-semibold text-content-presentation-action-light-primary",
      // NB: the "acton" spelling is the token that actually exists; the correctly-spelled
      // `…table-action-hover` is defined nowhere and would be a dead class.
      "transition-[background-color,box-shadow] hover:bg-background-presentation-table-acton-hover",
      // Hover draws a ring rather than a border: it renders inset, so it costs no layout and
      // can't push the bar's 40px box around the way a border would.
      "hover:ring-2 hover:ring-inset hover:ring-border-presentation-table-action-hover",
      "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-presentation-state-focus",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "[&_i]:text-[20px]",
      className,
    )}
    {...props}
  >
    {children}
  </button>
));
TableEndAction.displayName = "TableEndAction";

/**
 * Horizontal scroll container for a table — the 14px scroller row from the design,
 * with the thin track that thickens and turns blue on hover.
 */
const TableScroller = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "w-full overflow-x-auto overflow-y-hidden",
        "[&::-webkit-scrollbar]:h-[14px]",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:rounded-[7px]",
        "[&::-webkit-scrollbar-thumb]:border-[5px] [&::-webkit-scrollbar-thumb]:border-solid",
        "[&::-webkit-scrollbar-thumb]:border-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-clip-content",
        "[&::-webkit-scrollbar-thumb]:bg-background-presentation-body-scroller-default",
        "[&::-webkit-scrollbar-thumb:hover]:border-[3px]",
        "[&::-webkit-scrollbar-thumb:hover]:bg-background-presentation-body-scroller-hover",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
TableScroller.displayName = "TableScroller";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

const TableFooterButton = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<{
    className?: string;
  }>
>(({ children, className, ...props }, ref) => {
  return (
    <TableRow className={cn("h-[40px] overflow-hidden", className)}>
      <TableCell
        className={
          // `h-[40px]` because the row asks for 40 and body cells default to 50 — the two sit
          // on different elements, so CSS would otherwise take the larger and grow the footer.
          "h-[40px] border-t-2 border-b-2 border-transparent hover:border-border-presentation-table-action-hover  hover:bg-background-presentation-table-acton-hover"
        }
        colSpan={100}
      >
        <button
          ref={ref}
          {...props}
          className={cn(
            "overflow-hidden w-full flex items-center justify-start gap-2 typography-body-medium-semibold [&_i]:text-[20px]",
            className,
          )}
        >
          {children}
        </button>
      </TableCell>
    </TableRow>
  );
});
TableFooterButton.displayName = "TableFooterButton";

const SubTableButton = ({
  isActive,
  className,
  dummy,
}: {
  isActive?: boolean;
  className?: string;
  dummy?: boolean;
}) => {
  return (
    <Button
      className={cn(
        "transition-opacity duration-200 opacity-0  border-none bg-transparent focus:bg-background-presentation-state-information-primary active:bg-background-presentation-state-information-primary",
        {
          "hover:bg-transparent hover:text-black focus:bg-transparent focus:text-black active:bg-transparent active:text-black":
            dummy,
        },
        className,
      )}
      variant={"PrimeStyle"}
      buttonType={"icon"}
    >
      <i
        className={cn(
          "ri-arrow-right-s-line",
          "rtl:rotate-180",
          "transition-transform duration-200",
          { "rotate-90": isActive },
        )}
      ></i>
    </Button>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableCheckbox,
  SubTableButton,
  TableFooterButton,
  TableEndAction,
  TableScroller,
};

interface ResizeIconProps {
  className?: string;
}

/**
 * The grip that appears on hover. Sized to its parent button (8px wide), so it can't spill
 * past the grab target; the button is what deliberately straddles the column boundary.
 */
const ResizeIcon = ({ className }: ResizeIconProps) => {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        "opacity-0 transition-opacity duration-200",
        className,
      )}
      width="8"
      height="30"
      viewBox="0 1 8 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="5" width="8" height="30" rx="3" fill="#3391FF" />
      <circle cx="2.75" cy="15.5" r="0.75" fill="#F9F9F9" />
      <circle cx="5.25" cy="15.5" r="0.75" fill="#F9F9F9" />
      <circle cx="2.75" cy="18.5" r="0.75" fill="#F9F9F9" />
      <circle cx="5.25" cy="18.5" r="0.75" fill="#F9F9F9" />
      <circle cx="2.75" cy="21.5" r="0.75" fill="#F9F9F9" />
      <circle cx="5.25" cy="21.5" r="0.75" fill="#F9F9F9" />
      <circle cx="2.75" cy="24.5" r="0.75" fill="#F9F9F9" />
      <circle cx="5.25" cy="24.5" r="0.75" fill="#F9F9F9" />
    </svg>
  );
};

const SortButton = ({
  onSort,
  sortType,
  label,
}: {
  onSort?: () => void;
  sortType?: "asc" | "desc" | undefined;
  /** What this button sorts — without it the control is an unnamed icon. */
  label?: string;
}) => {
  const next = sortType === "asc" ? "descending" : "ascending";
  return (
    // `type="button"` matters: this table renders inside a <form> (FormBuilder.Table),
    // where an untyped button defaults to submit.
    <button
      type="button"
      // `onClick`, not `onPointerDown`: a button activated from the keyboard fires
      // `click` only, so pointer-down made this mouse-only.
      onClick={onSort}
      aria-label={label ? `Sort by ${label} ${next}` : `Sort ${next}`}
      className={cn("cursor-pointer text-[16px] z-10")}
    >
      {sortType === "asc" ? (
        <i className="ri-arrow-up-line text-border-presentation-state-focus" />
      ) : sortType === "desc" ? (
        <i className="ri-arrow-down-line text-border-presentation-state-focus" />
      ) : (
        <i className="ri-arrow-up-down-line text-content-presentation-global-secondary" />
      )}
    </button>
  );
};

const tableHeadVariants = cva(
  [
    "text-content-presentation-global-primary",
    "px-[8px]",
    "w-full",
    "flex",
    "items-center",
    "justify-center",
    "text-start",
    "bg-transparent",
    "hover:bg-background-presentation-action-hover",
    "hover:text-content-presentation-global-hover",
    "transition-[background-color,color]",
    "duration-200",
    "rounded-[3px]",
  ],
  {
    variants: {
      size: {
        S: "h-[20px] min-w-[20px] typography-body-small-semibold",
        M: "h-[32px] min-w-[32px] typography-body-medium-semibold",
      },
      disabled: {
        true: [
          "bg-background-presentation-table-row-disabled",
          "cursor-not-allowed",
          "hover:bg-background-presentation-table-row-disabled",
          "hover:text-content-presentation-global-primary",
        ],
      },
      isDummy: {
        true: ["hover:bg-transparent", "hover:text-content-presentation-global-primary"],
      },
    },
    defaultVariants: {
      size: "M",
    },
  },
);
