# DataViews — Architecture & Component Map

Internal reference for the DataViews feature. Use this when changing UI, debugging, or syncing with the designer.

**Demo route:** `/data-views` (in `apps/app/data-views/page.tsx`)
**Library root:** `apps/lib/components/DataViews/`

---

## 1. What is DataViews?

A composable multi-view layout. One backend response (array of records) renders as any combination of **Table**, **Kanban**, **Inbox**, **Tree** — chosen per-screen via a `views` prop. Filters and the settings cog are togglable.

```tsx
<DataViewsLayout
  title="Orders"
  data={orders}
  fields={[
    { path: "status", type: "enum-badge", variants: { Pending: "yellow", Shipped: "blue" }, filterable: true },
    { path: "total",  type: "currency", currency: "USD", filterable: true },
  ]}
  views={{ table: true, kanban: true }}   // only these tabs render
  showFilters
  showSettings
/>
```

---

## 2. Layout vs. Components vs. Built-ins

### 🟦 The Layout — `DataViewsLayout`

The **frame**. Orchestrator, not a UI piece on its own.

Owns:
- Page header (title + description)
- View-switcher tab bar
- Settings cog button
- Decision of which view to render
- Decision of whether to show filter panel / settings panel

Does **not** render the filter panel or settings panel directly — it passes `showFilters` down to each view, and toggles `SettingsPanel` on the side.

### 🟩 The DataViews Components (new — 6 total)

| Component | File | Role |
|---|---|---|
| `DataViewsLayout` | `DataViewsLayout.tsx` | The frame (header + tabs + settings toggle) |
| `TableView` | `TableView.tsx` | Sortable table + search + optional filter panel |
| `KanbanView` | `KanbanView.tsx` | Drag-and-drop board grouped by an enum-badge field |
| `InboxView` | `InboxView.tsx` | Three-pane mail-style list (filters \| list \| detail) |
| `TreeView` | `TreeView.tsx` | Two-pane explorer (tree sidebar + right pane) |
| `FilterPanel` | `FilterPanel.tsx` | Left-sidebar filter panel (used by Table/Inbox/Tree) |
| `SettingsPanel` | `SettingsPanel.tsx` | Right-sidebar configurator (column toggles + sort + view-specific settings) |

### 🟨 Built-ins (existing torch-glare components, reused)

These already exist in glare and were not modified for this feature:

- `Badge` — status/priority chips (uses `color` + `badgeStyle: "solid" | "subtle"`)
- `Button` — Settings cog, action buttons, drawer trigger
- `Card`, `CardHeader`, `CardContent` — Kanban cards, Inbox detail pane
- `Checkbox` — table row select + filter list checkboxes
- `InputField` — the search bar
- `Avatar`, `AvatarFallback`, `AvatarImage` — inbox sender avatars
- `Switch` — settings panel toggles (column visibility, show filters)
- `Divider` — separators in panels (was `Separator` in source)
- `Label` — filter / setting labels
- `RadioGroup`, `Radio` — Kanban groupBy picker in settings
- `Table`, `TableHeader`, `TableBody`, `TableHead`, `TableRow`, `TableCell`, `TableCheckbox` — the actual `<table>` primitive
- `TabFormItem` — view-switcher tabs (top variant) + inbox sidebar chips (side variant)
- `Tooltip` — *(available, not currently mounted)*
- `Drawer` (from `vaul`) — mobile tree drawer
- Radix `Popover` — date-range filter popover
- Radix `Slider` — numeric range filter

---

## 3. The Layout Structure

```
┌──────────────────────────────────────────────────────────────────────┐
│ DataViewsLayout root <div class="bg-body-primary"> (theme-aware)     │
├──────────────────────────────────────────────────────────────────────┤
│ Header (showTitle)                                                   │
│  ├── Title + description (left)                                      │
│  └── View tabs (TabFormItem×N) + Settings button   (right)           │
├──────────────────────────────────────────────────────────────────────┤
│ main (flex row, overflow-hidden)                                     │
│  ├── Active view (one of):                                           │
│  │    ├── TableView      [FilterPanel | table+search]                │
│  │    ├── KanbanView     [columns of cards]                          │
│  │    ├── InboxView      [filter+sidebar | list | detail pane]       │
│  │    └── TreeView       [tree sidebar | FilterPanel | right pane]   │
│  │                                                                   │
│  └── SettingsPanel (slides in from right when cog clicked)           │
└──────────────────────────────────────────────────────────────────────┘
```

### Why filters live **inside** each view, not in the layout

- **Kanban** intentionally has no filter panel (boards rarely do)
- **Tree** puts the filter panel **between** the tree sidebar and the right pane
- **Inbox** puts the filter panel **inside** its own left sidebar (mixed with starred/unread/priority chips)
- **Table** puts the filter panel at the far left, like a standard list page

Each view decides where filters go in its own internal grid. The layout just passes down `showFilters` as a boolean. Per-view `showFilters` prop also exists on each view component for composable mode.

---

## 4. Composable mode (no tabs)

When you want a custom layout (e.g. Table on the left, Kanban on the right), bypass `DataViewsLayout` and compose the views directly using the shared state hook:

```tsx
import { TableView, KanbanView, FilterPanel, useDataViewsState } from "@/components/DataViews"

const state = useDataViewsState({ data, fields })

return (
  <div className="grid grid-cols-2 gap-4 h-screen">
    <TableView   {...state} showFilters={false} />
    <KanbanView  {...state} groupByField="status" />
  </div>
)
```

`useDataViewsState` (`apps/lib/hooks/useDataViewsState.ts`) owns: filter state, sort state, field detection, column visibility config, tree shape detection, enabled-views resolution.

---

## 5. Data flow

```
Backend → data: DynamicRecord[] (array of plain objects)
           │
           ▼
       FieldConfig[] (declarative field map, optional)
           │
           ▼
   useDataViewsState ──► detectFields() ─► merges with user fields
           │                                          │
           ▼                                          ▼
     flatItems (tree → flat for non-tree views)  resolvedFields
           │
           ▼
       active view ──► FilterPanel (if enabled)
           │            └─► filterState (controlled or internal)
           ▼
       renderField() per cell → torch-glare Badge / Avatar / etc.
```

### Where state lives

| State | Owner | Notes |
|---|---|---|
| `currentView` | `useDataViewsState` | View tab selection |
| `config` (sort, columns, kanbanGroupBy) | `useDataViewsState` | Single source of truth for sort + column visibility |
| `items` | `useDataViewsState` | Mutable copy of `data` (kanban drag-drop edits this) |
| `filterState` | `useDataViewsState` OR consumer | Controlled when `onFilterChange` is passed |
| `selectedItem` | Per view | Inbox + Tree pick their own |
| `expanded`, `selectedId` | TreeView | Tree-only |
| `searchQuery` | TableView / InboxView | Local |
| `showSettingsPanel` | `DataViewsLayout` | Toggled by cog button |

---

## 6. Utility files

Located in `apps/lib/utils/dataViews/`. Pure data — no React UI imports.

| File | Purpose |
|---|---|
| `pathUtils.ts` | `getByPath`, `setByPath`, `matchesFilterValues`, `formatPathLabel` — dot-path traversal & filter matching |
| `fieldUtils.ts` | `detectFields`, `mergeFields`, `inferFieldType`, `resolveInboxConfig`, `visibleFields` — declarative field API |
| `columnUtils.ts` | `detectColumns`, `mergeColumns` — legacy column config (kept for back-compat) |
| `rangeUtils.ts` | `computeNumericExtremes`, `inferStep`, `presetToFilterValue`, `resolvePresets` — numeric/date range filters |
| `treeUtils.ts` | `autoDetectTreeShape`, `buildTree`, `pruneTree`, `flattenAll` — hierarchy primitives |
| `nestedDataUtils.tsx` | `renderDetailView`, `renderNestedObject`, `isPlainObject`, `isCurrencyField` — nested-object detail rendering |

The only non-pure one is `nestedDataUtils.tsx` because it returns JSX for the inbox detail pane.

---

## 7. Types (`types.ts`)

Key types exported from `apps/lib/components/DataViews/types.ts`:

| Type | Shape |
|---|---|
| `DynamicRecord` | `Record<string, any>` — any backend object |
| `ViewType` | `"table" \| "kanban" \| "inbox" \| "tree"` |
| `ViewVisibility` | `{ table?, kanban?, inbox?, tree?: boolean }` |
| `FieldConfig` | The declarative field definition (path, type, variants, filterable, etc.) |
| `FieldType` | 17 renderer keys (text, number, enum-badge, currency, progress-bar, …) |
| `BadgeVariant` | Internal dataviews badge palette — translated by `badgeAdapter.ts` |
| `FilterState` | `Record<string, FilterValue>` |
| `FilterValue` | `string[] \| { kind: "number", min?, max? } \| { kind: "date", from?, to? }` |
| `ViewConfig` | `defaultView, tableColumns, kanbanGroupBy, showFilters, showPreviewPane, sortBy, sortOrder` |
| `InboxConfig` | `starredField, readField, attachmentField, priorityField, titlePath, previewPath` |
| `TreeConfig` | `childrenField, parentField, idField, nodeLabel, defaultExpanded, defaultRightPane` |

---

## 8. Field types (renderers)

Defined in `fieldRenderers.tsx`. Map of `FieldType` → JSX renderer:

| `type` | What it renders | Key field config props |
|---|---|---|
| `text` | Plain string | — |
| `number` | Tabular numeric | — |
| `date` | Raw date string | — |
| `date-format` | `Intl.DateTimeFormat`-style or token-based | `dateFormat: "YYYY-MM-DD"` or `Intl.DateTimeFormatOptions` |
| `boolean` | Yes/No Badge | `trueVariant`, `falseVariant`, `trueLabel`, `falseLabel` |
| `currency` | `Intl.NumberFormat` currency | `currency: "USD"` or `{ symbol, locale, decimals, code }` |
| `number-format` | `Intl.NumberFormat` formatted | `format: Intl.NumberFormatOptions` |
| `enum-badge` | Single colored badge | `variants: { Value: "green" \| "yellow" \| ... }` |
| `badge-array` | Row of badges with overflow `+N` | `variant`, `limit` |
| `progress-bar` | Horizontal bar with % | `thresholds: [warn, ok]` |
| `star-rating` | Filled-star row | `max` (default 5) |
| `icon-text` | Icon + text | `icon` (lucide name or emoji), `iconPosition` |
| `two-line` | Bold primary + small secondary | `secondaryPath` (dot-path) |
| `avatar` | torch-glare Avatar | `fallbackPath` (for initials) |
| `link` | `<a>` with mailto/tel/url | `linkType` |
| `image` | `<img>` thumbnail | — |
| `hidden` | Renders nothing | — |

Auto-inference rules live in `inferFieldType()` (fieldUtils.ts):
- `status` / `priority` keys → `enum-badge`
- `email` / `phone` / `url` / `website` → `link`
- `tags` / `labels` → `badge-array`
- `date` / `time` suffixes → `date-format`
- `salary` / `price` / `cost` / `amount` / `pay` / `fee` (or value smells like currency) → `currency`
- `rating` / `score` (and value ≤ 5) → `star-rating`
- ISO date strings → `date-format`
- Arrays → `badge-array`
- Booleans → `boolean`

The escape hatch: `field.render = (value, row) => <YourJSX />` always wins.

---

## 9. Badge adapter (`badgeAdapter.ts`)

The dataviews source used its own `BadgeVariant` enum (`green`, `greenLight`, `redOrange`, `bluePurple`, `navy`, etc.) that pre-dates torch-glare's current Badge API.

torch-glare Badge uses `color` (gray/slate/red/orange/yellow/green/ocean/blue/purple/rose) + `badgeStyle` (solid/subtle).

`resolveBadgeVariant(variant)` translates between the two. **Default style is `subtle`** to match glare's library default. Variants ending in `Light` or `navy` / `bluePurple` / `cocktailGreen` explicitly request solid.

Want to change badge defaults globally? → edit `badgeAdapter.ts`.
Want per-field control? → it could be exposed on `FieldConfig` as a new `badgeStyle?: "solid" | "subtle"` field (not done yet — propose it before adding).

---

## 10. Styling & theming

### Background tokens used

| Surface | Token | Dark | Light |
|---|---|---|---|
| Page | `bg-background-presentation-body-primary` | `#252729` | `#F0F0F0` |
| Side panels / Kanban column headers | `bg-background-presentation-body-overlay-primary` | `#1C1D1F` | `#F0F0F0` |
| Subtle fills (chips, drop zones) | `bg-background-presentation-form-field-primary` | `#1C1D1F` | white-ish |

**Do not use `bg-background-presentation-global-*`** — those tokens don't exist in this design system. They were inherited from the original data-views source and resolve to nothing. The Tailwind classes still validate but render as transparent. We swapped them all out; if you see one come back, it's a regression.

### Borders / text

| Token | Use |
|---|---|
| `border-border-presentation-global-primary` | Panel borders, dividers |
| `text-content-presentation-global-primary` | Primary text |
| `text-content-presentation-global-secondary` | Secondary text |
| `text-content-presentation-global-tertiary` | Muted labels |
| `text-content-presentation-action-primary` | Active state text |
| `bg-content-presentation-action-primary` | Active-tab + slider track + selected-mode bg |

These `content-presentation-global-*` tokens **do exist** for text/borders — only the `background-*-global-*` family is missing.

### Theme switching

`DataViewsLayout` accepts `theme?: "dark" | "light" | "default"` and applies it via `data-theme={theme}`. Without it, the component inherits the nearest ancestor's `data-theme` (set by `ThemeProvider`).

---

## 11. Tree view internals

`TreeView.tsx` has the most complex layout. Worth a separate note.

**Three columns** in desktop mode:
1. **Tree sidebar** (`TreeSidebar`) — the tree itself
2. **Filter panel** (`FilterPanel`) — only when `showFilters && hasFilterableFields`
3. **Right pane** — toggles between two modes via the toolbar:
   - **Table mode** (default) — `<TableView>` over the selected node + descendants
   - **Details mode** — single-record detail view with nested-object rendering

The tree owns the filter state; the embedded `TableView` is told `showFilters={false}` so it doesn't render its own filter panel.

**Mobile** collapses the tree sidebar into a left-edge drawer (`TreeDrawer` via `vaul`). The right pane gets a hamburger trigger.

**Auto-detection**: if neither `treeConfig.childrenField` nor `treeConfig.parentField` is set, the view inspects the first record:
- nested: `children`, `items`, `kids`, `subItems`, `nodes`
- flat: `parentId`, `parent_id`, `parent`, `managerId`, `manager`

If nothing matches and no `views.tree` override, the Tree tab auto-hides.

---

## 12. Filter panel rules

A field becomes filterable when any of:
1. `field.filterable === true` (explicit opt-in)
2. `type` is `enum-badge`, `boolean`, `badge-array`, or `icon-text` (auto)
3. type is text with ≤10 unique values (heuristic fallback)

Numeric / date fields **require explicit `filterable: true`** — they get range sliders / date pickers respectively.

The panel renders three filter kinds:
- **Categorical** — checkbox list (multi-select OR semantics)
- **Numeric range** — Radix slider + min/max inputs + preset chips
- **Date range** — Radix popover with `react-day-picker` + preset chips (`Today`, `Last 7 days`, `Last 30 days`, `This year`)

Filter state shape:
```ts
type FilterValue =
  | string[]                                          // categorical
  | { kind: "number"; min?: number; max?: number }    // numeric range
  | { kind: "date";   from?: string;  to?: string }   // date range, ISO YYYY-MM-DD
```

---

## 13. Settings panel sections

`SettingsPanel.tsx` renders sections conditionally based on `currentView`:

| Section | When | What it controls |
|---|---|---|
| General → Show Filters | always | `config.showFilters` |
| Table Columns | `currentView === "table"` | Column visibility (Switch) + reorder (HTML5 DnD) |
| Kanban Grouping | `currentView === "kanban"` | Radio over enum-badge fields → `kanbanGroupBy` |
| Inbox Layout → Show Preview Pane | `currentView === "inbox"` | `config.showPreviewPane` |
| Sort | always (if columns exist) | Per-column three-state: none/asc/desc |

---

## 14. CLI distribution

The DataViews folder + utils folder + hooks are **not yet** distributable via `torch-glare add <Component>` — the existing CLI scans top-level `.tsx` files only. Adding `DataViews/` as a unit requires extending the CLI to recognize folder-based components and copy:
- `apps/lib/components/DataViews/` (whole folder)
- `apps/lib/utils/dataViews/` (whole folder)
- `apps/lib/hooks/useDataViewsState.ts`
- `apps/lib/hooks/useIsMobile.ts`

…plus running `getDependenciesAndInstallNestedComponents` recursively across all those files to install any missing peer deps (`@radix-ui/react-slider`, `react-day-picker`, `vaul`).

---

## 15. MCP documentation

Public-facing docs live in `mcp/docs/`:

- `mcp/docs/components/data-views-layout.md` — main API reference
- `mcp/docs/components/table-view.md`
- `mcp/docs/components/kanban-view.md`
- `mcp/docs/components/inbox-view.md`
- `mcp/docs/components/tree-view.md`
- `mcp/docs/how-to/data-views-from-backend-response.md` — recipe guide for consumers

Registered in `mcp/docs/llms-manifest.json` under `components.dataDisplay`. Update versions there when bumping.

---

## 16. Common change checklist

When updating UI on this feature, touch in this order:

1. **Token swap** — never use `*-global-*` backgrounds. Check the table in §10.
2. **Badge** — use `resolveBadgeVariant()` in the adapter, don't bypass it. If you need a new variant, add it to both `BadgeVariant` type (types.ts) and the switch in `badgeAdapter.ts`.
3. **Field renderer** — add new field types in `fieldRenderers.tsx` + register in the `RENDERERS` lookup table at the bottom + extend `FieldType` in types.ts.
4. **Layout change** — if it touches all four views, update each view's root container individually; the layout doesn't own view chrome.
5. **State change** — extend `useDataViewsState` first, then thread the new field through `DataViewsLayout` props.
6. **Docs** — update the relevant `.md` in `mcp/docs/components/` AND `mcp/docs/how-to/data-views-from-backend-response.md` if it changes the consumer-facing API.

---

## 17. File inventory (quick reference)

```
apps/lib/components/DataViews/
├── ARCHITECTURE.md          ← this file
├── DataViewsLayout.tsx      ← the frame
├── TableView.tsx
├── KanbanView.tsx
├── InboxView.tsx
├── TreeView.tsx
├── FilterPanel.tsx
├── SettingsPanel.tsx
├── fieldRenderers.tsx       ← per-type JSX
├── badgeAdapter.ts          ← BadgeVariant → glare Badge props
├── types.ts                 ← all shared types
├── index.ts                 ← public barrel
├── filters/
│   ├── DateRangePopover.tsx
│   ├── PresetChips.tsx
│   └── RangeSliderWithInputs.tsx
└── tree/
    ├── TreeDrawer.tsx
    ├── TreeNodeRow.tsx
    └── TreeSidebar.tsx

apps/lib/utils/dataViews/
├── pathUtils.ts
├── fieldUtils.ts
├── columnUtils.ts
├── rangeUtils.ts
├── treeUtils.ts
└── nestedDataUtils.tsx

apps/lib/hooks/
├── useDataViewsState.ts     ← shared state machine for composable mode
└── useIsMobile.ts           ← <768px detection

apps/app/data-views/
└── page.tsx                 ← demo page, /data-views route

mcp/docs/components/
├── data-views-layout.md
├── table-view.md
├── kanban-view.md
├── inbox-view.md
└── tree-view.md

mcp/docs/how-to/
└── data-views-from-backend-response.md
```
