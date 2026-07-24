"use client";

import * as Slider from "@radix-ui/react-slider";

import { cn } from "../../../utils/cn";
import { useLoading } from "../context";
import type { SliderFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

// The white knob + soft shadow, matching the design (same knob token + shadow as `Switch`).
const THUMB = cn(
  "block size-[12px] rounded-full bg-background-presentation-switcher-knob",
  "shadow-[0px_0px_0px_1px_rgba(0,0,0,0.04),0px_3px_8px_0px_rgba(0,0,0,0.15),0px_3px_1px_0px_rgba(0,0,0,0.06)]",
  "outline-none transition-transform hover:scale-110",
  "focus-visible:ring-2 focus-visible:ring-background-presentation-body-scroller-hover",
);

/**
 * `FormBuilder.Slider` — numeric slider (single value or a `[min,max]` range).
 * A `@radix-ui/react-slider` styled to the Figma range field: a `#f9f9f9` box holding a
 * 6px track, a blue fill, a white knob, and the live value readout on the right.
 */
export function SliderField(props: SliderFieldProps) {
  const loading = useLoading();
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const step = props.step ?? 1;
  const suffix = props.suffix ?? "";
  const fmt = (n: number) => `${n}${suffix}`;

  return (
    <FieldShell
      {...props}
      view={(v) => ({
        value: Array.isArray(v) ? `${fmt(v[0])} – ${fmt(v[1])}` : v == null ? "" : fmt(v as number),
      })}
    >
      {(field) => {
        const raw = field.value;
        const values: number[] = props.range
          ? Array.isArray(raw)
            ? (raw as number[])
            : [min, max]
          : [typeof raw === "number" ? raw : min];
        const disabled = props.disabled || loading;
        return (
          <div className="flex w-full items-center gap-[10px] rounded-[8px] bg-background-presentation-form-field-primary px-[10px] py-[6px]">
            <Slider.Root
              className="relative flex h-[12px] w-full grow touch-none select-none items-center"
              min={min}
              max={max}
              step={step}
              value={values}
              onValueChange={(v) => field.onChange(props.range ? v : v[0])}
              disabled={disabled}
            >
              <Slider.Track className="relative h-[6px] grow rounded-[10px] bg-background-presentation-body-scroller-default">
                <Slider.Range className="absolute h-full rounded-[10px] bg-background-presentation-body-scroller-hover" />
              </Slider.Track>
              {values.map((_, i) => (
                <Slider.Thumb key={i} className={THUMB} />
              ))}
            </Slider.Root>
            <span className="min-w-[40px] shrink-0 whitespace-nowrap text-right tabular-nums typography-body-medium-regular text-content-presentation-global-primary">
              {props.range ? `${values[0]}–${fmt(values[1])}` : fmt(values[0])}
            </span>
          </div>
        );
      }}
    </FieldShell>
  );
}
