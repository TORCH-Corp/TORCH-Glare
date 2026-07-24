"use client";

import { ReactNode } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerPanel,
  DrawerTitle,
  DrawerNotch,
  DrawerNotchClose,
  DrawerNotchDivider,
  DrawerNotchPill,
} from "../Drawer";
import { FormHeaderBar, type HeaderVariant } from "../FormBuilder/header";

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
  /** Shows an "Open in new tab" pill in the notch when provided. */
  onOpenInNewTab?: () => void;
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
}: FormDrawerProps) {
  const conclusion = summary ?? childrenOutside;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      {/* The panel fills the available width (minus the 8px insets), capped at 1048px.
          `gap-[6px]` is the gutter between the form panel and the conclusion beside it. */}
      <DrawerContent
        wrapperClassName="top-2 right-2 bottom-2 left-auto mt-0 h-auto w-[calc(100vw-1rem)] max-w-[1048px]"
        className="gap-[6px]"
        notch={
          <DrawerNotch>
            <DrawerNotchClose onClick={() => onOpenChange(false)} />
            {onOpenInNewTab && (
              <>
                <DrawerNotchDivider />
                <DrawerNotchPill color="Yellow" onClick={onOpenInNewTab}>
                  Open in new tab
                  <i className="ri-arrow-right-up-line text-[12px]" />
                </DrawerNotchPill>
              </>
            )}
          </DrawerNotch>
        }
      >
        <DrawerPanel className="rounded-tr-[16px] rounded-b-[16px] p-0">
          <div className="relative flex min-h-0 flex-1 flex-col">
            {/* Vaul requires a Drawer.Title for the a11y name; the visible title is the
                HeaderBar below, so this one is for screen readers only. */}
            <DrawerTitle className="sr-only">{title}</DrawerTitle>

            {/* The SAME floating header the page form uses, so a form's title looks
                identical in either surface. */}
            <FormHeaderBar title={title} label={badge} variant={variant}>
              {actions}
            </FormHeaderBar>

            {/* pt-[72px] clears the 44px header pill (inset 4px) — same as the page shell. */}
            <div className="h-full overflow-y-auto px-3 pb-[20px] pt-[72px]">{children}</div>
          </div>
        </DrawerPanel>

        {/* `flex min-h-0` so the conclusion stretches to the tray's full height and can
            still shrink — without `min-h-0` it would grow past the tray instead of
            scrolling inside it. No `flex-1`: the panel sizes itself. */}
        {conclusion && <div className="flex min-h-0">{conclusion}</div>}
      </DrawerContent>
    </Drawer>
  );
}
