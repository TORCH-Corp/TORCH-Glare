import React from "react";
import { DatePicker, InputField } from "torch-glare";

// Canonical trigger: a read-only field showing the formatted date with a
// calendar action button. The calendar dropdown opens on click (in a portal).
export const Default = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 300 }}>
    <DatePicker mode="single" value={new Date(2026, 5, 18)} />
  </div>
);

// Custom display format on the trigger value.
export const CustomFormat = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 300 }}>
    <DatePicker
      mode="single"
      value={new Date(2026, 5, 18)}
      dateFormat="MMM dd, yyyy"
    />
  </div>
);

// Size axis on the default trigger field: S and M.
export const Sizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 300 }}>
    <DatePicker mode="single" size="S" value={new Date(2026, 5, 18)} />
    <DatePicker mode="single" size="M" value={new Date(2026, 5, 18)} />
  </div>
);

// A labelled InputField as the custom trigger element.
export const LabelledTrigger = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 300 }}>
    <DatePicker mode="single" value={new Date(2026, 5, 18)}>
      <InputField
        icon={<i className="ri-calendar-event-line" />}
        placeholder="Select a date"
      />
    </DatePicker>
  </div>
);
