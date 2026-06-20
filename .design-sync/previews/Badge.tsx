import React from "react";
import { Badge } from "torch-glare";

// The full color palette. Each badge shows a leading status dot by default.
export const Colors = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
    <Badge variant="green" label="Active" />
    <Badge variant="greenLight" label="Online" />
    <Badge variant="cocktailGreen" label="Paid" />
    <Badge variant="yellow" label="Pending" />
    <Badge variant="redOrange" label="Warning" />
    <Badge variant="redLight" label="Failed" />
    <Badge variant="rose" label="Overdue" />
    <Badge variant="purple" label="Draft" />
    <Badge variant="bluePurple" label="Beta" />
    <Badge variant="blue" label="Info" />
    <Badge variant="navy" label="Archived" />
    <Badge variant="gray" label="Inactive" />
  </div>
);

// Sizes: XS, S (default), M.
export const Sizes = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
    <Badge size="XS" variant="blue" label="Extra small" />
    <Badge size="S" variant="blue" label="Small" />
    <Badge size="M" variant="blue" label="Medium" />
  </div>
);

// Selected badges render a remove (×) affordance — used in multi-select / tag fields.
export const Selectable = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
    <Badge variant="purple" label="Design" isSelected onUnselect={() => {}} />
    <Badge variant="blue" label="Engineering" isSelected onUnselect={() => {}} />
    <Badge variant="green" label="Marketing" isSelected onUnselect={() => {}} />
  </div>
);

// The compact "highlight" variant (no status dot) for inline counts/labels.
export const Highlight = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
    <Badge variant="highlight" label="New" />
    <Badge variant="highlight" label="12" />
    <Badge variant="highlight" label="v4.5.0" />
  </div>
);
