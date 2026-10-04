import * as React from "react";

/**
 * Track the document's language from `<html lang>`, updating when it changes.
 *
 * The companion to `useHtmlDir`, and for the same reason: an app that switches language already
 * writes the result onto `<html>` — i18next's `languageChanged` handler sets `lang` alongside `dir`
 * — so a component can read the active language straight from the DOM instead of being handed it.
 *
 * Reading the attribute rather than taking a prop is what makes an *external* language change work:
 * in an embedded app the shell can push a new language in by `postMessage` long after boot, with no
 * React render of its own to hang a prop off. The attribute changes; this follows.
 *
 * Returns the primary subtag, lowercased: `ar-SA` and `AR` both come back as `"ar"`. Region and
 * script are dropped because a component's own strings never vary by region, and keeping them would
 * turn one missing lookup into four.
 *
 * Defaults to `"en"` — when `lang` is unset, when it holds something unrecognised, and on the
 * server.
 */

const DEFAULT_LANG = "en";

/** `ar-SA` -> `ar`. Also absorbs an unset or empty attribute. */
function primarySubtag(tag: string | null | undefined): string {
  return (tag || DEFAULT_LANG).toLowerCase().split("-")[0] || DEFAULT_LANG;
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  return () => observer.disconnect();
}

function getSnapshot(): string {
  if (typeof document === "undefined") return DEFAULT_LANG;
  return primarySubtag(document.documentElement.lang);
}

/**
 * The server has no `<html>` to read, so it renders English.
 *
 * React also uses this during hydration, which is the whole reason this hook is a
 * `useSyncExternalStore` rather than a `useState` seeded in an effect: the client's hydrating render
 * matches the server's without a mismatch warning, and then re-renders with the real value. In an
 * app that never hydrates — a plain SPA, where `lang` is already set before React mounts — the
 * client snapshot is used from the very first render, so an Arabic page never flashes English.
 */
function getServerSnapshot(): string {
  return DEFAULT_LANG;
}

export function useHtmlLang(): string {
  // Safe to return a fresh string each call: `useSyncExternalStore` compares with `Object.is`, and
  // two equal primitives are identical — there is no new object identity to loop on.
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
