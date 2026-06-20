import React from "react";
import { ThemeProvider, Button, InputField } from "torch-glare";

// ThemeProvider has no visual output of its own — it supplies the theme
// context. Here it wraps real components to show they render inside it.
export const Basic = () => (
  <ThemeProvider>
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 260 }}>
      <InputField placeholder="Search team members" />
      <div style={{ display: "flex", gap: 8 }}>
        <Button variant="PrimeStyle">Save</Button>
        <Button variant="BorderStyle">Cancel</Button>
      </div>
    </div>
  </ThemeProvider>
);
