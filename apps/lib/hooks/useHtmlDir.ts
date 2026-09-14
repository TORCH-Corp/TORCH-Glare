import * as React from "react";

/**
 * Track the document's text direction from `<html dir>`, updating when it
 * changes (e.g. on a language switch).
 *
 * Several Radix primitives (Tabs, etc.) default to `"ltr"` when no `dir` prop
 * or `DirectionProvider` is supplied, which leaves them rendered left-to-right
 * even on an RTL page. Forwarding this value as their `dir` makes them mirror
 * correctly in Arabic.
 */
export function useHtmlDir(): "ltr" | "rtl" {
  const read = () =>
    typeof document !== "undefined" && document.documentElement.dir === "rtl"
      ? "rtl"
      : "ltr";

  const [dir, setDir] = React.useState<"ltr" | "rtl">(read);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const sync = () => setDir(read());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(html, { attributes: true, attributeFilter: ["dir"] });
    return () => observer.disconnect();
  }, []);

  return dir;
}
