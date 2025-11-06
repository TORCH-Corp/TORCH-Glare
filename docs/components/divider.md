---
title: Divider
description: Versatile separator component for creating visual divisions in horizontal or vertical layouts.
component: true
group: Layout & Containers
keywords: [divider, separator, hr, line, spacer, visual, section]
---

# Divider

A flexible separator component for creating visual divisions between content sections. Supports both horizontal and vertical orientations with proper accessibility attributes.

## Installation

```bash
npx torch-cli add divider
```

## Imports

```typescript
import { Divider } from '@/components/Divider'
```

## Basic Usage

```tsx
import { Divider } from '@/components/Divider'

export function BasicDivider() {
  return (
    <div>
      <p>Content above divider</p>
      <Divider />
      <p>Content below divider</p>
    </div>
  )
}
```

## Examples

### Horizontal Divider

Standard horizontal separator between content sections.

```tsx
export function HorizontalDivider() {
  return (
    <div className="space-y-4">
      <section>
        <h2 className="text-xl font-bold">Profile Information</h2>
        <p>Manage your personal details and preferences</p>
      </section>

      <Divider />

      <section>
        <h2 className="text-xl font-bold">Account Settings</h2>
        <p>Configure your account security and privacy</p>
      </section>

      <Divider />

      <section>
        <h2 className="text-xl font-bold">Billing</h2>
        <p>Manage subscriptions and payment methods</p>
      </section>
    </div>
  )
}
```

### Vertical Divider

Vertical separator for inline content.

```tsx
export function VerticalDivider() {
  return (
    <div className="flex items-center gap-4 h-12">
      <button className="px-4">Home</button>

      <Divider orientation="vertical" />

      <button className="px-4">About</button>

      <Divider orientation="vertical" />

      <button className="px-4">Contact</button>

      <Divider orientation="vertical" />

      <button className="px-4">Help</button>
    </div>
  )
}
```

### In Navigation Bar

Separating navigation groups.

```tsx
export function NavigationWithDividers() {
  return (
    <nav className="flex items-center gap-2 p-4 bg-background-system-body-secondary rounded-lg">
      {/* Primary actions */}
      <button className="px-3 py-2">Dashboard</button>
      <button className="px-3 py-2">Projects</button>
      <button className="px-3 py-2">Tasks</button>

      <Divider orientation="vertical" className="h-8" />

      {/* Secondary actions */}
      <button className="px-3 py-2">Settings</button>
      <button className="px-3 py-2">Profile</button>

      {/* Spacer */}
      <div className="flex-1" />

      <Divider orientation="vertical" className="h-8" />

      {/* Account actions */}
      <button className="px-3 py-2">
        <i className="ri-notification-line"></i>
      </button>
      <button className="px-3 py-2">
        <i className="ri-user-line"></i>
      </button>
    </nav>
  )
}
```

### In Card Components

Dividing card sections.

```tsx
export function CardWithDividers() {
  return (
    <div className="border border-border-presentation-global-primary rounded-lg">
      <div className="p-4">
        <h3 className="text-lg font-bold">Product Details</h3>
        <p className="text-sm text-content-presentation-global-secondary">
          Premium subscription plan
        </p>
      </div>

      <Divider />

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span>Monthly Price</span>
          <span className="font-bold">$29.99</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span>Annual Price</span>
          <span className="font-bold">$299.99</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Savings</span>
          <span className="text-green-500 font-bold">$59.89 (16%)</span>
        </div>
      </div>

      <Divider />

      <div className="p-4">
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <i className="ri-check-line text-green-500"></i>
            Unlimited projects
          </li>
          <li className="flex items-center gap-2">
            <i className="ri-check-line text-green-500"></i>
            Priority support
          </li>
          <li className="flex items-center gap-2">
            <i className="ri-check-line text-green-500"></i>
            Advanced analytics
          </li>
        </ul>
      </div>

      <Divider />

      <div className="p-4">
        <button className="w-full bg-blue-500 text-white py-2 rounded">
          Subscribe Now
        </button>
      </div>
    </div>
  )
}
```

### In Lists

Separating list items.

```tsx
export function ListWithDividers() {
  const notifications = [
    { id: 1, title: 'New message from John', time: '2 min ago', icon: 'ri-message-3-line' },
    { id: 2, title: 'Project deadline approaching', time: '1 hour ago', icon: 'ri-calendar-line' },
    { id: 3, title: 'Team member joined', time: '3 hours ago', icon: 'ri-user-add-line' },
    { id: 4, title: 'Report generated', time: '1 day ago', icon: 'ri-file-chart-line' },
  ]

  return (
    <div className="border border-border-presentation-global-primary rounded-lg">
      {notifications.map((notification, index) => (
        <React.Fragment key={notification.id}>
          <div className="p-4 hover:bg-background-presentation-global-secondary transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className={`${notification.icon} text-blue-500`}></i>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm text-content-presentation-global-secondary">
                  {notification.time}
                </p>
              </div>
            </div>
          </div>
          {index < notifications.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </div>
  )
}
```

### In Forms

Grouping form sections.

```tsx
export function FormWithDividers() {
  return (
    <form className="max-w-2xl space-y-6">
      {/* Personal Information */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <div className="space-y-3">
          <InputField label="First Name" placeholder="John" />
          <InputField label="Last Name" placeholder="Doe" />
          <InputField label="Email" type="email" placeholder="john@example.com" />
        </div>
      </div>

      <Divider />

      {/* Address */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Address</h2>
        <div className="space-y-3">
          <InputField label="Street Address" placeholder="123 Main St" />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="City" placeholder="New York" />
            <InputField label="State" placeholder="NY" />
          </div>
          <InputField label="ZIP Code" placeholder="10001" />
        </div>
      </div>

      <Divider />

      {/* Preferences */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Preferences</h2>
        <div className="space-y-2">
          <LabeledCheckBox id="marketing" label="Receive marketing emails" />
          <LabeledCheckBox id="newsletter" label="Subscribe to newsletter" />
          <LabeledCheckBox id="updates" label="Product updates" />
        </div>
      </div>

      <Divider />

      <div className="flex justify-end gap-3">
        <Button variant="SecStyle">Cancel</Button>
        <Button variant="PrimeStyle">Save Changes</Button>
      </div>
    </form>
  )
}
```

### With Text Label

Divider with centered text.

```tsx
export function DividerWithText() {
  return (
    <div className="space-y-6">
      {/* Login section */}
      <div className="space-y-3">
        <InputField type="email" placeholder="Email" className="w-full" />
        <InputField type="password" placeholder="Password" className="w-full" />
        <Button className="w-full">Sign In</Button>
      </div>

      {/* Divider with text */}
      <div className="relative">
        <Divider />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-background-system-body-primary px-2 text-sm text-content-presentation-global-secondary">
            OR
          </span>
        </div>
      </div>

      {/* Social login */}
      <div className="space-y-2">
        <Button className="w-full" variant="SecStyle">
          <i className="ri-google-fill mr-2"></i>
          Continue with Google
        </Button>
        <Button className="w-full" variant="SecStyle">
          <i className="ri-github-fill mr-2"></i>
          Continue with GitHub
        </Button>
      </div>
    </div>
  )
}
```

### In Toolbars

Grouping toolbar actions.

```tsx
export function ToolbarWithDividers() {
  return (
    <div className="flex items-center gap-1 p-2 border border-border-presentation-global-primary rounded-lg">
      {/* Text formatting */}
      <ActionButton size="S" title="Bold">
        <i className="ri-bold"></i>
      </ActionButton>
      <ActionButton size="S" title="Italic">
        <i className="ri-italic"></i>
      </ActionButton>
      <ActionButton size="S" title="Underline">
        <i className="ri-underline"></i>
      </ActionButton>

      <Divider orientation="vertical" className="h-6 mx-1" />

      {/* Alignment */}
      <ActionButton size="S" title="Align Left">
        <i className="ri-align-left"></i>
      </ActionButton>
      <ActionButton size="S" title="Align Center">
        <i className="ri-align-center"></i>
      </ActionButton>
      <ActionButton size="S" title="Align Right">
        <i className="ri-align-right"></i>
      </ActionButton>

      <Divider orientation="vertical" className="h-6 mx-1" />

      {/* Lists */}
      <ActionButton size="S" title="Bullet List">
        <i className="ri-list-unordered"></i>
      </ActionButton>
      <ActionButton size="S" title="Numbered List">
        <i className="ri-list-ordered"></i>
      </ActionButton>

      <Divider orientation="vertical" className="h-6 mx-1" />

      {/* Insert */}
      <ActionButton size="S" title="Insert Link">
        <i className="ri-link"></i>
      </ActionButton>
      <ActionButton size="S" title="Insert Image">
        <i className="ri-image-line"></i>
      </ActionButton>
    </div>
  )
}
```

### In Sidebars

Visual separation in sidebar content.

```tsx
export function SidebarWithDividers() {
  return (
    <aside className="w-64 border-r border-border-presentation-global-primary h-screen p-4">
      {/* User profile */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar size="M" src="/avatar.jpg" />
        <div>
          <div className="font-medium">John Doe</div>
          <div className="text-xs text-content-presentation-global-secondary">
            john@example.com
          </div>
        </div>
      </div>

      <Divider className="my-4" />

      {/* Main navigation */}
      <nav className="space-y-1 mb-4">
        <SideBarItem active>
          <i className="ri-dashboard-line mr-2"></i>
          Dashboard
        </SideBarItem>
        <SideBarItem>
          <i className="ri-folder-line mr-2"></i>
          Projects
        </SideBarItem>
        <SideBarItem>
          <i className="ri-task-line mr-2"></i>
          Tasks
        </SideBarItem>
      </nav>

      <Divider className="my-4" />

      {/* Secondary navigation */}
      <nav className="space-y-1">
        <SideBarItem>
          <i className="ri-settings-3-line mr-2"></i>
          Settings
        </SideBarItem>
        <SideBarItem>
          <i className="ri-question-line mr-2"></i>
          Help
        </SideBarItem>
        <SideBarItem>
          <i className="ri-logout-box-line mr-2"></i>
          Sign Out
        </SideBarItem>
      </nav>
    </aside>
  )
}
```

### Custom Styling

Styled dividers with custom colors and thickness.

```tsx
export function StyledDividers() {
  return (
    <div className="space-y-8">
      {/* Thick divider */}
      <div>
        <h3>Thick Divider</h3>
        <Divider className="h-[2px]" />
      </div>

      {/* Colored dividers */}
      <div>
        <h3>Colored Dividers</h3>
        <Divider className="bg-blue-500" />
        <br />
        <Divider className="bg-green-500" />
        <br />
        <Divider className="bg-red-500" />
      </div>

      {/* Gradient divider */}
      <div>
        <h3>Gradient Divider</h3>
        <Divider className="h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      {/* Dashed divider */}
      <div>
        <h3>Dashed Divider</h3>
        <Divider className="border-t border-dashed border-border-presentation-global-primary bg-transparent" />
      </div>

      {/* Dotted divider */}
      <div>
        <h3>Dotted Divider</h3>
        <Divider className="border-t border-dotted border-border-presentation-global-primary bg-transparent" />
      </div>
    </div>
  )
}
```

## API Reference

### Divider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| orientation | `'horizontal' \| 'vertical'` | `'horizontal'` | Divider orientation |
| decorative | `boolean` | `true` | Whether divider is purely visual |
| className | `string` | - | Additional CSS classes |
| ref | `Ref<HTMLDivElement>` | - | Forward ref to div element |

### Decorative vs Semantic

| decorative | role | aria-orientation | Use Case |
|------------|------|------------------|----------|
| `true` | `"none"` | `undefined` | Visual separation only |
| `false` | `"separator"` | orientation value | Semantic content separation |

## Styling

### Default Styles

- **Horizontal**: `height: 1px`, `width: 100%`
- **Vertical**: `height: 100%`, `width: 1px`
- **Color**: `--border-presentation-global-primary`
- **Background**: Solid color fill

### Customization

```tsx
// Adjust thickness
<Divider className="h-[2px]" />
<Divider orientation="vertical" className="w-[2px]" />

// Custom colors
<Divider className="bg-blue-500" />

// With margins
<Divider className="my-6" />
<Divider orientation="vertical" className="mx-3" />

// Custom height for vertical
<Divider orientation="vertical" className="h-8" />
```

## TypeScript Types

```typescript
interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
}
```

## Common Patterns

### Conditional Dividers

```tsx
function ConditionalDivider({ items }) {
  return (
    <div>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <div>{item.content}</div>
          {index < items.length - 1 && <Divider className="my-2" />}
        </React.Fragment>
      ))}
    </div>
  )
}
```

### Responsive Dividers

```tsx
function ResponsiveDivider() {
  return (
    <>
      {/* Horizontal on mobile, vertical on desktop */}
      <Divider className="md:hidden" />
      <Divider orientation="vertical" className="hidden md:block" />
    </>
  )
}
```

### Divider Group

```tsx
function DividerGroup({ children, spacing = 'md' }) {
  const spacingClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
  }

  return (
    <div className={spacingClasses[spacing]}>
      {React.Children.map(children, (child, index) => (
        <React.Fragment>
          {child}
          {index < React.Children.count(children) - 1 && <Divider />}
        </React.Fragment>
      ))}
    </div>
  )
}
```

## Testing

```typescript
import { render, screen } from '@testing-library/react'
import { Divider } from '@/components/Divider'

describe('Divider', () => {
  it('renders horizontal divider by default', () => {
    const { container } = render(<Divider />)
    const divider = container.firstChild

    expect(divider).toHaveClass('h-[1px]', 'w-full')
  })

  it('renders vertical divider', () => {
    const { container } = render(<Divider orientation="vertical" />)
    const divider = container.firstChild

    expect(divider).toHaveClass('h-full', 'w-[1px]')
  })

  it('applies decorative role by default', () => {
    const { container } = render(<Divider />)
    const divider = container.firstChild

    expect(divider).toHaveAttribute('role', 'none')
    expect(divider).not.toHaveAttribute('aria-orientation')
  })

  it('applies separator role when not decorative', () => {
    const { container } = render(
      <Divider decorative={false} orientation="horizontal" />
    )
    const divider = container.firstChild

    expect(divider).toHaveAttribute('role', 'separator')
    expect(divider).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Divider ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies custom className', () => {
    const { container } = render(<Divider className="custom-class" />)
    const divider = container.firstChild

    expect(divider).toHaveClass('custom-class')
  })
})
```

## Accessibility

- **Semantic Role**: Uses `role="separator"` for semantic dividers
- **Decorative**: Uses `role="none"` for purely visual dividers
- **ARIA Orientation**: Properly indicates orientation for screen readers
- **Visual Clarity**: Clear visual separation for all users
- **Keyboard Navigation**: Does not interfere with keyboard navigation

### Accessibility Best Practices

```tsx
// Decorative divider (default) - purely visual
<Divider />

// Semantic divider - meaningful content separation
<section>
  <h2>Section 1</h2>
  <p>Content...</p>
</section>

<Divider decorative={false} />

<section>
  <h2>Section 2</h2>
  <p>Content...</p>
</section>
```

## Performance

- **Lightweight**: Minimal DOM footprint (single div element)
- **CSS-Only**: No JavaScript logic or event handlers
- **Reflow Impact**: Minimal - simple 1px height/width
- **Bundle Size**: ~0.3 KB gzipped (including types)
- **Render Performance**: < 0.1ms average render time

### Performance Tips

```tsx
// Use CSS classes instead of inline styles
<Divider className="my-4" /> // Good

// Memoize in lists
const MemoizedDivider = React.memo(Divider)

// Avoid unnecessary dividers
{items.length > 1 && <Divider />} // Conditional rendering
```

## Migration Guide

### From HTML hr Element

```tsx
// Before: HTML hr
<hr className="my-4 border-gray-300" />

// After: Divider component
<Divider className="my-4" />
```

### From Custom Divider

```tsx
// Before: Custom div
<div className="h-[1px] w-full bg-gray-300" />

// After: Divider component
<Divider />
```

### From Material-UI Divider

```tsx
// Before: Material-UI
<Divider orientation="vertical" flexItem />

// After: Divider component
<Divider orientation="vertical" className="h-full" />
```

### From Radix Separator

```tsx
// Before: Radix Separator
<Separator.Root orientation="horizontal" decorative />

// After: Divider component
<Divider orientation="horizontal" decorative />
```

## Best Practices

1. **Use decorative by default**: Most dividers are purely visual
2. **Semantic dividers for content**: Use `decorative={false}` when dividing meaningful content sections
3. **Consistent spacing**: Apply consistent margin classes for uniform spacing
4. **Group related content**: Use dividers to create visual hierarchy
5. **Avoid overuse**: Too many dividers can clutter the interface
6. **Vertical height**: Always specify height for vertical dividers
7. **Responsive consideration**: Consider different orientations for mobile/desktop
8. **Color consistency**: Use theme colors for consistent appearance