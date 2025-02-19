# Alert Component

A reusable and customizable `Alert` component built with React, TypeScript, and Tailwind CSS.

## Features

- Supports multiple alert states: **info, warning, error, success**
- Customizable icons and themes
- Uses `class-variance-authority (cva)` for styling flexibility
- Small and lightweight

Then, add the component to your project.

## Installation

To install the component run:

```sh
npx torchcorp@latest add Alert
```

## Usage

### Basic Example

```tsx
import Alert from "./Alert";

const App = () => {
  return (
    <div>
      <Alert label="This is an info alert" state="info" />
      <Alert label="Warning: Check your input!" state="warning" />
      <Alert label="Error: Something went wrong" state="error" />
      <Alert label="Success: Your action was completed" state="success" />
    </div>
  );
};

export default App;
```

### Custom Icon Example

```tsx
<Alert
  label="Custom alert with an icon"
  state="info"
  icon={<i className="ri-information-fill"></i>}
/>
```

### Theming

The component supports different themes:

```tsx
<Alert label="Dark themed alert" state="info" theme="dark" />
<Alert label="Light themed alert" state="success" theme="light" />
```

## Props

| Prop    | Type                            | Description                                     | Default |
|---------|---------------------------------|-------------------------------------------------|---------|
| `label` | `ReactNode`                     | The message displayed in the alert              | Required |
| `state` | `"info" | "warning" | "error" | "success"` | Defines the alert type and styling | `"info"` |
| `icon`  | `ReactNode`                     | Custom icon for the alert                      | Auto-generated based on `state` |
| `theme` | `"dark" | "light" | "default"`  | Defines the alert theme                        | `"default"` |
| `className` | `string`                     | Custom styles for the component                | - |

## Dependencies

- `class-variance-authority`
- `react`
- `tailwindcss` (or CSS utility classes)

