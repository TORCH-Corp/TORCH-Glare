---
title: ActionButton
description: Icon-only action button component for toolbar actions, inline operations, and compact interfaces.
component: true
group: Buttons & Actions
keywords: [button, action, icon, toolbar, compact, small]
---

# ActionButton

A compact icon-only button component designed for toolbars, action bars, and inline operations. Built on top of the Button component with predefined square dimensions.

## Installation

```bash
npx torch-cli add action-button
```

## Imports

```typescript
import { ActionButton } from '@/components/ActionButton'
```

## Basic Usage

```tsx
import { ActionButton } from '@/components/ActionButton'

export function BasicActionButton() {
  return (
    <ActionButton size="M">
      <i className="ri-add-circle-fill"></i>
    </ActionButton>
  )
}
```

## Examples

### All Sizes

ActionButton comes in three sizes: XS, S, and M.

```tsx
export function ActionButtonSizes() {
  return (
    <div className="flex items-center gap-4">
      <ActionButton size="XS" aria-label="Add item">
        <i className="ri-add-line"></i>
      </ActionButton>

      <ActionButton size="S" aria-label="Edit item">
        <i className="ri-pencil-line"></i>
      </ActionButton>

      <ActionButton size="M" aria-label="Delete item">
        <i className="ri-delete-bin-line"></i>
      </ActionButton>
    </div>
  )
}
```

### Toolbar Actions

Common toolbar implementation with ActionButtons.

```tsx
export function Toolbar() {
  return (
    <div className="flex items-center gap-2 p-2 border border-border-system-global-primary rounded-lg">
      <ActionButton size="S" variant="PrimeStyle">
        <i className="ri-save-line"></i>
      </ActionButton>

      <ActionButton size="S" variant="SecStyle">
        <i className="ri-file-copy-line"></i>
      </ActionButton>

      <ActionButton size="S" variant="SecStyle">
        <i className="ri-scissors-line"></i>
      </ActionButton>

      <ActionButton size="S" variant="SecStyle">
        <i className="ri-clipboard-line"></i>
      </ActionButton>

      <div className="w-px h-6 bg-border-system-global-primary mx-1" />

      <ActionButton size="S" variant="SecStyle">
        <i className="ri-arrow-go-back-line"></i>
      </ActionButton>

      <ActionButton size="S" variant="SecStyle">
        <i className="ri-arrow-go-forward-line"></i>
      </ActionButton>
    </div>
  )
}
```

### Table Row Actions

Inline actions within table rows.

```tsx
export function TableRowActions({ row }) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <td className="flex items-center gap-1 justify-end">
      <ActionButton
        size="XS"
        variant="SecStyle"
        onClick={() => setIsEditing(true)}
        aria-label="Edit row"
      >
        <i className="ri-pencil-line"></i>
      </ActionButton>

      <ActionButton
        size="XS"
        variant="SecStyle"
        onClick={() => handleDuplicate(row.id)}
        aria-label="Duplicate row"
      >
        <i className="ri-file-copy-line"></i>
      </ActionButton>

      <ActionButton
        size="XS"
        variant="DangerStyle"
        onClick={() => handleDelete(row.id)}
        aria-label="Delete row"
      >
        <i className="ri-delete-bin-line"></i>
      </ActionButton>
    </td>
  )
}
```

### Card Actions

Action buttons in card headers.

```tsx
export function CardWithActions() {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border border-border-system-global-primary rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Card Title</h3>

        <div className="flex items-center gap-1">
          <ActionButton
            size="S"
            variant={isFavorite ? "YelSecStyle" : "SecStyle"}
            onClick={() => setIsFavorite(!isFavorite)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <i className={isFavorite ? "ri-star-fill" : "ri-star-line"}></i>
          </ActionButton>

          <ActionButton
            size="S"
            variant="SecStyle"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <i className={`ri-arrow-${isExpanded ? 'up' : 'down'}-s-line`}></i>
          </ActionButton>

          <ActionButton
            size="S"
            variant="SecStyle"
            aria-label="More options"
          >
            <i className="ri-more-2-fill"></i>
          </ActionButton>
        </div>
      </div>

      {/* Card content */}
    </div>
  )
}
```

### Loading State

ActionButton with loading indicator.

```tsx
export function LoadingActionButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleAction = async () => {
    setIsLoading(true)
    await performAction()
    setIsLoading(false)
  }

  return (
    <ActionButton
      size="M"
      variant="PrimeStyle"
      onClick={handleAction}
      disabled={isLoading}
      is_loading={isLoading}
      aria-label="Save changes"
    >
      {isLoading ? (
        <i className="ri-loader-4-line animate-spin"></i>
      ) : (
        <i className="ri-save-line"></i>
      )}
    </ActionButton>
  )
}
```

### Floating Action Button (FAB)

Mobile-style floating action button.

```tsx
export function FloatingActionButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <ActionButton
        size="M"
        variant="PrimeStyle"
        className="shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Create new item"
      >
        <i className="ri-add-line text-xl"></i>
      </ActionButton>
    </div>
  )
}
```

### Action Groups

Grouped actions with separators.

```tsx
export function ActionButtonGroup() {
  const [activeView, setActiveView] = useState('grid')

  return (
    <div className="inline-flex items-center border border-border-system-global-primary rounded-lg overflow-hidden">
      <ActionButton
        size="S"
        variant={activeView === 'list' ? "PrimeStyle" : "SecStyle"}
        onClick={() => setActiveView('list')}
        className="rounded-none border-0"
        aria-label="List view"
      >
        <i className="ri-list-unordered"></i>
      </ActionButton>

      <ActionButton
        size="S"
        variant={activeView === 'grid' ? "PrimeStyle" : "SecStyle"}
        onClick={() => setActiveView('grid')}
        className="rounded-none border-0 border-l border-border-system-global-primary"
        aria-label="Grid view"
      >
        <i className="ri-grid-fill"></i>
      </ActionButton>

      <ActionButton
        size="S"
        variant={activeView === 'kanban' ? "PrimeStyle" : "SecStyle"}
        onClick={() => setActiveView('kanban')}
        className="rounded-none border-0 border-l border-border-system-global-primary"
        aria-label="Kanban view"
      >
        <i className="ri-layout-column-fill"></i>
      </ActionButton>
    </div>
  )
}
```

### With Tooltips

ActionButtons with informative tooltips.

```tsx
import { Tooltip } from '@/components/Tooltip'

export function ActionButtonsWithTooltips() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip content="Bold (Ctrl+B)">
        <ActionButton size="S" variant="SecStyle">
          <i className="ri-bold"></i>
        </ActionButton>
      </Tooltip>

      <Tooltip content="Italic (Ctrl+I)">
        <ActionButton size="S" variant="SecStyle">
          <i className="ri-italic"></i>
        </ActionButton>
      </Tooltip>

      <Tooltip content="Underline (Ctrl+U)">
        <ActionButton size="S" variant="SecStyle">
          <i className="ri-underline"></i>
        </ActionButton>
      </Tooltip>

      <Tooltip content="Strikethrough">
        <ActionButton size="S" variant="SecStyle">
          <i className="ri-strikethrough"></i>
        </ActionButton>
      </Tooltip>
    </div>
  )
}
```

## API Reference

### ActionButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | `'XS' \| 'S' \| 'M'` | `'M'` | Button size |
| variant | `ButtonVariant` | `'SecStyle'` | Visual style variant |
| is_loading | `boolean` | `false` | Loading state |
| disabled | `boolean` | `false` | Disabled state |
| theme | `Themes` | - | Theme override |
| asChild | `boolean` | `false` | Merge props with child |
| as | `React.ElementType` | `'button'` | Custom element type |
| className | `string` | - | Additional CSS classes |
| children | `ReactNode` | - | Icon content |
| onClick | `() => void` | - | Click handler |
| type | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type |

### Size Mapping

ActionButton sizes map to specific dimensions and Button component sizes:

| ActionButton Size | Dimensions | Button Size | Icon Size |
|-------------------|------------|-------------|-----------|
| XS | 18px × 18px | S | 12px |
| S | 22px × 22px | M | 12px |
| M | 32px × 32px | L | 18px |

### Available Variants

Inherits all variants from the Button component:

- `PrimeStyle` - Primary action style
- `SecStyle` - Secondary action style
- `DangerStyle` - Destructive actions
- `YelSecStyle` - Yellow secondary style
- `BlueSecStyle` - Blue secondary style
- `RedSecStyle` - Red secondary style
- `BorderStyle` - Border-only style
- `NoBorderNoFillStyle` - Minimal style

## Styling

### Base Styles

- **Square dimensions**: Equal width and height for perfect icon centering
- **Rounded corners**: 4px border radius
- **Icon-only design**: Optimized padding for icon display
- **Inherits Button styles**: All Button component styles and behaviors

### Custom Styling

```tsx
// Custom colored action buttons
<ActionButton
  size="M"
  className="bg-green-500 hover:bg-green-600 text-white"
>
  <i className="ri-check-line"></i>
</ActionButton>

// Circular action button
<ActionButton
  size="M"
  className="!rounded-full"
>
  <i className="ri-heart-line"></i>
</ActionButton>
```

## TypeScript Types

```typescript
interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'XS' | 'S' | 'M'
  variant?: ButtonVariant
  is_loading?: boolean
  disabled?: boolean
  theme?: Themes
  asChild?: boolean
  as?: React.ElementType
}

type ButtonVariant =
  | 'PrimeStyle'
  | 'SecStyle'
  | 'DangerStyle'
  | 'YelSecStyle'
  | 'BlueSecStyle'
  | 'RedSecStyle'
  | 'BorderStyle'
  | 'NoBorderNoFillStyle'
```

## Common Patterns

### Icon Button Bar

```tsx
function IconButtonBar({ onAction }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-background-system-body-secondary rounded-lg">
      {[
        { icon: 'ri-home-line', action: 'home' },
        { icon: 'ri-search-line', action: 'search' },
        { icon: 'ri-notification-line', action: 'notifications' },
        { icon: 'ri-settings-line', action: 'settings' },
      ].map(item => (
        <ActionButton
          key={item.action}
          size="S"
          variant="SecStyle"
          onClick={() => onAction(item.action)}
        >
          <i className={item.icon}></i>
        </ActionButton>
      ))}
    </div>
  )
}
```

### Conditional Actions

```tsx
function ConditionalActions({ permissions, item }) {
  return (
    <div className="flex items-center gap-1">
      {permissions.canEdit && (
        <ActionButton size="XS" onClick={() => editItem(item.id)}>
          <i className="ri-pencil-line"></i>
        </ActionButton>
      )}

      {permissions.canShare && (
        <ActionButton size="XS" onClick={() => shareItem(item.id)}>
          <i className="ri-share-line"></i>
        </ActionButton>
      )}

      {permissions.canDelete && (
        <ActionButton
          size="XS"
          variant="DangerStyle"
          onClick={() => deleteItem(item.id)}
        >
          <i className="ri-delete-bin-line"></i>
        </ActionButton>
      )}
    </div>
  )
}
```

## Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ActionButton } from '@/components/ActionButton'

describe('ActionButton', () => {
  it('renders with correct size', () => {
    render(
      <ActionButton size="S" aria-label="Test button">
        <i className="ri-add-line"></i>
      </ActionButton>
    )

    const button = screen.getByLabelText('Test button')
    expect(button).toHaveClass('h-[22px]', 'w-[22px]')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(
      <ActionButton onClick={handleClick} aria-label="Test button">
        <i className="ri-add-line"></i>
      </ActionButton>
    )

    fireEvent.click(screen.getByLabelText('Test button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(
      <ActionButton is_loading={true} aria-label="Loading">
        <i className="ri-loader-line"></i>
      </ActionButton>
    )

    const button = screen.getByLabelText('Loading')
    expect(button).toBeInTheDocument()
  })

  it('applies disabled state', () => {
    render(
      <ActionButton disabled={true} aria-label="Disabled">
        <i className="ri-close-line"></i>
      </ActionButton>
    )

    const button = screen.getByLabelText('Disabled')
    expect(button).toBeDisabled()
  })
})
```

## Accessibility

- **ARIA Labels**: Always provide `aria-label` for icon-only buttons
- **Keyboard Navigation**: Full keyboard support with Tab and Enter/Space
- **Focus Indicators**: Clear focus states for keyboard navigation
- **Screen Reader Support**: Descriptive labels for all actions
- **Disabled State**: Properly communicates disabled state

### Accessibility Example

```tsx
<ActionButton
  size="M"
  variant="PrimeStyle"
  aria-label="Save document"
  aria-keyshortcuts="Ctrl+S"
  aria-describedby="save-tooltip"
>
  <i className="ri-save-line"></i>
</ActionButton>
<span id="save-tooltip" className="sr-only">
  Save the current document
</span>
```

## Performance

- **Optimized Rendering**: Uses Button component's optimized rendering
- **Event Delegation**: Efficient event handling
- **CSS Variables**: Theme changes without re-renders
- **Memoization Ready**: Can be wrapped in React.memo for lists

### Performance Tips

```tsx
// Memoized action button for lists
const MemoizedActionButton = React.memo(ActionButton)

// Use stable callbacks
const handleClick = useCallback((id) => {
  // Handle action
}, [])

// Render in list
items.map(item => (
  <MemoizedActionButton
    key={item.id}
    size="XS"
    onClick={() => handleClick(item.id)}
  >
    <i className="ri-edit-line"></i>
  </MemoizedActionButton>
))
```

## Migration Guide

### From Icon Buttons

```tsx
// Before: Custom icon button
<button className="w-8 h-8 flex items-center justify-center">
  <Icon name="add" />
</button>

// After: ActionButton
<ActionButton size="M">
  <i className="ri-add-line"></i>
</ActionButton>
```

### From Other Libraries

```tsx
// Before: Material-UI IconButton
<IconButton size="small" color="primary">
  <AddIcon />
</IconButton>

// After: ActionButton
<ActionButton size="S" variant="PrimeStyle">
  <i className="ri-add-line"></i>
</ActionButton>
```

## Best Practices

1. **Always Use ARIA Labels**: Icon-only buttons must have descriptive labels
2. **Group Related Actions**: Use visual grouping for related actions
3. **Consistent Sizing**: Use the same size for actions at the same hierarchy level
4. **Meaningful Icons**: Choose universally recognized icons
5. **Provide Tooltips**: Add tooltips for less common actions
6. **Loading Feedback**: Show loading state for async operations
7. **Keyboard Shortcuts**: Support keyboard shortcuts for frequent actions