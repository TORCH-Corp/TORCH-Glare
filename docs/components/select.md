---
name: Select
version: 1.1.15
status: stable
category: components/forms
tags: [form, select, dropdown, accessible, radix-ui]
last-reviewed: 2024-11-05
bundle-size: 4.5kb
dependencies:
  - "@radix-ui/react-select": "^2.0.0"
  - "class-variance-authority": "^0.7.0"
---

# Select

> A fully accessible dropdown select component built on Radix UI primitives. Supports single selection, scrolling, custom triggers, and full keyboard navigation.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator
} from 'torch-glare/lib/components/Select'
```

## Quick Examples

### Basic Usage

```typescript
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from 'torch-glare/lib/components/Select'

function Example() {
  const [value, setValue] = useState('')

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

### With Groups

```typescript
<Select>
  <SelectTrigger className="w-[200px]">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Vegetables</SelectLabel>
      <SelectItem value="carrot">Carrot</SelectItem>
      <SelectItem value="potato">Potato</SelectItem>
      <SelectItem value="tomato">Tomato</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

### Different Sizes

```typescript
// Small
<Select>
  <SelectTrigger size="S" className="w-[150px]">
    <SelectValue placeholder="Small" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Item 1</SelectItem>
  </SelectContent>
</Select>

// Medium (default)
<Select>
  <SelectTrigger size="M" className="w-[180px]">
    <SelectValue placeholder="Medium" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Item 1</SelectItem>
  </SelectContent>
</Select>

// Large
<Select>
  <SelectTrigger size="L" className="w-[220px]">
    <SelectValue placeholder="Large" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Item 1</SelectItem>
  </SelectContent>
</Select>

// Extra Large
<Select>
  <SelectTrigger size="XL" className="w-[250px]">
    <SelectValue placeholder="Extra Large" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Item 1</SelectItem>
  </SelectContent>
</Select>
```

### With Error State

```typescript
function SelectWithValidation() {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const handleChange = (newValue: string) => {
    setValue(newValue)
    if (!newValue) {
      setError('Please select an option')
    } else {
      setError('')
    }
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger
        errors={error}
        className="w-[200px]"
      >
        <SelectValue placeholder="Select required" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

### With Custom Icon

```typescript
<Select>
  <SelectTrigger icon="custom-icon-class" className="w-[200px]">
    <SelectValue placeholder="Custom icon" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Item 1</SelectItem>
    <SelectItem value="2">Item 2</SelectItem>
  </SelectContent>
</Select>
```

### Controlled vs Uncontrolled

```typescript
// Controlled
function Controlled() {
  const [value, setValue] = useState('apple')

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  )
}

// Uncontrolled with default value
function Uncontrolled() {
  return (
    <Select defaultValue="apple">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

## API Reference

### Select Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled value |
| `defaultValue` | `string` | - | Default value for uncontrolled |
| `onValueChange` | `(value: string) => void` | - | Called when value changes |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Default open state |
| `onOpenChange` | `(open: boolean) => void` | - | Called when open state changes |
| `disabled` | `boolean` | `false` | Disable the select |
| `required` | `boolean` | `false` | Make selection required |
| `name` | `string` | - | Name for form submission |
| `dir` | `'ltr' \| 'rtl'` | `'ltr'` | Text direction |

### SelectTrigger Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'S' \| 'M' \| 'L' \| 'XL'` | `'M'` | Size of the trigger |
| `variant` | `'PresentationStyle' \| 'SystemStyle'` | `'PresentationStyle'` | Visual variant |
| `errors` | `string` | - | Error message (shows tooltip) |
| `theme` | `Themes` | - | Theme override |
| `icon` | `string` | - | Custom icon class |
| `className` | `string` | - | Additional CSS classes |
| `asChild` | `boolean` | `false` | Render as child element |

### SelectContent Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'PresentationStyle' \| 'SystemStyle'` | `'PresentationStyle'` | Visual variant |
| `position` | `'item-aligned' \| 'popper'` | `'popper'` | Positioning strategy |
| `side` | `'top' \| 'bottom'` | `'bottom'` | Preferred side |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment |
| `sideOffset` | `number` | `4` | Offset from trigger |
| `theme` | `Themes` | - | Theme override |
| `className` | `string` | - | Additional CSS classes |

### SelectItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Item value (required) |
| `disabled` | `boolean` | `false` | Disable item |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Item content |

### TypeScript

```typescript
import type { Themes } from 'torch-glare/lib/utils/types'

// Select component types
interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  required?: boolean
  name?: string
  dir?: 'ltr' | 'rtl'
  children: React.ReactNode
}

// Trigger types
interface SelectTriggerProps {
  size?: 'S' | 'M' | 'L' | 'XL'
  variant?: 'PresentationStyle' | 'SystemStyle'
  errors?: string
  theme?: Themes
  icon?: string
  className?: string
  asChild?: boolean
  children?: React.ReactNode
}

// Content types
interface SelectContentProps {
  variant?: 'PresentationStyle' | 'SystemStyle'
  position?: 'item-aligned' | 'popper'
  side?: 'top' | 'bottom'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  theme?: Themes
  className?: string
  children: React.ReactNode
}

// Item types
interface SelectItemProps {
  value: string
  disabled?: boolean
  className?: string
  children: React.ReactNode
}
```

## Common Patterns

### Country Selector

```typescript
function CountrySelect() {
  const countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
  ]

  const [selected, setSelected] = useState('us')

  return (
    <Select value={selected} onValueChange={setSelected}>
      <SelectTrigger className="w-[250px]">
        <SelectValue>
          {countries.find(c => c.code === selected)?.flag}{' '}
          {countries.find(c => c.code === selected)?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {countries.map(country => (
          <SelectItem key={country.code} value={country.code}>
            <span className="flex items-center gap-2">
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

### Form Integration

```typescript
import { Form } from 'torch-glare/lib/components/Form'
import { Label } from 'torch-glare/lib/components/Label'

function FormSelect() {
  const [formData, setFormData] = useState({
    category: '',
    priority: ''
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Form data:', formData)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData(prev => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="docs">Documentation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              setFormData(prev => ({ ...prev, priority: value }))
            }
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit">Submit</Button>
      </div>
    </Form>
  )
}
```

### Dynamic Options

```typescript
function DynamicSelect() {
  const [options, setOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOptions(['Option 1', 'Option 2', 'Option 3'])
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <Select disabled={loading}>
      <SelectTrigger>
        <SelectValue placeholder={loading ? "Loading..." : "Select option"} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from 'torch-glare/lib/components/Select'

describe('Select', () => {
  it('opens dropdown on trigger click', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Item 1</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)

    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })

  it('selects item on click', () => {
    const handleChange = jest.fn()

    render(
      <Select onValueChange={handleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test Item</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)

    const item = screen.getByText('Test Item')
    fireEvent.click(item)

    expect(handleChange).toHaveBeenCalledWith('test')
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('Select meets WCAG standards', async () => {
  const { container } = render(
    <div>
      <label htmlFor="test-select">Choose option</label>
      <Select>
        <SelectTrigger id="test-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Keyboard Support

- **Space/Enter**: Open select menu when trigger focused
- **Arrow Down**: Open menu or move to next item
- **Arrow Up**: Move to previous item
- **Home**: Move to first item
- **End**: Move to last item
- **Escape**: Close menu
- **Tab**: Move focus away

### ARIA Attributes

The Select component automatically includes:

```typescript
// Trigger
<button
  role="combobox"
  aria-expanded={open}
  aria-haspopup="listbox"
  aria-controls="select-content"
/>

// Content
<div
  role="listbox"
  id="select-content"
/>

// Items
<div
  role="option"
  aria-selected={selected}
  aria-disabled={disabled}
/>
```

### Screen Reader Support

- Announces selected value
- Reads item labels when navigating
- Announces number of options
- Indicates disabled items

## Styling

### Custom Styles

```typescript
<Select>
  <SelectTrigger className="border-2 border-blue-500 focus:ring-blue-500">
    <SelectValue />
  </SelectTrigger>
  <SelectContent className="bg-gray-50">
    <SelectItem className="hover:bg-blue-100" value="1">
      Styled Item
    </SelectItem>
  </SelectContent>
</Select>
```

### Theme Customization

```typescript
<Select>
  <SelectTrigger theme="dark">
    <SelectValue placeholder="Dark theme" />
  </SelectTrigger>
  <SelectContent theme="dark">
    <SelectItem value="1">Dark Item</SelectItem>
  </SelectContent>
</Select>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 4.5kb |
| First render | <12ms |
| Re-render | <5ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Use `React.memo()` for parent components with many selects
2. Lazy load large option lists
3. Virtualize very long lists (100+ items)
4. Debounce search/filter operations

## Migration

### From v1.0.x

```diff
// Component structure changed
- <Select options={options} value={value} onChange={onChange} />
+ <Select value={value} onValueChange={onChange}>
+   <SelectTrigger>
+     <SelectValue />
+   </SelectTrigger>
+   <SelectContent>
+     {options.map(opt => (
+       <SelectItem key={opt.value} value={opt.value}>
+         {opt.label}
+       </SelectItem>
+     ))}
+   </SelectContent>
+ </Select>
```

## Related Components

- [SimpleSelect](/docs/components/simple-select.md) - Lightweight select
- [Input](/docs/components/input.md) - Text input
- [RadioGroup](/docs/components/radio.md) - Single selection alternative
- [Checkbox](/docs/components/checkbox.md) - Multiple selection
- [Form](/docs/components/form.md) - Form wrapper

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Added Radix UI integration
- Improved accessibility
- Added size variants

### v1.1.14
- Added error state with tooltip
- Performance optimizations
- Fixed keyboard navigation

### v1.1.0
- Initial release