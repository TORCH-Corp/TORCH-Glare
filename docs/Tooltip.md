```markdown
# Tooltip Component

A customizable tooltip component built with React using Radix UI and Tailwind CSS.

## Features

- Customizable side placement (top, right, bottom, left).
- Customizable content alignment (start, center, end).
- Collision avoidance.
- Optional arrow indicator.
- Theming support.
- Control over open/close delay.

## Installation

To install the component run:

```sh
npx torchcorp@latest add Tooltip
```

## Usage

### Basic Example

```tsx
import { Tooltip } from "./Tooltip";

const App = () => {
  return (
    <Tooltip text="This is a tooltip!">
      <span>Hover over me</span>
    </Tooltip>
  );
};

export default App;
```

### Example with Custom Side

```tsx
import { Tooltip } from "./Tooltip";

const App = () => {
  return (
    <Tooltip text="Appears on the right" toolTipSide="right">
      <span>Hover for right tooltip</span>
    </Tooltip>
  );
};

export default App;
```

### Example with Custom Alignment

```tsx
import { Tooltip, ContentAlign } from "./Tooltip";

const App = () => {
  return (
    <Tooltip text="Aligned to the start" contentAlign={ContentAlign.START}>
      <span>Hover for start-aligned tooltip</span>
    </Tooltip>
  );
};

export default App;
```

### Example with Theming

```tsx
import { Tooltip } from "./Tooltip";

const App = () => {
  return (
    <Tooltip text="Dark theme tooltip" theme="dark">
      <span>Hover for dark tooltip</span>
    </Tooltip>
  );
};

export default App;
```

### Controlled Tooltip

```tsx
import { Tooltip } from "./Tooltip";
import { useState } from 'react';

const App = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Tooltip text="Controlled tooltip" open={isOpen} onOpenChange={setIsOpen}>
            <button onClick={() => setIsOpen(!isOpen)}>
                Toggle Tooltip
            </button>
        </Tooltip>
    );
};

export default App;
```

## Props

| Prop              | Type                                     | Description                                                                                                                                          | Default              |
|-------------------|------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|
| `text`            | `ReactNode`                              | The text content of the tooltip.                                                                                                                     | -                    |
| `children`        | `ReactNode`                              | The element that triggers the tooltip.                                                                                                                   | -                    |
| `open`            | `boolean`                                | Whether the tooltip is currently open (for controlled components).                                                                                    | -                    |
| `onOpenChange`    | `(open: boolean) => void`                 | Callback function triggered when the tooltip's open state changes (for controlled components).                                                               | -                    |
| `toolTipSide`       | `"top" \| "right" \| "bottom" \| "left"` | The preferred side of the trigger to render the tooltip.                                                                                             | `"top"`                |
| `contentAlign`    | `ContentAlign` (`START`, `CENTER`, `END`) | The alignment of the tooltip content relative to the trigger.                                                                                             | `ContentAlign.CENTER` |
| `avoidCollisions` | `boolean`                                | Whether to avoid collisions with the edges of the viewport.                                                                                             | `true`               |
| `delay`           | `number`                                 | The delay in milliseconds before the tooltip appears.                                                                                                 | `400`                |
| `tip`             | `boolean`                                | Whether to display an arrow indicator on the tooltip.                                                                                                  | `true`               |
| `variant`         | `"primary"`                              | The visual variant of the tooltip. Currently, only `"primary"` is supported.                                                                         | `"primary"`          |
| `className`       | `string`                                 | Custom CSS classes to apply to the tooltip content.                                                                                                  | -                    |
| `theme`           | `"dark" \| "light" \| "default"`           | Defines the theme of the tooltip. The theme is applied using the `data-theme` attribute, requiring you to define corresponding CSS variables.                                             | `"dark"`             |
| All other HTMLAttributes<HTMLSpanElement> | (inherited) | Other standard span attributes (e.g., `aria-label`).       | -       |

## Constants

```typescript
export enum ContentAlign {
  START = "start",
  CENTER = "center",
  END = "end",
}
```

