# TORCH Glare Components Library

Welcome to the **TORCH Glare Components Library**! This library provides a collection of reusable React components to help you build user interfaces efficiently.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Contributing](#contributing)
4. [License](#license)

## Installation

To use the library, copy the required components into your project. Before doing so, follow these setup steps:

### 1. Wrap Your App with `ThemeWrapper`

Ensure your application is wrapped with `ThemeWrapper` in `main.tsx` or `index.tsx`:

```tsx
import { ThemeWrapper } from "./lib/providers/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeWrapper>
    <App />
  </ThemeWrapper>
);
```

### 2. Add Remix Icon Library

Include the following code in your `index.html` file to enable icon support:

```html
<head>
  <link
    href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
    rel="stylesheet"
  />
</head>
```

### 3. (Optional) Add SF-Pro Font

To use the SF-Pro font, add these lines to your `index.html`:

```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.statically.io/gh/TORCH-Corp/SF-PRO-FONT/main/font/fonts.css"
  />
  <link
    rel="preload"
    href="https://cdn.statically.io/gh/TORCH-Corp/SF-PRO-FONT/main/font/SF-Pro.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
</head>
```

### 4. Configure Tailwind CSS

Copy the full Tailwind configuration into your `tailwind.config.js` file:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  screens: {
    //...
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        // Full Tailwind configuration code goes here
      });
    },
  ],
};
```

## Usage

Once the setup is complete, you can start using the components in your project. Here’s an example of how to import and use a component:

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

## Contributing

We welcome contributions to improve the library! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Implement your changes and commit them with a clear message.
4. Push your changes to your forked repository.
5. Open a pull request to the main repository.

### Contribution Guidelines

- Follow the existing code style and conventions.
- Update documentation if necessary.

## License

This project is licensed under the **MIT License**.
