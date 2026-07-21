"use client";

import { InputField } from "../../InputField";
import { ColorPicker, CHECKERBOARD } from "../../ColorPicker";
import { useLoading } from "../context";
import type { ColorFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/**
 * `FormBuilder.Color` — an `InputField` holding the hex text, with a trailing action button that
 * carries the colour itself. That button is the `ColorPicker` trigger: clicking it opens the full
 * palette. Value is a hex string.
 */
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
        const value = typeof field.value === "string" ? field.value : "";
        const disabled = props.disabled || loading;
        return (
          // The InputField IS the trigger: ColorPicker detects it as an input (it takes a `value`)
          // and feeds it the hex, so clicking the field opens the palette.
          <ColorPicker
            value={value || undefined}
            onChange={field.onChange}
            presets={props.presets}
            alpha={props.alpha ?? true}
            disabled={disabled}
          >
            <InputField
              // Explicit — otherwise Radix's trigger `type="button"` would land on the input.
              type="text"
              value={value}
              onChange={(e) => field.onChange(e.target.value)}
              placeholder={props.placeholder ?? "#000000"}
              disabled={disabled}
              className="w-full"
              // The trailing action button holds the colour itself.
              childrenSide={
                <span
                  aria-hidden
                  className="block h-[26px] w-[26px] shrink-0 overflow-hidden rounded-[6px] border border-border-presentation-action-primary"
                  style={CHECKERBOARD}
                >
                  <span
                    className="block h-full w-full"
                    style={{ backgroundColor: value || "#000000" }}
                  />
                </span>
              }
            />
          </ColorPicker>
        );
      }}
    </FieldShell>
  );
}
