"use client";

import { ReactNode, useMemo, useRef, useState } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Icon, Input, Group } from "./Input";
import { Button } from "./Button";
import { useClickOutside } from "../hooks/useClickOutside";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./Table";

/**
 * SearchableTable — a searchable combobox whose dropdown renders a real Table.
 *
 * Type in the input to filter rows; the dropdown opens on focus and shows the
 * filtered data using the existing Table component (composed inside a Popover,
 * the same mechanism BadgeField uses). Click a row to select it (single-select):
 * the dropdown closes and the input shows the selected row's label.
 */

export interface SearchableTableColumn<T> {
  /** Property on the row used for default rendering and search. */
  key: keyof T & string;
  header: ReactNode;
  /** Custom cell renderer; defaults to String(row[key]). */
  render?: (row: T) => ReactNode;
}

interface Props<T> {
  columns: SearchableTableColumn<T>[];
  rows: T[];
  /** Controlled selected row (optional). */
  value?: T | null;
  onSelect?: (row: T) => void;
  /** Text shown in the input after selection; defaults to the first column's value. */
  getLabel?: (row: T) => string;
  /** Stable id/key per row; defaults to JSON of the row. */
  getRowId?: (row: T) => string;
  /** Which fields the search matches; defaults to every column key. */
  searchKeys?: (keyof T & string)[];
  placeholder?: string;
  size?: "XS" | "S" | "M";
  variant?: "SystemStyle" | "PresentationStyle";
  icon?: ReactNode;
  theme?: Themes;
  dir?: string;
  className?: string;
}

// Popover surface styled like the DropdownMenu (kept local — self-contained).
const tableDropdownStyles = cva(
  [
    "p-1",
    "rounded-[14px]",
    "border-0", // neutralize PopoverContent's base border (the card provides its own)
    "outline-none",
    "max-h-[320px]",
    "overflow-auto",
    "scrollbar-hide",
    "backdrop-blur-[21px]",
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

export function SearchableTable<T extends Record<string, unknown>>({
  columns,
  rows,
  value,
  onSelect,
  getLabel,
  getRowId,
  searchKeys,
  placeholder = "Search…",
  size = "M",
  variant = "PresentationStyle",
  icon,
  theme,
  dir,
  className,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
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

  const rowId = (row: T) => getRowId?.(row) ?? JSON.stringify(row);
  const label = (row: T) =>
    getLabel?.(row) ?? String(row[columns[0]?.key] ?? "");

  const keysToSearch = searchKeys ?? columns.map((c) => c.key);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      keysToSearch.some((k) =>
        String(row[k] ?? "").toLowerCase().includes(q)
      )
    );
  }, [rows, search, keysToSearch]);

  const selectedId = value ? rowId(value) : undefined;
  // True while the user is actively typing a query. When false, the input shows
  // the selected row's label as its real value (solid text, not placeholder).
  const [searching, setSearching] = useState(false);

  const handleSelect = (row: T) => {
    onSelect?.(row);
    setSearch("");
    setSearching(false);
    setOpen(false);
  };

  // Solid value: search text while typing, otherwise the selected label.
  const displayValue = searching ? search : value ? label(value) : "";

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
              // Start a fresh search; the selected label clears so the user can type.
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
              // Prevent the input's blur/focus race; toggle the dropdown.
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
        // Lock the dropdown to the input's width; the table fits within it via
        // w-full + table-fixed (columns share this width, no overflow).
        style={{ width: dropdownWidth || undefined }}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(tableDropdownStyles({ variant }))}
      >
        {filteredRows.length > 0 ? (
          // Table-DDV wrapper: frosted bordered card around the table (Figma).
          // The radius + overflow-hidden also go on the <table> itself, because a
          // <table>'s corner cells paint to square edges and otherwise cover an
          // ancestor's rounded corners.
          <div className="rounded-[10px] border overflow-x-auto  border-white-alpha-40 bg-[rgba(184,192,204,0.5)]">
            <Table
              theme={theme as never}
              data-theme="dark"
              // Natural width (w-max) so columns keep their sizes and the wrapper
              // scrolls horizontally instead of squeezing them into the input width.
              className="w-max rounded-[10px] overflow-hidden"
            >
              {/* The blurred dark header bar is painted on the TableHEAD cells
                  (which fill the row); bg/height on a <tr> doesn't render
                  reliably because cells paint over it. */}
              <TableHeader className=" bg-black-alpha-20 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15)]">
                <TableRow className="h-[44px] [&_button]:bg-white-alpha-40 [&>th]:border-white-alpha-20">
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
                      // White semibold header text from the design.
                      className="cursor-default typography-body-medium-medium text-white"
                    >
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => {
                  const id = rowId(row);
                  return (
                    <TableRow
                      key={id}
                      state={selectedId === id ? "selected" : undefined}
                      onClick={() => handleSelect(row)}
                      // h-[40px] rows with a translucent white bottom rule.
                      className={cn("cursor-pointer h-[40px] ", selectedId === id && "bg-white-alpha-50")}
                    >
                      {columns.map((col) => (
                        <TableCell
                          key={col.key}
                          // White body text; whitespace-nowrap (overriding the
                          // component's break-all) keeps columns wide so the
                          // table overflows horizontally instead of wrapping.
                          className="border-b border-white-alpha-20 text-white px-[8px] !whitespace-nowrap !break-normal"
                        >
                          {col.render
                            ? col.render(row)
                            : String(row[col.key] ?? "")}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="px-3 py-4 typography-body-small-regular text-white-alpha-75">
            No results found
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

SearchableTable.displayName = "SearchableTable";
