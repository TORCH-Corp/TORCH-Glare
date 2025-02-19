# Tailwind CSS Glare Themes Plugin

## Overview
The Tailwind CSS Themes Plugin is essential for the **Torch-Glare** library to function correctly. This plugin provides theme variables required by the library, ensuring seamless dark, light, default mode support. Without this plugin, the Torch-Glare library will not work as expected.

### Features
- Provides essential themes variables for **Torch-Glare**.
- Seamless integration with Tailwind CSS.

## Installation

To install and configure the plugin, follow these steps:

Install the plugin via npm:

```bash
npm install glare-themes
```

Or using Yarn:

```bash
yarn add glare-themes
```

## Usage

Add the plugin to your `tailwind.config.js` file:

```js
  plugins: [
    require('glare-themes')
  ]
```

To enable the dark theme, add the data-theme="dark" attribute to the <html> or <body> tag:

```html
Copy
Edit
<html data-theme="dark">
<body>
  <!-- Your content -->
</body>
</html>
```

