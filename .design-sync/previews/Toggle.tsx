import React from "react";
import { Toggle } from "torch-glare";

// Square icon toggles, off vs. on (pressed) shown statically via defaultPressed.
export const OnOff = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
    <Toggle aria-label="Bold"><i className="ri-bold" /></Toggle>
    <Toggle aria-label="Bold" defaultPressed><i className="ri-bold" /></Toggle>
  </div>
);

// A formatting toolbar — the canonical use, with one option pre-pressed.
export const FormattingToolbar = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <Toggle aria-label="Bold" defaultPressed><i className="ri-bold" /></Toggle>
    <Toggle aria-label="Italic"><i className="ri-italic" /></Toggle>
    <Toggle aria-label="Underline"><i className="ri-underline" /></Toggle>
    <Toggle aria-label="Strikethrough"><i className="ri-strikethrough" /></Toggle>
  </div>
);

// The style variants (shown pressed so each color reads).
export const Variants = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
    <Toggle variant="PrimeStyle" defaultPressed><i className="ri-checkbox-circle-line" /></Toggle>
    <Toggle variant="BlueSecStyle" defaultPressed><i className="ri-information-line" /></Toggle>
    <Toggle variant="YelSecStyle" defaultPressed><i className="ri-star-line" /></Toggle>
    <Toggle variant="RedSecStyle" defaultPressed><i className="ri-heart-fill" /></Toggle>
    <Toggle variant="BorderStyle" defaultPressed><i className="ri-flag-line" /></Toggle>
  </div>
);

// The size axis swept (S / M / L / XL).
export const Sizes = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
    <Toggle size="S"><i className="ri-heart-line" /></Toggle>
    <Toggle size="M"><i className="ri-heart-line" /></Toggle>
    <Toggle size="L"><i className="ri-heart-line" /></Toggle>
    <Toggle size="XL"><i className="ri-heart-line" /></Toggle>
  </div>
);

// Disabled, off and pressed.
export const Disabled = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
    <Toggle disabled><i className="ri-lock-line" /></Toggle>
    <Toggle disabled defaultPressed><i className="ri-lock-fill" /></Toggle>
  </div>
);
