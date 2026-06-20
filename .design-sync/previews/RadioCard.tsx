import React from "react";
import { RadioGroup, RadioCard } from "torch-glare";

// Canonical: a group of selectable cards with one selected.
export const Group = () => (
  <RadioGroup defaultValue="pro" style={{ display: "flex", gap: 12 }}>
    <RadioCard
      id="plan-starter"
      value="starter"
      headerLabel="Starter"
      description="For individuals getting started."
    />
    <RadioCard
      id="plan-pro"
      value="pro"
      headerLabel="Pro"
      description="For growing teams that need more."
    />
  </RadioGroup>
);

// Card with extra body content.
export const WithContent = () => (
  <RadioGroup defaultValue="annual" style={{ display: "flex", gap: 12 }}>
    <RadioCard
      id="bill-annual"
      value="annual"
      headerLabel="Annual"
      description="Billed yearly"
    >
      <span style={{ fontSize: 13, opacity: 0.7 }}>$120 / year — save 20%</span>
    </RadioCard>
    <RadioCard
      id="bill-monthly"
      value="monthly"
      headerLabel="Monthly"
      description="Billed monthly"
    >
      <span style={{ fontSize: 13, opacity: 0.7 }}>$12 / month</span>
    </RadioCard>
  </RadioGroup>
);

// Disabled card alongside an enabled selected one.
export const Disabled = () => (
  <RadioGroup defaultValue="cloud" style={{ display: "flex", gap: 12 }}>
    <RadioCard
      id="host-cloud"
      value="cloud"
      headerLabel="Cloud"
      description="Managed hosting."
    />
    <RadioCard
      id="host-onprem"
      value="onprem"
      headerLabel="On-premise"
      description="Coming soon."
      disabled
    />
  </RadioGroup>
);
