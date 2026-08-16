/**
 * Utilities for parsing frontmatter and extracting sections from markdown files.
 */

export interface Frontmatter {
  name?: string;
  title?: string;
  description?: string;
  version?: string;
  status?: string;
  category?: string;
  group?: string;
  tags?: string[];
  keywords?: string[];
  bundleSize?: string;
  dependencies?: string[];
}

export interface ParsedDoc {
  frontmatter: Frontmatter;
  content: string;
}

export interface CodeExample {
  heading: string;
  language: string;
  code: string;
}

/**
 * Parse YAML frontmatter from a markdown string.
 * Handles both Pattern A (name/tags) and Pattern B (title/keywords).
 */
export function parseFrontmatter(markdown: string): ParsedDoc {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return { frontmatter: {}, content: markdown };
  }

  const raw = match[1];
  const content = markdown.slice(match[0].length).trim();
  const frontmatter: Frontmatter = {};

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("-")) continue;

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();

    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    switch (key) {
      case "name":
        frontmatter.name = value;
        break;
      case "title":
        frontmatter.title = value;
        break;
      case "description":
        frontmatter.description = value;
        break;
      case "version":
        frontmatter.version = value;
        break;
      case "status":
        frontmatter.status = value;
        break;
      case "category":
        frontmatter.category = value;
        break;
      case "group":
        frontmatter.group = value;
        break;
      case "bundle-size":
        frontmatter.bundleSize = value;
        break;
      case "tags":
      case "keywords":
        {
          const arrayMatch = value.match(/\[(.*)\]/);
          if (arrayMatch) {
            const items = arrayMatch[1].split(",").map((s) => s.trim().replace(/['"]/g, "")).filter(Boolean);
            if (key === "tags") frontmatter.tags = items;
            else frontmatter.keywords = items;
          }
        }
        break;
    }
  }

  // Parse multiline dependencies
  if (raw.includes("dependencies:")) {
    const deps: string[] = [];
    const lines = raw.split("\n");
    let inDeps = false;
    for (const line of lines) {
      if (line.trim().startsWith("dependencies:")) {
        inDeps = true;
        continue;
      }
      if (inDeps) {
        if (line.trim().startsWith("-")) {
          const dep = line.trim().slice(1).trim().replace(/['"]/g, "").split(":")[0].trim();
          deps.push(dep);
        } else if (line.trim() && !line.startsWith(" ") && !line.startsWith("\t")) {
          inDeps = false;
        }
      }
    }
    if (deps.length > 0) frontmatter.dependencies = deps;
  }

  return { frontmatter, content };
}

/**
 * Extract the first meaningful paragraph after the main heading as description.
 */
export function extractDescription(markdownContent: string): string {
  // Look for blockquote description first (> A versatile button...)
  const blockquoteMatch = markdownContent.match(/^>\s*(.+)$/m);
  if (blockquoteMatch) {
    return blockquoteMatch[1].trim();
  }

  // Fall back to first paragraph after # heading
  const lines = markdownContent.split("\n");
  let pastHeading = false;
  for (const line of lines) {
    if (line.startsWith("# ")) {
      pastHeading = true;
      continue;
    }
    if (pastHeading && line.trim() && !line.startsWith("#") && !line.startsWith("```") && !line.startsWith(">")) {
      return line.trim();
    }
  }

  return "";
}

/**
 * A heading, normalised for comparison: lowercased, stripped of markdown and punctuation, and with
 * a trailing `s` folded off each word.
 *
 * The plural fold is there because the error is always in that direction — the tool suggests
 * `section: "examples"` and the heading is `## Example pages`, so an agent following the
 * instruction it was given got "No section". Folding both sides makes them meet.
 */
function headingKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_]/g, "")
    .replace(/[^a-z0-9. ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => (word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word))
    .join(" ");
}

/**
 * Extract a section by heading text (e.g., "API Reference", "Props", "DataViews.Board").
 *
 * Returns everything from that heading until the next heading of the same or higher level.
 *
 * Matching is tried in three passes — **exact**, then **prefix**, then whole-word — and the H1 is
 * never a candidate. Both rules exist because one loose substring pass answers the wrong question
 * on a large doc: asking `data-views.md` for "views" matched the title `# DataViews` and returned
 * the entire 45 KB file, and asking for "panel" matched the prose heading
 * `## Header, panel and filters` rather than the `### Panel` API block further down. Ranking the
 * passes means an exact heading wins over one that merely contains the word, and requiring a whole
 * word in the last pass keeps "views" from landing on `### DataViews.Board`.
 */
export function extractSection(markdown: string, ...headingNames: string[]): string | null {
  const lines = markdown.split("\n");

  // Index every heading once: line number, level, and its comparison key. The H1 is skipped —
  // it is the document's title, so it "contains" almost any word you might ask for.
  const headings: { line: number; level: number; key: string }[] = [];
  let inFence = false;
  for (const [i, line] of lines.entries()) {
    if (line.startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = line.match(/^(#{1,6})\s+(.+)/);
    if (!m) continue;
    const level = m[1].length;
    if (level === 1) continue;
    headings.push({ line: i, level, key: headingKey(m[2]) });
  }

  const wanted = headingNames.map(headingKey).filter(Boolean);
  // `.` and ` ` are the only separators a key can contain after normalising, so a whole-word match
  // is "bounded by one of those, or by the ends".
  const wholeWord = (key: string, want: string) =>
    new RegExp(`(?:^|[ .])${want.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:[ .]|$)`).test(key);

  const found =
    headings.find((h) => wanted.some((w) => h.key === w)) ??
    headings.find((h) => wanted.some((w) => h.key.startsWith(w))) ??
    headings.find((h) => wanted.some((w) => wholeWord(h.key, w)));

  if (!found) return null;

  // Capture until the next heading at the same or a higher level — sub-sections come along.
  const end = headings.find((h) => h.line > found.line && h.level <= found.level);
  const result = lines.slice(found.line, end ? end.line : lines.length);

  return result.length > 0 ? result.join("\n").trim() : null;
}

/**
 * List the section headings of a markdown doc, in order — used to give an AI a table of contents
 * so it can request one section instead of pulling the whole file.
 *
 * Both `##` and `###` are listed, the latter indented, because on a compound component the `###`
 * blocks are where the per-part props live: a `##`-only list of `DataViews` shows "API Reference"
 * and hides the two dozen parts underneath it, so an agent cannot know what it is allowed to ask
 * for. Deeper levels stay out — they are prose structure, not addressable API.
 */
export function listSectionHeadings(markdown: string): string[] {
  const headings: string[] = [];
  let inFence = false;
  for (const line of markdown.split("\n")) {
    if (line.startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = line.match(/^(#{2,3})\s+(.+)/);
    if (m) headings.push(m[1].length === 2 ? m[2].trim() : `  ${m[2].trim()}`);
  }
  return headings;
}

/**
 * Extract all code blocks with their preceding heading context.
 */
export function extractCodeExamples(markdown: string): CodeExample[] {
  const examples: CodeExample[] = [];
  const lines = markdown.split("\n");
  let currentHeading = "";
  let inCodeBlock = false;
  let codeLanguage = "";
  let codeLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,6}\s+(.+)/);
    if (headingMatch && !inCodeBlock) {
      currentHeading = headingMatch[1].trim();
      continue;
    }

    if (line.startsWith("```") && !inCodeBlock) {
      inCodeBlock = true;
      codeLanguage = line.slice(3).trim() || "text";
      codeLines = [];
      continue;
    }

    if (line.startsWith("```") && inCodeBlock) {
      inCodeBlock = false;
      examples.push({
        heading: currentHeading,
        language: codeLanguage,
        code: codeLines.join("\n"),
      });
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
    }
  }

  return examples;
}
