## 2.5.5

### `hints` — several alerts on one field

Every `FormBuilder.*` field takes a `hints` array. Each entry mirrors `FieldHint`: a `label`, an
optional `state` of `info` (default) / `warning` / `error` / `success`, and an optional `icon`.

```tsx
<FormBuilder.Text
  name="sku"
  label="SKU"
  required
  hints={[
    { state: "info", label: "Must be unique across the catalogue." },
    { state: "warning", label: "Changing this breaks existing links." },
  ]}
/>
```

Before this, a field had exactly one hint slot and the validation error owned it, so there was no way
to attach helper text or a caveat. The error is still rendered for you and now comes **first** in the
stack — it is the actionable message — with your hints following in the order given.

Non-breaking: a field with no `hints` renders exactly as before. Added to `BaseFieldProps`, so all
field types accept it. Ignored inside a `FormBuilder.Table` cell (and any other `bare` context),
where errors surface as a tooltip on the control so a row stays one line tall.

### Dropdown panels stay on screen, and their lists scroll

`Select`, `SearchableSelect`, `SearchableTree`, `Popover`, `DropdownMenu` and `ContextMenu` capped
their height with a fixed number and nothing else, so a dropdown opened near the bottom of the window
was cut off by the viewport, and a long list overflowed its own panel and was clipped with no
scrollbar. Both are fixed:

- The panel now caps at `min(<its own limit>, var(--radix-*-content-available-height, 100vh))` — the
  space Radix measured after collision handling. Opened near an edge the panel shrinks and scrolls
  instead of running off the screen. The fallback in the `var()` matters: an undefined variable
  invalidates the whole `min()` and drops the cap entirely.
- The inner list is `flex-1 min-h-0`. Without `min-h-0` a flex item refuses to shrink below its
  content, which is why the list grew past the panel and `overflow-hidden` simply cut the rows off.

Scrollbars are hidden on these lists; scrolling itself is unchanged.

`SearchableTree`'s `maxBodyHeight` default drops **320 → 200** to match the other menus. Pass
`maxBodyHeight` explicitly to keep the old height. `SearchableTreeDialog` gains the same
`maxBodyHeight` prop (default 200), applied as `min(maxBodyHeight, 55vh)`.

### Breaking — `DataViews.Filters.Summary` is removed

The chip strip that echoed the active filters above the rows is gone, along with the component
itself (`DataViews/filters/summary.tsx`). It read as a row of tab-like buttons sitting between the
header and the table, and the filter controls already show what is set.

There is no shim — the compiler will point at every `<DataViews.Filters.Summary />`. Delete those;
if you want a summary above your rows, render your own from `useDataViewsFilters()`, which still
exposes `filters`, `setFilters` and `filterFields`. All the example pages have been updated.

`Filters.Presets` and `Filters.Custom` are unaffected, and `filterFields` is still collected on the
root — `Presets` resolves fields by path through it.

### The DataViews table's add-row bar no longer scrolls with the columns

`DataViews.Table` rendered its `TableEndAction` **inside** the horizontal scroller, wrapped in the
`w-max min-w-full` box that sizes the table. That made the bar as wide as the table's *scrollable*
width and slid it sideways with the columns — it behaved like a normal row.

It is now a sibling of the scroller, matching what the form `Table` field already does: its width is
the component's visible width and it stays put while the columns scroll under it. Measured on a
2718px-wide table in an 814px viewport, the bar keeps a 820px width and does not move when the
scroller is taken to its right edge. It also sits flush under the table rather than picking up the
view's `gap-4`.

For `DropdownMenu` and `ContextMenu` specifically, the panel now clips and an inner viewport scrolls,
so the panel's 4px frosted gutter stays fixed instead of scrolling away with the rows. Two related
fixes ride along:

- **Submenus were completely uncapped.** `DropdownMenuSubContent` and `ContextMenuSubContent` shared
  the panel styles but had no height limit at all, so a long submenu ran off the screen. Both now
  take a `maxHeight` prop (default `320`, same as the parent menu) and scroll like any other menu.
  They also pick up `collisionPadding={8}` for parity with `Content` — Radix's own default is `0`, so
  a submenu no longer sits flush against the viewport edge.
- **The height cap could silently vanish.** The inline `min()` referenced the Radix available-height
  variable with no fallback, and an undefined variable invalidates the whole expression — leaving the
  panel with no cap. Now `var(--radix-…-available-height, 100vh)`.

### `SearchableTree` is one panel instead of two

The tree body painted its own `rgba(61,64,69,0.72)` fill, `backdrop-blur-[21px]` and shadow on top of
the popover surface already doing the same. Two problems: the shadow and fill doubled up, and a
`backdrop-filter` establishes a backdrop root for its descendants, so the inner blur had nothing left
to sample. The popover content is now the single frosted surface and the body is transparent padding
on it. This also fixes the panel's uneven gutters — the body was `py-[8px] px-[4px]`, so the bottom
inset read as larger than the sides; it is a uniform `p-[4px]` now.

### No more error tooltips on the core inputs

`InputField`, `BadgeField` and `Select` each forced a tooltip open for as long as a field was
invalid. That tooltip is gone. Nothing else changes: all three already applied the negative border
independently of it (`error={errorMessage !== undefined}`, and `error: errors !== undefined` on the
Select trigger), so an invalid control still reads as invalid.

`errorMessage` / `errors` keep their meaning — they are what turn the border on. `toolTipSide` is now
**ignored** and marked `@deprecated`; it is still accepted so the existing call sites keep compiling,
and will be removed in a future major.

`FormBuilder`'s table cells and DataViews filter panels are unaffected — they surface errors through
their own tooltip in `FieldShell`, which is deliberately left in place because it is the only error
indicator those chrome-less fields have.

### Fixes

- **`TabSwitch`** — selecting a tab no longer shifts the control. The dividers touching the active
  pill are still hidden by design, but they are now painted transparent instead of being unmounted.
  Each one is a `w-px` plus `mx-[3px]`, so removing it took 7px out of the track: with three
  options, selecting the middle one dropped both dividers and moved the control 14px. The slot is
  always rendered and only its ink changes.
- **`FieldSection`** — `childrenUnderLabel` (which carries the field's validation error and hints)
  follows the layout. Stacked, it sits under the label; once the section reaches `@md` and splits
  into two columns it moves under the control it describes, instead of being stranded at the bottom
  of the 350px label column. Driven only by container width, so a `direction="vertical"` form — what
  `FormRenderer` forces inside a drawer — behaves the same.
- **`FormRenderer`** stepper — the empty third grid column that balances the rail's gutter is now
  dropped below `@lg`, giving its 180px floor plus a 32px gap back to the fields. The grid template
  changes with it: a `display:none` child is not a grid item, but the track would still be reserved
  if the template kept describing it. Measured against the wrapper as a container query, so the form
  reacts to the width it is given rather than the viewport's.
- **`SlideDatePicker`** — `theme` now pins only the picker panel, not the trigger field. The field
  follows the surrounding page so it matches the inputs beside it.
- **`PopoverItem`** — disabled rows are styled (dimmed, no hover fill or shadow) rather than
  responding to hover like an enabled one.
- **`Card`** — the 12px corner is the `rounded-radius-xl` token instead of a literal. Same pixels.

## 2.5.2

### Breaking — `FormBuilder` is now only the fields

Everything drawn *around* the fields moved to `FormRenderer`. The split was already what the docs
described; the code did not honour it. `FormBuilder` owned a rounded page shell, a title header
that a *child element* switched on, a stepper rail, and a `conclusion` panel rendered outside its
own `<form>` — while its own doc comment called it "drawer-unaware". The `layout="bare"` prop was
the tell: page framing had been baked in, so anything embedding a form (a 260px settings rail, a
`DataViews` filter panel) needed an escape hatch to switch it off. Now there is nothing to escape —
a bare `<FormBuilder>` is a `<form>` and your fields, filling whatever it is placed in.

**Renamed** — no compatibility shim, so the compiler finds every call site:

| Before                | After                                     |
| --------------------- | ----------------------------------------- |
| `FormBuilder.Section` | `FormRenderer.Section`                    |
| `FormBuilder.Stepper` | `FormRenderer.Stepper`                    |
| `FormBuilder.Step`    | `FormRenderer.Step`                       |
| `FormBuilder.Back`    | `FormRenderer.Back`                       |
| `FormBuilder.Next`    | `FormRenderer.Next`                       |
| `FormBuilder.Header`  | `FormRenderer`'s `header` prop            |

`FormBuilder.Submit` does **not** move — it is the form's own submit button and still
auto-associates with the `<form>` by id.

**Removed root props:** `layout` (bare is the only behaviour; the 1100px cap and 48px gutters are
FormRenderer's) and `conclusion` (use FormRenderer's `summary`). `FormBuilder`'s `className` now
lands on the `<form>` element itself; FormRenderer's still lands on its outermost element, so
`className="min-h-0 flex-1"` behaves as before.

Fields land on exactly the same pixels — verified by comparing element geometry across five form
pages before and after. Only the `<form>` element's own box changed, because the gutters that sat
inside it now sit outside it. `FieldSection`, the per-field row layout, did not move.

See [the migration note](docs/migration/form-builder-2.5.2.md) for the upgrade path.

### Changed
- **Registry:** `FormBuilder` dropped `components/FormStepper` and `components/HeaderBar`;
  `FormRenderer` picked up those plus `components/SectionBlock` and `components/Button`. The
  dependency stays one-directional — `FormRenderer → FormBuilder`, never the reverse — so
  `add FormBuilder` still installs standalone, now as a smaller tree.
- **`DataViews.Filters`** dropped its `layout="bare"` workaround; its embedded form needs no
  special-casing any more.
- **MCP server (1.8.0):** the forms instruction block, the `create-form` generator and its tests
  now teach the new split.

### Fixed
- The stepper rail read `useFormState()` from context, which only worked because it happened to
  render inside the form provider. It now takes `control` explicitly, as `useStepperState` already
  did with `trigger` — the rail renders outside the `<form>` by design.

## 2.5.1

### Fixed
- **`add` installed an incomplete tree and reported success.** Dependencies were resolved by
  regex-scanning imports as files were copied — once per copied file, with no visited set, no cycle
  guard, and no way to pass `--force` down. A dependency skipped because its folder already existed
  was never descended into, so one stale empty directory silently truncated the install:
  `add DataViews` copied **16 of 55 items and exited 0**, leaving a project that could not compile.
  Installs now resolve the whole graph up front from `registry.json` — the same generated manifest
  the docs and MCP server read — copy each item once, install the npm union once, and end with a
  summary (`✅ DataViews → ./: 56 installed (56 items).`) so truncation is visible.
- **`--force` now applies to the whole dependency closure**, not only the component named.
- **An empty directory no longer counts as an installation.** A folder left behind by a deleted
  install made `add` refuse to copy while reporting "already exists".
- **`hook`, `layout` and `provider` accept a bare name.** They compared user input against directory
  listings that still carried file extensions, so `torch-glare hook useDragDrop` matched nothing —
  and the "not found" error was commented out in two of them, so it exited 0 in silence. All five
  commands now share one resolver, and all five report what they could not find.
- **`util` re-copied on every visit.** It deleted its target *before* checking whether the file
  existed, making the check permanently false — the source of `cn.ts has been added` five times in
  one install.
- **`add <hookName>` now points at the right command** instead of "Component not found".
- **Tailwind v3 detection** read `devDependencies` only, so a project with `tailwindcss` in
  `dependencies` was treated as v4.
- **Dependencies are installed at the version the library builds against.** They were installed
  unpinned, so an upstream major broke copied source the day it landed: `add DataTable` pulled
  `@tanstack/react-table@9`, whose API renamed `getCoreRowModel`/`useReactTable`, into a component
  written for v8 — 13 type errors on arrival, in a project that had done nothing wrong.
  `registry.json` now records the declared range per package (`npmVersions`) and the CLI installs
  that.

### Added
- **`init` wires your stylesheet.** It installed the Tailwind packages and stopped, leaving the
  `@import`/`@plugin` block as a manual step — so a project would build cleanly and render every
  design token unstyled, with no error. It now finds the entry stylesheet and writes the block,
  idempotently. On v3 it prints the `tailwind.config` snippet rather than editing a file it does
  not own.
- Every command takes `-f, --force`.

## 2.5.0

### Added
- **`DataViews`** — one dataset shown as a table, kanban board, inbox or tree, behind a shared
  header, filter set and settings rail. Replaces the `DataViewsLayout` family (see
  `docs/migration/data-views.md`). A part exists because you rendered it: render
  `<DataViews.Board/>` and a Board tab appears. Documented at `docs/components/data-views.md`.
- **Scroll loading** — rows load as you reach the end of a list rather than through a pager. Pass
  `onLoadMore` and append each page to `rows`; `hasMore` is derived from `rows.length < total`, so
  there is no prop to keep in sync. New `useInfiniteScroll` hook (an `IntersectionObserver` on a
  sentinel, latched so one arrival at the end costs exactly one page).
- **Table virtualization** — `DataViews.Table` renders a window of rows past 300, so the DOM stays
  small however many are loaded. Below that threshold it renders every row exactly as before, which
  is what keeps row drag, column resize and small tables untouched. Adds `@tanstack/react-virtual`.
- **`useDragDrop`** — one touch- and keyboard-capable drag hook behind every draggable surface:
  board cards, table rows, the config rail's column list and tree nodes. Touch drags activate on a
  200ms hold so a swipe still scrolls; keyboard is Space, arrows, Space.
- **`DataViews.Table` `onRowMove`** (row reordering, with a grip column) and **`onAddRow`** (the
  `+ Add New` end-action row).
- **The tree's pane, built in — and its tabs are children.** Pick a node and the pane lists what it
  holds. Its tabs follow the same rule as the component's views: **a tab exists because you
  rendered it**, and the switch shows exactly what you passed (one tab, no switch).
  `DataViews.Tree.Table` is the real `DataViews.Table` over the node's rows, so it keeps sortable
  headers, selection, `renderCell`, the drag grip, `+ Add New` and virtualization;
  `DataViews.Tree.Cards` is the board's card, with `renderCard` to replace it; and
  `DataViews.Tree.Tab` is a mode of your own, whose children are the pane while it is selected.
  Render none and there is no pane at all — the tree is a hierarchy and takes the whole width.
  Everything inside the pane runs in a data scope
  whose `rows` are the pane's, so a tab of your own reads the selected node's rows from
  `useDataViewsData()` with nothing threaded through. Rows default to the node's **descendants**
  (`paneRows` overrides — a tree of categories whose pane lists that category's items); the header
  takes your markup through `paneActions`; mode is the usual round-trip — seed with
  `defaultPaneMode`, persist from `onPaneModeChange`, or take it over with `paneMode`. Any child
  that is **not** a tab is the pane itself, header and switch included, so a tree written against
  the old `children`-is-the-pane contract is unchanged.
- **The MCP answers usefully when it is used imperfectly.** `get-install-info` now separates the
  packages a component needs itself from those it inherits, attributed to the item that requires
  them — DataViews reported 45 npm dependencies, 21 of them Editor.js pulled in through
  FormBuilder's rich-text field, which reads as "this component is unusable" rather than "you
  already have these if FormBuilder is installed". A wrong `part` now suggests the parts under
  `## API Reference` instead of every heading in the document; `search-components` maps the job
  people describe ("list screen", "crud", "record list") onto the component; and section keywords
  the tool itself advertises now resolve, because heading matching folds plurals. A stdio smoke
  test drives the real server through every tool — the suite previously only tested the loaders
  underneath, which is how these shipped green.
- **Every DataViews doc lives in one folder, and the examples ship with it.**
  `docs/components/data-views/` holds the reference (`index.md`), the guide, the migration notes,
  the backend-response recipes and fourteen complete example pages — generated from the app's real
  pages by `pnpm run examples`, because the docs previously linked at `apps/app/…`, which is in
  neither published tarball: every one of those links dangled the moment either package was
  installed. The MCP server learned the folder form (a component doc may be a directory with an
  `index.md`), serves the siblings as guides (`data-views`, `data-views-guide`,
  `data-views-migration`, `data-views-backend-response`), and `get-usage-examples` now lists the
  example pages and returns one in full on request. Two new gates make the failure impossible to
  repeat: `checkAiDocs` rejects any relative link that leaves `docs/` or does not resolve, and
  fails if a generated example has drifted from the page it came from. `sync-docs` also copies
  top-level `docs/*.md`, which had left `migration/changelog.md`'s link to the 1.1.16 changelog
  dangling in the package.
- **The docs are rigid now, and the MCP server can address them.** `docs/components/data-views.md`
  gives every part its own heading — `### DataViews.Board`, `### DataViews.Tree.Tab` — with one
  column schema (`Prop · Type · Default · Required · Notes`), all seventeen `FieldType` variants and
  the keys each reads, every hook's return shape, and the house sections the corpus expects
  (Quick Examples, Common Patterns, Testing, Performance, Styling, Known Limitations,
  Troubleshooting, Example pages). Two how-to guides join it: `docs/how-to/data-views.md`, ten
  scenarios from a first table to a view of your own, and a rewritten
  `data-views-from-backend-response.md` — which until now taught `DataViewsLayout`, deleted two
  releases ago, and linked to six files that do not exist.
- **`FormBuilder` `layout="bare"`** — drops the page form's centring and 48px gutters so an embedded
  form fills its container. `DataViews.Filters` uses it; in a 260px rail the gutters left the
  controls narrower than their own minimum.
- **`TreeFolder`** documentation at `docs/components/tree-folder.md`.

### Changed
- **Drag and drop now works on touch and with the keyboard.** Every surface previously used the
  HTML5 drag-and-drop API, which mobile browsers never fire from a finger — on a phone none of it
  worked at all. All four now go through `@dnd-kit` via `useDragDrop`.
- **`DataViews` matches its Figma source** — 40px header bar (down from 52), 40px table rows (down
  from 50), the divider at `#2c2d2e` with a 4px radius, and the Master Container now carries the
  surface (form base + 1px border + 16px radius) instead of each view bringing its own.
- **Empty and loading are no longer parts you render.** Nothing to show is shown as nothing: the
  table keeps its header band and has no rows. While `loading` is set each view paints a skeleton in
  its own shape, built from that view's real markup so nothing shifts when the data lands. A custom
  view gets the same via `useDataViewsData().loading` plus the exported `SkeletonBar` /
  `skeletonKeys`.
- **`TabSwitch`** no longer shifts its tabs when one is selected. The divider between options was
  conditionally mounted, so selecting an end tab versus a middle tab changed the track width by
  7px; the slot is now always present and only its colour changes.
- **`generateRegistry` registers folder components.** `DataViews`, `FormBuilder`, `FormRenderer`,
  `TextEditor`, `TreeFolder` and the `dataViews` utilities were absent from `registry.json`, so
  `add` copied them but installed none of their dependencies.

### Removed
- **`DataViewsLayout`, `DataViewsConfigPanel`, `TableView`, `KanbanView`, `InboxView`, `TreeView`**
  and their docs. These were folder components the registry never listed, so the CLI could never
  install them; `DataViews` replaces all six. Mapping in `docs/migration/data-views.md`.
- **`DataViews.Pagination`** — replaced by scroll loading.
- **`DataViews.Empty`** and **`DataViews.Loading`** — replaced by the behaviour described above.

## 2.4.5

_These entries accumulated across the 2.4.1–2.4.5 patches, which shipped without individual
changelog sections._

### Added
- **Rich text editor toolbar** — `TextEditor` now shows a fixed, sticky formatting toolbar by
  default (new `toolbar?: boolean` prop; auto-hidden for `readOnly`/`disabled`): undo/redo,
  block-type (Normal / Heading 1–3), alignment, text color, bold/italic/underline/strikethrough/
  clear, bullet & ordered lists, and insert-image. Adds `editorjs-undo` plus small custom
  Editor.js tools — a `StrikethroughInlineTool`, `ColorInlineTool`, and `AlignmentTune`
  (`lib/components/editor-tools/`) — whose sanitize/tune plumbing makes the formatting persist
  through `save()`. Also made the `/text-editor` demo SSR-safe (lazy-loads the editor).
- **`FormBuilder.RadioList`** and **`FormBuilder.CheckboxGroup`** — option-group fields that
  render as a boxed, divided list (light `#f9f9f9` container, full-width row dividers, control
  on the left, primary + optional secondary label). `RadioList` is single-select (`string`);
  `CheckboxGroup` is multi-select (`string[]`). `OptionItem` gained an optional `description`
  for the per-row secondary label.
- **`FormBuilder.SwitchBox`** — a switch wrapped in a `#f9f9f9` field box (value `boolean`).
  Renders like any other field (label in the normal label column); the box holds an optional
  inline `subLabel`, a vertical divider, and the switch.

### Changed
- `FormBuilder.Checkbox` gained an optional `subLabel` — text rendered inline beside the
  checkbox (via the clickable `LabeledCheckBox`), in addition to the field `label`.
- Restyled `ImageAttachment` to match the *Attachment-Field-1.0 / Pic-Container-1.0* design: a
  `#f9f9f9` field box around a transparent dashed drop zone, a fixed 65×65 square thumbnail, an
  ocean/blue-purple "ratio" placeholder (gray on hover), and a `black/50` + fullscreen-icon
  expand overlay. Fixes the placeholder, which previously referenced a non-existent
  `badge-blue-purple` token (its colors were silently no-ops). `ExpandableImage` no longer
  aspect-ratio-fits (now a fixed square); `FileField` / `FormBuilder.File`/`.Image` behavior is
  unchanged.

### Removed
- **BREAKING:** removed the non-boxed `FormBuilder.Radio` and `FormBuilder.Switch` fields —
  their boxed versions are the only style now. Migrate `.Radio` → `.RadioList` and
  `.Switch` → `.SwitchBox` (same value contracts). The single boolean `FormBuilder.Checkbox`
  is unchanged and still available.

### Changed
- **BREAKING:** `DrawerContent` no longer paints the light content surface. That surface is now
  a separate exported **`DrawerPanel`** — wrap your drawer body in it. This is what lets a
  drawer hold a form panel and a second panel (e.g. a `FormSummary`) side by side, each with
  its own background; the tray now only frames and positions.
  - `className` on `DrawerContent` now targets the **tray**. Its old inner-surface meaning
    moves to `DrawerPanel`. `trayClassName` is kept as a deprecated alias.
  - `showHandle` moves from `DrawerContent` to `DrawerPanel`, where it defaults to `false`
    (it was `true`, auto-hidden when a `notch` was present).
  - Migration: `<DrawerContent className="x">…</DrawerContent>` →
    `<DrawerContent><DrawerPanel className="x">…</DrawerPanel></DrawerContent>`.
- `DrawerContent` dropped its `childrenOutside` prop and the `gap-[6px]` in its tray base —
  the primitive no longer encodes the form + summary pairing. `FormDrawer` owns that
  arrangement now, and callers with two tray children supply their own `gap-*`.
- `FormDrawer`'s `childrenOutside` prop is renamed **`summary`** (the old name still works,
  deprecated).
- **BREAKING:** `FormDrawer` now renders the **same floating header as the page form** — a
  `HeaderBar` title pill plus a dark action pill — instead of its own small
  `DrawerHeaderTitle` treatment, so a form's title is identical in either display. The shared
  markup lives in a new exported `FormHeaderBar` (`FormBuilder/header.tsx`), which
  `FormBuilder.Header` now wraps.
  - `FormDrawer`'s `title` / `badge` narrow from `ReactNode` to `string` (they render through
    `HeaderBar`'s uppercase text); same for `FormRenderer`'s `title` / `badge`.
  - `FormDrawer` gains `variant` (`new` / `edit` / `detail`), and `FormRenderer` now forwards
    `header.variant` to the drawer — previously the drawer dropped it.
  - The visible title is now the `HeaderBar`; a screen-reader-only `DrawerTitle` is kept so
    Vaul still has an accessible name.

### Fixed
- Form header action pill was **2px shorter than the title pill** (44px vs 46px) — its
  `p-[7px]` is now `p-2`, matching the design's 8px inset / 28px content. Affects both the
  page form and the drawer.
- `ConclusionHeader` now declares its `Badge` dependency in the registry — `add
  ConclusionHeader` previously copied a file that imported an uncopied component.

## 2.4.0

### Added
- **HeaderBar** component — variant-driven page/form header chip (`new` / `edit` / `detail`) pairing a colored emphasis pill with a plain title.
- **ContextMenu** component — right-click / long-press menu sharing the DropdownMenu surface (boxed auto-grouping, checkbox/radio items, nested sub-menus, RTL).
- **SearchableSelect** and **SearchableTable** — searchable single-select combobox and a dialog-based row picker, both with client- or server-side search and infinite-scroll pagination.
- `maxHeight` prop on `ContextMenu` / `DropdownMenu` content — caps the surface height so long menus scroll instead of overflowing off-screen.
- DataViews: `FieldConfig.filterVariant: "searchable-select"` renders a categorical filter as a single-select `SearchableSelect` dropdown; documented `filterMode` / `filterLabel` / `filterOptions`.
- SectionBlock: bilingual (EN / AR) form example with an in-header language switch and per-row RTL.

### Changed
- DropdownMenu moved fully to auto-grouped (boxed) menus; the `DropdownMenuSeparator` shim was removed (use labels / explicit `DropdownMenuGroup` as section boundaries).
- DataViews config panel: restored the Saved View section; "Save a New View" now uses the Glare `Button` (size M); the close (X) button turns red on hover.

### Fixed
- DataViews `DataViewRadio` unselected ring was invisible on the dark panel — now hardcodes the spec values (`#626467` border, `rgba(255,255,255,0.05)` fill, `#0075FF` selected) so it always renders dark regardless of host `data-theme`.
- Badge subtle variants gained `isolate` so the `mix-blend-luminosity` label/icon composites only against the badge background, fixing ghosted/double-stroked text on layered surfaces.

## 2.1.1

### Changed
- **BREAKING:** `Badge` API restructured.
  - Replaced `variant` prop with two orthogonal props: `badgeStyle` (`'subtle' | 'solid'`, default `'subtle'`) and `color` (10 options).
  - New color set: `gray`, `slate`, `red`, `orange`, `yellow`, `green`, `ocean`, `blue`, `purple`, `rose`. Removed legacy values: `highlight`, `greenLight`, `cocktailGreen`, `redOrange`, `redLight`, `bluePurple`, `navy`.
  - Renamed chip-removal props: `isSelected` → `isClosable`, `onUnselect` → `onClose`.
  - Subtle text and icons are now rendered with a single neutral foreground (`--Content-Presentation-Global-subtle`, `#494949`) blended with `mix-blend-mode: luminosity`, regardless of color.
  - Close button rebuilt as an inline 12×12 SVG (12 on XS, 14 on S, 16 on M) with a `4px`-radius hover background using `--Background-Presentation-Action-Secondary`. The button participates in the same luminosity blend.
- The `M` size label no longer carries a `1px` top-padding shim — text is centered via flex alignment + typography line-height.
- `BadgeField` updated internally to pass the new `color` and `isClosable`/`onClose` props.

## 1.5.0

### Changed
- **BREAKING (CLI):** `SectionCard` component renamed to `SectionBlock`. The component, its props (`SectionCardProps` → `SectionBlockProps`), the docs route (`/components/sectionCard` → `/components/sectionBlock`), and the CLI scaffolder name all use the new name. Already-scaffolded `SectionCard.tsx` files in user projects are unaffected; new installs must use `npx torch-glare add SectionBlock`.

## 1.4.0

### Added
- `SectionCard` component — themed container with a colored title badge (Blue, Yellow, Green, Red, Orange, Purple, Pink, Gray) and a form-base body. Title accepts any `ReactNode`; supports `containerClassName`, `headerClassName`, and `bodyClassName` slots.

### Changed
- `Button` component reworked (padding, sizing, and variant cleanup).
- Color system updated: bumped `glare-torch-mode` and `mapping-color-system` plugin pairings to the new color tokens.

## 1.0.0

- Initial release of the TORCH Glare Components Library.

## 1.0.1

### Added
- `Group`, `Icon`, `Trilling` components added to `Input` component as `Group`, `Icon`, `Trilling` to make building custom inputs easier, and refactor InputField, BadgeField components to use them.
- `Radio` component Added to make building custom radio buttons easier.
- `CheckBox` component Added to make building custom checkboxes easier.
- `AlertDialog` component Added to make building custom alert dialogs easier.
- `SearchField` component Added as Customizable Search Input for specific use cases.


### Changed
- `CheckBoxLabel` component name changed to `LabeledCheckBox`
- `Counter` component name changed to `CountBadge`
- `DropDownButton` component name changed to `Select`
- `LabelLessInput` component name changed to `InnerLabelField`
- `ProfileItem` component name changed to `ProfileMenu`
- `RadioLabel` component name changed to `LabeledRadio`
- `Alert` component name changed to `FieldHint`
- `AttachedPic` component name changed to `AttachmentImagePreview`
- `AttachmentField` component name changed to `ImageAttachment`
- `ButtonField` component name changed to `ActionsGroup`

- `CLI` command name changed from `torchcorp` to `torch-glare`
- `CLI` config file name changed from `torch.json` to `glare.json`
- `CLI` `add-hook` command changed to `hook`
- `CLI` `add-util` command changed to `util`
- `CLI` `add-provider` command changed to `provider`

and many more bug fixes and improvements and cleanup the code base.


## 1.0.2

small bug fixes and improvements.

## 1.0.4

### Changed
- `Switcher` changed to `Switch` component to make building custom switches easier using `@radix-ui/react-switch` component.
- `CLI` `replace` flag added to `addComponent` command to prevent adding the component if it already exists.
### Added
- `Form` component Added to make building custom forms easier using `react-hook-form` and `zod` for validation.


## 1.0.7

### Changed
- `CLI` use typescript instead of javascript to make it more robust and easier to maintain.
- `Radio` component changed to use `@radix-ui/react-radio-group` component.
- `Checkbox` component changed to use `@radix-ui/react-checkbox` component.

### Added

#### New Components
- `Divider` component to make separation between components.
- `Skeleton` component for loading pages.
- `Toggle` component for toggling between two states.
- `Avatar` component for displaying user profile pictures.
- `InputOTP` component for displaying OTP input fields.

## 1.0.8

### Changed
- `InnerLabelField` component size prop changed to `M` by default.
- `BadgeField` component refactored to use `useTagSelection` hook to handle the tag selection and the search and filter and keyboard navigation functionality.

## 1.0.8

### Changed
- `InnerLabelField` component size prop changed to `M` by default.
- `BadgeField` component refactored to use `useTagSelection` hook to handle the tag selection and the search and filter and keyboard navigation functionality.
- `glare-themes` tailwindcss plugin name changed to `mapping-color-system`


### Added

#### New Scripts
- `updateModPlugins` script to automatically update the mode plugins.
- `updateMappingPlugin` script to automatically update the mappingColorSystem plugin.
and fix tailwindcss issues.


## 1.1.0

### Changed
- `AlertDialog` popover position changed to `center` by default.
- `BadgeField` component refactored to use handle single select functionality.
- `CLI` stop modify the tailwind.config.js on first init.


## 1.1.1

### Added

- Add support for version 4 of tailwindcss.


## 1.1.2

### Added

- `Input` component refactored to use hide mask when input is focused.
- `Input` component refactored to use auto scroll to the end of the input when the input is focused.
- `DatePicker` add time picker to the date picker.

## 1.1.3

### Hot Fix

- `DatePicker` fix open date picker issue.

## 1.1.4

### Added

- `Calendar` component added to the library.
- `SlideDatePicker` component added to the library.

### Refactor 

- `DatePicker` refactored to use `Calender` component .
- `DatePicker` use new range, and multuble with Time slider.
- `Button` component type prop changed to `button` by default.
- `MobileSilder` Hook moved to npm as packege.


## 1.1.5

Hot bug fixes.



## 1.1.6

### Refactor

- `DatePicker` use Initial value from value prop.
- `BadgeField` compatible with react-hook-form and fix size issues.


# 1.1.7

### Added 

- `Toast` component added to the library.