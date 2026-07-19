## Unreleased

### Added
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