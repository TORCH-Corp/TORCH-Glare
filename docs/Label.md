Okay, I will create a README.md file based on the example you provided, tailoring it to the `Label` component.

```markdown
# Label Component

## Overview

The `Label` component is a versatile and customizable React component for creating accessible and visually appealing labels. It supports various styling options, sizes, directions, and optional helper texts to enhance the user experience.

---

## Installation

```bash
npx torchcorp@latest add Label
```
Ensure that `react` and `tailwindcss` are installed and configured in your project if you are using Tailwind CSS for styling.

---

## Features

*   **Directional Layout:** Supports both vertical and horizontal layouts for labels and associated elements.
*   **Theming:** Allows for theming with `dark`, `light`, and `default` options using a `data-theme` attribute.
*   **Variants:** Offers "PresentationStyle" and "SystemStyle" variants for different visual appearances.
*   **Sizing:** Provides options for `S`, `M`, and `L` sizes, controlling typography.
*   **Customizable Content:** Supports primary label, secondary label, required label, and children for maximum flexibility.
*   **Forwarded Ref:** Utilizes `React.forwardRef` to allow access to the underlying `HTMLLabelElement`.
*   **Type Safety:** Uses TypeScript for type safety and a clear component API.
*   **Composability**: Can be used as a regular label or as a wrapper for custom elements using the `asChild` prop.

---

## Props

| Prop             | Type                                    | Default         | Description                                                                                                                                     |
| ---------------- | --------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`          | `ReactNode`                             |                 | The primary label text.                                                                                                                         |
| `requiredLabel`  | `ReactNode`                             |                 | Text indicating that the field is required, styled with a negative (error) color.                                                               |
| `secondaryLabel` | `ReactNode`                             |                 | Additional descriptive text, styled with a secondary color.                                                                                     |
| `directions`     | `"vertical"` \| `"horizontal"`          | `"horizontal"`  | Determines the layout direction of the label and its associated elements.                                                                     |
| `size`           | `"S"` \| `"M"` \| `"L"`               | `"M"`           | Controls the typography size for the labels.                                                                                                     |
| `variant`        | `"SystemStyle"` \| `"PresentationStyle"` | `"PresentationStyle"` | Selects the visual style variant for the label based on your application's needs.                                                                     |
| `theme`          | `"dark"` \| `"light"` \| `"default"`     |                 | Sets the theme for the label, affecting its color scheme. Uses the `data-theme` attribute.                                                    |
| `className`      | `string`                                |                 | Custom CSS class names to apply to the label element.                                                                                         |
| `children`       | `ReactNode`                             |                 | Content to be rendered inside the label element, typically form elements (e.g., `<input>`, `<textarea>`).                                       |
| `as`             | `React.ElementType`                     |                 | Allows rendering the component as a different HTML element. Useful for semantic HTML.                                                         |
| `asChild`        | `boolean`                               | `false`         | Renders the component as a child of the provided element specified using the `as` prop. See [Radix UI's documentation](https://www.radix-ui.com/docs/primitives/composites/composite#render-props). |
| `...props`       | `LabelHTMLAttributes<HTMLLabelElement>` |                 | Standard HTML attributes for the `label` element.                                                                                                |

---

## Usage

### Basic Usage

```jsx
import { Label } from "./Label";

function App() {
  return (
    <Label label="Username:">
      <input type="text" id="username" />
    </Label>
  );
}
```

### Vertical Layout

```jsx
import { Label } from "./Label";

function App() {
  return (
    <Label label="Comments:" directions="vertical">
      <textarea id="comments" rows="4" cols="50" />
    </Label>
  );
}
```

### Required Label

```jsx
import { Label } from "./Label";

function App() {
  return (
    <Label label="Email:" requiredLabel="*">
      <input type="email" id="email" required />
    </Label>
  );
}
```

### Secondary Label

```jsx
import { Label } from "./Label";

function App() {
  return (
    <Label label="Address:" secondaryLabel="(optional)">
      <input type="text" id="address" />
    </Label>
  );
}
```

### Different Size

```jsx
import { Label } from "./Label";

function App() {
  return (
    <Label label="City:" size="L">
      <input type="text" id="city" />
    </Label>
  );
}
```

### Themed Label

```jsx
import { Label } from "./Label";

function App() {
  return (
    <Label label="Description:" variant="SystemStyle" theme="dark">
      <textarea id="description" rows="4" cols="50" />
    </Label>
  );
}
```

### Custom Element

```jsx
import { Label } from "./Label";

function App() {
  return (
    <Label asChild>
      <a href="/terms">Terms and Conditions</a>
    </Label>
  );
}
```

---

## Customization

### Variants

You can customize the button's appearance by selecting one of the predefined variants:

*   `PresentationStyle`
*   `SystemStyle`

### Sizes

The label supports three sizes:

*   `S`: Small
*   `M`: Medium (default)
*   `L`: Large

### Theme Support

The label supports theming via the `theme` prop. You can apply `dark`, `light`, or `default` themes.

---

## Notes

*   The `asChild` prop allows the label to render as a wrapper for custom elements, making it highly composable.
*   Ensure your project includes the correct typography classes for sizes `S`, `M`, and `L`.

---

## Example Code

```jsx
import { Label } from "./Label";

function App() {
  return (
    <div>
      <Label label="Username:" >
        <input type="text" id="username" />
      </Label>

      <Label label="Password:" directions="vertical" size="L" variant="SystemStyle" theme="dark">
          <input type="password" id="password" />
      </Label>

      <Label label="Email:" requiredLabel="*">
        <input type="email" id="email" required />
      </Label>

      <Label label="Address:" secondaryLabel="(optional)">
        <input type="text" id="address" />
      </Label>

      <Label label="City:" size="L">
        <input type="text" id="city" />
      </Label>

      <Label asChild>
        <a href="/terms">Terms and Conditions</a>
      </Label>
    </div>
  );
}
```
