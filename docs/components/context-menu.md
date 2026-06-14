---
title: ContextMenu
description: Right-click (or long-press) menu that opens at the pointer, with submenus, checkboxes, radio groups, and keyboard navigation
group: Overlays & Dialogs
keywords: [context-menu, right-click, menu, radix-ui, submenu, checkbox, contextmenu]
---

# ContextMenu

> A right-click / long-press menu that opens at the pointer. Wrap any zone in a `ContextMenuTrigger` and the menu appears where the user clicks — same surface as DropdownMenu (items, groups, the boxed look, auto-grouping), built on `@radix-ui/react-context-menu`.

## Installation

```bash
npm install @radix-ui/react-context-menu
```

## Import

```typescript
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuGroup,
  ContextMenuRadioGroup,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuPortal,
} from '@torch-ui/components'
```

## Quick Examples

### Basic Menu

Wrap the right-click zone in `ContextMenuTrigger`. The menu opens at the pointer.

```typescript
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@torch-ui/components'

function Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-40 w-72 items-center justify-center rounded-md border border-dashed">
          Right-click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Settings</ContextMenuItem>
        <ContextMenuItem>Logout</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

### With Icons, Shortcuts, and a Negative Item

```typescript
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuShortcut } from '@torch-ui/components'

function ActionsMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-40 w-72 items-center justify-center rounded-md border border-dashed">
          Right-click the canvas
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <i className="ri-edit-line" />
          <span>Edit</span>
          <ContextMenuShortcut>⌘E</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          <i className="ri-share-line" />
          <span>Share</span>
          <ContextMenuShortcut>⌘⇧S</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem variant="Negative">
          <i className="ri-delete-bin-line" />
          <span>Delete</span>
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

### With Checkboxes

> Clicking a checkbox item keeps the menu open — `onSelect` calls `preventDefault()` internally so Radix does not auto-close. Toggle several options without the menu dismissing.

```typescript
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuCheckboxItem } from '@torch-ui/components'
import { useState } from 'react'

function CheckboxMenu() {
  const [showStatusBar, setShowStatusBar] = useState(true)
  const [showActivityBar, setShowActivityBar] = useState(false)
  const [showPanel, setShowPanel] = useState(false)

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-40 w-72 items-center justify-center rounded-md border border-dashed">
          Right-click to toggle view
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          Status Bar
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
        >
          Activity Bar
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem
          checked={showPanel}
          onCheckedChange={setShowPanel}
        >
          Panel
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

### With Radio Group

> Like checkboxes, selecting a radio item keeps the menu open (`onSelect` `preventDefault` is built in).

```typescript
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuRadioGroup, ContextMenuRadioItem } from '@torch-ui/components'
import { useState } from 'react'

function RadioMenu() {
  const [position, setPosition] = useState('bottom')

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-40 w-72 items-center justify-center rounded-md border border-dashed">
          Right-click to pick a position
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuRadioGroup value={position} onValueChange={setPosition}>
          <ContextMenuRadioItem value="top">Top</ContextMenuRadioItem>
          <ContextMenuRadioItem value="bottom">Bottom</ContextMenuRadioItem>
          <ContextMenuRadioItem value="right">Right</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

### With Submenu

```typescript
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent } from '@torch-ui/components'

function SubmenuExample() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="flex h-40 w-72 items-center justify-center rounded-md border border-dashed">
          Right-click for more
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>New Tab</ContextMenuItem>
        <ContextMenuItem>New Window</ContextMenuItem>

        <ContextMenuSub>
          <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Developer Tools</ContextMenuItem>
            <ContextMenuItem>Task Manager</ContextMenuItem>
            <ContextMenuItem>Extensions</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuItem>Print</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

### RTL

Set `dir="rtl"` on the Root and the menu, items, and submenu arrows mirror automatically.

```typescript
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuShortcut } from '@torch-ui/components'

function RtlMenu() {
  return (
    <ContextMenu dir="rtl">
      <ContextMenuTrigger asChild>
        <div className="flex h-40 w-72 items-center justify-center rounded-md border border-dashed">
          انقر بزر الفأرة الأيمن
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          تحرير
          <ContextMenuShortcut>⌘E</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem variant="Negative">حذف</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

## API Reference

### ContextMenu (Root)

A controlled wrapper around the Radix root. It tracks the open state internally (so a second right-click can dismiss the menu) while still forwarding `open` / `onOpenChange` when you control it.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |
| `dir` | `'ltr' \| 'rtl'` | - | Reading direction; mirrors layout and arrows |
| `modal` | `boolean` | `true` | Whether to block outside interactions |
| `children` | `React.ReactNode` | - | Trigger and content |

### ContextMenuTrigger

The right-click zone. Wrap it around the element the menu should open from.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props onto the child element instead of rendering a wrapper |
| `disabled` | `boolean` | `false` | Disables opening on right-click |

### ContextMenuContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'PresentationStyle'` | `'PresentationStyle'` | Visual style variant |
| `theme` | `'dark' \| 'light' \| 'default'` | - | Theme variant (applied as `data-theme`) |
| `className` | `string` | - | Additional CSS classes |
| `collisionPadding` | `number` | `8` | Min distance kept from the viewport edge |
| `autoGroup` | `boolean` | `true` | Auto-wrap loose items in a Boxed group (see Behavior notes) |

### ContextMenuItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'Default' \| 'info' \| 'Negative'` | `'Default'` | Item style variant |
| `size` | `'S' \| 'M'` | `'M'` | Item size |
| `active` | `boolean` | `false` | Active (selected) state |
| `disabled` | `boolean` | `false` | Disabled state (still shows but is not selectable) |
| `onSelect` | `(event: Event) => void` | - | Select handler; closes the menu by default |

### ContextMenuCheckboxItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean \| 'indeterminate'` | `false` | Checked state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Change handler |
| `variant` | `'Default' \| 'info' \| 'Negative'` | `'Default'` | Style variant |
| `size` | `'S' \| 'M'` | `'M'` | Item size |

> Selecting a checkbox item keeps the menu open — `onSelect` `preventDefault` is built in.

### ContextMenuRadioGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Selected radio value |
| `onValueChange` | `(value: string) => void` | - | Change handler |
| `variant` | `'Boxed' \| 'Plain'` | `'Boxed'` | `Boxed` renders a bordered container; `Plain` is semantic grouping only |

### ContextMenuRadioItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | Radio option value |
| `variant` | `'Default' \| 'info' \| 'Negative'` | `'Default'` | Style variant |
| `size` | `'S' \| 'M'` | `'M'` | Item size |

> Selecting a radio item keeps the menu open — `onSelect` `preventDefault` is built in.

### ContextMenuSubTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'Default' \| 'info' \| 'Negative'` | `'Default'` | Style variant |
| `size` | `'S' \| 'M'` | `'M'` | Item size |
| `className` | `string` | - | Additional CSS classes |

Renders a trailing chevron (`ri-arrow-right-s-line`) that mirrors in RTL.

### ContextMenuLabel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

A non-interactive section heading. Acts as a boundary for auto-grouping.

### ContextMenuShortcut

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

A right-aligned (RTL-aware) span for keyboard hints inside an item.

## TypeScript

### Key Interfaces

```typescript
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'

// Root — controlled wrapper
type ContextMenuProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Root>
// { open?, onOpenChange?, dir?, modal?, children, ... }

export const ContextMenu: React.FC<ContextMenuProps>

// Content
interface ContextMenuContentProps {
  variant?: 'PresentationStyle'
  theme?: 'dark' | 'light' | 'default'
  className?: string
  collisionPadding?: number // default 8
  autoGroup?: boolean        // default true
}

export const ContextMenuContent: React.ForwardRefExoticComponent<ContextMenuContentProps>

// Item
interface ContextMenuItemProps {
  variant?: 'Default' | 'info' | 'Negative'
  size?: 'S' | 'M'
  active?: boolean
  disabled?: boolean
  onSelect?: (event: Event) => void
}

export const ContextMenuItem: React.ForwardRefExoticComponent<ContextMenuItemProps>

// CheckboxItem
interface ContextMenuCheckboxItemProps {
  checked?: boolean | 'indeterminate'
  onCheckedChange?: (checked: boolean) => void
  variant?: 'Default' | 'info' | 'Negative'
  size?: 'S' | 'M'
}

export const ContextMenuCheckboxItem: React.ForwardRefExoticComponent<ContextMenuCheckboxItemProps>

// RadioGroup
interface ContextMenuRadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  variant?: 'Boxed' | 'Plain'
}

export const ContextMenuRadioGroup: React.ForwardRefExoticComponent<ContextMenuRadioGroupProps>

// RadioItem
interface ContextMenuRadioItemProps {
  value: string
  variant?: 'Default' | 'info' | 'Negative'
  size?: 'S' | 'M'
}

export const ContextMenuRadioItem: React.ForwardRefExoticComponent<ContextMenuRadioItemProps>
```

## Behavior Notes

- **Opens at the pointer**: the menu opens on right-click (`contextmenu`) at the exact cursor position, not anchored to a fixed trigger button.
- **Second right-click closes it**: the Root is made controlled and tracks `open` in context. The Trigger listens in the capture phase, and when the menu is already open it `preventDefault()` / `stopPropagation()` and closes — so a second right-click dismisses instead of re-anchoring (which Radix handles unreliably).
- **Auto-grouping**: by default (`autoGroup` on `ContextMenuContent`, default `true`) consecutive loose items (`ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, and `ContextMenuSub`) are automatically wrapped in a `Boxed` `ContextMenuGroup`, so they render inside a boxed container like DropdownMenu even when you do not write a group. Labels and explicit groups act as boundaries and pass through unchanged. Set `autoGroup={false}` to render children verbatim.
- **Checkbox / radio keep the menu open**: `ContextMenuCheckboxItem` and `ContextMenuRadioItem` call `event.preventDefault()` inside `onSelect`, stopping Radix's default auto-close so users can toggle multiple options in one pass.
- **Open-only animation**: only the open (enter) state animates (`fade-in`). There is intentionally no exit animation — holding the old DOM node during close breaks close/reposition on a second right-click, so it is omitted to keep repositioning reliable.
- **Submenus and RTL**: nested `ContextMenuSub` / `ContextMenuSubTrigger` / `ContextMenuSubContent` are supported, and `dir="rtl"` on the Root mirrors the layout (including the submenu chevron).

## Accessibility

- **Keyboard Support**:
  - Shift+F10 or the Menu (context) key: open the menu from the focused trigger
  - Arrow Down / Arrow Up: move between items
  - Arrow Right: open submenu (Arrow Left to close) — mirrored in RTL
  - Enter / Space: select item
  - Escape: close menu
- **Touch**: long-press on the trigger opens the menu on touch devices.
- **ARIA Attributes**: roles and states are applied automatically by Radix UI.
- **Focus Management**: focus is trapped within the open menu and restored on close.
- **Screen Readers**: menu structure, checked/selected states, and submenus are announced.

## Best Practices

1. **Use a clear right-click zone**
   ```typescript
   <ContextMenuTrigger asChild>
     <div className="rounded-md border border-dashed">Right-click here</div>
   </ContextMenuTrigger>
   ```

2. **Use labels to separate sections** — they also break auto-grouping into distinct boxed runs
   ```typescript
   <ContextMenuLabel>Edit</ContextMenuLabel>
   ```

3. **Show keyboard shortcuts**
   ```typescript
   <ContextMenuItem>
     Save
     <ContextMenuShortcut>⌘S</ContextMenuShortcut>
   </ContextMenuItem>
   ```

4. **Use the Negative variant for destructive actions**
   ```typescript
   <ContextMenuItem variant="Negative">Delete</ContextMenuItem>
   ```

5. **Let checkbox/radio toggles stay open**: rely on the built-in behavior so users can adjust several settings without reopening.
6. **Avoid deeply nested submenus**: 2 levels max.
7. **Keep item labels concise**: short, action-oriented text.

## Related Components

- [DropdownMenu](./dropdown-menu.md) - Button-anchored menu
- [Popover](./popover.md) - Non-menu popover
- [Select](./select.md) - Form select field
