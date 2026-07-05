/**
 * Searchable component registry built from loaded documentation.
 */

import { normalizeCategory, type ComponentDoc } from "./docs-loader.js";

export interface RegistryEntry {
  name: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  /** External npm packages the component pulls in (from registry.json). */
  npmDependencies: string[];
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

  search(query: string): RegistryEntry[] {
    const q = query.toLowerCase();
    const scored = this.entries.map((entry) => {
      let score = 0;

      // Exact name match
      if (entry.name.toLowerCase() === q) score += 100;
      // Name starts with query
      else if (entry.name.toLowerCase().startsWith(q)) score += 50;
      // Name contains query
      else if (entry.name.toLowerCase().includes(q)) score += 30;

      // Slug match
      if (entry.slug.includes(q)) score += 20;

      // Description match
      if (entry.description.toLowerCase().includes(q)) score += 10;

      // Tag match
      for (const tag of entry.tags) {
        if (tag.toLowerCase().includes(q)) score += 15;
      }

      // Category match
      if (entry.category.toLowerCase().includes(q)) score += 10;

      return { entry, score };
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
      lines.push(`\n## ${category} (${items.length})`);
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
