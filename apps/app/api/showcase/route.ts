import { NextResponse } from "next/server";
import type { Row } from "@/utils/dataViews/types";
import { parseQuery } from "@/utils/dataViews/query";
import { latency, runQuery } from "../_lib/query";

/**
 * `GET /api/showcase?case=types|blanks|nested` — the three datasets the fields example paints.
 *
 * - `types` — one row shape carrying every `FieldType`.
 * - `blanks` — 16 types × 7 blank values, generated.
 * - `nested` — invoices, for dotted and indexed paths.
 */

/**
 * Deliberately includes a broken avatar URL and a broken image src: a 404 is the normal case for
 * user-supplied image data, and the fallback path is worth being able to see.
 */
const SHOWCASE: Row[] = [
  {
    id: "sc-1",
    text: "Quarterly hardware refresh",
    number: 42,
    date: "2025-09-10T14:30:00Z",
    dateFormatted: "2025-09-10T14:30:00Z",
    bool: true,
    hidden: "never painted",
    status: "Delivered",
    tags: ["urgent", "hardware", "emea", "q3", "approved"],
    price: 1240.5,
    compact: 1284000,
    progress: 92,
    rating: 4,
    iconText: "Frankfurt",
    title: "Acme Inc.",
    subtitle: "ops@acme.test",
    avatar: "https://i.pravatar.cc/64?img=11",
    avatarName: "Acme Inc.",
    email: "ops@acme.test",
    phone: "+49 30 123456",
    url: "https://example.com/orders/1",
    image: "https://placehold.co/48x48/png",
  },
  {
    id: "sc-2",
    text: "Replacement units",
    number: 7,
    date: "2025-08-02T08:00:00Z",
    dateFormatted: "2025-08-02T08:00:00Z",
    bool: false,
    hidden: "never painted",
    status: "Pending",
    // Repeats a value on purpose: a badge-array is free to, and keying on the value would collide.
    tags: ["urgent", "urgent", "spare"],
    price: 99,
    compact: 4210,
    progress: 18,
    rating: 2,
    iconText: "Rotterdam",
    title: "Initech",
    subtitle: "ap@initech.test",
    avatar: "https://i.pravatar.cc/64?img=13",
    avatarName: "Initech",
    email: "ap@initech.test",
    phone: "+31 10 7654321",
    url: "https://example.com/orders/2",
    image: "https://placehold.co/48x48/png",
  },
  {
    id: "sc-3",
    text: "Annual licence true-up",
    number: 128,
    date: "2025-10-01T23:45:00Z",
    dateFormatted: "2025-10-01T23:45:00Z",
    bool: true,
    hidden: "never painted",
    status: "Shipped",
    tags: ["licence"],
    price: 88000,
    compact: 98765432,
    progress: 55,
    rating: 5,
    iconText: "Dublin",
    title: "Umbrella",
    subtitle: "supply@umbrella.test",
    // A 404 — the initials fallback should take over.
    avatar: "https://i.pravatar.cc/64?img=doesnotexist",
    avatarName: "Umbrella Corporation",
    email: "supply@umbrella.test",
    phone: "+353 1 5550100",
    url: "https://example.com/orders/3",
    // Also a 404.
    image: "https://example.invalid/missing.png",
  },
];

/**
 * The types the blank matrix covers. The page declares the same list to build its columns — it
 * has to, because the *config* each type reads (`dateFormat`, `secondaryPath`, `max`) is
 * presentation and belongs there. Only the names have to agree, and a mismatch shows up
 * immediately as an empty column.
 */
const BLANK_TYPES = [
  "text", "number", "date", "date-format", "boolean", "enum-badge", "badge-array", "currency",
  "number-format", "progress-bar", "star-rating", "icon-text", "two-line", "avatar", "link", "image",
];

/** The blank-ish values worth checking every type against. */
const BLANKS: { label: string; value: unknown }[] = [
  { label: "null", value: null },
  { label: "undefined", value: undefined },
  { label: '"" (empty string)', value: "" },
  { label: "0", value: 0 },
  { label: "false", value: false },
  { label: "[] (empty array)", value: [] },
  { label: "NaN", value: NaN },
];

/**
 * One row per blank value, one column per type. The `undefined` case has to *omit* the key rather
 * than set it, so an absent path is genuinely absent — which is a different code path in the cell
 * renderer than a key holding `undefined`.
 *
 * `NaN` does not survive `JSON.stringify` (it becomes `null`), so that row arrives as nulls. That
 * is honest about what a real endpoint would send, and both are blank as far as a cell is
 * concerned.
 */
function buildBlankMatrix(): Row[] {
  return BLANKS.map((blank, index) => {
    const row: Row = { id: `blank-${index}`, case: blank.label };
    for (const type of BLANK_TYPES) {
      if (blank.label === "undefined") continue;
      row[type.replace(/-/g, "_")] = blank.value;
    }
    return row;
  });
}

const INVOICES: Row[] = [
  {
    id: 1,
    customer: { name: "Acme Inc.", contact: { email: "ap@acme.test" } },
    vendor: { name: "Northwind" },
    lines: [{ sku: "KB-101", qty: 4 }, { sku: "MS-220", qty: 2 }],
    status: "Open",
  },
  {
    id: 2,
    customer: { name: "Globex Corp.", contact: { email: "finance@globex.test" } },
    vendor: { name: "Contoso" },
    lines: [{ sku: "DK-900", qty: 1 }],
    status: "Paid",
  },
  {
    id: 3,
    customer: { name: "Initech", contact: { email: "ap@initech.test" } },
    vendor: { name: "Northwind" },
    lines: [{ sku: "KB-101", qty: 9 }, { sku: "HD-010", qty: 3 }],
    status: "Open",
  },
];

const CASES = {
  types: { rows: SHOWCASE, searchPaths: ["text"], textPaths: ["text"] },
  blanks: { rows: buildBlankMatrix(), searchPaths: ["case"], textPaths: [] },
  nested: { rows: INVOICES, searchPaths: ["customer.name", "vendor.name"], textPaths: [] },
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  await latency();

  const key = (url.searchParams.get("case") ?? "types") as keyof typeof CASES;
  const dataset = CASES[key] ?? CASES.types;

  return NextResponse.json(
    runQuery(dataset.rows, parseQuery(url), {
      searchPaths: dataset.searchPaths,
      textPaths: dataset.textPaths,
    }),
  );
}
