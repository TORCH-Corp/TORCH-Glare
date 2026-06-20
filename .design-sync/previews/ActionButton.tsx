import React from "react";
import { ActionButton } from "torch-glare";

// Icon-only action buttons across the three sizes (XS / S / M).
export const Sizes = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
    <ActionButton size="XS" variant="BorderStyle"><i className="ri-pencil-line" /></ActionButton>
    <ActionButton size="S" variant="BorderStyle"><i className="ri-pencil-line" /></ActionButton>
    <ActionButton size="M" variant="BorderStyle"><i className="ri-pencil-line" /></ActionButton>
  </div>
);

// The style variants inherited from Button, each carrying a distinct icon.
export const Variants = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
    <ActionButton variant="PrimeStyle"><i className="ri-add-line" /></ActionButton>
    <ActionButton variant="BlueSecStyle"><i className="ri-information-line" /></ActionButton>
    <ActionButton variant="YelSecStyle"><i className="ri-star-line" /></ActionButton>
    <ActionButton variant="RedSecStyle"><i className="ri-delete-bin-line" /></ActionButton>
    <ActionButton variant="BorderStyle"><i className="ri-settings-3-line" /></ActionButton>
    <ActionButton variant="PrimeContStyle"><i className="ri-more-2-fill" /></ActionButton>
  </div>
);

// A typical table-row action toolbar.
export const RowActions = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <ActionButton size="S" variant="PrimeContStyle"><i className="ri-eye-line" /></ActionButton>
    <ActionButton size="S" variant="PrimeContStyle"><i className="ri-edit-line" /></ActionButton>
    <ActionButton size="S" variant="PrimeContStyle"><i className="ri-file-copy-line" /></ActionButton>
    <ActionButton size="S" variant="RedSecStyle"><i className="ri-delete-bin-line" /></ActionButton>
  </div>
);

// Disabled and loading states.
export const States = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
    <ActionButton variant="BorderStyle"><i className="ri-refresh-line" /></ActionButton>
    <ActionButton variant="BorderStyle" disabled><i className="ri-refresh-line" /></ActionButton>
    <ActionButton variant="PrimeStyle" is_loading><i className="ri-upload-2-line" /></ActionButton>
  </div>
);
