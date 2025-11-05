---
name: Form
version: 1.1.15
status: stable
category: components/forms
tags: [form, validation, react-hook-form, accessible, compound]
last-reviewed: 2024-11-05
bundle-size: 3.5kb
dependencies:
  - "react-hook-form": "^7.0.0"
  - "@radix-ui/react-label": "^2.0.0"
  - "@radix-ui/react-slot": "^1.0.0"
---

# Form

> A comprehensive form management component built on React Hook Form. Provides form validation, error handling, and accessible form controls with automatic ARIA attributes.

## Installation

```bash
npm install torch-glare react-hook-form
```

## Import

```typescript
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from 'torch-glare/lib/components/Form'

// Also import from react-hook-form
import { useForm } from 'react-hook-form'
```

## Quick Examples

### Basic Form

```typescript
import { useForm } from 'react-hook-form'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from 'torch-glare/lib/components/Form'
import { Input } from 'torch-glare/lib/components/Input'
import { Button } from 'torch-glare/lib/components/Button'

function BasicForm() {
  const form = useForm({
    defaultValues: {
      username: '',
      email: ''
    }
  })

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### With Validation

```typescript
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional()
})

function ValidatedForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      age: 0,
      bio: ''
    }
  })

  const onSubmit = (data) => {
    console.log('Valid data:', data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Choose a unique username (min 3 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Tell us about yourself (max 500 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### With Multiple Field Types

```typescript
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from 'torch-glare/lib/components/Select'
import { Checkbox } from 'torch-glare/lib/components/Checkbox'
import { RadioGroup, RadioGroupItem } from 'torch-glare/lib/components/Radio'

function MultiFieldForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      country: '',
      gender: '',
      subscribe: false,
      preferences: []
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Text Input */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Select Dropdown */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Radio Group */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="male" />
                    </FormControl>
                    <FormLabel>Male</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="female" />
                    </FormControl>
                    <FormLabel>Female</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem value="other" />
                    </FormControl>
                    <FormLabel>Other</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Checkbox */}
        <FormField
          control={form.control}
          name="subscribe"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Subscribe to newsletter</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

### With Custom Labels

```typescript
<FormField
  control={form.control}
  name="field"
  render={({ field }) => (
    <FormItem>
      <FormLabel
        label="Main Label"
        requiredLabel="*"
        secondaryLabel="(Optional)"
        size="M"
        variant="PresentationStyle"
        labelDirections="horizontal"
      />
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Async Form Submission

```typescript
function AsyncForm() {
  const form = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Submission failed')

      // Handle success
      form.reset()
      alert('Form submitted successfully!')
    } catch (error) {
      // Handle error
      form.setError('root', {
        message: 'Something went wrong. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}

        {form.formState.errors.root && (
          <div className="text-red-500 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          is_loading={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
```

## API Reference

### Form Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `...form` | `UseFormReturn` | - | React Hook Form instance |
| `children` | `React.ReactNode` | - | Form content |

### FormField Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `control` | `Control` | - | Form control from useForm |
| `name` | `string` | - | Field name |
| `render` | `(field) => ReactNode` | - | Render function |
| `rules` | `RegisterOptions` | - | Validation rules |
| `defaultValue` | `any` | - | Default field value |

### FormItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Form item content |

### FormLabel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | - | Main label text |
| `requiredLabel` | `ReactNode` | - | Required indicator |
| `secondaryLabel` | `ReactNode` | - | Secondary text |
| `size` | `'S' \| 'M' \| 'L'` | `'M'` | Label size |
| `variant` | `'SystemStyle' \| 'PresentationStyle'` | - | Visual variant |
| `theme` | `Themes` | - | Theme override |
| `labelDirections` | `'vertical' \| 'horizontal'` | `'vertical'` | Label layout |
| `className` | `string` | - | Additional CSS classes |

### FormControl Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | Form control element |

### FormDescription Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Description text |

### FormMessage Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Custom error message |

### TypeScript

```typescript
import type { UseFormReturn, FieldValues, Control, RegisterOptions } from 'react-hook-form'

// Form types
type FormProps = UseFormReturn<FieldValues>

// FormField types
interface FormFieldProps<T extends FieldValues> {
  control: Control<T>
  name: keyof T
  render: (field: any) => React.ReactNode
  rules?: RegisterOptions
  defaultValue?: any
}

// FormLabel types
interface FormLabelProps {
  label?: ReactNode
  requiredLabel?: ReactNode
  secondaryLabel?: ReactNode
  size?: 'S' | 'M' | 'L'
  variant?: 'SystemStyle' | 'PresentationStyle'
  theme?: Themes
  labelDirections?: 'vertical' | 'horizontal'
  className?: string
}

// Hook
export const useFormField: () => {
  id: string
  name: string
  formItemId: string
  formDescriptionId: string
  formMessageId: string
  error?: FieldError
}
```

## Common Patterns

### Dynamic Form Fields

```typescript
function DynamicForm() {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  })

  return (
    <Form {...form}>
      <form>
        {fields.map((field, index) => (
          <FormField
            key={field.id}
            control={form.control}
            name={`items.${index}.value`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item {index + 1}</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="BorderStyle"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          type="button"
          variant="BorderStyle"
          onClick={() => append({ value: '' })}
        >
          Add Item
        </Button>
      </form>
    </Form>
  )
}
```

### Conditional Fields

```typescript
function ConditionalForm() {
  const form = useForm()
  const hasAccount = form.watch('hasAccount')

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="hasAccount"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>I have an account</FormLabel>
            </FormItem>
          )}
        />

        {hasAccount && (
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  )
}
```

### Multi-Step Form

```typescript
function MultiStepForm() {
  const [step, setStep] = useState(1)
  const form = useForm()

  const nextStep = async () => {
    const isValid = await form.trigger() // Validate current step
    if (isValid) setStep(step + 1)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {step === 1 && (
          <>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" onClick={nextStep}>Next</Button>
          </>
        )}

        {step === 2 && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" onClick={() => setStep(1)}>Back</Button>
            <Button type="submit">Submit</Button>
          </>
        )}
      </form>
    </Form>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'

function TestForm() {
  const form = useForm()
  const onSubmit = jest.fn()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="test"
          rules={{ required: 'This field is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Field</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  )
}

describe('Form', () => {
  it('shows validation error', async () => {
    render(<TestForm />)

    const submitButton = screen.getByText('Submit')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })
  })
})
```

## Accessibility

### Automatic ARIA Attributes

- `aria-invalid`: Set on fields with errors
- `aria-describedby`: Links fields to descriptions and error messages
- `aria-required`: Set on required fields
- Proper label association with `htmlFor`

### Keyboard Support

- Tab navigation through fields
- Enter key submits form
- Escape key can clear dropdowns

### Screen Reader Support

- Field labels announced
- Error messages announced
- Descriptions read with fields

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 3.5kb |
| First render | <10ms |
| Re-render | <4ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Use `React.memo()` for complex field components
2. Implement field-level validation
3. Use `useController` for custom inputs
4. Debounce validation for async checks

## Related Components

- [Input](/docs/components/input.md) - Text input
- [Select](/docs/components/select.md) - Dropdown select
- [Checkbox](/docs/components/checkbox.md) - Checkbox input
- [Radio](/docs/components/radio.md) - Radio buttons
- [Button](/docs/components/button.md) - Submit button

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Added React Hook Form integration
- Enhanced accessibility
- Improved TypeScript types

### v1.1.14
- Added FormDescription component
- Fixed validation timing
- Performance improvements

### v1.1.0
- Initial release