/** Plain data (no "use client") so server components can import it directly. */

export type Example = {
  href: string;
  title: string;
  blurb: string;
};

export type ExampleGroup = {
  title: string;
  items: Example[];
};

export const GROUPS: ExampleGroup[] = [
  {
    title: "Core API",
    items: [
      {
        href: "/data-views/basic",
        title: "Basic",
        blurb: "The one-liner preset. Fields auto-detected from the data.",
      },
      {
        href: "/data-views/compound",
        title: "Compound",
        blurb: "Root plus header slots, every view, and the config rail.",
      },
      {
        href: "/data-views/tabs",
        title: "Tabs & labels",
        blurb: "JSX order sets tab order; `label` renames; omit to drop.",
      },
      {
        href: "/data-views/theming",
        title: "Theming",
        blurb: "dark / light / default, and the chrome that stays dark.",
      },
    ],
  },
  {
    title: "Views",
    items: [
      {
        href: "/data-views/table",
        title: "Table",
        blurb: "Sorting, controlled selection, column visibility and order.",
      },
      {
        href: "/data-views/kanban",
        title: "Kanban",
        blurb: "groupBy, per-status labels and colours, drag between columns.",
      },
      {
        href: "/data-views/inbox",
        title: "Inbox",
        blurb: "Flag config, the quick-filter rail, a custom detail pane.",
      },
      {
        href: "/data-views/tree",
        title: "Tree",
        blurb: "Nested children vs. flat parent pointer, expansion, card mode.",
      },
      {
        href: "/data-views/inbox-routing",
        title: "Inbox routing",
        blurb: "The detail pane on its own URL, list state preserved.",
      },
    ],
  },
  {
    title: "Fields & filters",
    items: [
      {
        href: "/data-views/fields",
        title: "Field types",
        blurb: "All 17 renderers plus the custom `render` escape hatch.",
      },
      {
        href: "/data-views/filters",
        title: "Filter kinds",
        blurb: "Checkbox, radio, searchable select, numeric and date ranges.",
      },
    ],
  },
  {
    title: "Advanced",
    items: [
      {
        href: "/data-views/server-filters",
        title: "Server filtering",
        blurb: "Controlled filterState — the query you'd send to an API.",
      },
      {
        href: "/data-views/custom-view",
        title: "Custom view",
        blurb: "useRegisterView + useViewData: your own view, its own tab.",
      },
      {
        href: "/data-views/mutation",
        title: "Editing records",
        blurb: "Why edits go through updateRecord, not onDataUpdate.",
      },
      {
        href: "/data-views/edge-cases",
        title: "Edge cases",
        blurb: "Empty, single-row, missing values, deeply nested objects.",
      },
    ],
  },
];

export const EXAMPLES: Example[] = GROUPS.flatMap((g) => g.items);
