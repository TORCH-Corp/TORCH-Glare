---
title: Theming Basics
description: Learn how to work with themes, customize colors, and create consistent designs with TORCH Glare's theming system.
category: Tutorial
difficulty: Intermediate
duration: 25 minutes
tags: [theming, dark-mode, colors, customization, design-tokens]
related:
  - Getting Started
  - ThemeProvider
  - Tailwind Plugins
---

# Theming Basics

Master the TORCH Glare theming system to create beautiful, consistent user interfaces that adapt to light and dark modes seamlessly.

## What You'll Learn

- Understanding the TORCH color system
- Working with theme modes (Light, Dark, Default)
- Using color tokens effectively
- Creating theme-aware components
- Customizing themes
- Best practices for accessible theming

## Prerequisites

- Completed [Getting Started](./getting-started.md) tutorial
- Basic understanding of CSS custom properties
- Familiarity with Tailwind CSS

---

## Understanding the Theme System

TORCH Glare uses a three-layer theming system:

1. **Theme Mode** - Light, Dark, or Default (system)
2. **Color Tokens** - Semantic color names (e.g., `background-presentation-form-base`)
3. **Color Values** - Actual color values that change based on theme

```
User selects → Theme Mode (light/dark)
     ↓
Color Tokens → Map to appropriate values
     ↓
Components → Use tokens automatically
```

---

## Step 1: Set Up Theme Provider

First, ensure `ThemeProvider` wraps your application:

```tsx
// app/layout.tsx
import { ThemeProvider } from '@torch-ai/torch-glare';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          defaultTheme="light"      // 'light' | 'dark' | 'default'
          defaultThemeMode="TORCH"  // 'TORCH' | 'CSS'
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Theme Options

| Option | Values | Description |
|--------|--------|-------------|
| `defaultTheme` | `"light"` \| `"dark"` \| `"default"` | Initial theme preference |
| `defaultThemeMode` | `"TORCH"` \| `"CSS"` | Theme system to use |

---

## Step 2: Create a Theme Toggle

Let users switch between light and dark modes:

```tsx
// components/ThemeToggle.tsx
'use client';

import { useTheme, Button } from '@torch-ai/torch-glare';

export default function ThemeToggle() {
  const { theme, updateTheme } = useTheme();

  return (
    <Button
      theme={theme as any}
      variant="ContStyle"
      buttonType="icon"
      onClick={() => updateTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
}
```

### Advanced Theme Switcher

```tsx
'use client';

import { useTheme } from '@torch-ai/torch-glare';

export default function ThemeSelector() {
  const { theme, updateTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'default', label: 'System', icon: '💻' },
  ] as const;

  return (
    <div className="flex gap-2">
      {themes.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => updateTheme(value)}
          className={cn(
            'px-4 py-2 rounded-lg transition-all',
            'typography-body-small-medium',
            theme === value
              ? 'bg-background-presentation-action-primary text-content-presentation-action-light-primary'
              : 'bg-background-presentation-action-secondary text-content-presentation-global-secondary'
          )}
        >
          <span className="mr-2">{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
}
```

---

## Step 3: Understanding Color Tokens

TORCH Glare uses semantic color tokens that automatically adapt to the current theme.

### Token Structure

```
{category}-{component}-{element}-{variant}-{state}
```

Examples:
- `background-system-body-primary` - Primary body background
- `content-presentation-global-secondary` - Secondary text color
- `border-presentation-action-hover` - Border color on hover

### Color Categories

#### System Colors
Used for core UI elements:

```tsx
<div className="bg-background-system-body-primary">
  <p className="text-content-system-global-primary">System colors</p>
</div>
```

#### Presentation Colors
Used for content and interactive elements:

```tsx
<div className="bg-background-presentation-form-base">
  <p className="text-content-presentation-global-primary">Presentation colors</p>
</div>
```

---

## Step 4: Create Theme-Aware Components

### Basic Theme-Aware Card

```tsx
export default function ThemedCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="
      bg-background-presentation-form-base
      border border-border-presentation-global-primary
      text-content-presentation-global-primary
      rounded-lg p-6
      transition-colors duration-200
    ">
      {children}
    </div>
  );
}
```

### Theme-Aware Button

```tsx
import { useTheme } from '@torch-ai/torch-glare';

export default function CustomButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      className="
        px-4 py-2 rounded-lg
        bg-background-presentation-action-primary
        hover:bg-background-presentation-action-hover
        active:bg-background-presentation-action-selected
        text-content-presentation-action-light-primary
        border border-border-presentation-action-primary
        transition-all duration-200
      "
    >
      {children}
    </button>
  );
}
```

---

## Step 5: Working with Color Tokens

### Background Colors

```tsx
function BackgroundExamples() {
  return (
    <div className="space-y-4">
      {/* Body backgrounds */}
      <div className="bg-background-system-body-primary p-4">
        Primary body background
      </div>
      <div className="bg-background-system-body-secondary p-4">
        Secondary body background
      </div>

      {/* Form backgrounds */}
      <div className="bg-background-presentation-form-base p-4">
        Form base background
      </div>
      <div className="bg-background-presentation-form-header p-4">
        Form header background
      </div>

      {/* Action backgrounds */}
      <div className="bg-background-presentation-action-primary p-4">
        Primary action background
      </div>
      <div className="bg-background-presentation-action-hover p-4">
        Hover action background
      </div>

      {/* State backgrounds */}
      <div className="bg-background-presentation-state-success-primary p-4">
        Success background
      </div>
      <div className="bg-background-presentation-state-warning-primary p-4">
        Warning background
      </div>
      <div className="bg-background-presentation-state-negative-primary p-4">
        Error background
      </div>
    </div>
  );
}
```

### Text/Content Colors

```tsx
function TextColorExamples() {
  return (
    <div className="space-y-2">
      <p className="text-content-presentation-global-primary">
        Primary text
      </p>
      <p className="text-content-presentation-global-secondary">
        Secondary text
      </p>
      <p className="text-content-presentation-action-light-primary">
        Primary action text
      </p>
      <p className="text-content-presentation-state-success">
        Success message
      </p>
      <p className="text-content-presentation-state-warning">
        Warning message
      </p>
      <p className="text-content-presentation-state-negative">
        Error message
      </p>
    </div>
  );
}
```

### Border Colors

```tsx
function BorderColorExamples() {
  return (
    <div className="space-y-4">
      <div className="border-2 border-border-presentation-global-primary p-4">
        Primary border
      </div>
      <div className="border-2 border-border-presentation-action-hover p-4">
        Hover border
      </div>
      <div className="border-2 border-border-presentation-state-focus p-4">
        Focus border
      </div>
      <div className="border-2 border-border-presentation-state-success p-4">
        Success border
      </div>
    </div>
  );
}
```

---

## Step 6: Badge Color System

TORCH Glare provides 12 badge color variants:

```tsx
function BadgeColors() {
  const colors = [
    'green',
    'green-light',
    'cocktail-green',
    'yellow',
    'red-orange',
    'red',
    'rose',
    'purple',
    'blue-purple',
    'blue',
    'navy',
    'gray',
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <span
          key={color}
          className={`
            px-3 py-1 rounded
            bg-background-presentation-badge-${color}
            text-content-presentation-badge-${color}
            border border-border-presentation-badge-${color}
            typography-labels-small-semibold
          `}
        >
          {color}
        </span>
      ))}
    </div>
  );
}
```

---

## Step 7: Create a Complete Themed Component

Here's a complete example combining everything:

```tsx
'use client';

import { useTheme, Button, Badge } from '@torch-ai/torch-glare';

export default function ThemedDashboard() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background-system-body-primary p-6">
      {/* Header */}
      <header className="
        bg-background-presentation-form-base
        border-b border-border-presentation-global-primary
        p-4 rounded-t-lg
      ">
        <div className="flex justify-between items-center">
          <h1 className="typography-display-medium-bold text-content-presentation-global-primary">
            Dashboard
          </h1>
          <Badge theme={theme as any} variant="SecondStyle">
            {theme} mode
          </Badge>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Stat Card 1 */}
        <div className="
          bg-background-presentation-form-base
          border border-border-presentation-global-primary
          rounded-lg p-6
        ">
          <p className="typography-labels-small-regular text-content-presentation-global-secondary">
            Total Users
          </p>
          <p className="typography-display-small-bold text-content-presentation-global-primary mt-2">
            1,234
          </p>
          <span className="
            inline-block mt-2 px-2 py-1 rounded
            bg-background-presentation-badge-green
            text-content-presentation-badge-green
            typography-labels-small-semibold
          ">
            +12% this month
          </span>
        </div>

        {/* Stat Card 2 */}
        <div className="
          bg-background-presentation-form-base
          border border-border-presentation-global-primary
          rounded-lg p-6
        ">
          <p className="typography-labels-small-regular text-content-presentation-global-secondary">
            Revenue
          </p>
          <p className="typography-display-small-bold text-content-presentation-global-primary mt-2">
            $45,678
          </p>
          <span className="
            inline-block mt-2 px-2 py-1 rounded
            bg-background-presentation-badge-blue
            text-content-presentation-badge-blue
            typography-labels-small-semibold
          ">
            +8% this month
          </span>
        </div>

        {/* Stat Card 3 */}
        <div className="
          bg-background-presentation-form-base
          border border-border-presentation-global-primary
          rounded-lg p-6
        ">
          <p className="typography-labels-small-regular text-content-presentation-global-secondary">
            Active Projects
          </p>
          <p className="typography-display-small-bold text-content-presentation-global-primary mt-2">
            42
          </p>
          <span className="
            inline-block mt-2 px-2 py-1 rounded
            bg-background-presentation-badge-yellow
            text-content-presentation-badge-yellow
            typography-labels-small-semibold
          ">
            3 due today
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <Button theme={theme as any} variant="PrimeStyle">
          Create Project
        </Button>
        <Button theme={theme as any} variant="ContStyle">
          View Reports
        </Button>
        <Button theme={theme as any} variant="BorderStyle">
          Settings
        </Button>
      </div>
    </div>
  );
}
```

---

## Step 8: Customizing Themes

### Method 1: CSS Custom Properties

Override theme variables in your CSS:

```css
/* globals.css */
:root {
  /* Customize light theme */
  [data-theme="light"] {
    --background-presentation-action-primary: #your-color;
  }

  /* Customize dark theme */
  [data-theme="dark"] {
    --background-presentation-action-primary: #your-color;
  }
}
```

### Method 2: Tailwind Config

Extend colors in `tailwind.config.ts`:

```ts
export default {
  theme: {
    extend: {
      colors: {
        'custom-primary': '#4200FF',
        'custom-secondary': '#5215CC',
      },
    },
  },
} satisfies Config;
```

### Method 3: Component-Level Overrides

```tsx
function CustomThemedButton() {
  return (
    <button
      className="
        px-4 py-2 rounded
        bg-purple-600 hover:bg-purple-700
        text-white
        dark:bg-purple-500 dark:hover:bg-purple-600
      "
    >
      Custom Colors
    </button>
  );
}
```

---

## Best Practices

### 1. Always Use Color Tokens

```tsx
// ✓ Good - Uses theme tokens
<div className="bg-background-presentation-form-base">

// ✗ Avoid - Hardcoded colors
<div className="bg-white dark:bg-gray-900">
```

### 2. Provide Smooth Transitions

```tsx
<div className="
  bg-background-system-body-primary
  text-content-system-global-primary
  transition-colors duration-200
">
  Smooth theme transitions
</div>
```

### 3. Test Both Themes

Always test your components in both light and dark themes:

```tsx
// Test component in both themes
<ThemeProvider defaultTheme="light">
  <YourComponent />
</ThemeProvider>

<ThemeProvider defaultTheme="dark">
  <YourComponent />
</ThemeProvider>
```

### 4. Consider Color Contrast

Ensure adequate contrast for accessibility:

```tsx
// Good contrast in both themes
<p className="
  text-content-presentation-global-primary
  bg-background-presentation-form-base
">
  High contrast text
</p>
```

### 5. Use Semantic Colors

Choose colors based on meaning:

```tsx
// ✓ Good - Semantic colors
<div className="bg-background-presentation-state-success-primary">
  Success message
</div>

// ✗ Avoid - Generic colors
<div className="bg-green-500">
  Success message
</div>
```

---

## Accessibility Considerations

### WCAG Contrast Requirements

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text** (18px+ or 14px+ bold): Minimum 3:1 contrast ratio

### Respecting User Preferences

Detect and respect system theme preference:

```tsx
<ThemeProvider defaultTheme="default">
  {/* Uses prefers-color-scheme */}
</ThemeProvider>
```

### Keyboard Navigation

Ensure theme toggle is keyboard accessible:

```tsx
<button
  onClick={toggleTheme}
  onKeyDown={(e) => e.key === 'Enter' && toggleTheme()}
  aria-label="Toggle theme"
  aria-pressed={theme === 'dark'}
>
  {theme === 'light' ? '🌙' : '☀️'}
</button>
```

---

## Common Patterns

### Conditional Styling Based on Theme

```tsx
import { useTheme } from '@torch-ai/torch-glare';

function ThemedComponent() {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        'p-4 rounded-lg',
        theme === 'dark' && 'ring-2 ring-purple-500'
      )}
    >
      Content
    </div>
  );
}
```

### Theme-Specific Images

```tsx
import { useTheme } from '@torch-ai/torch-glare';

function Logo() {
  const { theme } = useTheme();

  return (
    <img
      src={theme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
      alt="Logo"
    />
  );
}
```

### Persistent Theme Preference

Theme preferences are automatically persisted to `localStorage`:

```typescript
// Automatically handled by ThemeProvider
localStorage.getItem('theme'); // 'light' | 'dark' | 'default'
localStorage.getItem('theme-mode'); // 'TORCH' | 'CSS'
```

---

## Troubleshooting

### Theme Not Switching

**Problem**: Theme changes but colors don't update.

**Solution**: Ensure both plugins are installed:
```ts
plugins: [
  require('mapping-color-system'),
  require('glare-torch-mode'),
]
```

### Flash of Unstyled Content (FOUC)

**Problem**: Brief flash of wrong theme on page load.

**Solution**: Set initial theme on HTML element:
```tsx
<html data-theme="dark">
```

### Custom Colors Not Working

**Problem**: Custom color classes don't apply.

**Solution**: Add to Tailwind config and ensure content paths include your files:
```ts
content: ["./src/**/*.{js,ts,jsx,tsx}"]
```

---

## Next Steps

Now that you understand theming, explore:

1. **[Component Composition](./component-composition.md)** - Build complex themed UIs
2. **[Tailwind Plugins Reference](../reference/tailwind-plugins.md)** - Deep dive into plugins
3. **[ThemeProvider API](../reference/providers.md)** - Complete provider documentation

## Additional Resources

- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
