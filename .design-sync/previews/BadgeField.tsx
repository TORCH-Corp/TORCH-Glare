import React from "react";
import { BadgeField } from "torch-glare";

// Canonical: a labeled field already holding several removable badges.
export const Default = () => (
  <div style={{ width: 360 }}>
    <BadgeField
      label="Team labels"
      placeholder="Add a label..."
      tags={[
        { id: "1", name: "Engineering", variant: "blue", isSelected: true },
        { id: "2", name: "Design", variant: "purple", isSelected: true },
        { id: "3", name: "Marketing", variant: "green", isSelected: true },
        { id: "4", name: "Finance", variant: "yellow", isSelected: false },
        { id: "5", name: "Legal", variant: "gray", isSelected: false },
      ]}
    />
  </div>
);

// With a leading icon and required marker.
export const WithIcon = () => (
  <div style={{ width: 360 }}>
    <BadgeField
      label="Assignees"
      required
      icon={<i className="ri-team-line" />}
      placeholder="Search people..."
      tags={[
        { id: "1", name: "Elena Petrova", variant: "bluePurple", isSelected: true },
        { id: "2", name: "Marcus Reilly", variant: "cocktailGreen", isSelected: true },
        { id: "3", name: "Sofia Alvarez", variant: "rose", isSelected: false },
      ]}
    />
  </div>
);

// Error state shows the negative border treatment.
export const Error = () => (
  <div style={{ width: 360 }}>
    <BadgeField
      label="Required tags"
      errorMessage="Select at least one tag"
      placeholder="Add a tag..."
      tags={[
        { id: "1", name: "Priority", variant: "redOrange", isSelected: true },
        { id: "2", name: "Backlog", variant: "gray", isSelected: false },
      ]}
    />
  </div>
);

// Sizes: XS, S, M.
export const Sizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 360 }}>
    <BadgeField
      size="XS"
      placeholder="XS field..."
      tags={[{ id: "1", name: "Alpha", variant: "blue", isSelected: true }]}
    />
    <BadgeField
      size="S"
      placeholder="S field..."
      tags={[{ id: "1", name: "Beta", variant: "green", isSelected: true }]}
    />
    <BadgeField
      size="M"
      placeholder="M field..."
      tags={[{ id: "1", name: "Stable", variant: "purple", isSelected: true }]}
    />
  </div>
);
