---
title: Timeline
description: Vertical or horizontal timeline for activity logs, audit trails, and history. Composed of indicator, separator, content, heading, and description parts with five semantic variants.
component: true
group: Data Display
keywords: [timeline, activity, history, audit, log, events, vertical, horizontal]
---

# Timeline

A composable timeline for activity logs, change history, audit trails, and event sequences. Each item has an indicator, a connecting separator, and a content block. The indicator supports five variants — `default`, `active`, `completed`, `error`, `warning` — each with built-in icons and color tokens.

The component is composed of `Timeline`, `TimelineItem`, `TimelineIndicator`, `TimelineSeparator`, `TimelineConnector`, `TimelineContent`, `TimelineHeading`, and `TimelineDescription`. Unlike [`Stepper`](./stepper.md), Timeline doesn't track an `activeStep` — each item's variant is set explicitly.

## Installation

```bash
npx torch-glare@latest add Timeline
```

## Imports

```typescript
import {
  Timeline,
  TimelineItem,
  TimelineIndicator,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineHeading,
  TimelineDescription,
} from '@/components/Timeline'
```

## Basic Usage

```tsx
import {
  Timeline,
  TimelineItem,
  TimelineIndicator,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineHeading,
  TimelineDescription,
} from '@/components/Timeline'

export function BasicTimeline() {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineConnector>
          <TimelineIndicator variant="completed" />
          <TimelineSeparator />
        </TimelineConnector>
        <TimelineContent>
          <TimelineHeading>Account created</TimelineHeading>
          <TimelineDescription>March 5, 2026 · 9:14 AM</TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineConnector>
          <TimelineIndicator variant="active" />
          <TimelineSeparator active />
        </TimelineConnector>
        <TimelineContent>
          <TimelineHeading>Email verified</TimelineHeading>
          <TimelineDescription>March 5, 2026 · 9:32 AM</TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineConnector>
          <TimelineIndicator variant="default" />
        </TimelineConnector>
        <TimelineContent>
          <TimelineHeading>Profile setup</TimelineHeading>
          <TimelineDescription>Pending</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
```

The last `TimelineItem` should typically omit `TimelineSeparator` so the line ends at the final indicator. `TimelineContent` auto-removes its bottom padding on the last item via `group-last/item:pb-0`.

## Examples

### Indicator variants

`completed` renders a check icon, `error` renders a close icon, `warning` renders an alert icon. `default` and `active` render a `6×6` filled dot. Pass `icon` or `children` to override.

```tsx
<TimelineIndicator variant="default" />
<TimelineIndicator variant="active" />
<TimelineIndicator variant="completed" />
<TimelineIndicator variant="error" />
<TimelineIndicator variant="warning" />
<TimelineIndicator variant="active" icon={<i className="ri-flashlight-line" />} />
```

### Sizes

Indicators support `S` (`22px`), `M` (`28px`, default), and `L` (`34px`).

```tsx
<TimelineIndicator size="S" variant="completed" />
<TimelineIndicator size="M" variant="completed" />
<TimelineIndicator size="L" variant="completed" />
```

### Horizontal orientation

```tsx
<Timeline orientation="horizontal">
  <TimelineItem>
    <TimelineConnector orientation="horizontal">
      <TimelineIndicator variant="completed" />
      <TimelineSeparator orientation="horizontal" active />
    </TimelineConnector>
    <TimelineContent>
      <TimelineHeading>Submitted</TimelineHeading>
      <TimelineDescription>2:14 PM</TimelineDescription>
    </TimelineContent>
  </TimelineItem>

  <TimelineItem>
    <TimelineConnector orientation="horizontal">
      <TimelineIndicator variant="active" />
    </TimelineConnector>
    <TimelineContent>
      <TimelineHeading>Reviewing</TimelineHeading>
      <TimelineDescription>Now</TimelineDescription>
    </TimelineContent>
  </TimelineItem>
</Timeline>
```

Pass `orientation="horizontal"` on `Timeline`, `TimelineItem`, `TimelineConnector`, and `TimelineSeparator` — the orientation isn't propagated through context.

### Activity log

```tsx
const events = [
  { id: 1, variant: 'completed', heading: 'Order placed',    when: 'Mar 5 · 9:14 AM' },
  { id: 2, variant: 'completed', heading: 'Payment received', when: 'Mar 5 · 9:15 AM' },
  { id: 3, variant: 'active',    heading: 'Preparing order',  when: 'Mar 5 · 10:02 AM' },
  { id: 4, variant: 'default',   heading: 'Shipped',          when: 'Pending' },
  { id: 5, variant: 'default',   heading: 'Delivered',        when: 'Pending' },
] as const

export function OrderTimeline() {
  return (
    <Timeline>
      {events.map((e, i) => (
        <TimelineItem key={e.id}>
          <TimelineConnector>
            <TimelineIndicator variant={e.variant} />
            {i < events.length - 1 && (
              <TimelineSeparator active={e.variant === 'completed' || e.variant === 'active'} />
            )}
          </TimelineConnector>
          <TimelineContent>
            <TimelineHeading>{e.heading}</TimelineHeading>
            <TimelineDescription>{e.when}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
```

## API Reference

### Timeline

| Prop          | Type                            | Default      | Description                              |
| ------------- | ------------------------------- | ------------ | ---------------------------------------- |
| `orientation` | `'vertical' \| 'horizontal'`    | `'vertical'` | Layout direction.                        |
| `theme`       | `'dark' \| 'light' \| 'default'` | —            | Theme override applied via `data-theme`. |

### TimelineItem

| Prop          | Type                         | Default      | Description                                    |
| ------------- | ---------------------------- | ------------ | ---------------------------------------------- |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Should match the parent `Timeline`.            |

### TimelineIndicator

| Prop      | Type                                                            | Default     | Description                                                            |
| --------- | --------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------- |
| `variant` | `'default' \| 'active' \| 'completed' \| 'error' \| 'warning'` | `'default'` | Visual state. Drives both color tokens and the auto-rendered icon.     |
| `size`    | `'S' \| 'M' \| 'L'`                                             | `'M'`       | Indicator diameter (`22 / 28 / 34px`).                                 |
| `icon`    | `ReactNode`                                                     | —           | Custom icon — overrides the variant's default.                         |
| `children`| `ReactNode`                                                     | —           | Custom content — used when `icon` is not set.                          |

### TimelineSeparator

| Prop          | Type                         | Default      | Description                                                |
| ------------- | ---------------------------- | ------------ | ---------------------------------------------------------- |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Line direction.                                            |
| `active`      | `boolean`                    | `false`      | Render the line in focus blue (use after completed steps). |

### TimelineConnector

Wraps the indicator and separator. Pass `orientation` to switch between column (vertical) and row (horizontal) layout.

### TimelineContent / TimelineHeading / TimelineDescription

Forward `HTMLAttributes<HTMLDivElement>`. `TimelineContent` removes its bottom padding on the last item; `TimelineHeading` uses `typography-body-medium-medium`; `TimelineDescription` uses `typography-body-small-regular` with secondary text color.

## Styling

- Indicators use the standard state token set: `state-information-primary`, `state-success-primary`, `state-negative-primary`, `state-warning-primary`.
- Separator: `1px` neutral line by default, focus-blue when `active`.
- Vertical content: `pb-6 pt-[2px]` — gives breathing room between items.
- Horizontal content: aligned under the indicator with `gap-3`.

## TypeScript Types

```typescript
import type { VariantProps } from 'class-variance-authority'
import type { timelineStyles, indicatorStyles, separatorStyles } from '@/components/Timeline'

type TimelineVariants  = VariantProps<typeof timelineStyles>
type IndicatorVariants = VariantProps<typeof indicatorStyles>
// { variant?: 'default' | 'active' | 'completed' | 'error' | 'warning'; size?: 'S' | 'M' | 'L' }
type SeparatorVariants = VariantProps<typeof separatorStyles>
// { orientation?: 'vertical' | 'horizontal'; active?: boolean }
```

## Accessibility

- Use `<ol>` semantics when the order matters (audit logs, order tracking) — wrap `Timeline` in `<ol>` and each `TimelineItem` in `<li>`.
- Variants like `error` and `warning` should be paired with text in `TimelineDescription` — color is never the sole signal.
- Decorative icons inside indicators don't need labels; the heading carries the meaning.

## Best Practices

1. Reach for Timeline when items are events at points in time. Reach for Stepper when items are tasks the user has to complete.
2. Always omit `TimelineSeparator` on the last item so the line doesn't dangle.
3. Use `active` on the separator after a `completed` indicator to color the connecting segment blue — it visually links progress.
4. Cap visible items at 5–7 in vertical mode; collapse the rest behind a "show earlier" affordance for long histories.
