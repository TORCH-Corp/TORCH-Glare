"use client";

import type { ReactNode } from "react";

import { cn } from "../../utils/cn";
import { Skeleton } from "../Skeleton";
import { markEmpty } from "./slots";

/**
 * The shared parts of a loading state, and the empty slot.
 *
 * Upstream ships no `Empty`, for reasons that are mostly still right: a centred sentence in place
 * of the view throws the chrome away and makes the layout jump twice on every query, and — the
 * real bug — it could not tell "no results" apart from "not fetched yet", so the first load of
 * every page announced that nothing matched before anything had been asked for.
 *
 * `Empty` below (LOCAL PATCH, Contact Center) keeps that objection answered rather than ignoring
 * it. It is a SLOT, not a design: the caller supplies the whole UI, and the root fills it only
 * when the query has settled (`!loading`) and still returned nothing. "Not fetched yet" is still
 * the view's own skeleton, so the two states stay distinguishable. What it fixes is the shape the
 * app was forced into without it — an unrecognised child renders as an "extra" ABOVE the view, so
 * an empty list showed the message stacked on top of an empty table, headers and all.
 *
 * Loading is still answered per view, because a skeleton is only useful if it is the shape of
 * the thing that is coming. These are the pieces the four views share so they cannot drift; the
 * shapes themselves live with the view that owns them.
 */

/**
 * One shimmer bar.
 *
 * Vary the width at the call site — a column of identical bars reads as a grid rather than as
 * text that has not arrived.
 */
export function SkeletonBar({ className }: { className?: string }) {
  return <Skeleton className={cn("h-[14px] w-full rounded-[4px]", className)} />;
}

/**
 * `n` keys to map over.
 *
 * Counts are the view's own constant, not `pageSize`: they exist to fill the fold, and a skeleton
 * that promises exactly as many rows as are coming is a promise it cannot keep — the server
 * decides that, and it has not answered yet.
 */
export const skeletonKeys = (n: number) => Array.from({ length: n }, (_, i) => i);

/**
 * `DataViews.Empty` — what renders **in place of** the view when a settled query returns no rows.
 *
 * LOCAL PATCH (Contact Center). A passthrough with a marker: it holds no opinion about what an
 * empty state looks like, it only tells the root "put this where the view goes". The root fills
 * it on `!loading && rows.length === 0`; write it anywhere among the children.
 *
 * Note the caller's content is what gets the body slot's height, so give it `flex-1` if it should
 * centre rather than sit at the top of a tall surface — the app's shared `EmptyState` sizes
 * itself intrinsically.
 *
 * ```tsx
 * <DataViews rows={rows} fields={fields}>
 *   <DataViews.Header title="Fields">…</DataViews.Header>
 *   <DataViews.Empty>
 *     <EmptyState className="flex-1" title={search ? "No matches" : "No fields yet"} />
 *   </DataViews.Empty>
 *   <DataViews.Table />
 * </DataViews>
 * ```
 */
export function Empty({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cn("flex min-h-0 flex-1 flex-col", className)}>{children}</div>;
}

markEmpty(Empty);
