/** Plain data (no "use client") so server components can import it directly. */
export const EXAMPLES = [
  {
    href: "/form-builder/single",
    title: "Single form",
    blurb: "Fields wrapped in FormRenderer, load a record to edit.",
  },
  {
    href: "/form-builder/bare",
    title: "Bare FormBuilder",
    blurb: "Just the fields, no chrome — what an embedded form looks like.",
  },
  {
    href: "/form-builder/stepper",
    title: "Stepper",
    blurb: "FormRenderer.Stepper — steps as components, full form registered.",
  },
  { href: "/form-builder/drawer", title: "Drawer", blurb: "A form hosted in a FormDrawer." },
  { href: "/form-builder/fields", title: "Field types", blurb: "Every field type in one form." },
  {
    href: "/form-builder/summary",
    title: "Form summary",
    blurb: "A live calculation panel beside the form.",
  },
  {
    href: "/form-builder/renderer",
    title: "FormRenderer",
    blurb: "Page vs drawer from the same children.",
  },
  {
    href: "/form-builder/create-form",
    title: "Create form (MCP)",
    blurb: "The shape the MCP create-form action generates.",
  },
  {
    href: "/form-builder/table",
    title: "Table field",
    blurb: "An editable grid: any field per cell, checkbox + drag-drop rows.",
  },
  {
    href: "/form-builder/sidebar",
    title: "Detail tabs",
    blurb: "A display-only detail page — a sidebar of tabs swapping FormRenderer.Section panels.",
  },
];
