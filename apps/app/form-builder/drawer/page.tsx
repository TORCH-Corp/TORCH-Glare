"use client";

import { useState } from "react";

import { FormBuilder } from "@/components/FormBuilder";
import { FormDrawer } from "@/components/FormRenderer";
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

export default function DrawerExample() {
  const [open, setOpen] = useState(false);
  const { submitting, result, onSubmit } = useDemoSubmit<Values>("drawer");
  const formId = "drawer-item-form";

  // Close the drawer once the dummy request succeeds.
  const handleSubmit = async (values: Values) => {
    await onSubmit(values);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <DemoHeader
        title="Drawer"
        blurb="Same title + action bar as the page — the Save action sits in the drawer header."
      />

      <div>
        <Button variant="PrimeStyle" onClick={() => setOpen(true)}>New item</Button>
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
      >
        <FormBuilder
          key={open ? "open" : "closed"}
          id={formId}
          onSubmit={handleSubmit}
          loading={submitting}
          resolver={resolver}
          defaultValues={DEFAULTS}
          fieldDirection="vertical"
        >
          <CoreFields />
        </FormBuilder>
      </FormDrawer>

      <SubmitResult result={result} />
    </div>
  );
}
