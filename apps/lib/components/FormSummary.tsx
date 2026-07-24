"use client";

import { Children, Fragment, createContext, useContext, useId, useState, ReactNode } from "react";
import { useWatch, type Control, type FieldValues, type UseFormReturn } from "react-hook-form";

import { cn } from "../utils/cn";
import { Group, Input, Trilling } from "./Input";
import { ConclusionHeader } from "./ConclusionHeader";

/**
 * The form the rows read from. `undefined` means "fall back to the surrounding
 * FormProvider" — which is what react-hook-form's `useWatch` does with no `control`.
 */
const ControlContext = createContext<Control | undefined>(undefined);

/** Format a computed amount with thousands separators and fixed decimals (2 → "1,299.00"). */
export function formatAmount(value: unknown, decimals = 2): string {
  if (value == null || value === "") return "";
  const n = typeof value === "number" ? value : Number(String(value).replace(/,/g, ""));
  if (Number.isNaN(n)) return "";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/** Currency-code color. Maps to Glare's semantic state tokens. */
export type SummaryTone = "neutral" | "success" | "info";

const toneStyles: Record<SummaryTone, string> = {
  neutral: "text-content-presentation-action-light-secondary",
  success: "text-content-presentation-state-success",
  info: "text-content-presentation-state-information",
};

export interface FormSummaryProps<T extends FieldValues = FieldValues> {
  /** Panel title, e.g. "Invoice" (bold). */
  title: ReactNode;
  /** Muted text beside the title, e.g. "Summary". */
  subtitle?: ReactNode;
  /**
   * The form to read values from. Required when the panel renders **outside** the
   * `<FormBuilder>` (the usual case — the two sit side by side, so hoist `useForm`
   * and hand the same instance to both). Omit it only when the panel is a child of
   * the form, in which case it reads the surrounding context.
   */
  form?: UseFormReturn<T>;
  /** Panel width (default `228px`, matching the design). */
  width?: number | string;
  className?: string;
  children: ReactNode;
}

/**
 * `FormSummary` — a read-only calculation panel displayed **beside a form**.
 *
 * Each `FormSummary.Row` declares a `compute(values)` that runs against the **live** form
 * values (via react-hook-form `useWatch`), so every total recalculates as the user types.
 *
 * It renders *outside* the form, so hoist the form and share it:
 *
 * ```tsx
 * const form = useForm({ resolver, defaultValues })
 *
 * <div className="flex items-start gap-4">
 *   <FormBuilder form={form} onSubmit={save} className="flex-1">…fields…</FormBuilder>
 *   <FormSummary form={form} title="Invoice" subtitle="Summary">…rows…</FormSummary>
 * </div>
 * ```
 */
function FormSummaryRoot<T extends FieldValues = FieldValues>({
  title,
  subtitle,
  form,
  width = 228,
  className,
  children,
}: FormSummaryProps<T>) {
  // The design stacks the header and every group in ONE 12px-gap column, with the dividers
  // as their own items — so they're interleaved here rather than drawn with `divide-y`,
  // which can only sit flush against a child's edge and couldn't be centred in its block.
  const groups = Children.toArray(children).filter(Boolean);

  return (
    <ControlContext.Provider value={form?.control as Control | undefined}>
      <aside
        data-theme="dark"
        style={{ width: typeof width === "number" ? `${width}px` : width }}
        className={cn(
          "flex h-full flex-col gap-3 overflow-hidden rounded-[16px] bg-black text-white",
          className,
        )}
      >
        {/* 48px tall: 12 + 24 + 12, aligned with the groups at px-2. Pinned — only the
            groups below it scroll. */}
        <header className="flex shrink-0 items-baseline gap-1 px-2 py-3">
          <span className="typography-body-large-medium text-white">{title}</span>
          {subtitle && (
            <span className="typography-body-medium-regular text-[#A0A0A0]">{subtitle}</span>
          )}
        </header>

        {/* Takes the remaining height and scrolls when the groups outrun it, as in the
            design (its group column is taller than the panel). `min-h-0` is required —
            without it this flex child refuses to shrink below its content and the panel
            grows instead of scrolling. */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-3 scrollbar-hide">
          {groups.map((group, i) => (
            <Fragment key={i}>
              {/* Full-bleed divider: a 16px block with the line at its centre, so the 12px
                  column gap either side lands the line 20px clear of both groups. */}
              {i > 0 && (
                <div className="flex h-4 items-center" aria-hidden>
                  <div className="h-px w-full bg-[#2C2D2E]" />
                </div>
              )}
              {group}
            </Fragment>
          ))}
        </div>
      </aside>
    </ControlContext.Provider>
  );
}

export interface FormSummaryGroupProps {
  title?: ReactNode;
  /** Make the group collapsible via a `ConclusionHeader` title (default `true` when titled). */
  collapsible?: boolean;
  /** Initial open state when collapsible (default `true`). */
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * A titled group of summary rows. When it has a `title` it is **collapsible**: the title
 * is a `ConclusionHeader` whose chevron opens/closes just this group's rows.
 */
function FormSummaryGroup({
  title,
  collapsible = true,
  defaultOpen = true,
  className,
  children,
}: FormSummaryGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  const isCollapsible = collapsible && title != null;
  const shown = !isCollapsible || open;

  return (
    // No `gap` here: the body collapses to zero height, and a flex gap would survive it as
    // dead space. The 12px below the title is `pt-3` on the body — inside what collapses.
    // No vertical padding either: the panel's 12px column gap is the only spacing between
    // groups, and the dividers carry their own.
    <section className={cn("flex flex-col px-2", className)}>
      {title != null &&
        (isCollapsible ? (
          <ConclusionHeader
            label={title}
            open={open}
            onOpenChange={setOpen}
            aria-controls={bodyId}
          />
        ) : (
          <h3 className="typography-body-large-medium text-white">{title}</h3>
        ))}

      {/* Fold/unfold: `grid-rows-[0fr → 1fr]` animates to the rows' natural height without
          measuring it, so the group stays a pure-CSS transition. The inner `overflow-hidden`
          is what the 0fr track actually clips — it must stay a bare wrapper. */}
      <div
        id={bodyId}
        // Collapsed rows keep their inputs in the DOM, so `inert` is what takes them out of
        // the tab order and the a11y tree — `overflow-hidden` alone would still let focus in.
        inert={!shown}
        aria-hidden={!shown}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200 ease-in-out",
          "motion-reduce:transition-none",
          shown ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          {/* Rows sit flush with the header (both at the section's px-2), 12px apart. */}
          <div className={cn("flex flex-col gap-3", title != null && "pt-3")}>{children}</div>
        </div>
      </div>
    </section>
  );
}

export interface FormSummaryRowProps<T extends FieldValues = FieldValues> {
  label: ReactNode;
  /**
   * The calculation. Receives the **live** form values and returns the row's value.
   * Omit it and pass `value` for a static row.
   */
  compute?: (values: T) => number | string | undefined | null;
  /** Static value (used when there's no `compute`). */
  value?: number | string | null;
  /** Currency code shown beside the label, e.g. "IQD" / "USD". */
  currency?: ReactNode;
  /** Color of the currency code. */
  tone?: SummaryTone;
  /** The primary result — renders with a lighter, emphasized border. */
  emphasized?: boolean;
  /** Decimal places (default 2 → `0.00`). */
  decimals?: number;
  /** Trailing slot inside the field, e.g. an `ActionButton`. */
  action?: ReactNode;
  /** Override the default number formatting. */
  format?: (value: number | string | undefined | null) => string;
  className?: string;
}

/**
 * One summary row: a label above a read-only, right-aligned value field.
 *
 * Uses the raw `Input` primitives (`Group`/`Input`/`Trilling`) rather than `InputField`,
 * which always wraps in a Popover/Tooltip and whose `className` targets the wrapper —
 * so it can't right-align the value text.
 */
function FormSummaryRow<T extends FieldValues = FieldValues>({
  label,
  compute,
  value,
  currency,
  tone = "neutral",
  emphasized,
  decimals = 2,
  action,
  format,
  className,
}: FormSummaryRowProps<T>) {
  // Subscribes to the form's values — recomputes as the user types. `control` comes
  // from the panel's `form` prop; with none, useWatch falls back to a surrounding
  // FormProvider (so the panel still works as a child of the form).
  const control = useContext(ControlContext);
  const values = useWatch({ control }) as T;
  const raw = compute ? compute(values) : value;
  const text = format ? format(raw) : formatAmount(raw, decimals);

  return (
    // 18px label + 4px + 30px field = the design's 52px row.
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="typography-body-small-regular text-[#E5E5E5]">{label}</span>

      <Group
        size="S"
        variant="PresentationStyle"
        className={cn("w-full", emphasized && "!border-black-400")}
      >
        {/* readOnly, not disabled — `disabled` triggers the greyed-out field styles.
            `mask-image:none` cancels Input's fade-out-to-the-right gradient, which
            would otherwise fade the tail of a right-aligned value. */}
        <Input readOnly value={text} tabIndex={-1} className="cursor-default [mask-image:none]" />

        {/* The currency code rides in the field's trailing slot, not the label — it shares
            the slot with `action`, which is why both live in one `Trilling`. */}
        {(currency || action) && (
          <Trilling>
            {currency && (
              <span className={cn("pe-1 typography-body-small-medium", toneStyles[tone])}>
                {currency}
              </span>
            )}
            {action}
          </Trilling>
        )}
      </Group>
    </div>
  );
}

export const FormSummary = Object.assign(FormSummaryRoot, {
  Group: FormSummaryGroup,
  Row: FormSummaryRow,
});

FormSummaryRoot.displayName = "FormSummary";
