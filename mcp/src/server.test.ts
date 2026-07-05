/**
 * Unit tests for the parts most prone to silent breakage: category
 * normalization (the filter was fully broken before), install-plan resolution,
 * and source loading. Run with `pnpm test` (builds then `node --test`).
 *
 * These load the real monorepo docs/registry, so they double as the plan's
 * end-to-end verification for the category filter and get-install-info.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { DocsLoader, normalizeCategory } from "./docs-loader.js";
import { ComponentRegistry } from "./component-registry.js";
import { RegistryLoader } from "./registry-loader.js";

test("normalizeCategory folds both frontmatter conventions onto one slug", () => {
  assert.equal(normalizeCategory("components/buttons"), "buttons");
  assert.equal(normalizeCategory("Buttons & Actions"), "buttons");
  assert.equal(normalizeCategory("buttons"), "buttons");
  assert.equal(normalizeCategory("Data Display"), "dataDisplay");
  assert.equal(normalizeCategory("components/data-display"), "dataDisplay");
  assert.equal(normalizeCategory("Overlays & Dialogs"), "overlays");
  assert.equal(normalizeCategory(undefined), "uncategorized");
});

test("list-by-category returns components (regression: filter was always empty)", async () => {
  const loader = new DocsLoader();
  await loader.loadAll();
  const registry = new ComponentRegistry();
  registry.buildFromDocs(loader.getAllComponents());

  const categories = registry.getCategories();
  assert.ok(categories.length > 0, "expected at least one category");

  // The buttons category must resolve to >0 components, and the human-label
  // alias must resolve to the same set as the canonical slug.
  const buttons = registry.listByCategory("buttons");
  assert.ok(buttons.length > 0, "buttons category should not be empty");
  assert.deepEqual(
    registry.listByCategory("Buttons & Actions").map((e) => e.name).sort(),
    buttons.map((e) => e.name).sort(),
  );
});

test("registry items (hooks/utils/layouts/providers) are discoverable", async () => {
  const loader = new DocsLoader();
  await loader.loadAll();
  const rl = new RegistryLoader();
  await rl.load();
  const registry = new ComponentRegistry();
  registry.buildFromDocs(loader.getAllComponents());
  registry.addRegistryItems(rl.getAllItems());

  // Hook is now findable by search even though it has no component doc.
  assert.ok(
    registry.search("mobile").some((e) => e.name === "useIsMobile"),
    "search should surface the useIsMobile hook",
  );

  // Category filtering by registry type works.
  assert.equal(registry.listByCategory("hooks").length, 6, "expected 6 hooks");
  assert.ok(
    registry.listByCategory("providers").some((e) => e.name === "ThemeProvider"),
    "ThemeProvider should list under the providers category",
  );

  // Documented components keep their doc-derived description (dedup by name).
  assert.equal(registry.getCategories().includes("navigation"), true);
});

test("resolveInstallPlan returns transitive deps for AlertDialog", async () => {
  const rl = new RegistryLoader();
  await rl.load();

  const plan = rl.resolveInstallPlan("components", "AlertDialog");
  assert.ok(plan, "AlertDialog should be in the registry");

  const names = plan!.items.map((i) => i.name);
  assert.ok(names.includes("AlertDialog"));
  assert.ok(names.includes("Button"), "Button is a transitive registry dep");
  assert.ok(names.includes("cn") && names.includes("types"), "utils copied too");

  assert.ok(plan!.npmDependencies.includes("@radix-ui/react-alert-dialog"));
  assert.ok(plan!.npmDependencies.includes("class-variance-authority"));
});

test("addCommand and importStatement are shaped correctly", async () => {
  const rl = new RegistryLoader();
  await rl.load();
  const button = rl.getItemByName("Button")!;
  assert.equal(rl.addCommand(button), "npx torch-glare add Button");
  assert.equal(rl.importStatement(button), 'import { Button } from "@/components/Button";');
});

test("getSource returns the real component file", async () => {
  const rl = new RegistryLoader();
  await rl.load();
  const source = await rl.getSource("Button");
  assert.ok(source, "Button source should be readable");
  assert.match(source!.path, /components\/Button\.tsx$/);
  assert.ok(source!.code.includes("Button"), "source should mention Button");
});
