
# InputField Component

The `InputField` component is a customizable input field with optional icon, tooltip, and dropdown menu support. It offers a flexible and responsive design for forms, including variants for system and presentation styles, and provides error handling with tooltips.

## Installation

To install the `InputField` component in your project, run the following command:

```bash
npx torchcorp@latest add InputField
```

## Usage

### Import the component:

```tsx
import { InputField } from "./components/InputField";
```

### Example usage:

```tsx
<InputField
  size="M"
  icon={<i className="ri-add-line"></i>}
  errorMessage="This field is required"
  placeholder="Enter your text"
  onChange={(e) => console.log(e.target.value)}
/>
```

### Props

| Prop                | Type                                    | Description                                                        |
|---------------------|-----------------------------------------|--------------------------------------------------------------------|
| `size`              | `"S" | "M"`                            | Size of the input field (`S` for small, `M` for medium)            |
| `variant`           | `"SystemStyle" | "PresentationStyle"`   | Defines the styling variant for the input field                    |
| `icon`              | `ReactNode`                             | Optional icon to display inside the input field                    |
| `childrenSide`      | `ReactNode`                             | Optional children (e.g., action button) displayed next to the input|
| `popoverChildren`   | `ReactNode`                             | Optional dropdown content for popover trigger                      |
| `errorMessage`      | `string`                                | Display an error message with a tooltip                            |
| `onTable`           | `boolean`                               | Apply table style (smaller height) for the input field            |
| `toolTipSide`       | `"top" | "right" | "bottom" | "left"`  | Position of the tooltip                                          |
| `theme`             | `"dark" | "light" | "default"`         | Theme for the component (`dark`, `light`, or `default`)           |

## Features

- **Error Handling**: Display error messages with tooltips when the field is invalid.
- **Responsive Design**: Adjusts based on the size prop (`S` or `M`).
- **Customizable Icons**: Supports left and right icons in the input field.
- **Popover Dropdown**: Optional dropdown content triggered by the input field.

## License

This component is open-source and available under the MIT license.