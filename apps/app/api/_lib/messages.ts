import type { Row } from "@/utils/dataViews/types";

/**
 * The inbox fixture.
 *
 * It lives here rather than in `messages/route.ts` because two routes need it — the list and the
 * single-message lookup — and a `route.ts` may only export its handlers.
 */

export interface Message extends Row {
  id: string;
  subject: string;
  from: string;
  preview?: string;
  receivedAt?: string;
}

export const MESSAGES: Message[] = [
  {
    id: "m1",
    subject: "Delivery window moved to Thursday",
    from: "logistics@acme.test",
    preview:
      "The carrier has rescheduled the Frankfurt leg, which pushes the whole consignment back by two days. No action is needed unless the new window clashes with the site closure.",
    receivedAt: "2025-09-28",
  },
  {
    id: "m2",
    subject: "Invoice 4471 — payment received",
    from: "ap@initech.test",
    preview: "Payment cleared this morning. Remittance advice attached.",
    receivedAt: "2025-09-27",
  },
  // No preview and no date on purpose — both are optional, and the row must keep its shape.
  { id: "m3", subject: "Re: spare units", from: "supply@umbrella.test" },
  {
    id: "m4",
    subject: "Quarterly hardware refresh — approvals needed",
    from: "procurement@hooli.test",
    preview:
      "Three of the eleven line items are above the sign-off threshold and need a second approver.",
    receivedAt: "2025-09-25",
  },
  {
    id: "m5",
    subject: "Warehouse stock count discrepancy",
    from: "ops@cyberdyne.test",
    preview: "Counted 218 against an expected 220. Recount scheduled for Monday.",
    receivedAt: "2025-09-24",
  },
];
