"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormBuilder } from "@/components/FormBuilder";
import { DemoHeader, SubmitResult, useDemoSubmit } from "../_shared";

/**
 * `FormBuilder` with no `FormRenderer` around it.
 *
 * This is the whole component: a `<form>`, its react-hook-form context, and the fields. No title
 * header, no section cards, no page gutters, no scroll shell — so it fills whatever you put it in.
 * That is what an *embedded* form needs: the 260px rail on the right has no room to give up 96px
 * to page gutters, and a 1100px cap means nothing inside it.
 *
 * `DataViews.Filters` renders a bare FormBuilder for exactly this reason.
 */

const schema = z.object({
  label: z.string().min(1, "Required"),
  colour: z.string(),
  visibility: z.string(),
  pinned: z.boolean(),
});
type Values = z.infer<typeof schema>;

const DEFAULTS: Values = { label: "", colour: "#005ECC", visibility: "team", pinned: false };

const VISIBILITY = [
  { label: "Only me", value: "me" },
  { label: "My team", value: "team" },
  { label: "Everyone", value: "all" },
];

export default function BareFormBuilderExample() {
  const { submitting, result, onSubmit } = useDemoSubmit<Values>("bare");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <DemoHeader
        title="Bare FormBuilder"
        blurb="No FormRenderer: just the fields. The same form renders in a full-width block and in a 260px rail — it takes the width it is given."
      />

      <div className="flex min-h-0 flex-1 flex-wrap items-start gap-4">
        {/* Wide: the form fills the column it is placed in. */}
        <section className="flex min-w-[320px] flex-1 flex-col gap-2 rounded-[12px] border border-border-presentation-action-primary bg-background-presentation-form-base p-4">
          <h2 className="typography-body-large-medium text-content-presentation-global-primary">
            In a page block
          </h2>
          <p className="typography-body-small-regular text-content-presentation-global-secondary">
            Fields fill the container. Nothing is centred, capped or padded for you.
          </p>
          <FormBuilder<Values>
            onSubmit={onSubmit}
            loading={submitting}
            resolver={zodResolver(schema)}
            defaultValues={DEFAULTS}
          >
            <FormBuilder.Text name="label" label="Label" required placeholder="e.g. Overdue" />
            <FormBuilder.Color name="colour" label="Colour" />
            <FormBuilder.RadioList name="visibility" label="Visibility" options={VISIBILITY} />
            <FormBuilder.SwitchBox name="pinned" label="Pinned" subLabel="Keep at the top" />
            <FormBuilder.Submit>Save view</FormBuilder.Submit>
          </FormBuilder>
        </section>

        {/* Narrow: the same JSX in a 260px rail — the case that used to need `layout="bare"`. */}
        <section className="flex w-[260px] shrink-0 flex-col gap-2 rounded-[12px] border border-border-presentation-action-primary bg-background-presentation-form-base p-3">
          <h2 className="typography-body-large-medium text-content-presentation-global-primary">
            In a 260px rail
          </h2>
          <p className="typography-body-small-regular text-content-presentation-global-secondary">
            Same fields, with <code>fieldDirection=&quot;vertical&quot;</code> — the shape a filter
            or settings panel uses.
          </p>
          <FormBuilder<Values>
            onSubmit={onSubmit}
            loading={submitting}
            resolver={zodResolver(schema)}
            defaultValues={DEFAULTS}
            fieldDirection="vertical"
          >
            <FormBuilder.Text name="label" label="Label" required placeholder="e.g. Overdue" />
            <FormBuilder.Color name="colour" label="Colour" />
            <FormBuilder.RadioList name="visibility" label="Visibility" options={VISIBILITY} />
            <FormBuilder.SwitchBox name="pinned" label="Pinned" subLabel="Keep at the top" />
            <FormBuilder.Submit>Save view</FormBuilder.Submit>
          </FormBuilder>
        </section>
      </div>

      <p className="typography-body-small-regular text-content-presentation-global-secondary">
        Want the title header, the coloured section cards, a stepper or a summary panel? Those are
        all <code>FormRenderer</code> — see the other examples. Reach for bare{" "}
        <code>FormBuilder</code> only when the surrounding UI already provides its own chrome.
      </p>

      <SubmitResult result={result} />
    </div>
  );
}
