"use client";

import { FormBuilder } from "@/components/FormBuilder";
import {
  CATEGORY,
  DEFAULTS,
  DemoHeader,
  LABELS,
  PLAN,
  resolver,
  SubmitResult,
  useDemoSubmit,
  type Values,
} from "../_shared";

export default function StepperExample() {
  const { submitting, result, onSubmit } = useDemoSubmit<Values>("stepper");

  return (
    <div className="flex flex-col gap-6">
      <DemoHeader
        title="Stepper"
        blurb="Steps are components; every step's fields stay registered — the nav only toggles visibility."
      />

      <FormBuilder
        onSubmit={onSubmit}
        loading={submitting}
        resolver={resolver}
        defaultValues={DEFAULTS}
      >
        <FormBuilder.Header title="New item" variant="new" />
        <FormBuilder.Stepper>
          <FormBuilder.Step title="Identity">
            <FormBuilder.Section title="Identity" color="Blue">
              <FormBuilder.Text name="name" label="Name" required placeholder="e.g. Acme Widget" />
              <FormBuilder.Textarea name="description" label="Description" fullWidth />
            </FormBuilder.Section>
          </FormBuilder.Step>
          <FormBuilder.Step title="Classification">
            <FormBuilder.Section title="Classification" color="Red">
              <FormBuilder.Select name="category" label="Category" required options={CATEGORY} />
              <FormBuilder.RadioList name="plan" label="Billing plan" options={PLAN} />
              <FormBuilder.MultiSelect name="labels" label="Labels" options={LABELS} />
            </FormBuilder.Section>
          </FormBuilder.Step>
          <FormBuilder.Step title="Financial">
            <FormBuilder.Section title="Financial" color="Green">
              <FormBuilder.Currency name="price" label="Base price" currencySymbol="$" />
            </FormBuilder.Section>
          </FormBuilder.Step>
          <FormBuilder.Step title="Settings">
            <FormBuilder.Section title="Settings" color="Purple">
              <FormBuilder.SwitchBox name="active" label="Active" />
              <FormBuilder.Checkbox
                name="agree"
                label="Terms"
                subLabel="I agree to the terms"
                required
              />
            </FormBuilder.Section>
          </FormBuilder.Step>
        </FormBuilder.Stepper>
      </FormBuilder>

      <SubmitResult result={result} />
    </div>
  );
}
