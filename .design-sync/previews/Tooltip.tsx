import React from "react";
import { Tooltip, Button } from "torch-glare";

// Canonical: a tooltip shown OPEN beside its trigger button.
export const Open = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "48px 24px" }}>
    <Tooltip open text="Save changes to this document">
      <Button buttonType="icon" variant="BorderStyle"><i className="ri-save-line" /></Button>
    </Tooltip>
  </div>
);

// The two style variants — neutral (primary) and the gradient highlight.
export const Variants = () => (
  <div style={{ display: "flex", gap: 80, justifyContent: "center", padding: "48px 24px" }}>
    <Tooltip open variant="primary" text="Default tooltip">
      <Button variant="BorderStyle">Primary</Button>
    </Tooltip>
    <Tooltip open variant="highlight" text="New feature available">
      <Button variant="BorderStyle">Highlight</Button>
    </Tooltip>
  </div>
);

// Placement on each side of the trigger.
export const Sides = () => (
  <div style={{ display: "flex", gap: 90, justifyContent: "center", padding: "56px 32px" }}>
    <Tooltip open toolTipSide="top" text="Top">
      <Button buttonType="icon" variant="BorderStyle"><i className="ri-arrow-up-line" /></Button>
    </Tooltip>
    <Tooltip open toolTipSide="bottom" text="Bottom">
      <Button buttonType="icon" variant="BorderStyle"><i className="ri-arrow-down-line" /></Button>
    </Tooltip>
    <Tooltip open toolTipSide="left" text="Left">
      <Button buttonType="icon" variant="BorderStyle"><i className="ri-arrow-left-line" /></Button>
    </Tooltip>
    <Tooltip open toolTipSide="right" text="Right">
      <Button buttonType="icon" variant="BorderStyle"><i className="ri-arrow-right-line" /></Button>
    </Tooltip>
  </div>
);
