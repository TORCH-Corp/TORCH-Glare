---
title: CLI Reference
description: The torch-glare CLI — copy components, hooks, utils, layouts, and providers into your project.
group: reference
keywords: [cli, torch-glare, init, add, copy-in, glare.json]
---

# CLI Reference

TORCH Glare is a **copy-in** component library: the `torch-glare` CLI copies source files
directly into your project (like shadcn/ui). You own the copied code and import it from your
own local path — you never import components from the npm package.

Run any command with `npx` (no global install required):

```bash
npx torch-glare@latest <command> [name]
```

Run a command **without** a name to pick from an interactive list.

## Commands

| Command | Description |
| --- | --- |
| `init` | Create `glare.json`, install the Tailwind packages, **and wire your stylesheet**. Run once per project. |
| `add [Component]` | Copy a component **and its dependencies** into your project. |
| `hook [hook]` | Copy a hook (usually pulled in automatically as a dependency). |
| `util [util]` | Copy a utility (e.g. `cn`, usually pulled in automatically). |
| `layout [layout]` | Copy a layout. |
| `provider [provider]` | Copy a provider (e.g. `ThemeProvider`). |
| `update` | Re-sync everything already installed with the latest templates. |

Component names are **case-sensitive PascalCase** — `add DatePicker`, not `add datepicker`.
Every command takes a **bare name** — `hook useDragDrop`, not `hook useDragDrop.tsx` — and every one
accepts `-f, --force`.

## `init`

```bash
npx torch-glare@latest init
```

Three things, in order:

1. Creates `glare.json`.
2. Installs the Tailwind packages the design system needs, using your detected package manager.
3. **Wires your entry stylesheet** — `app/globals.css`, `src/app/globals.css`, `src/index.css`,
   `styles/globals.css` — with the `@import`/`@plugin` block. Re-running is safe: if the block is
   already there it says so and changes nothing.

On Tailwind v3 the plugins belong in `tailwind.config.*` instead. `init` prints the snippet rather
than editing that file, since its shape is yours.

> Without step 3 the project builds cleanly and renders every component **unstyled** — the design
> tokens simply resolve to nothing. If that happens, check that `@import "tailwindcss"` is the
> first line: CSS requires imports to precede other at-rules, so an import placed after a `@plugin`
> is silently dropped.

`glare.json` controls where files are copied:

```json
{
  "path": "@/"
}
```

Files are copied into `<path>/components`, `<path>/hooks`, `<path>/utils`,
`<path>/layouts`, and `<path>/providers`. Import them from that path.

## `add`

```bash
npx torch-glare@latest add Button
```

Copies `Button` **plus its full dependency closure** — nested components, hooks, and utils —
and installs any required npm packages (e.g. `@radix-ui/*`) using your project's package
manager. After adding, import from your local alias:

```tsx
import { Button } from "@/components/Button";

export function Example() {
  return <Button variant="PrimeStyle">Click me</Button>;
}
```

It ends with a summary — `✅ DataViews → ./: 56 installed (56 items).` — so a partial install is
visible rather than something you discover at build time.

Dependencies come from the generated `registry.json`, resolved in one pass, so each item is copied
exactly once however many things import it.

Existing files are never overwritten. Use `--force` to re-copy — it applies to **the whole
dependency closure**, not just the component you named — or `update` to re-sync everything.

## `update`

```bash
npx torch-glare@latest update
```

Re-copies every installed component, hook, util, layout, and provider from the latest
templates. Review the diff afterward, since it overwrites your local copies.

## See also

- [Theme reference](./theme.md)
- [Components reference](./components.md)
- [Hooks reference](./hooks.md)
- [Providers reference](./providers.md)
