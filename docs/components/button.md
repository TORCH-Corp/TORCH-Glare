---
name: Button
version: 2.4.5
status: stable
category: components/buttons
tags: [interactive, form, action, accessible, polymorphic]
last-reviewed: 2024-11-05
bundle-size: 3.2kb
dependencies:
  - "@radix-ui/react-slot": "^1.0.0"
  - "class-variance-authority": "^0.7.0"
---

# Button

> A versatile, accessible button component with multiple variants, sizes, and states. Supports icons, loading states, and polymorphic rendering through the `as` prop.

## Installation

TORCH Glare is a copy-in library: the CLI copies this component's source into your project
(you do **not** install it from the npm package). Run `init` once, then `add`:

```bash
npx torch-glare@latest init
npx torch-glare@latest add Button
```

`add` also copies any components, hooks, and utilities that `Button` depends on.

## Import

Import from your project's local path — the alias configured in `glare.json` (e.g. `@/*`):

```tsx
import { Button } from "@/components/Button";
```

## Quick Examples

### Basic Usage

```typescript
import { Button } from '@/components/Button'

function Example() {
  return (
    <Button variant="PrimeStyle" onClick={() => console.log('clicked')}>
      Click me
    </Button>
  )
}
```

### All Variants

```typescript
// Primary styles
<Button variant="PrimeStyle">Primary</Button>
<Button variant="PrimeContStyle">Primary Container</Button>

// Secondary styles
<Button variant="BluSecStyle">Blue Secondary</Button>
<Button variant="YelSecStyle">Yellow Secondary</Button>
<Button variant="RedSecStyle">Red Secondary</Button>

// Container styles
<Button variant="BluContStyle">Blue Container</Button>
<Button variant="RedContStyle">Red Container</Button>

// Color (solid) styles
<Button variant="PrimeColStyle">Primary Color</Button>
<Button variant="BluColStyle">Blue Color</Button>
<Button variant="RedColStyle">Red Color</Button>
<Button variant="GreenColStyle">Green Color</Button>
<Button variant="YelColStyle">Yellow Color</Button>

// Border style
<Button variant="BorderStyle">Border Only</Button>
```

### With Sizes

```typescript
<Button size="S">Small</Button>
<Button size="M">Medium (Default)</Button>
<Button size="L">Large</Button>
<Button size="XL">Extra Large</Button>
<Button buttonType="icon">Icon Only</Button>
```

### Loading State

```typescript
function SaveButton() {
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await saveData()
    setLoading(false)
  }

  return (
    <Button
      variant="PrimeStyle"
      is_loading={loading}
      onClick={handleSave}
    >
      {loading ? 'Saving...' : 'Save'}
    </Button>
  )
}
```

### With Icons

```typescript
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

// Icon before text
<Button variant="PrimeStyle">
  <PlusIcon className="w-4 h-4 mr-2" />
  Add Item
</Button>

// Icon after text
<Button variant="RedSecStyle">
  Delete
  <TrashIcon className="w-4 h-4 ml-2" />
</Button>

// Icon only
<Button buttonType="icon" aria-label="Add new item">
  <PlusIcon className="w-5 h-5" />
</Button>
```

### Polymorphic Component

```typescript
// Render as anchor tag
<Button as="a" href="/about" variant="BorderStyle">
  Learn More
</Button>

// Using asChild for complete control
<Button asChild variant="PrimeStyle">
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>
```

### With Theme Override

```typescript
<Button theme="dark" variant="PrimeStyle">
  Dark Theme Button
</Button>

<Button theme="light" variant="BluSecStyle">
  Light Theme Button
</Button>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `ButtonVariant` | `'PrimeStyle'` | Visual style variant of the button |
| `size` | `'S' \| 'M' \| 'L' \| 'XL'` | `'M'` | Size of the button |
| `buttonType` | `'button' \| 'icon'` | `'button'` | Layout type; `'icon'` renders a square icon-only button |
| `is_loading` | `boolean` | `false` | Shows loading state and disables interaction |
| `disabled` | `boolean` | `false` | Disables the button |
| `asChild` | `boolean` | `false` | Merges props onto child element |
| `as` | `React.ElementType` | `'button'` | Element type to render as |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Override theme for this component |
| `containerClassName` | `string` | - | Additional classes for wrapper |
| `className` | `string` | - | Additional CSS classes |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `onClick` | `(event: MouseEvent) => void` | - | Click event handler |
| `children` | `React.ReactNode` | - | Button content |

### TypeScript

```typescript
import { ButtonHTMLAttributes } from 'react'
import { VariantProps } from 'class-variance-authority'

type ButtonVariant =
  | 'PrimeStyle'
  | 'BluSecStyle'
  | 'YelSecStyle'
  | 'RedSecStyle'
  | 'BorderStyle'
  | 'PrimeContStyle'
  | 'BluContStyle'
  | 'RedContStyle'
  | 'PrimeColStyle'
  | 'BluColStyle'
  | 'RedColStyle'
  | 'GreenColStyle'
  | 'YelColStyle'

type Themes = 'light' | 'dark' | 'default'

interface ButtonProps extends
  ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  is_loading?: boolean
  disabled?: boolean
  asChild?: boolean
  variant?: ButtonVariant
  buttonType?: 'button' | 'icon'
  as?: React.ElementType
  theme?: Themes
  containerClassName?: string
}

export const Button: React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
>
```

## Common Patterns

### Form Submit Button

```typescript
import { Button } from '@/components/Button'
import { Form } from '@/components/Form'

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await submitForm(data)
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {/* Form fields */}

      <Button
        type="submit"
        variant="PrimeStyle"
        is_loading={isSubmitting}
        disabled={isSubmitting}
      >
        Submit
      </Button>
    </Form>
  )
}
```

### Button Group

```typescript
import { Button } from '@/components/Button'
import { ActionsGroup } from '@/components/ActionsGroup'

function ButtonGroup() {
  return (
    <ActionsGroup>
      <Button variant="BorderStyle">Cancel</Button>
      <Button variant="PrimeStyle">Save</Button>
      <Button variant="RedSecStyle">Delete</Button>
    </ActionsGroup>
  )
}
```

### Confirmation Pattern

```typescript
function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [needsConfirm, setNeedsConfirm] = useState(false)

  if (needsConfirm) {
    return (
      <div className="flex gap-2">
        <Button
          size="S"
          variant="RedSecStyle"
          onClick={() => {
            onDelete()
            setNeedsConfirm(false)
          }}
        >
          Confirm Delete
        </Button>
        <Button
          size="S"
          variant="BorderStyle"
          onClick={() => setNeedsConfirm(false)}
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="RedContStyle"
      onClick={() => setNeedsConfirm(true)}
    >
      Delete
    </Button>
  )
}
```

### With Tooltip

```typescript
import { Button } from '@/components/Button'
import { Tooltip } from '@/components/Tooltip'

function SaveButton() {
  return (
    <Tooltip content="Save your changes">
      <Button variant="PrimeStyle">
        Save
      </Button>
    </Tooltip>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/Button'

describe('Button', () => {
  it('handles click events', () => {
    const handleClick = jest.fn()
    render(
      <Button onClick={handleClick}>
        Click me
      </Button>
    )

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(
      <Button is_loading={true}>
        Save
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('applies variant classes', () => {
    render(
      <Button variant="RedSecStyle">
        Delete
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-500')
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('Button meets WCAG standards', async () => {
  const { container } = render(
    <Button variant="PrimeStyle">
      Accessible Button
    </Button>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Keyboard Support

- **Space**: Activates the button
- **Enter**: Activates the button
- **Tab**: Moves focus to/from the button

### ARIA Attributes

The Button component automatically includes:

```typescript
<button
  type="button"
  disabled={disabled || is_loading}
  aria-busy={is_loading || undefined}
>
  {children}
  {/* While loading, the spinner is rendered with role="status" and aria-label="Loading" */}
</button>
```

Notes:
- The component renders a native `<button>` (or the element passed via `as`), so it does **not** add an explicit `role="button"`.
- It sets the native `disabled` attribute (never `aria-disabled`) when `disabled` or `is_loading` is true.
- `aria-busy` is set only while loading; it is omitted otherwise.
- The loading spinner itself carries `role="status"` and `aria-label="Loading"`.

### Screen Reader Support

```typescript
// Always provide aria-label for icon-only buttons
<Button buttonType="icon" aria-label="Add new item">
  <PlusIcon className="w-5 h-5" />
</Button>

// Use aria-describedby for additional context
<Button
  aria-describedby="delete-warning"
  variant="RedSecStyle"
>
  Delete Account
</Button>
<span id="delete-warning" className="sr-only">
  This action cannot be undone
</span>
```

### Focus Management

- Visible focus ring on keyboard navigation
- Proper focus trap when in loading state
- Focus restoration after modal/dialog interactions

## Styling

### Custom Styles with className

```typescript
<Button
  variant="PrimeStyle"
  className="rounded-full shadow-lg hover:shadow-xl"
>
  Custom Styled Button
</Button>
```

### Using with Tailwind CSS

```typescript
<Button
  variant="BorderStyle"
  className="
    border-2 border-dashed
    hover:border-solid
    transition-all
    duration-200
  "
>
  Tailwind Enhanced
</Button>
```

### Theme Customization

```css
/* Custom theme variables */
[data-theme="custom"] {
  --button-primary-bg: #your-color;
  --button-primary-hover: #your-hover-color;
  --button-primary-text: #your-text-color;
}
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 3.2kb |
| First render | <10ms |
| Re-render | <5ms |
| Tree-shakeable | ✅ |
| Memoized | ✅ |

### Optimization Tips

1. Use `React.memo()` for parent components
2. Memoize onClick handlers with `useCallback`
3. Lazy load icon libraries
4. Use dynamic imports for large button groups

## Migration

### From v1.0.x

```diff
// Import path changed
- import Button from 'torch-glare/Button'
+ import { Button } from '@/components/Button'

// Loading prop renamed
- <Button loading={true}>
+ <Button is_loading={true}>

// Theme prop standardized
- <Button colorScheme="dark">
+ <Button theme="dark">
```

## Troubleshooting

### Common Issues

#### Button doesn't submit form

**Solution:** Set `type="submit"`

```typescript
<Button type="submit" variant="PrimeStyle">
  Submit Form
</Button>
```

#### Click handler fires twice

**Solution:** Check for event bubbling

```typescript
<Button onClick={(e) => {
  e.stopPropagation()
  handleClick()
}}>
  Click Once
</Button>
```

#### Loading state doesn't show

**Solution:** Check state management

```typescript
const [loading, setLoading] = useState(false)

// Make sure to set loading to true before async operation
const handleClick = async () => {
  setLoading(true) // Set before await
  await someAsyncOperation()
  setLoading(false)
}
```

## Related Components

- [ActionButton](/docs/components/action-button.md) - Icon-only action buttons
- [LinkButton](/docs/components/link-button.md) - Button styled as link
- [LoginButton](/docs/components/login-button.md) - Specialized login button
- [ActionsGroup](/docs/components/actions-group.md) - Group multiple buttons

## FAQ

**Q: How do I make a button full width?**

```typescript
<Button className="w-full" variant="PrimeStyle">
  Full Width Button
</Button>
```

**Q: Can I use custom icons?**

Yes, any React component can be used as an icon:

```typescript
<Button variant="PrimeStyle">
  <CustomIcon className="w-4 h-4 mr-2" />
  Custom Icon
</Button>
```

**Q: How do I disable a button conditionally?**

```typescript
<Button
  disabled={!isFormValid}
  variant="PrimeStyle"
>
  Submit
</Button>
```

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Added `containerClassName` prop
- Improved loading state animations
- Fixed focus ring in dark mode

### v1.1.14
- Added polymorphic `as` prop
- Enhanced TypeScript types
- Performance optimizations

### v1.1.0
- Initial stable release
- 8 button variants
- 5 size options