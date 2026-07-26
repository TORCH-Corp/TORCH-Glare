"use client";

import type { OutputData } from "@editorjs/editorjs";

// Import the lazy wrapper from its file directly, NOT the folder barrel: the barrel
// statically re-exports `TextEditor` (which loads EditorJS at module init) and would drag
// it into the SSR bundle, crashing server rendering. This path stays SSR-safe (lazy inside).
import { RichTextField as RichTextEditor } from "../../TextEditor/RichTextField";
import type { BaseFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/**
 * `FormBuilder.RichText` — EditorJS content (value = `OutputData`).
 *
 * Forced to a **vertical, full-width** layout (label on top, editor below spanning the whole
 * section): the editor + its toolbar need the full width, not the cramped right column.
 */
export function RichTextField(props: BaseFieldProps) {
  return (
    <FieldShell {...props} direction="vertical" fullWidth>
      {(field) => (
        <RichTextEditor
          data={field.value as OutputData | undefined}
          onChange={field.onChange}
          readOnly={props.disabled}
          placeholder={props.placeholder}
        />
      )}
    </FieldShell>
  );
}
