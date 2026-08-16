import { NextResponse } from "next/server";
import type { Row } from "@/utils/dataViews/types";
import { parseQuery } from "@/utils/dataViews/query";
import { latency, runQuery } from "../_lib/query";

/**
 * `GET /api/scale` — the two datasets that stress the component's two axes.
 *
 * - `?shape=rows&count=1000` — many rows. With paging this is the case that stops being a
 *   rendering problem at all: the server sends one page, however big the table is.
 * - `?shape=wide` — 40 columns over 12 rows, where the pressure is horizontal instead.
 *
 * Both are generated rather than written out: hand-authoring forty columns guarantees one ends up
 * subtly different from the rest, and the bug looks like a component bug.
 */

/**
 * A seeded LCG. `Math.random()` here would hand a different dataset to each request, so a second
 * page would not be drawn from the same set as the first — and any row-count assertion becomes a
 * coin toss.
 */
function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

const pick = <T,>(rand: () => number, items: readonly T[]) => items[Math.floor(rand() * items.length)];

const COMPANIES = ["Acme", "Globex", "Initech", "Umbrella", "Hooli", "Stark", "Wayne", "Cyberdyne", "Soylent", "Tyrell"];
const SUFFIXES = ["Inc.", "GmbH", "Ltd", "BV", "SA"];
const STATUSES = ["Pending", "Shipped", "Delivered"] as const;
const PRIORITIES = ["High", "Medium", "Low"] as const;

function buildRows(count: number): Row[] {
  const rand = seeded(20250809);
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    reference: `ORD-${String(i + 1).padStart(5, "0")}`,
    customer: `${pick(rand, COMPANIES)} ${pick(rand, SUFFIXES)}`,
    status: pick(rand, STATUSES),
    priority: pick(rand, PRIORITIES),
    total: Math.round(rand() * 25000),
    items: 1 + Math.floor(rand() * 40),
    progress: Math.floor(rand() * 101),
    createdAt: `2025-09-${String(1 + Math.floor(rand() * 27)).padStart(2, "0")}`,
  }));
}

const LOREM =
  "Consignment released from the bonded warehouse pending customs clearance, with the remaining " +
  "line items held against the next replenishment window; the carrier has confirmed the revised " +
  "collection slot but has not yet issued an updated waybill, so the delivery estimate below is " +
  "provisional and will move once the paperwork is countersigned by both parties at origin.";

/** 60 characters with no break opportunity — the classic layout breaker. */
const UNBREAKABLE = "REF" + "0".repeat(54) + "END";

const SAMPLES = [
  LOREM,
  UNBREAKABLE,
  "四半期ごとのハードウェア更新プログラムの調達および配送スケジュール",
  "طلب تحديث الأجهزة ربع السنوي مع جدول التسليم المعدل",
  "Short",
  "",
];

function buildWide(columns = 40, rowCount = 12): Row[] {
  const rand = seeded(4711);
  return Array.from({ length: rowCount }, (_, r) => {
    const row: Row = { id: r + 1 };
    for (let c = 0; c < columns; c++) row[`col${c}`] = pick(rand, SAMPLES);
    return row;
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  await latency();

  const wide = url.searchParams.get("shape") === "wide";
  const count = Math.min(5000, Math.max(1, Number(url.searchParams.get("count")) || 1000));

  const result = wide
    ? runQuery(buildWide(), parseQuery(url), {
        searchPaths: ["col0"],
        textPaths: ["col0", "col1"],
      })
    : runQuery(buildRows(count), parseQuery(url), {
        searchPaths: ["customer", "reference", "status"],
      });

  return NextResponse.json(result);
}
