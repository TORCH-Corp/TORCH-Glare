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
import { isMarkdown, parseMarkdownToBlocks } from "../utils/markdownParser";

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
import ChartBlockTool from "./ChartBlockTool";

// ─── RTL Detection ───────────────────────────────────────────────────────────
const RTL_REGEX = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;

/** Find the first visible character (skipping HTML tags and whitespace) and test RTL */
function getTextDirection(text: string): "rtl" | "ltr" {
  let i = 0;
  const len = text.length;
  while (i < len) {
    const ch = text[i];
    if (ch === "<") {
      // Skip HTML tag
      const end = text.indexOf(">", i);
      if (end === -1) break;
      i = end + 1;
    } else if (ch === " " || ch === "\n" || ch === "\t" || ch === "\r") {
      i++;
    } else {
      return RTL_REGEX.test(ch) ? "rtl" : "ltr";
    }
  }
  return "ltr";
}

function setDirIfChanged(el: HTMLElement, dir: "rtl" | "ltr") {
  if (el.getAttribute("dir") !== dir) {
    el.setAttribute("dir", dir);
    el.style.textAlign = dir === "rtl" ? "right" : "left";
  }
}

function applyDirectionToBlock(block: HTMLElement, fallbackDir: "rtl" | "ltr" = "ltr"): "rtl" | "ltr" {
  // Skip non-text blocks (delimiters, embeds, code)
  if (block.querySelector(".ce-delimiter, .cdx-embed, .embed-tool")) return fallbackDir;

  // Handle list blocks — apply direction per list item so bullets flip
  const listItems = block.querySelectorAll<HTMLElement>(
    ".cdx-list__item, .cdx-nested-list__item, .cdx-checklist__item",
  );

  if (listItems.length > 0) {
    let prevDir: "rtl" | "ltr" = fallbackDir;
    listItems.forEach((item) => {
      const editable = item.querySelector<HTMLElement>(
        '[contenteditable="true"]',
      );
      if (!editable) return;
      const text = (editable.textContent || "").trim();
      const dir = text ? getTextDirection(text) : prevDir;
      prevDir = dir;
      setDirIfChanged(item, dir);
      setDirIfChanged(editable, dir);
    });
    return prevDir;
  }

  // Handle regular blocks (paragraph, header, quote, warning, etc.)
  let lastDir = fallbackDir;
  const editables = block.querySelectorAll<HTMLElement>(
    '[contenteditable="true"]',
  );
  editables.forEach((el) => {
    const text = (el.textContent || "").trim();
    const dir = text ? getTextDirection(text) : fallbackDir;
    setDirIfChanged(el, dir);
    lastDir = dir;
  });
  return lastDir;
}

function applyAutoDirection(container: HTMLElement) {
  const blocks = container.querySelectorAll<HTMLElement>(".ce-block");
  let lastBlockDir: "rtl" | "ltr" = "ltr";
  blocks.forEach((block) => {
    lastBlockDir = applyDirectionToBlock(block, lastBlockDir);
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
  chart: { class: ChartBlockTool as any },
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

  /* ── Chart Block Tool ── */
  .torch-text-editor .cdx-chart-block {
    padding: 16px 0;
    cursor: pointer;
  }
  .torch-text-editor .cdx-chart-block__editor-panel {
    overflow: hidden;
    max-height: 1000px;
    opacity: 1;
    transition: max-height 300ms ease-in-out, opacity 200ms ease-in-out, margin 300ms ease-in-out;
    margin-bottom: 16px;
  }
  .torch-text-editor .cdx-chart-block__editor-panel--hidden {
    max-height: 0;
    opacity: 0;
    margin-bottom: 0;
    pointer-events: none;
  }
  .torch-text-editor .cdx-chart-block__title-input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #e0e0e0;
    padding: 8px 0;
    font-size: 16px;
    font-weight: 600;
    background: transparent;
    color: inherit;
    outline: none;
    margin-bottom: 12px;
  }
  .torch-text-editor .cdx-chart-block__title-input::placeholder {
    color: #999;
  }
  .torch-text-editor .cdx-chart-block__type-selector {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    margin-bottom: 12px;
  }
  .torch-text-editor .cdx-chart-block__type-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: transparent;
    color: inherit;
    font-size: 12px;
    cursor: pointer;
    transition: all 200ms ease-in-out;
  }
  .torch-text-editor .cdx-chart-block__type-btn:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  .torch-text-editor .cdx-chart-block__type-btn--active {
    background: rgba(54, 162, 235, 0.15);
    border-color: rgb(54, 162, 235);
    color: rgb(54, 162, 235);
  }
  .torch-text-editor .cdx-chart-block__table-wrapper {
    overflow-x: auto;
    margin-bottom: 12px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
  }
  .torch-text-editor .cdx-chart-block__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .torch-text-editor .cdx-chart-block__table th,
  .torch-text-editor .cdx-chart-block__table td {
    border: 1px solid #e0e0e0;
    padding: 4px 6px;
    min-width: 80px;
  }
  .torch-text-editor .cdx-chart-block__corner-cell {
    min-width: 100px;
    width: 100px;
  }
  .torch-text-editor .cdx-chart-block__controls-header {
    min-width: 60px;
    width: 60px;
  }
  .torch-text-editor .cdx-chart-block__label-cell {
    position: relative;
  }
  .torch-text-editor .cdx-chart-block__table input {
    width: 100%;
    border: none;
    background: transparent;
    color: inherit;
    outline: none;
    font-size: 13px;
    padding: 2px;
  }
  .torch-text-editor .cdx-chart-block__table input[type="number"] {
    text-align: center;
    -moz-appearance: textfield;
  }
  .torch-text-editor .cdx-chart-block__table input[type="number"]::-webkit-inner-spin-button,
  .torch-text-editor .cdx-chart-block__table input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .torch-text-editor .cdx-chart-block__color-picker {
    width: 24px;
    height: 24px;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    padding: 0;
  }
  .torch-text-editor .cdx-chart-block__dataset-controls {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 60px;
  }
  .torch-text-editor .cdx-chart-block__remove-btn,
  .torch-text-editor .cdx-chart-block__remove-col-btn {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 14px;
    padding: 2px 4px;
    border-radius: 3px;
    transition: all 200ms ease-in-out;
    line-height: 1;
  }
  .torch-text-editor .cdx-chart-block__remove-btn:hover,
  .torch-text-editor .cdx-chart-block__remove-col-btn:hover {
    color: rgb(255, 99, 132);
    background: rgba(255, 99, 132, 0.1);
  }
  .torch-text-editor .cdx-chart-block__remove-col-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    font-size: 11px;
    padding: 0 3px;
  }
  .torch-text-editor .cdx-chart-block__actions {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }
  .torch-text-editor .cdx-chart-block__action-btn {
    padding: 4px 12px;
    border: 1px dashed #ccc;
    border-radius: 4px;
    background: transparent;
    color: inherit;
    font-size: 12px;
    cursor: pointer;
    transition: all 200ms ease-in-out;
  }
  .torch-text-editor .cdx-chart-block__action-btn:hover {
    border-style: solid;
    background: rgba(0, 0, 0, 0.03);
  }
  .torch-text-editor .cdx-chart-block__canvas-wrapper {
    position: relative;
    height: 350px;
    width: 100%;
  }
  .torch-text-editor .cdx-chart-block__canvas-wrapper canvas {
    width: 100% !important;
    height: 100% !important;
  }
  .torch-text-editor .cdx-chart-block__title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: inherit;
  }

  /* ── Chart Block: dark mode ── */
  [data-theme="dark"] .cdx-chart-block__title-input,
  .torch-text-editor[data-theme="dark"] .cdx-chart-block__title-input {
    border-bottom-color: #3a3a3a;
  }
  [data-theme="dark"] .cdx-chart-block__title-input::placeholder,
  .torch-text-editor[data-theme="dark"] .cdx-chart-block__title-input::placeholder {
    color: #666;
  }
  [data-theme="dark"] .cdx-chart-block__type-btn,
  .torch-text-editor[data-theme="dark"] .cdx-chart-block__type-btn {
    border-color: #3a3a3a;
  }
  [data-theme="dark"] .cdx-chart-block__type-btn:hover,
  .torch-text-editor[data-theme="dark"] .cdx-chart-block__type-btn:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  [data-theme="dark"] .cdx-chart-block__table-wrapper,
  .torch-text-editor[data-theme="dark"] .cdx-chart-block__table-wrapper {
    border-color: #3a3a3a;
  }
  [data-theme="dark"] .cdx-chart-block__table th,
  [data-theme="dark"] .cdx-chart-block__table td,
  .torch-text-editor[data-theme="dark"] .cdx-chart-block__table th,
  .torch-text-editor[data-theme="dark"] .cdx-chart-block__table td {
    border-color: #3a3a3a;
  }
  [data-theme="dark"] .cdx-chart-block__action-btn,
  .torch-text-editor[data-theme="dark"] .cdx-chart-block__action-btn {
    border-color: #3a3a3a;
  }
  [data-theme="dark"] .cdx-chart-block__action-btn:hover,
  .torch-text-editor[data-theme="dark"] .cdx-chart-block__action-btn:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  /* ── Paste loading overlay ── */
  .torch-text-editor__loading-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: inherit;
    opacity: 0.92;
    border-radius: inherit;
    pointer-events: all;
  }
  .torch-text-editor__loading-spinner {
    width: 28px;
    height: 28px;
    border: 3px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: torch-editor-spin 0.7s linear infinite;
    opacity: 0.6;
  }
  .torch-text-editor__loading-text {
    font-size: 13px;
    opacity: 0.6;
  }
  @keyframes torch-editor-spin {
    to { transform: rotate(360deg); }
  }
`;

// ─── CVA Styles ──────────────────────────────────────────────────────────────
const textEditorStyles = cva(
  [
    "relative w-full rounded-[6px]",
    "border-0 transition-all duration-200 ease-in-out",
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
    },
    defaultVariants: {
      variant: "PresentationStyle",
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
    const pasteHandlerRef = useRef<((e: ClipboardEvent) => void) | null>(null);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const idleCallbackRef = useRef<number | null>(null);
    const dirRafRef = useRef<number | null>(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // Refs for initial-only config — changing these does NOT recreate the editor
    const initialDataRef = useRef(data);
    const toolsRef = useRef(tools);
    const onReadyRef = useRef(onReady);
    const readOnlyRef = useRef(readOnly);
    const placeholderRef = useRef(placeholder);
    const autofocusRef = useRef(autofocus);

    // Keep refs up to date (but don't trigger re-init)
    onReadyRef.current = onReady;

    // Schedule save via requestIdleCallback so it runs when browser is idle
    const scheduleIdleSave = useCallback(() => {
      if (idleCallbackRef.current != null) {
        (window.cancelIdleCallback || clearTimeout)(idleCallbackRef.current);
      }
      const doSave = async () => {
        idleCallbackRef.current = null;
        if (!editorRef.current || !onChangeRef.current) return;
        try {
          const savedData = await editorRef.current.save();
          onChangeRef.current(savedData);
        } catch {
          // Editor may have been destroyed
        }
      };
      if (typeof window.requestIdleCallback === "function") {
        idleCallbackRef.current = window.requestIdleCallback(() => doSave(), { timeout: 2000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        idleCallbackRef.current = window.setTimeout(() => doSave(), 100) as unknown as number;
      }
    }, []);

    // ── Markdown paste handler ──
    const setupMarkdownPaste = useCallback(
      (holderEl: HTMLElement) => {
        const handler = async (e: ClipboardEvent) => {
          if (readOnlyRef.current || !editorRef.current) return;

          const plain = e.clipboardData?.getData("text/plain") || "";

          // Only intercept if the plain text is markdown
          if (!isMarkdown(plain)) return;

          e.preventDefault();
          e.stopPropagation();

          const parsedBlocks = parseMarkdownToBlocks(plain);
          if (parsedBlocks.length === 0) return;

          const editor = editorRef.current;

          // Save existing content, merge new blocks at cursor, render once
          // This avoids per-block insert which freezes the editor on large pastes
          try {
            const existingData = await editor.save();
            const existingBlocks = existingData.blocks || [];

            // Determine insertion point
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const blocks = (editor as any).blocks;
            let insertIdx = existingBlocks.length;
            try {
              if (blocks?.getCurrentBlockIndex) {
                insertIdx = blocks.getCurrentBlockIndex() + 1;
              }
            } catch {
              // Use end of document
            }

            // Convert parsed blocks to OutputData block format
            const newBlocks = parsedBlocks.map((block) => ({
              type: block.type,
              data: block.data,
            }));

            // Remove empty paragraph at cursor if it's the only content there
            const filteredExisting = [...existingBlocks];
            if (insertIdx > 0) {
              const cursorBlock = filteredExisting[insertIdx - 1];
              if (
                cursorBlock &&
                cursorBlock.type === "paragraph" &&
                (!cursorBlock.data.text ||
                  cursorBlock.data.text.trim() === "" ||
                  cursorBlock.data.text === "<br>")
              ) {
                filteredExisting.splice(insertIdx - 1, 1);
                insertIdx = Math.max(0, insertIdx - 1);
              }
            }

            // Merge: existing blocks before cursor + new blocks + existing blocks after cursor
            const mergedBlocks = [
              ...filteredExisting.slice(0, insertIdx),
              ...newBlocks,
              ...filteredExisting.slice(insertIdx),
            ];

            // Pause MutationObserver during bulk render to prevent O(n^2) direction checks
            observerRef.current?.disconnect();

            // Single render pass — no per-block DOM thrashing
            await editor.render({
              time: Date.now(),
              version: existingData.version,
              blocks: mergedBlocks,
            });

            // Reconnect observer on the redactor element
            if (observerRef.current) {
              const redactor = holderEl.querySelector(".codex-editor__redactor") || holderEl;
              observerRef.current.observe(redactor, {
                childList: true,
                subtree: false,
              });
            }
            // Defer direction scan to next frame — let the browser paint first
            requestAnimationFrame(() => applyAutoDirection(holderEl));

            // Trigger onChange with merged data
            if (onChangeRef.current) {
              const savedData = await editor.save();
              onChangeRef.current(savedData);
            }
          } catch {
            // Fallback: if render approach fails, do nothing rather than freeze
          }
        };

        holderEl.addEventListener("paste", handler as unknown as EventListener, true);
        pasteHandlerRef.current = handler;
      },
      [],
    );

    // ── Auto-direction: watch for DOM changes & input ──
    const inputHandlerRef = useRef<((e: Event) => void) | null>(null);

    const setupAutoDirection = useCallback((holderEl: HTMLElement) => {
      // Apply direction to all existing blocks once on init
      applyAutoDirection(holderEl);

      // On input: batch direction check to next animation frame (non-blocking)
      let pendingBlock: HTMLElement | null = null;
      const inputHandler = (e: Event) => {
        const target = e.target as HTMLElement;
        const block = target.closest<HTMLElement>(".ce-block");
        if (!block) return;
        pendingBlock = block;
        if (dirRafRef.current === null) {
          dirRafRef.current = requestAnimationFrame(() => {
            dirRafRef.current = null;
            if (pendingBlock) {
              applyDirectionToBlock(pendingBlock);
              pendingBlock = null;
            }
          });
        }
      };
      holderEl.addEventListener("input", inputHandler);
      inputHandlerRef.current = inputHandler;

      // Watch for block additions/removals — only process NEW blocks (O(1) per mutation)
      const redactor = holderEl.querySelector(".codex-editor__redactor") || holderEl;
      observerRef.current = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement && node.classList.contains("ce-block")) {
              applyDirectionToBlock(node);
            }
          });
        }
      });
      observerRef.current.observe(redactor, {
        childList: true,
        subtree: false,
      });
    }, []);

    const initEditor = useCallback(() => {
      if (isInitializing.current || editorRef.current) return;
      isInitializing.current = true;

      const editor = new EditorJS({
        holder: holderId,
        tools: toolsRef.current ?? getDefaultTools(),
        tunes: ["textVariant"],
        data: initialDataRef.current || undefined,
        readOnly: readOnlyRef.current,
        placeholder: placeholderRef.current,
        autofocus: autofocusRef.current,
        onReady: () => {
          isInitializing.current = false;

          // Set up auto-direction and markdown paste after editor is ready
          const holderEl = document.getElementById(holderId);
          if (holderEl) {
            setupAutoDirection(holderEl);
            setupMarkdownPaste(holderEl);
          }

          onReadyRef.current?.();
        },
        onChange: () => {
          // Debounce + idle-schedule: wait for typing to pause, then save when browser is idle
          if (!onChangeRef.current) return;
          if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
          saveTimerRef.current = setTimeout(scheduleIdleSave, 500);
        },
      });

      editorRef.current = editor;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [holderId, setupAutoDirection, setupMarkdownPaste, scheduleIdleSave]);

    useEffect(() => {
      initEditor();

      return () => {
        const holderEl = document.getElementById(holderId);

        // Clean up markdown paste handler
        if (pasteHandlerRef.current && holderEl) {
          holderEl.removeEventListener(
            "paste",
            pasteHandlerRef.current as unknown as EventListener,
            true,
          );
          pasteHandlerRef.current = null;
        }

        // Clean up input direction handler
        if (inputHandlerRef.current && holderEl) {
          holderEl.removeEventListener("input", inputHandlerRef.current);
          inputHandlerRef.current = null;
        }

        observerRef.current?.disconnect();
        observerRef.current = null;

        if (dirRafRef.current) cancelAnimationFrame(dirRafRef.current);
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        if (idleCallbackRef.current != null) {
          (window.cancelIdleCallback || clearTimeout)(idleCallbackRef.current);
        }

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

    // Handle readOnly changes without recreating the editor
    useEffect(() => {
      if (editorRef.current && editorRef.current.readOnly) {
        try {
          editorRef.current.readOnly.toggle(readOnly);
        } catch {
          // Editor may not be ready yet
        }
      }
    }, [readOnly]);

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
          spellCheck={false}
          translate="no"
          className={cn(
            "torch-text-editor",
            textEditorStyles({ variant, size, disabled }),
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
