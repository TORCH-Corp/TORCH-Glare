```markdown
# LinkButton Component

## Overview

The `LinkButton` component is a customizable React component designed to create visually appealing and interactive link buttons. It features animated hover effects and supports different sizes and themes.

---

## Installation

```bash
npx torchcorp@latest add LinkButton
```


Ensure that `react` and `tailwindcss` are installed and configured in your project if you are using Tailwind CSS for styling.

---

## Features

*   **Sizes:** Supports `S` and `M` sizes for different button dimensions.
*   **Theming:** Offers `dark`, `light`, and `default` themes to match your application's style.
*   **Animated Hover Effect:** Includes an animated arrow that appears on hover.
*   **Styling Flexibility:** Uses `class-variance-authority` (CVA) for easy and maintainable styling.

---

## Props

| Prop        | Type                                               | Default      | Description                                                                                                                                                |
| ----------- | -------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `size`      | `"S"` \| `"M"`                                     | `"S"`        | Controls the size of the link button.                                                                                                                       |
| `theme`     | `"dark"` \| `"light"` \| `"default"`               |              | Sets the theme for the component, affecting its color scheme. Uses the `data-theme` attribute.                                                               |
| `children`  | `ReactNode`                                          |              | The text or content displayed inside the link button.                                                                                                     |
| `...props`  | `AnchorHTMLAttributes<HTMLAnchorElement>`            |              | Standard HTML attributes for the `a` (anchor) element, allowing you to specify `href`, `target`, etc.                                                    |

---

## Usage

### Basic Usage

```jsx
import { LinkButton } from "./LinkButton";

function App() {
  return (
    <LinkButton href="/about">Learn More</LinkButton>
  );
}
```

### Different Size

```jsx
import { LinkButton } from "./LinkButton";

function App() {
  return (
    <LinkButton href="/contact" size="M">Contact Us</LinkButton>
  );
}
```

### Theming

```jsx
import { LinkButton } from "./LinkButton";

function App() {
  return (
    <LinkButton href="/blog" theme="dark">Read Our Blog</LinkButton>
  );
}
```

### With Custom ClassName

```jsx
import { LinkButton } from "./LinkButton";

function App() {
  return (
    <LinkButton href="/products" className="bg-blue-500 hover:bg-blue-700 text-white">View Products</LinkButton>
  );
}
```

---

## Dependencies

*   `react`
*   `class-variance-authority`
*   `tailwindcss` (or CSS utility classes)

---

## Customization

You can customize the appearance of the `LinkButton` component by:

*   **Providing a custom `className`:** This allows you to add or override the default styles with your own CSS.
*   **Modifying the CVA styles:** Adjust the styles defined within the `linkButtonStyles` variable to change the base styles and variants.
*   **Theming:** Use the `theme` prop to switch between predefined color schemes.

---

## Notes

*   Make sure your Tailwind CSS configuration includes any necessary styles for the themes to render correctly.
*   The animated arrow effect relies on CSS transitions and the `group` class in Tailwind CSS.
*   The `Arrow` component is an inline SVG and can be customized or replaced with a different icon as needed.

---

## Example Code

```jsx
import { LinkButton } from "./LinkButton";

function App() {
  return (
    <div>
      <LinkButton href="/about">Learn More</LinkButton>
      <LinkButton href="/contact" size="M">Contact Us</LinkButton>
      <LinkButton href="/blog" theme="dark">Read Our Blog</LinkButton>
      <LinkButton href="/products" className="bg-blue-500 hover:bg-blue-700 text-white">View Products</LinkButton>
    </div>
  );
}
```
