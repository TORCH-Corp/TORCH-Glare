"use client";

import * as React from "react";

import { cn } from "../../utils/cn";
import { DrawerNotchPill } from "../Drawer";

/**
 * `FormRenderer.NotchAction` — a button in the drawer's notch, authored as a CHILD.
 *
 * LOCAL PATCH (Contact Center). Upstream models the one notch action it ships as a pair of
 * props on `FormDrawer` / `FormRenderer`: `onOpenInNewTab` (a handler) plus a hardcoded
 * English "Open in new tab" label. That shape has two problems:
 *
 *   1. The label is the component's, not the caller's, so a localized app cannot translate it
 *      without a second prop — which is exactly the `openInNewTabLabel` patch we kept having
 *      to re-apply after every `npx torch-glare update`.
 *   2. It only ever admits ONE action, and only that action. Anything else in the notch means
 *      another prop pair.
 *
 * Passing the button as a child fixes both at once: the caller owns the text (so i18n is just
 * `{t(...)}`, no prop), owns the icon, and can render more than one. Same bargain the rest of
 * the library strikes — `DataViews` registers a view because you rendered it, `FormRenderer`
 * renders a step because you wrote a `<Step>`.
 *
 * It renders nothing where it is written: `FormRenderer` lifts it out of the children and hands
 * it to `FormDrawer`'s notch, the same way it lifts a `Stepper`. Ignored entirely on a page-display
 * form, which has no notch.
 *
 * ```tsx
 * <FormRenderer display="drawer" …>
 *   <FormRenderer.NotchAction onClick={openInTab}>
 *     {t("contacts.formShell.openInNewTab")}
 *     <i className="ri-arrow-right-up-line text-[12px]" />
 *   </FormRenderer.NotchAction>
 *   <FormRenderer.Section …>…</FormRenderer.Section>
 * </FormRenderer>
 * ```
 */
export interface NotchActionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  /** Pill colour, matching `DrawerNotchPill`. Defaults to the yellow "open elsewhere" pill. */
  color?: React.ComponentProps<typeof DrawerNotchPill>["color"];
  children?: React.ReactNode;
}

export function NotchAction({ color = "Yellow", className, children, ...props }: NotchActionProps) {
  return (
    <DrawerNotchPill color={color} className={cn(className)} {...props}>
      {children}
    </DrawerNotchPill>
  );
}

(NotchAction as unknown as { __isFormNotchAction: boolean }).__isFormNotchAction = true;

export function isNotchActionElement(
  node: React.ReactNode,
): node is React.ReactElement<NotchActionProps> {
  return (
    React.isValidElement(node) &&
    (node.type as { __isFormNotchAction?: boolean })?.__isFormNotchAction === true
  );
}
