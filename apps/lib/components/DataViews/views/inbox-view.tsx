"use client";

import React from "react";
import { cn } from "../../../utils/cn";
import type { FieldConfig } from "../../../utils/dataViews/types";
import { Divider } from "../../Divider";
import { Cell } from "../cell";
import { SkeletonBar, skeletonKeys } from "../states";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { useDataViewsData, useDataViewsView } from "../context";
import { useActiveRow } from "../hooks/useActiveRow";
import { markView } from "../slots";
import type { InboxViewProps } from "../types";

/**
 * `DataViews.Inbox` — a list of record cards on the left, the one you picked on the right.
 *
 * The rows are not mail-style title/preview lines: each card is a stack of `label : value` rows
 * with a date pill in the corner, so an inbox of orders reads as orders rather than as email.
 *
 * The right pane is `children`: the inbox knows which row is active (`activeId`) but not how you
 * want it displayed, so it hands the decision back rather than inventing a detail layout.
 */
function InboxViewImpl({
  children,
  renderItem,
  titlePath,
  datePath,
  itemHref,
  linkComponent,
  placeholder,
  className,
}: InboxViewProps) {
  const { rows, visibleFields, getRowId, loading, loadingMore, hasMore, onLoadMore } =
    useDataViewsData();
  const { sentinelRef } = useInfiniteScroll({
    onLoadMore,
    hasMore,
    loading: loading || loadingMore,
  });
  const { activeId, setActiveId } = useDataViewsView();
  // "Is a row open?", not "is an id set?". `activeId` is shared with the other views, so it can
  // outlive the row it named — after a refetch, or after the tree selected a grouping node that
  // is not a row at all. Keying off the row keeps the pane and the placeholder consistent.
  const activeRow = useActiveRow();

  const byPath = (path: string | undefined) =>
    path ? visibleFields.find((f) => f.path === path) : undefined;

  // The date is pulled out of the card body and shown as a pill; everything else becomes a
  // label/value row.
  const dateField = byPath(datePath) ?? visibleFields.find((f) => f.type === "date" || f.type === "date-format");
  const titleField = byPath(titlePath);
  const rowFields = visibleFields.filter(
    (f) => f.path !== dateField?.path && f.type !== "hidden",
  );

  const Link = linkComponent ?? "a";

  return (
    // Split, like the tree: the gap shows the shell's black and the two panels sit on it.
    <div className={cn("flex h-full flex-col gap-2 bg-black md:flex-row", className)}>
      <ul
        className={cn(
          "border-border-presentation-global-primary flex w-full flex-col overflow-hidden rounded-[16px] border",
          "bg-background-presentation-form-base md:w-96",
        )}
      >
        <li className="border-border-presentation-global-primary border-b px-3 py-2">
          <span
            style={{ fontFeatureSettings: "'cv05' on" }}
            className="typography-display-medium-medium text-content-presentation-global-primary uppercase"
          >
            {titleField?.label ?? "inbox"}
          </span>
        </li>

        <div className="bg-background-presentation-button-disabled flex flex-1 flex-col gap-1 overflow-y-auto py-1">
          {loading && <SkeletonItems count={rowFields.length || 2} />}
          {!loading && rows.map((row, index) => {
            const id = getRowId(row, index);
            const selected = activeId === id;
            const href = itemHref?.(row, id);

            const card = renderItem ? (
              renderItem({ row, id, index, fields: visibleFields, isActive: selected })
            ) : (
              <>
                <div className="flex w-full flex-col gap-1">
                  {rowFields.map((field, i) => (
                    <div key={`${field.path}-${i}`} className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="typography-body-large-semibold text-content-presentation-global-secondary w-[100px] shrink-0">
                          {field.label ?? field.path}:
                        </span>
                        <span className="flex h-full items-center py-0.5">
                          <span className="bg-black-alpha-15 block h-full w-px" />
                        </span>
                        <span className="typography-body-large-medium text-content-presentation-global-primary min-w-0 flex-1 truncate">
                          <Cell field={field} row={row} />
                        </span>
                      </div>
                      {i < rowFields.length - 1 && <Divider className="mt-1" />}
                    </div>
                  ))}
                </div>

                {dateField && (
                  <div className="flex items-center justify-end">
                    <div className="bg-black-alpha-10 inline-flex items-center gap-0.5 rounded-md p-0.5">
                      <div className="rounded-sm px-1">
                        <span className="typography-labels-medium-semibold text-content-presentation-global-primary">
                          {dateField.label ?? "Created at"}:
                        </span>
                      </div>
                      <div className="bg-black-alpha-075 rounded-sm px-1">
                        <span className="typography-labels-medium-semibold text-content-presentation-global-primary">
                          <Cell field={dateField} row={row} />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            );

            const cardClass = cn(
              "flex cursor-pointer flex-col gap-2 p-3 transition-colors",
              "bg-background-presentation-form-base",
              // The transparent 2px edges are permanent so hover and selection never shift the row.
              "border-y-2 border-transparent",
              !selected &&
                "hover:bg-[image:linear-gradient(0deg,rgba(151,72,255,0.05)_0%,rgba(151,72,255,0.05)_100%)] hover:border-y-[#AE71FF]",
              selected &&
                "bg-[image:linear-gradient(0deg,rgba(0,117,255,0.05)_0%,rgba(0,117,255,0.05)_100%)] border-y-border-presentation-state-focus",
            );

            return (
              <li key={id}>
                {href ? (
                  <Link
                    href={href}
                    onClick={() => setActiveId(id)}
                    className={cn(cardClass, "text-inherit no-underline")}
                  >
                    {card}
                  </Link>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    aria-current={selected || undefined}
                    onClick={() => setActiveId(id)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter" && e.key !== " ") return;
                      e.preventDefault();
                      setActiveId(id);
                    }}
                    className={cardClass}
                  >
                    {card}
                  </div>
                )}
              </li>
            );
          })}
          {/* Asks for the next page as the list nears its end. Inside the scroller, so it is the
              list's own scrolling that triggers it. */}
          {hasMore && !loading && (
            <li ref={sentinelRef as React.Ref<HTMLLIElement>} aria-hidden className="h-px" />
          )}
          {loadingMore && <SkeletonItems count={rowFields.length || 2} items={2} />}
        </div>
      </ul>

      <div
        className={cn(
          "bg-background-presentation-form-base flex flex-1 flex-col overflow-hidden rounded-[16px]",
          activeRow === null && "border-border-presentation-global-primary items-center justify-center border",
        )}
      >
        {activeRow === null
          ? (placeholder ?? (
              <p className="text-content-presentation-global-tertiary">
                Select an item to view details
              </p>
            ))
          : children}
      </div>
    </div>
  );
}

/** Enough items to fill the list's fold. */
const SKELETON_ITEMS = 5;

/**
 * The loading list.
 *
 * Mirrors a real item: the same `p-3` card with `border-y-2` transparent edges, and the same
 * label / divider / value row at the 100px label column — so items do not reflow when the messages
 * arrive. `count` is the number of field rows a real item will have.
 */
function SkeletonItems({ count, items = SKELETON_ITEMS }: { count: number; items?: number }) {
  return (
    <>
      {skeletonKeys(items).map((item) => (
        <li key={`skeleton-${item}`}>
          <div className="bg-background-presentation-form-base flex flex-col gap-2 border-y-2 border-transparent p-3">
            <div className="flex w-full flex-col gap-1">
              {skeletonKeys(count).map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <SkeletonBar className="w-[100px] shrink-0" />
                  <span className="flex h-full items-center py-0.5">
                    <span className="bg-black-alpha-15 block h-full w-px" />
                  </span>
                  <SkeletonBar className={["w-[60%]", "w-[40%]", "w-[75%]"][(item + i) % 3]} />
                </div>
              ))}
            </div>
          </div>
        </li>
      ))}
    </>
  );
}

/**
 * `DataViews.Detail` — the default detail pane: every visible field as a label/value row. Drop it
 * in when you want something reasonable immediately, and replace it with your own JSX when you
 * do not.
 */
export function Detail({ className }: { className?: string }) {
  const { visibleFields } = useDataViewsData();
  const row = useActiveRow();
  if (!row) return null;

  return (
    <dl className={cn("flex flex-col gap-3 p-6", className)}>
      {visibleFields.map((f: FieldConfig, i) => (
        <div key={`${f.path}-${i}`} className="flex flex-col gap-[2px]">
          <dt className="typography-body-small-regular text-content-presentation-global-tertiary">
            {f.label ?? f.path}
          </dt>
          <dd className="typography-body-medium-medium text-content-presentation-global-primary">
            <Cell field={f} row={row} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export const InboxView = markView(InboxViewImpl, {
  defaultId: "inbox",
  defaultLabel: "Inbox",
});
