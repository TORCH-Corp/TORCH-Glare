# Counter Component

The `Counter` component is a reusable UI element designed to display numerical values in a compact, visually appealing manner. It features customizable themes, accessible styling, and seamless integration with CSS variables.

## Features

- **Customizable Styling:** Uses `class-variance-authority` for flexible styling.
- **Theme Support:** Supports `dark`, `light`, and `default` themes.
- **Variant Support:** Allows customization using the `variant` prop.
- **Accessible & Compact:** Ensures proper structure and visual clarity.

## Installation

To install and use the `Counter` component, run the following command:

```bash
npx torchcorp@latest add Counter
```

## Props

| Prop Name  | Type                                      | Description                                                   | Default Value |
|------------|-------------------------------------------|---------------------------------------------------------------|---------------|
| `label`    | `number`                                 | The numerical value to be displayed inside the counter.      | `undefined`   |
| `theme`    | `"dark" \| "light" \| "default"`         | Theme customization for the counter component.               | `"default"`   |
| `variant`  | `"default"`                              | Style variant of the counter.                                | `"default"`   |
| `...props` | `HTMLAttributes<HTMLDivElement>`         | Standard HTML `div` attributes (e.g., `onClick`, `style`).   | `undefined`   |

## Usage

### Basic Example

```tsx
import Counter from "@/components/Counter";

function Example() {
  return <Counter label={5} />;
}
```

### Themed Counter

```tsx
import Counter from "@/components/Counter";

function Example() {
  return <Counter label={10} theme="dark" />;
}
```

### Custom Class and Additional Props

```tsx
import Counter from "@/components/Counter";

function Example() {
  return <Counter label={20} className="my-custom-class" onClick={() => alert('Clicked!')} />;
}
```

## Customization

### Adding Custom Styles

You can pass additional class names using the `className` prop:

```tsx
<Counter label={50} className="bg-blue-500 text-white" />
```

### Using Variants

The component includes predefined style variants:

```tsx
<Counter label={30} variant="default" />
```
