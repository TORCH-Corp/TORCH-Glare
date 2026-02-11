# TORCH Glare v1.1.16 — Changelog

## New Components

### TextEditor
Full-featured block-style text editor built on Editor.js.

**Features:**
- 17 built-in block tools (header, list, nested list, checklist, quote, warning, code, delimiter, embed, table, link, image, raw HTML, chart, marker, inline code, underline)
- Auto RTL/LTR direction detection per block — Arabic text becomes RTL, English stays LTR in the same editor
- Markdown paste support — detects markdown in clipboard, parses to Editor.js blocks, renders in a single pass
- Idle-scheduled saves via `requestIdleCallback` with 500ms debounce
- RAF-batched input direction checks (non-blocking)
- O(1) MutationObserver for new block direction detection
- Dark mode support via `data-theme="dark"`
- Heading level styles restored (Tailwind preflight strips defaults)
- Table dark mode overrides, popover dark mode, inline toolbar dark mode
- Scrollbar styling for popovers

**Props:**
- `size` — `S | M | L | XL` (optional, no default — use `className` for custom sizing)
- `variant` — `PresentationStyle` (default)
- `data` — Initial `OutputData` for the editor
- `onChange` — Callback with `OutputData` on content change
- `onReady` — Callback when editor is ready
- `readOnly` — Toggle read-only mode (can change without recreating editor)
- `disabled` — Disable the editor
- `placeholder` — Placeholder text
- `autofocus` — Auto-focus on mount
- `tools` — Custom Editor.js tools config (overrides defaults)
- `minHeight` — Custom min-height in pixels
- `theme` — `dark | light | default`

**Ref methods:** `save()`, `clear()`, `render(data)`, `focus(atEnd?)`, `getInstance()`

**Files:** `components/TextEditor.tsx`, `utils/markdownParser.ts`, `types/editorjs.d.ts`

---

### ChartBlockTool
Editor.js block tool for rendering interactive charts via Chart.js.

**Supported chart types:** bar, line, pie, doughnut, radar, polarArea

**Features:**
- Inline data table editor with add/remove rows and columns
- Color pickers per dataset
- Chart type selector with visual buttons
- Title input
- Toggle between editor panel and chart preview
- Dark mode support

**File:** `components/ChartBlockTool.ts`

---

### Breadcrumb
Navigation breadcrumb component with separator support.

**Exports:** `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`

**File:** `components/Breadcrumb.tsx`

---

### ButtonGroup
Container component for grouping buttons together.

**File:** `components/ButtonGroup.tsx`

---

### ToggleButton
Toggle button with active/inactive states.

**File:** `components/ToggleButton.tsx`

---

## New Utilities

### markdownParser
Utility for detecting and parsing markdown text into Editor.js block format.

**Exports:**
- `isMarkdown(text)` — Heuristic detection scoring (returns `true` if text is likely markdown)
- `parseMarkdownToBlocks(text)` — State-machine line parser converting markdown to Editor.js blocks

**Supported markdown elements:** headings, bullet/numbered lists, checklists, code blocks (with language), blockquotes, horizontal rules, tables, inline formatting (bold, italic, code, links, strikethrough)

**File:** `utils/markdownParser.ts`

---

## Changes to Existing Components

### TextEditor (from previous commits in this branch)
- Removed border styles (no focus, hover, or error borders)
- Removed `SystemStyle` variant — only `PresentationStyle` remains
- Removed `error` prop and variant
- Size is now optional — omit `size` and use `className` for fully custom sizing
- `spellCheck={false}` and `translate="no"` on holder div for reduced browser overhead

---

## Documentation
- Added `CLAUDE.md` — Development guide for component patterns, CVA conventions, file structure, and styling tokens
- Added `docs/BLOCKS.md` — Documentation for the TORCH Glare blocks system
