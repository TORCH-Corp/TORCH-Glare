---
title: Utilities Reference
description: Helper functions and utility modules in TORCH Glare Components Library.
category: Reference
tags: [utilities, helpers, functions, date, styles, resize]
related:
  - Types Reference
  - Hooks Reference
---

# Utilities Reference

Complete reference of helper functions and utility modules available in TORCH Glare.

## Table of Contents

- [Class Name Utilities](#class-name-utilities)
- [Date & Time Utilities](#date--time-utilities)
- [Resize Utilities](#resize-utilities)
- [Type Utilities](#type-utilities)

---

## Class Name Utilities

### cn

Utility function to merge and deduplicate Tailwind CSS classes.

**Import:**
```typescript
import { cn } from '@torch-ai/torch-glare/utils';
```

**Signature:**
```typescript
function cn(...inputs: ClassValue[]): string
```

**Parameters:**
- `...inputs`: `ClassValue[]` - Any number of class values to merge

**Returns:**
- `string` - Merged and deduplicated class names

**Examples:**

#### Basic Usage

```typescript
import { cn } from '@torch-ai/torch-glare/utils';

// Merge multiple classes
cn('px-4 py-2', 'bg-blue-500', 'text-white')
// Returns: "px-4 py-2 bg-blue-500 text-white"
```

#### Conditional Classes

```typescript
const isActive = true;
const isDisabled = false;

cn(
  'base-class',
  isActive && 'active-class',
  isDisabled && 'disabled-class'
)
// Returns: "base-class active-class"
```

#### Object Syntax

```typescript
cn({
  'text-white': true,
  'bg-blue-500': true,
  'hover:bg-blue-600': true,
  'opacity-50': false
})
// Returns: "text-white bg-blue-500 hover:bg-blue-600"
```

#### Array Syntax

```typescript
cn([
  'px-4',
  'py-2',
  ['rounded', 'shadow'],
  { 'bg-blue-500': true }
])
// Returns: "px-4 py-2 rounded shadow bg-blue-500"
```

#### Deduplicating Conflicts

```typescript
// Later classes override earlier ones
cn('px-2 py-1', 'px-4 py-2')
// Returns: "px-4 py-2"

// Works with Tailwind modifiers
cn('hover:text-blue-500', 'hover:text-red-500')
// Returns: "hover:text-red-500"
```

#### Component Usage

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function Button({ variant = 'primary', size = 'md', className }: ButtonProps) {
  return (
    <button
      className={cn(
        // Base classes
        'rounded font-medium',

        // Variant classes
        {
          'bg-blue-500 text-white': variant === 'primary',
          'bg-gray-200 text-gray-800': variant === 'secondary',
        },

        // Size classes
        {
          'px-2 py-1 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },

        // Custom classes (overrides defaults)
        className
      )}
    >
      Click me
    </button>
  );
}
```

**Use Cases:**
- Merging component class names
- Handling conditional styling
- Deduplicating Tailwind classes
- Combining base and custom styles

**Related:**
- Uses [clsx](https://github.com/lukeed/clsx) internally
- Uses [tailwind-merge](https://github.com/dcastil/tailwind-merge) for deduplication

---

## Date & Time Utilities

Utilities for working with dates, times, and date pickers.

### applyTimeToDate

Applies time from a picker to a date object.

**Import:**
```typescript
import { applyTimeToDate } from '@torch-ai/torch-glare/utils';
```

**Signature:**
```typescript
function applyTimeToDate(
  date: Date,
  timePickerValue: TimePickerValue
): Date
```

**Parameters:**
- `date`: `Date` - The base date to apply time to
- `timePickerValue`: `TimePickerValue` - Object with hour, minute, and AM/PM

**Returns:**
- `Date` - New Date object with applied time

**Example:**

```typescript
const date = new Date('2024-01-15');
const time = {
  hour: '02',
  minute: '30',
  time: 'PM'
};

const result = applyTimeToDate(date, time);
// Result: Date object with time set to 14:30 (2:30 PM)
```

---

### isValidDateObject

Validates if a value is a valid Date object.

**Import:**
```typescript
import { isValidDateObject } from '@torch-ai/torch-glare/utils';
```

**Signature:**
```typescript
function isValidDateObject(date: Date): boolean
```

**Parameters:**
- `date`: `Date` - The date to validate

**Returns:**
- `boolean` - True if valid Date, false otherwise

**Examples:**

```typescript
import { isValidDateObject } from '@torch-ai/torch-glare/utils';

isValidDateObject(new Date())
// Returns: true

isValidDateObject(new Date('2024-01-15'))
// Returns: true

isValidDateObject(new Date('invalid'))
// Returns: false

isValidDateObject(null)
// Returns: false
```

---

### applyTimeToDateValue

Applies time to various date value types (single, array, or range).

**Import:**
```typescript
import { applyTimeToDateValue } from '@torch-ai/torch-glare/utils';
```

**Signature:**
```typescript
function applyTimeToDateValue(
  dateValue: Date | Date[] | DateRange | undefined,
  timePickerValue: TimePickerValue
): Date | Date[] | DateRange | undefined
```

**Parameters:**
- `dateValue`: `Date | Date[] | DateRange | undefined` - Date value to process
- `timePickerValue`: `TimePickerValue` - Time to apply

**Returns:**
- Same type as input with time applied

**Examples:**

#### Single Date

```typescript
const date = new Date('2024-01-15');
const time = { hour: '02', minute: '30', time: 'PM' };

applyTimeToDateValue(date, time)
// Returns: Date with time 14:30
```

#### Date Array

```typescript
const dates = [
  new Date('2024-01-15'),
  new Date('2024-01-16')
];
const time = { hour: '09', minute: '00', time: 'AM' };

applyTimeToDateValue(dates, time)
// Returns: Array of dates, each with time 09:00
```

#### Date Range

```typescript
const range = {
  from: new Date('2024-01-15'),
  to: new Date('2024-01-20')
};
const time = { hour: '11', minute: '30', time: 'AM' };

applyTimeToDateValue(range, time)
// Returns: { from: Date(11:30), to: Date(11:30) }
```

---

### formatDateValueToString

Formats date values to strings with time applied.

**Import:**
```typescript
import { formatDateValueToString } from '@torch-ai/torch-glare/utils';
```

**Signature:**
```typescript
function formatDateValueToString(
  date: Date | Date[] | DateRange | undefined,
  timePickerValue: TimePickerValue,
  dateFormat: string
): string
```

**Parameters:**
- `date`: `Date | Date[] | DateRange | undefined` - Date to format
- `timePickerValue`: `TimePickerValue` - Time to apply
- `dateFormat`: `string` - Format string (e.g., 'MM/dd/yyyy')

**Returns:**
- `string` - Formatted date string

**Examples:**

#### Single Date

```typescript
const date = new Date('2024-01-15');
const time = { hour: '02', minute: '30', time: 'PM' };

formatDateValueToString(date, time, 'MM/dd/yyyy hh:mm a')
// Returns: "01/15/2024 02:30 PM"

formatDateValueToString(date, time, 'yyyy-MM-dd HH:mm')
// Returns: "2024-01-15 14:30"
```

#### Date Array

```typescript
const dates = [
  new Date('2024-01-15'),
  new Date('2024-01-16')
];
const time = { hour: '09', minute: '00', time: 'AM' };

formatDateValueToString(dates, time, 'MM/dd/yyyy')
// Returns: "01/15/2024, 01/16/2024"
```

#### Date Range

```typescript
const range = {
  from: new Date('2024-01-15'),
  to: new Date('2024-01-20')
};
const time = { hour: '11', minute: '30', time: 'AM' };

formatDateValueToString(range, time, 'MMM dd, yyyy')
// Returns: "Jan 15, 2024 - Jan 20, 2024"
```

#### Format Patterns

Common format patterns (using [date-fns](https://date-fns.org/)):

| Pattern | Output | Description |
|---------|--------|-------------|
| `yyyy-MM-dd` | 2024-01-15 | ISO date format |
| `MM/dd/yyyy` | 01/15/2024 | US date format |
| `dd/MM/yyyy` | 15/01/2024 | European format |
| `MMM dd, yyyy` | Jan 15, 2024 | Long date |
| `MMMM dd, yyyy` | January 15, 2024 | Full month name |
| `hh:mm a` | 02:30 PM | 12-hour time |
| `HH:mm` | 14:30 | 24-hour time |
| `yyyy-MM-dd HH:mm:ss` | 2024-01-15 14:30:00 | Full timestamp |

---

## Resize Utilities

Utilities for calculating element dimensions during resize operations.

### calculateNewWidthFromMouse

Calculates new width based on mouse position with RTL support.

**Import:**
```typescript
import { calculateNewWidthFromMouse } from '@torch-ai/torch-glare/utils';
```

**Signature:**
```typescript
function calculateNewWidthFromMouse(
  event: MouseEvent,
  resizableRef: MutableRefObject<HTMLElement | null> | RefObject<HTMLElement | null>,
  isRtl: boolean
): number
```

**Parameters:**
- `event`: `MouseEvent` - Mouse event from resize
- `resizableRef`: `Ref<HTMLElement>` - Ref to element being resized
- `isRtl`: `boolean` - Whether layout is RTL

**Returns:**
- `number` - Calculated width in pixels

**Example:**

```typescript
import { useRef, useState } from 'react';
import { calculateNewWidthFromMouse } from '@torch-ai/torch-glare/utils';

function ResizablePanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);
  const isRtl = document.dir === 'rtl';

  const handleMouseMove = (e: MouseEvent) => {
    const newWidth = calculateNewWidthFromMouse(e, panelRef, isRtl);
    setWidth(newWidth);
  };

  return (
    <div
      ref={panelRef}
      style={{ width: `${width}px` }}
      onMouseDown={() => {
        document.addEventListener('mousemove', handleMouseMove);
      }}
    >
      Resizable content
    </div>
  );
}
```

---

### calculateNewWidthFromTouch

Calculates new width based on touch position with RTL support.

**Import:**
```typescript
import { calculateNewWidthFromTouch } from '@torch-ai/torch-glare/utils';
```

**Signature:**
```typescript
function calculateNewWidthFromTouch(
  event: TouchEvent,
  resizableRef: MutableRefObject<HTMLElement | null> | RefObject<HTMLElement | null>,
  isRtl: boolean
): number
```

**Parameters:**
- `event`: `TouchEvent` - Touch event from resize
- `resizableRef`: `Ref<HTMLElement>` - Ref to element being resized
- `isRtl`: `boolean` - Whether layout is RTL

**Returns:**
- `number` - Calculated width in pixels

**Example:**

```typescript
import { useRef, useState } from 'react';
import { calculateNewWidthFromTouch } from '@torch-ai/torch-glare/utils';

function TouchResizablePanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);
  const isRtl = document.dir === 'rtl';

  const handleTouchMove = (e: TouchEvent) => {
    const newWidth = calculateNewWidthFromTouch(e, panelRef, isRtl);
    setWidth(newWidth);
  };

  return (
    <div
      ref={panelRef}
      style={{ width: `${width}px` }}
      onTouchStart={() => {
        document.addEventListener('touchmove', handleTouchMove);
      }}
    >
      Touch resizable content
    </div>
  );
}
```

---

## Type Utilities

### TimePickerValue

Type for time picker values.

```typescript
export type TimePickerValue = {
  hour: string;      // "01" to "12"
  minute: string;    // "00" to "59"
  time: string;      // "AM" or "PM"
}
```

**Example:**

```typescript
const time: TimePickerValue = {
  hour: '02',
  minute: '30',
  time: 'PM'
};
```

---

## Common Patterns

### Combining Utilities

#### Date Formatting with Time

```typescript
import {
  applyTimeToDate,
  formatDateValueToString,
  isValidDateObject
} from '@torch-ai/torch-glare/utils';

function formatUserSelectedDate(
  date: Date,
  time: TimePickerValue,
  format: string
): string | null {
  if (!isValidDateObject(date)) {
    return null;
  }

  return formatDateValueToString(date, time, format);
}

// Usage
const date = new Date('2024-01-15');
const time = { hour: '02', minute: '30', time: 'PM' };
const formatted = formatUserSelectedDate(date, time, 'MM/dd/yyyy hh:mm a');
// Returns: "01/15/2024 02:30 PM"
```

#### Class Name Merging with Variants

```typescript
import { cn } from '@torch-ai/torch-glare/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'rounded font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      },
      size: {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
}

function Button({ variant, size, className }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)}>
      Click me
    </button>
  );
}
```

#### Resize with Constraints

```typescript
import {
  calculateNewWidthFromMouse,
  calculateNewWidthFromTouch
} from '@torch-ai/torch-glare/utils';

function ConstrainedResize() {
  const MIN_WIDTH = 200;
  const MAX_WIDTH = 600;

  const handleResize = (
    event: MouseEvent | TouchEvent,
    ref: RefObject<HTMLElement>,
    isRtl: boolean
  ) => {
    const newWidth = event instanceof MouseEvent
      ? calculateNewWidthFromMouse(event, ref, isRtl)
      : calculateNewWidthFromTouch(event, ref, isRtl);

    // Apply constraints
    return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
  };

  return { handleResize, MIN_WIDTH, MAX_WIDTH };
}
```

---

## Best Practices

### 1. Always Use cn for Class Merging

```typescript
// ✓ Good - Uses cn utility
<div className={cn('base-class', props.className)} />

// ✗ Bad - Manual string concatenation
<div className={`base-class ${props.className}`} />
```

### 2. Validate Dates Before Operations

```typescript
// ✓ Good - Validates first
if (isValidDateObject(date)) {
  const result = applyTimeToDate(date, time);
}

// ✗ Bad - No validation
const result = applyTimeToDate(date, time); // May throw error
```

### 3. Handle Both Mouse and Touch Events

```typescript
// ✓ Good - Handles both
const width = isTouchEvent
  ? calculateNewWidthFromTouch(event, ref, isRtl)
  : calculateNewWidthFromMouse(event, ref, isRtl);

// ✗ Bad - Only handles mouse
const width = calculateNewWidthFromMouse(event, ref, isRtl);
```

### 4. Use Descriptive Format Strings

```typescript
// ✓ Good - Clear intent
formatDateValueToString(date, time, 'MMM dd, yyyy hh:mm a')

// ✗ Bad - Unclear format
formatDateValueToString(date, time, 'M/d/yy h:m')
```

---

## Related Documentation

- [Hooks Reference](./hooks.md) - Custom React hooks
- [Types Reference](./types.md) - TypeScript types
- [Component API Index](./components.md) - Component references

---

## External Dependencies

These utilities depend on the following external libraries:

- [clsx](https://github.com/lukeed/clsx) - Conditional class names
- [tailwind-merge](https://github.com/dcastil/tailwind-merge) - Tailwind class deduplication
- [date-fns](https://date-fns.org/) - Date formatting
- [react-day-picker](https://react-day-picker.js.org/) - Date picker types

---

## Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [date-fns Format Reference](https://date-fns.org/docs/format)
- [TypeScript Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
