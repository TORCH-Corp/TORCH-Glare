"use client";

import { ReactNode } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerHeaderTitle,
  DrawerHeaderActions,
  DrawerBadge,
  DrawerTitle,
  DrawerNotch,
  DrawerNotchClose,
  DrawerNotchDivider,
  DrawerNotchPill,
} from "../Drawer";

export interface FormDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The `<FormBuilder>` (or any content) to host inside the drawer. */
  children: ReactNode;
  /** Header title shown in the drawer's dark title pill (also the a11y title). */
  title?: ReactNode;
  /** Optional badge in the header pill, e.g. "New" / "Edit". */
  badge?: ReactNode;
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
 */
export function FormDrawer({
  open,
  onOpenChange,
  children,
  title = "Form",
  badge,
  actions,
  onOpenInNewTab,
}: FormDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent
        showHandle={false}
        wrapperClassName="top-2 right-2 bottom-2 left-auto mt-0 h-auto w-[640px] max-w-[1046px]"
        className="rounded-tr-[16px] rounded-b-[16px]"
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
        {/* Absolute header floating over the scrollable body (matches the page). */}
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex items-start justify-between gap-2 px-1 pt-1">
            <DrawerHeaderTitle className="pointer-events-auto">
              {badge && <DrawerBadge color="Blue">{badge}</DrawerBadge>}
              <DrawerTitle>{title}</DrawerTitle>
            </DrawerHeaderTitle>
            {actions && (
              <DrawerHeaderActions className="pointer-events-auto">{actions}</DrawerHeaderActions>
            )}
          </div>

          <div className="h-full overflow-y-auto px-3 pb-3 pt-[78px]">{children}</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
