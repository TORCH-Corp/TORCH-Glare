"use client";

import { InputField } from "../../InputField";
import { useLoading } from "../context";
import type { ColorFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/** `FormBuilder.Color` — a color swatch + hex input; value is a hex string. */
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
      {(field) => {
        const value = typeof field.value === "string" && field.value ? field.value : "#000000";
        const disabled = props.disabled || loading;
        return (
          <InputField
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value)}
            placeholder="#000000"
            disabled={disabled}
            className="w-full"
            icon={
              <label
                className="relative block h-[22px] w-[22px] shrink-0 cursor-pointer overflow-hidden rounded-[6px] border border-border-presentation-action-primary"
                style={{ background: value }}
              >
                <input
                  type="color"
                  value={value}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={disabled}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </label>
            }
            childrenSide={
              props.presets && props.presets.length > 0 ? (
                <div className="flex items-center gap-1">
                  {props.presets.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={c}
                      onClick={() => field.onChange(c)}
                      style={{ background: c }}
                      className="h-[18px] w-[18px] rounded-[4px] border border-border-presentation-action-primary"
                    />
                  ))}
                </div>
              ) : undefined
            }
          />
        );
      }}
    </FieldShell>
  );
}
