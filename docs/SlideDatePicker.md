```markdown
# SlideDatePicker Component

## Overview

The `SlideDatePicker` component is a React component providing a user-friendly date picker interface, particularly well-suited for mobile devices. It utilizes a sliding picker mechanism for date selection and integrates seamlessly with standard form elements.

---

## Installation

Make sure you have the `Popover`, `PopoverContent`, `PopoverTrigger`, and `InputField` components, along with necessary utility functions and dependencies installed. Also, ensure that the `MobileSlidePicker` hook and its related components are available.

---

## Features

*   **Mobile-Friendly Design:** Provides a sliding picker interface ideal for mobile devices.
*   **Date Formatting:** Displays the selected date in a clear and concise format.
*   **Customizable Themes:** Supports `dark`, `light`, and `default` themes for consistent styling.
*   **Integration with Forms:** Easily integrates with form libraries such as React Hook Form.
*   **Localized Month Names:** Displays month names using the `monthsNames` array.
*   **Dynamic Day Generation:** Dynamically generates the array of days based on the selected year and month.

---

## Props

| Prop          | Type                                                     | Default      | Description                                                                                                                   |
|---------------|----------------------------------------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------|
| `onChange`    | `(e: Date) => void`                                      |              | Callback function invoked when the selected date changes, providing the new Date object as an argument.                   |
| `theme`       | `"dark" \| "light" \| "default"`                         | `"dark"`     | Sets the theme for the component, affecting its color scheme. Uses the `data-theme` attribute.                             |
| `...props`    | `Omit<ComponentProps<typeof InputField>, 'onChange'>` |              | Standard HTML attributes for the `InputField` component, excluding `onChange` (which is managed by this component). |

---

## Usage

### Basic Usage

```jsx
import { SlideDatePicker } from "./SlideDatePicker";

function App() {
  return (
    <SlideDatePicker />
  );
}
```

### With Custom Theme

```jsx
import { SlideDatePicker } from "./SlideDatePicker";

function App() {
  return (
    <SlideDatePicker theme="light" />
  );
}
```

### With onChange Handler

```jsx
import { SlideDatePicker } from "./SlideDatePicker";

function App() {
  const handleDateChange = (date) => {
    console.log("Selected date:", date);
  };

  return (
    <SlideDatePicker onChange={handleDateChange} />
  );
}
```

### Integration with React Hook Form

```jsx
import { SlideDatePicker } from "./SlideDatePicker";
import { useForm, Controller } from "react-hook-form";

function App() {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <SlideDatePicker
            {...field}
            onChange={(value) => field.onChange(value)}
          />
        )}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Dependencies

*   `react`
*   `date-fns`
*   `./Popover`, `./InputField` components (from your project)
*   `../hooks/MobileSlidePicker` hook (from your project)

---

## Customization

You can customize the appearance of the `SlideDatePicker` component by modifying the CSS classes or styles applied to the various elements within the component. You can also adjust the `theme` prop to switch between predefined color schemes.  The appearance of the inner input field can be adjusted with props passed to SlideDatePicker, which are then passed into the InputField Component.

---

## Notes

*   Ensure that the required CSS and styling solutions are configured correctly for the necessary visual elements.
*   Make sure you have your own `Popover`, and `InputField` components installed at the correct relative path.

---

## Example Code

```jsx
import { SlideDatePicker } from "./SlideDatePicker";
import { useState } from "react";

function App() {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        console.log("Selected date:", date);
    };

    return (
        <div>
            <SlideDatePicker onChange={handleDateChange} />
            {selectedDate && <p>Selected Date: {selectedDate.toLocaleDateString()}</p>}
        </div>
    );
}
```
