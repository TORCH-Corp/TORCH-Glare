---
title: Architecture
description: How TORCH Glare is structured — the copy-in distribution model, the CLI, and the registry.
group: explanation
keywords: [architecture, copy-in, cli, registry, shadcn]
---

# Architecture

## Copy-in distribution

TORCH Glare does **not** ship compiled components you import from a package. Instead, the
published `torch-glare` package contains a CLI plus the raw component source, and
`npx torch-glare add <Component>` copies that source into your project. This is the same
model popularized by shadcn/ui.

Consequences:

- **You own the code.** Copied components live in your repo and can be edited freely.
- **No runtime package dependency.** You import from your own path (`@/components/…`), not
  from `torch-glare`.
- **Explicit dependencies.** `add` also copies the component's internal dependencies
  (nested components, hooks, utils) and installs required npm packages such as `@radix-ui/*`.

## The registry

The dependency graph is described by a generated manifest, `apps/lib/registry.json`. Each
entry lists a component's npm dependencies and its internal (component/hook/util)
dependencies. The CLI reads this manifest to resolve the full closure to copy when you run
`add`, so results are deterministic and testable rather than inferred at install time.

The registry is generated from source (`pnpm run registry`) and validated in CI, so it never
drifts from the actual imports.

## Layers

| Layer | Location | Role |
| --- | --- | --- |
| Components | `components/` | UI built with Radix primitives + CVA variants. |
| Hooks | `hooks/` | Reusable behavior (e.g. `useClickOutside`). |
| Utils | `utils/` | Helpers like `cn` (class merging) and types. |
| Providers | `providers/` | Context providers such as `ThemeProvider`. |
| Layouts | `layouts/` | Composed page/section scaffolds. |

## AI-facing docs

`llms.txt`, `llms-full.txt`, and `llms-manifest.json` are generated from source
(`pnpm run llms`) so assistants always get accurate component lists, dependencies, variants,
and examples. A doc lint (`pnpm run check:ai-docs`) blocks incorrect usage patterns.

## See also

- [Design system](./design-system.md)
- [CLI reference](../reference/cli.md)
