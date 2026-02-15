---
name: ToggleButton
version: 1.1.15
status: stable
category: components/buttons
tags: [toggle, button, pressed, radix-ui, accessible, variants]
last-reviewed: 2024-11-05
bundle-size: 2.6kb
dependencies:
  - "@radix-ui/react-toggle": "^1.0.0"
  - "class-variance-authority": "^0.7.0"
---

# ToggleButton

> A standalone toggle button component built on Radix UI Toggle with five visual variants, four sizes, and an icon-only mode. Renders as a two-state button with `data-[state=on]` active styling. Ideal for toolbar actions, feature toggles, and any on/off interaction.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { ToggleButton } from 'torch-glare/lib/components/ToggleButton'
// or
import { ToggleButton } from 'torch-glare/lib/components'

// Also available via ButtonGroup re-export
import { ToggleButton } from 'torch-glare/lib/components/ButtonGroup'
```

## Quick Examples

### Basic Usage

```typescript
import { ToggleButton } from 'torch-glare/lib/components/ToggleButton'

function Example() {
  const [pressed, setPressed] = useState(false)

  return (
    <ToggleButton
      pressed={pressed}
      onPressedChange={setPressed}
    >
      <i className="ri-bold" />
    </ToggleButton>
  )
}
```

### All Variants

```typescript
<ToggleButton variant="PrimeStyle">Prime</ToggleButton>
<ToggleButton variant="BlueSecStyle">Blue Secondary</ToggleButton>
<ToggleButton variant="BorderStyle">Border</ToggleButton>
<ToggleButton variant="PrimeContStyle">Prime Container</ToggleButton>
<ToggleButton variant="SystemStyle">System</ToggleButton>
```

### With Sizes

```typescript
<ToggleButton size="S">Small</ToggleButton>
<ToggleButton size="M">Medium (Default)</ToggleButton>
<ToggleButton size="L">Large</ToggleButton>
<ToggleButton size="XL">Extra Large</ToggleButton>
```

### Icon-Only Mode

```typescript
// Icon mode makes the button square (equal width and height)
<ToggleButton buttonType="icon" size="S" aria-label="Favorite">
  <i className="ri-heart-line" />
</ToggleButton>

<ToggleButton buttonType="icon" size="M" aria-label="Bookmark">
  <i className="ri-bookmark-line" />
</ToggleButton>

<ToggleButton buttonType="icon" size="L" aria-label="Star">
  <i className="ri-star-line" />
</ToggleButton>

<ToggleButton buttonType="icon" size="XL" aria-label="Pin">
  <i className="ri-pushpin-line" />
</ToggleButton>
```

### With Text and Icon

```typescript
<ToggleButton variant="PrimeStyle" size="M">
  <i className="ri-heart-line" />
  Favorite
</ToggleButton>
```

### Controlled Toggle

```typescript
function BookmarkButton() {
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <ToggleButton
      variant={bookmarked ? 'BlueSecStyle' : 'BorderStyle'}
      pressed={bookmarked}
      onPressedChange={setBookmarked}
      buttonType="icon"
      size="M"
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <i className={bookmarked ? 'ri-bookmark-fill' : 'ri-bookmark-line'} />
    </ToggleButton>
  )
}
```

### Uncontrolled Toggle

```typescript
<ToggleButton defaultPressed aria-label="Notifications enabled">
  <i className="ri-notification-line" />
</ToggleButton>
```

### Disabled State

```typescript
<ToggleButton disabled>Disabled Off</ToggleButton>
<ToggleButton disabled pressed>Disabled On</ToggleButton>
```

### With Theme Override

```typescript
<ToggleButton theme="dark" variant="PrimeStyle">
  Dark Theme
</ToggleButton>

<ToggleButton theme="light" variant="BlueSecStyle">
  Light Theme
</ToggleButton>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pressed` | `boolean` | - | Controlled pressed state |
| `defaultPressed` | `boolean` | `false` | Uncontrolled default state |
| `onPressedChange` | `(pressed: boolean) => void` | - | Called when pressed state changes |
| `variant` | `VariantType` | `'PrimeStyle'` | Visual style variant |
| `size` | `'S' \| 'M' \| 'L' \| 'XL'` | `'M'` | Size of the toggle button |
| `buttonType` | `'default' \| 'icon'` | `'default'` | Set to `'icon'` for square dimensions |
| `disabled` | `boolean` | `false` | Disables the toggle button |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Override theme for this component |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Toggle button content |

### Variant Types

| Variant | Background | Active State | Description |
|---------|-----------|-------------|-------------|
| `PrimeStyle` | Secondary | Hover highlight | Default primary toggle style |
| `BlueSecStyle` | Secondary | Information blue | Blue secondary accent |
| `BorderStyle` | Border-style bg | Hover highlight | Bordered toggle style |
| `PrimeContStyle` | Transparent | Container hover | Minimal container style |
| `SystemStyle` | Black alpha 20 | White alpha 20 | Dark/system UI style |

### Size Variants

| Size | Height | Width (default) | Width (icon) | Border Radius | Typography | Icon Size |
|------|--------|----------------|--------------|---------------|------------|-----------|
| S | 22px | auto (px: 8px) | 22px | 4px | Small Medium | 12px |
| M | 28px | auto (px: 12px) | 28px | 4px | Large Medium | 18px |
| L | 34px | auto (px: 16px) | 34px | 6px | Large Medium | 20px |
| XL | 40px | auto (px: 20px) | 40px | 6px | Headers Medium | 22px |

### TypeScript

```typescript
import { ComponentPropsWithoutRef, ElementRef } from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { VariantProps } from 'class-variance-authority'

type Themes = 'light' | 'dark' | 'default'

type ToggleButtonProps = ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleButtonStyles> & {
    theme?: Themes
  }

export const ToggleButton: React.ForwardRefExoticComponent<
  ToggleButtonProps & React.RefAttributes<ElementRef<typeof TogglePrimitive.Root>>
>

export { toggleButtonStyles }
export type { ToggleButtonProps }
```

## Common Patterns

### Favorite Button with API

```typescript
function FavoriteButton({ itemId }: { itemId: string }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toggleFavorite = async (pressed: boolean) => {
    setIsLoading(true)
    try {
      await toggleFavoriteAPI(itemId, pressed)
      setIsFavorite(pressed)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ToggleButton
      variant={isFavorite ? 'BlueSecStyle' : 'BorderStyle'}
      buttonType="icon"
      size="M"
      pressed={isFavorite}
      onPressedChange={toggleFavorite}
      disabled={isLoading}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <i className={isFavorite ? 'ri-heart-fill' : 'ri-heart-line'} />
    </ToggleButton>
  )
}
```

### Sidebar Toggle

```typescript
function SidebarToggle() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <ToggleButton
      variant="PrimeContStyle"
      buttonType="icon"
      size="L"
      pressed={collapsed}
      onPressedChange={setCollapsed}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <i className={collapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'} />
    </ToggleButton>
  )
}
```

### Toolbar Actions Row

```typescript
function EditorToolbar() {
  const [styles, setStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    code: false
  })

  const toggle = (key: keyof typeof styles) => {
    setStyles(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const toolbarItems = [
    { key: 'bold', icon: 'ri-bold', label: 'Bold' },
    { key: 'italic', icon: 'ri-italic', label: 'Italic' },
    { key: 'underline', icon: 'ri-underline', label: 'Underline' },
    { key: 'code', icon: 'ri-code-s-slash-line', label: 'Code' }
  ] as const

  return (
    <div className="flex gap-1 p-2 border rounded">
      {toolbarItems.map(({ key, icon, label }) => (
        <ToggleButton
          key={key}
          buttonType="icon"
          size="S"
          variant="PrimeContStyle"
          pressed={styles[key]}
          onPressedChange={() => toggle(key)}
          aria-label={label}
        >
          <i className={icon} />
        </ToggleButton>
      ))}
    </div>
  )
}
```

### Dark UI Panel

```typescript
function DarkPanel() {
  const [muted, setMuted] = useState(false)
  const [recording, setRecording] = useState(false)

  return (
    <div className="bg-gray-900 p-4 rounded flex gap-2">
      <ToggleButton
        variant="SystemStyle"
        buttonType="icon"
        size="L"
        pressed={muted}
        onPressedChange={setMuted}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        <i className={muted ? 'ri-mic-off-fill' : 'ri-mic-fill'} />
      </ToggleButton>

      <ToggleButton
        variant="SystemStyle"
        buttonType="icon"
        size="L"
        pressed={recording}
        onPressedChange={setRecording}
        aria-label={recording ? 'Stop recording' : 'Start recording'}
      >
        <i className={recording ? 'ri-stop-circle-fill' : 'ri-record-circle-fill'} />
      </ToggleButton>
    </div>
  )
}
```

### Theme Switcher

```typescript
function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false)

  return (
    <ToggleButton
      variant="BorderStyle"
      size="M"
      pressed={isDark}
      onPressedChange={setIsDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <i className={isDark ? 'ri-moon-fill' : 'ri-sun-line'} />
      {isDark ? 'Dark' : 'Light'}
    </ToggleButton>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ToggleButton } from 'torch-glare/lib/components/ToggleButton'

describe('ToggleButton', () => {
  it('toggles pressed state on click', () => {
    const handleChange = jest.fn()
    render(
      <ToggleButton onPressedChange={handleChange}>
        Toggle
      </ToggleButton>
    )

    fireEvent.click(screen.getByRole('button'))
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('renders with pressed state', () => {
    render(<ToggleButton pressed>Active</ToggleButton>)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-state', 'on')
  })

  it('applies icon mode dimensions', () => {
    const { container } = render(
      <ToggleButton buttonType="icon" size="M">
        <i className="ri-star-line" />
      </ToggleButton>
    )

    const button = container.querySelector('button')
    expect(button).toHaveClass('w-[28px]', 'px-0')
  })

  it('applies variant styles', () => {
    const { container } = render(
      <ToggleButton variant="BlueSecStyle">Blue</ToggleButton>
    )

    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-background-presentation-action-secondary')
  })

  it('handles disabled state', () => {
    const handleChange = jest.fn()
    render(
      <ToggleButton disabled onPressedChange={handleChange}>
        Disabled
      </ToggleButton>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(handleChange).not.toHaveBeenCalled()
    expect(button).toHaveClass('cursor-not-allowed')
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('ToggleButton meets WCAG standards', async () => {
  const { container } = render(
    <ToggleButton aria-label="Toggle feature">
      <i className="ri-star-line" />
    </ToggleButton>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Keyboard Support

- **Space**: Toggle pressed state when focused
- **Enter**: Toggle pressed state
- **Tab**: Move focus to/from the toggle button

### ARIA Attributes

Radix UI Toggle automatically provides:

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

<!-- Disabled -->
<button
  role="button"
  aria-pressed="false"
  data-state="off"
  disabled
/>
```

### Screen Reader Support

- Announces toggle button role
- Communicates pressed/unpressed state
- Reads aria-label or text content
- Announces state changes on interaction

### Best Practices

```typescript
// Always provide aria-label for icon-only toggle buttons
<ToggleButton buttonType="icon" aria-label="Bold text">
  <i className="ri-bold" />
</ToggleButton>

// Or include screen-reader text
<ToggleButton buttonType="icon">
  <i className="ri-bold" />
  <span className="sr-only">Bold</span>
</ToggleButton>
```

## Styling

### Variant Details

- **PrimeStyle**: `bg-background-presentation-action-secondary` with hover/active highlight
- **BlueSecStyle**: Same base as PrimeStyle but active state uses information blue (`bg-background-presentation-state-information-primary`)
- **BorderStyle**: `bg-background-presentation-action-borderstyle` with visible border (`border-border-presentation-action-disabled`)
- **PrimeContStyle**: Transparent background, minimal with container-style hover
- **SystemStyle**: `bg-black-alpha-20` with white text and `border-[#2C2D2E]`, white alpha hover/active

### Active State Styling

All variants use `data-[state=on]` for the active/pressed visual:

```css
/* PrimeStyle / BorderStyle active */
data-[state=on]:bg-background-presentation-action-hover
data-[state=on]:text-content-presentation-action-hover

/* BlueSecStyle active */
data-[state=on]:bg-background-presentation-state-information-primary
data-[state=on]:text-content-presentation-action-hover

/* PrimeContStyle active */
data-[state=on]:bg-background-presentation-action-contstyle-hover

/* SystemStyle active */
data-[state=on]:bg-white/20
data-[state=on]:text-white
```

### Focus Ring

All variants include focus-visible ring styling:

```css
/* Standard variants */
focus-visible:ring-2 focus-visible:ring-border-presentation-state-focus

/* SystemStyle */
focus-visible:ring-2 focus-visible:ring-white/50
```

### Custom Styles

```typescript
<ToggleButton
  className="rounded-full shadow-sm"
  variant="BorderStyle"
  size="L"
>
  Custom Shape
</ToggleButton>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 2.6kb |
| First render | <5ms |
| Re-render | <2ms |
| Interaction | <1ms |
| Tree-shakeable | Yes |

### Optimization Tips

1. Use `defaultPressed` for uncontrolled mode when you do not need external state
2. Memoize `onPressedChange` handlers with `useCallback`
3. For groups of toggle buttons, consider using `ButtonGroup` instead for better semantics

## Migration

### From Toggle Component

```diff
// Toggle and ToggleButton share a similar API
// ToggleButton adds buttonType="icon" mode and slightly different variants
- import { Toggle } from 'torch-glare/lib/components/Toggle'
+ import { ToggleButton } from 'torch-glare/lib/components/ToggleButton'

- <Toggle pressed={value} onPressedChange={setValue}>
+ <ToggleButton pressed={value} onPressedChange={setValue}>
    Content
- </Toggle>
+ </ToggleButton>
```

## Troubleshooting

### Icon not sizing correctly

**Solution:** Icons are automatically sized via `[&_i]:text-[Xpx]` selectors per size variant. Use Remix Icon `<i>` tags for automatic sizing:

```typescript
<ToggleButton size="L">
  <i className="ri-heart-line" />
  {/* Icon automatically sized to 20px */}
</ToggleButton>
```

### Toggle not changing state

**Solution:** Use controlled or uncontrolled mode properly:

```typescript
// Controlled - you manage state
<ToggleButton pressed={value} onPressedChange={setValue} />

// Uncontrolled - internal state
<ToggleButton defaultPressed />
```

## Related Components

- [ButtonGroup](/docs/components/button-group.md) - Group of toggle buttons with single/multiple selection
- [Toggle](/docs/components/toggle.md) - Similar toggle with additional variant options
- [Button](/docs/components/button.md) - Standard action buttons
- [Switch](/docs/components/switch.md) - For on/off states with slider visual

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## Changelog

### v1.1.15
- Initial stable release
- 5 visual variants (PrimeStyle, BlueSecStyle, BorderStyle, PrimeContStyle, SystemStyle)
- 4 size variants (S, M, L, XL)
- Icon-only mode via buttonType="icon" with compound variants
- Re-exported from ButtonGroup module
