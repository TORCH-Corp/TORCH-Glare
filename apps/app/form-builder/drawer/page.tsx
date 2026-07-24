"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormBuilder } from "@/components/FormBuilder";
import { FormRenderer } from "@/components/FormRenderer";
import { FormSummary } from "@/components/FormSummary";
import { Button } from "@/components/Button";
import {
  CoreFields,
  DEFAULTS,
  DemoHeader,
  resolver,
  SubmitResult,
  useDemoSubmit,
  type Values,
} from "../_shared";

const TAX_RATE = 0.15;
const IQD_RATE = 1310;

// The conclusion — computed from the live form values.
const basePrice = (v: Values) => v.price ?? 0;
const tax = (v: Values) => basePrice(v) * TAX_RATE;
const overallTotal = (v: Values) => basePrice(v) + tax(v);

export default function DrawerExample() {
  const [open, setOpen] = useState(false);
  const { submitting, result, onSubmit } = useDemoSubmit<Values>("drawer");

  // Hoisted so the summary beside the form can read the same live values.
  const form = useForm<Values>({ resolver, defaultValues: DEFAULTS });

  // Close the drawer once the dummy request succeeds.
  const handleSubmit = async (values: Values) => {
    await onSubmit(values);
    setOpen(false);
  };

  // The form is hoisted, so a remount `key` can't reset it — reset on open instead.
  const openDrawer = () => {
    form.reset(DEFAULTS);
    setOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <DemoHeader
        title="Drawer"
        blurb="Same title + action bar as the page — the Save action sits in the drawer header."
      />

      <div>
        <Button variant="PrimeStyle" onClick={openDrawer}>
          New item
        </Button>
      </div>

      {/* FormRenderer owns the drawer and lays the summary in the tray — it takes the same
          hoisted `form` the summary reads from, and its Save action for the drawer header. */}
      <FormRenderer<Values>
        display="drawer"
        open={open}
        onOpenChange={setOpen}
        header={{ title: "New item", label: "New", variant: "new" }}
        form={form}
        onSubmit={handleSubmit}
        actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}
        loading={submitting}
        summary={
          <FormSummary form={form} title="Item" subtitle="Summary">
            <FormSummary.Group title="Pricing">
              <FormSummary.Row label="Base price" compute={basePrice} />
              <FormSummary.Row label="Tax (15%)" compute={tax} />
              <FormSummary.Row label="Overall Total" emphasized compute={overallTotal} />
              <FormSummary.Row
                label="Overall Total"
                currency="IQD"
                tone="success"
                decimals={0}
                compute={(v: Values) => overallTotal(v) * IQD_RATE}
              />
              <FormSummary.Row
                label="Overall Total"
                currency="USD"
                tone="info"
                compute={overallTotal}
              />
            </FormSummary.Group>
          </FormSummary>
        }
      >
        <CoreFields />
      </FormRenderer>

      <SubmitResult result={result} />
    </div>
  );
}
