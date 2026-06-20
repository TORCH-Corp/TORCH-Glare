import React from "react";
import { SimpleSelectValue, SimpleSelectItem, SimpleSelectDropDown } from "torch-glare";

// SimpleSelect is a System-styled (dark surface) control. Wrap cells in a
// dark panel so its system tokens render against the canvas they target.
const DarkPanel: React.FC<{ children?: React.ReactNode; h?: number }> = ({ children, h = 0 }) => (
  <div
    data-theme="dark"
    style={{
      background: "var(--background-system-body-secondary, #1b1c1e)",
      padding: 24,
      borderRadius: 8,
      minHeight: h,
    }}
  >
    {children}
  </div>
);

// The open dropdown panel composed directly with selectable items.
export const OpenList = () => (
  <DarkPanel h={180}>
    <SimpleSelectValue defaultOpen defaultValue="Weekly" value="Weekly" readOnly>
      <SimpleSelectItem>Daily</SimpleSelectItem>
      <SimpleSelectItem selected>Weekly</SimpleSelectItem>
      <SimpleSelectItem>Monthly</SimpleSelectItem>
      <SimpleSelectItem>Quarterly</SimpleSelectItem>
    </SimpleSelectValue>
  </DarkPanel>
);

// The closed control showing its current value and chevron.
export const Closed = () => (
  <DarkPanel>
    <SimpleSelectValue value="Weekly" readOnly>
      <SimpleSelectItem>Daily</SimpleSelectItem>
      <SimpleSelectItem selected>Weekly</SimpleSelectItem>
      <SimpleSelectItem>Monthly</SimpleSelectItem>
    </SimpleSelectValue>
  </DarkPanel>
);

// The dropdown surface in isolation with a selected row highlighted.
export const Panel = () => (
  <DarkPanel h={160}>
    <div style={{ position: "relative" }}>
      <SimpleSelectDropDown className="!static !min-w-[160px]">
        <ul>
          <SimpleSelectItem>Open</SimpleSelectItem>
          <SimpleSelectItem selected>In progress</SimpleSelectItem>
          <SimpleSelectItem>In review</SimpleSelectItem>
          <SimpleSelectItem>Done</SimpleSelectItem>
        </ul>
      </SimpleSelectDropDown>
    </div>
  </DarkPanel>
);
