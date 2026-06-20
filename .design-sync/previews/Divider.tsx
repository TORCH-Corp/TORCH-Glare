import React from "react";
import { Divider } from "torch-glare";

// Horizontal separator (default) between stacked content.
export const Horizontal = () => (
  <div style={{ width: 360 }}>
    <div style={{ paddingBottom: 8 }}>Account settings</div>
    <Divider />
    <div style={{ paddingTop: 8 }}>Notification preferences</div>
  </div>
);

// Vertical separator between inline items (needs an explicit height).
export const Vertical = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, height: 24 }}>
    <span>Edit</span>
    <Divider orientation="vertical" />
    <span>Duplicate</span>
    <Divider orientation="vertical" />
    <span>Delete</span>
  </div>
);

// In context: a divider separating a card header from its body.
export const InCard = () => (
  <div style={{ width: 320, border: "1px solid var(--border-presentation-global-primary, #ddd)", borderRadius: 8, overflow: "hidden" }}>
    <div style={{ padding: "10px 14px", fontWeight: 600 }}>Billing</div>
    <Divider />
    <div style={{ padding: "10px 14px" }}>Your plan renews on July 1, 2026.</div>
  </div>
);
