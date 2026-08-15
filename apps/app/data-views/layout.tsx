"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import TabFormItem from "@/components/TabFormItem";
import { cn } from "@/utils/cn";
import { byGroup, GROUPS } from "./_examples";

/**
 * The suite shell: a fixed rail of links beside a full-height content column.
 *
 * The height chain matters. `DataViews` is `h-full min-h-0` and owns internal scroll regions —
 * the table body, the board's columns, the settings panel. `<main>` therefore has to be a flex
 * child that is allowed to shrink (`min-h-0`) and that clips rather than grows
 * (`overflow-hidden`); drop either and every example collapses or pushes the page into a second
 * scrollbar.
 */
export default function DataViewsSuiteLayout({ children }: { children: ReactNode }) {
  // Every example queries its own mock endpoint through TanStack Query, so the suite needs one
  // client. Created in a `useState` initialiser, not inline: `new QueryClient()` on each render
  // would throw the cache away every time and refetch forever.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // The examples are the only source of their data — nothing else can invalidate it, so
        // refetching when the tab regains focus would just add noise while you read the page.
        defaultOptions: { queries: { refetchOnWindowFocus: false } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-background-presentation-body-primary flex h-screen">
        <ExampleNav />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </QueryClientProvider>
  );
}

/** Built from `_examples.ts`, so it can never drift from the routes that actually exist. */
function ExampleNav() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex w-[232px] shrink-0 flex-col gap-4 overflow-y-auto p-3",
        "border-border-presentation-global-primary bg-background-presentation-body-primary border-e",
      )}
    >
      <Link
        href="/data-views"
        className="typography-body-medium-medium text-content-presentation-global-primary px-2 pt-1"
      >
        DataViews
      </Link>

      {GROUPS.map((group) => (
        <div key={group} className="flex flex-col gap-[2px]">
          <h2 className="typography-body-small-medium text-content-presentation-global-secondary px-2 pb-1">
            {group}
          </h2>
          {byGroup(group).map((example) => {
            const href = `/data-views/${example.slug}`;
            return (
              <TabFormItem key={href} componentType="side" active={pathname === href} asChild>
                <Link href={href}>
                  <span className="typography-body-small-regular truncate">{example.title}</span>
                </Link>
              </TabFormItem>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
