---
title: FieldSection
description: Form section component with labels and responsive layout for grouping related form fields.
component: true
group: Layout & Containers
keywords: [form, section, layout, label, field, group, responsive]
---

# FieldSection

A structured form section component that provides consistent layout for form fields with labels, secondary text, hints, and flexible responsive behavior. Perfect for building organized, accessible forms.

## Installation

```bash
npx torch-cli add field-section
```

## Imports

```typescript
import { FieldSection } from '@/layouts/FieldSection'
```

## Basic Usage

```tsx
import { FieldSection } from '@/layouts/FieldSection'
import { InputField } from '@/components/InputField'

export function BasicFieldSection() {
  return (
    <FieldSection
      label="Email Address"
      secondaryLabel="We'll never share your email"
    >
      <InputField
        type="email"
        placeholder="Enter your email"
        className="w-full"
      />
    </FieldSection>
  )
}
```

## Examples

### All Sizes

FieldSection supports three sizes: S, M, and L.

```tsx
export function FieldSectionSizes() {
  return (
    <div className="space-y-4">
      <FieldSection
        size="S"
        label="Small Size"
        secondaryLabel="Compact form section"
      >
        <InputField size="S" placeholder="Small input" className="w-full" />
      </FieldSection>

      <FieldSection
        size="M"
        label="Medium Size"
        secondaryLabel="Standard form section"
      >
        <InputField size="M" placeholder="Medium input" className="w-full" />
      </FieldSection>

      <FieldSection
        size="L"
        label="Large Size"
        secondaryLabel="Spacious form section"
      >
        <InputField size="M" placeholder="Large input" className="w-full" />
      </FieldSection>
    </div>
  )
}
```

### Layout Directions

Control how the label and content are positioned.

```tsx
export function LayoutDirections() {
  return (
    <div className="space-y-6">
      {/* Vertical layout - stacks label above content */}
      <FieldSection
        direction="vertical"
        label="Vertical Layout"
        secondaryLabel="Label and content are stacked"
      >
        <InputField placeholder="Input field" className="w-full" />
      </FieldSection>

      {/* Horizontal layout - label and content side by side */}
      <FieldSection
        direction="horizontal"
        label="Horizontal Layout"
        secondaryLabel="Label on the left, content on the right"
      >
        <InputField placeholder="Input field" className="w-full" />
      </FieldSection>

      {/* Flexible layout - responsive, vertical on mobile, horizontal on desktop */}
      <FieldSection
        direction="flexible"
        label="Flexible Layout"
        secondaryLabel="Adapts to screen size"
      >
        <InputField placeholder="Input field" className="w-full" />
      </FieldSection>
    </div>
  )
}
```

### With Required Label

Show required field indicators.

```tsx
export function RequiredFields() {
  return (
    <div className="space-y-4">
      <FieldSection
        label="Full Name"
        requiredLabel="Required"
        secondaryLabel="Enter your first and last name"
      >
        <InputField placeholder="John Doe" className="w-full" required />
      </FieldSection>

      <FieldSection
        label="Email"
        requiredLabel="*"
        secondaryLabel="Your primary email address"
      >
        <InputField type="email" placeholder="john@example.com" className="w-full" required />
      </FieldSection>

      <FieldSection
        label="Phone"
        secondaryLabel="Optional contact number"
      >
        <InputField type="tel" placeholder="+1 (555) 000-0000" className="w-full" />
      </FieldSection>
    </div>
  )
}
```

### With Field Hints

Add validation hints and feedback.

```tsx
import { FieldHint } from '@/components/FieldHint'

export function WithFieldHints() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const validateEmail = (value) => {
    if (!value.includes('@')) {
      setError('Please enter a valid email address')
    } else {
      setError('')
    }
  }

  return (
    <FieldSection
      label="Email Address"
      requiredLabel="Required"
      secondaryLabel="We'll send you account updates"
      childrenUnderLabel={
        <>
          <FieldHint
            label="Use your work email for business accounts"
            state="info"
          />
          {error && (
            <FieldHint label={error} state="error" />
          )}
        </>
      }
    >
      <InputField
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          validateEmail(e.target.value)
        }}
        placeholder="your.email@company.com"
        className="w-full"
      />
    </FieldSection>
  )
}
```

### Multiple Form Fields

Group multiple related inputs in one section.

```tsx
export function MultipleFields() {
  return (
    <FieldSection
      label="Shipping Address"
      requiredLabel="Required"
      secondaryLabel="Enter your complete shipping address"
    >
      <InputField
        placeholder="Street Address"
        className="w-full"
      />
      <InputField
        placeholder="Apartment, suite, etc. (optional)"
        className="w-full"
      />
      <div className="grid grid-cols-2 gap-3 w-full">
        <InputField placeholder="City" />
        <InputField placeholder="State/Province" />
      </div>
      <div className="grid grid-cols-2 gap-3 w-full">
        <InputField placeholder="ZIP/Postal Code" />
        <InputField placeholder="Country" />
      </div>
    </FieldSection>
  )
}
```

### With Different Input Types

Mix various form input components.

```tsx
export function MixedInputTypes() {
  return (
    <div className="space-y-4">
      <FieldSection
        label="Project Name"
        requiredLabel="Required"
        secondaryLabel="Choose a descriptive name"
      >
        <InputField placeholder="My Awesome Project" className="w-full" />
      </FieldSection>

      <FieldSection
        label="Project Description"
        secondaryLabel="Provide details about your project"
      >
        <TextAreaInput
          placeholder="Describe your project..."
          rows={4}
          className="w-full"
        />
      </FieldSection>

      <FieldSection
        label="Project Type"
        requiredLabel="Required"
      >
        <SimpleSelect
          options={[
            { value: 'web', label: 'Web Application' },
            { value: 'mobile', label: 'Mobile App' },
            { value: 'desktop', label: 'Desktop Software' },
          ]}
          className="w-full"
        />
      </FieldSection>

      <FieldSection
        label="Enable Features"
      >
        <div className="w-full space-y-2">
          <LabeledCheckBox id="notifications" label="Email Notifications" />
          <LabeledCheckBox id="analytics" label="Analytics Tracking" />
          <LabeledCheckBox id="api" label="API Access" />
        </div>
      </FieldSection>
    </div>
  )
}
```

### Profile Settings Form

Complete profile form with multiple sections.

```tsx
export function ProfileSettingsForm() {
  return (
    <form className="max-w-[1200px] space-y-0">
      <FieldSection
        size="M"
        label="Display Name"
        requiredLabel="Required"
        secondaryLabel="This is how others will see you"
      >
        <InputField placeholder="John Doe" className="w-full" />
      </FieldSection>

      <FieldSection
        size="M"
        label="Username"
        requiredLabel="Required"
        secondaryLabel="Your unique identifier"
        childrenUnderLabel={
          <FieldHint
            label="Can only contain letters, numbers, and underscores"
            state="info"
          />
        }
      >
        <InputField placeholder="johndoe" className="w-full" />
      </FieldSection>

      <FieldSection
        size="M"
        label="Bio"
        secondaryLabel="Tell us about yourself"
      >
        <TextAreaInput
          placeholder="I'm a developer who loves..."
          rows={3}
          className="w-full"
        />
      </FieldSection>

      <FieldSection
        size="M"
        label="Profile Photo"
        secondaryLabel="Upload a profile picture"
      >
        <div className="w-full flex items-center gap-4">
          <Avatar size="L" src="/default-avatar.jpg" />
          <Button variant="SecStyle" size="M">
            Upload New Photo
          </Button>
        </div>
      </FieldSection>

      <FieldSection
        size="M"
        label="Email Preferences"
        secondaryLabel="Choose what emails you want to receive"
      >
        <div className="w-full space-y-2">
          <LabeledCheckBox id="marketing" label="Marketing emails" />
          <LabeledCheckBox id="updates" label="Product updates" />
          <LabeledCheckBox id="security" label="Security alerts" />
        </div>
      </FieldSection>
    </form>
  )
}
```

### Password Change Section

Secure password update form.

```tsx
export function PasswordChangeSection() {
  return (
    <div className="max-w-[1200px]">
      <FieldSection
        label="Current Password"
        requiredLabel="Required"
        secondaryLabel="Enter your current password to make changes"
      >
        <InputField
          type="password"
          placeholder="••••••••"
          className="w-full"
        />
      </FieldSection>

      <FieldSection
        label="New Password"
        requiredLabel="Required"
        secondaryLabel="Must be at least 8 characters"
        childrenUnderLabel={
          <>
            <FieldHint
              label="Use a mix of letters, numbers, and symbols"
              state="info"
            />
            <FieldHint
              label="Password strength: Strong"
              state="success"
            />
          </>
        }
      >
        <InputField
          type="password"
          placeholder="••••••••"
          className="w-full"
        />
      </FieldSection>

      <FieldSection
        label="Confirm New Password"
        requiredLabel="Required"
        secondaryLabel="Re-enter your new password"
      >
        <InputField
          type="password"
          placeholder="••••••••"
          className="w-full"
        />
      </FieldSection>
    </div>
  )
}
```

### Account Settings

Comprehensive account management form.

```tsx
export function AccountSettings() {
  return (
    <div className="max-w-[1200px]">
      <h2 className="text-xl font-bold mb-6">Account Settings</h2>

      <FieldSection
        label="Language"
        secondaryLabel="Select your preferred language"
      >
        <SimpleSelect
          options={[
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
            { value: 'fr', label: 'Français' },
          ]}
          className="w-full"
        />
      </FieldSection>

      <FieldSection
        label="Time Zone"
        secondaryLabel="Choose your local time zone"
      >
        <SimpleSelect
          options={[
            { value: 'utc', label: 'UTC' },
            { value: 'est', label: 'Eastern Time (EST)' },
            { value: 'pst', label: 'Pacific Time (PST)' },
          ]}
          className="w-full"
        />
      </FieldSection>

      <FieldSection
        label="Privacy"
        secondaryLabel="Control who can see your profile"
      >
        <RadioGroup value="public">
          <div className="w-full space-y-2">
            <LabeledRadio id="public" value="public" label="Public" />
            <LabeledRadio id="friends" value="friends" label="Friends Only" />
            <LabeledRadio id="private" value="private" label="Private" />
          </div>
        </RadioGroup>
      </FieldSection>

      <FieldSection
        label="Danger Zone"
        secondaryLabel="Irreversible account actions"
        childrenUnderLabel={
          <FieldHint
            label="These actions cannot be undone"
            state="warning"
          />
        }
      >
        <div className="w-full space-y-2">
          <Button variant="DangerStyle" size="M">
            Delete Account
          </Button>
        </div>
      </FieldSection>
    </div>
  )
}
```

### Validation States

Show different validation states.

```tsx
export function ValidationStates() {
  return (
    <div className="space-y-4">
      <FieldSection
        label="Valid Field"
        childrenUnderLabel={
          <FieldHint label="Looks good!" state="success" />
        }
      >
        <InputField value="Valid input" className="w-full" />
      </FieldSection>

      <FieldSection
        label="Warning Field"
        childrenUnderLabel={
          <FieldHint
            label="This might not be what you want"
            state="warning"
          />
        }
      >
        <InputField value="Questionable input" className="w-full" />
      </FieldSection>

      <FieldSection
        label="Error Field"
        requiredLabel="Required"
        childrenUnderLabel={
          <FieldHint label="This field is required" state="error" />
        }
      >
        <InputField value="" className="w-full" />
      </FieldSection>

      <FieldSection
        label="Info Field"
        childrenUnderLabel={
          <FieldHint
            label="Pro tip: Use your work email"
            state="info"
          />
        }
      >
        <InputField placeholder="email@company.com" className="w-full" />
      </FieldSection>
    </div>
  )
}
```

## API Reference

### FieldSection Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | `ReactNode` | - | Primary label text |
| secondaryLabel | `ReactNode` | - | Secondary descriptive text |
| requiredLabel | `ReactNode` | - | Required field indicator |
| size | `'S' \| 'M' \| 'L'` | - | Label size |
| direction | `'horizontal' \| 'vertical' \| 'flexible'` | `'flexible'` | Layout direction |
| childrenUnderLabel | `ReactNode` | - | Content below labels (hints, errors) |
| theme | `Themes` | - | Theme override |
| className | `string` | - | Additional CSS classes |
| children | `ReactNode` | - | Form field content |

### Layout Directions

| Direction | Behavior | Best For |
|-----------|----------|----------|
| vertical | Always stacks vertically | Mobile-first designs |
| horizontal | Always side-by-side (350px label width) | Desktop forms |
| flexible | Vertical on mobile, horizontal on desktop | Responsive designs |

## Styling

### Base Structure

- **Border Top**: Separates sections with subtle border
- **Padding**: 16px vertical, 12px horizontal
- **Max Width**: 1200px for optimal readability
- **Grid Layout**: Responsive grid system

### Label Section

- **Fixed Width**: 350px on horizontal/flexible layouts
- **Gap**: 12px between label elements

### Content Section

- **Flexible Width**: Takes remaining space
- **Grid**: Single column with 12px gap
- **Alignment**: Content aligned to end

## TypeScript Types

```typescript
interface FieldSectionProps {
  label?: ReactNode
  secondaryLabel?: ReactNode
  requiredLabel?: ReactNode
  size?: 'S' | 'M' | 'L'
  childrenUnderLabel?: ReactNode
  theme?: Themes
  className?: string
  children?: ReactNode
  direction?: 'horizontal' | 'vertical' | 'flexible'
}
```

## Common Patterns

### Form with Multiple Sections

```tsx
function CompleteForm() {
  return (
    <form className="space-y-0">
      {formSections.map((section, index) => (
        <FieldSection
          key={index}
          label={section.label}
          secondaryLabel={section.description}
          requiredLabel={section.required ? 'Required' : undefined}
        >
          {section.fields.map(field => (
            <InputField
              key={field.name}
              {...field}
              className="w-full"
            />
          ))}
        </FieldSection>
      ))}
    </form>
  )
}
```

### Conditional Field Display

```tsx
function ConditionalFields() {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <>
      <FieldSection label="Basic Settings">
        <InputField className="w-full" />
      </FieldSection>

      {showAdvanced && (
        <FieldSection label="Advanced Settings">
          <InputField className="w-full" />
        </FieldSection>
      )}

      <button onClick={() => setShowAdvanced(!showAdvanced)}>
        {showAdvanced ? 'Hide' : 'Show'} Advanced
      </button>
    </>
  )
}
```

## Testing

```typescript
import { render, screen } from '@testing-library/react'
import { FieldSection } from '@/layouts/FieldSection'

describe('FieldSection', () => {
  it('renders with label', () => {
    render(
      <FieldSection label="Test Label">
        <input />
      </FieldSection>
    )

    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('shows required indicator', () => {
    render(
      <FieldSection
        label="Email"
        requiredLabel="Required"
      >
        <input />
      </FieldSection>
    )

    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('applies correct layout direction', () => {
    const { container } = render(
      <FieldSection direction="horizontal" label="Test">
        <input />
      </FieldSection>
    )

    const section = container.querySelector('section')
    expect(section).toHaveClass('grid-cols-[350px_1fr]')
  })

  it('renders children under label', () => {
    render(
      <FieldSection
        label="Test"
        childrenUnderLabel={<span>Helper text</span>}
      >
        <input />
      </FieldSection>
    )

    expect(screen.getByText('Helper text')).toBeInTheDocument()
  })
})
```

## Accessibility

- **Semantic HTML**: Uses section element
- **Label Association**: Labels are properly associated with inputs
- **Required Indicators**: Clear visual and programmatic required states
- **Screen Reader Support**: Proper structure for assistive technologies
- **Keyboard Navigation**: Full keyboard accessibility
- **ARIA Support**: Supports ARIA attributes for enhanced accessibility

## Performance

- **CSS Grid**: Efficient responsive layout
- **Minimal Re-renders**: Optimized component structure
- **Lazy Label Rendering**: Only renders labels when provided
- **Flexible Layout**: CSS-based responsive behavior

## Migration Guide

### From Custom Form Sections

```tsx
// Before: Custom form section
<div className="form-section">
  <label>Email</label>
  <p className="help-text">Enter your email</p>
  <input type="email" />
</div>

// After: FieldSection
<FieldSection
  label="Email"
  secondaryLabel="Enter your email"
>
  <InputField type="email" className="w-full" />
</FieldSection>
```

## Best Practices

1. **Consistent Sizing**: Use the same size across related sections
2. **Clear Labels**: Write descriptive, concise labels
3. **Helpful Secondary Text**: Provide context and guidance
4. **Required Indicators**: Always mark required fields
5. **Validation Feedback**: Show errors and success states
6. **Responsive Direction**: Use flexible direction for most cases
7. **Max Width**: Keep form sections within readable width
8. **Group Related Fields**: Use one section per logical group