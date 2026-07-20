"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormBuilder } from "@/components/FormBuilder";
import { FormRenderer } from "@/components/FormRenderer";
import { FormSummary } from "@/components/FormSummary";
import { ActionButton } from "@/components/ActionButton";
import { DemoHeader, SubmitResult, useDemoSubmit } from "../_shared";

const schema = z.object({
  customer: z.string().min(1, "Customer is required"),
  balance: z.number().optional(),
  taxRate: z.number().min(0).max(100),
  iqdRate: z.number().positive(),
  items: z.array(
    z.object({
      name: z.string(),
      qty: z.number().optional(),
      price: z.number().optional(),
      discount: z.number().optional(),
    }),
  ),
});

type Invoice = z.infer<typeof schema>;
const resolver = zodResolver(schema);

const DEFAULTS: Invoice = {
  customer: "",
  balance: 0,
  taxRate: 15,
  iqdRate: 1310,
  items: [{ name: "", qty: 1, price: 0, discount: 0 }],
};

// ─── The calculations. Each one runs against the LIVE form values. ───────────

const lineTotal = (i: Invoice["items"][number]) => (i.qty ?? 0) * (i.price ?? 0);

const subTotal = (v: Invoice) => (v.items ?? []).reduce((s, i) => s + lineTotal(i), 0);
const totalDiscount = (v: Invoice) => (v.items ?? []).reduce((s, i) => s + (i.discount ?? 0), 0);
const totalQty = (v: Invoice) => (v.items ?? []).reduce((s, i) => s + (i.qty ?? 0), 0);

const taxable = (v: Invoice) => Math.max(0, subTotal(v) - totalDiscount(v));
const totalTax = (v: Invoice) => taxable(v) * ((v.taxRate ?? 0) / 100);
const overallTotal = (v: Invoice) => taxable(v) + totalTax(v);

export default function SummaryExample() {
  const { submitting, result, onSubmit } = useDemoSubmit<Invoice>("summary");

  // Hoisted so both the form and the summary beside it share the same values.
  const form = useForm<Invoice>({ resolver, defaultValues: DEFAULTS });

  return (
    <div className="flex flex-col gap-6">
      <DemoHeader
        title="Form summary"
        blurb="A FormSummary panel beside the form. Every total recomputes live as you type."
      />

      {/* FormRenderer hosts the form and lays the FormSummary beside it — both bound to the
          same hoisted `form`. Vertical fields keep the form column readable next to the panel. */}
      <FormRenderer<Invoice>
        form={form}
        onSubmit={onSubmit}
        loading={submitting}
        fieldDirection="vertical"
        header={{ title: "Invoice", variant: "new" }}
        submitLabel="Save invoice"
        summary={
          <FormSummary form={form} title="Invoice" subtitle="Summary">
            <FormSummary.Group title="Customer">
              <FormSummary.Row
                label="Balance"
                compute={(v: Invoice) => v.balance}
                action={
                  <ActionButton size="S" onClick={() => alert("Open customer balance")}>
                    <i className="ri-arrow-right-up-line" />
                  </ActionButton>
                }
              />
            </FormSummary.Group>

            <FormSummary.Group title="Total">
              <FormSummary.Row label="Total Discount" compute={totalDiscount} />
              <FormSummary.Row label="Overall Total" emphasized compute={overallTotal} />
              <FormSummary.Row
                label="Overall Total"
                currency="IQD"
                tone="success"
                compute={(v: Invoice) => overallTotal(v) * (v.iqdRate ?? 0)}
                decimals={0}
              />
              <FormSummary.Row
                label="Overall Total"
                currency="USD"
                tone="info"
                compute={overallTotal}
              />
            </FormSummary.Group>

            <FormSummary.Group title="Tax">
              <FormSummary.Row label="Sub Total" compute={subTotal} />
              <FormSummary.Row label="Total Tax" compute={totalTax} />
              <FormSummary.Row
                label="Total Tax"
                currency="IQD"
                tone="success"
                compute={(v: Invoice) => totalTax(v) * (v.iqdRate ?? 0)}
                decimals={0}
              />
              <FormSummary.Row label="Total Tax" currency="USD" tone="info" compute={totalTax} />
            </FormSummary.Group>

            <FormSummary.Group title="Quantity">
              <FormSummary.Row label="Total Qty" compute={totalQty} decimals={0} />
            </FormSummary.Group>
          </FormSummary>
        }
      >
        <FormBuilder.Section title="Customer" color="Blue">
          <FormBuilder.Text name="customer" label="Customer" required placeholder="Acme Corp." />
          <FormBuilder.Currency name="balance" label="Balance" currencySymbol="$" />
        </FormBuilder.Section>

        <FormBuilder.Section title="Line items" color="Green">
          <FormBuilder.FieldArray
            name="items"
            label="Items"
            addLabel="Add item"
            defaultItem={{ name: "", qty: 1, price: 0, discount: 0 }}
          >
            {(rowName) => (
              <>
                <FormBuilder.Text name={`${rowName}.name`} label="Item" />
                <FormBuilder.Number name={`${rowName}.qty`} label="Qty" />
                <FormBuilder.Currency name={`${rowName}.price`} label="Price" currencySymbol="$" />
                <FormBuilder.Currency
                  name={`${rowName}.discount`}
                  label="Discount"
                  currencySymbol="$"
                />
              </>
            )}
          </FormBuilder.FieldArray>
        </FormBuilder.Section>

        <FormBuilder.Section title="Rates" color="Purple">
          <FormBuilder.Number name="taxRate" label="Tax rate (%)" />
          <FormBuilder.Number name="iqdRate" label="USD → IQD rate" />
        </FormBuilder.Section>
      </FormRenderer>

      <SubmitResult result={result} />
    </div>
  );
}
