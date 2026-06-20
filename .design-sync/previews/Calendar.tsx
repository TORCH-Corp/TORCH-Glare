import React from "react";
import { Calendar } from "torch-glare";

// Dates align with the capture harness's fixed clock (May 2024) so the
// displayed month and any selection render in view.
const MAY_2024 = new Date(2024, 4, 1);

// Canonical single-month calendar with dropdown month/year navigation.
export const Default = () => (
  <Calendar mode="single" month={MAY_2024} />
);

// A selected day is highlighted.
export const Selected = () => (
  <Calendar
    mode="single"
    month={MAY_2024}
    selected={new Date(2024, 4, 16)}
  />
);

// Range selection — start, middle and end days share the range highlight.
export const Range = () => (
  <Calendar
    mode="range"
    month={MAY_2024}
    selected={{ from: new Date(2024, 4, 13), to: new Date(2024, 4, 20) }}
  />
);

// Week numbers shown in the leading column.
export const WithWeekNumbers = () => (
  <Calendar
    mode="single"
    showWeekNumber
    month={MAY_2024}
    selected={new Date(2024, 4, 9)}
  />
);
