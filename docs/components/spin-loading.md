---
title: SpinLoading
description: Animated loading spinner with theme variants and customizable sizes for indicating loading states
group: Feedback & Status
keywords: [loading, spinner, loader, animation, spin, progress]
---

# SpinLoading

> An animated loading spinner component with light/dark theme variants and three size options. Features a smooth rotating gradient ring with support for custom content in the center.

## Installation

No external dependencies required.

## Import

```typescript
import { SpinLoading } from '@torch-ui/components'
import type { SpinLoadingProps } from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { SpinLoading } from '@torch-ui/components'

function Example() {
  return <SpinLoading />
}
```

### With Different Sizes

```typescript
import { SpinLoading } from '@torch-ui/components'

function SizesExample() {
  return (
    <div className="space-y-4">
      <SpinLoading size="S" />
      <SpinLoading size="M" />
      <SpinLoading size="L" />
    </div>
  )
}
```

### Dark Theme

```typescript
import { SpinLoading } from '@torch-ui/components'

function DarkTheme() {
  return (
    <div className="bg-black p-8">
      <SpinLoading theme="dark" size="M" />
    </div>
  )
}
```

### Light Theme

```typescript
import { SpinLoading } from '@torch-ui/components'

function LightTheme() {
  return (
    <div className="bg-white p-8">
      <SpinLoading theme="light" size="M" />
    </div>
  )
}
```

### With Center Content

```typescript
import { SpinLoading } from '@torch-ui/components'

function WithContent() {
  return (
    <SpinLoading size="M">
      <div className="text-center">
        <p className="text-sm font-medium">Loading...</p>
        <p className="text-xs text-gray-500">Please wait</p>
      </div>
    </SpinLoading>
  )
}
```

### With Percentage

```typescript
import { SpinLoading } from '@torch-ui/components'
import { useState, useEffect } from 'react'

function PercentageLoader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 10))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <SpinLoading size="M">
      <div className="text-center">
        <p className="text-2xl font-bold">{progress}%</p>
      </div>
    </SpinLoading>
  )
}
```

### Loading Overlay

```typescript
import { SpinLoading } from '@torch-ui/components'

function LoadingOverlay({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}

      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <SpinLoading size="M" theme="dark" />
        </div>
      )}
    </div>
  )
}

// Usage
function App() {
  const [loading, setLoading] = useState(false)

  return (
    <LoadingOverlay loading={loading}>
      <div className="p-8">
        <h1>Content</h1>
        <button onClick={() => setLoading(!loading)}>
          Toggle Loading
        </button>
      </div>
    </LoadingOverlay>
  )
}
```

### Full Page Loading

```typescript
import { SpinLoading } from '@torch-ui/components'

function FullPageLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <SpinLoading size="L" theme="light">
        <div className="text-center">
          <p className="text-lg font-semibold">Loading Application...</p>
        </div>
      </SpinLoading>
    </div>
  )
}
```

### Data Loading State

```typescript
import { SpinLoading } from '@torch-ui/components'
import { useEffect, useState } from 'react'

function DataLoader() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchData()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <SpinLoading size="M">
          <p className="text-sm">Loading data...</p>
        </SpinLoading>
      </div>
    )
  }

  return <div>{/* Render data */}</div>
}
```

### Card Loading

```typescript
import { SpinLoading } from '@torch-ui/components'
import { Card } from '@torch-ui/components'

function CardWithLoading({ loading }: { loading: boolean }) {
  return (
    <Card className="p-6">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <SpinLoading size="S">
            <p className="text-xs">Loading...</p>
          </SpinLoading>
        </div>
      ) : (
        <div>
          <h3>Card Content</h3>
          <p>Content loaded successfully</p>
        </div>
      )}
    </Card>
  )
}
```

### Button Loading State

```typescript
import { SpinLoading } from '@torch-ui/components'
import { Button } from '@torch-ui/components'
import { useState } from 'react'

function LoadingButton() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await performAction()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className="relative min-w-[120px]"
    >
      {loading ? (
        <SpinLoading size="S" className="!w-[20px] !h-[20px]" />
      ) : (
        'Submit'
      )}
    </Button>
  )
}
```

## API Reference

### SpinLoading Props

Extends all standard HTML div attributes.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'S' \| 'M' \| 'L'` | `'M'` | Spinner size |
| `theme` | `'light' \| 'dark' \| 'default'` | `'light'` | Theme variant |
| `children` | `ReactNode` | - | Center content |
| `className` | `string` | - | Additional CSS classes |
| ...HTMLDivElement | - | - | All div attributes |

### Size Specifications

| Size | Dimensions | Use Case |
|------|------------|----------|
| `S` | 200x200px | Small components, buttons |
| `M` | 400x400px | Cards, sections |
| `L` | 500x500px | Full page, major loading states |

## TypeScript

### Full Type Definitions

```typescript
import { HTMLAttributes } from 'react'

interface SpinLoadingProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'S' | 'M' | 'L'
  theme?: 'light' | 'dark' | 'default'
  children?: React.ReactNode
}

export const SpinLoading: React.FC<SpinLoadingProps>
```

### Usage with Types

```typescript
import { SpinLoading } from '@torch-ui/components'
import { useState } from 'react'

function TypedExample() {
  const [size, setSize] = useState<'S' | 'M' | 'L'>('M')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <div>
      <SpinLoading
        size={size}
        theme={theme}
        aria-label="Loading content"
      >
        <p>Loading...</p>
      </SpinLoading>

      <select onChange={(e) => setSize(e.target.value as 'S' | 'M' | 'L')}>
        <option value="S">Small</option>
        <option value="M">Medium</option>
        <option value="L">Large</option>
      </select>
    </div>
  )
}
```

## Common Patterns

### Async Operation Wrapper

```typescript
import { SpinLoading } from '@torch-ui/components'
import { ReactNode, useState } from 'react'

function AsyncWrapper({
  children,
  onLoad,
}: {
  children: ReactNode
  onLoad: () => Promise<void>
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    setLoading(true)
    onLoad()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [onLoad])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <SpinLoading size="M" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return <>{children}</>
}
```

### Suspense-Like Fallback

```typescript
import { SpinLoading } from '@torch-ui/components'
import { Suspense } from 'react'

function SuspenseWithLoading({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <SpinLoading size="L">
            <p>Loading page...</p>
          </SpinLoading>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
```

### Loading State Manager

```typescript
import { SpinLoading } from '@torch-ui/components'
import { createContext, useContext, useState, ReactNode } from 'react'

const LoadingContext = createContext({
  loading: false,
  setLoading: (loading: boolean) => {},
})

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <SpinLoading size="M" theme="dark" />
        </div>
      )}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)

// Usage
function MyComponent() {
  const { setLoading } = useLoading()

  const handleAction = async () => {
    setLoading(true)
    try {
      await performAction()
    } finally {
      setLoading(false)
    }
  }

  return <button onClick={handleAction}>Do Action</button>
}
```

## Testing

### Unit Test Examples

```typescript
import { render, screen } from '@testing-library/react'
import { SpinLoading } from '@torch-ui/components'

describe('SpinLoading', () => {
  it('renders spinner', () => {
    render(<SpinLoading />)

    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<SpinLoading size="S" />)
    let spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toHaveClass('w-[200px]')

    rerender(<SpinLoading size="M" />)
    spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toHaveClass('w-[400px]')

    rerender(<SpinLoading size="L" />)
    spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toHaveClass('w-[500px]')
  })

  it('renders children in center', () => {
    render(
      <SpinLoading>
        <p>Loading text</p>
      </SpinLoading>
    )

    expect(screen.getByText('Loading text')).toBeInTheDocument()
  })

  it('applies theme correctly', () => {
    const { rerender } = render(<SpinLoading theme="light" />)

    let svg = document.querySelector('[data-theme="light"]')
    expect(svg).toBeInTheDocument()

    rerender(<SpinLoading theme="dark" />)
    svg = document.querySelector('[data-theme="dark"]')
    expect(svg).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<SpinLoading className="custom-class" />)

    const spinner = screen.getByRole('status', { hidden: true })
    expect(spinner).toHaveClass('custom-class')
  })

  it('has spinning animation', () => {
    render(<SpinLoading />)

    const svg = document.querySelector('svg')
    expect(svg).toHaveClass('animate-spin')
  })
})
```

### Integration Test

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { SpinLoading } from '@torch-ui/components'

describe('SpinLoading Integration', () => {
  it('shows loading state during async operation', async () => {
    function TestComponent() {
      const [loading, setLoading] = useState(true)

      useEffect(() => {
        setTimeout(() => setLoading(false), 1000)
      }, [])

      return loading ? (
        <SpinLoading>
          <p>Loading...</p>
        </SpinLoading>
      ) : (
        <p>Content loaded</p>
      )
    }

    render(<TestComponent />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Content loaded')).toBeInTheDocument()
    }, { timeout: 1500 })
  })
})
```

## Accessibility

- **ARIA Role**: Implicit `role="status"` for screen readers
- **ARIA Label**: Add `aria-label` for context
- **Keyboard**: Not interactive, doesn't affect keyboard navigation
- **Focus**: Does not trap or steal focus
- **Animation**: Uses `prefers-reduced-motion` media query support
- **Color Contrast**: Gradient provides sufficient visibility

### Accessibility Best Practices

```typescript
// Provide context with aria-label
<SpinLoading aria-label="Loading user profile" />

// Use with live region for updates
<div aria-live="polite" aria-busy={loading}>
  {loading ? (
    <SpinLoading>
      <span className="sr-only">Loading content...</span>
    </SpinLoading>
  ) : (
    <Content />
  )}
</div>

// Hide decorative content
<SpinLoading aria-hidden={false}>
  <span>Loading...</span> {/* Announced by screen readers */}
</SpinLoading>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~4kb |
| Bundle size (gzipped) | ~1.5kb |
| Dependencies | None |
| Animation | CSS-only (60fps) |
| Repaints | Minimal (transform-only) |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Use CSS animations**: Already optimized with `transform` only
2. **Avoid unnecessary re-renders**: Wrap in `memo` if parent re-renders frequently
   ```typescript
   const MemoizedSpinner = memo(SpinLoading)
   ```
3. **Conditional rendering**: Only render when needed
   ```typescript
   {loading && <SpinLoading />}
   ```
4. **Proper size selection**: Use smallest size that fits the use case

## Styling

### Custom Styles

```typescript
// Override size
<SpinLoading
  size="M"
  className="!w-[300px] !h-[300px]"
/>

// Custom colors (theme-specific)
<SpinLoading
  theme="light"
  style={{
    '--spinner-primary': '#3b82f6',
    '--spinner-secondary': '#1e40af',
  } as React.CSSProperties}
/>

// With backdrop
<div className="relative">
  <SpinLoading className="backdrop-blur-sm" />
</div>
```

### Default Styling

- **Light Theme**: Purple gradient (`#D500F9` to `#5317FF`)
- **Dark Theme**: Purple gradient (`#b900d8` to `#e75cff`)
- **Animation**: Infinite spin (2s duration)
- **Effects**: Gaussian blur filters for glow effect
- **Center Content**: Absolute positioning with transform

## Animation Details

### Spin Animation

```css
.animate-spin {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .animate-spin {
    animation-duration: 4s; /* Slower */
  }
}
```

## Best Practices

1. **Match size to context**: Use S for buttons, M for cards, L for pages
2. **Provide loading text**: Add children for screen reader context
   ```typescript
   <SpinLoading><span className="sr-only">Loading...</span></SpinLoading>
   ```
3. **Use appropriate theme**: Match background (light on dark, dark on light)
4. **Show progress when possible**: Add percentage or status text
   ```typescript
   <SpinLoading>{progress}%</SpinLoading>
   ```
5. **Don't block unnecessarily**: Use inline loading for small sections
6. **Timeout long operations**: Show error after reasonable time
7. **Test with reduced motion**: Ensure accessible for motion-sensitive users

## Related Components

- [Toast](./toast.md) - Toast notifications for feedback
- [FieldHint](./field-hint.md) - Inline field hints and alerts
- [Skeleton](./skeleton.md) - Content placeholder loading states
- [PasswordLevel](./password-level.md) - Password strength indicator
