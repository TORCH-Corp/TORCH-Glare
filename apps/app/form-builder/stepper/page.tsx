"use client";

import { useForm } from "react-hook-form";

import { FormBuilder } from "@/components/FormBuilder";
import { FormRenderer } from "@/components/FormRenderer";
import { FormSummary } from "@/components/FormSummary";
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

const TAX_RATE = 0.15;

export default function StepperExample() {
  const { submitting, result, onSubmit } = useDemoSubmit<Values>("stepper");

  // Hoisted so the conclusion column can read the same live values across all steps.
  const form = useForm<Values>({ resolver, defaultValues: DEFAULTS });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <DemoHeader
        title="Stepper"
        blurb="Three columns: the step rail, the active step's fields, and a live conclusion — every step's fields stay registered."
      />

      {/* Stepper (left) + fields (middle) + conclusion (right). FormRenderer detects the Stepper
          child (it owns its own Submit) and hands the summary to FormBuilder as the right column. */}
      <FormRenderer<Values>
        form={form}
        onSubmit={onSubmit}
        loading={submitting}
        className="min-h-0 flex-1"
        header={{ title: "New item", variant: "new" }}
        summary={
          <FormSummary form={form} title="Item" subtitle="Summary">
            <FormSummary.Group title="Pricing">
              <FormSummary.Row label="Base price" compute={(v: Values) => v.price ?? 0} />
              <FormSummary.Row
                label="Tax (15%)"
                compute={(v: Values) => (v.price ?? 0) * TAX_RATE}
              />
              <FormSummary.Row
                label="Total"
                emphasized
                compute={(v: Values) => (v.price ?? 0) * (1 + TAX_RATE)}
              />
            </FormSummary.Group>
          </FormSummary>
        }
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
