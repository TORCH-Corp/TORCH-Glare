---
title: Badge
description: Status indicator and label component with solid/subtle styles, ten color options, and an optional close button.
component: true
group: Data Display
keywords: [badge, tag, label, status, chip, pill, indicator]
---

# Badge

Compact label for status, categories, and tags. Two visual styles (`solid`, `subtle`), ten colors, three sizes, and an optional close button for chip-style use.

## Installation

```bash
npx torch-cli add badge
```

## Imports

```typescript
import { Badge, badgeStyles } from '@/components/Badge'
```

## Basic Usage

```tsx
import { Badge } from '@/components/Badge'

export function BasicBadge() {
  return <Badge label="Active" color="green" />
}
```

Defaults: `badgeStyle="subtle"`, `color="gray"`, `size="S"`, `showIcon=true`.

## Examples

### Styles

`subtle` (default) tints the background and renders text/icons in a single neutral foreground color (`--Content-Presentation-Global-subtle`) blended with `mix-blend-mode: luminosity`. `solid` fills the badge and uses a light primary foreground.

```tsx
export function BadgeStyles() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Badge badgeStyle="subtle" color="gray" label="Subtle" />
        <Badge badgeStyle="subtle" color="blue" label="Subtle" />
        <Badge badgeStyle="subtle" color="green" label="Subtle" />
        <Badge badgeStyle="subtle" color="red" label="Subtle" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge badgeStyle="solid" color="gray" label="Solid" />
        <Badge badgeStyle="solid" color="blue" label="Solid" />
        <Badge badgeStyle="solid" color="green" label="Solid" />
        <Badge badgeStyle="solid" color="red" label="Solid" />
      </div>
    </div>
  )
}
```

### Colors

Ten colors. Color drives the background only — foreground is uniform per `badgeStyle`.

```tsx
const COLORS = [
  'gray', 'slate', 'red', 'orange', 'yellow',
  'green', 'ocean', 'blue', 'purple', 'rose',
] as const

export function BadgeColors() {
  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map(color => (
        <Badge key={color} color={color} label={color} />
      ))}
    </div>
  )
}
```

### Sizes

```tsx
export function BadgeSizes() {
  return (
    <div className="flex items-center gap-3">
      <Badge size="XS" color="blue" label="XS" />
      <Badge size="S"  color="blue" label="S" />
      <Badge size="M"  color="blue" label="M" />
    </div>
  )
}
```

| Size | Height | Default icon | Typography |
|------|--------|--------------|------------|
| XS   | 18px   | 12px         | body-small-medium  |
| S    | 22px   | 12px         | body-small-medium  |
| M    | 26px   | 16px         | body-medium-medium |

### Hide the dot

Set `showIcon={false}` for a label-only badge.

```tsx
<Badge color="orange" showIcon={false} label="No icon" />
```

### Custom icon

Replace the default dot via `badgeIcon`.

```tsx
export function BadgesWithIcons() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge color="green"  badgeIcon={<i className="ri-check-line" />}     label="Verified" />
      <Badge color="purple" badgeIcon={<i className="ri-vip-crown-line" />} label="Premium" />
      <Badge color="gray"   badgeIcon={<i className="ri-lock-line" />}      label="Locked" />
    </div>
  )
}
```

### Closable (chips / tags)

Set `isClosable` and pass `onClose`. The close button uses an inline 12×12 SVG (14×14 on size `S`, 16×16 on size `M`), gets a `4px`-radius hover background (`--Background-Presentation-Action-Secondary`), and inherits the same `mix-blend-luminosity` treatment as the rest of subtle foreground.

```tsx
import { useState } from 'react'

export function RemovableTags() {
  const [tags, setTags] = useState([
    { id: 1, label: 'React',      color: 'blue'   },
    { id: 2, label: 'TypeScript', color: 'purple' },
    { id: 3, label: 'Next.js',    color: 'slate'  },
    { id: 4, label: 'Tailwind',   color: 'ocean'  },
  ] as const)

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <Badge
          key={tag.id}
          label={tag.label}
          color={tag.color}
          isClosable
          onClose={() => setTags(prev => prev.filter(t => t.id !== tag.id))}
        />
      ))}
    </div>
  )
}
```

### Status indicators

Pair semantic colors with status states.

```tsx
const STATUS = {
  active:   { label: 'Active',   color: 'green'  },
  pending:  { label: 'Pending',  color: 'yellow' },
  inactive: { label: 'Inactive', color: 'gray'   },
  error:    { label: 'Error',    color: 'red'    },
} as const

export function StatusBadges({ status }: { status: keyof typeof STATUS }) {
  const { label, color } = STATUS[status]
  return <Badge label={label} color={color} />
}
```

## API Reference

### Props

| Prop          | Type                                                                                                  | Default      | Description                                  |
| ------------- | ----------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------------- |
| `label`       | `string`                                                                                              | —            | Badge text content.                          |
| `badgeStyle`  | `'subtle' \| 'solid'`                                                                                 | `'subtle'`   | Visual style.                                |
| `color`       | `'gray' \| 'slate' \| 'red' \| 'orange' \| 'yellow' \| 'green' \| 'ocean' \| 'blue' \| 'purple' \| 'rose'` | `'gray'`     | Background color.                            |
| `size`        | `'XS' \| 'S' \| 'M'`                                                                                  | `'S'`        | Badge size.                                  |
| `showIcon`    | `boolean`                                                                                             | `true`       | Show the leading dot. Ignored when `badgeIcon` is set. |
| `badgeIcon`   | `ReactNode`                                                                                           | —            | Custom leading icon (replaces the default dot). |
| `isClosable`  | `boolean`                                                                                             | `false`      | Render the trailing close button.            |
| `onClose`     | `() => void`                                                                                          | —            | Close handler. Called on click and on Enter/Space. |
| `theme`       | `Themes`                                                                                              | —            | Theme override (`'dark' \| 'light' \| 'default'`). |
| `className`   | `string`                                                                                              | —            | Extra classes merged onto the root `<span>`. |

The Badge root is a `<span>`. Standard `HTMLAttributes<HTMLSpanElement>` (minus `color`, which is overloaded as the variant prop) are forwarded.

## Styling

### Foreground rules

- **Subtle**: text and icons use `text-content-presentation-global-subtle` (`#494949`). The label `<div>`, any inner `<i>`, and the close `<button>` all carry `mix-blend-mode: luminosity`, so the foreground harmonizes with whichever color background sits behind it.
- **Solid**: text and icons use `text-content-presentation-global-primary-light`. No blend mode.

### Backgrounds (CSS variables)

Each color resolves to a pair of tokens:

```
--background-presentation-badge-{color}-subtle
--background-presentation-badge-{color}-solid
```

### Override via className

```tsx
<Badge label="Custom" className="!bg-purple-500 !text-white" />
<Badge label="Wide"   className="w-full justify-center" />
```

## TypeScript Types

```typescript
import type { VariantProps } from 'class-variance-authority'
import type { badgeStyles } from '@/components/Badge'

type BadgeVariants = VariantProps<typeof badgeStyles>
// {
//   badgeStyle?: 'subtle' | 'solid'
//   color?: 'gray' | 'slate' | 'red' | 'orange' | 'yellow' | 'green' | 'ocean' | 'blue' | 'purple' | 'rose'
//   size?: 'XS' | 'S' | 'M'
// }

interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'color'>,
    BadgeVariants {
  label?: string
  badgeIcon?: React.ReactNode
  showIcon?: boolean
  isClosable?: boolean
  onClose?: () => void
  theme?: Themes
  className?: string
}
```

## Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Badge } from '@/components/Badge'

describe('Badge', () => {
  it('renders the label', () => {
    render(<Badge label="Active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('shows the close button when closable', () => {
    render(<Badge label="Tag" isClosable onClose={() => {}} />)
    expect(screen.getByRole('button', { name: 'Remove badge' })).toBeInTheDocument()
  })

  it('fires onClose on click', () => {
    const onClose = jest.fn()
    render(<Badge label="Tag" isClosable onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: 'Remove badge' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('fires onClose on Enter and Space', () => {
    const onClose = jest.fn()
    render(<Badge label="Tag" isClosable onClose={onClose} />)
    const btn = screen.getByRole('button', { name: 'Remove badge' })
    fireEvent.keyDown(btn, { key: 'Enter' })
    fireEvent.keyDown(btn, { key: ' ' })
    expect(onClose).toHaveBeenCalledTimes(2)
  })
})
```

## Accessibility

- The close button has `aria-label="Remove badge"` and is keyboard-focusable.
- Enter and Space trigger `onClose`.
- The close-icon SVG is `aria-hidden`; the accessible name comes from the button label.
- Color is never the sole signal — always pair `color` with a `label` or icon.

## Best Practices

1. Use the same `color` for the same meaning across the app (e.g. `green` = success).
2. Match `size` to surrounding text — `XS` for inline metadata, `M` for standalone status.
3. Prefer `subtle` in dense UIs; reserve `solid` for emphasis.
4. Only set `isClosable` when removal is a real user action — don't fake it for visual flair.
5. Provide a meaningful `label`; never rely on color alone.
