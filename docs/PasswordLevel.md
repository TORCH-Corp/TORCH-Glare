```markdown
# PasswordLevel Component

## Overview

The `PasswordLevel` component is a React component that provides a visual indicator of password strength based on the input value. It checks for minimum length, symbol presence, and uppercase letter presence to determine the password level.

---

## Installation
```bash
npx torchcorp@latest add PasswordLevel
```


---

## Features

*   **Real-time Password Strength:** Dynamically updates the password strength indicator as the user types.
*   **Strength Criteria:** Checks for minimum length, symbol presence, and uppercase letter presence.
*   **Visual Indicator:** Provides a visual representation of password strength using colored bars.
*   **Theming:** Supports `dark`, `light`, and `default` themes using a `data-theme` attribute.

---

## Props

| Prop        | Type              | Default | Description                                                                                                                                        |
| ----------- | ----------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`     | `string`          |         | The password value to check and evaluate.                                                                                                          |
| `theme`     | `"dark" \| "light" \| "default"` |         | Sets the theme for the component, affecting its color scheme. Uses the `data-theme` attribute.                                                                   |
| `className` | `string`          |         | Custom CSS class names to apply to the component's container.                                                                                       |
| `...props`  | `HTMLAttributes<HTMLDivElement>` |         | Standard HTML attributes for the `div` element, allowing you to specify `id`, `style`, etc.                                         |

---

## Usage

### Basic Usage

```jsx
import { PasswordLevel } from "./PasswordLevel";

function App() {
  return (
    <PasswordLevel value="MyPassword123!" />
  );
}
```

### With Theming

```jsx
import { PasswordLevel } from "./PasswordLevel";

function App() {
  return (
    <PasswordLevel value="Weak" theme="dark" />
  );
}
```

### Controlled Input Example:

```jsx
import React, { useState } from 'react';
import { PasswordLevel } from './PasswordLevel';

function App() {
  const [password, setPassword] = useState('');

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />
      <PasswordLevel value={password} />
    </div>
  );
}
```

---

## Dependencies

*   `react`
*   `tailwindcss` (or CSS utility classes)
*   `cn` utility function (for conditionally applying CSS classes)

---

## Customization

You can customize the appearance of the `PasswordLevel` component by:

*   **Providing a custom `className`:** This allows you to add or override the default styles with your own CSS.
*   **Modifying the CSS classes:** Adjust the CSS classes within the component to change the base styles and colors.
*   **Theming:** Use the `theme` prop to switch between predefined color schemes (make sure your CSS handles the `data-theme` attribute).

---

## Notes

*   The component relies on CSS variables for styling. Ensure your CSS or styling solution is configured to handle these variables correctly.
*   Consider improving the password strength criteria to match the security requirements of your application.

---

## Example Code

```jsx
import { PasswordLevel } from "./PasswordLevel";

function App() {
  const [password, setPassword] = useState('');

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />
      <PasswordLevel value={password} theme="light" />
    </div>
  );
}
```
