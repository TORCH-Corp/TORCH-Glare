---
title: DataViews example — Fields
description: The field types, painted.
group: examples
component: DataViews
keywords: [data-views, example, examples, fields]
---

# DataViews example — Fields

The field types, painted.

Complete and runnable — this is the page itself, not an excerpt. In the monorepo it lives at `apps/app/data-views/fields/page.tsx`.

See the [component reference](../index.md) for what each prop does, or the [guide](../guide.md) for the same ground as scenarios.

```tsx
"use client";

import { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Filter, Settings } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Cell, DataViews, emptyQuery, queryToParams, type SavedView } from "@/components/DataViews";
import { FormBuilder } from "@/components/FormBuilder";
import type {
  DataViewsQuery,
  FieldConfig,
  Row,
} from "@/utils/dataViews/types";

// ─── Case 1 · every field type ────────────────────────────────────────────────

/**
 * One row shape carrying every `FieldType`.
 *
 * Deliberately includes a broken avatar URL and a broken image src — a 404 is the normal case for
 * user-supplied image data, and the fallback path is worth being able to see.
 */
/**
 * All seventeen types, each with the config it actually reads. The `label`s name the option being
 * demonstrated rather than the data, because that is what this case is about. Two entries share
 * `price` and two share `iconText` — a path may appear more than once, which is why the views key
 * columns by position rather than by path.
 */
const SHOWCASE_FIELDS: FieldConfig[] = [
  { path: "text", label: "text", type: "text" },
  { path: "number", label: "number", type: "number" },
  { path: "date", label: "date", type: "date" },
  { path: "dateFormatted", label: "date-format · tokens", type: "date-format", dateFormat: "DD/MM/YYYY HH:mm" },
  {
    path: "bool",
    label: "boolean · badges",
    type: "boolean",
    trueLabel: "Paid",
    falseLabel: "Unpaid",
    trueVariant: "green",
    falseVariant: "redLight",
  },
  { path: "hidden", label: "hidden", type: "hidden" },
  { path: "status", label: "enum-badge", type: "enum-badge", variants: { Pending: "yellow", Shipped: "blue", Delivered: "green" } },
  {
    path: "tags",
    label: "badge-array · limit 3",
    type: "badge-array",
    limit: 3,
    variants: { urgent: "redOrange", hardware: "blue", licence: "purple" },
    defaultVariant: "gray",
  },
  { path: "price", label: "currency · code", type: "currency", currency: "EUR" },
  { path: "price", label: "currency · options", type: "currency", currency: { code: "USD", locale: "en-US", decimals: 0 } },
  { path: "compact", label: "number-format", type: "number-format", format: { notation: "compact", maximumFractionDigits: 1 } },
  { path: "progress", label: "progress-bar · thresholds", type: "progress-bar", max: 100, thresholds: [30, 80] },
  { path: "rating", label: "star-rating · max 5", type: "star-rating", max: 5 },
  { path: "iconText", label: "icon-text · before", type: "icon-text", icon: "ri-map-pin-line" },
  { path: "iconText", label: "icon-text · after", type: "icon-text", icon: "ri-arrow-right-up-line", iconPosition: "after" },
  { path: "title", label: "two-line", type: "two-line", secondaryPath: "subtitle" },
  { path: "avatar", label: "avatar", type: "avatar", fallbackPath: "avatarName" },
  { path: "email", label: "link · mailto", type: "link", linkType: "mailto" },
  { path: "phone", label: "link · tel", type: "link", linkType: "tel" },
  { path: "url", label: "link · url", type: "link", linkType: "url" },
  { path: "image", label: "image", type: "image" },
];

const TITLE_OPTIONS = ["Acme Inc.", "Globex Corp.", "Initech", "Umbrella"].map((v) => ({ label: v, value: v }));
const TAG_OPTIONS = ["urgent", "hardware", "emea", "q3", "approved"].map((v) => ({ label: v, value: v }));

const STATUS_OPTIONS = [
  { label: "Pending", value: "Pending" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
];

// ─── Case 2 · blank values, every type × every blank ──────────────────────────

const TYPES_UNDER_TEST = [
  { type: "text" as const, extra: {} },
  { type: "number" as const, extra: {} },
  { type: "date" as const, extra: {} },
  { type: "date-format" as const, extra: { dateFormat: "YYYY-MM-DD" } },
  { type: "boolean" as const, extra: { trueLabel: "Yes", falseLabel: "No" } },
  { type: "enum-badge" as const, extra: { defaultVariant: "gray" as const } },
  { type: "badge-array" as const, extra: { defaultVariant: "gray" as const } },
  { type: "currency" as const, extra: { currency: "USD" } },
  { type: "number-format" as const, extra: {} },
  { type: "progress-bar" as const, extra: { max: 100 } },
  { type: "star-rating" as const, extra: { max: 5 } },
  { type: "icon-text" as const, extra: { icon: "ri-hashtag" } },
  { type: "two-line" as const, extra: { secondaryPath: "secondary" } },
  { type: "avatar" as const, extra: { fallbackPath: "avatarName" } },
  { type: "link" as const, extra: { linkType: "url" as const } },
  { type: "image" as const, extra: {} },
];


/**
 * Generated rather than hand-written: 16 types × 7 blank values is 112 cells, and a hand-authored
 * table of that size drifts the moment a type is added.
 *
 * One row per blank value, one column per type. The `undefined` case has to *omit* the key rather
 * than set it, so an absent path is genuinely absent — and `[]` is the one that used to slip
 * through, because `String([])` is `""` and an `image` field happily rendered `<img src="">`.
 */
const BLANK_FIELDS: FieldConfig[] = [
  { path: "case", label: "Value", type: "text" },
  ...TYPES_UNDER_TEST.map(({ type, extra }) => ({
    path: type.replace(/-/g, "_"),
    label: type,
    type,
    ...extra,
  })),
];


// ─── Case 3 · custom cells ────────────────────────────────────────────────────

interface Order extends Row {
  id: number;
  customer: { name: string };
  status: "Pending" | "Shipped" | "Delivered";
  priority: "High" | "Medium" | "Low";
  total: number;
  items: number;
  createdAt: string;
}

/** `render` wins over `type`: it gets the raw value and the whole row, and paints what it likes. */
const CUSTOM_FIELDS: FieldConfig[] = [
  { path: "id", label: "Order #", type: "number" },
  { path: "customer.name", label: "Customer", type: "text" },
  {
    path: "total",
    label: "Total vs. average",
    render: (value, row) => (
      <span className="flex items-center gap-2">
        <span className="tabular-nums">${Number(value).toLocaleString("en-US")}</span>
        <span className="typography-body-small-regular text-content-presentation-global-secondary">
          ${(Number(value) / Math.max(1, Number((row as Order).items))).toFixed(0)}/item
        </span>
      </span>
    ),
  },
  {
    path: "status",
    label: "Two fields, one cell",
    render: (value, row) => (
      <span className="flex items-center gap-1">
        <Badge label={String(value)} color="blue" badgeStyle="subtle" showIcon={false} />
        <Badge
          label={String((row as Order).priority)}
          color={(row as Order).priority === "High" ? "red" : "gray"}
          badgeStyle="subtle"
          showIcon={false}
        />
      </span>
    ),
  },
  {
    // `Cell` is exported and needs no context — reuse the field vocabulary anywhere, including
    // inside another field's `render`.
    path: "priority",
    label: "Cell, reused",
    render: (_value, row) => (
      <Cell
        field={{ path: "priority", type: "enum-badge", variants: { High: "redOrange", Medium: "purple", Low: "gray" } }}
        row={row}
      />
    ),
  },
  {
    path: "missing",
    label: "render beats blank",
    render: (value) => (
      <span className="typography-body-small-regular text-content-presentation-global-secondary">
        {value === undefined ? "nothing at this path, and render still ran" : String(value)}
      </span>
    ),
  },
  {
    path: "createdAt",
    label: "render beats hidden",
    type: "hidden",
    render: (value) => <code>{String(value)}</code>,
  },
];

// ─── Case 4 · nested paths ────────────────────────────────────────────────────

const NESTED_FIELDS: FieldConfig[] = [
  { path: "id", label: "#", type: "number" },
  // Two paths sharing a last segment: label them yourself, or both columns read "name".
  { path: "customer.name", label: "Customer", type: "text" },
  { path: "vendor.name", label: "Vendor", type: "text" },
  { path: "customer.contact.email", label: "Billing email", type: "link", linkType: "mailto" },
  // Array indices are just another segment — and index 7 does not exist, so the cell goes blank
  // rather than throwing.
  { path: "lines.0.sku", label: "First SKU", type: "text" },
  { path: "lines.7.sku", label: "Eighth SKU", type: "text" },
  { path: "status", label: "Status", type: "enum-badge", variants: { Open: "yellow", Paid: "green" } },
];



// ─── Query ────────────────────────────────────────────────────────────────────

/** One query for all four cases — they differ only in which path is searched and which are text. */
/**
 * Stands in for the endpoint. Every case goes through it, so switching case is a request rather
 * than an array swap.
 */
/**
 * The request this page makes. Three of the four cases come from `app/api/showcase/route.ts`;
 * `custom` paints ordinary orders, so it reads the orders endpoint instead — a page is free to
 * ask more than one thing for the same table.
 */
async function fetchCase(q: DataViewsQuery & {
  kase: Case;
}): Promise<{ rows: Row[]; total: number }> {
  const params = queryToParams(q);
  const url =
    q.kase === "custom" ? `/api/orders?${params}` : `/api/showcase?case=${q.kase}&${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

const CASES = [
  { id: "types", label: "Types" },
  { id: "blanks", label: "Blanks" },
  { id: "custom", label: "Custom" },
  { id: "nested", label: "Nested" },
] as const;

type Case = (typeof CASES)[number]["id"];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FieldsExample() {
  const [kase, setCase] = useState<Case>("types");

  const [query, setQuery] = useState(emptyQuery());
  const [saved, setSaved] = useState<SavedView[]>([]);


  // Only the columns are the page's business — the rows for each case come from the endpoint.
  // `custom` paints orders, so it reads the orders endpoint rather than the showcase one.
  const fields = { types: SHOWCASE_FIELDS, blanks: BLANK_FIELDS, custom: CUSTOM_FIELDS, nested: NESTED_FIELDS }[kase];

  const { data, isPending, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    // `kase` is part of the question — each case is a different dataset behind the endpoints.
    queryKey: ["fields", { ...query, page: undefined, kase }],
    queryFn: ({ pageParam }) => fetchCase({ ...query, page: pageParam, kase }),
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
        // Remount per case so columns and filters do not leak between datasets.
        key={kase}
        rows={rows}
        fields={fields}
        total={total}
        loading={isPending}
        onLoadMore={fetchNextPage}
        loadingMore={isFetchingNextPage}
        onQueryChange={setQuery}
        className="h-full"
      >
        <DataViews.Header title="Fields">
          <DataViews.ViewSwitch />
          <DataViews.Search />
          <DataViews.Actions>
            {CASES.map((c) => (
              <Button variant="BluColStyle"
                size="M"
                key={c.id}
                onClick={() => {
                  // A different dataset is a different question — the old filters and sort mean
                  // nothing against it. Columns reset with the remount below.
                  setCase(c.id);
                  setQuery(emptyQuery());
                }}
              >
                {c.label}
              </Button>
            ))}
          </DataViews.Actions>
          <DataViews.PanelToggle />
        </DataViews.Header>

        <DataViews.Table />

        <DataViews.Panel>
          <DataViews.Panel.Tab value="config" label="Config." icon={<Settings />}>
            {/* Saving is the app's job — a view outlives the component. Restoring is not:
                hand the snapshot back and selecting it puts everything back internally. */}
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
            {/* Each case filters its own dataset, so each offers its own controls. */}
            <DataViews.Filters
              title={null}
              className="border-b-0 p-0"
            >
              {/* This page's data has one enum and a tags array, so it exercises the checkbox
                  list, the searchable single, the BadgeField multi, the range and the date. */}
              <FormBuilder.CheckboxGroup name="status" label="Status" options={STATUS_OPTIONS} />
              <FormBuilder.SearchableSelect name="title" label="Title" options={TITLE_OPTIONS} />
              <FormBuilder.MultiSelect name="tags" label="Tags" options={TAG_OPTIONS} />
              <FormBuilder.Slider name="price" label="Price" range min={0} max={2000} step={50} />
              <FormBuilder.DateRange name="date" label="Date" />
            </DataViews.Filters>
          </DataViews.Panel.Tab>
        </DataViews.Panel>
      </DataViews>
    </div>
  );
}
```
