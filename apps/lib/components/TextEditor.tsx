"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
  HTMLAttributes,
  useState,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";
import { Themes } from "../utils/types";
import EditorJS, { type OutputData } from "@editorjs/editorjs";

// ─── Tool Imports ────────────────────────────────────────────────────────────
import Header from "@editorjs/header";
import List from "@editorjs/list";
import NestedList from "@editorjs/nested-list";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import Warning from "@editorjs/warning";
import CodeTool from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import LinkTool from "@editorjs/link";
import SimpleImage from "@editorjs/simple-image";
import RawTool from "@editorjs/raw";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import Underline from "@editorjs/underline";
import TextVariantTune from "@editorjs/text-variant-tune";

// ─── RTL Detection ───────────────────────────────────────────────────────────
const RTL_REGEX = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
const HTML_TAG_REGEX = /<[^>]*>/g;

function getTextDirection(text: string): "rtl" | "ltr" {
  const plain = text.replace(HTML_TAG_REGEX, "").trim();
  if (!plain) return "ltr";
  return RTL_REGEX.test(plain.charAt(0)) ? "rtl" : "ltr";
}

function applyAutoDirection(container: HTMLElement) {
  const blocks = container.querySelectorAll<HTMLElement>(".ce-block");
  let lastBlockDir: "rtl" | "ltr" = "ltr";

  blocks.forEach((block) => {
    // Skip non-text blocks (delimiters, embeds, code)
    if (block.querySelector(".ce-delimiter, .cdx-embed, .embed-tool")) return;

    // Handle list blocks — apply direction per list item so bullets flip
    const listItems = block.querySelectorAll<HTMLElement>(
      ".cdx-list__item, .cdx-nested-list__item, .cdx-checklist__item",
    );

    if (listItems.length > 0) {
      let prevDir: "rtl" | "ltr" = "ltr";
      listItems.forEach((item) => {
        const editable = item.querySelector<HTMLElement>(
          '[contenteditable="true"]',
        );
        if (!editable) return;
        const text = (editable.textContent || "").trim();
        // If empty, inherit direction from previous sibling item
        const dir = text ? getTextDirection(text) : prevDir;
        prevDir = dir;
        item.setAttribute("dir", dir);
        item.style.textAlign = dir === "rtl" ? "right" : "left";
        editable.setAttribute("dir", dir);
      });
      lastBlockDir = prevDir;
      return;
    }

    // Handle regular blocks (paragraph, header, quote, warning, etc.)
    const editables = block.querySelectorAll<HTMLElement>(
      '[contenteditable="true"]',
    );
    editables.forEach((el) => {
      const text = (el.textContent || "").trim();
      // If empty, inherit direction from previous block
      const dir = text ? getTextDirection(text) : lastBlockDir;
      el.setAttribute("dir", dir);
      el.style.textAlign = dir === "rtl" ? "right" : "left";
      lastBlockDir = dir;
    });
  });
}

// ─── Default Tools Configuration ─────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDefaultTools = (): Record<string, any> => ({
  header: {
    class: Header,
    inlineToolbar: true,
    config: { levels: [1, 2, 3, 4, 5, 6], defaultLevel: 2 },
    shortcut: "CMD+SHIFT+H",
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: { defaultStyle: "unordered" },
    shortcut: "CMD+SHIFT+L",
  },
  nestedList: { class: NestedList, inlineToolbar: true },
  checklist: { class: Checklist, inlineToolbar: true },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote's author",
    },
    shortcut: "CMD+SHIFT+O",
  },
  warning: {
    class: Warning,
    inlineToolbar: true,
    config: { titlePlaceholder: "Title", messagePlaceholder: "Message" },
  },
  code: { class: CodeTool, shortcut: "CMD+SHIFT+C" },
  delimiter: { class: Delimiter },
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        vimeo: true,
        codepen: true,
        twitter: true,
        instagram: true,
        coub: true,
        github: true,
      },
    },
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: { rows: 2, cols: 3 },
    shortcut: "CMD+ALT+T",
  },
  linkTool: { class: LinkTool },
  image: { class: SimpleImage },
  raw: { class: RawTool },
  marker: { class: Marker, shortcut: "CMD+SHIFT+M" },
  inlineCode: { class: InlineCode, shortcut: "CMD+SHIFT+I" },
  underline: { class: Underline },
  textVariant: { class: TextVariantTune },
});

// ─── Auto-direction CSS ──────────────────────────────────────────────────────
const AUTO_DIR_STYLES = `
  .torch-text-editor [contenteditable="true"][dir="rtl"] {
    unicode-bidi: plaintext;
  }
  /* List items: flip bullet and padding when RTL */
  .torch-text-editor .cdx-list__item[dir="rtl"] {
    direction: rtl;
  }
  .torch-text-editor .cdx-list__item[dir="rtl"]::before {
    padding-right: 0;
    padding-left: 8px;
  }
  .torch-text-editor .cdx-nested-list__item[dir="rtl"] {
    direction: rtl;
  }
  .torch-text-editor .cdx-checklist__item[dir="rtl"] {
    direction: rtl;
  }
  .torch-text-editor .cdx-checklist__item[dir="rtl"] .cdx-checklist__item-checkbox {
    margin-left: 7px;
    margin-right: 0;
  }
  /* Heading level styles (Tailwind reset strips defaults) */
  .torch-text-editor h1.ce-header {
    font-size: 2em;
    font-weight: 700;
    line-height: 1.25;
  }
  .torch-text-editor h2.ce-header {
    font-size: 1.5em;
    font-weight: 700;
    line-height: 1.3;
  }
  .torch-text-editor h3.ce-header {
    font-size: 1.25em;
    font-weight: 600;
    line-height: 1.35;
  }
  .torch-text-editor h4.ce-header {
    font-size: 1.1em;
    font-weight: 600;
    line-height: 1.4;
  }
  .torch-text-editor h5.ce-header {
    font-size: 1em;
    font-weight: 600;
    line-height: 1.4;
  }
  .torch-text-editor h6.ce-header {
    font-size: 0.9em;
    font-weight: 600;
    line-height: 1.45;
  }
  /* Toolbar buttons: inherit theme color */
  .torch-text-editor .ce-toolbar__plus,
  .torch-text-editor .ce-toolbar__settings-btn {
    color: inherit;
    background-color: transparent;
  }

  /* ── Table: restore borders stripped by Tailwind preflight ── */
  .torch-text-editor .tc-table {
    border-top: 1px solid var(--color-border);
  }
  .torch-text-editor .tc-row {
    border-bottom: 1px solid var(--color-border);
  }
  .torch-text-editor .tc-row:after {
    border-bottom: 1px solid var(--color-border);
  }
  .torch-text-editor .tc-cell {
    border-right: 1px solid var(--color-border);
  }
  .torch-text-editor .tc-add-column {
    border-top: 1px solid var(--color-border);
  }
  .torch-text-editor .tc-table--heading .tc-row:first-child {
    border-bottom: 2px solid var(--color-border);
  }
  .torch-text-editor .tc-table--heading .tc-row:first-child:after {
    border-bottom: 2px solid var(--color-border);
  }
  .torch-text-editor .tc-popover {
    border: 1px solid var(--color-border);
  }
  .torch-text-editor .tc-popover__item-icon {
    border: 1px solid var(--color-border);
  }

  /* ── Table: dark mode variable overrides ── */
  /* Override the plugin's hardcoded light CSS variables for dark themes */
  [data-theme="dark"] .tc-wrap,
  .torch-text-editor[data-theme="dark"] .tc-wrap {
    --color-background: #1e1e1e;
    --color-text-secondary: #999;
    --color-border: #3a3a3a;
  }
  [data-theme="dark"] .tc-popover,
  .torch-text-editor[data-theme="dark"] .tc-popover {
    --color-border: #3a3a3a;
    --color-background: #2a2a2a;
    --color-background-hover: rgba(255, 255, 255, 0.08);
  }
  [data-theme="dark"] .tc-cell--selected,
  .torch-text-editor[data-theme="dark"] .tc-cell--selected {
    background: rgba(255, 255, 255, 0.06);
  }
  [data-theme="dark"] .tc-row--selected,
  .torch-text-editor[data-theme="dark"] .tc-row--selected {
    background: rgba(255, 255, 255, 0.06);
  }
  [data-theme="dark"] .tc-toolbox,
  .torch-text-editor[data-theme="dark"] .tc-toolbox {
    --toggler-dots-color: #999;
    --toggler-dots-color-hovered: #fff;
  }
  [data-theme="dark"] .tc-add-column svg,
  .torch-text-editor[data-theme="dark"] .tc-add-column svg,
  [data-theme="dark"] .tc-add-row svg,
  .torch-text-editor[data-theme="dark"] .tc-add-row svg {
    fill: #999;
  }

  /* ── Editor.js core popover: dark mode variable overrides ── */
  [data-theme="dark"] .ce-popover,
  .torch-text-editor[data-theme="dark"] .ce-popover {
    --color-background: #2a2a2a;
    --color-border: #3a3a3a;
    --color-shadow: rgba(0, 0, 0, 0.3);
    --color-text-primary: #e0e0e0;
    --color-text-secondary: #888;
    --color-border-icon: rgba(255, 255, 255, 0.12);
    --color-border-icon-disabled: #3a3a3a;
    --color-text-icon-active: #5ea3f0;
    --color-background-icon-active: rgba(56, 138, 229, 0.15);
    --color-background-item-focus: rgba(255, 255, 255, 0.06);
    --color-shadow-item-focus: rgba(255, 255, 255, 0.04);
    --color-background-item-hover: rgba(255, 255, 255, 0.08);
    --color-background-item-confirm: #E24A4A;
    --color-background-item-confirm-hover: #CE4343;
  }

  /* Search field in popover */
  [data-theme="dark"] .cdx-search-field,
  .torch-text-editor[data-theme="dark"] .cdx-search-field {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.1);
  }
  [data-theme="dark"] .cdx-search-field__input,
  .torch-text-editor[data-theme="dark"] .cdx-search-field__input {
    color: #e0e0e0;
  }
  [data-theme="dark"] .cdx-search-field__icon svg,
  .torch-text-editor[data-theme="dark"] .cdx-search-field__icon svg {
    color: #888;
  }

  /* Inline toolbar */
  [data-theme="dark"] .ce-inline-toolbar,
  .torch-text-editor[data-theme="dark"] .ce-inline-toolbar {
    --color-background-icon-active: rgba(56, 138, 229, 0.15);
    --color-text-icon-active: #5ea3f0;
    --color-text-primary: #e0e0e0;
  }
  [data-theme="dark"] .ce-inline-toolbar__dropdown:hover,
  .torch-text-editor[data-theme="dark"] .ce-inline-toolbar__dropdown:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  [data-theme="dark"] .ce-inline-toolbar__dropdown,
  .torch-text-editor[data-theme="dark"] .ce-inline-toolbar__dropdown {
    border-color: rgba(255, 255, 255, 0.12);
  }

  /* Popover item separator line */
  [data-theme="dark"] .ce-popover-item-separator__line,
  .torch-text-editor[data-theme="dark"] .ce-popover-item-separator__line {
    background: #3a3a3a;
  }

  /* ── Scrollbar styling ── */
  .torch-text-editor .ce-popover__items::-webkit-scrollbar,
  .torch-text-editor .ce-popover__container::-webkit-scrollbar {
    width: 4px;
  }
  .torch-text-editor .ce-popover__items::-webkit-scrollbar-track,
  .torch-text-editor .ce-popover__container::-webkit-scrollbar-track {
    background: transparent;
  }
  .torch-text-editor .ce-popover__items::-webkit-scrollbar-thumb,
  .torch-text-editor .ce-popover__container::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
  }
  .torch-text-editor .ce-popover__items::-webkit-scrollbar-thumb:hover,
  .torch-text-editor .ce-popover__container::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.25);
  }
  [data-theme="dark"] .ce-popover__items::-webkit-scrollbar-thumb,
  [data-theme="dark"] .ce-popover__container::-webkit-scrollbar-thumb,
  .torch-text-editor[data-theme="dark"] .ce-popover__items::-webkit-scrollbar-thumb,
  .torch-text-editor[data-theme="dark"] .ce-popover__container::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
  }
  [data-theme="dark"] .ce-popover__items::-webkit-scrollbar-thumb:hover,
  [data-theme="dark"] .ce-popover__container::-webkit-scrollbar-thumb:hover,
  .torch-text-editor[data-theme="dark"] .ce-popover__items::-webkit-scrollbar-thumb:hover,
  .torch-text-editor[data-theme="dark"] .ce-popover__container::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

// ─── CVA Styles ──────────────────────────────────────────────────────────────
const textEditorStyles = cva(
  [
    "relative w-full rounded-[6px]",
    "border transition-all duration-200 ease-in-out",
    "[&_.codex-editor]:min-h-[inherit]",
    "[&_.codex-editor__redactor]:min-h-[inherit] [&_.codex-editor__redactor]:pb-[100px]",
    "[&_.ce-paragraph]:typography-body-medium-regular",
  ],
  {
    variants: {
      variant: {
        PresentationStyle: [
          "bg-background-presentation-form-field-primary",
          "text-content-presentation-global-primary",
          "border-border-presentation-action-primary",
          "hover:border-border-presentation-action-hover",
          "focus-within:border-border-presentation-state-focus",
          "[&_.codex-editor]:text-content-presentation-global-primary",
          "[&_.ce-block--selected_.ce-block__content]:bg-background-presentation-action-hover",
          "[&_.cdx-marker]:bg-background-presentation-state-warning-primary",
          "[&_.ce-toolbar__settings-btn]:text-content-presentation-action-light-primary",
          "[&_.ce-toolbar__plus]:text-content-presentation-action-light-primary",
          "[&_.ce-toolbar__settings-btn:hover]:bg-background-presentation-action-hover",
          "[&_.ce-toolbar__plus:hover]:bg-background-presentation-action-hover",
          "[&_.ce-popover]:bg-background-presentation-form-field-primary",
          "[&_.ce-popover]:border-border-presentation-action-primary",
          "[&_.ce-popover__item]:text-content-presentation-action-light-primary",
          "[&_.ce-popover__item:hover]:bg-background-presentation-action-hover",
          "[&_.ce-inline-toolbar]:bg-background-presentation-form-field-primary",
          "[&_.ce-inline-toolbar]:border-border-presentation-action-primary",
          "[&_.ce-inline-toolbar__buttons_.ce-inline-tool]:text-content-presentation-action-light-primary",
          "[&_.ce-code__textarea]:bg-background-presentation-action-secondary",
          "[&_.ce-code__textarea]:text-content-presentation-global-primary",
          "[&_.cdx-quote__text]:text-content-presentation-global-secondary",
          "[&_.cdx-input]:border-border-presentation-action-primary",
          "[&_.cdx-input]:text-content-presentation-global-primary",
          "[&_.tc-cell]:text-content-presentation-global-primary",
          "[&_.cdx-warning]:border-border-presentation-state-warning",
          "[&_.cdx-warning__title]:text-content-presentation-global-primary",
          "[&_.cdx-warning__message]:text-content-presentation-global-secondary",
          "[&_.cdx-checklist__item-checkbox]:border-border-presentation-action-primary",
          "[&_.ce-delimiter]:border-border-presentation-action-primary",
        ],
        SystemStyle: [
          "bg-background-system-body-base",
          "text-content-system-global-primary",
          "border-border-system-global-primary",
          "hover:border-border-system-action-primary-hover",
          "focus-within:border-border-system-action-primary-hover",
          "[&_.codex-editor]:text-content-system-global-primary",
          "[&_.ce-block--selected_.ce-block__content]:bg-background-system-action-primary-hover",
          "[&_.ce-toolbar__settings-btn]:text-content-system-global-primary",
          "[&_.ce-toolbar__plus]:text-content-system-global-primary",
          "[&_.ce-toolbar__settings-btn:hover]:bg-background-system-action-secondary-hover",
          "[&_.ce-toolbar__plus:hover]:bg-background-system-action-secondary-hover",
          "[&_.ce-popover]:bg-background-system-body-tertiary",
          "[&_.ce-popover]:border-border-system-global-primary",
          "[&_.ce-popover__item]:text-content-system-global-primary",
          "[&_.ce-popover__item:hover]:bg-background-system-action-secondary-hover",
          "[&_.ce-inline-toolbar]:bg-background-system-body-tertiary",
          "[&_.ce-inline-toolbar]:border-border-system-global-primary",
          "[&_.ce-inline-toolbar__buttons_.ce-inline-tool]:text-content-system-global-primary",
          "[&_.ce-code__textarea]:bg-background-system-body-tertiary",
          "[&_.ce-code__textarea]:text-content-system-global-primary",
          "[&_.cdx-quote__text]:text-content-system-global-secondary",
          "[&_.cdx-input]:border-border-system-global-primary",
          "[&_.cdx-input]:text-content-system-global-primary",
          "[&_.tc-cell]:text-content-system-global-primary",
          "[&_.cdx-warning]:border-border-system-action-primary-hover",
          "[&_.cdx-warning__title]:text-content-system-global-primary",
          "[&_.cdx-warning__message]:text-content-system-global-secondary",
          "[&_.cdx-checklist__item-checkbox]:border-border-system-global-primary",
          "[&_.ce-delimiter]:border-border-system-global-primary",
        ],
      },
      size: {
        S: "min-h-[200px] p-2",
        M: "min-h-[300px] p-3",
        L: "min-h-[400px] p-4",
        XL: "min-h-[500px] p-5",
      },
      disabled: {
        true: "cursor-not-allowed opacity-60 pointer-events-none",
      },
      error: {
        true: "border-border-presentation-state-negative",
      },
    },
    defaultVariants: {
      variant: "PresentationStyle",
      size: "M",
    },
  },
);

// ─── Types ───────────────────────────────────────────────────────────────────
export interface TextEditorRef {
  save: () => Promise<OutputData>;
  clear: () => void;
  render: (data: OutputData) => Promise<void>;
  focus: (atEnd?: boolean) => boolean;
  getInstance: () => EditorJS | null;
}

interface TextEditorProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof textEditorStyles> {
  theme?: Themes;
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  onReady?: () => void;
  readOnly?: boolean;
  placeholder?: string;
  autofocus?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tools?: Record<string, any>;
  minHeight?: number;
}

// ─── Component ───────────────────────────────────────────────────────────────
export const TextEditor = forwardRef<TextEditorRef, TextEditorProps>(
  (
    {
      className,
      variant,
      size,
      disabled,
      error,
      theme,
      data,
      onChange,
      onReady,
      readOnly = false,
      placeholder = "Write something or press / to select a tool",
      autofocus = false,
      tools,
      minHeight,
      ...props
    },
    ref,
  ) => {
    const editorRef = useRef<EditorJS | null>(null);
    const holderRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<MutationObserver | null>(null);
    const [holderId] = useState(
      () => `torch-editor-${Math.random().toString(36).substring(2, 9)}`,
    );
    const isInitializing = useRef(false);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // ── Auto-direction: watch for DOM changes & input ──
    const setupAutoDirection = useCallback((holderEl: HTMLElement) => {
      // Apply direction to all existing blocks
      applyAutoDirection(holderEl);

      // Listen for input events to re-detect direction per block
      holderEl.addEventListener("input", () => {
        applyAutoDirection(holderEl);
      });

      // Watch for new blocks being added
      observerRef.current = new MutationObserver(() => {
        applyAutoDirection(holderEl);
      });
      observerRef.current.observe(holderEl, {
        childList: true,
        subtree: true,
      });
    }, []);

    const initEditor = useCallback(() => {
      if (isInitializing.current || editorRef.current) return;
      isInitializing.current = true;

      const editor = new EditorJS({
        holder: holderId,
        tools: tools ?? getDefaultTools(),
        tunes: ["textVariant"],
        data: data || undefined,
        readOnly,
        placeholder,
        autofocus,
        onReady: () => {
          isInitializing.current = false;

          // Set up auto-direction after editor is ready
          const holderEl = document.getElementById(holderId);
          if (holderEl) {
            setupAutoDirection(holderEl);
          }

          onReady?.();
        },
        onChange: async (api) => {
          // Re-apply direction on content changes
          const holderEl = document.getElementById(holderId);
          if (holderEl) {
            applyAutoDirection(holderEl);
          }

          if (onChangeRef.current) {
            const savedData = await api.saver.save();
            onChangeRef.current(savedData);
          }
        },
      });

      editorRef.current = editor;
    }, [
      holderId,
      readOnly,
      placeholder,
      autofocus,
      data,
      tools,
      onReady,
      setupAutoDirection,
    ]);

    useEffect(() => {
      initEditor();

      return () => {
        observerRef.current?.disconnect();
        observerRef.current = null;

        if (
          editorRef.current &&
          typeof editorRef.current.destroy === "function"
        ) {
          editorRef.current.destroy();
          editorRef.current = null;
        }
        isInitializing.current = false;
      };
    }, [initEditor]);

    useImperativeHandle(ref, () => ({
      save: async () => {
        if (!editorRef.current) throw new Error("Editor not initialized");
        return editorRef.current.save();
      },
      clear: () => {
        editorRef.current?.clear();
      },
      render: async (renderData: OutputData) => {
        if (!editorRef.current) throw new Error("Editor not initialized");
        return editorRef.current.render(renderData);
      },
      focus: (atEnd?: boolean) => {
        if (!editorRef.current) return false;
        return editorRef.current.focus(atEnd);
      },
      getInstance: () => editorRef.current,
    }));

    return (
      <>
        <style>{AUTO_DIR_STYLES}</style>
        <div
          ref={holderRef}
          data-theme={theme}
          className={cn(
            "torch-text-editor",
            textEditorStyles({ variant, size, disabled, error }),
            className,
          )}
          style={minHeight ? { minHeight: `${minHeight}px` } : undefined}
          {...props}
        >
          <div id={holderId} />
        </div>
      </>
    );
  },
);

TextEditor.displayName = "TextEditor";

export type { TextEditorProps, OutputData };
