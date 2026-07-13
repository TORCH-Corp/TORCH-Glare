"use client";

import { useState } from "react";

import { FormBuilder } from "@/components/FormBuilder";
import { FormRenderer } from "@/components/FormRenderer";
import { Button } from "@/components/Button";
import {
  CATEGORY,
  DEFAULTS,
  DemoHeader,
  LABELS,
  PLAN,
  PRIORITY,
  resolver,
  SubmitResult,
  useDemoSubmit,
  type Values,
} from "../_shared";

export default function FormRendererExample() {
  const [display, setDisplay] = useState<"page" | "drawer">("page");
  const [open, setOpen] = useState(false);
  const { submitting, result, onSubmit } = useDemoSubmit<Values>("renderer");

  const handleSubmit = async (values: Values) => {
    await onSubmit(values);
    setOpen(false);
  };

  const fields = (
    <>
      <FormBuilder.Section title="Identity" color="Blue">
        <FormBuilder.Text name="name" label="Name" required placeholder="e.g. Acme Widget" />
        <FormBuilder.Textarea name="description" label="Description" fullWidth />
      </FormBuilder.Section>

      <FormBuilder.Section title="Classification" color="Red">
        <FormBuilder.Select name="category" label="Category" required options={CATEGORY} />
        <FormBuilder.SearchableSelect name="priority" label="Priority" options={PRIORITY} />
        <FormBuilder.Radio name="plan" label="Billing plan" options={PLAN} />
        <FormBuilder.MultiSelect name="labels" label="Labels" options={LABELS} />
      </FormBuilder.Section>

      <FormBuilder.Section title="Financial" color="Green">
        <FormBuilder.Currency name="price" label="Base price" currencySymbol="$" />
      </FormBuilder.Section>

      <FormBuilder.Section title="Settings" color="Purple">
        <FormBuilder.Switch name="active" label="Active" />
        <FormBuilder.Checkbox name="agree" label="I agree to the terms" required />
      </FormBuilder.Section>
    </>
  );

  return (
    <div className="flex flex-col gap-6">
      <DemoHeader
        title="FormRenderer"
        blurb="FormBuilder JSX + the renderer's display handling. Toggle page vs drawer."
      />

      <div className="flex gap-1 rounded-[8px] bg-black-alpha-10 p-1 w-fit">
        <Button size="S" variant={display === "page" ? "PrimeStyle" : "BorderStyle"} onClick={() => setDisplay("page")}>Page</Button>
        <Button size="S" variant={display === "drawer" ? "PrimeStyle" : "BorderStyle"} onClick={() => setDisplay("drawer")}>Drawer</Button>
      </div>

      {display === "page" ? (
        <FormRenderer
          onSubmit={handleSubmit}
          resolver={resolver}
          defaultValues={DEFAULTS}
          loading={submitting}
          header={{ title: "Item", variant: "new" }}
        >
          {fields}
        </FormRenderer>
      ) : (
        <div>
          <Button variant="PrimeStyle" onClick={() => setOpen(true)}>Open in drawer</Button>
          <FormRenderer
            display="drawer"
            open={open}
            onOpenChange={setOpen}
            title="New item"
            badge="New"
            onSubmit={handleSubmit}
            resolver={resolver}
            defaultValues={DEFAULTS}
            loading={submitting}
          >
            {fields}
          </FormRenderer>
        </div>
      )}

      <SubmitResult result={result} />
    </div>
  );
}
