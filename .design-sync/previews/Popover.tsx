import React from "react";
import { Popover, PopoverTrigger, PopoverContent, PopoverItem, Button } from "torch-glare";

// Canonical: an open popover (light presentation surface) with a menu list.
export const Open = () => (
  <div style={{ height: 240, display: "flex", justifyContent: "center" }}>
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="BorderStyle"><i className="ri-add-line" />Add</Button>
      </PopoverTrigger>
      <PopoverContent variant="PresentationStyle" align="center">
        <PopoverItem variant="Default"><i className="ri-file-add-line" />New document</PopoverItem>
        <PopoverItem variant="Default"><i className="ri-folder-add-line" />New folder</PopoverItem>
        <PopoverItem variant="Default"><i className="ri-upload-2-line" />Upload file</PopoverItem>
      </PopoverContent>
    </Popover>
  </div>
);

// System (dark) variant — wrapped in a dark panel so its tokens read.
export const SystemStyle = () => (
  <div
    data-theme="dark"
    style={{ height: 240, display: "flex", justifyContent: "center", background: "var(--background-system-body-secondary, #1b1c1e)", borderRadius: 8 }}
  >
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="BorderStyle">Filter</Button>
      </PopoverTrigger>
      <PopoverContent variant="SystemStyle" theme="dark" align="center">
        <PopoverItem variant="SystemStyle">Assigned to me</PopoverItem>
        <PopoverItem variant="SystemStyle" active>Recently updated</PopoverItem>
        <PopoverItem variant="SystemStyle">Created this week</PopoverItem>
      </PopoverContent>
    </Popover>
  </div>
);

// Item semantic variants inside the light surface.
export const ItemVariants = () => (
  <div style={{ height: 240, display: "flex", justifyContent: "center" }}>
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="BorderStyle">Manage</Button>
      </PopoverTrigger>
      <PopoverContent variant="PresentationStyle" align="center">
        <PopoverItem variant="Default"><i className="ri-edit-line" />Rename</PopoverItem>
        <PopoverItem variant="Default" active><i className="ri-pushpin-line" />Pinned</PopoverItem>
        <PopoverItem variant="Negative"><i className="ri-delete-bin-line" />Delete</PopoverItem>
      </PopoverContent>
    </Popover>
  </div>
);
