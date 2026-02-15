---
name: Breadcrumb
version: 1.1.15
status: stable
category: components/navigation
tags: [navigation, breadcrumb, wayfinding, compound, accessible, rtl]
last-reviewed: 2024-11-05
bundle-size: 2.2kb
dependencies:
  - "@radix-ui/react-slot": "^1.0.0"
  - "class-variance-authority": "^0.7.0"
---

# Breadcrumb

> A compound breadcrumb navigation component with seven sub-components for building flexible, accessible breadcrumb trails. Supports multiple sizes, two style variants, the asChild pattern for custom link components, and collapsible ellipsis for long paths.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from 'torch-glare/lib/components/Breadcrumb'
// or
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from 'torch-glare/lib/components'
```

## Quick Examples

### Basic Usage

```typescript
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'torch-glare/lib/components/Breadcrumb'

function Example() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Products</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Current Product</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

### With Different Sizes

```typescript
// Small
<Breadcrumb>
  <BreadcrumbList size="S">
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

// Medium (default)
<Breadcrumb>
  <BreadcrumbList size="M">
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>

// Large
<Breadcrumb>
  <BreadcrumbList size="L">
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With SystemStyle Variant

```typescript
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink variant="SystemStyle" href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator variant="SystemStyle" />
    <BreadcrumbItem>
      <BreadcrumbLink variant="SystemStyle" href="/docs">Docs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator variant="SystemStyle" />
    <BreadcrumbItem>
      <BreadcrumbPage variant="SystemStyle">API</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With Ellipsis (Collapsed Items)

```typescript
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbEllipsis />
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/category/subcategory">Subcategory</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With Custom Separator

```typescript
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>
      <i className="ri-arrow-right-s-line" />
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>
      /
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbPage>Guide</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With asChild (Custom Link Component)

```typescript
import Link from 'next/link'

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link href="/">Home</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link href="/products">Products</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Details</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With Theme Override

```typescript
<Breadcrumb theme="dark">
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Dark Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### With Icons

```typescript
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">
        <i className="ri-home-line mr-1" />
        Home
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/settings">
        <i className="ri-settings-line mr-1" />
        Settings
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>
        <i className="ri-user-line mr-1" />
        Profile
      </BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## API Reference

### Breadcrumb (Root)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'light' \| 'dark' \| 'default'` | - | Override theme for the breadcrumb |
| `className` | `string` | - | Additional CSS classes |

Renders a `<nav>` element with `aria-label="breadcrumb"`.

### BreadcrumbList

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'S' \| 'M' \| 'L'` | `'M'` | Text size and gap spacing |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Override theme |
| `className` | `string` | - | Additional CSS classes |

Renders an `<ol>` element with flex-wrap layout.

### BreadcrumbItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

Renders an `<li>` element with inline-flex alignment.

### BreadcrumbLink

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'PresentationStyle' \| 'SystemStyle'` | `'PresentationStyle'` | Visual style variant |
| `asChild` | `boolean` | `false` | Merge props onto child element (Slot pattern) |
| `href` | `string` | - | Link destination URL |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Override theme |
| `className` | `string` | - | Additional CSS classes |

Renders an `<a>` element (or child via Slot when `asChild` is true).

### BreadcrumbPage

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'PresentationStyle' \| 'SystemStyle'` | `'PresentationStyle'` | Visual style variant |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Override theme |
| `className` | `string` | - | Additional CSS classes |

Renders a `<span>` with `aria-current="page"` and `aria-disabled="true"`.

### BreadcrumbSeparator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'PresentationStyle' \| 'SystemStyle'` | `'PresentationStyle'` | Visual style variant |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Override theme |
| `children` | `React.ReactNode` | `<i className="ri-arrow-right-s-line" />` | Custom separator content |
| `className` | `string` | - | Additional CSS classes |

Renders an `<li>` with `role="presentation"` and `aria-hidden="true"`. Defaults to a right-arrow icon.

### BreadcrumbEllipsis

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'PresentationStyle' \| 'SystemStyle'` | `'PresentationStyle'` | Visual style variant |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Override theme |
| `className` | `string` | - | Additional CSS classes |

Renders a `<span>` with `role="presentation"`, `aria-hidden="true"`, and a "More" screen-reader label. Displays a `ri-more-line` icon.

### Size Variants (BreadcrumbList)

| Size | Text Size | Gap |
|------|-----------|-----|
| S | 12px | 4px (gap-1) |
| M | 14px | 6px (gap-1.5) |
| L | 16px | 8px (gap-2) |

### TypeScript

```typescript
import { ComponentPropsWithoutRef } from 'react'
import { VariantProps } from 'class-variance-authority'

type Themes = 'light' | 'dark' | 'default'

interface BreadcrumbProps extends ComponentPropsWithoutRef<'nav'> {
  theme?: Themes
  separator?: React.ReactNode
}

interface BreadcrumbListProps
  extends ComponentPropsWithoutRef<'ol'>,
    VariantProps<typeof breadcrumbListStyles> {
  theme?: Themes
}

interface BreadcrumbLinkProps
  extends ComponentPropsWithoutRef<'a'>,
    VariantProps<typeof breadcrumbLinkStyles> {
  asChild?: boolean
  theme?: Themes
}

interface BreadcrumbPageProps
  extends ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof breadcrumbPageStyles> {
  theme?: Themes
}

interface BreadcrumbSeparatorProps
  extends ComponentPropsWithoutRef<'li'>,
    VariantProps<typeof breadcrumbSeparatorStyles> {
  theme?: Themes
}

interface BreadcrumbEllipsisProps
  extends ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof breadcrumbEllipsisStyles> {
  theme?: Themes
}

export const Breadcrumb: React.ForwardRefExoticComponent<
  BreadcrumbProps & React.RefAttributes<HTMLElement>
>
export const BreadcrumbList: React.ForwardRefExoticComponent<
  BreadcrumbListProps & React.RefAttributes<HTMLOListElement>
>
export const BreadcrumbItem: React.ForwardRefExoticComponent<
  ComponentPropsWithoutRef<'li'> & React.RefAttributes<HTMLLIElement>
>
export const BreadcrumbLink: React.ForwardRefExoticComponent<
  BreadcrumbLinkProps & React.RefAttributes<HTMLAnchorElement>
>
export const BreadcrumbPage: React.ForwardRefExoticComponent<
  BreadcrumbPageProps & React.RefAttributes<HTMLSpanElement>
>
export const BreadcrumbSeparator: React.ForwardRefExoticComponent<
  BreadcrumbSeparatorProps & React.RefAttributes<HTMLLIElement>
>
export const BreadcrumbEllipsis: React.ForwardRefExoticComponent<
  BreadcrumbEllipsisProps & React.RefAttributes<HTMLSpanElement>
>

export {
  breadcrumbListStyles,
  breadcrumbLinkStyles,
  breadcrumbPageStyles,
  breadcrumbSeparatorStyles,
  breadcrumbEllipsisStyles,
}
```

## Common Patterns

### Dynamic Breadcrumb from Route

```typescript
function DynamicBreadcrumb({ segments }: { segments: { label: string; href: string }[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1

          return (
            <React.Fragment key={segment.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segment.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={segment.href}>
                    {segment.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// Usage
<DynamicBreadcrumb
  segments={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Laptops', href: '/products/electronics/laptops' },
  ]}
/>
```

### Collapsible Breadcrumb with Dropdown

```typescript
import { DropdownMenu } from 'torch-glare/lib/components/DropdownMenu'

function CollapsibleBreadcrumb({
  items,
  maxVisible = 3
}: {
  items: { label: string; href: string }[]
  maxVisible?: number
}) {
  const shouldCollapse = items.length > maxVisible
  const visibleStart = items.slice(0, 1)
  const collapsed = shouldCollapse ? items.slice(1, items.length - (maxVisible - 1)) : []
  const visibleEnd = shouldCollapse ? items.slice(items.length - (maxVisible - 1)) : items.slice(1)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* First item always visible */}
        {visibleStart.map((item) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </React.Fragment>
        ))}

        {/* Collapsed items shown as ellipsis */}
        {collapsed.length > 0 && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <BreadcrumbEllipsis />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  {collapsed.map((item) => (
                    <DropdownMenu.Item key={item.href} asChild>
                      <a href={item.href}>{item.label}</a>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {/* Remaining visible items */}
        {visibleEnd.map((item, index) => {
          const isLast = index === visibleEnd.length - 1
          return (
            <React.Fragment key={item.href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

### Next.js App Router Integration

```typescript
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

function AppBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/')
          const isLast = index === segments.length - 1
          const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

          return (
            <React.Fragment key={href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

### File Explorer Breadcrumb

```typescript
function FileExplorerBreadcrumb({
  path,
  onNavigate
}: {
  path: string[]
  onNavigate: (index: number) => void
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList size="S">
        <BreadcrumbItem>
          <BreadcrumbLink
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate(-1) }}
          >
            <i className="ri-folder-line mr-1" />
            Root
          </BreadcrumbLink>
        </BreadcrumbItem>

        {path.map((folder, index) => {
          const isLast = index === path.length - 1
          return (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    <i className="ri-folder-open-line mr-1" />
                    {folder}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href="#"
                    onClick={(e) => { e.preventDefault(); onNavigate(index) }}
                  >
                    <i className="ri-folder-line mr-1" />
                    {folder}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from 'torch-glare/lib/components/Breadcrumb'

describe('Breadcrumb', () => {
  it('renders navigation landmark', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'breadcrumb')
  })

  it('renders links as anchors', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/test">Test</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    const link = screen.getByText('Test')
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/test')
  })

  it('marks current page with aria-current', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    const page = screen.getByText('Current')
    expect(page).toHaveAttribute('aria-current', 'page')
    expect(page).toHaveAttribute('aria-disabled', 'true')
  })

  it('hides separators from accessibility tree', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    const separator = container.querySelector('[role="presentation"]')
    expect(separator).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders ellipsis with screen reader text', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    expect(screen.getByText('More')).toHaveClass('sr-only')
  })

  it('applies size variant to list', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbList size="L">
          <BreadcrumbItem>
            <BreadcrumbPage>Page</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )

    const list = container.querySelector('ol')
    expect(list).toHaveClass('text-[16px]', 'gap-2')
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('Breadcrumb meets WCAG standards', async () => {
  const { container } = render(
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Current Page</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Semantic HTML

The Breadcrumb component renders proper semantic structure:

```html
<nav aria-label="breadcrumb">
  <ol>
    <li>
      <a href="/">Home</a>
    </li>
    <li role="presentation" aria-hidden="true">
      <!-- separator icon -->
    </li>
    <li>
      <span role="link" aria-disabled="true" aria-current="page">
        Current Page
      </span>
    </li>
  </ol>
</nav>
```

### ARIA Attributes

- `<nav aria-label="breadcrumb">`: Identifies the navigation landmark
- `<span aria-current="page">`: Marks the current page in the trail
- `<span aria-disabled="true">`: Indicates the current page is not interactive
- `<li role="presentation" aria-hidden="true">`: Hides decorative separators
- `<span role="presentation" aria-hidden="true">`: Hides decorative ellipsis

### Keyboard Support

- **Tab**: Navigate between breadcrumb links
- **Enter**: Activate focused link
- **Space**: Activate focused link

### Screen Reader Support

- Navigation landmark announced as "breadcrumb"
- Links are announced with their text content
- Current page announced with "current page" semantics
- Separators and ellipsis hidden from screen readers
- "More" label provided for ellipsis via `sr-only` text

### Best Practices

```typescript
// Use BreadcrumbPage for the current/last item (not a link)
<BreadcrumbPage>Current Page</BreadcrumbPage>

// Use BreadcrumbLink for navigable items
<BreadcrumbLink href="/path">Navigable</BreadcrumbLink>

// Use asChild with framework routing components
<BreadcrumbLink asChild>
  <Link href="/path">Next.js Link</Link>
</BreadcrumbLink>
```

## Styling

### Variant Styles

#### PresentationStyle (Default)

- **Links**: `text-content-presentation-global-secondary`, hover to `text-content-presentation-global-primary`
- **Current Page**: `text-content-presentation-global-primary`
- **Separator**: `text-content-presentation-global-secondary`
- **Ellipsis**: hover `bg-background-presentation-action-hover`

#### SystemStyle

- **Links**: `text-content-system-global-secondary`, hover to `text-content-system-global-primary`
- **Current Page**: `text-content-system-global-primary`
- **Separator**: `text-content-system-global-secondary`
- **Ellipsis**: hover `bg-background-system-action-secondary-hover`

### Link Interactions

```css
/* Links have hover underline and focus ring */
hover:underline
focus-visible:ring-2
focus-visible:ring-border-presentation-state-focus
focus-visible:rounded-[2px]
```

### Ellipsis Dimensions

```css
/* Fixed 24x24px clickable area with rounded corners */
w-6 h-6
rounded-[4px]
cursor-pointer
```

### Custom Styles

```typescript
<Breadcrumb className="bg-gray-50 px-4 py-2 rounded-lg">
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/" className="text-blue-600">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator className="text-gray-400" />
    <BreadcrumbItem>
      <BreadcrumbPage className="font-bold">Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 2.2kb |
| First render | <5ms |
| Re-render | <2ms |
| Tree-shakeable | Yes |

### Optimization Tips

1. Use `React.Fragment` with keys for dynamic breadcrumb generation
2. Memoize breadcrumb segments if derived from expensive computations
3. Use `asChild` pattern to avoid extra DOM nodes when integrating with routers

## Troubleshooting

### Links not navigating with Next.js

**Solution:** Use the `asChild` prop to pass props to your framework's Link component:

```typescript
<BreadcrumbLink asChild>
  <Link href="/path">Page</Link>
</BreadcrumbLink>
```

### Separator icon not showing

**Solution:** Ensure Remix Icon CSS is loaded. The default separator uses `ri-arrow-right-s-line`. Alternatively, provide custom separator content:

```typescript
<BreadcrumbSeparator>/</BreadcrumbSeparator>
```

### Breadcrumb wrapping on small screens

**Solution:** The BreadcrumbList uses `flex-wrap` by default. To prevent wrapping, add `flex-nowrap` and `overflow-hidden`:

```typescript
<BreadcrumbList className="flex-nowrap overflow-hidden">
  {/* items */}
</BreadcrumbList>
```

## Related Components

- [DropdownMenu](/docs/components/dropdown-menu.md) - Combine with BreadcrumbEllipsis for collapsed items
- [LinkButton](/docs/components/link-button.md) - Styled link actions
- [Button](/docs/components/button.md) - Action buttons

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## Changelog

### v1.1.15
- Initial stable release
- 7 sub-components (Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis)
- 2 style variants (PresentationStyle, SystemStyle)
- 3 list size variants (S, M, L)
- asChild pattern for custom link components
- Full accessibility with ARIA attributes and semantic HTML
