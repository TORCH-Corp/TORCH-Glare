---
title: Changelog & Upgrading
description: How to upgrade copied TORCH Glare components and where to find release notes.
group: migration
keywords: [changelog, migration, upgrade, update]
---

# Changelog & Upgrading

## Upgrading in a copy-in library

Because components are **copied into your project**, upgrading is not an `npm update`. To pull
the latest component source, re-run the CLI:

```bash
# Re-sync everything already installed with the latest templates
npx torch-glare@latest update
```

`update` overwrites your local copies, so review the diff and re-apply any local changes you
made. To upgrade a single component, re-add it:

```bash
npx torch-glare@latest add Button
```

## Release notes

- **v1.1.16** — see [CHANGELOG-1.1.16.md](../CHANGELOG-1.1.16.md) (adds `TextEditor`,
  `ChartBlockTool`, and related components).

For the authoritative version, check the `version` field in the package's `package.json` or
run `npx torch-glare --version`.

## See also

- [CLI reference](../reference/cli.md)
- [Architecture](../explanation/architecture.md)
