import React from "react";
import { FieldSection, InputField } from "torch-glare";

// Canonical: labelled section (label + helper text) beside its fields.
// The "flexible" default stacks on narrow widths, splits 350px on lg.
export const Basic = () => (
  <FieldSection
    label="Profile details"
    secondaryLabel="This information is shown on your public profile."
    style={{ width: 760 }}
  >
    <InputField defaultValue="Amelia Stone" placeholder="Full name" />
    <InputField defaultValue="amelia@torchcorp.com" placeholder="Email" />
  </FieldSection>
);

// Horizontal direction — label column fixed, fields right.
export const Horizontal = () => (
  <FieldSection
    direction="horizontal"
    label="Notifications"
    secondaryLabel="Choose how you want to be notified."
    requiredLabel="Required"
    style={{ width: 760 }}
  >
    <InputField defaultValue="alerts@torchcorp.com" placeholder="Alert email" />
    <InputField placeholder="Backup email" />
  </FieldSection>
);

// Vertical direction — label stacked above fields.
export const Vertical = () => (
  <FieldSection
    direction="vertical"
    label="Workspace name"
    secondaryLabel="Used across the dashboard and invoices."
    style={{ width: 480 }}
  >
    <InputField defaultValue="Torch Corp" placeholder="Workspace name" />
  </FieldSection>
);
