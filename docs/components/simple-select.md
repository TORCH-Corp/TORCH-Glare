---
name: SimpleSelect
version: 1.1.15
status: stable
category: components/forms
tags: [form, select, dropdown, custom, system-style, accessible]
last-reviewed: 2024-11-05
bundle-size: 3.4kb
dependencies:
  - "class-variance-authority": "^0.7.0"
  - "@/hooks/useClickOutside": "internal"
---

# SimpleSelect

> A lightweight, custom-styled select component with system theme styling. Features a compact dropdown with automatic scroll-to-selected behavior and click-outside handling. Ideal for system UI and compact form layouts.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import {
  SimpleSelectValue,
  SimpleSelectItem,
  SimpleSelectDropDown
} from 'torch-glare/lib/components/SimpleSelect'
```

## Quick Examples

### Basic Usage

```typescript
import { SimpleSelectValue, SimpleSelectItem } from 'torch-glare/lib/components/SimpleSelect'

function Example() {
  const [value, setValue] = useState('option1')

  return (
    <SimpleSelectValue
      value={value}
      onChange={setValue}
      placeholder="Select option..."
    >
      <SimpleSelectItem onClick={() => setValue('option1')}>
        Option 1
      </SimpleSelectItem>
      <SimpleSelectItem onClick={() => setValue('option2')}>
        Option 2
      </SimpleSelectItem>
      <SimpleSelectItem onClick={() => setValue('option3')}>
        Option 3
      </SimpleSelectItem>
    </SimpleSelectValue>
  )
}
```

### With Selected State

```typescript
function SelectWithHighlight() {
  const [selected, setSelected] = useState('medium')

  const options = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xlarge', label: 'Extra Large' }
  ]

  return (
    <SimpleSelectValue
      value={selected}
      onChange={setSelected}
    >
      {options.map(option => (
        <SimpleSelectItem
          key={option.value}
          selected={selected === option.value}
          onClick={() => setSelected(option.value)}
        >
          {option.label}
        </SimpleSelectItem>
      ))}
    </SimpleSelectValue>
  )
}
```

### Country Selector

```typescript
function CountrySelect() {
  const [country, setCountry] = useState('us')

  const countries = [
    { code: 'us', name: 'United States', flag: '🇺🇸' },
    { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'ca', name: 'Canada', flag: '🇨🇦' },
    { code: 'au', name: 'Australia', flag: '🇦🇺' },
    { code: 'de', name: 'Germany', flag: '🇩🇪' },
    { code: 'fr', name: 'France', flag: '🇫🇷' },
    { code: 'jp', name: 'Japan', flag: '🇯🇵' }
  ]

  const selectedCountry = countries.find(c => c.code === country)

  return (
    <SimpleSelectValue
      value={`${selectedCountry?.flag} ${selectedCountry?.name}`}
      onChange={() => {}}
      readOnly
    >
      {countries.map(c => (
        <SimpleSelectItem
          key={c.code}
          selected={country === c.code}
          onClick={() => setCountry(c.code)}
        >
          <span className="flex items-center gap-2">
            <span>{c.flag}</span>
            <span>{c.name}</span>
          </span>
        </SimpleSelectItem>
      ))}
    </SimpleSelectValue>
  )
}
```

### Time Zone Selector

```typescript
function TimeZoneSelect() {
  const [timezone, setTimezone] = useState('UTC')

  const timezones = [
    { value: 'UTC', label: 'UTC (±00:00)' },
    { value: 'EST', label: 'Eastern Time (−05:00)' },
    { value: 'CST', label: 'Central Time (−06:00)' },
    { value: 'MST', label: 'Mountain Time (−07:00)' },
    { value: 'PST', label: 'Pacific Time (−08:00)' },
    { value: 'CET', label: 'Central European (+ 01:00)' },
    { value: 'JST', label: 'Japan Time (+09:00)' }
  ]

  return (
    <SimpleSelectValue
      value={timezone}
      onChange={setTimezone}
      className="w-48"
    >
      {timezones.map(tz => (
        <SimpleSelectItem
          key={tz.value}
          selected={timezone === tz.value}
          onClick={() => setTimezone(tz.value)}
        >
          {tz.label}
        </SimpleSelectItem>
      ))}
    </SimpleSelectValue>
  )
}
```

### With Icons

```typescript
function IconSelect() {
  const [priority, setPriority] = useState('medium')

  const priorities = [
    { value: 'low', label: 'Low', icon: '🟢', color: 'text-green-500' },
    { value: 'medium', label: 'Medium', icon: '🟡', color: 'text-yellow-500' },
    { value: 'high', label: 'High', icon: '🟠', color: 'text-orange-500' },
    { value: 'critical', label: 'Critical', icon: '🔴', color: 'text-red-500' }
  ]

  const selected = priorities.find(p => p.value === priority)

  return (
    <SimpleSelectValue
      value={priority}
      onChange={setPriority}
      inputClassName={selected?.color}
    >
      {priorities.map(p => (
        <SimpleSelectItem
          key={p.value}
          selected={priority === p.value}
          onClick={() => setPriority(p.value)}
          className={p.color}
        >
          <span className="flex items-center gap-2">
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </span>
        </SimpleSelectItem>
      ))}
    </SimpleSelectValue>
  )
}
```

### Default Open State

```typescript
function DefaultOpenSelect() {
  const [value, setValue] = useState('')

  return (
    <SimpleSelectValue
      value={value}
      onChange={setValue}
      placeholder="Choose..."
      defaultOpen={true}
    >
      <SimpleSelectItem onClick={() => setValue('opt1')}>
        Option 1
      </SimpleSelectItem>
      <SimpleSelectItem onClick={() => setValue('opt2')}>
        Option 2
      </SimpleSelectItem>
    </SimpleSelectValue>
  )
}
```

## API Reference

### SimpleSelectValue Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Display value |
| `onChange` | `(value: string) => void` | - | Input change handler |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `className` | `string` | - | Container CSS classes |
| `inputClassName` | `string` | - | Input element CSS classes |
| `placeholder` | `string` | - | Placeholder text |
| `readOnly` | `boolean` | `false` | Makes input read-only |
| `disabled` | `boolean` | `false` | Disables the select |
| `children` | `ReactNode` | - | Dropdown items |

Plus standard HTML input attributes.

### SimpleSelectItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selected` | `boolean` | `false` | Highlights as selected |
| `onClick` | `() => void` | - | Click handler |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Item content |

### SimpleSelectDropDown Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Dropdown content |
| `onClick` | `() => void` | - | Click handler |

### TypeScript

```typescript
interface SimpleSelectValueProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  inputClassName?: string
  onChange?: (value: string) => void
  defaultOpen?: boolean
  className?: string
}

interface SimpleSelectItemProps extends HTMLAttributes<HTMLLIElement> {
  selected?: boolean
}

interface SimpleSelectDropDownProps {
  className?: string
  children: ReactNode
  onClick?: () => void
}

export const SimpleSelectValue: React.FC<SimpleSelectValueProps>
export const SimpleSelectItem: React.FC<SimpleSelectItemProps>
export const SimpleSelectDropDown: React.FC<SimpleSelectDropDownProps>
```

## Common Patterns

### Language Selector

```typescript
function LanguageSelector() {
  const [lang, setLang] = useState('en')

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'es', name: 'Spanish', native: 'Español' },
    { code: 'fr', name: 'French', native: 'Français' },
    { code: 'de', name: 'German', native: 'Deutsch' },
    { code: 'it', name: 'Italian', native: 'Italiano' },
    { code: 'pt', name: 'Portuguese', native: 'Português' },
    { code: 'ru', name: 'Russian', native: 'Русский' },
    { code: 'zh', name: 'Chinese', native: '中文' },
    { code: 'ja', name: 'Japanese', native: '日本語' },
    { code: 'ko', name: 'Korean', native: '한국어' }
  ]

  const selected = languages.find(l => l.code === lang)

  return (
    <SimpleSelectValue
      value={selected?.name || ''}
      onChange={() => {}}
      readOnly
      className="w-40"
    >
      <div className="max-h-64">
        {languages.map(language => (
          <SimpleSelectItem
            key={language.code}
            selected={lang === language.code}
            onClick={() => setLang(language.code)}
          >
            <div className="flex justify-between w-full">
              <span>{language.native}</span>
              <span className="text-xs opacity-60">{language.name}</span>
            </div>
          </SimpleSelectItem>
        ))}
      </div>
    </SimpleSelectValue>
  )
}
```

### Status Selector

```typescript
function StatusSelector() {
  const [status, setStatus] = useState('active')

  const statuses = [
    { value: 'active', label: 'Active', dot: '🟢' },
    { value: 'pending', label: 'Pending', dot: '🟡' },
    { value: 'inactive', label: 'Inactive', dot: '⚪' },
    { value: 'blocked', label: 'Blocked', dot: '🔴' }
  ]

  const current = statuses.find(s => s.value === status)

  return (
    <SimpleSelectValue
      value={`${current?.dot} ${current?.label}`}
      onChange={() => {}}
      readOnly
      className="w-36"
    >
      {statuses.map(s => (
        <SimpleSelectItem
          key={s.value}
          selected={status === s.value}
          onClick={() => setStatus(s.value)}
        >
          <span className="flex items-center gap-2">
            <span>{s.dot}</span>
            <span>{s.label}</span>
          </span>
        </SimpleSelectItem>
      ))}
    </SimpleSelectValue>
  )
}
```

### Font Size Selector

```typescript
function FontSizeSelector() {
  const [fontSize, setFontSize] = useState('14')

  const sizes = ['10', '11', '12', '13', '14', '15', '16', '18', '20', '24']

  return (
    <div className="flex items-center gap-2">
      <label>Font Size:</label>
      <SimpleSelectValue
        value={`${fontSize}px`}
        onChange={(val) => setFontSize(val.replace('px', ''))}
        className="w-20"
      >
        {sizes.map(size => (
          <SimpleSelectItem
            key={size}
            selected={fontSize === size}
            onClick={() => setFontSize(size)}
          >
            {size}px
          </SimpleSelectItem>
        ))}
      </SimpleSelectValue>
    </div>
  )
}
```

### Dynamic Options

```typescript
function DynamicSelect() {
  const [selected, setSelected] = useState('')
  const [options, setOptions] = useState(['Option 1', 'Option 2'])
  const [newOption, setNewOption] = useState('')

  const addOption = () => {
    if (newOption && !options.includes(newOption)) {
      setOptions([...options, newOption])
      setNewOption('')
    }
  }

  return (
    <div className="space-y-2">
      <SimpleSelectValue
        value={selected}
        onChange={setSelected}
        placeholder="Select or add..."
      >
        {options.map(opt => (
          <SimpleSelectItem
            key={opt}
            selected={selected === opt}
            onClick={() => setSelected(opt)}
          >
            {opt}
          </SimpleSelectItem>
        ))}
        <SimpleSelectItem onClick={() => {}}>
          <input
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation()
                addOption()
              }
            }}
            placeholder="Add new..."
            className="bg-transparent outline-none"
            onClick={(e) => e.stopPropagation()}
          />
        </SimpleSelectItem>
      </SimpleSelectValue>
    </div>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { SimpleSelectValue, SimpleSelectItem } from 'torch-glare/lib/components/SimpleSelect'

describe('SimpleSelect', () => {
  it('opens dropdown on click', () => {
    render(
      <SimpleSelectValue value="" onChange={() => {}}>
        <SimpleSelectItem>Option 1</SimpleSelectItem>
      </SimpleSelectValue>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(screen.getByText('Option 1')).toBeVisible()
  })

  it('selects item and closes dropdown', () => {
    const handleChange = jest.fn()
    render(
      <SimpleSelectValue value="" onChange={handleChange}>
        <SimpleSelectItem onClick={() => handleChange('opt1')}>
          Option 1
        </SimpleSelectItem>
      </SimpleSelectValue>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const item = screen.getByText('Option 1')
    fireEvent.click(item)

    expect(handleChange).toHaveBeenCalledWith('opt1')
  })

  it('scrolls to selected item', () => {
    const scrollIntoViewMock = jest.fn()
    HTMLElement.prototype.scrollIntoView = scrollIntoViewMock

    render(
      <SimpleSelectValue value="selected" defaultOpen>
        <SimpleSelectItem>Option 1</SimpleSelectItem>
        <SimpleSelectItem selected>Selected</SimpleSelectItem>
        <SimpleSelectItem>Option 3</SimpleSelectItem>
      </SimpleSelectValue>
    )

    expect(scrollIntoViewMock).toHaveBeenCalled()
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('SimpleSelect meets WCAG standards', async () => {
  const { container } = render(
    <div>
      <label htmlFor="select">Choose option</label>
      <SimpleSelectValue
        value=""
        onChange={() => {}}
        id="select"
      >
        <SimpleSelectItem>Option 1</SimpleSelectItem>
        <SimpleSelectItem>Option 2</SimpleSelectItem>
      </SimpleSelectValue>
    </div>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Keyboard Support

- **Tab**: Focus the select
- **Space/Enter**: Open dropdown
- **Escape**: Close dropdown
- **Arrow Keys**: Navigate options (with additional implementation)

### ARIA Attributes

```typescript
// Enhanced accessibility
<SimpleSelectValue
  aria-expanded={isOpen}
  aria-haspopup="listbox"
  aria-label="Select option"
/>
```

### Focus Management

- Auto-focus on selected item when opening
- Click outside to close
- Visual focus indicators

## Styling

### System Theme

The component uses system-style theming by default:

```css
/* Dark theme with purple accents */
.simple-select {
  background: rgba(0, 0, 0, 0.2);
  border-color: #2c2d2e;
}

.simple-select:hover {
  border-color: #9748ff;
  background: rgba(151, 72, 255, 0.1);
}

.simple-select[data-active="true"] {
  border-color: #9748ff;
  background: rgba(151, 72, 255, 0.1);
}
```

### Custom Styles

```typescript
<SimpleSelectValue
  className="custom-container"
  inputClassName="custom-input"
>
  <SimpleSelectItem className="custom-item">
    Option
  </SimpleSelectItem>
</SimpleSelectValue>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 3.4kb |
| First render | <10ms |
| Dropdown open | <5ms |
| Scroll to selected | <2ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Virtualize long option lists (>100 items)
2. Debounce search/filter operations
3. Memoize option components
4. Use `React.memo` for static options

## Migration

### From Native Select

```diff
// From HTML select
- <select value={value} onChange={(e) => setValue(e.target.value)}>
-   <option value="opt1">Option 1</option>
-   <option value="opt2">Option 2</option>
- </select>

// To SimpleSelect
+ <SimpleSelectValue value={value} onChange={setValue}>
+   <SimpleSelectItem onClick={() => setValue('opt1')}>
+     Option 1
+   </SimpleSelectItem>
+   <SimpleSelectItem onClick={() => setValue('opt2')}>
+     Option 2
+   </SimpleSelectItem>
+ </SimpleSelectValue>
```

## Troubleshooting

### Dropdown not closing

**Solution:** Ensure click handlers stop propagation properly

```typescript
<SimpleSelectItem onClick={(e) => {
  e.stopPropagation()
  setValue(option)
}}>
```

### Scroll not working

**Solution:** Check container has max-height

```typescript
<SimpleSelectValue>
  <div className="max-h-64 overflow-auto">
    {/* items */}
  </div>
</SimpleSelectValue>
```

## Related Components

- [Select](/docs/components/select.md) - Full-featured select with Radix UI
- [InputField](/docs/components/input-field.md) - Input with dropdown support
- [Popover](/docs/components/popover.md) - Generic popover component

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Added scroll-to-selected feature
- Improved click outside handling
- Enhanced TypeScript types

### v1.1.14
- Initial SimpleSelect implementation
- System theme styling

### v1.1.0
- Component planning phase