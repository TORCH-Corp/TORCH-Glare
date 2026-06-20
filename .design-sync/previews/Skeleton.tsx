import React from "react";
import { Skeleton } from "torch-glare";

// Skeletons use a light-gray token; explicit inline sizes keep each shape from
// collapsing inside flex rows, and a subtle surface gives the gray contrast.
const Surface = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: "#f6f7f8",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: 16,
    }}
  >
    {children}
  </div>
);

// Canonical: stacked text lines (last line shorter, as in real loading states).
export const TextLines = () => (
  <Surface>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 260 }}>
      <Skeleton style={{ height: 16, width: "100%" }} />
      <Skeleton style={{ height: 16, width: "100%" }} />
      <Skeleton style={{ height: 16, width: "75%" }} />
    </div>
  </Surface>
);

// Shapes: circle (avatar), block (image), line (text).
export const Shapes = () => (
  <Surface>
    <div style={{ display: "flex", alignItems: "center", gap: 16, height: 56 }}>
      <Skeleton
        className="rounded-full"
        style={{ height: 48, width: 48, flex: "0 0 auto" }}
      />
      <Skeleton style={{ height: 48, width: 96, flex: "0 0 auto" }} />
      <Skeleton style={{ height: 16, width: 128, flex: "0 0 auto" }} />
    </div>
  </Surface>
);

// A realistic loading card: avatar + two text lines.
export const CardPlaceholder = () => (
  <Surface>
    <div style={{ display: "flex", alignItems: "center", gap: 12, width: 280 }}>
      <Skeleton
        className="rounded-full"
        style={{ height: 48, width: 48, flex: "0 0 auto" }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <Skeleton style={{ height: 16, width: "75%" }} />
        <Skeleton style={{ height: 12, width: "50%" }} />
      </div>
    </div>
  </Surface>
);

// Media block placeholder (e.g. an image tile loading).
export const MediaBlock = () => (
  <Surface>
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 220 }}>
      <Skeleton className="rounded-lg" style={{ height: 128, width: "100%" }} />
      <Skeleton style={{ height: 16, width: "66%" }} />
      <Skeleton style={{ height: 12, width: "33%" }} />
    </div>
  </Surface>
);
