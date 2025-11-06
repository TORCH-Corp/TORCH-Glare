---
title: Toast
description: Customizable toast notification system built on react-hot-toast with themed variants and flexible positioning
group: Feedback & Status
keywords: [toast, notification, message, alert, feedback, react-hot-toast]
---

# Toast

> A customizable toast notification system built on react-hot-toast, providing temporary notifications with multiple variants (success, error, loading, info), automatic theming, and flexible positioning options.

## Installation

```bash
npm install react-hot-toast
```

## Import

```typescript
import { Toaster, toast } from '@torch-ui/components'
```

## Quick Examples

### Basic Setup

```typescript
import { Toaster, toast } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function App() {
  return (
    <div>
      <Toaster />
      <Button onClick={() => toast('Hello World!')}>
        Show Toast
      </Button>
    </div>
  )
}
```

### Success Toast

```typescript
import { toast } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function SuccessExample() {
  const handleSuccess = () => {
    toast.success('Operation completed successfully!')
  }

  return (
    <Button onClick={handleSuccess}>
      Save Changes
    </Button>
  )
}
```

### Error Toast

```typescript
import { toast } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function ErrorExample() {
  const handleError = () => {
    toast.error('Failed to save changes. Please try again.')
  }

  return (
    <Button onClick={handleError}>
      Trigger Error
    </Button>
  )
}
```

### Loading Toast

```typescript
import { toast } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function LoadingExample() {
  const handleAsync = async () => {
    const toastId = toast.loading('Uploading file...')

    try {
      await uploadFile()
      toast.success('File uploaded successfully!', { id: toastId })
    } catch (error) {
      toast.error('Upload failed', { id: toastId })
    }
  }

  return (
    <Button onClick={handleAsync}>
      Upload File
    </Button>
  )
}
```

### Promise Toast

```typescript
import { toast } from '@torch-ui/components'

function PromiseExample() {
  const saveData = async () => {
    const myPromise = fetch('/api/data').then(res => res.json())

    toast.promise(myPromise, {
      loading: 'Saving...',
      success: (data) => `Successfully saved ${data.name}`,
      error: 'Failed to save data',
    })
  }

  return (
    <Button onClick={saveData}>
      Save Data
    </Button>
  )
}
```

### Custom Duration

```typescript
import { toast } from '@torch-ui/components'

function CustomDuration() {
  return (
    <div className="space-x-2">
      <Button onClick={() => toast('Quick message', { duration: 1000 })}>
        1 Second
      </Button>

      <Button onClick={() => toast.success('Success!', { duration: 5000 })}>
        5 Seconds
      </Button>

      <Button onClick={() => toast('Permanent', { duration: Infinity })}>
        Never Dismiss
      </Button>
    </div>
  )
}
```

### Custom Position

```typescript
import { Toaster, toast } from '@torch-ui/components'

function PositionExample() {
  return (
    <div>
      <Toaster position="top-right" />

      <div className="space-x-2">
        <Button onClick={() => toast('Top Left')}>
          Default (Top Left)
        </Button>
        <Button onClick={() => toast('Custom position')}>
          Show Toast
        </Button>
      </div>
    </div>
  )
}
```

### Dismissible Toast

```typescript
import { toast } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function DismissibleExample() {
  const showDismissible = () => {
    const toastId = toast('Click X to dismiss', {
      duration: Infinity,
    })

    // Or programmatically dismiss
    setTimeout(() => toast.dismiss(toastId), 5000)
  }

  return (
    <div className="space-x-2">
      <Button onClick={showDismissible}>
        Show Dismissible
      </Button>

      <Button onClick={() => toast.dismiss()}>
        Dismiss All
      </Button>
    </div>
  )
}
```

### Custom Styling

```typescript
import { toast } from '@torch-ui/components'

function CustomStyleExample() {
  const showCustom = () => {
    toast.success('Custom styled toast!', {
      style: {
        background: '#10b981',
        color: '#ffffff',
        padding: '16px',
        borderRadius: '8px',
      },
      iconTheme: {
        primary: '#ffffff',
        secondary: '#10b981',
      },
    })
  }

  return (
    <Button onClick={showCustom}>
      Show Custom Toast
    </Button>
  )
}
```

### With Icon

```typescript
import { toast } from '@torch-ui/components'

function IconExample() {
  return (
    <div className="space-x-2">
      <Button onClick={() => toast('⚠️ Warning message')}>
        With Emoji
      </Button>

      <Button onClick={() => toast.custom(
        <div className="flex items-center gap-2">
          <i className="ri-rocket-fill text-2xl" />
          <span>Launching rocket!</span>
        </div>
      )}>
        Custom Icon
      </Button>
    </div>
  )
}
```

### Form Validation

```typescript
import { toast } from '@torch-ui/components'
import { InputField, Button } from '@torch-ui/components'
import { useState } from 'react'

function FormValidation() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error('Email is required')
      return
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    toast.success('Form submitted successfully!')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## API Reference

### Toaster Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'top-left'` | Toast position on screen |
| `reverseOrder` | `boolean` | `false` | Reverse toast display order |
| `gutter` | `number` | `8` | Gap between toasts (px) |
| `containerClassName` | `string` | - | Container CSS class |
| `containerStyle` | `CSSProperties` | - | Container inline styles |
| `toastOptions` | `ToastOptions` | - | Default toast options |

### Toast Function Methods

```typescript
// Basic toast
toast(message: string, options?: ToastOptions)

// Variant toasts
toast.success(message: string, options?: ToastOptions)
toast.error(message: string, options?: ToastOptions)
toast.loading(message: string, options?: ToastOptions)
toast.custom(element: ReactNode, options?: ToastOptions)

// Promise toast
toast.promise(promise: Promise, messages: PromiseMessages, options?: ToastOptions)

// Control toasts
toast.dismiss(toastId?: string) // Dismiss one or all
toast.remove(toastId?: string) // Remove from DOM
```

### ToastOptions

```typescript
interface ToastOptions {
  id?: string
  duration?: number // Milliseconds (default varies by type)
  position?: ToastPosition
  style?: CSSProperties
  className?: string
  iconTheme?: {
    primary: string
    secondary: string
  }
  ariaProps?: {
    role?: string
    'aria-live'?: string
  }
}
```

### Default Durations

| Type | Duration |
|------|----------|
| Default | 8000ms (8s) |
| Success | 3000ms (3s) |
| Error | 5000ms (5s) |
| Loading | 4000ms (4s) |
| Blank | 4000ms (4s) |

## TypeScript

### Full Type Definitions

```typescript
import { ComponentPropsWithoutRef } from 'react'
import { Toaster as ToasterComponent, toast } from 'react-hot-toast'

type ToasterProps = ComponentPropsWithoutRef<typeof ToasterComponent>

interface CustomToasterProps extends ToasterProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  reverseOrder?: boolean
  gutter?: number
  containerClassName?: string
  containerStyle?: React.CSSProperties
  toastOptions?: {
    className?: string
    duration?: number
    style?: React.CSSProperties
    success?: ToastOptions
    error?: ToastOptions
    loading?: ToastOptions
    blank?: ToastOptions
  }
}

// Usage
const showToast = (message: string): string => {
  return toast(message) // Returns toast ID
}

const dismissToast = (id: string): void => {
  toast.dismiss(id)
}
```

## Common Patterns

### API Error Handling

```typescript
import { toast } from '@torch-ui/components'

async function fetchData() {
  try {
    const response = await fetch('/api/data')

    if (!response.ok) {
      if (response.status === 401) {
        toast.error('Unauthorized. Please login again.')
      } else if (response.status === 404) {
        toast.error('Resource not found')
      } else if (response.status >= 500) {
        toast.error('Server error. Please try again later.')
      } else {
        toast.error('Something went wrong')
      }
      return
    }

    const data = await response.json()
    toast.success('Data loaded successfully')
    return data
  } catch (error) {
    toast.error('Network error. Check your connection.')
  }
}
```

### Multi-Step Process

```typescript
import { toast } from '@torch-ui/components'

async function multiStepProcess() {
  const toastId = toast.loading('Step 1: Validating data...')

  try {
    await validateData()
    toast.loading('Step 2: Processing...', { id: toastId })

    await processData()
    toast.loading('Step 3: Saving...', { id: toastId })

    await saveData()
    toast.success('All steps completed!', { id: toastId })
  } catch (error) {
    toast.error('Process failed', { id: toastId })
  }
}
```

### Undo Action

```typescript
import { toast } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function UndoExample() {
  const handleDelete = (item: Item) => {
    // Store deleted item
    const deleted = { ...item }

    toast.custom(
      (t) => (
        <div className="flex items-center gap-4">
          <span>Item deleted</span>
          <Button
            size="S"
            onClick={() => {
              restoreItem(deleted)
              toast.dismiss(t.id)
              toast.success('Item restored')
            }}
          >
            Undo
          </Button>
        </div>
      ),
      { duration: 5000 }
    )

    // Actually delete after timeout
    setTimeout(() => permanentlyDelete(item.id), 5000)
  }

  return <Button onClick={() => handleDelete(item)}>Delete</Button>
}
```

### Rate Limited Actions

```typescript
import { toast } from '@torch-ui/components'

let lastToastTime = 0
const TOAST_COOLDOWN = 2000 // 2 seconds

function showRateLimitedToast(message: string) {
  const now = Date.now()

  if (now - lastToastTime < TOAST_COOLDOWN) {
    return // Ignore if within cooldown
  }

  lastToastTime = now
  toast(message)
}

// Usage
function SpamProtectedButton() {
  return (
    <Button onClick={() => showRateLimitedToast('Action triggered')}>
      Click Me (Rate Limited)
    </Button>
  )
}
```

## Testing

### Unit Test Examples

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { Toaster, toast } from '@torch-ui/components'
import userEvent from '@testing-library/user-event'

describe('Toast', () => {
  it('renders toaster component', () => {
    render(<Toaster />)
    // Toaster container should be in document
    expect(document.querySelector('[data-react-hot-toast]')).toBeInTheDocument()
  })

  it('shows toast message', async () => {
    render(
      <div>
        <Toaster />
        <button onClick={() => toast('Test message')}>Show</button>
      </div>
    )

    await userEvent.click(screen.getByText('Show'))

    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument()
    })
  })

  it('shows success toast', async () => {
    render(
      <div>
        <Toaster />
        <button onClick={() => toast.success('Success!')}>Success</button>
      </div>
    )

    await userEvent.click(screen.getByText('Success'))

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument()
    })
  })

  it('dismisses toast', async () => {
    render(
      <div>
        <Toaster />
        <button onClick={() => {
          const id = toast('Dismissible')
          setTimeout(() => toast.dismiss(id), 100)
        }}>
          Show & Dismiss
        </button>
      </div>
    )

    await userEvent.click(screen.getByText('Show & Dismiss'))

    await waitFor(() => {
      expect(screen.getByText('Dismissible')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByText('Dismissible')).not.toBeInTheDocument()
    }, { timeout: 200 })
  })

  it('handles promise toast', async () => {
    const mockPromise = Promise.resolve({ name: 'Test' })

    render(
      <div>
        <Toaster />
        <button onClick={() => {
          toast.promise(mockPromise, {
            loading: 'Loading...',
            success: (data) => `Got ${data.name}`,
            error: 'Error',
          })
        }}>
          Promise Toast
        </button>
      </div>
    )

    await userEvent.click(screen.getByText('Promise Toast'))

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Got Test')).toBeInTheDocument()
    })
  })
})
```

## Accessibility

- **ARIA Attributes**: `role="status"` and `aria-live="polite"` for screen readers
- **Keyboard Navigation**: Toasts are announced but don't trap focus
- **Focus Management**: Does not steal focus from active elements
- **Color Contrast**: Uses CSS variables with WCAG AA compliant colors
- **Duration**: Success toasts shorter (3s), errors longer (5s) for readability

### Accessibility Best Practices

```typescript
// Use appropriate toast types
toast.error('Form validation failed') // Error states
toast.success('Settings saved') // Success confirmations

// Provide clear, concise messages
toast('File uploaded successfully') // ✅ Clear
toast('Operation complete') // ❌ Too vague

// Don't rely solely on color
toast.error('❌ Failed to save') // Icon + text
toast.success('✅ Saved successfully') // Icon + text
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~8kb |
| Bundle size (gzipped) | ~3kb |
| Dependencies | react-hot-toast (~8kb) |
| Max simultaneous toasts | 20 (configurable) |
| Animation performance | 60fps |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Limit simultaneous toasts**: Use `visibleToasts` option
   ```typescript
   <Toaster toastOptions={{ visibleToasts: 3 }} />
   ```

2. **Reuse toast IDs**: Update existing instead of creating new
   ```typescript
   const toastId = 'unique-id'
   toast.loading('Loading...', { id: toastId })
   toast.success('Done!', { id: toastId })
   ```

3. **Dismiss old toasts**: Clean up before showing new ones
   ```typescript
   toast.dismiss() // Clear all
   toast.success('New message')
   ```

## Styling

### Custom Theme

```typescript
<Toaster
  toastOptions={{
    style: {
      background: '#363636',
      color: '#fff',
      borderRadius: '8px',
      padding: '16px',
    },
    success: {
      style: {
        background: '#10b981',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10b981',
      },
    },
    error: {
      style: {
        background: '#ef4444',
      },
    },
  }}
/>
```

### Default Styling

- Background: Uses CSS variables (`--background-presentation-state-*`)
- Border radius: 16px
- Colors: Theme-aware (success: green, error: red, warning: yellow)
- Icons: Matching color scheme with themed backgrounds
- Animations: Slide-in from position

## Best Practices

1. **Use appropriate variants**: Match toast type to action result
   ```typescript
   toast.success('Saved!') // Successful actions
   toast.error('Failed') // Errors
   toast.loading('Processing...') // Ongoing operations
   ```

2. **Keep messages concise**: One line when possible
   ```typescript
   toast('Email sent') // ✅
   toast('Your email has been successfully sent to the recipient') // ❌
   ```

3. **Update loading toasts**: Use same ID to update progress
   ```typescript
   const id = toast.loading('Uploading...')
   toast.success('Uploaded!', { id })
   ```

4. **Handle errors gracefully**: Provide actionable feedback
   ```typescript
   toast.error('Failed to save. Please check your connection.')
   ```

5. **Avoid toast spam**: Rate limit or dismiss previous toasts
   ```typescript
   toast.dismiss() // Clear old toasts
   toast('New message')
   ```

6. **Test with screen readers**: Ensure messages are announced

7. **Use promises for async operations**: Automatic state handling
   ```typescript
   toast.promise(apiCall(), { loading: '...', success: '✅', error: '❌' })
   ```

## Related Components

- [FieldHint](./field-hint.md) - Inline form field hints and alerts
- [SpinLoading](./spin-loading.md) - Loading spinner component
- [Dialog](./dialog.md) - Modal dialogs for blocking interactions
- [AlertDialog](./alert-dialog.md) - Alert dialogs for confirmations
