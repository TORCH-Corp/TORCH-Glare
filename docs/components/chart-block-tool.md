---
title: ChartBlockTool
description: An Editor.js block tool that renders an editable chart.js chart (bar, line, pie, doughnut, radar, polar area) inside the TORCH Glare TextEditor
group: Advanced
keywords: [chart-block-tool, editorjs, chart, chartjs, text-editor, block-tool, advanced]
---

# ChartBlockTool

> An advanced, non-visual module: a custom [Editor.js](https://editorjs.io) **block tool**
> that renders and edits a [chart.js](https://www.chartjs.org) chart inside the TORCH Glare
> [TextEditor](./text-editor.md). It is not a React component — it is a block-tool class you
> register in an Editor.js `tools` config. TextEditor wires it up for you; add it directly only
> when you build a custom Editor.js instance.

## Installation

TORCH Glare is a copy-in library: the CLI copies this module's source into your project
(you do **not** install it from the npm package). Run `init` once, then `add`:

```bash
npx torch-glare@latest init
npx torch-glare@latest add TextEditor
```

`ChartBlockTool` ships as part of the `TextEditor` folder, so `add TextEditor` copies it in.
It depends on the `chart.js` npm package (installed automatically by the CLI).

## Import

```typescript
import { ChartBlockTool, type ChartBlockData } from "@/components/TextEditor";
```

## Quick Examples

### Register it in an Editor.js instance

```typescript
import EditorJS from "@editorjs/editorjs";
import { ChartBlockTool } from "@/components/TextEditor";

const editor = new EditorJS({
  holder: "editor",
  tools: {
    chart: {
      class: ChartBlockTool,
    },
  },
});
```

Once registered, the tool appears in the Editor.js toolbox (title "Chart"). Selecting it
inserts an editable chart block: a title field, a chart-type selector, and label/dataset
editors. The block persists as `ChartBlockData` in the editor's saved output.

### The saved data shape

```typescript
import type { ChartBlockData } from "@/components/TextEditor";

const block: ChartBlockData = {
  chartType: "bar",
  title: "Quarterly revenue",
  labels: ["Q1", "Q2", "Q3", "Q4"],
  datasets: [
    {
      label: "2024",
      data: [12, 19, 8, 15],
      backgroundColor: "#3b82f6",
      borderColor: "#1d4ed8",
    },
  ],
};
```

## API Reference

`ChartBlockTool` implements the Editor.js `BlockTool` interface. You register the **class**;
Editor.js constructs and calls it. Its public surface:

### Props

| Member | Type | Description |
|--------|------|-------------|
| `default export` | `class ChartBlockTool` | The block-tool class to pass as `tools.chart.class`. |
| `static toolbox` | `{ title: string; icon: string }` | Toolbox entry (title "Chart" + icon) shown in the Editor.js block menu. |
| `static isReadOnlySupported` | `boolean` | `true` — the block renders in read-only editors. |
| `constructor` | `({ data, api, readOnly }) => ChartBlockTool` | Called by Editor.js with the saved `data` (`Partial<ChartBlockData>`), the editor `api`, and the `readOnly` flag. |
| `render()` | `() => HTMLElement` | Returns the block's DOM (editor UI or read-only chart). |
| `save()` | `() => ChartBlockData` | Returns the block's current data for persistence. |

### TypeScript

```typescript
export interface ChartBlockData {
  chartType: "bar" | "line" | "pie" | "doughnut" | "radar" | "polarArea";
  title: string;
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }>;
}

export default class ChartBlockTool {
  static get isReadOnlySupported(): boolean;
  static get toolbox(): { title: string; icon: string };
  constructor(options: { data: Partial<ChartBlockData>; api: any; readOnly: boolean });
  render(): HTMLElement;
  save(): ChartBlockData;
}
```

## Common Patterns

- **Use via TextEditor:** most apps should use [TextEditor](./text-editor.md), which registers
  this tool for you — you rarely construct it directly.
- **Custom Editor.js:** when building your own Editor.js instance, register the class under a
  `tools` key; Editor.js handles construction and lifecycle.
- **Supported chart types:** `bar`, `line`, `pie`, `doughnut`, `radar`, `polarArea` (from
  `ChartBlockData["chartType"]`).

## Related Components

- [TextEditor](./text-editor.md) — the rich-text editor that hosts this block tool.
- [TableDnDWrapper](./table-dnd-wrapper.md) — another internal Editor.js tool module.
