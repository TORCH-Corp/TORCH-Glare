import { NextResponse } from "next/server";
import type { Row } from "@/utils/dataViews/types";
import { parseQuery } from "@/utils/dataViews/query";
import { latency, runQuery } from "../_lib/query";

/**
 * `GET /api/orders` — the orders table most of the examples read.
 *
 * ```
 * /api/orders?search=acme&filters={"status":["Pending"]}&sort=total:desc&page=1&pageSize=10
 * → { rows, total, page, pageSize }
 * ```
 *
 * `?fail=1` returns a 502, which is what the server-side example's failure toggle asks for.
 */

export interface Order extends Row {
  id: number;
  customer: { name: string };
  /** Org-configurable master data — the annex's Type ④ example (dynamic, multi-pick). */
  brand: { name: string };
  status: "Pending" | "Shipped" | "Delivered";
  priority: "High" | "Medium" | "Low";
  total: number;
  items: number;
  createdAt: string;
}

/**
 * Eight rows, three of them `Pending`. Small on purpose: every behaviour these examples
 * demonstrate is visible at eight rows, and a filter that leaves three is easy to check at a
 * glance. The scale endpoint is where volume is the point.
 */
const ORDERS: Order[] = [
  { id: 1, brand: { name: "Bosch" }, customer: { name: "Acme Inc." }, status: "Pending", priority: "High", total: 1240, items: 4, createdAt: "2025-09-10" },
  { id: 2, brand: { name: "Makita" }, customer: { name: "Globex Corp." }, status: "Shipped", priority: "Medium", total: 480, items: 2, createdAt: "2025-09-12" },
  { id: 3, brand: { name: "DeWalt" }, customer: { name: "Initech" }, status: "Delivered", priority: "Low", total: 99, items: 1, createdAt: "2025-09-15" },
  { id: 4, brand: { name: "Bosch" }, customer: { name: "Umbrella" }, status: "Pending", priority: "High", total: 2890, items: 9, createdAt: "2025-09-18" },
  { id: 5, brand: { name: "Hilti" }, customer: { name: "Hooli" }, status: "Shipped", priority: "Medium", total: 740, items: 3, createdAt: "2025-09-20" },
  { id: 6, brand: { name: "Makita" }, customer: { name: "Stark Industries" }, status: "Pending", priority: "High", total: 12400, items: 21, createdAt: "2025-09-22" },
  { id: 7, brand: { name: "DeWalt" }, customer: { name: "Wayne Enterprises" }, status: "Delivered", priority: "Medium", total: 5300, items: 12, createdAt: "2025-09-25" },
  { id: 8, brand: { name: "Hilti" }, customer: { name: "Cyberdyne" }, status: "Shipped", priority: "Low", total: 220, items: 1, createdAt: "2025-09-28" },
];

/**
 * What each order's status was before anyone dragged it. Captured once at module load so the
 * board examples have something to reset to — this array *is* the mutable store.
 */
const ORIGINAL_STATUS = ORDERS.map((row) => row.status);

/**
 * `items` is filtered by a bucket picker the filters example builds with `Filters.Custom`, so its
 * value is a label rather than a stored value. A filter no field produces still has to be a filter
 * the endpoint understands — that is the whole point of the escape hatch.
 */
const IN_BUCKET: Record<string, (n: number) => boolean> = {
  "1–3": (n) => n <= 3,
  "4–10": (n) => n > 3 && n <= 10,
  "10+": (n) => n > 10,
};

/**
 * `PATCH /api/orders` — move an order to another status, or put them all back.
 *
 * This is the other half of `onRowMove`: the board emits an intent and nothing moves until the
 * data says so. Persisting it here is what makes the card stay put after the refetch — and what
 * makes "Ignoring moves" visibly different from "Applying moves".
 *
 * ```
 * PATCH { id: 4, status: "Shipped" }
 * PATCH { reset: true }
 * ```
 */
export async function PATCH(request: Request) {
  const body = (await request.json()) as { id?: number; status?: Order["status"]; reset?: boolean };
  await latency(150);

  if (body.reset) {
    ORDERS.forEach((row, i) => (row.status = ORIGINAL_STATUS[i]));
    return NextResponse.json({ ok: true });
  }

  const order = ORDERS.find((row) => row.id === Number(body.id));
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (body.status) order.status = body.status;

  return NextResponse.json(order);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  await latency();

  if (url.searchParams.get("fail") === "1") {
    return NextResponse.json({ error: "Bad Gateway" }, { status: 502 });
  }

  const query = parseQuery(url);

  // Pull the bucket filter out and apply it here; the rest is the generic path.
  const { items, ...rest } = query.filters;
  const buckets = Array.isArray(items) ? items : [];
  const source = buckets.length
    ? ORDERS.filter((row) => buckets.some((bucket) => IN_BUCKET[bucket]?.(row.items)))
    : ORDERS;

  return NextResponse.json(
    runQuery(source, { ...query, filters: rest }, {
      searchPaths: ["customer.name", "status", "priority"],
    }),
  );
}
