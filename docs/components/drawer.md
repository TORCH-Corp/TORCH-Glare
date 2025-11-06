---
title: Drawer
description: Bottom sheet drawer component that slides up from the bottom of the screen for mobile-friendly interactions
group: Overlays & Dialogs
keywords: [drawer, bottom-sheet, slide-up, mobile, vaul, sheet]
---

# Drawer

> A bottom sheet drawer component that slides up from the bottom of the screen. Perfect for mobile-friendly actions, forms, and content that doesn't need a full modal. Built with Vaul for smooth, gesture-based interactions.

## Installation

```bash
npm install vaul
```

## Import

```typescript
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function Example() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
          <DrawerDescription>
            This is a drawer that slides up from the bottom.
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}
```

### With Form

```typescript
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerClose } from '@torch-ui/components'
import { Button, Input } from '@torch-ui/components'

function FormDrawer() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Add Comment</Button>
      </DrawerTrigger>
      <DrawerContent>
        <form onSubmit={handleSubmit}>
          <DrawerHeader>
            <DrawerTitle>Add a Comment</DrawerTitle>
            <DrawerDescription>
              Share your thoughts about this post.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-4">
            <Input placeholder="Your name" />
            <textarea
              placeholder="Your comment"
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>

          <DrawerFooter>
            <Button type="submit">Submit</Button>
            <DrawerClose asChild>
              <Button variant="SecondaryStyle">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
```

### Controlled State

```typescript
import { Drawer, DrawerContent, DrawerTitle } from '@torch-ui/components'
import { useState } from 'react'

function ControlledDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerTitle>Controlled Drawer</DrawerTitle>
          <button onClick={() => setOpen(false)}>Close</button>
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

### Action Sheet

```typescript
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function ActionSheet() {
  const handleShare = (platform: string) => {
    console.log('Sharing to', platform)
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Share</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Share this post</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-2">
          <DrawerClose asChild>
            <button
              onClick={() => handleShare('twitter')}
              className="w-full p-3 text-left hover:bg-gray-100 rounded"
            >
              <i className="ri-twitter-line mr-2" />
              Share on Twitter
            </button>
          </DrawerClose>
          <DrawerClose asChild>
            <button
              onClick={() => handleShare('facebook')}
              className="w-full p-3 text-left hover:bg-gray-100 rounded"
            >
              <i className="ri-facebook-line mr-2" />
              Share on Facebook
            </button>
          </DrawerClose>
          <DrawerClose asChild>
            <button
              onClick={() => handleShare('copy')}
              className="w-full p-3 text-left hover:bg-gray-100 rounded"
            >
              <i className="ri-link mr-2" />
              Copy Link
            </button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
```

### Product Details Drawer

```typescript
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@torch-ui/components'
import { Button, Badge } from '@torch-ui/components'

function ProductDrawer({ product }: { product: Product }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="w-full text-left p-4 border rounded hover:bg-gray-50">
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{product.name}</DrawerTitle>
          <DrawerDescription>
            <Badge variant="green" label={product.stock > 0 ? 'In Stock' : 'Out of Stock'} />
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4">
          <img src={product.image} alt={product.name} className="w-full rounded-lg mb-4" />
          <p className="text-2xl font-bold mb-2">${product.price}</p>
          <p className="text-gray-600">{product.description}</p>
        </div>

        <DrawerFooter>
          <Button className="w-full">Add to Cart</Button>
          <DrawerClose asChild>
            <Button variant="SecondaryStyle" className="w-full">
              Continue Shopping
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
```

### Filter Drawer

```typescript
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@torch-ui/components'
import { Button, Checkbox } from '@torch-ui/components'
import { useState } from 'react'

function FilterDrawer() {
  const [filters, setFilters] = useState({
    inStock: false,
    onSale: false,
    freeShipping: false,
  })

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          <i className="ri-filter-line mr-2" />
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Products</DrawerTitle>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={filters.inStock}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, inStock: !!checked })
              }
            />
            <span>In Stock Only</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={filters.onSale}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, onSale: !!checked })
              }
            />
            <span>On Sale</span>
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={filters.freeShipping}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, freeShipping: !!checked })
              }
            />
            <span>Free Shipping</span>
          </label>
        </div>

        <DrawerFooter>
          <Button>Apply Filters</Button>
          <DrawerClose asChild>
            <Button variant="SecondaryStyle">Reset</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
```

### Settings Drawer

```typescript
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@torch-ui/components'
import { Switch } from '@torch-ui/components'
import { useState } from 'react'

function SettingsDrawer() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoPlay: true,
  })

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button>
          <i className="ri-settings-line text-2xl" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
          <DrawerDescription>
            Manage your preferences
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, notifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, darkMode: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Auto-play Videos</span>
            <Switch
              checked={settings.autoPlay}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoPlay: checked })
              }
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
```

### Confirmation Drawer

```typescript
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function ConfirmationDrawer({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="DestructiveStyle">Delete Item</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Confirm Deletion</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete the item.
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="DestructiveStyle" onClick={onConfirm}>
              Yes, Delete
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="SecondaryStyle">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
```

### Scrollable Content

```typescript
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@torch-ui/components'
import { Button, ScrollArea } from '@torch-ui/components'

function ScrollableDrawer() {
  const items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`)

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>View List</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Long List</DrawerTitle>
        </DrawerHeader>

        <ScrollArea className="h-96">
          <div className="p-4 space-y-2">
            {items.map((item) => (
              <div key={item} className="p-2 border-b">
                {item}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DrawerFooter>
          <Button>Done</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
```

### Without Background Scale

```typescript
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle } from '@torch-ui/components'

function NoScaleDrawer() {
  return (
    <Drawer shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <button>Open (No Scale)</button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle>Drawer without background scaling</DrawerTitle>
        <p className="p-4">The background won't scale when this opens.</p>
      </DrawerContent>
    </Drawer>
  )
}
```

## API Reference

### Drawer (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `defaultOpen` | `boolean` | `false` | Uncontrolled default open state |
| `shouldScaleBackground` | `boolean` | `true` | Whether to scale and blur background |
| `modal` | `boolean` | `true` | Whether to render as modal |

### DrawerTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render trigger as child element |

### DrawerContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `onPointerDownOutside` | `(event) => void` | - | Callback when clicking outside |
| `onEscapeKeyDown` | `(event) => void` | - | Callback when Escape is pressed |

### DrawerHeader, DrawerFooter

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### DrawerTitle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### DrawerDescription

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### DrawerClose

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Render close trigger as child |

## TypeScript

### Full Type Definitions

```typescript
import { Drawer as DrawerPrimitive } from 'vaul'

// Root component
interface DrawerProps extends React.ComponentProps<typeof DrawerPrimitive.Root> {
  shouldScaleBackground?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  modal?: boolean
  children: React.ReactNode
}

export const Drawer: React.FC<DrawerProps>

// Compound components
export const DrawerTrigger: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Trigger>
>

export const DrawerContent: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>

export const DrawerHeader: React.FC<React.HTMLAttributes<HTMLDivElement>>
export const DrawerFooter: React.FC<React.HTMLAttributes<HTMLDivElement>>
export const DrawerTitle: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>
export const DrawerDescription: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>
export const DrawerClose: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Close>
>
```

## Common Patterns

### useDrawer Hook

```typescript
import { useState } from 'react'

function useDrawer() {
  const [open, setOpen] = useState(false)

  const openDrawer = () => setOpen(true)
  const closeDrawer = () => setOpen(false)
  const toggleDrawer = () => setOpen(!open)

  return {
    open,
    setOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  }
}

// Usage
function App() {
  const drawer = useDrawer()

  return (
    <>
      <button onClick={drawer.openDrawer}>Open</button>
      <Drawer open={drawer.open} onOpenChange={drawer.setOpen}>
        <DrawerContent>Content</DrawerContent>
      </Drawer>
    </>
  )
}
```

## Gesture Features

### Drag to Close
- Users can drag the drawer down to close it
- Smooth spring animation follows finger/pointer
- Automatic threshold detection for close vs. snap-back

### Snap Points (Advanced)
```typescript
// Vaul supports snap points for partial drawer heights
<Drawer snapPoints={[0.5, 1]} activeSnapPoint={1}>
  <DrawerContent>Content</DrawerContent>
</Drawer>
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle } from '@torch-ui/components'

describe('Drawer', () => {
  it('opens when trigger is clicked', () => {
    render(
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Test Drawer</DrawerTitle>
        </DrawerContent>
      </Drawer>
    )

    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Test Drawer')).toBeInTheDocument()
  })

  it('closes on close button click', () => {
    render(
      <Drawer defaultOpen>
        <DrawerContent>
          <DrawerTitle>Test</DrawerTitle>
          <DrawerClose>Close</DrawerClose>
        </DrawerContent>
      </Drawer>
    )

    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByText('Test')).not.toBeInTheDocument()
  })

  it('handles controlled state', () => {
    const handleChange = jest.fn()

    render(
      <Drawer onOpenChange={handleChange}>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>Content</DrawerContent>
      </Drawer>
    )

    fireEvent.click(screen.getByText('Open'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })
})
```

## Accessibility

- **Keyboard Support**:
  - Escape: Close drawer
  - Tab: Navigate focusable elements
  - Shift+Tab: Navigate backwards
- **ARIA Attributes**:
  - `role="dialog"` automatically applied
  - `aria-labelledby` links to title
  - `aria-describedby` links to description
- **Focus Management**:
  - Focus trapped within drawer when open
  - Focus returned to trigger on close
- **Touch/Pointer**: Gesture-based closing with drag down

### Accessibility Best Practices

```typescript
// Always provide a title
<DrawerContent>
  <DrawerTitle>Drawer Title</DrawerTitle> {/* Required */}
  <DrawerDescription>Description</DrawerDescription>
</DrawerContent>

// Ensure close affordance
<DrawerClose asChild>
  <Button aria-label="Close drawer">Close</Button>
</DrawerClose>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~6kb |
| Bundle size (gzipped) | ~2.5kb |
| Dependencies | vaul (~8kb) |
| Animation | Hardware accelerated |
| Gesture latency | <16ms (60fps) |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Lazy load content**: Render content only when open
   ```typescript
   {open && <DrawerContent>{/* Heavy content */}</DrawerContent>}
   ```

2. **Use CSS transforms**: Already optimized by Vaul
3. **Avoid heavy renders**: Memoize drawer content
   ```typescript
   const DrawerBody = useMemo(() => <HeavyComponent />, [deps])
   ```

## Migration from Dialog

```diff
- import { Dialog, DialogTrigger, DialogContent } from '@torch-ui/components'
+ import { Drawer, DrawerTrigger, DrawerContent } from '@torch-ui/components'

- <Dialog>
-   <DialogTrigger>Open</DialogTrigger>
-   <DialogContent>Content</DialogContent>
- </Dialog>

+ <Drawer>
+   <DrawerTrigger>Open</DrawerTrigger>
+   <DrawerContent>Content</DrawerContent>
+ </Drawer>
```

## Best Practices

1. **Use on mobile/tablet**: Drawer is better than dialog on touch devices
   ```typescript
   const isMobile = useMediaQuery('(max-width: 768px)')
   return isMobile ? <Drawer /> : <Dialog />
   ```

2. **Keep height reasonable**: Don't make drawers full-screen height
   ```typescript
   <DrawerContent className="max-h-[80vh]">
   ```

3. **Provide visual drag handle**: Built-in drag indicator included
   ```typescript
   // Automatic drag handle bar rendered at top
   ```

4. **Use for actions and forms**: Perfect for quick interactions
   ```typescript
   // Good: Share sheet, filters, settings
   // Avoid: Long articles, complex wizards
   ```

5. **Handle background scroll**: Automatically prevents scroll
   ```typescript
   // Background scroll blocked when drawer is open
   ```

6. **Test gesture interactions**: Ensure drag-to-close works smoothly
   ```typescript
   // Test on actual touch devices
   ```

7. **Provide close button**: Don't rely solely on gesture
   ```typescript
   <DrawerClose asChild>
     <Button>Done</Button>
   </DrawerClose>
   ```

## Related Components

- [Dialog](./dialog.md) - Desktop-oriented modal alternative
- [AlertDialog](./alert-dialog.md) - For confirmations
- [Popover](./popover.md) - Smaller contextual overlays
