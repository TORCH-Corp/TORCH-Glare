# Tailwind CSS Glare Typography Plugin

A Tailwind CSS plugin that provides a comprehensive set of typography utility classes for consistent and scalable text styling.

## Features
- Predefined typography styles for Display, Headers, Labels, and Body text.
- Supports multiple font weights: Bold, Semibold, Medium, and Regular.
- Responsive and customizable typography utilities.
- Easy integration with Tailwind CSS projects.

## Installation

Install the plugin via npm:

```bash
npm install glare-typography
```

Or using Yarn:

```bash
yarn add glare-typography
```

## Usage

Add the plugin to your `tailwind.config.js` file:

```js
module.exports = {
  plugins: [
    require('glare-typography')
  ]
}
```

Use the provided utility classes in your HTML or JSX:

```html
<h1 class="typography-display-large-bold">Display Large Bold</h1>
<p class="typography-body-medium-regular">Body Medium Regular</p>
<label class="typography-labels-small-semibold">Label Small Semibold</label>
```

## Available Classes

### Display Text
- `typography-display-large-bold`
- `typography-display-large-semibold`
- `typography-display-large-medium`
- `typography-display-large-regular`
- `typography-display-medium-bold`
- `typography-display-medium-semibold`
- `typography-display-medium-medium`
- `typography-display-medium-regular`
- `typography-display-small-bold`
- `typography-display-small-semibold`
- `typography-display-small-medium`
- `typography-display-small-regular`

### Headers
- `typography-headers-large-bold`
- `typography-headers-large-semibold`
- `typography-headers-large-medium`
- `typography-headers-large-regular`
- `typography-headers-medium-bold`
- `typography-headers-medium-semibold`
- `typography-headers-medium-medium`
- `typography-headers-medium-regular`
- `typography-headers-small-bold`
- `typography-headers-small-semibold`
- `typography-headers-small-medium`
- `typography-headers-small-regular`

### Labels
- `typography-labels-large-bold`
- `typography-labels-large-semibold`
- `typography-labels-large-medium`
- `typography-labels-large-regular`
- `typography-labels-medium-bold`
- `typography-labels-medium-semibold`
- `typography-labels-medium-medium`
- `typography-labels-medium-regular`
- `typography-labels-small-bold`
- `typography-labels-small-semibold`
- `typography-labels-small-medium`
- `typography-labels-small-regular`

### Body Text
- `typography-body-large-bold`
- `typography-body-large-semibold`
- `typography-body-large-medium`
- `typography-body-large-regular`
- `typography-body-medium-bold`
- `typography-body-medium-semibold`
- `typography-body-medium-medium`
- `typography-body-medium-regular`
- `typography-body-small-bold`
- `typography-body-small-semibold`
- `typography-body-small-medium`
- `typography-body-small-regular`

## Customization

You can extend or override the default styles by adding custom configurations in your `tailwind.config.js` file. For example:

```js
module.exports = {
  theme: {
    extend: {
      typography: {
        'display-large-bold': {
          fontSize: '36px',
          lineHeight: '125%',
          fontWeight: '700',
          letterSpacing: '-0.36px',
        },
      },
    },
  },
  plugins: [
    require('glare-typography')
  ]
}
```

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

If you find this plugin useful, consider giving it a ⭐️ on GitHub.

