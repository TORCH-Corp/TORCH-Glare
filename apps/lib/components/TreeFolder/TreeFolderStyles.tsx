"use client"

/**
 * Component-scoped CSS for TreeFolder. Rendered once by TreeFolder itself so
 * the styles ship with the component (no globals.css required by consumers).
 *
 * Why a <style> tag instead of a CSS import:
 * - Some consumers may not run a CSS pipeline that picks up imports from
 *   node_modules.
 * - The styles target pseudo-elements (::-webkit-scrollbar-*) that Tailwind
 *   can't express without a plugin, and CSS-in-JS libraries would add a dep.
 * - Inlining keeps the public package zero-config.
 *
 * The rules are scoped to `.tf-scroll`, which only TreeFolder applies — no
 * risk of leaking to other elements on the page.
 */
const CSS = `
.tf-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
}
.tf-scroll::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.tf-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.tf-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.18);
  border: 2px solid transparent;
  background-clip: content-box;
  border-radius: 999px;
}
.tf-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
  background-clip: content-box;
}
.tf-scroll::-webkit-scrollbar-corner {
  background: transparent;
}
[data-theme="light"] .tf-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.22);
  background-clip: content-box;
}
[data-theme="light"] .tf-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.35);
  background-clip: content-box;
}
`

/**
 * Renders a single <style> tag containing TreeFolder's scoped CSS.
 * Mounting multiple TreeFolder instances is fine — browsers deduplicate
 * identical inline stylesheets; we additionally key on a known id so React
 * keeps just one DOM node when it can.
 */
export function TreeFolderStyles() {
  return <style id="torch-treefolder-styles" dangerouslySetInnerHTML={{ __html: CSS }} />
}
