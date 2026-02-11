"use client";

import React, { useRef, useState } from "react";
import { TextEditor, TextEditorRef, OutputData } from "@/components/TextEditor";

const MIXED_SAMPLE_DATA: OutputData = {
  time: Date.now(),
  blocks: [
    {
      type: "header",
      data: { text: "TORCH Glare Text Editor", level: 1 },
    },
    {
      type: "paragraph",
      data: {
        text: "This editor automatically detects the direction of each block. Try typing Arabic in one block and English in another!",
      },
    },
    {
      type: "header",
      data: { text: "محرر نصوص تورش جلير", level: 2 },
    },
    {
      type: "paragraph",
      data: {
        text: "هذا المحرر يكشف تلقائياً اتجاه كل سطر. جرّب الكتابة بالعربية والإنجليزية في نفس المحرر!",
      },
    },
    {
      type: "list",
      data: {
        style: "unordered",
        items: [
          { content: "كشف تلقائي لاتجاه النص", items: [] },
          { content: "دعم العربية والإنجليزية معاً", items: [] },
          { content: "يعمل مع جميع أنواع الكتل", items: [] },
        ],
      },
    },
    {
      type: "delimiter",
      data: {},
    },
    {
      type: "list",
      data: {
        style: "unordered",
        items: [
          { content: "Auto-direction detection per block", items: [] },
          { content: "Arabic and English in the same editor", items: [] },
          { content: "Works with all block types", items: [] },
        ],
      },
    },
    {
      type: "quote",
      data: {
        text: "أفضل طريقة للتنبؤ بالمستقبل هي صناعته.",
        caption: "بيتر دراكر",
        alignment: "left",
      },
    },
    {
      type: "quote",
      data: {
        text: "The best way to predict the future is to create it.",
        caption: "Peter Drucker",
        alignment: "left",
      },
    },
    {
      type: "warning",
      data: {
        title: "ملاحظة",
        message: "كل كتلة تكتشف اتجاه النص تلقائياً بناءً على أول حرف.",
      },
    },
  ],
  version: "2.31.1",
};

const SAMPLE_DATA: OutputData = {
  time: Date.now(),
  blocks: [
    {
      type: "header",
      data: { text: "Features Overview", level: 1 },
    },
    {
      type: "paragraph",
      data: {
        text: "A fully featured block-style text editor built on <b>Editor.js</b>. Supports headers, lists, quotes, code blocks, tables, images, embeds, and more.",
      },
    },
    {
      type: "list",
      data: {
        style: "unordered",
        items: [
          { content: "Block-style editing with clean JSON output", items: [] },
          { content: "16+ block types and inline tools", items: [] },
          { content: "TORCH design system integration", items: [] },
          { content: "Keyboard shortcuts for all tools", items: [] },
        ],
      },
    },
    {
      type: "delimiter",
      data: {},
    },
    {
      type: "quote",
      data: {
        text: "The best way to predict the future is to create it.",
        caption: "Peter Drucker",
        alignment: "left",
      },
    },
    {
      type: "warning",
      data: {
        title: "Note",
        message:
          "This editor outputs clean JSON data that can be rendered anywhere.",
      },
    },
  ],
  version: "2.31.1",
};

export default function TextEditorExample() {
  const editorRef = useRef<TextEditorRef>(null);
  const [savedData, setSavedData] = useState<OutputData | null>(null);

  const handleSave = async () => {
    if (editorRef.current) {
      const data = await editorRef.current.save();
      setSavedData(data);
    }
  };

  const handleClear = () => {
    editorRef.current?.clear();
    setSavedData(null);
  };

  return (
    <div className="p-8 space-y-12 bg-background-presentation-body-primary min-h-screen">
      <h1 className="typography-display-medium-bold text-content-presentation-global-primary">
        TextEditor Component
      </h1>

      {/* ── Auto-Direction: Mixed Arabic & English ── */}
      <section className="space-y-4">
        <h2 className="typography-headers-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
          Auto-Direction (Mixed Arabic & English)
        </h2>
        <p className="typography-body-medium-regular text-content-presentation-global-secondary">
          Each block automatically detects its text direction based on the first
          character. Arabic text becomes RTL, English text stays LTR — all in
          the same editor.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="h-[28px] px-[14px] typography-body-small-medium rounded-[4px] bg-background-presentation-action-primary text-content-presentation-action-primary-contrast hover:bg-background-presentation-action-hover transition-all"
          >
            Save Content
          </button>
          <button
            onClick={handleClear}
            className="h-[28px] px-[14px] typography-body-small-medium rounded-[4px] border border-border-presentation-action-primary text-content-presentation-action-light-primary hover:bg-background-presentation-action-hover transition-all"
          >
            Clear
          </button>
        </div>

        <TextEditor
          ref={editorRef}
          data={MIXED_SAMPLE_DATA}
          size="L"
          placeholder="Start writing in any language..."
          onChange={(data) => console.log("Content changed:", data)}
          onReady={() => console.log("Editor ready!")}
        />

        {savedData && (
          <div className="mt-4 p-4 rounded-[6px] bg-background-presentation-action-secondary border border-border-presentation-action-primary">
            <h3 className="typography-body-medium-medium text-content-presentation-global-primary mb-2">
              Saved JSON Output:
            </h3>
            <pre className="typography-body-small-regular text-content-presentation-global-secondary overflow-auto max-h-[300px] whitespace-pre-wrap">
              {JSON.stringify(savedData, null, 2)}
            </pre>
          </div>
        )}
      </section>

      {/* ── Sizes ── */}
      <section className="space-y-4">
        <h2 className="typography-headers-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
          Sizes
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="typography-body-small-medium text-content-presentation-global-secondary">
              Size S (200px)
            </span>
            <TextEditor size="S" placeholder="Small editor..." />
          </div>
          <div className="space-y-2">
            <span className="typography-body-small-medium text-content-presentation-global-secondary">
              Size M (300px)
            </span>
            <TextEditor size="M" placeholder="Medium editor..." />
          </div>
          <div className="space-y-2">
            <span className="typography-body-small-medium text-content-presentation-global-secondary">
              Size L (400px)
            </span>
            <TextEditor size="L" placeholder="Large editor..." />
          </div>
          <div className="space-y-2">
            <span className="typography-body-small-medium text-content-presentation-global-secondary">
              Size XL (500px)
            </span>
            <TextEditor size="XL" placeholder="Extra large editor..." />
          </div>
        </div>
      </section>

      {/* ── Read Only ── */}
      <section className="space-y-4">
        <h2 className="typography-headers-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
          Read Only
        </h2>
        <TextEditor data={SAMPLE_DATA} size="M" readOnly />
      </section>

      {/* ── Disabled ── */}
      <section className="space-y-4">
        <h2 className="typography-headers-large-medium text-content-presentation-global-primary border-b border-border-presentation-action-disabled pb-2">
          Disabled
        </h2>
        <TextEditor size="S" disabled placeholder="Disabled editor..." />
      </section>
    </div>
  );
}
