"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search as SearchIcon, Settings } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../Button";
import { TabSwitch, type TabSwitchOption } from "../TabSwitch";
import { useDataViewsPanel, useDataViewsView } from "./context";
import { markHeader } from "./slots";
import type {
  ActionsProps,
  HeaderProps,
  PanelToggleProps,
  SearchProps,
  ViewSwitchProps,
} from "./types";

/**
 * The bar above the views — 52px, black, always dark.
 *
 * `data-theme="dark"` is deliberate and scoped to the bar: it makes the child Buttons and the
 * view switcher resolve dark tokens so they read correctly against the black, even when the host
 * app runs light. It must not wrap the content below, which stays in the host theme.
 *
 * ```tsx
 * <DataViews.Header title="Orders">
 *   <DataViews.ViewSwitch />
 *   <DataViews.Search />
 *   <DataViews.Actions><Button>New</Button></DataViews.Actions>
 *   <DataViews.PanelToggle />
 * </DataViews.Header>
 * ```
 */
export function Header({ title, children, className }: HeaderProps) {
  return (
    <div
      data-theme="dark"
      className={cn(
        // 40px and no background of its own, per Figma's `Body-HeaderBar-1.0`. The bar has never
        // needed one: the root shell already paints black behind it.
        "flex h-[40px] w-full shrink-0 items-center gap-2 rounded-[12px]",
        className,
      )}
    >
      {title !== undefined && (
        <>
          <div className="flex h-9 shrink-0 items-center gap-2 rounded-[12px] border border-[#434446] bg-[#252729] px-[10px]">
            <span className="text-[28px] font-[510] uppercase leading-[1.19] text-white">
              {title}
            </span>
          </div>
          {/* `border/presentation/global/primary`, not the pill's `#434446` — the design uses two
              different greys here, and the divider is the darker one. */}
          <div className="h-5 w-px shrink-0 rounded-[4px] bg-[#2c2d2e]" />
        </>
      )}
      {children}
    </div>
  );
}

markHeader(Header);

/**
 * Switches between the views you rendered. The options come from the view registry, so this stays
 * in sync by construction — there is no list to keep updated.
 *
 * It takes the remaining width, which is what pushes `Actions` and the panel toggle to the end of
 * the bar. Renders nothing when fewer than two views are registered: a switcher with one option
 * is noise.
 *
 */
export function ViewSwitch({ className }: ViewSwitchProps) {
  const { views, view, setView } = useDataViewsView();

  if (views.length < 2) return <div className="flex-1" />;

  const options: TabSwitchOption[] = views.map((v) => ({
    value: v.id,
    label: v.label,
    icon: v.icon,
  }));

  return (
    <div className={cn("flex flex-1 items-center gap-2", className)}>
      <TabSwitch theme="dark" options={options} value={view} onValueChange={setView} />
    </div>
  );
}

/**
 * The search box — an icon button that expands into a field.
 *
 * It only reports what was typed: typing puts a `search` in the query and `onQueryChange` is
 * where you go and fetch. DataViews never matches rows against this string.
 */
export function Search({ placeholder = "Search...", className }: SearchProps) {
  const { search, setSearch } = useDataViewsView();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const clearAndCollapse = () => {
    setSearch("");
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current?.contains(e.target as Node)) return;
      // Collapsing on an outside click would throw away an active query — only close when the
      // field is empty.
      if (!search) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, search]);

  if (!open) {
    return (
      <Button
        variant="BluContStyle"
        size="M"
        buttonType="icon"
        aria-label="Open search"
        onClick={() => setOpen(true)}
        className={cn(
          "border-border-presentation-global-primary shrink-0 rounded-[6px] border",
          className,
        )}
      >
        <SearchIcon className="h-[18px] w-[18px]" />
      </Button>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative flex h-[28px] w-[260px] shrink-0 items-center justify-center rounded-[6px]",
        "border-border-presentation-state-focus bg-background-presentation-form-field-primary border px-1",
        "shadow-[0_1px_6px_0_rgba(0,0,0,0.30)] transition-all duration-150 ease-in-out",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="text"
        size={1}
        value={search}
        placeholder={placeholder}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") clearAndCollapse();
        }}
        className="placeholder:text-content-presentation-global-tertiary min-w-0 flex-1 bg-transparent text-[14px] leading-none text-white caret-[#1E7AFE] focus:outline-none"
      />
      <button
        type="button"
        aria-label="Clear search"
        onClick={clearAndCollapse}
        className="flex shrink-0 items-center justify-center self-stretch px-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M7.99992 14.6666C4.31802 14.6666 1.33325 11.6818 1.33325 7.99992C1.33325 4.31802 4.31802 1.33325 7.99992 1.33325C11.6818 1.33325 14.6666 4.31802 14.6666 7.99992C14.6666 11.6818 11.6818 14.6666 7.99992 14.6666ZM7.99992 7.05712L6.1143 5.17149L5.17149 6.1143L7.05712 7.99992L5.17149 9.88552L6.1143 10.8283L7.99992 8.94272L9.88552 10.8283L10.8283 9.88552L8.94272 7.99992L10.8283 6.1143L9.88552 5.17149L7.99992 7.05712Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
}

/**
 * A slot for your own buttons, so they line up with the rest of the header.
 *
 * The convention is `<Button variant="BluColStyle" size="M">` — the solid `#005ecc` Figma uses
 * for the bar's action. `Search` and `PanelToggle` beside it stay ghost on purpose: they are
 * toggles, and three solid pills on black would stop them reading as such. A toggle of your own
 * belongs here too, with `BluColStyle` for its on state.
 *
 * Not enforced. Cloning the children to force a variant would override a caller who deliberately
 * wants a destructive button here, and would fight their `className`.
 */
export function Actions({ children, className }: ActionsProps) {
  return <div className={cn("flex shrink-0 items-center gap-2", className)}>{children}</div>;
}

/**
 * Opens `DataViews.Panel`. It hides itself while the panel is open — the panel has its own close
 * control, so keeping this one visible would be a second way to do the same thing.
 */
export function PanelToggle({ children, className }: PanelToggleProps) {
  const { open, setOpen } = useDataViewsPanel();

  if (open) return null;

  return (
    <Button
      variant="BluContStyle"
      size="M"
      onClick={() => setOpen(true)}
      aria-expanded={open}
      className={cn("gap-[6px] rounded-[6px] px-[14px] text-[16px] font-[510]", className)}
    >
      <Settings className="h-[18px] w-[18px]" />
      {children ?? "Filter & Config."}
    </Button>
  );
}
