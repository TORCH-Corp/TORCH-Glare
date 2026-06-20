import React from "react";
import { InnerLabelField } from "torch-glare";

// Canonical: the label lives inside the field, left of a divider.
export const Basic = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 340 }}>
    <InnerLabelField label="Email" placeholder="you@acme.com" />
    <InnerLabelField label="Company" defaultValue="Acme Corporation" />
  </div>
);

// Required marker — shows the negative asterisk after the inner label.
export const Required = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 340 }}>
    <InnerLabelField label="Full name" required placeholder="Jane Cooper" />
    <InnerLabelField label="Tax ID" required defaultValue="GB-998877" />
  </div>
);

// Size axis: S and M (default).
export const Sizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 340 }}>
    <InnerLabelField size="S" label="Phone" placeholder="+1 (555) 010-0192" />
    <InnerLabelField size="M" label="Phone" placeholder="+1 (555) 010-0192" />
  </div>
);

// Error state — negative border with the field error tooltip.
export const Error = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18, width: 340 }}>
    <InnerLabelField
      label="Email"
      required
      defaultValue="jane@"
      errorMessage="Enter a valid email address"
    />
  </div>
);
