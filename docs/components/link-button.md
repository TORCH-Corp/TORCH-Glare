---
title: LinkButton
description: Link-style button with animated arrow indicator for navigation and external links.
component: true
group: Buttons & Actions
keywords: [button, link, navigation, arrow, animated, hover]
---

# LinkButton

A stylized link button component featuring an animated arrow that appears on hover. Perfect for navigation links, call-to-action elements, and external link indicators.

## Installation

```bash
npx torch-cli add link-button
```

## Imports

```typescript
import { LinkButton } from '@/components/LinkButton'
import { linkButtonStyles } from '@/components/LinkButton'
```

## Basic Usage

```tsx
import { LinkButton } from '@/components/LinkButton'

export function BasicLinkButton() {
  return (
    <LinkButton size="S" href="/dashboard">
      Go to Dashboard
    </LinkButton>
  )
}
```

## Examples

### Sizes

LinkButton comes in two sizes: S (small) and M (medium).

```tsx
export function LinkButtonSizes() {
  return (
    <div className="flex flex-col gap-4">
      <LinkButton size="S" href="/products">
        Small Link Button
      </LinkButton>

      <LinkButton size="M" href="/products">
        Medium Link Button
      </LinkButton>
    </div>
  )
}
```

### Navigation Links

Internal navigation with LinkButton.

```tsx
export function NavigationLinks() {
  return (
    <nav className="flex flex-wrap gap-4">
      <LinkButton size="S" href="/features">
        Features
      </LinkButton>

      <LinkButton size="S" href="/pricing">
        Pricing Plans
      </LinkButton>

      <LinkButton size="S" href="/documentation">
        Documentation
      </LinkButton>

      <LinkButton size="S" href="/support">
        Get Support
      </LinkButton>
    </nav>
  )
}
```

### External Links

LinkButton for external URLs with proper attributes.

```tsx
export function ExternalLinks() {
  return (
    <div className="flex flex-col gap-3">
      <LinkButton
        size="M"
        href="https://github.com/your-repo"
        target="_blank"
        rel="noopener noreferrer"
      >
        View on GitHub
      </LinkButton>

      <LinkButton
        size="M"
        href="https://docs.example.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Read Documentation
      </LinkButton>

      <LinkButton
        size="M"
        href="mailto:support@example.com"
      >
        Contact Support
      </LinkButton>
    </div>
  )
}
```

### With React Router

Integration with React Router for SPA navigation.

```tsx
import { Link } from 'react-router-dom'

export function RouterLinkButton() {
  return (
    <div className="flex gap-4">
      <LinkButton size="S" asChild>
        <Link to="/dashboard">Dashboard</Link>
      </LinkButton>

      <LinkButton size="S" asChild>
        <Link to="/profile">Profile</Link>
      </LinkButton>

      <LinkButton size="S" asChild>
        <Link to="/settings">Settings</Link>
      </LinkButton>
    </div>
  )
}
```

### Call-to-Action

Prominent CTA implementations.

```tsx
export function CallToAction() {
  return (
    <div className="bg-background-presentation-global-secondary p-8 rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-4">
        Ready to get started?
      </h2>
      <p className="text-content-presentation-global-secondary mb-6">
        Join thousands of developers building with our platform
      </p>

      <div className="flex justify-center gap-4">
        <LinkButton size="M" href="/signup">
          Start Free Trial
        </LinkButton>

        <LinkButton size="M" href="/demo">
          View Demo
        </LinkButton>
      </div>
    </div>
  )
}
```

### Resource Links

Links to downloadable resources.

```tsx
export function ResourceLinks() {
  const resources = [
    { name: 'API Documentation', href: '/docs/api.pdf', type: 'PDF' },
    { name: 'Design Guidelines', href: '/docs/design.pdf', type: 'PDF' },
    { name: 'Sample Code', href: '/downloads/samples.zip', type: 'ZIP' },
    { name: 'Video Tutorial', href: '/videos/tutorial.mp4', type: 'MP4' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {resources.map(resource => (
        <LinkButton
          key={resource.name}
          size="S"
          href={resource.href}
          download
        >
          {resource.name}
          <span className="text-xs ml-2 opacity-60">
            ({resource.type})
          </span>
        </LinkButton>
      ))}
    </div>
  )
}
```

### Breadcrumb Navigation

LinkButton in breadcrumb trails.

```tsx
export function Breadcrumbs() {
  const path = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Laptops', href: '/products/electronics/laptops' },
  ]

  return (
    <nav className="flex items-center gap-2">
      {path.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && (
            <span className="text-content-presentation-global-tertiary">
              /
            </span>
          )}
          {index === path.length - 1 ? (
            <span className="text-content-presentation-global-primary">
              {item.label}
            </span>
          ) : (
            <LinkButton size="S" href={item.href}>
              {item.label}
            </LinkButton>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
```

### Card Actions

LinkButtons within card components.

```tsx
export function CardWithLinks() {
  return (
    <div className="border border-border-presentation-global-primary rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-2">
        Premium Features
      </h3>
      <p className="text-content-presentation-global-secondary mb-4">
        Unlock advanced capabilities with our premium plan
      </p>

      <div className="flex gap-3">
        <LinkButton size="S" href="/features">
          Learn More
        </LinkButton>

        <LinkButton size="S" href="/pricing">
          View Pricing
        </LinkButton>
      </div>
    </div>
  )
}
```

### Footer Links

Organized footer link sections.

```tsx
export function FooterLinks() {
  const sections = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Roadmap', 'Changelog']
    },
    {
      title: 'Resources',
      links: ['Documentation', 'API Reference', 'Guides', 'Examples']
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Contact']
    },
  ]

  return (
    <footer className="grid grid-cols-3 gap-8">
      {sections.map(section => (
        <div key={section.title}>
          <h4 className="font-semibold mb-3">{section.title}</h4>
          <div className="flex flex-col gap-2">
            {section.links.map(link => (
              <LinkButton
                key={link}
                size="S"
                href={`/${link.toLowerCase().replace(' ', '-')}`}
              >
                {link}
              </LinkButton>
            ))}
          </div>
        </div>
      ))}
    </footer>
  )
}
```

### Themed LinkButtons

Apply different themes to LinkButtons.

```tsx
export function ThemedLinkButtons() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-lg">
        <LinkButton size="M" theme="light" href="/light">
          Light Theme Link
        </LinkButton>
      </div>

      <div className="p-4 bg-gray-900 rounded-lg">
        <LinkButton size="M" theme="dark" href="/dark">
          Dark Theme Link
        </LinkButton>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg">
        <LinkButton size="M" theme="default" href="/default">
          Default Theme Link
        </LinkButton>
      </div>
    </div>
  )
}
```

## API Reference

### LinkButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | `'S' \| 'M'` | `'S'` | Button size |
| href | `string` | - | Link destination URL |
| theme | `Themes` | - | Theme variant |
| asChild | `boolean` | `false` | Merge props with child element |
| target | `string` | - | Link target attribute |
| rel | `string` | - | Link rel attribute |
| download | `boolean \| string` | - | Download attribute |
| className | `string` | - | Additional CSS classes |
| children | `ReactNode` | - | Link text content |
| onClick | `() => void` | - | Click handler |

### Size Specifications

| Size | Height | Typography | Arrow Size |
|------|--------|------------|------------|
| S | 24px | body-small-semibold | 14px × 14px |
| M | 26px | body-medium-semibold | 16px × 16px |

## Styling

### Animation Details

The LinkButton features a sophisticated hover animation:

1. **Arrow Container**: Scales from 0 to full size on hover
2. **Opacity Transition**: Arrow fades in smoothly
3. **Padding Animation**: Text padding adjusts for arrow space
4. **Duration**: 100ms for arrow, 250ms for container

### Base Styles

```css
/* Core styles */
.link-button {
  background: var(--background-presentation-action-link-primary);
  color: var(--content-presentation-action-link);
  border-radius: 6px;
  padding: 2px;
  transition: all 250ms ease-in-out;
}

/* Arrow animation */
.arrow-container {
  transition: all 100ms ease-in-out;
  width: 0;
  height: 0;
  opacity: 0;
}

.link-button:hover .arrow-container {
  opacity: 1;
  width: 20px; /* S size */
  height: 20px;
}
```

### Custom Styling

```tsx
// Custom colored link button
<LinkButton
  size="M"
  className="!bg-purple-100 !text-purple-700 hover:!bg-purple-200"
  href="/custom"
>
  Custom Styled Link
</LinkButton>

// Inline link style
<LinkButton
  size="S"
  className="!p-0 !bg-transparent"
  href="/inline"
>
  Inline Link
</LinkButton>
```

## TypeScript Types

```typescript
interface LinkButtonProps extends HTMLAttributes<HTMLAnchorElement | HTMLSpanElement> {
  size?: 'S' | 'M'
  theme?: Themes
  asChild?: boolean
  href?: string
}

// Exported styles function
export const linkButtonStyles: (props?: {
  size?: 'S' | 'M'
}) => string
```

## Common Patterns

### Link List Component

```tsx
function LinkList({ links, size = 'S' }) {
  return (
    <ul className="space-y-2">
      {links.map(link => (
        <li key={link.href}>
          <LinkButton size={size} href={link.href}>
            {link.icon && <i className={`${link.icon} mr-2`}></i>}
            {link.label}
          </LinkButton>
        </li>
      ))}
    </ul>
  )
}
```

### Conditional Link Rendering

```tsx
function ConditionalLink({ condition, href, children }) {
  if (!condition) {
    return <span className="text-content-presentation-global-tertiary">
      {children}
    </span>
  }

  return (
    <LinkButton size="S" href={href}>
      {children}
    </LinkButton>
  )
}
```

### Link with Badge

```tsx
function LinkWithBadge({ href, label, badge }) {
  return (
    <LinkButton size="M" href={href} className="inline-flex items-center">
      {label}
      {badge && (
        <span className="ml-2 px-1.5 py-0.5 text-xs bg-background-presentation-state-information-primary text-white rounded">
          {badge}
        </span>
      )}
    </LinkButton>
  )
}
```

## Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LinkButton } from '@/components/LinkButton'

describe('LinkButton', () => {
  it('renders as anchor with href', () => {
    render(
      <LinkButton href="/test">
        Test Link
      </LinkButton>
    )

    const link = screen.getByText('Test Link')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/test')
  })

  it('renders as span without href', () => {
    render(
      <LinkButton>
        Test Span
      </LinkButton>
    )

    const element = screen.getByText('Test Span')
    expect(element.tagName).toBe('SPAN')
  })

  it('applies correct size classes', () => {
    render(
      <LinkButton size="M">
        Medium Link
      </LinkButton>
    )

    const link = screen.getByText('Medium Link')
    expect(link).toHaveClass('h-[26px]')
  })

  it('shows arrow on hover', async () => {
    const { container } = render(
      <LinkButton>
        Hover Link
      </LinkButton>
    )

    const arrow = container.querySelector('svg')
    expect(arrow).toBeInTheDocument()
  })

  it('supports asChild pattern', () => {
    const CustomLink = ({ children, ...props }) => (
      <a {...props} className="custom-link">
        {children}
      </a>
    )

    render(
      <LinkButton asChild>
        <CustomLink href="/custom">Custom</CustomLink>
      </LinkButton>
    )

    const link = screen.getByText('Custom')
    expect(link).toHaveClass('custom-link')
  })
})
```

## Accessibility

- **Semantic HTML**: Uses appropriate anchor or span elements
- **Keyboard Navigation**: Full keyboard support for links
- **Focus States**: Clear focus indicators for keyboard users
- **Screen Reader Support**: Link purpose is clear from text
- **ARIA Attributes**: Supports all standard ARIA link attributes
- **External Link Indicators**: Arrow animation provides visual feedback

### Accessibility Example

```tsx
<LinkButton
  size="M"
  href="https://external.com"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Visit external site (opens in new tab)"
>
  External Resource
  <span className="sr-only">(opens in new tab)</span>
</LinkButton>
```

## Performance

- **CSS Animations**: Hardware-accelerated transitions
- **Lazy SVG Rendering**: Arrow SVG is always present but hidden
- **Minimal Re-renders**: Hover state handled via CSS
- **Optimized Classes**: CVA for efficient class generation

### Performance Tips

```tsx
// Memoize link lists
const MemoizedLinkButton = React.memo(LinkButton)

// Use stable href values
const links = useMemo(() =>
  items.map(item => ({
    href: `/items/${item.id}`,
    label: item.name
  })),
  [items]
)

// Render efficiently
{links.map(link => (
  <MemoizedLinkButton
    key={link.href}
    size="S"
    href={link.href}
  >
    {link.label}
  </MemoizedLinkButton>
))}
```

## Migration Guide

### From Standard Links

```tsx
// Before: Standard anchor
<a href="/page" className="text-blue-500 hover:underline">
  Go to page
</a>

// After: LinkButton
<LinkButton size="S" href="/page">
  Go to page
</LinkButton>
```

### From Other Libraries

```tsx
// Before: Material-UI Link
<Link href="/page" underline="hover">
  Link text
</Link>

// After: LinkButton
<LinkButton size="S" href="/page">
  Link text
</LinkButton>
```

## Best Practices

1. **Use Semantic Sizes**: Choose size based on hierarchy and importance
2. **External Link Indicators**: Always include target="_blank" and rel attributes
3. **Descriptive Text**: Link text should clearly indicate destination
4. **Consistent Styling**: Use the same size for links at the same level
5. **Accessibility Labels**: Add aria-labels for ambiguous link text
6. **Keyboard Support**: Ensure all interactive elements are keyboard accessible
7. **Loading States**: Consider loading states for async navigation