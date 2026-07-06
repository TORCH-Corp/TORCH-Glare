---
title: SearchableTree
description: Searchable tree-select that opens on focus and filters hierarchical nodes as you type, on a Popover surface, with client or server-side search
group: Inputs
keywords: [searchable-tree, tree, tree-select, hierarchy, search, combobox, async, popover]
---

# SearchableTree

> A searchable tree-select. It renders a field that opens a Popover containing a hierarchical
> tree of nodes and filters them as you type. Accepts either nested data (via `getNodeChildren`)
> or a flat list that it nests for you (via `parentIdKey`). Supports local filtering or
> debounced server-side search, optional folder selection, and controlled selection.

## Installation

TORCH Glare is a copy-in library: the CLI copies this component's source into your project
(you do **not** install it from the npm package). Run `init` once, then `add`:

```bash
npx torch-glare@latest init
npx torch-glare@latest add SearchableTree
```

The CLI also copies its internal dependencies: `Button`, `Input`, `Popover`, the
`useClickOutside` hook, and the `cn`/`types` utils.

## Import

```typescript
import { SearchableTree } from "@/components/SearchableTree";
```

## Quick Examples

### Basic Usage (nested data)

```tsx
import { SearchableTree } from "@/components/SearchableTree";

type Node = { id: string; name: string; children?: Node[] };

const data: Node[] = [
  {
    id: "eng",
    name: "Engineering",
    children: [
      { id: "fe", name: "Frontend" },
      { id: "be", name: "Backend" },
    ],
  },
  { id: "design", name: "Design" },
];

export function DepartmentPicker() {
  const [value, setValue] = useState<Node | null>(null);

  return (
    <SearchableTree
      nodes={data}
      getNodeId={(n) => n.id}
      getNodeLabel={(n) => n.name}
      getNodeChildren={(n) => n.children}
      value={value}
      onSelect={setValue}
      placeholder="Select a department"
      title="Departments"
      size="M"
    />
  );
}
```

### Flat data (built from a parent id)

```tsx
type Row = { id: string; label: string; parentId: string | null };

const rows: Row[] = [
  { id: "1", label: "Company", parentId: null },
  { id: "2", label: "Sales", parentId: "1" },
  { id: "3", label: "EMEA", parentId: "2" },
];

<SearchableTree
  nodes={rows}
  parentIdKey="parentId"
  getNodeId={(r) => r.id}
  getNodeLabel={(r) => r.label}
  onSelect={(r) => console.log(r.id)}
/>;
```

### Server-side search

```tsx
<SearchableTree
  nodes={results}
  getNodeId={(n) => n.id}
  getNodeLabel={(n) => n.name}
  getNodeChildren={(n) => n.children}
  filterClientSide={false}
  onSearchChange={(query) => fetchNodes(query)}
  loading={isFetching}
  searchDebounceMs={300}
/>
```

### Selectable folders

```tsx
<SearchableTree
  nodes={data}
  getNodeId={(n) => n.id}
  getNodeLabel={(n) => n.name}
  getNodeChildren={(n) => n.children}
  selectableFolders
  onSelect={(n) => console.log(n.id)}
/>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `T[]` | — | Tree data. Nested by default; treated as a flat list when `parentIdKey` is set. |
| `getNodeId` | `(node: T) => string` | — | Returns a stable unique id for a node. |
| `getNodeLabel` | `(node: T) => ReactNode` | — | Returns a node's display label. |
| `getNodeChildren` | `(node: T) => T[] \| undefined` | — | Returns a node's children (nested mode). Ignored when `parentIdKey` is set. |
| `parentIdKey` | `keyof T & string` | — | When set, `nodes` is a FLAT list and the tree is built from this parent-id key. |
| `value` | `T \| null` | — | Controlled selected node. |
| `onSelect` | `(node: T) => void` | — | Called when a node is selected. |
| `getSearchText` | `(node: T) => string` | `String(getNodeLabel(node))` | Plain text used for search matching. |
| `placeholder` | `string` | `"Select…"` | Field placeholder shown when nothing is selected. |
| `title` | `string` | `"Select an item"` | Section heading above the tree rows in the dropdown. |
| `size` | `"XS" \| "S" \| "M"` | `"M"` | Field size. |
| `variant` | `"SystemStyle" \| "PresentationStyle"` | `"PresentationStyle"` | Visual style. `SystemStyle` is reserved for internal library system surfaces. |
| `icon` | `ReactNode` | — | Leading icon in the field. |
| `theme` | `Themes` | — | `"dark" \| "light" \| "default"`. |
| `dir` | `string` | — | Text direction. |
| `className` | `string` | — | Extra classes for the field. |
| `defaultExpanded` | `boolean` | `true` | Expand every node when the dropdown opens. |
| `selectableFolders` | `boolean` | `false` | When true, folder nodes are selectable too; otherwise folders only expand/collapse. |
| `maxBodyHeight` | `number` | `320` | Max height (px) of the scrollable tree body before it scrolls. |
| `filterClientSide` | `boolean` | `true` | Filter locally. Set `false` for server-side search. |
| `onSearchChange` | `(query: string) => void` | — | Debounced as the user types — refetch your data here (server search). |
| `searchDebounceMs` | `number` | `300` | Debounce for `onSearchChange`. |
| `loading` | `boolean` | `false` | Whether a fetch is in flight; shows a loading indicator. |

### TypeScript

```typescript
import { ReactNode } from "react";
import { Themes } from "@/utils/types";

interface SearchableTreeProps<T> {
  nodes: T[];
  getNodeId: (node: T) => string;
  getNodeLabel: (node: T) => ReactNode;
  getNodeChildren?: (node: T) => T[] | undefined;
  parentIdKey?: keyof T & string;
  value?: T | null;
  onSelect?: (node: T) => void;
  getSearchText?: (node: T) => string;
  placeholder?: string;
  title?: string;
  size?: "XS" | "S" | "M";
  variant?: "SystemStyle" | "PresentationStyle";
  icon?: ReactNode;
  theme?: Themes;
  dir?: string;
  className?: string;
  defaultExpanded?: boolean;
  selectableFolders?: boolean;
  maxBodyHeight?: number;
  filterClientSide?: boolean;
  onSearchChange?: (query: string) => void;
  searchDebounceMs?: number;
  loading?: boolean;
}

export function SearchableTree<T>(props: SearchableTreeProps<T>): JSX.Element;
```

## Common Patterns

- **Nested vs flat data:** provide `getNodeChildren` for already-nested data, or `parentIdKey`
  to let the component nest a flat list for you. Do not use both.
- **Async search:** set `filterClientSide={false}` and handle `onSearchChange` to fetch from a
  backend; pass `loading` while the request is in flight.
- **Folder selection:** by default only leaf nodes are selectable. Set `selectableFolders` to
  allow selecting a folder node (clicking any node selects it and closes the dropdown).

## Related Components

- [SearchableTreeDialog](./searchable-tree-dialog.md) — the same tree-select in a modal dialog.
- [SearchableSelect](./searchable-select.md) — flat searchable single-select combobox.
- [TreeDropDown](./tree-drop-down.md) — dropdown tree without search.
