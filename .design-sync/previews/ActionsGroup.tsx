import React from "react";
import { ActionsGroup, Button, ActionButton } from "torch-glare";

// Canonical use: a row of action buttons (primary on the right).
export const FormActions = () => (
  <div style={{ width: 420 }}>
    <ActionsGroup className="justify-end">
      <Button variant="BorderStyle">Cancel</Button>
      <Button variant="PrimeStyle">Create Project</Button>
    </ActionsGroup>
  </div>
);

// withDivider renders a horizontal separator on both sides of the content.
export const WithDivider = () => (
  <div style={{ width: 420 }}>
    <ActionsGroup withDivider>
      <Button variant="PrimeStyle"><i className="ri-save-line" />Save</Button>
      <Button variant="RedSecStyle"><i className="ri-delete-bin-line" />Discard</Button>
    </ActionsGroup>
  </div>
);

// A compact icon-button toolbar grouped in the container.
export const IconToolbar = () => (
  <div style={{ width: 420 }}>
    <ActionsGroup>
      <ActionButton size="S" variant="BorderStyle"><i className="ri-bold" /></ActionButton>
      <ActionButton size="S" variant="BorderStyle"><i className="ri-italic" /></ActionButton>
      <ActionButton size="S" variant="BorderStyle"><i className="ri-underline" /></ActionButton>
      <ActionButton size="S" variant="BorderStyle"><i className="ri-link" /></ActionButton>
    </ActionsGroup>
  </div>
);
