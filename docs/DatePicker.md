# Datepicker Component

## Overview

The `Datepicker` component is a customizable and user-friendly React component that allows users to select dates efficiently. It supports multiple features such as date range selection, theming, and custom styling.

---

## Installation

To install the component, run:

```sh
npx torchcorp@latest add Datepicker
```

---

## Features

- **Single & Range Selection**: Supports both single date and date range selection.
- **Theming**: Light and dark mode support.
- **Custom Formatting**: Allows customizable date format.
- **Localization**: Supports multiple languages.
- **Disabled Dates**: Disable specific dates or ranges.
- **Predefined Ranges**: Quick selection of common ranges (e.g., last 7 days, this month, etc.).
- **Keyboard Navigation**: Fully accessible via keyboard.
- **Mobile-Friendly**: Optimized for touch devices.

---

## Props

| Prop            | Type                 | Default     | Description |
|----------------|---------------------|------------|-------------|
| `mode`        | `single`, `range`     | `single`   | Defines whether the component selects a single date or a range. |
| `format`      | `string`              | `MM/DD/YYYY` | Specifies the date format. |
| `theme`       | `light`, `dark`       | `light`    | Determines the appearance of the component. |
| `disabledDates` | `Date[]`             | `[]`       | Array of dates that cannot be selected. |
| `locale`      | `string`              | `en`       | Sets the language for date labels. |
| `onChange`    | `(date: Date | Date[]) => void` | `-` | Callback function triggered on date selection. |
| `showQuickSelect` | `boolean`         | `true`     | Displays quick select options for predefined date ranges. |

---

## Usage

### Basic Usage

```jsx
import { Datepicker } from "./Datepicker";

function App() {
  return (
    <Datepicker mode="single" format="YYYY-MM-DD" onChange={(date) => console.log(date)} />
  );
}
```

### Date Range Selection

```jsx
<Datepicker mode="range" onChange={(dates) => console.log(dates)} />
```

### Dark Mode

```jsx
<Datepicker theme="dark" />
```

### Disabled Dates

```jsx
<Datepicker disabledDates={[new Date(2025, 0, 1), new Date(2025, 11, 25)]} />
```

### Localization

```jsx
<Datepicker locale="fr" />
```

---

## Customization

### Theming

You can apply `light` or `dark` themes:

```jsx
<Datepicker theme="dark" />
```

### Date Formatting

The `format` prop allows custom date formats:

```jsx
<Datepicker format="DD/MM/YYYY" />
```

### Quick Select Options

You can enable or disable quick select options:

```jsx
<Datepicker showQuickSelect={false} />
```

---

## Example Code

```jsx
import { Datepicker } from "./Datepicker";

function App() {
  return (
    <div>
      <Datepicker mode="single" format="YYYY-MM-DD" />
      <Datepicker mode="range" theme="dark" />
      <Datepicker disabledDates={[new Date(2025, 0, 1)]} />
    </div>
  );
}
```

---

## Notes

- The component is fully accessible and supports keyboard navigation.
- Supports multiple date formats and locales for internationalization.
- Can be customized using additional props for specific needs.

