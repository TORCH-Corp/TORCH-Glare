import { cva } from "class-variance-authority";

/**
 * DataViews chrome styles.
 *
 * ## Why the chrome is pinned to the dark theme
 *
 * The header bar and the config rail are always dark by design (Figma), even
 * when the host app runs in light mode — so both subtrees carry
 * `data-theme="dark"`. That is deliberate, and it is also what makes these
 * styles tokenised rather than hardcoded: inside a dark subtree the
 * `*-presentation-*` variables already resolve to exactly the hexes the Figma
 * spec calls for.
 *
 *   | Figma hex | token (resolved under `data-theme="dark"`)      |
 *   | --------- | ----------------------------------------------- |
 *   | `#1C1D1F` | `background-presentation-body-overlay-primary`  |
 *   | `#252729` | `background-presentation-body-primary`          |
 *   | `#2C2D2E` | `border-presentation-global-primary`            |
 *   | `#0075FF` | `border-presentation-state-focus`               |
 *   | `#005ECC` | `background-presentation-button-fill-blue-primary` |
 *   | `#FFFFFF` | `content-presentation-global-primary`           |
 *
 * ## The remaining literals
 *
 * A handful of Figma colours have no token in the design system. They stay as
 * hexes, but only here — so there is exactly one place to change when tokens
 * for them land. Do not reintroduce them at call sites.
 *
 * Per ARCHITECTURE.md §10: never use `bg-background-presentation-global-*`.
 * Those variables don't exist and render transparent; only the *text* and
 * *border* `global` families are real.
 */

/**
 * Figma colours with no design-system token yet.
 *
 * These are written as complete, literal Tailwind class strings rather than
 * bare hexes so the JIT compiler can actually see them — Tailwind scans source
 * text, so an interpolated `bg-[${hex}]` at a call site would never be
 * generated. This file is inside the `./lib/**` content glob, so the classes
 * below are picked up and every call site imports the finished string.
 */
export const RAW_CLASS = {
  /** Kanban "purple" column pill — no presentation-layer match close enough. */
  kanbanPurple: "bg-[#330C69]",
  /** Switcher-1.0 "On" state green, outside the theme system. */
  switchOn: "data-[state=checked]:bg-[#0AC713] data-[state=checked]:border-[#0AC713]",
  /** Selected-row accent on inbox cards. */
  inboxAccentBorder: "hover:border-y-[#AE71FF]",
} as const;

/** Raw hex values, for the few places that need an inline `style` rather than a
 *  class (arbitrary one-off rules Tailwind would not generate). */
export const RAW = {
  /** Header title-pill border + header/toolbar divider rules. */
  chromeDivider: "#434446",
} as const;

/** The Root shell: black canvas, 2×2 grid, header/view/rail cells. */
export const shellStyles = cva([
  "grid h-screen grid-cols-[minmax(0,1fr)_auto] grid-rows-[auto_minmax(0,1fr)] gap-2",
  // `overflow-hidden` traps child overflow — without it a tall config body
  // escapes and adds a page-level scrollbar alongside its own.
  "overflow-hidden bg-black text-content-presentation-global-primary",
]);

/** The always-dark header bar. */
export const headerStyles = cva([
  "col-start-1 row-start-1 flex h-[52px] w-full items-center gap-2 rounded-[12px] bg-black px-2",
]);

/** The header's title pill. */
export const titlePillStyles = cva([
  "flex h-9 shrink-0 items-center gap-2 rounded-[12px] px-[10px]",
  "border border-[#434446] bg-background-presentation-body-primary",
]);

/** The always-dark config rail. */
export const configPanelStyles = cva(
  [
    "flex h-full w-[260px] flex-col overflow-hidden rounded-[16px] bg-black",
    "duration-200 ease-in-out transition-opacity",
  ],
  {
    variants: {
      state: {
        open: "opacity-100",
        closed: "opacity-0",
      },
    },
    defaultVariants: { state: "open" },
  },
);

/** Section heading inside the config rail / filter panel. */
export const panelSectionTitle = cva([
  "text-[18px] font-[510] leading-[1.32] tracking-[-0.01em]",
  "text-content-presentation-global-primary",
]);

/** Hairline rule between config-rail sections. */
export const panelDivider = cva(["h-px w-full bg-border-presentation-global-primary"]);

/**
 * A rounded well holding a list of option rows (filter checkboxes, saved-view
 * radios, sort radios). Dividers between rows hide around the hovered row.
 */
export const optionListStyles = cva([
  "flex flex-col space-y-0 rounded-[12px] p-1",
  "bg-background-presentation-body-overlay-primary",
  // Hide the divider directly above and below the hovered row.
  "[&>div:has(>[role=radio]:hover)>.dv-divider]:opacity-0",
  "[&>div:has(>[role=radio]:hover)+div>.dv-divider]:opacity-0",
  "[&>div:has(>label:hover)>.dv-divider]:opacity-0",
  "[&>div:has(>label:hover)+div>.dv-divider]:opacity-0",
]);

/** Divider between two option rows. Carries `dv-divider` so the hover rules
 *  in {@link optionListStyles} can target it. */
export const optionDivider = cva(["dv-divider h-px bg-border-presentation-global-primary"]);

/** A single option row (checkbox variant). */
export const optionRowStyles = cva([
  "flex cursor-pointer items-center gap-2 rounded-[8px] px-2 py-2 text-[14px]",
  "text-content-presentation-global-primary",
  "hover:bg-background-presentation-action-contstyle-hover",
]);

/** Draggable column row in the config rail's Table Columns section. */
export const columnRowStyles = cva(
  [
    // SB-Column-Item: standalone pill. Figma container spec: 8px radius,
    // 8.8px padding, 8px gap between grip / label / switch.
    "flex items-center gap-2 rounded-e-[99px] rounded-s-[60px] p-[8.8px] transition-colors",
    "border border-border-presentation-action-primary",
    "bg-background-presentation-body-overlay-primary",
    "cursor-grab active:cursor-grabbing",
  ],
  {
    variants: {
      dragging: {
        true: "opacity-50",
        false: "hover:bg-background-presentation-body-primary",
      },
    },
    defaultVariants: { dragging: false },
  },
);

/** The 2px insertion line shown between rows during a drag-reorder. */
export const dropLineStyles = cva([
  "absolute -top-[1px] left-0 right-0 h-[2px] rounded-full",
  "bg-background-presentation-button-fill-blue-primary",
]);
