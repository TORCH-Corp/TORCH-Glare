// Sync the canonical docs from the repo root into the MCP package's bundled
// `docs/` folder so the published server ships current content.
//
// Runs on every `prebuild`. It ALWAYS re-syncs (and removes each destination
// dir first) so edits AND deletions in ../docs propagate. The previous inline
// version guarded the whole copy behind `if(!fs.existsSync('docs'))`, which
// meant docs were only ever copied once — later edits silently shipped stale.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const mcpRoot = path.resolve(here, "..");
const repoRoot = path.resolve(mcpRoot, "..");

const destDocs = path.join(mcpRoot, "docs");
const docDirs = ["components", "reference", "tutorials", "how-to", "explanation", "migration"];

fs.mkdirSync(destDocs, { recursive: true });

for (const dir of docDirs) {
  const src = path.join(repoRoot, "docs", dir);
  const dst = path.join(destDocs, dir);
  // Drop the stale copy first so removed/renamed files don't linger.
  fs.rmSync(dst, { recursive: true, force: true });
  if (fs.existsSync(src)) {
    fs.cpSync(src, dst, { recursive: true });
    console.log(`[sync-docs] ${dir}/ -> docs/${dir}/`);
  }
}

// Bundle the copy-in registry + component source so the published server can
// answer get-install-info and get-component-source without the monorepo present.
const registrySrc = path.join(repoRoot, "apps", "lib", "registry.json");
if (fs.existsSync(registrySrc)) {
  fs.cpSync(registrySrc, path.join(mcpRoot, "registry.json"));
  console.log("[sync-docs] apps/lib/registry.json -> registry.json");
}

const srcDirs = ["components", "hooks", "utils", "layouts", "providers"];
const destLib = path.join(mcpRoot, "apps", "lib");
fs.rmSync(destLib, { recursive: true, force: true });
for (const dir of srcDirs) {
  const src = path.join(repoRoot, "apps", "lib", dir);
  if (fs.existsSync(src)) {
    // Only the source the CLI copies — skip co-located *-dev.* and *.md files.
    fs.cpSync(src, path.join(destLib, dir), {
      recursive: true,
      filter: (s) => !/-dev\.|\.md$/.test(s),
    });
    console.log(`[sync-docs] apps/lib/${dir}/ -> apps/lib/${dir}/`);
  }
}
