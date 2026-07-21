"use client";

import { FormBuilder } from "@/components/FormBuilder";
import { FormRenderer } from "@/components/FormRenderer";
import {
  ClassificationSection,
  DEFAULTS,
  DemoHeader,
  FinancialSection,
  IdentitySection,
  resolver,
  SettingsSection,
  SubmitResult,
  useDemoSubmit,
  type Values,
} from "../_shared";

export default function StepperExample() {
  const { submitting, result, onSubmit } = useDemoSubmit<Values>("stepper");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <DemoHeader
        title="Stepper"
        blurb="Steps are components; every step's fields stay registered — the nav only toggles visibility."
      />

      {/* The step rail sits beside the active step's fields. FormRenderer detects the Stepper
          child and lets it own its own Submit (shown on the last step). */}
      <FormRenderer<Values>
        onSubmit={onSubmit}
        loading={submitting}
        resolver={resolver}
        defaultValues={DEFAULTS}
        className="min-h-0 flex-1"
        header={{ title: "New item", variant: "new" }}
      >
        <FormBuilder.Stepper>
          <FormBuilder.Step title="Identity">
            <IdentitySection />
          </FormBuilder.Step>
          <FormBuilder.Step title="Classification">
            <ClassificationSection />
          </FormBuilder.Step>
          <FormBuilder.Step title="Financial">
            <FinancialSection />
          </FormBuilder.Step>
          <FormBuilder.Step title="Settings">
            <SettingsSection />
          </FormBuilder.Step>
        </FormBuilder.Stepper>
      </FormRenderer>

      <SubmitResult result={result} />
    </div>
  );
}
