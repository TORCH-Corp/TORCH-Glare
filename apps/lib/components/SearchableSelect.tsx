"use client";

import { ReactNode, useMemo, useRef, useState } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Icon, Input, Group } from "./Input";
import { Button } from "./Button";
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
}

// Popover surface styled like the DropdownMenu (self-contained, mirrors the
// menu surface used by DropdownMenu/ContextMenu).
const menuContentStyles = cva(
  [
    "p-1",
    "rounded-[14px]",
    "border-0",
    "outline-none",
    "max-h-[320px]",
    "overflow-auto",
    "scrollbar-hide",
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
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const popoverContentRef = useRef<HTMLDivElement>(null);
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

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

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
        className={cn(menuContentStyles({ variant }))}
      >
        {filteredOptions.length > 0 ? (
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
                  className={cn(MenuItemStyles({ variant: "Default", size: "M" }))}
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
        ) : (
          <div className="px-3 py-2 typography-body-small-regular text-white-alpha-75">
            No results found
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

SearchableSelect.displayName = "SearchableSelect";
