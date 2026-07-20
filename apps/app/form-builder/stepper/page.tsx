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
    <div className="flex flex-col gap-6">
      <DemoHeader
        title="Stepper"
        blurb="Steps are components; every step's fields stay registered — the nav only toggles visibility."
      />

      {/* FormRenderer detects the Stepper child and lets it own its own Submit (no header submit).
          Each step reuses the same shared section component as the flat forms. */}
      <FormRenderer<Values>
        onSubmit={onSubmit}
        loading={submitting}
        resolver={resolver}
        defaultValues={DEFAULTS}
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
