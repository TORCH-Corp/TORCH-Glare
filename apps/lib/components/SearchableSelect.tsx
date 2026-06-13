"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Icon, Input, Group } from "./Input";
import { Button, LoadingIcon } from "./Button";
import { useClickOutside } from "../hooks/useClickOutside";
// Reuse the exact menu-item styling so rows look identical to DropdownMenuItem.
import { MenuItemStyles } from "./DropdownMenu";

/**
 * SearchableSelect — a searchable single-select combobox.
 *
 * Same search-on-focus behavior as SearchableTable, but the dropdown renders
 * DropdownMenu-style rows (MenuItemStyles) instead of a table. Built on Popover
 * so the text input keeps focus while filtering. Click an option to select it:
 * the dropdown closes and the input shows the option's label.
 */

export interface SearchableSelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface Props {
  options: SearchableSelectOption[];
  /** Controlled selected value (optional). */
  value?: string | null;
  onValueChange?: (value: string, option: SearchableSelectOption) => void;
  placeholder?: string;
  size?: "XS" | "S" | "M";
  variant?: "SystemStyle" | "PresentationStyle";
  icon?: ReactNode;
  theme?: Themes;
  dir?: string;
  className?: string;

  // --- Async / backend pagination (all optional; static `options` still works) ---
  /**
   * When true (default), the component filters `options` by label locally.
   * Set false for server-side search — `options` are rendered as-is and you
   * refetch them in response to `onSearchChange`.
   */
  filterClientSide?: boolean;
  /** Debounced as the user types — refetch your data here (server search). */
  onSearchChange?: (query: string) => void;
  /** Debounce for `onSearchChange`, in ms (default 300). */
  searchDebounceMs?: number;
  /** Whether more pages are available; gates the infinite-scroll loader. */
  hasMore?: boolean;
  /** Whether a fetch is in flight; shows a loading row and blocks onLoadMore. */
  loading?: boolean;
  /** Called when the bottom sentinel scrolls into view and `hasMore && !loading`. */
  onLoadMore?: () => void;
  /** Max rows visible before the list scrolls (default 5). */
  maxVisibleItems?: number;
}

// One M-size row ≈ 32px height + 2px*2 padding + 1px gap.
const ROW_HEIGHT = 37;

// Popover surface styled like the DropdownMenu (self-contained, mirrors the
// menu surface used by DropdownMenu/ContextMenu).
const menuContentStyles = cva(
  [
    "p-1",
    "rounded-[14px]",
    "border-0",
    "outline-none",
    "overflow-hidden", // the inner scroll viewport owns scrolling
    "backdrop-blur-[21px]",
    "flex flex-col gap-1",
    "data-[state=open]:animate-in",
    "data-[state=open]:fade-in-0",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          "bg-[rgba(61,64,69,0.72)]",
          "shadow-[0_0_32px_2px_rgba(0,0,0,0.20),0_0_48px_2px_rgba(0,0,0,0.05)]",
        ],
        SystemStyle: [
          "bg-background-system-body-primary",
          "shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)]",
        ],
      },
    },
    defaultVariants: { variant: "PresentationStyle" },
  }
);

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Search…",
  size = "M",
  variant = "PresentationStyle",
  icon,
  theme,
  dir,
  className,
  filterClientSide = true,
  onSearchChange,
  searchDebounceMs = 300,
  hasMore = false,
  loading = false,
  onLoadMore,
  maxVisibleItems = 5,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const groupRef = useClickOutside<HTMLDivElement>((e) => {
    const target = e?.target as Node;
    if (
      !groupRef.current?.contains(target) &&
      !popoverContentRef.current?.contains(target)
    ) {
      setOpen(false);
    }
  });

  // Debounced server search: notify the consumer to refetch when the query
  // settles. Skipped entirely if no onSearchChange is provided (static mode).
  useEffect(() => {
    if (!onSearchChange) return;
    const id = setTimeout(() => onSearchChange(search.trim()), searchDebounceMs);
    return () => clearTimeout(id);
  }, [search, onSearchChange, searchDebounceMs]);

  // Infinite scroll: when the scroll viewport nears the bottom, ask the consumer
  // to load the next page. An onScroll handler is more reliable here than an
  // IntersectionObserver, which races with Radix's async portal mount.
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!onLoadMore || !hasMore || loading) return;
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
      onLoadMore();
    }
  };

  const filteredOptions = useMemo(() => {
    // Server-side search mode: render options as-is (already filtered upstream).
    if (!filterClientSide) return options;
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search, filterClientSide]);

  const selectedOption = options.find((o) => o.value === value) ?? null;

  const handleSelect = (option: SearchableSelectOption) => {
    onValueChange?.(option.value, option);
    setSearch("");
    setSearching(false);
    setOpen(false);
  };

  // Solid value: search text while typing, otherwise the selected label.
  const displayValue = searching ? search : selectedOption?.label ?? "";

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <Group
          dir={dir}
          data-theme={theme}
          variant={variant}
          size={size === "XS" ? "S" : size}
          ref={groupRef as never}
          onFocus={(e: React.FocusEvent<HTMLDivElement>) =>
            setDropdownWidth(e.currentTarget.offsetWidth)
          }
          className={cn("flex w-full items-center gap-1 p-1", className)}
        >
          {icon && <Icon>{icon}</Icon>}
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={displayValue}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearching(true);
            }}
            onFocus={() => {
              setSearching(true);
              setSearch("");
              setOpen(true);
            }}
            onBlur={() => setSearching(false)}
            className={cn("min-w-[100px] flex-1", {
              "!h-[18px]": size === "XS",
              "!h-[22px]": size === "S",
              "!h-[24px]": size === "M",
            })}
          />
          {/* Chevron toggle — boxed icon button matching the Select component. */}
          <Button
            as="span"
            buttonType="icon"
            tabIndex={-1}
            aria-label={open ? "Close" : "Open"}
            onMouseDown={(e: React.MouseEvent) => {
              e.preventDefault();
              if (open) {
                setOpen(false);
              } else {
                inputRef.current?.focus();
                setOpen(true);
              }
            }}
            className={cn(
              "shrink-0 h-[32px] w-[32px] rounded-[4px]",
              open && "bg-background-presentation-action-hover text-white"
            )}
          >
            <i
              className={cn(
                "ri-arrow-down-s-line text-[16px] transition-all duration-100 ease-in-out",
                open && "rotate-180"
              )}
            />
          </Button>
        </Group>
      </PopoverTrigger>

      <PopoverContent
        dir={dir}
        data-theme={theme}
        ref={popoverContentRef}
        variant={variant}
        style={{ width: dropdownWidth || undefined }}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onWheel={(e) => e.stopPropagation()}
        className={cn(menuContentStyles({ variant }))}
      >
        {/* Dedicated scroll viewport: caps height to ~maxVisibleItems rows and
            scrolls the rest. Keeping it separate from the popover padding avoids
            flex/overflow conflicts that block scrolling. */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto overflow-x-hidden scrollbar-hide"
          style={{ maxHeight: maxVisibleItems * ROW_HEIGHT }}
        >
        {filteredOptions.length > 0 && (
          // Boxed group container — matches the DropdownMenu's auto-grouped look.
          <div className="flex flex-col gap-[1px] rounded-[10px] overflow-hidden">
            {filteredOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                // Same structure as DropdownMenuItem: MenuItemStyles on the
                // element + a single inner <div> the styles target via [&>div].
                <button
                  type="button"
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  data-highlighted={isSelected ? "" : undefined}
                  className={cn(
                    MenuItemStyles({ variant: "Default", size: "M" }),
                    "shrink-0" // keep full row height; the list scrolls instead of squishing
                  )}
                >
                  <div>
                    {option.icon}
                    <span className="flex-1 text-start">{option.label}</span>
                    {isSelected && (
                      <i className="ri-check-line text-[16px] shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Empty state — only when nothing is loading. */}
        {filteredOptions.length === 0 && !loading && (
          <div className="px-3 py-2 typography-body-small-regular text-white-alpha-75">
            No results found
          </div>
        )}

        {/* Loading row (initial load or fetching the next page). */}
        {loading && (
          <div className="flex items-center justify-center py-2">
            <LoadingIcon size="M" />
          </div>
        )}

        </div>
      </PopoverContent>
    </Popover>
  );
}

SearchableSelect.displayName = "SearchableSelect";
