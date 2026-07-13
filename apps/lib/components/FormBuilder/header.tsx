"use client";

import { ReactNode } from "react";

import { HeaderBar } from "../HeaderBar";
import { useMode } from "./context";

export type HeaderVariant = "new" | "edit" | "detail";

export interface HeaderProps {
  /** Plain title text (uppercased), e.g. the entity label or SKU. */
  title: string;
  /** Badge text — defaults from `variant` (New / Edit / View). */
  label?: string;
  /** Colored badge variant. Defaults from the form `mode` (view → detail). */
  variant?: HeaderVariant;
  /** Action buttons shown in the right-hand action pill (e.g. FormBuilder.Submit). */
  children?: ReactNode;
}

const DEFAULT_LABEL: Record<HeaderVariant, string> = {
  new: "New",
  edit: "Edit",
  detail: "View",
};

/**
 * `FormBuilder.Header` — the form title + action bar, **absolutely positioned**
 * over the scrollable form body (matches the products-services item-edit page):
 * a Glare `HeaderBar` title pill on the left and a dark action pill on the right.
 *
 * Place it as a direct child of `<FormBuilder>`; the root then switches to the
 * scroll-shell layout that reserves space beneath the floating header.
 */
export function Header({ title, label, variant, children }: HeaderProps) {
  const mode = useMode();
  const v: HeaderVariant = variant ?? (mode === "view" ? "detail" : "new");

  return (
    <div className="z-[2] absolute inset-x-0 top-0 flex w-full items-start justify-between px-1 pt-1">
      <HeaderBar variant={v} label={label ?? DEFAULT_LABEL[v]} title={title} theme="dark" />

      {children && (
        <div
          data-theme="dark"
          className="flex flex-col items-start rounded-[14px] border border-border-presentation-global-primary bg-background-presentation-form-base shadow-[0_0_32px_0_rgba(0,0,0,0.15)]"
        >
          <div className="sticky top-0 flex w-full items-center justify-between p-[7px]">
            <div className="flex h-7 items-center justify-center gap-2">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Marker so the FormBuilder root can detect the header among its children.
(Header as unknown as { __isFormHeader: boolean }).__isFormHeader = true;
