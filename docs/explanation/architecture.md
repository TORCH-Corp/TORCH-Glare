---
title: Architecture
description: How TORCH Glare is structured — the copy-in distribution model, the CLI, and the hosted registry.
group: explanation
keywords: [architecture, copy-in, cli, registry, hosted, shadcn]
---

# Architecture

## Copy-in distribution

TORCH Glare does **not** ship compiled components you import from a package.
`npx torch-glare add <Component>` writes the component's source into your project, and from
then on it is your code. This is the same model popularized by shadcn/ui.

Consequences:

- **You own the code.** Installed components live in your repo and can be edited freely.
- **No runtime package dependency.** You import from your own path (`@/components/…`), not
  from `torch-glare`.
- **Explicit dependencies.** `add` also installs the component's internal dependencies
  (nested components, hooks, utils) and the npm packages it needs, such as `@radix-ui/*`.

## The registry

Component source lives in the `registry/` directory on this repository, not inside the CLI's npm
package. `add` fetches what it needs over HTTP from `https://raw.githubusercontent.com/TORCH-Corp/TORCH-Glare/main/registry` — see the
[registry format](../reference/registry.md) for the wire shape.

Splitting the two is what lets component source and tooling move independently. They used to share
a version and a tarball, so correcting one `className` meant publishing a new CLI.

The dependency graph is described by a generated manifest served at `/r/index.json`. Each entry
lists a component's npm dependencies and its internal (component/hook/util) dependencies. The CLI
fetches that index once and resolves the full closure locally, so an install is deterministic and
testable rather than discovered one import at a time.

Both the manifest and the per-item payloads are generated from source (`pnpm run registry`) and
checked in CI, so neither drifts from the actual imports or from the source it serves.

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
