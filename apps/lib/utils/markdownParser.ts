// ─── Markdown → Editor.js Block Parser ───────────────────────────────────────
// Parses pasted markdown text into Editor.js-compatible block data.

export interface EditorBlock {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

// ─── Markdown Detection ──────────────────────────────────────────────────────

const MD_PATTERNS = {
  header: /^#{1,6}\s+\S/m,
  unorderedList: /^[\t ]*[-*+]\s+\S/m,
  orderedList: /^[\t ]*\d+\.\s+\S/m,
  checklist: /^[\t ]*-\s+\[[ xX]\]\s/m,
  codeBlock: /^```/m,
  blockquote: /^>\s/m,
  horizontalRule: /^(---+|___+|\*\*\*+)\s*$/m,
  table: /^\|(.+\|)+\s*$/m,
  image: /^!\[.*\]\(.+\)/m,
  link: /\[.+\]\(.+\)/,
  bold: /\*\*[^*]+\*\*/,
  italic: /(?<!\*)\*[^*]+\*(?!\*)/,
  inlineCode: /`[^`]+`/,
  strikethrough: /~~[^~]+~~/,
};

/**
 * Heuristic: determines whether the given text is likely markdown.
 * Returns true if the text matches enough markdown-specific patterns.
 */
export function isMarkdown(text: string): boolean {
  if (!text || text.trim().length === 0) return false;

  const lines = text.split("\n");
  // Single short line without strong indicators → probably not markdown
  if (lines.length === 1 && text.length < 80) {
    // Only if it has a very strong indicator on a single line
    return MD_PATTERNS.header.test(text) || MD_PATTERNS.image.test(text);
  }

  let score = 0;
  const strongIndicators = [
    "header",
    "codeBlock",
    "table",
    "horizontalRule",
    "checklist",
    "image",
  ] as const;
  const weakIndicators = [
    "unorderedList",
    "orderedList",
    "blockquote",
    "bold",
    "italic",
    "inlineCode",
    "strikethrough",
    "link",
  ] as const;

  for (const key of strongIndicators) {
    if (MD_PATTERNS[key].test(text)) score += 2;
  }
  for (const key of weakIndicators) {
    if (MD_PATTERNS[key].test(text)) score += 1;
  }

  // Need at least score 2 (one strong indicator or two weak ones)
  return score >= 2;
}

// ─── Inline Markdown → HTML ──────────────────────────────────────────────────

/**
 * Converts inline markdown syntax to HTML tags understood by Editor.js.
 * Order matters — bold before italic to handle ** vs *.
 */
export function convertInlineMarkdown(text: string): string {
  let result = text;

  // Images inline (rare in inline context but handle gracefully)
  result = result.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1">',
  );

  // Links: [text](url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Bold: **text** or __text__
  result = result.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  result = result.replace(/__(.+?)__/g, "<b>$1</b>");

  // Italic: *text* or _text_ (not inside bold)
  result = result.replace(/(?<![*_])\*([^*]+?)\*(?![*_])/g, "<i>$1</i>");
  result = result.replace(/(?<![*_])_([^_]+?)_(?![*_])/g, "<i>$1</i>");

  // Strikethrough: ~~text~~
  result = result.replace(/~~(.+?)~~/g, "<s>$1</s>");

  // Inline code: `text`
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Highlight / mark: ==text==
  result = result.replace(/==(.+?)==/g, "<mark>$1</mark>");

  return result;
}

// ─── Block Parser ────────────────────────────────────────────────────────────

type ParserState = "normal" | "code" | "table";

/**
 * Parses a markdown string into an array of Editor.js block objects.
 */
export function parseMarkdownToBlocks(md: string): EditorBlock[] {
  const lines = md.split("\n");
  const blocks: EditorBlock[] = [];

  let state: ParserState = "normal";
  let codeBuffer: string[] = [];
  let codeLang = "";
  let tableRows: string[][] = [];
  let listBuffer: { text: string; checked?: boolean }[] = [];
  let listType: "ordered" | "unordered" | "checklist" | null = null;
  let quoteBuffer: string[] = [];

  function flushList() {
    if (listBuffer.length === 0 || !listType) return;

    if (listType === "checklist") {
      blocks.push({
        type: "checklist",
        data: {
          items: listBuffer.map((item) => ({
            text: convertInlineMarkdown(item.text),
            checked: item.checked ?? false,
          })),
        },
      });
    } else {
      blocks.push({
        type: "list",
        data: {
          style: listType,
          items: listBuffer.map((item) => convertInlineMarkdown(item.text)),
        },
      });
    }
    listBuffer = [];
    listType = null;
  }

  function flushQuote() {
    if (quoteBuffer.length === 0) return;
    blocks.push({
      type: "quote",
      data: {
        text: convertInlineMarkdown(quoteBuffer.join("<br>")),
        caption: "",
        alignment: "left",
      },
    });
    quoteBuffer = [];
  }

  function flushTable() {
    if (tableRows.length === 0) return;
    blocks.push({
      type: "table",
      data: {
        withHeadings: tableRows.length > 1,
        content: tableRows.map((row) =>
          row.map((cell) => convertInlineMarkdown(cell.trim())),
        ),
      },
    });
    tableRows = [];
  }

  function flushAll() {
    flushList();
    flushQuote();
    flushTable();
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimEnd();

    // ── Code block state ──
    if (state === "code") {
      if (trimmed.startsWith("```")) {
        blocks.push({
          type: "code",
          data: { code: codeBuffer.join("\n"), ...(codeLang && { language: codeLang }) },
        });
        codeBuffer = [];
        codeLang = "";
        state = "normal";
      } else {
        codeBuffer.push(line);
      }
      continue;
    }

    // ── Table state ──
    if (state === "table") {
      const tableMatch = trimmed.match(/^\|(.+)\|$/);
      if (tableMatch) {
        const cells = tableMatch[1].split("|").map((c) => c.trim());
        // Skip separator rows (|---|---|)
        if (cells.every((c) => /^[-:]+$/.test(c))) continue;
        tableRows.push(cells);
        continue;
      } else {
        flushTable();
        state = "normal";
        // Fall through to process this line normally
      }
    }

    // ── Normal state ──

    // Code block opening
    if (trimmed.startsWith("```")) {
      flushAll();
      codeLang = trimmed.slice(3).trim();
      state = "code";
      continue;
    }

    // Empty line — flush accumulators
    if (trimmed === "") {
      flushAll();
      continue;
    }

    // Horizontal rule
    if (/^(---+|___+|\*\*\*+)\s*$/.test(trimmed)) {
      flushAll();
      blocks.push({ type: "delimiter", data: {} });
      continue;
    }

    // Header
    const headerMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      flushAll();
      blocks.push({
        type: "header",
        data: {
          text: convertInlineMarkdown(headerMatch[2]),
          level: headerMatch[1].length,
        },
      });
      continue;
    }

    // Image (standalone line)
    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushAll();
      blocks.push({
        type: "image",
        data: {
          url: imageMatch[2],
          caption: imageMatch[1],
          withBorder: false,
          withBackground: false,
          stretched: false,
        },
      });
      continue;
    }

    // Checklist item: - [ ] or - [x]
    const checklistMatch = trimmed.match(/^[-*+]\s+\[([ xX])\]\s+(.+)$/);
    if (checklistMatch) {
      if (listType && listType !== "checklist") flushList();
      listType = "checklist";
      listBuffer.push({
        text: checklistMatch[2],
        checked: checklistMatch[1].toLowerCase() === "x",
      });
      continue;
    }

    // Unordered list item: - item, * item, + item
    const ulMatch = trimmed.match(/^[-*+]\s+(.+)$/);
    if (ulMatch) {
      if (listType && listType !== "unordered") flushList();
      if (quoteBuffer.length) flushQuote();
      listType = "unordered";
      listBuffer.push({ text: ulMatch[1] });
      continue;
    }

    // Ordered list item: 1. item
    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (listType && listType !== "ordered") flushList();
      if (quoteBuffer.length) flushQuote();
      listType = "ordered";
      listBuffer.push({ text: olMatch[1] });
      continue;
    }

    // Blockquote: > text
    const quoteMatch = trimmed.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      if (listBuffer.length) flushList();
      quoteBuffer.push(quoteMatch[1]);
      continue;
    }

    // Table start: | col1 | col2 |
    const tableStartMatch = trimmed.match(/^\|(.+)\|$/);
    if (tableStartMatch) {
      flushAll();
      const cells = tableStartMatch[1].split("|").map((c) => c.trim());
      if (!cells.every((c) => /^[-:]+$/.test(c))) {
        tableRows.push(cells);
      }
      state = "table";
      continue;
    }

    // Warning block: > ⚠️ title \n > message  (special blockquote variant)
    // Already handled by blockquote — this could be extended later

    // Regular paragraph
    flushAll();
    blocks.push({
      type: "paragraph",
      data: { text: convertInlineMarkdown(trimmed) },
    });
  }

  // Flush remaining accumulators
  if (state === "code" && codeBuffer.length > 0) {
    // Unterminated code block — still emit it
    blocks.push({ type: "code", data: { code: codeBuffer.join("\n") } });
  }
  flushAll();

  return blocks;
}
