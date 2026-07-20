import { toggleWrap } from "./inlineFormat";

/**
 * EditorJS inline tool for **text color**. Its primary purpose is to register
 * `<span style="…">` in the block sanitizer so colored text survives `editor.save()`
 * (EditorJS unions every enabled inline tool's `sanitize` into the save config). The visible
 * color picker lives in the fixed `TextEditorToolbar`, which calls `applyColor()` — kept here
 * so the inline-toolbar path and the fixed-toolbar path share one implementation.
 */
export default class ColorInlineTool {
  private button: HTMLButtonElement | null = null;

  static get isInline() {
    return true;
  }

  static get title() {
    return "Color";
  }

  /** Allow the styled span (with its inline `style`) through the sanitizer. */
  static get sanitize() {
    return { span: { style: true } };
  }

  /** Wrap the current selection in `<span style="color:…">`; shared by both toolbars. */
  static applyColor(color: string): void {
    toggleWrap("span", { color });
  }

  render(): HTMLElement {
    // A minimal inline-toolbar entry (applies a default accent). The rich picker is the
    // fixed toolbar's dropdown.
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.classList.add("ce-inline-tool");
    this.button.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20h16"/><path d="m6 16 4-9 4 9"/><path d="M7.5 13h5"/></svg>';
    return this.button;
  }

  surround(range: Range): void {
    if (!range) return;
    ColorInlineTool.applyColor("#0075ff");
  }

  checkState(): boolean {
    return false;
  }
}
