---
title: DataViews.Kanban
description: The board view of DataViews — groups records into columns by a field and renders each as a draggable card. Registers itself as the "kanban" tab.
group: Data Display
keywords: [data-views, kanban-view, kanban, board, columns, group-by, cards, drag-and-drop, compound, dynamic-data]
---

# DataViews.Kanban

> Drag-and-drop board. Groups records into columns by one field's value; dropping a card onto
> another column writes the new value back through the Root.

## Usage

```tsx
<DataViews.Root data={orders} fields={fields}>
  <DataViews.Header title="Orders">
    <DataViews.ViewSwitch />
  </DataViews.Header>

  <DataViews.Kanban groupBy="status" titleField="customer" />
</DataViews.Root>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `groupBy` | `string` | `config.kanbanGroupBy` → `"status"` | Field path whose value defines the columns |
| `titleField` | `string` | first visible non-group-by field | Field rendered as the card title |
| `onColumnAction` | `(columnId: string) => void` | — | Column-header overflow button. Omitted ⇒ button hidden |
| `label` | `string` | `"Board"` | Tab label in the view switcher |
| `className` | `string` | — | Applied to the view surface |

## Columns

Column order and colour come from the group-by field's config:

```tsx
{
  path: "status",
  type: "enum-badge",
  variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" },
  kanbanVariants: {
    Pending:   { label: "To pack",   color: "gray" },
    Shipped:   { label: "In transit", color: "blue" },
    Delivered: { label: "Done",      color: "green" },
  },
}
```

- `variants` keys seed the columns, so empty statuses still render a column.
- `kanbanVariants[value].label` sets the column title; `.color` picks the header pill from
  `gray | purple | orange | blue | green | red`.
- Any value found in the data but absent from `variants` gets its own column with a colour
  picked deterministically from the value's hash — stable across renders.
- Records whose group-by value is null land in an `"Uncategorized"` column.

## Drag and drop

Dragging a card to another column calls `setByPath(record, groupBy, targetColumnId)` and hands
the updated array to the Root's `onDataUpdate`, which re-renders every view from the new data.
Drag is disabled below 768px, where columns stack vertically instead.

## Cards

Body fields are paired two per row. If only one of a pair has a value it spans the full width;
fully empty pairs are dropped rather than rendering an empty row with hairlines.

## Related

- [`data-views`](./data-views.md) — the root and the full parts list
