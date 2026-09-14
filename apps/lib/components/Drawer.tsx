"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../utils/cn";
import { Button } from "./Button";

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root shouldScaleBackground={shouldScaleBackground} {...props} />
);
Drawer.displayName = "Drawer";

const DrawerNested = (props: React.ComponentProps<typeof DrawerPrimitive.NestedRoot>) => (
  <DrawerPrimitive.NestedRoot {...props} />
);
DrawerNested.displayName = "DrawerNested";

const DrawerTrigger = DrawerPrimitive.Trigger;

const DrawerPortal = DrawerPrimitive.Portal;

const DrawerClose = DrawerPrimitive.Close;

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 ", className)} {...props} />
));
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

interface DrawerContentProps extends React.ComponentPropsWithoutRef<
  typeof DrawerPrimitive.Content
> {
  /** @deprecated No effect here — the drag handle is `DrawerPanel`'s `showHandle`. */
  showHandle?: boolean;
  notch?: React.ReactNode;
  /**
   * Which INLINE edge the notch attaches to — `"start"` follows the document direction
   * (left under LTR, right under RTL), so callers never compute `dir` themselves.
   *
   * LOCAL PATCH (Contact Center): these were physical `"left" | "right"` and every consumer
   * passed `isRtl ? "right" : "left"`, duplicating a decision CSS already knows. The
   * alignment (`self-start`) and the corner radii below are logical properties, so the
   * browser mirrors them; only the wedge's SVG path needs a flip, which it does itself with
   * `rtl:-scale-x-100`.
   */
  notchSide?: "start" | "end";
  /**
   * Show the dark "tray" frame (and panel border + inset shadow) around the
   * drawer panel. Defaults to `true`. Set to `false` for bottom-anchored
   * drawers (slide up from below) where a surrounding frame would just look
   * like a stray border at the top.
   */
  framed?: boolean;
  wrapperClassName?: string;
  /**
   * @deprecated Use `className` — it now targets the tray directly. Kept as an
   * alias (merged last, so it still wins) for the pre-`DrawerPanel` API.
   */
  trayClassName?: string;
}

interface DrawerPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Panel border + inset shadow that pairs with the tray's frame. Default `true`. */
  framed?: boolean;
  /** Show the drag handle (bottom sheets). Default `false`. */
  showHandle?: boolean;
}

/**
 * The body surface inside a `DrawerContent` — the same surface a page draws, anchored to an
 * edge, so it follows the app theme.
 *
 * It is an ordinary child, not something the tray paints — so a drawer can hold a panel
 * and something else beside it (e.g. a `FormSummary`), each bringing its own background.
 * Give the tray a `gap-*` to space them.
 *
 * ```tsx
 * <DrawerContent className="gap-[6px]">
 *   <DrawerPanel>…form…</DrawerPanel>
 *   <FormSummary … />
 * </DrawerContent>
 * ```
 */
const DrawerPanel = React.forwardRef<HTMLDivElement, DrawerPanelProps>(
  ({ className, framed = true, showHandle = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // `flex-col` is load-bearing: this panel stacks header / body / footer, and its own
        // `showHandle` centres the drag handle with `mx-auto`, which only centres in a column.
        // It was dropped in 37fddd5 alongside the tray's — on the tray that was deliberate (FormDrawer
        // puts the panel and its summary side by side), here it was not, and every consumer that puts
        // a header/body/footer straight into a panel rendered them in a row.
        //
        // `min-w-0` for the same reason, one axis over: the tray is a row now, so width is its
        // main axis, and a flex item's default `min-width: auto` pins it to its content — a wide
        // form pushed the panel straight out past the tray. `min-h-0` alone covered the old
        // column tray; the row needs both.
        //
        // LOCAL PATCH (Contact Center): the surface was `bg-[#F0F0F0]` with a `#D4D4D4` border —
        // frozen copies of the LIGHT values of the two tokens below — and the panel pinned
        // `data-theme="light"` so its content didn't render white-on-light against them.
        // mapping-color-system-v4 selects on a BARE `[data-theme="light"]`, so that attribute
        // re-declared every colour variable on this element and inherited to the whole subtree:
        // a drawer was immune to the app's theme, and its content was correctly themed to the
        // WRONG theme. A drawer is the same surface as a page, only anchored to an edge, so it
        // reads the same tokens and follows `<html>` like everything else. Light and default
        // resolve to the exact literals removed here (#F0F0F0 / #D4D4D4), so only dark changes.
        "flex flex-1 flex-col gap-2 rounded-t-[16px] p-1 bg-background-presentation-body-primary min-h-0 min-w-0",
        framed &&
          "border border-border-presentation-global-primary shadow-[inset_0_-4px_16px_rgba(0,0,0,0.1)]",
        className,
      )}
      {...props}
    >
      {showHandle && (
        <div className="mx-auto h-2 w-[100px] rounded-full bg-border-presentation-global-primary" />
      )}
      {children}
    </div>
  ),
);
DrawerPanel.displayName = "DrawerPanel";

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      children,
      notch,
      notchSide = "start",
      framed: framedProp,
      wrapperClassName,
      trayClassName,
      // Destructured only to keep it out of `...props`. The handle belongs to `DrawerPanel` now, so
      // this does nothing here — but it was never pulled out either, so it was being spread onto the
      // DOM node and React warned "does not recognize the `showHandle` prop on a DOM element" every
      // time a drawer opened. Kept in the props type rather than removed: consumers still pass it.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      showHandle,
      ...props
    },
    ref,
  ) => {
    const framed = framedProp ?? true;
    return (
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerPrimitive.Content
          ref={ref}
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col items-stretch m-1",
            wrapperClassName,
          )}
          {...props}
        >
          {/* `self-start` / `self-end` are LOGICAL — the browser flips them under
              `dir="rtl"`, so this needs no direction check. */}
          {notch && (
            <div className={notchSide === "end" ? "self-end" : "self-start"}>
              {React.isValidElement(notch)
                ? React.cloneElement(notch as React.ReactElement<{ side?: "start" | "end" }>, {
                    side: notchSide,
                  })
                : notch}
            </div>
          )}
          {/* The tray. It frames and positions, but paints nothing over its children —
              each child brings its own background (see `DrawerPanel`). Supply a `gap-*`
              via `className` when the tray holds more than one. */}
          <div
            className={cn(
              "flex flex-1 min-h-0",
              framed
                ? "p-1.5 bg-black-400 shadow-[0_0_4px_rgba(0,0,0,0.2),0_0_30px_rgba(0,0,0,0.4)]"
                : "p-0",
              // Logical corner radii (`ss` = start-start, `se` = start-end): the squared
              // corner follows the notch under either direction with no JS.
              framed && notch
                ? notchSide === "end"
                  ? "rounded-se-none rounded-ss-[22px] rounded-b-[22px]"
                  : "rounded-ss-none rounded-se-[22px] rounded-b-[22px]"
                : framed
                  ? "rounded-t-[22px]"
                  : "",
              className,
              trayClassName,
            )}
          >
            {children}
          </div>
        </DrawerPrimitive.Content>
      </DrawerPortal>
    );
  },
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-row justify-between items-stretch gap-2 px-1 pt-1", className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const drawerHeaderPane = cva(
  // A deliberately dark pill in every theme — the same slab the page-mode FormHeaderBar draws
  // (FormRenderer/header.tsx). Its fill is a literal on purpose, not a frozen token: it must not
  // follow the panel. So the title/description are forced to light text against it.
  "flex items-center gap-2 rounded-[14px] border p-2 bg-[#131415] border-[#2C2D2E] shadow-[0_0_32px_2px_rgba(0,0,0,0.05)] [&_[data-slot=drawer-title]]:text-white [&_[data-slot=drawer-description]]:text-[#9FA0A1]",
);

const DrawerHeaderTitle = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  // The pane is dark in every theme, so pin dark here: the Buttons and content inside must
  // resolve against THIS slab, not against the panel (which now follows the app theme).
  <div data-theme="dark" className={cn(drawerHeaderPane(), className)} {...props} />
);
DrawerHeaderTitle.displayName = "DrawerHeaderTitle";

const DrawerHeaderActions = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-theme="dark" className={cn(drawerHeaderPane(), "justify-end", className)} {...props} />
);
DrawerHeaderActions.displayName = "DrawerHeaderActions";

const drawerBadge = cva(
  "inline-flex items-center justify-center rounded-[8px] px-1 py-0.5 typography-display-medium-medium uppercase",
  {
    variants: {
      color: {
        Blue: "bg-[rgba(0,117,255,0.5)] text-[#CCE3FF]",
        Green: "bg-[rgba(34,197,94,0.5)] text-[#D1FAE5]",
        Red: "bg-[rgba(239,68,68,0.5)] text-[#FEE2E2]",
        Yellow: "bg-[rgba(234,179,8,0.5)] text-[#FEF3C7]",
        Purple: "bg-[rgba(139,92,246,0.5)] text-[#EDE9FE]",
        Gray: "bg-[rgba(255,255,255,0.15)] text-[#E5E5E5]",
      },
    },
    defaultVariants: { color: "Blue" },
  },
);

interface DrawerBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">, VariantProps<typeof drawerBadge> {}

const DrawerBadge = React.forwardRef<HTMLSpanElement, DrawerBadgeProps>(
  ({ className, color, ...props }, ref) => (
    <span ref={ref} className={cn(drawerBadge({ color }), className)} {...props} />
  ),
);
DrawerBadge.displayName = "DrawerBadge";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

interface DrawerNotchProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Logical edge, mirrored by the browser under `dir="rtl"`. See `notchSide`. */
  side?: "start" | "end";
}

const DrawerNotch = ({ className, children, side = "start", ...props }: DrawerNotchProps) => {
  // Wedge bridges the notch's bottom inline-end corner into the tray's top edge.
  //
  // LOCAL PATCH (Contact Center): both the DOM order and the SVG path used to be picked from a
  // physical left/right. Neither needs to be: the row is `flex-row`, which is direction-aware, so
  // writing {pill}{wedge} already renders wedge-on-the-left under RTL. Only the path's curve is
  // physical, and `rtl:-scale-x-100` mirrors it.
  //
  // That class, not a rule in some stylesheet: an earlier draft of this comment pointed at an
  // `rtl.css` that does not exist in this repo — so under `dir="rtl"` the wedge pointed the wrong
  // way and nothing failed loudly. Keeping the mirror on the element means it travels with the
  // component when a consumer copies it in, which a global stylesheet would not.
  const wedge = (
    <svg
      aria-hidden
      data-drawer-wedge
      width="12"
      height="12"
      viewBox="0 0 12 12"
      className="block shrink-0 self-end rtl:-scale-x-100"
    >
      <path d="M 0 0 L 0 12 L 12 12 A 12 12 0 0 1 0 0 Z" fill="#434446" />
    </svg>
  );

  return (
    <div className="relative flex flex-row items-end">
      {side === "end" && wedge}
      <div
        className={cn(
          "flex flex-row items-center gap-1 rounded-t-[18px] bg-black-400 px-1.5 pt-1.5 pb-1.5",
          className,
        )}
        {...props}
      >
        {children}
      </div>
      {side === "start" && wedge}
    </div>
  );
};
DrawerNotch.displayName = "DrawerNotch";

const DrawerNotchClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <Button
    ref={ref}
    type="button"
    aria-label="Close"
    buttonType="icon"
    size="S"
    variant="PrimeContStyle"
    className={cn(
      // Glare Button (icon, S = 22×22) with the notch's own circular radius + translucent look
      // (S is otherwise rounded-[4px]).
      "!rounded-[13px] bg-white/15 text-white hover:bg-white/25 hover:text-white",
      className,
    )}
    {...props}
  >
    {children ?? <i className="ri-close-fill !text-[14px]" />}
  </Button>
));
DrawerNotchClose.displayName = "DrawerNotchClose";

const drawerNotchPill = cva(
  "inline-flex items-center gap-1 rounded-[16px] px-1.5 py-0.5 typography-body-small-medium text-white transition-colors",
  {
    variants: {
      color: {
        Yellow: "bg-white/15 hover:bg-white/25",
        Blue: "bg-[#005ECC] hover:bg-[#0070E0]",
        Gray: "bg-white/10 hover:bg-white/20",
      },
    },
    defaultVariants: { color: "Yellow" },
  },
);

interface DrawerNotchPillProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    VariantProps<typeof drawerNotchPill> {}

const DrawerNotchPill = React.forwardRef<HTMLButtonElement, DrawerNotchPillProps>(
  ({ className, color, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(drawerNotchPill({ color }), className)}
      {...props}
    >
      {children}
    </button>
  ),
);
DrawerNotchPill.displayName = "DrawerNotchPill";

const DrawerNotchDivider = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div aria-hidden className={cn("h-[18px] w-px bg-white/20", className)} {...props} />
);
DrawerNotchDivider.displayName = "DrawerNotchDivider";

interface DrawerNotchAppProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  name: React.ReactNode;
}

const DrawerNotchApp = ({ className, icon, name, ...props }: DrawerNotchAppProps) => (
  <div className={cn("flex items-center gap-2.5 px-1", className)} {...props}>
    {icon && (
      <div className="flex h-[22px] w-[22px] items-center justify-center overflow-hidden rounded-[5.6px] bg-black shadow-[0_0_4.66px_rgba(0,0,0,0.3),0_0.75px_0.75px_rgba(0,0,0,0.2)]">
        {icon}
      </div>
    )}
    <span className="text-white text-[14px] leading-[1.475]">{name}</span>
  </div>
);
DrawerNotchApp.displayName = "DrawerNotchApp";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    data-slot="drawer-title"
    // Dark text by default — the title usually sits on the light content
    // surface. Inside the dark DrawerHeaderTitle pill it is flipped back to
    // white via a descendant selector on `drawerHeaderPane`.
    className={cn(
      "typography-display-medium-medium uppercase text-content-presentation-global-primary leading-none",
      className,
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    data-slot="drawer-description"
    className={cn(
      "typography-body-small-regular text-content-presentation-action-light-secondary",
      className,
    )}
    {...props}
  />
));
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerNested,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerPanel,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerHeaderActions,
  DrawerBadge,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerNotch,
  DrawerNotchClose,
  DrawerNotchPill,
  DrawerNotchDivider,
  DrawerNotchApp,
};
