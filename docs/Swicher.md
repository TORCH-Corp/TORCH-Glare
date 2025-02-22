```markdown
# Switcher Component

A customizable toggle switch component built with React and Tailwind CSS.

## Features

- Supports active and disabled states with labels.
- Customizable themes.
- Smooth transition animations.

## Installation

To install the component run:

```sh
npx torchcorp@latest add Switcher
```

## Usage

### Basic Example

```tsx
import { Switcher } from "./Switcher";
import { useState } from "react";

const App = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Switcher
      active={isActive}
      activeLabel="Active"
      disabledLabel="Inactive"
      onClick={() => setIsActive(!isActive)}
    />
  );
};

export default App;
```

### Theming

The component supports different themes:

```tsx
<Switcher active={true} activeLabel="Dark On" disabledLabel="Dark Off" theme="dark" />
<Switcher active={false} activeLabel="Light On" disabledLabel="Light Off" theme="light" />
<Switcher active={true} activeLabel="Default On" disabledLabel="Default Off" theme="default" />
```

## Props

| Prop          | Type                  | Description                                                              | Default |
|---------------|-----------------------|--------------------------------------------------------------------------|---------|
| `active`       | `boolean`             | Determines if the switcher is in the active state.                       | `false` |
| `activeLabel`  | `string`              | Label displayed when the switcher is active.                              | -       |
| `disabledLabel`| `string`              | Label displayed when the switcher is inactive.                            | -       |
| `theme`        | `"dark" \| "light" \| "default"` | Defines the theme of the switcher.                                          | `"default"` |
| `onClick`      | `() => void`         | Callback function executed when the switcher is clicked.                   | -       |
| `className`    | `string`              | Custom styles for the component.                                           | -       |
| All other ButtonHTMLAttributes | (inherited) | Other standard button attributes (e.g., `disabled`, `aria-label`).       | -       |

