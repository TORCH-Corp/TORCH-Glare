---
title: Tooltip
description: Contextual tooltip component for displaying helpful information on hover or focus
group: Overlays & Dialogs
keywords: [tooltip, hint, popover, radix-ui, hover, help]
---

# Tooltip

> A contextual tooltip component that displays helpful information when users hover over or focus on an element. Features positioning control, delay customization, and optional arrow indicator.

## Installation

```bash
npm install @radix-ui/react-tooltip
```

## Import

```typescript
import { Tooltip } from '@torch-ui/components'
// Or for advanced usage:
import { TooltipProvider, ToolTipRoot, TooltipTrigger, TooltipContent, TooltipArrow } from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { Tooltip } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function Example() {
  return (
    <Tooltip text="Click to save your changes">
      <Button>Save</Button>
    </Tooltip>
  )
}
```

### Icon with Tooltip

```typescript
import { Tooltip } from '@torch-ui/components'
import { ActionButton } from '@torch-ui/components'

function IconTooltip() {
  return (
    <Tooltip text="Delete item">
      <ActionButton size="XS">
        <i className="ri-delete-bin-line" />
      </ActionButton>
    </Tooltip>
  )
}
```

### Different Positions

```typescript
import { Tooltip } from '@torch-ui/components'

function PositionedTooltips() {
  return (
    <div className="flex gap-4">
      <Tooltip text="Top tooltip" toolTipSide="top">
        <button>Top</button>
      </Tooltip>

      <Tooltip text="Right tooltip" toolTipSide="right">
        <button>Right</button>
      </Tooltip>

      <Tooltip text="Bottom tooltip" toolTipSide="bottom">
        <button>Bottom</button>
      </Tooltip>

      <Tooltip text="Left tooltip" toolTipSide="left">
        <button>Left</button>
      </Tooltip>
    </div>
  )
}
```

### Highlight Variant

```typescript
import { Tooltip } from '@torch-ui/components'

function HighlightTooltip() {
  return (
    <Tooltip
      text="This is important information!"
      variant="highlight"
    >
      <button>Hover me</button>
    </Tooltip>
  )
}
```

### Without Arrow

```typescript
import { Tooltip } from '@torch-ui/components'

function NoArrowTooltip() {
  return (
    <Tooltip text="No arrow tooltip" tip={false}>
      <button>No Arrow</button>
    </Tooltip>
  )
}
```

### Custom Delay

```typescript
import { Tooltip } from '@torch-ui/components'

function CustomDelayTooltip() {
  return (
    <Tooltip
      text="This appears quickly"
      delay={100} // Show after 100ms
    >
      <button>Quick Tooltip</button>
    </Tooltip>
  )
}
```

### Rich Content Tooltip

```typescript
import { Tooltip } from '@torch-ui/components'

function RichTooltip() {
  return (
    <Tooltip
      text={
        <div className="space-y-1">
          <p className="font-semibold">Keyboard Shortcut</p>
          <p className="text-xs">Press Ctrl+S to save</p>
        </div>
      }
    >
      <button>Save</button>
    </Tooltip>
  )
}
```

### Controlled Tooltip

```typescript
import { Tooltip } from '@torch-ui/components'
import { useState } from 'react'

function ControlledTooltip() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(!open)}>Toggle Tooltip</button>
      <Tooltip
        text="Controlled tooltip"
        open={open}
        onOpenChange={setOpen}
      >
        <span>Target element</span>
      </Tooltip>
    </>
  )
}
```

### Disabled Tooltip

```typescript
import { Tooltip } from '@torch-ui/components'

function DisabledTooltip({ disabled }: { disabled: boolean }) {
  return (
    <Tooltip
      text="This tooltip is disabled"
      disabled={disabled}
    >
      <button>Hover me</button>
    </Tooltip>
  )
}
```

### Form Field Tooltip

```typescript
import { Tooltip } from '@torch-ui/components'
import { Input } from '@torch-ui/components'

function FormTooltip() {
  return (
    <div className="flex items-center gap-2">
      <Input placeholder="Enter username" />
      <Tooltip text="Username must be 3-20 characters, letters and numbers only">
        <i className="ri-information-line text-gray-500 cursor-help" />
      </Tooltip>
    </div>
  )
}
```

## API Reference

### Tooltip Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `ReactNode` | Required | Tooltip content |
| `children` | `ReactNode` | Required | Element to attach tooltip to |
| `variant` | `'primary' \| 'highlight'` | `'primary'` | Visual style variant |
| `toolTipSide` | `'top' \| 'right' \| 'bottom' \| 'left'` | - | Preferred side to display |
| `contentAlign` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment relative to trigger |
| `delay` | `number` | `400` | Delay before showing (ms) |
| `tip` | `boolean` | `true` | Show arrow indicator |
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when state changes |
| `disabled` | `boolean` | `false` | Disable tooltip |
| `avoidCollisions` | `boolean` | `true` | Adjust position to stay in viewport |
| `theme` | `'dark' \| 'light' \| 'default'` | `'dark'` | Theme variant |
| `className` | `string` | - | Additional CSS classes |

## TypeScript

### Full Type Definitions

```typescript
import { ReactNode } from 'react'

export enum ContentAlign {
  START = 'start',
  CENTER = 'center',
  END = 'end',
}

export type ToolTipSide = 'top' | 'right' | 'bottom' | 'left'

interface TooltipProps {
  text: ReactNode
  children: ReactNode
  variant?: 'primary' | 'highlight'
  toolTipSide?: ToolTipSide
  contentAlign?: ContentAlign | 'start' | 'center' | 'end'
  avoidCollisions?: boolean
  delay?: number
  tip?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  theme?: 'dark' | 'light' | 'default'
  className?: string
}

export const Tooltip: React.FC<TooltipProps>
```

## Variants

### Primary Variant
- Gray background
- Light text
- Subtle appearance
- Default variant

### Highlight Variant
- Gradient background (navy to blue)
- White text
- Eye-catching
- For important information

## Common Patterns

### Tooltip for Disabled Elements

```typescript
// Disabled elements don't trigger pointer events
// Wrap in a span to enable tooltip
<Tooltip text="This action is not available">
  <span className="inline-block">
    <Button disabled>Save</Button>
  </span>
</Tooltip>
```

### Conditional Tooltips

```typescript
function ConditionalTooltip({ showTooltip, children }) {
  if (!showTooltip) return children

  return (
    <Tooltip text="Additional information">
      {children}
    </Tooltip>
  )
}
```

### Multi-Line Tooltips

```typescript
<Tooltip
  text={
    <>
      <div>Line 1: Description</div>
      <div>Line 2: More details</div>
      <div>Line 3: Extra info</div>
    </>
  }
>
  <button>Hover for details</button>
</Tooltip>
```

## Testing

### Unit Test Example

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from '@torch-ui/components'

describe('Tooltip', () => {
  it('shows tooltip on hover', async () => {
    render(
      <Tooltip text="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    )

    await userEvent.hover(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText('Tooltip content')).toBeInTheDocument()
    })
  })

  it('respects delay prop', async () => {
    jest.useFakeTimers()

    render(
      <Tooltip text="Delayed" delay={1000}>
        <button>Hover</button>
      </Tooltip>
    )

    await userEvent.hover(screen.getByRole('button'))

    // Not visible immediately
    expect(screen.queryByText('Delayed')).not.toBeInTheDocument()

    // Visible after delay
    jest.advanceTimersByTime(1000)
    await waitFor(() => {
      expect(screen.getByText('Delayed')).toBeInTheDocument()
    })

    jest.useRealTimers()
  })
})
```

## Accessibility

- **Keyboard Support**:
  - Focus trigger: Show tooltip
  - Blur trigger: Hide tooltip
  - Escape: Hide tooltip (when focused)
- **ARIA Attributes**:
  - `role="tooltip"` automatically applied
  - Tooltip linked to trigger via ARIA
- **Screen Readers**: Tooltip content announced when trigger is focused
- **Pointer/Touch**: Shows on hover/long-press

### Accessibility Best Practices

```typescript
// Ensure trigger is keyboard accessible
<Tooltip text="Help text">
  <button tabIndex={0}>Accessible Button</button>
</Tooltip>

// Don't hide critical information in tooltips
// (tooltips may not be accessible to all users)

// For icon-only buttons, always use aria-label
<Tooltip text="Delete item">
  <button aria-label="Delete item">
    <i className="ri-delete-bin-line" />
  </button>
</Tooltip>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~3kb |
| Bundle size (gzipped) | ~1.2kb |
| Dependencies | @radix-ui/react-tooltip (~8kb) |
| Show delay | Configurable (default 400ms) |
| Animation duration | ~200ms |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Use appropriate delay**: Balance UX with performance
   ```typescript
   <Tooltip delay={400}> {/* Default - good balance */}
   ```

2. **Avoid tooltips on rapidly changing elements**
3. **Keep content concise**: Large tooltips impact performance

## Migration from Other Libraries

### From Material-UI Tooltip

```diff
- import { Tooltip } from '@mui/material'
+ import { Tooltip } from '@torch-ui/components'

- <Tooltip title="Help text">
+ <Tooltip text="Help text">
    <button>Hover</button>
- </Tooltip>
+ </Tooltip>
```

### From Radix UI Tooltip

```diff
- import * as Tooltip from '@radix-ui/react-tooltip'
+ import { Tooltip } from '@torch-ui/components'

- <Tooltip.Provider>
-   <Tooltip.Root>
-     <Tooltip.Trigger>Hover</Tooltip.Trigger>
-     <Tooltip.Content>Text</Tooltip.Content>
-   </Tooltip.Root>
- </Tooltip.Provider>

+ <Tooltip text="Text">
+   <button>Hover</button>
+ </Tooltip>
```

## Best Practices

1. **Keep tooltips brief**: One or two short sentences max
   ```typescript
   <Tooltip text="Brief, helpful text">
   ```

2. **Don't repeat visible information**: Add context, don't duplicate
   ```typescript
   // Good
   <Tooltip text="Ctrl+S"><button>Save</button></Tooltip>

   // Avoid
   <Tooltip text="Save"><button>Save</button></Tooltip>
   ```

3. **Position appropriately**: Choose side based on layout
   ```typescript
   <Tooltip toolTipSide="top"> {/* For bottom elements */}
   ```

4. **Use highlight variant sparingly**: Reserve for important info
   ```typescript
   <Tooltip variant="highlight" text="Critical information">
   ```

5. **Don't nest interactive elements**: Tooltips should contain text only
   ```typescript
   // Avoid
   <Tooltip text={<button>Click</button>}>
   ```

6. **Test on touch devices**: Ensure long-press works
7. **Provide alternative access**: Don't hide critical info in tooltips

## Related Components

- [Popover](./popover.md) - For interactive content
- [DropdownMenu](./dropdown-menu.md) - For menus and actions
- [Dialog](./dialog.md) - For complex interactions
