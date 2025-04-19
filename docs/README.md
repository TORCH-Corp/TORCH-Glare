# TORCH Glare Components Library

Welcome to the **TORCH Glare Components Library**! This library provides a collection of reusable React components to help you build user interfaces efficiently. Additionally, a CLI tool (**torch-glare CLI**) is available to streamline component management.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [CLI Commands](#cli-commands)
4. [Theming](#theming)
5. [Contributing](#contributing)
6. [License](#license)

## Installation


## 1. Initialize Your Project

To install the TORCH Glare Components Library, run the following command:

```sh
npx torch-glare@latest init
```

This command will:
- Create or modify the `tailwind.config.js` file to support Tailwind CSS for Tailwind versions less then 4.
- Generate a `torch.json` file where you can customize the installation path for components.

### Tailwind CSS Requirement
Ensure that Tailwind CSS is installed in your project before running the initialization command.

## 2. Add Essential Plugins for Tailwind CSS

If you're using Tailwind CSS version 4 or above, add the following plugins to your global CSS file:

```css
@import "tailwindcss";
/* Essential plugins */
@plugin 'glare-typography';
@plugin 'mapping-color-system';
@plugin 'glare-torch-mode';
@plugin 'tailwind-scrollbar-hide';
@plugin 'tailwindcss-animate';
```


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

## 3. Configure Installation Path

Adjust the `glare.json` file to specify where you want to install components:

```json
{
  "path": "./src" // The directory where components will be installed
}
```

### 4. Add Components
To add a specific component, run:

```sh
npx torch-glare@latest add [component-name]
```

Or, to add components interactively:

```sh
npx torch-glare@latest add
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
npx torch-glare@latest init
```
- Creates a `torch.json` configuration file.
- Create or modify `tailwind.config.ts` file for tailwind support.

### Add Components
```sh
npx torch-glare@latest add [component]
```
Adds a specific component or runs an interactive prompt if no name is provided.

### Add Hooks
```sh
npx torch-glare@latest hook [hook]
```
Adds a specific hook or runs an interactive prompt if no name is provided.

### Add Utilities
```sh
npx torch-glare@latest util [util]
```
Adds a specific utility or runs an interactive prompt if no name is provided.

### Providers
```sh
npx torch-glare@latest provider [provider]
```
Adds a specific provider or runs an interactive prompt if no name is provided.

### Update Installed Resources

```sh
npx torch-glare@latest update
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


