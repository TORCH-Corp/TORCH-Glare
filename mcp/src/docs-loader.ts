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
 * Resolve the manifest file path.
 */
async function resolveManifestPath(): Promise<string> {
  const bundled = path.resolve(PACKAGE_ROOT, "docs", "llms-manifest.json");
  const monorepo = path.resolve(MONOREPO_ROOT, "llms-manifest.json");
  try {
    await fs.access(bundled);
    return bundled;
  } catch {
    return monorepo;
  }
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
 * "input-otp" -> "InputOTP" (special case handled via manifest)
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

// Category mapping from llms-manifest.json structure
interface ManifestComponent {
  name: string;
  version: string;
  documented: boolean;
}

interface ManifestCategory {
  count: number;
  items: ManifestComponent[];
}

interface Manifest {
  components: Record<string, ManifestCategory>;
}

export class DocsLoader {
  private componentDocs: Map<string, ComponentDoc> = new Map();
  private referenceDocs: Map<string, string> = new Map();
  private tutorialDocs: Map<string, string> = new Map();
  private categoryMap: Map<string, string> = new Map(); // componentName -> category
  private docsDir = "";

  async loadAll(): Promise<void> {
    this.docsDir = await resolveDocsDir();
    await this.loadManifestCategories();
    await this.loadComponentDocs();
    await this.loadReferenceDocs();
    await this.loadTutorialDocs();
  }

  private async loadManifestCategories(): Promise<void> {
    try {
      const manifestPath = await resolveManifestPath();
      const raw = await fs.readFile(manifestPath, "utf-8");
      const manifest: Manifest = JSON.parse(raw);

      for (const [category, data] of Object.entries(manifest.components)) {
        for (const item of data.items) {
          this.categoryMap.set(item.name, category);
        }
      }
    } catch {
      // Manifest not available, categories will fall back to frontmatter
    }
  }

  private async loadComponentDocs(): Promise<void> {
    const componentsDir = path.resolve(this.docsDir, "components");
    try {
      const files = await fs.readdir(componentsDir);
      const mdFiles = files.filter((f) => f.endsWith(".md"));

      for (const file of mdFiles) {
        const filePath = path.resolve(componentsDir, file);
        const rawContent = await fs.readFile(filePath, "utf-8");
        const { frontmatter, content } = parseFrontmatter(rawContent);
        const slug = file.replace(".md", "");

        // Resolve name: frontmatter name/title, or derive from slug
        const name = frontmatter.name || frontmatter.title || slugToPascalCase(slug);

        // Resolve description
        const description = frontmatter.description || extractDescription(content);

        // Resolve category from manifest first, then frontmatter
        const category =
          this.categoryMap.get(name) ||
          this.categoryMap.get(slugToPascalCase(slug)) ||
          frontmatter.category ||
          frontmatter.group ||
          "uncategorized";

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
    const tutorialsDir = path.resolve(this.docsDir, "tutorials");
    try {
      const files = await fs.readdir(tutorialsDir);
      for (const file of files.filter((f) => f.endsWith(".md"))) {
        const content = await fs.readFile(path.resolve(tutorialsDir, file), "utf-8");
        this.tutorialDocs.set(file.replace(".md", ""), content);
      }
    } catch {
      // tutorials dir not found
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
}
