---
title: DataViews example — Inbox → route
description: `itemHref` + `linkComponent` — the detail pane driven by the URL.
group: examples
component: DataViews
keywords: [data-views, example, examples, inbox, routing]
---

# DataViews example — Inbox → route

`itemHref` + `linkComponent` — the detail pane driven by the URL.

Complete and runnable — this is the page itself, not an excerpt. In the monorepo it lives at `apps/app/data-views/inbox-routing/page.tsx` and `apps/app/data-views/inbox-routing/[id]/page.tsx`.

See the [component reference](../index.md) for what each prop does, or the [guide](../guide.md) for the same ground as scenarios.

## `apps/app/data-views/inbox-routing/page.tsx`

```tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Filter, Settings } from "lucide-react";
import { DataViews, emptyQuery, queryToParams, type SavedView } from "@/components/DataViews";
import { FormBuilder } from "@/components/FormBuilder";
import type {
  DataViewsQuery,
  FieldConfig,
  Row,
} from "@/utils/dataViews/types";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Message extends Row {
  id: string;
  subject: string;
  from: string;
  preview?: string;
  receivedAt?: string;
}

const FIELDS: FieldConfig[] = [
  { path: "subject", label: "Subject", type: "text" },
  { path: "from", label: "From", type: "text" },
  { path: "preview", label: "Preview", type: "text" },
  { path: "receivedAt", label: "Received", type: "date-format", dateFormat: "DD MMM" },
];

const FROM_OPTIONS = [
  { label: "logistics@acme.test", value: "logistics@acme.test" },
  { label: "ap@initech.test", value: "ap@initech.test" },
  { label: "supply@umbrella.test", value: "supply@umbrella.test" },
  { label: "procurement@hooli.test", value: "procurement@hooli.test" },
  { label: "ops@cyberdyne.test", value: "ops@cyberdyne.test" },
];

/**
 * The request this page makes. The querying happens in `app/api/messages/route.ts`.
 */
async function fetchMessages(q: DataViewsQuery): Promise<{ rows: Message[]; total: number }> {
  const params = queryToParams(q);
  const res = await fetch(`/api/messages?${params}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// ─── Page ─────────────────────────────────────────────────────────────────────

/**
 * `itemHref` turns each row into a link and `linkComponent` swaps the plain anchor for the
 * router's, so navigation stays client-side.
 *
 * Following one unmounts this page — the App Router replaces pages while keeping layouts — so the
 * detail route has to stand on its own. Keeping the list beside the detail would mean hoisting
 * `<DataViews>` into `inbox-routing/layout.tsx` and letting each page supply only the pane.
 */
export default function InboxRoutingExample() {
  const [query, setQuery] = useState(emptyQuery());
  const [saved, setSaved] = useState<SavedView[]>([]);


  const { data, isPending, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["messages", { ...query, page: undefined }],
    queryFn: ({ pageParam }) => fetchMessages({ ...query, page: pageParam }),
    initialPageParam: 1,
    // Undefined means "no more" — which is what the component's `hasMore` resolves to.
    getNextPageParam: (last, pages) => {
      const loaded = pages.reduce((n, page) => n + page.rows.length, 0);
      return loaded < last.total ? pages.length + 1 : undefined;
    },
  });

  const rows = useMemo(() => data?.pages.flatMap((page) => page.rows) ?? [], [data]);
  const total = data?.pages[0]?.total ?? 0;

  return (
    <div className="flex h-full min-h-0 flex-col p-4">
      <DataViews
        rows={rows}
        fields={FIELDS}
        total={total}
        loading={isPending}
        onLoadMore={fetchNextPage}
        loadingMore={isFetchingNextPage}
        onQueryChange={setQuery}
        className="h-full"
      >
        <DataViews.Header title="Inbox">
          <DataViews.ViewSwitch />
          <DataViews.Search />
          <DataViews.PanelToggle />
        </DataViews.Header>

        <DataViews.Inbox
          titlePath="subject"
          datePath="receivedAt"
          itemHref={(_row, id) => `/data-views/inbox-routing/${id}`}
          linkComponent={Link}
          placeholder={
            <div className="typography-body-medium-regular text-content-presentation-global-secondary flex h-full items-center justify-center p-8">
              Click a message to navigate to its own page.
            </div>
          }
        />

        <DataViews.Panel>
          <DataViews.Panel.Tab value="config" label="Config." icon={<Settings />}>
            {/* Saving is the app's job — a view outlives the component. Restoring is not:
                hand the snapshot back and selecting it puts everything back internally. */}
            <DataViews.Panel.SavedViews
              views={saved}
              onSave={(snapshot) =>
                setSaved((prev) => [
                  ...prev,
                  { id: `view-${prev.length + 1}`, label: `View ${prev.length + 1}`, snapshot },
                ])
              }
            />
            <DataViews.Panel.Columns />
            <DataViews.Panel.Sort />
          </DataViews.Panel.Tab>

          <DataViews.Panel.Tab value="filters" label="Filters" icon={<Filter />}>
            {/* The controls are FormBuilder fields — the same Select and Slider any form in
                this library uses. The <FormBuilder> itself lives inside Filters; you write only
                its fields, and Filters reads each one's name, label and bounds to learn what
                it is. */}
            <DataViews.Filters
              title={null}
              className="border-b-0 p-0"
            >
              {/* A message carries no enum, no numeric field and one date, so only the
                  searchable single-select, the date range and the text match have data to bind
                  to. A checkbox list over a field that does not exist would filter to nothing. */}
              <FormBuilder.Text name="subject" label="Subject contains" />
              <FormBuilder.SearchableSelect name="from" label="From" options={FROM_OPTIONS} />
              <FormBuilder.DateRange name="receivedAt" label="Received" />
            </DataViews.Filters>
          </DataViews.Panel.Tab>
        </DataViews.Panel>
      </DataViews>
    </div>
  );
}
```

## `apps/app/data-views/inbox-routing/[id]/page.tsx`

```tsx
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
```
