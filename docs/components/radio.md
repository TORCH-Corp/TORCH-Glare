---
name: Radio
version: 1.1.15
status: stable
category: components/forms
tags: [form, radio, selection, radix-ui, accessible, group, controlled]
last-reviewed: 2024-11-05
bundle-size: 2.0kb
dependencies:
  - "@radix-ui/react-radio-group": "^1.0.0"
  - "class-variance-authority": "^0.7.0"
---

# Radio

> A fully accessible radio button component built on Radix UI primitives. Includes RadioGroup for managing single selection from multiple options with keyboard navigation and ARIA support.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { Radio, RadioGroup } from 'torch-glare/lib/components/Radio'
```

## Quick Examples

### Basic Radio Group

```typescript
import { Radio, RadioGroup } from 'torch-glare/lib/components/Radio'

function Example() {
  const [value, setValue] = useState('option1')

  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <div className="flex items-center space-x-2">
        <Radio value="option1" id="r1" />
        <label htmlFor="r1">Option 1</label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="option2" id="r2" />
        <label htmlFor="r2">Option 2</label>
      </div>
      <div className="flex items-center space-x-2">
        <Radio value="option3" id="r3" />
        <label htmlFor="r3">Option 3</label>
      </div>
    </RadioGroup>
  )
}
```

### Different Sizes

```typescript
function SizeVariants() {
  const [selected, setSelected] = useState('medium')

  return (
    <div className="space-y-4">
      <RadioGroup value={selected} onValueChange={setSelected}>
        <div className="flex items-center space-x-2">
          <Radio value="small" id="size-s" size="S" />
          <label htmlFor="size-s" className="text-sm">Small radio</label>
        </div>

        <div className="flex items-center space-x-2">
          <Radio value="medium" id="size-m" size="M" />
          <label htmlFor="size-m">Medium radio (default)</label>
        </div>
      </RadioGroup>
    </div>
  )
}
```

### Horizontal Layout

```typescript
function HorizontalRadioGroup() {
  const [plan, setPlan] = useState('basic')

  return (
    <RadioGroup
      value={plan}
      onValueChange={setPlan}
      className="flex flex-row space-x-4"
    >
      <div className="flex items-center space-x-2">
        <Radio value="basic" id="plan-basic" />
        <label htmlFor="plan-basic">Basic</label>
      </div>

      <div className="flex items-center space-x-2">
        <Radio value="pro" id="plan-pro" />
        <label htmlFor="plan-pro">Pro</label>
      </div>

      <div className="flex items-center space-x-2">
        <Radio value="enterprise" id="plan-enterprise" />
        <label htmlFor="plan-enterprise">Enterprise</label>
      </div>
    </RadioGroup>
  )
}
```

### With Descriptions

```typescript
function RadioWithDescriptions() {
  const [delivery, setDelivery] = useState('standard')

  const options = [
    {
      value: 'standard',
      label: 'Standard Delivery',
      description: '5-7 business days',
      price: 'Free'
    },
    {
      value: 'express',
      label: 'Express Delivery',
      description: '2-3 business days',
      price: '$9.99'
    },
    {
      value: 'overnight',
      label: 'Overnight Delivery',
      description: 'Next business day',
      price: '$24.99'
    }
  ]

  return (
    <RadioGroup value={delivery} onValueChange={setDelivery}>
      {options.map((option) => (
        <div
          key={option.value}
          className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
        >
          <Radio value={option.value} id={option.value} />
          <label htmlFor={option.value} className="flex-1 cursor-pointer">
            <div className="font-medium">{option.label}</div>
            <div className="text-sm text-gray-500">{option.description}</div>
            <div className="text-sm font-semibold">{option.price}</div>
          </label>
        </div>
      ))}
    </RadioGroup>
  )
}
```

### Disabled Options

```typescript
function RadioWithDisabled() {
  const [selected, setSelected] = useState('active')

  return (
    <RadioGroup value={selected} onValueChange={setSelected}>
      <div className="flex items-center space-x-2">
        <Radio value="active" id="active" />
        <label htmlFor="active">Active Option</label>
      </div>

      <div className="flex items-center space-x-2 opacity-50">
        <Radio value="disabled" id="disabled" disabled />
        <label htmlFor="disabled">Disabled Option</label>
      </div>

      <div className="flex items-center space-x-2">
        <Radio value="another" id="another" />
        <label htmlFor="another">Another Option</label>
      </div>
    </RadioGroup>
  )
}
```

### Form Integration

```typescript
function PaymentMethodForm() {
  const [paymentMethod, setPaymentMethod] = useState('card')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Selected payment method:', paymentMethod)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset>
        <legend className="text-lg font-semibold mb-3">Payment Method</legend>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Radio value="card" id="payment-card" />
              <label htmlFor="payment-card">Credit/Debit Card</label>
            </div>

            <div className="flex items-center space-x-2">
              <Radio value="paypal" id="payment-paypal" />
              <label htmlFor="payment-paypal">PayPal</label>
            </div>

            <div className="flex items-center space-x-2">
              <Radio value="bank" id="payment-bank" />
              <label htmlFor="payment-bank">Bank Transfer</label>
            </div>
          </div>
        </RadioGroup>
      </fieldset>

      <button type="submit">Continue to Payment</button>
    </form>
  )
}
```

## API Reference

### RadioGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled selected value |
| `defaultValue` | `string` | - | Uncontrolled default value |
| `onValueChange` | `(value: string) => void` | - | Called when selection changes |
| `disabled` | `boolean` | `false` | Disables all radios in group |
| `required` | `boolean` | `false` | Makes selection required |
| `name` | `string` | - | Form field name |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout orientation |
| `className` | `string` | - | Additional CSS classes |

### Radio Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Radio button value |
| `size` | `'S' \| 'M'` | `'S'` | Size variant |
| `id` | `string` | - | HTML id for label association |
| `disabled` | `boolean` | `false` | Disables this radio |
| `className` | `string` | - | Additional CSS classes |

### TypeScript

```typescript
import { RadioGroupProps, RadioGroupItemProps } from '@radix-ui/react-radio-group'

// RadioGroup types
interface RadioGroupProps extends RadioGroupPrimitive.RootProps {
  className?: string
}

// Radio types
interface RadioProps extends RadioGroupItemProps {
  size?: 'S' | 'M'
  className?: string
}

export const RadioGroup: React.ForwardRefExoticComponent<RadioGroupProps>
export const Radio: React.ForwardRefExoticComponent<RadioProps>
```

## Common Patterns

### Settings Panel

```typescript
function ThemeSettings() {
  const [theme, setTheme] = useState('auto')
  const [accent, setAccent] = useState('blue')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Theme</h3>
        <RadioGroup value={theme} onValueChange={setTheme}>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <Radio value="light" id="theme-light" />
              <span>Light</span>
            </label>

            <label className="flex items-center space-x-2">
              <Radio value="dark" id="theme-dark" />
              <span>Dark</span>
            </label>

            <label className="flex items-center space-x-2">
              <Radio value="auto" id="theme-auto" />
              <span>System</span>
            </label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Accent Color</h3>
        <RadioGroup value={accent} onValueChange={setAccent} orientation="horizontal">
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <Radio value="blue" id="accent-blue" />
              <span className="text-blue-600">Blue</span>
            </label>

            <label className="flex items-center space-x-2">
              <Radio value="green" id="accent-green" />
              <span className="text-green-600">Green</span>
            </label>

            <label className="flex items-center space-x-2">
              <Radio value="purple" id="accent-purple" />
              <span className="text-purple-600">Purple</span>
            </label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
```

### Survey Question

```typescript
function SurveyQuestion() {
  const [satisfaction, setSatisfaction] = useState('')
  const [comment, setComment] = useState('')

  const levels = [
    { value: '5', label: 'Very Satisfied', emoji: '😊' },
    { value: '4', label: 'Satisfied', emoji: '🙂' },
    { value: '3', label: 'Neutral', emoji: '😐' },
    { value: '2', label: 'Dissatisfied', emoji: '😕' },
    { value: '1', label: 'Very Dissatisfied', emoji: '😞' }
  ]

  return (
    <div className="space-y-4">
      <h3>How satisfied are you with our service?</h3>

      <RadioGroup value={satisfaction} onValueChange={setSatisfaction}>
        {levels.map((level) => (
          <label
            key={level.value}
            className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
          >
            <Radio value={level.value} id={`level-${level.value}`} />
            <span className="text-2xl">{level.emoji}</span>
            <span>{level.label}</span>
          </label>
        ))}
      </RadioGroup>

      {satisfaction && satisfaction <= '2' && (
        <textarea
          placeholder="Please tell us how we can improve..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      )}
    </div>
  )
}
```

### Conditional Fields

```typescript
function ConditionalForm() {
  const [contactMethod, setContactMethod] = useState('email')

  return (
    <form className="space-y-4">
      <fieldset>
        <legend className="font-semibold mb-2">Preferred Contact Method</legend>
        <RadioGroup value={contactMethod} onValueChange={setContactMethod}>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <Radio value="email" id="contact-email" />
              <span>Email</span>
            </label>

            <label className="flex items-center space-x-2">
              <Radio value="phone" id="contact-phone" />
              <span>Phone</span>
            </label>

            <label className="flex items-center space-x-2">
              <Radio value="mail" id="contact-mail" />
              <span>Postal Mail</span>
            </label>
          </div>
        </RadioGroup>
      </fieldset>

      {contactMethod === 'email' && (
        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full p-2 border rounded"
        />
      )}

      {contactMethod === 'phone' && (
        <input
          type="tel"
          placeholder="Enter your phone number"
          className="w-full p-2 border rounded"
        />
      )}

      {contactMethod === 'mail' && (
        <textarea
          placeholder="Enter your mailing address"
          className="w-full p-2 border rounded"
          rows={3}
        />
      )}

      <button type="submit">Save Preference</button>
    </form>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Radio, RadioGroup } from 'torch-glare/lib/components/Radio'

describe('Radio', () => {
  it('handles selection changes', () => {
    const handleChange = jest.fn()
    render(
      <RadioGroup onValueChange={handleChange}>
        <Radio value="opt1" id="opt1" />
        <Radio value="opt2" id="opt2" />
      </RadioGroup>
    )

    const radio2 = screen.getByRole('radio', { name: /opt2/i })
    fireEvent.click(radio2)

    expect(handleChange).toHaveBeenCalledWith('opt2')
  })

  it('respects disabled state', () => {
    render(
      <RadioGroup>
        <Radio value="enabled" id="enabled" />
        <Radio value="disabled" id="disabled" disabled />
      </RadioGroup>
    )

    const disabledRadio = screen.getByRole('radio', { name: /disabled/i })
    expect(disabledRadio).toBeDisabled()
  })

  it('maintains single selection', () => {
    const { rerender } = render(
      <RadioGroup value="opt1">
        <Radio value="opt1" id="opt1" />
        <Radio value="opt2" id="opt2" />
      </RadioGroup>
    )

    let radio1 = screen.getByRole('radio', { name: /opt1/i })
    let radio2 = screen.getByRole('radio', { name: /opt2/i })

    expect(radio1).toBeChecked()
    expect(radio2).not.toBeChecked()

    rerender(
      <RadioGroup value="opt2">
        <Radio value="opt1" id="opt1" />
        <Radio value="opt2" id="opt2" />
      </RadioGroup>
    )

    radio1 = screen.getByRole('radio', { name: /opt1/i })
    radio2 = screen.getByRole('radio', { name: /opt2/i })

    expect(radio1).not.toBeChecked()
    expect(radio2).toBeChecked()
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('RadioGroup meets WCAG standards', async () => {
  const { container } = render(
    <fieldset>
      <legend>Select an option</legend>
      <RadioGroup defaultValue="opt1">
        <div>
          <Radio value="opt1" id="opt1" />
          <label htmlFor="opt1">Option 1</label>
        </div>
        <div>
          <Radio value="opt2" id="opt2" />
          <label htmlFor="opt2">Option 2</label>
        </div>
      </RadioGroup>
    </fieldset>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Keyboard Support

- **Tab**: Move focus into radio group
- **Arrow Down/Right**: Select next radio
- **Arrow Up/Left**: Select previous radio
- **Space**: Select focused radio (if not already selected)

### ARIA Attributes

Radix UI automatically handles:

```html
<!-- Radio group -->
<div role="radiogroup" aria-required="false" aria-orientation="vertical">
  <!-- Radio buttons -->
  <button role="radio" aria-checked="true" data-state="checked" />
  <button role="radio" aria-checked="false" data-state="unchecked" />
</div>
```

### Screen Reader Support

- Announces radio group role
- Communicates selected state
- Reads associated labels
- Announces total options and position

### Best Practices

```typescript
// Always use fieldset/legend for semantic grouping
<fieldset>
  <legend>Choose your plan</legend>
  <RadioGroup>
    {/* Radio options */}
  </RadioGroup>
</fieldset>

// Always associate labels
<Radio value="option" id="radio-id" />
<label htmlFor="radio-id">Option Label</label>
```

## Styling

### Custom Styles

```typescript
<Radio
  className="border-blue-500 data-[state=checked]:border-blue-600"
  size="M"
/>

<RadioGroup className="space-y-3 p-4 border rounded">
  {/* Radio options */}
</RadioGroup>
```

### CSS Variables

```css
/* Custom theme variables */
:root {
  --radio-size-small: 12px;
  --radio-size-medium: 24px;
  --radio-border: #d1d5db;
  --radio-border-hover: #3b82f6;
  --radio-indicator: #3b82f6;
  --radio-disabled: #f3f4f6;
}
```

### State Styling

```css
/* Using data attributes from Radix UI */
.radio[data-state="checked"] {
  border-color: var(--primary);
}

.radio[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 2.0kb |
| First render | <6ms |
| Re-render | <2ms |
| Interaction | <1ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Use uncontrolled mode with `defaultValue` when possible
2. Memoize change handlers with `useCallback`
3. Use React.memo for radio option components
4. Keep RadioGroup flat, avoid deep nesting

## Migration

### From Native Radio

```diff
// From HTML radios
- <input
-   type="radio"
-   name="group"
-   value="option"
-   checked={selected === 'option'}
-   onChange={(e) => setSelected(e.target.value)}
- />

// To Radio component
+ <RadioGroup value={selected} onValueChange={setSelected}>
+   <Radio value="option" id="option" />
+ </RadioGroup>
```

### From v1.0.x

```diff
// Import path
- import Radio from 'torch-glare/Radio'
+ import { Radio, RadioGroup } from 'torch-glare/lib/components/Radio'

// Size prop values
- <Radio size="small" />
+ <Radio size="S" />
```

## Troubleshooting

### Radios not grouping

**Solution:** Ensure all radios are within RadioGroup

```typescript
// ❌ Wrong - radios not grouped
<Radio value="opt1" />
<Radio value="opt2" />

// ✅ Correct - proper grouping
<RadioGroup>
  <Radio value="opt1" />
  <Radio value="opt2" />
</RadioGroup>
```

### Selection not working

**Solution:** Use controlled or uncontrolled mode properly

```typescript
// Controlled
const [value, setValue] = useState('default')
<RadioGroup value={value} onValueChange={setValue}>

// Uncontrolled
<RadioGroup defaultValue="default">
```

## Related Components

- [LabeledRadio](/docs/components/labeled-radio.md) - Radio with integrated label
- [RadioCard](/docs/components/radio-card.md) - Card-style radio option
- [Checkbox](/docs/components/checkbox.md) - Multiple selection option
- [Select](/docs/components/select.md) - Dropdown alternative

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Migrated to Radix UI primitives
- Added size variants
- Improved accessibility

### v1.1.14
- Fixed focus styles
- Performance optimizations

### v1.1.0
- Initial stable release