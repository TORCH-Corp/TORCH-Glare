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
  SAMPLE,
  SubmitResult,
  useDemoSubmit,
  type Values,
} from "../_shared";

export default function SingleFormExample() {
  const [loaded, setLoaded] = useState<Values | undefined>(undefined);
  const { submitting, result, onSubmit } = useDemoSubmit<Values>("single");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <DemoHeader
        title="Single form"
        blurb="FormBuilder fields wrapped in FormRenderer, which supplies the header, the Save and the section cards. Load a record to edit it."
      />

      <div className="flex flex-wrap items-center gap-4">
        <Button
          size="S"
          variant="BluSecStyle"
          onClick={() => setTimeout(() => setLoaded(SAMPLE), 300)}
        >
          Load record (async edit)
        </Button>
        {loaded && (
          <Button size="S" variant="BorderStyle" onClick={() => setLoaded(undefined)}>
            Clear
          </Button>
        )}
      </div>

      {/* FormRenderer owns the title header + its Save action. The remount `key` re-seeds
          defaults when a record loads (see FormBuilder `values`). */}
      <FormRenderer<Values>
        key={loaded ? "loaded" : "empty"}
        onSubmit={onSubmit}
        loading={submitting}
        resolver={resolver}
        defaultValues={DEFAULTS}
        values={loaded}
        className="min-h-0 flex-1"
        actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}
        header={{
          title: loaded ? "Acme Widget Pro" : "Item",
          variant: loaded ? "edit" : "new",
        }}
      >
        <CoreFields />
      </FormRenderer>

      <SubmitResult result={result} />
    </div>
  );
}
