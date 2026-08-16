import { NextResponse } from "next/server";
import { MESSAGES } from "../../_lib/messages";
import { latency } from "../../_lib/query";

/**
 * `GET /api/messages/:id` — one message, for the inbox example's detail route.
 *
 * A row the list has open is still a row you have to be able to fetch on its own: someone lands on
 * `/data-views/inbox-routing/m3` from a link with no list in memory.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await latency();

  const message = MESSAGES.find((row) => row.id === id);
  if (!message) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(message);
}
