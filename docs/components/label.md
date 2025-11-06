---
title: Label
description: Flexible label component with support for primary, secondary, and required text with customizable layout directions
group: Labels & Text
keywords: [label, form, input, required, text, typography]
---

# Label

> A flexible label component that supports primary, secondary, and required label text with customizable layout directions. Can be used standalone or wrapped around form inputs with polymorphic rendering support.

## Installation

No external dependencies required.

## Import

```typescript
import { Label } from '@torch-ui/components'
import type { LabelProps } from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { Label } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'

function Example() {
  return (
    <Label label="Email Address">
      <InputField type="email" />
    </Label>
  )
}
```

### With Required Indicator

```typescript
import { Label } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'

function RequiredField() {
  return (
    <Label
      label="Full Name"
      requiredLabel="*Required"
    >
      <InputField required />
    </Label>
  )
}
```

### With Secondary Label

```typescript
import { Label } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'

function WithSecondary() {
  return (
    <Label
      label="Password"
      secondaryLabel="(At least 8 characters)"
    >
      <InputField type="password" />
    </Label>
  )
}
```

### All Labels Combined

```typescript
import { Label } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'

function AllLabels() {
  return (
    <Label
      label="Company Name"
      secondaryLabel="(Optional)"
      requiredLabel="*"
    >
      <InputField />
    </Label>
  )
}
```

### Horizontal Layout

```typescript
import { Label } from '@torch-ui/components'
import { Switch } from '@torch-ui/components'

function HorizontalLabel() {
  return (
    <Label
      label="Enable Notifications"
      childrenDirections="horizontal"
    >
      <Switch />
    </Label>
  )
}
```

### Vertical Label Direction

```typescript
import { Label } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'

function VerticalLabels() {
  return (
    <Label
      label="Description"
      secondaryLabel="Max 500 characters"
      labelDirections="vertical"
    >
      <textarea className="w-full border rounded p-2" />
    </Label>
  )
}
```

### Reversed Children

```typescript
import { Label } from '@torch-ui/components'
import { Checkbox } from '@torch-ui/components'

function ReversedLayout() {
  return (
    <Label
      label="I agree to the terms"
      childrenDirections="horizontal"
      reverseChildren
    >
      <Checkbox />
    </Label>
  )
}
```

### Different Sizes

```typescript
import { Label } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'

function Sizes() {
  return (
    <div className="space-y-4">
      <Label label="Small Label" size="S">
        <InputField size="S" />
      </Label>

      <Label label="Medium Label" size="M">
        <InputField size="M" />
      </Label>

      <Label label="Large Label" size="L">
        <InputField size="M" />
      </Label>
    </div>
  )
}
```

### Style Variants

```typescript
import { Label } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'

function Variants() {
  return (
    <div className="space-y-4">
      <Label
        label="Presentation Style"
        variant="PresentationStyle"
      >
        <InputField />
      </Label>

      <Label
        label="System Style"
        variant="SystemStyle"
      >
        <InputField variant="SystemStyle" />
      </Label>
    </div>
  )
}
```

### Polymorphic Rendering

```typescript
import { Label } from '@torch-ui/components'

function PolymorphicLabel() {
  return (
    <div className="space-y-4">
      {/* Render as label (default) */}
      <Label label="Name" htmlFor="name-input">
        <input id="name-input" />
      </Label>

      {/* Render as div */}
      <Label as="div" label="Settings">
        <div className="space-y-2">
          <Switch />
          <Switch />
        </div>
      </Label>

      {/* Render as span */}
      <Label as="span" label="Inline Label">
        <input type="checkbox" />
      </Label>
    </div>
  )
}
```

### Form Example

```typescript
import { Label } from '@torch-ui/components'
import { InputField, Button } from '@torch-ui/components'
import { useState } from 'react'

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  return (
    <form className="space-y-4">
      <Label
        label="Full Name"
        requiredLabel="*"
      >
        <InputField
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </Label>

      <Label
        label="Email"
        secondaryLabel="(We'll never share your email)"
        requiredLabel="*"
      >
        <InputField
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </Label>

      <Label
        label="Password"
        secondaryLabel="(At least 8 characters)"
        requiredLabel="*"
        labelDirections="vertical"
      >
        <InputField
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </Label>

      <Button type="submit">Create Account</Button>
    </form>
  )
}
```

## API Reference

### Label Props

Extends all standard HTML label attributes.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | - | Primary label text |
| `requiredLabel` | `ReactNode` | - | Required indicator (typically "*Required") |
| `secondaryLabel` | `ReactNode` | - | Secondary/helper text |
| `size` | `'S' \| 'M' \| 'L'` | `'M'` | Label text size |
| `variant` | `'SystemStyle' \| 'PresentationStyle'` | `'PresentationStyle'` | Style variant |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Theme variant |
| `labelDirections` | `'vertical' \| 'horizontal'` | `'horizontal'` | Direction of label texts |
| `childrenDirections` | `'vertical' \| 'horizontal'` | `'vertical'` | Direction of label and children |
| `reverseChildren` | `boolean` | `false` | Reverse order of label and children |
| `as` | `React.ElementType` | `'label'` | Element type to render as |
| `className` | `string` | - | Additional CSS classes for container |
| `labelsClassName` | `string` | - | Additional CSS classes for labels |
| ...HTMLLabelElement | - | - | All label attributes |

### Size Typography

| Size | Main Label | Secondary Label | Required Label |
|------|------------|-----------------|----------------|
| `S` | body-small-regular | labels-small-regular | labels-small-medium |
| `M` | body-medium-regular | labels-medium-regular | labels-medium-medium |
| `L` | body-large-regular | body-small-regular | body-small-medium |

### Style Variants

| Variant | Text Color |
|---------|------------|
| `PresentationStyle` | content-presentation-global-primary |
| `SystemStyle` | #E5E5E5 (light gray) |

## TypeScript

### Full Type Definitions

```typescript
import { LabelHTMLAttributes, ReactNode } from 'react'
import { VariantProps } from 'class-variance-authority'

interface LabelProps
  extends LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelComponentVariants> {
  label?: ReactNode
  requiredLabel?: ReactNode
  secondaryLabel?: ReactNode
  as?: React.ElementType
  size?: 'S' | 'M' | 'L'
  variant?: 'SystemStyle' | 'PresentationStyle'
  theme?: 'light' | 'dark' | 'default'
  labelsClassName?: string
  labelDirections?: 'vertical' | 'horizontal'
  childrenDirections?: 'vertical' | 'horizontal'
  reverseChildren?: boolean
}

export const Label: React.ForwardRefExoticComponent<
  LabelProps & React.RefAttributes<HTMLLabelElement>
>
```

### Usage with Types

```typescript
import { Label } from '@torch-ui/components'
import { useRef } from 'react'

function TypedExample() {
  const labelRef = useRef<HTMLLabelElement>(null)

  const handleClick = () => {
    labelRef.current?.focus()
  }

  return (
    <Label
      ref={labelRef}
      label="Typed Label"
      size="M"
      variant="PresentationStyle"
    >
      <input type="text" />
    </Label>
  )
}
```

## Common Patterns

### Responsive Layout

```typescript
import { Label } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { useState, useEffect } from 'react'

function ResponsiveLabel() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <Label
      label="Email"
      secondaryLabel="Required for notifications"
      childrenDirections={isMobile ? 'vertical' : 'horizontal'}
      labelDirections={isMobile ? 'vertical' : 'horizontal'}
    >
      <InputField type="email" />
    </Label>
  )
}
```

### Dynamic Required State

```typescript
import { Label } from '@torch-ui/components'
import { InputField, Checkbox } from '@torch-ui/components'
import { useState } from 'react'

function DynamicRequired() {
  const [makeOptional, setMakeOptional] = useState(false)
  const [value, setValue] = useState('')

  return (
    <div className="space-y-4">
      <Checkbox
        checked={makeOptional}
        onChange={setMakeOptional}
        label="Make field optional"
      />

      <Label
        label="Company Name"
        requiredLabel={!makeOptional ? '*Required' : undefined}
        secondaryLabel={makeOptional ? '(Optional)' : undefined}
      >
        <InputField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required={!makeOptional}
        />
      </Label>
    </div>
  )
}
```

### Label Group Component

```typescript
import { Label } from '@torch-ui/components'
import { ReactNode } from 'react'

interface LabelGroupProps {
  items: Array<{
    label: string
    secondaryLabel?: string
    requiredLabel?: string
    children: ReactNode
  }>
}

function LabelGroup({ items }: LabelGroupProps) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <Label
          key={index}
          label={item.label}
          secondaryLabel={item.secondaryLabel}
          requiredLabel={item.requiredLabel}
        >
          {item.children}
        </Label>
      ))}
    </div>
  )
}

// Usage
function FormWithGroup() {
  return (
    <LabelGroup
      items={[
        {
          label: 'Name',
          requiredLabel: '*',
          children: <InputField />,
        },
        {
          label: 'Email',
          secondaryLabel: '(Optional)',
          children: <InputField type="email" />,
        },
      ]}
    />
  )
}
```

## Testing

### Unit Test Examples

```typescript
import { render, screen } from '@testing-library/react'
import { Label } from '@torch-ui/components'

describe('Label', () => {
  it('renders label text', () => {
    render(<Label label="Test Label" />)

    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('renders all label types', () => {
    render(
      <Label
        label="Main"
        secondaryLabel="Secondary"
        requiredLabel="*Required"
      />
    )

    expect(screen.getByText('Main')).toBeInTheDocument()
    expect(screen.getByText('Secondary')).toBeInTheDocument()
    expect(screen.getByText('*Required')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(
      <Label label="Label">
        <input data-testid="input" />
      </Label>
    )

    expect(screen.getByTestId('input')).toBeInTheDocument()
  })

  it('applies size classes correctly', () => {
    const { container, rerender } = render(
      <Label label="Small" size="S" />
    )

    expect(container.querySelector('.typography-body-small-regular')).toBeInTheDocument()

    rerender(<Label label="Medium" size="M" />)
    expect(container.querySelector('.typography-body-medium-regular')).toBeInTheDocument()

    rerender(<Label label="Large" size="L" />)
    expect(container.querySelector('.typography-body-large-regular')).toBeInTheDocument()
  })

  it('renders as different elements', () => {
    const { container } = render(
      <Label as="div" label="Div Label" />
    )

    expect(container.querySelector('div')).toBeInTheDocument()
    expect(container.querySelector('label')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <Label label="Test" className="custom-class" />
    )

    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  it('renders with vertical label direction', () => {
    const { container } = render(
      <Label
        label="Main"
        secondaryLabel="Secondary"
        labelDirections="vertical"
      />
    )

    expect(container.querySelector('.flex-col')).toBeInTheDocument()
  })

  it('reverses children order', () => {
    const { container } = render(
      <Label
        label="Label"
        reverseChildren
        childrenDirections="horizontal"
      >
        <span>Child</span>
      </Label>
    )

    expect(container.querySelector('.flex-row-reverse')).toBeInTheDocument()
  })
})
```

## Accessibility

- **Semantic HTML**: Uses proper `<label>` element by default
- **For Attribute**: Support for `htmlFor` to link with inputs
- **Keyboard Navigation**: Fully keyboard accessible
- **Screen Readers**: Labels announced correctly
- **Required Indicators**: Clear visual and semantic indication
- **Color Contrast**: Meets WCAG AA standards

### Accessibility Best Practices

```typescript
// Link label to input
<Label label="Email" htmlFor="email-input">
  <InputField id="email-input" />
</Label>

// Provide context for required fields
<Label
  label="Password"
  requiredLabel="*"
  aria-required="true"
>
  <InputField type="password" required />
</Label>

// Use secondary label for hints
<Label
  label="Phone"
  secondaryLabel="Format: (555) 555-5555"
  aria-describedby="phone-hint"
>
  <InputField id="phone-input" />
</Label>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~3kb |
| Bundle size (gzipped) | ~1kb |
| Dependencies | class-variance-authority |
| Re-renders | Only on prop changes |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Memoize complex labels**:
   ```typescript
   const label = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName])
   <Label label={label} />
   ```

2. **Use appropriate size**: Don't over-size labels unnecessarily

3. **Avoid inline functions**: Define handlers outside render
   ```typescript
   const handleClick = useCallback(() => { ... }, [])
   <Label onClick={handleClick} />
   ```

## Styling

### Custom Styles

```typescript
// Custom label container
<Label
  label="Styled Label"
  className="bg-gray-100 p-4 rounded"
>
  <InputField />
</Label>

// Custom label text styling
<Label
  label="Custom Text"
  labelsClassName="text-blue-600 font-bold"
>
  <InputField />
</Label>

// Override size
<Label
  label="Large Label"
  size="L"
  className="[&_p]:text-2xl"
>
  <InputField />
</Label>
```

### Default Styling

- Container: Flex layout with 8px gap
- Primary Label: Theme-based color, size-dependent typography
- Secondary Label: Secondary color, smaller typography
- Required Label: Negative (red) color, medium weight

## Best Practices

1. **Always provide label text**: Essential for accessibility
   ```typescript
   <Label label="Email">...</Label> // ✅
   <Label>...</Label> // ❌
   ```

2. **Use consistent size**: Match label size with input size
   ```typescript
   <Label label="Name" size="M">
     <InputField size="M" />
   </Label>
   ```

3. **Mark required fields clearly**: Use requiredLabel prop
   ```typescript
   <Label label="Password" requiredLabel="*Required">
     <InputField required />
   </Label>
   ```

4. **Provide helpful hints**: Use secondaryLabel for context
   ```typescript
   <Label label="Phone" secondaryLabel="(Include area code)">
     <InputField type="tel" />
   </Label>
   ```

5. **Use appropriate layout**: Choose direction based on context
   - Vertical for forms
   - Horizontal for toggles and checkboxes

6. **Link labels to inputs**: Use htmlFor when possible
   ```typescript
   <Label label="Name" htmlFor="name-input">
     <input id="name-input" />
   </Label>
   ```

7. **Test keyboard navigation**: Ensure label clicking focuses input

## Related Components

- [LabelField](./label-field.md) - Combined Label + InputField
- [InnerLabelField](./inner-label-field.md) - Floating label inside input
- [InputField](./input-field.md) - Input field component
- [FieldHint](./field-hint.md) - Inline field hints and validation
