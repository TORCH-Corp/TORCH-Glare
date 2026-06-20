import React from "react";
import { LinkButton } from "torch-glare";

// The two sizes: S (default) and M. Renders as an anchor when href is set.
export const Sizes = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
    <LinkButton size="S" href="/dashboard">Go to Dashboard</LinkButton>
    <LinkButton size="M" href="/dashboard">Go to Dashboard</LinkButton>
  </div>
);

// Inline navigation links — the canonical use in CTAs and cards.
export const Navigation = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
    <LinkButton size="S" href="/features">Explore features</LinkButton>
    <LinkButton size="S" href="/pricing">View pricing</LinkButton>
    <LinkButton size="S" href="/docs">Read the docs</LinkButton>
  </div>
);

// External link with target/rel passthrough.
export const External = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <LinkButton size="M" href="https://github.com/torchcorp" target="_blank" rel="noopener noreferrer">
      View on GitHub
    </LinkButton>
  </div>
);
