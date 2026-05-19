---
title: DataViewsConfigPanel
description: Slide-in side panel for DataViews — Saved View list, show/hide & drag-reorder columns, default sort, and a Filters tab. Used automatically by DataViewsLayout, or rendered standalone in composable mode.
group: Data Display
keywords: [data-views, config panel, config-panel, settings panel, saved view, saved-view, column visibility, reorder columns, default sort, filters tab, side panel, dark panel]
---

# DataViewsConfigPanel

> The settings/filters side panel for DataViews. In tab mode `DataViewsLayout`
> mounts and animates this for you. Render it yourself only in composable mode
> (custom layouts) or when you need real Saved View persistence.

## Installation

Part of `torch-glare`. Ships with the `DataViews` folder when you run
`npx torch-glare add DataViews` — no separate install. It depends on the
shared `Radio`, `Switch`, `Label`, `FilterPanel`, and a colocated internal
`PanelControls` file (see "Internal: PanelControls" below).

## Import

```tsx
import { DataViewsConfigPanel } from "torch-glare"
import type { DataViewsConfigPanelProps } from "torch-glare"
```

## When to use it directly

| Situation | Use |
|---|---|
| Standard tabbed dashboard | **Don't.** Use `DataViewsLayout` — it renders this panel for you via the header settings cog. |
| Custom composed layout (e.g. Table + Kanban side by side) | Render `DataViewsConfigPanel` yourself alongside `useDataViewsState`. |
| You need working Saved View persistence | Render it yourself and pass `savedViews` + `onSavedViewChange` + `onSaveNewView` wired to your store. (Not possible through `DataViewsLayout` today — see "Saved View status".) |

## Standalone Example (composable mode)

```tsx
import {
  DataViewsConfigPanel,
  TableView,
  useDataViewsState,
} from "torch-glare"
import { useState } from "react"

function CustomScreen({ data, fields }) {
  const s = useDataViewsState({ data, fields })
  const [panelOpen, setPanelOpen] = useState(true)

  // Your own saved-view persistence:
  const [savedViews] = useState([
    { id: "all", label: "All Records" },
    { id: "mine", label: "Assigned to Me" },
  ])
  const [activeView, setActiveView] = useState("all")

  return (
    <div className="flex h-screen gap-2 bg-black p-2">
      <div className="min-w-0 flex-1">
        <TableView
          data={s.flatItems}
          fields={s.resolvedFields}
          config={s.config}
          filterState={s.filterState}
          onFilterChange={s.setFilterState}
          showFilters={false}
        />
      </div>

      {panelOpen && (
        <DataViewsConfigPanel
          state="open"
          config={s.config}
          onConfigChange={s.setConfig}
          onClose={() => setPanelOpen(false)}
          currentView={s.currentView}
          fields={s.resolvedFields}
          data={s.flatItems}
          filterState={s.filterState}
          onFilterChange={s.setFilterState}
          savedViews={savedViews}
          activeSavedView={activeView}
          onSavedViewChange={setActiveView}
          onSaveNewView={() => {
            /* open your "name this view" modal, then persist */
          }}
        />
      )}
    </div>
  )
}
```

## API Reference

### `DataViewsConfigPanelProps`

| Prop | Type | Required | Description |
|---|---|---|---|
| `config` | `ViewConfig` | ✅ | Current view config. `tableColumns` drives the column list; `sortBy`/`sortOrder` drive Default Sort. |
| `onConfigChange` | `(config: Partial<ViewConfig>) => void` | ✅ | Called with a partial patch when columns are toggled/reordered or a sort field is picked. Merge it into your config state. |
| `onClose` | `() => void` | ✅ | Fires when the panel's close (X) button is pressed. |
| `currentView` | `ViewType` | ✅ | **Currently unused inside the panel body** (declared on the prop type but not read). Still required by the type; pass the active view for forward-compatibility. |
| `fields` | `FieldConfig[]` | ✅ | Same field map you pass to the views. Drives the Filters tab and the column labels. |
| `data` | `DynamicRecord[]` | ✅ | Flat records — passed to the Filters tab (`FilterPanel`) to compute filter options. |
| `filterState` | `FilterState` | ✅ | Current filter values. The Filters tab reads/writes this. |
| `onFilterChange` | `(filters: FilterState) => void` | ✅ | Called with the full next filter object on any filter change (and on "Clear all" → `{}`). |
| `filterConfig` | `DynamicFilterConfig[]` | — | Optional explicit filter config forwarded to `FilterPanel`. |
| `savedViews` | `{ id: string; label: string }[]` | — | Saved View radio list. Defaults to a single `{ id: "default", label: "Default View" }`. |
| `activeSavedView` | `string` | — | Controlled selected saved-view id. If supplied, the panel is controlled (see "Controlled vs uncontrolled"). |
| `onSavedViewChange` | `(id: string) => void` | — | Called when a saved-view radio is selected. Required for controlled behaviour. |
| `onSaveNewView` | `() => void` | — | Called when "Save a New View" is clicked. No-op if omitted. |
| `state` | `"open" \| "closed"` | — | Drives the slide/opacity animation. Default `"open"`. Keep the panel mounted through the close animation, then unmount. |

> Note: `DataViewsConfigPanelProps` is a plain `type` (not extending HTML
> attributes). There is no `className`/`theme` passthrough — the panel is
> intentionally always-dark chrome (see "Theming").

### Controlled vs uncontrolled Saved View

The Saved View list follows the standard controlled/uncontrolled pattern:

- **Controlled** — pass both `activeSavedView` and `onSavedViewChange`. You own
  the selected id; the panel reflects it.
- **Uncontrolled** — omit them. The panel keeps internal state (initialised to
  `savedViews[0]?.id`) so the radios are still interactive, but nothing
  persists and it resets on unmount.

```tsx
// Controlled
<DataViewsConfigPanel activeSavedView={id} onSavedViewChange={setId} ... />

// Uncontrolled (still clickable, local only)
<DataViewsConfigPanel savedViews={views} ... />
```

### Saved View status

Through `DataViewsLayout` (tab mode) the four `savedView*` props are **not
forwarded**, so Saved View there is presentational only. To get real behaviour,
render `DataViewsConfigPanel` yourself (example above) or extend the layout
(below).

## Sections

| Section | Backed by | Behaviour |
|---|---|---|
| Saved View | `savedViews` / `activeSavedView` | Radio list + "Save a New View" button. |
| Table Columns | `config.tableColumns` | Green `Switch` per column toggles `visible`; rows are drag-reorderable (HTML5 DnD) and patch `order`. |
| Default Sort | `config.sortBy` | Single-choice radio; selecting sets `sortBy`. Direction stays on `config.sortOrder`. |
| Filters tab | `filterState` + `fields` | Renders `FilterPanel` restyled full-width/transparent. |

## Internal: PanelControls

The panel's radio rows and column toggle are a colocated, **non-exported**
file: `DataViews/PanelControls.tsx` (`RadioRow`, `DataViewsSwitch`). They are
deliberately **not** shared library components — the panel chrome is always
dark and hardcodes Figma hex values, which conflicts with the design-system
token / `data-theme` convention used by public components.

You normally never import these. They ship automatically because the CLI
copies the entire `DataViews/` folder recursively, so the relative import
`./PanelControls` resolves in the consumer's copy with no registry wiring.

If you need a themed radio elsewhere, use the shared `Radio` component instead
— not `PanelControls`.

## Extending the panel

Common changes and where to make them:

| You want to… | Do this |
|---|---|
| Make Saved View work through `DataViewsLayout` | Add `savedViews` / `activeSavedView` / `onSavedViewChange` / `onSaveNewView` to `DataViewsLayoutProps`, hold them in layout state (or accept from the host), and forward them to `<DataViewsConfigPanel>` at its render site in `DataViewsLayout.tsx`. |
| Add a new Config section | Add a new block inside the Config. tab in `DataViewsConfigPanel.tsx`, backed by a `config.*` field so `onConfigChange` persists it. |
| Restyle a radio/toggle | Edit `PanelControls.tsx`. Keep values matching the Figma spec; do not swap in the shared `Radio`/`Label` (they impose theming/layout that fights the dark panel — this was deliberate). |
| Change the dark chrome | The root forces `data-theme="dark"` and uses hardcoded hex (`#1C1D1F`, `#252729`, `#005ECC`, `#626467`, `#0AC713`). These are intentional Figma values, not tokens. |

After any change to the panel docs or component, update this file and rebuild
the MCP server (`cd mcp && pnpm build`) so the docs the server serves stay in
sync.

## Accessibility

- Saved View / Default Sort use Radix `RadioGroup`; the whole row is the click
  target with keyboard support.
- Column toggles are accessible `Switch`es; reorder is pointer-based HTML5 DnD
  (provide a non-DnD path if your audience needs keyboard reordering).
- The close button has `aria-label="Close panel"`; tab buttons expose
  `aria-pressed`.

## Theming

Intentionally **always dark**. The root sets `data-theme="dark"` so child
themed components resolve dark tokens even when the host app runs light, and
the panel-specific chrome uses hardcoded Figma hex values rather than design
tokens. There is no `theme` prop — this is by design to match the Figma
"Cun" (#000000) panel spec.

## Related

- [`DataViewsLayout`](./data-views-layout.md) — renders this panel for you in tab mode
- [`Radio`](./radio.md) — the themed radio to use **outside** this panel
- [`Switch`](./switch.md) — the shared switch the column toggles wrap
