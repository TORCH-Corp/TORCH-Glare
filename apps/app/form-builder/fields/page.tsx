"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormBuilder } from "@/components/FormBuilder";
import { DemoHeader, SubmitResult, useDemoSubmit } from "../_shared";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Enter a valid email").or(z.literal("")),
  password: z.string(),
  qty: z.number().int("Whole numbers only").optional(),
  price: z.number().positive("Must be positive").optional(),
  notes: z.string(),
  category: z.string(),
  priority: z.string(),
  labels: z.array(z.string()),
  tags: z.array(z.string()),
  plan: z.string(),
  active: z.boolean(),
  agree: z.boolean(),
  dueDate: z.date().optional(),
  attachment: z.any().optional(),
  bio: z.any().optional(),
  signature: z.string(),
  segment: z.string(),
  toggles: z.array(z.string()),
  tier: z.string(),
  pin: z.string().optional(),
  range: z.any().optional(),
  when: z.date().optional(),
  categoryId: z.string(),
  toggled: z.boolean(),
  volume: z.number(),
  rangeVals: z.any().optional(),
  colorHex: z.string(),
  phone2: z.string().optional(),
  day: z.date().optional(),
  contacts: z.array(z.object({ name: z.string(), email: z.string() })),
});

type AllFields = z.infer<typeof schema>;
const resolver = zodResolver(schema);

const DEFAULTS: AllFields = {
  title: "",
  email: "",
  password: "",
  qty: undefined,
  price: undefined,
  notes: "",
  category: "",
  priority: "",
  labels: [],
  tags: [],
  plan: "monthly",
  active: true,
  agree: false,
  dueDate: undefined,
  attachment: undefined,
  bio: undefined,
  signature: "",
  segment: "list",
  toggles: [],
  tier: "",
  pin: "",
  range: undefined,
  when: undefined,
  categoryId: "",
  toggled: false,
  volume: 50,
  rangeVals: [20, 80],
  colorHex: "#005ECC",
  phone2: "",
  day: undefined,
  contacts: [{ name: "", email: "" }],
};

const OPTS = [
  { label: "Alpha", value: "alpha" },
  { label: "Beta", value: "beta" },
  { label: "Gamma", value: "gamma" },
];

interface Cat {
  id: string;
  name: string;
  children?: Cat[];
}
const TREE: Cat[] = [
  { id: "electronics", name: "Electronics", children: [
    { id: "phones", name: "Phones" },
    { id: "laptops", name: "Laptops" },
  ] },
  { id: "clothing", name: "Clothing", children: [
    { id: "men", name: "Men" },
    { id: "women", name: "Women" },
  ] },
];

export default function FieldTypesExample() {
  const { submitting, result, onSubmit } = useDemoSubmit<AllFields>("fields");

  return (
    <div className="flex flex-col gap-6">
      <DemoHeader title="Field types" blurb="Every FormBuilder field component in one form." />

      <FormBuilder onSubmit={onSubmit} loading={submitting} resolver={resolver} defaultValues={DEFAULTS}>
        <FormBuilder.Header title="Field types" variant="new">
          <FormBuilder.Submit loadingText="Saving…">Save</FormBuilder.Submit>
        </FormBuilder.Header>

        <FormBuilder.Section title="Text inputs" color="Blue">
          <FormBuilder.Text name="title" label="Title" required placeholder="Text" />
          <FormBuilder.Email name="email" label="Email" placeholder="name@example.com" />
          <FormBuilder.Password name="password" label="Password" placeholder="••••••••" />
          <FormBuilder.Number name="qty" label="Quantity" placeholder="0" />
          <FormBuilder.Currency name="price" label="Price" currencySymbol="$" placeholder="0.00" />
          <FormBuilder.Textarea name="notes" label="Notes" fullWidth placeholder="Longer text…" />
        </FormBuilder.Section>

        <FormBuilder.Section title="Choices" color="Red">
          <FormBuilder.Select name="category" label="Select" options={OPTS} />
          <FormBuilder.SearchableSelect name="priority" label="Searchable select" options={OPTS} />
          <FormBuilder.MultiSelect name="labels" label="Multi-select" options={OPTS} />
          <FormBuilder.Tags name="tags" label="Tags" options={OPTS} />
          <FormBuilder.Radio name="plan" label="Radio" options={OPTS} />
          <FormBuilder.Switch name="active" label="Switch" />
          <FormBuilder.Checkbox name="agree" label="Checkbox" />
        </FormBuilder.Section>

        <FormBuilder.Section title="Rich inputs" color="Purple">
          <FormBuilder.Date name="dueDate" label="Date" />
          <FormBuilder.File name="attachment" label="File" accept=".pdf,.png,.jpg" />
          <FormBuilder.RichText name="bio" label="Bio" placeholder="Write something…" fullWidth />
          <FormBuilder.Signature name="signature" label="Signature" fullWidth />
        </FormBuilder.Section>

        <FormBuilder.Section title="More inputs" color="Orange">
          <FormBuilder.Segmented
            name="segment"
            label="Segmented"
            options={[
              { label: "List", value: "list" },
              { label: "Grid", value: "grid" },
              { label: "Board", value: "board" },
            ]}
          />
          <FormBuilder.ToggleGroup
            name="toggles"
            label="Toggle group"
            multiple
            options={[
              { label: "Bold", value: "bold" },
              { label: "Italic", value: "italic" },
              { label: "Underline", value: "underline" },
            ]}
          />
          <FormBuilder.RadioCards
            name="tier"
            label="Radio cards"
            fullWidth
            options={[
              { label: "Starter", value: "starter", description: "For individuals" },
              { label: "Pro", value: "pro", description: "For teams" },
            ]}
          />
          <FormBuilder.Otp name="pin" label="OTP / PIN" length={6} />
          <FormBuilder.DateRange name="range" label="Date range" />
          <FormBuilder.DateTime name="when" label="Date & time" />
          <FormBuilder.TreeSelect
            name="categoryId"
            label="Tree select"
            nodes={TREE}
            getNodeId={(n) => n.id}
            getNodeLabel={(n) => n.name}
            getNodeChildren={(n) => n.children}
          />
        </FormBuilder.Section>

        <FormBuilder.Section title="Advanced inputs" color="Blue">
          <FormBuilder.ToggleButton name="toggled" label="Toggle button" />
          <FormBuilder.Slider name="volume" label="Slider" min={0} max={100} />
          <FormBuilder.Slider name="rangeVals" label="Range" min={0} max={100} range />
          <FormBuilder.Color name="colorHex" label="Color" presets={["#005ECC", "#047854", "#E30C30", "#F5A623"]} />
          <FormBuilder.Phone name="phone2" label="Phone" />
          <FormBuilder.InlineCalendar name="day" label="Inline calendar" />
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
                <FormBuilder.Text name={`${rowName}.name`} label="Name" />
                <FormBuilder.Email name={`${rowName}.email`} label="Email" />
              </>
            )}
          </FormBuilder.FieldArray>
        </FormBuilder.Section>

      </FormBuilder>

      <SubmitResult result={result} />
    </div>
  );
}
