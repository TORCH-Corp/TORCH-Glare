```markdown
# LabelLessInput Component

## Overview

The `LabelLessInput` component is a specialized React component designed to create input fields with labels integrated directly into the input itself, offering a cleaner and more streamlined user interface. It combines the functionality of an `InputField` with a custom label section that animates and changes style based on the focus state of the input.

---

## Installation

```bash
npx torchcorp@latest add LabelLessInput
```

Make sure you have the `InputField` component, along with necessary utility functions (`cn`) and dependencies installed. This component assumes you have the `ToolTipSide` type available.  Also ensure you have Tailwind CSS or a similar system setup for your styling.

---

## Features

*   **Integrated Label:** Combines the label directly into the input field, creating a seamless design.
*   **Focus-Based Animation:** The label animates and changes style when the input field gains focus, providing visual feedback.
*   **Input Field Options:** Supports various `InputField` props for styling, icons, actions, and popovers.
*   **Error Handling:** Displays an error message as a tooltip when `errorMessage` is provided.
*   **Theming:** Supports theming with `dark`, `light`, and `default` options using a `data-theme` attribute.
*   **Styling Variants:** Offers "PresentationStyle" and "SystemStyle" variants for different visual appearances inherited from `InputField`.
*   **Sizing:** Provides options for `S` and `M` sizes inherited from `InputField`.
*   **Table Context:** Adjusts border style when used within a table context.
*   **Forwarded Ref:**  Utilizes `React.forwardRef` to allow access to the underlying `HTMLInputElement`.
*   **Client-Side Rendering:** Explicitly marked as a client component using `"use client"`.

---

## Props

| Prop              | Type                                                                  | Default     | Description                                                                                                                                                                            |
| ----------------- | --------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`            | `"S"` \| `"M"`                                                        | `"S"`       | Controls the size of the input field.                                                                                                                                                    |
| `variant`         | `"SystemStyle"` \| `"PresentationStyle"`                               |             | Selects the visual style variant for the input field.                                                                                                                                     |
| `theme`           | `"dark"` \| `"light"` \| `"default"`                                  |             | Sets the theme for the component, affecting its color scheme. Uses the `data-theme` attribute.                                                                                           |
| `icon`            | `ReactNode`                                                             |             | An icon to display on the left side of the input field.  This prop will be replaced by the integrated label.                                                                             |
| `childrenSide`    | `ReactNode`                                                             |             | Content to be rendered on the right side of the input field (e.g., a button or action).                                                                                                |
| `popoverChildren` | `ReactNode`                                                             |             | Content to be displayed in a popover associated with the input field (e.g., a dropdown list).                                                                                           |
| `errorMessage`    | `string`                                                              |             | Error message to display as a tooltip. If present, a tooltip will be shown with this message.                                                                                             |
| `onTable`         | `boolean`                                                             | `false`     | Adjusts the border style when the component is used within a table context.                                                                                                               |
| `label`           | `string`                                                              |             | The label text to be displayed within the input field.                                                                                                                                    |
| `required`        | `boolean`                                                             | `false`     | Indicates whether the field is required, displaying an asterisk next to the label.                                                                                                      |
| `toolTipSide`     | `ToolTipSide` (Assuming you have this defined elsewhere)               |             | Specifies the side of the input field where the tooltip should appear. You'll need to define what `ToolTipSide` is in your project.                                                  |
| `className`       | `string`                                                              |             | Custom CSS class names to apply to the component's container.                                                                                                                              |
| `...props`        | `Omit<InputHTMLAttributes<HTMLInputElement>, "size" \| "variant">` |             | Standard HTML attributes for the `input` element, excluding `size` and `variant` (which are controlled directly by this component).                                                     |

---

## Usage

### Basic Usage

```jsx
import { LabelLessInput } from "./LabelLessInput";

function App() {
  return (
    <LabelLessInput label="Email" type="email" id="email" placeholder="Enter your email" />
  );
}
```

### With Required Field

```jsx
import { LabelLessInput } from "./LabelLessInput";

function App() {
  return (
    <LabelLessInput label="Password" required type="password" id="password" />
  );
}
```

### With Children Side Action

```jsx
import { LabelLessInput } from "./LabelLessInput";

function App() {
  return (
    <LabelLessInput
      label="Quantity"
      type="number"
      id="quantity"
      childrenSide={<button>Add</button>}
    />
  );
}
```

### With a Dark Theme and Error

```jsx
import { LabelLessInput } from "./LabelLessInput";

function App() {
  return (
    <LabelLessInput label="Username" type="text" id="username" theme="dark" variant="SystemStyle" errorMessage="Username is invalid"/>
  );
}
```

---

## Customization

*   **Styling:** Adjust the CSS classes within the `LabelLessSection` component to modify the appearance of the label.
*   **Theming:**  Use the `theme` prop to apply different color schemes.
*   **Responsiveness:** Ensure your Tailwind CSS or styling solution handles responsiveness appropriately for different screen sizes.

---

## Notes

*   The `LabelLessInput` component assumes you've set up Tailwind CSS or a similar system to handle styling responsively.
*   This component depends on your `InputField` component, so ensure it is configured correctly.
*   The component relies on setting the `icon` prop on the `<InputField />` component to display label, so make sure your `InputField` is setting `icon` in the proper position in the input element.

---

## Example Code

```jsx
import { LabelLessInput } from "./LabelLessInput";

function App() {
  return (
    <div>
      <LabelLessInput label="Email" type="email" id="email" placeholder="Enter your email" />
      <LabelLessInput label="Password" required type="password" id="password" />
      <LabelLessInput
        label="Quantity"
        type="number"
        id="quantity"
        childrenSide={<button>Add</button>}
      />
      <LabelLessInput label="Username" type="text" id="username" theme="dark" variant="SystemStyle" errorMessage="Username is invalid"/>
    </div>
  );
}
```
