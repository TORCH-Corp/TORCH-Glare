import React from "react";
import { Textarea } from "torch-glare";

// Canonical labeled textarea with placeholder and a typed value.
export const Basic = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 360 }}>
    <Textarea
      label="Description"
      placeholder="Tell us about your project…"
    />
    <Textarea
      label="Notes"
      defaultValue="Kickoff scheduled for Monday. Design review on Thursday."
    />
  </div>
);

// Label affordances: secondary hint and a required marker.
export const WithLabels = () => (
  <div style={{ width: 360 }}>
    <Textarea
      label="Feedback"
      secondaryLabel="(internal only)"
      requiredLabel="*"
      placeholder="Share your thoughts…"
    />
  </div>
);

// Negative state and disabled.
export const States = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 360 }}>
    <Textarea
      label="Summary"
      state="negative"
      defaultValue="This field has a validation error."
    />
    <Textarea
      label="Locked"
      defaultValue="This content cannot be edited."
      disabled
    />
  </div>
);
