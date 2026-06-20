import React from "react";

// Preview frame for design-sync cards. TORCH Glare's `default` theme is the
// LIGHT theme (token `--*-default-*` = dark-text-on-light, e.g. action-secondary
// = #00000026, text = #000); the `:root` (no data-theme) fallback aliases to the
// DARK variant, and a bare component on the white card page therefore renders
// dark-on-translucent-dark and washes out. Wrapping every cell in
// `data-theme="default"` forces the light token set, and a light presentation
// surface gives those tokens the canvas they're designed for — matching the
// product's own white card UI. Wired via cfg.provider + cfg.extraEntries.
export const DSPreviewFrame = ({ children }: { children?: React.ReactNode }) => (
  <div
    data-theme="default"
    style={{
      background: "var(--background-presentation-default-body-primary, #f0f0f0)",
      color: "var(--content-presentation-default-global-primary, #000)",
      padding: "20px",
      borderRadius: "8px",
      minHeight: "44px",
    }}
  >
    {children}
  </div>
);
