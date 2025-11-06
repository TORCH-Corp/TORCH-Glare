---
title: Getting Started with TORCH Glare
description: Step-by-step guide to installing and using TORCH Glare Components Library in your project.
category: Tutorial
difficulty: Beginner
duration: 15 minutes
tags: [getting-started, installation, setup, first-component]
related:
  - Building Your First Form
  - Theming Basics
  - Component Composition
---

# Getting Started with TORCH Glare

Welcome to TORCH Glare! This tutorial will guide you through installing the library, setting up your project, and creating your first component.

## What You'll Learn

- Installing TORCH Glare and its dependencies
- Setting up Tailwind CSS with TORCH plugins
- Configuring the ThemeProvider
- Creating your first components
- Understanding the design system

## Prerequisites

Before you begin, make sure you have:

- Node.js 16+ installed
- Basic knowledge of React and TypeScript
- A React project (Next.js, Vite, or Create React App)

---

## Step 1: Installation

### Install the Core Library

```bash
npm install @torch-ai/torch-glare
```

Or using Yarn:

```bash
yarn add @torch-ai/torch-glare
```

### Install Tailwind CSS Plugins

TORCH Glare requires several Tailwind CSS plugins for theming and typography:

```bash
npm install mapping-color-system glare-torch-mode glare-typography tailwindcss-animate tailwind-scrollbar-hide
```

### Install Peer Dependencies

```bash
npm install tailwindcss postcss autoprefixer class-variance-authority clsx tailwind-merge
```

---

## Step 2: Configure Tailwind CSS

Create or update your `tailwind.config.ts` file:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // TORCH Glare required plugins
    require('mapping-color-system'),
    require('glare-torch-mode'),
    require('glare-typography'),

    // Optional but recommended
    require('tailwindcss-animate'),
    require('tailwind-scrollbar-hide'),
  ],
} satisfies Config;
```

### Create PostCSS Config

```js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Import Tailwind CSS

```css
/* globals.css or app.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Step 3: Set Up Theme Provider

### Next.js App Router

```tsx
// app/layout.tsx
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
        <ThemeProvider defaultTheme="light" defaultThemeMode="TORCH">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Next.js Pages Router

```tsx
// pages/_app.tsx
import { ThemeProvider } from '@torch-ai/torch-glare';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="light" defaultThemeMode="TORCH">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

### Vite + React

```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@torch-ai/torch-glare';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" defaultThemeMode="TORCH">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

---

## Step 4: Create Your First Component

Let's create a simple welcome card using TORCH Glare components.

### Basic Card

```tsx
// components/WelcomeCard.tsx
import { Button } from '@torch-ai/torch-glare';

export default function WelcomeCard() {
  return (
    <div className="
      bg-background-presentation-form-base
      border border-border-presentation-global-primary
      rounded-lg p-6 max-w-md
    ">
      <h1 className="typography-display-medium-bold mb-2">
        Welcome to TORCH Glare! 👋
      </h1>
      <p className="typography-body-medium-regular text-content-presentation-global-secondary mb-4">
        You've successfully set up TORCH Glare. Let's build something amazing!
      </p>
      <Button theme="light" variant="PrimeStyle">
        Get Started
      </Button>
    </div>
  );
}
```

### Use the Component

```tsx
// app/page.tsx or src/App.tsx
import WelcomeCard from './components/WelcomeCard';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <WelcomeCard />
    </div>
  );
}
```

---

## Step 5: Add Theme Toggle

Let's add a theme switcher to test the theming system.

### Create Theme Toggle Component

```tsx
// components/ThemeToggle.tsx
'use client'; // Add this for Next.js App Router

import { useTheme, Button } from '@torch-ai/torch-glare';

export default function ThemeToggle() {
  const { theme, updateTheme } = useTheme();

  const toggleTheme = () => {
    updateTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      theme={theme as any}
      variant="ContStyle"
      onClick={toggleTheme}
      buttonType="icon"
      size="M"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
}
```

### Add to Layout

```tsx
// app/layout.tsx (or wherever your layout is)
import ThemeToggle from './components/ThemeToggle';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="light" defaultThemeMode="TORCH">
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## Step 6: Explore More Components

Now that you have the basics set up, let's try a few more components.

### Button Variants

```tsx
import { Button } from '@torch-ai/torch-glare';

export default function ButtonShowcase() {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button theme="light" variant="PrimeStyle">
        Primary
      </Button>
      <Button theme="light" variant="ContStyle">
        Contrast
      </Button>
      <Button theme="light" variant="SecondStyle">
        Secondary
      </Button>
      <Button theme="light" variant="BorderStyle">
        Outline
      </Button>
    </div>
  );
}
```

### Input Field

```tsx
import { InputField } from '@torch-ai/torch-glare';
import { useState } from 'react';

export default function InputDemo() {
  const [email, setEmail] = useState('');

  return (
    <InputField
      theme="light"
      label="Email Address"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="you@example.com"
    />
  );
}
```

### Badge Component

```tsx
import { Badge } from '@torch-ai/torch-glare';

export default function BadgeDemo() {
  return (
    <div className="flex gap-2">
      <Badge theme="light" variant="SecondStyle">
        New
      </Badge>
      <Badge theme="light" variant="PrimeStyle">
        Featured
      </Badge>
      <Badge theme="light" variant="ContStyle">
        Popular
      </Badge>
    </div>
  );
}
```

---

## Step 7: Understanding the Design System

### Color System

TORCH Glare uses a comprehensive color token system:

```tsx
// Background colors
<div className="bg-background-system-body-primary">
<div className="bg-background-presentation-form-base">
<div className="bg-background-presentation-action-primary">

// Text colors
<p className="text-content-presentation-global-primary">
<p className="text-content-presentation-global-secondary">
<p className="text-content-presentation-state-success">

// Border colors
<div className="border border-border-presentation-global-primary">
<div className="border border-border-presentation-action-hover">
```

### Typography System

```tsx
// Display text (large headings)
<h1 className="typography-display-large-bold">

// Headers (section titles)
<h2 className="typography-headers-large-semibold">

// Body text (paragraphs)
<p className="typography-body-medium-regular">

// Labels (form labels, tags)
<label className="typography-labels-medium-semibold">
```

### Theme Props

Most components accept a `theme` prop:

```tsx
<Button theme="light" variant="PrimeStyle">
  Light Theme
</Button>

<Button theme="dark" variant="PrimeStyle">
  Dark Theme
</Button>
```

---

## Step 8: Build a Complete Example

Let's combine everything into a complete example:

```tsx
// components/UserProfile.tsx
'use client';

import { useState } from 'react';
import {
  Button,
  InputField,
  Badge,
  Avatar,
} from '@torch-ai/torch-glare';

export default function UserProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    console.log('Saving:', { name, email });
  };

  return (
    <div className="
      max-w-2xl mx-auto p-6
      bg-background-presentation-form-base
      border border-border-presentation-global-primary
      rounded-lg
    ">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar
          theme="light"
          src="/avatar.jpg"
          alt="User"
          size="L"
        />
        <div>
          <h2 className="typography-headers-large-bold">
            Profile Settings
          </h2>
          <Badge theme="light" variant="SecondStyle">
            Pro Member
          </Badge>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <InputField
          theme="light"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        <InputField
          theme="light"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <div className="flex gap-2 justify-end">
          <Button theme="light" variant="BorderStyle">
            Cancel
          </Button>
          <Button theme="light" variant="PrimeStyle" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## Common Issues and Solutions

### Issue: Styles Not Applied

**Problem**: Components don't have styling.

**Solution**: Make sure you've:
1. Imported `globals.css` with Tailwind directives
2. Configured `tailwind.config.ts` correctly
3. Added TORCH Glare plugins

### Issue: Theme Not Switching

**Problem**: Theme toggle doesn't work.

**Solution**: Ensure:
1. `ThemeProvider` wraps your app
2. Component is marked with `'use client'` (Next.js)
3. Both `mapping-color-system` and `glare-torch-mode` plugins are installed

### Issue: TypeScript Errors

**Problem**: Type errors with components.

**Solution**:
```bash
npm install --save-dev @types/react @types/node
```

---

## Next Steps

Congratulations! You've successfully set up TORCH Glare. Here's what to explore next:

1. **[Building Your First Form](./building-first-form.md)** - Create a complete form with validation
2. **[Theming Basics](./theming-basics.md)** - Customize colors and themes
3. **[Component Composition](./component-composition.md)** - Build complex UIs
4. **[Component Documentation](../components/)** - Explore all available components

## Additional Resources

- [GitHub Repository](https://github.com/torch-ai/torch-glare)
- [Component API Reference](../components/)
- [Tailwind Plugins Reference](../reference/tailwind-plugins.md)
- [Hooks Reference](../reference/hooks.md)

## Need Help?

- Check the [FAQ](../faq.md)
- Read [Common Issues](../troubleshooting.md)
- Join our [Discord Community](https://discord.gg/torch-glare)
- Report issues on [GitHub](https://github.com/torch-ai/torch-glare/issues)

Happy coding! 🚀
