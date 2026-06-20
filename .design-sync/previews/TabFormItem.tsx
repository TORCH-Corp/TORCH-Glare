import React from "react";
import { TabFormItem } from "torch-glare";

// Top tab bar — one selected (active) tab among siblings.
export const TopBar = () => (
  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
    <TabFormItem componentType="top">Overview</TabFormItem>
    <TabFormItem componentType="top" active>
      Activity
    </TabFormItem>
    <TabFormItem componentType="top">Members</TabFormItem>
    <TabFormItem componentType="top">Settings</TabFormItem>
  </div>
);

// Sidebar tabs — full-width, left-aligned, one active.
export const Sidebar = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 220 }}>
    <TabFormItem componentType="side">
      <i className="ri-dashboard-line" style={{ marginRight: 8 }} />
      Dashboard
    </TabFormItem>
    <TabFormItem componentType="side" active>
      <i className="ri-line-chart-line" style={{ marginRight: 8 }} />
      Analytics
    </TabFormItem>
    <TabFormItem componentType="side">
      <i className="ri-team-line" style={{ marginRight: 8 }} />
      Team
    </TabFormItem>
  </div>
);

// Tree-style tabs for nested navigation.
export const Tree = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 220 }}>
    <TabFormItem componentType="tree">Components</TabFormItem>
    <TabFormItem componentType="tree" active>
      Forms
    </TabFormItem>
    <TabFormItem componentType="tree">Layouts</TabFormItem>
  </div>
);

// Icon-only tabs (buttonType="icon").
export const IconOnly = () => (
  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
    <TabFormItem componentType="top" buttonType="icon">
      <i className="ri-bold" />
    </TabFormItem>
    <TabFormItem componentType="top" buttonType="icon" active>
      <i className="ri-italic" />
    </TabFormItem>
    <TabFormItem componentType="top" buttonType="icon">
      <i className="ri-underline" />
    </TabFormItem>
  </div>
);
