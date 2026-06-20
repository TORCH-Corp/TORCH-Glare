import React from "react";
import { RadioGroup, Radio } from "torch-glare";

// Canonical group with one option selected (default S size).
export const Group = () => (
  <RadioGroup defaultValue="standard">
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
      <Radio value="standard" /> Standard shipping
    </label>
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
      <Radio value="express" /> Express shipping
    </label>
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
      <Radio value="pickup" /> In-store pickup
    </label>
  </RadioGroup>
);

// Sizes: S (12px, default) and M (24px) shown checked.
export const Sizes = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
    <RadioGroup defaultValue="a">
      <Radio value="a" size="S" />
    </RadioGroup>
    <RadioGroup defaultValue="b">
      <Radio value="b" size="M" />
    </RadioGroup>
  </div>
);

// Disabled options, one checked.
export const Disabled = () => (
  <RadioGroup defaultValue="yearly">
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
      <Radio value="yearly" disabled /> Yearly (selected, disabled)
    </label>
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
      <Radio value="monthly" disabled /> Monthly (disabled)
    </label>
  </RadioGroup>
);
