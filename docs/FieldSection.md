
# FieldSection Component

The `FieldSection` component is a flexible layout component designed to display a label, optional secondary label, required label, and associated content within a grid-like structure. It is ideal for forms or UI sections where fields need labels and additional information to be neatly organized.

## Installation

To install the required package, run the following command:

```bash
npx torchcorp@latest add FieldSection
```

After installation, you can import the `FieldSection` component into your project:

```tsx
import { FieldSection } from "./components/FieldSection";
```

## Usage

### Basic Example

```tsx
import { FieldSection } from "./components/FieldSection";
import { InputField } from "./components/InputField";  // Example input component

export function ExampleForm() {
  return (
    <form>
      <FieldSection
        label="First Name"
        secondaryLabel="Please enter your first name"
        requiredLabel="This field is required"
        size="M"
        theme="light"
      >
        <InputField placeholder="John" />
      </FieldSection>

      <FieldSection
        label="Last Name"
        size="M"
        theme="dark"
      >
        <InputField placeholder="Doe" />
      </FieldSection>
    </form>
  );
}
```

### Props

| Prop               | Type                           | Description                                                                 |
|--------------------|--------------------------------|-----------------------------------------------------------------------------|
| `label`            | `ReactNode`                    | The main label for the field.                                                |
| `secondaryLabel`   | `ReactNode`                    | An optional secondary label for additional context.                          |
| `requiredLabel`    | `ReactNode`                    | An optional required label, displayed when the field is mandatory.           |
| `size`             | `"S" \| "M" \| "L"`            | The size of the label text. Defaults to `"M"`.                               |
| `childrenUnderLabel`| `ReactNode`                   | Children elements that will be displayed beneath the label.                  |
| `theme`            | `"dark" \| "light" \| "default"` | The theme of the field section, affects styling. Defaults to `"default"`.    |
| `className`        | `string`                       | Additional custom CSS class to be applied to the section.                    |


### Customization

You can customize the appearance of the component by modifying the `size`, `theme`, and `className` props.

- **Size**: The size prop (`"S"`, `"M"`, `"L"`) controls the label text size. This can help adjust the field's visual hierarchy.
- **Theme**: The `theme` prop (`"dark"`, `"light"`, `"default"`) adjusts the component's theme for a variety of use cases, such as dark mode or light mode.
- **ClassName**: You can add custom CSS classes for further styling control.

## Notes

- The component expects `Label` components to be used for displaying the labels.
- The `childrenUnderLabel` prop allows you to add additional content under the label, such as helper text or tooltips.
- The `theme` prop is useful for switching between different visual styles (e.g., dark mode or light mode).

## License

This project is licensed under the MIT License.