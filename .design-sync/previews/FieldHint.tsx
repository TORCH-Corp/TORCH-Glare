import React from "react";
import { FieldHint } from "torch-glare";

// Canonical helper text shown under a field (info is the default state).
export const Basic = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 360 }}>
    <FieldHint label="Password must be at least 8 characters long." />
  </div>
);

// Full state axis: info, success, warning, error — each with its own icon + color.
export const States = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 360 }}>
    <FieldHint state="info" label="We'll only use this email for account notices." />
    <FieldHint state="success" label="Your changes have been saved successfully." />
    <FieldHint state="warning" label="This action can take a few minutes to complete." />
    <FieldHint state="error" label="That email address is already registered." />
  </div>
);

// Custom leading icon overrides the default state icon.
export const CustomIcon = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 360 }}>
    <FieldHint
      state="info"
      icon={<i className="ri-lightbulb-flash-line" />}
      label="Tip: use a passphrase you can remember."
    />
  </div>
);
