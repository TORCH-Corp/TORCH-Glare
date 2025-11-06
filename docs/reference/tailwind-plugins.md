---
title: Tailwind CSS Plugins
description: Tailwind CSS plugins for TORCH Glare including color system mapping, TORCH mode, and typography utilities.
component: Tailwind Plugins
category: Reference
tags: [tailwind, plugins, theming, typography, css-variables]
related:
  - ThemeProvider
  - All Components
---

# Tailwind CSS Plugins

TORCH Glare provides four essential Tailwind CSS plugins that power the design system with theming, color mapping, and typography utilities.

## Available Plugins

1. **mapping-color-system** - Color system mapping with automatic theme switching
2. **mapping-color-system-v4** - Tailwind CSS v4 compatible color system
3. **glare-torch-mode** - TORCH mode theme variables and styles
4. **glare-typography** - Complete typography system with 48 utility classes

---

## mapping-color-system

The color system mapping plugin provides essential theme variables for light, dark, and default modes. This plugin is **required** for TORCH Glare components to function correctly.

### Features

- Automatic theme switching based on `data-theme` attribute
- 100+ CSS custom properties for colors
- Light, dark, and default theme support
- Seamless integration with Tailwind CSS
- Background, border, and content color tokens

### Installation

```bash
npm install mapping-color-system
```

Or using Yarn:

```bash
yarn add mapping-color-system
```

### Basic Setup

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {},
  plugins: [
    require('mapping-color-system'),
    require('glare-torch-mode'), // Required companion plugin
  ],
} satisfies Config;
```

### Using with Theme Attribute

```html
<!-- Dark theme -->
<html data-theme="dark">
  <body>
    <div class="bg-primary text-onPrimary">
      Dark theme content
    </div>
  </body>
</html>

<!-- Light theme -->
<html data-theme="light">
  <body>
    <div class="bg-primary text-onPrimary">
      Light theme content
    </div>
  </body>
</html>
```

### Available Color Classes

The plugin exposes numerous color tokens that automatically adapt to the active theme:

#### Background Colors

```html
<div class="bg-background-system-body-primary">Primary background</div>
<div class="bg-background-system-body-secondary">Secondary background</div>
<div class="bg-background-presentation-form-base">Form background</div>
<div class="bg-background-presentation-action-primary">Action background</div>
<div class="bg-background-presentation-state-success-primary">Success background</div>
<div class="bg-background-presentation-badge-green">Badge background</div>
```

#### Text/Content Colors

```html
<p class="text-content-presentation-global-primary">Primary text</p>
<p class="text-content-presentation-global-secondary">Secondary text</p>
<p class="text-content-presentation-action-light-primary">Light primary action</p>
<p class="text-content-presentation-state-success">Success text</p>
<p class="text-content-presentation-badge-blue">Badge text</p>
```

#### Border Colors

```html
<div class="border border-border-presentation-global-primary">Primary border</div>
<div class="border border-border-presentation-action-hover">Hover border</div>
<div class="border border-border-presentation-state-focus">Focus border</div>
<div class="border border-border-system-global-primary">System border</div>
```

### Color Token Categories

#### System Colors
- **Body**: `background-system-body-{base,primary,secondary,tertiary}`
- **Action**: `background-system-action-{primary,secondary,tertiary}`
- **State**: `background-system-state-{negative}`
- **Badge**: `background-system-badge-{purple,red}`

#### Presentation Colors
- **Body**: `background-presentation-body-{primary}`
- **Form**: `background-presentation-form-{base,header,tabs}`
- **Action**: `background-presentation-action-{primary,secondary,hover,selected}`
- **State**: `background-presentation-state-{success,warning,negative,information}`
- **Badge**: `background-presentation-badge-{green,yellow,red,blue,purple,gray}`
- **Table**: `background-presentation-table-{row-hover,row-selected,row-disabled}`

### Theme-Specific Values

```css
/* Automatically set by the plugin */
[data-theme="dark"] {
  --background-system-body-primary: var(--black-900);
  --content-presentation-global-primary: var(--white-100);
}

[data-theme="light"] {
  --background-system-body-primary: var(--white-100);
  --content-presentation-global-primary: var(--black-900);
}
```

### Example: Themed Card

```tsx
function ThemedCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      bg-background-presentation-form-base
      border border-border-presentation-global-primary
      text-content-presentation-global-primary
      rounded-lg p-4
    ">
      {children}
    </div>
  );
}
```

### Example: Button States

```tsx
function ThemedButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="
      bg-background-presentation-action-primary
      hover:bg-background-presentation-action-hover
      active:bg-background-presentation-action-selected
      border border-border-presentation-action-primary
      text-content-presentation-action-light-primary
      px-4 py-2 rounded
    ">
      {children}
    </button>
  );
}
```

---

## mapping-color-system-v4

Tailwind CSS v4 compatible version of the color system mapping plugin. Includes a separate `tailwindVars.css` file for use with Tailwind v4's new architecture.

### Features

- Tailwind CSS v4 compatibility
- Separate CSS file for variable imports
- Same color token system as v3 plugin
- Optimized for Tailwind v4 architecture

### Installation

```bash
npm install mapping-color-system-v4
```

### Tailwind v4 Setup

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {},
  plugins: [
    require('mapping-color-system-v4'),
  ],
} satisfies Config;
```

### Import CSS Variables

```css
/* app.css or globals.css */
@import 'mapping-color-system-v4/tailwindVars.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Usage

Usage is identical to the v3 plugin. All color classes and tokens work the same way:

```html
<div class="bg-background-system-body-primary text-content-presentation-global-primary">
  Tailwind v4 compatible theming
</div>
```

---

## glare-torch-mode

The TORCH mode plugin provides the actual color values and theme-specific styles. This plugin **must be used** together with `mapping-color-system`.

### Features

- TORCH design system color values
- Light, dark, and default theme definitions
- 500+ CSS custom properties
- Gradient and alpha channel support
- Comprehensive color palette

### Installation

```bash
npm install glare-torch-mode
```

### Setup (Required with mapping-color-system)

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {},
  plugins: [
    require('mapping-color-system'), // Required first
    require('glare-torch-mode'),     // Then TORCH mode
  ],
} satisfies Config;
```

### What It Provides

The TORCH mode plugin defines the actual color values for:

- **Base colors**: Black, white, and grayscale palettes
- **Brand colors**: Purple, blue, red, green variants
- **Alpha channels**: Transparent variants for overlays
- **Gradients**: Start and end values for gradient backgrounds
- **State colors**: Success, warning, error, information

### Color Palette Structure

```css
:root {
  /* Grayscale */
  --black-1000: #000000;
  --black-900: #131415;
  --black-800: #1C1D1F;
  --black-700: #2A2B2E;
  /* ... */
  --white-00: #FFFFFF;
  --white-25: #FAFAFA;
  --white-100: #F9F9F9;
  /* ... */

  /* Brand colors */
  --purple-1000: #4200FF;
  --purple-900: #5215CC;
  /* ... */

  /* Alpha channels */
  --black-alpha-5: rgba(0, 0, 0, 0.05);
  --black-alpha-10: rgba(0, 0, 0, 0.10);
  --white-alpha-20: rgba(255, 255, 255, 0.20);
  /* ... */

  /* Theme-specific mappings */
  --background-system-dark-body-base: var(--black-1000);
  --background-system-light-body-base: var(--white-00);
  /* ... */
}
```

### Example: Using TORCH Colors

```html
<!-- These automatically adapt based on data-theme -->
<div class="bg-background-system-body-primary">
  <h1 class="text-content-system-global-primary">Title</h1>
  <p class="text-content-system-global-secondary">Description</p>
</div>
```

### Integration with ThemeProvider

```tsx
import { ThemeProvider } from '@torch-ai/torch-glare';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" defaultThemeMode="TORCH">
      {/* Components automatically use TORCH color system */}
      <YourApp />
    </ThemeProvider>
  );
}
```

---

## glare-typography

Complete typography system with 48 utility classes covering Display, Headers, Labels, and Body text with multiple font weights.

### Features

- 48 typography utility classes
- 4 text categories: Display, Headers, Labels, Body
- 4 font weights per category: Bold, Semibold, Medium, Regular
- Consistent line heights and letter spacing
- Responsive and scalable
- Production-ready typography scale

### Installation

```bash
npm install glare-typography
```

### Setup

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {},
  plugins: [
    require('glare-typography'),
  ],
} satisfies Config;
```

### Typography Scale

#### Display Text (Large headings, heroes)

| Class | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `typography-display-large-bold` | 34px | 120% | 700 | -0.34px |
| `typography-display-large-semibold` | 34px | 120% | 590 | -0.34px |
| `typography-display-large-medium` | 34px | 120% | 510 | -0.34px |
| `typography-display-large-regular` | 34px | 120% | 400 | -0.34px |
| `typography-display-medium-bold` | 28px | 120% | 700 | -0.28px |
| `typography-display-medium-semibold` | 28px | 120% | 590 | -0.28px |
| `typography-display-medium-medium` | 28px | 120% | 510 | -0.28px |
| `typography-display-medium-regular` | 28px | 120% | 400 | -0.28px |
| `typography-display-small-bold` | 22px | 120% | 700 | -0.22px |
| `typography-display-small-semibold` | 22px | 120% | 590 | -0.22px |
| `typography-display-small-medium` | 22px | 120% | 510 | -0.22px |
| `typography-display-small-regular` | 22px | 120% | 400 | -0.22px |

#### Headers (Page/section titles)

| Class | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `typography-headers-large-bold` | 20px | 132% | 700 | -0.2px |
| `typography-headers-large-semibold` | 20px | 132% | 590 | -0.2px |
| `typography-headers-large-medium` | 20px | 132% | 510 | -0.2px |
| `typography-headers-large-regular` | 20px | 132% | 400 | -0.2px |
| `typography-headers-medium-bold` | 18px | 132% | 700 | -0.18px |
| `typography-headers-medium-semibold` | 18px | 132% | 590 | -0.18px |
| `typography-headers-medium-medium` | 18px | 132% | 510 | -0.18px |
| `typography-headers-medium-regular` | 18px | 132% | 400 | -0.18px |
| `typography-headers-small-bold` | 16px | 132% | 700 | -0.16px |
| `typography-headers-small-semibold` | 16px | 132% | 590 | -0.16px |
| `typography-headers-small-medium` | 16px | 132% | 510 | -0.16px |
| `typography-headers-small-regular` | 16px | 132% | 400 | -0.16px |

#### Labels (Form labels, tags, badges)

| Class | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `typography-labels-large-bold` | 11px | 142% | 700 | 0.22px |
| `typography-labels-large-semibold` | 11px | 142% | 590 | 0.22px |
| `typography-labels-large-medium` | 11px | 142% | 510 | 0.22px |
| `typography-labels-large-regular` | 11px | 142% | 400 | 0.22px |
| `typography-labels-medium-bold` | 10px | 142% | 700 | 0.2px |
| `typography-labels-medium-semibold` | 10px | 142% | 590 | 0.2px |
| `typography-labels-medium-medium` | 10px | 142% | 510 | 0.2px |
| `typography-labels-medium-regular` | 10px | 142% | 400 | 0.2px |
| `typography-labels-small-bold` | 9px | 142% | 700 | 0.18px |
| `typography-labels-small-semibold` | 9px | 142% | 590 | 0.18px |
| `typography-labels-small-medium` | 9px | 142% | 510 | 0.18px |
| `typography-labels-small-regular` | 9px | 142% | 400 | 0.18px |

#### Body Text (Paragraphs, content)

| Class | Size | Line Height | Weight | Letter Spacing |
|-------|------|-------------|--------|----------------|
| `typography-body-large-bold` | 16px | 148% | 700 | 0 |
| `typography-body-large-semibold` | 16px | 148% | 590 | 0 |
| `typography-body-large-medium` | 16px | 148% | 510 | 0 |
| `typography-body-large-regular` | 16px | 147.5% | 400 | 0 |
| `typography-body-medium-bold` | 14px | 148% | 700 | 0 |
| `typography-body-medium-semibold` | 14px | 148% | 590 | 0 |
| `typography-body-medium-medium` | 14px | 148% | 510 | 0 |
| `typography-body-medium-regular` | 14px | 147.5% | 400 | 0 |
| `typography-body-small-bold` | 12px | 148% | 700 | 0 |
| `typography-body-small-semibold` | 12px | 148% | 590 | 0 |
| `typography-body-small-medium` | 12px | 148% | 510 | 0 |
| `typography-body-small-regular` | 12px | 147.5% | 400 | 0 |

### Usage Examples

#### Landing Page Hero

```html
<section class="hero">
  <h1 class="typography-display-large-bold">
    Welcome to TORCH Glare
  </h1>
  <p class="typography-body-large-regular">
    A comprehensive design system for modern applications
  </p>
</section>
```

#### Article Layout

```html
<article>
  <h1 class="typography-display-medium-bold">Article Title</h1>
  <p class="typography-body-medium-regular">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  </p>

  <h2 class="typography-headers-large-semibold">Section Heading</h2>
  <p class="typography-body-medium-regular">
    More content here...
  </p>

  <h3 class="typography-headers-medium-semibold">Subsection</h3>
  <p class="typography-body-small-regular">
    Detailed information...
  </p>
</article>
```

#### Form with Labels

```html
<form>
  <div class="field">
    <label class="typography-labels-medium-semibold">
      Email Address
    </label>
    <input type="email" class="typography-body-medium-regular" />
  </div>

  <button class="typography-body-medium-bold">
    Submit
  </button>
</form>
```

#### Dashboard Card

```html
<div class="card">
  <h3 class="typography-headers-small-bold">Statistics</h3>
  <div class="stat">
    <span class="typography-labels-small-regular">Total Users</span>
    <span class="typography-display-small-bold">1,234</span>
  </div>
  <p class="typography-body-small-regular">
    Updated 5 minutes ago
  </p>
</div>
```

#### Badge Component

```tsx
function Badge({ children, variant }: {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'error';
}) {
  return (
    <span className={cn(
      'typography-labels-small-semibold',
      'px-2 py-1 rounded',
      variant === 'success' && 'bg-green-100 text-green-800',
      variant === 'warning' && 'bg-yellow-100 text-yellow-800',
      variant === 'error' && 'bg-red-100 text-red-800'
    )}>
      {children}
    </span>
  );
}
```

### Customization

Override or extend the default typography in your `tailwind.config.ts`:

```ts
export default {
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
    require('glare-typography'),
  ],
} satisfies Config;
```

---

## Complete Setup Example

### Recommended Configuration

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // Color system (required first)
    require('mapping-color-system'),

    // TORCH mode (required with color system)
    require('glare-torch-mode'),

    // Typography system
    require('glare-typography'),

    // Additional Tailwind plugins
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
  ],
} satisfies Config;
```

### Application Setup

```tsx
// app/layout.tsx (Next.js App Router)
import { ThemeProvider } from '@torch-ai/torch-glare';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="dark" defaultThemeMode="TORCH">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Global Styles

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Optional: Set default font */
body {
  font-family: system-ui, -apple-system, sans-serif;
}
```

---

## Testing

### Testing Theme Switching

```tsx
import { render } from '@testing-library/react';

describe('Theme switching', () => {
  it('should apply dark theme classes', () => {
    document.documentElement.setAttribute('data-theme', 'dark');

    const { container } = render(
      <div className="bg-background-system-body-primary">
        Content
      </div>
    );

    expect(container.querySelector('div')).toHaveClass(
      'bg-background-system-body-primary'
    );
  });
});
```

### Testing Typography

```tsx
describe('Typography classes', () => {
  it('should apply correct font styles', () => {
    const { getByText } = render(
      <h1 className="typography-display-large-bold">Title</h1>
    );

    const heading = getByText('Title');
    const styles = window.getComputedStyle(heading);

    expect(styles.fontSize).toBe('34px');
    expect(styles.fontWeight).toBe('700');
    expect(styles.lineHeight).toBe('120%');
  });
});
```

---

## TypeScript Support

All plugins work seamlessly with TypeScript. Use Tailwind's IntelliSense for autocomplete:

```tsx
// Type-safe Tailwind classes
function Component() {
  return (
    <div className="
      bg-background-system-body-primary
      text-content-presentation-global-primary
      typography-body-medium-regular
    ">
      TypeScript + Tailwind
    </div>
  );
}
```

---

## Performance Considerations

### CSS Output Size

The plugins generate CSS custom properties that are reused across your application:

- **mapping-color-system**: ~15KB (gzipped)
- **glare-torch-mode**: ~25KB (gzipped)
- **glare-typography**: ~3KB (gzipped)

### Optimization Tips

1. **PurgeCSS**: Automatically removes unused classes in production
2. **CSS Minification**: Use cssnano or similar for minification
3. **Critical CSS**: Extract above-the-fold CSS for faster initial paint

```ts
// tailwind.config.ts
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // PurgeCSS automatically enabled in production
} satisfies Config;
```

---

## Best Practices

### 1. Always Use Companion Plugins

```ts
// ✓ Good - Both required plugins
plugins: [
  require('mapping-color-system'),
  require('glare-torch-mode'),
]

// ✗ Bad - Missing glare-torch-mode
plugins: [
  require('mapping-color-system'),
]
```

### 2. Set Theme Attribute Early

```html
<!-- Set on <html> for best performance -->
<html data-theme="dark" data-theme-mode="TORCH">
  <body>
    <!-- Content -->
  </body>
</html>
```

### 3. Use Semantic Typography Classes

```tsx
// ✓ Good - Semantic typography
<h1 className="typography-display-large-bold">Title</h1>
<p className="typography-body-medium-regular">Content</p>

// ✗ Bad - Manual font sizing
<h1 className="text-[34px] font-bold leading-[120%]">Title</h1>
```

### 4. Leverage Color Tokens

```tsx
// ✓ Good - Theme-aware color tokens
<div className="bg-background-presentation-form-base">

// ✗ Bad - Hardcoded colors
<div className="bg-white dark:bg-black">
```

---

## Migration Guide

### From Custom Theme Implementation

```diff
// Before: Manual dark mode
- <div className="bg-white dark:bg-gray-900">

// After: Using TORCH color system
+ <div className="bg-background-system-body-primary">
```

### From Tailwind Default Typography

```diff
// Before: Tailwind default
- <h1 className="text-3xl font-bold">

// After: TORCH typography
+ <h1 className="typography-display-large-bold">
```

---

## Troubleshooting

### Colors Not Updating

**Problem**: Theme colors don't change when switching themes.

**Solution**: Ensure both plugins are installed:

```ts
plugins: [
  require('mapping-color-system'), // ← Required
  require('glare-torch-mode'),     // ← Required
]
```

### Typography Classes Not Working

**Problem**: Typography classes have no effect.

**Solution**: Verify plugin is installed and imported:

```bash
npm install glare-typography
```

```ts
plugins: [
  require('glare-typography'), // ← Add this
]
```

### CSS Variables Not Defined

**Problem**: CSS custom properties are undefined.

**Solution**: Check that `data-theme` attribute is set:

```html
<html data-theme="dark">
```

---

## Browser Support

All plugins support:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**CSS Custom Properties**: Required for all plugins. No IE11 support.

---

## Related Documentation

- [ThemeProvider](./providers.md) - React context for theme management
- [Component Documentation](../components/) - All themed components
- [Tailwind CSS Documentation](https://tailwindcss.com) - Official Tailwind docs
