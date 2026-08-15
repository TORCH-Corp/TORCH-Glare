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
import {
  FIELD_TYPES,
  parseFields,
  skeleton,
  detailSkeleton,
  buildCreateForm,
} from "./form-fields.js";
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
  const hooks = registry.listByCategory("hooks").map((e) => e.name);
  // Not a count — that rots the moment a hook is added. What matters is that every hook the
  // registry knows about is listed under the category.
  assert.deepEqual(
    [...hooks].sort(),
    rl
      .getAllItems()
      .filter((i) => i.type === "hooks")
      .map((i) => i.name)
      .sort(),
    "every registry hook should list under the hooks category",
  );
  assert.ok(hooks.includes("useDragDrop") && hooks.includes("useInfiniteScroll"));
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

test("folder components (FormBuilder/FormRenderer) resolve for install + source", async () => {
  const rl = new RegistryLoader();
  await rl.load();

  // These ship as folders. The flat registry lists them now, but the MCP still has to recognise
  // the *shape* — `getSource` reads a barrel for a folder and a file for everything else, so an
  // entry without `isFolder` returns nothing at all.
  for (const name of ["FormBuilder", "FormRenderer", "DataViews", "TreeFolder"]) {
    const item = rl.getItemByName(name);
    assert.ok(item, `${name} should resolve`);
    assert.equal(item!.isFolder, true, `${name} is a folder component`);
    assert.ok((item!.files?.length ?? 0) > 1, `${name} lists its folder files`);
    assert.equal(rl.addCommand(item!), `npx torch-glare add ${name}`);
    assert.equal(rl.importPath(item!), `@/components/${name}`);
  }

  // Deps are scanned from the folder's imports, so an install reports what it really pulls in.
  const fr = rl.getItemByName("FormRenderer")!;
  assert.ok(fr.npmDependencies.includes("react-hook-form"), "FormRenderer needs react-hook-form");
  assert.ok(
    fr.npmDependencies.includes("@radix-ui/react-tabs"),
    "detail-tabs pulls @radix-ui/react-tabs",
  );
  const plan = rl.resolveInstallPlan("components", "FormRenderer")!;
  assert.ok(plan, "FormRenderer has an install plan");
  assert.ok(
    plan.items.some((i) => i.name === "FormBuilder"),
    "FormRenderer transitively pulls in FormBuilder",
  );

  // getExports reads the barrel's re-exports.
  const { values } = await rl.getExports(fr);
  assert.ok(values.includes("FormRenderer"), "barrel export surfaced");

  // Whole-folder source returns the barrel + a file manifest; a sub-path returns one file.
  const folderSrc = await rl.getSource("FormRenderer");
  assert.ok(folderSrc, "folder source resolves");
  assert.match(folderSrc!.code, /folder component/i, "manifest note included");
  assert.match(folderSrc!.code, /components\/FormRenderer\/detail\.tsx/, "lists its files");

  const fileSrc = await rl.getSource("FormRenderer/detail");
  assert.ok(fileSrc, "sub-path source resolves");
  assert.match(fileSrc!.path, /components\/FormRenderer\/detail\.tsx$/);
  assert.match(
    fileSrc!.code,
    /DetailTabsView|FormRenderer\.Sidebar|Tabs/,
    "returns detail.tsx code",
  );
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
  assert.match(
    code,
    /actions=\{<FormBuilder\.Submit>Save<\/FormBuilder\.Submit>\}/,
    "the Save is composed and passed via FormRenderer's actions",
  );
});

test("create-form maps a table/grid request to FormBuilder.Table, placed outside the Section", () => {
  assert.equal(parseFields("catalog (table)")[0].spec.static, "Table", "explicit (table) hint");
  assert.equal(parseFields("an editable grid")[0].spec.static, "Table", "inferred from 'grid'");

  // A mixed shape: a plain field (→ Section) plus a table (→ its own SectionBlock).
  const code = skeleton(parseFields("name, catalog (table)"), {
    layout: "single",
    display: "page",
    summary: false,
  });
  assert.match(code, /<FormBuilder\.Table/, "emits a FormBuilder.Table");
  assert.match(code, /columns=\{\[/, "with a columns array");
  // The Table renders its own SectionBlock, so it lands AFTER the fields Section closes.
  assert.match(
    code,
    /<\/FormBuilder\.Section>[\s\S]*<FormBuilder\.Table/,
    "Table sits outside (after) the fields Section",
  );

  // Every generated column must carry a `width`. FormBuilder.Table only switches to
  // `table-layout: fixed` when all of them do; with a mixed set the browser treats each width
  // as a hint and lets cell content widen the column, so a scaffold with one unsized column
  // would silently demonstrate the wrong behaviour.
  const columns = code.match(/\{ header: '[^']*'[^}]*\}/g) ?? [];
  assert.ok(columns.length > 0, "found the generated column literals");
  for (const col of columns) {
    assert.match(col, /width: \d+/, `column declares a width: ${col}`);
  }
});

test("create-form detail layout builds a display detail page, not a form", () => {
  const code = detailSkeleton(parseFields("po number, status, total (currency)"));

  // A detail page is display-only: no resolver / onSubmit / useState boilerplate.
  assert.doesNotMatch(
    code,
    /onSubmit|zodResolver|useForm|useState/,
    "no form wiring on a detail page",
  );
  // It renders through FormRenderer's detail-tabs API.
  assert.match(code, /<FormRenderer\.Sidebar>/, "has the sidebar rail");
  assert.match(
    code,
    /<FormRenderer\.Sidebar\.Item value="overview"/,
    "sidebar item carries a tab value",
  );
  assert.match(code, /<FormRenderer\.Tab value="overview">/, "a Tab pairs with the sidebar value");
  // Content MUST sit inside a FormBuilder.Section — the required wrapper.
  assert.match(
    code,
    /<FormRenderer\.Tab value="overview">[\s\S]*<FormBuilder\.Section[\s\S]*<\/FormBuilder\.Section>[\s\S]*<\/FormRenderer\.Tab>/,
    "tab content is wrapped in a FormBuilder.Section",
  );
  // Default display cells (Grid/Row) are offered, and the fields become Rows.
  assert.match(code, /<FormRenderer\.Grid columns=\{2\}>/, "uses the default display Grid");
  assert.match(
    code,
    /<FormRenderer\.Row label="Po number" value=\{record\.poNumber\}/,
    "field → display Row",
  );
  // The second tab shows the "bring your own component inside a Section" path.
  assert.match(
    code,
    /<FormBuilder\.Section title="Activity log"[\s\S]*<YourTimeline/,
    "a custom component renders inside a Section",
  );
});

test("create-form layout=detail routes the whole response to a display detail page", () => {
  // Tool-level: the create-form response builder, not just the skeleton fragment.
  const out = buildCreateForm({
    fields: "po number, status, total (currency)",
    layout: "detail",
    rulesHint: "RULES",
  });

  // Routed to the detail branch: a display page, no form WIRING / field-mapping table. (The prose
  // may mention "no onSubmit", so match actual wiring — `onSubmit={`, `zodResolver(`, a schema.)
  assert.doesNotMatch(
    out,
    /onSubmit=\{|zodResolver\(|const schema = z\.object/,
    "no form wiring emitted",
  );
  assert.doesNotMatch(out, /## 1\. Field mapping/, "no field-mapping table (that's the form path)");
  assert.match(out, /Detail page: 3 field\(s\)/, "detail heading with the field count");
  assert.match(out, /npx torch-glare add FormRenderer/, "install command present");
  // The wiring itself + the required Section wrapper + default-or-custom guidance.
  assert.match(
    out,
    /<FormRenderer\.Sidebar\.Item value="overview"/,
    "sidebar item carries a tab value",
  );
  assert.match(
    out,
    /<FormRenderer\.Tab value="overview">[\s\S]*<FormBuilder\.Section/,
    "tab content wrapped in a Section",
  );
  assert.match(out, /FormRenderer\.Grid/, "default display Grid offered");
  assert.match(out, /your own component/i, "custom-component path documented");
});

test("create-form non-detail layouts still build a form (regression)", () => {
  const form = buildCreateForm({ fields: "name, price (currency)", layout: "single" });
  assert.match(form, /## 1\. Field mapping/, "form path keeps the mapping table");
  assert.match(form, /<FormBuilder\.Currency name="price"/, "currency field mapped");
  assert.match(
    form,
    /actions=\{<FormBuilder\.Submit>Save<\/FormBuilder\.Submit>\}/,
    "form has a Submit",
  );
  assert.equal(
    buildCreateForm({ fields: "" }),
    "No fields parsed. Pass e.g. `name, email, price (currency)`.",
  );
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
