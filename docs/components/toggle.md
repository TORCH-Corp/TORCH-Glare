---
name: Toggle
version: 1.1.15
status: stable
category: components/forms
tags: [form, toggle, button, radix-ui, accessible, variants]
last-reviewed: 2024-11-05
bundle-size: 2.4kb
dependencies:
  - "@radix-ui/react-toggle": "^1.0.0"
  - "class-variance-authority": "^0.7.0"
---

# Toggle

> A versatile toggle button component built on Radix UI primitives with multiple style variants and sizes. Perfect for toolbar actions, view toggles, formatting options, and any binary state that requires a button-style interaction.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { Toggle } from 'torch-glare/lib/components/Toggle'
```

## Quick Examples

### Basic Usage

```typescript
import { Toggle } from 'torch-glare/lib/components/Toggle'

function Example() {
  const [pressed, setPressed] = useState(false)

  return (
    <Toggle
      pressed={pressed}
      onPressedChange={setPressed}
    >
      <BoldIcon className="w-4 h-4" />
    </Toggle>
  )
}
```

### Text Formatting Toolbar

```typescript
function FormattingToolbar() {
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    strike: false
  })

  const toggleFormat = (format: keyof typeof formatting) => {
    setFormatting(prev => ({ ...prev, [format]: !prev[format] }))
  }

  return (
    <div className="flex gap-1 p-2 border rounded">
      <Toggle
        pressed={formatting.bold}
        onPressedChange={() => toggleFormat('bold')}
        aria-label="Bold"
      >
        <i className="ri-bold" />
      </Toggle>

      <Toggle
        pressed={formatting.italic}
        onPressedChange={() => toggleFormat('italic')}
        aria-label="Italic"
      >
        <i className="ri-italic" />
      </Toggle>

      <Toggle
        pressed={formatting.underline}
        onPressedChange={() => toggleFormat('underline')}
        aria-label="Underline"
      >
        <i className="ri-underline" />
      </Toggle>

      <Toggle
        pressed={formatting.strike}
        onPressedChange={() => toggleFormat('strike')}
        aria-label="Strikethrough"
      >
        <i className="ri-strikethrough" />
      </Toggle>
    </div>
  )
}
```

### View Toggle

```typescript
function ViewToggle() {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  return (
    <div className="flex gap-1">
      <Toggle
        pressed={view === 'grid'}
        onPressedChange={() => setView('grid')}
        aria-label="Grid view"
      >
        <GridIcon className="w-4 h-4" />
      </Toggle>

      <Toggle
        pressed={view === 'list'}
        onPressedChange={() => setView('list')}
        aria-label="List view"
      >
        <ListIcon className="w-4 h-4" />
      </Toggle>
    </div>
  )
}
```

### Different Variants

```typescript
function VariantExamples() {
  const [selected, setSelected] = useState('')

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Toggle variant="PrimeStyle">Prime</Toggle>
        <Toggle variant="BlueSecStyle">Blue</Toggle>
        <Toggle variant="YelSecStyle">Yellow</Toggle>
        <Toggle variant="RedSecStyle">Red</Toggle>
      </div>

      <div className="flex gap-2">
        <Toggle variant="BorderStyle">Border</Toggle>
        <Toggle variant="PrimeContStyle">Prime Cont</Toggle>
        <Toggle variant="BlueContStyle">Blue Cont</Toggle>
        <Toggle variant="RedContStyle">Red Cont</Toggle>
      </div>
    </div>
  )
}
```

### Different Sizes

```typescript
function SizeVariants() {
  return (
    <div className="flex items-center gap-3">
      <Toggle size="S">
        <i className="ri-heart-line" />
      </Toggle>

      <Toggle size="M">
        <i className="ri-heart-line" />
      </Toggle>

      <Toggle size="L">
        <i className="ri-heart-line" />
      </Toggle>

      <Toggle size="XL">
        <i className="ri-heart-line" />
      </Toggle>
    </div>
  )
}
```

### Alignment Toolbar

```typescript
function AlignmentToolbar() {
  const [alignment, setAlignment] = useState('left')

  const options = [
    { value: 'left', icon: 'ri-align-left' },
    { value: 'center', icon: 'ri-align-center' },
    { value: 'right', icon: 'ri-align-right' },
    { value: 'justify', icon: 'ri-align-justify' }
  ]

  return (
    <div className="flex gap-1 p-2 border rounded">
      {options.map(option => (
        <Toggle
          key={option.value}
          pressed={alignment === option.value}
          onPressedChange={() => setAlignment(option.value)}
          aria-label={`Align ${option.value}`}
        >
          <i className={option.icon} />
        </Toggle>
      ))}
    </div>
  )
}
```

### Media Controls

```typescript
function MediaControls() {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [loop, setLoop] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Toggle
        size="L"
        variant="PrimeStyle"
        pressed={playing}
        onPressedChange={setPlaying}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        <i className={playing ? 'ri-pause-fill' : 'ri-play-fill'} />
      </Toggle>

      <Toggle
        size="M"
        variant="BorderStyle"
        pressed={muted}
        onPressedChange={setMuted}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        <i className={muted ? 'ri-volume-mute-fill' : 'ri-volume-up-fill'} />
      </Toggle>

      <Toggle
        size="M"
        variant="BorderStyle"
        pressed={loop}
        onPressedChange={setLoop}
        aria-label="Loop"
      >
        <i className="ri-loop-left-line" />
      </Toggle>
    </div>
  )
}
```

### Filter Options

```typescript
function FilterToggles() {
  const [filters, setFilters] = useState({
    inStock: false,
    onSale: false,
    newArrivals: false,
    featured: false
  })

  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [filter]: !prev[filter] }))
  }

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">Filters</h4>
      <div className="flex flex-wrap gap-2">
        <Toggle
          variant="BlueSecStyle"
          pressed={filters.inStock}
          onPressedChange={() => toggleFilter('inStock')}
        >
          In Stock
        </Toggle>

        <Toggle
          variant="YelSecStyle"
          pressed={filters.onSale}
          onPressedChange={() => toggleFilter('onSale')}
        >
          On Sale
        </Toggle>

        <Toggle
          variant="PrimeStyle"
          pressed={filters.newArrivals}
          onPressedChange={() => toggleFilter('newArrivals')}
        >
          New Arrivals
        </Toggle>

        <Toggle
          variant="RedSecStyle"
          pressed={filters.featured}
          onPressedChange={() => toggleFilter('featured')}
        >
          Featured
        </Toggle>
      </div>
    </div>
  )
}
```

### Disabled State

```typescript
function DisabledToggles() {
  return (
    <div className="flex gap-2">
      <Toggle disabled>
        Disabled Off
      </Toggle>

      <Toggle disabled pressed>
        Disabled On
      </Toggle>
    </div>
  )
}
```

## API Reference

### Toggle Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pressed` | `boolean` | - | Controlled pressed state |
| `defaultPressed` | `boolean` | `false` | Uncontrolled default state |
| `onPressedChange` | `(pressed: boolean) => void` | - | Called when state changes |
| `variant` | `VariantType` | `'PrimeStyle'` | Visual style variant |
| `size` | `'S' \| 'M' \| 'L' \| 'XL'` | `'M'` | Size variant |
| `disabled` | `boolean` | `false` | Disables the toggle |
| `asChild` | `boolean` | `false` | Render as child element |
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | - | Toggle content |

### Variant Types

```typescript
type VariantType =
  | 'PrimeStyle'
  | 'BlueSecStyle'
  | 'YelSecStyle'
  | 'RedSecStyle'
  | 'BorderStyle'
  | 'PrimeContStyle'
  | 'BlueContStyle'
  | 'RedContStyle'
```

### TypeScript

```typescript
import { ToggleProps } from '@radix-ui/react-toggle'
import { VariantProps } from 'class-variance-authority'

interface CustomToggleProps extends ToggleProps, VariantProps<typeof toggleVariants> {
  variant?: VariantType
  size?: 'S' | 'M' | 'L' | 'XL'
}

export const Toggle: React.ForwardRefExoticComponent<CustomToggleProps>
```

## Common Patterns

### Toolbar Group

```typescript
function EditorToolbar() {
  const [styles, setStyles] = useState({
    bold: false,
    italic: false,
    underline: false
  })

  const [alignment, setAlignment] = useState('left')
  const [lists, setLists] = useState<string | null>(null)

  return (
    <div className="flex items-center gap-3 p-2 border-b">
      {/* Text Styles */}
      <div className="flex gap-1">
        {Object.entries(styles).map(([style, active]) => (
          <Toggle
            key={style}
            size="S"
            pressed={active}
            onPressedChange={(pressed) =>
              setStyles(prev => ({ ...prev, [style]: pressed }))
            }
          >
            <i className={`ri-${style}`} />
          </Toggle>
        ))}
      </div>

      <div className="w-px h-6 bg-gray-300" />

      {/* Alignment */}
      <div className="flex gap-1">
        {['left', 'center', 'right', 'justify'].map(align => (
          <Toggle
            key={align}
            size="S"
            pressed={alignment === align}
            onPressedChange={() => setAlignment(align)}
          >
            <i className={`ri-align-${align}`} />
          </Toggle>
        ))}
      </div>

      <div className="w-px h-6 bg-gray-300" />

      {/* Lists */}
      <div className="flex gap-1">
        <Toggle
          size="S"
          pressed={lists === 'bullet'}
          onPressedChange={() => setLists(lists === 'bullet' ? null : 'bullet')}
        >
          <i className="ri-list-unordered" />
        </Toggle>
        <Toggle
          size="S"
          pressed={lists === 'number'}
          onPressedChange={() => setLists(lists === 'number' ? null : 'number')}
        >
          <i className="ri-list-ordered" />
        </Toggle>
      </div>
    </div>
  )
}
```

### Favorite Toggle

```typescript
function FavoriteButton({ itemId }: { itemId: string }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toggleFavorite = async () => {
    setIsLoading(true)
    try {
      // API call to toggle favorite
      await toggleFavoriteAPI(itemId)
      setIsFavorite(!isFavorite)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Toggle
      variant={isFavorite ? 'RedSecStyle' : 'BorderStyle'}
      pressed={isFavorite}
      onPressedChange={toggleFavorite}
      disabled={isLoading}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <i className={isFavorite ? 'ri-heart-fill' : 'ri-heart-line'} />
    </Toggle>
  )
}
```

### Theme Switcher

```typescript
function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <Toggle
      size="L"
      variant="BorderStyle"
      pressed={theme === 'dark'}
      onPressedChange={(pressed) => setTheme(pressed ? 'dark' : 'light')}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <i className={theme === 'dark' ? 'ri-moon-fill' : 'ri-sun-line'} />
    </Toggle>
  )
}
```

### Settings Panel

```typescript
function SettingsToggles() {
  const [settings, setSettings] = useState({
    notifications: true,
    sounds: false,
    vibration: true,
    autoUpdate: false
  })

  const icons = {
    notifications: 'ri-notification-line',
    sounds: 'ri-volume-up-line',
    vibration: 'ri-smartphone-line',
    autoUpdate: 'ri-download-line'
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {Object.entries(settings).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <label className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
          <Toggle
            size="S"
            variant="BlueSecStyle"
            pressed={value}
            onPressedChange={(pressed) =>
              setSettings(prev => ({ ...prev, [key]: pressed }))
            }
          >
            <i className={icons[key as keyof typeof icons]} />
          </Toggle>
        </div>
      ))}
    </div>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Toggle } from 'torch-glare/lib/components/Toggle'

describe('Toggle', () => {
  it('toggles pressed state on click', () => {
    const handleChange = jest.fn()
    render(
      <Toggle onPressedChange={handleChange}>
        Toggle
      </Toggle>
    )

    const toggle = screen.getByRole('button')
    fireEvent.click(toggle)

    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('applies variant styles', () => {
    const { container } = render(
      <Toggle variant="BlueSecStyle">Blue</Toggle>
    )

    const toggle = container.querySelector('button')
    expect(toggle).toHaveClass('hover:bg-background-presentation-state-information-primary')
  })

  it('respects size prop', () => {
    const { container } = render(
      <Toggle size="XL">Large</Toggle>
    )

    const toggle = container.querySelector('button')
    expect(toggle).toHaveClass('h-[40px]', 'w-[40px]')
  })

  it('shows pressed state', () => {
    render(<Toggle pressed>Pressed</Toggle>)

    const toggle = screen.getByRole('button')
    expect(toggle).toHaveAttribute('data-state', 'on')
  })

  it('handles disabled state', () => {
    const handleChange = jest.fn()
    render(
      <Toggle disabled onPressedChange={handleChange}>
        Disabled
      </Toggle>
    )

    const toggle = screen.getByRole('button')
    fireEvent.click(toggle)

    expect(handleChange).not.toHaveBeenCalled()
    expect(toggle).toHaveClass('cursor-not-allowed')
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('Toggle meets WCAG standards', async () => {
  const { container } = render(
    <Toggle aria-label="Toggle feature">
      <i className="ri-star-line" />
    </Toggle>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Keyboard Support

- **Space**: Toggle pressed state when focused
- **Enter**: Toggle pressed state
- **Tab**: Move focus to/from toggle

### ARIA Attributes

Radix UI automatically provides:

```html
<!-- Unpressed -->
<button
  role="button"
  aria-pressed="false"
  data-state="off"
/>

<!-- Pressed -->
<button
  role="button"
  aria-pressed="true"
  data-state="on"
/>
```

### Screen Reader Support

- Announces toggle button role
- Communicates pressed state
- Reads aria-label or content
- Announces state changes

### Best Practices

```typescript
// Always provide aria-label for icon-only toggles
<Toggle aria-label="Bold text">
  <BoldIcon />
</Toggle>

// Or include screen-reader text
<Toggle>
  <BoldIcon />
  <span className="sr-only">Bold</span>
</Toggle>
```

## Styling

### Variant Styles

Each variant provides different visual styles:

- **PrimeStyle**: Default primary style
- **BlueSecStyle**: Blue secondary style
- **YelSecStyle**: Yellow secondary style
- **RedSecStyle**: Red secondary style
- **BorderStyle**: Border-focused style
- **PrimeContStyle**: Primary container style
- **BlueContStyle**: Blue container style
- **RedContStyle**: Red container style

### Size Classes

| Size | Dimensions | Typography | Icon Size |
|------|------------|------------|-----------|
| S | 22×22px | Small | 12px |
| M | 28×28px | Large | 18px |
| L | 34×34px | Large | 20px |
| XL | 40×40px | Headers | 22px |

### Custom Styles

```typescript
<Toggle
  className="custom-toggle rounded-full"
  size="L"
  variant="PrimeStyle"
/>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 2.4kb |
| First render | <5ms |
| Re-render | <2ms |
| Interaction | <1ms |
| Tree-shakeable | ✅ |

### Optimization Tips

1. Use uncontrolled mode with `defaultPressed` when possible
2. Memoize toggle groups with React.memo
3. Use single state object for multiple toggles
4. Avoid recreating event handlers

## Migration

### From Button

```diff
// From button with active state
- <button
-   className={isActive ? 'bg-blue-500' : 'bg-gray-200'}
-   onClick={() => setIsActive(!isActive)}
- >
-   Icon
- </button>

// To Toggle
+ <Toggle
+   pressed={isActive}
+   onPressedChange={setIsActive}
+ >
+   Icon
+ </Toggle>
```

### From Custom Toggle

```diff
// From custom implementation
- <div
-   className={`toggle ${toggled ? 'active' : ''}`}
-   onClick={() => setToggled(!toggled)}
- />

// To Toggle component
+ <Toggle
+   pressed={toggled}
+   onPressedChange={setToggled}
+ />
```

## Troubleshooting

### Toggle not changing state

**Solution:** Use controlled or uncontrolled mode properly

```typescript
// Controlled
<Toggle pressed={value} onPressedChange={setValue} />

// Uncontrolled
<Toggle defaultPressed />
```

### Icons not sizing correctly

**Solution:** Use the icon class utilities

```typescript
<Toggle size="L">
  <i className="ri-heart-line" />
  {/* Icon size handled by component */}
</Toggle>
```

## Related Components

- [Switch](/docs/components/switch.md) - For on/off states
- [Button](/docs/components/button.md) - For actions
- [Checkbox](/docs/components/checkbox.md) - For selections
- [Radio](/docs/components/radio.md) - For single choice

## Browser Support

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

## Changelog

### v1.1.15
- Migrated to Radix UI Toggle primitive
- Added 8 style variants
- Added 4 size variants
- Improved accessibility

### v1.1.14
- Enhanced visual styles
- Fixed focus management

### v1.1.0
- Initial stable release