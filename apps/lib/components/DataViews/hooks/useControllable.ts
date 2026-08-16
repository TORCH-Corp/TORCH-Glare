"use client";

import { useCallback, useRef, useState } from "react";

/**
 * One controlled/uncontrolled pair, written once.
 *
 * Pass `value` to control it; omit `value` to let the component keep its own. `onChange` fires
 * either way, so a consumer can observe without taking ownership.
 *
 * `set` accepts an updater, because the thing this now holds — the query — is patched rather than
 * replaced: changing a filter has to read the page it is resetting.
 */
export function useControllable<T>(
  value: T | undefined,
  onChange: ((next: T) => void) | undefined,
  fallback: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  const [internal, setInternal] = useState<T>(fallback);

  // `value !== undefined` decides the mode. Latch the first answer so a consumer that
  // accidentally flips between the two gets a warning-free, stable component rather than
  // React's "changing an uncontrolled input to controlled" class of bug.
  const controlledRef = useRef(value !== undefined);
  const isControlled = controlledRef.current;

  const current = isControlled ? (value as T) : internal;

  /**
   * The value an updater builds on.
   *
   * Reset to `current` on every render, and advanced *synchronously* by `set` — so two patches in
   * one tick chain instead of racing. Without that, restoring a saved view (which puts back the
   * sort and the filters one after the other) silently drops the first: both would read the value
   * from the last render, and the second would win.
   */
  const pendingRef = useRef(current);
  pendingRef.current = current;

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (prev: T) => T)(pendingRef.current) : next;
      pendingRef.current = resolved;
      if (!controlledRef.current) setInternal(resolved);
      onChange?.(resolved);
    },
    [onChange],
  );

  return [current, set];
}
