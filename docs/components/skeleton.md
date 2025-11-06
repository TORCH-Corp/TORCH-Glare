---
title: Skeleton
description: Loading placeholder component with pulse animation for content states
group: Data Display
keywords: [skeleton, loading, placeholder, shimmer, pulse, loader, content-loader]
---

# Skeleton

> A simple, flexible loading placeholder component with pulse animation. Use to show a loading state while content is being fetched or processed.

## Installation

No additional dependencies required.

## Import

```typescript
import { Skeleton } from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { Skeleton } from '@torch-ui/components'

function Example() {
  return <Skeleton className="h-4 w-[250px]" />
}
```

### Text Lines

```typescript
import { Skeleton } from '@torch-ui/components'

function TextSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}
```

### Card Skeleton

```typescript
import { Skeleton } from '@torch-ui/components'

function CardSkeleton() {
  return (
    <div className="border rounded-lg p-4">
      <Skeleton className="h-12 w-12 rounded-full mb-4" />
      <Skeleton className="h-4 w-2/3 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}
```

### Profile Skeleton

```typescript
import { Skeleton } from '@torch-ui/components'

function ProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      {/* Avatar */}
      <Skeleton className="h-16 w-16 rounded-full" />

      {/* Profile info */}
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-3 w-[150px]" />
      </div>
    </div>
  )
}
```

### Table Skeleton

```typescript
import { Skeleton } from '@torch-ui/components'

function TableSkeleton() {
  return (
    <div className="w-full">
      {/* Table header */}
      <div className="flex gap-4 mb-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/4" />
      </div>

      {/* Table rows */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 mb-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
        </div>
      ))}
    </div>
  )
}
```

### Button Skeleton

```typescript
import { Skeleton } from '@torch-ui/components'

function ButtonSkeleton() {
  return <Skeleton className="h-10 w-32 rounded-md" />
}
```

### Image Skeleton

```typescript
import { Skeleton } from '@torch-ui/components'

function ImageSkeleton() {
  return (
    <div className="space-y-2">
      {/* Image */}
      <Skeleton className="h-64 w-full rounded-lg" />

      {/* Caption */}
      <Skeleton className="h-3 w-2/3 mx-auto" />
    </div>
  )
}
```

### List Skeleton

```typescript
import { Skeleton } from '@torch-ui/components'

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start space-x-3">
          <Skeleton className="h-10 w-10 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Dashboard Skeleton

```typescript
import { Skeleton } from '@torch-ui/components'

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Stat cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-32" />
        </div>
      ))}

      {/* Chart */}
      <div className="col-span-3 border rounded-lg p-4">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}
```

### Conditional Loading

```typescript
import { Skeleton } from '@torch-ui/components'
import { useState, useEffect } from 'react'

interface User {
  name: string
  email: string
  avatar: string
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser().then((data) => {
      setUser(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-3 w-[150px]" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-full" />
      <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    </div>
  )
}
```

### Grid Skeleton

```typescript
import { Skeleton } from '@torch-ui/components'

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton className="h-48 w-full rounded mb-4" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  )
}
```

## API Reference

### Skeleton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes for sizing and styling |

### Inherited Props

Extends `HTMLAttributes<HTMLDivElement>`, so all standard div props are supported:
- `style`, `id`, `data-*` attributes
- `onClick`, `onMouseEnter`, etc.
- `role`, `aria-*` attributes

## TypeScript

### Full Type Definitions

```typescript
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const Skeleton: React.FC<SkeletonProps>
```

### Usage with TypeScript

```typescript
import { Skeleton } from '@torch-ui/components'

function TypedSkeleton() {
  const skeletonProps: React.ComponentProps<typeof Skeleton> = {
    className: 'h-4 w-full',
    'aria-label': 'Loading content',
  }

  return <Skeleton {...skeletonProps} />
}
```

## Common Patterns

### Reusable Skeleton Components

```typescript
import { Skeleton } from '@torch-ui/components'

// Avatar skeleton
export function AvatarSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  return <Skeleton className={`${sizeClasses[size]} rounded-full`} />
}

// Text skeleton
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {[...Array(lines)].map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

// Usage
<AvatarSkeleton size="lg" />
<TextSkeleton lines={4} />
```

### With Suspense

```typescript
import { Skeleton } from '@torch-ui/components'
import { Suspense } from 'react'

function ProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-3 w-[150px]" />
      </div>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfile />
    </Suspense>
  )
}
```

### Loading States Hook

```typescript
import { Skeleton } from '@torch-ui/components'
import { useState, useEffect } from 'react'

function useLoading<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFn().then((result) => {
      setData(result)
      setLoading(false)
    })
  }, [])

  return { data, loading }
}

function DataDisplay() {
  const { data, loading } = useLoading(fetchData)

  if (loading) {
    return <Skeleton className="h-32 w-full" />
  }

  return <div>{data}</div>
}
```

### Delayed Skeleton

```typescript
import { Skeleton } from '@torch-ui/components'
import { useState, useEffect } from 'react'

function DelayedSkeleton({ delay = 300, children }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!show) return null

  return children || <Skeleton className="h-4 w-full" />
}

// Usage: Only show skeleton if loading takes > 300ms
function FastLoading() {
  const [loading, setLoading] = useState(true)

  if (loading) {
    return (
      <DelayedSkeleton>
        <Skeleton className="h-32 w-full" />
      </DelayedSkeleton>
    )
  }

  return <Content />
}
```

## Styling Tips

### Common Size Classes

```typescript
// Heights
<Skeleton className="h-3" />  // Small text
<Skeleton className="h-4" />  // Regular text
<Skeleton className="h-6" />  // Large text
<Skeleton className="h-8" />  // Heading
<Skeleton className="h-10" /> // Button
<Skeleton className="h-32" /> // Image/card

// Widths
<Skeleton className="w-1/4" />  // 25%
<Skeleton className="w-1/2" />  // 50%
<Skeleton className="w-3/4" />  // 75%
<Skeleton className="w-full" /> // 100%
<Skeleton className="w-[200px]" /> // Fixed width

// Shapes
<Skeleton className="rounded-full" /> // Circle/avatar
<Skeleton className="rounded-md" />   // Rounded corners
<Skeleton className="rounded-lg" />   // More rounded
<Skeleton className="rounded-none" /> // Square
```

### Custom Colors

```typescript
// Light gray (default)
<Skeleton className="h-4 w-full" />

// Custom color
<Skeleton className="h-4 w-full bg-blue-200" />

// Darker skeleton
<Skeleton className="h-4 w-full bg-gray-300" />
```

## Testing

### Unit Test Example

```typescript
import { render, screen } from '@testing-library/react'
import { Skeleton } from '@torch-ui/components'

describe('Skeleton', () => {
  it('renders skeleton with correct classes', () => {
    render(<Skeleton className="h-4 w-full" data-testid="skeleton" />)

    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('h-4', 'w-full', 'animate-pulse')
  })

  it('accepts custom props', () => {
    render(<Skeleton aria-label="Loading" id="custom-skeleton" />)

    const skeleton = screen.getByLabelText('Loading')
    expect(skeleton).toHaveAttribute('id', 'custom-skeleton')
  })
})
```

### Testing Loading States

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { Skeleton } from '@torch-ui/components'

function ComponentWithLoading() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) return <Skeleton className="h-32" data-testid="skeleton" />
  return <div data-testid="content">Content</div>
}

test('shows skeleton then content', async () => {
  render(<ComponentWithLoading />)

  // Skeleton visible initially
  expect(screen.getByTestId('skeleton')).toBeInTheDocument()

  // Content visible after loading
  await waitFor(() => {
    expect(screen.getByTestId('content')).toBeInTheDocument()
    expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
  })
})
```

## Accessibility

- **ARIA Attributes**: Add `aria-label` for screen readers
  ```typescript
  <Skeleton aria-label="Loading user profile" />
  ```

- **ARIA Live Region**: Announce when loading completes
  ```typescript
  <div aria-live="polite" aria-busy={loading}>
    {loading ? <Skeleton /> : <Content />}
  </div>
  ```

- **Reduced Motion**: Pulse animation respects `prefers-reduced-motion`
  ```css
  @media (prefers-reduced-motion: reduce) {
    .animate-pulse {
      animation: none;
    }
  }
  ```

### Enhanced Accessibility

```typescript
import { Skeleton } from '@torch-ui/components'

function AccessibleSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <Skeleton className="h-32 w-full" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | <0.5kb |
| Dependencies | None |
| First render | <1ms |
| Animation | CSS-only (GPU accelerated) |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Use CSS animations**: Built-in `animate-pulse` is GPU-accelerated
2. **Avoid complex skeletons**: Simpler shapes render faster
3. **Reuse skeleton components**: Create reusable patterns
4. **Consider delayed showing**: Don't show skeleton for fast loads (<300ms)

```typescript
// Good: Simple skeleton
<Skeleton className="h-4 w-full" />

// Avoid: Overly complex nested skeletons
// (unless necessary for UX)
```

## Migration from Other Loaders

### From React Loading Skeleton

```diff
- import Skeleton from 'react-loading-skeleton'
+ import { Skeleton } from '@torch-ui/components'

- <Skeleton count={3} />
+ {[...Array(3)].map((_, i) => (
+   <Skeleton key={i} className="h-4 w-full mb-2" />
+ ))}
```

### From Material-UI Skeleton

```diff
- import { Skeleton } from '@mui/material'
+ import { Skeleton } from '@torch-ui/components'

- <Skeleton variant="text" width={210} height={60} />
+ <Skeleton className="h-[60px] w-[210px]" />

- <Skeleton variant="circular" width={40} height={40} />
+ <Skeleton className="h-10 w-10 rounded-full" />
```

### From Ant Design Skeleton

```diff
- import { Skeleton } from 'antd'
+ import { Skeleton } from '@torch-ui/components'

- <Skeleton active />
+ <Skeleton className="h-4 w-full" />

- <Skeleton.Avatar active size="large" />
+ <Skeleton className="h-16 w-16 rounded-full" />
```

## Best Practices

1. **Match content dimensions**: Skeleton should approximate final content size
   ```typescript
   // Content is h-32, skeleton should be too
   {loading ? <Skeleton className="h-32 w-full" /> : <Content />}
   ```

2. **Use appropriate shapes**: Circles for avatars, rectangles for text
   ```typescript
   <Skeleton className="rounded-full" /> // Avatar
   <Skeleton className="rounded-md" />   // Card
   ```

3. **Show hierarchy**: Vary skeleton sizes to indicate content importance
   ```typescript
   <Skeleton className="h-8 w-3/4 mb-2" /> // Title
   <Skeleton className="h-4 w-full mb-1" /> // Text
   <Skeleton className="h-4 w-5/6" />      // Text
   ```

4. **Don't overuse**: Too many skeletons can be distracting
   ```typescript
   // Good: Show skeleton for main content only
   {loading ? <Skeleton /> : <MainContent />}

   // Avoid: Skeletons for every tiny element
   ```

5. **Add aria-labels**: Help screen reader users understand loading state
   ```typescript
   <Skeleton aria-label="Loading article" />
   ```

6. **Consider delay**: Don't show skeleton for very fast loads
   ```typescript
   // Show skeleton only if loading > 300ms
   <DelayedSkeleton delay={300}>
     <Skeleton />
   </DelayedSkeleton>
   ```

7. **Create reusable patterns**: Build common skeleton layouts
   ```typescript
   export function CardSkeleton() {
     return (
       <div className="border rounded-lg p-4">
         <Skeleton className="h-48 w-full rounded mb-4" />
         <Skeleton className="h-4 w-3/4 mb-2" />
         <Skeleton className="h-3 w-full" />
       </div>
     )
   }
   ```

## Related Components

- [SpinLoading](./spin-loading.md) - Spinner loader for inline loading states
- [Card](./card.md) - Often used with skeleton for card layouts
- [Avatar](./avatar.md) - Avatar component that skeleton often mimics
