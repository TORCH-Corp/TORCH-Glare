import React from "react";
import { ButtonGroup, ButtonGroupItem } from "torch-glare";

// Single-select segmented control (the canonical use). One item starts active.
export const SingleSelect = () => (
  <ButtonGroup type="single" defaultValue="grid" variant="PrimeStyle" size="M">
    <ButtonGroupItem value="grid"><i className="ri-layout-grid-line" />Grid</ButtonGroupItem>
    <ButtonGroupItem value="list"><i className="ri-list-unordered" />List</ButtonGroupItem>
    <ButtonGroupItem value="board"><i className="ri-kanban-view" />Board</ButtonGroupItem>
  </ButtonGroup>
);

// Multi-select group — several items can be active at once.
export const MultiSelect = () => (
  <ButtonGroup type="multiple" defaultValue={["bold", "underline"]} variant="BorderStyle" size="M">
    <ButtonGroupItem value="bold"><i className="ri-bold" /></ButtonGroupItem>
    <ButtonGroupItem value="italic"><i className="ri-italic" /></ButtonGroupItem>
    <ButtonGroupItem value="underline"><i className="ri-underline" /></ButtonGroupItem>
    <ButtonGroupItem value="strike"><i className="ri-strikethrough" /></ButtonGroupItem>
  </ButtonGroup>
);

// The size axis swept (S / M / L / XL).
export const Sizes = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
    <ButtonGroup type="single" defaultValue="day" size="S">
      <ButtonGroupItem value="day">Day</ButtonGroupItem>
      <ButtonGroupItem value="week">Week</ButtonGroupItem>
      <ButtonGroupItem value="month">Month</ButtonGroupItem>
    </ButtonGroup>
    <ButtonGroup type="single" defaultValue="day" size="M">
      <ButtonGroupItem value="day">Day</ButtonGroupItem>
      <ButtonGroupItem value="week">Week</ButtonGroupItem>
      <ButtonGroupItem value="month">Month</ButtonGroupItem>
    </ButtonGroup>
    <ButtonGroup type="single" defaultValue="day" size="L">
      <ButtonGroupItem value="day">Day</ButtonGroupItem>
      <ButtonGroupItem value="week">Week</ButtonGroupItem>
      <ButtonGroupItem value="month">Month</ButtonGroupItem>
    </ButtonGroup>
    <ButtonGroup type="single" defaultValue="day" size="XL">
      <ButtonGroupItem value="day">Day</ButtonGroupItem>
      <ButtonGroupItem value="week">Week</ButtonGroupItem>
      <ButtonGroupItem value="month">Month</ButtonGroupItem>
    </ButtonGroup>
  </div>
);

// A disabled item within an otherwise active group.
export const WithDisabled = () => (
  <ButtonGroup type="single" defaultValue="all" variant="PrimeStyle" size="M">
    <ButtonGroupItem value="all">All</ButtonGroupItem>
    <ButtonGroupItem value="active">Active</ButtonGroupItem>
    <ButtonGroupItem value="archived" disabled>Archived</ButtonGroupItem>
  </ButtonGroup>
);
