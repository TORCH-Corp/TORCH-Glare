"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormBuilder } from "@/components/FormBuilder";
import { FormRenderer } from "@/components/FormRenderer";
import { DemoHeader, SubmitResult, useDemoSubmit } from "../_shared";

// This page mirrors, field-for-field, what the MCP server's `create-form` action emits for
//   "name, email, price (currency), role (select), plan (radio list),
//    perms (checkbox group), notify (switch), coverage (date range)"
// — a FormRenderer wrapping FormBuilder sections, one JSX child per field.

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  price: z.number().positive("Must be positive").optional(),
  role: z.string().min(1, "Pick a role"),
  plan: z.string().min(1, "Choose a plan"),
  perms: z.array(z.string()).min(1, "Pick at least one"),
  notify: z.boolean(),
  coverage: z.object({ from: z.date(), to: z.date() }).optional(),
});

type Values = z.infer<typeof schema>;
const resolver = zodResolver(schema);

const DEFAULTS: Values = {
  name: "",
  email: "",
  price: undefined,
  role: "",
  plan: "",
  perms: [],
  notify: true,
  coverage: undefined,
};

const ROLE_OPTIONS = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Viewer", value: "viewer" },
];

const PLAN_OPTIONS = [
  { label: "Starter", value: "starter", description: "Free" },
  { label: "Pro", value: "pro", description: "$12/mo" },
  { label: "Enterprise", value: "enterprise", description: "Contact us" },
];

const PERMS_OPTIONS = [
  { label: "Read", value: "read" },
  { label: "Write", value: "write" },
  { label: "Delete", value: "delete" },
];

export default function CreateFormExample() {
  const { submitting, result, onSubmit } = useDemoSubmit<Values>("create-form");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <DemoHeader
        title="Create form (MCP)"
        blurb="The exact shape the MCP `create-form` action generates — FormRenderer + one FormBuilder.* child per field."
      />

      <FormRenderer<Values>
        onSubmit={onSubmit}
        loading={submitting}
        resolver={resolver}
        defaultValues={DEFAULTS}
        className="min-h-0 flex-1"
        header={{ title: "New record", variant: "new" }}
        actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}
      >
        <FormRenderer.Section title="Details" color="Blue">
          <FormBuilder.Text name="name" label="Name" required placeholder="Acme Corp." />
          <FormBuilder.Email name="email" label="Email" required placeholder="name@example.com" />
          <FormBuilder.Currency name="price" label="Price" currencySymbol="$" placeholder="0.00" />
          <FormBuilder.Select name="role" label="Role" required options={ROLE_OPTIONS} />
        </FormRenderer.Section>

        <FormRenderer.Section title="Access" color="Purple">
          <FormBuilder.RadioList name="plan" label="Plan" required options={PLAN_OPTIONS} />
          <FormBuilder.CheckboxGroup
            name="perms"
            label="Permissions"
            required
            options={PERMS_OPTIONS}
          />
          <FormBuilder.SwitchBox name="notify" label="Notifications" subLabel="Email me updates" />
          <FormBuilder.DateRange name="coverage" label="Coverage" />
        </FormRenderer.Section>
      </FormRenderer>

      <SubmitResult result={result} />
    </div>
  );
}
