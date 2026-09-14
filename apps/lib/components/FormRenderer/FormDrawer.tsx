"use client";

import { ReactNode } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerNested,
  DrawerPanel,
  DrawerTitle,
  DrawerNotch,
  DrawerNotchClose,
  DrawerNotchDivider,
  DrawerNotchPill,
} from "../Drawer";
import { cn } from "../../utils/cn";
import { FormHeaderBar, type HeaderVariant } from "./header";
// Only for vaul's `direction` — every other mirror below is native CSS. See `slideFrom`.
import { useHtmlDir } from "../../hooks/useHtmlDir";

export interface FormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The `<FormBuilder>` (or any content) to host inside the drawer. */
  children: ReactNode;
  /**
   * The conclusion panel rendered **beside** the form, outside the drawer's scrollable
   * body — typically a `<FormSummary>` reading the same hoisted `form`. `FormDrawer` owns
   * the box around it (full height, shrinkable), which is what lets the panel's own
   * `h-full` and internal scrolling work. The panel sizes itself — a `FormSummary` is
   * 228px wide by default — and brings its own (dark) background.
   */
  summary?: ReactNode;
  /** @deprecated Renamed to `summary`. */
  childrenOutside?: ReactNode;
  /**
   * Plain title text (uppercased) in the header's title pill — also the a11y title.
   * A string, because it renders through the same `HeaderBar` as the page form.
   */
  title?: string;
  /** Badge text in the title pill. Defaults from `variant` (New / Edit / View). */
  badge?: string;
  /** Colored badge variant, matching the page form's header. Default `"new"`. */
  variant?: HeaderVariant;
  /** Action buttons shown on the right of the drawer header (e.g. a Save submit). */
  actions?: ReactNode;
  /**
   * Shows an "Open in new tab" pill in the notch when provided.
   *
   * Prefer `notchActions` (a `FormRenderer.NotchAction` child): the caller owns the label
   * there, so it needs no second prop to be translatable. Kept for callers that only want
   * upstream's single built-in action.
   */
  onOpenInNewTab?: () => void;
  /**
   * Buttons rendered in the notch, authored by the caller.
   *
   * LOCAL PATCH (Contact Center): upstream offers only `onOpenInNewTab` with a hardcoded
   * English label, so a localized app cannot translate it and cannot add a second action.
   * Passing the button itself solves both. Written as `FormRenderer.NotchAction` children
   * and lifted here — see `notch-action.tsx`.
   */
  notchActions?: ReactNode;

  /**
   * LOCAL PATCH (Contact Center): the layout knobs `DrawerContent` already has.
   *
   * Upstream swallowed every one of them, which is why each non-default drawer in this app was
   * hand-rolled instead: a two-field form does not want 1048px, a widget gallery is a bottom
   * sheet, and a detail view brings its own header and scroll container. All optional and all
   * defaulting to the original behaviour, so existing callers are untouched.
   */

  /** Which edge it slides from. `"bottom"` is a sheet; the default follows document direction. */
  side?: "inline-end" | "bottom";
  /**
   * vaul `NestedRoot` — REQUIRED when this drawer opens inside another one, or the two Roots
   * fight over the overlay and the scroll lock. Throws without a parent Drawer in the tree.
   */
  nested?: boolean;
  /** The dark tray frame and the panel's border/inset shadow. Default `true`. */
  framed?: boolean;
  /** Skip the `FormHeaderBar` — for a child that draws its own header. */
  hideHeader?: boolean;
  /** Skip the padded scroll wrapper — for a child that owns its own padding and scrolling. */
  bareBody?: boolean;
  /** sr-only description. vaul warns when a drawer has none. */
  description?: string;
  /** Lands on the positioner: width, height, insets. Replaces the default sizing. */
  wrapperClassName?: string;
  /** Lands on the tray. */
  className?: string;
}

/**
 * A right-anchored Glare drawer for hosting a form. This is a **FormRenderer**
 * concern — `FormBuilder` itself is drawer-unaware (it only displays inputs).
 * Wrap a `<FormBuilder>` in `<FormDrawer>` (and pass `fieldDirection="vertical"`
 * to the form) to show it in a drawer, or let `FormRenderer` do it via
 * `display: "drawer"`.
 *
 * The `wrapperClassName` includes `mt-0 h-auto` to cancel `DrawerContent`'s base
 * bottom-sheet offset (the Glare right-side form-drawer recipe).
 *
 * It owns the arrangement of its two slots: the form goes in a `DrawerPanel` (the light
 * surface), and `summary` sits beside it in the tray with a 6px gutter. The tray itself
 * paints nothing, so each panel brings its own background.
 */
export function FormDrawer({
  open,
  onOpenChange,
  children,
  summary,
  childrenOutside,
  title = "Form",
  badge,
  variant,
  actions,
  onOpenInNewTab,
  notchActions,
  // LOCAL PATCH (Contact Center) — see the props above.
  side = "inline-end",
  nested = false,
  framed = true,
  hideHeader = false,
  bareBody = false,
  description,
  wrapperClassName,
  className,
}: FormDrawerProps) {
  const conclusion = summary ?? childrenOutside;
  const isBottom = side === "bottom";
  // A drawer inside a drawer must be vaul's NestedRoot, which scales the parent behind it.
  const Root = nested ? DrawerNested : Drawer;

  // The ONLY thing that still has to know the direction in JS. Everything visual below is
  // expressed in logical CSS and mirrors itself; but vaul (1.1.2) has no RTL support at all —
  // it computes an inline `transform: translate3d(±Npx,0,0)` from `direction` and keys its drag
  // physics off it. An inline transform cannot be overridden from a stylesheet mid-drag, so this
  // one value must be passed, not styled. Read from <html dir>, so it still follows the document.
  const slideFrom = useHtmlDir() === "rtl" ? "left" : "right";

  return (
    <Root open={open} onOpenChange={onOpenChange} direction={isBottom ? "bottom" : slideFrom}>
      {/* The panel fills the available width (minus the 8px insets), capped at 1048px.
          `gap-[6px]` is the gutter between the form panel and the conclusion beside it. */}
      <DrawerContent
        // Logical: the notch attaches to the inline-start edge, which the browser resolves
        // to left under LTR and right under RTL. No direction check here.
        notchSide="start"
        framed={framed}
        // `end-2` / `start-auto` are logical insets (inset-inline-*), so the panel parks
        // against the inline-end edge in either direction — this used to be two hand-written
        // physical class strings picked by JS.
        //
        // LOCAL PATCH (Contact Center): `inset-x-auto` is load-bearing. `DrawerContent` hardcodes
        // `inset-x-0`, and tailwind-merge's `inset-x` conflict group covers `left`/`right` but NOT
        // `start`/`end` — so `inset-x-0` survives into the class list and was only losing because
        // Tailwind v4 happens to emit `start`/`end` later in the cascade. Every caller inherited
        // that; this stops depending on emit order.
        wrapperClassName={
          wrapperClassName ??
          (isBottom
            ? "inset-x-0 bottom-0 top-auto mt-0 h-auto w-full"
            : "top-2 end-2 bottom-2 inset-x-auto start-auto mt-0 h-auto w-[calc(100vw-1rem)] max-w-[1048px]")
        }
        className={cn("gap-[6px]", className)}
        // LOCAL PATCH (Contact Center): a bottom sheet has no notch. The notch is a tab on the
        // panel's inline-start edge — on a sheet that slides up from below there is no such edge
        // to hang it from, and it renders as a stray pill floating above the corner.
        notch={
          isBottom ? undefined : (
          <DrawerNotch>
            <DrawerNotchClose onClick={() => onOpenChange(false)} />
            {/* Caller-authored notch buttons win; `onOpenInNewTab` is upstream's built-in
                single action, kept as a fallback for callers that pass no children. */}
            {notchActions ? (
              <>
                <DrawerNotchDivider />
                {notchActions}
              </>
            ) : (
              onOpenInNewTab && (
                <>
                  <DrawerNotchDivider />
                  <DrawerNotchPill color="Yellow" onClick={onOpenInNewTab}>
                    Open in new tab
                    <i className="ri-arrow-right-up-line text-[12px]" />
                  </DrawerNotchPill>
                </>
              )
            )}
          </DrawerNotch>
          )
        }
      >
        {/* `rounded-se-*` is the logical top-inline-end corner: rounded away from the notch,
            square beneath it, mirrored by the browser rather than by a ternary. */}
        <DrawerPanel
          framed={framed}
          className={cn(
            "p-0",
            isBottom ? "rounded-t-[16px]" : "rounded-se-[16px] rounded-b-[16px]",
          )}
        >
          <div className="relative flex min-h-0 flex-1 flex-col">
            {/* Vaul requires a Drawer.Title for the a11y name; the visible title is the
                HeaderBar below, so this one is for screen readers only. */}
            <DrawerTitle className="sr-only">{title}</DrawerTitle>
            {description && (
              <DrawerDescription className="sr-only">{description}</DrawerDescription>
            )}

            {/* The SAME floating header the page form uses, so a form's title looks
                identical in either surface. */}
            {!hideHeader && (
              <FormHeaderBar title={title} label={badge} variant={variant}>
                {actions}
              </FormHeaderBar>
            )}

            {/* pt-[72px] clears the 44px header pill (inset 4px) — same as the page shell. The
                48px bottom breathing-room goes on an inner wrapper, not the scroll container:
                FormRenderer's outer element is `h-full`, which would pin it to the content box and
                swallow the container's own `pb`. On a plain wrapper that `h-full` resolves to the
                content height, so the padding actually lengthens the scroll. The conclusion panel
                is a separate sibling, so it keeps its own spacing. */}
            {/* LOCAL PATCH (Contact Center): `bareBody` hands the body to the child untouched.
                Without it, a child that already scrolls and already offsets for its own header
                (a detail view does both) gets a second scroll container and a second 72px of
                dead space stacked on top of its own. */}
            {bareBody ? (
              children
            ) : (
              <div className={cn("h-full overflow-y-auto px-3", !hideHeader && "pt-[72px]")}>
                <div className="pb-[48px]">{children}</div>
              </div>
            )}
          </div>
        </DrawerPanel>

        {/* `flex min-h-0` so the conclusion stretches to the tray's full height and can
            still shrink — without `min-h-0` it would grow past the tray instead of
            scrolling inside it. No `flex-1`: the panel sizes itself. */}
        {conclusion && <div className="flex min-h-0">{conclusion}</div>}
      </DrawerContent>
    </Root>
  );
}
