---
name: LabeledRadio
version: 1.1.15
status: stable
category: components/forms
tags: [form, radio, label, selection, accessible, compound]
last-reviewed: 2024-11-05
bundle-size: 2.2kb
dependencies:
  - "@/components/Radio": "internal"
  - "@/components/Label": "internal"
---

# LabeledRadio

> A radio button component with integrated label, supporting required indicators and secondary labels. Combines Radio and Label components for a complete form field solution with automatic accessibility handling.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { LabeledRadio } from 'torch-glare/lib/components/LabeledRadio'
import { RadioGroup } from 'torch-glare/lib/components/Radio'
```

## Quick Examples

### Basic Usage

```typescript
import { LabeledRadio } from 'torch-glare/lib/components/LabeledRadio'
import { RadioGroup } from 'torch-glare/lib/components/Radio'

function Example() {
  const [selected, setSelected] = useState('option1')

  return (
    <RadioGroup value={selected} onValueChange={setSelected}>
      <LabeledRadio
        value="option1"
        id="radio1"
        label="Option 1"
      />
      <LabeledRadio
        value="option2"
        id="radio2"
        label="Option 2"
      />
      <LabeledRadio
        value="option3"
        id="radio3"
        label="Option 3"
      />
    </RadioGroup>
  )
}
```

### With Secondary Labels

```typescript
function DetailedOptions() {
  const [plan, setPlan] = useState('basic')

  return (
    <RadioGroup value={plan} onValueChange={setPlan}>
      <LabeledRadio
        value="basic"
        id="plan-basic"
        label="Basic Plan"
        secondaryLabel="$9.99/month"
      />
      <LabeledRadio
        value="pro"
        id="plan-pro"
        label="Pro Plan"
        secondaryLabel="$19.99/month"
      />
      <LabeledRadio
        value="enterprise"
        id="plan-enterprise"
        label="Enterprise Plan"
        secondaryLabel="Contact for pricing"
      />
    </RadioGroup>
  )
}
```

### Required Selection

```typescript
function RequiredRadioGroup() {
  const [agreement, setAgreement] = useState('')

  return (
    <fieldset>
      <legend>Terms Acceptance</legend>
      <RadioGroup value={agreement} onValueChange={setAgreement} required>
        <LabeledRadio
          value="agree"
          id="terms-agree"
          label="I agree"
          requiredLabel="*"
          secondaryLabel="Accept all terms and conditions"
        />
        <LabeledRadio
          value="disagree"
          id="terms-disagree"
          label="I disagree"
          requiredLabel="*"
          secondaryLabel="Decline terms and conditions"
        />
      </RadioGroup>
    </fieldset>
  )
}
```

### Different Sizes

```typescript
function SizeVariants() {
  const [size, setSize] = useState('medium')

  return (
    <div className="space-y-6">
      <RadioGroup value={size} onValueChange={setSize}>
        <LabeledRadio
          value="small"
          id="size-s"
          label="Small size"
          size="S"
        />
        <LabeledRadio
          value="medium"
          id="size-m"
          label="Medium size (default)"
          size="M"
        />
        <LabeledRadio
          value="large"
          id="size-l"
          label="Large size"
          size="L"
        />
      </RadioGroup>
    </div>
  )
}
```

### Themed Options

```typescript
function ThemedRadios() {
  const [theme, setTheme] = useState('light')

  return (
    <RadioGroup value={theme} onValueChange={setTheme}>
      <LabeledRadio
        value="light"
        id="theme-light"
        label="Light Theme"
        theme="light"
      />
      <LabeledRadio
        value="dark"
        id="theme-dark"
        label="Dark Theme"
        theme="dark"
      />
      <LabeledRadio
        value="auto"
        id="theme-auto"
        label="Auto Theme"
        theme="default"
      />
    </RadioGroup>
  )
}
```

### Shipping Options

```typescript
function ShippingOptions() {
  const [shipping, setShipping] = useState('standard')

  const options = [
    {
      value: 'standard',
      label: 'Standard Shipping',
      secondary: '5-7 business days - Free'
    },
    {
      value: 'express',
      label: 'Express Shipping',
      secondary: '2-3 business days - $9.99'
    },
    {
      value: 'overnight',
      label: 'Overnight Shipping',
      secondary: 'Next business day - $24.99'
    }
  ]

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-4">Select Shipping Method</h3>
      <RadioGroup value={shipping} onValueChange={setShipping}>
        <div className="space-y-3">
          {options.map((option) => (
            <div
              key={option.value}
              className="p-3 border rounded hover:bg-gray-50"
            >
              <LabeledRadio
                value={option.value}
                id={`shipping-${option.value}`}
                label={option.label}
                secondaryLabel={option.secondary}
              />
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}
```

## API Reference

### LabeledRadio Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Radio button value |
| `id` | `string` | - | HTML id for accessibility |
| `label` | `string` | - | Primary label text |
| `secondaryLabel` | `string` | - | Additional descriptive text |
| `requiredLabel` | `string` | - | Required field indicator |
| `size` | `'S' \| 'M' \| 'L'` | `'M'` | Size variant |
| `theme` | `'dark' \| 'light' \| 'default'` | - | Theme variant |
| `name` | `string` | - | Form field name |
| `disabled` | `boolean` | `false` | Disables the radio |
| `className` | `string` | - | Additional CSS classes |

Note: Must be used within a `RadioGroup` component.

### TypeScript

```typescript
import { ComponentProps } from 'react'
import { Radio } from '@/components/Radio'

interface LabeledRadioProps extends Omit<ComponentProps<typeof Radio>, 'size'> {
  label?: string
  secondaryLabel?: string
  requiredLabel?: string
  size?: 'S' | 'M' | 'L'
  theme?: 'dark' | 'light' | 'default'
  name?: string
  id?: string
}

export const LabeledRadio: React.ForwardRefExoticComponent<LabeledRadioProps>
```

## Common Patterns

### Payment Methods

```typescript
function PaymentMethodSelector() {
  const [method, setMethod] = useState('card')

  const methods = [
    {
      value: 'card',
      label: 'Credit/Debit Card',
      secondary: 'Visa, Mastercard, Amex',
      icon: '💳'
    },
    {
      value: 'paypal',
      label: 'PayPal',
      secondary: 'Pay with your PayPal account',
      icon: '💰'
    },
    {
      value: 'bank',
      label: 'Bank Transfer',
      secondary: '3-5 business days',
      icon: '🏦'
    }
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Payment Method</h3>
      <RadioGroup value={method} onValueChange={setMethod}>
        {methods.map((m) => (
          <div
            key={m.value}
            className="flex items-start space-x-2 p-3 border rounded hover:border-blue-500"
          >
            <span className="text-2xl mr-2">{m.icon}</span>
            <LabeledRadio
              value={m.value}
              id={`payment-${m.value}`}
              label={m.label}
              secondaryLabel={m.secondary}
            />
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
```

### Notification Preferences

```typescript
function NotificationSettings() {
  const [frequency, setFrequency] = useState('daily')

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Email Notification Frequency</h3>
      <RadioGroup value={frequency} onValueChange={setFrequency}>
        <LabeledRadio
          value="realtime"
          id="freq-realtime"
          label="Real-time"
          secondaryLabel="Get notified immediately"
        />
        <LabeledRadio
          value="daily"
          id="freq-daily"
          label="Daily Digest"
          secondaryLabel="Summary once a day at 9 AM"
        />
        <LabeledRadio
          value="weekly"
          id="freq-weekly"
          label="Weekly Summary"
          secondaryLabel="Every Monday morning"
        />
        <LabeledRadio
          value="never"
          id="freq-never"
          label="Never"
          secondaryLabel="No email notifications"
        />
      </RadioGroup>
    </div>
  )
}
```

### Survey Questions

```typescript
function SurveyForm() {
  const [experience, setExperience] = useState('')
  const [recommendation, setRecommendation] = useState('')

  return (
    <form className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">How was your experience?</h3>
        <RadioGroup value={experience} onValueChange={setExperience}>
          <LabeledRadio
            value="excellent"
            id="exp-excellent"
            label="😊 Excellent"
            size="L"
          />
          <LabeledRadio
            value="good"
            id="exp-good"
            label="🙂 Good"
            size="L"
          />
          <LabeledRadio
            value="average"
            id="exp-average"
            label="😐 Average"
            size="L"
          />
          <LabeledRadio
            value="poor"
            id="exp-poor"
            label="😕 Poor"
            size="L"
          />
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Would you recommend us?</h3>
        <RadioGroup value={recommendation} onValueChange={setRecommendation}>
          <LabeledRadio
            value="definitely"
            id="rec-definitely"
            label="Definitely"
            secondaryLabel="I would highly recommend"
          />
          <LabeledRadio
            value="probably"
            id="rec-probably"
            label="Probably"
            secondaryLabel="I might recommend"
          />
          <LabeledRadio
            value="not-sure"
            id="rec-not-sure"
            label="Not Sure"
            secondaryLabel="I'm undecided"
          />
          <LabeledRadio
            value="no"
            id="rec-no"
            label="No"
            secondaryLabel="I would not recommend"
          />
        </RadioGroup>
      </div>

      <button type="submit">Submit Survey</button>
    </form>
  )
}
```

### Account Type Selection

```typescript
function AccountTypeSelector() {
  const [accountType, setAccountType] = useState('')

  const types = [
    {
      value: 'personal',
      label: 'Personal Account',
      secondary: 'For individual use',
      features: ['5 GB storage', '1 user', 'Basic support']
    },
    {
      value: 'team',
      label: 'Team Account',
      secondary: 'For small teams',
      features: ['100 GB storage', '10 users', 'Priority support']
    },
    {
      value: 'enterprise',
      label: 'Enterprise Account',
      secondary: 'For large organizations',
      features: ['Unlimited storage', 'Unlimited users', '24/7 support']
    }
  ]

  return (
    <div>
      <h3 className="font-semibold mb-4">Choose Account Type</h3>
      <RadioGroup value={accountType} onValueChange={setAccountType}>
        {types.map((type) => (
          <div
            key={type.value}
            className="mb-3 p-4 border rounded hover:shadow-md"
          >
            <LabeledRadio
              value={type.value}
              id={`account-${type.value}`}
              label={type.label}
              secondaryLabel={type.secondary}
              size="L"
            />
            <ul className="mt-2 ml-8 text-sm text-gray-600">
              {type.features.map((feature, i) => (
                <li key={i}>✓ {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LabeledRadio } from 'torch-glare/lib/components/LabeledRadio'
import { RadioGroup } from 'torch-glare/lib/components/Radio'

describe('LabeledRadio', () => {
  it('renders label and radio together', () => {
    render(
      <RadioGroup>
        <LabeledRadio
          value="test"
          id="test-radio"
          label="Test Label"
          secondaryLabel="Secondary text"
        />
      </RadioGroup>
    )

    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('Secondary text')).toBeInTheDocument()
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })

  it('handles selection in group', () => {
    const handleChange = jest.fn()
    render(
      <RadioGroup onValueChange={handleChange}>
        <LabeledRadio value="opt1" id="opt1" label="Option 1" />
        <LabeledRadio value="opt2" id="opt2" label="Option 2" />
      </RadioGroup>
    )

    const radio2 = screen.getAllByRole('radio')[1]
    fireEvent.click(radio2)

    expect(handleChange).toHaveBeenCalledWith('opt2')
  })

  it('shows required indicator', () => {
    render(
      <RadioGroup>
        <LabeledRadio
          value="test"
          id="test"
          label="Required field"
          requiredLabel="*"
        />
      </RadioGroup>
    )

    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('applies size variants', () => {
    const { rerender } = render(
      <RadioGroup>
        <LabeledRadio value="test" id="test" label="Test" size="S" />
      </RadioGroup>
    )

    // Size S uses size S for label
    expect(screen.getByText('Test')).toBeInTheDocument()

    rerender(
      <RadioGroup>
        <LabeledRadio value="test" id="test" label="Test" size="L" />
      </RadioGroup>
    )

    // Size L uses size M for label (per implementation)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('LabeledRadio meets WCAG standards', async () => {
  const { container } = render(
    <fieldset>
      <legend>Select an option</legend>
      <RadioGroup defaultValue="opt1">
        <LabeledRadio
          value="opt1"
          id="accessible-opt1"
          label="Option 1"
          secondaryLabel="First option"
        />
        <LabeledRadio
          value="opt2"
          id="accessible-opt2"
          label="Option 2"
          secondaryLabel="Second option"
        />
      </RadioGroup>
    </fieldset>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Automatic Features

- Label automatically associated with radio via `id`
- Proper ARIA attributes inherited from Radio component
- Required state communicated to screen readers
- Secondary label provides additional context

### Keyboard Support

- **Tab**: Move focus into radio group
- **Arrow Keys**: Navigate between options
- **Space**: Select focused option

### Screen Reader Support

```html
<!-- Rendered HTML structure -->
<label for="radio-id">
  <span>Primary Label</span>
  <span>*</span>
  <span>Secondary Label</span>
  <button
    role="radio"
    aria-checked="false"
    id="radio-id"
  />
</label>
```

### Best Practices

```typescript
// Always use within RadioGroup
<RadioGroup>
  <LabeledRadio {...props} />
</RadioGroup>

// Use fieldset/legend for semantic grouping
<fieldset>
  <legend>Question</legend>
  <RadioGroup>
    <LabeledRadio {...props} />
  </RadioGroup>
</fieldset>
```

## Styling

### Custom Styles

```typescript
<LabeledRadio
  value="custom"
  id="custom"
  label="Custom styled"
  className="text-blue-600 hover:text-blue-700"
  size="L"
/>
```

### Size Variants Mapping

| LabeledRadio Size | Radio Size | Label Size |
|-------------------|------------|------------|
| S | S | S |
| M | M | M |
| L | M | M |

Note: Large size uses medium radio for visual balance.

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 2.2kb |
| First render | <7ms |
| Re-render | <3ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Use uncontrolled RadioGroup when possible
2. Memoize complex option lists
3. Use React.memo for option components
4. Keep RadioGroup structure flat

## Migration

### From Separate Radio and Label

```diff
// Old approach
- <RadioGroup>
-   <div>
-     <Radio value="opt" id="opt" />
-     <label htmlFor="opt">Label</label>
-   </div>
- </RadioGroup>

// New approach
+ <RadioGroup>
+   <LabeledRadio
+     value="opt"
+     id="opt"
+     label="Label"
+   />
+ </RadioGroup>
```

### From v1.0.x

```diff
// Import path
- import LabeledRadio from 'torch-glare/LabeledRadio'
+ import { LabeledRadio } from 'torch-glare/lib/components/LabeledRadio'

// Size prop values
- <LabeledRadio size="small" />
+ <LabeledRadio size="S" />
```

## Troubleshooting

### Radio not selectable

**Solution:** Ensure it's within RadioGroup

```typescript
// ❌ Wrong - not in group
<LabeledRadio value="opt" label="Option" />

// ✅ Correct - within RadioGroup
<RadioGroup>
  <LabeledRadio value="opt" label="Option" />
</RadioGroup>
```

### Label not clickable

**Solution:** Provide unique `id` prop

```typescript
// ❌ Wrong - missing id
<LabeledRadio value="opt" label="Click me" />

// ✅ Correct - with id
<LabeledRadio value="opt" id="unique-id" label="Click me" />
```

## Related Components

- [Radio](/docs/components/radio.md) - Base radio component
- [RadioGroup](/docs/components/radio.md#radiogroup) - Radio group container
- [Label](/docs/components/label.md) - Label component
- [LabeledCheckBox](/docs/components/labeled-checkbox.md) - Checkbox with label
- [RadioCard](/docs/components/radio-card.md) - Card-style radio

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