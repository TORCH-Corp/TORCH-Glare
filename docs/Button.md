# Button Component

## Overview

The `Button` component is a highly customizable and reusable React component that supports various styles, sizes, and states (e.g., loading, disabled).

---


## Installation

To install the component run:

```sh
npx torchcorp@latest add Button
```

## Features

- **Variants**: Supports multiple visual styles (`PrimeStyle`, `BlueSecStyle`, `YelSecStyle`, etc.).
- **Sizes**: Comes in three sizes (`S`, `M`, `L`).
- **States**: Handles loading and disabled states.
- **Types**: Supports both regular buttons and icon-only buttons.
- **Theming**: Optional theme support (`dark`, `light`, `default`).
- **Composability**: Can be used as a regular button or as a wrapper for custom elements using the `asChild` prop.
- **Loading Icon**: Includes a built-in animated loading spinner.

---


## Props

| Prop         | Type                                      | Default     | Description |
|-------------|-----------------------------------------|------------|-------------|
| `variant`   | `PrimeStyle`, `BlueSecStyle`, etc.     | `PrimeStyle` | Defines the visual style of the button. |
| `size`      | `S`, `M`, `L`                          | `M`         | Defines the size of the button. |
| `is_loading` | `boolean`                              | `false`     | Enables the loading state and displays a spinner. |
| `disabled`  | `boolean`                              | `false`     | Disables the button and applies disabled styles. |
| `buttonType` | `button`, `icon`                       | `button`    | Defines whether the button is a regular button or an icon-only button. |
| `asChild`   | `boolean`                              | `false`     | Allows the button to render as a wrapper for custom elements. |
| `as`        | `React.ElementType`                     | `button`    | Allows rendering the button as a different HTML element or React component. |
| `theme`     | `dark`, `light`, `default`             | `default`   | Applies a theme to the button. |
| `className` | `string`                               | `-`         | Additional custom classes for the button. |
| `children`  | `React.ReactNode`                      | `-`         | Content to be displayed inside the button. |

---

## Usage

### Basic Usage

```jsx
import { Button } from "./Button";

function App() {
  return (
    <Button variant="PrimeStyle" size="M">
      Click Me
    </Button>
  );
}
```

### Loading State

```jsx
<Button variant="BlueSecStyle" size="L" is_loading>
  Loading...
</Button>
```

### Disabled State

```jsx
<Button variant="RedSecStyle" size="S" disabled>
  Disabled
</Button>
```

### Icon Button

```jsx
<Button variant="BorderStyle" size="M" buttonType="icon">
  <Icon />
</Button>
```

### Custom Element

```jsx
<Button asChild>
  <a href="/">Link as Button</a>
</Button>
```

---

## Customization

### Variants

You can customize the button's appearance by selecting one of the predefined variants:

- `PrimeStyle`
- `BlueSecStyle`
- `YelSecStyle`
- `RedSecStyle`
- `BorderStyle`
- `PrimeContStyle`
- `BlueContStyle`
- `RedContStyle`

### Sizes

The button supports three sizes:

- `S`: Small
- `M`: Medium (default)
- `L`: Large

### Loading Icon

The `LoadingIcon` component is automatically displayed when `is_loading` is `true`. You can customize its size by passing the `size` prop.

### Theme Support

The button supports theming via the `theme` prop. You can apply `dark`, `light`, or `default` themes.

```jsx
<Button theme="dark" variant="PrimeStyle">
  Dark Theme
</Button>
```

---

## Notes

- The `asChild` prop allows the button to render as a wrapper for custom elements, making it highly composable.

---

## Example Code

```jsx
import { Button } from "./Button";

function App() {
  return (
    <div>
      <Button variant="PrimeStyle" size="M">
        Primary Button
      </Button>
      <Button variant="BlueSecStyle" size="L" is_loading>
        Loading...
      </Button>
      <Button variant="RedSecStyle" size="S" disabled>
        Disabled
      </Button>
      <Button variant="BorderStyle" size="M" buttonType="icon">
        <Icon />
      </Button>
      <Button asChild>
        <a href="/">Link as Button</a>
      </Button>
    </div>
  );
}
```