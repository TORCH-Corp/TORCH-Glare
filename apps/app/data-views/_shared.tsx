"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import TabFormItem from "@/components/TabFormItem";
import { cn } from "@/utils/cn";
import { GROUPS } from "./_examples";

/**
 * Route navigation for the DataViews gallery.
 *
 * Built on `TabFormItem componentType="side"` — the library's own sidebar item,
 * the same one `DataViews.Inbox` uses for its quick-filter rail — so the demo
 * chrome stays consistent with the components it is demonstrating.
 */
export function DemoSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-52 shrink-0 flex-col overflow-y-auto border-r border-border-presentation-global-primary bg-background-presentation-body-overlay-primary">
      <Link
        href="/data-views"
        className="border-b border-border-presentation-global-primary px-3 py-3 typography-body-large-medium text-content-presentation-global-primary transition-colors hover:bg-background-presentation-action-hover"
      >
        DataViews
      </Link>

      <nav className="flex flex-col gap-3 p-2">
        {GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-0.5">
            <p className="px-2 py-1 typography-body-small-medium uppercase tracking-wide text-content-presentation-global-tertiary">
              {group.title}
            </p>
            {group.items.map((item) => (
              // `asChild` makes TabFormItem render *as* the Link, so we get the
              // library's sidebar styling on a real anchor — no <button> nested
              // inside an <a>, and middle-click / open-in-new-tab still work.
              <TabFormItem
                key={item.href}
                asChild
                componentType="side"
                active={isActive(pathname, item.href)}
                className="w-full justify-start"
              >
                <Link href={item.href}>{item.title}</Link>
              </TabFormItem>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

/**
 * `inbox-routing` owns nested routes (`/data-views/inbox-routing/3`), so an
 * exact-match check would un-highlight its entry as soon as a record is opened.
 */
function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Page chrome: a title, a short explanation, and the demo itself.
 *
 * The body is always `overflow-hidden` and hands its remaining height to the
 * child — a DataViews shell fills it, and any side panel scrolls itself. A
 * scrolling body here would fight the shell for the viewport and produce two
 * scrollbars. `padded` is for pages that put their own controls beside the
 * demo and want breathing room around them.
 */
export function ExampleFrame({
  title,
  children,
  description,
  padded = false,
  className,
}: {
  title: string;
  description: ReactNode;
  children: ReactNode;
  padded?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      <header className="flex flex-col gap-1 border-b border-border-presentation-global-primary px-6 py-4">
        <h1 className="typography-headers-medium-medium text-content-presentation-global-primary">
          {title}
        </h1>
        <div className="typography-body-small-regular text-content-presentation-global-secondary">
          {description}
        </div>
      </header>

      <div className={cn("min-h-0 flex-1 overflow-hidden", padded && "p-6")}>{children}</div>
    </div>
  );
}

/** A short aside — what to try, or a caveat worth calling out. */
export function Callout({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "warn";
}) {
  return (
    <div
      className={cn(
        "rounded-[10px] border px-3 py-2 typography-body-small-regular",
        tone === "warn"
          ? "border-border-presentation-state-negative bg-background-presentation-state-negative-primary/10 text-content-presentation-global-primary"
          : "border-border-presentation-global-primary bg-background-presentation-form-field-primary text-content-presentation-global-secondary",
      )}
    >
      {children}
    </div>
  );
}

/** Renders a value the demo wants to expose — selection ids, a filter query. */
export function StateReadout({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="typography-body-small-medium text-content-presentation-global-tertiary">
        {label}
      </span>
      <pre className="overflow-auto rounded-[8px] border border-border-presentation-global-primary bg-background-presentation-form-field-primary p-2 text-xs text-content-presentation-global-primary">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
}
