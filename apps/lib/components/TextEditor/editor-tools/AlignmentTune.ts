import type { API, BlockAPI } from "@editorjs/editorjs";
import type { MenuConfig } from "@editorjs/editorjs/types/tools";

export type Alignment = "left" | "center" | "right";

interface AlignmentData {
  alignment?: Alignment;
}

const ICONS: Record<Alignment, string> = {
  left: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h10M4 18h13"/></svg>',
  center:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M7 12h10M5 18h14"/></svg>',
  right:
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M10 12h10M7 18h13"/></svg>',
};

/**
 * A block **tune** that stores per-block text alignment. It is registered globally (via the
 * editor's `tunes`), so every block gets it.
 *
 * `wrap()` tags the block content with `.cdx-align-wrap` + a `data-align` attribute — this both
 * restores saved alignment on render AND gives the fixed `TextEditorToolbar` a stable node to
 * drive (the toolbar sets `data-align` on the current block and calls `dispatchChange`, and
 * `save()` reads it back). CSS in `TextEditor` maps `data-align` → `text-align`.
 */
export default class AlignmentTune {
  private api: API;
  private block: BlockAPI;
  private alignment: Alignment;
  private wrapper: HTMLElement | null = null;

  static get isTune() {
    return true;
  }

  constructor({ api, block, data }: { api: API; block: BlockAPI; data: AlignmentData }) {
    this.api = api;
    this.block = block;
    this.alignment = data?.alignment ?? "left";
  }

  wrap(content: HTMLElement): HTMLElement {
    this.wrapper = content;
    content.classList.add("cdx-align-wrap");
    content.dataset.align = this.alignment;
    return content;
  }

  save(): AlignmentData {
    return { alignment: (this.wrapper?.dataset.align as Alignment) ?? this.alignment };
  }

  /** Set alignment on this block (used by the block-settings menu and, via the DOM node, the toolbar). */
  setAlignment(alignment: Alignment): void {
    this.alignment = alignment;
    if (this.wrapper) this.wrapper.dataset.align = alignment;
    this.block.dispatchChange();
  }

  render(): MenuConfig {
    return (["left", "center", "right"] as Alignment[]).map((a) => ({
      icon: ICONS[a],
      title: `Align ${a}`,
      toggle: "align",
      isActive: this.alignment === a,
      onActivate: () => this.setAlignment(a),
    }));
  }
}
