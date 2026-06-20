import React from "react";
import { TextEditor } from "torch-glare";

// Pre-filled content so the mounted EditorJS instance has visible blocks.
const sampleData = {
  time: Date.now(),
  blocks: [
    { type: "header", data: { text: "Release notes", level: 2 } },
    {
      type: "paragraph",
      data: {
        text: "The Q3 update ships a refreshed dashboard, faster search, and dark-mode polish across the workspace.",
      },
    },
    {
      type: "list",
      data: {
        style: "unordered",
        items: ["Redesigned analytics", "Inline commenting", "Keyboard shortcuts"],
      },
    },
  ],
  version: "2.30.0",
};

// Canonical editor with seeded content at the small size.
export const Basic = () => (
  <div style={{ width: 560 }}>
    <TextEditor size="S" data={sampleData as any} />
  </div>
);

// Read-only mode — renders content without the editing affordances.
export const ReadOnly = () => (
  <div style={{ width: 560 }}>
    <TextEditor size="S" readOnly data={sampleData as any} />
  </div>
);

// Empty editor showing the placeholder prompt.
export const Empty = () => (
  <div style={{ width: 560 }}>
    <TextEditor size="S" placeholder="Write something or press / to select a tool" />
  </div>
);
