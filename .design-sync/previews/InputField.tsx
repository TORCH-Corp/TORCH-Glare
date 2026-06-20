import React from "react";
import { InputField } from "torch-glare";

// Basic text field with placeholder.
export const Basic = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
    <InputField placeholder="Enter your name" />
    <InputField defaultValue="Jane Cooper" />
  </div>
);

// With a leading Remix icon.
export const WithIcon = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
    <InputField icon={<i className="ri-mail-line" />} placeholder="you@example.com" />
    <InputField icon={<i className="ri-search-line" />} placeholder="Search…" />
  </div>
);

// Sizes: S and M (default).
export const Sizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
    <InputField size="S" placeholder="Small" />
    <InputField size="M" placeholder="Medium" />
  </div>
);

// Error state — surfaces a tooltip and negative border.
export const Error = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
    <InputField defaultValue="not-an-email" errorMessage="Enter a valid email address" />
  </div>
);
