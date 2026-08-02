/**
 * Shared fixtures for the DataViews examples.
 *
 * Plain data — no "use client" — so server components can import it directly.
 * Each dataset is shaped to make the pages that use it honest: `orders` carries
 * inbox flags so the quick-filter rail has something to filter, `employees` is
 * flat with a parent pointer, `catalogue` is nested, and `showcase` carries one
 * value per field type.
 */

import type { FieldConfig } from "@/components/DataViews";

// ─── Orders — the workhorse dataset for most examples ────────────────────────

export type Order = {
  id: number;
  customer: string;
  status: "Pending" | "Shipped" | "Delivered";
  priority: "High" | "Medium" | "Low";
  region: string;
  total: number;
  createdAt: string;
  isStarred: boolean;
  hasAttachment: boolean;
};

export const orders: Order[] = [
  {
    id: 1,
    customer: "Acme Inc.",
    status: "Pending",
    priority: "High",
    region: "North America",
    total: 1240,
    createdAt: "2025-09-10",
    isStarred: true,
    hasAttachment: true,
  },
  {
    id: 2,
    customer: "Globex Corp.",
    status: "Shipped",
    priority: "Medium",
    region: "Europe",
    total: 480,
    createdAt: "2025-09-12",
    isStarred: false,
    hasAttachment: false,
  },
  {
    id: 3,
    customer: "Initech",
    status: "Delivered",
    priority: "Low",
    region: "Europe",
    total: 99,
    createdAt: "2025-09-15",
    isStarred: false,
    hasAttachment: true,
  },
  {
    id: 4,
    customer: "Umbrella",
    status: "Pending",
    priority: "High",
    region: "Asia Pacific",
    total: 2890,
    createdAt: "2025-09-18",
    isStarred: true,
    hasAttachment: false,
  },
  {
    id: 5,
    customer: "Hooli",
    status: "Shipped",
    priority: "Medium",
    region: "North America",
    total: 740,
    createdAt: "2025-09-20",
    isStarred: false,
    hasAttachment: false,
  },
  {
    id: 6,
    customer: "Stark Industries",
    status: "Pending",
    priority: "High",
    region: "North America",
    total: 12400,
    createdAt: "2025-09-22",
    isStarred: false,
    hasAttachment: true,
  },
  {
    id: 7,
    customer: "Wayne Enterprises",
    status: "Delivered",
    priority: "Medium",
    region: "Europe",
    total: 5300,
    createdAt: "2025-09-25",
    isStarred: true,
    hasAttachment: false,
  },
  {
    id: 8,
    customer: "Cyberdyne",
    status: "Shipped",
    priority: "Low",
    region: "Asia Pacific",
    total: 220,
    createdAt: "2025-09-28",
    isStarred: false,
    hasAttachment: false,
  },
];

export const orderFields: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "customer", label: "Customer", type: "text" },
  {
    path: "status",
    label: "Status",
    type: "enum-badge",
    variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" },
    kanbanVariants: {
      Pending: { label: "To pack", color: "gray" },
      Shipped: { label: "In transit", color: "blue" },
      Delivered: { label: "Done", color: "green" },
    },
    filterable: true,
  },
  {
    path: "priority",
    label: "Priority",
    type: "enum-badge",
    variants: { High: "redOrange", Medium: "purple", Low: "gray" },
    filterable: true,
  },
  { path: "total", label: "Total", type: "currency", currency: "USD", filterable: true },
  { path: "createdAt", label: "Created", type: "date-format", dateFormat: "YYYY-MM-DD" },
  // Inbox flags: useful to the inbox rail, noise in a table.
  { path: "isStarred", type: "hidden" },
  { path: "hasAttachment", type: "hidden" },
  { path: "region", type: "hidden" },
];

// ─── Employees — flat hierarchy via a parent pointer ─────────────────────────

export const employees = [
  {
    id: "e1",
    name: "Dana Whitfield",
    title: "VP Engineering",
    managerId: null,
    headcount: 9,
    tenure: 6,
  },
  {
    id: "e2",
    name: "Marcus Bell",
    title: "Director, Platform",
    managerId: "e1",
    headcount: 4,
    tenure: 4,
  },
  {
    id: "e3",
    name: "Priya Raman",
    title: "Director, Product Eng",
    managerId: "e1",
    headcount: 3,
    tenure: 3,
  },
  {
    id: "e4",
    name: "Sam Okonkwo",
    title: "Staff Engineer",
    managerId: "e2",
    headcount: 0,
    tenure: 5,
  },
  {
    id: "e5",
    name: "Lena Fischer",
    title: "Senior Engineer",
    managerId: "e2",
    headcount: 0,
    tenure: 2,
  },
  {
    id: "e6",
    name: "Tomas Vega",
    title: "Senior Engineer",
    managerId: "e3",
    headcount: 0,
    tenure: 3,
  },
  { id: "e7", name: "Ada Nwosu", title: "Engineer", managerId: "e3", headcount: 0, tenure: 1 },
];

export const employeeFields: FieldConfig[] = [
  { path: "name", label: "Name", type: "text" },
  { path: "title", label: "Title", type: "text", filterable: true },
  { path: "headcount", label: "Reports", type: "number" },
  { path: "tenure", label: "Years", type: "number" },
  { path: "id", type: "hidden" },
  { path: "managerId", type: "hidden" },
];

// ─── Catalogue — nested hierarchy via a children array ───────────────────────

export const catalogue = [
  {
    id: 1,
    name: "Hardware",
    stock: 412,
    status: "Active",
    children: [
      {
        id: 2,
        name: "Laptops",
        stock: 128,
        status: "Active",
        children: [
          { id: 3, name: "Ultrabooks", stock: 64, status: "Active" },
          { id: 4, name: "Workstations", stock: 64, status: "Low" },
        ],
      },
      { id: 5, name: "Monitors", stock: 210, status: "Active" },
      { id: 6, name: "Keyboards", stock: 74, status: "Low" },
    ],
  },
  {
    id: 7,
    name: "Software",
    stock: 0,
    status: "Active",
    children: [
      { id: 8, name: "Design tools", stock: 0, status: "Active" },
      { id: 9, name: "Developer tools", stock: 0, status: "Archived" },
    ],
  },
];

export const catalogueFields: FieldConfig[] = [
  { path: "name", label: "Name", type: "text" },
  {
    path: "status",
    label: "Status",
    type: "enum-badge",
    variants: { Active: "green", Low: "yellow", Archived: "gray" },
    filterable: true,
  },
  { path: "stock", label: "In stock", type: "number", filterable: true },
  { path: "id", type: "hidden" },
];

// ─── Showcase — one value per field type ─────────────────────────────────────

export const showcase = [
  {
    id: 101,
    name: "Dana Whitfield",
    role: "VP Engineering",
    manager: { name: "Chris Alder", email: "chris@example.com" },
    avatar: "https://i.pravatar.cc/80?img=47",
    thumbnail: "https://picsum.photos/seed/dv-1/80/80",
    email: "dana@example.com",
    phone: "+15550100",
    website: "https://example.com/dana",
    department: "Engineering",
    tags: ["lead", "on-call", "hiring", "mentor"],
    active: true,
    rating: 5,
    completion: 92,
    salary: 184000,
    headcount: 1240000,
    joinedAt: "2019-03-04T09:30:00.000Z",
    lastSeen: "2025-09-28",
    internalNote: "Not rendered — this field is hidden.",
  },
  {
    id: 102,
    name: "Marcus Bell",
    role: "Director, Platform",
    manager: { name: "Dana Whitfield", email: "dana@example.com" },
    avatar: "https://i.pravatar.cc/80?img=12",
    thumbnail: "https://picsum.photos/seed/dv-2/80/80",
    email: "marcus@example.com",
    phone: "+15550111",
    website: "https://example.com/marcus",
    department: "Engineering",
    tags: ["platform", "infra"],
    active: true,
    rating: 4,
    completion: 61,
    salary: 156000,
    headcount: 880000,
    joinedAt: "2021-07-19T14:05:00.000Z",
    lastSeen: "2025-09-30",
    internalNote: "Also hidden.",
  },
  {
    id: 103,
    name: "Ada Nwosu",
    role: "Engineer",
    manager: { name: "Priya Raman", email: "priya@example.com" },
    avatar: "",
    thumbnail: "https://picsum.photos/seed/dv-3/80/80",
    email: "ada@example.com",
    phone: "+15550122",
    website: "https://example.com/ada",
    department: "Product",
    tags: ["frontend"],
    active: false,
    rating: 3,
    completion: 28,
    salary: 98000,
    headcount: 0,
    joinedAt: "2024-01-08T08:00:00.000Z",
    lastSeen: "2025-08-02",
    internalNote: "Hidden too.",
  },
];

/**
 * Every `FieldType`, each configured to exercise its own options. The order
 * here is the order the table renders them in.
 */
export const showcaseFields: FieldConfig[] = [
  // two-line: primary value plus a secondary dot-path from the same row
  { path: "name", label: "Person", type: "two-line", secondaryPath: "role" },
  // avatar: image URL, initials from `fallbackPath` when it fails or is empty
  { path: "avatar", label: "Avatar", type: "avatar", fallbackPath: "name" },
  // image: plain thumbnail
  { path: "thumbnail", label: "Image", type: "image" },
  // text
  { path: "department", label: "Dept.", type: "text", filterable: true },
  // enum-badge via a dot path into a nested object
  { path: "manager.name", label: "Manager", type: "text" },
  // badge-array with an overflow cap — row 1 has 4 tags, `limit` 2 shows "+2"
  { path: "tags", label: "Tags", type: "badge-array", variant: "bluePurple", limit: 2 },
  // boolean with custom labels + variants
  {
    path: "active",
    label: "Active",
    type: "boolean",
    trueLabel: "On staff",
    falseLabel: "Alumni",
    trueVariant: "green",
    falseVariant: "redLight",
  },
  // star-rating out of `max`
  { path: "rating", label: "Rating", type: "star-rating", max: 5 },
  // progress-bar: red < 40, yellow < 70, green ≥ 70
  { path: "completion", label: "Progress", type: "progress-bar", thresholds: [40, 70] },
  // currency, object form: explicit locale + zero decimals
  {
    path: "salary",
    label: "Salary",
    type: "currency",
    currency: { code: "USD", locale: "en-US", decimals: 0 },
    filterable: true,
  },
  // number-format: compact notation via Intl options
  {
    path: "headcount",
    label: "Reach",
    type: "number-format",
    format: { notation: "compact", maximumFractionDigits: 1 },
  },
  // number: plain tabular
  { path: "id", label: "ID", type: "number" },
  // date-format, Intl options form
  {
    path: "joinedAt",
    label: "Joined",
    type: "date-format",
    dateFormat: { year: "numeric", month: "short", day: "numeric" },
  },
  // date-format, token form
  { path: "lastSeen", label: "Last seen", type: "date-format", dateFormat: "DD/MM/YYYY" },
  // date: the raw string, unformatted — the escape hatch when you pre-format server-side
  { path: "createdRaw", label: "Raw date", type: "date" },
  // icon-text with a Remix icon before the value
  { path: "role", label: "Role", type: "icon-text", icon: "ri-briefcase-line" },
  // link: three link types
  { path: "email", label: "Email", type: "link", linkType: "mailto" },
  { path: "phone", label: "Phone", type: "link", linkType: "tel" },
  { path: "website", label: "Website", type: "link", linkType: "url" },
  // hidden: never rendered, never offered as a column
  { path: "internalNote", type: "hidden" },
];

// ─── Edge-case datasets ──────────────────────────────────────────────────────

export const emptyOrders: Order[] = [];

export const singleOrder: Order[] = [orders[0]];

/** Missing keys, nulls, and a deeply nested object for the detail pane. */
export const sparseRecords = [
  {
    id: "r1",
    title: "Complete record",
    owner: "Dana Whitfield",
    score: 88,
    shippedAt: "2025-09-14",
    metadata: {
      source: "import",
      pipeline: { stage: "enriched", attempts: 2, lastError: null },
      labels: ["verified", "priority"],
    },
  },
  { id: "r2", title: "Missing owner and score", shippedAt: "2025-09-16" },
  { id: "r3", title: "Explicit nulls", owner: null, score: null, shippedAt: null },
  {
    id: "r4",
    title: "Zero and empty string are values, not gaps",
    owner: "",
    score: 0,
    shippedAt: "2025-09-20",
  },
];

export const sparseFields: FieldConfig[] = [
  { path: "title", label: "Title", type: "text" },
  { path: "owner", label: "Owner", type: "text" },
  { path: "score", label: "Score", type: "progress-bar" },
  { path: "shippedAt", label: "Shipped", type: "date-format", dateFormat: "YYYY-MM-DD" },
  { path: "id", type: "hidden" },
];
