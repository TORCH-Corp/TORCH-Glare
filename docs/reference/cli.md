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
| `init` | Create `glare.json` and set up Tailwind. Run once per project. |
| `add [Component]` | Copy a component **and its dependencies** into your project. |
| `hook [hook]` | Copy a hook (usually pulled in automatically as a dependency). |
| `util [util]` | Copy a utility (e.g. `cn`, usually pulled in automatically). |
| `layout [layout]` | Copy a layout. |
| `provider [provider]` | Copy a provider (e.g. `ThemeProvider`). |
| `update` | Re-sync everything already installed with the latest templates. |

Component names are **case-sensitive PascalCase** — `add DatePicker`, not `add datepicker`.

## `init`

```bash
npx torch-glare@latest init
```

Creates `glare.json` and configures Tailwind. `glare.json` controls where files are copied:

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

Existing files are never overwritten; use `update` to re-sync.

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
