"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import type { OutputData } from "@editorjs/editorjs";

/**
 * Client-only, lazily-loaded wrapper around the EditorJS `TextEditor`.
 *
 * EditorJS references DOM globals (`Element`) at module-load time, which crashes
 * server-side rendering. Statically importing `TextEditor` in the field registry
 * would pull it into the SSR bundle; loading it lazily + only after mount keeps
 * the builder SSR-safe — the editor is imported on the client, on demand.
 */
const TextEditorLazy = lazy(() => import("./TextEditor").then((m) => ({ default: m.TextEditor })));

export interface RichTextFieldProps {
  data?: OutputData;
  onChange?: (data: OutputData) => void;
  readOnly?: boolean;
  placeholder?: string;
  /** Editor size — controls min-height + padding (the toolbar gutter). Default "M". */
  size?: "S" | "M" | "L" | "XL";
}

const placeholderBox = (
  <div className="min-h-[200px] w-full rounded-[6px] border border-border-presentation-action-primary bg-background-presentation-form-field-primary" />
);

export function RichTextField({ size = "M", ...props }: RichTextFieldProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return placeholderBox;

  return (
    <Suspense fallback={placeholderBox}>
      <TextEditorLazy
        size={size}
        className="border border-border-presentation-action-primary"
        {...props}
      />
    </Suspense>
  );
}

RichTextField.displayName = "RichTextField";
