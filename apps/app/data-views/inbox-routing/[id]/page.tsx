import Link from "next/link";
import { notFound } from "next/navigation";
import { MESSAGES } from "../../../api/_lib/messages";

/**
 * Where `itemHref` lands. A plain server-rendered page — no `DataViews` involved, because by this
 * point the inbox has unmounted.
 *
 * This route is scoped to the one example that needs it. A `[id]` directly under `data-views/`
 * would swallow every mistyped example slug and render a "detail" page instead of a 404.
 *
 * It reads the same store `/api/messages` serves rather than fetching from it: this already runs
 * on the server, and a server component calling its own HTTP endpoint pays for a round trip to
 * itself. The list page fetches because it runs in the browser.
 */

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const message = MESSAGES.find((m) => m.id === id);
  if (!message) notFound();

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-8">
      <Link
        href="/data-views/inbox-routing"
        className="typography-body-small-regular text-content-presentation-action-link flex w-fit items-center gap-1"
      >
        <i className="ri-arrow-left-line" aria-hidden />
        Back to the inbox
      </Link>

      <article className="flex flex-col gap-3">
        <h1 className="typography-headers-medium-medium text-content-presentation-global-primary">
          {message.subject}
        </h1>
        <p className="typography-body-small-regular text-content-presentation-global-secondary">
          {message.from}
          {message.receivedAt ? ` · ${message.receivedAt}` : " · no date"}
        </p>
        <p className="typography-body-medium-regular text-content-presentation-global-primary max-w-[65ch]">
          {message.preview ?? "This message has no preview text."}
        </p>
      </article>
    </div>
  );
}
