import React from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "torch-glare";

// Resting triggers across every size, each showing a selected value.
// SelectTrigger renders its children as the trigger label, so the chosen
// value is passed directly (Radix SelectValue only fills from live context).
export const Sizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
    <Select>
      <SelectTrigger size="S" value="design">Design</SelectTrigger>
    </Select>
    <Select>
      <SelectTrigger size="M" value="design">Design</SelectTrigger>
    </Select>
    <Select>
      <SelectTrigger size="L" value="design">Design</SelectTrigger>
    </Select>
    <Select>
      <SelectTrigger size="XL" value="design">Design</SelectTrigger>
    </Select>
  </div>
);

// Placeholder (nothing selected) vs a chosen value.
export const Placeholder = () => (
  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a team" />
      </SelectTrigger>
    </Select>
    <Select>
      <SelectTrigger value="engineering">Engineering</SelectTrigger>
    </Select>
  </div>
);

// Error state — negative border + tooltip surfaced by the trigger.
export const Error = () => (
  <div style={{ paddingTop: 40 }}>
    <Select>
      <SelectTrigger errors="Please select a team">
        <SelectValue placeholder="Select a team" />
      </SelectTrigger>
    </Select>
  </div>
);

// Open option list with grouped, labelled items (defaultOpen).
export const Open = () => (
  <div style={{ height: 280 }}>
    <Select defaultOpen defaultValue="engineering">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Departments</SelectLabel>
          <SelectItem value="engineering" active>Engineering</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="product">Product</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          <SelectItem value="archived" disabled>Archived</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);
