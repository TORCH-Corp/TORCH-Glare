# DropDownButton Component

## Overview
The `DropDownButton` component is a customizable dropdown button built using Radix UI's `@radix-ui/react-select`. It provides a flexible and accessible way to implement dropdown menus in React applications. The component supports multiple styles, variants, sizes, and error states.

## Installation
Ensure you have the required dependencies installed:

```sh
npx torchcorp@latest add DropDownButton
```

## Usage

### Basic Example
    ```tsx
import React from "react";
import { DropDownButton, DropDownButtonTrigger, DropDownButtonValue } from "./component `s/DropDownButton";

const MyComponent = () => {
  return (
    <DropDownButton>
      <DropDownButtonTrigger>
        <DropDownButtonValue placeholder="Select an option" />
      </DropDownButtonTrigger>
      <DropDownButtonContent>
        <DropDownButtonItem value="option1">Option 1</DropDownButtonItem>
        <DropDownButtonItem value="option2">Option 2</DropDownButtonItem>
        <DropDownButtonItem value="option3">Option 3</DropDownButtonItem>
      </DropDownButtonContent>
    </DropDownButton>
  );
};

export default MyComponent;
```

## Props

### `DropDownButtonTrigger`
    | Prop | Type | Description |
| -----------| --------| -------------|
| `className` | `string` | Additional class names for styling. |
| `size` | `'S' \| 'M' \| 'L' \| 'XL'` | Controls the size of the button.Default is`M`. |
| `variant` | `'PresentationStyle' \| 'SystemStyle'` | Determines the visual style of the button. |
| `errors` | `string` | Displays an error tooltip if provided. |
| `theme` | `'dark' \| 'light' \| 'default'` | The theme of the dropdown button. |
| `icon` | `string` | The icon to be displayed inside the button. |

### `DropDownButtonItem`
    | Prop | Type | Description |
| -----------| --------| -------------|
| `value` | `string` | The value associated with the menu item. |
| `variant` | `'Default' \| 'Warning' \| 'Negative' \| 'SystemStyle'` | Controls the item style.Default is`SystemStyle`. |
| `size` | `'S' \| 'M'` | Size of the item.Default is`M`. |
| `disabled` | `boolean` | Disables the item if `true`. |
| `active` | `boolean` | Marks the item as active if `true`. |

## Styling
The component uses Tailwind - like utility classes managed via`class-variance-authority (cva)`.You can extend the styles by modifying `dropdownButtonStyles` and`MenuItemStyles`.

## Customization
To customize icons, replace the `ri-arrow-down-s-line` icon class with another preferred icon from your icon library.

## Accessibility
    - Uses Radix UI primitives to ensure proper accessibility.
- Supports keyboard navigation and focus states.

## Conclusion
The `DropDownButton` component is a powerful, customizable dropdown solution that integrates well with Radix UI.It provides a modern, accessible dropdown experience with built -in support for themes, error handling, and flexible styling.

