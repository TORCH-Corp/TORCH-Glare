---
name: Card
version: 1.1.15
status: stable
category: components/layout
tags: [container, layout, card, content, polymorphic]
last-reviewed: 2024-11-05
bundle-size: 1.8kb
dependencies:
  - "@radix-ui/react-slot": "^1.0.0"
---

# Card

> A flexible container component for grouping and displaying content. Supports compound architecture with header, description, and content sections. Features hover states and polymorphic rendering.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent
} from 'torch-glare/lib/components/Card'
```

## Quick Examples

### Basic Usage

```typescript
import { Card, CardHeader, CardContent } from 'torch-glare/lib/components/Card'

function Example() {
  return (
    <Card>
      <CardHeader>Card Title</CardHeader>
      <CardContent>
        <p>This is the card content.</p>
      </CardContent>
    </Card>
  )
}
```

### With Description

```typescript
<Card>
  <CardHeader>Features</CardHeader>
  <CardDescription>
    Explore our latest features and improvements
  </CardDescription>
  <CardContent>
    <ul className="space-y-2">
      <li>✓ Feature one</li>
      <li>✓ Feature two</li>
      <li>✓ Feature three</li>
    </ul>
  </CardContent>
</Card>
```

### Clickable Card

```typescript
<Card
  as="button"
  onClick={() => console.log('Card clicked')}
  className="cursor-pointer"
>
  <CardHeader>Interactive Card</CardHeader>
  <CardDescription>Click me to perform an action</CardDescription>
  <CardContent>
    <span>This entire card is clickable</span>
  </CardContent>
</Card>
```

### Card as Link

```typescript
import Link from 'next/link'

// Using asChild pattern
<Card asChild>
  <Link href="/details">
    <CardHeader>Product Name</CardHeader>
    <CardDescription>$99.99</CardDescription>
    <CardContent>
      <p>Product description goes here...</p>
    </CardContent>
  </Link>
</Card>

// Using as prop
<Card as="a" href="/details">
  <CardHeader>Article Title</CardHeader>
  <CardDescription>5 min read</CardDescription>
  <CardContent>
    <p>Article preview text...</p>
  </CardContent>
</Card>
```

### Card Grid Layout

```typescript
function CardGrid() {
  const items = [
    { title: 'Card 1', description: 'Description 1' },
    { title: 'Card 2', description: 'Description 2' },
    { title: 'Card 3', description: 'Description 3' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <Card key={index}>
          <CardHeader>{item.title}</CardHeader>
          <CardDescription>{item.description}</CardDescription>
          <CardContent>
            <p>Content for {item.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

### Card with Form

```typescript
import { Input } from 'torch-glare/lib/components/Input'
import { Button } from 'torch-glare/lib/components/Button'

function LoginCard() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>Sign In</CardHeader>
      <CardDescription>
        Enter your credentials to access your account
      </CardDescription>
      <CardContent>
        <form className="space-y-4">
          <Input.Group>
            <Input
              type="email"
              placeholder="Email address"
              required
            />
          </Input.Group>
          <Input.Group>
            <Input
              type="password"
              placeholder="Password"
              required
            />
          </Input.Group>
          <Button variant="PrimeStyle" className="w-full">
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

### Card with Image

```typescript
function ImageCard() {
  return (
    <Card className="overflow-hidden">
      <img
        src="/image.jpg"
        alt="Card image"
        className="w-full h-48 object-cover -m-4 mb-0"
      />
      <CardHeader>Beautiful Landscape</CardHeader>
      <CardDescription>Photography by John Doe</CardDescription>
      <CardContent>
        <p>Captured in the mountains during sunset...</p>
      </CardContent>
    </Card>
  )
}
```

## API Reference

### Card Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `React.ElementType` | `'section'` | Element type to render as |
| `asChild` | `boolean` | `false` | Merge props onto child element |
| `htmlFor` | `string` | - | For label association when as="label" |
| `className` | `string` | - | Additional CSS classes |
| `onClick` | `(e: MouseEvent) => void` | - | Click handler |
| `children` | `React.ReactNode` | - | Card content |

### CardHeader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Header content |

### CardDescription Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Description content |

### CardContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Main content |

### TypeScript

```typescript
// Card component types
interface CardProps extends Omit<
  HTMLAttributes<HTMLDivElement | HTMLHeadingElement | HTMLParagraphElement | HTMLLabelElement>,
  'htmlFor'
> {
  as?: React.ElementType
  asChild?: boolean
  htmlFor?: string
  className?: string
  children?: React.ReactNode
}

// Sub-component types
interface CardHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string
  children?: React.ReactNode
}

interface CardDescriptionProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string
  children?: React.ReactNode
}

interface CardContentProps extends HTMLAttributes<HTMLHeadingElement> {
  className?: string
  children?: React.ReactNode
}

// Compound component export
export const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>
  Description: React.FC<CardDescriptionProps>
  Content: React.FC<CardContentProps>
}
```

## Common Patterns

### Stats Card

```typescript
function StatsCard({ title, value, change, icon }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div>
          <CardDescription>{title}</CardDescription>
          <CardHeader className="text-2xl">{value}</CardHeader>
          <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        </div>
        <div className="text-3xl text-gray-400">
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}

// Usage
<StatsCard
  title="Total Users"
  value="1,234"
  change={12.5}
  icon="👥"
/>
```

### Profile Card

```typescript
import { Avatar } from 'torch-glare/lib/components/Avatar'
import { Badge } from 'torch-glare/lib/components/Badge'

function ProfileCard({ user }) {
  return (
    <Card>
      <CardContent className="flex items-center space-x-4">
        <Avatar src={user.avatar} alt={user.name} />
        <div className="flex-1">
          <CardHeader>{user.name}</CardHeader>
          <CardDescription>{user.role}</CardDescription>
          <div className="flex gap-2 mt-2">
            {user.skills.map(skill => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Notification Card

```typescript
function NotificationCard({ notification, onDismiss }) {
  return (
    <Card className="relative">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1"
      >
        ✕
      </button>
      <CardHeader>{notification.title}</CardHeader>
      <CardDescription>
        {notification.timestamp}
      </CardDescription>
      <CardContent>
        <p>{notification.message}</p>
      </CardContent>
    </Card>
  )
}
```

### Product Card

```typescript
function ProductCard({ product }) {
  return (
    <Card className="group">
      <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <CardHeader>{product.name}</CardHeader>
      <CardDescription>${product.price}</CardDescription>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        <Button variant="PrimeStyle" className="w-full mt-4">
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Card, CardHeader, CardContent } from 'torch-glare/lib/components/Card'

describe('Card', () => {
  it('renders card content', () => {
    render(
      <Card>
        <CardHeader>Test Header</CardHeader>
        <CardContent>Test Content</CardContent>
      </Card>
    )

    expect(screen.getByText('Test Header')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(
      <Card onClick={handleClick}>
        <CardHeader>Clickable Card</CardHeader>
      </Card>
    )

    fireEvent.click(screen.getByText('Clickable Card'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders as different element with as prop', () => {
    const { container } = render(
      <Card as="article">
        <CardHeader>Article Card</CardHeader>
      </Card>
    )

    expect(container.querySelector('article')).toBeInTheDocument()
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('Card meets WCAG standards', async () => {
  const { container } = render(
    <Card>
      <CardHeader>Accessible Card</CardHeader>
      <CardDescription>Card description</CardDescription>
      <CardContent>
        <p>Card content with proper semantic structure</p>
      </CardContent>
    </Card>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Semantic HTML

- Default renders as `<section>` for proper document structure
- Can be rendered as other semantic elements via `as` prop
- Proper heading hierarchy with CardHeader

### Keyboard Support

- Focusable when interactive (button/link)
- Proper focus ring styling
- Tab navigation support

### ARIA Support

```typescript
// Interactive card with proper ARIA
<Card
  as="button"
  role="button"
  aria-label="View details"
  aria-pressed={selected}
>
  <CardHeader>Interactive Card</CardHeader>
</Card>

// Card as form label
<Card as="label" htmlFor="input-id">
  <CardHeader>Form Label Card</CardHeader>
  <CardContent>
    <input id="input-id" />
  </CardContent>
</Card>
```

### Screen Reader Support

- Semantic structure aids navigation
- Proper heading announcements
- Interactive states communicated

## Styling

### Custom Styles

```typescript
<Card className="bg-blue-50 border-blue-200 shadow-lg">
  <CardHeader className="text-blue-900">
    Custom Styled Card
  </CardHeader>
  <CardContent className="text-blue-700">
    Content with custom colors
  </CardContent>
</Card>
```

### Animation

```typescript
<Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
  <CardHeader>Animated Card</CardHeader>
  <CardContent>Hover for animation</CardContent>
</Card>
```

### Dark Mode

```typescript
<Card className="dark:bg-gray-800 dark:border-gray-700">
  <CardHeader className="dark:text-white">
    Dark Mode Card
  </CardHeader>
  <CardContent className="dark:text-gray-300">
    Automatically adapts to dark mode
  </CardContent>
</Card>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 1.8kb |
| First render | <6ms |
| Re-render | <2ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Use `React.memo()` for cards in lists
2. Lazy load images in cards
3. Virtualize long card lists
4. Optimize re-renders with proper keys

## Migration

### From v1.0.x

```diff
// Import path changed
- import Card from 'torch-glare/Card'
+ import { Card, CardHeader, CardContent } from 'torch-glare/lib/components/Card'

// Structure changed to compound
- <Card title="Title" description="Description">
-   Content
- </Card>
+ <Card>
+   <CardHeader>Title</CardHeader>
+   <CardDescription>Description</CardDescription>
+   <CardContent>Content</CardContent>
+ </Card>
```

## Troubleshooting

### Card not hovering

**Solution:** Ensure hover classes aren't overridden

```typescript
// Check for conflicting classes
<Card className="hover:border-blue-500"> // This works
```

### Content overflow

**Solution:** Add overflow handling

```typescript
<Card className="overflow-hidden">
  <CardContent className="overflow-auto max-h-96">
    {/* Long content */}
  </CardContent>
</Card>
```

## Related Components

- [Dialog](/docs/components/dialog.md) - Modal overlays
- [Alert](/docs/components/alert.md) - Alert messages
- [Badge](/docs/components/badge.md) - Status indicators
- [Button](/docs/components/button.md) - Interactive elements

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Added compound component architecture
- Improved hover states
- Enhanced TypeScript types

### v1.1.14
- Added polymorphic rendering
- Fixed border transitions
- Performance improvements

### v1.1.0
- Initial release