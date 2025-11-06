---
title: Popover
description: Non-modal overlay component for displaying rich content relative to a trigger element
group: Overlays & Dialogs
keywords: [popover, overlay, dropdown, radix-ui, menu, non-modal]
---

# Popover

> A non-modal overlay component that displays rich, interactive content anchored to a trigger element. Perfect for dropdowns, selection lists, and contextual menus with optional backdrop blur.

## Installation

```bash
npm install @radix-ui/react-popover
```

## Import

```typescript
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverItem,
} from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { Popover, PopoverTrigger, PopoverContent } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4">
          <p>This is popover content</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

### With PopoverItem List

```typescript
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from '@torch-ui/components'

function SelectPopover() {
  const items = ['Option 1', 'Option 2', 'Option 3']

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>Select an option</button>
      </PopoverTrigger>
      <PopoverContent>
        {items.map((item) => (
          <PopoverItem
            key={item}
            onClick={() => console.log(item)}
          >
            {item}
          </PopoverItem>
        ))}
      </PopoverContent>
    </Popover>
  )
}
```

### SystemStyle Variant

```typescript
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from '@torch-ui/components'

function SystemStylePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>System Menu</button>
      </PopoverTrigger>
      <PopoverContent variant="SystemStyle">
        <PopoverItem variant="SystemStyle">Settings</PopoverItem>
        <PopoverItem variant="SystemStyle">Profile</PopoverItem>
        <PopoverItem variant="SystemStyle">Logout</PopoverItem>
      </PopoverContent>
    </Popover>
  )
}
```

### With Icons

```typescript
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from '@torch-ui/components'

function IconPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>Actions</button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverItem>
          <i className="ri-edit-line" />
          <span>Edit</span>
        </PopoverItem>
        <PopoverItem>
          <i className="ri-share-line" />
          <span>Share</span>
        </PopoverItem>
        <PopoverItem variant="Negative">
          <i className="ri-delete-bin-line" />
          <span>Delete</span>
        </PopoverItem>
      </PopoverContent>
    </Popover>
  )
}
```

### With Active State

```typescript
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from '@torch-ui/components'
import { useState } from 'react'

function SelectablePopover() {
  const [selected, setSelected] = useState('option1')

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>Selected: {selected}</button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverItem
          active={selected === 'option1'}
          onClick={() => setSelected('option1')}
        >
          Option 1
        </PopoverItem>
        <PopoverItem
          active={selected === 'option2'}
          onClick={() => setSelected('option2')}
        >
          Option 2
        </PopoverItem>
        <PopoverItem
          active={selected === 'option3'}
          onClick={() => setSelected('option3')}
        >
          Option 3
        </PopoverItem>
      </PopoverContent>
    </Popover>
  )
}
```

### With Overlay Blur

```typescript
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from '@torch-ui/components'

function BlurredPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>Important Action</button>
      </PopoverTrigger>
      <PopoverContent overlayBlur={true}>
        <PopoverItem>Confirm Action</PopoverItem>
        <PopoverItem variant="Negative">Cancel</PopoverItem>
      </PopoverContent>
    </Popover>
  )
}
```

### Warning Items

```typescript
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from '@torch-ui/components'

function WarningPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>Danger Zone</button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverItem variant="Warning">
          <i className="ri-alert-line" />
          <span>Clear Cache</span>
        </PopoverItem>
        <PopoverItem variant="Negative">
          <i className="ri-delete-bin-line" />
          <span>Delete All Data</span>
        </PopoverItem>
      </PopoverContent>
    </Popover>
  )
}
```

### Size Variants

```typescript
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from '@torch-ui/components'

function SizedPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>Sizes</button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverItem size="S">Small Item</PopoverItem>
        <PopoverItem size="M">Medium Item (default)</PopoverItem>
      </PopoverContent>
    </Popover>
  )
}
```

### Controlled Popover

```typescript
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from '@torch-ui/components'
import { useState } from 'react'

function ControlledPopover() {
  const [open, setOpen] = useState(false)

  const handleSelect = (value: string) => {
    console.log(value)
    setOpen(false) // Close after selection
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button>Controlled</button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverItem onClick={() => handleSelect('A')}>Option A</PopoverItem>
        <PopoverItem onClick={() => handleSelect('B')}>Option B</PopoverItem>
      </PopoverContent>
    </Popover>
  )
}
```

### Positioning

```typescript
import { Popover, PopoverTrigger, PopoverContent } from '@torch-ui/components'

function PositionedPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>Positioned</button>
      </PopoverTrigger>
      <PopoverContent
        align="start" // or "center", "end"
        side="bottom" // or "top", "left", "right"
        sideOffset={8}
      >
        <div>Positioned content</div>
      </PopoverContent>
    </Popover>
  )
}
```

## API Reference

### Popover (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |
| `defaultOpen` | `boolean` | `false` | Uncontrolled default open state |
| `modal` | `boolean` | `false` | Whether to block outside interactions |

### PopoverTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render trigger as child element |
| `className` | `string` | - | Additional CSS classes |

### PopoverContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'SystemStyle' \| 'PresentationStyle'` | `'SystemStyle'` | Visual style variant |
| `overlayBlur` | `boolean` | `false` | Add blurred backdrop |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment relative to trigger |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side to display |
| `sideOffset` | `number` | `4` | Distance from trigger (px) |
| `theme` | `'dark' \| 'light' \| 'default'` | - | Theme variant |
| `className` | `string` | - | Additional CSS classes |

### PopoverItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'Default' \| 'Warning' \| 'Negative' \| 'SystemStyle'` | `'Default'` | Item style variant |
| `size` | `'S' \| 'M'` | `'M'` | Item size (S: 24px, M: 32px) |
| `active` | `boolean` | `false` | Active/selected state |
| `disabled` | `boolean` | `false` | Disabled state |
| `asChild` | `boolean` | `false` | Render as child element |
| `as` | `React.ElementType` | `'button'` | Element type to render as |
| `className` | `string` | - | Additional CSS classes |

## TypeScript

### Full Type Definitions

```typescript
import * as PopoverPrimitive from '@radix-ui/react-popover'

// Root component
interface PopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  modal?: boolean
  children: React.ReactNode
}

export const Popover: React.FC<PopoverProps>

// Content component
interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  variant?: 'SystemStyle' | 'PresentationStyle'
  overlayBlur?: boolean
  theme?: 'dark' | 'light' | 'default'
}

export const PopoverContent: React.ForwardRefExoticComponent<PopoverContentProps>

// Item component
interface PopoverItemProps<T extends React.ElementType = 'button'>
  extends React.HTMLAttributes<HTMLElement> {
  variant?: 'Default' | 'Warning' | 'Negative' | 'SystemStyle'
  size?: 'S' | 'M'
  active?: boolean
  disabled?: boolean
  asChild?: boolean
  as?: T
}

export const PopoverItem: <T extends React.ElementType = 'button'>(
  props: PopoverItemProps<T>
) => React.ReactElement
```

## Variants

### Content Variants

**SystemStyle**:
- Dark background with shadow
- For system/application menus
- Higher z-index and prominent shadow

**PresentationStyle** (default):
- Light background
- Subtle shadow
- For contextual content

### Item Variants

**Default**:
- Standard gray styling
- For general menu items

**Warning**:
- Blue/info color
- For informational actions

**Negative**:
- Red color
- For destructive actions

**SystemStyle**:
- Matches SystemStyle content
- For system menu items

## Features

### Auto-Scrolling
- Active items automatically scroll into view
- Smooth scrolling behavior
- Centers active item in viewport

### Collision Detection
- Automatically adjusts position to stay in viewport
- Prevents clipping at screen edges
- Smooth repositioning

## Common Patterns

### Select Pattern

```typescript
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from '@torch-ui/components'
import { useState } from 'react'

function SelectField() {
  const [value, setValue] = useState('')

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full text-left p-2 border rounded">
          {value || 'Select an option'}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)]">
        {options.map((option) => (
          <PopoverItem
            key={option}
            active={value === option}
            onClick={() => setValue(option)}
          >
            {option}
          </PopoverItem>
        ))}
      </PopoverContent>
    </Popover>
  )
}
```

### Context Menu Pattern

```typescript
function ContextMenu({ onEdit, onDelete }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <i className="ri-more-2-fill" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverItem onClick={onEdit}>
          <i className="ri-edit-line" />
          Edit
        </PopoverItem>
        <PopoverItem variant="Negative" onClick={onDelete}>
          <i className="ri-delete-bin-line" />
          Delete
        </PopoverItem>
      </PopoverContent>
    </Popover>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from '@torch-ui/components'

describe('Popover', () => {
  it('opens on trigger click', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverItem>Item 1</PopoverItem>
        </PopoverContent>
      </Popover>
    )

    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })

  it('calls onClick handler', () => {
    const handleClick = jest.fn()

    render(
      <Popover defaultOpen>
        <PopoverContent>
          <PopoverItem onClick={handleClick}>Click me</PopoverItem>
        </PopoverContent>
      </Popover>
    )

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalled()
  })

  it('renders with active state', () => {
    render(
      <Popover defaultOpen>
        <PopoverContent>
          <PopoverItem active>Active Item</PopoverItem>
        </PopoverContent>
      </Popover>
    )

    const item = screen.getByText('Active Item')
    expect(item).toHaveClass('bg-background-presentation-action-selected')
  })
})
```

## Accessibility

- **Keyboard Support**:
  - Escape: Close popover
  - Tab: Navigate items
  - Arrow keys: Navigate when appropriate
  - Enter/Space: Activate item
- **ARIA Attributes**:
  - Items have appropriate roles
  - Active states announced
  - Disabled items marked
- **Focus Management**:
  - Focus trapped when modal
  - Focus returns to trigger on close
  - Active items scrolled into view

### Accessibility Best Practices

```typescript
// Provide clear labels
<PopoverTrigger aria-label="Open menu">
  <i className="ri-more-2-fill" />
</PopoverTrigger>

// Use semantic button elements
<PopoverItem as="button" type="button">
  Action
</PopoverItem>

// Mark disabled items
<PopoverItem disabled>Unavailable Action</PopoverItem>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~5kb |
| Bundle size (gzipped) | ~2kb |
| Dependencies | @radix-ui/react-popover (~10kb) |
| Open/close | <16ms |
| Max height | 200px (scrollable) |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Use asChild prop**: Avoid wrapper elements
   ```typescript
   <PopoverTrigger asChild>
     <Button>Open</Button>
   </PopoverTrigger>
   ```

2. **Virtualize long lists**: For 100+ items
3. **Memoize item handlers**:
   ```typescript
   const handleClick = useCallback(() => {...}, [])
   ```

## Migration from DropdownMenu

```diff
- import { DropdownMenu } from '@torch-ui/components'
+ import { Popover } from '@torch-ui/components'

- <DropdownMenu>
-   <DropdownMenuTrigger>Open</DropdownMenuTrigger>
-   <DropdownMenuContent>
-     <DropdownMenuItem>Item</DropdownMenuItem>
-   </DropdownMenuContent>
- </DropdownMenu>

+ <Popover>
+   <PopoverTrigger>Open</PopoverTrigger>
+   <PopoverContent>
+     <PopoverItem>Item</PopoverItem>
+   </PopoverContent>
+ </Popover>
```

## Best Practices

1. **Match width to trigger**: For select-style popovers
   ```typescript
   <PopoverContent className="w-[var(--radix-popover-trigger-width)]">
   ```

2. **Use appropriate variant**: SystemStyle for app menus, PresentationStyle for contextual
   ```typescript
   <PopoverContent variant="SystemStyle">
   ```

3. **Handle selection**: Close popover after item click
   ```typescript
   <PopoverItem onClick={() => { setValue(item); setOpen(false) }}>
   ```

4. **Provide visual feedback**: Use active state for selected items
   ```typescript
   <PopoverItem active={selected === item}>
   ```

5. **Use overlay blur sparingly**: Only for critical actions
   ```typescript
   <PopoverContent overlayBlur={true}> {/* Only when needed */}
   ```

6. **Limit item count**: Keep lists manageable or add search
7. **Use icons consistently**: All items with icons or none

## Related Components

- [DropdownMenu](./dropdown-menu.md) - Menu-specific popover variant
- [Tooltip](./tooltip.md) - Simple hover text
- [Select](./select.md) - Form select field
- [ProfileMenu](./profile-menu.md) - User profile popover
