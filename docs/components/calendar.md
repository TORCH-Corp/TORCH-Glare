---
title: Calendar
description: Calendar component built on react-day-picker with custom styling and dropdown navigation
group: Date & Time
keywords: [calendar, date, day-picker, month, year, react-day-picker]
---

# Calendar

> A fully-featured calendar component built on react-day-picker with custom theming, dropdown month/year selection, and support for single, multiple, and range date selection modes.

## Installation

```bash
npm install react-day-picker date-fns
```

## Import

```typescript
import { Calendar } from '@torch-ui/components'
import type { CalendarProps } from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { Calendar } from '@torch-ui/components'
import { useState } from 'react'

function Example() {
  const [selected, setSelected] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={setSelected}
    />
  )
}
```

### Range Selection

```typescript
import { Calendar } from '@torch-ui/components'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

function RangePicker() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
    />
  )
}
```

### Multiple Date Selection

```typescript
import { Calendar } from '@torch-ui/components'
import { useState } from 'react'

function MultiplePicker() {
  const [dates, setDates] = useState<Date[]>([])

  return (
    <Calendar
      mode="multiple"
      selected={dates}
      onSelect={setDates}
      max={5} // Limit to 5 dates
    />
  )
}
```

### With Week Numbers

```typescript
import { Calendar } from '@torch-ui/components'

function WeekNumbers() {
  return (
    <Calendar
      mode="single"
      showWeekNumber
    />
  )
}
```

### Date Restrictions

```typescript
import { Calendar } from '@torch-ui/components'

function RestrictedCalendar() {
  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1)

  return (
    <Calendar
      mode="single"
      disabled={[
        { before: today }, // Disable past dates
        { dayOfWeek: [0, 6] }, // Disable weekends
      ]}
      fromDate={today}
      toDate={nextMonth}
    />
  )
}
```

### Custom Caption Layout

```typescript
import { Calendar } from '@torch-ui/components'

function LabelOnly() {
  return (
    <Calendar
      mode="single"
      captionLayout="label" // No dropdowns, labels only
    />
  )
}

function DropdownMonthsOnly() {
  return (
    <Calendar
      mode="single"
      captionLayout="dropdown-months" // Only month dropdown
    />
  )
}
```

### With Footer

```typescript
import { Calendar } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function CalendarWithFooter() {
  const [selected, setSelected] = useState<Date>()

  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={setSelected}
      footer={
        <div className="flex gap-2 p-2">
          <Button onClick={() => setSelected(new Date())}>
            Today
          </Button>
          <Button onClick={() => setSelected(undefined)}>
            Clear
          </Button>
        </div>
      }
    />
  )
}
```

### Multiple Months

```typescript
import { Calendar } from '@torch-ui/components'

function MultipleMonths() {
  return (
    <Calendar
      mode="single"
      numberOfMonths={2}
    />
  )
}
```

### With Min/Max Date Range

```typescript
import { Calendar } from '@torch-ui/components'
import { DateRange } from 'react-day-picker'
import { useState } from 'react'

function RangeWithLimits() {
  const [range, setRange] = useState<DateRange>()

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      min={2} // Minimum 2 days
      max={14} // Maximum 14 days
    />
  )
}
```

### Custom Styling

```typescript
import { Calendar } from '@torch-ui/components'

function StyledCalendar() {
  return (
    <Calendar
      mode="single"
      className="shadow-lg"
      classNames={{
        day: "custom-day-class",
        selected: "custom-selected-class",
      }}
    />
  )
}
```

## API Reference

### Calendar Props

Extends all `DayPicker` props from react-day-picker.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'single' \| 'multiple' \| 'range'` | `'single'` | Selection mode |
| `selected` | `Date \| Date[] \| DateRange` | - | Selected date(s) |
| `onSelect` | `(date) => void` | - | Selection handler |
| `captionLayout` | `'dropdown' \| 'label' \| 'dropdown-months' \| 'dropdown-years'` | `'dropdown'` | Caption/navigation style |
| `showWeekNumber` | `boolean` | `false` | Show week numbers |
| `showOutsideDays` | `boolean` | `true` | Show days from adjacent months |
| `numberOfMonths` | `number` | `1` | Number of months to display |
| `fromDate` | `Date` | - | Earliest selectable date |
| `toDate` | `Date` | - | Latest selectable date |
| `disabled` | `Matcher \| Matcher[]` | - | Dates to disable |
| `min` | `number` | - | Minimum range length (range mode) |
| `max` | `number` | - | Maximum range/multiple count |
| `footer` | `ReactNode` | - | Footer content |
| `className` | `string` | - | Additional CSS classes |
| `classNames` | `object` | - | Custom class names for elements |

### Matcher Types

```typescript
type Matcher =
  | Date
  | { from: Date; to: Date }
  | { before: Date }
  | { after: Date }
  | { dayOfWeek: number[] }
  | ((date: Date) => boolean)
```

## TypeScript

### Full Type Definitions

```typescript
import { DayPicker, DateRange } from 'react-day-picker'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// Common type patterns
type SingleMode = {
  mode: 'single'
  selected?: Date
  onSelect?: (date: Date | undefined) => void
}

type MultipleMode = {
  mode: 'multiple'
  selected?: Date[]
  onSelect?: (dates: Date[] | undefined) => void
  max?: number
}

type RangeMode = {
  mode: 'range'
  selected?: DateRange
  onSelect?: (range: DateRange | undefined) => void
  min?: number
  max?: number
}

export const Calendar: React.FC<CalendarProps>
```

## Common Patterns

### Booking Calendar

```typescript
import { Calendar } from '@torch-ui/components'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

function BookingCalendar() {
  const [range, setRange] = useState<DateRange>()

  const bookedDates = [
    new Date(2024, 0, 15),
    new Date(2024, 0, 16),
    { from: new Date(2024, 0, 20), to: new Date(2024, 0, 22) },
  ]

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      disabled={bookedDates}
      min={1}
      max={30}
      footer={
        range?.from && range?.to && (
          <div className="p-2">
            <p>
              {range.to.getDate() - range.from.getDate()} nights selected
            </p>
          </div>
        )
      }
    />
  )
}
```

### Event Calendar

```typescript
import { Calendar } from '@torch-ui/components'

function EventCalendar({ events }: { events: Event[] }) {
  const eventDates = events.map(e => e.date)

  return (
    <Calendar
      mode="single"
      modifiers={{
        hasEvent: eventDates,
      }}
      modifiersClassNames={{
        hasEvent: 'bg-blue-100 font-bold',
      }}
    />
  )
}
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Calendar } from '@torch-ui/components'

describe('Calendar', () => {
  it('renders current month', () => {
    render(<Calendar mode="single" />)

    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long' })
    expect(screen.getByText(new RegExp(currentMonth))).toBeInTheDocument()
  })

  it('selects a date', () => {
    const handleSelect = jest.fn()

    render(
      <Calendar
        mode="single"
        onSelect={handleSelect}
      />
    )

    const day15 = screen.getByRole('button', { name: /15/ })
    fireEvent.click(day15)

    expect(handleSelect).toHaveBeenCalled()
  })

  it('respects disabled dates', () => {
    render(
      <Calendar
        mode="single"
        disabled={{ before: new Date() }}
      />
    )

    // Test that past dates are disabled
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const yesterdayButton = screen.queryByRole('button', {
      name: new RegExp(yesterday.getDate().toString())
    })

    expect(yesterdayButton).toBeDisabled()
  })
})
```

## Accessibility

- **Keyboard Navigation**:
  - Arrow keys: Navigate between days
  - Enter/Space: Select date
  - Page Up/Down: Navigate months
  - Shift + Page Up/Down: Navigate years
- **ARIA Attributes**: Provided by react-day-picker
- **Screen Readers**: Dates announced with full context
- **Focus Management**: Visible focus indicator on selected day

### Accessibility Best Practices

```typescript
// Provide clear labels
<Calendar
  aria-label="Select a date"
  mode="single"
/>

// Describe disabled dates
<Calendar
  disabled={{ before: new Date() }}
  aria-describedby="date-restrictions"
/>
<p id="date-restrictions">Past dates are not available</p>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~15kb |
| Bundle size (gzipped) | ~5kb |
| Dependencies | react-day-picker (~40kb) |
| Initial render | <20ms |
| Month navigation | <10ms |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Memoize callbacks**:
   ```typescript
   const handleSelect = useCallback((date: Date) => {
     // Handle selection
   }, [])
   ```

2. **Limit number of months**: Don't show more than 2-3 months simultaneously

3. **Use custom modifiers sparingly**: They can impact render performance

## Styling

### Custom Styles

The Calendar component uses CSS variables and can be fully customized:

```typescript
<Calendar
  className="custom-calendar"
  classNames={{
    day: "custom-day",
    selected: "custom-selected",
    today: "custom-today",
    outside: "custom-outside",
    disabled: "custom-disabled",
    range_start: "custom-range-start",
    range_end: "custom-range-end",
    range_middle: "custom-range-middle",
  }}
/>
```

### Default Styling

- Days: 30x30px rounded squares
- Selected: Purple background with border
- Today: Highlighted background
- Range: Connected selection with rounded ends
- Hover: Light purple background

## Migration from react-day-picker

```diff
- import { DayPicker } from 'react-day-picker'
+ import { Calendar } from '@torch-ui/components'

- <DayPicker
+ <Calendar
    mode="single"
    selected={date}
    onSelect={setDate}
- />
+ />
```

The Calendar component provides pre-styled navigation and consistent theming.

## Best Practices

1. **Always specify mode**: Be explicit about selection type
   ```typescript
   <Calendar mode="single" />
   ```

2. **Handle undefined selections**: User can deselect
   ```typescript
   onSelect={(date) => {
     setDate(date || new Date()) // Provide fallback
   }}
   ```

3. **Validate date ranges**: Check min/max constraints
   ```typescript
   <Calendar mode="range" min={1} max={7} />
   ```

4. **Provide visual feedback**: Show selected dates clearly
5. **Disable unavailable dates**: Don't let users select invalid dates
6. **Use appropriate caption layout**: Dropdown for wide date ranges, label for current month
7. **Test keyboard navigation**: Ensure all dates are keyboard accessible

## Related Components

- [DatePicker](./date-picker.md) - Date picker with calendar and time selection
- [SlideDatePicker](./slide-date-picker.md) - Mobile-optimized slide picker
- [Input](./input.md) - Text input for manual date entry
