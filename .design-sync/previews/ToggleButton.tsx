import React from "react";
import { ToggleButton } from "torch-glare";

// Text toggle buttons, off vs. on (pressed) shown statically via defaultPressed.
export const OnOff = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
    <ToggleButton variant="PrimeStyle">Notifications</ToggleButton>
    <ToggleButton variant="PrimeStyle" defaultPressed>Notifications</ToggleButton>
  </div>
);

// The style variants (off state).
export const Variants = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
    <ToggleButton variant="PrimeStyle">Prime</ToggleButton>
    <ToggleButton variant="BlueSecStyle">Blue</ToggleButton>
    <ToggleButton variant="BorderStyle">Border</ToggleButton>
    <ToggleButton variant="PrimeContStyle">Ghost</ToggleButton>
  </div>
);

// The size axis swept (S / M / L / XL), each shown pressed.
export const Sizes = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
    <ToggleButton size="S" defaultPressed>Small</ToggleButton>
    <ToggleButton size="M" defaultPressed>Medium</ToggleButton>
    <ToggleButton size="L" defaultPressed>Large</ToggleButton>
    <ToggleButton size="XL" defaultPressed>Extra Large</ToggleButton>
  </div>
);

// Icon-only toggles (buttonType="icon"), mixing off and pressed.
export const IconOnly = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
    <ToggleButton buttonType="icon" variant="BorderStyle"><i className="ri-star-line" /></ToggleButton>
    <ToggleButton buttonType="icon" variant="BorderStyle" defaultPressed><i className="ri-star-fill" /></ToggleButton>
    <ToggleButton buttonType="icon" variant="PrimeStyle" defaultPressed><i className="ri-pushpin-fill" /></ToggleButton>
  </div>
);

// Disabled, off and pressed.
export const Disabled = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
    <ToggleButton disabled>Disabled</ToggleButton>
    <ToggleButton disabled defaultPressed>Disabled On</ToggleButton>
  </div>
);
