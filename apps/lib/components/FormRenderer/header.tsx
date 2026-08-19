"use client";

import { ReactNode } from "react";

import { cn } from "../../utils/cn";
import { HeaderBar } from "../HeaderBar";

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
 * Shared by all three FormRenderer surfaces — the page form, `FormDrawer` and the
 * detail view — so a form's title looks identical wherever it is rendered. This is
 * chrome, so it lives here rather than in `FormBuilder`: a bare `<FormBuilder>` is
 * fields and nothing else.
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
        "absolute inset-x-0 top-0 z-[2] flex w-full items-start justify-between gap-2 p-1",
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

/**
 * The `header` prop's shape — `header={{ title, label, variant }}` on `FormRenderer`.
 * There is no `FormRenderer.Header` component: the header is a prop, not a child, so a
 * child element can never reconfigure the surrounding layout the way the old
 * `FormBuilder.Header` did.
 */
export interface HeaderConfig {
  /** Plain title text (uppercased), e.g. the entity label or SKU. */
  title: string;
  /** Badge text — defaults from `variant` (New / Edit / View). */
  label?: string;
  /** Colored badge variant. */
  variant?: HeaderVariant;
}
