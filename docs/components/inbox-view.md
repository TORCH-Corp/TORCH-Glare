---
title: DataViews.Inbox
description: The mail-style view of DataViews — a quick-filter rail, a master list, and a detail pane. Registers itself as the "inbox" tab.
group: Data Display
keywords: [data-views, inbox-view, inbox, list, master-detail, read, starred, priority, attachment, compound, dynamic-data]
---

# DataViews.Inbox

> Three panes: All / Starred / Priority quick filters on the left, the record list in the middle,
> the selected record's detail on the right.

## Usage

```tsx
<DataViews.Root data={messages} fields={fields}>
  <DataViews.Header title="Inbox">
    <DataViews.ViewSwitch />
  </DataViews.Header>

  <DataViews.Inbox
    config={{ starredField: "isStarred", priorityField: "priority" }}
    itemHref={(item, id) => `/inbox/${id}`}
    linkComponent={Link}
    selectedId={routeId}
  />
</DataViews.Root>
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `config` | `InboxConfig` | Which fields carry the starred / read / attachment / priority flags. Auto-detected when omitted |
| `itemHref` | `(item, id) => string` | Makes each row a link |
| `linkComponent` | `ElementType` | Component used for those links. Defaults to `<a>` — pass your router's `Link` for client-side navigation |
| `selectedId` | `unknown` | Controlled selection, e.g. from a route param |
| `renderDetail` | `(item \| null) => ReactNode` | Replaces the built-in detail pane |
| `label` | `string` | Tab label. Default `"Inbox"` |
| `className` | `string` | Applied to the view surface |

## `InboxConfig` and auto-detection

```ts
type InboxConfig = {
  starredField?: string | null;
  readField?: string | null;
  attachmentField?: string | null;
  priorityField?: string | null;
  titlePath?: string;
  previewPath?: string;
};
```

When a field is omitted, the first record is inspected for a conventional key —
`isStarred | starred | favorite | isFavorite | pinned` for starred,
`priority | urgency | level | importance` for priority, and so on. Pass `null` explicitly to
turn a feature off rather than let detection find it.

The quick-filter rail only shows **Starred** / **Priority** when the corresponding field
resolves, so a dataset with neither gets just **All Items**.

## Routing

`itemHref` + `linkComponent` + `selectedId` is the pattern for putting the detail pane on its own
URL while the list persists:

```tsx
// app/orders/layout.tsx — the shell lives in the layout so it survives navigation
<DataViews.Inbox
  itemHref={(_item, id) => `/orders/${id}`}
  linkComponent={Link}
  selectedId={params.id}
  renderDetail={params.id ? () => children : undefined}
/>
```

## Detail pane

Without `renderDetail`, the built-in pane renders an avatar, the title and preview fields, the
remaining visible fields as badges, and then a key/value grid plus nested-object sections via
`renderDetailView`. `config.showPreviewPane` (config rail → Inbox Layout) hides it.

## Related

- [`data-views`](./data-views.md) — the root and the full parts list
