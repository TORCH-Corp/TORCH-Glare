# TORCH Glare Components Library

Welcome to the **TORCH Glare Components Library**! This library provides a collection of reusable React components to help you build user interfaces efficiently. Additionally, a CLI tool (**TorchCorp CLI**) is available to streamline component management.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [CLI Commands](#cli-commands)
4. [Theming](#theming)
5. [Contributing](#contributing)
6. [License](#license)

## Installation


### 1. Initialize Your Project.

To install and manage components, use the **TorchCorp CLI**. First, initialize the library by running:

```sh
npx torchcorp@latest init
```

This creates a `torch.json` configuration file and `tailwindcss` configuration file or modify, which is required to manage components.


### 2. Add Remix Icon Library
Include the following in `index.html` or nextjs `layout.tsx` or meta data for icon support:

```html
<html>
<head>
  <link
    href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
    rel="stylesheet"
  />
</head>
<body></body>
</html>

```

### 3. Add Components
To add a specific component, run:

```sh
npx torchcorp@latest add [component-name]
```

Or, to add components interactively:

```sh
npx torchcorp@latest add
```

## Usage

Once installed, import and use the components as needed:

```tsx
import React from "react";
import { Button } from "./components";

const App = () => {
  return (
    <div>
      <Button >Hello.</Button>
    </div>
  );
};

export default App;
```

## CLI Commands

### Initialize Configuration
```sh
npx torchcorp@latest init
```
- Creates a `torch.json` configuration file.
- Create or modify `tailwind.config.ts` file for tailwind support.

### Add Components
```sh
npx torchcorp@latest add [component]
```
Adds a specific component or runs an interactive prompt if no name is provided.

### Add Hooks
```sh
npx torchcorp@latest add-hook [hook]
```
Adds a specific hook or runs an interactive prompt if no name is provided.

### Add Utilities
```sh
npx torchcorp@latest add-util [util]
```
Adds a specific utility or runs an interactive prompt if no name is provided.

### Providers
```sh
npx torchcorp@latest add-provider [provider]
```
Adds a specific provider or runs an interactive prompt if no name is provided.

### Update Installed Resources

```sh
npx torchcorp@latest update
```
Updates all installed components, hooks, utilities, and providers.


## Theming

The TORCH Glare Components Library supports both light and dark themes. You can set a fixed theme for your components using the `theme` attribute.

### Setting a Fixed Theme

To apply a fixed theme (dark or light) to a component, add the `theme `attribute with the desired theme value:

```tsx
import React from "react";
import { Button } from "./components";

const App = () => {
  return (
    <div>
      <Button theme="dark">Dark Theme Button</Button>
      <Button theme="light">Light Theme Button</Button>
    </div>
  );
};

export default App;
```

### Global Theme

To apply a theme globally, wrap your application with the `ThemeProvider` and set the optional `defaultTheme` props:


```tsx
import { ThemeProvider } from "./components";

const App = () => {
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider defaultTheme="light" defaultThemeMode="TORCH">
    <App />
  </ThemeProvider>
);
};

export default App;
```

## Contributing

We welcome contributions! Follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Implement your changes.
4. Commit with a clear message.
5. Push your changes and open a pull request.

### Contribution Guidelines
- Follow existing code style.
- Update documentation if necessary.

## License

This project is licensed under the **MIT License**.

