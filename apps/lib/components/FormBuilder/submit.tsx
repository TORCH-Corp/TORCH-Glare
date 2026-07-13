"use client";

import { ReactNode } from "react";

import { Button } from "../Button";
import { useLoading, useMode } from "./context";

export interface SubmitButtonProps {
  children?: ReactNode;
  className?: string;
  loadingText?: ReactNode;
}

/** `FormBuilder.Submit` — a loading-aware submit button, hidden in view mode. */
export function SubmitButton({ children, className, loadingText }: SubmitButtonProps) {
  const loading = useLoading();
  const mode = useMode();

  if (mode === "view") return null;

  return (
    <Button type="submit" variant="PrimeStyle" is_loading={loading} className={className}>
      {loading ? (loadingText ?? children ?? "Saving…") : (children ?? "Save")}
    </Button>
  );
}
