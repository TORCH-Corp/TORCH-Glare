---
title: HeaderBar
description: Variant-driven page/form header chip pairing a colored emphasis pill with a plain title.
component: true
group: Layout
keywords: [header, headerbar, page-header, form-header, title, badge, label, layout]
---

# HeaderBar

A presentational header chip used at the top of a form, page, or drawer to communicate the current record context — for example "NEW sales invoice", "EDIT sales invoice", or "ORDER de-344". It pairs a colored emphasis pill (the `label`) with a plain `title`, and the `variant` controls both the pill color and which side the pill sits on. The surface is always a fixed dark container, and the component is non-interactive.

## Installation

```bash
npx torch-glare@latest add HeaderBar
```

## Imports

```typescript
import HeaderBar from '@/components/HeaderBar'
```

```typescript
import { HeaderBar } from '@/components/HeaderBar'
```

Both the default export and the named export resolve to the same component. The website convention is the default import.

## Basic Usage

```tsx
import HeaderBar from '@/components/HeaderBar'

export function BasicHeaderBar() {
  return (
    <HeaderBar
      variant="new"
      label="New"
      title="sales iNVOICE"
    />
  )
}
```

## Examples

### New Invoice Header

The `new` variant renders a blue emphasis pill on the left followed by the plain title on the right. Use it on create screens.

```tsx
import HeaderBar from '@/components/HeaderBar'

export function NewInvoiceHeader() {
  return (
    <HeaderBar
      variant="new"
      label="New"
      title="sales iNVOICE"
    />
  )
}
```

### Edit Header

The `edit` variant shares the exact same layout as `new` (pill left, title right) but uses an orange emphasis pill. Use it on edit screens.

```tsx
import HeaderBar from '@/components/HeaderBar'

export function EditInvoiceHeader() {
  return (
    <HeaderBar
      variant="edit"
      label="edit"
      title="sales iNVOICE"
    />
  )
}
```

### Detail Header

The `detail` variant swaps the positions: the plain title renders on the left and the colored (white-alpha) pill renders on the right. Use it for read-only record context such as an order reference.

```tsx
import HeaderBar from '@/components/HeaderBar'

export function OrderDetailHeader() {
  // Renders as:  SALES INVOICE  [ de-344 ]
  // plain title on the LEFT, badge on the RIGHT
  return (
    <HeaderBar
      variant="detail"
      label="de-344"
      title="sales iNVOICE"
    />
  )
}
```

### Themed

HeaderBar accepts a `theme` prop applied via `data-theme`. The surface is always a dark chip, so theming is most useful for keeping the component consistent with the surrounding `data-theme` scope.

```tsx
import HeaderBar from '@/components/HeaderBar'

export function ThemedHeaderBars() {
  return (
    <div className="flex flex-col gap-4">
      <HeaderBar variant="new" label="New" title="sales iNVOICE" theme="dark" />
      <HeaderBar variant="edit" label="edit" title="sales iNVOICE" theme="light" />
      <HeaderBar variant="detail" label="de-344" title="sales iNVOICE" theme="default" />
    </div>
  )
}
```

## API Reference

### HeaderBar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'new' \| 'edit' \| 'detail'` | `'new'` | Controls both the pill color and which side the pill sits on |
| label | `string` | — (required) | Text rendered inside the colored emphasis pill |
| title | `string` | — (required) | Plain text rendered alongside the pill |
| theme | `Themes` | — | Theme variant applied via `data-theme` (`'dark' \| 'light' \| 'default'`) |
| className | `string` | — | Additional CSS classes merged onto the root element |

All standard `HTMLAttributes<HTMLDivElement>` (for example `id`, `aria-*`, `data-*`, `style`, `onClick`) pass through to the root `div`.

## Variants

| Variant | Pill color | Pill text | Layout (left → right) |
|---------|-----------|-----------|------------------------|
| `new` | `bg-blue-sparkle-alpha-50` | `text-blue-sparkle-200` | pill (`label`) → title |
| `edit` | `bg-orange-alpha-50` | `text-orange-200` | pill (`label`) → title |
| `detail` | `bg-white-alpha-30` | `text-white-00` | title → pill (`label`) — positions swapped |

## Styling

- **Fixed dark container**: `rounded-[14px]`, `border-black-600`, `bg-black-1000`, `p-1.5`, with a double soft shadow. The surface is always dark regardless of theme.
- **Layout**: the root is `inline-flex`, so the chip hugs its content rather than stretching to fill its parent.
- **Typography**: 28px, weight 510, uppercase, SF Pro with the `cv05` stylistic set. Both `label` and `title` render uppercase.
- **Emphasis pill**: the colored badge background and text color are driven entirely by `variant` (see the Variants table). For `detail`, the pill also moves to the right side.

## TypeScript Types

```typescript
import { HTMLAttributes } from 'react'
import { Themes } from '@/utils/types'

interface HeaderBarProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'new' | 'edit' | 'detail'
  label: string
  title: string
  theme?: Themes
  className?: string
}
```

## Accessibility

- HeaderBar is purely presentational — it has no interactive behavior and is intended to label the surrounding content visually.
- Because the text is rendered uppercase via styling (not the source string), screen readers receive the original casing of `label` and `title`.
- Pass any `aria-*` attributes through the standard prop spread when the chip needs an explicit accessible role or label in its context.
- HeaderBar does not render an HTML heading element. When this chip represents the page or section heading, ensure proper heading semantics exist in the surrounding layout (for example an `<h1>` / `<h2>` for the page) so document structure remains navigable.

## Best Practices

1. **Match the variant to the screen mode**: use `new` for create screens, `edit` for edit screens, and `detail` for read-only record context.
2. **Keep `label` short**: it is the emphasis pill, so a concise token (a mode word like "New" / "edit" or a record reference like "de-344") reads best — text renders UPPERCASE automatically.
3. **Use `title` for the record type**: the plain side should name the entity (for example "sales invoice", "Order"), not duplicate the label.
4. **Expect the detail swap**: for `variant="detail"` the pill moves to the right and the title to the left — author content with that ordering in mind.
5. **Don't rely on it for interactivity**: HeaderBar is a label, not a control; place buttons or actions in a separate toolbar.
6. **Let it hug its content**: the chip is `inline-flex`; avoid forcing it to full width and keep it at the top of the form, page, or drawer it describes.
