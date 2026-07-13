"use client";

import type { OutputData } from "@editorjs/editorjs";

import { RichTextField as RichTextEditor } from "../RichTextField";
import { formatFieldView } from "../viewFormat";
import type { BaseFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/** `FormBuilder.RichText` — EditorJS content (value = `OutputData`). */
export function RichTextField(props: BaseFieldProps) {
  return (
    <FieldShell {...props} view={(v) => formatFieldView({ kind: "richtext", value: v })}>
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
