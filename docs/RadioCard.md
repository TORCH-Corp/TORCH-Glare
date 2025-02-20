```markdown
# RadioCard Component

## Overview

The `RadioCard` component is a customizable and visually appealing React component that provides a styled radio button card. It offers options for a header label, description, and custom content, making it suitable for various selection scenarios.

---

## Installation
```bash
npx torchcorp@latest add RadioCard
```


---

## Features

*   **Visually Appealing Card Design:** Provides a visually distinct card-like appearance for radio buttons.
*   **Header Label and Description:** Supports a header label and description for clear communication of the selection option.
*   **Custom Content:** Allows for custom content to be rendered within the card.
*   **Disabled State:** Supports a disabled state to prevent user interaction.
*   **Theming:** Supports `dark`, `light`, and `default` themes using a `data-theme` attribute.
*   **Styling Flexibility:** Uses `class-variance-authority` (CVA) for easy and maintainable styling.

---

## Props

| Prop           | Type                                        | Default  | Description                                                                                                                                                              |
| -------------- | ------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `headerLabel`  | `ReactNode`                                 |          | The text displayed as the header of the card.                                                                                                                          |
| `id`           | `string`                                    |          | The unique ID for the radio input, used to associate the label with the input.                                                                                        |
| `description`  | `ReactNode`                                 |          | A description of the radio option, displayed below the header.                                                                                                       |
| `disabled`     | `boolean`                                   | `false`  | Indicates whether the radio card is disabled, preventing user interaction.                                                                                             |
| `children`     | `ReactNode`                                 |          | Custom content to be rendered within the card below the description.                                                                                                   |
| `theme`        | `"dark"` \| `"light"` \| `"default"`         |          | Sets the theme for the component, affecting its color scheme. Uses the `data-theme` attribute.                                                                              |
| `...props`     | `Omit<InputHTMLAttributes<HTMLInputElement>, "size">` |          | Standard HTML attributes for the `input` element, excluding `size` (which is managed by the `RadioLabel` component). Includes `checked`, `onChange`, etc. |

---

## Usage

### Basic Usage

```jsx
import { RadioCard } from "./RadioCard";

function App() {
  return (
    <RadioCard id="option1" headerLabel="Option 1" value="option1" name="myOptions" />
  );
}
```

### With Description

```jsx
import { RadioCard } from "./RadioCard";

function App() {
  return (
    <RadioCard
      id="option2"
      headerLabel="Option 2"
      description="A detailed explanation of option 2"
      value="option2"
      name="myOptions"
    />
  );
}
```

### With Custom Content

```jsx
import { RadioCard } from "./RadioCard";

function App() {
  return (
    <RadioCard id="option3" headerLabel="Option 3" value="option3" name="myOptions">
      <p>Additional information about option 3.</p>
    </RadioCard>
  );
}
```

### Disabled State

```jsx
import { RadioCard } from "./RadioCard";

function App() {
  return (
    <RadioCard
      id="option4"
      headerLabel="Option 4"
      value="option4"
      name="myOptions"
      disabled
    />
  );
}
```

### Theming

```jsx
import { RadioCard } from "./RadioCard";

function App() {
  return (
    <RadioCard
      id="option5"
      headerLabel="Option 5"
      value="option5"
      name="myOptions"
      theme="dark"
    />
  );
}
```

### Complete Example with state management

```jsx
import { RadioCard } from "./RadioCard";
import React, { useState } from "react";

function App() {
    const [selectedValue, setSelectedValue] = useState("option1");

    return (
        <div>
            <RadioCard
                id="option1"
                headerLabel="Option 1"
                value="option1"
                name="myOptions"
                checked={selectedValue === "option1"}
                onChange={() => setSelectedValue("option1")}
            />
            <RadioCard
                id="option2"
                headerLabel="Option 2"
                description="A detailed explanation of option 2"
                value="option2"
                name="myOptions"
                checked={selectedValue === "option2"}
                onChange={() => setSelectedValue("option2")}
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
*   `./RadioLabel` component (from your project)
*   `cn` utility function (for conditionally applying CSS classes)

---

## Customization

You can customize the appearance of the `RadioCard` component by:

*   **Providing a custom `className`:** This allows you to add or override the default styles with your own CSS.
*   **Modifying the CVA styles:** Adjust the styles defined within the `glareRadioCard` variable to change the base styles and variants.
*   **Theming:** Use the `theme` prop to switch between predefined color schemes.

---

## Notes

*   Ensure your CSS or styling solution is configured to handle the CSS variables used for theming.
*   The `RadioLabel` component is expected to handle the actual radio input rendering and styling. Ensure it's correctly implemented and located at the specified relative path.

---

## Example Code

```jsx
import { RadioCard } from "./RadioCard";

function App() {
  return (
    <div>
      <RadioCard id="option1" headerLabel="Option 1" value="option1" name="myOptions" />
      <RadioCard
        id="option2"
        headerLabel="Option 2"
        description="A detailed explanation of option 2"
        value="option2"
        name="myOptions"
      />
      <RadioCard id="option3" headerLabel="Option 3" value="option3" name="myOptions">
        <p>Additional information about option 3.</p>
      </RadioCard>
      <RadioCard
        id="option4"
        headerLabel="Option 4"
        value="option4"
        name="myOptions"
        disabled
      />
      <RadioCard
        id="option5"
        headerLabel="Option 5"
        value="option5"
        name="myOptions"
        theme="dark"
      />
    </div>
  );
}
```
