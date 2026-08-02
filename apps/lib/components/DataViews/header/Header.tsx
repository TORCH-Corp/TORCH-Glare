"use client";

import type { ReactNode } from "react";
import { headerStyles, titlePillStyles, RAW } from "../styles";
import { cn } from "../../../utils/cn";

export type HeaderProps = {
  title?: string;
  /** Header controls — typically `DataViews.Search`, `DataViews.ViewSwitch`,
   *  `DataViews.Action`, `DataViews.ConfigTrigger`, in whatever order and
   *  combination the screen needs. */
  children?: ReactNode;
  className?: string;
};

/**
 * The top bar: a title pill plus whatever controls the consumer slots in.
 *
 * Always dark. `data-theme="dark"` makes child components resolve dark-theme
 * tokens (correct against the black bar) even when the host app runs in
 * default or light theme.
 */
export function DataViewsHeader({ title, children, className }: HeaderProps) {
  return (
    <div data-theme="dark" className={cn(headerStyles(), className)}>
      {title && (
        <>
          <div className={titlePillStyles()}>
            <span className="text-[28px] font-[510] uppercase leading-[1.19] text-content-presentation-global-primary">
              {title}
            </span>
          </div>
          <div className="h-5 w-px shrink-0" style={{ backgroundColor: RAW.chromeDivider }} />
        </>
      )}
      {children}
    </div>
  );
}

/**
 * Pushes everything after it to the right edge of the header. Sits between the
 * view switcher and the action controls.
 */
export function DataViewsHeaderSpacer() {
  return <div className="flex-1" />;
}
