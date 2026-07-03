---
name: LabeledCheckBox
version: 1.1.15
status: stable
category: components/forms
tags: [form, checkbox, label, selection, accessible, compound]
last-reviewed: 2024-11-05
bundle-size: 2.1kb
dependencies:
  - "@/components/Checkbox": "internal"
  - "@/components/Label": "internal"
---

# LabeledCheckBox

> A checkbox component with integrated label, supporting required indicators and secondary labels. Combines Checkbox and Label components for a complete form field solution with automatic accessibility handling.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { LabeledCheckBox } from 'torch-glare/lib/components/LabeledCheckBox'
```

## Quick Examples

### Basic Usage

```typescript
import { LabeledCheckBox } from 'torch-glare/lib/components/LabeledCheckBox'

function Example() {
  const [checked, setChecked] = useState(false)

  return (
    <LabeledCheckBox
      id="terms"
      label="I agree to the terms and conditions"
      checked={checked}
      onCheckedChange={setChecked}
    />
  )
}
```

### Required Field

```typescript
function RequiredCheckbox() {
  const [agreed, setAgreed] = useState(false)

  return (
    <LabeledCheckBox
      id="consent"
      label="Privacy Policy"
      requiredLabel="*"
      secondaryLabel="(required)"
      checked={agreed}
      onCheckedChange={setAgreed}
      required
    />
  )
}
```

### Different Sizes

```typescript
function SizeVariants() {
  return (
    <div className="space-y-4">
      <LabeledCheckBox
        id="small"
        label="Small checkbox"
        size="S"
      />

      <LabeledCheckBox
        id="medium"
        label="Medium checkbox (default)"
        size="M"
      />

      <LabeledCheckBox
        id="large"
        label="Large checkbox"
        size="L"
      />
    </div>
  )
}
```

### With Secondary Label

```typescript
function DetailedCheckbox() {
  return (
    <LabeledCheckBox
      id="notifications"
      label="Email notifications"
      secondaryLabel="Receive updates about your account"
      defaultChecked
    />
  )
}
```

### Themed Checkbox

```typescript
function ThemedCheckboxes() {
  return (
    <>
      <LabeledCheckBox
        id="light"
        label="Light theme checkbox"
        theme="light"
      />

      <LabeledCheckBox
        id="dark"
        label="Dark theme checkbox"
        theme="dark"
      />
    </>
  )
}
```

### Form Integration

```typescript
function PreferencesForm() {
  const [preferences, setPreferences] = useState({
    marketing: false,
    analytics: false,
    necessary: true
  })

  const updatePreference = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  return (
    <form className="space-y-3">
      <h3>Cookie Preferences</h3>

      <LabeledCheckBox
        id="necessary"
        label="Necessary Cookies"
        secondaryLabel="Required for site functionality"
        checked={preferences.necessary}
        disabled
      />

      <LabeledCheckBox
        id="analytics"
        label="Analytics Cookies"
        secondaryLabel="Help us improve our service"
        checked={preferences.analytics}
        onCheckedChange={(checked) =>
          updatePreference('analytics', checked === true)
        }
      />

      <LabeledCheckBox
        id="marketing"
        label="Marketing Cookies"
        secondaryLabel="Personalized advertisements"
        checked={preferences.marketing}
        onCheckedChange={(checked) =>
          updatePreference('marketing', checked === true)
        }
      />

      <button type="submit">Save Preferences</button>
    </form>
  )
}
```

## API Reference

### LabeledCheckBox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | Required unique identifier |
| `label` | `string` | - | Primary label text |
| `secondaryLabel` | `string` | - | Additional descriptive text |
| `requiredLabel` | `string` | - | Required field indicator |
| `size` | `'S' \| 'M' \| 'L'` | `'M'` | Size variant |
| `theme` | `'dark' \| 'light' \| 'default'` | - | Theme variant |
| `checked` | `boolean \| 'indeterminate'` | - | Controlled checked state |
| `defaultChecked` | `boolean` | - | Uncontrolled default state |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | - | Change handler |
| `disabled` | `boolean` | `false` | Disables the checkbox |
| `required` | `boolean` | `false` | Makes field required |
| `className` | `string` | - | Additional CSS classes |

Plus all props from the underlying Checkbox component except `size`.

### TypeScript

```typescript
import { ComponentProps } from 'react'
import { Checkbox } from '@/components/Checkbox'

interface LabeledCheckBoxProps extends Omit<ComponentProps<typeof Checkbox>, 'size'> {
  label: string
  id: string
  secondaryLabel?: string
  requiredLabel?: string
  size?: 'S' | 'M' | 'L'
  theme?: 'dark' | 'light' | 'default'
}

export const LabeledCheckBox: React.ForwardRefExoticComponent<LabeledCheckBoxProps>
```

## Common Patterns

### Terms and Conditions

```typescript
function TermsAcceptance() {
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string>()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!accepted) {
      setError('You must accept the terms to continue')
      return
    }
    // Process form
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <LabeledCheckBox
          id="terms"
          label="I accept the terms and conditions"
          requiredLabel="*"
          secondaryLabel="Please read our terms before proceeding"
          checked={accepted}
          onCheckedChange={(checked) => {
            setAccepted(checked === true)
            setError(undefined)
          }}
          className={error ? 'text-red-500' : ''}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <button type="submit" disabled={!accepted}>
        Continue
      </button>
    </form>
  )
}
```

### Feature Toggles

```typescript
function FeatureSettings() {
  const [features, setFeatures] = useState({
    darkMode: false,
    notifications: true,
    autoSave: true,
    betaFeatures: false
  })

  const toggleFeature = (feature: string) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature as keyof typeof features]
    }))
  }

  return (
    <div className="space-y-4">
      <h3>Feature Settings</h3>

      <LabeledCheckBox
        id="dark-mode"
        label="Dark Mode"
        secondaryLabel="Use dark theme across the application"
        checked={features.darkMode}
        onCheckedChange={() => toggleFeature('darkMode')}
        size="M"
      />

      <LabeledCheckBox
        id="notifications"
        label="Push Notifications"
        secondaryLabel="Receive real-time updates"
        checked={features.notifications}
        onCheckedChange={() => toggleFeature('notifications')}
        size="M"
      />

      <LabeledCheckBox
        id="auto-save"
        label="Auto-Save"
        secondaryLabel="Automatically save your work"
        checked={features.autoSave}
        onCheckedChange={() => toggleFeature('autoSave')}
        size="M"
      />

      <LabeledCheckBox
        id="beta"
        label="Beta Features"
        secondaryLabel="Try experimental features"
        checked={features.betaFeatures}
        onCheckedChange={() => toggleFeature('betaFeatures')}
        size="M"
      />
    </div>
  )
}
```

### Subscription Options

```typescript
function EmailSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<string[]>([])

  const options = [
    {
      id: 'newsletter',
      label: 'Weekly Newsletter',
      description: 'Product updates and tips'
    },
    {
      id: 'promotions',
      label: 'Promotional Emails',
      description: 'Special offers and discounts'
    },
    {
      id: 'digest',
      label: 'Daily Digest',
      description: 'Summary of daily activity'
    }
  ]

  const toggleSubscription = (id: string) => {
    setSubscriptions(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="space-y-3">
      <h3>Email Subscriptions</h3>
      {options.map(option => (
        <LabeledCheckBox
          key={option.id}
          id={option.id}
          label={option.label}
          secondaryLabel={option.description}
          checked={subscriptions.includes(option.id)}
          onCheckedChange={() => toggleSubscription(option.id)}
        />
      ))}
      <p className="text-sm text-gray-600">
        Subscribed to: {subscriptions.length} list(s)
      </p>
    </div>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LabeledCheckBox } from 'torch-glare/lib/components/LabeledCheckBox'

describe('LabeledCheckBox', () => {
  it('renders label and checkbox together', () => {
    render(
      <LabeledCheckBox
        id="test"
        label="Test Label"
        secondaryLabel="Secondary text"
      />
    )

    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('Secondary text')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('handles checked state changes', () => {
    const handleChange = jest.fn()
    render(
      <LabeledCheckBox
        id="test"
        label="Click me"
        onCheckedChange={handleChange}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('shows required indicator', () => {
    render(
      <LabeledCheckBox
        id="test"
        label="Required field"
        requiredLabel="*"
        required
      />
    )

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('respects disabled state', () => {
    render(
      <LabeledCheckBox
        id="test"
        label="Disabled"
        disabled
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('LabeledCheckBox meets WCAG standards', async () => {
  const { container } = render(
    <LabeledCheckBox
      id="accessible"
      label="Accessible checkbox"
      secondaryLabel="With description"
      requiredLabel="*"
      required
    />
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Automatic Features

- Label automatically associated with checkbox via `id`
- Proper ARIA attributes inherited from Checkbox component
- Required state communicated to screen readers
- Secondary label provides additional context

### Keyboard Support

- **Space**: Toggle checkbox when focused
- **Tab**: Move focus to/from checkbox
- **Shift + Tab**: Move focus backwards

### Screen Reader Support

```html
<!-- Rendered HTML structure -->
<label for="checkbox-id">
  <span>Primary Label</span>
  <span>*</span>
  <span>Secondary Label</span>
  <button
    role="checkbox"
    aria-checked="false"
    aria-required="true"
    id="checkbox-id"
  />
</label>
```

### Focus Management

- Visual focus ring on checkbox
- Label click triggers checkbox toggle
- Maintains focus during state changes

## Styling

### Custom Styles

```typescript
<LabeledCheckBox
  id="custom"
  label="Custom styled"
  className="text-blue-600 hover:text-blue-700"
  size="L"
/>
```

### Size Variants Mapping

| LabeledCheckBox Size | Checkbox Size | Label Size |
|---------------------|---------------|------------|
| S | S | S |
| M | M | M |
| L | M | M |

Note: Large size uses medium checkbox for visual balance.

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 2.1kb |
| First render | <6ms |
| Re-render | <3ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Use uncontrolled mode with `defaultChecked` when possible
2. Memoize change handlers with `useCallback`
3. Group multiple checkboxes in a single parent component
4. Use React.memo for lists of checkboxes

## Migration

### From Separate Checkbox and Label

```diff
// Old approach
- <div>
-   <label htmlFor="cb">Label</label>
-   <Checkbox id="cb" />
- </div>

// New approach
+ <LabeledCheckBox
+   id="cb"
+   label="Label"
+ />
```

### From v1.0.x

```diff
// Import path
- import LabeledCheckBox from 'torch-glare/LabeledCheckBox'
+ import { LabeledCheckBox } from 'torch-glare/lib/components/LabeledCheckBox'

// Size prop values
- <LabeledCheckBox size="small" />
+ <LabeledCheckBox size="S" />
```

## Troubleshooting

### Label not clickable

**Solution:** Ensure `id` prop is provided and unique

```typescript
// ❌ Wrong - missing id
<LabeledCheckBox label="Click me" />

// ✅ Correct - with unique id
<LabeledCheckBox id="unique-id" label="Click me" />
```

### Styles not applying

**Solution:** Use className for custom styles

```typescript
<LabeledCheckBox
  id="styled"
  label="Custom"
  className="custom-class"
/>
```

## Related Components

- [Checkbox](/docs/components/checkbox.md) - Base checkbox component
- [Label](/docs/components/label.md) - Label component
- [LabeledRadio](/docs/components/labeled-radio.md) - Radio with label
- [Switch](/docs/components/switch.md) - Toggle switch alternative

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Integrated Label component
- Added size variants
- Improved accessibility

### v1.1.14
- Added theme support
- Fixed label association

### v1.1.0
- Initial stable release