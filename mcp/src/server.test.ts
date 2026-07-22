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
import { readFile } from "node:fs/promises";
import { DocsLoader, normalizeCategory } from "./docs-loader.js";
import { FIELD_TYPES, parseFields, skeleton } from "./form-fields.js";
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
    registry
      .listByCategory("Buttons & Actions")
      .map((e) => e.name)
      .sort(),
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

  // Regression: the registry name is the FILE name, not always an export. The `color`
  // util is named for its file (color.ts) but exports helpers like `parseHex`/`rgbToHsv`.
  const color = rl.getItemByName("color")!;
  const { values } = await rl.getExports(color);
  assert.ok(values.includes("parseHex"), "should list real exports");
  assert.ok(!values.includes("color"), "file name is not an export");
});

test("getSource returns the real component file", async () => {
  const rl = new RegistryLoader();
  await rl.load();
  const source = await rl.getSource("Button");
  assert.ok(source, "Button source should be readable");
  assert.match(source!.path, /components\/Button\.tsx$/);
  assert.ok(source!.code.includes("Button"), "source should mention Button");
});

test("getVersion exposes the served library version from registry.json", async () => {
  const rl = new RegistryLoader();
  await rl.load();
  // registry.json carries a top-level semver (e.g. "2.4.0") — surfaced so the
  // MCP output can tell consumers which library release the docs describe.
  assert.match(rl.getVersion(), /^\d+\.\d+\.\d+/, "library version should be semver");
});

test("explanation + migration docs are loaded and served as guides", async () => {
  const loader = new DocsLoader();
  await loader.loadAll();

  // design-system.md (explanation) backs get-design-system-info's theming/colors.
  const designSystem = loader.getExplanation("design-system");
  assert.ok(designSystem && designSystem.length > 0, "design-system explanation should load");

  // architecture (explanation) + changelog (migration) join the guide list.
  const guides = loader.getAllGuideNames();
  assert.ok(guides.includes("architecture"), "architecture should be a guide");
  assert.ok(guides.includes("changelog"), "changelog should be a guide");
  assert.ok(loader.getGuide("architecture"), "architecture guide should be readable");
  assert.ok(loader.getGuide("changelog"), "changelog guide should be readable");
});

test("the FormBuilder forms guide is served and covers all three form components", async () => {
  const loader = new DocsLoader();
  await loader.loadAll();

  assert.ok(
    loader.getAllGuideNames().includes("forms-with-form-builder"),
    "forms-with-form-builder should be listed by get-guide",
  );

  const guide = loader.getGuide("forms-with-form-builder");
  assert.ok(guide, "forms-with-form-builder guide should be readable");
  for (const name of ["FormBuilder", "FormRenderer", "FormSummary"]) {
    assert.ok(guide.includes(name), `forms guide should cover ${name}`);
  }
  // The composition that only works via the hoisted form shared with the summary panel,
  // and the drawer laid out through FormRenderer.
  assert.match(guide, /useForm/, "forms guide should show hoisting useForm");
  assert.match(guide, /display="drawer"/, "forms guide should show the drawer via FormRenderer");
});

test("form component docs are loaded (get-component-docs can serve them)", async () => {
  const loader = new DocsLoader();
  await loader.loadAll();

  for (const slug of ["form-builder", "form-renderer", "form-summary"]) {
    const doc = loader.getComponent(slug);
    assert.ok(doc, `${slug} component doc should load`);
  }
});

test("every field in the create-form map is a real FormBuilder static (no drift)", async () => {
  // The map is what makes create-form deterministic, so it must not name a component
  // that doesn't exist. Read the real Object.assign block and diff against it.
  const src = await readFile(
    new URL("../../apps/lib/components/FormBuilder/form-builder.tsx", import.meta.url),
    "utf-8",
  );
  const block = src.match(/Object\.assign\(FormBuilderRoot,\s*\{([\s\S]*?)\n\}\)/);
  assert.ok(block, "should find the Object.assign statics block");
  const statics = new Set([...block[1].matchAll(/^\s{2}(\w+):/gm)].map((m) => m[1]));

  for (const spec of FIELD_TYPES) {
    assert.ok(
      statics.has(spec.static),
      `FIELD_TYPES names FormBuilder.${spec.static}, which no longer exists in form-builder.tsx`,
    );
  }
});

test("create-form maps field hints to the right component", () => {
  const parsed = parseFields(
    "name, email, price (currency), role (select), agree (checkbox), signature",
  );
  const got = Object.fromEntries(parsed.map((f) => [f.name, f.spec.static]));

  assert.equal(got.name, "Text");
  assert.equal(got.email, "Email"); // inferred from the field name
  assert.equal(got.price, "Currency"); // explicit hint wins over "Text"
  assert.equal(got.role, "Select");
  assert.equal(got.agree, "Checkbox");
  assert.equal(got.signature, "Signature");

  // Longest-alias-first: "multi select" must not be swallowed by "select".
  const [multi] = parseFields("labels (multi select)");
  assert.equal(multi.spec.static, "MultiSelect");
  const [range] = parseFields("period (date range)");
  assert.equal(range.spec.static, "DateRange");

  // The re-homed statics: options-driven single/multi lists and the boxed switch.
  const [radioList] = parseFields("plan (radio list)");
  assert.equal(radioList.spec.static, "RadioList");
  const [checkGroup] = parseFields("perms (checkbox group)");
  assert.equal(checkGroup.spec.static, "CheckboxGroup");
  const [switchBox] = parseFields("darkMode (switch)");
  assert.equal(switchBox.spec.static, "SwitchBox");
});

test("field matching is word-boundary, not substring (regression)", () => {
  // Substring matching made "customer" hit the `custom` alias -> FormBuilder.Custom,
  // silently producing a broken form. Aliases must match whole words only.
  const [customer] = parseFields("customer");
  assert.equal(customer.spec.static, "Text", "'customer' must not match the 'custom' alias");

  const [country] = parseFields("country");
  assert.notEqual(country.spec.static, "Color", "'country' must not match 'color'/'colour'");

  // camelCase is still split, so a compound name resolves on its parts.
  const [dueDate] = parseFields("dueDate");
  assert.equal(dueDate.spec.static, "Date");
  const [unitPrice] = parseFields("unitPrice");
  assert.equal(unitPrice.spec.static, "Currency");
});

test("create-form skeleton wires the drawer + summary composition correctly", () => {
  const parsed = parseFields("name, price (currency)");
  const code = skeleton(parsed, { layout: "single", display: "drawer", summary: true });

  // The FormRenderer-based composition a model reliably gets wrong when writing it by hand.
  assert.match(code, /const form = useForm<Values>/, "summary requires a hoisted useForm");
  assert.match(code, /<FormRenderer<Values>/, "renders through FormRenderer");
  assert.match(code, /display="drawer"/, "drawer display is set");
  assert.match(code, /form=\{form\}/, "the hoisted form is shared with FormRenderer + summary");
  assert.match(code, /summary=\{/, "summary panel passed via the summary prop");
  assert.match(code, /<FormSummary form=\{form\}/, "summary bound to the hoisted form");
  assert.match(code, /<FormBuilder\.Currency name="price"/, "currency field mapped");
});

test("the form docs the server hands out point at FormBuilder, not hand-rolled forms", async () => {
  const loader = new DocsLoader();
  await loader.loadAll();

  // These previously taught useState + hand-wired InputField rows, so an AI asking the
  // server "how do I build a form?" got the exact boilerplate FormBuilder replaces.
  for (const name of ["building-first-form", "form-and-list-recipes", "guides"]) {
    const doc = loader.getGuide(name);
    assert.ok(doc, `${name} should be readable`);
    assert.match(doc, /FormBuilder/, `${name} should steer to FormBuilder`);
  }
});
