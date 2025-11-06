---
title: Providers Reference
description: React context providers for global state management including theme management with light/dark modes and CSS/TORCH theme systems.
component: Providers
category: Reference
tags: [providers, context, theme, dark-mode, light-mode, state-management]
related:
  - All Components
---

# Providers

React context providers that manage global application state. All providers follow React context best practices and include TypeScript support.

## Available Providers

- **ThemeProvider** - Manages theme state (light/dark) and theme mode (CSS/TORCH) with localStorage persistence

---

## ThemeProvider

Manages application theme state with support for light, dark, and system default themes. Includes two theme mode systems (CSS and TORCH) and automatic localStorage persistence.

### Features

- Light, dark, and default (system) theme support
- CSS and TORCH theme mode systems
- Automatic localStorage persistence
- SSR-safe initialization
- TypeScript support
- Custom hook (`useTheme`) for consuming theme state

### Basic Setup

```tsx
import { ThemeProvider } from '@torch-ai/torch-glare';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### With Default Theme

```tsx
import { ThemeProvider } from '@torch-ai/torch-glare';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" defaultThemeMode="CSS">
      <YourApp />
    </ThemeProvider>
  );
}
```

### Consuming Theme with useTheme Hook

```tsx
import { useTheme } from '@torch-ai/torch-glare';

function ThemeToggle() {
  const { theme, updateTheme } = useTheme();

  const toggleTheme = () => {
    updateTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
      Toggle to {theme === 'light' ? 'dark' : 'light'}
    </button>
  );
}
```

### Theme Mode Switcher

```tsx
import { useTheme } from '@torch-ai/torch-glare';

function ThemeModeSwitcher() {
  const { themeMode, updateMode } = useTheme();

  return (
    <div>
      <p>Current mode: {themeMode}</p>
      <button onClick={() => updateMode('CSS')}>
        Use CSS Theme
      </button>
      <button onClick={() => updateMode('TORCH')}>
        Use TORCH Theme
      </button>
    </div>
  );
}
```

### Complete Theme Control Panel

```tsx
import { useTheme } from '@torch-ai/torch-glare';

function ThemeControlPanel() {
  const { theme, themeMode, updateTheme, updateMode } = useTheme();

  return (
    <div className="theme-control-panel">
      <section>
        <h3>Theme</h3>
        <div className="button-group">
          <button
            onClick={() => updateTheme('light')}
            className={theme === 'light' ? 'active' : ''}
          >
            Light
          </button>
          <button
            onClick={() => updateTheme('dark')}
            className={theme === 'dark' ? 'active' : ''}
          >
            Dark
          </button>
          <button
            onClick={() => updateTheme('default')}
            className={theme === 'default' ? 'active' : ''}
          >
            System
          </button>
        </div>
      </section>

      <section>
        <h3>Theme Mode</h3>
        <div className="button-group">
          <button
            onClick={() => updateMode('TORCH')}
            className={themeMode === 'TORCH' ? 'active' : ''}
          >
            TORCH
          </button>
          <button
            onClick={() => updateMode('CSS')}
            className={themeMode === 'CSS' ? 'active' : ''}
          >
            CSS
          </button>
        </div>
      </section>

      <div className="current-settings">
        <p>Theme: {theme}</p>
        <p>Mode: {themeMode}</p>
      </div>
    </div>
  );
}
```

### Theme-Aware Component

```tsx
import { useTheme } from '@torch-ai/torch-glare';

function ThemedCard({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        'card',
        theme === 'dark' && 'bg-gray-900 text-white',
        theme === 'light' && 'bg-white text-gray-900'
      )}
    >
      {children}
    </div>
  );
}
```

### System Theme Detection

```tsx
import { useTheme } from '@torch-ai/torch-glare';
import { useEffect, useState } from 'react';

function SystemThemeSync() {
  const { theme, updateTheme } = useTheme();
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);

      // Auto-update if user selected "default"
      if (theme === 'default') {
        updateTheme(newSystemTheme);
      }
    };

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, updateTheme]);

  return (
    <div>
      <p>System preference: {systemTheme}</p>
      <p>Current theme: {theme}</p>
      {theme === 'default' && (
        <p>Following system preference</p>
      )}
    </div>
  );
}
```

### Header with Theme Toggle

```tsx
import { useTheme } from '@torch-ai/torch-glare';

function Header() {
  const { theme, updateTheme } = useTheme();

  return (
    <header className="flex justify-between items-center p-4">
      <h1>My App</h1>

      <button
        onClick={() => updateTheme(theme === 'light' ? 'dark' : 'light')}
        className="theme-toggle"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
}
```

### Settings Page

```tsx
import { useTheme } from '@torch-ai/torch-glare';
import { useState } from 'react';

function SettingsPage() {
  const { theme, themeMode, updateTheme, updateMode } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Theme is automatically persisted to localStorage
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-page">
      <h1>Appearance Settings</h1>

      <div className="setting-section">
        <label>Theme</label>
        <select
          value={theme}
          onChange={(e) => updateTheme(e.target.value as any)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="default">System Default</option>
        </select>
      </div>

      <div className="setting-section">
        <label>Theme System</label>
        <select
          value={themeMode}
          onChange={(e) => updateMode(e.target.value as any)}
        >
          <option value="TORCH">TORCH</option>
          <option value="CSS">CSS</option>
        </select>
        <p className="help-text">
          {themeMode === 'TORCH'
            ? 'Using TORCH design tokens'
            : 'Using CSS custom properties'}
        </p>
      </div>

      <button onClick={handleSave}>
        {saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}
```

### Next.js App Router Setup

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
        <ThemeProvider defaultTheme="light" defaultThemeMode="TORCH">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Next.js Pages Router Setup

```tsx
// pages/_app.tsx
import { ThemeProvider } from '@torch-ai/torch-glare';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

### Vite + React Setup

```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@torch-ai/torch-glare';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" defaultThemeMode="TORCH">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

---

## API Reference

### ThemeProvider Props

```typescript
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "light" | "dark" | "default";
  defaultThemeMode?: "CSS" | "TORCH";
}
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Child components to be wrapped |
| `defaultTheme` | `"light" \| "dark" \| "default"` | `"default"` | Initial theme to use |
| `defaultThemeMode` | `"CSS" \| "TORCH"` | `"TORCH"` | Initial theme mode system |

### useTheme Hook

```typescript
interface ThemeProps {
  theme: "light" | "dark" | "default";
  themeMode: "CSS" | "TORCH";
  updateTheme: (theme: "light" | "dark" | "default") => void;
  updateMode: (themeMode: "CSS" | "TORCH") => void;
}

function useTheme(): ThemeProps
```

#### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `"light" \| "dark" \| "default"` | Current theme |
| `themeMode` | `"CSS" \| "TORCH"` | Current theme mode system |
| `updateTheme` | `(theme: "light" \| "dark" \| "default") => void` | Update the theme |
| `updateMode` | `(themeMode: "CSS" \| "TORCH") => void` | Update the theme mode |

---

## Theme Values

### Theme Types

| Value | Description |
|-------|-------------|
| `"light"` | Light theme with bright backgrounds and dark text |
| `"dark"` | Dark theme with dark backgrounds and light text |
| `"default"` | Uses system preference (respects `prefers-color-scheme`) |

### Theme Modes

| Value | Description |
|-------|-------------|
| `"TORCH"` | Uses TORCH design token system |
| `"CSS"` | Uses CSS custom properties system |

---

## Data Attributes

The ThemeProvider automatically sets data attributes on `document.documentElement`:

```html
<!-- Light theme with TORCH mode -->
<html data-theme="light" data-theme-mode="TORCH">

<!-- Dark theme with CSS mode -->
<html data-theme="dark" data-theme-mode="CSS">
```

These attributes can be used in CSS selectors:

```css
[data-theme="light"] {
  --background: white;
  --foreground: black;
}

[data-theme="dark"] {
  --background: black;
  --foreground: white;
}

[data-theme-mode="TORCH"] {
  /* TORCH-specific styles */
}

[data-theme-mode="CSS"] {
  /* CSS-specific styles */
}
```

---

## LocalStorage Keys

The ThemeProvider stores values in localStorage:

| Key | Value | Description |
|-----|-------|-------------|
| `theme` | `"light" \| "dark" \| "default"` | Current theme preference |
| `theme-mode` | `"CSS" \| "TORCH"` | Current theme mode system |

---

## TypeScript Support

Full TypeScript support with type inference:

```typescript
import { useTheme } from '@torch-ai/torch-glare';

function MyComponent() {
  const { theme, themeMode, updateTheme, updateMode } = useTheme();

  // Type: "light" | "dark" | "default"
  const currentTheme: typeof theme = theme;

  // Type: "CSS" | "TORCH"
  const currentMode: typeof themeMode = themeMode;

  // Type-safe updates
  updateTheme('light'); // ✓
  updateTheme('purple'); // ✗ TypeScript error

  updateMode('CSS'); // ✓
  updateMode('CUSTOM'); // ✗ TypeScript error
}
```

---

## Testing

### Testing Components with ThemeProvider

```tsx
import { render } from '@testing-library/react';
import { ThemeProvider } from '@torch-ai/torch-glare';

describe('ThemedComponent', () => {
  it('should render with light theme', () => {
    const { container } = render(
      <ThemeProvider defaultTheme="light">
        <ThemedComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should render with dark theme', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemedComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
```

### Testing useTheme Hook

```tsx
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@torch-ai/torch-glare';

describe('useTheme', () => {
  it('should update theme', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.updateTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
  });

  it('should update theme mode', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider defaultThemeMode="TORCH">{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.themeMode).toBe('TORCH');

    act(() => {
      result.current.updateMode('CSS');
    });

    expect(result.current.themeMode).toBe('CSS');
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');
  });
});
```

### Mocking localStorage

```tsx
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('ThemeProvider persistence', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should persist theme to localStorage', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )
    });

    act(() => {
      result.current.updateTheme('dark');
    });

    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
```

---

## Performance Considerations

### Preventing Re-renders

The ThemeProvider uses React context, which can cause re-renders. To optimize:

```tsx
import { memo } from 'react';
import { useTheme } from '@torch-ai/torch-glare';

// Memoize components that don't need theme updates
const ExpensiveComponent = memo(() => {
  return <div>Static content</div>;
});

// Only theme-dependent components re-render
function ThemedButton() {
  const { theme } = useTheme();
  return <button data-theme={theme}>Click me</button>;
}
```

### Selective Theme Consumption

```tsx
import { useTheme } from '@torch-ai/torch-glare';

// Only consume what you need
function ThemeToggle() {
  const { theme, updateTheme } = useTheme();
  // Component only re-renders when theme changes
  // Not affected by themeMode changes

  return (
    <button onClick={() => updateTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle
    </button>
  );
}
```

---

## Best Practices

### 1. Wrap at Root Level

Always wrap your application at the highest level possible:

```tsx
// ✓ Good - Wrap entire app
function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes />
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

// ✗ Bad - Wrapping individual components
function Page() {
  return (
    <ThemeProvider>
      <Component />
    </ThemeProvider>
  );
}
```

### 2. Use Data Attributes in CSS

Leverage the automatic data attributes for styling:

```css
/* Theme-specific styles */
[data-theme="light"] .card {
  background: white;
  color: black;
}

[data-theme="dark"] .card {
  background: #1a1a1a;
  color: white;
}

/* Mode-specific styles */
[data-theme-mode="TORCH"] {
  --primary: var(--torch-primary);
}

[data-theme-mode="CSS"] {
  --primary: var(--css-primary);
}
```

### 3. Handle SSR Properly

Avoid hydration mismatches:

```tsx
import { useEffect, useState } from 'react';
import { useTheme } from '@torch-ai/torch-glare';

function ClientOnlyThemeButton() {
  const [mounted, setMounted] = useState(false);
  const { theme, updateTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <button>Theme</button>; // Placeholder during SSR
  }

  return (
    <button onClick={() => updateTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

### 4. Provide User Feedback

Show visual feedback when theme changes:

```tsx
import { useTheme } from '@torch-ai/torch-glare';
import { useState, useEffect } from 'react';

function ThemeToggleWithFeedback() {
  const { theme, updateTheme } = useTheme();
  const [isChanging, setIsChanging] = useState(false);

  const handleToggle = () => {
    setIsChanging(true);
    updateTheme(theme === 'light' ? 'dark' : 'light');
    setTimeout(() => setIsChanging(false), 300);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn('theme-toggle', isChanging && 'transitioning')}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
```

### 5. Validate Theme Values

Ensure theme values are valid before updating:

```tsx
import { useTheme } from '@torch-ai/torch-glare';

function SafeThemeUpdater({ theme }: { theme: string }) {
  const { updateTheme } = useTheme();

  const handleUpdate = () => {
    if (theme === 'light' || theme === 'dark' || theme === 'default') {
      updateTheme(theme as any);
    } else {
      console.error('Invalid theme value:', theme);
    }
  };

  return <button onClick={handleUpdate}>Set Theme</button>;
}
```

---

## Accessibility

The ThemeProvider supports accessibility best practices:

1. **Respects System Preferences**: The `"default"` theme follows `prefers-color-scheme`
2. **Persistent Preferences**: User choices are saved to localStorage
3. **ARIA Labels**: Add descriptive labels to theme toggles

```tsx
<button
  onClick={() => updateTheme(theme === 'light' ? 'dark' : 'light')}
  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
  aria-pressed={theme === 'dark'}
>
  {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
</button>
```

---

## Related Components

All components in the library can consume the theme context through the `theme` prop or by using `data-theme` attributes in CSS.

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**LocalStorage**: Supported in all modern browsers. Gracefully degrades if unavailable.

---

## Migration Guide

### From v1.x to v2.x

```tsx
// v1.x (old)
import { Theme } from 'old-library';
<Theme mode="dark">

// v2.x (new)
import { ThemeProvider } from '@torch-ai/torch-glare';
<ThemeProvider defaultTheme="dark">
```

### From Other Theme Providers

```tsx
// next-themes
import { ThemeProvider as NextThemeProvider } from 'next-themes';

// TORCH Glare
import { ThemeProvider } from '@torch-ai/torch-glare';

// Both can coexist if needed, but use TORCH Glare for consistency
```
