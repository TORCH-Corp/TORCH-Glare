---
title: FieldHint
description: Inline hint and alert component for form fields with state variants (info, warning, error, success)
group: Feedback & Status
keywords: [field-hint, alert, validation, message, form, feedback, inline]
---

# FieldHint

> An inline hint and alert component designed for form field feedback. Provides visual status indicators with customizable icons and messages in four variants: info, warning, error, and success.

## Installation

No external dependencies required.

## Import

```typescript
import { FieldHint } from '@torch-ui/components'
import type { FieldHintProps } from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { FieldHint } from '@torch-ui/components'

function Example() {
  return (
    <FieldHint
      state="info"
      label="This is an informational hint"
    />
  )
}
```

### All States

```typescript
import { FieldHint } from '@torch-ui/components'

function AllStates() {
  return (
    <div className="space-y-2">
      <FieldHint
        state="info"
        label="This is general information"
      />

      <FieldHint
        state="warning"
        label="This requires your attention"
      />

      <FieldHint
        state="error"
        label="There is an error with your input"
      />

      <FieldHint
        state="success"
        label="Your input is valid"
      />
    </div>
  )
}
```

### With Form Field

```typescript
import { FieldHint } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { useState } from 'react'

function WithFormField() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const validateEmail = (value: string) => {
    if (!value) {
      setError('Email is required')
    } else if (!value.includes('@')) {
      setError('Please enter a valid email')
    } else {
      setError('')
    }
  }

  return (
    <div className="space-y-2">
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => validateEmail(email)}
      />

      {error && (
        <FieldHint state="error" label={error} />
      )}

      {!error && email && (
        <FieldHint state="success" label="Email looks good!" />
      )}
    </div>
  )
}
```

### Custom Icon

```typescript
import { FieldHint } from '@torch-ui/components'

function CustomIcon() {
  return (
    <div className="space-y-2">
      <FieldHint
        state="info"
        icon={<i className="ri-lightbulb-line" />}
        label="Pro tip: Use a strong password"
      />

      <FieldHint
        state="warning"
        icon={<i className="ri-alarm-warning-line" />}
        label="Session expires in 5 minutes"
      />

      <FieldHint
        state="success"
        icon={<i className="ri-star-fill" />}
        label="Premium feature unlocked!"
      />
    </div>
  )
}
```

### Password Validation

```typescript
import { FieldHint } from '@torch-ui/components'
import { InputField, PasswordLevel } from '@torch-ui/components'
import { useState } from 'react'

function PasswordValidation() {
  const [password, setPassword] = useState('')

  const getPasswordFeedback = (pwd: string) => {
    if (!pwd) {
      return { state: 'info', label: 'Password must be at least 6 characters' }
    }

    if (pwd.length < 6) {
      return { state: 'error', label: 'Password is too short' }
    }

    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    const hasUppercase = /[A-Z]/.test(pwd)

    if (!hasSymbol || !hasUppercase) {
      return {
        state: 'warning',
        label: 'Add uppercase letters and symbols for better security',
      }
    }

    return { state: 'success', label: 'Strong password!' }
  }

  const feedback = getPasswordFeedback(password)

  return (
    <div className="space-y-2">
      <InputField
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <PasswordLevel value={password} />

      <FieldHint
        state={feedback.state as any}
        label={feedback.label}
      />
    </div>
  )
}
```

### Form Validation

```typescript
import { FieldHint } from '@torch-ui/components'
import { InputField, Button } from '@torch-ui/components'
import { useState } from 'react'

function FormValidation() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email'
    }

    if (formData.age && parseInt(formData.age) < 18) {
      newErrors.age = 'You must be 18 or older'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      console.log('Form submitted:', formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <InputField
          label="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        {errors.username && (
          <FieldHint state="error" label={errors.username} />
        )}
      </div>

      <div className="space-y-2">
        <InputField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && (
          <FieldHint state="error" label={errors.email} />
        )}
      </div>

      <div className="space-y-2">
        <InputField
          label="Age"
          type="number"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        />
        {errors.age ? (
          <FieldHint state="error" label={errors.age} />
        ) : (
          <FieldHint state="info" label="Must be 18 or older" />
        )}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  )
}
```

### API Response Feedback

```typescript
import { FieldHint } from '@torch-ui/components'
import { InputField, Button } from '@torch-ui/components'
import { useState } from 'react'

function APIFeedback() {
  const [username, setUsername] = useState('')
  const [checking, setChecking] = useState(false)
  const [status, setStatus] = useState<{
    state: 'success' | 'error' | 'warning'
    message: string
  } | null>(null)

  const checkAvailability = async () => {
    if (!username) return

    setChecking(true)
    setStatus(null)

    try {
      const response = await fetch(`/api/check-username?username=${username}`)
      const data = await response.json()

      if (data.available) {
        setStatus({
          state: 'success',
          message: 'Username is available!',
        })
      } else {
        setStatus({
          state: 'error',
          message: 'Username is already taken',
        })
      }
    } catch (error) {
      setStatus({
        state: 'warning',
        message: 'Could not check availability. Please try again.',
      })
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="space-y-2">
      <InputField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        childrenSide={
          <Button
            size="S"
            onClick={checkAvailability}
            disabled={checking || !username}
          >
            {checking ? 'Checking...' : 'Check'}
          </Button>
        }
      />

      {status && (
        <FieldHint state={status.state} label={status.message} />
      )}
    </div>
  )
}
```

### File Upload Feedback

```typescript
import { FieldHint } from '@torch-ui/components'
import { useState } from 'react'

function FileUploadFeedback() {
  const [file, setFile] = useState<File | null>(null)
  const [feedback, setFeedback] = useState<{
    state: 'info' | 'warning' | 'error' | 'success'
    message: string
  }>({ state: 'info', message: 'Max file size: 5MB' })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) {
      setFeedback({ state: 'info', message: 'Max file size: 5MB' })
      return
    }

    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

    if (!allowedTypes.includes(selectedFile.type)) {
      setFeedback({
        state: 'error',
        message: 'Only JPEG, PNG, and GIF files are allowed',
      })
      return
    }

    if (selectedFile.size > maxSize) {
      setFeedback({
        state: 'error',
        message: 'File is too large. Maximum size is 5MB',
      })
      return
    }

    if (selectedFile.size > maxSize * 0.8) {
      setFeedback({
        state: 'warning',
        message: `File size: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB (approaching limit)`,
      })
    } else {
      setFeedback({
        state: 'success',
        message: `File ready: ${selectedFile.name}`,
      })
    }

    setFile(selectedFile)
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif"
      />

      <FieldHint state={feedback.state} label={feedback.message} />
    </div>
  )
}
```

### Multi-line Message

```typescript
import { FieldHint } from '@torch-ui/components'

function MultilineMessage() {
  return (
    <div className="space-y-2">
      <FieldHint
        state="info"
        label={`Your password must include:
• At least 8 characters
• One uppercase letter
• One number
• One special character`}
      />

      <FieldHint
        state="warning"
        label={`Warning: Your session is about to expire.
Please save your work before continuing.`}
      />
    </div>
  )
}
```

### Dynamic Theme

```typescript
import { FieldHint } from '@torch-ui/components'
import { useState } from 'react'

function DynamicTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <div className={theme === 'dark' ? 'bg-gray-900 p-4' : 'bg-white p-4'}>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle Theme
      </button>

      <div className="space-y-2 mt-4">
        <FieldHint
          theme={theme}
          state="info"
          label="Information message"
        />
        <FieldHint
          theme={theme}
          state="success"
          label="Success message"
        />
      </div>
    </div>
  )
}
```

### Conditional Rendering

```typescript
import { FieldHint } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { useState } from 'react'

function ConditionalHints() {
  const [value, setValue] = useState('')
  const [touched, setTouched] = useState(false)

  const showError = touched && !value
  const showSuccess = touched && value.length >= 5

  return (
    <div className="space-y-2">
      <InputField
        label="Name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => setTouched(true)}
      />

      {!touched && (
        <FieldHint state="info" label="Enter your full name" />
      )}

      {showError && (
        <FieldHint state="error" label="Name is required" />
      )}

      {showSuccess && (
        <FieldHint state="success" label="Looks good!" />
      )}
    </div>
  )
}
```

## API Reference

### FieldHint Props

Extends all standard HTML div attributes.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | **required** | Message or content to display |
| `state` | `'info' \| 'warning' \| 'error' \| 'success'` | `'info'` | Visual state variant |
| `icon` | `ReactNode` | - | Custom icon (uses default if not provided) |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Theme variant |
| `className` | `string` | - | Additional CSS classes |
| ...HTMLDivElement | - | - | All div attributes |

### Default Icons

| State | Icon | RemixIcon Class |
|-------|------|-----------------|
| `info` | ⓘ | `ri-error-warning-fill` |
| `warning` | ⚠ | `ri-error-warning-fill` |
| `error` | ⚠ | `ri-alert-fill` |
| `success` | ✓ | `ri-checkbox-circle-fill` |

### State Colors

| State | Background | Icon Background |
|-------|------------|-----------------|
| `info` | Information secondary | Information primary |
| `warning` | Warning secondary | Warning primary |
| `error` | Negative secondary | Negative primary |
| `success` | Success secondary | Success primary |

## TypeScript

### Full Type Definitions

```typescript
import { HTMLAttributes, ReactNode } from 'react'

type FieldHintVariant = 'success' | 'error' | 'warning' | 'info'

interface FieldHintProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode
  state?: FieldHintVariant
  icon?: ReactNode
  theme?: 'light' | 'dark' | 'default'
}

export const FieldHint: React.FC<FieldHintProps>
```

### Usage with Types

```typescript
import { FieldHint } from '@torch-ui/components'
import { useState } from 'react'

type ValidationState = {
  state: 'success' | 'error' | 'warning' | 'info'
  message: string
}

function TypedExample() {
  const [validation, setValidation] = useState<ValidationState>({
    state: 'info',
    message: 'Enter your email',
  })

  return (
    <FieldHint
      state={validation.state}
      label={validation.message}
    />
  )
}
```

## Common Patterns

### Validation Hook

```typescript
import { FieldHint } from '@torch-ui/components'
import { useState, useCallback } from 'react'

function useFieldValidation<T>(
  initialValue: T,
  validator: (value: T) => string | null
) {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const validate = useCallback(() => {
    const errorMessage = validator(value)
    setError(errorMessage)
    return !errorMessage
  }, [value, validator])

  const handleBlur = useCallback(() => {
    setTouched(true)
    validate()
  }, [validate])

  return {
    value,
    setValue,
    error,
    touched,
    handleBlur,
    validate,
    showError: touched && error,
  }
}

// Usage
function ValidatedField() {
  const field = useFieldValidation('', (value) =>
    !value ? 'Field is required' : value.length < 3 ? 'Too short' : null
  )

  return (
    <div className="space-y-2">
      <InputField
        value={field.value}
        onChange={(e) => field.setValue(e.target.value)}
        onBlur={field.handleBlur}
      />

      {field.showError && (
        <FieldHint state="error" label={field.error!} />
      )}
    </div>
  )
}
```

### Form Field Wrapper

```typescript
import { FieldHint } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { ReactNode } from 'react'

interface FieldWrapperProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  required?: boolean
}

function FieldWrapper({
  label,
  value,
  onChange,
  error,
  hint,
  required,
}: FieldWrapperProps) {
  return (
    <div className="space-y-2">
      <InputField
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />

      {error ? (
        <FieldHint state="error" label={error} />
      ) : hint ? (
        <FieldHint state="info" label={hint} />
      ) : null}
    </div>
  )
}
```

## Testing

### Unit Test Examples

```typescript
import { render, screen } from '@testing-library/react'
import { FieldHint } from '@torch-ui/components'

describe('FieldHint', () => {
  it('renders label text', () => {
    render(<FieldHint label="Test message" />)

    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('renders with different states', () => {
    const { rerender, container } = render(
      <FieldHint state="info" label="Info" />
    )

    expect(container.querySelector('[class*="information"]')).toBeInTheDocument()

    rerender(<FieldHint state="error" label="Error" />)
    expect(container.querySelector('[class*="negative"]')).toBeInTheDocument()

    rerender(<FieldHint state="success" label="Success" />)
    expect(container.querySelector('[class*="success"]')).toBeInTheDocument()

    rerender(<FieldHint state="warning" label="Warning" />)
    expect(container.querySelector('[class*="warning"]')).toBeInTheDocument()
  })

  it('renders default icon for each state', () => {
    const { rerender } = render(
      <FieldHint state="error" label="Error" />
    )

    expect(document.querySelector('.ri-alert-fill')).toBeInTheDocument()

    rerender(<FieldHint state="success" label="Success" />)
    expect(document.querySelector('.ri-checkbox-circle-fill')).toBeInTheDocument()

    rerender(<FieldHint state="warning" label="Warning" />)
    expect(document.querySelector('.ri-error-warning-fill')).toBeInTheDocument()
  })

  it('renders custom icon', () => {
    render(
      <FieldHint
        state="info"
        label="Custom"
        icon={<span data-testid="custom-icon">★</span>}
      />
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('applies theme correctly', () => {
    const { container } = render(
      <FieldHint label="Test" theme="dark" />
    )

    expect(container.querySelector('[data-theme="dark"]')).toBeInTheDocument()
  })
})
```

## Accessibility

- **Color Contrast**: All state colors meet WCAG AA standards
- **Icons + Text**: Combines visual and textual indicators
- **Screen Readers**: Content announced in reading order
- **ARIA**: Consider adding `role="alert"` for errors
- **Focus Management**: Non-interactive, doesn't affect tab order

### Accessibility Best Practices

```typescript
// Add role for error messages
<FieldHint
  state="error"
  label="Invalid email address"
  role="alert"
  aria-live="polite"
/>

// Link hint to field
<div>
  <InputField
    id="email-field"
    aria-describedby="email-hint"
  />
  <FieldHint
    id="email-hint"
    state="info"
    label="We'll never share your email"
  />
</div>

// Announce validation errors
<FieldHint
  state="error"
  label={error}
  role="alert"
  aria-atomic="true"
/>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~2kb |
| Bundle size (gzipped) | ~0.8kb |
| Dependencies | None |
| Re-renders | Only on prop changes |
| Tree-shakeable | ✅ |

## Styling

### Custom Styles

```typescript
// Override colors
<FieldHint
  state="error"
  className="!bg-red-100 [&>section]:!bg-red-500"
  label="Custom styled error"
/>

// Custom size
<FieldHint
  state="info"
  className="text-xs"
  label="Small hint text"
/>
```

### Default Styling

- Border radius: 4px
- Minimum height: 26px
- Icon size: 26x26px (18px font)
- Font size: 14px (small)
- Padding: 1px text, 4px container
- Text wrapping: Enabled with word-break

## Best Practices

1. **Use appropriate states**: Match state to message severity
   ```typescript
   <FieldHint state="error" label="Required field" />
   <FieldHint state="warning" label="Recommended action" />
   <FieldHint state="success" label="Valid input" />
   <FieldHint state="info" label="Helpful tip" />
   ```

2. **Keep messages concise**: One or two lines maximum

3. **Show one hint at a time**: Avoid multiple hints per field

4. **Position below input**: Maintain consistent layout

5. **Use with validation**: Show errors after user interaction
   ```typescript
   {touched && error && <FieldHint state="error" label={error} />}
   ```

6. **Provide actionable feedback**: Tell users how to fix errors

7. **Test color accessibility**: Ensure sufficient contrast

## Related Components

- [Toast](./toast.md) - Global notification messages
- [InputField](./input-field.md) - Input fields with validation
- [PasswordLevel](./password-level.md) - Password strength indicator
- [SpinLoading](./spin-loading.md) - Loading states
