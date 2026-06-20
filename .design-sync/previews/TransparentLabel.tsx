import React from "react";
import { TransparentLabel } from "torch-glare";

// Canonical: a single-line label that fades out on the right when it overflows.
export const Basic = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 240 }}>
    <TransparentLabel>Quarterly revenue report — Q3 2026 fiscal summary</TransparentLabel>
    <TransparentLabel>Marketing campaign performance overview</TransparentLabel>
  </div>
);

// Typography scale — display vs header vs body vs label tokens.
export const Scale = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
    <TransparentLabel size="display-small-semibold">Dashboard overview heading</TransparentLabel>
    <TransparentLabel size="headers-medium-semibold">Active subscriptions this month</TransparentLabel>
    <TransparentLabel size="body-medium-regular">Recent activity from your team members</TransparentLabel>
    <TransparentLabel size="labels-small-medium">Updated 3 minutes ago by system</TransparentLabel>
  </div>
);

// Weight variants on the same body size.
export const Weights = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 260 }}>
    <TransparentLabel size="body-large-bold">Bold customer name overflow</TransparentLabel>
    <TransparentLabel size="body-large-medium">Medium customer name overflow</TransparentLabel>
    <TransparentLabel size="body-large-regular">Regular customer name overflow</TransparentLabel>
  </div>
);
