"use client";

import { ReactNode, RefObject, useCallback, useEffect, useRef, useState } from "react";
import type EditorJS from "@editorjs/editorjs";
import type Undo from "editorjs-undo";

import { cn } from "../../utils/cn";
import { Themes } from "../../utils/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../DropdownMenu";
import { currentRange, toggleWrap } from "./editor-tools/inlineFormat";
import type { Alignment } from "./editor-tools/AlignmentTune";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Props {
  editorRef: RefObject<EditorJS | null>;
  undoRef: RefObject<Undo | null>;
  holderRef: RefObject<HTMLDivElement | null>;
  /** Editor is initialized — enables the buttons. */
  ready: boolean;
  theme?: Themes;
}

type BlockType = { label: string; type: "paragraph" | "header"; level?: number };

const BLOCK_TYPES: BlockType[] = [
  { label: "Normal Text", type: "paragraph" },
  { label: "Heading 1", type: "header", level: 1 },
  { label: "Heading 2", type: "header", level: 2 },
  { label: "Heading 3", type: "header", level: 3 },
];

const COLORS = [
  "#1b1b1b",
  "#797c7f",
  "#e11d48",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#0075ff",
  "#8b5cf6",
  "#ec4899",
  "#ffffff",
];

const ALIGNMENTS: { value: Alignment; icon: string; label: string }[] = [
  { value: "left", icon: "ri-align-left", label: "Align left" },
  { value: "center", icon: "ri-align-center", label: "Align center" },
  { value: "right", icon: "ri-align-right", label: "Align right" },
];

// ─── Small icon button (design "button-2.0": p-[5px], rounded-[6px], 18px icon) ──
function Btn({
  onClick,
  disabled,
  active,
  title,
  children,
  className,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      // Preserve the editor's text selection: don't let the click move focus/caret before
      // the command runs.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-[6px] p-[5px] transition-colors",
        "text-content-presentation-global-primary [&_i]:text-[18px] [&_i]:leading-none",
        "disabled:cursor-not-allowed disabled:opacity-40",
        active ? "bg-black-alpha-10" : "hover:bg-black-alpha-10",
        className,
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <span className="h-[20px] w-px shrink-0 self-center bg-border-presentation-global-primary" />
  );
}

/** A tight cluster of buttons (design: groups are `gap-[2px]` internally, `gap-[8px]` apart). */
function Group({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-[2px]">{children}</div>;
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────
export function TextEditorToolbar({ editorRef, undoRef, holderRef, ready, theme }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Live formatting state (drives button highlight + block-type label).
  const [state, setState] = useState({
    blockLabel: "Normal Text",
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    align: "left" as Alignment,
    color: "#1b1b1b",
  });

  // A dropdown grabs focus when it opens (Radix menus always auto-focus), which loses the
  // editor's current block + text selection. So snapshot them the instant a toolbar control
  // is pressed — before focus moves — and act on the snapshot.
  const capturedIndex = useRef(-1);
  const capturedRange = useRef<Range | null>(null);
  const capture = useCallback(() => {
    capturedIndex.current = editorRef.current?.blocks.getCurrentBlockIndex() ?? -1;
    const r = currentRange();
    capturedRange.current =
      r && holderRef.current?.contains(r.commonAncestorContainer) ? r.cloneRange() : null;
  }, [editorRef, holderRef]);

  // The captured block (or the live one, for non-dropdown actions).
  const ctx = useCallback(() => {
    const ed = editorRef.current;
    if (!ed) return null;
    const live = ed.blocks.getCurrentBlockIndex();
    const index = live >= 0 ? live : capturedIndex.current;
    if (index < 0) return null;
    const block = ed.blocks.getBlockByIndex(index);
    return block ? { ed, index, block, id: block.id } : null;
  }, [editorRef]);

  // ── Read active state from the current selection (throttled) ──
  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const holder = holderRef.current;
      const sel = window.getSelection();
      if (!holder || !sel || sel.rangeCount === 0 || !holder.contains(sel.anchorNode)) return;
      const c = ctx();
      let blockLabel = "Normal Text";
      let align: Alignment = "left";
      if (c) {
        if (c.block.name === "header") {
          const h = c.block.holder.querySelector("h1,h2,h3,h4,h5,h6");
          blockLabel = h ? `Heading ${h.tagName[1]}` : "Heading";
        }
        const wrap = c.block.holder.querySelector<HTMLElement>(".cdx-align-wrap");
        align = (wrap?.dataset.align as Alignment) ?? "left";
      }
      setState((s) => ({
        ...s,
        blockLabel,
        align,
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strike: document.queryCommandState("strikeThrough"),
      }));
    };
    const onChange = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    document.addEventListener("selectionchange", onChange);
    return () => {
      document.removeEventListener("selectionchange", onChange);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ready, ctx, holderRef]);

  // ── Actions ──
  // The button's `onMouseDown` preventDefault keeps the editor's selection, so run the
  // command directly — do NOT refocus (that would collapse/move the selection).
  const exec = (cmd: string) => {
    document.execCommand(cmd);
  };

  const setBlock = async (bt: BlockType) => {
    const c = ctx();
    if (!c) return;
    try {
      await c.ed.blocks.convert(c.id, bt.type, bt.type === "header" ? { level: bt.level } : {});
      c.ed.caret.setToBlock(c.ed.blocks.getCurrentBlockIndex(), "end");
    } catch {
      /* conversion not available for this block */
    }
    setState((s) => ({ ...s, blockLabel: bt.label }));
  };

  const setList = async (style: "unordered" | "ordered") => {
    const c = ctx();
    if (!c) return;
    try {
      await c.ed.blocks.convert(c.id, "list", { style });
      c.ed.caret.setToBlock(c.ed.blocks.getCurrentBlockIndex(), "end");
    } catch {
      /* noop */
    }
  };

  const setAlign = (align: Alignment) => {
    const c = ctx();
    if (!c) return;
    const wrap = c.block.holder.querySelector<HTMLElement>(".cdx-align-wrap");
    if (wrap) {
      wrap.dataset.align = align;
      c.block.dispatchChange();
    }
    setState((s) => ({ ...s, align }));
  };

  const setColor = (color: string) => {
    // The color picker lives in a dropdown, so the live selection was lost when it opened —
    // restore the snapshot before wrapping.
    const r = capturedRange.current;
    if (r) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(r);
    }
    toggleWrap("span", { color });
    setState((s) => ({ ...s, color }));
  };

  const insertImage = (file: File) => {
    const c = ctx();
    const ed = editorRef.current;
    if (!ed) return;
    const reader = new FileReader();
    reader.onload = () => {
      ed.blocks.insert(
        "image",
        { url: reader.result as string },
        undefined,
        (c?.index ?? -1) + 1,
        true,
      );
    };
    reader.readAsDataURL(file);
  };

  const d = !ready;

  return (
    <div
      data-theme={theme}
      // Snapshot the editor's block/selection before a control press can move focus.
      onMouseDownCapture={capture}
      className={cn(
        "flex w-full flex-wrap items-center gap-[8px] p-[8px] rounded-tr-[6px] rounded-tl-[6px]",
        "border-b border-border-presentation-global-primary",
        "bg-background-presentation-form-header backdrop-blur-[8px]",
        "shadow-[0px_2px_9px_0px_var(--background-presentation-form-header-shadow)]",
      )}
    >
      {/* history */}
      <Group>
        <Btn title="Undo" disabled={d} onClick={() => undoRef.current?.undo()}>
          <i className="ri-arrow-go-back-fill" />
        </Btn>
        <Btn title="Redo" disabled={d} onClick={() => undoRef.current?.redo()}>
          <i className="ri-arrow-go-forward-fill" />
        </Btn>
      </Group>
      <Divider />

      {/* block type */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={d}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            disabled={d}
            className={cn(
              "flex items-center gap-[2px] rounded-[6px] px-[14px] py-[2px] transition-colors",
              "typography-body-large-medium text-content-presentation-global-primary",
              "hover:bg-black-alpha-10 disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            {state.blockLabel}
            <i className="ri-arrow-down-s-line text-[18px] leading-none" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {BLOCK_TYPES.map((bt) => (
            <DropdownMenuItem key={bt.label} onSelect={() => setBlock(bt)}>
              {bt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* align */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={d}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            disabled={d}
            title="Text align"
            className={cn(
              "flex items-center gap-[2px] rounded-[6px] px-[8px] py-[5px] transition-colors",
              "text-content-presentation-global-primary [&_i]:text-[18px] [&_i]:leading-none",
              "hover:bg-black-alpha-10 disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            <i
              className={ALIGNMENTS.find((a) => a.value === state.align)?.icon ?? "ri-align-left"}
            />
            <i className="ri-arrow-down-s-line" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {ALIGNMENTS.map((a) => (
            <DropdownMenuItem key={a.value} onSelect={() => setAlign(a.value)}>
              <i className={cn(a.icon, "text-[16px]")} />
              {a.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* color */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={d}>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            disabled={d}
            title="Text color"
            className={cn(
              "flex items-center gap-[2px] rounded-[6px] p-[4px] transition-colors",
              "hover:bg-black-alpha-10 disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            <span
              className="size-[22px] rounded-[6px] border border-border-presentation-global-primary"
              style={{ backgroundColor: state.color }}
            />
            <i className="ri-arrow-down-s-line text-[18px] leading-none text-content-presentation-global-primary" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <div className="grid grid-cols-5 gap-[6px] p-[6px]">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setColor(c)}
                className="size-[22px] rounded-[6px] border border-border-presentation-global-primary transition-transform hover:scale-110"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      <Divider />

      {/* format */}
      <Group>
        <Btn title="Bold" disabled={d} active={state.bold} onClick={() => exec("bold")}>
          <i className="ri-bold" />
        </Btn>
        <Btn title="Italic" disabled={d} active={state.italic} onClick={() => exec("italic")}>
          <i className="ri-italic" />
        </Btn>
        <Btn
          title="Underline"
          disabled={d}
          active={state.underline}
          onClick={() => exec("underline")}
        >
          <i className="ri-underline" />
        </Btn>
        <Btn
          title="Strikethrough"
          disabled={d}
          active={state.strike}
          onClick={() => toggleWrap("s")}
        >
          <i className="ri-strikethrough" />
        </Btn>
        <Btn title="Clear formatting" disabled={d} onClick={() => exec("removeFormat")}>
          <i className="ri-format-clear" />
        </Btn>
      </Group>
      <Divider />

      {/* lists + image (one group on the right, per the design) */}
      <Group>
        <Btn title="Bullet list" disabled={d} onClick={() => setList("unordered")}>
          <i className="ri-list-check" />
        </Btn>
        <Btn title="Ordered list" disabled={d} onClick={() => setList("ordered")}>
          <i className="ri-list-ordered-2" />
        </Btn>
        <Btn title="Insert image" disabled={d} onClick={() => fileInputRef.current?.click()}>
          <i className="ri-image-add-fill" />
        </Btn>
      </Group>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) insertImage(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
