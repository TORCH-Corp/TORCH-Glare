import React from "react";
import { LabelField } from "torch-glare";

// Canonical labelled input: label sits above the field.
export const Basic = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 320 }}>
    <LabelField label="Email address" placeholder="you@acme.com" />
    <LabelField label="Company name" defaultValue="Acme Corporation" />
  </div>
);

// Required + secondary label text, with a leading icon in the field.
export const WithLabels = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 320 }}>
    <LabelField
      label="Work email"
      requiredLabel="*"
      icon={<i className="ri-mail-line" />}
      placeholder="name@company.com"
    />
    <LabelField
      label="Website"
      secondaryLabel="(optional)"
      icon={<i className="ri-global-line" />}
      placeholder="https://"
    />
  </div>
);

// Size axis: S and M (default).
export const Sizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 320 }}>
    <LabelField size="S" label="Small field" placeholder="22px height" />
    <LabelField size="M" label="Medium field" placeholder="28px height" />
  </div>
);

// Error state — negative border plus the field's error tooltip.
export const Error = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 320 }}>
    <LabelField
      label="Email address"
      requiredLabel="*"
      defaultValue="not-an-email"
      errorMessage="Enter a valid email address"
    />
  </div>
);
