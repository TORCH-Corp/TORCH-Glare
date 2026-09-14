"use client";

import { ReactNode } from "react";

import { cn } from "../../utils/cn";
import { Button } from "../Button";
import { useFormId, useLoading } from "./context";

export interface SubmitButtonProps {
  children?: ReactNode;
  className?: string;
  loadingText?: ReactNode;
  /**
   * The form to submit, by `id`. Defaults to the enclosing FormBuilder's own form id (via
   * context), so a bare `<FormBuilder.Submit>` works even in a header / action bar rendered
   * **outside** the `<form>` element. Set it explicitly only to target a different form.
   */
  form?: string;
  /**
   * LOCAL PATCH (Contact Center): upstream removed this in 2.5.5, leaving no way to
   * disable a Save. Re-apply after any `npx torch-glare update`.
   *
   * Disable the button while leaving the form readable.
   *
   * Used by permission gating: someone with read access should still SEE a
   * record, so a Save they may not use is disabled rather than removed --
   * a missing button looks broken, a disabled one says "not yours to change".
   * The server refuses the write either way.
   */
  disabled?: boolean;
}

/** `FormBuilder.Submit` — a loading-aware submit button, hidden in view mode. */
export function SubmitButton({
  children,
  className,
  loadingText,
  form,
  disabled,
}: SubmitButtonProps) {
  const loading = useLoading();
  const ctxFormId = useFormId();

  return (
    <Button
      type="submit"
      // Defaults to the enclosing form's id, so a Save in the header (outside the `<form>`)
      // still submits it via native form-association.
      form={form ?? ctxFormId}
      // The blue fill, because Save is the form's primary action and a primary action is blue.
      // Deliberately not a prop: a form has one primary action, and letting each caller pick a
      // variant is how the rule stops being a rule.
      variant="BluColStyle"
      is_loading={loading}
      // LOCAL PATCH (Contact Center) -- see `disabled` in SubmitButtonProps.
      disabled={disabled}
      // `w-fit` because the FormBuilder root is a flex COLUMN: a direct child with `width: auto`
      // inherits `align-items: stretch` and spans the whole form. Sections want that (SectionBlock
      // sets its own `w-full`); a Save button does not. `w-fit` rather than `self-start` so the
      // header action bar — a row with `items-center` — is untouched at every button size.
      // Merged through `cn` so a caller can still opt into `className="w-full"` in a narrow drawer.
      className={cn("w-fit", className)}
    >
      {loading ? (loadingText ?? children ?? "Saving…") : (children ?? "Save")}
    </Button>
  );
}
