---
name: Input
version: 1.1.15
status: stable
category: components/forms
tags: [form, input, text, field, accessible, compound]
last-reviewed: 2024-11-05
bundle-size: 2.8kb
dependencies:
  - "class-variance-authority": "^0.7.0"
---

# Input

> A versatile text input component with compound architecture, supporting icons, trailing elements, and multiple style variants. Built with accessibility and flexibility in mind.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { Input } from 'torch-glare/lib/components/Input'
// Compound components
import { Group, Icon, Trilling } from 'torch-glare/lib/components/Input'
```

## Quick Examples

### Basic Usage

```typescript
import { Input } from 'torch-glare/lib/components/Input'

function Example() {
  const [value, setValue] = useState('')

  return (
    <Input.Group>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter text..."
      />
    </Input.Group>
  )
}
```

### With Icon

```typescript
import { Input } from 'torch-glare/lib/components/Input'
import { SearchIcon } from '@heroicons/react/24/outline'

function SearchInput() {
  return (
    <Input.Group>
      <Input.Icon>
        <SearchIcon className="w-5 h-5" />
      </Input.Icon>
      <Input placeholder="Search..." />
    </Input.Group>
  )
}
```

### With Trailing Element

```typescript
import { Input } from 'torch-glare/lib/components/Input'
import { Button } from 'torch-glare/lib/components/Button'

function InputWithButton() {
  return (
    <Input.Group>
      <Input placeholder="Enter email..." />
      <Input.Trilling>
        <Button size="sm" variant="PrimeStyle">
          Subscribe
        </Button>
      </Input.Trilling>
    </Input.Group>
  )
}
```

### Error State

```typescript
function ErrorInput() {
  const [error, setError] = useState(true)

  return (
    <Input.Group error={error}>
      <Input
        placeholder="Email address"
        aria-invalid={error}
      />
    </Input.Group>
  )
}
```

### Different Sizes

```typescript
// Small size
<Input.Group size="S">
  <Input placeholder="Small input" />
</Input.Group>

// Medium size (default)
<Input.Group size="M">
  <Input placeholder="Medium input" />
</Input.Group>
```

### Different Variants

```typescript
// Presentation style (default)
<Input.Group variant="PresentationStyle">
  <Input placeholder="Presentation style" />
</Input.Group>

// System style
<Input.Group variant="SystemStyle">
  <Input placeholder="System style" />
</Input.Group>
```

### Password Input

```typescript
import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Input.Group>
      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter password..."
      />
      <Input.Trilling>
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="p-2"
        >
          {showPassword ? (
            <EyeSlashIcon className="w-4 h-4" />
          ) : (
            <EyeIcon className="w-4 h-4" />
          )}
        </button>
      </Input.Trilling>
    </Input.Group>
  )
}
```

## API Reference

### Input.Group Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'S' \| 'M'` | `'M'` | Size of the input group |
| `variant` | `'PresentationStyle' \| 'SystemStyle'` | `'PresentationStyle'` | Visual style variant |
| `error` | `boolean` | `false` | Shows error state styling |
| `onTable` | `boolean` | `false` | Optimized styling for table context |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Input and related elements |

### Input Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | HTML input type |
| `value` | `string \| number` | - | Input value |
| `onChange` | `(e: ChangeEvent) => void` | - | Change event handler |
| `placeholder` | `string` | - | Placeholder text |
| `disabled` | `boolean` | `false` | Disables the input |
| `required` | `boolean` | `false` | Makes field required |
| `pattern` | `string` | - | Validation pattern |
| `maxLength` | `number` | - | Maximum character length |
| `minLength` | `number` | - | Minimum character length |
| `className` | `string` | - | Additional CSS classes |
| `autoComplete` | `string` | `'off'` | Autocomplete behavior |

### Input.Icon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Icon element |
| `className` | `string` | - | Additional CSS classes |

### Input.Trilling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Trailing elements |
| `className` | `string` | - | Additional CSS classes |

### TypeScript

```typescript
// Group component types
interface InputGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "size"> {
  size?: 'S' | 'M'
  variant?: 'PresentationStyle' | 'SystemStyle'
  error?: boolean
  onTable?: boolean
  className?: string
  children?: React.ReactNode
}

// Input component types
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  className?: string
}

// Icon component types
interface IconProps {
  children: React.ReactNode
  className?: string
}

// Trilling component types
interface TrillingProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

// Compound component exports
export const Input: React.ForwardRefExoticComponent<InputProps> & {
  Group: React.ForwardRefExoticComponent<InputGroupProps>
  Icon: React.FC<IconProps>
  Trilling: React.FC<TrillingProps>
}
```

## Common Patterns

### Form Field with Label

```typescript
import { Input } from 'torch-glare/lib/components/Input'
import { Label } from 'torch-glare/lib/components/Label'

function FormField() {
  const [value, setValue] = useState('')

  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email Address</Label>
      <Input.Group>
        <Input
          id="email"
          type="email"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="john@example.com"
          required
        />
      </Input.Group>
    </div>
  )
}
```

### Search Field

```typescript
import { Input } from 'torch-glare/lib/components/Input'
import { SearchIcon, XMarkIcon } from '@heroicons/react/24/outline'

function SearchField() {
  const [search, setSearch] = useState('')

  const handleClear = () => setSearch('')

  return (
    <Input.Group>
      <Input.Icon>
        <SearchIcon className="w-5 h-5" />
      </Input.Icon>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      {search && (
        <Input.Trilling>
          <button onClick={handleClear} className="p-1">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </Input.Trilling>
      )}
    </Input.Group>
  )
}
```

### Input with Validation

```typescript
function ValidatedInput() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const validate = (val: string) => {
    if (!val) {
      setError('Field is required')
      return false
    }
    if (val.length < 3) {
      setError('Minimum 3 characters required')
      return false
    }
    setError('')
    return true
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    validate(newValue)
  }

  return (
    <div className="space-y-1">
      <Input.Group error={!!error}>
        <Input
          value={value}
          onChange={handleChange}
          placeholder="Enter username..."
          aria-invalid={!!error}
          aria-describedby={error ? "error-message" : undefined}
        />
      </Input.Group>
      {error && (
        <p id="error-message" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
```

### Currency Input

```typescript
function CurrencyInput() {
  const [amount, setAmount] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setAmount(value)
  }

  return (
    <Input.Group>
      <Input.Icon>
        <span className="text-sm font-medium">$</span>
      </Input.Icon>
      <Input
        value={amount}
        onChange={handleChange}
        placeholder="0.00"
        inputMode="decimal"
      />
      <Input.Trilling>
        <span className="text-sm text-gray-500">USD</span>
      </Input.Trilling>
    </Input.Group>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from 'torch-glare/lib/components/Input'

describe('Input', () => {
  it('handles user input', () => {
    const handleChange = jest.fn()
    render(
      <Input.Group>
        <Input
          onChange={handleChange}
          placeholder="Type here..."
        />
      </Input.Group>
    )

    const input = screen.getByPlaceholderText('Type here...')
    fireEvent.change(input, { target: { value: 'Hello' } })

    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue('Hello')
  })

  it('shows error state', () => {
    const { container } = render(
      <Input.Group error>
        <Input placeholder="Error input" />
      </Input.Group>
    )

    const group = container.firstChild
    expect(group).toHaveClass('error')
  })

  it('disables input when disabled prop is passed', () => {
    render(
      <Input.Group>
        <Input disabled placeholder="Disabled" />
      </Input.Group>
    )

    const input = screen.getByPlaceholderText('Disabled')
    expect(input).toBeDisabled()
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('Input meets WCAG standards', async () => {
  const { container } = render(
    <div>
      <label htmlFor="test-input">Name</label>
      <Input.Group>
        <Input
          id="test-input"
          placeholder="Enter name..."
        />
      </Input.Group>
    </div>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Keyboard Support

- **Tab**: Move focus to/from input
- **Arrow Keys**: Navigate text cursor
- **Home/End**: Jump to start/end of text
- **Backspace/Delete**: Remove characters

### ARIA Attributes

```typescript
// Error state
<Input
  aria-invalid={hasError}
  aria-describedby="error-message"
/>

// Required field
<Input
  aria-required="true"
  required
/>

// With label
<label htmlFor="email">Email</label>
<Input id="email" />
```

### Screen Reader Support

- Announces input type and state
- Reads placeholder text
- Announces error messages when linked with aria-describedby
- Supports label association

### Focus Management

- Visible focus ring on keyboard navigation
- Auto-scrolls to end of text on focus
- Maintains focus during value changes

## Styling

### Custom Styles with className

```typescript
<Input.Group className="border-2 border-blue-500">
  <Input className="font-mono text-lg" />
</Input.Group>
```

### CSS Variables

```css
/* Custom theme variables */
[data-theme="custom"] {
  --input-bg: #your-background;
  --input-border: #your-border;
  --input-text: #your-text;
  --input-placeholder: #your-placeholder;
  --input-focus: #your-focus-color;
}
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 2.8kb |
| First render | <8ms |
| Re-render | <3ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Use `React.memo()` for parent components
2. Debounce onChange handlers for expensive operations
3. Use `useCallback` for event handlers
4. Consider virtual scrolling for long lists of inputs

## Migration

### From v1.0.x

```diff
// Import path changed
- import Input from 'torch-glare/Input'
+ import { Input } from 'torch-glare/lib/components/Input'

// Compound component structure
- <Input icon={<SearchIcon />} />
+ <Input.Group>
+   <Input.Icon><SearchIcon /></Input.Icon>
+   <Input />
+ </Input.Group>
```

## Troubleshooting

### Common Issues

#### Input doesn't update value

**Solution:** Ensure you're controlling the value properly

```typescript
// ❌ Wrong
<Input value="static" />

// ✅ Correct
const [value, setValue] = useState('')
<Input value={value} onChange={(e) => setValue(e.target.value)} />
```

#### Autocomplete not working

**Solution:** Set autoComplete prop appropriately

```typescript
<Input
  type="email"
  autoComplete="email"
  name="email"
/>
```

#### Focus styles not showing

**Solution:** Check if parent styles are overriding focus styles

```typescript
<Input.Group className="focus-within:ring-2 focus-within:ring-blue-500">
  <Input />
</Input.Group>
```

## Related Components

- [InputField](/docs/components/input-field.md) - Input with integrated label
- [SearchField](/docs/components/search-field.md) - Specialized search input
- [Textarea](/docs/components/textarea.md) - Multi-line text input
- [Select](/docs/components/select.md) - Dropdown selection
- [Form](/docs/components/form.md) - Form wrapper with validation

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Added compound component architecture
- Improved auto-scroll behavior
- Enhanced TypeScript types

### v1.1.14
- Added error state styling
- Fixed focus management
- Performance optimizations

### v1.1.0
- Initial stable release