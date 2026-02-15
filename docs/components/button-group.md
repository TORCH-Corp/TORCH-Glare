---
name: ButtonGroup
version: 1.1.15
status: stable
category: components/buttons
tags: [toggle-group, button-group, selection, radix-ui, accessible, compound]
last-reviewed: 2024-11-05
bundle-size: 3.8kb
dependencies:
  - "@radix-ui/react-toggle-group": "^1.0.0"
  - "class-variance-authority": "^0.7.0"
---

# ButtonGroup

> A compound component built on Radix UI Toggle Group that enables single or multiple selection within a group of toggle buttons. Supports three visual variants, four sizes, and automatic variant/size inheritance from parent to child items.

## Installation

```bash
npm install torch-glare
```

## Import

```typescript
import { ButtonGroup, ButtonGroupItem } from 'torch-glare/lib/components/ButtonGroup'
// or
import { ButtonGroup, ButtonGroupItem } from 'torch-glare/lib/components'

// Also re-exports ToggleButton from ToggleButton.tsx
import { ToggleButton } from 'torch-glare/lib/components/ButtonGroup'
```

## Quick Examples

### Basic Usage (Single Selection)

```typescript
import { ButtonGroup, ButtonGroupItem } from 'torch-glare/lib/components/ButtonGroup'

function Example() {
  const [value, setValue] = useState('left')

  return (
    <ButtonGroup
      type="single"
      value={value}
      onValueChange={setValue}
    >
      <ButtonGroupItem value="left">Left</ButtonGroupItem>
      <ButtonGroupItem value="center">Center</ButtonGroupItem>
      <ButtonGroupItem value="right">Right</ButtonGroupItem>
    </ButtonGroup>
  )
}
```

### Multiple Selection

```typescript
function MultipleExample() {
  const [values, setValues] = useState<string[]>(['bold'])

  return (
    <ButtonGroup
      type="multiple"
      value={values}
      onValueChange={setValues}
    >
      <ButtonGroupItem value="bold">
        <i className="ri-bold" />
      </ButtonGroupItem>
      <ButtonGroupItem value="italic">
        <i className="ri-italic" />
      </ButtonGroupItem>
      <ButtonGroupItem value="underline">
        <i className="ri-underline" />
      </ButtonGroupItem>
    </ButtonGroup>
  )
}
```

### All Variants

```typescript
// PrimeStyle (default)
<ButtonGroup type="single" variant="PrimeStyle" defaultValue="a">
  <ButtonGroupItem value="a">Option A</ButtonGroupItem>
  <ButtonGroupItem value="b">Option B</ButtonGroupItem>
</ButtonGroup>

// BorderStyle
<ButtonGroup type="single" variant="BorderStyle" defaultValue="a">
  <ButtonGroupItem value="a">Option A</ButtonGroupItem>
  <ButtonGroupItem value="b">Option B</ButtonGroupItem>
</ButtonGroup>

// SystemStyle
<ButtonGroup type="single" variant="SystemStyle" defaultValue="a">
  <ButtonGroupItem value="a">Option A</ButtonGroupItem>
  <ButtonGroupItem value="b">Option B</ButtonGroupItem>
</ButtonGroup>
```

### With Sizes

```typescript
<ButtonGroup type="single" size="S" defaultValue="a">
  <ButtonGroupItem value="a">Small</ButtonGroupItem>
  <ButtonGroupItem value="b">Items</ButtonGroupItem>
</ButtonGroup>

<ButtonGroup type="single" size="M" defaultValue="a">
  <ButtonGroupItem value="a">Medium</ButtonGroupItem>
  <ButtonGroupItem value="b">Items</ButtonGroupItem>
</ButtonGroup>

<ButtonGroup type="single" size="L" defaultValue="a">
  <ButtonGroupItem value="a">Large</ButtonGroupItem>
  <ButtonGroupItem value="b">Items</ButtonGroupItem>
</ButtonGroup>

<ButtonGroup type="single" size="XL" defaultValue="a">
  <ButtonGroupItem value="a">Extra Large</ButtonGroupItem>
  <ButtonGroupItem value="b">Items</ButtonGroupItem>
</ButtonGroup>
```

### Full Width

```typescript
<ButtonGroup type="single" fullWidth defaultValue="monthly">
  <ButtonGroupItem value="monthly">Monthly</ButtonGroupItem>
  <ButtonGroupItem value="yearly">Yearly</ButtonGroupItem>
</ButtonGroup>
```

### With Icons

```typescript
function ViewToggle() {
  const [view, setView] = useState('grid')

  return (
    <ButtonGroup type="single" value={view} onValueChange={setView} size="M">
      <ButtonGroupItem value="grid" aria-label="Grid view">
        <i className="ri-grid-fill" />
      </ButtonGroupItem>
      <ButtonGroupItem value="list" aria-label="List view">
        <i className="ri-list-unordered" />
      </ButtonGroupItem>
      <ButtonGroupItem value="kanban" aria-label="Kanban view">
        <i className="ri-kanban-view" />
      </ButtonGroupItem>
    </ButtonGroup>
  )
}
```

### With Theme Override

```typescript
<ButtonGroup type="single" theme="dark" variant="PrimeStyle" defaultValue="a">
  <ButtonGroupItem value="a">Dark A</ButtonGroupItem>
  <ButtonGroupItem value="b">Dark B</ButtonGroupItem>
</ButtonGroup>
```

### Item Variant/Size Override

```typescript
<ButtonGroup type="single" variant="PrimeStyle" size="M" defaultValue="a">
  {/* This item overrides to BorderStyle and L size */}
  <ButtonGroupItem value="a" variant="BorderStyle" size="L">
    Custom
  </ButtonGroupItem>
  {/* This item inherits PrimeStyle and M from parent */}
  <ButtonGroupItem value="b">Inherited</ButtonGroupItem>
</ButtonGroup>
```

### Disabled Items

```typescript
<ButtonGroup type="single" defaultValue="a">
  <ButtonGroupItem value="a">Active</ButtonGroupItem>
  <ButtonGroupItem value="b" disabled>Disabled</ButtonGroupItem>
  <ButtonGroupItem value="c">Active</ButtonGroupItem>
</ButtonGroup>
```

## API Reference

### ButtonGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'single' \| 'multiple'` | Required | Selection mode |
| `value` | `string \| string[]` | - | Controlled selected value(s) |
| `defaultValue` | `string \| string[]` | - | Uncontrolled default value(s) |
| `onValueChange` | `(value: string \| string[]) => void` | - | Called when selection changes |
| `variant` | `'PrimeStyle' \| 'BorderStyle' \| 'SystemStyle'` | `'PrimeStyle'` | Visual style variant |
| `size` | `'S' \| 'M' \| 'L' \| 'XL'` | `'M'` | Size of the group and items |
| `fullWidth` | `boolean` | `false` | Makes the group span full width |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Override theme for this component |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | ButtonGroupItem children |

### ButtonGroupItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | Unique value for this item |
| `variant` | `'PrimeStyle' \| 'BorderStyle' \| 'SystemStyle'` | Inherited | Override parent variant |
| `size` | `'S' \| 'M' \| 'L' \| 'XL'` | Inherited | Override parent size |
| `disabled` | `boolean` | `false` | Disables this item |
| `theme` | `'light' \| 'dark' \| 'default'` | - | Override theme for this item |
| `className` | `string` | - | Additional CSS classes |
| `children` | `React.ReactNode` | - | Item content |

### Size Variants

| Size | Height | Padding | Typography | Icon Size |
|------|--------|---------|------------|-----------|
| S | 22px | 8px | Small Medium | 12px |
| M | 28px | 12px | Large Medium | 18px |
| L | 34px | 16px | Large Medium | 20px |
| XL | 40px | 20px | Headers Medium | 22px |

### TypeScript

```typescript
import { ComponentPropsWithoutRef } from 'react'
import { VariantProps } from 'class-variance-authority'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'

type Themes = 'light' | 'dark' | 'default'

type ButtonGroupSingleProps = {
  type: 'single'
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

type ButtonGroupMultipleProps = {
  type: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

type ButtonGroupProps = (ButtonGroupSingleProps | ButtonGroupMultipleProps) &
  Omit<ComponentPropsWithoutRef<'div'>, 'type' | 'value' | 'defaultValue'> &
  VariantProps<typeof buttonGroupStyles> & {
    theme?: Themes
    children?: React.ReactNode
  }

type ButtonGroupItemProps =
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof buttonGroupItemStyles> & {
    theme?: Themes
    children?: React.ReactNode
    _groupVariant?: 'PrimeStyle' | 'BorderStyle' | 'SystemStyle' | null
    _groupSize?: 'S' | 'M' | 'L' | 'XL' | null
  }

export const ButtonGroup: React.ForwardRefExoticComponent<
  ButtonGroupProps & React.RefAttributes<HTMLDivElement>
>

export const ButtonGroupItem: React.ForwardRefExoticComponent<
  ButtonGroupItemProps & React.RefAttributes<HTMLButtonElement>
>
```

## Common Patterns

### Text Alignment Toolbar

```typescript
function AlignmentToolbar() {
  const [alignment, setAlignment] = useState('left')

  return (
    <ButtonGroup type="single" value={alignment} onValueChange={setAlignment} size="S">
      <ButtonGroupItem value="left" aria-label="Align left">
        <i className="ri-align-left" />
      </ButtonGroupItem>
      <ButtonGroupItem value="center" aria-label="Align center">
        <i className="ri-align-center" />
      </ButtonGroupItem>
      <ButtonGroupItem value="right" aria-label="Align right">
        <i className="ri-align-right" />
      </ButtonGroupItem>
      <ButtonGroupItem value="justify" aria-label="Justify">
        <i className="ri-align-justify" />
      </ButtonGroupItem>
    </ButtonGroup>
  )
}
```

### Pricing Toggle

```typescript
function PricingToggle() {
  const [billing, setBilling] = useState('monthly')

  return (
    <div className="text-center">
      <ButtonGroup
        type="single"
        value={billing}
        onValueChange={setBilling}
        variant="BorderStyle"
        size="L"
      >
        <ButtonGroupItem value="monthly">Monthly</ButtonGroupItem>
        <ButtonGroupItem value="yearly">
          Yearly
          <span className="ml-1 text-xs text-green-500">-20%</span>
        </ButtonGroupItem>
      </ButtonGroup>
    </div>
  )
}
```

### Formatting Toolbar (Multiple Selection)

```typescript
function FormattingToolbar() {
  const [formats, setFormats] = useState<string[]>([])

  return (
    <ButtonGroup
      type="multiple"
      value={formats}
      onValueChange={setFormats}
      size="S"
      variant="BorderStyle"
    >
      <ButtonGroupItem value="bold" aria-label="Bold">
        <i className="ri-bold" />
      </ButtonGroupItem>
      <ButtonGroupItem value="italic" aria-label="Italic">
        <i className="ri-italic" />
      </ButtonGroupItem>
      <ButtonGroupItem value="underline" aria-label="Underline">
        <i className="ri-underline" />
      </ButtonGroupItem>
      <ButtonGroupItem value="strikethrough" aria-label="Strikethrough">
        <i className="ri-strikethrough" />
      </ButtonGroupItem>
    </ButtonGroup>
  )
}
```

### Tab-like Navigation

```typescript
function TabNavigation() {
  const [tab, setTab] = useState('overview')

  return (
    <ButtonGroup
      type="single"
      value={tab}
      onValueChange={setTab}
      fullWidth
      variant="PrimeStyle"
      size="L"
    >
      <ButtonGroupItem value="overview">Overview</ButtonGroupItem>
      <ButtonGroupItem value="analytics">Analytics</ButtonGroupItem>
      <ButtonGroupItem value="settings">Settings</ButtonGroupItem>
    </ButtonGroup>
  )
}
```

### System Style (Dark UI)

```typescript
function DarkToolbar() {
  const [tool, setTool] = useState('select')

  return (
    <div className="bg-gray-900 p-4 rounded">
      <ButtonGroup
        type="single"
        value={tool}
        onValueChange={setTool}
        variant="SystemStyle"
        size="M"
      >
        <ButtonGroupItem value="select" aria-label="Select tool">
          <i className="ri-cursor-fill" />
        </ButtonGroupItem>
        <ButtonGroupItem value="draw" aria-label="Draw tool">
          <i className="ri-pencil-fill" />
        </ButtonGroupItem>
        <ButtonGroupItem value="eraser" aria-label="Eraser tool">
          <i className="ri-eraser-fill" />
        </ButtonGroupItem>
      </ButtonGroup>
    </div>
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { ButtonGroup, ButtonGroupItem } from 'torch-glare/lib/components/ButtonGroup'

describe('ButtonGroup', () => {
  it('selects a single value', () => {
    const handleChange = jest.fn()
    render(
      <ButtonGroup type="single" onValueChange={handleChange}>
        <ButtonGroupItem value="a">A</ButtonGroupItem>
        <ButtonGroupItem value="b">B</ButtonGroupItem>
      </ButtonGroup>
    )

    fireEvent.click(screen.getByText('B'))
    expect(handleChange).toHaveBeenCalledWith('b')
  })

  it('supports multiple selection', () => {
    const handleChange = jest.fn()
    render(
      <ButtonGroup type="multiple" onValueChange={handleChange}>
        <ButtonGroupItem value="bold">B</ButtonGroupItem>
        <ButtonGroupItem value="italic">I</ButtonGroupItem>
      </ButtonGroup>
    )

    fireEvent.click(screen.getByText('B'))
    expect(handleChange).toHaveBeenCalledWith(['bold'])

    fireEvent.click(screen.getByText('I'))
    expect(handleChange).toHaveBeenCalledWith(['bold', 'italic'])
  })

  it('disables individual items', () => {
    const handleChange = jest.fn()
    render(
      <ButtonGroup type="single" onValueChange={handleChange}>
        <ButtonGroupItem value="a">A</ButtonGroupItem>
        <ButtonGroupItem value="b" disabled>B</ButtonGroupItem>
      </ButtonGroup>
    )

    fireEvent.click(screen.getByText('B'))
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('applies active state styling', () => {
    render(
      <ButtonGroup type="single" value="a">
        <ButtonGroupItem value="a">A</ButtonGroupItem>
        <ButtonGroupItem value="b">B</ButtonGroupItem>
      </ButtonGroup>
    )

    expect(screen.getByText('A').closest('button')).toHaveAttribute('data-state', 'on')
    expect(screen.getByText('B').closest('button')).toHaveAttribute('data-state', 'off')
  })
})
```

### Accessibility Test

```typescript
import { axe } from '@axe-core/react'

test('ButtonGroup meets WCAG standards', async () => {
  const { container } = render(
    <ButtonGroup type="single" defaultValue="a">
      <ButtonGroupItem value="a">Option A</ButtonGroupItem>
      <ButtonGroupItem value="b">Option B</ButtonGroupItem>
    </ButtonGroup>
  )

  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Accessibility

### Keyboard Support

- **Tab**: Move focus to/from the button group
- **Arrow Left/Right**: Navigate between items within the group
- **Space**: Toggle the focused item
- **Enter**: Toggle the focused item

### ARIA Attributes

Radix UI Toggle Group automatically provides:

```html
<!-- Single selection -->
<div role="group">
  <button
    role="radio"
    aria-checked="true"
    data-state="on"
  >Selected</button>
  <button
    role="radio"
    aria-checked="false"
    data-state="off"
  >Not Selected</button>
</div>

<!-- Multiple selection -->
<div role="group">
  <button
    aria-pressed="true"
    data-state="on"
  >Active</button>
  <button
    aria-pressed="false"
    data-state="off"
  >Inactive</button>
</div>
```

### Screen Reader Support

- Announces group role and item count
- Communicates selected/pressed state per item
- Reads aria-label or text content for each item
- Announces state changes on toggle

### Best Practices

```typescript
// Always provide aria-label for icon-only items
<ButtonGroupItem value="grid" aria-label="Grid view">
  <i className="ri-grid-fill" />
</ButtonGroupItem>

// Or include screen-reader text
<ButtonGroupItem value="grid">
  <i className="ri-grid-fill" />
  <span className="sr-only">Grid view</span>
</ButtonGroupItem>
```

## Styling

### Variant Styles

Each variant provides different visual styles for the group container and items:

- **PrimeStyle**: Secondary background with disabled border, hover and active highlights
- **BorderStyle**: Border-style background with disabled border, same hover/active as PrimeStyle
- **SystemStyle**: Dark/transparent background with white text, white alpha hover/active states

### Active State

Items use `data-[state=on]` for active styling:

```css
/* PrimeStyle / BorderStyle active */
data-[state=on]:bg-background-presentation-action-hover
data-[state=on]:text-content-presentation-action-hover

/* SystemStyle active */
data-[state=on]:bg-white/20
data-[state=on]:text-white
```

### Focus Visible

Items display a focus ring on keyboard navigation:

```css
focus-visible:ring-2 focus-visible:ring-inset
focus-visible:ring-border-presentation-state-focus
```

### Custom Styles

```typescript
<ButtonGroup
  type="single"
  className="rounded-full shadow-md"
  defaultValue="a"
>
  <ButtonGroupItem value="a" className="first:rounded-l-full">A</ButtonGroupItem>
  <ButtonGroupItem value="b" className="last:rounded-r-full">B</ButtonGroupItem>
</ButtonGroup>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (gzip) | 3.8kb |
| First render | <8ms |
| Re-render | <3ms |
| Tree-shakeable | Yes |

### Optimization Tips

1. Use `defaultValue` for uncontrolled mode when possible
2. Memoize `onValueChange` handlers with `useCallback`
3. Avoid recreating children arrays on each render

## Related Components

- [ToggleButton](/docs/components/toggle-button.md) - Standalone toggle button (re-exported from ButtonGroup)
- [Toggle](/docs/components/toggle.md) - Individual toggle with more variant options
- [Button](/docs/components/button.md) - Standard action buttons
- [ActionsGroup](/docs/components/actions-group.md) - Group of action buttons

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## Changelog

### v1.1.15
- Initial stable release
- 3 visual variants (PrimeStyle, BorderStyle, SystemStyle)
- 4 size variants (S, M, L, XL)
- Single and multiple selection modes
- Automatic variant/size inheritance from parent to items
- Re-exports ToggleButton component
