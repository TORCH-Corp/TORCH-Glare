# CheckboxLabel and Checkbox Components

The `CheckboxLabel` and `Checkbox` components are reusable UI elements designed to create customizable and accessible checkboxes. These components support labels, secondary labels, and themes, and integrate seamlessly with RemixIcon for icons.

## Features

- **Customizable Sizes**: Supports three sizes (`S`, `M`, `L`).
- **Labels and Secondary Labels**: Add primary and secondary labels for better context.
- **Theme Support**: Works with dark, light, and default themes.
- **Accessible**: Built with accessibility in mind, ensuring proper labeling and focus states.

## Installation

To install the `CheckboxLabel` and `Checkbox` components, use the following command:

```bash
npx torchcorp@latest add CheckboxLabel 
```

## Usage

### Basic Example
```jsx
import { CheckboxLabel } from "@/components/CheckboxLabel";

function Example() {
  return (
    <CheckboxLabel
      id="checkbox-1"
      label="Accept Terms and Conditions"
      size="M"
    />
  );
}
```

### With Secondary Label
```jsx
import { CheckboxLabel } from "@/components/CheckboxLabel";

function Example() {
  return (
    <CheckboxLabel
      id="checkbox-2"
      label="Subscribe to Newsletter"
      secondaryLabel="Get the latest updates"
      size="M"
    />
  );
}
```

### Themed Checkbox
```jsx
import { CheckboxLabel } from "@/components/CheckboxLabel";

function Example() {
  return (
    <CheckboxLabel
      id="checkbox-3"
      label="Dark Theme Checkbox"
      theme="dark"
      size="M"
    />
  );
}
```

### Custom Size
```jsx
import { CheckboxLabel } from "@/components/CheckboxLabel";

function Example() {
  return (
    <CheckboxLabel
      id="checkbox-4"
      label="Small Checkbox"
      size="S"
    />
  );
}
```

## Customization

### Adding Custom Styles
You can pass additional class names using the `className` prop:

```jsx
<CheckboxLabel
  id="checkbox-5"
  label="Custom Styled Checkbox"
  className="my-custom-class"
/>
```

## Components API

### 1. CheckboxLabel
A wrapper component that combines a checkbox with a label. It supports optional secondary labels and required labels.

#### Props

| Prop Name       | Type                      | Description                                         | Default Value |
|----------------|---------------------------|-----------------------------------------------------|---------------|
| `label`        | `string`                   | The primary label for the checkbox.                | `undefined`   |
| `id`           | `string`                   | The unique identifier for the checkbox input.      | `undefined`   |
| `secondaryLabel` | `string`                 | A secondary label for additional context.          | `undefined`   |
| `requiredLabel`  | `string`                 | A label to indicate if the checkbox is required.   | `undefined`   |
| `directions`    | `"vertical", "horizontal"` | The layout direction of the label and checkbox.    | `undefined`   |
| `size`         | `"S", "M", "L"`          | The size of the checkbox.                          | `"M"`         |
| `theme`        | `"dark", "light", "default"` | The theme applied to the checkbox.                 | `"default"`   |
| `...props`     | `InputHTMLAttributes`      | Standard HTML input attributes (e.g., `disabled`, `checked`, etc.). | `undefined` |

### 2. Checkbox
The core checkbox component. It handles the visual representation and state of the checkbox.

#### Props

| Prop Name  | Type             | Description                                          | Default Value |
|-----------|------------------|------------------------------------------------------|---------------|
| `size`    | `"S", "M", "L"` | The size of the checkbox.                           | `"M"`         |
| `...props` | `InputHTMLAttributes` | Standard HTML input attributes (e.g., `disabled`, `checked`, etc.). | `undefined` |
