---
name: TabSwitch
version: 1.0.0
status: stable
category: components/navigation
tags: [tab-switch, segmented-control, view-switcher, toggle, list-cards, pills]
last-reviewed: 2026-06-15
bundle-size: 2.0kb
dependencies:
  - "class-variance-authority": "^0.7.0"
---

# TabSwitch

> A segmented control for picking one option from a small set — the classic List / Cards style pill switcher. The active option renders as a solid raised white pill; thin dividers sit between adjacent inactive options (never flanking the active pill). Controlled, generic over the option value, supports optional per-option icons, three sizes, and theme-aware track/labels. This is the switcher used in the DataViews header to flip between Table / Kanban / Inbox / Tree.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { TabSwitch } from 'torch-glare/lib/components/TabSwitch'
import type { TabSwitchOption } from 'torch-glare/lib/components/TabSwitch'
```

## Quick Examples

### Basic Usage (List / Cards)

```typescript
import { TabSwitch } from 'torch-glare/lib/components/TabSwitch'
import { useState } from 'react'

function Example() {
  const [view, setView] = useState('list')

  return (
    <TabSwitch
      value={view}
      onValueChange={setView}
      options={[
        { value: 'list', label: 'List', icon: <i className="ri-layout-grid-line" /> },
        { value: 'cards', label: 'Cards', icon: <i className="ri-grid-fill" /> },
      ]}
    />
  )
}
```

### Sizes

```typescript
<TabSwitch size="S" value={view} onValueChange={setView} options={options} />
<TabSwitch size="M" value={view} onValueChange={setView} options={options} /> {/* default */}
<TabSwitch size="L" value={view} onValueChange={setView} options={options} />
```

### Icons Only

Omit `label` to render an icon-only switcher.

```typescript
<TabSwitch
  value={view}
  onValueChange={setView}
  options={[
    { value: 'list', icon: <i className="ri-layout-grid-line" /> },
    { value: 'cards', icon: <i className="ri-grid-fill" /> },
    { value: 'board', icon: <i className="ri-layout-column-line" /> },
  ]}
/>
```

### On a dark surface

The active pill is always a solid white pill with dark text, so it stays visible on dark bars. The track and inactive labels follow the theme — pass `theme="dark"` (or render inside a `data-theme="dark"` scope) so they resolve dark-theme tokens. This is how the DataViews header uses it.

```typescript
<div data-theme="dark" className="bg-black p-2">
  <TabSwitch theme="dark" value={view} onValueChange={setView} options={options} />
</div>
```

### Disabled

```typescript
{/* whole control */}
<TabSwitch disabled value={view} onValueChange={setView} options={options} />

{/* a single option */}
<TabSwitch
  value={view}
  onValueChange={setView}
  options={[
    { value: 'list', label: 'List' },
    { value: 'cards', label: 'Cards', disabled: true },
  ]}
/>
```

## API Reference

### TabSwitch

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `TabSwitchOption[]` | — (required) | The selectable options rendered as segments. |
| `value` | `string` | — | The currently selected option value (controlled). |
| `onValueChange` | `(value: string) => void` | — | Called with the option value when a segment is selected. |
| `size` | `'S' \| 'M' \| 'L'` | `'M'` | Size of the control. |
| `disabled` | `boolean` | `false` | Disables the whole control. |
| `theme` | `'dark' \| 'light' \| 'default'` | — | Applies a fixed theme to the track and inactive labels (the active pill stays white). |
| `className` | `string` | — | Additional classes merged onto the track. |

`TabSwitch` is generic over the option value: `TabSwitch<T extends string>` infers `T` from `options`, so `value` and `onValueChange` are typed to your union (e.g. `'list' | 'cards'`).

### TabSwitchOption

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Unique value for the option. |
| `label` | `ReactNode` | `undefined` | Text or node shown for the option. Omit for an icon-only segment. |
| `icon` | `ReactNode` | `undefined` | Optional leading icon rendered before the label. |
| `disabled` | `boolean` | `false` | Disables this individual option. |

## Accessibility

- The track is a `role="tablist"`; each option is a `role="tab"` with `aria-selected` reflecting the active state.
- Options are real `<button>` elements, so they are keyboard-focusable and activate on Enter/Space.

## Notes

- The active pill is intentionally a solid white pill with dark text in every theme (not derived from the per-theme selected-tab tokens), so it reads correctly on the always-dark DataViews header as well as on light surfaces.
- TabSwitch is a controlled component — always pass both `value` and `onValueChange`.

## TypeScript

```typescript
interface TabSwitchOption<T extends string = string> {
  value: T
  label?: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

interface TabSwitchProps<T extends string = string>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: TabSwitchOption<T>[]
  value: T
  onValueChange: (value: T) => void
  size?: 'S' | 'M' | 'L'
  theme?: 'dark' | 'light' | 'default'
  disabled?: boolean
}

declare function TabSwitch<T extends string = string>(
  props: TabSwitchProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
): React.ReactElement
```
