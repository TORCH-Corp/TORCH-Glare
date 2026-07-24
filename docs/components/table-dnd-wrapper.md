---
title: TableDnDWrapper
description: A factory that wraps the Editor.js table tool to add drag-and-drop reordering of rows and columns, used by the TORCH Glare TextEditor
group: Advanced
keywords: [table-dnd-wrapper, editorjs, table, drag-and-drop, reorder, text-editor, advanced]
---

# TableDnDWrapper

> An advanced, non-visual module: a factory that **wraps `@editorjs/table`** and adds
> drag-and-drop reordering of rows and columns. It is not a React component — its default
> export, `createTableDnDClass(OriginalTable)`, returns a subclass of the Editor.js table tool
> that you register in an Editor.js `tools` config. The TORCH Glare [TextEditor](./text-editor.md)
> uses it internally; add it directly only when building a custom Editor.js instance.

## How it works

It reuses the table plugin's existing `.tc-toolbox` toggler elements — no extra UI is injected:

- **Click** the toggler → opens the original popover menu (unchanged).
- **Drag** the toggler → reorders that row or column (new behavior).

## Installation

TORCH Glare is a copy-in library: the CLI copies this module's source into your project
(you do **not** install it from the npm package). Run `init` once, then `add`:

```bash
npx torch-glare@latest init
npx torch-glare@latest add TextEditor
```

`createTableDnDClass` ships as part of the `TextEditor` folder, so `add TextEditor` copies it in.

## Import

```typescript
import { createTableDnDClass } from "@/components/TextEditor";
```

## Quick Examples

### Register a drag-enabled table in Editor.js

```typescript
import EditorJS from "@editorjs/editorjs";
import Table from "@editorjs/table";
import { createTableDnDClass } from "@/components/TextEditor";

// Wrap the original table tool to add row/column drag-and-drop.
const TableWithDnD = createTableDnDClass(Table);

const editor = new EditorJS({
  holder: "editor",
  tools: {
    table: {
      class: TableWithDnD,
      inlineToolbar: true,
    },
  },
});
```

The returned class behaves exactly like `@editorjs/table` (same config, same saved data), with
drag reordering added on top.

## API Reference

### Props

| Member | Type | Description |
|--------|------|-------------|
| `default export` | `createTableDnDClass(OriginalTable) => TableClass` | Factory. Pass the Editor.js table tool class; returns a subclass that adds row/column drag-and-drop. |
| `OriginalTable` | `TableClass` | The Editor.js table tool class to wrap (e.g. `@editorjs/table`). |
| returns | `TableClass` | A `TableDnD` subclass to register under a `tools` key. |

The returned class extends the original tool, so it inherits all of the wrapped table's config,
props, and saved-data shape — the wrapper only augments pointer handling on the existing
row/column togglers.

### TypeScript

```typescript
// The wrapped table tool is typed loosely because it extends a third-party class.
type TableClass = any;

/**
 * Wrap an Editor.js table tool class and return a subclass that adds
 * drag-and-drop reordering of rows and columns.
 */
export default function createTableDnDClass(OriginalTable: TableClass): TableClass;
```

## Common Patterns

- **Use via TextEditor:** most apps should use [TextEditor](./text-editor.md), which applies
  this wrapper for you — you rarely call the factory directly.
- **Custom Editor.js:** wrap the table class once (`createTableDnDClass(Table)`) and register
  the result; the rest of your Editor.js config is unchanged.
- **Drag threshold:** a pointer must move a few pixels before a click becomes a drag, so normal
  toggler clicks still open the table menu.

## Related Components

- [TextEditor](./text-editor.md) — the rich-text editor that uses this wrapper.
- [ChartBlockTool](./chart-block-tool.md) — another internal Editor.js tool module.
- [DataTable](./data-table.md) — a standalone React data table (unrelated to the Editor.js table block).
