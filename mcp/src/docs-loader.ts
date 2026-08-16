/**
 * Loads and caches markdown documentation from the docs/ directory.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseFrontmatter, extractDescription, type Frontmatter } from "./markdown-utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Package root: mcp/dist/ -> mcp/ is ..
const PACKAGE_ROOT = path.resolve(__dirname, "..");
// Monorepo root: mcp/ -> project root is ..
const MONOREPO_ROOT = path.resolve(PACKAGE_ROOT, "..");

/**
 * Resolve the docs directory. Checks in order:
 * 1. Bundled docs inside the package (mcp/docs/) — for npm installs
 * 2. Monorepo sibling docs directory (../docs/) — for local development
 */
async function resolveDocsDir(): Promise<string> {
  const bundled = path.resolve(PACKAGE_ROOT, "docs");
  const monorepo = path.resolve(MONOREPO_ROOT, "docs");
  try {
    await fs.access(path.resolve(bundled, "components"));
    return bundled;
  } catch {
    return monorepo;
  }
}

/**
 * Canonical category slugs used across the server. Component docs declare their
 * grouping under two competing frontmatter conventions — `category:
 * components/buttons` (path-style) on some docs and `group: Buttons & Actions`
 * (human label) on others — so a raw value can arrive in many shapes. This map
 * folds every observed form onto one slug so `list-components` filtering and the
 * category index are consistent regardless of which convention a doc used.
 */
const CATEGORY_ALIASES: Record<string, string> = {
  buttons: "buttons",
  "buttons & actions": "buttons",
  forms: "forms",
  "forms & inputs": "forms",
  inputs: "forms",
  "data-display": "dataDisplay",
  "data display": "dataDisplay",
  datadisplay: "dataDisplay",
  editors: "advanced",
  advanced: "advanced",
  "advanced components": "advanced",
  layout: "layout",
  layouts: "layout",
  "layout & containers": "layout",
  navigation: "navigation",
  "date & time": "dateTime",
  datetime: "dateTime",
  "feedback & status": "feedback",
  feedback: "feedback",
  "labels & text": "labels",
  labels: "labels",
  "overlays & dialogs": "overlays",
  overlays: "overlays",
};

/**
 * Normalize a raw category/group value (or a user-supplied filter) to a canonical
 * slug. Strips a leading `components/` path segment, then maps known aliases.
 * Unknown values pass through lowercased so nothing is silently dropped.
 */
export function normalizeCategory(raw: string | undefined): string {
  if (!raw) return "uncategorized";
  let key = raw.trim().toLowerCase();
  if (key.startsWith("components/")) key = key.slice("components/".length);
  return CATEGORY_ALIASES[key] ?? key;
}

export interface ComponentDoc {
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  filePath: string;
  rawContent: string;
  frontmatter: Frontmatter;
}

/**
 * Convert a kebab-case slug to PascalCase component name.
 * "action-button" -> "ActionButton"
 */
function slugToPascalCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

/**
 * Convert a PascalCase name to kebab-case slug.
 * "ActionButton" -> "action-button"
 * "InputOTP" -> "input-otp"
 */
function pascalCaseToSlug(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

export class DocsLoader {
  private componentDocs: Map<string, ComponentDoc> = new Map();
  private referenceDocs: Map<string, string> = new Map();
  private tutorialDocs: Map<string, string> = new Map();
  private howToDocs: Map<string, string> = new Map();
  private explanationDocs: Map<string, string> = new Map();
  private migrationDocs: Map<string, string> = new Map();
  /** Guides that live inside a component's folder — `data-views-guide`, and `data-views` itself. */
  private componentGuideDocs: Map<string, string> = new Map();
  /** Worked examples, keyed `<component-slug>/<example-slug>`. */
  private exampleDocs: Map<string, string> = new Map();
  private docsDir = "";

  async loadAll(): Promise<void> {
    this.docsDir = await resolveDocsDir();
    await this.loadComponentDocs();
    await this.loadReferenceDocs();
    await this.loadTutorialDocs();
    await this.loadHowToDocs();
    // Diátaxis explanation (architecture, design-system) and migration (changelog)
    // docs — served via get-design-system-info and get-guide.
    await this.loadFlatDocs("explanation", this.explanationDocs);
    await this.loadFlatDocs("migration", this.migrationDocs);
  }

  private async loadComponentDocs(): Promise<void> {
    const componentsDir = path.resolve(this.docsDir, "components");
    try {
      const entries = await fs.readdir(componentsDir, { withFileTypes: true });

      // A component's docs are either one file (`button.md`) or a folder whose `index.md` is the
      // reference and whose siblings are its guide, migration notes and examples. The folder form
      // is what keeps everything about a large component — DataViews has 18 files — in one place
      // instead of scattered across components/, how-to/ and migration/.
      const docs: { slug: string; filePath: string }[] = [];
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith(".md")) {
          docs.push({
            slug: entry.name.replace(".md", ""),
            filePath: path.resolve(componentsDir, entry.name),
          });
        } else if (entry.isDirectory()) {
          const index = path.resolve(componentsDir, entry.name, "index.md");
          try {
            await fs.access(index);
            docs.push({ slug: entry.name, filePath: index });
            await this.loadComponentFolder(entry.name, path.resolve(componentsDir, entry.name));
          } catch {
            // A folder with no index.md is not a component doc.
          }
        }
      }

      for (const { slug, filePath } of docs) {
        const rawContent = await fs.readFile(filePath, "utf-8");
        const { frontmatter, content } = parseFrontmatter(rawContent);

        // Resolve name: frontmatter name/title, or derive from slug
        const name = frontmatter.name || frontmatter.title || slugToPascalCase(slug);

        // Resolve description
        const description = frontmatter.description || extractDescription(content);

        // Categories live in frontmatter under two competing conventions
        // (`category: components/buttons` or `group: Buttons & Actions`).
        // Normalize both onto a single canonical slug.
        const category = normalizeCategory(frontmatter.category || frontmatter.group);

        // Resolve tags
        const tags = frontmatter.tags || frontmatter.keywords || [];

        const doc: ComponentDoc = {
          slug,
          name,
          description,
          category,
          tags,
          filePath,
          rawContent,
          frontmatter,
        };

        // Index by multiple keys for flexible lookup
        this.componentDocs.set(slug, doc);
        this.componentDocs.set(name.toLowerCase(), doc);
        this.componentDocs.set(pascalCaseToSlug(name), doc);
      }
    } catch {
      // docs/components/ not found
    }
  }

  /**
   * The rest of a component's folder: its guide, migration notes and worked examples.
   *
   * Guides are keyed both `<slug>-<file>` and — for `guide.md` — bare `<slug>`, so
   * `get-guide "data-views"` answers with the guide rather than with whatever else happens to
   * carry that name. Examples are keyed `<slug>/<file>` and served through get-usage-examples,
   * one at a time: they are whole pages, and handing over fourteen of them at once is not an
   * answer to any question.
   */
  private async loadComponentFolder(slug: string, dir: string): Promise<void> {
    let entries: string[] = [];
    try {
      entries = await fs.readdir(dir);
    } catch {
      return;
    }

    for (const file of entries.filter((f) => f.endsWith(".md") && f !== "index.md")) {
      const content = await fs.readFile(path.resolve(dir, file), "utf-8");
      const name = file.replace(".md", "");
      this.componentGuideDocs.set(`${slug}-${name}`, content);
      if (name === "guide") this.componentGuideDocs.set(slug, content);
    }

    const examplesDir = path.resolve(dir, "examples");
    try {
      for (const file of (await fs.readdir(examplesDir)).filter((f) => f.endsWith(".md"))) {
        const content = await fs.readFile(path.resolve(examplesDir, file), "utf-8");
        this.exampleDocs.set(`${slug}/${file.replace(".md", "")}`, content);
      }
    } catch {
      // no examples/ in this folder
    }
  }

  private async loadReferenceDocs(): Promise<void> {
    const referenceDir = path.resolve(this.docsDir, "reference");
    try {
      const files = await fs.readdir(referenceDir);
      for (const file of files.filter((f) => f.endsWith(".md"))) {
        const content = await fs.readFile(path.resolve(referenceDir, file), "utf-8");
        this.referenceDocs.set(file.replace(".md", ""), content);
      }
    } catch {
      // reference dir not found
    }
  }

  private async loadTutorialDocs(): Promise<void> {
    await this.loadFlatDocs("tutorials", this.tutorialDocs);
  }

  private async loadHowToDocs(): Promise<void> {
    await this.loadFlatDocs("how-to", this.howToDocs);
  }

  /** Load every `*.md` in a docs subdir into a name→content map. */
  private async loadFlatDocs(dir: string, into: Map<string, string>): Promise<void> {
    const abs = path.resolve(this.docsDir, dir);
    try {
      const files = await fs.readdir(abs);
      for (const file of files.filter((f) => f.endsWith(".md"))) {
        const content = await fs.readFile(path.resolve(abs, file), "utf-8");
        into.set(file.replace(".md", ""), content);
      }
    } catch {
      // dir not found
    }
  }

  getComponent(nameOrSlug: string): ComponentDoc | undefined {
    // Try exact match first
    const lower = nameOrSlug.toLowerCase();
    const doc = this.componentDocs.get(lower);
    if (doc) return doc;

    // Try slug conversion
    const slug = pascalCaseToSlug(nameOrSlug);
    return this.componentDocs.get(slug);
  }

  getAllComponents(): ComponentDoc[] {
    // Deduplicate since we store multiple keys per doc
    const seen = new Set<string>();
    const result: ComponentDoc[] = [];
    for (const doc of this.componentDocs.values()) {
      if (!seen.has(doc.slug)) {
        seen.add(doc.slug);
        result.push(doc);
      }
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }

  getReference(name: string): string | undefined {
    return this.referenceDocs.get(name);
  }

  getTutorial(name: string): string | undefined {
    return this.tutorialDocs.get(name);
  }

  getAllReferenceNames(): string[] {
    return Array.from(this.referenceDocs.keys());
  }

  getAllTutorialNames(): string[] {
    return Array.from(this.tutorialDocs.keys());
  }

  /**
   * One-line descriptions for hooks/utils/providers, parsed from the
   * "## Available …" bullet lists in the reference docs (e.g. hooks.md:
   * `- **useClickOutside** - Detect clicks outside a referenced element`).
   * Used to replace the generic "TORCH Glare React hook" placeholder in search.
   */
  getRegistryItemDescriptions(): Map<string, string> {
    const map = new Map<string, string>();
    for (const content of this.referenceDocs.values()) {
      for (const m of content.matchAll(/^[-*]\s+\*\*([A-Za-z_$][\w$]*)\*\*\s*[-–—:]\s*(.+?)\s*$/gm)) {
        const name = m[1];
        if (!map.has(name)) map.set(name, m[2].trim());
      }
    }
    return map;
  }

  /** An explanation doc (architecture, design-system), looked up by name. */
  getExplanation(name: string): string | undefined {
    return this.explanationDocs.get(name);
  }

  /**
   * A guide is any tutorial, how-to, explanation, or migration doc, looked up by
   * name — the "read a doc by name" surface behind get-guide.
   */
  getGuide(name: string): string | undefined {
    return (
      this.tutorialDocs.get(name) ??
      this.howToDocs.get(name) ??
      // A component's own guide outranks the explanation and migration docs: someone asking for
      // "data-views" wants how to build one, not the notes on upgrading from what it replaced.
      this.componentGuideDocs.get(name) ??
      this.explanationDocs.get(name) ??
      this.migrationDocs.get(name)
    );
  }

  /** Every worked example for a component, by slug — `views`, `tree-custom`, … */
  getExampleNames(component: string): string[] {
    const slug = pascalCaseToSlug(component).toLowerCase();
    const prefix = `${slug}/`;
    return [...this.exampleDocs.keys()]
      .filter((key) => key.startsWith(prefix))
      .map((key) => key.slice(prefix.length))
      .sort();
  }

  /** One worked example, in full. */
  getExample(component: string, example: string): string | undefined {
    const slug = pascalCaseToSlug(component).toLowerCase();
    return this.exampleDocs.get(`${slug}/${example}`);
  }

  /** All guide names (tutorials + how-to + explanation + migration), deduped and sorted. */
  getAllGuideNames(): string[] {
    return [
      ...new Set([
        ...this.tutorialDocs.keys(),
        ...this.howToDocs.keys(),
        ...this.explanationDocs.keys(),
        ...this.componentGuideDocs.keys(),
        ...this.migrationDocs.keys(),
      ]),
    ].sort();
  }
}
