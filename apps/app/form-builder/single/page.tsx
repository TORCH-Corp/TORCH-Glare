"use client";

import { useState } from "react";

import { FormBuilder } from "@/components/FormBuilder";
import { Button } from "@/components/Button";
import {
  CoreFields,
  DEFAULTS,
  DemoHeader,
  resolver,
  SAMPLE,
  SubmitResult,
  useDemoSubmit,
  type Values,
} from "../_shared";

export default function SingleFormExample() {
  const [mode, setMode] = useState<"edit" | "view">("edit");
  const [loaded, setLoaded] = useState<Values | undefined>(undefined);
  const { submitting, result, onSubmit } = useDemoSubmit<Values>("single");

  return (
    <div className="flex flex-col gap-6">
      <DemoHeader title="Single form" blurb="Compound fields. Toggle edit / view, and load a record to edit." />

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-1 rounded-[8px] bg-black-alpha-10 p-1">
          <Button size="S" variant={mode === "edit" ? "PrimeStyle" : "BorderStyle"} onClick={() => setMode("edit")}>Edit</Button>
          <Button size="S" variant={mode === "view" ? "PrimeStyle" : "BorderStyle"} onClick={() => setMode("view")}>View</Button>
        </div>
        <Button size="S" variant="BluSecStyle" onClick={() => setTimeout(() => setLoaded(SAMPLE), 300)}>
          Load record (async edit)
        </Button>
        {loaded && <Button size="S" variant="BorderStyle" onClick={() => setLoaded(undefined)}>Clear</Button>}
      </div>

      <FormBuilder
        key={loaded ? "loaded" : "empty"}
        onSubmit={onSubmit}
        loading={submitting}
        resolver={resolver}
        defaultValues={DEFAULTS}
        values={loaded}
        mode={mode}
      >
        <FormBuilder.Header
          title={loaded ? "Acme Widget Pro" : "Item"}
          variant={mode === "view" ? "detail" : loaded ? "edit" : "new"}
        >
          <FormBuilder.Submit loadingText="Saving…">Save</FormBuilder.Submit>
        </FormBuilder.Header>

        <CoreFields />
      </FormBuilder>

      <SubmitResult result={result} />
    </div>
  );
}
