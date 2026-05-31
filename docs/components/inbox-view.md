---
title: InboxView
description: Standalone inbox/list view for DataViews — a master list with read/starred/priority states and an optional detail pane. Use inside DataViewsLayout (tab mode) or directly in Composable Mode.
group: Data Display
keywords: [data-views, inbox-view, inbox, list, master-detail, read, starred, priority, attachment, composable, dynamic-data]
---

# InboxView

> The inbox renderer behind `DataViewsLayout`'s "Inbox" tab. It renders records as a scannable list with read / starred / priority / attachment affordances, plus an optional detail pane. In tab mode the layout renders it for you; render it directly only in **Composable Mode**.

## Installation

Part of `torch-glare`. Ships with the `DataViews` folder when you run `npx torch-glare add DataViews` — no separate install. It depends on the shared `Badge`, `Button`, `Avatar`, `Card`, `Divider`, and `TabFormItem` components plus `lucide-react`.

## Import

```tsx
import { InboxView, useDataViewsState } from "torch-glare"
import type { InboxViewProps, InboxConfig, FieldConfig } from "torch-glare"
```

## When to use it directly

| Situation | Use |
|---|---|
| You want the standard tabbed multi-view UI | `DataViewsLayout` with `views={{ inbox: true }}` — it mounts `InboxView` for you. |
| You want a custom master-detail layout | Render `InboxView` directly with state from `useDataViewsState`, and supply `renderDetail`. |

## Field auto-detection

InboxView auto-detects these record fields and maps them to UI affordances.
Override any of them with `inboxConfig`.

| Detected field | Affordance |
|---|---|
| `isRead` | Read/unread weight |
| `isStarred` | Star toggle |
| `hasAttachment` | Paperclip icon |
| `priority` | Priority flag |

## Composable Mode example

```tsx
import { InboxView, useDataViewsState } from "torch-glare"
import type { FieldConfig, InboxConfig } from "torch-glare"

const messages = [
  { id: 1, subject: "Welcome", from: { name: "Ada" }, isRead: false, isStarred: true, sentAt: "2024-06-01" },
  { id: 2, subject: "Invoice", from: { name: "Billing" }, isRead: true, hasAttachment: true, sentAt: "2024-06-02" },
]

const fields: FieldConfig[] = [
  { path: "subject", type: "text" },
  { path: "from.name", label: "From", type: "text" },
  { path: "sentAt", type: "date-format", dateFormat: "YYYY-MM-DD" },
]

const inboxConfig: InboxConfig = {
  titlePath: "subject",
  previewPath: "from.name",
  dateField: "sentAt",
}

function Mailbox() {
  const state = useDataViewsState({ data: messages, fields })
  const [selectedId, setSelectedId] = useState<number | null>(null)
  return (
    <InboxView
      data={state.flatItems}
      fields={state.resolvedFields}
      config={state.config}
      inboxConfig={inboxConfig}
      selectedItemId={selectedId}
      renderDetail={(item) =>
        item ? <MessageDetail message={item} /> : <Empty />
      }
    />
  )
}
```

### Link rows to routes (framework-agnostic)

`itemHref` turns each row into a link. The underlying card renders a plain `<a>`
by default, so it works in any framework.

```tsx
<InboxView
  data={state.flatItems}
  fields={state.resolvedFields}
  config={state.config}
  itemHref={(item, id) => `/messages/${id}`}
/>
```

## API Reference

### `InboxViewProps`

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `DynamicRecord[]` | — (required) | Records to render as list items. Pass `state.flatItems`. |
| `fields` | `FieldConfig[]` | — (required) | Field map controlling list-item content. Pass `state.resolvedFields`. |
| `config` | `ViewConfig` | — (required) | View config from `useDataViewsState`. |
| `inboxConfig` | `InboxConfig` | auto-detected | Overrides for which record paths map to title/preview/avatar/date/read/starred/attachment/priority. |
| `columns` | `DynamicColumnConfig[]` | `undefined` | Explicit column overrides. Usually derived from `fields`. |
| `onDataUpdate` | `(data: DynamicRecord[]) => void` | `undefined` | Called when item data changes (e.g. toggling read/starred). |
| `filters` | `DynamicFilterConfig[]` | `undefined` | Explicit filter definitions. Usually inferred from `filterable` fields. |
| `filterState` | `FilterState` | uncontrolled | Controlled filter state. Pair with `onFilterChange`. |
| `onFilterChange` | `(filters: FilterState) => void` | `undefined` | Fires when a filter changes. |
| `showFilters` | `boolean` | `true` | Show the integrated filter panel. |
| `itemHref` | `(item: DynamicRecord, id: any) => string` | `undefined` | When set, each row becomes a link to the returned href. |
| `selectedItemId` | `any` | `undefined` | Id of the currently selected row (drives the detail pane + highlight). |
| `renderDetail` | `(item: DynamicRecord \| null) => ReactNode` | `undefined` | Renders the right-hand detail pane for the selected item. |

### `InboxConfig`

```ts
type InboxConfig = {
  starredField?: string
  readField?: string
  attachmentField?: string
  priorityField?: string
  titlePath?: string
  previewPath?: string
  avatarPath?: string
  dateField?: string
}
```

See [`DataViewsLayout`](./data-views-layout.md#fieldconfig) for `FieldConfig`,
`FilterState`, and related shapes.

## Accessibility

- The all/starred/priority switcher uses [`TabFormItem`](./tab-form-item.md) (full keyboard support).
- Star/archive/delete actions are real `<button>`s with accessible labels.
- Avatars fall back to initials via [`Avatar`](./avatar.md).

## Theming

Uses only `*-presentation-*` design tokens. Control the scheme via the parent
`DataViewsLayout`'s `theme`.

## Related

- [`DataViewsLayout`](./data-views-layout.md) — the tabbed container that renders this for you
- [`TableView`](./table-view.md) · [`KanbanView`](./kanban-view.md) · [`TreeView`](./tree-view.md) — sibling views
- [How-to: Render a backend response with DataViews](../how-to/data-views-from-backend-response.md)
