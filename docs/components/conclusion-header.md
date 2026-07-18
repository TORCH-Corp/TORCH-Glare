---
title: ConclusionHeader
description: A clickable section header with a chevron toggle — white-alpha hover surfaces, chevron down when open and sideways when closed, and a "Disabled" badge when disabled. Direction-aware (LTR/RTL). Used for each FormSummary group title.
component: true
group: Layout & Containers
keywords: [conclusion-header, collapsible, header, disclosure, accordion, toggle, chevron, expand, collapse, section]
---

# ConclusionHeader

A clickable **section header** that toggles a collapsible region, per the
*Conclusion-Header-2.0* design. Its surfaces are **button overlays** (not an input field): at
rest the label stands alone, and on hover it gains a `Button/ContStyle-Hover` pill while the
chevron gains a `Button/Secondary` box. The chevron is hidden at rest while open, shows
**sideways** when closed (left in LTR, right in RTL), and flips to **down** on hover. When
`disabled` the label greys out, truncates at 120px, and a gray-subtle `Badge` replaces the
chevron.

It renders only the header — you own the collapsible body. It works **uncontrolled**
(manages its own open state) or **controlled** (pass `open` + `onOpenChange`):

```tsx
// Uncontrolled — reflect the state with onOpenChange
const [open, setOpen] = useState(true)

<ConclusionHeader label="Invoice" defaultOpen onOpenChange={setOpen} />
{open && <section>…body…</section>}

// Controlled — you drive `open`
<ConclusionHeader label="Invoice" open={open} onOpenChange={setOpen} />
```

## Installation

```bash
npx torch-glare@latest init
npx torch-glare@latest add ConclusionHeader
```

## Imports

```tsx
import { ConclusionHeader } from '@/components/ConclusionHeader'
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `ReactNode` | — | The header text. |
| `open` | `boolean` | — | **Controlled** open state. Omit to let the header manage its own. |
| `defaultOpen` | `boolean` | `true` | Initial open state when **uncontrolled**. |
| `onOpenChange` | `(open: boolean) => void` | — | Called with the next open state on click. |
| `disabled` | `boolean` | `false` | Greys the label and shows a `Badge` instead of the chevron. |
| `disabledLabel` | `string` | `"Disabled"` | Badge text when `disabled`. |
| `theme` | `'dark' \| 'light' \| 'default'` | — | Theme override; otherwise inherits the nearest `data-theme`. |

Extra props spread to the underlying `<button>`, which is what the header renders — so it is
focusable, toggles on <kbd>Enter</kbd>/<kbd>Space</kbd>, and exposes `aria-expanded` for
free. A `ref` is forwarded to that `HTMLButtonElement`.

## Behaviour

- **Open** (rest): label only — no surface, no chevron.
- **Open hover**: `Button/ContStyle-Hover` pill (label inset 4px) + `Button/Secondary`
  chevron box with a **down** chevron.
- **Closed** (rest): label + a bare **sideways** chevron (`<` LTR / `>` RTL), no box.
- **Closed hover**: same surfaces as open hover; the chevron flips to down.
- **Disabled**: greyed label truncated at 120px + a `● Disabled` badge sitting beside it
  (not at the row's end); not clickable.

Direction is inherited from the ambient `dir` — the design's RTL variants are the LTR ones
mirrored, which the component's logical properties produce automatically.

## Composition

Uses the design-system tokens directly (`Button/Secondary`, `Button/ContStyle-Hover`) rather
than the input/button components, and reuses [Badge](./badge.md) for the disabled state.
[FormSummary](./form-summary.md) uses it as each **group** title, so every group of totals
collapses independently.
