---
title: DropdownMenu
description: Comprehensive dropdown menu component with rich features including sub-menus, checkboxes, radio groups, auto-grouping, and keyboard navigation
group: Overlays & Dialogs
keywords: [dropdown-menu, menu, radix-ui, submenu, checkbox, radio, auto-group]
---

# DropdownMenu

> A feature-rich dropdown menu component with support for nested submenus, checkbox items, radio groups, auto-grouped boxed sections, and keyboard shortcuts. Perfect for application menus and complex action lists. For right-click menus, see [ContextMenu](./context-menu.md).

## Installation

```bash
npm install @radix-ui/react-dropdown-menu
```

## Import

```typescript
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
} from '@torch-ui/components'
```

> **Auto-grouping:** Loose items placed directly in `DropdownMenuContent` (or `DropdownMenuSubContent`) are automatically wrapped in a boxed group, so they render inside a rounded container without you writing `DropdownMenuGroup` yourself. A `DropdownMenuLabel`, an explicit `DropdownMenuGroup`, or a `DropdownMenuRadioGroup` acts as a boundary that starts a new box. Disable this with `autoGroup={false}` on the content. (There is no `DropdownMenuSeparator` — separation comes from labels and the boxed groups.)

## Quick Examples

### Basic Menu

```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function Example() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### With Icons

```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@torch-ui/components'

function IconMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <i className="ri-more-2-fill" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <i className="ri-edit-line" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <i className="ri-share-line" />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuItem variant="Negative">
          <i className="ri-delete-bin-line" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### With Keyboard Shortcuts

```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut } from '@torch-ui/components'

function ShortcutMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>File</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          New File
          <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Save
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Save As...
          <DropdownMenuShortcut>⌘⇧S</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### With Labels and Grouping

Labels act as section boundaries. The loose items between labels are automatically wrapped in boxed groups — no separator component needed.

```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '@torch-ui/components'

function OrganizedMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>Actions</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>

        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuItem>Preferences</DropdownMenuItem>
        <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>

        <DropdownMenuItem variant="Negative">Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### With Checkboxes

Checkbox and radio items keep the menu **open** when toggled (the built-in `onSelect` calls `preventDefault`), so users can change several options without the menu closing each time.

```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from '@torch-ui/components'
import { useState } from 'react'

function CheckboxMenu() {
  const [showStatusBar, setShowStatusBar] = useState(true)
  const [showActivityBar, setShowActivityBar] = useState(false)
  const [showPanel, setShowPanel] = useState(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>View</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showActivityBar}
          onCheckedChange={setShowActivityBar}
        >
          Activity Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showPanel}
          onCheckedChange={setShowPanel}
        >
          Panel
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### With Radio Group

```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@torch-ui/components'
import { useState } from 'react'

function RadioMenu() {
  const [position, setPosition] = useState('bottom')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>Position</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### With Submenu

```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@torch-ui/components'

function SubmenuExample() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>More</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>New Tab</DropdownMenuItem>
        <DropdownMenuItem>New Window</DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            More Tools
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Developer Tools</DropdownMenuItem>
            <DropdownMenuItem>Task Manager</DropdownMenuItem>
            <DropdownMenuItem>Extensions</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem>Print</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Disabled Items

```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@torch-ui/components'

function DisabledMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>Edit</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Cut</DropdownMenuItem>
        <DropdownMenuItem>Copy</DropdownMenuItem>
        <DropdownMenuItem disabled>Paste (Empty Clipboard)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Right-click Menu

For a true right-click (context) menu, use the dedicated [ContextMenu](./context-menu.md) component instead of DropdownMenu — it opens at the pointer on right-click / long-press.

```typescript
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@torch-ui/components'

function Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="rounded-md border border-dashed p-8">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>View</ContextMenuItem>
        <ContextMenuItem>Edit</ContextMenuItem>
        <ContextMenuItem variant="Negative">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
```

## API Reference

### DropdownMenu (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |
| `defaultOpen` | `boolean` | `false` | Uncontrolled default open state |
| `modal` | `boolean` | `true` | Whether to block outside interactions |

### DropdownMenuTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render trigger as child element |

### DropdownMenuContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'PresentationStyle'` | `'PresentationStyle'` | Visual style variant |
| `theme` | `'dark' \| 'light' \| 'default'` | - | Theme variant |
| `className` | `string` | - | Additional CSS classes |
| `sideOffset` | `number` | `4` | Distance from trigger |
| `collisionPadding` | `number` | `8` | Gap kept from viewport edges when flipping/shifting |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment (inherited from Radix) |
| `autoGroup` | `boolean` | `true` | Auto-wrap loose items in boxed groups |

### DropdownMenuItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'Default' \| 'info' \| 'Negative'` | `'Default'` | Item style variant |
| `size` | `'S' \| 'M'` | `'M'` | Item size |
| `inset` | `boolean` | `false` | Add left padding to align with items that have icons |
| `disabled` | `boolean` | `false` | Disabled state |
| `active` | `boolean` | `false` | Active state |
| `onSelect` | `(event) => void` | - | Select handler |

### DropdownMenuCheckboxItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean \| 'indeterminate'` | `false` | Checked state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Change handler |
| `variant` | `'Default' \| 'info' \| 'Negative'` | `'Default'` | Style variant |
| `size` | `'S' \| 'M'` | `'M'` | Item size |

### DropdownMenuRadioGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Selected radio value |
| `onValueChange` | `(value: string) => void` | - | Change handler |

### DropdownMenuRadioItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | Radio option value |
| `variant` | `'Default' \| 'info' \| 'Negative'` | `'Default'` | Style variant |
| `size` | `'S' \| 'M'` | `'M'` | Item size |

### DropdownMenuSubTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'Default' \| 'info' \| 'Negative'` | `'Default'` | Style variant |
| `size` | `'S' \| 'M'` | `'M'` | Item size |
| `inset` | `boolean` | `false` | Add left padding to align with items that have icons |
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuSubContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'PresentationStyle'` | `'PresentationStyle'` | Visual style variant |
| `autoGroup` | `boolean` | `true` | Auto-wrap loose items in boxed groups |
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuLabel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inset` | `boolean` | `false` | Add left padding to align with items that have icons |
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'Boxed' \| 'Plain'` | `'Boxed'` | Boxed renders a bordered container; Plain is semantic-only |
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuShortcut

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

## TypeScript

### Full Type Definitions

```typescript
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

// Root
interface DropdownMenuProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  modal?: boolean
  children: React.ReactNode
}

export const DropdownMenu: React.FC<DropdownMenuProps>

// Content
interface DropdownMenuContentProps {
  variant?: 'PresentationStyle'
  theme?: 'dark' | 'light' | 'default'
  className?: string
  sideOffset?: number
  collisionPadding?: number
  align?: 'start' | 'center' | 'end'
  autoGroup?: boolean
}

export const DropdownMenuContent: React.ForwardRefExoticComponent<DropdownMenuContentProps>

// Item
interface DropdownMenuItemProps {
  variant?: 'Default' | 'info' | 'Negative'
  size?: 'S' | 'M'
  inset?: boolean
  disabled?: boolean
  active?: boolean
  onSelect?: (event: Event) => void
}

export const DropdownMenuItem: React.ForwardRefExoticComponent<DropdownMenuItemProps>

// CheckboxItem
interface DropdownMenuCheckboxItemProps {
  checked?: boolean | 'indeterminate'
  onCheckedChange?: (checked: boolean) => void
  variant?: 'Default' | 'info' | 'Negative'
  size?: 'S' | 'M'
}

export const DropdownMenuCheckboxItem: React.ForwardRefExoticComponent<DropdownMenuCheckboxItemProps>

// RadioItem
interface DropdownMenuRadioItemProps {
  value: string
  variant?: 'Default' | 'info' | 'Negative'
  size?: 'S' | 'M'
  onSelect?: (event: Event) => void
}

export const DropdownMenuRadioItem: React.ForwardRefExoticComponent<DropdownMenuRadioItemProps>
```

## Common Patterns

### With State Management

```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@torch-ui/components'
import { useState } from 'react'

function useDropdownMenu() {
  const [open, setOpen] = useState(false)

  const handleSelect = (action: string) => {
    console.log(action)
    setOpen(false)
  }

  return { open, setOpen, handleSelect }
}

function StatefulMenu() {
  const { open, setOpen, handleSelect } = useDropdownMenu()

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => handleSelect('edit')}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleSelect('delete')}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@torch-ui/components'

describe('DropdownMenu', () => {
  it('opens on trigger click', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })

  it('calls onSelect handler', () => {
    const handleSelect = jest.fn()

    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={handleSelect}>
            Select me
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    fireEvent.click(screen.getByText('Select me'))
    expect(handleSelect).toHaveBeenCalled()
  })

  it('handles checkbox state', () => {
    const handleChange = jest.fn()

    render(
      <DropdownMenu defaultOpen>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={false}
            onCheckedChange={handleChange}
          >
            Checkbox
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    fireEvent.click(screen.getByText('Checkbox'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })
})
```

## Accessibility

- **Keyboard Support**:
  - Arrow Down: Open menu / next item
  - Arrow Up: Previous item
  - Arrow Right: Open submenu
  - Arrow Left: Close submenu
  - Enter/Space: Select item
  - Escape: Close menu
  - Tab: Navigate away (closes menu)
- **ARIA Attributes**: Automatically applied by Radix UI
- **Focus Management**: Keyboard navigation fully supported
- **Screen Readers**: Menu structure announced

### Best Practices

```typescript
// Provide clear labels
<DropdownMenuTrigger aria-label="Open user menu">
  <i className="ri-user-line" />
</DropdownMenuTrigger>

// Group related items
<DropdownMenuGroup>
  <DropdownMenuItem>Profile</DropdownMenuItem>
  <DropdownMenuItem>Settings</DropdownMenuItem>
</DropdownMenuGroup>

// Mark disabled with descriptive text
<DropdownMenuItem disabled>
  Save (No changes to save)
</DropdownMenuItem>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~8kb |
| Bundle size (gzipped) | ~3kb |
| Dependencies | @radix-ui/react-dropdown-menu (~15kb) |
| Max height | Radix available height (scrollable) |
| Tree-shakeable | ✅ |

## Best Practices

1. **Use labels for organization**
   ```typescript
   <DropdownMenuLabel>Section</DropdownMenuLabel>
   ```

2. **Show keyboard shortcuts**
   ```typescript
   <DropdownMenuItem>
     Save
     <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
   </DropdownMenuItem>
   ```

3. **Group related items**
   ```typescript
   <DropdownMenuGroup>
     {/* Related items */}
   </DropdownMenuGroup>
   ```

4. **Use appropriate variants**
   ```typescript
   <DropdownMenuItem variant="Negative">Delete</DropdownMenuItem>
   ```

5. **Handle selection**: Close menu or update state
6. **Avoid deeply nested submenus**: 2 levels max
7. **Keep menu items concise**: Short, action-oriented labels

## Related Components

- [Popover](./popover.md) - Non-menu popover
- [ContextMenu](./context-menu.md) - Right-click menu
- [Select](./select.md) - Form select field
