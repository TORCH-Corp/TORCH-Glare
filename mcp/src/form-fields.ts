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

/**
 * Every entry's `static` is a real `FormBuilder.*` component — kept honest by the drift
 * test in server.test.ts, which diffs this list against the `Object.assign(FormBuilderRoot,
 * { … })` block in form-builder.tsx. Ordering only breaks ties between equal-length aliases
 * (matching is longest-alias-first); keep `Text` last as the catch-all fallback.
 */
export const FIELD_TYPES: FieldSpec[] = [
  {
    static: "Email",
    value: "string",
    zod: "z.string().email('Enter a valid email')",
    aliases: ["email", "e-mail"],
  },
  {
    static: "Password",
    value: "string",
    zod: "z.string().min(8, 'At least 8 characters')",
    aliases: ["password", "pass"],
    props: "strengthMeter",
    note: "`strengthMeter` shows a PasswordLevel meter.",
  },
  {
    static: "Currency",
    value: "number",
    zod: "z.number().positive('Must be positive').optional()",
    aliases: ["currency", "price", "amount", "cost", "money", "total", "salary", "fee"],
    props: 'currencySymbol="$"',
  },
  {
    static: "Number",
    value: "number",
    zod: "z.number().optional()",
    aliases: ["number", "numeric", "qty", "quantity", "count", "age", "rate", "percent"],
  },
  {
    static: "Textarea",
    value: "string",
    zod: "z.string()",
    aliases: ["textarea", "description", "notes", "bio", "comment", "message", "long text"],
    props: "fullWidth",
  },
  {
    static: "RichText",
    value: "OutputData",
    zod: "z.any().optional()",
    aliases: ["richtext", "rich text", "editor", "wysiwyg", "content", "body"],
    props: "fullWidth",
  },
  {
    static: "SearchableSelect",
    value: "string",
    zod: "z.string().min(1, 'Required')",
    aliases: ["searchable select", "searchable-select", "combobox", "autocomplete", "async select"],
    options: true,
  },
  {
    static: "MultiSelect",
    value: "string[]",
    zod: "z.array(z.string())",
    aliases: ["multiselect", "multi-select", "multi select", "tags", "labels", "categories"],
    options: true,
    note: "Also available as `FormBuilder.Tags` (same value).",
  },
  {
    static: "RadioCards",
    value: "string",
    zod: "z.string()",
    aliases: ["radio cards", "radio-cards", "cards", "plan picker"],
    options: true,
    note: "Options may carry a `description`.",
  },
  {
    static: "RadioList",
    value: "string",
    zod: "z.string().min(1, 'Required')",
    aliases: [
      "radio list",
      "radio-list",
      "radio",
      "radio group",
      "choice",
      "single choice",
      "segmented",
      "segment",
    ],
    options: true,
    note: "Boxed single-select list; each option may carry a `description`.",
  },
  {
    static: "CheckboxGroup",
    value: "string[]",
    zod: "z.array(z.string())",
    aliases: [
      "checkbox group",
      "checkbox-group",
      "checklist",
      "permissions",
      "multi checkbox",
      "button group",
    ],
    options: true,
  },
  {
    static: "Select",
    value: "string",
    zod: "z.string().min(1, 'Required')",
    aliases: ["select", "dropdown", "drop-down", "picker", "role", "category", "status", "type"],
    options: true,
  },
  {
    static: "Checkbox",
    value: "boolean",
    zod: "z.boolean()",
    aliases: ["checkbox", "check", "agree", "accept", "terms", "consent"],
  },
  {
    static: "SwitchBox",
    value: "boolean",
    zod: "z.boolean()",
    aliases: [
      "switch box",
      "switchbox",
      "switch",
      "toggle",
      "toggle button",
      "active",
      "enabled",
      "dark mode",
    ],
    note: "A `Switch` inside a field box; takes an optional inline `subLabel`.",
  },
  {
    static: "DateRange",
    value: "{ from, to }",
    zod: "z.object({ from: z.date(), to: z.date() }).optional()",
    aliases: ["date range", "date-range", "range of dates", "period"],
  },
  {
    static: "DateMultiple",
    value: "Date[]",
    zod: "z.array(z.date()).optional()",
    aliases: ["multi date", "multiple dates", "multi-date"],
  },
  {
    static: "DateTime",
    value: "Date",
    zod: "z.date().optional()",
    aliases: ["datetime", "date & time", "date and time", "timestamp"],
  },
  {
    static: "Date",
    value: "Date",
    zod: "z.date().optional()",
    aliases: ["date", "due", "birthday", "dob", "deadline", "calendar"],
  },
  {
    static: "Phone",
    value: "string",
    zod: "z.string().optional()",
    aliases: ["phone", "tel", "mobile", "telephone"],
    note: "Country dial-code + number; defaults to `+964` (override with `defaultCountry`). Inside a `FormBuilder.Table` cell it collapses to a plain number input — no dial-code picker, and `defaultCountry` does not apply; add a separate column if the table needs the code.",
  },
  {
    static: "Otp",
    value: "string",
    zod: "z.string().optional()",
    aliases: ["otp", "pin", "code", "verification"],
    props: "length={6}",
  },
  {
    static: "Slider",
    value: "number",
    zod: "z.number()",
    aliases: ["slider", "volume", "range slider"],
    props: "min={0} max={100}",
    note: 'Add `range` for a `[min,max]` value, `suffix` for a unit label (e.g. `suffix="%"`).',
  },
  {
    static: "Color",
    value: "hex string",
    zod: "z.string()",
    aliases: ["color", "colour", "swatch"],
  },
  {
    static: "Signature",
    value: "PNG data-URL string",
    zod: "z.string()",
    aliases: ["signature", "sign"],
  },
  {
    static: "TreeSelect",
    value: "node id (string)",
    zod: "z.string()",
    aliases: ["tree select", "tree-select", "hierarchy", "nested category"],
    props: "nodes={TREE} getNodeId={(n) => n.id} getNodeLabel={(n) => n.name}",
  },
  {
    static: "Image",
    value: "File | File[]",
    zod: "z.any().optional()",
    aliases: ["image", "photo", "avatar", "picture", "logo"],
    props: 'accept="image/*"',
  },
  {
    static: "File",
    value: "File | File[]",
    zod: "z.any().optional()",
    aliases: ["file", "upload", "attachment", "document"],
  },
  {
    static: "FieldArray",
    value: "object[]",
    zod: "z.array(z.object({}))",
    aliases: ["field array", "field-array", "repeater", "line items", "items", "list of"],
    note: "Render fn: `{(rowName) => <FormBuilder.Text name={`${rowName}.x`} />}`",
  },
  {
    static: "Table",
    value: "object[]",
    zod: "z.array(z.object({})).min(1, 'Add at least one row')",
    aliases: ["table", "grid", "data grid", "data-grid", "editable table", "spreadsheet"],
    note: "Editable grid: each column's `cell` renders any FormBuilder.* field; supports `selectable` / `reorderable`. Renders its own `SectionBlock variant='Table'` (the full-bleed table shell) — place it as a top-level child, NOT inside a FormBuilder.Section. Give EVERY column a `width` so the table uses fixed layout and honours them.",
  },
  {
    static: "Custom",
    value: "anything",
    zod: "z.any()",
    aliases: ["custom"],
    props: "render={({ field }) => <YourControl {...field} />}",
  },
  {
    static: "Text",
    value: "string",
    zod: "z.string().min(1, 'Required')",
    aliases: ["text", "string", "name", "title", "label"],
  },
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
  const parts = s
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean);
  if (parts.length === 0) return "field";
  return (
    parts[0].toLowerCase() +
    parts
      .slice(1)
      .map((p) => p[0].toUpperCase() + p.slice(1).toLowerCase())
      .join("")
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
  // A Table is a grid, not a one-line field — emit a compiling `columns` skeleton.
  if (f.spec.static === "Table") return tableJsx(f);
  const parts = [`name="${f.name}"`, `label="${f.label}"`];
  if (f.spec.options) parts.push(`options={${f.name.toUpperCase()}_OPTIONS}`);
  if (f.spec.props) parts.push(f.spec.props);
  return `<FormBuilder.${f.spec.static} ${parts.join(" ")} />`;
}

/**
 * `FormBuilder.Table` — a compiling starting point. Each column's `cell` renders any
 * `FormBuilder.*` field for a row (name it `${rowName}.<key>`); add/remove columns to taste.
 * The Table renders its own `SectionBlock`, so `skeleton()` places it OUTSIDE the fields Section.
 */
function tableJsx(f: ParsedField): string {
  return [
    `<FormBuilder.Table`,
    `  name="${f.name}"`,
    `  title="${f.label}"`,
    `  addLabel="Add row"`,
    `  defaultItem={{ label: '', qty: 1 }}`,
    `  columns={[`,
    // Every column carries a `width`: FormBuilder.Table only switches to `table-layout: fixed`
    // when all of them do, and without that the browser treats each width as a hint and lets
    // cell content widen the column instead.
    "    { header: 'Label', width: 240, cell: (row) => <FormBuilder.Text name={`${row}.label`} required /> },",
    "    { header: 'Qty', width: 120, cell: (row) => <FormBuilder.Number name={`${row}.qty`} required /> },",
    `  ]}`,
    `/>`,
  ].join("\n");
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
 * A complete, compiling starting point wired to the requested shape, built the way the real
 * example pages are (`apps/app/form-builder/**`): `FormRenderer` owns the page-vs-drawer
 * display and the title header, and the Save is composed and passed via its `actions` prop; a
 * `FormSummary` panel is passed via the `summary` prop and reads the same hoisted `useForm`.
 * Everything a model tends to get wrong by hand — the hoisted form shared with the summary, the
 * drawer's `open`/`onOpenChange`, the stepper wrapper, a `Table` placed outside the Section — is
 * already correct here.
 */
export function skeleton(fields: ParsedField[], opts: FormOptions): string {
  const { layout, display, summary } = opts;
  const drawer = display === "drawer";

  const optionConsts = fields
    .filter((f) => f.spec.options)
    .map(
      (f) =>
        `const ${f.name.toUpperCase()}_OPTIONS = [\n  { label: 'Option A', value: 'a' },\n  { label: 'Option B', value: 'b' },\n]`,
    )
    .join("\n");

  const imports = [
    `'use client'`,
    ``,
    `import { z } from 'zod'`,
    `import { zodResolver } from '@hookform/resolvers/zod'`,
    summary ? `import { useForm } from 'react-hook-form'` : ``,
    `import { FormBuilder } from '@/components/FormBuilder'`,
    `import { FormRenderer } from '@/components/FormRenderer'`,
    summary ? `import { FormSummary } from '@/components/FormSummary'` : ``,
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

  // Plain fields group in a Section; a Table renders its own SectionBlock, so it sits OUTSIDE
  // the Section as a top-level sibling (still inside the Step, for a stepper).
  const tableFields = fields.filter((f) => f.spec.static === "Table");
  const plainFields = fields.filter((f) => f.spec.static !== "Table");

  const sectionBlock = plainFields.length
    ? [
        `      <FormBuilder.Section title="Details" color="Blue">`,
        plainFields.map((f) => `        ${fieldJsx(f)}`).join("\n"),
        `      </FormBuilder.Section>`,
      ].join("\n")
    : "";
  const tableBlocks = tableFields.map((f) => indent(fieldJsx(f), 6)).join("\n");
  const section = [sectionBlock, tableBlocks].filter(Boolean).join("\n");

  const body =
    layout === "stepper"
      ? [
          `      <FormBuilder.Stepper>`,
          `        <FormBuilder.Step title="Step 1">`,
          indent(section, 4),
          `        </FormBuilder.Step>`,
          `        {/* Add more <FormBuilder.Step title="…"> */}`,
          `      </FormBuilder.Stepper>`,
        ].join("\n")
      : section;

  const summaryPanel = [
    `<FormSummary form={form} title="Summary" subtitle="Total">`,
    `  <FormSummary.Group title="Total">`,
    `    {/* compute(values) runs against the LIVE form values */}`,
    `    <FormSummary.Row label="Subtotal" compute={(v) => subTotal(v)} />`,
    `    <FormSummary.Row label="Overall Total" emphasized compute={(v) => overallTotal(v)} />`,
    `  </FormSummary.Group>`,
    `</FormSummary>`,
  ].join("\n");

  // FormRenderer props, one per line. With a summary the form is hoisted and shared;
  // otherwise FormRenderer owns resolver/defaultValues itself.
  const rendererProps = [
    summary ? `form={form}` : null,
    `onSubmit={onSubmit}`,
    `loading={saving}`,
    summary ? null : `resolver={zodResolver(schema)}`,
    summary ? null : `defaultValues={DEFAULTS}`,
    drawer ? `display="drawer"` : null,
    drawer ? `open={open}` : null,
    drawer ? `onOpenChange={setOpen}` : null,
    `header={{ title: 'New record', variant: 'new' }}`,
    `actions={<FormBuilder.Submit>Save</FormBuilder.Submit>}`,
  ]
    .filter(Boolean)
    .map((p) => `      ${p}`);

  if (summary) {
    rendererProps.push(`      summary={`, indent(summaryPanel, 8), `      }`);
  }

  const renderer = [
    `    <FormRenderer<Values>`,
    ...rendererProps,
    `    >`,
    body,
    `    </FormRenderer>`,
  ].join("\n");

  // Hoist useForm only when a summary beside the form must read the same live values.
  const hoisted = summary
    ? `\n  // Hoisted so the FormSummary beside the form reads the same live values.\n  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: DEFAULTS })\n`
    : ``;

  const compName = drawer ? "MyFormDrawer" : "MyForm";
  const compArgs = drawer
    ? `{ open, setOpen, onSubmit, saving }: Props`
    : `{ onSubmit, saving }: Props`;

  const out = [imports, ``, schema];
  if (optionConsts) out.push(``, optionConsts);
  out.push(
    ``,
    `export function ${compName}(${compArgs}) {${hoisted}`,
    `  return (`,
    renderer,
    `  )`,
    `}`,
  );
  return out.join("\n");
}

/**
 * A display-only **detail page** starting point — `FormRenderer` in detail-tabs mode (NOT a form).
 * A left sidebar swaps `FormRenderer.Tab` panels; **every tab's content is `FormBuilder.Section`
 * blocks**. Inside a Section you use either the default `FormRenderer.Grid` + `FormRenderer.Row`
 * display cells, or your OWN component — anything renders inside a Section. No resolver, no submit.
 *
 * The parsed `fields` become the label/value `Row`s of the first ("Overview") tab; a second tab is
 * scaffolded with a custom component to show both paths.
 */
export function detailSkeleton(fields: ParsedField[]): string {
  const rows =
    fields
      .map((f) => `            <FormRenderer.Row label="${f.label}" value={record.${f.name}} />`)
      .join("\n") || `            <FormRenderer.Row label="Field" value={record.value} />`;

  const imports = [
    `'use client'`,
    ``,
    `import { FormBuilder } from '@/components/FormBuilder'`,
    `import { FormRenderer } from '@/components/FormRenderer'`,
    `import { Button } from '@/components/Button'`,
  ].join("\n");

  const body = [
    `export function RecordDetail({ record }: { record: any }) {`,
    `  return (`,
    `    <FormRenderer`,
    `      className="min-h-0 flex-1"`,
    `      header={{ title: 'Record DE-344', variant: 'detail' }}`,
    `      actions={`,
    `        <>`,
    `          <Button variant="BorderStyle">Print</Button>`,
    `          <Button>Approve</Button>`,
    `        </>`,
    `      }`,
    `    >`,
    `      {/* The sidebar rail — one Item per tab, tied to a Tab by \`value\`. */}`,
    `      <FormRenderer.Sidebar>`,
    `        <FormRenderer.Sidebar.Item value="overview" icon={<i className="ri-layout-grid-line" />}>`,
    `          Overview`,
    `        </FormRenderer.Sidebar.Item>`,
    `        <FormRenderer.Sidebar.Item value="activity" icon={<i className="ri-pulse-line" />}>`,
    `          Activity log`,
    `        </FormRenderer.Sidebar.Item>`,
    `      </FormRenderer.Sidebar>`,
    ``,
    `      {/* Every tab's content MUST be wrapped in FormBuilder.Section blocks. */}`,
    `      <FormRenderer.Tab value="overview">`,
    `        <FormBuilder.Section title="Details" color="Blue">`,
    `          {/* Default display cells — or drop your OWN component in place of Row. */}`,
    `          <FormRenderer.Grid columns={2}>`,
    rows,
    `          </FormRenderer.Grid>`,
    `        </FormBuilder.Section>`,
    `      </FormRenderer.Tab>`,
    ``,
    `      <FormRenderer.Tab value="activity">`,
    `        <FormBuilder.Section title="Activity log" color="Green">`,
    `          {/* Bring your own component — anything renders inside a Section. */}`,
    `          <YourTimeline items={record.activity} />`,
    `        </FormBuilder.Section>`,
    `      </FormRenderer.Tab>`,
    `    </FormRenderer>`,
    `  )`,
    `}`,
  ].join("\n");

  return [imports, ``, body].join("\n");
}

export interface CreateFormArgs {
  fields: string;
  layout?: "single" | "stepper" | "detail";
  display?: "page" | "drawer";
  summary?: boolean;
  /** The RULES banner the server prepends to code-emitting output. */
  rulesHint?: string;
}

/**
 * Build the full `create-form` tool response (markdown). Pure — factored out of the server handler so
 * it's unit-testable. Routes `layout:"detail"` to a display-only detail page (no form), otherwise emits
 * the field-mapping + wired FormBuilder/FormRenderer starting point.
 */
export function buildCreateForm({
  fields,
  layout = "single",
  display = "page",
  summary = false,
  rulesHint = "",
}: CreateFormArgs): string {
  const parsed = parseFields(fields);
  if (parsed.length === 0) {
    return "No fields parsed. Pass e.g. `name, email, price (currency)`.";
  }

  // A detail page is a display view, not a form — no field mapping / zod / submit. It renders
  // FormRenderer in detail-tabs mode: a sidebar swapping FormBuilder.Section panels.
  if (layout === "detail") {
    const installs = ["FormBuilder", "FormRenderer", "Button"]
      .map((i) => `npx torch-glare add ${i}`)
      .join("\n");

    return [
      rulesHint.trim(),
      ``,
      `# Detail page: ${parsed.length} field(s) — display-only (sidebar tabs)`,
      ``,
      `A **detail page** is a display view, not a form. It's \`FormRenderer\` in detail-tabs mode: a` +
        ` left **sidebar** swaps \`FormRenderer.Tab\` panels, and **every tab's content is wrapped in** ` +
        `\`FormBuilder.Section\` **blocks**. Inside a Section, use the default \`FormRenderer.Grid\` +` +
        ` \`FormRenderer.Row\` display cells, or drop in **your own component** — anything renders inside` +
        ` a Section. No \`onSubmit\`, no resolver, no \`useState\`.`,
      ``,
      `## 1. Install`,
      ``,
      "```bash",
      installs,
      "```",
      ``,
      `## 2. Starting point`,
      ``,
      "```tsx",
      detailSkeleton(parsed),
      "```",
      ``,
      `## 3. Fill in the gaps`,
      ``,
      `- Each \`FormRenderer.Sidebar.Item value\` must match a \`FormRenderer.Tab value\` — that pairing is the tab switch. The first tab is active by default.`,
      `- **Content must live in \`FormBuilder.Section\` blocks.** Inside one: use \`FormRenderer.Grid\` + \`FormRenderer.Row\` for label/value cells, OR render your own component (a table, timeline, chart …).`,
      `- \`FormRenderer.Grid\` takes \`columns\` (1–3, default 2) and spans full width; \`FormRenderer.Row\` takes \`label\` + \`value\` (any node — text, a \`Badge\`, etc.).`,
      `- Add more \`Sidebar.Item\` + \`Tab\` pairs for Items / Matching / Documents / … . \`variant="detail"\` gives the header a "View" badge; put page actions (Print / Approve) in \`actions\`.`,
      `- Need an **editable** form instead? Re-call \`create-form\` without \`layout="detail"\`.`,
      ``,
      `Full reference: \`get-component-docs "form-renderer"\` — the "Detail tabs" section.`,
    ]
      .filter((l) => l !== ``)
      .join("\n");
  }

  const items = ["FormBuilder", "FormRenderer", ...(summary ? ["FormSummary"] : [])];
  const installs = items.map((i) => `npx torch-glare add ${i}`).join("\n");
  const guessed = parsed.filter((f) => f.guessed);

  const notes = [...new Set(parsed.map((f) => f.spec.note).filter(Boolean) as string[])].map(
    (n) => `- ${n}`,
  );

  return [
    rulesHint.trim(),
    ``,
    `# Form: ${parsed.length} field(s) — ${layout} / ${display}${summary ? " / with summary panel" : ""}`,
    ``,
    `## 1. Field mapping`,
    ``,
    mappingTable(parsed),
    ``,
    guessed.length
      ? `> ⚠️ No type hint matched for ${guessed.map((f) => `\`${f.name}\``).join(", ")} — defaulted to \`FormBuilder.Text\`. Re-call with an explicit hint, e.g. \`${guessed[0].name} (select)\`, if that's wrong.`
      : ``,
    notes.length ? `\n${notes.join("\n")}` : ``,
    ``,
    `## 2. Install`,
    ``,
    "```bash",
    installs,
    `npm install zod @hookform/resolvers   # validation is resolver-agnostic; bring your own`,
    "```",
    ``,
    `## 3. Starting point`,
    ``,
    "```tsx",
    skeleton(parsed, { layout, display, summary }),
    "```",
    ``,
    `## 4. Fill in the gaps`,
    ``,
    ...[
      `- Replace the placeholder \`*_OPTIONS\` arrays and tighten the zod schema (messages, required/optional).`,
      summary
        ? `- Write the \`compute(values)\` functions as plain functions of the form values (\`subTotal\`, \`overallTotal\`, …). They run against the **live** values, so totals update as the user types.`
        : ``,
      summary
        ? `- The form is **hoisted** (\`useForm\` in the component), so a remount \`key\` no longer resets it — call \`form.reset(DEFAULTS)\` instead.`
        : ``,
      display === "drawer"
        ? `- \`FormRenderer\` (with \`display="drawer"\`) places the Save action in the drawer header and lays any \`summary\` in the tray — just drive it with \`open\` / \`onOpenChange\`.`
        : ``,
      `- \`FormBuilder.Section\` also takes \`icon\`, \`action\` (right-aligned buttons on the title row) and \`variant\` — \`variant="Table"\` is the full-bleed table shell.`,
      `- Use \`required\` on fields — never type a literal "*".`,
      `- Never hand-wire \`FormField\`/\`FormItem\`/\`FormControl\`/\`InputField\` rows, and never hold field state in \`useState\`.`,
    ].filter(Boolean),
    ``,
    `Full reference: call \`get-guide "forms-with-form-builder"\` (steppers, drawers, editing records, totals, gotchas) or \`get-component-docs "form-builder"\` for every field type.`,
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
  if (v === "Date" || v.startsWith("File") || v === "OutputData" || v.startsWith("{"))
    return "undefined";
  if (f.spec.static === "FieldArray") return "[]";
  return "''";
}
