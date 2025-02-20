```markdown
# Popover Component

## Overview

This component provides a customizable popover/dropdown menu using Radix UI primitives, styled with `class-variance-authority` for flexibility and theming.

---

## Installation
```bash
npx torchcorp@latest add Popover
```


Ensure that `react` and `tailwindcss` are installed and configured in your project if you are using Tailwind CSS for styling.  You'll also need the `cn` utility function.

---

## Features

*   **Radix UI Primitives:** Leverages Radix UI for accessibility and unstyled behavior.
*   **Theming:** Supports `dark`, `light`, and `default` themes via the `data-theme` attribute on the `PopoverContent`.
*   **Styling Variants:** Offers `SystemStyle` and `PresentationStyle` variants for different visual appearances.
*   **Overlay Blur:** Optional background blur effect for the popover.
*   **Scrollable Content:** Supports long lists with a scrollable area and hidden scrollbar.
*   **Animated Transitions:** Includes fade-in and fade-out animations.
*   **Customizable Items:** Provides a `PopoverItem` component for consistent styling of menu items.
*   **Active Item Highlighting:**  Highlights the currently active `PopoverItem` and scrolls to it on open.
*   **Composability**: Can be used as a regular popover or as a wrapper for custom elements using the `asChild` prop.

---

## Components

### `Popover`

The root component that wraps the entire popover structure.

```jsx
import { Popover } from "./Popover";

<Popover>
  {/* PopoverTrigger and PopoverContent go here */}
</Popover>
```

### `PopoverTrigger`

The component that triggers the popover to open.

```jsx
import { Popover, PopoverTrigger } from "./Popover";

<Popover>
  <PopoverTrigger>Open Popover</PopoverTrigger>
  {/* PopoverContent goes here */}
</Popover>
```

#### `PopoverTrigger` Props

| Prop        | Type                                                                 | Description                                                                                                                                                     |
| ----------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className` | `string`                                                             | Custom CSS class names to apply to the trigger element.                                                                                                        |
| `...props`  | `React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>` | Standard Radix UI Popover.Trigger props.  Refer to the Radix UI documentation: https://www.radix-ui.com/docs/primitives/components/popover                     |

### `PopoverContent`

The component that contains the popover's content.

```jsx
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";

<Popover>
  <PopoverTrigger>Open Popover</PopoverTrigger>
  <PopoverContent>
    {/* Popover content goes here */}
  </PopoverContent>
</Popover>
```

#### `PopoverContent` Props

| Prop          | Type              | Default           | Description                                                                                                                     |
| ------------- | ----------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `className`   | `string`          |                   | Custom CSS class names to apply to the content element.                                                                        |
| `align`       | `"start" \| "center" \| "end"` | `"center"`        | Alignment of the popover content relative to the trigger.                                                                      |
| `sideOffset`  | `number`          | `4`               | Offset of the popover from the trigger.                                                                                       |
| `variant`     | `"SystemStyle" \| "PresentationStyle"` | `"PresentationStyle"` | Selects the visual style variant for the popover content.                                                                      |
| `overlayBlur` | `boolean`         | `false`           | Enables a blur effect on the background overlay.                                                                              |
| `theme`          | `"dark"` \| `"light"` \| `"default"`     |                 | Sets the theme for the popover content, affecting its color scheme. Uses the `data-theme` attribute.                                          |
| `...props`    | `React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>` | Standard Radix UI Popover.Content props.  Refer to the Radix UI documentation: https://www.radix-ui.com/docs/primitives/components/popover |

### `PopoverItem`

A styled component for displaying individual items within the popover.

```jsx
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from "./Popover";

<Popover>
  <PopoverTrigger>Open Popover</PopoverTrigger>
  <PopoverContent>
    <PopoverItem>Item 1</PopoverItem>
    <PopoverItem>Item 2</PopoverItem>
  </PopoverContent>
</Popover>
```

#### `PopoverItem` Props

| Prop        | Type                                                                                             | Default   | Description                                                                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`   | `"Default" \| "Warning" \| "Negative" \| "SystemStyle"`                                             | `"Default"` | Selects the visual style variant for the popover item.                                                                                                     |
| `size`      | `"S" \| "M"`                                                                                     | `"M"`       | Controls the size of the popover item.                                                                                                                            |
| `asChild`   | `boolean`                                                                                        | `false`   | Uses the Radix UI `Slot` component, allowing you to render the `PopoverItem` as a child of another element.                                                     |
| `className` | `string`                                                                                           |           | Custom CSS class names to apply to the item element.                                                                                                         |
| `children`  | `React.ReactNode`                                                                                  |           | The content to be displayed within the item.                                                                                                                    |
| `active`    | `boolean`                                                                                        | `false`   | Indicates whether the item is currently active and should be highlighted.                                                                                         |
| `as`        | `React.ElementType`                                                                                | `"li"`      | Allows rendering the item as a different HTML element or React component.                                                                                     |
| `...props`  | `Omit<React.ComponentPropsWithoutRef<T>, keyof Props<T>>`                                     |           | Standard HTML attributes for the chosen element (e.g., `li`), allowing you to specify `onClick`, `id`, etc.                                                  |

---

## Usage

### Basic Usage

```jsx
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from "./Popover";

function App() {
  return (
    <Popover>
      <PopoverTrigger>Open Menu</PopoverTrigger>
      <PopoverContent>
        <PopoverItem>Profile</PopoverItem>
        <PopoverItem>Settings</PopoverItem>
        <PopoverItem>Logout</PopoverItem>
      </PopoverContent>
    </Popover>
  );
}
```

### Theming

```jsx
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from "./Popover";

function App() {
  return (
    <Popover>
      <PopoverTrigger>Open Menu</PopoverTrigger>
      <PopoverContent theme="dark">
        <PopoverItem>Profile</PopoverItem>
        <PopoverItem>Settings</PopoverItem>
        <PopoverItem>Logout</PopoverItem>
      </PopoverContent>
    </Popover>
  );
}
```

### With Overlay Blur

```jsx
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from "./Popover";

function App() {
  return (
    <Popover>
      <PopoverTrigger>Open Menu</PopoverTrigger>
      <PopoverContent overlayBlur>
        <PopoverItem>Profile</PopoverItem>
        <PopoverItem>Settings</PopoverItem>
        <PopoverItem>Logout</PopoverItem>
      </PopoverContent>
    </Popover>
  );
}
```

### AsChild example

```jsx
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from "./Popover";

function App() {
  return (
    <Popover>
      <PopoverTrigger asChild>
          <button>Open Menu</button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverItem>Profile</PopoverItem>
        <PopoverItem>Settings</PopoverItem>
        <PopoverItem>Logout</PopoverItem>
      </PopoverContent>
    </Popover>
  );
}
```

### Scrollable Content

```jsx
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from "./Popover";

function App() {
  const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

  return (
    <Popover>
      <PopoverTrigger>Open Menu</PopoverTrigger>
      <PopoverContent>
        {items.map((item, index) => (
          <PopoverItem key={index}>{item}</PopoverItem>
        ))}
      </PopoverContent>
    </Popover>
  );
}
```

### Active item example
```jsx
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from "./Popover";
import { useState } from "react";
function App() {
    const [activeItem, setActiveItem] = useState(1);
    return (
        <Popover>
            <PopoverTrigger>Open Menu</PopoverTrigger>
            <PopoverContent>
                <PopoverItem active={activeItem === 1} onClick={() => setActiveItem(1)}>
                    Item 1
                </PopoverItem>
                <PopoverItem active={activeItem === 2} onClick={() => setActiveItem(2)}>
                    Item 2
                </PopoverItem>
                <PopoverItem active={activeItem === 3} onClick={() => setActiveItem(3)}>
                    Item 3
                </PopoverItem>
            </PopoverContent>
        </Popover>
    );
}
```

---

## Dependencies

*   `react`
*   `class-variance-authority`
*   `@radix-ui/react-popover`
*   `@radix-ui/react-slot`
*   `tailwindcss` (or CSS utility classes)

---

## Customization

You can customize the appearance of the components by:

*   **Providing a custom `className`:** This allows you to add or override the default styles with your own CSS.
*   **Modifying the CVA styles:** Adjust the styles defined within the `dropdownMenuStyles` and `PopoverItemStyles` variables to change the base styles and variants.
*   **Theming:** Use the `theme` prop to switch between predefined color schemes.

---

## Notes

*   Ensure that Radix UI's CSS is correctly set up in your project to handle transitions and data attributes.
*   Make sure your Tailwind CSS configuration includes any necessary styles for the themes and variants to render correctly.

---

## Example Code

```jsx
import { Popover, PopoverTrigger, PopoverContent, PopoverItem } from "./Popover";

function App() {
  return (
    <div>
      <Popover>
        <PopoverTrigger>Open Menu</PopoverTrigger>
        <PopoverContent>
          <PopoverItem>Profile</PopoverItem>
          <PopoverItem>Settings</PopoverItem>
          <PopoverItem>Logout</PopoverItem>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger>Open Menu (Dark Theme)</PopoverTrigger>
        <PopoverContent theme="dark">
          <PopoverItem>Profile</PopoverItem>
          <PopoverItem>Settings</PopoverItem>
          <PopoverItem>Logout</PopoverItem>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger>Open Menu (Blurred)</PopoverTrigger>
        <PopoverContent overlayBlur>
          <PopoverItem>Profile</PopoverItem>
          <PopoverItem>Settings</PopoverItem>
          <PopoverItem>Logout</PopoverItem>
        </PopoverContent>
      </Popover>
    </div>
  );
}
```
