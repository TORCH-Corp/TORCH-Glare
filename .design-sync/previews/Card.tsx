import React from "react";
import { Card, CardHeader, CardContent, CardDescription } from "torch-glare";

// Canonical: a header + description + body composition.
export const Default = () => (
  <Card style={{ width: 320 }}>
    <CardHeader>Monthly subscription</CardHeader>
    <CardDescription>Billed on the 1st of each month</CardDescription>
    <CardContent>
      <span>Your Pro plan renews on July 1, 2026.</span>
      <span>Next charge: $49.00</span>
    </CardContent>
  </Card>
);

// A stat / summary card with an icon header.
export const Summary = () => (
  <Card style={{ width: 280 }}>
    <CardHeader>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <i className="ri-line-chart-line" /> Revenue
      </span>
    </CardHeader>
    <CardContent>
      <span className="typography-headers-large-bold">$128,540</span>
      <span style={{ color: "var(--content-presentation-state-success)" }}>
        +12.4% vs last month
      </span>
    </CardContent>
  </Card>
);

// A profile card combining header, description and content rows.
export const Profile = () => (
  <Card style={{ width: 300 }}>
    <CardHeader>Elena Petrova</CardHeader>
    <CardDescription>Product Designer</CardDescription>
    <CardContent>
      <span>elena.petrova@torchcorp.com</span>
      <span>San Francisco, CA</span>
      <span>Joined March 2024</span>
    </CardContent>
  </Card>
);
