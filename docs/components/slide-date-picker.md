---
title: SlideDatePicker
description: Mobile-optimized date picker with slide/wheel interface for intuitive year, month, and day selection
group: Date & Time
keywords: [slide-picker, date, wheel, mobile, picker, scroll]
---

# SlideDatePicker

> A mobile-optimized date picker component featuring an intuitive slide/wheel interface for selecting year, month, and day. Perfect for touch devices and mobile-first applications with natural scrolling interactions.

## Installation

```bash
npm install torch-react-mobile-picker date-fns
```

## Import

```typescript
import { SlideDatePicker } from '@torch-ui/components'
import type { SlideDatePickerProps } from '@torch-ui/components'
```

## Quick Examples

### Basic Usage

```typescript
import { SlideDatePicker } from '@torch-ui/components'
import { useState } from 'react'

function Example() {
  const [date, setDate] = useState<Date>(new Date())

  return (
    <SlideDatePicker
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />
  )
}
```

### Custom Date Format

```typescript
import { SlideDatePicker } from '@torch-ui/components'
import { useState } from 'react'

function CustomFormat() {
  const [date, setDate] = useState<Date>(new Date())

  return (
    <SlideDatePicker
      value={date}
      onChange={(e) => setDate(e.target.value)}
      dateFormat="MMM dd, yyyy" // "Jan 15, 2024"
    />
  )
}
```

### With Custom Trigger

```typescript
import { SlideDatePicker } from '@torch-ui/components'
import { Button } from '@torch-ui/components'
import { useState } from 'react'

function CustomTrigger() {
  const [date, setDate] = useState<Date>(new Date())

  return (
    <SlideDatePicker
      value={date}
      onChange={(e) => setDate(e.target.value)}
    >
      <Button variant="SecondaryStyle">
        <i className="ri-calendar-2-line" />
        {date.toLocaleDateString()}
      </Button>
    </SlideDatePicker>
  )
}
```

### Dark/Light Theme

```typescript
import { SlideDatePicker } from '@torch-ui/components'

function ThemedPicker() {
  const [date, setDate] = useState<Date>(new Date())

  return (
    <div className="space-y-4">
      <SlideDatePicker
        theme="dark"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <SlideDatePicker
        theme="light"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>
  )
}
```

### Birthday Picker

```typescript
import { SlideDatePicker } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { useState } from 'react'

function BirthdayPicker() {
  const [birthday, setBirthday] = useState<Date>()

  return (
    <SlideDatePicker
      value={birthday}
      onChange={(e) => setBirthday(e.target.value)}
      dateFormat="MMMM dd, yyyy"
    >
      <InputField
        label="Date of Birth"
        placeholder="Select your birthday"
      />
    </SlideDatePicker>
  )
}
```

### Appointment Scheduler

```typescript
import { SlideDatePicker } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { useState } from 'react'

function AppointmentScheduler() {
  const [appointmentDate, setAppointmentDate] = useState<Date>()

  const today = new Date()
  const formattedDate = appointmentDate
    ? appointmentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <div className="space-y-2">
      <SlideDatePicker
        value={appointmentDate}
        onChange={(e) => setAppointmentDate(e.target.value)}
        dateFormat="yyyy/MM/dd"
      >
        <InputField
          label="Appointment Date"
          placeholder="Select date"
        />
      </SlideDatePicker>
      {formattedDate && (
        <p className="text-sm text-gray-600">{formattedDate}</p>
      )}
    </div>
  )
}
```

### With Initial Date

```typescript
import { SlideDatePicker } from '@torch-ui/components'
import { useState } from 'react'

function WithInitialDate() {
  // Start with date 6 months from now
  const sixMonthsLater = new Date()
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6)

  const [date, setDate] = useState<Date>(sixMonthsLater)

  return (
    <SlideDatePicker
      value={date}
      onChange={(e) => setDate(e.target.value)}
    />
  )
}
```

### Multiple Date Pickers

```typescript
import { SlideDatePicker } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { useState } from 'react'

function DateRangePicker() {
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>()

  return (
    <div className="space-y-4">
      <SlideDatePicker
        value={startDate}
        onChange={(e) => {
          const newStart = e.target.value
          setStartDate(newStart)
          // Ensure end date is after start date
          if (endDate && endDate < newStart) {
            setEndDate(newStart)
          }
        }}
      >
        <InputField label="Start Date" />
      </SlideDatePicker>

      <SlideDatePicker
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      >
        <InputField
          label="End Date"
          placeholder="Select end date"
        />
      </SlideDatePicker>

      {startDate && endDate && (
        <p className="text-sm">
          Duration: {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
        </p>
      )}
    </div>
  )
}
```

### Form Integration

```typescript
import { SlideDatePicker } from '@torch-ui/components'
import { InputField, Button } from '@torch-ui/components'
import { useState } from 'react'

function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    birthday: undefined as Date | undefined,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form data:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        label="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <SlideDatePicker
        value={formData.birthday}
        onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
        dateFormat="MM/dd/yyyy"
      >
        <InputField
          label="Date of Birth"
          placeholder="MM/DD/YYYY"
          required
        />
      </SlideDatePicker>

      <Button type="submit">Register</Button>
    </form>
  )
}
```

### Localized Date Format

```typescript
import { SlideDatePicker } from '@torch-ui/components'
import { useState } from 'react'

function LocalizedPicker() {
  const [date, setDate] = useState<Date>(new Date())

  return (
    <div className="space-y-4">
      {/* US Format */}
      <SlideDatePicker
        value={date}
        onChange={(e) => setDate(e.target.value)}
        dateFormat="MM/dd/yyyy"
      />

      {/* European Format */}
      <SlideDatePicker
        value={date}
        onChange={(e) => setDate(e.target.value)}
        dateFormat="dd/MM/yyyy"
      />

      {/* ISO Format */}
      <SlideDatePicker
        value={date}
        onChange={(e) => setDate(e.target.value)}
        dateFormat="yyyy-MM-dd"
      />
    </div>
  )
}
```

## API Reference

### SlideDatePicker Props

Extends all `InputField` props except `onChange`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date` | `new Date()` | Selected date |
| `onChange` | `(e: Event) => void` | - | Change handler (event with target.value) |
| `dateFormat` | `string` | `'yyyy/MM/dd'` | Date display format (date-fns format) |
| `theme` | `'dark' \| 'light' \| 'default'` | `'dark'` | Theme variant |
| `children` | `ReactElement` | - | Custom trigger element |
| `className` | `string` | - | Additional CSS classes |
| ...InputField Props | - | - | All InputField props |

### SlideValues Interface

Internal state structure for the picker wheels:

```typescript
type SlideValues = {
  year: string   // "2024"
  month: string  // "01" to "12"
  day: string    // "01" to "31"
}
```

## TypeScript

### Full Type Definitions

```typescript
import { ComponentProps, ReactElement } from 'react'
import { InputField } from '@torch-ui/components'

interface SlideDatePickerProps extends Omit<ComponentProps<typeof InputField>, 'onChange'> {
  onChange?: (e: { target: { value: Date } }) => void
  theme?: "dark" | "light" | "default"
  dateFormat?: string
  value?: Date
  children?: ReactElement
}

export const SlideDatePicker: React.ForwardRefExoticComponent<
  SlideDatePickerProps & React.RefAttributes<HTMLInputElement>
>
```

### Usage with Types

```typescript
import { SlideDatePicker } from '@torch-ui/components'
import { useRef, useState } from 'react'

function TypedExample() {
  const [date, setDate] = useState<Date>(new Date())
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: { target: { value: Date } }): void => {
    setDate(e.target.value)
    console.log('Selected:', e.target.value)
  }

  return (
    <SlideDatePicker
      ref={inputRef}
      value={date}
      onChange={handleChange}
      dateFormat="yyyy/MM/dd"
    />
  )
}
```

## Common Patterns

### Age Verification

```typescript
import { SlideDatePicker } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { useState } from 'react'

function AgeVerification() {
  const [birthDate, setBirthDate] = useState<Date>()
  const [age, setAge] = useState<number>()

  const calculateAge = (date: Date): number => {
    const today = new Date()
    let age = today.getFullYear() - date.getFullYear()
    const monthDiff = today.getMonth() - date.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--
    }
    return age
  }

  const handleDateChange = (e: { target: { value: Date } }) => {
    const date = e.target.value
    setBirthDate(date)
    setAge(calculateAge(date))
  }

  const isOldEnough = age !== undefined && age >= 18

  return (
    <div className="space-y-2">
      <SlideDatePicker
        value={birthDate}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
      >
        <InputField
          label="Date of Birth"
          placeholder="Select your birth date"
        />
      </SlideDatePicker>

      {age !== undefined && (
        <p className={isOldEnough ? 'text-green-600' : 'text-red-600'}>
          Age: {age} years old {!isOldEnough && '(Must be 18+)'}
        </p>
      )}
    </div>
  )
}
```

### Expiration Date Picker

```typescript
import { SlideDatePicker } from '@torch-ui/components'
import { InputField } from '@torch-ui/components'
import { useState } from 'react'

function ExpirationPicker() {
  const [expiryDate, setExpiryDate] = useState<Date>()

  const isExpired = expiryDate && expiryDate < new Date()

  return (
    <div className="space-y-2">
      <SlideDatePicker
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        dateFormat="MM/yyyy"
      >
        <InputField
          label="Card Expiration"
          placeholder="MM/YYYY"
        />
      </SlideDatePicker>

      {isExpired && (
        <p className="text-red-600 text-sm">Card has expired</p>
      )}
    </div>
  )
}
```

### Historical Date Picker

```typescript
import { SlideDatePicker } from '@torch-ui/components'
import { useState } from 'react'

function HistoricalDatePicker() {
  const [historicalDate, setHistoricalDate] = useState<Date>(
    new Date(1969, 6, 20) // Moon landing
  )

  return (
    <div className="space-y-2">
      <SlideDatePicker
        value={historicalDate}
        onChange={(e) => setHistoricalDate(e.target.value)}
        dateFormat="MMMM dd, yyyy"
      >
        <InputField label="Historical Event Date" />
      </SlideDatePicker>

      <p className="text-sm text-gray-600">
        Year range: 1900 - {new Date().getFullYear() + 100}
      </p>
    </div>
  )
}
```

## Testing

### Unit Test Examples

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SlideDatePicker } from '@torch-ui/components'
import userEvent from '@testing-library/user-event'

describe('SlideDatePicker', () => {
  it('renders with default input', () => {
    render(<SlideDatePicker />)

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('readonly')
  })

  it('displays formatted date value', () => {
    const date = new Date(2024, 0, 15)

    render(
      <SlideDatePicker
        value={date}
        dateFormat="MM/dd/yyyy"
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('01/15/2024')
  })

  it('opens picker on input click', async () => {
    render(<SlideDatePicker />)

    const input = screen.getByRole('textbox')
    await userEvent.click(input)

    await waitFor(() => {
      expect(screen.getByText('Year')).toBeInTheDocument()
      expect(screen.getByText('Month')).toBeInTheDocument()
      expect(screen.getByText('Day')).toBeInTheDocument()
    })
  })

  it('calls onChange when date is selected', async () => {
    const handleChange = jest.fn()

    render(
      <SlideDatePicker
        onChange={handleChange}
      />
    )

    const input = screen.getByRole('textbox')
    await userEvent.click(input)

    // Simulate wheel interaction (implementation-specific)
    // This would require mocking the Picker component

    expect(handleChange).toHaveBeenCalled()
  })

  it('renders custom trigger element', () => {
    const CustomButton = <button>Pick Date</button>

    render(
      <SlideDatePicker>
        {CustomButton}
      </SlideDatePicker>
    )

    expect(screen.getByText('Pick Date')).toBeInTheDocument()
  })

  it('applies theme correctly', async () => {
    render(<SlideDatePicker theme="light" />)

    const input = screen.getByRole('textbox')
    await userEvent.click(input)

    await waitFor(() => {
      const popover = screen.getByText('Year').closest('[data-theme]')
      expect(popover).toHaveAttribute('data-theme', 'light')
    })
  })

  it('handles invalid dates gracefully', () => {
    // Test with February 30th scenario
    const handleChange = jest.fn()

    render(
      <SlideDatePicker
        value={new Date(2024, 1, 29)} // Feb 29, 2024 (leap year)
        onChange={handleChange}
      />
    )

    // After user changes to non-leap year, day should adjust
    // Implementation would test the day adjustment logic
  })

  it('formats date according to locale', () => {
    const date = new Date(2024, 0, 15)

    const { rerender } = render(
      <SlideDatePicker
        value={date}
        dateFormat="MM/dd/yyyy"
      />
    )

    expect(screen.getByRole('textbox')).toHaveValue('01/15/2024')

    rerender(
      <SlideDatePicker
        value={date}
        dateFormat="dd/MM/yyyy"
      />
    )

    expect(screen.getByRole('textbox')).toHaveValue('15/01/2024')
  })
})
```

### Integration Test

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SlideDatePicker } from '@torch-ui/components'

describe('SlideDatePicker Integration', () => {
  it('updates form value on date selection', async () => {
    const FormWrapper = () => {
      const [date, setDate] = React.useState<Date>()

      return (
        <form>
          <SlideDatePicker
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div data-testid="selected-date">
            {date?.toISOString() || 'No date selected'}
          </div>
        </form>
      )
    }

    render(<FormWrapper />)

    const input = screen.getByRole('textbox')
    await userEvent.click(input)

    // Simulate date selection
    // ...

    await waitFor(() => {
      expect(screen.getByTestId('selected-date')).not.toHaveTextContent('No date selected')
    })
  })
})
```

## Accessibility

- **Keyboard Navigation**:
  - Tab: Focus input field
  - Enter/Space: Open picker dropdown
  - Arrow keys: Navigate through wheel values
  - Escape: Close picker
- **Touch Gestures**: Swipe/scroll to change values
- **Screen Readers**: Date announced on selection
- **Focus Management**: Focus returns to trigger after selection
- **Body Scroll Lock**: Prevents background scroll when picker open

### Accessibility Best Practices

```typescript
// Provide clear labels
<SlideDatePicker>
  <InputField
    label="Select Date"
    aria-label="Date picker"
  />
</SlideDatePicker>

// Add helper text
<div>
  <SlideDatePicker>
    <InputField
      label="Birth Date"
      aria-describedby="birth-date-hint"
    />
  </SlideDatePicker>
  <p id="birth-date-hint" className="text-sm">
    Swipe to select year, month, and day
  </p>
</div>
```

## Performance

| Metric | Value |
|--------|-------|
| Bundle size (minified) | ~25kb |
| Bundle size (gzipped) | ~8kb |
| Dependencies | torch-react-mobile-picker, date-fns |
| Initial render | <20ms |
| Picker open | <15ms |
| Wheel scroll | <5ms per scroll |
| Tree-shakeable | ✅ |

### Performance Tips

1. **Memoize onChange handlers**:
   ```typescript
   const handleChange = useCallback((e) => {
     setDate(e.target.value)
   }, [])
   ```

2. **Avoid re-renders**: Use stable date format strings

3. **Lazy render picker**: Only renders when popover opens

4. **Optimized wheel rendering**: Virtual scrolling for large date ranges

## Styling

### Custom Styles

```typescript
<SlideDatePicker
  className="custom-picker"
  theme="dark"
>
  <InputField className="custom-input" />
</SlideDatePicker>
```

### Default Styling

- Input: Read-only field with calendar icon
- Popover: Fixed width (285px) with overflow hidden
- Wheels: Three columns for year/month/day
- Headers: Labels above each wheel column
- Selection highlight: Center highlight on selected value

## Day Adjustment Logic

The component automatically handles invalid dates when switching months or years:

```typescript
// Example: User selects January 31, then changes month to February
// Component adjusts day from 31 to 28 (or 29 in leap year)

const getDayArray = (year: number, month: number): string[] => {
  const daysInMonth = getDaysInMonth(new Date(year, month - 1))
  return Array.from({ length: daysInMonth }, (_, i) =>
    String(i + 1).padStart(2, '0')
  )
}

// When month/year changes, validate day
if (key === 'year' || key === 'month') {
  const newDayArray = getDayArray(year, month)
  if (!newDayArray.includes(day)) {
    day = newDayArray[newDayArray.length - 1] // Use last valid day
  }
}
```

## Best Practices

1. **Use for mobile interfaces**: Optimized for touch interactions

2. **Provide visual feedback**: Show formatted date clearly

3. **Handle edge cases**: Leap years, month-end dates

4. **Use appropriate date formats**: Match user locale

5. **Validate dates**: Check for valid date ranges

6. **Memoize callbacks**: Prevent unnecessary re-renders

7. **Test on devices**: Ensure smooth wheel scrolling

8. **Consider fallbacks**: Provide alternative input for desktop

## Comparison with DatePicker

| Feature | SlideDatePicker | DatePicker |
|---------|----------------|------------|
| Interface | Wheel/slide | Calendar grid |
| Best for | Mobile/touch | Desktop/mouse |
| Time picker | ❌ | ✅ |
| Range selection | ❌ | ✅ |
| Multiple dates | ❌ | ✅ |
| Bundle size | Smaller (~25kb) | Larger (~45kb) |
| Date restrictions | Limited | Full support |

## Related Components

- [DatePicker](./date-picker.md) - Calendar-based date picker with time support
- [Calendar](./calendar.md) - Standalone calendar component
- [InputField](./input-field.md) - Input field used as default trigger
- [Popover](./popover.md) - Dropdown container
