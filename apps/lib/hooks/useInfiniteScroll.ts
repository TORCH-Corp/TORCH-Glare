"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Ask for the next page when the user scrolls near the end.
 *
 * Lives here rather than in a view because three of them need it — the table, the board's columns
 * and the inbox list — and "near the end" has to mean the same thing in all three.
 *
 * It is an `IntersectionObserver` on a sentinel element, not a scroll listener. A scroll handler
 * has to be throttled, reads layout on every frame to work out how close the bottom is, and stops
 * being correct the moment the container resizes. The observer is told once and answers all three
 * for free.
 *
 * Like everything else here it only *asks*. Nothing loads until you hand back more rows.
 */
export interface UseInfiniteScrollOptions {
  /** Fetch the next page and append it. */
  onLoadMore?: () => void;
  /** Whether there is a next page at all. */
  hasMore: boolean;
  /** True while a page is in flight. */
  loading?: boolean;
  /**
   * How far before the end to fire, in px. The default aims to have the next page arriving before
   * the user reaches the gap, rather than after they have already stopped at it.
   */
  rootMargin?: number;
}

/**
 * The element the sentinel actually scrolls inside, or `null` for the viewport.
 *
 * Walks up looking at `overflow-y` rather than at class names, so it keeps working whatever a
 * view calls its container — the table, the board's columns and the inbox list all differ.
 */
function scrollParentOf(el: HTMLElement): HTMLElement | null {
  let node = el.parentElement;
  while (node) {
    const overflow = getComputedStyle(node).overflowY;
    if (overflow === "auto" || overflow === "scroll") return node;
    node = node.parentElement;
  }
  return null;
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  loading = false,
  rootMargin = 400,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLElement | null>(null);

  /**
   * The guard against asking twice for the same page.
   *
   * The observer fires on intersection, but the rows that answer it do not arrive for a round
   * trip — and until they do, the sentinel is still on screen. Reading `loading` alone is not
   * enough either: a caller that sets it a tick late leaves a window where a second fire gets
   * through. So the hook latches when it asks, and only unlatches once the sentinel has actually
   * left the viewport again.
   */
  const askedRef = useRef(false);

  const ready = Boolean(onLoadMore) && hasMore && !loading;

  const handle = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (!visible) {
        askedRef.current = false;
        return;
      }
      if (askedRef.current || !ready) return;
      askedRef.current = true;
      onLoadMore?.();
    },
    [ready, onLoadMore],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(handle, {
      // The scroller has to be named. `root: null` means the *viewport*, not the nearest
      // scrollable ancestor — so inside a scrolling panel the sentinel is clipped away and
      // `rootMargin` expands the wrong box, which reads as "infinite scroll simply never fires".
      // Finding it here rather than asking for it keeps the call sites free of plumbing.
      root: scrollParentOf(el),
      rootMargin: `0px 0px ${rootMargin}px 0px`,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handle, rootMargin]);

  // The latch is released by the sentinel leaving, and by nothing else.
  //
  // Releasing it when `loading` went false instead — which is the obvious thing to write — burns
  // several pages on one flick to the bottom: the flag drops before the new rows have painted, so
  // the sentinel is still on screen and the next observer callback asks again, and again. Tying
  // the release to visibility makes one arrival at the end cost exactly one page, because the
  // rows that arrive are what push the sentinel out of view.

  return { sentinelRef };
}
