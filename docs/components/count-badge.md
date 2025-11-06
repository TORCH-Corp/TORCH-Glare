---
title: CountBadge
description: Small circular notification counter for displaying numeric counts and alerts.
component: true
group: Data Display
keywords: [badge, counter, notification, count, number, indicator, alert]
---

# CountBadge

A compact circular badge component designed specifically for displaying numeric counts. Perfect for notification indicators, unread counts, and numeric alerts.

## Installation

```bash
npx torch-cli add count-badge
```

## Imports

```typescript
import { CountBadge } from '@/components/CountBadge'
import { glareCounterStyles } from '@/components/CountBadge'
```

## Basic Usage

```tsx
import { CountBadge } from '@/components/CountBadge'

export function BasicCountBadge() {
  return <CountBadge label={5} />
}
```

## Examples

### Notification Indicators

Display unread counts on navigation items.

```tsx
export function NotificationCounts() {
  return (
    <nav className="flex gap-4">
      <button className="relative px-4 py-2 hover:bg-background-presentation-global-secondary rounded">
        <i className="ri-message-3-line text-xl"></i>
        <CountBadge label={3} className="absolute -top-1 -right-1" />
      </button>

      <button className="relative px-4 py-2 hover:bg-background-presentation-global-secondary rounded">
        <i className="ri-notification-3-line text-xl"></i>
        <CountBadge label={12} className="absolute -top-1 -right-1" />
      </button>

      <button className="relative px-4 py-2 hover:bg-background-presentation-global-secondary rounded">
        <i className="ri-mail-line text-xl"></i>
        <CountBadge label={99} className="absolute -top-1 -right-1" />
      </button>

      <button className="relative px-4 py-2 hover:bg-background-presentation-global-secondary rounded">
        <i className="ri-shopping-cart-line text-xl"></i>
        <CountBadge label={7} className="absolute -top-1 -right-1" />
      </button>
    </nav>
  )
}
```

### Sidebar with Counts

Navigation sidebar with count indicators.

```tsx
export function SidebarWithCounts() {
  const menuItems = [
    { icon: 'ri-dashboard-line', label: 'Dashboard', count: 0 },
    { icon: 'ri-inbox-line', label: 'Inbox', count: 24 },
    { icon: 'ri-task-line', label: 'Tasks', count: 8 },
    { icon: 'ri-team-line', label: 'Team', count: 3 },
    { icon: 'ri-folder-line', label: 'Projects', count: 0 },
  ]

  return (
    <aside className="w-64 border-r p-4">
      <nav className="space-y-1">
        {menuItems.map(item => (
          <button
            key={item.label}
            className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-background-presentation-global-secondary"
          >
            <div className="flex items-center gap-3">
              <i className={`${item.icon} text-lg`}></i>
              <span>{item.label}</span>
            </div>
            {item.count > 0 && <CountBadge label={item.count} />}
          </button>
        ))}
      </nav>
    </aside>
  )
}
```

### Tab Navigation

Tabs with activity counts.

```tsx
export function TabsWithCounts() {
  const [activeTab, setActiveTab] = useState('all')

  const tabs = [
    { id: 'all', label: 'All Items', count: 42 },
    { id: 'active', label: 'Active', count: 15 },
    { id: 'pending', label: 'Pending Review', count: 8 },
    { id: 'completed', label: 'Completed', count: 19 },
  ]

  return (
    <div className="border-b">
      <nav className="flex gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 border-b-2 transition-colors relative",
              activeTab === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent hover:border-gray-300"
            )}
          >
            <span className="mr-2">{tab.label}</span>
            <CountBadge label={tab.count} className="inline-block" />
          </button>
        ))}
      </nav>
    </div>
  )
}
```

### Icon Buttons

Action buttons with pending counts.

```tsx
export function IconButtonsWithCounts() {
  return (
    <div className="flex items-center gap-2 p-4 bg-background-system-body-secondary rounded-lg">
      <div className="relative">
        <ActionButton size="M" title="Notifications">
          <i className="ri-notification-line"></i>
        </ActionButton>
        <CountBadge label={5} className="absolute -top-1 -right-1" />
      </div>

      <div className="relative">
        <ActionButton size="M" title="Messages">
          <i className="ri-message-line"></i>
        </ActionButton>
        <CountBadge label={12} className="absolute -top-1 -right-1" />
      </div>

      <div className="relative">
        <ActionButton size="M" title="Pending Approvals">
          <i className="ri-check-double-line"></i>
        </ActionButton>
        <CountBadge label={3} className="absolute -top-1 -right-1" />
      </div>
    </div>
  )
}
```

### Avatar with Count

User avatar showing unread count.

```tsx
export function AvatarWithCount() {
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar size="L" src="/user.jpg" alt="User" />
        <CountBadge label={9} className="absolute -top-1 -right-1" />
      </div>

      <div>
        <h4 className="font-semibold">John Doe</h4>
        <p className="text-sm text-content-presentation-global-secondary">
          9 unread messages
        </p>
      </div>
    </div>
  )
}
```

### Large Numbers

Handling counts over 99.

```tsx
export function LargeNumberCounts() {
  const formatCount = (count: number) => {
    if (count > 99) return '99+'
    return count
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span>Normal count:</span>
        <CountBadge label={45} />
      </div>

      <div className="flex items-center gap-4">
        <span>Max display (99+):</span>
        <div className="relative">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Notifications
          </button>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            99+
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span>With abbreviation:</span>
        <div className="relative">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Followers
          </button>
          <div className="absolute -top-2 -right-2 px-2 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
            1.2k
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Shopping Cart

E-commerce cart with item count.

```tsx
export function ShoppingCartCount() {
  const [cartItems, setCartItems] = useState(3)

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="text-2xl font-bold">Store</div>

      <nav className="flex items-center gap-6">
        <a href="/shop" className="hover:text-blue-500">Shop</a>
        <a href="/about" className="hover:text-blue-500">About</a>

        <button className="relative">
          <i className="ri-shopping-cart-line text-2xl"></i>
          {cartItems > 0 && (
            <CountBadge label={cartItems} className="absolute -top-2 -right-2" />
          )}
        </button>
      </nav>
    </header>
  )
}
```

### Filter Tags

Filter options with match counts.

```tsx
export function FilterWithCounts() {
  const filters = [
    { label: 'All', count: 156 },
    { label: 'Active', count: 89 },
    { label: 'Pending', count: 45 },
    { label: 'Archived', count: 22 },
  ]

  const [selected, setSelected] = useState('All')

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Filter Results</h3>

      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.label}
            onClick={() => setSelected(filter.label)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors",
              selected === filter.label
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-background-system-body-primary border-border-presentation-global-primary hover:border-blue-300"
            )}
          >
            <span>{filter.label}</span>
            <CountBadge
              label={filter.count}
              className={selected === filter.label ? "bg-blue-600" : ""}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
```

### Real-time Updates

Live count updates with animation.

```tsx
export function LiveCountUpdates() {
  const [count, setCount] = useState(5)
  const [isAnimating, setIsAnimating] = useState(false)

  const increment = () => {
    setCount(prev => prev + 1)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <div className="space-y-4">
      <div className="relative inline-block">
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg">
          Notifications
        </button>
        <CountBadge
          label={count}
          className={cn(
            "absolute -top-2 -right-2 transition-transform",
            isAnimating && "scale-125"
          )}
        />
      </div>

      <button
        onClick={increment}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Simulate New Notification
      </button>
    </div>
  )
}
```

## API Reference

### CountBadge Props

Extends all HTML div element props.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | `number` | - | **Required.** Numeric count to display |
| variant | `'default'` | `'default'` | Style variant |
| theme | `Themes` | - | Theme override |
| className | `string` | - | Additional CSS classes |

## Styling

### Default Styles

- **Size**: 15px × 15px circular
- **Background**: Negative/alert red color
- **Border**: 1px white/system border
- **Text**: White, 8px font size
- **Position**: Can be absolutely positioned

### Positioning

```tsx
// Top-right corner
<CountBadge className="absolute -top-1 -right-1" />

// Top-left corner
<CountBadge className="absolute -top-1 -left-1" />

// Inline with text
<CountBadge className="inline-block ml-2" />
```

### Custom Colors

```tsx
// Green success count
<CountBadge label={5} className="!bg-green-500" />

// Blue info count
<CountBadge label={12} className="!bg-blue-500" />

// Orange warning count
<CountBadge label={3} className="!bg-orange-500" />
```

## TypeScript Types

```typescript
import { VariantProps } from 'class-variance-authority'

interface CountBadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glareCounterStyles> {
  label: number
  theme?: Themes
  className?: string
}

type GlareCounterStylesProps = VariantProps<typeof glareCounterStyles>
```

## Common Patterns

### Conditional Display

```tsx
function ConditionalCount({ count }) {
  return (
    <div className="relative">
      <button>Inbox</button>
      {count > 0 && (
        <CountBadge label={count} className="absolute -top-1 -right-1" />
      )}
    </div>
  )
}
```

### Max Count Display

```tsx
function MaxCountBadge({ count, max = 99 }) {
  const displayCount = count > max ? max : count

  return (
    <div className="relative">
      <button>Notifications</button>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 px-1.5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
          {count > max ? `${max}+` : count}
        </span>
      )}
    </div>
  )
}
```

## Testing

```typescript
import { render, screen } from '@testing-library/react'
import { CountBadge } from '@/components/CountBadge'

describe('CountBadge', () => {
  it('renders count correctly', () => {
    render(<CountBadge label={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <CountBadge label={10} className="custom-class" />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('displays large numbers', () => {
    render(<CountBadge label={999} />)
    expect(screen.getByText('999')).toBeInTheDocument()
  })

  it('applies default variant styles', () => {
    const { container } = render(<CountBadge label={1} />)
    expect(container.firstChild).toHaveClass('bg-background-system-state-negative')
  })
})
```

## Accessibility

- **Color Independence**: Uses both color and number
- **Screen Readers**: Count is announced
- **High Contrast**: Red background with white text
- **Size**: Large enough for visibility (15px)
- **Context**: Should always be near related element

### Accessibility Example

```tsx
<button aria-label={`Notifications (${count} unread)`}>
  <i className="ri-notification-line"></i>
  <CountBadge label={count} />
</button>
```

## Performance

- **Lightweight**: Minimal DOM footprint
- **CSS-Only**: No JavaScript animations by default
- **Bundle Size**: < 0.5 KB gzipped
- **Render Performance**: < 0.1ms per badge

## Migration Guide

### From Custom Spans

```tsx
// Before: Custom counter
<span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
  {count}
</span>

// After: CountBadge
<CountBadge label={count} className="absolute -top-1 -right-1" />
```

### From Other Libraries

```tsx
// Before: Material-UI Badge
<Badge badgeContent={4} color="error">
  <Icon />
</Badge>

// After: CountBadge
<div className="relative">
  <Icon />
  <CountBadge label={4} className="absolute -top-1 -right-1" />
</div>
```

## Best Practices

1. **Use for Numbers Only**: CountBadge is designed for numeric counts
2. **Positioning**: Use absolute positioning for overlay effect
3. **Max Counts**: Display "99+" for counts over 99
4. **Conditional Rendering**: Hide when count is 0
5. **Animation**: Add scale animation for real-time updates
6. **Accessibility**: Include count in parent element's aria-label
7. **Color Meaning**: Red typically indicates urgent/unread items
8. **Size Context**: Ensure badge is visible but not overwhelming