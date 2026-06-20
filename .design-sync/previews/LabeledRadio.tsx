import React from "react";
import { RadioGroup, LabeledRadio } from "torch-glare";

// Canonical labeled radio group with one option selected.
export const Group = () => (
  <RadioGroup defaultValue="card">
    <LabeledRadio value="card" label="Credit or debit card" />
    <LabeledRadio value="paypal" label="PayPal" />
    <LabeledRadio value="transfer" label="Bank transfer" />
  </RadioGroup>
);

// Secondary + required label affordances.
export const WithLabels = () => (
  <RadioGroup defaultValue="team">
    <LabeledRadio
      value="team"
      label="Team plan"
      secondaryLabel="up to 10 seats"
    />
    <LabeledRadio
      value="enterprise"
      label="Enterprise plan"
      secondaryLabel="custom limits"
      requiredLabel="*"
    />
  </RadioGroup>
);

// Sizes: S, M (default), L.
export const Sizes = () => (
  <RadioGroup defaultValue="m">
    <LabeledRadio value="s" size="S" label="Small" />
    <LabeledRadio value="m" size="M" label="Medium" />
    <LabeledRadio value="l" size="L" label="Large" />
  </RadioGroup>
);
