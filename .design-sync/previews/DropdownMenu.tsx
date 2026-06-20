import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuCheckboxItem,
  Button,
} from "torch-glare";

// Canonical open menu: label, actions, shortcut, separator.
export const Open = () => (
  <div style={{ height: 280 }}>
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="BorderStyle"><i className="ri-more-2-fill" />Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem><i className="ri-user-line" />Profile<DropdownMenuShortcut>⌘P</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuItem><i className="ri-settings-3-line" />Settings<DropdownMenuShortcut>⌘,</DropdownMenuShortcut></DropdownMenuItem>
        <DropdownMenuItem><i className="ri-bank-card-line" />Billing</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="Negative"><i className="ri-logout-box-line" />Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

// The three semantic item variants plus an active row.
export const ItemVariants = () => (
  <div style={{ height: 240 }}>
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="BorderStyle">Status</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem variant="Default" active>Default (active)</DropdownMenuItem>
        <DropdownMenuItem variant="Default">Default</DropdownMenuItem>
        <DropdownMenuItem variant="Warning"><i className="ri-error-warning-line" />Needs review</DropdownMenuItem>
        <DropdownMenuItem variant="Negative"><i className="ri-delete-bin-line" />Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

// Checkbox items for multi-toggle menus.
export const Checkboxes = () => (
  <div style={{ height: 220 }}>
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="BorderStyle">Columns</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked>Name</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>Email</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Role</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
