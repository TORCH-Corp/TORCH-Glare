---
title: LabelField
description: Combined Label and InputField component for streamlined form field creation with all label features
group: Labels & Text
keywords: [label-field, form, input, label, required, field]
---

# LabelField

> A convenient combination of Label and InputField components that provides all label features (primary, secondary, required) along with complete input functionality in a single component. Perfect for quickly building consistent form fields.

## Installation

No external dependencies required.

## Import

```typescript
import { LabelField } from '@torch-ui/components'
import type { LabelFieldProps } from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { LabelField } from '@torch-ui/components'
import { useState } from 'react'

function Example() {
  const [value, setValue] = useState('')

  return (
    <LabelField
      label="Email Address"
      type="email"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
```

### With Required Indicator

```typescript
import { LabelField } from '@torch-ui/components'

function RequiredField() {
  return (
    <LabelField
      label="Full Name"
      requiredLabel="*Required"
      required
    />
  )
}
```

### With Secondary Label

```typescript
import { LabelField } from '@torch-ui/components'

function WithSecondary() {
  return (
    <LabelField
      label="Password"
      secondaryLabel="(At least 8 characters)"
      type="password"
    />
  )
}
```

### With Error Message

```typescript
import { LabelField } from '@torch-ui/components'
import { useState } from 'react'

function WithValidation() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleBlur = () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email')
    } else {
      setError('')
    }
  }

  return (
    <LabelField
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

### With Icon

```typescript
import { LabelField } from '@torch-ui/components'

function WithIcon() {
  return (
    <LabelField
      label="Search"
      icon={<i className="ri-search-line" />}
      placeholder="Type to search..."
    />
  )
}
```

### With Action Button

```typescript
import { LabelField } from '@torch-ui/components'
import { ActionButton } from '@torch-ui/components'
import { useState } from 'react'

function WithActionButton() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <LabelField
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

### Horizontal Layout

```typescript
import { LabelField } from '@torch-ui/components'

function HorizontalLayout() {
  return (
    <LabelField
      label="Notifications"
      labelDirections="horizontal"
      childrenDirections="horizontal"
      type="checkbox"
    />
  )
}
```

### Different Sizes

```typescript
import { LabelField } from '@torch-ui/components'

function Sizes() {
  return (
    <div className="space-y-4">
      <LabelField
        label="Small Input"
        size="S"
        placeholder="Small size"
      />

      <LabelField
        label="Medium Input"
        size="M"
        placeholder="Medium size"
      />
    </div>
  )
}
```

### Registration Form

```typescript
import { LabelField } from '@torch-ui/components'
import { Button, PasswordLevel } from '@torch-ui/components'
import { useState } from 'react'

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
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
      <LabelField
        label="Full Name"
        requiredLabel="*"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        errorMessage={errors.name}
        required
      />

      <LabelField
        label="Email"
        secondaryLabel="(We'll never share your email)"
        requiredLabel="*"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        errorMessage={errors.email}
        required
      />

      <div className="space-y-2">
        <LabelField
          label="Password"
          secondaryLabel="(At least 8 characters)"
          requiredLabel="*"
          labelDirections="vertical"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          errorMessage={errors.password}
          required
        />
        <PasswordLevel value={formData.password} />
      </div>

      <Button type="submit">Create Account</Button>
    </form>
  )
}
```

### With Popover Dropdown

```typescript
import { LabelField } from '@torch-ui/components'
import { useState } from 'react'

function WithPopover() {
  const [value, setValue] = useState('')
  const suggestions = ['Option 1', 'Option 2', 'Option 3']

  return (
    <LabelField
      label="Select Option"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      popoverChildren={
        <div className="p-2 space-y-1">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion}
              className="p-2 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => setValue(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      }
    />
  )
}
```

### Profile Settings Form

```typescript
import { LabelField } from '@torch-ui/components'
import { Button } from '@torch-ui/components'
import { useState } from 'react'

function ProfileSettings() {
  const [profile, setProfile] = useState({
    username: 'johndoe',
    email: 'john@example.com',
    bio: '',
    website: '',
  })

  return (
    <form className="space-y-4">
      <LabelField
        label="Username"
        requiredLabel="*"
        value={profile.username}
        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
        icon={<i className="ri-user-line" />}
      />

      <LabelField
        label="Email"
        requiredLabel="*"
        type="email"
        value={profile.email}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        icon={<i className="ri-mail-line" />}
      />

      <LabelField
        label="Bio"
        secondaryLabel="(Optional)"
        value={profile.bio}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        placeholder="Tell us about yourself"
      />

      <LabelField
        label="Website"
        secondaryLabel="(Optional)"
        type="url"
        value={profile.website}
        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
        placeholder="https://example.com"
        icon={<i className="ri-global-line" />}
      />

      <Button type="submit">Save Changes</Button>
    </form>
  )
}
```

## API Reference

### LabelField Props

Combines all Label and InputField props (excluding conflicting ones).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | - | Primary label text |
| `requiredLabel` | `ReactNode` | - | Required indicator text |
| `secondaryLabel` | `ReactNode` | - | Secondary/helper text |
| `size` | `'S' \| 'M'` | `'M'` | Component size |
| `variant` | `'SystemStyle' \| 'PresentationStyle'` | `'PresentationStyle'` | Style variant |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Theme variant |
| `icon` | `ReactNode` | - | Left-side icon |
| `childrenSide` | `ReactNode` | - | Right-side content (action button) |
| `popoverChildren` | `ReactNode` | - | Dropdown content |
| `errorMessage` | `string` | - | Error message (shows tooltip) |
| `onTable` | `boolean` | `false` | Special styling for table context |
| `labelDirections` | `'vertical' \| 'horizontal'` | `'horizontal'` | Label texts direction |
| `childrenDirections` | `'vertical' \| 'horizontal'` | `'vertical'` | Label and input direction |
| `toolTipSide` | `ToolTipSide` | - | Tooltip position |
| ...InputHTMLAttributes | - | - | All input attributes |

## TypeScript

### Full Type Definitions

```typescript
import { InputHTMLAttributes, ReactNode } from 'react'

interface LabelFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'variant'> {
  size?: 'S' | 'M'
  variant?: 'SystemStyle' | 'PresentationStyle'
  icon?: ReactNode
  childrenSide?: ReactNode
  popoverChildren?: ReactNode
  errorMessage?: string
  onTable?: boolean
  label?: ReactNode
  requiredLabel?: ReactNode
  secondaryLabel?: ReactNode
  labelDirections?: 'vertical' | 'horizontal'
  childrenDirections?: 'vertical' | 'horizontal'
  toolTipSide?: 'top' | 'right' | 'bottom' | 'left'
  theme?: 'light' | 'dark' | 'default'
}

export const LabelField: React.ForwardRefExoticComponent<
  LabelFieldProps & React.RefAttributes<HTMLInputElement>
>
```

### Usage with Types

```typescript
import { LabelField } from '@torch-ui/components'
import { useRef, useState } from 'react'

function TypedExample() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState<string>('')

  const focusInput = () => {
    inputRef.current?.focus()
  }

  return (
    <LabelField
      ref={inputRef}
      label="Typed Input"
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
      }}
    />
  )
}
```

## Common Patterns

### Form Field Wrapper Hook

```typescript
import { LabelField } from '@torch-ui/components'
import { useState, useCallback } from 'react'

function useFormField(initialValue: string = '') {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string>()
  const [touched, setTouched] = useState(false)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    setError(undefined)
  }, [])

  const handleBlur = useCallback(() => {
    setTouched(true)
  }, [])

  const validate = useCallback((validator: (value: string) => string | undefined) => {
    const errorMessage = validator(value)
    setError(errorMessage)
    return !errorMessage
  }, [value])

  return {
    value,
    setValue,
    error,
    touched,
    handleChange,
    handleBlur,
    validate,
    fieldProps: {
      value,
      onChange: handleChange,
      onBlur: handleBlur,
      errorMessage: touched ? error : undefined,
    },
  }
}

// Usage
function FormWithHook() {
  const emailField = useFormField('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = emailField.validate((value) =>
      !value.includes('@') ? 'Invalid email' : undefined
    )

    if (isValid) {
      console.log('Submit:', emailField.value)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <LabelField
        label="Email"
        type="email"
        {...emailField.fieldProps}
      />
    </form>
  )
}
```

### Reusable Form Fields

```typescript
import { LabelField } from '@torch-ui/components'
import { ComponentProps } from 'react'

type FieldConfig = Omit<ComponentProps<typeof LabelField>, 'value' | 'onChange'> & {
  name: string
}

function FormBuilder({
  fields,
  values,
  onChange,
}: {
  fields: FieldConfig[]
  values: Record<string, string>
  onChange: (name: string, value: string) => void
}) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <LabelField
          key={field.name}
          {...field}
          value={values[field.name] || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      ))}
    </div>
  )
}

// Usage
function DynamicForm() {
  const [values, setValues] = useState<Record<string, string>>({})

  const fields: FieldConfig[] = [
    { name: 'firstName', label: 'First Name', requiredLabel: '*' },
    { name: 'lastName', label: 'Last Name', requiredLabel: '*' },
    { name: 'email', label: 'Email', type: 'email', requiredLabel: '*' },
  ]

  const handleChange = (name: string, value: string) => {
    setValues({ ...values, [name]: value })
  }

  return <FormBuilder fields={fields} values={values} onChange={handleChange} />
}
```

## Testing

### Unit Test Examples

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LabelField } from '@torch-ui/components'
import userEvent from '@testing-library/user-event'

describe('LabelField', () => {
  it('renders label and input', () => {
    render(<LabelField label="Test Label" />)

    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders all label types', () => {
    render(
      <LabelField
        label="Main"
        secondaryLabel="Secondary"
        requiredLabel="*"
      />
    )

    expect(screen.getByText('Main')).toBeInTheDocument()
    expect(screen.getByText('Secondary')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('handles input changes', async () => {
    const handleChange = jest.fn()

    render(
      <LabelField
        label="Email"
        onChange={handleChange}
      />
    )

    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test@example.com')

    expect(handleChange).toHaveBeenCalled()
  })

  it('shows error message', () => {
    render(
      <LabelField
        label="Email"
        errorMessage="Invalid email"
      />
    )

    // Error tooltip should be present
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders with icon', () => {
    render(
      <LabelField
        label="Search"
        icon={<span data-testid="icon">🔍</span>}
      />
    )

    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>()

    render(<LabelField label="Test" ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
```

## Accessibility

- **Semantic HTML**: Proper label-input relationship
- **ARIA Attributes**: Error states use aria-invalid
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Labels and errors announced correctly
- **Required Indication**: Clear visual and semantic markers
- **Error Tooltips**: Accessible error messaging

### Accessibility Best Practices

```typescript
// Provide clear labels
<LabelField
  label="Email Address"
  placeholder="name@example.com"
/>

// Mark required fields
<LabelField
  label="Password"
  requiredLabel="*Required"
  required
  aria-required="true"
/>

// Provide helpful secondary labels
<LabelField
  label="Phone"
  secondaryLabel="Format: (555) 555-5555"
/>

// Use proper error messaging
<LabelField
  label="Email"
  errorMessage="Please enter a valid email address"
  aria-describedby="email-error"
/>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~6kb |
| Bundle size (gzipped) | ~2kb |
| Dependencies | Label + InputField |
| Re-renders | Optimized with React.memo |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Memoize handlers**: Prevent unnecessary re-renders
   ```typescript
   const handleChange = useCallback((e) => setValue(e.target.value), [])
   ```

2. **Controlled vs Uncontrolled**: Use uncontrolled for simple forms
   ```typescript
   <LabelField label="Name" defaultValue="John" />
   ```

3. **Debounce validation**: Avoid validating on every keystroke
   ```typescript
   const debouncedValidate = useMemo(
     () => debounce(validate, 300),
     [validate]
   )
   ```

## Styling

### Custom Styles

```typescript
// Custom container
<LabelField
  label="Styled Field"
  className="bg-gray-50 p-4 rounded-lg"
/>

// Custom label styling
<LabelField
  label="Custom Label"
  labelsClassName="text-blue-600"
/>
```

## Best Practices

1. **Use for complete form fields**: Combines label and input conveniently
2. **Provide clear labels**: Essential for usability
3. **Mark required fields**: Use requiredLabel prop
4. **Add helper text**: Use secondaryLabel for context
5. **Validate on blur**: Better UX than on every keystroke
6. **Show errors clearly**: Use errorMessage prop
7. **Group related fields**: Use consistent sizing and spacing

## Related Components

- [Label](./label.md) - Standalone label component
- [InputField](./input-field.md) - Standalone input component
- [InnerLabelField](./inner-label-field.md) - Floating label inside input
- [FieldHint](./field-hint.md) - Inline field hints
