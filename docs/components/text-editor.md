---
name: TextEditor
version: 1.1.15
status: stable
category: components/editors
tags: [editor, rich-text, block-editor, editorjs, markdown, rtl, accessible]
last-reviewed: 2024-11-05
bundle-size: 45kb
dependencies:
  - "@editorjs/editorjs": "^2.28.0"
  - "@editorjs/header": "^2.8.0"
  - "@editorjs/list": "^1.9.0"
  - "@editorjs/nested-list": "^1.4.0"
  - "@editorjs/checklist": "^1.6.0"
  - "@editorjs/quote": "^2.6.0"
  - "@editorjs/warning": "^1.4.0"
  - "@editorjs/code": "^2.9.0"
  - "@editorjs/delimiter": "^1.4.0"
  - "@editorjs/embed": "^2.7.0"
  - "@editorjs/table": "^2.3.0"
  - "@editorjs/link": "^2.6.0"
  - "@editorjs/simple-image": "^1.6.0"
  - "@editorjs/raw": "^2.5.0"
  - "@editorjs/marker": "^1.4.0"
  - "@editorjs/inline-code": "^1.5.0"
  - "@editorjs/underline": "^1.1.0"
  - "@editorjs/text-variant-tune": "^1.0.0"
  - "class-variance-authority": "^0.7.0"
---

# TextEditor

> A feature-rich block-style text editor built on Editor.js with 18+ block tools, automatic RTL/LTR detection, markdown paste support, dark mode theming, and imperative ref methods for programmatic control.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { TextEditor } from 'torch-glare/lib/components/TextEditor'
// or
import { TextEditor } from 'torch-glare/lib/components'
```

## Quick Examples

### Basic Usage

```typescript
import { TextEditor } from 'torch-glare/lib/components/TextEditor'

function Example() {
  return (
    <TextEditor
      placeholder="Start writing..."
      onChange={(data) => console.log(data)}
    />
  )
}
```

### With Initial Data

```typescript
import { TextEditor } from 'torch-glare/lib/components/TextEditor'
import type { OutputData } from '@editorjs/editorjs'

function Example() {
  const initialData: OutputData = {
    time: Date.now(),
    blocks: [
      {
        type: 'header',
        data: { text: 'Welcome', level: 2 }
      },
      {
        type: 'paragraph',
        data: { text: 'Start editing this document.' }
      }
    ]
  }

  return (
    <TextEditor
      data={initialData}
      onChange={(data) => console.log('Saved:', data)}
    />
  )
}
```

### Controlled with Ref

```typescript
import { useRef } from 'react'
import { TextEditor, TextEditorRef } from 'torch-glare/lib/components/TextEditor'

function EditorWithControls() {
  const editorRef = useRef<TextEditorRef>(null)

  const handleSave = async () => {
    if (editorRef.current) {
      const data = await editorRef.current.save()
      console.log('Editor content:', data)
    }
  }

  const handleClear = () => {
    editorRef.current?.clear()
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleClear}>Clear</button>
      </div>
      <TextEditor ref={editorRef} size="L" />
    </div>
  )
}
```

### Different Sizes

```typescript
<TextEditor size="S" placeholder="Small editor (200px)" />
<TextEditor size="M" placeholder="Medium editor (300px)" />
<TextEditor size="L" placeholder="Large editor (400px)" />
<TextEditor size="XL" placeholder="Extra large editor (500px)" />
```

### Custom Min Height

```typescript
<TextEditor
  minHeight={600}
  placeholder="Custom height editor"
/>
```

### Read-Only Mode

```typescript
function ReadOnlyEditor({ content }: { content: OutputData }) {
  return (
    <TextEditor
      data={content}
      readOnly={true}
      size="L"
    />
  )
}
```

### With Theme Override

```typescript
<TextEditor theme="dark" size="M" placeholder="Dark theme editor" />
<TextEditor theme="light" size="M" placeholder="Light theme editor" />
```

### Disabled State

```typescript
<TextEditor
  disabled
  data={someData}
  size="M"
/>
```

### Custom Tools Override

```typescript
import Header from '@editorjs/header'
import List from '@editorjs/list'

function MinimalEditor() {
  const customTools = {
    header: {
      class: Header,
      inlineToolbar: true,
      config: { levels: [2, 3], defaultLevel: 2 }
    },
    list: {
      class: List,
      inlineToolbar: true
    }
  }

  return (
    <TextEditor
      tools={customTools}
      placeholder="Only headers and lists allowed"
    />
  )
}
```

### With onReady Callback

```typescript
function EditorWithReadyState() {
  const [isReady, setIsReady] = useState(false)

  return (
    <div>
      {!isReady && <div>Loading editor...</div>}
      <TextEditor
        onReady={() => setIsReady(true)}
        placeholder="Editor loads asynchronously"
      />
    </div>
  )
}
```

### Markdown Paste Support

```typescript
function MarkdownEditor() {
  return (
    <TextEditor
      size="L"
      placeholder="Try pasting markdown content here..."
      onChange={(data) => console.log(data)}
    />
  )
}
// Pasting markdown like "# Heading\n- item 1\n- item 2" will
// auto-convert to Editor.js header and list blocks.
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'PresentationStyle'` | `'PresentationStyle'` | Visual style variant |
| `size` | `'S' \| 'M' \| 'L' \| 'XL'` | - | Size preset controlling min-height and padding |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Override theme for this component |
| `data` | `OutputData` | - | Initial editor content (Editor.js OutputData format) |
| `onChange` | `(data: OutputData) => void` | - | Called when content changes (debounced) |
| `onReady` | `() => void` | - | Called when editor finishes initialization |
| `readOnly` | `boolean` | `false` | Makes the editor non-editable |
| `placeholder` | `string` | `'Write something or press / to select a tool'` | Placeholder text for empty editor |
| `autofocus` | `boolean` | `false` | Auto-focus the editor on mount |
| `tools` | `Record<string, any>` | Default 18+ tools | Override the Editor.js tools configuration |
| `minHeight` | `number` | - | Custom min-height in pixels (overrides size) |
| `disabled` | `boolean` | `false` | Disables interaction with reduced opacity |
| `className` | `string` | - | Additional CSS classes |

### Ref Methods (TextEditorRef)

| Method | Signature | Description |
|--------|-----------|-------------|
| `save` | `() => Promise<OutputData>` | Saves and returns the current editor content |
| `clear` | `() => void` | Clears all editor content |
| `render` | `(data: OutputData) => Promise<void>` | Renders the provided data into the editor |
| `focus` | `(atEnd?: boolean) => boolean` | Focuses the editor; optionally at the end of content |
| `getInstance` | `() => EditorJS \| null` | Returns the raw Editor.js instance |

### Size Variants

| Size | Min Height | Padding |
|------|-----------|---------|
| S | 200px | 8px (p-2) |
| M | 300px | 12px (p-3) |
| L | 400px | 16px (p-4) |
| XL | 500px | 20px (p-5) |

### Default Block Tools

| Tool | Shortcut | Description |
|------|----------|-------------|
| Header | `Cmd+Shift+H` | H1-H6 headings |
| List | `Cmd+Shift+L` | Ordered/unordered lists |
| NestedList | - | Multi-level nested lists |
| Checklist | - | Interactive checkboxes |
| Quote | `Cmd+Shift+O` | Block quotes with caption |
| Warning | - | Warning/notice blocks |
| Code | `Cmd+Shift+C` | Code snippets |
| Delimiter | - | Horizontal divider |
| Embed | - | YouTube, Vimeo, CodePen, Twitter, Instagram, GitHub |
| Table | `Cmd+Alt+T` | Data tables (default 2x3) |
| LinkTool | - | Link previews |
| SimpleImage | - | Image blocks via URL |
| Raw | - | Raw HTML blocks |
| Chart | - | Interactive chart blocks (bar, line, pie, doughnut, radar, polar) |
| Marker | `Cmd+Shift+M` | Inline text highlighting |
| InlineCode | `Cmd+Shift+I` | Inline code formatting |
| Underline | - | Inline underline formatting |
| TextVariant | - | Block-level text tune (callout, citation, details) |

### TypeScript

```typescript
import { HTMLAttributes } from 'react'
import { VariantProps } from 'class-variance-authority'
import { OutputData } from '@editorjs/editorjs'

type Themes = 'light' | 'dark' | 'default'

export interface TextEditorRef {
  save: () => Promise<OutputData>
  clear: () => void
  render: (data: OutputData) => Promise<void>
  focus: (atEnd?: boolean) => boolean
  getInstance: () => EditorJS | null
}

interface TextEditorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof textEditorStyles> {
  theme?: Themes
  data?: OutputData
  onChange?: (data: OutputData) => void
  onReady?: () => void
  readOnly?: boolean
  placeholder?: string
  autofocus?: boolean
  tools?: Record<string, any>
  minHeight?: number
}

export const TextEditor: React.ForwardRefExoticComponent<
  TextEditorProps & React.RefAttributes<TextEditorRef>
>

export type { TextEditorProps, OutputData }
```

## Common Patterns

### Blog Post Editor

```typescript
import { useRef, useState } from 'react'
import { TextEditor, TextEditorRef } from 'torch-glare/lib/components/TextEditor'
import { Button } from 'torch-glare/lib/components/Button'
import type { OutputData } from '@editorjs/editorjs'

function BlogPostEditor() {
  const editorRef = useRef<TextEditorRef>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handlePublish = async () => {
    if (!editorRef.current) return
    setIsSaving(true)

    try {
      const content = await editorRef.current.save()
      await publishPost(content)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <TextEditor
        ref={editorRef}
        size="XL"
        autofocus
        placeholder="Write your blog post..."
        onChange={(data) => autoSaveDraft(data)}
      />
      <div className="mt-4 flex justify-end">
        <Button
          variant="PrimeStyle"
          is_loading={isSaving}
          onClick={handlePublish}
        >
          Publish
        </Button>
      </div>
    </div>
  )
}
```

### Preview Mode Toggle

```typescript
function EditorWithPreview() {
  const editorRef = useRef<TextEditorRef>(null)
  const [readOnly, setReadOnly] = useState(false)

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button
          variant={readOnly ? 'BorderStyle' : 'PrimeStyle'}
          onClick={() => setReadOnly(false)}
        >
          Edit
        </Button>
        <Button
          variant={readOnly ? 'PrimeStyle' : 'BorderStyle'}
          onClick={() => setReadOnly(true)}
        >
          Preview
        </Button>
      </div>
      <TextEditor
        ref={editorRef}
        readOnly={readOnly}
        size="L"
      />
    </div>
  )
}
```

### Load and Render Saved Content

```typescript
function DocumentViewer({ documentId }: { documentId: string }) {
  const editorRef = useRef<TextEditorRef>(null)

  useEffect(() => {
    async function loadDocument() {
      const data = await fetchDocument(documentId)
      await editorRef.current?.render(data)
    }
    loadDocument()
  }, [documentId])

  return (
    <TextEditor
      ref={editorRef}
      readOnly
      size="XL"
    />
  )
}
```

### Form Integration

```typescript
import { useForm, Controller } from 'react-hook-form'

function ArticleForm() {
  const { control, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <TextEditor
            data={field.value}
            onChange={field.onChange}
            size="L"
            placeholder="Article content..."
          />
        )}
      />
      <Button type="submit" variant="PrimeStyle">
        Save Article
      </Button>
    </form>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { TextEditor, TextEditorRef } from 'torch-glare/lib/components/TextEditor'

describe('TextEditor', () => {
  it('renders the editor container', () => {
    const { container } = render(
      <TextEditor size="M" />
    )

    expect(container.querySelector('.torch-text-editor')).toBeInTheDocument()
  })

  it('applies size class', () => {
    const { container } = render(
      <TextEditor size="L" />
    )

    const editor = container.querySelector('.torch-text-editor')
    expect(editor).toHaveClass('min-h-[400px]')
  })

  it('applies disabled state', () => {
    const { container } = render(
      <TextEditor disabled />
    )

    const editor = container.querySelector('.torch-text-editor')
    expect(editor).toHaveClass('cursor-not-allowed', 'pointer-events-none')
  })

  it('calls onReady when editor initializes', async () => {
    const onReady = jest.fn()
    render(<TextEditor onReady={onReady} />)

    await waitFor(() => {
      expect(onReady).toHaveBeenCalledTimes(1)
    })
  })

  it('exposes ref methods', async () => {
    const ref = React.createRef<TextEditorRef>()
    render(<TextEditor ref={ref} />)

    await waitFor(() => {
      expect(ref.current).toBeDefined()
      expect(ref.current?.save).toBeDefined()
      expect(ref.current?.clear).toBeDefined()
      expect(ref.current?.render).toBeDefined()
      expect(ref.current?.focus).toBeDefined()
      expect(ref.current?.getInstance).toBeDefined()
    })
  })
})
```

## Accessibility

### Keyboard Support

- **Tab**: Navigate between block tools and editor content
- **Enter**: Create new block
- **/**: Open block tool selector (slash command)
- **Cmd+Shift+H**: Insert header
- **Cmd+Shift+L**: Insert list
- **Cmd+Shift+O**: Insert quote
- **Cmd+Shift+C**: Insert code block
- **Cmd+Alt+T**: Insert table
- **Cmd+Shift+M**: Apply marker highlight
- **Cmd+Shift+I**: Apply inline code

### ARIA Attributes

The TextEditor renders semantic HTML through Editor.js:

```html
<div
  data-theme="dark"
  class="torch-text-editor"
  spellcheck="false"
  translate="no"
>
  <div id="torch-editor-xxxxx">
    <!-- Editor.js renders accessible content blocks -->
  </div>
</div>
```

### RTL/LTR Support

- Automatic per-block direction detection based on first visible character
- Supports Arabic, Hebrew, Farsi, and other RTL scripts
- List bullets and checkboxes flip correctly in RTL mode
- Mixed-direction documents supported (each block detects independently)

### Screen Reader Support

- Editor.js blocks render as semantic HTML (headings, lists, paragraphs)
- Block tools accessible via keyboard navigation
- Inline toolbar supports keyboard shortcuts

## Styling

### Custom Styles with className

```typescript
<TextEditor
  className="shadow-lg border border-gray-200 rounded-lg"
  size="L"
/>
```

### Theme Customization

```css
/* Custom theme variables */
[data-theme="custom"] .torch-text-editor {
  --color-background: #your-bg;
  --color-text-primary: #your-text;
  --color-border: #your-border;
}
```

### Dark Mode

The TextEditor includes comprehensive dark mode CSS variable overrides for:

- Editor.js core popover menus
- Inline toolbar
- Table plugin cells, borders, and toolbox
- Search fields in popovers
- Chart block tool elements
- Scrollbar styling

Dark mode activates automatically via `data-theme="dark"` on the component or a parent element.

### Design Token Classes

The PresentationStyle variant maps to the following design tokens:

- Background: `bg-background-presentation-form-field-primary`
- Text: `text-content-presentation-global-primary`
- Selection: `bg-background-presentation-action-hover`
- Marker: `bg-background-presentation-state-warning-primary`
- Toolbar: `text-content-presentation-action-light-primary`
- Popover: `bg-background-presentation-form-field-primary`
- Code: `bg-background-presentation-action-secondary`

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | ~45kb (with all tools) |
| First render | ~50ms |
| onChange debounce | 500ms + requestIdleCallback |
| Tree-shakeable | Partially (tools are bundled) |

### Optimization Tips

1. Use `tools` prop to include only needed block tools for smaller bundles
2. The `onChange` callback is debounced (500ms) and deferred to idle time via `requestIdleCallback`
3. Auto-direction uses `requestAnimationFrame` batching to avoid layout thrashing
4. Markdown paste uses a single `render()` call instead of per-block insertion
5. MutationObserver watches only direct children of the redactor (not full subtree)

## Troubleshooting

### Common Issues

#### Editor not initializing

**Solution:** Ensure the component is mounted in a client component with `"use client"` directive. TextEditor requires browser APIs.

```typescript
"use client"

import { TextEditor } from 'torch-glare/lib/components/TextEditor'

export default function Page() {
  return <TextEditor />
}
```

#### onChange fires too frequently

**Solution:** The onChange is already debounced at 500ms + `requestIdleCallback`. For additional throttling, wrap your handler:

```typescript
const debouncedSave = useMemo(
  () => debounce((data: OutputData) => saveToServer(data), 2000),
  []
)

<TextEditor onChange={debouncedSave} />
```

#### RTL text not detected

**Solution:** The auto-direction detects RTL based on the first visible character. If your text starts with LTR characters (numbers, punctuation), the block will be LTR. Start with an RTL character for correct detection.

#### Tailwind resets strip heading styles

**Solution:** The TextEditor injects heading styles automatically via an internal stylesheet that restores h1-h6 sizing within the `.torch-text-editor` container. No additional configuration needed.

## Related Components

- [Input](/docs/components/input.md) - Single-line text input
- [Textarea](/docs/components/textarea.md) - Multi-line plain text input
- [Form](/docs/components/form.md) - Form wrapper for validation

## Browser Support

- Chrome 90+ (requestIdleCallback supported)
- Firefox 88+ (requestIdleCallback supported)
- Safari 14+ (fallback to setTimeout for requestIdleCallback)
- Edge 90+
- Mobile browsers (touch-friendly block controls)

## Changelog

### v1.1.15
- Added ChartBlockTool for interactive chart creation
- Added markdown paste support with auto-conversion
- Added auto RTL/LTR detection per block
- Comprehensive dark mode CSS variable overrides
- Debounced onChange with requestIdleCallback scheduling
- Performance-optimized MutationObserver for direction tracking

### v1.1.0
- Initial stable release with 18 block tools
- PresentationStyle variant
- 4 size presets
- Imperative ref API
