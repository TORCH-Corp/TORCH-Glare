import { NextResponse } from "next/server";
import { MESSAGES } from "../_lib/messages";
import { parseQuery } from "@/utils/dataViews/query";
import { latency, runQuery } from "../_lib/query";

/**
 * `GET /api/messages` — the inbox the routing example reads.
 *
 * Chronological, so no `sort` is offered; the query string is otherwise the same as every other
 * endpoint's.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  await latency();

  return NextResponse.json(
    runQuery(MESSAGES, parseQuery(url), {
      searchPaths: ["subject", "from", "preview"],
      // `subject` is offered as a text field, so its one-element array means "contains".
      textPaths: ["subject"],
    }),
  );
}
