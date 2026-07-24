"use client";

import { ReactNode } from "react";

import { Button } from "../Button";
import { useFormId, useLoading, useMode } from "./context";

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
  const mode = useMode();

  if (mode === "view") return null;

  return (
    <Button
      type="submit"
      // Defaults to the enclosing form's id, so a Save in the header (outside the `<form>`)
      // still submits it via native form-association.
      form={form ?? ctxFormId}
      variant="PrimeStyle"
      is_loading={loading}
      className={className}
    >
      {loading ? (loadingText ?? children ?? "Saving…") : (children ?? "Save")}
    </Button>
  );
}
