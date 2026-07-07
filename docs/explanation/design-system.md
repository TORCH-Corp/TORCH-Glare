---
title: Design System
description: The conventions behind TORCH Glare — CVA variants, semantic tokens, sizing, and theming.
group: explanation
keywords: [design system, cva, variants, tokens, tailwind, sizing]
---

# Design System

TORCH Glare components share a small set of conventions so they compose predictably and
theme uniformly.

## Variants via CVA

Component styling is defined with [class-variance-authority](https://cva.style) (`cva`). Each
component exposes a `variant` and/or `size` prop whose allowed values come directly from its
`cva` definition. For example, `Button` has variants
`PrimeStyle, BluSecStyle, YelSecStyle, RedSecStyle, BorderStyle, PrimeContStyle, BluContStyle, RedContStyle`
and sizes `S, M, L, XL`.

Because variant names are the source of truth, docs and the `llms.*` files generate their
variant lists from these definitions — they can't drift.

## Semantic tokens

Colors are addressed through semantic CSS variables, not raw hex, so a single component works
across themes. Names follow a `--{category}-{context}-{component}-{state}` shape, e.g.
`background-presentation-action-primary` or `content-presentation-state-negative`. Components
reference these via Tailwind classes like `bg-background-presentation-action-secondary`.

## Sizing scale

Interactive components use a consistent `S / M / L / XL` scale (some also `XS`). Typography
components such as `TransparentLabel` instead take a typography-scale `size`
(e.g. `body-medium-regular`, `headers-large-bold`).

## Theming

Theme is driven by `data-theme` (`light | dark | default`) and `data-theme-mode`
(`CSS | TORCH`). Every component accepts a `theme` prop for local overrides; app-wide theming
uses `ThemeProvider`. See the [theme reference](../reference/theme.md).

## Accessibility

Interactive components build on Radix UI primitives for keyboard and ARIA behavior. Custom
controls add the appropriate attributes directly (for example, a loading `Button` sets
`aria-busy` and exposes its spinner with `role="status"`).

## See also

- [Architecture](./architecture.md)
- [Theme reference](../reference/theme.md)
