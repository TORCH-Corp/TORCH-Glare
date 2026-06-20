import React from "react";
import { SpinLoading } from "torch-glare";

// Canonical spinner — the light gradient ring at the small frame size.
export const Basic = () => (
  <SpinLoading size="S" />
);

// Spinner wrapping centered status content.
export const WithLabel = () => (
  <SpinLoading size="S">
    <span
      style={{
        fontSize: 14,
        fontWeight: 500,
        color: "var(--content-presentation-global-primary)",
      }}
    >
      Loading…
    </span>
  </SpinLoading>
);

// Dark-theme variant renders the alternate (purple) ring.
export const DarkTheme = () => (
  <SpinLoading size="S" theme="dark" />
);
