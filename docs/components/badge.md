---
title: Badge
description: Colorful status indicator and label component with multiple variants and optional removable functionality.
component: true
group: Data Display
keywords: [badge, tag, label, status, chip, pill, indicator]
---

# Badge

A versatile badge component for displaying status, categories, tags, and labels. Features 12 color variants, three sizes, and optional remove functionality for tag-like behavior.

## Installation

```bash
npx torch-cli add badge
```

## Imports

```typescript
import { Badge } from '@/components/Badge'
import { badgeBase } from '@/components/Badge'
```

## Basic Usage

```tsx
import { Badge } from '@/components/Badge'

export function BasicBadge() {
  return <Badge label="Active" variant="green" size="S" />
}
```

## Examples

### All Variants

Badge offers 12 distinct color variants for different use cases.

```tsx
export function BadgeVariants() {
  const variants = [
    { variant: 'highlight', label: 'Highlight', description: 'Neutral gray highlight' },
    { variant: 'green', label: 'Success', description: 'Positive states' },
    { variant: 'greenLight', label: 'Active', description: 'Light green' },
    { variant: 'cocktailGreen', label: 'New', description: 'Bright green' },
    { variant: 'yellow', label: 'Warning', description: 'Caution states' },
    { variant: 'redOrange', label: 'Alert', description: 'Attention needed' },
    { variant: 'redLight', label: 'Error', description: 'Error states' },
    { variant: 'rose', label: 'Critical', description: 'Critical issues' },
    { variant: 'purple', label: 'Feature', description: 'Special features' },
    { variant: 'bluePurple', label: 'Beta', description: 'Beta features' },
    { variant: 'blue', label: 'Info', description: 'Informational' },
    { variant: 'navy', label: 'Default', description: 'Standard' },
    { variant: 'gray', label: 'Inactive', description: 'Disabled/inactive' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {variants.map(({ variant, label, description }) => (
        <div key={variant} className="flex flex-col gap-2">
          <Badge label={label} variant={variant as any} />
          <span className="text-xs text-content-presentation-global-secondary">
            {description}
          </span>
        </div>
      ))}
    </div>
  )
}
```

### All Sizes

Three size options to match different contexts.

```tsx
export function BadgeSizes() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col gap-2 items-center">
        <Badge label="Extra Small" variant="blue" size="XS" />
        <span className="text-xs">XS (18px)</span>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <Badge label="Small" variant="blue" size="S" />
        <span className="text-xs">S (22px)</span>
      </div>

      <div className="flex flex-col gap-2 items-center">
        <Badge label="Medium" variant="blue" size="M" />
        <span className="text-xs">M (26px)</span>
      </div>
    </div>
  )
}
```

### Status Indicators

Use badges to show item status.

```tsx
export function StatusBadges() {
  const statuses = [
    { status: 'active', label: 'Active', variant: 'green' },
    { status: 'pending', label: 'Pending', variant: 'yellow' },
    { status: 'inactive', label: 'Inactive', variant: 'gray' },
    { status: 'error', label: 'Error', variant: 'redLight' },
  ]

  return (
    <div className="space-y-4">
      {statuses.map(({ status, label, variant }) => (
        <div key={status} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-semibold">Server {status}</h4>
            <p className="text-sm text-content-presentation-global-secondary">
              Last updated 5 minutes ago
            </p>
          </div>
          <Badge label={label} variant={variant as any} />
        </div>
      ))}
    </div>
  )
}
```

### Removable Tags

Interactive badges that can be removed.

```tsx
export function RemovableTags() {
  const [tags, setTags] = useState([
    { id: 1, label: 'React', variant: 'blue' },
    { id: 2, label: 'TypeScript', variant: 'bluePurple' },
    { id: 3, label: 'Next.js', variant: 'navy' },
    { id: 4, label: 'Tailwind', variant: 'cocktailGreen' },
  ])

  const removeTag = (id: number) => {
    setTags(tags.filter(tag => tag.id !== id))
  }

  return (
    <div>
      <h3 className="font-semibold mb-3">Selected Technologies</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Badge
            key={tag.id}
            label={tag.label}
            variant={tag.variant as any}
            isSelected
            onUnselect={() => removeTag(tag.id)}
          />
        ))}
      </div>
    </div>
  )
}
```

### With Custom Icons

Replace default dot with custom icons.

```tsx
export function BadgesWithIcons() {
  return (
    <div className="flex flex-wrap gap-3">
      <Badge
        label="Verified"
        variant="green"
        badgeIcon={<i className="ri-check-line text-sm"></i>}
      />

      <Badge
        label="Premium"
        variant="purple"
        badgeIcon={<i className="ri-vip-crown-line text-sm"></i>}
      />

      <Badge
        label="Locked"
        variant="gray"
        badgeIcon={<i className="ri-lock-line text-sm"></i>}
      />

      <Badge
        label="New"
        variant="cocktailGreen"
        badgeIcon={<i className="ri-star-fill text-sm"></i>}
      />

      <Badge
        label="Alert"
        variant="redOrange"
        badgeIcon={<i className="ri-alert-line text-sm"></i>}
      />
    </div>
  )
}
```

### User Roles

Badge system for user permissions.

```tsx
export function UserRoleBadges() {
  const users = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin', variant: 'purple' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', variant: 'blue' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', variant: 'gray' },
    { name: 'Alice Brown', email: 'alice@example.com', role: 'Owner', variant: 'green' },
  ]

  return (
    <div className="space-y-2">
      {users.map(user => (
        <div key={user.email} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-content-presentation-global-secondary">
                {user.email}
              </div>
            </div>
          </div>
          <Badge label={user.role} variant={user.variant as any} size="S" />
        </div>
      ))}
    </div>
  )
}
```

### Product Categories

Categorize items with color-coded badges.

```tsx
export function ProductCategories() {
  const products = [
    { name: 'MacBook Pro', category: 'Electronics', variant: 'blue', price: '$2,499' },
    { name: 'Office Chair', category: 'Furniture', variant: 'navy', price: '$299' },
    { name: 'Coffee Maker', category: 'Appliances', variant: 'greenLight', price: '$149' },
    { name: 'Desk Lamp', category: 'Lighting', variant: 'yellow', price: '$79' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map(product => (
        <div key={product.name} className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold">{product.name}</h4>
            <Badge label={product.category} variant={product.variant as any} size="XS" />
          </div>
          <div className="text-xl font-bold text-blue-600">{product.price}</div>
          <button className="mt-3 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  )
}
```

### Priority Levels

Visual priority indicators.

```tsx
export function PriorityBadges() {
  const tasks = [
    { id: 1, task: 'Fix critical bug', priority: 'Critical', variant: 'rose' },
    { id: 2, task: 'Update documentation', priority: 'High', variant: 'redOrange' },
    { id: 3, task: 'Review PR', priority: 'Medium', variant: 'yellow' },
    { id: 4, task: 'Refactor code', priority: 'Low', variant: 'gray' },
  ]

  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
          <input type="checkbox" className="w-4 h-4" />
          <span className="flex-1">{task.task}</span>
          <Badge label={task.priority} variant={task.variant as any} size="S" />
        </div>
      ))}
    </div>
  )
}
```

### Notification Counts

Combine with count indicators.

```tsx
export function NotificationBadges() {
  return (
    <nav className="flex gap-4">
      <button className="relative px-4 py-2 rounded hover:bg-background-presentation-global-secondary">
        Messages
        <Badge
          label="3"
          variant="redLight"
          size="XS"
          className="absolute -top-1 -right-1"
        />
      </button>

      <button className="relative px-4 py-2 rounded hover:bg-background-presentation-global-secondary">
        Notifications
        <Badge
          label="12"
          variant="blue"
          size="XS"
          className="absolute -top-1 -right-1"
        />
      </button>

      <button className="relative px-4 py-2 rounded hover:bg-background-presentation-global-secondary">
        Updates
        <Badge
          label="New"
          variant="cocktailGreen"
          size="XS"
          className="absolute -top-1 -right-1"
        />
      </button>
    </nav>
  )
}
```

### Highlight Badge

Special highlight variant without dot indicator.

```tsx
export function HighlightBadge() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span>Regular badges:</span>
        <Badge label="Green" variant="green" size="S" />
        <Badge label="Blue" variant="blue" size="S" />
      </div>

      <div className="flex items-center gap-2">
        <span>Highlight (no dot):</span>
        <Badge label="Neutral" variant="highlight" size="S" />
        <Badge label="Label" variant="highlight" size="S" />
      </div>
    </div>
  )
}
```

## API Reference

### Badge Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | `string` | - | Badge text content |
| variant | `BadgeVariant` | `'green'` | Color variant |
| size | `'XS' \| 'S' \| 'M'` | `'S'` | Badge size |
| badgeIcon | `ReactNode` | - | Custom icon (replaces dot) |
| isSelected | `boolean` | `false` | Shows remove button |
| onUnselect | `() => void` | - | Remove handler (requires isSelected) |
| theme | `Themes` | - | Theme override |
| className | `string` | - | Additional CSS classes |

### Variant Options

| Variant | Use Case | Color |
|---------|----------|-------|
| `highlight` | Neutral labels | Gray (no dot) |
| `green` | Success, active | Green |
| `greenLight` | Light success | Light green |
| `cocktailGreen` | New, special | Bright green |
| `yellow` | Warning, pending | Yellow |
| `redOrange` | Alerts | Red-orange |
| `redLight` | Errors | Light red |
| `rose` | Critical | Rose |
| `purple` | Premium, features | Purple |
| `bluePurple` | Beta | Blue-purple |
| `blue` | Info | Blue |
| `navy` | Default | Navy |
| `gray` | Inactive, disabled | Gray |

### Size Specifications

| Size | Height | Icon Size | Typography |
|------|--------|-----------|------------|
| XS | 18px | 12px | body-small-medium |
| S | 22px | 12px | body-small-medium |
| M | 26px | 16px | body-medium-medium |

## Styling

### Base Styles

- **Border**: 1px solid border matching variant
- **Border Radius**: 6px
- **Padding**: 6px horizontal, 3px for text
- **Cursor**: Pointer by default
- **Transition**: 300ms ease-in-out
- **Width**: Fit content

### Customization

```tsx
// Custom background
<Badge label="Custom" className="!bg-purple-500 !border-purple-600" />

// No cursor
<Badge label="Static" className="cursor-default" />

// Full width
<Badge label="Wide" className="w-full justify-center" />
```

## TypeScript Types

```typescript
import { VariantProps } from 'class-variance-authority'

type BadgeVariant =
  | 'highlight'
  | 'green'
  | 'greenLight'
  | 'cocktailGreen'
  | 'yellow'
  | 'redOrange'
  | 'redLight'
  | 'rose'
  | 'purple'
  | 'bluePurple'
  | 'blue'
  | 'navy'
  | 'gray'

interface BadgeProps extends HTMLAttributes<HTMLButtonElement>, VariantProps<typeof badgeBase> {
  label?: string
  onUnselect?: () => void
  isSelected?: boolean
  badgeIcon?: ReactNode
  className?: string
  theme?: Themes
}
```

## Common Patterns

### Dynamic Status

```tsx
function StatusBadge({ status }) {
  const variantMap = {
    active: 'green',
    pending: 'yellow',
    error: 'redLight',
    inactive: 'gray',
  }

  return (
    <Badge
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      variant={variantMap[status]}
    />
  )
}
```

### Badge List

```tsx
function BadgeList({ items, onRemove }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <Badge
          key={item.id}
          label={item.label}
          variant={item.variant}
          isSelected={!!onRemove}
          onUnselect={() => onRemove?.(item.id)}
        />
      ))}
    </div>
  )
}
```

## Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Badge } from '@/components/Badge'

describe('Badge', () => {
  it('renders label correctly', () => {
    render(<Badge label="Test Badge" />)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('applies correct variant class', () => {
    const { container } = render(<Badge label="Test" variant="blue" />)
    expect(container.firstChild).toHaveClass('border-border-presentation-badge-blue')
  })

  it('shows remove button when isSelected', () => {
    render(<Badge label="Test" isSelected />)
    expect(screen.getByRole('button', { name: 'Remove badge' })).toBeInTheDocument()
  })

  it('calls onUnselect when remove clicked', () => {
    const handleUnselect = jest.fn()
    render(<Badge label="Test" isSelected onUnselect={handleUnselect} />)

    fireEvent.click(screen.getByRole('button', { name: 'Remove badge' }))
    expect(handleUnselect).toHaveBeenCalledTimes(1)
  })

  it('renders custom icon', () => {
    render(
      <Badge
        label="Test"
        badgeIcon={<i className="ri-star-fill"></i>}
      />
    )

    expect(document.querySelector('.ri-star-fill')).toBeInTheDocument()
  })

  it('handles keyboard interaction on remove button', () => {
    const handleUnselect = jest.fn()
    render(<Badge label="Test" isSelected onUnselect={handleUnselect} />)

    const removeBtn = screen.getByRole('button', { name: 'Remove badge' })
    fireEvent.keyDown(removeBtn, { key: 'Enter' })
    expect(handleUnselect).toHaveBeenCalledTimes(1)
  })
})
```

## Accessibility

- **ARIA Labels**: Remove button has proper aria-label
- **Keyboard Support**: Enter and Space keys trigger removal
- **Focus Management**: Remove button is keyboard focusable
- **Screen Reader**: Badge content is announced
- **Color Independence**: Not relying solely on color (includes text)
- **Contrast**: All variants meet WCAG AA standards

## Performance

- **Lightweight**: < 1 KB per badge instance
- **CSS-Only Colors**: No JavaScript color calculations
- **Optimized Rendering**: Minimal DOM nodes
- **Bundle Size**: ~2 KB gzipped (including variants)

### Performance Tips

```tsx
// Memoize badge lists
const MemoizedBadge = React.memo(Badge)

// Use keys for lists
{tags.map(tag => (
  <MemoizedBadge key={tag.id} {...tag} />
))}
```

## Migration Guide

### From Custom Spans

```tsx
// Before: Custom badge
<span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
  Active
</span>

// After: Badge
<Badge label="Active" variant="green" size="S" />
```

### From Other Libraries

```tsx
// Before: Material-UI Chip
<Chip label="Active" color="success" size="small" onDelete={handleDelete} />

// After: Badge
<Badge label="Active" variant="green" size="S" isSelected onUnselect={handleDelete} />
```

## Best Practices

1. **Consistent Variants**: Use the same variant for the same meaning across your app
2. **Size Context**: Match badge size to surrounding content
3. **Accessibility**: Always provide meaningful labels
4. **Color Semantics**: Follow color conventions (green=success, red=error)
5. **Icon Usage**: Use icons sparingly for special emphasis
6. **Removable UX**: Only make badges removable when it makes sense
7. **Whitespace**: Don't overcrowd badges - allow breathing room
8. **Limit Variants**: Stick to 3-5 variants in a single view for clarity