"use client";

import { ReactNode } from "react";

import { cn } from "../../utils/cn";
import { HeaderBar } from "../HeaderBar";
import { useMode } from "./context";

export type HeaderVariant = "new" | "edit" | "detail";

const DEFAULT_LABEL: Record<HeaderVariant, string> = {
  new: "New",
  edit: "Edit",
  detail: "View",
};

export interface FormHeaderBarProps {
  /** Plain title text (uppercased), e.g. the entity label or SKU. */
  title: string;
  /** Badge text — defaults from `variant` (New / Edit / View). */
  label?: string;
  /** Colored badge variant. */
  variant?: HeaderVariant;
  /** Action buttons shown in the right-hand action pill. */
  children?: ReactNode;
  className?: string;
}

/**
 * The floating form header: a `HeaderBar` title pill on the left and a dark action
 * pill on the right, absolutely positioned over the scrollable body.
 *
 * Shared by **both** form surfaces — `FormBuilder.Header` (page) and `FormDrawer`
 * (drawer) — so a form's title looks identical wherever it is rendered.
 *
 * Per the design both pills are 44px tall, reached differently: the title pill is
 * 6px padding + 32px content, the action pill 8px + 28px.
 */
export function FormHeaderBar({
  title,
  label,
  variant = "new",
  children,
  className,
}: FormHeaderBarProps) {
  return (
    <div
      className={cn(
        "absolute inset-x-0 top-0 z-[2] flex w-full items-start justify-between gap-2",
        className,
      )}
    >
      <HeaderBar
        variant={variant}
        label={label ?? DEFAULT_LABEL[variant]}
        title={title}
        theme="dark"
      />

      {children && (
        <div
          data-theme="dark"
          className="flex flex-col items-start rounded-[14px] border border-border-presentation-global-primary bg-background-presentation-form-base shadow-[0_0_32px_0_rgba(0,0,0,0.15)]"
        >
          <div className="sticky top-0 flex w-full items-center justify-between p-2">
            <div className="flex h-7 items-center justify-center gap-2">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}

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

/**
 * `FormBuilder.Header` — the page form's title + action bar. A thin, mode-aware
 * wrapper over `FormHeaderBar`: it defaults the badge variant from the form `mode`
 * (view → detail).
 *
 * Place it as a direct child of `<FormBuilder>`; the root then switches to the
 * scroll-shell layout that reserves space beneath the floating header.
 */
export function Header({ title, label, variant, children }: HeaderProps) {
  const mode = useMode();
  const v: HeaderVariant = variant ?? (mode === "view" ? "detail" : "new");

  return (
    <FormHeaderBar title={title} label={label} variant={v}>
      {children}
    </FormHeaderBar>
  );
}

// Marker so the FormBuilder root can detect the header among its children.
(Header as unknown as { __isFormHeader: boolean }).__isFormHeader = true;
