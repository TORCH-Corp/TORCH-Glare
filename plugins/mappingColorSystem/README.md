
# Tailwind CSS Glare Themes Plugin

## Overview
The Tailwind CSS Themes Plugin is essential for the **Torch-Glare** library to function correctly. This plugin provides theme variables required by the library, ensuring seamless dark, light, and default mode support. Without this plugin, the Torch-Glare library will not work as expected.

### Important !!

this theme plugin must be used with theme mode plugin example :glare-torch-mod package, see in this example :

```ts
import type { Config } from "tailwindcss";
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
  },
  plugins: [
    require('mapping-color-system'),
    require('glare-torch-mode'), // important
  ],
} satisfies Config;

``` 

### Features
- Provides essential theme variables for **Torch-Glare**.
- Seamless integration with Tailwind CSS.
- Allows developers to access and use these theme variables directly within Tailwind CSS, enabling custom styling based on theme modes.

## Installation

To install and configure the plugin, follow these steps:

Install the plugin via npm:

```bash
npm install mapping-color-system
```

Or using Yarn:

```bash
yarn add mapping-color-system
```

## Usage

Add the plugin to your `tailwind.config.js` file:

```js,
module.exports = {
  plugins: [
    require('mapping-color-system'),
    require('glare-torch-mode'), // important
  ]
}
```

To enable the dark theme, add the `data-theme="dark"` attribute to the `<html>` or `<body>` tag:

```html
<html data-theme="dark">
<body>
  <!-- Your content -->
</body>
</html>
```

### Accessing Theme Variables in Tailwind CSS

Once the plugin is installed, you can use the provided theme variables directly in your Tailwind CSS styles. For example:

```html
<div class="bg-primary text-onPrimary">
  <!-- Content with theme-based colors -->
</div>
```

The plugin exposes a variety of theme variables such as `bg-primary`, `text-onPrimary`, `text-primary`, and more, which automatically adapt based on the active theme (light, dark, or default).
