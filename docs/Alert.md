# FieldAlert Component

A reusable and customizable `FieldAlert` component built with React, TypeScript, and Tailwind CSS.

## Features

- Supports multiple FieldAlert states: **info, warning, error, success**
- Customizable icons and themes
- Uses `class-variance-authority (cva)` for styling flexibility
- Small and lightweight

Then, add the component to your project.

## Installation

To install the component run:

```sh
npx torchcorp@latest add FieldAlert
```

## Usage

### Basic Example

```tsx
import FieldAlert from "./FieldAlert";

const App = () => {
  return (
    <div>
      <FieldAlert label="This is an info FieldAlert" state="info" />
      <FieldAlert label="Warning: Check your input!" state="warning" />
      <FieldAlert label="Error: Something went wrong" state="error" />
      <FieldAlert label="Success: Your action was completed" state="success" />
    </div>
  );
};

export default App;
```

### Custom Icon Example

```tsx
<FieldAlert
  label="Custom FieldAlert with an icon"
  state="info"
  icon={<i className="ri-information-fill"></i>}
/>
```

### Theming

The component supports different themes:

```tsx
<FieldAlert label="Dark themed FieldAlert" state="info" theme="dark" />
<FieldAlert label="Light themed FieldAlert" state="success" theme="light" />
```

## Props

| Prop    | Type                            | Description                                     | Default |
|---------|---------------------------------|-------------------------------------------------|---------|
| `label` | `ReactNode`                     | The message displayed in the FieldAlert              | Required |
| `state` | `"info" | "warning" | "error" | "success"` | Defines the FieldAlert type and styling | `"info"` |
| `icon`  | `ReactNode`                     | Custom icon for the FieldAlert                      | Auto-generated based on `state` |
| `theme` | `"dark" | "light" | "default"`  | Defines the FieldAlert theme                        | `"default"` |
| `className` | `string`                     | Custom styles for the component                | - |

## Dependencies

- `class-variance-authority`
- `react`
- `tailwindcss` (or CSS utility classes)

