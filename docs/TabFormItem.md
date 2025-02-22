```markdown
# TabFormItem Component

A customizable tab item component built with React and Tailwind CSS using `class-variance-authority`. This component provides styling for tab items in both a sidebar (`side`) and top bar (`top`) layout, with support for active states and icon/button variations.

## Features

- Supports two component types: `side` (sidebar) and `top` (top bar).
- Supports active and inactive states with distinct styling.
- Supports button and icon variations.
- Customizable themes (although theme implementation requires CSS variables).

## Installation

To install the component run:

```sh
npx torchcorp@latest add TabFormItem
```

## Usage

### Basic Example (Sidebar)

```tsx
import TabFormItem from "./TabFormItem";

const App = () => {
  return (
    <TabFormItem componentType="side" active={true}>
      Dashboard
    </TabFormItem>
  );
};

export default App;
```

### Basic Example (Top Bar)

```tsx
import TabFormItem from "./TabFormItem";

const App = () => {
  return (
    <TabFormItem componentType="top" active={false}>
      Settings
    </TabFormItem>
  );
};

export default App;
```

### Icon Example

```tsx
import TabFormItem from "./TabFormItem";
import { HomeIcon } from '@heroicons/react/24/solid'; // Example icon

const App = () => {
  return (
    <TabFormItem componentType="side" buttonType="icon" active={false}>
      <i className="ri-add-line"></i>
    </TabFormItem>
  );
};

export default App;
```

## Props

| Prop            | Type                        | Description                                                                                                                                                                                                       | Default   |
|-----------------|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| `componentType` | `"top" \| "side"`           | Determines the layout and styling of the tab item.  `"side"` is for sidebar tabs, `"top"` is for top bar tabs.                                                                                             | `"side"`  |
| `active`        | `boolean`                   | Indicates whether the tab item is currently active. Affects styling.                                                                                                                                            | `false`   |
| `buttonType`    | `"icon" \| "button"`         | Specifies whether the tab item should be styled as a standard button or as an icon-only button.                                                                                                               | `"button"`|
| `theme`         | `"dark" \| "light" \| "default"` | Defines the theme of the tab item.  Note that the theme implementation relies on CSS variables, so you'll need to define those variables in your CSS. The `data-theme` attribute is added to the button element, allowing you to style based on the selected theme.        | `"default"`|
| `children`      | `ReactNode`                  | The content to be displayed within the tab item (e.g., text, icons).                                                                                                                                            | -         |
| `onClick`       | `() => void`                | Callback function executed when the tab item is clicked.                                                                                                                                                        | -         |
| `className`     | `string`                    | Custom styles for the component.  Allows you to override or extend the default styles.                                                                                                                           | -         |
| All other ButtonHTMLAttributes | (inherited) | Other standard button attributes (e.g., `disabled`, `aria-label`).                                                                                                                                                     | -        |
