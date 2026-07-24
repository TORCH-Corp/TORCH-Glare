"use client";

import { ImageAttachment } from "../../ImageAttachment";
import { useLoading } from "../context";
import { formatFieldView } from "../viewFormat";
import type { FileFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/** `FormBuilder.File` / `.Image` — stores the selected `File` (consumer uploads). */
export function FileField(props: FileFieldProps & { image?: boolean }) {
  const loading = useLoading();
  return (
    <FieldShell {...props} view={(v) => formatFieldView({ kind: "file", value: v })}>
      {(field) => {
        const current: unknown = field.value;
        const fileName = Array.isArray(current)
          ? `${current.length} file(s)`
          : current instanceof File
            ? current.name
            : "";
        return (
          <ImageAttachment
            mainLabel={props.placeholder ?? (props.image ? "Upload image" : "Upload file")}
            secondaryLabel={
              fileName || (typeof props.description === "string" ? props.description : "")
            }
            accept={props.accept ?? (props.image ? "image/*" : undefined)}
            multiple={props.multiple}
            disabled={props.disabled || loading}
            onChange={(e) => {
              const files = (e.target as HTMLInputElement).files;
              if (!files || files.length === 0) return;
              field.onChange(props.multiple ? Array.from(files) : files[0]);
            }}
          />
        );
      }}
    </FieldShell>
  );
}
