---
title: CLI Reference
description: The torch-glare CLI — copy components, hooks, utils, layouts, and providers into your project.
group: reference
keywords: [cli, torch-glare, init, add, copy-in, glare.json]
---

# CLI Reference

TORCH Glare is a **copy-in** component library: the `torch-glare` CLI writes component source
directly into your project (like shadcn/ui). You own that code and import it from your own local
path — there is no runtime package to import from.

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

Names are matched case-insensitively and a trailing extension is stripped, so `add datepicker` and
`add DatePicker.tsx` both find `DatePicker`. Every install command accepts `-f, --force`, which
overwrites what is already there across the whole dependency closure. Where components come from,
and which release, is configured once in `glare.json` rather than passed per invocation.

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

`glare.json` controls where files are written:

```json
{
  "path": "@/"
}
```

`path` is the only key — where files are written, with a leading `@/` stripped.

Files are written into `<path>/components`, `<path>/hooks`, `<path>/utils`,
`<path>/layouts`, and `<path>/providers`. Import them from that path.

A config written before the hosted registry keeps working unchanged; any extra keys are ignored.

## Where components come from

Components are fetched over HTTP from the `registry/` directory on the Glare repository, rather
than shipped inside the CLI. A fix to a component reaches your next `add` as soon as it lands on
`main`, without a new version of `torch-glare`.

The registry is plain JSON, and public:

```bash
curl https://raw.githubusercontent.com/TORCH-Corp/TORCH-Glare/main/registry/index.json            # every item and its dependencies
curl https://raw.githubusercontent.com/TORCH-Corp/TORCH-Glare/main/registry/components/Button.json # one item, with its source inlined
```

Each item lists its `files` (with content), its npm `dependencies` pinned to the ranges the library
builds against, and its `registryDependencies` as `type/name` refs — which are also its URL paths,
so a dependency resolves to a URL by concatenation.

The shape is described in the [registry format reference](./registry.md), and published as a JSON
Schema at `https://raw.githubusercontent.com/TORCH-Corp/TORCH-Glare/main/registry/schema.json`.

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

Dependencies come from the registry index, resolved in one pass, so each item is written exactly
once however many things import it, and the whole closure is fetched in parallel.

If the registry cannot be reached, the CLI says so and exits non-zero. It does not carry a copy of
the library to fall back on — that is what "hosted" means — so a failed install is a failed install
rather than a silent one against stale source.

Existing files are never overwritten. Use `--force` to re-copy — it applies to **the whole
dependency closure**, not just the component you named — or `update` to re-sync everything.

## `update`

```bash
npx torch-glare@latest update
```

Re-installs every component, hook, util, layout, and provider you already have, from the registry.
Each item is fetched once however many things depend on it. Review the diff afterward, since it
overwrites your local copies.

## See also

- [Theme reference](./theme.md)
- [Components reference](./components.md)
- [Hooks reference](./hooks.md)
- [Providers reference](./providers.md)
