"use client";

import * as Slider from "@radix-ui/react-slider";

import { GroupStyles } from "../../Input";
import { cn } from "../../../utils/cn";
import { useLoading } from "../context";
import type { SliderFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/**
 * `FormBuilder.Slider` — numeric slider (single value or a `[min,max]` range).
 * Wraps `@radix-ui/react-slider`, styled with Glare tokens and hosted in the
 * standard bordered field shell (`GroupStyles`) so it lines up with the other inputs.
 */
export function SliderField(props: SliderFieldProps) {
  const loading = useLoading();
  const min = props.min ?? 0;
  const max = props.max ?? 100;
  const step = props.step ?? 1;

  return (
    <FieldShell
      {...props}
      view={(v) => ({
        value: Array.isArray(v) ? `${v[0]} – ${v[1]}` : v == null ? "" : String(v),
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
          <div className={cn(GroupStyles({ size: "M", variant: "PresentationStyle" }), "gap-3 px-3")}>
            <Slider.Root
              className="relative flex h-full w-full grow touch-none select-none items-center"
              min={min}
              max={max}
              step={step}
              value={values}
              onValueChange={(v) => field.onChange(props.range ? v : v[0])}
              disabled={disabled}
            >
              <Slider.Track className="relative h-1.5 grow rounded-full bg-border-presentation-action-primary">
                <Slider.Range className="absolute h-full rounded-full bg-content-presentation-action-primary" />
              </Slider.Track>
              {values.map((_, i) => (
                <Slider.Thumb
                  key={i}
                  className="block h-[18px] w-[18px] rounded-full border-2 border-white bg-content-presentation-action-primary shadow-[0_1px_4px_0_rgba(0,0,0,0.35)] transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-content-presentation-action-primary"
                />
              ))}
            </Slider.Root>
            <span className="min-w-[48px] shrink-0 text-right typography-body-small-medium text-content-presentation-action-light-primary">
              {props.range ? `${values[0]}–${values[1]}` : values[0]}
            </span>
          </div>
        );
      }}
    </FieldShell>
  );
}
