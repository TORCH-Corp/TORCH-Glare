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

/**
 * SearchableTreeDialog — a field that opens a modal Dialog to pick a node from a tree.
 *
 * Same layout as SearchableTable (trigger → dialog with a search input + a
 * scrollable area), but the area renders a hierarchical tree instead of a table.
 *
 * Interaction (matches the Figma `Search.Overlay` design):
 *   • A FOLDER row (a node with children) toggles expand/collapse on click —
 *     folders are not selectable.
 *   • A LEAF row (no children) selects the node and closes the dialog.
 * Nesting is shown with indentation + a vertical connector rail per level
 * (no chevron). Search filters matching nodes and keeps/expands ancestors.
 *
 * Accepts either NESTED data (each node exposes its children via getNodeChildren)
 * or FLAT data (pass `parentIdKey` and it builds the tree internally).
 */

interface Props<T> {
  /** Tree nodes. Nested by default; flat when `parentIdKey` is provided. */
  nodes: T[];
  getNodeId: (node: T) => string;
  getNodeLabel: (node: T) => ReactNode;
  /** Returns a node's children (nested mode). Ignored when `parentIdKey` is set. */
  getNodeChildren?: (node: T) => T[] | undefined;
  /**
   * When set, `nodes` is treated as a FLAT list and the tree is built from this
   * key (each item's parent id). Root items have a nullish parent id.
   */
  parentIdKey?: keyof T & string;

  /** Controlled selected node (optional). */
  value?: T | null;
  onSelect?: (node: T) => void;

  /** Plain-text label used for search matching; defaults to String(getNodeLabel). */
  getSearchText?: (node: T) => string;

  /** Trigger placeholder shown until a node is selected. */
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
  /**
   * Expand every node by default when the dialog opens. Defaults to `true` so
   * children are visible as soon as the tree opens (matches the Figma design).
   */
  defaultExpanded?: boolean;
  /**
   * When true, folder rows (nodes with children) are ALSO selectable: clicking
   * any node — folder or leaf — selects it and closes the dialog. When false
   * (default), folders only toggle expand/collapse and only leaves are selectable.
   */
  selectableFolders?: boolean;

  // --- Async (optional; static `nodes` still works) ---
  /** When true (default), filters locally. Set false for server-side search. */
  filterClientSide?: boolean;
  /** Debounced as the user types — refetch your data here (server search). */
  onSearchChange?: (query: string) => void;
  searchDebounceMs?: number;
  /** Whether a fetch is in flight; shows a loading indicator. */
  loading?: boolean;
}

/** Normalized internal node — always nested with resolved id/label/children. */
interface TreeNode<T> {
  id: string;
  label: ReactNode;
  searchText: string;
  raw: T;
  children: TreeNode<T>[];
}

export function SearchableTreeDialog<T>({
  nodes,
  getNodeId,
  getNodeLabel,
  getNodeChildren,
  parentIdKey,
  value,
  onSelect,
  getSearchText,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  title = "Select an item",
  size = "M",
  variant = "PresentationStyle",
  icon,
  theme,
  dir,
  className,
  defaultExpanded = true,
  selectableFolders = false,
  filterClientSide = true,
  onSearchChange,
  searchDebounceMs = 300,
  loading = false,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const searchTextOf = (node: T) =>
    getSearchText?.(node) ?? String(getNodeLabel(node) ?? "");

  // Normalize raw data (nested OR flat) into a uniform nested TreeNode shape.
  const tree = useMemo<TreeNode<T>[]>(() => {
    const toNode = (raw: T, children: TreeNode<T>[]): TreeNode<T> => ({
      id: getNodeId(raw),
      label: getNodeLabel(raw),
      searchText: searchTextOf(raw),
      raw,
      children,
    });

    // Flat mode: build nesting from parentIdKey.
    if (parentIdKey) {
      const byId = new Map<string, TreeNode<T>>();
      const roots: TreeNode<T>[] = [];
      for (const raw of nodes) byId.set(getNodeId(raw), toNode(raw, []));
      for (const raw of nodes) {
        const node = byId.get(getNodeId(raw))!;
        const parentId = raw[parentIdKey] as unknown as string | null | undefined;
        const parent = parentId != null ? byId.get(String(parentId)) : undefined;
        if (parent) parent.children.push(node);
        else roots.push(node);
      }
      return roots;
    }

    // Nested mode: recurse via getNodeChildren.
    const build = (raw: T): TreeNode<T> =>
      toNode(raw, (getNodeChildren?.(raw) ?? []).map(build));
    return nodes.map(build);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, parentIdKey, getNodeChildren]);

  // Filter the tree by the query, keeping ancestors of any match. In server-side
  // mode the data is already filtered, so we render it as-is.
  const visibleTree = useMemo<TreeNode<T>[]>(() => {
    const q = search.trim().toLowerCase();
    if (!filterClientSide || !q) return tree;
    const filter = (list: TreeNode<T>[]): TreeNode<T>[] =>
      list.reduce<TreeNode<T>[]>((acc, node) => {
        const kids = filter(node.children);
        const self = node.searchText.toLowerCase().includes(q);
        if (self || kids.length) acc.push({ ...node, children: kids });
        return acc;
      }, []);
    return filter(tree);
  }, [tree, search, filterClientSide]);

  // Expand-state: when searching (or defaultExpanded), expand everything so the
  // matched paths are visible; otherwise honor user toggles.
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const forceExpand = (filterClientSide && search.trim().length > 0) || defaultExpanded;
  const isExpanded = (id: string) => forceExpand || expanded.has(id);
  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // Debounced server search.
  useEffect(() => {
    if (!onSearchChange) return;
    const t = setTimeout(() => onSearchChange(search.trim()), searchDebounceMs);
    return () => clearTimeout(t);
  }, [search, onSearchChange, searchDebounceMs]);

  // Reset the query when the dialog closes.
  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const selectedId = value != null ? getNodeId(value) : undefined;

  // Leaf rows select + close; folder rows toggle expand/collapse (handled inline).
  const handleSelect = (node: TreeNode<T>) => {
    onSelect?.(node.raw);
    setOpen(false);
  };

  // Folder rows when `selectableFolders` is on: behave just like a leaf —
  // select the node and close the dialog so it shows in the field.
  const handleSelectFolder = (node: TreeNode<T>) => {
    handleSelect(node);
  };

  // Trigger label = selected node's label, else placeholder.
  const triggerLabel = value != null ? getNodeLabel(value) : placeholder;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
              value != null
                ? "text-content-presentation-action-light-primary"
                : "text-content-presentation-action-light-secondary"
            )}
          >
            {triggerLabel}
          </span>
          <i className="ri-arrow-down-s-line text-[16px] shrink-0 text-content-presentation-action-light-primary" />
        </Group>
      </DialogTrigger>

      <DialogContent
        dir={dir}
        data-theme={theme}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
        className="w-[min(640px,90vw)] bg-transparent !items-stretch rounded-[14px] shadow-none gap-0"
      >
        <DialogTitle className="sr-only">{title ?? "Select an item"}</DialogTitle>

        {/* SearchBar — frosted top-bar shell (z-2 in Figma). */}
        <TreeSearchInput
          ref={inputRef}
          variant={variant}
          theme={theme}
          dir={dir}
          label={title}
          value={search}
          placeholder={searchPlaceholder}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* SearchResult.Container — inset 12px each side, tucked under the bar (z-1). */}
        <div className="flex w-full items-start px-[12px]">
          {/* Body — frosted surface that connects to the bar with rounded-bottom. */}
          <div className="flex-1 min-w-px max-h-[55vh] overflow-auto scrollbar-hide rounded-b-[14px] pt-[8px] pb-[4px] px-[4px] bg-[rgba(61,64,69,0.72)] backdrop-blur-[21px] shadow-[0_0_32px_2px_rgba(0,0,0,0.20),0_0_48px_2px_rgba(0,0,0,0.05)]">
            {visibleTree.length > 0 ? (
              <div className="flex flex-col gap-[4px]">
                {/* "Tree" section label. */}
                {title && (
                  <div className="flex items-end pt-[4px] px-[12px]">
                    <span className="typography-body-small-medium text-content-presentation-global-primary-light">
                      {title}
                    </span>
                  </div>
                )}

                {/* Rows — translucent fill, 1px gaps, rounded + clipped group. */}
                <div className="flex flex-col gap-px overflow-clip rounded-[10px]">
                  <TreeLevel
                    nodes={visibleTree}
                    depth={0}
                    selectedId={selectedId}
                    selectableFolders={selectableFolders}
                    isExpanded={isExpanded}
                    onToggle={toggle}
                    onSelect={handleSelect}
                    onSelectFolder={handleSelectFolder}
                  />
                </div>
              </div>
            ) : (
              !loading && (
                <div className="px-3 py-6 text-center typography-body-small-regular text-white-alpha-75">
                  No results found
                </div>
              )
            )}

            {loading && (
              <div className="flex items-center justify-center py-3">
                <LoadingIcon size="M" />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

SearchableTreeDialog.displayName = "SearchableTreeDialog";

/* -------------------------------------------------------------------------- */
/* Recursive tree renderer                                                    */
/* -------------------------------------------------------------------------- */

function TreeLevel<T>({
  nodes,
  depth,
  selectedId,
  selectableFolders = false,
  isExpanded,
  onToggle,
  onSelect,
  onSelectFolder,
}: {
  nodes: TreeNode<T>[];
  depth: number;
  selectedId?: string;
  selectableFolders?: boolean;
  isExpanded: (id: string) => boolean;
  onToggle: (id: string) => void;
  onSelect: (node: TreeNode<T>) => void;
  onSelectFolder: (node: TreeNode<T>) => void;
}) {
  return (
    <>
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const open = isExpanded(node.id);
        const selected = selectedId === node.id;
        // Leaf rows always select + close. Folder rows either select + toggle
        // (selectableFolders) or just toggle expand/collapse.
        const onRowClick = () =>
          !hasChildren
            ? onSelect(node)
            : selectableFolders
              ? onSelectFolder(node)
              : onToggle(node.id);
        // Whether THIS row participates in the selected/hover highlight.
        const highlightable = !hasChildren || selectableFolders;
        return (
          <div key={node.id} className="flex flex-col gap-px">
            {/* item-container — full-width row with the design's grey fill. */}
            <div
              role="button"
              tabIndex={0}
              aria-expanded={hasChildren ? open : undefined}
              onClick={onRowClick}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onRowClick();
                }
              }}
              className={cn(
                "group flex items-center px-[2px] cursor-pointer bg-[rgba(184,192,204,0.36)]"
              )}
            >
              {/* Connector rails — one full-height vertical line per ancestor level. */}
              {Array.from({ length: depth }).map((_, i) => (
                <div
                  key={i}
                  aria-hidden
                  className="flex h-[33px] shrink-0 items-center overflow-clip px-[14px]"
                >
                  <div className="h-full w-px shrink-0 bg-white-alpha-40" />
                </div>
              ))}

              {/* Padding + label — inner row that highlights on hover/select. */}
              <div className="flex flex-1 min-w-px flex-col items-start py-[2px]">
                <div
                  className={cn(
                    "flex w-full  items-center gap-2 px-[12px] py-[4px] rounded-[8px]",
                    "transition-all duration-300  ease-in-out",
                    "text-content-presentation-global-primary-light",
                    // Selectable rows (leaves, or folders when selectableFolders)
                    // highlight on hover/select; non-selectable folders only toggle,
                    // so they read as de-emphasized (opacity-50) and get no highlight.
                    !highlightable && "opacity-50",
                    highlightable &&
                    "group-hover:bg-white-50  group-hover:text-black-1000 group-hover:shadow-[0_0_16px_0_rgba(0,0,0,0.36)]",
                    highlightable && selected && "bg-white-alpha-75 text-black-1000"
                  )}
                >
                  <span className="flex-1 min-w-px truncate typography-body-medium-regular">
                    {node.label}
                  </span>
                </div>
              </div>
            </div>

            {hasChildren && open && (
              <TreeLevel
                nodes={node.children}
                depth={depth + 1}
                selectedId={selectedId}
                selectableFolders={selectableFolders}
                isExpanded={isExpanded}
                onToggle={onToggle}
                onSelect={onSelect}
                onSelectFolder={onSelectFolder}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Inline-label search field (self-contained, mirrors SearchableTable's).     */
/* -------------------------------------------------------------------------- */

interface TreeSearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: "SystemStyle" | "PresentationStyle";
  theme?: Themes;
  label?: string;
}

const TreeSearchInput = forwardRef<HTMLInputElement, TreeSearchInputProps>(
  ({ variant = "PresentationStyle", theme, label, className, ...props }, ref) => (
    <div className="relative z-[2] flex w-full flex-col items-start gap-[10px] p-[3px] rounded-[14px] bg-[rgba(61,64,69,0.65)] shadow-[0_0_18px_0_rgba(0,0,0,0.40)] backdrop-blur-[21px]">
      <Group
        data-theme={theme}
        variant={variant}
        size="M"
        className={cn(
          "group flex w-full items-center hover:border-blue-sparkle-400 gap-[10px] px-[15px] py-[10px] rounded-[11px] transition-colors",
          "border border-white-alpha-40 bg-[rgba(37,44,57,0.30)]",
          "hover:bg-background-presentation-table-row-hover",
          "focus-within:bg-background-presentation-table-row-hover",
          className
        )}
      >
        <Icon className="shrink-0">
          <i className="ri-search-line text-[18px] text-content-presentation-global-secondary transition-colors group-hover:text-white group-focus-within:text-white" />
        </Icon>

        {label && (
          <span className="shrink-0 text-content-presentation-global-primary-light typography-headers-medium-regular opacity-80 transition-colors group-hover:text-white group-focus-within:text-white">
            {label}
          </span>
        )}

        <Input
          ref={ref}
          {...props}
          className={cn(
            "min-w-[100px] flex-1 !h-[24px]  bg-transparent",
            "text-content-presentation-action-light-primary placeholder:hover:text-white-alpha-75",
            "transition-colors group-hover:!text-white group-focus-within:!text-white"
          )}
        />
      </Group>
    </div>
  )
);
TreeSearchInput.displayName = "TreeSearchInput";
