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
}

/** `FormBuilder.Submit` — a loading-aware submit button, hidden in view mode. */
export function SubmitButton({ children, className, loadingText, form }: SubmitButtonProps) {
  const loading = useLoading();
  const ctxFormId = useFormId();

  return (
    <Button
      type="submit"
      // Defaults to the enclosing form's id, so a Save in the header (outside the `<form>`)
      // still submits it via native form-association.
      form={form ?? ctxFormId}
      variant="PrimeStyle"
      is_loading={loading}
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
