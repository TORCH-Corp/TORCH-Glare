---
title: TransparentLabel
description: Text label with gradient fade-out effect and comprehensive typography size options
group: Labels & Text
keywords: [transparent-label, text, typography, gradient, fade, truncate]
---

# TransparentLabel

> A specialized text label component with a built-in gradient fade-out effect (mask-image) that creates a smooth transition to transparency at the end. Supports all typography variants from display to labels with extensive customization.

## Installation

No external dependencies required.

## Import

```typescript
import { TransparentLabel } from '@torch-ui/components'
import type { TransparentLabelProps } from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { TransparentLabel } from '@torch-ui/components'

function Example() {
  return (
    <TransparentLabel>
      This text will fade out at the end with a gradient effect
    </TransparentLabel>
  )
}
```

### Different Sizes

```typescript
import { TransparentLabel } from '@torch-ui/components'

function Sizes() {
  return (
    <div className="space-y-2">
      <TransparentLabel size="display-large-bold">
        Large Display Text
      </TransparentLabel>

      <TransparentLabel size="headers-medium-semibold">
        Medium Header
      </TransparentLabel>

      <TransparentLabel size="body-medium-regular">
        Regular Body Text
      </TransparentLabel>

      <TransparentLabel size="labels-small-regular">
        Small Label
      </TransparentLabel>
    </div>
  )
}
```

### Truncating Long Text

```typescript
import { TransparentLabel } from '@torch-ui/components'

function TruncatedText() {
  const longText = "This is a very long text that needs to be truncated gracefully with a fade-out effect instead of showing ellipsis or cutting off abruptly"

  return (
    <div className="w-64">
      <TransparentLabel size="body-medium-regular">
        {longText}
      </TransparentLabel>
    </div>
  )
}
```

### Typography Variants

```typescript
import { TransparentLabel } from '@torch-ui/components'

function TypographyShowcase() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-500 mb-1">Display Large Bold</p>
        <TransparentLabel size="display-large-bold">
          Welcome to Torch
        </TransparentLabel>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">Headers Medium Semibold</p>
        <TransparentLabel size="headers-medium-semibold">
          Section Header
        </TransparentLabel>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">Body Large Regular</p>
        <TransparentLabel size="body-large-regular">
          This is body text with a fade-out effect
        </TransparentLabel>
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">Labels Medium Medium</p>
        <TransparentLabel size="labels-medium-medium">
          Field Label
        </TransparentLabel>
      </div>
    </div>
  )
}
```

### Card with Fade Effect

```typescript
import { TransparentLabel } from '@torch-ui/components'
import { Card } from '@torch-ui/components'

function ProductCard() {
  return (
    <Card className="p-4 w-64">
      <img
        src="/product.jpg"
        alt="Product"
        className="w-full h-32 object-cover rounded mb-2"
      />
      <TransparentLabel size="headers-small-bold">
        Premium Wireless Headphones with Active Noise Cancellation
      </TransparentLabel>
      <p className="text-sm text-gray-500 mt-2">$299.99</p>
    </Card>
  )
}
```

### List with Truncated Items

```typescript
import { TransparentLabel } from '@torch-ui/components'

function TruncatedList() {
  const items = [
    "Short item",
    "This is a medium length item that fits",
    "This is a very long item that will definitely need truncation with the fade effect to look good",
    "Another item",
  ]

  return (
    <div className="w-64 space-y-2">
      {items.map((item, index) => (
        <div key={index} className="p-2 bg-gray-50 rounded">
          <TransparentLabel size="body-medium-regular">
            {item}
          </TransparentLabel>
        </div>
      ))}
    </div>
  )
}
```

### Navigation with Fade

```typescript
import { TransparentLabel } from '@torch-ui/components'

function Navigation() {
  const navItems = [
    { label: "Dashboard", icon: "ri-dashboard-line" },
    { label: "Analytics and Reporting", icon: "ri-bar-chart-line" },
    { label: "User Management System", icon: "ri-user-line" },
    { label: "Settings", icon: "ri-settings-line" },
  ]

  return (
    <nav className="w-48 space-y-1">
      {navItems.map((item) => (
        <a
          key={item.label}
          href="#"
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
        >
          <i className={item.icon} />
          <TransparentLabel size="body-medium-regular">
            {item.label}
          </TransparentLabel>
        </a>
      ))}
    </nav>
  )
}
```

### Breadcrumbs

```typescript
import { TransparentLabel } from '@torch-ui/components'

function Breadcrumbs() {
  const crumbs = [
    "Home",
    "Products",
    "Electronics",
    "Computers and Laptops",
    "Gaming Laptops",
    "High Performance Gaming Laptops"
  ]

  return (
    <div className="flex items-center gap-2 max-w-lg">
      {crumbs.map((crumb, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span>/</span>}
          <TransparentLabel
            size="labels-medium-regular"
            className={index === crumbs.length - 1 ? 'font-semibold' : ''}
          >
            {crumb}
          </TransparentLabel>
        </div>
      ))}
    </div>
  )
}
```

### Table Cell with Fade

```typescript
import { TransparentLabel } from '@torch-ui/components'

function DataTable() {
  const data = [
    { name: "Alice Johnson", email: "alice.johnson@verylongdomain.com", role: "Administrator" },
    { name: "Bob Smith", email: "bob.smith@company.com", role: "Editor" },
    { name: "Carol Williams with a very long name", email: "carol@email.com", role: "Viewer" },
  ]

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left p-2">Name</th>
          <th className="text-left p-2">Email</th>
          <th className="text-left p-2">Role</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} className="border-b">
            <td className="p-2">
              <TransparentLabel size="body-medium-regular">
                {row.name}
              </TransparentLabel>
            </td>
            <td className="p-2">
              <TransparentLabel size="body-medium-regular">
                {row.email}
              </TransparentLabel>
            </td>
            <td className="p-2">
              <TransparentLabel size="labels-medium-regular">
                {row.role}
              </TransparentLabel>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### Custom Color with Fade

```typescript
import { TransparentLabel } from '@torch-ui/components'

function ColoredLabels() {
  return (
    <div className="space-y-2">
      <TransparentLabel
        size="body-medium-semibold"
        className="text-blue-600"
      >
        This is a blue label with fade effect
      </TransparentLabel>

      <TransparentLabel
        size="body-medium-semibold"
        className="text-green-600"
      >
        This is a green label with fade effect
      </TransparentLabel>

      <TransparentLabel
        size="body-medium-semibold"
        className="text-red-600"
      >
        This is a red label with fade effect
      </TransparentLabel>
    </div>
  )
}
```

### RTL Support

```typescript
import { TransparentLabel } from '@torch-ui/components'

function RTLExample() {
  return (
    <div dir="rtl" className="space-y-2">
      <TransparentLabel size="body-medium-regular">
        هذا نص باللغة العربية سيتلاشى في النهاية
      </TransparentLabel>

      <TransparentLabel size="headers-medium-bold">
        عنوان باللغة العربية
      </TransparentLabel>
    </div>
  )
}
```

## API Reference

### TransparentLabel Props

Extends all standard HTML paragraph attributes.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `TypographySize` | `'body-medium-regular'` | Typography variant |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Text content |
| ...HTMLParagraphElement | - | - | All paragraph attributes |

### Typography Sizes

The component supports all typography sizes from the design system:

#### Display Sizes
- `display-large-bold`
- `display-large-semibold`
- `display-large-medium`
- `display-large-regular`
- `display-medium-bold`
- `display-medium-semibold`
- `display-medium-medium`
- `display-medium-regular`
- `display-small-bold`
- `display-small-semibold`
- `display-small-medium`
- `display-small-regular`

#### Header Sizes
- `headers-large-bold`
- `headers-large-semibold`
- `headers-large-medium`
- `headers-large-regular`
- `headers-medium-bold`
- `headers-medium-semibold`
- `headers-medium-medium`
- `headers-medium-regular`
- `headers-small-bold`
- `headers-small-semibold`
- `headers-small-medium`
- `headers-small-regular`

#### Body Sizes
- `body-large-bold`
- `body-large-semibold`
- `body-large-medium`
- `body-large-regular`
- `body-medium-bold`
- `body-medium-semibold`
- `body-medium-medium`
- `body-medium-regular`
- `body-small-bold`
- `body-small-semibold`
- `body-small-medium`
- `body-small-regular`

#### Label Sizes
- `labels-large-bold`
- `labels-large-semibold`
- `labels-large-medium`
- `labels-large-regular`
- `labels-medium-bold`
- `labels-medium-semibold`
- `labels-medium-medium`
- `labels-medium-regular`
- `labels-small-bold`
- `labels-small-semibold`
- `labels-small-medium`
- `labels-small-regular`

### Gradient Fade Details

The component uses CSS mask-image to create the fade effect:
- **LTR**: Fades from 85% to 100% on the right
- **RTL**: Fades from 85% to 100% on the left
- **Gradient**: `linear-gradient(to right, black 0%, black 85%, transparent 100%)`

## TypeScript

### Full Type Definitions

```typescript
import { HTMLAttributes } from 'react'
import { VariantProps } from 'class-variance-authority'

type TypographySize =
  | 'display-large-bold' | 'display-large-semibold' | 'display-large-medium' | 'display-large-regular'
  | 'display-medium-bold' | 'display-medium-semibold' | 'display-medium-medium' | 'display-medium-regular'
  | 'display-small-bold' | 'display-small-semibold' | 'display-small-medium' | 'display-small-regular'
  | 'headers-large-bold' | 'headers-large-semibold' | 'headers-large-medium' | 'headers-large-regular'
  | 'headers-medium-bold' | 'headers-medium-semibold' | 'headers-medium-medium' | 'headers-medium-regular'
  | 'headers-small-bold' | 'headers-small-semibold' | 'headers-small-medium' | 'headers-small-regular'
  | 'body-large-bold' | 'body-large-semibold' | 'body-large-medium' | 'body-large-regular'
  | 'body-medium-bold' | 'body-medium-semibold' | 'body-medium-medium' | 'body-medium-regular'
  | 'body-small-bold' | 'body-small-semibold' | 'body-small-medium' | 'body-small-regular'
  | 'labels-large-bold' | 'labels-large-semibold' | 'labels-large-medium' | 'labels-large-regular'
  | 'labels-medium-bold' | 'labels-medium-semibold' | 'labels-medium-medium' | 'labels-medium-regular'
  | 'labels-small-bold' | 'labels-small-semibold' | 'labels-small-medium' | 'labels-small-regular'

interface TransparentLabelProps
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof TransparentLabelStyles> {
  size?: TypographySize
}

export const TransparentLabel: React.FC<TransparentLabelProps>
```

### Usage with Types

```typescript
import { TransparentLabel } from '@torch-ui/components'
import { useState } from 'react'

type Size = 'body-medium-regular' | 'body-large-bold' | 'headers-medium-semibold'

function TypedExample() {
  const [size, setSize] = useState<Size>('body-medium-regular')

  return (
    <div>
      <TransparentLabel size={size}>
        This text uses typed size prop
      </TransparentLabel>

      <select
        value={size}
        onChange={(e) => setSize(e.target.value as Size)}
      >
        <option value="body-medium-regular">Body Regular</option>
        <option value="body-large-bold">Body Bold</option>
        <option value="headers-medium-semibold">Header</option>
      </select>
    </div>
  )
}
```

## Common Patterns

### Truncated Text Component

```typescript
import { TransparentLabel } from '@torch-ui/components'
import { useState } from 'react'

interface TruncatedTextProps {
  text: string
  maxWidth?: string
  size?: ComponentProps<typeof TransparentLabel>['size']
}

function TruncatedText({ text, maxWidth = '200px', size = 'body-medium-regular' }: TruncatedTextProps) {
  const [showFull, setShowFull] = useState(false)

  return (
    <div>
      <div style={{ maxWidth }} className={showFull ? '' : 'overflow-hidden'}>
        <TransparentLabel size={size}>
          {text}
        </TransparentLabel>
      </div>
      {text.length > 50 && (
        <button
          onClick={() => setShowFull(!showFull)}
          className="text-sm text-blue-600 mt-1"
        >
          {showFull ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}
```

### Responsive Typography

```typescript
import { TransparentLabel } from '@torch-ui/components'
import { useMediaQuery } from '@/hooks/useMediaQuery'

function ResponsiveText() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <TransparentLabel
      size={isMobile ? 'body-medium-regular' : 'body-large-regular'}
    >
      This text adjusts size based on screen width
    </TransparentLabel>
  )
}
```

## Testing

### Unit Test Examples

```typescript
import { render, screen } from '@testing-library/react'
import { TransparentLabel } from '@torch-ui/components'

describe('TransparentLabel', () => {
  it('renders text content', () => {
    render(<TransparentLabel>Test Text</TransparentLabel>)

    expect(screen.getByText('Test Text')).toBeInTheDocument()
  })

  it('applies typography class', () => {
    const { container } = render(
      <TransparentLabel size="body-large-bold">
        Bold Text
      </TransparentLabel>
    )

    expect(container.querySelector('.typography-body-large-bold')).toBeInTheDocument()
  })

  it('applies gradient mask', () => {
    const { container } = render(
      <TransparentLabel>Fading Text</TransparentLabel>
    )

    const element = container.querySelector('p')
    const styles = window.getComputedStyle(element!)
    expect(styles.maskImage).toContain('linear-gradient')
  })

  it('applies custom className', () => {
    const { container } = render(
      <TransparentLabel className="custom-class">
        Text
      </TransparentLabel>
    )

    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  it('renders as paragraph element', () => {
    const { container } = render(
      <TransparentLabel>Text</TransparentLabel>
    )

    expect(container.querySelector('p')).toBeInTheDocument()
  })

  it('supports all HTML paragraph attributes', () => {
    render(
      <TransparentLabel
        id="test-id"
        data-testid="test-label"
        aria-label="Test Label"
      >
        Text
      </TransparentLabel>
    )

    const element = screen.getByTestId('test-label')
    expect(element).toHaveAttribute('id', 'test-id')
    expect(element).toHaveAttribute('aria-label', 'Test Label')
  })
})
```

## Accessibility

- **Semantic HTML**: Uses `<p>` element
- **Screen Readers**: Content announced normally
- **Keyboard Navigation**: Not interactive, doesn't affect navigation
- **Color Independence**: Fade effect is visual enhancement only
- **Text Readability**: Ensure sufficient contrast for visible portion

### Accessibility Best Practices

```typescript
// Provide full text in aria-label for screen readers
<TransparentLabel aria-label="Full text without fade">
  Visible truncated text
</TransparentLabel>

// Use appropriate semantic elements
<TransparentLabel as="h2" size="headers-large-bold">
  Section Heading
</TransparentLabel>

// Don't hide critical information
<TransparentLabel>
  Important: Read this completely {/* ❌ Bad - might fade important info */}
</TransparentLabel>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~2kb |
| Bundle size (gzipped) | ~0.8kb |
| Dependencies | class-variance-authority |
| CSS mask support | 98% browsers |
| Re-renders | Minimal |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Use appropriate size**: Don't over-size text
2. **Avoid re-renders**: Memoize content when possible
   ```typescript
   const memoizedText = useMemo(() => generateText(), [deps])
   <TransparentLabel>{memoizedText}</TransparentLabel>
   ```
3. **Consider container width**: Fade effect works best with constrained width

## Styling

### Gradient Customization

```typescript
// Custom fade point
<TransparentLabel
  className="[mask-image:linear-gradient(to_right,black_0%,black_70%,transparent_100%)]"
>
  Fades earlier at 70%
</TransparentLabel>

// No fade
<TransparentLabel className="[mask-image:none]">
  No fade effect
</TransparentLabel>

// Different gradient
<TransparentLabel
  className="[mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)]"
>
  Vertical fade
</TransparentLabel>
```

### Default Styling

- Mask Image: Linear gradient from left to right (or right to left for RTL)
- Fade Start: 85% of text width
- Fade End: 100% of text width
- Typography: Design system typography classes

## Best Practices

1. **Use for truncation**: Ideal for long text in constrained spaces
2. **Constrain width**: Works best with defined container width
3. **Don't hide critical info**: Ensure important text isn't in fade zone
4. **Match typography**: Use appropriate size for context
5. **Test with long text**: Verify fade appears naturally
6. **Consider hover states**: Optionally show full text on hover
7. **RTL support**: Component automatically handles RTL languages

## Comparison with Standard Truncation

| Feature | TransparentLabel | text-ellipsis |
|---------|-----------------|---------------|
| Visual Effect | Gradual fade | Abrupt cutoff |
| Customization | Full gradient control | Limited |
| Multi-line | Works well | single-line-clamp needed |
| Performance | CSS mask | CSS overflow |
| Browser Support | 98% | 100% |

## Related Components

- [Label](./label.md) - Form label component
- [LabelField](./label-field.md) - Combined label and input
- [InnerLabelField](./inner-label-field.md) - Floating label input
