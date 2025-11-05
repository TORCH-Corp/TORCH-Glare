---
name: InputField
version: 1.1.15
status: stable
category: components/forms
tags: [form, input, field, popover, tooltip, compound, accessible]
last-reviewed: 2024-11-05
bundle-size: 3.1kb
dependencies:
  - "@/components/Input": "internal"
  - "@/components/Tooltip": "internal"
  - "@/components/Popover": "internal"
  - "@/components/ActionButton": "internal"
---

# InputField

> An enhanced input component that combines Input with integrated popover dropdowns, error tooltips, icons, and trailing actions. Perfect for complex form fields requiring additional UI elements.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { InputField } from 'torch-glare/lib/components/InputField'
```

## Quick Examples

### Basic Usage

```typescript
import { InputField } from 'torch-glare/lib/components/InputField'

function Example() {
  const [value, setValue] = useState('')

  return (
    <InputField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter text..."
    />
  )
}
```

### With Icon

```typescript
import { SearchIcon } from '@heroicons/react/24/outline'

function SearchField() {
  return (
    <InputField
      icon={<SearchIcon className="w-5 h-5" />}
      placeholder="Search..."
    />
  )
}
```

### With Error Message

```typescript
function ValidatedField() {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string>()

  const validate = (val: string) => {
    if (!val) {
      setError('This field is required')
    } else if (val.length < 3) {
      setError('Minimum 3 characters')
    } else {
      setError(undefined)
    }
  }

  return (
    <InputField
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
        validate(e.target.value)
      }}
      errorMessage={error}
      toolTipSide="top"
      placeholder="Enter username..."
    />
  )
}
```

### With Popover Dropdown

```typescript
function AutocompleteField() {
  const [value, setValue] = useState('')
  const [suggestions] = useState(['Apple', 'Banana', 'Cherry', 'Date'])

  const filtered = suggestions.filter(s =>
    s.toLowerCase().includes(value.toLowerCase())
  )

  return (
    <InputField
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Select fruit..."
      popoverChildren={
        <div className="py-2">
          {filtered.map((item) => (
            <button
              key={item}
              className="w-full px-3 py-2 text-left hover:bg-gray-100"
              onClick={() => setValue(item)}
            >
              {item}
            </button>
          ))}
        </div>
      }
    />
  )
}
```

### With Trailing Actions

```typescript
import { Button } from 'torch-glare/lib/components/Button'

function PasswordField() {
  const [showPassword, setShowPassword] = useState(false)
  const [value, setValue] = useState('')

  return (
    <InputField
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter password..."
      childrenSide={
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="p-1"
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      }
    />
  )
}
```

### Different Sizes and Variants

```typescript
// Small size with system style
<InputField
  size="S"
  variant="SystemStyle"
  placeholder="Small system input"
/>

// Medium size with presentation style (default)
<InputField
  size="M"
  variant="PresentationStyle"
  placeholder="Medium presentation input"
/>
```

### Table Context

```typescript
// Optimized for table usage
<InputField
  onTable={true}
  placeholder="Table input..."
  size="S"
/>
```

## API Reference

### InputField Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'S' \| 'M'` | `'M'` | Size of the input field |
| `variant` | `'SystemStyle' \| 'PresentationStyle'` | `'PresentationStyle'` | Visual style variant |
| `icon` | `ReactNode` | - | Icon to display on the left side |
| `childrenSide` | `ReactNode` | - | Content to display on the right side |
| `popoverChildren` | `ReactNode` | - | Content for the dropdown popover |
| `errorMessage` | `string` | - | Error message to display in tooltip |
| `onTable` | `boolean` | `false` | Optimized styling for table context |
| `toolTipSide` | `'top' \| 'right' \| 'bottom' \| 'left'` | - | Tooltip position |
| `theme` | `'dark' \| 'light' \| 'default'` | - | Theme variant |
| `className` | `string` | - | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disables the input |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string \| number` | - | Input value |
| `onChange` | `(e: ChangeEvent) => void` | - | Change event handler |

Plus all standard HTML input attributes.

### TypeScript

```typescript
interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'variant'> {
  size?: 'S' | 'M'
  variant?: 'SystemStyle' | 'PresentationStyle'
  icon?: ReactNode
  childrenSide?: ReactNode
  popoverChildren?: ReactNode
  errorMessage?: string
  onTable?: boolean
  toolTipSide?: 'top' | 'right' | 'bottom' | 'left'
  theme?: 'dark' | 'light' | 'default'
}

export const InputField: React.ForwardRefExoticComponent<InputFieldProps>
```

## Common Patterns

### Search with Suggestions

```typescript
function SearchWithSuggestions() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    setLoading(true)
    // Simulate API call
    const timer = setTimeout(() => {
      setResults([
        `${query} result 1`,
        `${query} result 2`,
        `${query} result 3`,
      ])
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <InputField
      icon={<SearchIcon className="w-5 h-5" />}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
      popoverChildren={
        loading ? (
          <div className="p-3">Loading...</div>
        ) : results.length > 0 ? (
          <div>
            {results.map((result, i) => (
              <button
                key={i}
                className="w-full px-3 py-2 text-left hover:bg-gray-100"
                onClick={() => setQuery(result)}
              >
                {result}
              </button>
            ))}
          </div>
        ) : null
      }
    />
  )
}
```

### Email Validation

```typescript
function EmailField() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) {
      setError('Email is required')
    } else if (!emailRegex.test(value)) {
      setError('Invalid email format')
    } else {
      setError(undefined)
    }
  }

  return (
    <InputField
      type="email"
      icon={<MailIcon className="w-5 h-5" />}
      value={email}
      onChange={(e) => {
        setEmail(e.target.value)
        validateEmail(e.target.value)
      }}
      onBlur={() => validateEmail(email)}
      errorMessage={error}
      placeholder="email@example.com"
    />
  )
}
```

### Date Input with Calendar

```typescript
import { Calendar } from 'torch-glare/lib/components/Calendar'

function DateField() {
  const [date, setDate] = useState('')
  const [showCalendar, setShowCalendar] = useState(false)

  return (
    <InputField
      icon={<CalendarIcon className="w-5 h-5" />}
      value={date}
      onChange={(e) => setDate(e.target.value)}
      placeholder="Select date..."
      childrenSide={
        <button onClick={() => setShowCalendar(!showCalendar)}>
          📅
        </button>
      }
      popoverChildren={
        showCalendar && (
          <Calendar
            onSelect={(date) => {
              setDate(date.toISOString().split('T')[0])
              setShowCalendar(false)
            }}
          />
        )
      }
    />
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { InputField } from 'torch-glare/lib/components/InputField'

describe('InputField', () => {
  it('displays error message in tooltip', () => {
    const { rerender } = render(
      <InputField
        placeholder="Test input"
        errorMessage="Error message"
      />
    )

    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  it('shows popover content on focus', async () => {
    render(
      <InputField
        placeholder="Test"
        popoverChildren={<div>Dropdown content</div>}
      />
    )

    const input = screen.getByPlaceholderText('Test')
    fireEvent.focus(input)

    expect(await screen.findByText('Dropdown content')).toBeInTheDocument()
  })

  it('renders icon and trailing content', () => {
    render(
      <InputField
        icon={<span>Icon</span>}
        childrenSide={<span>Action</span>}
      />
    )

    expect(screen.getByText('Icon')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('InputField meets WCAG standards', async () => {
  const { container } = render(
    <div>
      <label htmlFor="test-input">Label</label>
      <InputField
        id="test-input"
        placeholder="Enter value..."
        errorMessage="Error"
      />
    </div>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Keyboard Support

- **Tab**: Move focus to/from input
- **Escape**: Close popover when open
- **Arrow Down**: Open popover (when configured)
- **Enter**: Select popover item

### ARIA Attributes

```typescript
// With error
<InputField
  aria-invalid={!!error}
  aria-describedby={error ? "error-msg" : undefined}
  errorMessage={error}
/>

// With popover
<InputField
  aria-expanded={popoverOpen}
  aria-haspopup="listbox"
  aria-controls="suggestions"
/>
```

### Screen Reader Support

- Announces error messages via tooltip
- Popover state changes are announced
- Icon content should include aria-label

## Styling

### Custom Styles

```typescript
<InputField
  className="custom-input"
  size="M"
  theme="dark"
/>
```

### CSS Variables

```css
[data-theme="custom"] {
  --input-field-bg: #your-background;
  --input-field-border: #your-border;
  --input-field-hover: #your-hover;
  --input-field-focus: #your-focus;
}
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 3.1kb |
| First render | <10ms |
| Re-render | <3ms |
| Popover open | <5ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Memoize popover content for complex dropdowns
2. Debounce onChange for API calls
3. Use virtualization for long suggestion lists
4. Lazy load calendar/date picker components

## Migration

### From Input Component

```diff
// Migrating from Input to InputField
- import { Input } from 'torch-glare/lib/components/Input'
+ import { InputField } from 'torch-glare/lib/components/InputField'

- <Input.Group error={!!error}>
-   <Input.Icon>{icon}</Input.Icon>
-   <Input {...props} />
-   <Input.Trilling>{actions}</Input.Trilling>
- </Input.Group>
- {error && <span>{error}</span>}
+ <InputField
+   icon={icon}
+   childrenSide={actions}
+   errorMessage={error}
+   {...props}
+ />
```

## Troubleshooting

### Popover not showing

**Solution:** Check that popoverChildren is provided and not disabled

```typescript
// ❌ Wrong - popover won't show when disabled
<InputField disabled popoverChildren={<div>...</div>} />

// ✅ Correct
<InputField popoverChildren={<div>...</div>} />
```

### Error tooltip position

**Solution:** Set appropriate toolTipSide

```typescript
<InputField
  errorMessage="Error"
  toolTipSide="top" // or "right", "bottom", "left"
/>
```

## Related Components

- [Input](/docs/components/input.md) - Base input component
- [Select](/docs/components/select.md) - Dropdown selection
- [Textarea](/docs/components/textarea.md) - Multi-line input
- [SearchField](/docs/components/search-field.md) - Specialized search
- [Tooltip](/docs/components/tooltip.md) - Error message display
- [Popover](/docs/components/popover.md) - Dropdown container

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Added popover integration
- Enhanced error tooltip support
- Improved TypeScript types

### v1.1.14
- Added table context optimization
- Fixed popover width calculation

### v1.1.0
- Initial stable release