"use client";

import { useState } from "react";

import { FormBuilder } from "@/components/FormBuilder";
import { FormRenderer } from "@/components/FormRenderer";
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

export default function FormRendererExample() {
  const [display, setDisplay] = useState<"page" | "drawer">("page");
  const [open, setOpen] = useState(false);
  const { submitting, result, onSubmit } = useDemoSubmit<Values>("renderer");

  const handleSubmit = async (values: Values) => {
    await onSubmit(values);
    setOpen(false);
  };

  // Same field JSX drives both displays — the single source of truth is `CoreFields`.
  const fields = <CoreFields />;
  // The Save action — placed in the form header (page) or the drawer header (drawer).
  const save = <FormBuilder.Submit>Save</FormBuilder.Submit>;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <DemoHeader
        title="FormRenderer"
        blurb="The same FormBuilder children, rendered as a page or a drawer. FormRenderer owns the display decision."
      />

      <div className="flex gap-1 rounded-[8px] bg-black-alpha-10 p-1 w-fit">
        <Button
          size="S"
          variant={display === "page" ? "PrimeStyle" : "BorderStyle"}
          onClick={() => setDisplay("page")}
        >
          Page
        </Button>
        <Button
          size="S"
          variant={display === "drawer" ? "PrimeStyle" : "BorderStyle"}
          onClick={() => setDisplay("drawer")}
        >
          Drawer
        </Button>
      </div>

      {display === "page" ? (
        <FormRenderer
          onSubmit={handleSubmit}
          resolver={resolver}
          defaultValues={DEFAULTS}
          loading={submitting}
          header={{ title: "Item", variant: "new" }}
          actions={save}
        >
          {fields}
        </FormRenderer>
      ) : (
        <div>
          <Button variant="PrimeStyle" onClick={() => setOpen(true)}>
            Open in drawer
          </Button>
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
            actions={save}
          >
            {fields}
          </FormRenderer>
        </div>
      )}

      <SubmitResult result={result} />
    </div>
  );
}
