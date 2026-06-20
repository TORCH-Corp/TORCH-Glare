---
title: DataViewsLayout
description: Composable multi-view layout that renders any backend response as Table, Kanban, Inbox, and/or Tree, with per-screen selection of which views to show.
group: Data Display
keywords: [data-views, layout, table, kanban, inbox, tree, multi-view, filter, switcher, dashboard, dynamic-data, fields]
---

# DataViewsLayout

> One backend response → many UI shapes. Pass an array of records plus a declarative list of fields, then pick which views the screen needs (`{ table: true, kanban: true }`, etc.). Filters and the settings cog are togglable per-screen.

## Installation

```bash
npx torch-glare@latest add DataViews
```

The CLI transitively installs everything DataViews imports — the sibling views,
the `DataViewCard` layout, the `useDataViewsState` hook, the `dataViews` utils,
and the `TreeFolder` component — plus the 3rd-party deps it uses
(`@radix-ui/react-slider`, `react-day-picker`, `lucide-react`, `vaul`).

> **Badge version:** DataViews uses the current Badge API
> (`color` / `badgeStyle` / `showIcon`). If your project vendored an older
> `Badge.tsx` (with `variant` / `isSelected`), refresh it with
> `npx torch-glare@latest add Badge --force` and migrate call sites
> (`variant=` → `color=`, `isSelected`+`onUnselect` → `isClosable`+`onClose`).
> The Badge also needs `mapping-color-system-v4` tokens
> (`--background-presentation-badge-{color}-{subtle|solid}`) in your CSS.

## Import

```tsx
import { DataViewsLayout } from "torch-glare"
import type { FieldConfig, ViewVisibility } from "torch-glare"
```

## Quick Examples

### 1. All views, auto-detected

Just pass `data` — every primitive field becomes a column, all four views appear, the Tree tab auto-hides if no `children`/`parentId` is found.

```tsx
const employees = [
  { id: 1, name: "Ada Lovelace", role: "Engineer", salary: 120000, joinDate: "2024-04-12" },
  { id: 2, name: "Linus Torvalds", role: "Engineer", salary: 145000, joinDate: "2023-09-01" },
]

<DataViewsLayout title="Employees" data={employees} />
```

### 2. Pick specific views only

Use `views` to enable only what this screen needs. Tabs for the others are hidden.

```tsx
<DataViewsLayout
  title="Orders"
  data={orders}
  views={{ table: true, kanban: true }}   // only Table + Kanban tabs render
  kanbanGroupBy="status"
/>
```

### 3. Declarative fields with badges and filters

```tsx
const fields: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "customer", type: "text" },
  {
    path: "status",
    type: "enum-badge",
    variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" },
    filterable: true,
  },
  { path: "total", type: "currency", currency: "USD", filterable: true },
  { path: "createdAt", type: "date-format", dateFormat: "YYYY-MM-DD", filterable: true },
]

<DataViewsLayout
  title="Orders"
  data={orders}
  fields={fields}
  views={{ table: true, kanban: true }}
  kanbanGroupBy="status"
/>
```

### 4. Disable filters and the settings cog

```tsx
<DataViewsLayout
  data={orders}
  fields={fields}
  views={{ table: true }}
  showFilters={false}
  showSettings={false}
/>
```

### 5. Controlled filter state (wire to backend pagination)

```tsx
const [filterState, setFilterState] = useState<FilterState>({})

useEffect(() => {
  fetchFromBackend({ filters: filterState }).then(setRows)
}, [filterState])

<DataViewsLayout
  data={rows}
  fields={fields}
  filterState={filterState}
  onFilterChange={setFilterState}
/>
```

### 6. Hierarchical data

When records carry a `children: []` array (or a `parentId` reference), the Tree tab auto-appears. Override the detection with `treeConfig`.

```tsx
<DataViewsLayout
  data={departments}                            // each has children[]
  treeConfig={{ childrenField: "children", nodeLabel: "name", defaultExpanded: "roots" }}
  fields={fields}
/>
```

### 7. Inbox shape (read/starred/priority)

Inbox auto-detects `isRead`, `isStarred`, `hasAttachment`, `priority`. Override with `inboxConfig`.

```tsx
<DataViewsLayout
  data={messages}
  fields={fields}
  views={{ inbox: true }}
  inboxConfig={{ titlePath: "subject", previewPath: "from.name" }}
/>
```

## API Reference

### `DataViewsLayoutProps`

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `DynamicRecord[]` | `[]` | Array of records of any shape. Fields are auto-detected from the first records. |
| `fields` | `FieldConfig[]` | auto-detected | Declarative field map: `path`, `type`, `filterable`, `variants`, `currency`, etc. |
| `title` | `string` | `"Data Views"` | Header title (hidden when `showTitle={false}`). |
| `description` | `string` | `"Unified data visualization across multiple views"` | Subtitle under the title. |
| `views` | `ViewVisibility` | all on (tree auto) | Per-view toggle: `{ table?, kanban?, inbox?, tree? }`. Omitted keys default to `true` (Tree auto-hides without hierarchy). |
| `kanbanGroupBy` | `string` | `"status"` | Dot-path to the field used for Kanban columns. |
| `inboxConfig` | `InboxConfig` | auto-detected | Map of starred/read/attachment/priority field paths for Inbox. |
| `inboxItemHref` | `(item, id) => string` | — | When set, each Inbox row becomes a link to the returned href. |
| `inboxLinkComponent` | `ElementType` | `"a"` | Component used to render Inbox item links when `inboxItemHref` is set. Pass your router's link (Next.js `Link`, React Router `Link`) for client-side navigation; defaults to a plain `<a>` (full-page nav). |
| `treeConfig` | `TreeConfig` | auto-detected | `childrenField`, `parentField`, `idField`, `nodeLabel`, `defaultExpanded`. |
| `filterState` | `FilterState` | uncontrolled | Controlled filter state. Pair with `onFilterChange`. |
| `onFilterChange` | `(state: FilterState) => void` | — | Fires when any filter changes. When provided, the layout is controlled. |
| `showFilters` | `boolean` | `true` | Hide the filter panel inside every view. |
| `showSettings` | `boolean` | `true` | Hide the settings cog + side panel. |
| `showTitle` | `boolean` | `true` | Hide the header bar entirely. Useful when embedding. |
| `config` | `Partial<ViewConfig>` | — | Initial config: `defaultView`, `sortBy`, `sortOrder`, etc. |
| `className` | `string` | — | Forwarded to the root `<div>`. |
| `theme` | `"dark" \| "light" \| "default"` | — | Applied as `data-theme` on the root. |

### `FieldConfig`

| Prop | Type | Description |
|---|---|---|
| `path` | `string` | Dot-path into the record (`"contact.email"`). |
| `label` | `string` | Display label. Auto-formatted from path tail if omitted. |
| `type` | `FieldType` | Renderer key (see below). Auto-inferred if omitted. |
| `visible` | `boolean` | Show in cells. Default `true`. |
| `order` | `number` | Display order. |
| `filterable` | `boolean` | Surface this field in the filter panel. The control adapts to the field `type`: categorical fields render checkboxes/radios (or a searchable dropdown via `filterVariant`), numeric fields a range slider, and **date / date-format fields a From + To pair of Glare `DatePicker`s** (two single-date pickers bounding the range). Set `false` to explicitly exclude a field the panel would otherwise auto-detect (e.g. an `id` or `name` with few unique values). |
| `filterLabel` | `string` | Override the label shown above this field's filter (defaults to `label`). |
| `filterMode` | `"single" \| "multi"` | Categorical selection mode. `"multi"` (default) renders checkboxes; `"single"` renders radios. |
| `filterVariant` | `"checkbox" \| "searchable-select"` | Categorical control style. `"checkbox"` (default) is the inline checkbox/radio list; `"searchable-select"` renders a single-select `SearchableSelect` dropdown — useful when a field has many options. Implies single-select. |
| `filterOptions` | `string[] \| { label: string; value: string }[]` | Explicit option list for the categorical filter (otherwise options are collected from the data). |
| `variants` | `Record<string, BadgeVariant>` | For `enum-badge`: per-value color map. |
| `currency` | `string \| CurrencyOptions` | For `currency`: ISO code or `{ symbol, locale, decimals, code }`. |
| `thresholds` | `[number, number]` | For `progress-bar`: warning/ok thresholds. |
| `max` | `number` | For `star-rating`: stars displayed. |
| `dateFormat` | `string \| Intl.DateTimeFormatOptions` | For `date-format`: token like `"YYYY-MM-DD"` or Intl options. |
| `render` | `(value, row) => ReactNode` | Escape hatch for custom JSX. |

### `FieldType` (built-in renderers)

`text` · `number` · `date` · `date-format` · `boolean` · `currency` · `number-format` · `enum-badge` · `badge-array` · `progress-bar` · `star-rating` · `icon-text` · `two-line` · `avatar` · `link` · `image` · `hidden`

> **`hidden` vs `filterable: false`** — use `type: "hidden"` to drop a field from the UI **entirely** (no column, no column-toggle in the config panel, no filter) while it stays in the data for row identity — e.g. an `id` you key rows by but never want shown. Use `filterable: false` to keep a field as a **column** but remove only its **filter**.

### `BadgeVariant`

`green` · `greenLight` · `cocktailGreen` · `yellow` · `redOrange` · `redLight` · `rose` · `purple` · `bluePurple` · `blue` · `navy` · `gray` · `highlight`

### `ViewVisibility`

```ts
type ViewVisibility = {
  table?: boolean
  kanban?: boolean
  inbox?: boolean
  tree?: boolean
}
```

## Config & Filters Panel

The settings cog in the header (shown unless `showSettings={false}`) opens a
slide-in side panel — [`DataViewsConfigPanel`](./data-views-config-panel.md).
`DataViewsLayout` mounts and animates it for you; you do not render it yourself
in tab mode. It has two tabs:

| Tab | Section | What it does | Wired through `DataViewsLayout`? |
|---|---|---|---|
| **Config.** | Saved View | Radio list of named views + "Save a New View" button. | ❌ **Presentational only.** The layout does not pass `savedViews` / `onSavedViewChange` / `onSaveNewView`, so the panel shows a single fallback "Default View" and selection is local-state only (it does not persist or change `config`). See "Saved View status" below. |
| **Config.** | Table Columns | Show/hide each column (green `Switch`) and drag-reorder them. | ✅ Reads/writes `config.tableColumns` via the layout's internal config state. |
| **Config.** | Default Sort | Single-choice radio list that sets `config.sortBy`. | ✅ Writes `config.sortBy` (sort direction stays on `config.sortOrder`). |
| **Filters** | — | Delegates to `FilterPanel` for the same `fields` you passed. | ✅ Reads/writes the layout's `filterState` (and your `onFilterChange` if controlled). |

### Saved View status (read this before relying on it)

Saved View is currently a **presentational shell**. The props exist on
`DataViewsConfigPanel` (`savedViews`, `activeSavedView`, `onSavedViewChange`,
`onSaveNewView`) but `DataViewsLayout` does **not** thread them through. In tab
mode you therefore cannot supply or persist saved views today — clicking a row
updates the panel's internal state only and resets on unmount.

To get real saved-view behaviour you have two options:

1. Use **Composable Mode** (below) and render `DataViewsConfigPanel` yourself,
   passing `savedViews` + `onSavedViewChange` wired to your own persistence.
2. Extend `DataViewsLayout` to forward the four `savedView*` props down to the
   panel (see "Extending the panel" in the
   [`DataViewsConfigPanel` doc](./data-views-config-panel.md)).

This limitation is documented honestly so an agent does not generate code that
passes `savedViews` to `DataViewsLayout` expecting it to work.

## Composable Mode (no tabs)

When you want a custom layout (e.g. Table on the left, Kanban on the right), bypass `DataViewsLayout` and compose the views directly.

```tsx
import { TableView, KanbanView, FilterPanel, useDataViewsState } from "torch-glare"

function CustomScreen({ data, fields }: Props) {
  const state = useDataViewsState({ data, fields })
  return (
    <div className="grid grid-cols-2 gap-4 h-screen">
      <TableView
        data={state.flatItems}
        fields={state.resolvedFields}
        config={state.config}
        filterState={state.filterState}
        onFilterChange={state.setFilterState}
        showFilters={false}
      />
      <KanbanView
        data={state.flatItems}
        fields={state.resolvedFields}
        config={state.config}
        groupByField="status"
      />
    </div>
  )
}
```

## Accessibility

- The view-switcher uses [`TabSwitch`](./tab-switch.md) — a segmented `role="tablist"` control (each view a `role="tab"` button, full keyboard support via Tab/Enter/Space). Installing DataViews pulls in `TabSwitch` automatically.
- Tree rows expose `role="treeitem"` with `aria-expanded` and `aria-selected`.
- Filter checkboxes carry labels and `htmlFor` linkage.
- Settings panel buttons have `aria-pressed` for sort direction.

## Theming

The component uses only `*-presentation-*` design tokens. Wrap with `ThemeProvider` or pass `theme="dark" | "light" | "default"` to control color scheme.

## Related

- [`DataViewsConfigPanel`](./data-views-config-panel.md) — the settings/filters side panel (Saved View, columns, sort)
- [`TableView`](./table-view.md) — standalone table
- [`KanbanView`](./kanban-view.md) — standalone kanban
- [`InboxView`](./inbox-view.md) — standalone inbox
- [`TreeView`](./tree-view.md) — standalone tree
- [`TabSwitch`](./tab-switch.md) — the segmented view-switcher in the header (reusable on its own)
- [How-to: Render a backend response with DataViews](../how-to/data-views-from-backend-response.md) — recipes by data shape.
