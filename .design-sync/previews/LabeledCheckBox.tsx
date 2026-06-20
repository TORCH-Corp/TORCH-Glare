import React from "react";
import { LabeledCheckBox } from "torch-glare";

// Canonical: checked and unchecked labeled checkboxes.
export const Basic = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <LabeledCheckBox id="terms" label="I accept the terms and conditions" defaultChecked />
    <LabeledCheckBox id="newsletter" label="Send me product updates" />
  </div>
);

// Secondary + required label affordances.
export const WithLabels = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <LabeledCheckBox
      id="2fa"
      label="Enable two-factor authentication"
      secondaryLabel="recommended"
      defaultChecked
    />
    <LabeledCheckBox
      id="consent"
      label="Share anonymized usage data"
      requiredLabel="*"
    />
  </div>
);

// Disabled states.
export const Disabled = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <LabeledCheckBox id="locked-on" label="Always-on logging" defaultChecked disabled />
    <LabeledCheckBox id="locked-off" label="Beta features" disabled />
  </div>
);

// Sizes: S, M (default), L.
export const Sizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <LabeledCheckBox id="size-s" size="S" label="Small" defaultChecked />
    <LabeledCheckBox id="size-m" size="M" label="Medium" defaultChecked />
    <LabeledCheckBox id="size-l" size="L" label="Large" defaultChecked />
  </div>
);
