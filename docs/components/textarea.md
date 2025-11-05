---
name: Textarea
version: 1.1.15
status: stable
category: components/forms
tags: [form, textarea, multiline, input, field, accessible, auto-resize]
last-reviewed: 2024-11-05
bundle-size: 2.2kb
dependencies:
  - "class-variance-authority": "^0.7.0"
  - "@/components/Label": "internal"
---

# Textarea

> A versatile multi-line text input component with auto-resizing capability, integrated label support, and flexible layout options. Perfect for comments, descriptions, and long-form text input.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { Textarea } from 'torch-glare/lib/components/Textarea'
```

## Quick Examples

### Basic Usage

```typescript
import { Textarea } from 'torch-glare/lib/components/Textarea'

function Example() {
  const [value, setValue] = useState('')

  return (
    <Textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter your message..."
    />
  )
}
```

### With Label

```typescript
function LabeledTextarea() {
  return (
    <Textarea
      label="Description"
      placeholder="Describe your issue..."
      rows={4}
    />
  )
}
```

### Required Field

```typescript
function RequiredTextarea() {
  return (
    <Textarea
      label="Comments"
      requiredLabel="*"
      secondaryLabel="(min 50 characters)"
      placeholder="Please provide detailed feedback..."
      minLength={50}
      required
    />
  )
}
```

### Error State

```typescript
function ErrorTextarea() {
  const [value, setValue] = useState('')
  const hasError = value.length > 0 && value.length < 10

  return (
    <Textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      state={hasError ? 'negative' : undefined}
      placeholder="Minimum 10 characters..."
    />
  )
}
```

### Different Layouts

```typescript
// Horizontal layout (label beside textarea)
<Textarea
  label="Note"
  direction="row"
  placeholder="Add a note..."
/>

// Vertical layout (label above textarea)
<Textarea
  label="Description"
  direction="column"
  placeholder="Enter description..."
/>
```

### Auto-Resizing

```typescript
function AutoResizeTextarea() {
  // The textarea automatically resizes based on content
  // due to field-sizing-content CSS property
  return (
    <Textarea
      placeholder="This textarea grows as you type..."
      className="min-h-[100px] max-h-[400px]"
    />
  )
}
```

### Themed Textarea

```typescript
function ThemedTextarea() {
  return (
    <>
      <Textarea
        theme="light"
        label="Light Theme"
        placeholder="Light theme textarea..."
      />

      <Textarea
        theme="dark"
        label="Dark Theme"
        placeholder="Dark theme textarea..."
      />
    </>
  )
}
```

## API Reference

### Textarea Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text for the textarea |
| `requiredLabel` | `string` | - | Text for required field indicator |
| `secondaryLabel` | `string` | - | Additional label text/hint |
| `direction` | `'row' \| 'column'` | `'row'` | Layout direction for label |
| `state` | `'negative'` | - | Visual state for errors |
| `theme` | `'dark' \| 'light' \| 'default'` | - | Theme variant |
| `className` | `string` | - | Additional CSS classes |
| `placeholder` | `string` | - | Placeholder text |
| `value` | `string` | - | Textarea value |
| `onChange` | `(e: ChangeEvent) => void` | - | Change event handler |
| `rows` | `number` | - | Initial number of rows |
| `cols` | `number` | - | Number of columns |
| `maxLength` | `number` | - | Maximum character length |
| `minLength` | `number` | - | Minimum character length |
| `disabled` | `boolean` | `false` | Disables the textarea |
| `required` | `boolean` | `false` | Makes field required |
| `readOnly` | `boolean` | `false` | Makes field read-only |

Plus all standard HTML textarea attributes.

### TypeScript

```typescript
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  requiredLabel?: string
  secondaryLabel?: string
  direction?: 'row' | 'column'
  state?: 'negative'
  theme?: 'dark' | 'light' | 'default'
}

export const Textarea: React.ForwardRefExoticComponent<TextareaProps>
```

## Common Patterns

### Character Counter

```typescript
function TextareaWithCounter() {
  const [value, setValue] = useState('')
  const maxLength = 500

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={maxLength}
        label="Bio"
        secondaryLabel={`${value.length}/${maxLength} characters`}
        placeholder="Tell us about yourself..."
        state={value.length > maxLength * 0.9 ? 'negative' : undefined}
      />
    </div>
  )
}
```

### Form Integration

```typescript
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // Handle submission
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />

      <Textarea
        label="Message"
        requiredLabel="*"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        placeholder="Your message..."
        rows={5}
        required
      />

      <Button type="submit">Send Message</Button>
    </form>
  )
}
```

### Markdown Editor

```typescript
function MarkdownEditor() {
  const [markdown, setMarkdown] = useState('')
  const [preview, setPreview] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3>Markdown Editor</h3>
        <button onClick={() => setPreview(!preview)}>
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {preview ? (
        <div className="prose">
          {/* Render markdown preview */}
          <div dangerouslySetInnerHTML={{__html: markdown}} />
        </div>
      ) : (
        <Textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Write in markdown..."
          className="font-mono"
          rows={10}
        />
      )}
    </div>
  )
}
```

### Auto-Save Textarea

```typescript
function AutoSaveTextarea() {
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date>()

  // Auto-save after 2 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content) {
        setSaving(true)
        // Simulate save
        setTimeout(() => {
          setSaving(false)
          setLastSaved(new Date())
        }, 500)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [content])

  return (
    <div>
      <Textarea
        label="Notes"
        secondaryLabel={
          saving ? 'Saving...' :
          lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` :
          'Auto-saves as you type'
        }
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing..."
      />
    </div>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from 'torch-glare/lib/components/Textarea'

describe('Textarea', () => {
  it('handles user input', () => {
    const handleChange = jest.fn()
    render(
      <Textarea
        onChange={handleChange}
        placeholder="Type here..."
      />
    )

    const textarea = screen.getByPlaceholderText('Type here...')
    fireEvent.change(textarea, { target: { value: 'Hello World' } })

    expect(handleChange).toHaveBeenCalled()
    expect(textarea).toHaveValue('Hello World')
  })

  it('shows error state', () => {
    const { container } = render(
      <Textarea
        state="negative"
        placeholder="Error textarea"
      />
    )

    const textarea = container.querySelector('textarea')
    expect(textarea).toHaveClass('border-border-presentation-state-negative')
  })

  it('renders with label', () => {
    render(
      <Textarea
        label="Comments"
        requiredLabel="*"
        secondaryLabel="Optional"
      />
    )

    expect(screen.getByText('Comments')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('Optional')).toBeInTheDocument()
  })

  it('respects character limits', () => {
    render(
      <Textarea
        maxLength={10}
        placeholder="Max 10 chars"
      />
    )

    const textarea = screen.getByPlaceholderText('Max 10 chars')
    expect(textarea).toHaveAttribute('maxLength', '10')
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('Textarea meets WCAG standards', async () => {
  const { container } = render(
    <Textarea
      label="Message"
      requiredLabel="*"
      placeholder="Enter message..."
      required
    />
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Keyboard Support

- **Tab**: Move focus to/from textarea
- **Arrow Keys**: Navigate text cursor
- **Home/End**: Jump to start/end of line
- **Ctrl/Cmd + Home/End**: Jump to start/end of text
- **Page Up/Down**: Scroll through content

### ARIA Attributes

```typescript
// Error state
<Textarea
  aria-invalid={hasError}
  aria-describedby="error-message"
  state={hasError ? 'negative' : undefined}
/>

// Required field
<Textarea
  aria-required="true"
  required
  label="Required Field"
  requiredLabel="*"
/>

// With description
<Textarea
  aria-describedby="help-text"
  label="Description"
/>
<span id="help-text">Provide detailed information</span>
```

### Screen Reader Support

- Label association is automatic through Label component
- Announces required state
- Reads placeholder text
- Announces character limits

### Focus Management

- Visible focus ring on keyboard navigation
- Maintains focus during value changes
- Auto-scrolls to cursor position

## Styling

### Custom Styles

```typescript
<Textarea
  className="custom-textarea font-mono text-sm"
  style={{ minHeight: '200px' }}
/>
```

### CSS Variables

```css
/* Custom theme variables */
[data-theme="custom"] {
  --textarea-bg: #your-background;
  --textarea-border: #your-border;
  --textarea-text: #your-text;
  --textarea-placeholder: #your-placeholder;
  --textarea-focus: #your-focus-color;
  --textarea-error: #your-error-color;
}
```

### State Styling

```css
/* Negative state */
.textarea-negative {
  border-color: var(--color-negative);
  caret-color: var(--color-negative);
}

/* Disabled state */
.textarea:disabled {
  background: var(--color-disabled);
  cursor: not-allowed;
}
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 2.2kb |
| First render | <8ms |
| Re-render | <3ms |
| Auto-resize | <2ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Use `React.memo()` for parent components with frequent re-renders
2. Debounce onChange for expensive operations
3. Use `useCallback` for event handlers
4. Consider virtual scrolling for very long content
5. Lazy load preview/formatting features

## Migration

### From v1.0.x

```diff
// Import path changed
- import Textarea from 'torch-glare/Textarea'
+ import { Textarea } from 'torch-glare/lib/components/Textarea'

// Label integration
- <div>
-   <label>Comments</label>
-   <Textarea />
- </div>
+ <Textarea
+   label="Comments"
+ />
```

## Troubleshooting

### Auto-resize not working

**Solution:** Check CSS field-sizing support

```css
/* Fallback for browsers without field-sizing support */
.textarea {
  field-sizing: content;
  /* Fallback */
  min-height: 100px;
  resize: vertical;
}
```

### Label not associated

**Solution:** Label is automatically associated via Label component

```typescript
// ✅ Correct - automatic association
<Textarea label="Description" />

// Alternative manual association
<label htmlFor="desc">Description</label>
<Textarea id="desc" />
```

### Character limit not enforced

**Solution:** HTML maxLength is a soft limit, add validation

```typescript
const [value, setValue] = useState('')
const maxLength = 500

<Textarea
  value={value}
  onChange={(e) => {
    if (e.target.value.length <= maxLength) {
      setValue(e.target.value)
    }
  }}
  maxLength={maxLength}
/>
```

## Related Components

- [Input](/docs/components/input.md) - Single-line text input
- [InputField](/docs/components/input-field.md) - Enhanced input with extras
- [Label](/docs/components/label.md) - Form field labeling
- [Form](/docs/components/form.md) - Form wrapper with validation

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

Note: `field-sizing: content` has limited support. Component includes fallbacks.

## Changelog

### v1.1.15
- Added auto-resize with field-sizing
- Improved label integration
- Enhanced TypeScript types

### v1.1.14
- Added state variants
- Fixed focus styles
- Performance optimizations

### v1.1.0
- Initial stable release