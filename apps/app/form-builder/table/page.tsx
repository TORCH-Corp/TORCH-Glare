"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormBuilder } from "@/components/FormBuilder";
import { FormRenderer } from "@/components/FormRenderer";
import { DemoHeader, SubmitResult, useDemoSubmit } from "../_shared";

// `FormBuilder.Table` — an editable grid built on the FieldArray pattern. Each column's `cell`
// renders any FormBuilder.* field; rows support checkbox selection, drag-drop reorder, add/remove.

const schema = z.object({
  items: z
    .array(
      z.object({
        item: z.string().min(1, "Required"),
        category: z.string().min(1, "Pick one"),
        qty: z
          .number({ required_error: "Required", invalid_type_error: "Required" })
          .int("Whole number")
          .positive("> 0"),
        price: z
          .number({ required_error: "Required", invalid_type_error: "Required" })
          .nonnegative("≥ 0"),
        due: z.date({ required_error: "Pick a date", invalid_type_error: "Pick a date" }),
        phone: z.string(),
        inStock: z.boolean(),
      }),
    )
    .min(1, "Add at least one row"),
});

type Values = z.infer<typeof schema>;
const resolver = zodResolver(schema);

const CATEGORY = [
  { label: "Hardware", value: "hardware" },
  { label: "Software", value: "software" },
  { label: "Service", value: "service" },
];

const DEFAULTS: Values = {
  items: [
    {
      item: "Widget",
      category: "hardware",
      qty: 2,
      price: 19.99,
      due: new Date("2026-08-01"),
      phone: "+964 7501112233",
      inStock: true,
    },
    {
      item: "License",
      category: "software",
      qty: 1,
      price: 120,
      due: new Date("2026-08-15"),
      phone: "+964 7501114455",
      inStock: false,
    },
  ],
};

export default function TableFieldExample() {
  const { submitting, result, onSubmit } = useDemoSubmit<Values>("table");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <DemoHeader
        title="Table field"
        blurb="FormBuilder.Table — an editable grid on the FieldArray pattern: any field per cell, row checkboxes, drag-drop reorder, add/remove. It draws its own section shell, so keep it a top-level child."
      />

      <FormRenderer<Values>
        onSubmit={onSubmit}
        loading={submitting}
        resolver={resolver}
        defaultValues={DEFAULTS}
        className="min-h-0 flex-1"
        header={{ title: "Line items", variant: "new" }}
        actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}
      >
        <FormBuilder.Table
          name="items"
          title="Items Table"
          color="Purple"
          icon={<i className="ri-box-3-line text-[18px]" />}
          addLabel="Add New"
          defaultItem={{
            item: "",
            category: "hardware",
            qty: 1,
            price: 0,
            due: undefined,
            phone: "",
            inStock: true,
          }}
          columns={[
            {
              header: "Item",
              width: 200,
              sortKey: "item",
              cell: (row) => <FormBuilder.Text name={`${row}.item`} placeholder="Name" required />,
            },
            {
              header: "Category",
              width: 180,
              sortKey: "category",
              cell: (row) => (
                <FormBuilder.Select name={`${row}.category`} options={CATEGORY} required />
              ),
            },
            {
              header: "Qty",
              width: 110,
              sortKey: "qty",
              cell: (row) => <FormBuilder.Number name={`${row}.qty`} required />,
            },
            {
              header: "Price",
              width: 140,
              sortKey: "price",
              cell: (row) => (
                <FormBuilder.Currency name={`${row}.price`} currencySymbol="$" required />
              ),
            },
            {
              header: "Due",
              width: 180,
              sortKey: "due",
              cell: (row) => <FormBuilder.Date name={`${row}.due`} required />,
            },
            {
              // In a cell `FormBuilder.Phone` collapses to a plain number input — no country
              // picker. Add a separate column if a table needs the dial code.
              header: "Phone",
              width: 180,
              cell: (row) => <FormBuilder.Phone name={`${row}.phone`} />,
            },
            {
              header: "In stock",
              width: 120,
              align: "center",
              cell: (row) => <FormBuilder.Checkbox name={`${row}.inStock`} />,
            },
          ]}
        />
      </FormRenderer>

      <SubmitResult result={result} />
    </div>
  );
}
