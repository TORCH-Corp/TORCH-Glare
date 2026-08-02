/**
 * Development-only misuse warnings.
 *
 * DataViews is heavily config-driven — a typo'd field path or a half-wired
 * controlled prop fails silently rather than loudly, and the symptom (an empty
 * board, a checkbox that won't tick) rarely points at the cause. These warnings
 * name the cause.
 *
 * Every call is behind `process.env.NODE_ENV !== "production"`, which bundlers
 * fold to a constant, so the calls and their messages are dropped from
 * production builds.
 */

const seen = new Set<string>();

/**
 * Warn once per unique key. Components re-render freely; a warning that fires
 * on every render is noise the developer learns to filter out.
 */
export function devWarn(key: string, message: string): void {
  if (process.env.NODE_ENV === "production") return;
  if (seen.has(key)) return;
  seen.add(key);
  console.warn(`[DataViews] ${message}`);
}

/** Test-only: forget which warnings have already fired. */
export function resetDevWarnings(): void {
  seen.clear();
}
