# TORCH Glare Components Library

Welcome to the **TORCH Glare Components Library**! This library provides a collection of reusable React components to help you build user interfaces efficiently. Additionally, a CLI tool (**TorchCorp CLI**) is available to streamline component management.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [CLI Commands](#cli-commands)
4. [Contributing](#contributing)
5. [License](#license)

## Installation

To install and manage components, use the **TorchCorp CLI**. First, initialize the library by running:

```sh
npx torchcorp init
```

This creates a `torch.json` configuration file, which is required to manage components.

### 1. Add Components
To add a specific component, run:

```sh
npx torchcorp add [component-name]
```

Or, to add components interactively:

```sh
npx torchcorp add
```

### 2. Apply the Theme Provider
Ensure your application is wrapped with `ThemeProvider`. Add it in `main.tsx` or `index.tsx`:

```tsx
import { ThemeProvider } from "./lib/providers/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
```

Alternatively, you can install the theme provider via CLI:

```sh
npx torchcorp theme
```

### 3. Add Remix Icon Library
Include the following in `index.html` for icon support:

```html
<head>
  <link
    href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
    rel="stylesheet"
  />
</head>
```

### 4. Configure Tailwind CSS
Ensure your `tailwind.config.js` file includes the correct setup:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  screens: {
    // Custom screen configurations
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        // Full Tailwind configuration here
      });
    },
  ],
};
```

## Usage

Once installed, import and use the components as needed:

```tsx
import React from "react";
import { Button } from "./lib/components/base/Button";

const App = () => {
  return (
    <div>
      <Button />
    </div>
  );
};

export default App;
```

## CLI Commands

### Initialize Configuration
```sh
npx torchcorp init
```
Creates a `torch.json` configuration file.

### Add Components
```sh
npx torchcorp add [component]
```
Adds a specific component or runs an interactive prompt if no name is provided.

### Apply Theme Provider
```sh
npx torchcorp theme
```
Installs the `ThemeProvider`.

### Update Installed Components
```sh
npx torchcorp update
```
Updates all installed components.

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

