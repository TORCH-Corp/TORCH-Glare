import React from "react";
import { CountBadge } from "torch-glare";

// Canonical: a small numeric counter badge.
export const Default = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <CountBadge label={1} />
    <CountBadge label={3} />
    <CountBadge label={9} />
  </div>
);

// Larger counts still fit the fixed circular pill.
export const Counts = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <CountBadge label={12} />
    <CountBadge label={48} />
    <CountBadge label={99} />
  </div>
);

// Real usage: anchored to a notification/icon target.
export const OnIcon = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
    <div style={{ position: "relative", width: 24, height: 24 }}>
      <i className="ri-notification-3-line" style={{ fontSize: 24 }} />
      <div style={{ position: "absolute", top: -4, right: -6 }}>
        <CountBadge label={5} />
      </div>
    </div>
    <div style={{ position: "relative", width: 24, height: 24 }}>
      <i className="ri-mail-line" style={{ fontSize: 24 }} />
      <div style={{ position: "absolute", top: -4, right: -6 }}>
        <CountBadge label={23} />
      </div>
    </div>
  </div>
);
