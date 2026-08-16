import path from "path";
import fs from "fs";
import { ROOT } from "../../utils/libMeta.js";

/**
 * Turn the runnable example pages under `apps/app/` into markdown that **ships**.
 *
 * The docs used to link straight at `apps/app/data-views/<slug>/page.tsx`. That directory is in
 * neither published package — `torch-glare` ships `apps/lib` and `docs/`, and the MCP server's
 * `sync-docs.mjs` copies `apps/lib` and six `docs/` subdirectories — so every one of those links
 * dangled the moment either package was installed, while the doc still confidently said "see this
 * file". Generating the pages into `docs/components/<slug>/examples/` puts them inside the tree
 * that travels, beside the reference and guide they belong to.
 *
 * Generated, not hand-written, because a copy of a page is exactly the kind of documentation that
 * rots: `checkAiDocs` re-runs this in memory and fails if any output is stale, so the copy can
 * never disagree with the page it came from.
 *
 * Idempotent and deterministic.
 *   node scripts/bin/generateExampleDocs/index.js   (or `pnpm run examples`)
 */

const DOCS = path.join(ROOT, "docs");
const APP = path.join(ROOT, "apps", "app");

/**
 * What each example set is, and where it comes from.
 *
 * `manifest` is the example registry the app itself uses to build its sidebar — reusing it means
 * slugs and titles are never invented here, and an example added to the app appears in the docs
 * on the next run.
 */
const SETS = [
  {
    component: "DataViews",
    slug: "data-views",
    dir: path.join(APP, "data-views"),
    manifest: path.join(APP, "data-views", "_examples.ts"),
    doc: "../index.md",
    guide: "../guide.md",
    /** One line per example, the same sentences the component doc's table uses. */
    shows: {
      overview: "Every part at once — the fastest way to see the whole shape.",
      views: "All four views over one dataset, with drag round-trips.",
      "tree-custom":
        "Every custom-UI seam of the tree: `renderNode`, `paneRows`, a custom cell, card and tab, `paneActions`, and a whole-pane override.",
      "inbox-routing": "`itemHref` + `linkComponent` — the detail pane driven by the URL.",
      fields: "The field types, painted.",
      filters: "Every filter control, presets, custom filters and the summary.",
      "server-side": "`queryToParams` on the way out, `parseQuery` on the way in.",
      scale: "Virtualization and scroll loading at size.",
      panel: "The settings rail: saved views, columns, sort — and the pane-mode round trip.",
      state: "Controlled versus uncontrolled query.",
      "view-registry": "A view of your own via `markView`, beside the built-in four.",
      "a11y-rtl": "Keyboard paths and the RTL mirror.",
    },
    /** Files every example in the set depends on, emitted once as their own doc. */
    shared: [
      {
        slug: "api-orders-route",
        title: "The endpoint these examples call",
        shows:
          "The route handler every DataViews example fetches from — and the only worked example of `parseQuery` on the server.",
        files: [path.join(APP, "api", "orders", "route.ts")],
      },
    ],
  },
];

/** `apps/app/x/y.tsx` → `apps/app/x/y.tsx`, always posix, for printing in the doc. */
const relToRoot = (abs) => path.relative(ROOT, abs).split(path.sep).join("/");

/** Read the example registry without importing it — it is TypeScript, and this is a plain script. */
function readManifest(file) {
  const source = fs.readFileSync(file, "utf-8");
  const out = [];
  // Matches the `{ slug: "views", title: "Views", group: "Views" }` records in `_examples.ts`.
  const re = /\{\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*group:\s*"([^"]+)",?\s*\}/g;
  for (const m of source.matchAll(re)) out.push({ slug: m[1], title: m[2], group: m[3] });
  return out;
}

/** Every page file for one example: `page.tsx`, plus a nested route's page if there is one. */
function pageFiles(dir, slug) {
  const base = path.join(dir, slug);
  const files = [];
  const main = path.join(base, "page.tsx");
  if (fs.existsSync(main)) files.push(main);
  // A nested dynamic route — `inbox-routing/[id]/page.tsx` — is half the demo, so it comes along.
  for (const entry of fs.existsSync(base) ? fs.readdirSync(base, { withFileTypes: true }) : []) {
    if (!entry.isDirectory()) continue;
    const nested = path.join(base, entry.name, "page.tsx");
    if (fs.existsSync(nested)) files.push(nested);
  }
  return files;
}

const fence = (file) => {
  const lang = file.endsWith(".ts") ? "ts" : "tsx";
  return "```" + lang + "\n" + fs.readFileSync(file, "utf-8").trimEnd() + "\n```";
};

function exampleDoc({ set, slug, title, shows, files }) {
  const heading = `${set.component} example — ${title}`;
  const keywords = [set.slug, "example", "examples", ...slug.split("-")];

  return [
    "---",
    `title: ${heading}`,
    `description: ${shows}`,
    "group: examples",
    `component: ${set.component}`,
    `keywords: [${[...new Set(keywords)].join(", ")}]`,
    "---",
    "",
    `# ${heading}`,
    "",
    shows,
    "",
    `Complete and runnable — this is the page itself, not an excerpt. In the monorepo it lives at ` +
      files.map((f) => `\`${relToRoot(f)}\``).join(" and ") +
      ".",
    "",
    `See the [component reference](${set.doc}) for what each prop does, or the ` +
      `[guide](${set.guide}) for the same ground as scenarios.`,
    "",
    ...files.flatMap((file, i) => [
      ...(files.length > 1 ? [`## \`${relToRoot(file)}\``, ""] : []),
      fence(file),
      ...(i < files.length - 1 ? [""] : []),
    ]),
    "",
  ].join("\n");
}

function indexDoc(set, entries) {
  return [
    "---",
    `title: ${set.component} examples`,
    `description: Every runnable ${set.component} example page, as shipped documentation.`,
    "group: examples",
    `component: ${set.component}`,
    `keywords: [${set.slug}, example, examples, index]`,
    "---",
    "",
    `# ${set.component} examples`,
    "",
    `Each page below is complete and runnable. They ship with the package, so the code an agent is ` +
      `pointed at is code it can actually read.`,
    "",
    "| Example | Shows |",
    "| --- | --- |",
    ...entries.map((e) => `| [${e.title}](./${e.slug}.md) | ${e.shows} |`),
    "",
    `See the [component reference](${set.doc}) and the [guide](${set.guide}).`,
    "",
  ].join("\n");
}

/**
 * Build every file this generator owns, as `{ relativePath: contents }`.
 *
 * Returning the map rather than writing it is what lets `checkAiDocs` call this and compare
 * without touching the disk.
 */
export function buildExampleDocs() {
  const out = new Map();

  for (const set of SETS) {
    if (!fs.existsSync(set.manifest)) continue;
    const entries = [];

    for (const { slug, title } of readManifest(set.manifest)) {
      const files = pageFiles(set.dir, slug);
      if (files.length === 0) continue;
      const shows = set.shows[slug] ?? `The ${title} example.`;
      entries.push({ slug, title, shows });
      out.set(
        path.posix.join("components", set.slug, "examples", `${slug}.md`),
        exampleDoc({ set, slug, title, shows, files }),
      );
    }

    for (const extra of set.shared ?? []) {
      const files = extra.files.filter((f) => fs.existsSync(f));
      if (files.length === 0) continue;
      entries.push({ slug: extra.slug, title: extra.title, shows: extra.shows });
      out.set(
        path.posix.join("components", set.slug, "examples", `${extra.slug}.md`),
        exampleDoc({ set, slug: extra.slug, title: extra.title, shows: extra.shows, files }),
      );
    }

    out.set(path.posix.join("components", set.slug, "examples", "index.md"), indexDoc(set, entries));
  }

  return out;
}

/** Generated files this run no longer produces — a renamed or deleted page leaves one behind. */
export function staleExampleDocs(built) {
  const roots = SETS.map((s) => path.join(DOCS, "components", s.slug, "examples"));
  const found = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else if (entry.name.endsWith(".md")) {
        const rel = path.relative(DOCS, abs).split(path.sep).join("/");
        if (!built.has(rel)) found.push(rel);
      }
    }
  };
  for (const root of roots) if (fs.existsSync(root)) walk(root);
  return found;
}

// ── CLI ──────────────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const built = buildExampleDocs();
  let changed = 0;

  for (const [rel, contents] of built) {
    const abs = path.join(DOCS, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    const before = fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : null;
    if (before !== contents) {
      fs.writeFileSync(abs, contents);
      changed++;
    }
  }

  for (const rel of staleExampleDocs(built)) {
    fs.rmSync(path.join(DOCS, rel));
    changed++;
    console.log(`  removed ${rel} (no longer generated)`);
  }

  console.log(
    changed === 0
      ? `✅ example docs up to date — ${built.size} file(s)`
      : `✅ example docs written — ${changed} of ${built.size} file(s) changed`,
  );
}
