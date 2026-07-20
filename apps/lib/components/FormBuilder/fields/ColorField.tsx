"use client";

import { ColorPicker } from "../../ColorPicker";
import { useLoading } from "../context";
import type { ColorFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/** `FormBuilder.Color` — a full Figma-style color palette; value is a hex string. */
export function ColorField(props: ColorFieldProps) {
  const loading = useLoading();

  return (
    <FieldShell
      {...props}
      view={(v) =>
        v
          ? {
              valueNode: (
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-[4px] border border-border-presentation-action-primary"
                    style={{ background: String(v) }}
                  />
                  {String(v)}
                </span>
              ),
            }
          : { value: "" }
      }
    >
      {(field) => (
        <ColorPicker
          value={typeof field.value === "string" ? field.value : undefined}
          onChange={field.onChange}
          presets={props.presets}
          alpha={props.alpha ?? true}
          disabled={props.disabled || loading}
        />
      )}
    </FieldShell>
  );
}
