# Glare Torch Mode

A **Tailwind CSS plugin** that provides custom styling for **Torch Glare** components, supporting different themes like **dark, light, and default**.

### Important !!

this mode plugin must be used with themes plugin example :mapping-color-system package, see in this example :

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
    require('mapping-color-system'),// important
    require('glare-torch-mode'), 
  ],
} satisfies Config;

``` 

## Installation

To use **Glare Torch Mode**, install it as a dependency in your project:

```sh
npm install glare-torch-mode
```

Or, if you're using **Yarn**:

```sh
yarn add glare-torch-mode
```

## Usage

Add the plugin to your **tailwind.config.js** file:

```js

module.exports = {
  plugins: [
    require('mapping-color-system'),// important
    require('glare-torch-mode')
  ],
};
```

