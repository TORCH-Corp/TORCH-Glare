/**
 * Shared DOM helpers for the editor's inline formatting, used by both the custom inline
 * tools (Strikethrough, Color) and the fixed `TextEditorToolbar` so they emit identical
 * markup. Kept deterministic (own Range manipulation) rather than relying only on
 * `document.execCommand`, whose output tag varies across browsers.
 */

/** The current selection Range, or null when there's no usable selection. */
export function currentRange(): Range | null {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  return sel.getRangeAt(0);
}

/** Walk up from a node to find an ancestor matching `predicate`, stopping at the block root. */
function closestWithin(
  node: Node | null,
  predicate: (el: HTMLElement) => boolean,
): HTMLElement | null {
  let el: Node | null = node;
  while (el && el instanceof HTMLElement) {
    if (el.classList?.contains("ce-block")) return null;
    if (predicate(el)) return el;
    el = el.parentElement;
  }
  return null;
}

/** Is the current selection already inside an element matching `predicate`? */
export function selectionHas(predicate: (el: HTMLElement) => boolean): boolean {
  const range = currentRange();
  if (!range) return false;
  const node = range.commonAncestorContainer;
  const start = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as HTMLElement);
  return !!closestWithin(start, predicate);
}

/**
 * Toggle-wrap the current selection in `<tagName>` (optionally with inline styles). If the
 * selection is already fully inside such a tag, it is unwrapped instead. Returns true when
 * something changed. Applies styles when wrapping so callers (e.g. color) get a `<span
 * style="...">` whose attributes match the tool's sanitize allowlist.
 */
export function toggleWrap(tagName: string, styles?: Record<string, string>): boolean {
  const range = currentRange();
  if (!range || range.collapsed) return false;

  const tag = tagName.toLowerCase();
  const matches = (el: HTMLElement) =>
    el.tagName.toLowerCase() === tag &&
    (!styles ||
      Object.entries(styles).every(
        ([k, v]) => el.style.getPropertyValue(k) === v || el.style[k as never] === v,
      ));

  // Already wrapped → unwrap (lift the tag's children out, drop the tag).
  const startEl =
    range.startContainer.nodeType === Node.TEXT_NODE
      ? range.startContainer.parentElement
      : (range.startContainer as HTMLElement);
  const existing = closestWithin(startEl, matches);
  if (existing) {
    const parent = existing.parentNode;
    if (!parent) return false;
    while (existing.firstChild) parent.insertBefore(existing.firstChild, existing);
    parent.removeChild(existing);
    return true;
  }

  // Wrap the selected contents.
  const wrapper = document.createElement(tag);
  if (styles) for (const [k, v] of Object.entries(styles)) wrapper.style.setProperty(k, v);
  try {
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
    // Reselect the wrapped content so repeated clicks toggle correctly.
    const sel = window.getSelection();
    if (sel) {
      const r = document.createRange();
      r.selectNodeContents(wrapper);
      sel.removeAllRanges();
      sel.addRange(r);
    }
    return true;
  } catch {
    return false;
  }
}

/** Read the effective text color of the current selection (rgb string), or "" if none. */
export function selectionColor(): string {
  const range = currentRange();
  if (!range) return "";
  const node = range.startContainer;
  const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as HTMLElement);
  if (!el) return "";
  return getComputedStyle(el).color || "";
}
