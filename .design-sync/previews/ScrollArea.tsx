import React from "react";
import { ScrollArea } from "torch-glare";

const releases = [
  "v4.5.0 — DatePicker integration",
  "v4.4.2 — ChartBlock fixes",
  "v4.4.0 — TextEditor component",
  "v4.3.1 — Table resize handle",
  "v4.3.0 — DataTable drag reorder",
  "v4.2.0 — TreeDropDown nesting",
  "v4.1.0 — BadgeField multi-select",
  "v4.0.0 — Design token overhaul",
  "v3.9.4 — Avatar fallback tokens",
  "v3.9.0 — ScrollArea primitive",
  "v3.8.1 — Skeleton shimmer",
  "v3.8.0 — Card compound parts",
];

// Canonical: a fixed-height area with a long vertical list that overflows.
export const VerticalList = () => (
  <ScrollArea className="h-48 w-72 rounded-md border p-3">
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {releases.map((r) => (
        <div key={r} className="typography-body-small-regular">
          {r}
        </div>
      ))}
    </div>
  </ScrollArea>
);

// A long paragraph of prose constrained to a short height.
export const Prose = () => (
  <ScrollArea className="h-40 w-80 rounded-md border p-4">
    <p className="typography-body-small-regular">
      TORCH Glare is a React component library built with TypeScript, Radix UI,
      and Tailwind CSS. Each component follows a consistent variant system driven
      by class-variance-authority, exposes a forwardRef, and merges classes with
      the cn utility. Components accept a theme prop and apply semantic design
      tokens for background, content, and border across presentation and system
      contexts. Overlay components compose from Radix primitives and render their
      content through portals. This long passage exists so the scroll thumb has
      somewhere to travel within the constrained viewport, demonstrating the
      vertical scrollbar in its resting position.
    </p>
  </ScrollArea>
);
