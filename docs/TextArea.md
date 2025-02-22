```markdown
# Textarea Component

A customizable textarea component built with React and Tailwind CSS using `class-variance-authority`.  Supports optional labels, different states (e.g., negative for errors), and theming.

## Features

- Themed styling.
- Optional labels with required and secondary indicators.
- Supports a "negative" state for error indication.
- Customizable direction (row or column) for label and textarea layout.

## Installation

To install the component run:

```sh
npx torchcorp@latest add Textarea
```

## Usage

### Basic Example

```tsx
import { Textarea } from "./Textarea";

const App = () => {
  return (
    <Textarea placeholder="Enter text here" />
  );
};

export default App;
```

### Example with Label

```tsx
import { Textarea } from "./Textarea";

const App = () => {
  return (
    <Textarea label="Description" placeholder="Enter a description" />
  );
};

export default App;
```

### Example with Required Label

```tsx
import { Textarea } from "./Textarea";

const App = () => {
  return (
    <Textarea label="Comment" requiredLabel="*" placeholder="Enter your comment" />
  );
};

export default App;
```

### Example with Negative State (Error)

```tsx
import { Textarea } from "./Textarea";

const App = () => {
  return (
    <Textarea label="Feedback" state="negative" placeholder="Please provide feedback" />
  );
};

export default App;
```

### Example with Column Direction

```tsx
import { Textarea } from "./Textarea";

const App = () => {
  return (
    <Textarea label="Message" direction="column" placeholder="Type your message here" />
  );
};

export default App;
```

### Example with Dark Theme

```tsx
import { Textarea } from "./Textarea";

const App = () => {
  return (
    <Textarea label="Notes" theme="dark" placeholder="Enter your notes" />
  );
};

export default App;
```

## Props

| Prop            | Type                        | Description                                                                                                                                                                                                 | Default   |
|-----------------|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| `label`         | `string`                    | The main label for the textarea.                                                                                                                                                                      | -         |
| `requiredLabel` | `string`                    | A label to indicate that the textarea is a required field (e.g., "*").                                                                                                                                     | -         |
| `secondaryLabel`| `string`                    | An additional label to provide extra information.                                                                                                                                                           | -         |
| `direction`     | `"row" \| "column"`           | Determines the layout of the label and textarea. `"row"` places the label to the left, and `"column"` places it above.                                                                                     | `"row"`   |
| `state`         | `"negative"`                | Defines the state of the textarea. `"negative"` applies error styling.                                                                                                                                | -         |
| `theme`         | `"dark" \| "light" \| "default"` | Defines the theme of the textarea.  The theme is applied using the `data-theme` attribute, so you'll need to define CSS variables for each theme.                                                         | `"default"`|
| `className`     | `string`                    | Custom styles for the component. Allows you to override or extend the default styles.                                                                                                                      | -         |
| All other TextareaHTMLAttributes<HTMLTextAreaElement> | (inherited) | Other standard textarea attributes (e.g., `placeholder`, `onChange`, `disabled`, `value`).                                                                                                         | -        |

