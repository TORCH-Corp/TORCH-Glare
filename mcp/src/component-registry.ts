/**
 * Searchable component registry built from loaded documentation.
 */

import { normalizeCategory, type ComponentDoc } from "./docs-loader.js";
import type { RegistryItem } from "./registry-loader.js";

export interface RegistryEntry {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  /** External npm packages the component pulls in (from registry.json). */
  npmDependencies: string[];
}

// Short human labels for the non-component registry types (used as their
// description when they have no per-item doc of their own).
const TYPE_LABEL: Record<RegistryItem["type"], string> = {
  components: "Component",
  hooks: "React hook",
  utils: "Utility",
  layouts: "Layout",
  providers: "Context provider",
};

// Maps a user's search term to library vocabulary it won't literally contain,
// so intent-style queries ("modal", "dropdown") reach the right components.
const SYNONYMS: Record<string, string[]> = {
  modal: ["dialog", "drawer"],
  popup: ["popover", "tooltip", "dropdown"],
  dropdown: ["select", "menu"],
  tooltip: ["popover"],
  spinner: ["loading", "spin"],
  loader: ["loading", "spin"],
  notification: ["toast"],
  snackbar: ["toast"],
  alert: ["dialog", "toast"],
  tabs: ["tab"],
  accordion: ["tree", "collapse"],
  dropzone: ["upload", "dnd"],
  table: ["grid", "data"],
  avatar: ["profile"],
  chip: ["tag", "badge", "label"],
  toggle: ["switch"],
  checkbox: ["check"],
  // What people call the *job* rather than the component. Someone building one types "list
  // screen", not "DataViews" — and before these, that query returned three results, none of
  // them it.
  list: ["data", "table", "views"],
  screen: ["views", "layout"],
  crud: ["data", "views", "form"],
  record: ["data", "row", "views"],
  dashboard: ["data", "views", "chart"],
  spreadsheet: ["table", "grid", "data"],
  kanban: ["board", "views"],
  board: ["kanban", "views"],
};

// Human labels for the canonical category slugs (for display headers).
const CATEGORY_LABEL: Record<string, string> = {
  buttons: "Buttons & Actions",
  forms: "Forms & Inputs",
  layout: "Layout & Containers",
  dataDisplay: "Data Display",
  dateTime: "Date & Time",
  feedback: "Feedback & Status",
  labels: "Labels & Text",
  overlays: "Overlays & Dialogs",
  navigation: "Navigation",
  advanced: "Advanced",
  hooks: "Hooks",
  utils: "Utilities",
  providers: "Providers",
  uncategorized: "Uncategorized",
};

const categoryLabel = (slug: string): string => CATEGORY_LABEL[slug] ?? slug;

function toKebabCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

export class ComponentRegistry {
  private entries: RegistryEntry[] = [];

  /**
   * Build the search index from loaded docs. `npmDepsFor` (backed by the
   * registry loader) lets discovery results surface install cost without a
   * second round-trip.
   */
  buildFromDocs(docs: ComponentDoc[], npmDepsFor?: (name: string) => string[]): void {
    this.entries = docs.map((doc) => ({
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      category: doc.category,
      tags: doc.tags,
      npmDependencies: npmDepsFor ? npmDepsFor(doc.name) : [],
    }));
  }

  /**
   * Fold registry items that aren't already indexed from docs into the search
   * index — hooks, utils, layouts, providers (and any component without a doc).
   * Their `category` is their registry `type`, so category filtering and the
   * grouped listing work for them automatically. Docs win on name collisions,
   * keeping the richer doc-derived description.
   */
  addRegistryItems(items: RegistryItem[], descriptions?: Map<string, string>): void {
    const known = new Set(this.entries.map((e) => e.name.toLowerCase()));
    for (const item of items) {
      if (known.has(item.name.toLowerCase())) continue;
      known.add(item.name.toLowerCase());
      this.entries.push({
        name: item.name,
        slug: toKebabCase(item.name),
        // Prefer a real one-liner from the reference docs; fall back to the
        // generic type label for items with no reference entry.
        description: descriptions?.get(item.name) ?? `TORCH Glare ${TYPE_LABEL[item.type]}`,
        // Normalize the type so registry layouts join the doc `layout` bucket
        // instead of a separate `layouts` category.
        category: normalizeCategory(item.type),
        tags: [],
        npmDependencies: item.npmDependencies,
      });
    }
  }

  search(query: string): RegistryEntry[] {
    const full = query.trim().toLowerCase();
    if (!full) return []; // an empty query must not "match" everything

    // Expand into search terms: the whole phrase + individual word tokens +
    // synonyms, so "date time picker" and "modal" both resolve.
    const tokens = full.split(/[\s/,-]+/).filter(Boolean);
    const terms = new Set<string>([full, ...tokens]);
    for (const t of [full, ...tokens]) {
      for (const syn of SYNONYMS[t] ?? []) terms.add(syn);
    }

    const scoreTerm = (entry: RegistryEntry, term: string): number => {
      let s = 0;
      const name = entry.name.toLowerCase();
      if (name === term) s += 100;
      else if (name.startsWith(term)) s += 50;
      else if (name.includes(term)) s += 30;
      if (entry.slug.includes(term)) s += 20;
      if (entry.description.toLowerCase().includes(term)) s += 10;
      for (const tag of entry.tags) if (tag.toLowerCase().includes(term)) s += 15;
      if (entry.category.toLowerCase().includes(term)) s += 10;
      return s;
    };

    const scored = this.entries.map((entry) => {
      // Best single-term score, plus a small bonus per additional matching term
      // so multi-word queries that hit several fields rank above single hits.
      let best = 0;
      let matches = 0;
      for (const term of terms) {
        const s = scoreTerm(entry, term);
        if (s > 0) matches++;
        if (s > best) best = s;
      }
      return { entry, score: best > 0 ? best + (matches - 1) * 5 : 0 };
    });

    return scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((s) => s.entry);
  }

  listByCategory(category?: string): RegistryEntry[] {
    if (!category) return [...this.entries].sort((a, b) => a.name.localeCompare(b.name));
    // Normalize the filter with the same canonicalizer used when indexing, so
    // "buttons", "Buttons & Actions" and "components/buttons" all match.
    const target = normalizeCategory(category);
    return this.entries
      .filter((e) => e.category === target)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getCategories(): string[] {
    const cats = new Set(this.entries.map((e) => e.category));
    return Array.from(cats).sort();
  }

  formatComponentList(entries: RegistryEntry[]): string {
    if (entries.length === 0) return "No components found.";

    // Group by category
    const grouped = new Map<string, RegistryEntry[]>();
    for (const entry of entries) {
      const cat = entry.category;
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat)!.push(entry);
    }

    const lines: string[] = [];
    for (const [category, items] of grouped) {
      lines.push(`\n## ${categoryLabel(category)} (${items.length})`);
      for (const item of items) {
        const deps =
          item.npmDependencies.length > 0
            ? ` · npm: ${item.npmDependencies.join(", ")}`
            : "";
        lines.push(`- **${item.name}**: ${item.description}${deps}`);
      }
    }

    return lines.join("\n");
  }
}
