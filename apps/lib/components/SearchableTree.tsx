"use client";

import {
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Icon, Input, Group } from "./Input";
import { Button, LoadingIcon } from "./Button";
import { useClickOutside } from "../hooks/useClickOutside";

/**
 * SearchableTree — a field that opens an anchored dropdown to pick a node from
 * a tree.
 *
 * Same data model and tree rendering as SearchableTreeDialog, but instead of a
 * centered modal it behaves like SearchableSelect: a trigger field that opens a
 * Popover anchored below it, containing a search bar + the scrollable tree.
 *
 * Interaction (matches the Figma `Search.Overlay` design):
 *   • A FOLDER row (a node with children) toggles expand/collapse on click and
 *     reads de-emphasized — unless `selectableFolders` is set, in which case it
 *     selects + closes like a leaf.
 *   • A LEAF row (no children) selects the node and closes the dropdown.
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

  /** Field placeholder shown when nothing is selected (the field is the search input). */
  placeholder?: string;
  /** Section heading shown above the tree rows in the dropdown. */
  title?: string;

  size?: "XS" | "S" | "M";
  variant?: "SystemStyle" | "PresentationStyle";
  icon?: ReactNode;
  theme?: Themes;
  dir?: string;
  className?: string;
  /**
   * Expand every node by default when the dropdown opens. Defaults to `true` so
   * children are visible as soon as the tree opens (matches the Figma design).
   */
  defaultExpanded?: boolean;
  /**
   * When true, folder rows (nodes with children) are ALSO selectable: clicking
   * any node — folder or leaf — selects it and closes the dropdown. When false
   * (default), folders only toggle expand/collapse and only leaves are selectable.
   */
  selectableFolders?: boolean;
  /** Max height (px) of the scrollable tree body before it scrolls (default 320). */
  maxBodyHeight?: number;

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

export function SearchableTree<T>({
  nodes,
  getNodeId,
  getNodeLabel,
  getNodeChildren,
  parentIdKey,
  value,
  onSelect,
  getSearchText,
  placeholder = "Select…",
  title = "Select an item",
  size = "M",
  variant = "PresentationStyle",
  icon,
  theme,
  dir,
  className,
  defaultExpanded = true,
  selectableFolders = false,
  maxBodyHeight = 320,
  filterClientSide = true,
  onSearchChange,
  searchDebounceMs = 300,
  loading = false,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const popoverContentRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside both the trigger and the popover surface.
  const groupRef = useClickOutside<HTMLDivElement>((e) => {
    const target = e?.target as Node;
    if (
      !groupRef.current?.contains(target) &&
      !popoverContentRef.current?.contains(target)
    ) {
      setOpen(false);
    }
  });

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

  // Reset the query when the dropdown closes.
  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const selectedId = value != null ? getNodeId(value) : undefined;

  // Leaf rows select + close; folder rows toggle expand/collapse (handled inline).
  const handleSelect = (node: TreeNode<T>) => {
    onSelect?.(node.raw);
    setSearch("");
    setSearching(false);
    setOpen(false);
  };

  // Folder rows when `selectableFolders` is on: behave just like a leaf —
  // select the node and close the dropdown so it shows in the field.
  const handleSelectFolder = (node: TreeNode<T>) => {
    handleSelect(node);
  };

  // Field value: the live query while typing, otherwise the selected label.
  const selectedLabel = value != null ? getNodeLabel(value) : "";
  const displayValue = searching
    ? search
    : typeof selectedLabel === "string"
      ? selectedLabel
      : "";

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
          {/* The field itself is the search input — typing filters the tree. */}
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={displayValue}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearching(true);
              if (!open) setOpen(true);
            }}
            onFocus={() => {
              setSearching(true);
              setSearch("");
              setDropdownWidth(groupRef.current?.offsetWidth ?? 0);
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
                setDropdownWidth(groupRef.current?.offsetWidth ?? 0);
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
        align="start"
        sideOffset={4}
        style={{ width: dropdownWidth || undefined }}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onWheel={(e) => e.stopPropagation()}
        className="p-0 border-0 bg-transparent shadow-none rounded-[14px] flex flex-col gap-0 overflow-visible"
      >
        {/* SearchResult body — frosted surface holding the "Tree" label + rows. */}
        <div className="flex w-full items-start">
          <div
            className="flex-1 min-w-px overflow-auto scrollbar-hide rounded-[14px] py-[8px] px-[4px] bg-[rgba(61,64,69,0.72)] backdrop-blur-[21px] shadow-[0_0_32px_2px_rgba(0,0,0,0.20),0_0_48px_2px_rgba(0,0,0,0.05)]"
            style={{ maxHeight: maxBodyHeight }}
          >
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
      </PopoverContent>
    </Popover>
  );
}

SearchableTree.displayName = "SearchableTree";

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
        // Leaf rows always select + close. Folder rows either select + close
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
                    "flex w-full items-center gap-2 px-[12px] py-[4px] rounded-[8px]",
                    "transition-all duration-300 ease-in-out",
                    "text-content-presentation-global-primary-light",
                    // Selectable rows (leaves, or folders when selectableFolders)
                    // highlight on hover/select; non-selectable folders only toggle,
                    // so they read as de-emphasized (opacity-50) and get no highlight.
                    !highlightable && "opacity-50",
                    highlightable &&
                      "group-hover:bg-white-50 group-hover:text-black-1000 group-hover:shadow-[0_0_16px_0_rgba(0,0,0,0.36)]",
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
