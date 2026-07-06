---
title: SearchableTreeDialog
description: Searchable tree-select presented in a modal dialog — a trigger opens a dialog containing a searchable hierarchical tree, with client or server-side search
group: Inputs
keywords: [searchable-tree-dialog, tree, tree-select, dialog, modal, hierarchy, search, async]
---

# SearchableTreeDialog

> A searchable tree-select that opens in a modal **Dialog** instead of a popover. A trigger
> field opens a dialog containing a search input and a hierarchical tree of nodes, filtered as
> you type. Accepts nested data (via `getNodeChildren`) or a flat list it nests for you (via
> `parentIdKey`). Supports local filtering or debounced server-side search, optional folder
> selection, and controlled selection. Use it instead of [SearchableTree](./searchable-tree.md)
> when the tree is large or you want a focused, full-screen-friendly selection surface.

## Installation

TORCH Glare is a copy-in library: the CLI copies this component's source into your project
(you do **not** install it from the npm package). Run `init` once, then `add`:

```bash
npx torch-glare@latest init
npx torch-glare@latest add SearchableTreeDialog
```

The CLI also copies its internal dependencies: `Button`, `Dialog`, `Input`, and the
`cn`/`types` utils.

## Import

```typescript
import { SearchableTreeDialog } from "@/components/SearchableTreeDialog";
```

## Quick Examples

### Basic Usage (nested data)

```tsx
import { SearchableTreeDialog } from "@/components/SearchableTreeDialog";

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
    <SearchableTreeDialog
      nodes={data}
      getNodeId={(n) => n.id}
      getNodeLabel={(n) => n.name}
      getNodeChildren={(n) => n.children}
      value={value}
      onSelect={setValue}
      placeholder="Select a department"
      searchPlaceholder="Search departments…"
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

<SearchableTreeDialog
  nodes={rows}
  parentIdKey="parentId"
  getNodeId={(r) => r.id}
  getNodeLabel={(r) => r.label}
  onSelect={(r) => console.log(r.id)}
/>;
```

### Server-side search

```tsx
<SearchableTreeDialog
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
| `placeholder` | `string` | — | Trigger placeholder shown until a node is selected. |
| `searchPlaceholder` | `string` | — | Placeholder for the search input inside the dialog. |
| `title` | `string` | — | Label shown on the dialog's search field. |
| `size` | `"XS" \| "S" \| "M"` | `"M"` | Trigger size. |
| `variant` | `"SystemStyle" \| "PresentationStyle"` | `"PresentationStyle"` | Visual style. `SystemStyle` is reserved for internal library system surfaces. |
| `icon` | `ReactNode` | — | Leading icon in the trigger. |
| `theme` | `Themes` | — | `"dark" \| "light" \| "default"`. |
| `dir` | `string` | — | Text direction. |
| `className` | `string` | — | Extra classes for the trigger. |
| `defaultExpanded` | `boolean` | `true` | Expand every node when the dialog opens. |
| `selectableFolders` | `boolean` | `false` | When true, folder nodes are selectable too; otherwise folders only expand/collapse. |
| `filterClientSide` | `boolean` | `true` | Filter locally. Set `false` for server-side search. |
| `onSearchChange` | `(query: string) => void` | — | Debounced as the user types — refetch your data here (server search). |
| `searchDebounceMs` | `number` | `300` | Debounce for `onSearchChange`. |
| `loading` | `boolean` | `false` | Whether a fetch is in flight; shows a loading indicator. |

### TypeScript

```typescript
import { ReactNode } from "react";
import { Themes } from "@/utils/types";

interface SearchableTreeDialogProps<T> {
  nodes: T[];
  getNodeId: (node: T) => string;
  getNodeLabel: (node: T) => ReactNode;
  getNodeChildren?: (node: T) => T[] | undefined;
  parentIdKey?: keyof T & string;
  value?: T | null;
  onSelect?: (node: T) => void;
  getSearchText?: (node: T) => string;
  placeholder?: string;
  searchPlaceholder?: string;
  title?: string;
  size?: "XS" | "S" | "M";
  variant?: "SystemStyle" | "PresentationStyle";
  icon?: ReactNode;
  theme?: Themes;
  dir?: string;
  className?: string;
  defaultExpanded?: boolean;
  selectableFolders?: boolean;
  filterClientSide?: boolean;
  onSearchChange?: (query: string) => void;
  searchDebounceMs?: number;
  loading?: boolean;
}

export function SearchableTreeDialog<T>(props: SearchableTreeDialogProps<T>): JSX.Element;
```

## Common Patterns

- **Dialog vs popover:** use `SearchableTreeDialog` for large trees or a focused modal
  selection; use [SearchableTree](./searchable-tree.md) for an inline popover field.
- **Nested vs flat data:** provide `getNodeChildren` for nested data, or `parentIdKey` to nest
  a flat list. Do not use both.
- **Async search:** set `filterClientSide={false}`, handle `onSearchChange` to fetch, and pass
  `loading` while the request is in flight.

## Related Components

- [SearchableTree](./searchable-tree.md) — the same tree-select on an inline Popover.
- [SearchableSelect](./searchable-select.md) — flat searchable single-select combobox.
- [Dialog](./dialog.md) — the modal surface this component builds on.
