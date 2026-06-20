import React from "react";
import { SearchField } from "torch-glare";

// SearchField is a SystemStyle (dark) overlay search. It renders white-on-dark
// glass, so a dark backdrop is used so the embedded text is legible.
const DarkStage = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: "#1b1d22",
      padding: 24,
      borderRadius: 12,
      width: 520,
    }}
  >
    {children}
  </div>
);

// Canonical: empty value shows the search icon + placeholder copy.
export const Basic = () => (
  <DarkStage>
    <SearchField
      value=""
      Searchplaceholder="Search"
      secondaryPlaceholder="commands, files, people"
    />
  </DarkStage>
);

// With a typed query — the placeholder copy collapses, the icon remains.
export const WithValue = () => (
  <DarkStage>
    <SearchField
      value="Quarterly report"
      Searchplaceholder="Search"
      secondaryPlaceholder="commands, files, people"
    />
  </DarkStage>
);
