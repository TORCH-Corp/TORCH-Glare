---
title: DropdownMenu
description: Comprehensive dropdown menu component with rich features including sub-menus, checkboxes, radio groups, and keyboard navigation
group: Overlays & Dialogs
keywords: [dropdown-menu, menu, context-menu, radix-ui, submenu, checkbox]
---

# DropdownMenu

> A feature-rich dropdown menu component with support for nested submenus, checkbox items, radio groups, separators, and keyboard shortcuts. Perfect for application menus, context menus, and complex action lists.

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
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuGroup,
} from '@torch-ui/components'
```

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

### With Labels and Separators

```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@torch-ui/components'

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

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuItem>Preferences</DropdownMenuItem>
        <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="Negative">Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### With Checkboxes

```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuSeparator } from '@torch-ui/components'
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

### SystemStyle Variant

```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@torch-ui/components'

function SystemMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>System</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent variant="SystemStyle">
        <DropdownMenuItem variant="SystemStyle">Settings</DropdownMenuItem>
        <DropdownMenuItem variant="SystemStyle">About</DropdownMenuItem>
        <DropdownMenuItem variant="SystemStyle">Help</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Context Menu Pattern

```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@torch-ui/components'

function ContextMenu({ x, y }: { x: number; y: number }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div onContextMenu={(e) => e.preventDefault()}>
          Right-click me
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>View</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Properties</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
| `variant` | `'SystemStyle' \| 'PresentationStyle'` | `'PresentationStyle'` | Visual style variant |
| `theme` | `'dark' \| 'light' \| 'default'` | - | Theme variant |
| `className` | `string` | - | Additional CSS classes |
| `sideOffset` | `number` | `4` | Distance from trigger |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment |

### DropdownMenuItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'Default' \| 'Warning' \| 'Negative' \| 'SystemStyle'` | `'Default'` | Item style variant |
| `size` | `'S' \| 'M'` | `'M'` | Item size |
| `disabled` | `boolean` | `false` | Disabled state |
| `active` | `boolean` | `false` | Active state |
| `onSelect` | `(event) => void` | - | Select handler |

### DropdownMenuCheckboxItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean \| 'indeterminate'` | `false` | Checked state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Change handler |
| `variant` | `'Default' \| 'Warning' \| 'Negative' \| 'SystemStyle'` | `'Default'` | Style variant |

### DropdownMenuRadioGroup

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Selected radio value |
| `onValueChange` | `(value: string) => void` | - | Change handler |

### DropdownMenuRadioItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | Radio option value |
| `variant` | `'Default' \| 'Warning' \| 'Negative' \| 'SystemStyle'` | `'Default'` | Style variant |

### DropdownMenuLabel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### DropdownMenuSeparator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
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
  variant?: 'SystemStyle' | 'PresentationStyle'
  theme?: 'dark' | 'light' | 'default'
  className?: string
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
}

export const DropdownMenuContent: React.ForwardRefExoticComponent<DropdownMenuContentProps>

// Item
interface DropdownMenuItemProps {
  variant?: 'Default' | 'Warning' | 'Negative' | 'SystemStyle'
  size?: 'S' | 'M'
  disabled?: boolean
  active?: boolean
  onSelect?: (event: Event) => void
}

export const DropdownMenuItem: React.ForwardRefExoticComponent<DropdownMenuItemProps>

// CheckboxItem
interface DropdownMenuCheckboxItemProps {
  checked?: boolean | 'indeterminate'
  onCheckedChange?: (checked: boolean) => void
  variant?: 'Default' | 'Warning' | 'Negative' | 'SystemStyle'
}

export const DropdownMenuCheckboxItem: React.ForwardRefExoticComponent<DropdownMenuCheckboxItemProps>

// RadioItem
interface DropdownMenuRadioItemProps {
  value: string
  variant?: 'Default' | 'Warning' | 'Negative' | 'SystemStyle'
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
| Max height | 200px (scrollable) |
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
