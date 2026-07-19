"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { FormBuilder } from "@/components/FormBuilder";
import { EXAMPLES } from "./_examples";

// ─── Shared demo model (zod schema is the source of truth) ───────────────────

export const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  category: z.string().min(1, "Pick a category"),
  priority: z.string(),
  plan: z.string(),
  labels: z.array(z.string()),
  price: z.number({ invalid_type_error: "Enter a number" }).positive("Must be positive").optional(),
  active: z.boolean(),
  agree: z.boolean().refine((v) => v === true, "You must agree to continue"),
});

export type Values = z.infer<typeof schema>;

/** react-hook-form resolver backed by zod. */
export const resolver = zodResolver(schema);

export const DEFAULTS: Values = {
  name: "",
  description: "",
  category: "",
  priority: "",
  plan: "monthly",
  labels: [],
  price: undefined,
  active: true,
  agree: false,
};

export const SAMPLE: Values = {
  name: "Acme Widget Pro",
  description: "Flagship widget, anodized aluminium.",
  category: "hardware",
  priority: "high",
  plan: "yearly",
  labels: ["featured", "new"],
  price: 1299,
  active: true,
  agree: true,
};

export const CATEGORY = [
  { label: "Hardware", value: "hardware" },
  { label: "Software", value: "software" },
  { label: "Service", value: "service" },
];
export const PRIORITY = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];
export const PLAN = [
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];
export const LABELS = [
  { label: "Featured", value: "featured" },
  { label: "New", value: "new" },
  { label: "Sale", value: "sale" },
];

// ─── Fake async submit (a dummy "API request") ───────────────────────────────

export interface SubmitResultState<T> {
  ok: boolean;
  values: T;
  at: string;
}

/**
 * Simulates a network request: flips a `submitting` flag (drives the Submit
 * spinner via FormBuilder's `loading`), waits ~1.2s, then records the result.
 * Occasionally throws to exercise the error path.
 */
export function useDemoSubmit<T>(label: string) {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResultState<T> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: T) => {
    setSubmitting(true);
    setError(null);
    setResult(null);
    console.log(`[${label}] POST /api/items`, values);
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setResult({ ok: true, values, at: new Date().toLocaleTimeString() });
    console.log(`[${label}] 200 OK`, values);
  };

  return { submitting, result, error, onSubmit, reset: () => setResult(null) };
}

/** Success/response banner showing the values the dummy request "saved". */
export function SubmitResult<T>({ result }: { result: SubmitResultState<T> | null }) {
  if (!result) return null;
  return (
    <div className="rounded-[12px] border border-[#047854]/40 bg-[#047854]/10 p-4">
      <p className="typography-body-medium-medium text-content-presentation-global-primary">
        ✓ Saved at {result.at} — response payload:
      </p>
      <pre className="mt-2 overflow-x-auto rounded-[8px] bg-black-alpha-10 p-3 typography-body-small-regular text-content-presentation-global-secondary">
        {JSON.stringify(result.values, null, 2)}
      </pre>
    </div>
  );
}

// ─── The reusable field set ──────────────────────────────────────────────────

export function CoreFields() {
  return (
    <>
      <FormBuilder.Section title="Identity" color="Blue">
        <FormBuilder.Text name="name" label="Name" required placeholder="e.g. Acme Widget" />
        <FormBuilder.Textarea
          name="description"
          label="Description"
          fullWidth
          placeholder="Short summary…"
        />
      </FormBuilder.Section>
      <FormBuilder.Section title="Classification" color="Red">
        <FormBuilder.Select name="category" label="Category" required options={CATEGORY} />
        <FormBuilder.SearchableSelect name="priority" label="Priority" options={PRIORITY} />
        <FormBuilder.RadioList name="plan" label="Billing plan" options={PLAN} />
        <FormBuilder.MultiSelect name="labels" label="Labels" options={LABELS} />
      </FormBuilder.Section>
      <FormBuilder.Section title="Financial" color="Green">
        <FormBuilder.Currency
          name="price"
          label="Base price"
          currencySymbol="$"
          placeholder="0.00"
        />
      </FormBuilder.Section>
      <FormBuilder.Section title="Settings" color="Purple">
        <FormBuilder.SwitchBox name="active" label="Active" />
        <FormBuilder.Checkbox name="agree" label="Terms" subLabel="I agree to the terms" required />
      </FormBuilder.Section>
    </>
  );
}

// ─── Example nav (shared layout) ─────────────────────────────────────────────

export function DemoNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap gap-1 rounded-[10px] bg-black-alpha-10 p-1">
      {EXAMPLES.map((e) => {
        const active = pathname === e.href;
        return (
          <Link
            key={e.href}
            href={e.href}
            className={[
              "rounded-[8px] px-3 py-1.5 typography-body-small-medium transition-colors",
              active
                ? "bg-[#005ECC] text-white"
                : "text-content-presentation-global-secondary hover:bg-black-alpha-10",
            ].join(" ")}
          >
            {e.title}
          </Link>
        );
      })}
    </nav>
  );
}

/** Page heading used by each example. */
export function DemoHeader({ title, blurb }: { title: string; blurb: string }) {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="typography-headers-large-medium text-content-presentation-global-primary">
        {title}
      </h1>
      <p className="typography-body-medium-regular text-content-presentation-global-secondary">
        {blurb}
      </p>
    </header>
  );
}
