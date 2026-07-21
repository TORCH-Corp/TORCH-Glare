"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormBuilder } from "@/components/FormBuilder";
import { FormRenderer } from "@/components/FormRenderer";
import { DemoHeader, SubmitResult, useDemoSubmit } from "../_shared";

// Every field is required so that submitting empty surfaces an error on each one —
// a testbed for the inline FieldHint error display.
const schema = z.object({
  title: z.string().min(1, "Title is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
  qty: z
    .number({ required_error: "Quantity is required", invalid_type_error: "Quantity is required" })
    .int("Whole numbers only"),
  price: z
    .number({ required_error: "Price is required", invalid_type_error: "Price is required" })
    .positive("Must be positive"),
  notes: z.string().min(1, "Notes are required"),
  category: z.string().min(1, "Select a category"),
  priority: z.string().min(1, "Select a priority"),
  labels: z.array(z.string()).min(1, "Pick at least one label"),
  tags: z.array(z.string()).min(1, "Add at least one tag"),
  planList: z.string().min(1, "Choose a plan"),
  perms: z.array(z.string()).min(1, "Pick at least one"),
  agree: z.boolean().refine((v) => v === true, "You must agree to continue"),
  darkMode: z.boolean().refine((v) => v === true, "Enable this"),
  dueDate: z.date({ required_error: "Pick a date", invalid_type_error: "Pick a date" }),
  attachment: z.any().refine((v) => v != null, "Attach a file"),
  photo: z.any().refine((v) => v != null, "Add an image"),
  bio: z.any().refine((v) => v != null, "Bio is required"),
  signature: z.string().min(1, "Signature is required"),
  tier: z.string().min(1, "Choose a tier"),
  pin: z.string().min(6, "Enter the 6-digit code"),
  range: z.any().refine((v) => v?.from && v?.to, "Pick a date range"),
  when: z.date({ required_error: "Pick date & time", invalid_type_error: "Pick date & time" }),
  categoryId: z.string().min(1, "Pick a category"),
  volume: z.number().min(1, "Set a volume above 0"),
  rangeVals: z.any().refine((v) => Array.isArray(v) && v[0] >= 30, "Range start must be ≥ 30"),
  colorHex: z.string().min(1, "Pick a color"),
  colorAlpha: z.string().min(1, "Pick a color"),
  phone2: z.string().min(1, "Phone is required"),
  contacts: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().min(1, "Email is required").email("Enter a valid email"),
      }),
    )
    .min(1, "Add at least one contact"),
});

type AllFields = z.infer<typeof schema>;
const resolver = zodResolver(schema);

// Empty / falsy so every required rule fails on submit.
const DEFAULTS: AllFields = {
  title: "",
  email: "",
  password: "",
  qty: undefined as unknown as number,
  price: undefined as unknown as number,
  notes: "",
  category: "",
  priority: "",
  labels: [],
  tags: [],
  planList: "",
  perms: [],
  agree: false,
  darkMode: false,
  dueDate: undefined as unknown as Date,
  attachment: undefined,
  photo: undefined,
  bio: undefined,
  signature: "",
  tier: "",
  pin: "",
  range: undefined,
  when: undefined as unknown as Date,
  categoryId: "",
  volume: 0,
  rangeVals: [20, 80],
  colorHex: "",
  colorAlpha: "#3B82F680",
  phone2: "",
  contacts: [{ name: "", email: "" }],
};

const OPTS = [
  { label: "Alpha", value: "alpha" },
  { label: "Beta", value: "beta" },
  { label: "Gamma", value: "gamma" },
];

// Options carrying a secondary label, to exercise the boxed list's sublabel.
const PLAN_OPTS = [
  { label: "Starter", value: "starter", description: "Free" },
  { label: "Pro", value: "pro", description: "$12/mo" },
  { label: "Enterprise", value: "enterprise", description: "Contact us" },
];

interface Cat {
  id: string;
  name: string;
  children?: Cat[];
}
const TREE: Cat[] = [
  {
    id: "electronics",
    name: "Electronics",
    children: [
      { id: "phones", name: "Phones" },
      { id: "laptops", name: "Laptops" },
    ],
  },
  {
    id: "clothing",
    name: "Clothing",
    children: [
      { id: "men", name: "Men" },
      { id: "women", name: "Women" },
    ],
  },
];

export default function FieldTypesExample() {
  const { submitting, result, onSubmit } = useDemoSubmit<AllFields>("fields");

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <DemoHeader
        title="Field types"
        blurb="Every field is required — press Save to surface a validation error on each one."
      />

      <FormRenderer<AllFields>
        onSubmit={onSubmit}
        loading={submitting}
        resolver={resolver}
        defaultValues={DEFAULTS}
        className="min-h-0 flex-1"
        header={{ title: "Field types", variant: "new" }}
      >
        <FormBuilder.Section title="Text inputs" color="Blue">
          <FormBuilder.Text name="title" label="Title" required placeholder="Text" />
          <FormBuilder.Email name="email" label="Email" required placeholder="name@example.com" />
          <FormBuilder.Password name="password" label="Password" required placeholder="••••••••" />
          <FormBuilder.Number name="qty" label="Quantity" required placeholder="0" />
          <FormBuilder.Currency
            name="price"
            label="Price"
            required
            currencySymbol="$"
            placeholder="0.00"
          />
          <FormBuilder.Textarea
            name="notes"
            label="Notes"
            required
            fullWidth
            placeholder="Longer text…"
          />
        </FormBuilder.Section>

        <FormBuilder.Section title="Choices" color="Red">
          <FormBuilder.Select name="category" label="Select" required options={OPTS} />
          <FormBuilder.SearchableSelect
            name="priority"
            label="Searchable select"
            required
            options={OPTS}
          />
          <FormBuilder.MultiSelect name="labels" label="Multi-select" required options={OPTS} />
          <FormBuilder.Tags name="tags" label="Tags" required options={OPTS} />
          <FormBuilder.RadioList name="planList" label="Radio list" required options={PLAN_OPTS} />
          <FormBuilder.CheckboxGroup name="perms" label="Checkbox group" required options={OPTS} />
          <FormBuilder.Checkbox
            name="agree"
            label="Checkbox"
            subLabel="I agree to the terms"
            required
          />
          <FormBuilder.SwitchBox name="darkMode" label="Switch box" subLabel="Dark mode" required />
        </FormBuilder.Section>

        <FormBuilder.Section title="Rich inputs" color="Purple">
          <FormBuilder.Date name="dueDate" label="Date" required />
          <FormBuilder.File
            name="attachment"
            label="File"
            description="PDF, PNG or JPG"
            required
            accept=".pdf,.png,.jpg"
          />
          <FormBuilder.Image name="photo" label="Image" required accept="image/*" />
          <FormBuilder.RichText
            name="bio"
            label="Bio"
            required
            placeholder="Write something…"
            fullWidth
          />
          <FormBuilder.Signature name="signature" label="Signature" required fullWidth />
        </FormBuilder.Section>

        <FormBuilder.Section title="More inputs" color="Orange">
          <FormBuilder.RadioCards
            name="tier"
            label="Radio cards"
            required
            fullWidth
            options={[
              { label: "Starter", value: "starter", description: "For individuals" },
              { label: "Pro", value: "pro", description: "For teams" },
            ]}
          />
          <FormBuilder.Otp name="pin" label="OTP / PIN" required length={6} />
          <FormBuilder.DateRange name="range" label="Date range" required />
          <FormBuilder.DateTime name="when" label="Date & time" required />
          <FormBuilder.TreeSelect
            name="categoryId"
            label="Tree select"
            required
            nodes={TREE}
            getNodeId={(n) => n.id}
            getNodeLabel={(n) => n.name}
            getNodeChildren={(n) => n.children}
          />
        </FormBuilder.Section>

        <FormBuilder.Section title="Advanced inputs" color="Blue">
          <FormBuilder.Slider name="volume" label="Slider" required min={0} max={100} />
          <FormBuilder.Slider name="rangeVals" label="Range" required min={0} max={100} range />
          <FormBuilder.Color
            name="colorHex"
            label="Color"
            required
            presets={["#005ECC", "#047854", "#E30C30", "#F5A623"]}
          />
          <FormBuilder.Color
            name="colorAlpha"
            label="Color (with opacity)"
            required
            presets={["#3B82F6", "#8B5CF6", "#EC4899", "#10B981"]}
          />
          <FormBuilder.Phone name="phone2" label="Phone" required />
        </FormBuilder.Section>

        <FormBuilder.Section title="Field array" color="Green">
          <FormBuilder.FieldArray
            name="contacts"
            label="Contacts"
            addLabel="Add contact"
            defaultItem={{ name: "", email: "" }}
          >
            {(rowName) => (
              <>
                <FormBuilder.Text name={`${rowName}.name`} label="Name" required />
                <FormBuilder.Email name={`${rowName}.email`} label="Email" required />
              </>
            )}
          </FormBuilder.FieldArray>
        </FormBuilder.Section>
      </FormRenderer>

      <SubmitResult result={result} />
    </div>
  );
}
