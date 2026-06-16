"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "./Dialog";
import { Icon, Input, Group } from "./Input";
import { LoadingIcon } from "./Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./Table";

/**
 * SearchableTable — a field that opens a modal Dialog to pick a row from a Table.
 *
 * The trigger shows a placeholder until something is selected, then shows the
 * selected row's label. Clicking it opens a dialog containing a search input and
 * the data Table; clicking a row selects it, sets the value, and closes the
 * dialog. Supports client- or server-side search and infinite-scroll pagination.
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
  /** Text shown on the trigger after selection; defaults to the first column's value. */
  getLabel?: (row: T) => string;
  /** Stable id/key per row; defaults to JSON of the row. */
  getRowId?: (row: T) => string;
  /** Which fields the search matches; defaults to every column key. */
  searchKeys?: (keyof T & string)[];
  /** Trigger placeholder shown until a row is selected. */
  placeholder?: string;
  /** Placeholder for the search input inside the dialog. */
  searchPlaceholder?: string;
  /** Label shown on the dialog's search field. */
  title?: string;
  size?: "XS" | "S" | "M";
  variant?: "SystemStyle" | "PresentationStyle";
  icon?: ReactNode;
  theme?: Themes;
  dir?: string;
  className?: string;

  // --- Async / backend pagination (all optional; static `rows` still works) ---
  /**
   * When true (default), the component filters `rows` by searchKeys locally.
   * Set false for server-side search — `rows` are rendered as-is and you
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
  /** Called when the list nears the bottom and `hasMore && !loading`. */
  onLoadMore?: () => void;
}

export function SearchableTable<T extends Record<string, unknown>>({
  columns,
  rows,
  value,
  onSelect,
  getLabel,
  getRowId,
  searchKeys,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  title = "Select an item",
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
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const rowId = (row: T) => getRowId?.(row) ?? JSON.stringify(row);
  const label = (row: T) =>
    getLabel?.(row) ?? String(row[columns[0]?.key] ?? "");

  const keysToSearch = searchKeys ?? columns.map((c) => c.key);

  // Debounced server search: notify the consumer to refetch when the query
  // settles. Skipped entirely if no onSearchChange is provided (static mode).
  useEffect(() => {
    if (!onSearchChange) return;
    const id = setTimeout(() => onSearchChange(search.trim()), searchDebounceMs);
    return () => clearTimeout(id);
  }, [search, onSearchChange, searchDebounceMs]);

  // Reset the query whenever the dialog closes so it reopens clean.
  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  // Infinite scroll: when the scroll viewport nears the bottom, ask the consumer
  // to load the next page.
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!onLoadMore || !hasMore || loading) return;
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 80) {
      onLoadMore();
    }
  };

  const filteredRows = useMemo(() => {
    // Server-side search mode: render rows as-is (already filtered upstream).
    if (!filterClientSide) return rows;
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      keysToSearch.some((k) =>
        String(row[k] ?? "").toLowerCase().includes(q)
      )
    );
  }, [rows, search, keysToSearch, filterClientSide]);

  const selectedId = value ? rowId(value) : undefined;

  const handleSelect = (row: T) => {
    onSelect?.(row);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Trigger: shows placeholder until a row is selected, then its label. */}
        <Group
          dir={dir}
          data-theme={theme}
          variant={variant}
          size={size === "XS" ? "S" : size}
          role="button"
          tabIndex={0}
          className={cn(
            "flex w-full items-center gap-1 p-1 cursor-pointer",
            className
          )}
        >
          {icon && <Icon>{icon}</Icon>}
          <span
            className={cn(
              "flex-1 px-1 truncate typography-body-medium-regular",
              value
                ? "text-content-presentation-action-light-primary"
                : "text-content-presentation-action-light-secondary"
            )}
          >
            {value ? label(value) : placeholder}
          </span>
          <i className="ri-arrow-down-s-line text-[16px] shrink-0 text-content-presentation-action-light-primary" />
        </Group>
      </DialogTrigger>

      <DialogContent
        dir={dir}
        data-theme={theme}
        onOpenAutoFocus={(e) => {
          // Focus the search input instead of the first row.
          e.preventDefault();
          inputRef.current?.focus();
        }}
        className={cn(
          "w-[min(640px,90vw)] bg-transparent !items-stretch rounded-[14px] p-4 gap-3 shadow-none",
        )}
      >
        {/* Visually-hidden title for accessibility (Radix requires a DialogTitle). */}
        <DialogTitle className="sr-only">{title ?? "Select an item"}</DialogTitle>

        {/* Search input — local inline-label field (full control over colors). */}
        <SearchInput
          ref={inputRef}
          variant={variant}
          theme={theme}
          dir={dir}
          label={title}
          value={search}
          placeholder={searchPlaceholder}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Scrollable table area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="max-h-[55vh] overflow-auto scrollbar-hide rounded-[10px] border border-white-alpha-40 bg-[rgba(184,192,204,0.5)]"
        >
          {filteredRows.length > 0 && (
            <Table
              theme={theme as never}
              data-theme="dark"
              className="w-full rounded-[10px] overflow-hidden"
            >
              <TableHeader className="bg-black-alpha-20 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15)]">
                <TableRow className="h-[44px] [&_button]:bg-white-alpha-40 [&>th]:border-white-alpha-20">
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
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
                      className={cn(
                        "cursor-pointer h-[40px]",
                        selectedId === id && "bg-white-alpha-50"
                      )}
                    >
                      {columns.map((col) => (
                        <TableCell
                          key={col.key}
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
          )}

          {/* Empty state — only when nothing is loading. */}
          {filteredRows.length === 0 && !loading && (
            <div className="px-3 py-6 text-center typography-body-small-regular text-white-alpha-75">
              No results found
            </div>
          )}

          {/* Loading row (initial load or fetching the next page). */}
          {loading && (
            <div className="flex items-center justify-center py-3">
              <LoadingIcon size="M" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

SearchableTable.displayName = "SearchableTable";

/* -------------------------------------------------------------------------- */
/* SearchInput — local inline-label search field (replaces InnerLabelField).  */
/* The whole field + its text turn white on hover/focus, fully controlled here. */
/* -------------------------------------------------------------------------- */

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "SystemStyle" | "PresentationStyle";
  theme?: Themes;
  label?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ variant = "PresentationStyle", theme, label, className, ...props }, ref) => (
    <Group
      data-theme={theme}
      variant={variant}
      size="M"
      className={cn(
        "group flex w-full items-center gap-2 p-1 rounded-[10px] transition-colors",
        "border border-white-alpha-40 bg-[rgba(184,192,204,0.5)]",
        "hover:bg-background-presentation-table-row-hover",
        "focus-within:bg-background-presentation-table-row-hover",
        className
      )}
    >
      <Icon className="shrink-0">
        <i className="ri-search-line text-content-presentation-global-secondary transition-colors group-hover:text-white group-focus-within:text-white" />
      </Icon>

      {label && (
        <>
          <span className="shrink-0 px-1 typography-labels-small-regular text-content-presentation-global-secondary text-[14px] text-white transition-colors group-hover:text-white group-focus-within:text-white">
            {label}
          </span>
          <span className="h-[14px] w-px shrink-0 rounded-full bg-border-presentation-action-labelless-divider transition-colors group-hover:bg-white-alpha-40" />
        </>
      )}

      <Input
        ref={ref}
        {...props}
        className={cn(
          "min-w-[100px] flex-1 !h-[24px] bg-transparent",
          "text-content-presentation-action-light-primary",
          "transition-colors group-hover:!text-white group-focus-within:!text-white"
        )}
      />
    </Group>
  )
);
SearchInput.displayName = "SearchInput";
