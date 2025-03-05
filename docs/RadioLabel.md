```markdown
# RadioLabel Component

## Overview

The `RadioLabel` component is a customizable React component that combines a styled radio input with an associated label. It provides a consistent and visually appealing way to create accessible radio button elements.

---


## Installation
```bash
npx torchcorp@latest add RadioLabel
```

---

## Features

*   **Styled Radio Input:** Provides a consistent and visually appealing radio input style.
*   **Associated Label:** Combines the radio input with an associated label for accessibility.
*   **Sizing Options:** Offers `S`, `M`, and `L` sizes to control the size of the radio input.
*   **Theming:** Supports `dark`, `light`, and `default` themes using a `data-theme` attribute.
*   **Styling Flexibility:** Uses `class-variance-authority` (CVA) for easy and maintainable styling.
*   **Customizable Label Text:**  Supports primary, secondary, and required label text.

---

## Components

### `RadioLabel`

The main component that combines the radio input and label.

#### `RadioLabel` Props

| Prop             | Type                                  | Default | Description                                                                                                                            |
| ---------------- | ------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `label`          | `string`                              |         | The primary label text associated with the radio input.                                                                                |
| `secondaryLabel` | `string`                              |         | Additional descriptive text for the label.                                                                                           |
| `requiredLabel`  | `string`                              |         | Text indicating that the field is required (typically an asterisk).                                                                 |
| `size`           | `"S" \| "M" \| "L"`                 | `"M"`   | Controls the size of the radio input.                                                                                                |
| `directions`     | `"vertical" \| "horizontal"`           |         | Determines the layout direction of the label text (if used). Refer to the documentation of your own Label component.                                                                     |
| `theme`          | `"dark" \| "light" \| "default"`       |         | Sets the theme for the component, affecting its color scheme. Uses the `data-theme` attribute.                                                                 |
| `...props`       | `Omit<InputHTMLAttributes<HTMLInputElement>, "size">` |         | Standard HTML attributes for the `input` element, excluding `size` (which is managed by this component). Includes `checked`, `onChange`, `id`, etc. |

### `Radio`

The styled radio input element.

#### `Radio` Props

| Prop     | Type                | Default | Description                               |
| -------- | ------------------- | ------- | ----------------------------------------- |
| `size`   | `"S" \| "M" \| "L"` | `"M"`   | Controls the size of the radio input.     |
| `...props`| `Omit<InputHTMLAttributes<HTMLInputElement>, "size">`     |         | Standard HTML attributes for the `input` element, excluding `size`. |

---

## Usage

### Basic Usage

```jsx
import { RadioLabel } from "./RadioLabel";

function App() {
  return (
    <RadioLabel id="agree" label="I agree to the terms and conditions" />
  );
}
```

### With Different Size

```jsx
import { RadioLabel } from "./RadioLabel";

function App() {
  return (
    <RadioLabel id="option1" label="Option 1" size="L" />
  );
}
```

### With Theming

```jsx
import { RadioLabel } from "./RadioLabel";

function App() {
  return (
    <RadioLabel id="darkOption" label="Dark Option" theme="dark" />
  );
}
```

### With secondary label

```jsx
import { RadioLabel } from "./RadioLabel";

function App() {
  return (
    <RadioLabel id="emailNotification" label="Email Notification" secondaryLabel="(Weekly updates)" />
  );
}
```

### Checked

```jsx
import { RadioLabel } from "./RadioLabel";
import React, { useState } from "react";

function App() {
    const [isChecked, setIsChecked] = useState(false);
    return (
        <RadioLabel id="terms" label="I agree to the terms and conditions" checked={isChecked} onChange={() => setIsChecked(!isChecked)}/>
    );
}
```

---

## Dependencies

*   `react`
*   `class-variance-authority`
*   `tailwindcss` (or CSS utility classes)
*   `./Label` component (from your project)
*   `cn` utility function (for conditionally applying CSS classes)

---

## Customization

You can customize the appearance of the `RadioLabel` component by:

*   **Providing a custom `className`:** This allows you to add or override the default styles with your own CSS.
*   **Modifying the CVA styles:** Adjust the styles defined within the `glareRadioStyles` variable to change the base styles and variants of the `Radio` input element.
*   **Theming:** Use the `theme` prop to switch between predefined color schemes.

---

## Notes

*   The component relies on CSS variables for styling. Ensure your CSS or styling solution is configured to handle these variables correctly.
*   The `Label` component is expected to handle the label rendering and styling. Ensure it's correctly implemented and located at the specified relative path.
*   You may need to adjust the styling and sizing values to match your design system.

---

## Example Code

```jsx
import { RadioLabel } from "./RadioLabel";

function App() {
  return (
    <div>
      <RadioLabel id="agree" label="I agree to the terms and conditions" />
      <RadioLabel id="option1" label="Option 1" size="L" />
      <RadioLabel id="darkOption" label="Dark Option" theme="dark" />
        <RadioLabel id="emailNotification" label="Email Notification" secondaryLabel="(Weekly updates)" />
    </div>
  );
}
```
