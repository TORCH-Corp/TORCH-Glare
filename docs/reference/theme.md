---
title: Theme Reference
description: TORCH Glare theming — data-theme, theme modes, ThemeProvider, and useTheme.
group: reference
keywords: [theme, dark mode, data-theme, ThemeProvider, useTheme, tokens]
---

# Theme Reference

TORCH Glare is themed through two `data-*` attributes on the document root and a small
React context. Every component also accepts a `theme` prop that sets `data-theme` locally.

## Attributes

| Attribute | Values | Meaning |
| --- | --- | --- |
| `data-theme` | `"light" \| "dark" \| "default"` | The active color theme. |
| `data-theme-mode` | `"CSS" \| "TORCH"` | Token resolution mode (`TORCH` is the default). |

Per-component override:

```tsx
import { Button } from "@/components/Button";

<Button theme="dark" variant="PrimeStyle">Dark button</Button>;
```

## ThemeProvider

Add the provider once (`npx torch-glare@latest provider ThemeProvider`) and wrap your app.
It syncs `data-theme` / `data-theme-mode` to `document.documentElement` and persists the
choice to `localStorage`.

```tsx
import { ThemeProvider } from "@/providers/ThemeProvider";

export function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="default" defaultThemeMode="TORCH">
      {children}
    </ThemeProvider>
  );
}
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `defaultTheme` | `"light" \| "dark" \| "default"` | `"default"` | Initial theme (unless a stored/`data-theme` value exists). |
| `defaultThemeMode` | `"CSS" \| "TORCH"` | `"TORCH"` | Initial token mode. |

## useTheme

Read and update the theme from anywhere inside `ThemeProvider`:

```tsx
import { useTheme } from "@/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, updateTheme, themeMode, updateMode } = useTheme();

  return (
    <button onClick={() => updateTheme(theme === "dark" ? "light" : "dark")}>
      {theme} / {themeMode}
    </button>
  );
}
```

### Returned value

| Field | Type | Description |
| --- | --- | --- |
| `theme` | `"light" \| "dark" \| "default"` | Current theme. |
| `themeMode` | `"CSS" \| "TORCH"` | Current token mode. |
| `updateTheme` | `(theme) => void` | Set the theme (updates DOM + `localStorage`). |
| `updateMode` | `(mode) => void` | Set the token mode. |

`useTheme` throws if used outside `ThemeProvider`.

## See also

- [Providers reference](./providers.md)
- [CLI reference](./cli.md)
