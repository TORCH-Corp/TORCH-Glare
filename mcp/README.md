# torch-glare-mcp

An [MCP](https://modelcontextprotocol.io) server that gives AI assistants full access to the
**TORCH Glare** component library — component docs, API references, code examples, design-system
info, **install commands + dependency graphs**, and the **actual source** the CLI copies.

TORCH Glare is a *copy-in* library (like shadcn/ui): the `torch-glare` CLI copies component source
directly into your project. This server lets an assistant go from "which component?" all the way to
"here's how to install it and here's the code."

## Install into an AI client

```bash
npx torch-glare mcp
```

This interactively adds the server to Claude Code (`.mcp.json`), Claude Desktop, and/or Cursor.
Or add it manually:

```json
{
  "mcpServers": {
    "torch-glare-docs": { "command": "npx", "args": ["-y", "torch-glare-mcp"] }
  }
}
```

## Tools

| Tool | Purpose |
|---|---|
| `list-components` | List all components, optionally filtered by category (`buttons`, `forms`, `layout`, `dataDisplay`, `overlays`, `dateTime`, `feedback`, `labels`, `navigation`, `advanced`). |
| `search-components` | Scored search by name, description, or tags. |
| `get-component-docs` | Full markdown docs for one component. |
| `get-component-api` | Just the props table + TypeScript types. |
| `get-usage-examples` | Code examples, optionally filtered by keyword. |
| `get-design-system-info` | Theming, typography, colors, plugins, hooks, providers, utilities, installation. |
| `get-install-info` | The `torch-glare` install command, import statement (from the file's real exports), npm deps, and the full transitive set of internal deps the CLI copies. |
| `get-component-source` | The exact `.tsx`/`.ts` source the CLI copies into a project. |
| `get-guide` | A tutorial or how-to guide by name (call with no name to list them). |
| `get-related-components` | What an item copies in and what other items compose it. |

`list-components` / `search-components` also cover installable hooks, utils, layouts, and providers.
`get-component-docs` returns a compact overview + table of contents by default — pass `section`
(e.g. `"examples"`, `"api"`) or `section:"full"` to drill in. Search is token- and synonym-aware
(e.g. `"modal"` → `Dialog`).

## Resources

- `torch-glare://component-index` — categorized component index
- `torch-glare://getting-started` — installation + first-component tutorial
- `torch-glare://design-system` — theming, typography, colors, plugins
- `torch-glare://component/{name}` — full docs for one component (templated)

The library's hard rule — never emit `system` color tokens or the `SystemStyle` variant, always use
the `presentation` equivalents — is sent once via the server's **`instructions`** (at connect), with
a short reminder on the code-emitting tools.

> When iterating on docs or component source in this repo, run `pnpm run build` (or
> `pnpm run mcp:build` from the repo root) so the server picks up your changes — it reads the bundled
> copies produced by `sync-docs`.

## Development

```bash
pnpm install
pnpm run build      # runs sync-docs (prebuild) then tsc
pnpm run dev        # tsc --watch
pnpm test           # unit tests
```

In the monorepo the server reads docs and source directly from `../docs` and `../apps/lib`. On
`build`, `scripts/sync-docs.mjs` bundles `docs/`, `registry.json`, and the `apps/lib` source into
the package so the published server is self-contained.

Inspect it interactively:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```
