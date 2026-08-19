"use client";

import { ReactNode } from "react";

import { SectionBlock, type SectionColor, type SectionVariant } from "../SectionBlock";

export interface SectionProps {
  title?: ReactNode;
  color?: SectionColor;
  icon?: ReactNode;
  /**
   * `"Table"` switches to the full-bleed table shell — no body padding, a rule under
   * the header, and the card clipped to its radius. `FormBuilder.Table` uses it; pass
   * it here only when hand-composing a table inside a section.
   */
  variant?: SectionVariant;
  /** Right-aligned content on the title row — e.g. action buttons. */
  action?: ReactNode;
  children: ReactNode;
}

/**
 * `FormRenderer.Section` — a titled Glare `SectionBlock` grouping fields.
 *
 * It lives here, not on `FormBuilder`, because it is presentation: a coloured card with a title
 * row and an action slot. It holds no form state and reads no form context, so it works just as
 * well around the read-only `FormRenderer.Grid` rows of a detail page as it does around fields.
 *
 * The per-field row layout — label, required marker, hint, the two-column split — is a different
 * thing entirely: that is `FieldSection`, applied by every field itself, and it stays inside
 * FormBuilder where the fields are.
 */
export function Section({ title, color, icon, variant, action, children }: SectionProps) {
  return (
    <SectionBlock title={title} color={color} icon={icon} variant={variant} action={action}>
      {children}
    </SectionBlock>
  );
}
