---
title: KanbanView
description: Standalone kanban board view for DataViews — groups records into columns by a field and renders each as a card. Use inside DataViewsLayout (tab mode) or directly in Composable Mode.
group: Data Display
keywords: [data-views, kanban-view, kanban, board, columns, group-by, cards, composable, dynamic-data, fields]
---

# KanbanView

> The board renderer behind `DataViewsLayout`'s "Board" tab. It groups records into columns by `groupByField` and renders each record as a card. In tab mode the layout renders it for you; render it directly only in **Composable Mode**.

## Installation

Part of `torch-glare`. Ships with the `DataViews` folder when you run `npx torch-glare add DataViews` — no separate install. It depends on the shared `Button` component, the `DataViewCard` layout, and `lucide-react`.

## Import

```tsx
import { KanbanView, useDataViewsState } from "torch-glare"
import type { KanbanViewProps, FieldConfig } from "torch-glare"
```

## When to use it directly

| Situation | Use |
|---|---|
| You want the standard tabbed multi-view UI | `DataViewsLayout` with `views={{ kanban: true }}` — it mounts `KanbanView` for you. |
| You want a custom layout (e.g. kanban beside a table) | Render `KanbanView` directly with state from `useDataViewsState`. |

## Composable Mode example

`KanbanView` groups by the `groupByField` path — every distinct value becomes a
column. Column colors are assigned deterministically, or per-value via the
field's `kanbanVariants`.

```tsx
import { KanbanView, useDataViewsState } from "torch-glare"
import type { FieldConfig } from "torch-glare"

const tasks = [
  { id: 1, title: "Spec API", status: "Todo", assignee: "Ada" },
  { id: 2, title: "Build UI", status: "In Progress", assignee: "Linus" },
  { id: 3, title: "Ship", status: "Done", assignee: "Grace" },
]

const fields: FieldConfig[] = [
  { path: "title", type: "text" },
  {
    path: "status",
    type: "enum-badge",
    kanbanVariants: {
      Todo: { label: "To Do", color: "gray" },
      "In Progress": { label: "In Progress", color: "blue" },
      Done: { label: "Done", color: "green" },
    },
  },
  { path: "assignee", type: "text" },
]

function TaskBoard() {
  const state = useDataViewsState({ data: tasks, fields })
  return (
    <KanbanView
      data={state.flatItems}
      fields={state.resolvedFields}
      config={state.config}
      groupByField="status"
      titleField="title"
    />
  )
}
```

### Column header actions

Pass `onColumnAction` to show an overflow (⋯) button on each column header. When
omitted the button is hidden.

```tsx
<KanbanView
  data={state.flatItems}
  fields={state.resolvedFields}
  config={state.config}
  groupByField="status"
  onColumnAction={(columnId) => openColumnMenu(columnId)}
/>
```

## API Reference

### `KanbanViewProps`

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `DynamicRecord[]` | — (required) | Records to group into columns. Pass `state.flatItems` in composable mode. |
| `fields` | `FieldConfig[]` | — (required) | Field map controlling card content. Pass `state.resolvedFields`. |
| `config` | `ViewConfig` | — (required) | View config from `useDataViewsState`. |
| `groupByField` | `string` | `"status"` | Dot-path to the field whose distinct values become columns. |
| `titleField` | `string` | first visible non-group field | Dot-path of the field rendered as the card title. |
| `columns` | `DynamicColumnConfig[]` | `undefined` | Explicit column overrides. Usually derived from `fields`. |
| `onDataUpdate` | `(data: DynamicRecord[]) => void` | `undefined` | Called when a card moves between columns (updates the group-by value). |
| `onColumnAction` | `(columnId: string) => void` | `undefined` | Click handler for the column header overflow button. When omitted, the button is hidden. |

Per-column colors come from each field's `kanbanVariants` map
(`{ [value]: { label?, color? } }`). Available `color` keys: `gray`, `purple`,
`orange`, `blue`, `green`, `red`. See
[`DataViewsLayout`](./data-views-layout.md#fieldconfig) for the full
`FieldConfig` shape.

## Accessibility

- Cards are keyboard-focusable; the column overflow button is a real `<button>`.
- Card titles use semantic heading markup within each [`DataViewCard`](./card.md).

## Theming

Uses `*-presentation-*` tokens plus a small set of deeply-saturated column-header
fills matched to `glare-torch-mode` raw tokens. Control the scheme via the
parent `DataViewsLayout`'s `theme`.

## Related

- [`DataViewsLayout`](./data-views-layout.md) — the tabbed container that renders this for you
- [`TableView`](./table-view.md) · [`InboxView`](./inbox-view.md) · [`TreeView`](./tree-view.md) — sibling views
- [How-to: Render a backend response with DataViews](../how-to/data-views-from-backend-response.md)
