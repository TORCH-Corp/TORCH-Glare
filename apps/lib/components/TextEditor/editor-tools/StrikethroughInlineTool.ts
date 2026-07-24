import { selectionHas, toggleWrap } from "./inlineFormat";

/**
 * EditorJS inline tool for **strikethrough**. Its main job is to register `<s>` (and legacy
 * `<strike>`/`<del>`) in the block sanitizer so strikethrough survives `editor.save()` —
 * EditorJS unions every enabled inline tool's `sanitize` into each block's save config. It
 * also adds the button to the inline (selection) toolbar; the fixed toolbar uses the same
 * `toggleWrap("s")` helper so both paths produce identical markup.
 */
export default class StrikethroughInlineTool {
  private button: HTMLButtonElement | null = null;

  static get isInline() {
    return true;
  }

  static get title() {
    return "Strikethrough";
  }

  static get sanitize() {
    return { s: {}, strike: {}, del: {} };
  }

  static get shortcut() {
    return "CMD+SHIFT+X";
  }

  render(): HTMLElement {
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.classList.add("ce-inline-tool");
    this.button.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/><path d="M16 6.5A3.5 3.5 0 0 0 12.5 4h-1A3.5 3.5 0 0 0 8 7.5c0 1.5 1 2.5 3 3"/><path d="M8.5 15c.5 2 2 3 4 3h.5a3.5 3.5 0 0 0 0-7"/></svg>';
    return this.button;
  }

  surround(range: Range): void {
    if (!range) return;
    toggleWrap("s");
  }

  checkState(): boolean {
    const active = selectionHas((el) => ["s", "strike", "del"].includes(el.tagName.toLowerCase()));
    this.button?.classList.toggle("ce-inline-tool--active", active);
    return active;
  }
}
