---
title: Getting Started with TORCH Glare
description: Step-by-step guide to installing and using TORCH Glare Components Library in your project.
category: Tutorial
difficulty: Beginner
duration: 15 minutes
tags: [getting-started, installation, setup, first-component, cli, tailwind]
related:
  - Building Your First Form
  - Theming Basics
  - Component Composition
---

# Getting Started with TORCH Glare

Welcome to TORCH Glare! This tutorial will guide you through installing the library, setting up your project, and creating your first component.

## What You'll Learn

- Installing TORCH Glare using the CLI
- Configuring Tailwind CSS with TORCH plugins
- Adding components to your project
- Creating your first components

## Prerequisites

Before you begin, make sure you have:

- Node.js 16+ installed
- Basic knowledge of React and TypeScript
- A React project with Tailwind CSS installed (Next.js, Vite, or Create React App)

---

## Step 1: Initialize TORCH Glare

Run the following command to initialize your project:

```bash
npx torch-glare@latest init
```

This will install the required dependencies and generate a `glare.json` file, where you can customize the installation path for your components.

### Configure Component Path

The generated `glare.json` file controls where components are installed:

```json
{
  "path": "./src"
}
```

Adjust the `path` to match your project structure (e.g., `./src`, `./app`, `./components`).

---

## Step 2: Add Fonts and Icons

Add Remix Icons CDN and SF-Pro font to your HTML `<head>` or metadata. SF-Pro is the standard font family for TORCH Glare Components.

```html
<head>
    <link
        href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
        rel="stylesheet"
    />
    <link
        rel="stylesheet"
        href="https://cdn.statically.io/gh/TORCH-Corp/SF-PRO-FONT/main/font/fonts.css"
    />
    <link
        rel="preload"
        href="https://cdn.statically.io/gh/TORCH-Corp/SF-PRO-FONT/main/font/SF-Pro.woff2"
        as="font"
        type="font/woff2"
    />
</head>
```

---

## Step 3: Configure Tailwind CSS

### For Tailwind CSS v4

Add the following to your `global.css` file:

```css
@import "tailwindcss";
/* IMPORTANT: this @import MUST come before any @plugin or @source rule.
   CSS requires all @import statements to precede other at-rules, so if it
   is placed after the @plugin lines the bundler (Vite/Lightning CSS,
   PostCSS) silently drops it. That removes every --color-* registration
   this file provides and breaks ALL bg/text/border-*-presentation-* utilities
   (e.g. Badge renders with no background). Keep it directly under
   @import "tailwindcss". */
@import "mapping-color-system-v4/tailwindVars.css";
@plugin "glare-torch-mode";
@plugin "tailwind-scrollbar-hide";
@plugin "tailwindcss-animate";
@plugin "glare-typography";
@plugin "mapping-color-system-v4";
```

> ⚠️ **Common failure:** if your Badge (or any component using
> `bg-background-presentation-*` colors) renders with no background, the
> `tailwindVars.css` `@import` is almost certainly positioned **after** the
> `@plugin` rules and is being dropped as an invalid `@import`. Move it up,
> directly below `@import "tailwindcss"`, and rebuild. Look for the build
> warning `@import must precede all other statements` — that confirms it.

### For Tailwind CSS v3

First install the mapping color system:

```bash
npm install mapping-color-system@latest
```

Then configure your `tailwind.config.js`:

```js
const { plugin, mappingVars } = require('mapping-color-system')

module.exports = {
    content: [
        // put the path from your glare.json file, e.g.:
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: mappingVars,
        },
    },
    plugins: [
        plugin,
        require('tailwindcss-animate'),
        require('tailwind-scrollbar-hide'),
        require('glare-typography'),
        require('glare-torch-mode'),
        function ({ addVariant }) {
            addVariant("rtl", '&[dir="rtl"]');
            addVariant("ltr", '&[dir="ltr"]');
        },
    ],
};
```

Important:
- Specify the component path in the `content` array matching your `glare.json` path
- Add all plugins to the `plugins` array
- Add `mappingVars` to the `extend.colors` object

---

## Step 4: Add Components

Run the following command to see a dropdown list of available components:

```bash
npx torch-glare@latest add
```

Or specify which component you want:

```bash
npx torch-glare@latest add Button
```

You can add multiple components at once:

```bash
npx torch-glare@latest add Button Input Badge
```

---

## Step 5: Use Components

Import and use the components from the path configured in `glare.json`:

```tsx
import { Button } from "./components/Button";

function App() {
  return (
    <Button variant="PrimeStyle" size="M">
      Click Me
    </Button>
  );
}
```

### Button Variants

```tsx
import { Button } from "./components/Button";

export default function ButtonShowcase() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant="PrimeStyle">Primary</Button>
      <Button variant="ContStyle">Contrast</Button>
      <Button variant="SecondStyle">Secondary</Button>
      <Button variant="BorderStyle">Outline</Button>
    </div>
  );
}
```

### Theming

Most components accept a `theme` prop for per-component theming:

```tsx
<Button theme="light" variant="PrimeStyle">Light Theme</Button>
<Button theme="dark" variant="PrimeStyle">Dark Theme</Button>
```

Or use the `ThemeProvider` for app-wide theming:

```tsx
import { ThemeProvider } from "./providers/ThemeProvider";

export default function RootLayout({ children }) {
  return (
    <ThemeProvider defaultTheme="light">
      {children}
    </ThemeProvider>
  );
}
```

---

## Common Issues and Solutions

### Styles Not Applied

Make sure you've:
1. Imported `globals.css` with Tailwind directives
2. Configured `tailwind.config` correctly with all plugins
3. Added the correct component path to the `content` array

### Theme Not Switching

Ensure:
1. `ThemeProvider` wraps your app
2. Component is marked with `'use client'` (Next.js App Router)
3. Both `mapping-color-system` and `glare-torch-mode` plugins are installed

---

## Manual Installation

If you have issues with the CLI, see the [manual installation guide](https://torch-glare.com/getting-started/manual) for step-by-step instructions.

## Next Steps

1. **[Building Your First Form](./building-first-form.md)** - Create a complete form with validation
2. **[Theming Basics](./theming-basics.md)** - Customize colors and themes
3. **[Component Composition](./component-composition.md)** - Build complex UIs
4. **[Component Documentation](../components/)** - Explore all available components
