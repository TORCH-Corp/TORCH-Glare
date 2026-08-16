"use client";

import React from "react";
import { cn } from "../../utils/cn";
import { Skeleton } from "../Skeleton";

/**
 * The shared parts of a loading state.
 *
 * There is deliberately no `Empty` here. When there is nothing to show, the view shows nothing —
 * a table keeps its header band and has no rows, a board keeps its columns and has no cards. A
 * centred sentence in place of the view threw the chrome away and made the layout jump twice on
 * every query, and it could not tell "no results" apart from "not fetched yet", so the first load
 * of every page announced that nothing matched before anything had been asked for.
 *
 * Loading is answered per view instead, because a skeleton is only useful if it is the shape of
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
