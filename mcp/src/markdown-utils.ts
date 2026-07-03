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
 * Extract a section by heading text (e.g., "API Reference", "Props").
 * Returns everything from that heading until the next heading of same or higher level.
 */
export function extractSection(markdown: string, ...headingNames: string[]): string | null {
  const lines = markdown.split("\n");
  let capturing = false;
  let captureLevel = 0;
  const result: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim().toLowerCase();

      if (!capturing) {
        // Check if this heading matches any of the target names
        if (headingNames.some((name) => text.includes(name.toLowerCase()))) {
          capturing = true;
          captureLevel = level;
          result.push(line);
          continue;
        }
      } else {
        // Stop if we hit a heading of same or higher level
        if (level <= captureLevel) {
          break;
        }
        result.push(line);
        continue;
      }
    }

    if (capturing) {
      result.push(line);
    }
  }

  return result.length > 0 ? result.join("\n").trim() : null;
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
