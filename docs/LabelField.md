```markdown
# LabelField Component

## Overview

The `LabelField` component is a composite React component that combines a `Label` and an `InputField` into a single, styled form element. It provides a convenient way to create labeled input fields with various options for styling, validation, and helper text.

---

## Installation

```bash
npx torchcorp@latest add LabelField
```

---

## Features

*   **Label Integration:** Seamlessly combines a label with an input field.
*   **Customizable Label:** Allows for primary, secondary, and required labels with directional layout control.
*   **Input Field Options:** Supports various `InputField` props for styling, icons, actions, and popovers.
*   **Error Handling:** Displays an error message as a tooltip when `errorMessage` is provided.
*   **Theming:** Supports theming with `dark`, `light`, and `default` options using a `data-theme` attribute.
*   **Styling Variants:** Offers "PresentationStyle" and "SystemStyle" variants for different visual appearances inherited from both `Label` and `InputField`.
*   **Sizing:** Provides options for `S` and `M` sizes inherited from `InputField`.
*   **Table Context:** Adjusts border style when used within a table context.
*   **Forwarded Ref:**  Utilizes `React.forwardRef` to allow access to the underlying `HTMLInputElement`.

---

## Props

| Prop              | Type                                                                  | Default     | Description                                                                                                                            |
| ----------------- | --------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `label`           | `ReactNode`                                                             |             | The primary label text.                                                                                                                |
| `requiredLabel`   | `ReactNode`                                                             |             | Text indicating that the field is required, styled with a negative (error) color.                                                      |
| `secondaryLabel`  | `ReactNode`                                                             |             | Additional descriptive text, styled with a secondary color.                                                                            |
| `size`            | `"S"` \| `"M"`                                                        |             | Controls the size of the input field.                                                                                                  |
| `variant`         | `"SystemStyle"` \| `"PresentationStyle"`                               |             | Selects the visual style variant for both the label and input field.                                                                    |
| `theme`           | `"dark"` \| `"light"` \| `"default"`                                  |             | Sets the theme for the component, affecting its color scheme. Uses the `data-theme` attribute.                                         |
| `icon`            | `ReactNode`                                                             |             | An icon to display on the left side of the input field.                                                                                  |
| `childrenSide`    | `ReactNode`                                                             |             | Content to be rendered on the right side of the input field (e.g., a button or action).                                               |
| `popoverChildren` | `ReactNode`                                                             |             | Content to be displayed in a popover associated with the input field (e.g., a dropdown list).                                         |
| `errorMessage`    | `string`                                                              |             | Error message to display as a tooltip. If present, a tooltip will be shown with this message.                                           |
| `onTable`         | `boolean`                                                             | `false`     | Adjusts the border style when the component is used within a table context.                                                              |
| `labelDirections` | `"vertical"` \| `"horizontal"`                                          |             | Determines the layout direction of the label and its associated text.                                                                  |
| `toolTipSide`     | `ToolTipSide` (Assuming you have this defined elsewhere)               |             | Specifies the side of the input field where the tooltip should appear.  You'll need to define what `ToolTipSide` is in your project. |
| `className`       | `string`                                                              |             | Custom CSS class names to apply to the component's container.                                                                              |
| `...props`        | `Omit<InputHTMLAttributes<HTMLInputElement>, "size" \| "variant">` |             | Standard HTML attributes for the `input` element, excluding `size` and `variant` (which are controlled directly by this component).     |

---

## Usage

### Basic Usage

```jsx
import { LabelField } from "./LabelField";

function App() {
  return (
    <LabelField label="Email:" type="email" id="email" placeholder="Enter your email" />
  );
}
```

### With Required Label

```jsx
import { LabelField } from "./LabelField";

function App() {
  return (
    <LabelField label="Password:" requiredLabel="*" type="password" id="password" />
  );
}
```

### With Secondary Label and Icon

```jsx
import { LabelField } from "./LabelField";
import { SearchIcon } from '@heroicons/react/solid'; // Example icon

function App() {
  return (
    <LabelField
      label="Search:"
      secondaryLabel="(optional)"
      type="text"
      id="search"
      icon={<SearchIcon className="h-5 w-5 text-gray-400" />}
    />
  );
}
```

### With Error Message

```jsx
import { LabelField } from "./LabelField";

function App() {
  return (
    <LabelField
      label="Username:"
      type="text"
      id="username"
      errorMessage="Username is required"
    />
  );
}
```

### With Children Side Action

```jsx
import { LabelField } from "./LabelField";

function App() {
  return (
    <LabelField
      label="Quantity:"
      type="number"
      id="quantity"
      childrenSide={<button>Add</button>}
    />
  );
}
```

### With a Dark Theme

```jsx
import { LabelField } from "./LabelField";

function App() {
  return (
    <LabelField label="Description:" type="text" id="description" theme="dark" variant="SystemStyle" />
  );
}
```

---

## Notes

*   The `LabelField` component is designed to be a high-level abstraction, simplifying the creation of common form elements.
*   The `Label` and `InputField` components are styled separately, so ensure your CSS or styling solution is configured to handle their respective classes.
*   This component assumes you've set up Tailwind CSS or a similar system to handle styling responsively.

---

## Example Code

```jsx
import { LabelField } from "./LabelField";

function App() {
  return (
    <div>
      <LabelField label="Email:" type="email" id="email" placeholder="Enter your email" />
      <LabelField label="Password:" requiredLabel="*" type="password" id="password" />
      <LabelField
        label="Search:"
        secondaryLabel="(optional)"
        type="text"
        id="search"
        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>} // Example icon
      />
      <LabelField
        label="Username:"
        type="text"
        id="username"
        errorMessage="Username is required"
      />
      <LabelField
        label="Quantity:"
        type="number"
        id="quantity"
        childrenSide={<button>Add</button>}
      />
      <LabelField label="Description:" type="text" id="description" theme="dark" variant="SystemStyle" />
    </div>
  );
}
```
