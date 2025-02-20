# Badge Component

The Badge component is a flexible and reusable UI element designed to display labels, icons, and interactive elements in a compact and visually appealing format. It supports various sizes, colors, and themes, making it suitable for a wide range of use cases.

## Features
- **Customizable Sizes:** Supports three sizes (XS, S, M).
- **Multiple Variants:** Offers 12 color variants (e.g., green, yellow, blue, gray, etc.).
- **Interactive Elements:** Includes an optional close button for unselecting the badge.
- **Theme Support:** Works with dark, light, and default themes.
- **Icon Support:** Allows adding custom icons or using default icons.


## Installation

```bash
npx torchcorp@latest add Badge
```

## Usage


### Basic Example
```jsx
import { Badge } from "@/components/Badge";

function Example() {
  return (
    <Badge
      label="Success"
      variant="green"
      size="M"
    />
  );
}
```

### With Icon and Close Button
```jsx
import { Badge } from "@/components/Badge";

function Example() {
  const handleUnselect = () => {
    console.log("Badge unselected");
  };

  return (
    <Badge
      label="Completed"
      variant="blue"
      size="S"
      badgeIcon={<i className="ri-add-line"></i>}
      isSelected
      onUnselect={handleUnselect}
    />
  );
}
```

### Themed Badge
```jsx
import { Badge } from "@/components/Badge";

function Example() {
  return (
    <Badge
      label="Warning"
      variant="yellow"
      size="M"
      theme="dark"
    />
  );
}
```

## Variants

The Badge component supports the following color variants:

| Variant        | Description                                    |
|---------------|------------------------------------------------|
| green        | Green background with matching border.        |
| greenLight   | Light green background with matching border.  |
| cocktailGreen | Cocktail green background with matching border. |
| yellow       | Yellow background with matching border.       |
| redOrange    | Red-orange background with matching border.   |
| redLight     | Light red background with matching border.    |
| rose         | Rose background with matching border.         |
| purple       | Purple background with matching border.       |
| bluePurple   | Blue-purple background with matching border.  |
| blue         | Blue background with matching border.         |
| navy         | Navy background with matching border.         |
| gray         | Gray background with matching border.         |

## Sizes

The Badge component supports three sizes:

| Size | Height | Icon Size | Text Style                        |
|------|--------|-----------|-----------------------------------|
| XS   | 18px   | 12px      | typography-body-small-medium     |
| S    | 22px   | 12px      | typography-body-small-medium     |
| M    | 26px   | 16px      | typography-body-medium-medium    |


## Props

| Prop Name  | Type                     | Description                                             | Default Value |
|------------|--------------------------|---------------------------------------------------------|---------------|
| label      | `string`                  | The text displayed in the badge.                        | `undefined`   |
| onUnselect | `() => void`              | Callback function triggered when the close button is clicked. | `undefined`   |
| isSelected | `boolean`                 | Determines if the badge is in a selected state (disables click interactions). | `false`        |
| badgeIcon  | `ReactNode`               | Custom icon to display in the badge.                   | `undefined`   |
| size       | `"XS" \| "S" \| "M"`      | The size of the badge.                                 | `"S"`         |
| variant    | `"green" \| "yellow" ...` | The color variant of the badge.                        | `"green"`     |
| className  | `string`                  | Additional custom class names for styling.             | `undefined`   |
| theme      | `"dark" \| "light" \| "default"` | The theme applied to the badge.                  | `"default"`   |


## Customization

### Adding Custom Styles
You can pass additional class names using the `className` prop:

```jsx
<Badge
  label="Custom"
  variant="purple"
  size="M"
  className="my-custom-class"
/>
```

### Using Custom Icons
Pass any React element as the `badgeIcon` prop:

```jsx
<Badge
  label="Featured"
  variant="yellow"
  size="M"
  badgeIcon={<i className="ri-add-line"></i>}
/>
```



