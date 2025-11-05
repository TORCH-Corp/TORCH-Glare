---
name: RadioCard
version: 1.1.15
status: stable
category: components/forms
tags: [form, radio, card, selection, compound, accessible]
last-reviewed: 2024-11-05
bundle-size: 2.8kb
dependencies:
  - "@/components/Radio": "internal"
  - "@/components/Card": "internal"
---

# RadioCard

> A card-style radio button component that combines Radio with Card for rich, visual selection options. Perfect for plan selection, feature choices, and any scenario requiring detailed radio options with descriptions and custom content.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { RadioCard } from 'torch-glare/lib/components/RadioCard'
import { RadioGroup } from 'torch-glare/lib/components/Radio'
```

## Quick Examples

### Basic Usage

```typescript
import { RadioCard } from 'torch-glare/lib/components/RadioCard'
import { RadioGroup } from 'torch-glare/lib/components/Radio'

function Example() {
  const [selected, setSelected] = useState('option1')

  return (
    <RadioGroup value={selected} onValueChange={setSelected}>
      <div className="grid gap-4">
        <RadioCard
          value="option1"
          id="card1"
          headerLabel="Option 1"
          description="Description for option 1"
        />
        <RadioCard
          value="option2"
          id="card2"
          headerLabel="Option 2"
          description="Description for option 2"
        />
      </div>
    </RadioGroup>
  )
}
```

### Plan Selection

```typescript
function PricingPlans() {
  const [plan, setPlan] = useState('pro')

  const plans = [
    {
      value: 'basic',
      name: 'Basic',
      price: '$9/month',
      description: 'Perfect for individuals',
      features: ['10 GB Storage', '1 User', 'Email Support']
    },
    {
      value: 'pro',
      name: 'Pro',
      price: '$29/month',
      description: 'Great for small teams',
      features: ['100 GB Storage', '5 Users', 'Priority Support', 'API Access']
    },
    {
      value: 'enterprise',
      name: 'Enterprise',
      price: '$99/month',
      description: 'For large organizations',
      features: ['Unlimited Storage', 'Unlimited Users', '24/7 Support', 'Custom Integration']
    }
  ]

  return (
    <RadioGroup value={plan} onValueChange={setPlan}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <RadioCard
            key={p.value}
            value={p.value}
            id={`plan-${p.value}`}
            headerLabel={
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-2xl font-bold mt-2">{p.price}</p>
              </div>
            }
            description={p.description}
          >
            <ul className="mt-4 space-y-2">
              {p.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </RadioCard>
        ))}
      </div>
    </RadioGroup>
  )
}
```

### Shipping Methods

```typescript
function ShippingOptions() {
  const [shipping, setShipping] = useState('standard')

  return (
    <RadioGroup value={shipping} onValueChange={setShipping}>
      <div className="space-y-3">
        <RadioCard
          value="standard"
          id="ship-standard"
          headerLabel={
            <div className="flex justify-between items-center">
              <span>Standard Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
          }
          description="Delivered in 5-7 business days"
        />

        <RadioCard
          value="express"
          id="ship-express"
          headerLabel={
            <div className="flex justify-between items-center">
              <span>Express Shipping</span>
              <span className="font-semibold">$12.99</span>
            </div>
          }
          description="Delivered in 2-3 business days"
        />

        <RadioCard
          value="overnight"
          id="ship-overnight"
          headerLabel={
            <div className="flex justify-between items-center">
              <span>Overnight Shipping</span>
              <span className="font-semibold">$29.99</span>
            </div>
          }
          description="Delivered next business day by 10 AM"
        />
      </div>
    </RadioGroup>
  )
}
```

### Payment Methods

```typescript
function PaymentMethodCards() {
  const [method, setMethod] = useState('card')

  return (
    <RadioGroup value={method} onValueChange={setMethod}>
      <div className="grid grid-cols-2 gap-4">
        <RadioCard
          value="card"
          id="pay-card"
          headerLabel={
            <div className="flex items-center gap-3">
              <CreditCardIcon className="w-6 h-6" />
              <span>Credit/Debit Card</span>
            </div>
          }
          description="Pay with Visa, Mastercard, or Amex"
        >
          <div className="flex gap-2 mt-3">
            <img src="/visa.svg" alt="Visa" className="h-8" />
            <img src="/mastercard.svg" alt="Mastercard" className="h-8" />
            <img src="/amex.svg" alt="Amex" className="h-8" />
          </div>
        </RadioCard>

        <RadioCard
          value="paypal"
          id="pay-paypal"
          headerLabel={
            <div className="flex items-center gap-3">
              <PayPalIcon className="w-6 h-6" />
              <span>PayPal</span>
            </div>
          }
          description="Fast and secure payment"
        />

        <RadioCard
          value="crypto"
          id="pay-crypto"
          headerLabel={
            <div className="flex items-center gap-3">
              <BitcoinIcon className="w-6 h-6" />
              <span>Cryptocurrency</span>
            </div>
          }
          description="Pay with Bitcoin or Ethereum"
        />

        <RadioCard
          value="bank"
          id="pay-bank"
          headerLabel={
            <div className="flex items-center gap-3">
              <BankIcon className="w-6 h-6" />
              <span>Bank Transfer</span>
            </div>
          }
          description="Direct bank transfer"
        />
      </div>
    </RadioGroup>
  )
}
```

### Theme Selection

```typescript
function ThemeSelector() {
  const [theme, setTheme] = useState('light')

  return (
    <RadioGroup value={theme} onValueChange={setTheme}>
      <div className="grid grid-cols-3 gap-4">
        <RadioCard
          value="light"
          id="theme-light"
          theme="light"
          headerLabel={
            <div className="text-center">
              <SunIcon className="w-8 h-8 mx-auto mb-2" />
              <span>Light</span>
            </div>
          }
          description="Bright and clean"
        />

        <RadioCard
          value="dark"
          id="theme-dark"
          theme="dark"
          headerLabel={
            <div className="text-center">
              <MoonIcon className="w-8 h-8 mx-auto mb-2" />
              <span>Dark</span>
            </div>
          }
          description="Easy on the eyes"
        />

        <RadioCard
          value="auto"
          id="theme-auto"
          theme="default"
          headerLabel={
            <div className="text-center">
              <AutoIcon className="w-8 h-8 mx-auto mb-2" />
              <span>Auto</span>
            </div>
          }
          description="Follow system"
        />
      </div>
    </RadioGroup>
  )
}
```

### Disabled State

```typescript
function DisabledOptions() {
  const [selected, setSelected] = useState('available')

  return (
    <RadioGroup value={selected} onValueChange={setSelected}>
      <div className="space-y-3">
        <RadioCard
          value="available"
          id="opt-available"
          headerLabel="Available Option"
          description="This option can be selected"
        />

        <RadioCard
          value="unavailable"
          id="opt-unavailable"
          headerLabel="Unavailable Option"
          description="This option is currently not available"
          disabled
        />
      </div>
    </RadioGroup>
  )
}
```

## API Reference

### RadioCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Radio button value (required) |
| `id` | `string` | - | Unique identifier (required) |
| `headerLabel` | `ReactNode` | - | Content for card header |
| `description` | `ReactNode` | - | Description content |
| `children` | `ReactNode` | - | Additional card content |
| `disabled` | `boolean` | `false` | Disables the radio card |
| `theme` | `'dark' \| 'light' \| 'default'` | - | Theme variant |
| `className` | `string` | - | Additional CSS classes |

Note: Must be used within a `RadioGroup` component.

### TypeScript

```typescript
import { ComponentProps, ReactNode } from 'react'
import { Radio } from '@/components/Radio'

interface RadioCardProps extends Omit<ComponentProps<typeof Radio>, 'size' | 'value'> {
  headerLabel?: ReactNode
  id: string
  description?: ReactNode
  disabled?: boolean
  children?: ReactNode
  theme?: 'dark' | 'light' | 'default'
  value: string
}

export const RadioCard: React.ForwardRefExoticComponent<RadioCardProps>
```

## Common Patterns

### Subscription Tiers

```typescript
function SubscriptionTiers() {
  const [tier, setTier] = useState('pro')

  const tiers = [
    {
      value: 'free',
      name: 'Free',
      price: '$0',
      badge: null,
      features: {
        included: ['Basic features', '1 Project', 'Community support'],
        excluded: ['Advanced analytics', 'Priority support', 'Custom domains']
      }
    },
    {
      value: 'pro',
      name: 'Pro',
      price: '$19',
      badge: 'Most Popular',
      features: {
        included: ['All Free features', '10 Projects', 'Advanced analytics', 'Priority support'],
        excluded: ['Custom domains', 'White label']
      }
    },
    {
      value: 'business',
      name: 'Business',
      price: '$49',
      badge: 'Best Value',
      features: {
        included: ['All Pro features', 'Unlimited Projects', 'Custom domains', 'White label', 'API Access'],
        excluded: []
      }
    }
  ]

  return (
    <RadioGroup value={tier} onValueChange={setTier}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <RadioCard
            key={t.value}
            value={t.value}
            id={`tier-${t.value}`}
            className="relative"
            headerLabel={
              <div>
                {t.badge && (
                  <span className="absolute -top-3 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                    {t.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold">{t.name}</h3>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{t.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
            }
          >
            <div className="mt-6 space-y-4">
              <div>
                {t.features.included.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <CheckIcon className="w-5 h-5 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              {t.features.excluded.length > 0 && (
                <div>
                  {t.features.excluded.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 py-1 opacity-50">
                      <XIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-sm line-through">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </RadioCard>
        ))}
      </div>
    </RadioGroup>
  )
}
```

### Deployment Options

```typescript
function DeploymentOptions() {
  const [deployment, setDeployment] = useState('cloud')

  return (
    <RadioGroup value={deployment} onValueChange={setDeployment}>
      <div className="space-y-4">
        <RadioCard
          value="cloud"
          id="deploy-cloud"
          headerLabel={
            <div className="flex items-center gap-3">
              <CloudIcon className="w-6 h-6 text-blue-500" />
              <div>
                <h3 className="font-semibold">Cloud Hosted</h3>
                <p className="text-xs text-gray-500">Managed by us</p>
              </div>
            </div>
          }
          description="Zero maintenance, automatic updates"
        >
          <div className="mt-3 p-3 bg-blue-50 rounded">
            <p className="text-sm">✓ 99.9% uptime SLA</p>
            <p className="text-sm">✓ Automatic backups</p>
            <p className="text-sm">✓ 24/7 monitoring</p>
          </div>
        </RadioCard>

        <RadioCard
          value="onprem"
          id="deploy-onprem"
          headerLabel={
            <div className="flex items-center gap-3">
              <ServerIcon className="w-6 h-6 text-gray-500" />
              <div>
                <h3 className="font-semibold">On-Premise</h3>
                <p className="text-xs text-gray-500">Self-hosted</p>
              </div>
            </div>
          }
          description="Full control over your data"
        >
          <div className="mt-3 p-3 bg-gray-50 rounded">
            <p className="text-sm">✓ Complete data sovereignty</p>
            <p className="text-sm">✓ Custom configurations</p>
            <p className="text-sm">✓ Air-gapped deployment</p>
          </div>
        </RadioCard>

        <RadioCard
          value="hybrid"
          id="deploy-hybrid"
          headerLabel={
            <div className="flex items-center gap-3">
              <HybridIcon className="w-6 h-6 text-purple-500" />
              <div>
                <h3 className="font-semibold">Hybrid</h3>
                <p className="text-xs text-gray-500">Best of both</p>
              </div>
            </div>
          }
          description="Flexible deployment model"
        >
          <div className="mt-3 p-3 bg-purple-50 rounded">
            <p className="text-sm">✓ Sensitive data on-premise</p>
            <p className="text-sm">✓ Cloud scalability</p>
            <p className="text-sm">✓ Unified management</p>
          </div>
        </RadioCard>
      </div>
    </RadioGroup>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { RadioCard } from 'torch-glare/lib/components/RadioCard'
import { RadioGroup } from 'torch-glare/lib/components/Radio'

describe('RadioCard', () => {
  it('renders card with header and description', () => {
    render(
      <RadioGroup>
        <RadioCard
          value="test"
          id="test-card"
          headerLabel="Test Header"
          description="Test Description"
        />
      </RadioGroup>
    )

    expect(screen.getByText('Test Header')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('handles selection in group', () => {
    const handleChange = jest.fn()
    render(
      <RadioGroup onValueChange={handleChange}>
        <RadioCard value="card1" id="card1" headerLabel="Card 1" />
        <RadioCard value="card2" id="card2" headerLabel="Card 2" />
      </RadioGroup>
    )

    const card2 = screen.getByText('Card 2').closest('label')
    fireEvent.click(card2!)

    expect(handleChange).toHaveBeenCalledWith('card2')
  })

  it('renders children content', () => {
    render(
      <RadioGroup>
        <RadioCard value="test" id="test">
          <div>Custom Content</div>
        </RadioCard>
      </RadioGroup>
    )

    expect(screen.getByText('Custom Content')).toBeInTheDocument()
  })

  it('applies disabled state', () => {
    render(
      <RadioGroup>
        <RadioCard
          value="test"
          id="test"
          headerLabel="Disabled"
          disabled
        />
      </RadioGroup>
    )

    const radio = screen.getByRole('radio')
    expect(radio).toBeDisabled()
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('RadioCard meets WCAG standards', async () => {
  const { container } = render(
    <fieldset>
      <legend>Select a plan</legend>
      <RadioGroup defaultValue="basic">
        <RadioCard
          value="basic"
          id="plan-basic"
          headerLabel="Basic Plan"
          description="Perfect for starters"
        />
        <RadioCard
          value="pro"
          id="plan-pro"
          headerLabel="Pro Plan"
          description="For professionals"
        />
      </RadioGroup>
    </fieldset>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Features

- Radio button positioned in top-right corner for easy access
- Entire card is clickable via label association
- Proper focus states inherited from Radio component
- Selected state indicated by border color change
- Disabled state clearly communicated visually

### Keyboard Support

- **Tab**: Move focus into radio group
- **Arrow Keys**: Navigate between cards
- **Space**: Select focused card

### Screen Reader Support

- Card content is associated with radio button
- Selected state announced
- Descriptions and labels read in logical order

### ARIA Implementation

```html
<!-- Rendered structure -->
<label for="radio-id" class="card">
  <div class="radio-container">
    <button role="radio" aria-checked="false" id="radio-id" />
  </div>
  <header>Header Content</header>
  <div>Description</div>
  <div>Additional Content</div>
</label>
```

## Styling

### Custom Styles

```typescript
<RadioCard
  className="hover:shadow-lg transition-shadow"
  headerLabel="Custom Styled"
/>
```

### State Styling

- Default: Normal card appearance
- Hover: Subtle border color change
- Selected: Blue border indicating selection
- Disabled: Grayed out appearance with cursor-not-allowed

### Theme Variables

```css
[data-theme="custom"] {
  --radio-card-border: #e5e7eb;
  --radio-card-border-selected: #3b82f6;
  --radio-card-bg-disabled: #f9fafb;
}
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 2.8kb |
| First render | <8ms |
| Re-render | <4ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Memoize complex card content with React.memo
2. Use virtualization for long lists of cards
3. Lazy load heavy content (images, icons)
4. Keep RadioGroup structure flat

## Migration

### From Radio to RadioCard

```diff
// From basic Radio
- <RadioGroup>
-   <div>
-     <Radio value="opt" id="opt" />
-     <label htmlFor="opt">
-       <h3>Title</h3>
-       <p>Description</p>
-     </label>
-   </div>
- </RadioGroup>

// To RadioCard
+ <RadioGroup>
+   <RadioCard
+     value="opt"
+     id="opt"
+     headerLabel="Title"
+     description="Description"
+   />
+ </RadioGroup>
```

## Troubleshooting

### Card not selectable

**Solution:** Ensure RadioCard is within RadioGroup

```typescript
// ❌ Wrong
<RadioCard value="opt" id="opt" />

// ✅ Correct
<RadioGroup>
  <RadioCard value="opt" id="opt" />
</RadioGroup>
```

### Content overflow

**Solution:** Use appropriate layout classes

```typescript
<RadioCard
  className="overflow-hidden"
  headerLabel={<div className="truncate">Long text...</div>}
/>
```

## Related Components

- [Radio](/docs/components/radio.md) - Base radio component
- [LabeledRadio](/docs/components/labeled-radio.md) - Radio with label
- [Card](/docs/components/card.md) - Base card component
- [RadioGroup](/docs/components/radio.md#radiogroup) - Container for radios

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Combined Radio and Card components
- Added theme support
- Improved accessibility

### v1.1.14
- Initial RadioCard implementation
- Basic selection support

### v1.1.0
- Component planning phase