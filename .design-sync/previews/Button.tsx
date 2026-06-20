import React from "react";
import { Button } from "torch-glare";

// Primary, sized small→XL. PrimeStyle is the default variant.
export const Sizes = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
    <Button size="S">Small</Button>
    <Button size="M">Medium</Button>
    <Button size="L">Large</Button>
    <Button size="XL">Extra Large</Button>
  </div>
);

// The eight style variants of the design system.
export const Variants = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
    <Button variant="PrimeStyle">Prime</Button>
    <Button variant="BlueSecStyle">Blue</Button>
    <Button variant="YelSecStyle">Yellow</Button>
    <Button variant="RedSecStyle">Red</Button>
    <Button variant="BorderStyle">Border</Button>
    <Button variant="PrimeContStyle">Ghost</Button>
    <Button variant="BlueContStyle">Blue Ghost</Button>
    <Button variant="RedContStyle">Red Ghost</Button>
  </div>
);

// With a leading Remix icon.
export const WithIcon = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
    <Button variant="PrimeStyle"><i className="ri-add-line" />Create</Button>
    <Button variant="BorderStyle"><i className="ri-download-2-line" />Download</Button>
    <Button variant="RedSecStyle"><i className="ri-delete-bin-line" />Delete</Button>
  </div>
);

// Icon-only buttons (buttonType="icon").
export const IconOnly = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
    <Button buttonType="icon" size="S" variant="BorderStyle"><i className="ri-settings-3-line" /></Button>
    <Button buttonType="icon" size="M" variant="BorderStyle"><i className="ri-edit-line" /></Button>
    <Button buttonType="icon" size="L" variant="PrimeStyle"><i className="ri-check-line" /></Button>
  </div>
);

// Disabled and loading states.
export const States = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
    <Button>Default</Button>
    <Button disabled>Disabled</Button>
    <Button is_loading>Loading</Button>
  </div>
);
