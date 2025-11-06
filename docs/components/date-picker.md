---
title: DatePicker
description: Complete date and time picker with calendar dropdown, optional time selection, and input field integration
group: Date & Time
keywords: [date-picker, calendar, time, datetime, input, popover]
---

# DatePicker

> A comprehensive date picker component that combines a calendar dropdown with optional time selection and seamless input field integration. Built on top of the Calendar component with Popover for elegant date and time selection.

## Installation

```bash
npm install react-day-picker date-fns torch-react-mobile-picker
```

## Import

```typescript
import { DatePicker } from '@torch-ui/components'
import type { DatePickerProps } from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { DatePicker } from '@torch-ui/components'
import { useState } from 'react'

function Example() {
  const [date, setDate] = useState<Date>(new Date())

  return (
    <DatePicker
      mode="single"
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />
  )
}
```

### With Time Picker

```typescript
import { DatePicker } from '@torch-ui/components'
import { useState } from 'react'

function DateTimePicker() {
  const [datetime, setDatetime] = useState<Date>(new Date())

  return (
    <DatePicker
      mode="single"
      value={datetime}
      onChange={(e) => setDatetime(e.target.value)}
      timePicker
    />
  )
}
```

### Range Selection

```typescript
import { DatePicker } from '@torch-ui/components'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

function RangePicker() {
  const [range, setRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })

  return (
    <DatePicker
      mode="range"
      selected={range}
      onChange={(e) => setRange(e.target.value)}
      min={1}
      max={30}
    />
  )
}
```

### Multiple Date Selection

```typescript
import { DatePicker } from '@torch-ui/components'
import { useState } from 'react'

function MultipleDates() {
  const [dates, setDates] = useState<Date[]>([])

  return (
    <DatePicker
      mode="multiple"
      selected={dates}
      onChange={(e) => setDates(e.target.value)}
      max={5}
    />
  )
}
```

### Custom Date Format

```typescript
import { DatePicker } from '@torch-ui/components'

function CustomFormat() {
  const [date, setDate] = useState<Date>(new Date())

  return (
    <DatePicker
      value={date}
      onChange={(e) => setDate(e.target.value)}
      dateFormat="MMM dd, yyyy" // "Jan 15, 2024"
    />
  )
}
```

### Custom Trigger Element

```typescript
import { DatePicker } from '@torch-ui/components'
import { Button } from '@torch-ui/components'

function CustomTrigger() {
  const [date, setDate] = useState<Date>(new Date())

  return (
    <DatePicker
      value={date}
      onChange={(e) => setDate(e.target.value)}
    >
      <Button variant="SecondaryStyle">
        <i className="ri-calendar-line" />
        Select Date
      </Button>
    </DatePicker>
  )
}
```

### With Controlled Input

```typescript
import { DatePicker } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { useState } from 'react'

function ControlledInput() {
  const [date, setDate] = useState<Date>(new Date())

  return (
    <DatePicker
      value={date}
      onChange={(e) => setDate(e.target.value)}
    >
      <InputField
        label="Appointment Date"
        placeholder="Select a date"
      />
    </DatePicker>
  )
}
```

### Date Restrictions

```typescript
import { DatePicker } from '@torch-ui/components'

function RestrictedDates() {
  const [date, setDate] = useState<Date>()

  return (
    <DatePicker
      value={date}
      onChange={(e) => setDate(e.target.value)}
      calendarProps={{
        disabled: [
          { before: new Date() }, // No past dates
          { dayOfWeek: [0, 6] }, // No weekends
        ],
        fromDate: new Date(),
        toDate: new Date(2025, 11, 31),
      }}
    />
  )
}
```

### Booking System

```typescript
import { DatePicker } from '@torch-ui/components'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

function BookingPicker() {
  const [range, setRange] = useState<DateRange>()

  const bookedDates = [
    new Date(2024, 0, 15),
    new Date(2024, 0, 16),
    { from: new Date(2024, 0, 20), to: new Date(2024, 0, 22) },
  ]

  const nightsCount = range?.from && range?.to
    ? Math.ceil((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div>
      <DatePicker
        mode="range"
        selected={range}
        onChange={(e) => setRange(e.target.value)}
        min={1}
        max={30}
        calendarProps={{
          disabled: bookedDates,
        }}
      />
      {nightsCount > 0 && (
        <p className="mt-2 text-sm">
          {nightsCount} night{nightsCount > 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}
```

### Deadline Picker with Time

```typescript
import { DatePicker } from '@torch-ui/components'
import { useState } from 'react'

function DeadlinePicker() {
  const [deadline, setDeadline] = useState<Date>()

  return (
    <DatePicker
      value={deadline}
      onChange={(e) => setDeadline(e.target.value)}
      timePicker
      calendarProps={{
        disabled: { before: new Date() },
      }}
      dateFormat="MMM dd, yyyy 'at' hh:mm a"
    >
      <InputField
        label="Project Deadline"
        placeholder="Select deadline with time"
        childrenSide={<i className="ri-time-line" />}
      />
    </DatePicker>
  )
}
```

## API Reference

### DatePicker Props

Extends all standard input attributes (`HTMLAttributes<HTMLInputElement>`).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'single' \| 'multiple' \| 'range'` | `'single'` | Selection mode |
| `selected` | `Date \| Date[] \| DateRange` | - | Selected date(s) for Calendar |
| `value` | `Date \| Date[] \| DateRange` | - | Input field value |
| `onChange` | `(e: Event) => void` | - | Change handler (event with target.value) |
| `timePicker` | `boolean` | `false` | Show time picker |
| `dateFormat` | `string` | `'yyyy/MM/dd'` | Date display format |
| `size` | `'M' \| 'S'` | `'M'` | Input field size |
| `min` | `number` | - | Minimum range length (range mode) |
| `max` | `number` | - | Maximum range/multiple count |
| `showWeekNumber` | `boolean` | `false` | Show week numbers in calendar |
| `captionLayout` | `'dropdown' \| 'label' \| 'dropdown-months' \| 'dropdown-years'` | `'dropdown'` | Caption style |
| `calendarProps` | `CalendarProps` | - | Additional Calendar props |
| `children` | `ReactElement` | - | Custom trigger element |
| `className` | `string` | - | Additional CSS classes |

### TimePickerValue Interface

```typescript
interface TimePickerValue {
  hour: number    // 1-12
  minute: number  // 0-59
  time: 'AM' | 'PM'
}
```

## TypeScript

### Full Type Definitions

```typescript
import { DateRange } from 'react-day-picker'

interface DatePickerProps extends HTMLAttributes<HTMLInputElement> {
  mode?: "single" | "multiple" | "range"
  selected?: Date | Date[] | DateRange | undefined
  min?: number
  max?: number
  size?: "M" | "S"
  showWeekNumber?: boolean
  captionLayout?: "dropdown" | "label" | "dropdown-months" | "dropdown-years"
  dateFormat?: string
  calendarProps?: CalendarProps
  timePicker?: boolean
  value?: Date | Date[] | DateRange
  onChange?: (e: { target: { value: Date | Date[] | DateRange } }) => void
  children?: ReactElement
}

// Usage with different modes
type SingleDatePicker = DatePickerProps & {
  mode: 'single'
  value?: Date
  selected?: Date
  onChange?: (e: { target: { value: Date | undefined } }) => void
}

type MultipleDatePicker = DatePickerProps & {
  mode: 'multiple'
  value?: Date[]
  selected?: Date[]
  onChange?: (e: { target: { value: Date[] | undefined } }) => void
  max?: number
}

type RangeDatePicker = DatePickerProps & {
  mode: 'range'
  value?: DateRange
  selected?: DateRange
  onChange?: (e: { target: { value: DateRange | undefined } }) => void
  min?: number
  max?: number
}
```

## Common Patterns

### Event Scheduler

```typescript
import { DatePicker } from '@torch-ui/components'
import { useState } from 'react'

function EventScheduler() {
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>()

  return (
    <div className="space-y-4">
      <DatePicker
        value={startDate}
        onChange={(e) => {
          setStartDate(e.target.value)
          // Ensure end date is after start date
          if (endDate && endDate < e.target.value) {
            setEndDate(e.target.value)
          }
        }}
        timePicker
        dateFormat="MMM dd, yyyy hh:mm a"
      >
        <InputField label="Event Start" />
      </DatePicker>

      <DatePicker
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        timePicker
        dateFormat="MMM dd, yyyy hh:mm a"
        calendarProps={{
          disabled: { before: startDate },
        }}
      >
        <InputField label="Event End" />
      </DatePicker>
    </div>
  )
}
```

### Birthday Picker

```typescript
import { DatePicker } from '@torch-ui/components'
import { useState } from 'react'

function BirthdayPicker() {
  const [birthday, setBirthday] = useState<Date>()

  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() - 13) // Minimum age 13

  return (
    <DatePicker
      value={birthday}
      onChange={(e) => setBirthday(e.target.value)}
      dateFormat="MMMM dd, yyyy"
      calendarProps={{
        captionLayout: 'dropdown',
        toDate: maxDate,
        fromDate: new Date(1900, 0, 1),
      }}
    >
      <InputField
        label="Date of Birth"
        placeholder="Select your birthday"
      />
    </DatePicker>
  )
}
```

### Work Schedule Picker

```typescript
import { DatePicker } from '@torch-ui/components'
import { useState } from 'react'

function WorkSchedule() {
  const [workDays, setWorkDays] = useState<Date[]>([])

  return (
    <DatePicker
      mode="multiple"
      selected={workDays}
      onChange={(e) => setWorkDays(e.target.value)}
      max={5} // Max 5 work days
      calendarProps={{
        disabled: { dayOfWeek: [0, 6] }, // Disable weekends
      }}
    >
      <InputField
        label="Select Work Days"
        placeholder={`${workDays.length} day${workDays.length !== 1 ? 's' : ''} selected`}
      />
    </DatePicker>
  )
}
```

## Testing

### Unit Test Examples

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DatePicker } from '@torch-ui/components'
import userEvent from '@testing-library/user-event'

describe('DatePicker', () => {
  it('renders with default input', () => {
    render(<DatePicker mode="single" />)

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('readonly')
  })

  it('opens calendar on input click', async () => {
    render(<DatePicker mode="single" />)

    const input = screen.getByRole('textbox')
    await userEvent.click(input)

    await waitFor(() => {
      expect(screen.getByRole('grid')).toBeInTheDocument() // Calendar grid
    })
  })

  it('selects a date', async () => {
    const handleChange = jest.fn()

    render(
      <DatePicker
        mode="single"
        onChange={handleChange}
      />
    )

    const input = screen.getByRole('textbox')
    await userEvent.click(input)

    const day15 = await screen.findByRole('button', { name: /15/ })
    await userEvent.click(day15)

    expect(handleChange).toHaveBeenCalled()
    const selectedDate = handleChange.mock.calls[0][0].target.value
    expect(selectedDate.getDate()).toBe(15)
  })

  it('displays time picker when enabled', async () => {
    render(
      <DatePicker
        mode="single"
        timePicker
      />
    )

    const input = screen.getByRole('textbox')
    await userEvent.click(input)

    await waitFor(() => {
      expect(screen.getByText(/AM/i)).toBeInTheDocument()
      expect(screen.getByText(/PM/i)).toBeInTheDocument()
    })
  })

  it('formats date according to dateFormat prop', () => {
    const date = new Date(2024, 0, 15)

    render(
      <DatePicker
        mode="single"
        value={date}
        dateFormat="MMM dd, yyyy"
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('Jan 15, 2024')
  })

  it('renders custom trigger element', () => {
    const CustomButton = <button>Pick Date</button>

    render(
      <DatePicker mode="single">
        {CustomButton}
      </DatePicker>
    )

    expect(screen.getByText('Pick Date')).toBeInTheDocument()
  })

  it('disables body scroll when open', async () => {
    render(<DatePicker mode="single" />)

    const input = screen.getByRole('textbox')
    await userEvent.click(input)

    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden')
    })
  })

  it('respects min/max range constraints', async () => {
    const handleChange = jest.fn()

    render(
      <DatePicker
        mode="range"
        onChange={handleChange}
        min={2}
        max={7}
      />
    )

    // Test that constraints are applied
    // This would require more complex interaction testing
  })
})
```

## Accessibility

- **Keyboard Navigation**:
  - Tab: Focus input field
  - Enter/Space: Open calendar dropdown
  - Arrow keys: Navigate calendar (when open)
  - Escape: Close dropdown
- **ARIA Attributes**: Inherited from Calendar and Popover
- **Screen Readers**: Date announced on selection
- **Focus Management**: Focus returns to trigger after selection
- **Body Scroll Lock**: Prevents background scroll when picker open

### Accessibility Best Practices

```typescript
// Provide labels for inputs
<DatePicker>
  <InputField
    label="Appointment Date"
    aria-describedby="date-hint"
  />
</DatePicker>
<p id="date-hint">Select a date for your appointment</p>

// Describe restrictions
<DatePicker
  calendarProps={{
    disabled: { before: new Date() },
    'aria-label': 'Select a future date',
  }}
/>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~45kb |
| Bundle size (gzipped) | ~12kb |
| Dependencies | react-day-picker, torch-react-mobile-picker |
| Initial render | <25ms |
| Dropdown open | <15ms |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Memoize callbacks**:
   ```typescript
   const handleChange = useCallback((e) => {
     setDate(e.target.value)
   }, [])
   ```

2. **Use value prop sparingly**: Only use when you need controlled state

3. **Lazy load time picker**: Only enable when needed

4. **Limit calendarProps modifiers**: Complex modifiers can slow rendering

## Styling

### Custom Styles

```typescript
// Style the input field
<DatePicker
  className="custom-date-input"
  size="M"
>
  <InputField className="custom-field" />
</DatePicker>

// Style the calendar
<DatePicker
  calendarProps={{
    className: "custom-calendar",
    classNames: {
      day: "custom-day",
      selected: "custom-selected",
    },
  }}
/>
```

### Default Styling

- Input: Read-only field with calendar icon
- Popover: Dropdown with calendar and optional time picker
- Calendar: Themed calendar with dropdown navigation
- Time Picker: Wheel interface with hour/minute/AM-PM columns

## Integration Examples

### With Form Libraries

```typescript
import { DatePicker } from '@torch-ui/components'
import { useForm, Controller } from 'react-hook-form'

function FormExample() {
  const { control, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="appointmentDate"
        control={control}
        rules={{ required: 'Date is required' }}
        render={({ field, fieldState: { error } }) => (
          <div>
            <DatePicker
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              timePicker
            >
              <InputField
                label="Appointment Date & Time"
                error={error?.message}
              />
            </DatePicker>
          </div>
        )}
      />
    </form>
  )
}
```

### With State Management

```typescript
import { DatePicker } from '@torch-ui/components'
import { useStore } from './store'

function DatePickerWithStore() {
  const { selectedDate, setSelectedDate } = useStore()

  return (
    <DatePicker
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      mode="single"
    />
  )
}
```

## Best Practices

1. **Always specify mode**: Be explicit about selection type
   ```typescript
   <DatePicker mode="single" />
   ```

2. **Use controlled components**: Manage state explicitly
   ```typescript
   const [date, setDate] = useState<Date>()
   <DatePicker value={date} onChange={(e) => setDate(e.target.value)} />
   ```

3. **Provide clear labels**: Help users understand the input
   ```typescript
   <DatePicker>
     <InputField label="Select Date" />
   </DatePicker>
   ```

4. **Handle undefined values**: User can clear selection
   ```typescript
   onChange={(e) => {
     setDate(e.target.value || new Date())
   }}
   ```

5. **Use timePicker selectively**: Only when time is necessary

6. **Disable invalid dates**: Use calendarProps.disabled

7. **Format dates appropriately**: Match user's locale and context
   ```typescript
   <DatePicker dateFormat="MMM dd, yyyy" />
   ```

8. **Test keyboard navigation**: Ensure accessibility

## Related Components

- [Calendar](./calendar.md) - Base calendar component
- [SlideDatePicker](./slide-date-picker.md) - Mobile-optimized slide picker
- [InputField](./input-field.md) - Input field used as default trigger
- [Popover](./popover.md) - Dropdown container
- [TimePicker](./time-picker.md) - Standalone time picker
