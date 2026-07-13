"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormBuilder } from "@/components/FormBuilder";
import { FormDrawer } from "@/components/FormRenderer";
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
  const formId = "drawer-item-form";

  // Hoisted so the summary beside the form can read the same values.
  const form = useForm<Values>({ resolver, defaultValues: DEFAULTS });

  // Close the drawer once the dummy request succeeds.
  const handleSubmit = async (values: Values) => {
    await onSubmit(values);
    setOpen(false);
  };

  // The form is hoisted now, so a remount `key` can't reset it — reset on open.
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
        <Button variant="PrimeStyle" onClick={openDrawer}>New item</Button>
      </div>

      <FormDrawer
        open={open}
        onOpenChange={setOpen}
        title="New item"
        badge="New"
        actions={
          <Button type="submit" form={formId} variant="PrimeStyle" is_loading={submitting}>
            Save
          </Button>
        }
        // Rendered OUTSIDE the drawer panel, beside it — reading the same hoisted `form`.
        childrenOutside={
          <FormSummary
            form={form}
            title="Item"
            subtitle="Summary"
          >
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
        <FormBuilder
          form={form}
          id={formId}
          onSubmit={handleSubmit}
          loading={submitting}
          fieldDirection="vertical"
        >
          <CoreFields />
        </FormBuilder>
      </FormDrawer>

      <SubmitResult result={result} />
    </div>
  );
}
