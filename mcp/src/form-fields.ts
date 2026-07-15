/**
 * The FormBuilder field map — the deterministic part of `create-form`.
 *
 * An AI asked for "price (currency), role (select)" has to land on the right
 * `FormBuilder.*` static every time. Guessing from prose is where models drift, so
 * the mapping lives here as data: each entry declares its aliases (what a human
 * might call it), its value shape, and the extra props it needs.
 *
 * `FIELD_TYPES[].static` is kept honest by a test that reads the real
 * `Object.assign(FormBuilderRoot, { … })` block in form-builder.tsx — a static that
 * doesn't exist there fails the build.
 */

export interface FieldSpec {
  /** The `FormBuilder.<static>` component name. */
  static: string;
  /** The value shape `onSubmit` receives, for the zod schema. */
  value: string;
  /** Zod snippet for this value shape. */
  zod: string;
  /** Words a human might use for this field. Matched longest-first. */
  aliases: string[];
  /** Extra props the field requires beyond name/label. */
  props?: string;
  /** Needs an `options` array. */
  options?: boolean;
  note?: string;
}

/** Ordered: earlier entries win an ambiguous alias match. */
export const FIELD_TYPES: FieldSpec[] = [
  { static: "Email", value: "string", zod: "z.string().email('Enter a valid email')", aliases: ["email", "e-mail"] },
  { static: "Password", value: "string", zod: "z.string().min(8, 'At least 8 characters')", aliases: ["password", "pass"], props: "strengthMeter", note: "`strengthMeter` shows a PasswordLevel meter." },
  { static: "Currency", value: "number", zod: "z.number().positive('Must be positive').optional()", aliases: ["currency", "price", "amount", "cost", "money", "total", "salary", "fee"], props: 'currencySymbol="$"' },
  { static: "Number", value: "number", zod: "z.number().optional()", aliases: ["number", "numeric", "qty", "quantity", "count", "age", "rate", "percent"] },
  { static: "Textarea", value: "string", zod: "z.string()", aliases: ["textarea", "description", "notes", "bio", "comment", "message", "long text"], props: "fullWidth" },
  { static: "RichText", value: "OutputData", zod: "z.any().optional()", aliases: ["richtext", "rich text", "editor", "wysiwyg", "content", "body"], props: "fullWidth" },
  { static: "SearchableSelect", value: "string", zod: "z.string()", aliases: ["searchable select", "searchable-select", "combobox", "autocomplete", "async select"], options: true },
  { static: "MultiSelect", value: "string[]", zod: "z.array(z.string())", aliases: ["multiselect", "multi-select", "multi select", "tags", "labels", "categories"], options: true },
  { static: "RadioCards", value: "string", zod: "z.string()", aliases: ["radio cards", "radio-cards", "cards", "plan picker"], options: true, note: "Options may carry a `description`." },
  { static: "Radio", value: "string", zod: "z.string()", aliases: ["radio", "radio group", "choice"], options: true },
  { static: "Segmented", value: "string", zod: "z.string()", aliases: ["segmented", "tab switch", "segment"], options: true },
  { static: "ToggleGroup", value: "string | string[]", zod: "z.array(z.string())", aliases: ["toggle group", "toggle-group", "button group"], options: true, props: "multiple" },
  { static: "Select", value: "string", zod: "z.string().min(1, 'Required')", aliases: ["select", "dropdown", "drop-down", "picker", "role", "category", "status", "type"], options: true },
  { static: "Checkbox", value: "boolean", zod: "z.boolean()", aliases: ["checkbox", "check", "agree", "accept", "terms", "consent"] },
  { static: "Switch", value: "boolean", zod: "z.boolean()", aliases: ["switch", "toggle", "active", "enabled"] },
  { static: "ToggleButton", value: "boolean", zod: "z.boolean()", aliases: ["toggle button", "toggle-button"] },
  { static: "DateRange", value: "{ from, to }", zod: "z.any().optional()", aliases: ["date range", "date-range", "range of dates", "period"] },
  { static: "DateMultiple", value: "Date[]", zod: "z.array(z.date()).optional()", aliases: ["multi date", "multiple dates", "multi-date"] },
  { static: "DateTime", value: "Date", zod: "z.date().optional()", aliases: ["datetime", "date & time", "date and time", "timestamp"] },
  { static: "InlineCalendar", value: "Date", zod: "z.date().optional()", aliases: ["inline calendar", "calendar"] },
  { static: "Date", value: "Date", zod: "z.date().optional()", aliases: ["date", "due", "birthday", "dob", "deadline"] },
  { static: "Phone", value: "string", zod: "z.string().optional()", aliases: ["phone", "tel", "mobile", "telephone"] },
  { static: "Otp", value: "string", zod: "z.string().optional()", aliases: ["otp", "pin", "code", "verification"], props: "length={6}" },
  { static: "Slider", value: "number | [number, number]", zod: "z.number()", aliases: ["slider", "volume", "range slider"], props: "min={0} max={100}" },
  { static: "Color", value: "hex string", zod: "z.string()", aliases: ["color", "colour", "swatch"] },
  { static: "Signature", value: "PNG data-URL string", zod: "z.string()", aliases: ["signature", "sign"] },
  { static: "TreeSelect", value: "node id (string)", zod: "z.string()", aliases: ["tree select", "tree-select", "hierarchy", "nested category"], props: "nodes={TREE} getNodeId={(n) => n.id} getNodeLabel={(n) => n.name}" },
  { static: "Image", value: "File | File[]", zod: "z.any().optional()", aliases: ["image", "photo", "avatar", "picture", "logo"], props: 'accept="image/*"' },
  { static: "File", value: "File | File[]", zod: "z.any().optional()", aliases: ["file", "upload", "attachment", "document"] },
  { static: "FieldArray", value: "object[]", zod: "z.array(z.object({}))", aliases: ["field array", "field-array", "repeater", "line items", "items", "list of"], note: "Render fn: `{(rowName) => <FormBuilder.Text name={`${rowName}.x`} />}`" },
  { static: "Custom", value: "anything", zod: "z.any()", aliases: ["custom"], props: "render={({ field }) => <YourControl {...field} />}" },
  { static: "Text", value: "string", zod: "z.string().min(1, 'Required')", aliases: ["text", "string", "name", "title", "label"] },
];

export interface ParsedField {
  /** camelCase RHF path. */
  name: string;
  /** Human label. */
  label: string;
  spec: FieldSpec;
  /** The explicit "(hint)" the user gave, if any. */
  hint?: string;
  /** True when we fell back to Text because nothing matched. */
  guessed: boolean;
}

function toCamel(s: string): string {
  const parts = s.trim().split(/[\s_-]+/).filter(Boolean);
  if (parts.length === 0) return "field";
  return (
    parts[0].toLowerCase() +
    parts.slice(1).map((p) => p[0].toUpperCase() + p.slice(1).toLowerCase()).join("")
  );
}

function toLabel(s: string): string {
  const t = s.trim().replace(/[_-]+/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Longest alias first, so "multi select" beats "select" and "date range" beats "date".
 *
 * Matching is on WORD BOUNDARIES, not substrings: a plain `includes` made "customer"
 * match the `custom` alias (→ FormBuilder.Custom) and "notes" match `note`. Anything
 * that isn't a whole word is not a match.
 */
const MATCHERS = FIELD_TYPES.flatMap((spec) =>
  spec.aliases.map((alias) => ({
    alias,
    re: new RegExp(`(^|[^a-z0-9])${escape(alias.toLowerCase())}([^a-z0-9]|$)`, "i"),
    spec,
  })),
).sort((a, b) => b.alias.length - a.alias.length);

function matchSpec(text: string): FieldSpec | undefined {
  // Split camelCase so `dueDate` / `unitPrice` still match `date` / `price`.
  const t = text.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  return MATCHERS.find((m) => m.re.test(t))?.spec;
}

/**
 * Parse a fields string like:
 *   "name, email, price (currency), role (select), agree (checkbox)"
 *
 * An explicit "(hint)" always wins. Otherwise the field's own name is used as the
 * hint (so a bare `email` still becomes `FormBuilder.Email`). Nothing matched →
 * Text, flagged as a guess so the caller can see it.
 */
export function parseFields(input: string): ParsedField[] {
  return input
    .split(/[,\n;]+/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((raw) => {
      const m = raw.match(/^(.*?)\s*[([]([^)\]]+)[)\]]\s*$/);
      const rawName = (m ? m[1] : raw).trim();
      const hint = m ? m[2].trim() : undefined;

      // An explicit hint wins; otherwise infer from the field's own name.
      const spec = (hint ? matchSpec(hint) : undefined) ?? matchSpec(rawName);
      const fallback = FIELD_TYPES.find((f) => f.static === "Text")!;

      return {
        name: toCamel(rawName),
        label: toLabel(rawName),
        spec: spec ?? fallback,
        hint,
        guessed: !spec,
      };
    });
}

/** `<FormBuilder.Currency name="price" label="Price" currencySymbol="$" />` */
export function fieldJsx(f: ParsedField): string {
  const parts = [`name="${f.name}"`, `label="${f.label}"`];
  if (f.spec.options) parts.push(`options={${f.name.toUpperCase()}_OPTIONS}`);
  if (f.spec.props) parts.push(f.spec.props);
  return `<FormBuilder.${f.spec.static} ${parts.join(" ")} />`;
}

/** `name: z.string().min(1, 'Required'),` */
export function zodLine(f: ParsedField): string {
  return `  ${f.name}: ${f.spec.zod},`;
}

/** The "which field do I use?" table — the thing models get wrong without help. */
export function mappingTable(fields: ParsedField[]): string {
  const rows = fields
    .map(
      (f) =>
        `| \`${f.name}\` | ${f.hint ? `\`${f.hint}\`` : "_(inferred)_"} | \`FormBuilder.${f.spec.static}\` | \`${f.spec.value}\` |` +
        (f.guessed ? " ⚠️ guessed" : ""),
    )
    .join("\n");
  return `| Field | You said | Component | Value |\n|---|---|---|---|\n${rows}`;
}

export interface FormOptions {
  layout: "single" | "stepper";
  display: "page" | "drawer";
  summary: boolean;
}

/**
 * A complete, compiling starting point wired to the requested shape. Everything a
 * model would otherwise have to reconstruct from prose — the hoisted `useForm` when a
 * summary is present, the `id`/`form={id}` handshake for a drawer's header Save, the
 * `childrenOutside` slot — is already correct here.
 */
export function skeleton(fields: ParsedField[], opts: FormOptions): string {
  const { layout, display, summary } = opts;
  const optionConsts = fields
    .filter((f) => f.spec.options)
    .map((f) => `const ${f.name.toUpperCase()}_OPTIONS = [\n  { label: 'Option A', value: 'a' },\n  { label: 'Option B', value: 'b' },\n]`)
    .join("\n");

  const imports = [
    `'use client'`,
    ``,
    `import { z } from 'zod'`,
    `import { zodResolver } from '@hookform/resolvers/zod'`,
    summary ? `import { useForm } from 'react-hook-form'` : ``,
    `import { FormBuilder } from '@/components/FormBuilder'`,
    display === "drawer" ? `import { FormDrawer } from '@/components/FormRenderer'` : ``,
    summary ? `import { FormSummary } from '@/components/FormSummary'` : ``,
    display === "drawer" ? `import { Button } from '@/components/Button'` : ``,
  ]
    .filter(Boolean)
    .join("\n");

  const schema = [
    `const schema = z.object({`,
    ...fields.map(zodLine),
    `})`,
    `type Values = z.infer<typeof schema>`,
    ``,
    `const DEFAULTS: Values = {`,
    ...fields.map((f) => `  ${f.name}: ${defaultFor(f)},`),
    `}`,
  ].join("\n");

  const fieldJsxLines = fields.map((f) => `        ${fieldJsx(f)}`).join("\n");

  const body =
    layout === "stepper"
      ? [
          `      <FormBuilder.Stepper>`,
          `        <FormBuilder.Step title="Step 1">`,
          `          <FormBuilder.Section title="Details" color="Blue">`,
          fields.map((f) => `            ${fieldJsx(f)}`).join("\n"),
          `          </FormBuilder.Section>`,
          `        </FormBuilder.Step>`,
          `        {/* Add more <FormBuilder.Step title="…"> — Submit shows on the last one. */}`,
          `      </FormBuilder.Stepper>`,
        ].join("\n")
      : [
          `      <FormBuilder.Section title="Details" color="Blue">`,
          fieldJsxLines,
          `      </FormBuilder.Section>`,
          layout === "single" && display !== "drawer"
            ? `\n      <FormBuilder.Submit loadingText="Saving…">Save</FormBuilder.Submit>`
            : ``,
        ]
          .filter(Boolean)
          .join("\n");

  // The form must be hoisted when a summary reads the same values from outside it.
  const formProp = summary ? `form={form}` : ``;
  const rhfProps = summary
    ? `${formProp} onSubmit={onSubmit} loading={saving}`
    : `onSubmit={onSubmit} loading={saving} resolver={zodResolver(schema)} defaultValues={DEFAULTS}`;

  const summaryPanel = summary
    ? [
        `<FormSummary form={form} title="Summary" subtitle="Total">`,
        `  <FormSummary.Group title="Total">`,
        `    {/* compute(values) runs against the LIVE form values */}`,
        `    <FormSummary.Row label="Subtotal" compute={(v) => subTotal(v)} />`,
        `    <FormSummary.Row label="Overall Total" emphasized compute={(v) => overallTotal(v)} />`,
        `  </FormSummary.Group>`,
        `</FormSummary>`,
      ].join("\n")
    : "";

  const hoisted = summary
    ? [
        ``,
        `  // Hoisted so the FormSummary beside the form can read the same live values.`,
        `  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: DEFAULTS })`,
      ].join("\n")
    : "";

  if (display === "drawer") {
    return [
      imports,
      ``,
      schema,
      optionConsts ? `\n${optionConsts}` : ``,
      ``,
      `const FORM_ID = 'my-form'`,
      ``,
      `export function MyFormDrawer({ open, setOpen, onSubmit, saving }: Props) {${hoisted}`,
      ``,
      `  return (`,
      `    <FormDrawer`,
      `      open={open}`,
      `      onOpenChange={setOpen}`,
      `      title="New record"`,
      `      badge="New"`,
      `      // The header sits OUTSIDE the <form>, so Save submits it via form={FORM_ID}.`,
      `      actions={<Button type="submit" form={FORM_ID} variant="PrimeStyle" is_loading={saving}>Save</Button>}`,
      summary
        ? `      // Renders OUTSIDE the drawer panel, beside it.\n      childrenOutside={\n${indent(summaryPanel, 8)}\n      }`
        : ``,
      `    >`,
      `      <FormBuilder id={FORM_ID} ${rhfProps} fieldDirection="vertical">`,
      indent(body, 0),
      `      </FormBuilder>`,
      `    </FormDrawer>`,
      `  )`,
      `}`,
    ]
      .filter((l) => l !== ``)
      .join("\n");
  }

  return [
    imports,
    ``,
    schema,
    optionConsts ? `\n${optionConsts}` : ``,
    ``,
    `export function MyForm({ onSubmit, saving }: Props) {${hoisted}`,
    ``,
    `  return (`,
    summary ? `    <div className="flex items-start gap-4">` : ``,
    `    <FormBuilder ${rhfProps}${summary ? ` className="min-w-0 flex-1"` : ``}>`,
    `      <FormBuilder.Header title="New record" variant="new">`,
    `        <FormBuilder.Submit loadingText="Saving…">Save</FormBuilder.Submit>`,
    `      </FormBuilder.Header>`,
    ``,
    body,
    `    </FormBuilder>`,
    summary ? `\n${indent(summaryPanel, 4)}\n    </div>` : ``,
    `  )`,
    `}`,
  ]
    .filter((l) => l !== ``)
    .join("\n");
}

function indent(block: string, n: number): string {
  const pad = " ".repeat(n);
  return block
    .split("\n")
    .map((l) => (l ? pad + l : l))
    .join("\n");
}

function defaultFor(f: ParsedField): string {
  const v = f.spec.value;
  if (v === "boolean") return "false";
  if (v === "number") return "undefined";
  if (v.endsWith("[]")) return "[]";
  if (v === "Date" || v.startsWith("File") || v === "OutputData" || v.startsWith("{")) return "undefined";
  if (f.spec.static === "FieldArray") return "[]";
  return "''";
}

