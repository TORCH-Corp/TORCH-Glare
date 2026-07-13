"use client";

import { createContext, useContext, ReactNode } from "react";
import { useWatch, type Control, type FieldValues, type UseFormReturn } from "react-hook-form";

import { cn } from "../utils/cn";
import { Group, Input, Trilling } from "./Input";

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
  /** Panel width (default `229px`, matching the design). */
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
  width = 229,
  className,
  children,
}: FormSummaryProps<T>) {
  return (
    <ControlContext.Provider value={form?.control as Control | undefined}>
      <aside
        data-theme="dark"
        style={{ width: typeof width === "number" ? `${width}px` : width }}
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-[16px] bg-black text-white",
          className,
        )}
      >
        <header className="flex items-baseline gap-1.5 px-4 pb-2 pt-4">
          <span className="typography-body-large-medium text-white">{title}</span>
          {subtitle && (
            <span className="typography-body-medium-regular text-[#A0A0A0]">{subtitle}</span>
          )}
        </header>

        {/* Groups are separated by the SystemStyle border, as in the design. */}
        <div className="flex flex-col divide-y divide-[#2C2D2E]">{children}</div>
      </aside>
    </ControlContext.Provider>
  );
}

export interface FormSummaryGroupProps {
  title?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A titled group of summary rows. */
function FormSummaryGroup({ title, className, children }: FormSummaryGroupProps) {
  return (
    <section className={cn("flex flex-col gap-3 px-4 py-4", className)}>
      {title && <h3 className="typography-body-large-medium text-white">{title}</h3>}
      {children}
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
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="typography-body-small-regular text-[#E5E5E5]">
        {label}
        {currency && <span className={cn("ml-1", toneStyles[tone])}>({currency})</span>}
      </span>

      <Group
        size="S"
        variant="SystemStyle"
        className={cn("w-full", emphasized && "!border-black-400")}
      >
        {/* readOnly, not disabled — `disabled` triggers the greyed-out field styles.
            `mask-image:none` cancels Input's fade-out-to-the-right gradient, which
            would otherwise fade the tail of a right-aligned value. */}
        <Input
          readOnly
          value={text}
          tabIndex={-1}
          className="cursor-default [mask-image:none]"
        />
        {action && <Trilling>{action}</Trilling>}
      </Group>
    </div>
  );
}

export const FormSummary = Object.assign(FormSummaryRoot, {
  Group: FormSummaryGroup,
  Row: FormSummaryRow,
});

FormSummaryRoot.displayName = "FormSummary";
