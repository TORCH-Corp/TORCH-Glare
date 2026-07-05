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

test("search is guarded, synonym-aware, and merges layouts", async () => {
  const loader = new DocsLoader();
  await loader.loadAll();
  const rl = new RegistryLoader();
  await rl.load();
  const registry = new ComponentRegistry();
  registry.buildFromDocs(loader.getAllComponents());
  registry.addRegistryItems(rl.getAllItems(), loader.getRegistryItemDescriptions());

  // Empty query must not match everything.
  assert.equal(registry.search("").length, 0);
  assert.equal(registry.search("   ").length, 0);

  // Synonym: "modal" -> Dialog family (no literal "modal" in names).
  assert.ok(registry.search("modal").some((e) => e.name === "Dialog"));

  // layout/layouts merged into one canonical bucket.
  const layout = registry.listByCategory("layout").map((e) => e.name);
  assert.ok(layout.includes("DataViewCard"), "registry layout folded into 'layout'");
  assert.equal(registry.listByCategory("layouts").length, registry.listByCategory("layout").length);

  // Richer description parsed from reference docs (not the generic placeholder).
  const hook = registry.search("useClickOutside").find((e) => e.name === "useClickOutside");
  assert.ok(hook && hook.description !== "TORCH Glare React hook", "hook got a real description");
});

test("getDependents returns reverse composition (Button used by AlertDialog)", async () => {
  const rl = new RegistryLoader();
  await rl.load();
  const button = rl.getItemByName("Button")!;
  const dependents = rl.getDependents(button).map((i) => i.name);
  assert.ok(dependents.includes("AlertDialog"), "AlertDialog composes Button");
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

test("addCommand + importPath + real exports are correct", async () => {
  const rl = new RegistryLoader();
  await rl.load();
  const button = rl.getItemByName("Button")!;
  assert.equal(rl.addCommand(button), "npx torch-glare add Button");
  assert.equal(rl.importPath(button), "@/components/Button");
  assert.ok((await rl.getExports(button)).values.includes("Button"));

  // Regression: the registry name is the FILE name, not always an export.
  const mdp = rl.getItemByName("markdownParser")!;
  const { values } = await rl.getExports(mdp);
  assert.ok(values.includes("isMarkdown"), "should list real exports");
  assert.ok(!values.includes("markdownParser"), "file name is not an export");
});

test("getSource returns the real component file", async () => {
  const rl = new RegistryLoader();
  await rl.load();
  const source = await rl.getSource("Button");
  assert.ok(source, "Button source should be readable");
  assert.match(source!.path, /components\/Button\.tsx$/);
  assert.ok(source!.code.includes("Button"), "source should mention Button");
});
