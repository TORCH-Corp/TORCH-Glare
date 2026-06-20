import React from "react";
import { Label, InputField } from "torch-glare";

// Canonical form label: main text with a secondary hint beside it.
export const Basic = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
    <Label label="Email address" secondaryLabel="(work)" />
    <Label label="Company name" />
  </div>
);

// Required marker — the asterisk renders in the negative/error color.
export const Required = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
    <Label label="Full name" requiredLabel="*" />
    <Label label="Phone number" secondaryLabel="optional" />
  </div>
);

// Size axis: S, M (default), L — validates the body typography tokens.
export const Sizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
    <Label size="S" label="Small label" secondaryLabel="22px row" />
    <Label size="M" label="Medium label" secondaryLabel="28px row" />
    <Label size="L" label="Large label" secondaryLabel="34px row" />
  </div>
);

// Wrapping a field: Label composes its child below the label text.
export const WithField = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
    <Label label="Billing email" requiredLabel="*">
      <InputField placeholder="billing@acme.com" />
    </Label>
  </div>
);
