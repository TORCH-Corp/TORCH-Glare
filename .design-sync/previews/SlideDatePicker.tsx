import React from "react";
import { SlideDatePicker, InputField } from "torch-glare";

// Canonical trigger: a read-only field showing the formatted date with a
// calendar action button. The wheel picker opens on click (in a portal).
// theme="default" matches the light card so the trigger text renders crisply
// (the component defaults to theme="dark", which washes out on a light surface).
export const Default = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 300 }}>
    <SlideDatePicker theme="default" value={new Date(2026, 5, 18)} />
  </div>
);

// Custom display format on the trigger value.
export const CustomFormat = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 300 }}>
    <SlideDatePicker
      theme="default"
      value={new Date(1994, 2, 7)}
      dateFormat="MMMM dd, yyyy"
    />
  </div>
);

// A labelled InputField as the custom trigger element.
export const LabelledTrigger = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 300 }}>
    <SlideDatePicker theme="default" value={new Date(2026, 5, 18)}>
      <InputField
        icon={<i className="ri-calendar-2-line" />}
        placeholder="Select a date"
      />
    </SlideDatePicker>
  </div>
);
