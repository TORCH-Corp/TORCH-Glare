---
title: TreeFolder
description: Hierarchical tree with connector lines, multi-level expand/collapse, breadcrumb, keyboard navigation and touch-capable drag-and-drop reparenting.
group: Data Display
keywords: [tree, folder, hierarchy, file-explorer, expand, collapse, breadcrumb, drag-drop, reparent, nested, navigation]
---

# TreeFolder

> A file-explorer style tree: nested nodes with connector lines, selection that highlights the
> whole subtree, a breadcrumb of the current path, and drag-and-drop that can reparent a node.

## Installation

TORCH Glare is a copy-in library: the CLI copies this component's source into your project
(you do **not** install it from the npm package). Run `init` once, then `add`:

```bash
npx torch-glare@latest init
npx torch-glare@latest add TreeFolder
```

`TreeFolder` is a folder component — the CLI copies the whole directory, plus the `useDragDrop`
hook and the `cn` utility it depends on.

## Import

Import from your project's local path — the alias configured in `glare.json` (e.g. `@/*`):

```tsx
import { TreeFolder } from "@/components/TreeFolder";
```

## Usage

```tsx
const data = [
  {
    id: "src",
    name: "src",
    children: [
      { id: "app", name: "app", children: [{ id: "page", name: "page.tsx", children: [] }] },
      { id: "lib", name: "lib", children: [] },
    ],
  },
];

<TreeFolder
  data={data}
  defaultExpanded="roots"
  onSelectionChange={(id) => setSelected(id)}
/>
```

## Nodes

A node is `{ id, name, children }` plus optional presentation and permission flags:

| Field | Meaning |
| --- | --- |
| `id` | stable identity — selection, expansion and drag all key off it |
| `name` | the label, as text (the row owns its own layout) |
| `children` | nested nodes; a node with a non-empty array is *internal* (a folder) |
| `icon` | overrides the resolved icon for this node |
| `meta` | trailing content on the row — a count, a badge |
| `disabled` | greyed out and non-interactive |
| `draggable` / `droppable` | opt this node out of being picked up, or dropped into |
| `data` | anything of yours; the component never reads it |

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `data` | `TreeFolderNode[]` | the hierarchy |
| `selectedId` / `defaultSelectedId` | `string \| null` | controlled or uncontrolled selection |
| `onSelectionChange` | `(id: string \| null) => void` | |
| `expandedIds` / `defaultExpanded` | `string[]` · `"all" \| "roots" \| "none"` | |
| `onExpandedChange` | `(ids: string[]) => void` | |
| `dndEnabled` | `boolean` | turns dragging on |
| `onMove` | `(args: { dragIds, parentId, index }) => void` | reports the drop; moves nothing |
| `onDataChange` | `(next: TreeFolderNode[]) => void` | the tree applied the move for you |
| `iconFor` | resolver | per-node icon from `{ isOpen, isInternal, isSelected }` |
| `title` · `showHeader` · `showBreadcrumb` · `headerAccessory` | | the chrome above the rows |
| `highlightAncestors` · `highlightSubtree` | `boolean` | how far a selection tints |
| `rowHeight` · `indent` · `contentMinWidth` | `number` | 28 and 14 by default |
| `emptyState` | `ReactNode` | |

An imperative handle exposes `selectId`, `expandAll`, `collapseAll` and `scrollToId`.

## Dragging

Set `dndEnabled` and handle `onMove`. A drop is reported as **which nodes, into which parent, at
which index** — the tree does not rearrange itself unless you also pass `onDataChange`, which hands
back an already-moved copy for the uncontrolled case.

Where a drop lands depends on where in the row it happens: the top and bottom quarters mean
*beside* the target (reordering among its siblings), the middle means *inside* it (reparenting). A
leaf has no inside, so its whole row reads as before-or-after. A node can never be dropped into its
own descendant — that would detach the branch from the root — and the guard is enforced before
`onMove` fires.

It works with a finger and with the keyboard: hold to pick up and swipe to scroll, or Space, arrows,
Space. Auto-scroll near the edges is handled for you.

## Notes

`DataViews.Tree` composes this component — the row height, indent, connector lines, selection band
and drag grip all come from here, which is why a tree inside DataViews looks like every other tree
in the product. `renderNode` there returns `{ name, icon, meta }` rather than markup, because this
component owns the row.
