import React from "react";
import { Checkbox } from "torch-glare";

// Unchecked, checked, and disabled states (M is the default size).
export const States = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Checkbox /> <span style={{ fontSize: 13 }}>Unchecked</span>
    </label>
    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Checkbox defaultChecked /> <span style={{ fontSize: 13 }}>Checked</span>
    </label>
    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Checkbox disabled /> <span style={{ fontSize: 13 }}>Disabled</span>
    </label>
    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Checkbox defaultChecked disabled /> <span style={{ fontSize: 13 }}>Checked + disabled</span>
    </label>
  </div>
);

// Two sizes: S (14px) and M (16px, default).
export const Sizes = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <Checkbox size="S" defaultChecked />
    <Checkbox size="M" defaultChecked />
  </div>
);
