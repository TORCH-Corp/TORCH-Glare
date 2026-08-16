"use client";

import React, { Children, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "../../../utils/cn";
import { PanelTabsContext, useDataViewsPanel, type PanelTab } from "../context";
import { markPanel } from "../slots";
import { Columns } from "./columns";
import { SavedViews } from "./saved-views";
import { Section } from "./section";
import { Sort } from "./sort";
import { Tab, isTabElement } from "./tab";
import type { PanelProps } from "../types";

/**
 * `DataViews.Panel` — the settings rail, opened by `DataViews.PanelToggle`.
 *
 * Always dark: `data-theme="dark"` on the root makes the Buttons, Switches and Radios inside
 * resolve dark tokens against the black, even when the host app runs light. The width animates
 * from 0 so the content beside it reflows rather than being covered.
 *
 * Tabs, like views, exist because you rendered them: the strip is built from the `Panel.Tab`
 * children found here and disappears when there is only one.
 *
 * Open/closed lives on the root, because the toggle that drives it is in the header — this
 * component's sibling. Which tab is showing lives here, because nothing outside this rail cares.
 */
function PanelRoot({ children, defaultTab, title, className }: PanelProps) {
  const { open, setOpen } = useDataViewsPanel();

  // Mount at width 0, then flip to the open width on the next frame so the transition has two
  // values to animate between; on close, keep it mounted until the animation finishes.
  const [mounted, setMounted] = useState(open);
  const [expanded, setExpanded] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setMounted(true);
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setExpanded(true)));
      return () => cancelAnimationFrame(raf);
    }
    setExpanded(false);
    closeTimer.current = setTimeout(() => setMounted(false), 300);
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [open]);

  const childArray = Children.toArray(children);
  const tabElements = childArray.filter(isTabElement);
  const loose = childArray.filter((n) => !isTabElement(n));

  // Keyed on the tab identities rather than the (always-new) child array — same reasoning as the
  // view registry in `data-views.tsx`.
  const tabKey = tabElements.map((el) => `${el.props.value}|${el.props.label}`).join(",");
  const tabs = useMemo<PanelTab[]>(
    () =>
      tabElements.map((el) => ({ value: el.props.value, label: el.props.label, icon: el.props.icon })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on `tabKey`, see above
    [tabKey],
  );

  const [currentTab, setTab] = useState(defaultTab ?? "");
  const known = tabs.some((t) => t.value === currentTab);
  const fallbackTab = tabs[0]?.value ?? "";
  // A tab that stops being rendered falls back to the first, which also covers the first render
  // when no `defaultTab` was given.
  const activeTab = known ? currentTab : fallbackTab;

  const value = useMemo(() => ({ tab: activeTab, setTab, tabs }), [activeTab, setTab, tabs]);

  if (!mounted) return null;

  return (
    <PanelTabsContext.Provider value={value}>
      <div
        className={cn(
          "shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out",
          expanded ? "w-[260px]" : "w-0",
        )}
      >
        <aside
          data-theme="dark"
          data-state={expanded ? "open" : "closed"}
          className={cn(
            "flex h-full w-[260px] flex-col overflow-hidden rounded-[16px] bg-black",
            "transition-opacity duration-200 ease-in-out",
            expanded ? "opacity-100" : "opacity-0",
            className,
          )}
        >
          <div className="flex items-center gap-2 px-3 py-3">
            {tabs.length > 1 ? (
              <div className="flex flex-1 items-center gap-[2px] rounded-[10px] bg-[#252729] p-[2px] shadow-[inset_0_0_5px_0_rgba(0,0,0,0.16)]">
                {tabs.map((t) => {
                  const active = t.value === activeTab;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTab(t.value)}
                      className={cn(
                        "flex h-6 flex-1 items-center justify-center gap-1 rounded-[8px] px-3",
                        "text-[14px] font-[510] leading-none transition-all duration-200 ease-in-out",
                        active
                          ? "bg-white text-black shadow-[0_0_10px_2px_rgba(0,0,0,0.25)]"
                          : "bg-transparent text-white hover:bg-white/5",
                      )}
                    >
                      {t.icon && (
                        <span className="flex h-[14px] w-[14px] items-center justify-center [&_svg]:h-[14px] [&_svg]:w-[14px]">
                          {t.icon}
                        </span>
                      )}
                      {t.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <span className="flex-1 text-[18px] font-[510] leading-[1.32] tracking-[-0.01em] text-white">
                {title ?? tabs[0]?.label ?? ""}
              </span>
            )}

            <button
              type="button"
              aria-label="Close settings panel"
              onClick={() => setOpen(false)}
              className="hover:bg-background-presentation-state-negative-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-white/[0.15] text-white transition-colors hover:text-white"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="h-px w-full bg-[#2C2D2E]" />

          <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
            {tabElements}
            {loose}
          </div>
        </aside>
      </div>
    </PanelTabsContext.Provider>
  );
}


markPanel(PanelRoot);

/**
 * The rail's compound surface, assembled in one place so what it offers is readable at a glance.
 */
export const Panel = Object.assign(PanelRoot, {
  Tab,
  Section,
  Columns,
  Sort,
  SavedViews,
});
