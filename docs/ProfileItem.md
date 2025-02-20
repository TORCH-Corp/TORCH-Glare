```markdown
# ProfileItem Component

## Overview

The `ProfileItem` component is a customizable React component designed to represent a profile or menu item with an icon, label, and optional dropdown content. It provides a visually appealing and interactive element that can be used in various contexts, such as profile menus or settings panels.

---

## Installation
```bash
npx torchcorp@latest add ProfileItem
```


## Features

*   **Visual Appeal:** Designed with a modern and engaging visual style.
*   **Dropdown Support:** Allows for optional dropdown content to be displayed when the item is clicked.
*   **State Management:** Manages its open/close state internally.
*   **Animated Arrow:** Includes an animated arrow that rotates based on the dropdown state.
*   **Theming:** Supports `dark`, `light`, and `default` themes using a `data-theme` attribute.
*   **Styling Flexibility:** Uses `class-variance-authority` (CVA) for easy and maintainable styling.
*   **Selection Highlighting:** Highlights the item when it is selected.
*   **Dynamic Width:**  Adjusts the dropdown width to match the item's width.

---

## Props

| Prop            | Type                                        | Default  | Description                                                                                                                                                                                  |
| --------------- | ------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`         | `ReactNode`                                 |          | The text displayed as the item's label.                                                                                                                                                      |
| `selected`      | `boolean`                                   | `false`  | Indicates whether the item is currently selected.                                                                                                                                             |
| `icon`          | `string`                                    |          | The URL of the image to use as the item's icon.                                                                                                                                              |
| `theme`         | `"dark"` \| `"light"` \| `"default"`         |          | Sets the theme for the component, affecting its color scheme. Uses the `data-theme` attribute.                                                                                               |
| `className`     | `string`                                    |          | Custom CSS class names to apply to the component's container.                                                                                                                                  |
| `popoverChildren`| `ReactNode`                                 |          | Content to be displayed in the dropdown popover when the item is clicked.                                                                                                                    |
| `overlayBlur`  | `boolean`                                    | `false`  | Enables a blur effect on the background overlay of the dropdown popover.                                                                                                                      |
| `...props`      | `HTMLAttributes<HTMLButtonElement>`           |          | Standard HTML attributes for the `button` element, allowing you to specify `onClick`, `id`, etc.                                                                                          |

---

## Usage

### Basic Usage

```jsx
import { ProfileItem } from "./ProfileItem";

function App() {
  return (
    <ProfileItem label="My Profile" icon="/profile.jpg" />
  );
}
```

### With Dropdown Content

```jsx
import { ProfileItem } from "./ProfileItem";

function App() {
  return (
    <ProfileItem
      label="Settings"
      icon="/settings.png"
      popoverChildren={
        <div>
          <p>Option 1</p>
          <p>Option 2</p>
        </div>
      }
    />
  );
}
```

### Selected State

```jsx
import { ProfileItem } from "./ProfileItem";

function App() {
  return (
    <ProfileItem label="Dashboard" icon="/dashboard.svg" selected />
  );
}
```

### Theming

```jsx
import { ProfileItem } from "./ProfileItem";

function App() {
  return (
    <ProfileItem label="Account" icon="/account.png" theme="dark" />
  );
}
```

### With Overlay Blur

```jsx
import { ProfileItem } from "./ProfileItem";

function App() {
  return (
    <ProfileItem
      label="Preferences"
      icon="/prefs.png"
      popoverChildren={
        <div>
          <p>Option 1</p>
          <p>Option 2</p>
        </div>
      }
      overlayBlur
    />
  );
}
```

### Full example

```jsx
import { ProfileItem } from "./ProfileItem";
import { useState } from "react";

function App() {
    const [selectedItem, setSelectedItem] = useState("profile");

    return (
        <div>
            <ProfileItem
                label="My Profile"
                icon="/profile.jpg"
                selected={selectedItem === "profile"}
                onClick={() => setSelectedItem("profile")}
            />
            <ProfileItem
                label="Settings"
                icon="/settings.png"
                selected={selectedItem === "settings"}
                onClick={() => setSelectedItem("settings")}
                popoverChildren={
                    <div>
                        <p>Option 1</p>
                        <p>Option 2</p>
                    </div>
                }
            />
            <ProfileItem
                label="Account"
                icon="/account.png"
                selected={selectedItem === "account"}
                onClick={() => setSelectedItem("account")}
                theme="dark"
            />
        </div>
    );
}
```

---

## Dependencies

*   `react`
*   `class-variance-authority`
*   `tailwindcss` (or CSS utility classes)
*   `./Popover` component (from your project)

---

## Customization

You can customize the appearance of the `ProfileItem` component by:

*   **Providing a custom `className`:** This allows you to add or override the default styles with your own CSS.
*   **Modifying the CVA styles:** Adjust the styles defined within the `profileItemStyles` variable to change the base styles and variants.
*   **Theming:** Use the `theme` prop to switch between predefined color schemes.

---

## Notes

*   The component relies on CSS variables for styling. Ensure your CSS or styling solution is configured to handle these variables correctly.
*   Make sure your Tailwind CSS configuration includes any necessary styles for the themes and selected state to render correctly.
*   The example uses Remix Icons. Ensure it's installed or replace the icon references with your preferred library.
*   Ensure you have your own Popover components installed at the correct relative path.

---

## Example Code

```jsx
import { ProfileItem } from "./ProfileItem";

function App() {
  return (
    <div>
      <ProfileItem label="My Profile" icon="/profile.jpg" />
      <ProfileItem
        label="Settings"
        icon="/settings.png"
        popoverChildren={
          <div>
            <p>Option 1</p>
            <p>Option 2</p>
          </div>
        }
      />
      <ProfileItem label="Dashboard" icon="/dashboard.svg" selected />
      <ProfileItem label="Account" icon="/account.png" theme="dark" />
      <ProfileItem
        label="Preferences"
        icon="/prefs.png"
        popoverChildren={
          <div>
            <p>Option 1</p>
            <p>Option 2</p>
          </div>
        }
        overlayBlur
      />
    </div>
  );
}
```
