```markdown
# RingLoading Component

## Overview

The `RingLoading` component is a customizable React component that provides a visually appealing loading indicator with a circular animation. It supports different sizes and themes, allowing you to integrate it seamlessly into your application.

---

## Installation
```bash
npx torchcorp@latest add RingLoading
```

---

## Features

*   **Circular Animation:** Creates a smooth and engaging circular loading animation.
*   **Sizing Options:** Offers `S`, `M`, and `L` sizes to control the size of the loading indicator.
*   **Theming:** Supports `dark`, `light`, and `default` themes using a `data-theme` attribute, with different SVG icons for light and dark themes.
*   **Content Overlay:** Allows you to overlay content on top of the loading animation.
*   **Styling Flexibility:** Uses `class-variance-authority` (CVA) for easy and maintainable styling.

---

## Props

| Prop        | Type                | Default | Description                                                                                                                    |
| ----------- | ------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `size`      | `"S" \| "M" \| "L"` | `"M"`   | Controls the size of the loading indicator.                                                                                    |
| `theme`     | `"light" \| "dark" \| "default"` | `"light"` | Sets the theme for the component, affecting its color scheme and icon used. Uses the `data-theme` attribute.                                                                            |
| `children`  | `ReactNode`         |         | Content to be displayed on top of the loading animation (e.g., loading text or a custom icon).                                |
| `className` | `string`            |         | Custom CSS class names to apply to the component's container.                                                                 |
| `...props`  | `HTMLAttributes<HTMLDivElement>` |         | Standard HTML attributes for the `div` element, allowing you to specify `id`, `style`, etc.                                                       |

---

## Usage

### Basic Usage

```jsx
import RingLoading from "./RingLoading";

function App() {
  return (
    <RingLoading />
  );
}
```

### With Different Size

```jsx
import RingLoading from "./RingLoading";

function App() {
  return (
    <RingLoading size="L" />
  );
}
```

### With Theming

```jsx
import RingLoading from "./RingLoading";

function App() {
  return (
    <RingLoading theme="dark" />
  );
}
```

### With Content Overlay

```jsx
import RingLoading from "./RingLoading";

function App() {
  return (
    <RingLoading>
      Loading...
    </RingLoading>
  );
}
```

### With Custom ClassName

```jsx
import RingLoading from "./RingLoading";

function App() {
  return (
    <RingLoading className="my-4" />
  );
}
```

---

## Components

The `RingLoading` component includes the following sub-components for internal use:

*   **`DarkRingLoadingIcon`**: An SVG icon used for the dark theme.
*   **`RingLoadingIcon`**: An SVG icon used for the light theme.

You typically don't need to use these components directly.

---

## Dependencies

*   `react`
*   `class-variance-authority`
*   `tailwindcss` (or CSS utility classes)
*   `cn` utility function (for conditionally applying CSS classes)

---

## Customization

You can customize the appearance of the `RingLoading` component by:

*   **Providing a custom `className`:** This allows you to add or override the default styles with your own CSS.
*   **Modifying the CVA styles:** Adjust the styles defined within the `loadingFrame` variable to change the base styles and variants.
*   **Theming:** Use the `theme` prop to switch between predefined color schemes.
*   **Replacing the SVG Icons**: Create your own `RingLoadingIcon` and `DarkRingLoadingIcon` and replace it with your own svg path

---

## Notes

*   The component relies on CSS variables for theming. Ensure that your CSS or styling solution is configured to handle these variables correctly.
*   The component uses two different SVG icons for light and dark themes. Make sure both icons are defined and styled appropriately.
*   The `animate-spin` class used in the component is expected to be a Tailwind CSS class that provides the spinning animation.

---

## Example Code

```jsx
import RingLoading from "./RingLoading";

function App() {
  return (
    <div>
      <RingLoading />
      <RingLoading size="L" />
      <RingLoading theme="dark" />
      <RingLoading>Loading...</RingLoading>
      <RingLoading className="my-4" />
    </div>
  );
}
```
