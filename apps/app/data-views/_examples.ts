/**
 * The example registry. Plain data with no `"use client"`, so the server-rendered index page and
 * the client-rendered sidebar can both import it.
 *
 * Adding an example is: a row here plus `<slug>/page.tsx`. Each page renders the component and
 * nothing else — several cases live on one `DataViews`, switched by buttons in its own header.
 */

export const GROUPS = [
  "Views",
  "Fields",
  "Filters",
  "Panel",
  "State",
  "Scale & presentation",
] as const;

export type Group = (typeof GROUPS)[number];

export interface Example {
  slug: string;
  title: string;
  group: Group;
}

export const EXAMPLES: Example[] = [
  // ─── Views ──────────────────────────────────────────────────────────────────
  {
    slug: "views",
    title: "Views",
    group: "Views",
  },
  {
    slug: "inbox-routing",
    title: "Inbox → route",
    group: "Views",
  },
  {
    slug: "tree-custom",
    title: "Tree → custom UI",
    group: "Views",
  },

  // ─── Fields ─────────────────────────────────────────────────────────────────
  {
    slug: "fields",
    title: "Fields",
    group: "Fields",
  },

  // ─── Filters ────────────────────────────────────────────────────────────────
  {
    slug: "filters",
    title: "Filters",
    group: "Filters",
  },
  {
    slug: "server-side",
    title: "Server-side",
    group: "Filters",
  },

  // ─── Panel ──────────────────────────────────────────────────────────────────
  {
    slug: "panel",
    title: "Panel",
    group: "Panel",
  },

  // ─── State ──────────────────────────────────────────────────────────────────
  {
    slug: "state",
    title: "State",
    group: "State",
  },
  {
    slug: "view-registry",
    title: "View registry",
    group: "State",
  },

  // ─── Scale & presentation ───────────────────────────────────────────────────
  {
    slug: "scale",
    title: "Scale",
    group: "Scale & presentation",
  },
  {
    slug: "a11y-rtl",
    title: "Keyboard & RTL",
    group: "Scale & presentation",
  },
  {
    slug: "overview",
    title: "Everything at once",
    group: "Scale & presentation",
  },
];

export const byGroup = (group: Group) => EXAMPLES.filter((e) => e.group === group);

export const findExample = (slug: string) => EXAMPLES.find((e) => e.slug === slug);
