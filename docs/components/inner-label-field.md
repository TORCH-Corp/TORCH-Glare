---
title: InnerLabelField
description: Floating label input field with animated label that moves on focus and when value exists
group: Labels & Text
keywords: [inner-label, floating-label, input, animated, material-design]
---

# InnerLabelField

> An input field with an animated floating label that appears inside the input and animates to a smaller size when focused or when the field has a value. Inspired by Material Design's floating label pattern.

## Installation

No external dependencies required.

## Import

```typescript
import { InnerLabelField } from '@torch-ui/components'
import type { InnerLabelFieldProps } from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { InnerLabelField } from '@torch-ui/components'
import { useState } from 'react'

function Example() {
  const [value, setValue] = useState('')

  return (
    <InnerLabelField
      label="Email Address"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
```

### With Required Indicator

```typescript
import { InnerLabelField } from '@torch-ui/components'

function RequiredField() {
  return (
    <InnerLabelField
      label="Full Name"
      required
    />
  )
}
```

### Different Input Types

```typescript
import { InnerLabelField } from '@torch-ui/components'
import { useState } from 'react'

function InputTypes() {
  return (
    <div className="space-y-4">
      <InnerLabelField
        label="Email"
        type="email"
      />

      <InnerLabelField
        label="Password"
        type="password"
      />

      <InnerLabelField
        label="Phone"
        type="tel"
      />

      <InnerLabelField
        label="Website"
        type="url"
      />
    </div>
  )
}
```

### With Error Message

```typescript
import { InnerLabelField } from '@torch-ui/components'
import { useState } from 'react'

function WithValidation() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleBlur = () => {
    if (email && !email.includes('@')) {
      setError('Please enter a valid email')
    } else {
      setError('')
    }
  }

  return (
    <InnerLabelField
      label="Email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      onBlur={handleBlur}
      errorMessage={error}
    />
  )
}
```

### With Action Button

```typescript
import { InnerLabelField } from '@torch-ui/components'
import { ActionButton } from '@torch-ui/components'
import { useState } from 'react'

function WithActionButton() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <InnerLabelField
      label="Password"
      type={showPassword ? 'text' : 'password'}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      childrenSide={
        <ActionButton onClick={() => setShowPassword(!showPassword)}>
          <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
        </ActionButton>
      }
    />
  )
}
```

### Login Form

```typescript
import { InnerLabelField } from '@torch-ui/components'
import { Button, FieldHint } from '@torch-ui/components'
import { useState } from 'react'

function LoginForm() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!credentials.email) {
      newErrors.email = 'Email is required'
    } else if (!credentials.email.includes('@')) {
      newErrors.email = 'Invalid email format'
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      console.log('Login:', credentials)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <InnerLabelField
          label="Email"
          type="email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          errorMessage={errors.email}
          required
        />
        {errors.email && (
          <FieldHint state="error" label={errors.email} />
        )}
      </div>

      <div className="space-y-2">
        <InnerLabelField
          label="Password"
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          errorMessage={errors.password}
          required
        />
        {errors.password && (
          <FieldHint state="error" label={errors.password} />
        )}
      </div>

      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  )
}
```

### Contact Form

```typescript
import { InnerLabelField } from '@torch-ui/components'
import { Button } from '@torch-ui/components'
import { useState } from 'react'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
  })

  return (
    <form className="space-y-4">
      <InnerLabelField
        label="Your Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <InnerLabelField
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <InnerLabelField
        label="Subject"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        required
      />

      <InnerLabelField
        label="Phone Number"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />

      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  )
}
```

### Different Sizes

```typescript
import { InnerLabelField } from '@torch-ui/components'

function Sizes() {
  return (
    <div className="space-y-4">
      <InnerLabelField
        label="Small Input"
        size="S"
      />

      <InnerLabelField
        label="Medium Input"
        size="M"
      />
    </div>
  )
}
```

### Style Variants

```typescript
import { InnerLabelField } from '@torch-ui/components'

function Variants() {
  return (
    <div className="space-y-4">
      <InnerLabelField
        label="Presentation Style"
        variant="PresentationStyle"
      />

      <div className="bg-gray-900 p-4 rounded">
        <InnerLabelField
          label="System Style"
          variant="SystemStyle"
          theme="dark"
        />
      </div>
    </div>
  )
}
```

### With Popover Autocomplete

```typescript
import { InnerLabelField } from '@torch-ui/components'
import { useState } from 'react'

function AutocompleteField() {
  const [value, setValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const suggestions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']
    .filter(item => item.toLowerCase().includes(value.toLowerCase()))

  return (
    <InnerLabelField
      label="Search Fruits"
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        setShowSuggestions(true)
      }}
      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      popoverChildren={
        showSuggestions && suggestions.length > 0 && (
          <div className="p-2 space-y-1">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion}
                className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                onMouseDown={() => {
                  setValue(suggestion)
                  setShowSuggestions(false)
                }}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )
      }
    />
  )
}
```

### Disabled State

```typescript
import { InnerLabelField } from '@torch-ui/components'

function DisabledField() {
  return (
    <div className="space-y-4">
      <InnerLabelField
        label="Disabled Empty"
        disabled
      />

      <InnerLabelField
        label="Disabled with Value"
        value="Cannot edit this"
        disabled
      />
    </div>
  )
}
```

## API Reference

### InnerLabelField Props

Extends all InputField props with added label animation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text (animates on focus) |
| `required` | `boolean` | `false` | Shows required asterisk |
| `size` | `'S' \| 'M'` | `'M'` | Component size |
| `variant` | `'SystemStyle' \| 'PresentationStyle'` | `'PresentationStyle'` | Style variant |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Theme variant |
| `childrenSide` | `ReactNode` | - | Right-side content (action button) |
| `popoverChildren` | `ReactNode` | - | Dropdown content |
| `errorMessage` | `string` | - | Error message (shows tooltip) |
| `onTable` | `boolean` | `false` | Special styling for table context |
| `toolTipSide` | `ToolTipSide` | - | Tooltip position |
| ...InputHTMLAttributes | - | - | All input attributes |

### Label Animation States

| State | Label Position | Label Size | Trigger |
|-------|---------------|------------|---------|
| Empty & Unfocused | Inside input | Normal (body-small) | Default |
| Focused (Empty) | Inside input | Normal (body-small) | User focus |
| Has Value | Inside input | Small (labels-small) | Value exists |
| Disabled (Empty) | Inside input | Normal (body-small) | Disabled prop |

## TypeScript

### Full Type Definitions

```typescript
import { InputHTMLAttributes, ReactNode } from 'react'

interface InnerLabelFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'variant'> {
  size?: 'S' | 'M'
  variant?: 'SystemStyle' | 'PresentationStyle'
  childrenSide?: ReactNode
  popoverChildren?: ReactNode
  errorMessage?: string
  onTable?: boolean
  label?: string
  required?: boolean
  toolTipSide?: 'top' | 'right' | 'bottom' | 'left'
  theme?: 'light' | 'dark' | 'default'
}

export const InnerLabelField: React.ForwardRefExoticComponent<
  InnerLabelFieldProps & React.RefAttributes<HTMLInputElement>
>
```

### Usage with Types

```typescript
import { InnerLabelField } from '@torch-ui/components'
import { useRef, useState } from 'react'

function TypedExample() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string>('')

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <InnerLabelField
      ref={inputRef}
      label="Typed Input"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
      }}
      required
    />
  )
}
```

## Common Patterns

### Controlled Form with Validation

```typescript
import { InnerLabelField } from '@torch-ui/components'
import { Button } from '@torch-ui/components'
import { useState } from 'react'

function ValidatedForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validate = (field: string, value: string) => {
    let error = ''

    switch (field) {
      case 'email':
        if (!value) error = 'Email is required'
        else if (!value.includes('@')) error = 'Invalid email'
        break
      case 'password':
        if (!value) error = 'Password is required'
        else if (value.length < 8) error = 'Minimum 8 characters'
        break
      case 'confirmPassword':
        if (value !== formData.password) error = 'Passwords must match'
        break
    }

    return error
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
    const error = validate(field, formData[field as keyof typeof formData])
    setErrors({ ...errors, [field]: error })
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (touched[field]) {
      const error = validate(field, value)
      setErrors({ ...errors, [field]: error })
    }
  }

  return (
    <form className="space-y-4">
      <InnerLabelField
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        onBlur={() => handleBlur('email')}
        errorMessage={touched.email ? errors.email : undefined}
        required
      />

      <InnerLabelField
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => handleChange('password', e.target.value)}
        onBlur={() => handleBlur('password')}
        errorMessage={touched.password ? errors.password : undefined}
        required
      />

      <InnerLabelField
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => handleChange('confirmPassword', e.target.value)}
        onBlur={() => handleBlur('confirmPassword')}
        errorMessage={touched.confirmPassword ? errors.confirmPassword : undefined}
        required
      />

      <Button type="submit">Register</Button>
    </form>
  )
}
```

### Real-time Search

```typescript
import { InnerLabelField } from '@torch-ui/components'
import { ActionButton } from '@torch-ui/components'
import { useState, useEffect } from 'react'

function SearchField() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      // Simulate API call
      setResults([`Result for "${query}" 1`, `Result for "${query}" 2`])
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div>
      <InnerLabelField
        label="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        childrenSide={
          query && (
            <ActionButton onClick={() => setQuery('')}>
              <i className="ri-close-line" />
            </ActionButton>
          )
        }
      />

      {loading && <p className="mt-2 text-sm">Searching...</p>}

      {results.length > 0 && (
        <div className="mt-2 space-y-1">
          {results.map((result, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded">
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

## Testing

### Unit Test Examples

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { InnerLabelField } from '@torch-ui/components'
import userEvent from '@testing-library/user-event'

describe('InnerLabelField', () => {
  it('renders label inside input', () => {
    render(<InnerLabelField label="Email" />)

    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows required asterisk', () => {
    render(<InnerLabelField label="Name" required />)

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('animates label on focus', async () => {
    const { container } = render(<InnerLabelField label="Email" />)

    const input = screen.getByRole('textbox')
    const label = screen.getByText('Email')

    // Initial state
    expect(label).toHaveClass('typography-body-small-regular')

    // Focus input
    await userEvent.click(input)

    // Label should remain same size when empty and focused
    expect(label).toHaveClass('typography-body-small-regular')
  })

  it('changes label size when value exists', async () => {
    render(<InnerLabelField label="Email" />)

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test@example.com')

    // Label should shrink when value exists
    const label = screen.getByText('Email')
    expect(label).toHaveClass('typography-labels-small-regular')
  })

  it('handles onChange', async () => {
    const handleChange = jest.fn()

    render(
      <InnerLabelField
        label="Email"
        onChange={handleChange}
      />
    )

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test')

    expect(handleChange).toHaveBeenCalled()
  })

  it('shows error message', () => {
    render(
      <InnerLabelField
        label="Email"
        errorMessage="Invalid email"
      />
    )

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('handles disabled state', () => {
    render(<InnerLabelField label="Disabled" disabled />)

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })
})
```

## Accessibility

- **Label Association**: Label properly linked to input
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Label announced on focus
- **Required Indication**: Visual asterisk and aria-required
- **Error States**: aria-invalid when error present
- **Focus Indicators**: Clear focus states

### Accessibility Best Practices

```typescript
// Always provide labels
<InnerLabelField label="Email" /> // ✅

// Mark required fields
<InnerLabelField
  label="Password"
  required
  aria-required="true"
/>

// Provide error context
<InnerLabelField
  label="Email"
  errorMessage="Invalid email"
  aria-invalid="true"
/>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~5kb |
| Bundle size (gzipped) | ~2kb |
| Dependencies | InputField |
| Animation performance | 60fps (CSS transitions) |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Use controlled sparingly**: Uncontrolled for simple forms
2. **Memoize handlers**: Prevent re-renders
3. **Debounce validation**: Avoid excessive checks

## Styling

### Animation Details

The label animation uses CSS transitions:
- Duration: 300ms
- Timing: ease-in-out
- Properties: font-size, color

### Custom Styles

```typescript
// Custom input styling
<InnerLabelField
  label="Custom"
  className="border-2 border-blue-500"
/>

// Override animation
<InnerLabelField
  label="Fast Animation"
  className="[&_p]:transition-[font-size]_[&_p]:duration-150"
/>
```

## Best Practices

1. **Use for modern forms**: Great for clean, minimal designs
2. **Always provide label**: Required for accessibility
3. **Mark required fields**: Use required prop
4. **Validate on blur**: Better UX than real-time
5. **Keep labels short**: Long labels may truncate
6. **Test on mobile**: Ensure touch targets are adequate
7. **Provide error feedback**: Use errorMessage prop

## Comparison with LabelField

| Feature | InnerLabelField | LabelField |
|---------|----------------|------------|
| Label position | Inside input | Above input |
| Animation | Animated | Static |
| Space efficiency | More compact | More spacious |
| Best for | Modern, minimal | Traditional forms |
| Secondary label | ❌ | ✅ |
| Label types | Single | Primary + Secondary + Required |

## Related Components

- [LabelField](./label-field.md) - Traditional label above input
- [Label](./label.md) - Standalone label component
- [InputField](./input-field.md) - Base input component
- [FieldHint](./field-hint.md) - Inline field hints
