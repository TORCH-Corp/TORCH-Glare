# ActionButton Component Documentation

## Overview

The `ActionButton` component is a specialized button designed for icon-based actions. It extends the functionality of the base `Button` component and provides additional size variants for consistent icon rendering. It is built using `class-variance-authority` (CVA) for managing class variants and integrates seamlessly with the `Button` component.

---

## Features

- **Size Variants**: Supports three sizes (`XS`, `S`, `M`) for consistent icon rendering.
- **Icon Support**: Optimized for icon-only usage with the `buttonType="icon"` prop.
- **Theming**: Supports optional theming (`dark`, `light`, `default`).
- **Composability**: Can be used as a regular button or as a wrapper for custom elements using the `asChild` prop.
- **Reusability**: Extends the base `Button` component for shared functionality.

---


## Installation

To install the component run:

```sh
npx torchcorp@latest add ActionButton
```


## Props

| Prop      | Type                   | Default   | Description |
|-----------|------------------------|-----------|-------------|
| size      | `XS`, `S`, `M`         | `M`       | Defines the size of the button. |
| asChild   | `boolean`              | `false`   | Allows the button to render as a wrapper for custom elements. |
| as        | `React.ElementType`     | `button`  | Allows rendering the button as a different HTML element or React component. |
| theme     | `dark`, `light`, `default` | `default` | Applies a theme to the button. |
| className | `string`               | `-`       | Additional custom classes for the button. |

---

## Usage

### Basic Usage

```jsx
import { ActionButton } from "./ActionButton";

function App() {
  return (
    <ActionButton size="M">
       <i className="ri-add-line"></i>
    </ActionButton>
  );
}
```

### Custom Size

```jsx
<ActionButton size="XS">
  <i className="ri-add-line"></i>
</ActionButton>
```

### Theming

```jsx
<ActionButton theme="dark" size="S">
  <i className="ri-add-line"></i>
</ActionButton>
```

### Custom Element

```jsx
<ActionButton asChild>
  <a href="/">
    <i className="ri-add-line"></i>
  </a>
</ActionButton>
```

---

## Size Variants

The `ActionButton` supports three sizes:

- **XS**: Extra Small (18px × 18px, 12px text)
- **S**: Small (22px × 22px, 12px text)
- **M**: Medium (32px × 32px, 18px text)

---

## Theming

The `theme` prop allows you to apply a theme to the button. Supported themes are:

- `dark`: Dark theme styling.
- `light`: Light theme styling.
- `default`: Default theme styling.

---

## Example Code

```jsx
import { ActionButton } from "./ActionButton";
import { Icon } from "./Icon"; // Example icon component

function App() {
  return (
    <div>
      <ActionButton size="XS">
        <i className="ri-add-line"></i>
      </ActionButton>
      <ActionButton size="S">
        <i className="ri-add-line"></i>
      </ActionButton>
      <ActionButton size="M">
        <i className="ri-add-line"></i>
      </ActionButton>
      <ActionButton theme="dark" size="M">
        <i className="ri-add-line"></i>
      </ActionButton>
      <ActionButton asChild>
        <a href="/">
          <i className="ri-add-line"></i>
        </a>
      </ActionButton>
    </div>
  );
}
```

---

## Notes

- The `ActionButton` is optimized for icon-based actions and uses the `buttonType="icon"` prop internally.
- It extends the base `Button` component, so all `Button` props are also supported.
