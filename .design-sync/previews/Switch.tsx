import React from "react";
import { Switch } from "torch-glare";

// Canonical on / off states.
export const States = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
      <Switch defaultChecked /> On
    </label>
    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
      <Switch /> Off
    </label>
  </div>
);

// Disabled on / off.
export const Disabled = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
      <Switch defaultChecked disabled /> On (disabled)
    </label>
    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
      <Switch disabled /> Off (disabled)
    </label>
  </div>
);
