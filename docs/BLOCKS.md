# TORCH-Glare Blocks System

## Overview

Blocks are complete, pre-built page templates that combine multiple components. Unlike components which are installed and used via props, blocks are copied into your project for direct customization.

| Aspect | Components | Blocks |
|--------|------------|--------|
| Installation | Installed to `components/` | Copied to `blocks/` |
| Customization | Use via props | Edit source directly |
| Dependencies | Standalone | Requires other components + npm packages |
| Scope | Single UI element | Full page/section template |

---

## Block Directory Structure

Each block is a folder containing multiple related files:

```
apps/lib/blocks/
└── BlockName/
    ├── index.tsx           # Main export (compound component)
    ├── types.ts            # TypeScript interfaces
    ├── Provider.tsx        # Context for shared state
    └── SubComponent.tsx    # Individual sub-components
```

---

## Block Architecture

### 1. Compound Component Pattern

The main `index.tsx` exports a root component with sub-components attached as properties. This allows usage like `Block.Toolbar`, `Block.Content`, etc.

The root component wraps children in a context provider so all sub-components can access shared state.

### 2. Context Provider

A React context manages all block state (current view, filters, search, pagination, selection, etc.). Sub-components consume this context via a custom hook.

### 3. Types File

Defines all TypeScript interfaces for the block's data structures, props, and state.

### 4. Sub-Components

Each sub-component:
- Consumes the context via the custom hook
- Handles its specific UI/logic
- Uses CVA for styling variants
- Follows the standard component patterns from CLAUDE.md

---

## CLI Block Command

### Location
`cli/src/commands/block.ts`

### What It Does

1. **Copies block files** - Copies the entire block folder from the package to user's `blocks/` directory

2. **Installs component dependencies** - Each block declares what components it needs. The CLI runs `torch-glare add <component>` for each.

3. **Installs utility dependencies** - Copies required utils (cn, types) to user's `utils/` directory

4. **Installs npm packages** - Detects package manager (npm/yarn/pnpm) and installs required packages that aren't already installed

5. **Updates import paths** - Rewrites imports in copied files from `@/` aliases to relative paths (`../../components/`, `../../utils/`)

### Dependency Registry

The CLI maintains a registry of what each block requires:

```
BLOCK_DEPENDENCIES = {
  BlockName: {
    components: [...],    // Component files to install
    utils: [...],         // Utility files to copy
    npmPackages: [...],   // npm packages to install
  }
}
```

### Import Path Transformation

Since users may not have the same tsconfig path aliases, the CLI transforms:
- `@/components/X` → `../../components/X`
- `@/utils/X` → `../../utils/X`
- `../components/X` → `../../components/X`
- `../utils/X` → `../../utils/X`

### Package Manager Detection

The CLI checks for lock files to detect the package manager:
- `pnpm-lock.yaml` → pnpm
- `yarn.lock` → yarn
- Otherwise → npm

---

## CLI Registration

The block command is registered in `cli/bin/index.ts` alongside other commands (like `add` for components).

---

## Adding a New Block

1. Create the block folder in `apps/lib/blocks/`
2. Implement using compound component + context pattern
3. Add entry to `BLOCK_DEPENDENCIES` in `cli/src/commands/block.ts`
4. Export from `apps/lib/blocks/index.ts`

---

## Final Directory Structure After Installation

```
user-project/
├── blocks/
│   └── BlockName/         # Copied block files
├── components/            # Auto-installed components
├── utils/                 # Auto-installed utilities
└── package.json           # Updated with npm dependencies
```
