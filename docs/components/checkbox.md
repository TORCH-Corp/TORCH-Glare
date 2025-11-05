---
name: Checkbox
version: 1.1.15
status: stable
category: components/forms
tags: [form, checkbox, selection, radix-ui, accessible, controlled]
last-reviewed: 2024-11-05
bundle-size: 1.8kb
dependencies:
  - "@radix-ui/react-checkbox": "^1.0.0"
  - "class-variance-authority": "^0.7.0"
---

# Checkbox

> A fully accessible checkbox component built on Radix UI primitives with two size variants and comprehensive state management. Supports controlled and uncontrolled usage, indeterminate state, and form integration.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { Checkbox } from 'torch-glare/lib/components/Checkbox'
```

## Quick Examples

### Basic Usage

```typescript
import { Checkbox } from 'torch-glare/lib/components/Checkbox'

function Example() {
  const [checked, setChecked] = useState(false)

  return (
    <Checkbox
      checked={checked}
      onCheckedChange={setChecked}
    />
  )
}
```

### With Label

```typescript
function LabeledCheckbox() {
  const [agreed, setAgreed] = useState(false)

  return (
    <label className="flex items-center gap-2">
      <Checkbox
        checked={agreed}
        onCheckedChange={setAgreed}
        id="terms"
      />
      <span>I agree to the terms and conditions</span>
    </label>
  )
}
```

### Different Sizes

```typescript
function SizeVariants() {
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2">
        <Checkbox size="S" />
        <span className="text-sm">Small checkbox</span>
      </label>

      <label className="flex items-center gap-2">
        <Checkbox size="M" />
        <span>Medium checkbox (default)</span>
      </label>
    </div>
  )
}
```

### Indeterminate State

```typescript
function IndeterminateExample() {
  const [checkedItems, setCheckedItems] = useState([false, false, false])

  const allChecked = checkedItems.every(Boolean)
  const indeterminate = checkedItems.some(Boolean) && !allChecked

  return (
    <div>
      <label className="flex items-center gap-2 font-semibold">
        <Checkbox
          checked={allChecked ? true : indeterminate ? 'indeterminate' : false}
          onCheckedChange={(checked) => {
            setCheckedItems([checked === true, checked === true, checked === true])
          }}
        />
        <span>Select all</span>
      </label>

      <div className="ml-6 mt-2 space-y-2">
        {checkedItems.map((checked, index) => (
          <label key={index} className="flex items-center gap-2">
            <Checkbox
              checked={checked}
              onCheckedChange={(value) => {
                const updated = [...checkedItems]
                updated[index] = value === true
                setCheckedItems(updated)
              }}
            />
            <span>Option {index + 1}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
```

### Disabled State

```typescript
function DisabledCheckboxes() {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2">
        <Checkbox disabled />
        <span className="text-gray-500">Disabled unchecked</span>
      </label>

      <label className="flex items-center gap-2">
        <Checkbox disabled checked />
        <span className="text-gray-500">Disabled checked</span>
      </label>
    </div>
  )
}
```

### Form Integration

```typescript
function CheckboxForm() {
  const [formData, setFormData] = useState({
    subscribe: false,
    notifications: false,
    marketing: false
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Form data:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset className="space-y-2">
        <legend className="font-semibold">Email Preferences</legend>

        <label className="flex items-center gap-2">
          <Checkbox
            checked={formData.subscribe}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, subscribe: checked === true })
            }
          />
          <span>Subscribe to newsletter</span>
        </label>

        <label className="flex items-center gap-2">
          <Checkbox
            checked={formData.notifications}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, notifications: checked === true })
            }
          />
          <span>Email notifications</span>
        </label>

        <label className="flex items-center gap-2">
          <Checkbox
            checked={formData.marketing}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, marketing: checked === true })
            }
          />
          <span>Marketing emails</span>
        </label>
      </fieldset>

      <button type="submit">Save Preferences</button>
    </form>
  )
}
```

## API Reference

### Checkbox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'S' \| 'M'` | `'M'` | Size variant |
| `checked` | `boolean \| 'indeterminate'` | - | Controlled checked state |
| `defaultChecked` | `boolean` | - | Uncontrolled default state |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | - | Called when state changes |
| `disabled` | `boolean` | `false` | Disables the checkbox |
| `required` | `boolean` | `false` | Makes field required |
| `name` | `string` | - | Form field name |
| `value` | `string` | `'on'` | Form field value |
| `id` | `string` | - | HTML id attribute |
| `className` | `string` | - | Additional CSS classes |

### TypeScript

```typescript
import { CheckboxProps as RadixCheckboxProps } from '@radix-ui/react-checkbox'

interface CheckboxProps extends RadixCheckboxProps {
  size?: 'S' | 'M'
}

export const Checkbox: React.ForwardRefExoticComponent<CheckboxProps>
```

## Common Patterns

### Checkbox Group

```typescript
function CheckboxGroup() {
  const options = [
    { id: 'option1', label: 'Option 1' },
    { id: 'option2', label: 'Option 2' },
    { id: 'option3', label: 'Option 3' },
  ]

  const [selected, setSelected] = useState<string[]>([])

  const toggleOption = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <fieldset>
      <legend>Select options</legend>
      {options.map(option => (
        <label key={option.id} className="flex items-center gap-2 py-1">
          <Checkbox
            checked={selected.includes(option.id)}
            onCheckedChange={() => toggleOption(option.id)}
          />
          <span>{option.label}</span>
        </label>
      ))}
      <p className="text-sm text-gray-500 mt-2">
        Selected: {selected.join(', ') || 'None'}
      </p>
    </fieldset>
  )
}
```

### Task List

```typescript
interface Task {
  id: string
  text: string
  completed: boolean
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Buy groceries', completed: false },
    { id: '2', text: 'Walk the dog', completed: false },
    { id: '3', text: 'Read a book', completed: false },
  ])

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="space-y-2">
      <h3>Tasks ({completedCount}/{tasks.length} completed)</h3>
      {tasks.map(task => (
        <label
          key={task.id}
          className={cn(
            "flex items-center gap-2 p-2 rounded",
            task.completed && "bg-gray-100"
          )}
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTask(task.id)}
          />
          <span className={cn(
            task.completed && "line-through text-gray-500"
          )}>
            {task.text}
          </span>
        </label>
      ))}
    </div>
  )
}
```

### Filter Options

```typescript
function FilterPanel() {
  const [filters, setFilters] = useState({
    inStock: false,
    onSale: false,
    freeShipping: false,
    highRating: false,
  })

  const activeFilters = Object.entries(filters)
    .filter(([_, active]) => active)
    .map(([key]) => key)

  return (
    <div className="p-4 border rounded">
      <h4 className="font-semibold mb-3">Filters</h4>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <Checkbox
            checked={filters.inStock}
            onCheckedChange={(checked) =>
              setFilters({ ...filters, inStock: checked === true })
            }
          />
          <span>In Stock Only</span>
        </label>

        <label className="flex items-center gap-2">
          <Checkbox
            checked={filters.onSale}
            onCheckedChange={(checked) =>
              setFilters({ ...filters, onSale: checked === true })
            }
          />
          <span>On Sale</span>
        </label>

        <label className="flex items-center gap-2">
          <Checkbox
            checked={filters.freeShipping}
            onCheckedChange={(checked) =>
              setFilters({ ...filters, freeShipping: checked === true })
            }
          />
          <span>Free Shipping</span>
        </label>

        <label className="flex items-center gap-2">
          <Checkbox
            checked={filters.highRating}
            onCheckedChange={(checked) =>
              setFilters({ ...filters, highRating: checked === true })
            }
          />
          <span>4+ Stars</span>
        </label>
      </div>

      {activeFilters.length > 0 && (
        <div className="mt-4 p-2 bg-blue-50 rounded text-sm">
          Active: {activeFilters.join(', ')}
        </div>
      )}
    </div>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox } from 'torch-glare/lib/components/Checkbox'

describe('Checkbox', () => {
  it('handles checked state changes', () => {
    const handleChange = jest.fn()
    render(
      <Checkbox
        onCheckedChange={handleChange}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('supports indeterminate state', () => {
    render(
      <Checkbox checked="indeterminate" />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate')
  })

  it('respects disabled state', () => {
    const handleChange = jest.fn()
    render(
      <Checkbox
        disabled
        onCheckedChange={handleChange}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(handleChange).not.toHaveBeenCalled()
    expect(checkbox).toBeDisabled()
  })

  it('applies size variants', () => {
    const { rerender } = render(<Checkbox size="S" />)
    let checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('w-[14px]', 'h-[14px]')

    rerender(<Checkbox size="M" />)
    checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('w-[16px]', 'h-[16px]')
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('Checkbox meets WCAG standards', async () => {
  const { container } = render(
    <div>
      <label htmlFor="terms">
        <Checkbox id="terms" />
        I agree to the terms
      </label>
    </div>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Keyboard Support

- **Space**: Toggle checkbox when focused
- **Tab**: Move focus to/from checkbox
- **Shift + Tab**: Move focus backwards

### ARIA Attributes

Radix UI automatically handles ARIA attributes:

```html
<!-- Unchecked -->
<button role="checkbox" aria-checked="false" data-state="unchecked">

<!-- Checked -->
<button role="checkbox" aria-checked="true" data-state="checked">

<!-- Indeterminate -->
<button role="checkbox" aria-checked="mixed" data-state="indeterminate">

<!-- Disabled -->
<button role="checkbox" aria-checked="false" data-disabled="">
```

### Screen Reader Support

- Announces checkbox role and state
- Reads associated label content
- Announces state changes
- Communicates disabled state

### Label Association

```typescript
// Method 1: Wrap in label
<label>
  <Checkbox />
  <span>Label text</span>
</label>

// Method 2: Use htmlFor
<Checkbox id="my-checkbox" />
<label htmlFor="my-checkbox">Label text</label>

// Method 3: Use aria-label
<Checkbox aria-label="Accept terms" />
```

## Styling

### Custom Styles

```typescript
<Checkbox
  className="border-blue-500 data-[state=checked]:bg-blue-500"
  size="M"
/>
```

### CSS Variables

```css
/* Custom theme variables */
:root {
  --checkbox-size-small: 14px;
  --checkbox-size-medium: 16px;
  --checkbox-border: #d1d5db;
  --checkbox-border-hover: #9ca3af;
  --checkbox-bg-checked: #3b82f6;
  --checkbox-bg-disabled: #f3f4f6;
}
```

### State-Based Styling

```css
/* Using data attributes from Radix UI */
.checkbox[data-state="checked"] {
  background: var(--primary);
}

.checkbox[data-state="indeterminate"] {
  background: var(--secondary);
}

.checkbox[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 1.8kb |
| First render | <5ms |
| Re-render | <2ms |
| Interaction | <1ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Use `React.memo()` for checkbox lists
2. Memoize change handlers with `useCallback`
3. Use virtualization for long lists
4. Batch state updates for multiple checkboxes
5. Consider uncontrolled mode for better performance

## Migration

### From Native Checkbox

```diff
// From HTML checkbox
- <input
-   type="checkbox"
-   checked={checked}
-   onChange={(e) => setChecked(e.target.checked)}
- />
+ <Checkbox
+   checked={checked}
+   onCheckedChange={setChecked}
+ />
```

### From v1.0.x

```diff
// Import path changed
- import Checkbox from 'torch-glare/Checkbox'
+ import { Checkbox } from 'torch-glare/lib/components/Checkbox'

// Size prop values changed
- <Checkbox size="small" />
+ <Checkbox size="S" />
```

## Troubleshooting

### Checkbox not updating

**Solution:** Use controlled state properly

```typescript
// ❌ Wrong - missing state handler
<Checkbox checked={true} />

// ✅ Correct - with state handler
const [checked, setChecked] = useState(false)
<Checkbox checked={checked} onCheckedChange={setChecked} />

// ✅ Or use uncontrolled
<Checkbox defaultChecked />
```

### Indeterminate not working

**Solution:** Pass 'indeterminate' string value

```typescript
// ❌ Wrong - boolean value
<Checkbox checked={indeterminate} />

// ✅ Correct - 'indeterminate' string
<Checkbox checked={indeterminate ? 'indeterminate' : false} />
```

### Form submission not working

**Solution:** Add name and value props

```typescript
<form>
  <Checkbox
    name="terms"
    value="accepted"
    required
  />
</form>
```

## Related Components

- [LabeledCheckBox](/docs/components/labeled-checkbox.md) - Checkbox with integrated label
- [Switch](/docs/components/switch.md) - Toggle switch alternative
- [Radio](/docs/components/radio.md) - Single selection option
- [Form](/docs/components/form.md) - Form wrapper with validation

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Migrated to Radix UI primitives
- Added indeterminate state support
- Improved accessibility

### v1.1.14
- Added size variants
- Fixed focus styles
- Performance optimizations

### v1.1.0
- Initial stable release