---
title: DataViews.Tree
description: The hierarchy view of DataViews — a sidebar tree plus a right pane (table or cards) for the selected node. Auto-hides when the data is flat.
group: Data Display
keywords: [data-views, tree-view, tree, hierarchy, nested, sidebar, parent-child, children, compound, dynamic-data]
---

# DataViews.Tree

> Two panes: the hierarchy on the left, the selected node's subtree on the right as either a
> table or a card grid.

## Usage

```tsx
<DataViews.Root data={categories} fields={fields}>
  <DataViews.Header title="Catalogue">
    <DataViews.ViewSwitch />
  </DataViews.Header>

  <DataViews.Tree childrenField="children" defaultExpanded="roots" />
</DataViews.Root>
```

## Props

`DataViews.Tree` spreads `TreeConfig`, so every hierarchy option is a top-level prop.

| Prop | Type | Notes |
| --- | --- | --- |
| `childrenField` | `string` | Nested shape: the key holding child records |
| `parentField` | `string` | Flat shape: the key pointing at the parent's id |
| `idField` | `string` | Node identity. Defaults to `id` |
| `orderField` | `string` | Sorts siblings |
| `nodeLabel` | `string` | Field path rendered as the node label. Defaults to the first visible field |
| `defaultExpanded` | `"all" \| "roots" \| "none"` | Initial expansion |
| `defaultRightPane` | `"table" \| "card"` | Right-pane mode. `"details"` is a deprecated alias of `"card"` |
| `dndEnabled` | `boolean` | Drag-to-reparent. Default `true` |
| `label` | `string` | Tab label. Default `"Tree"` |
| `className` | `string` | Applied to the view surface |

## Auto-detection and the auto-hiding tab

If neither `childrenField` nor `parentField` is given, the first record is inspected for:

- **nested** — `children`, `items`, `kids`, `subItems`, `nodes`
- **flat** — `parentId`, `parent_id`, `parent`, `managerId`, `manager`

If nothing matches, `DataViews.Tree` **renders nothing and registers no tab** — flat data simply
doesn't get a Tree option. Declaring `childrenField` or `parentField` explicitly always forces
the tab on.

## Filtering

The tree filters its own forest with `pruneTree` rather than the flat filter every other view
uses: a flat filter would drop a matching node's ancestors and orphan it. A node survives if it
matches, or if any descendant does.

## Right pane

The toolbar switches between:

- **List** — a `TableGrid` over the selected node and all its descendants, with its own sort and
  selection state (independent of the standalone table view's).
- **Cards** — one `Card` per record; the label field is the header, remaining visible fields are
  key/value rows.

## Mobile

Below 768px the sidebar collapses into a left-edge drawer (`vaul`) behind a hamburger in the
right pane's toolbar.

## Related

- [`data-views`](./data-views.md) — the root and the full parts list
