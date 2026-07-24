"use client";

import React, {
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import * as Slider from "@radix-ui/react-slider";

import { cn } from "../utils/cn";
import { Themes } from "../utils/types";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Group, Input } from "./Input";
import {
  clamp,
  formatHex,
  hslToRgb,
  hsvToRgb,
  parseHex,
  rgbToHsl,
  rgbToHsv,
  round,
  type HSV,
} from "../utils/color";

export interface ColorPickerProps {
  /**
   * The trigger — a single element that opens the picker (rendered via `asChild`, so it must
   * forward its ref/props to a DOM node). ColorPicker renders **no trigger of its own**; it
   * hands the current color to whatever you pass:
   *
   * - an **input** (native `<input>`/`<textarea>`, or any element already given a `value` prop)
   *   receives the hex as its `value`;
   * - **anything else** receives the hex as its `children` — unless it already has children of
   *   its own, which are left untouched.
   */
  children: ReactElement;
  /** Current color as a hex string (`#rrggbb` or `#rrggbbaa`). Defaults to `#000000`. */
  value?: string;
  /** Called with the new hex string on every change. */
  onChange?: (hex: string) => void;
  /** Quick-pick swatches shown at the bottom of the panel. */
  presets?: string[];
  /** Show the opacity slider + opacity input and emit `#rrggbbaa` when < 100%. Default true. */
  alpha?: boolean;
  disabled?: boolean;
  theme?: Themes;
}

/** Native form controls, or any element already driven by a `value` prop, take the hex as `value`. */
function isInputLike(el: ReactElement): boolean {
  if (typeof el.type === "string") return el.type === "input" || el.type === "textarea";
  return "value" in ((el.props ?? {}) as Record<string, unknown>);
}

type Mode = "hex" | "rgb" | "hsl";

const HUE_GRADIENT =
  "linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)";

/** Small 8px checkerboard so transparency reads clearly behind swatches / the alpha track. */
export const CHECKERBOARD: React.CSSProperties = {
  backgroundColor: "#fff",
  backgroundImage:
    "linear-gradient(45deg,#c8c8c8 25%,transparent 25%),linear-gradient(-45deg,#c8c8c8 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#c8c8c8 75%),linear-gradient(-45deg,transparent 75%,#c8c8c8 75%)",
  backgroundSize: "8px 8px",
  backgroundPosition: "0 0,0 4px,4px -4px,-4px 0",
};

const THUMB_CLS =
  "block h-[16px] w-[16px] rounded-full border-2 border-white bg-transparent shadow-[0_1px_4px_0_rgba(0,0,0,0.45)] outline-none transition-transform hover:scale-110 focus:ring-2 focus:ring-white/70";

// Compact numeric inputs: allow shrinking below the base `min-w-[30px]` and drop the native
// number spinners so a full row (3 channels + opacity) never overflows the fixed-width panel.
const NUM_INPUT_CLS =
  "min-w-0 px-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

/**
 * A full Figma-style color picker: a draggable saturation/value area, hue slider,
 * optional opacity slider, an eyedropper (where supported), switchable HEX/RGB/HSL
 * inputs, and preset swatches — all opened from a field-styled swatch trigger.
 *
 * The value is always a hex string, kept `#rrggbb` while fully opaque and promoted to
 * `#rrggbbaa` only when opacity drops below 100%.
 */
export const ColorPicker = forwardRef<HTMLElement, ColorPickerProps>(
  ({ children, value, onChange, presets, alpha = true, disabled, theme }, ref) => {
    // Internal source of truth is HSV + alpha: keeping HSV (not RGB/hex) means dragging in the
    // grey column or the black row doesn't discard the chosen hue.
    const [hsv, setHsv] = useState<HSV>({ h: 0, s: 0, v: 0 });
    const [a, setA] = useState(1);
    const [mode, setMode] = useState<Mode>("hex");
    const lastHexRef = useRef<string | null>(null);

    const rgb = useMemo(() => hsvToRgb(hsv), [hsv]);
    const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
    const hex = useMemo(() => formatHex({ ...rgb, a }), [rgb, a]);
    const hex6 = useMemo(() => formatHex({ ...rgb, a: 1 }), [rgb]);

    // Sync FROM the controlled value — but skip the echo of our own last emit to avoid loops.
    useEffect(() => {
      if (!value) return;
      if (value === lastHexRef.current) return;
      const parsed = parseHex(value);
      if (!parsed) return;
      setHsv(rgbToHsv(parsed));
      setA(parsed.a);
      lastHexRef.current = value;
    }, [value]);

    const emit = useCallback(
      (nextHsv: HSV, nextA: number) => {
        setHsv(nextHsv);
        setA(nextA);
        const out = formatHex({ ...hsvToRgb(nextHsv), a: nextA });
        lastHexRef.current = out;
        onChange?.(out);
      },
      [onChange],
    );

    const applyHsv = useCallback((next: HSV, nextA = a) => emit(next, nextA), [emit, a]);
    const applyRgba = useCallback(
      (r: number, g: number, b: number, nextA = a) =>
        emit(rgbToHsv({ r, g, b }), clamp(nextA, 0, 1)),
      [emit, a],
    );

    // ── Saturation / value area ─────────────────────────────────────────────
    const svRef = useRef<HTMLDivElement>(null);
    const readSV = useCallback(
      (clientX: number, clientY: number) => {
        const el = svRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = clamp((clientX - rect.left) / rect.width, 0, 1);
        const y = clamp((clientY - rect.top) / rect.height, 0, 1);
        applyHsv({ h: hsv.h, s: round(x * 100), v: round((1 - y) * 100) });
      },
      [applyHsv, hsv.h],
    );

    const onSVPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      readSV(e.clientX, e.clientY);
    };
    const onSVPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || e.buttons !== 1) return;
      readSV(e.clientX, e.clientY);
    };

    // ── Eyedropper (Chromium/Edge only) ─────────────────────────────────────
    const hasEyeDropper = typeof window !== "undefined" && "EyeDropper" in window;
    const pickWithEyeDropper = async () => {
      try {
        const ED = (
          window as unknown as {
            EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> };
          }
        ).EyeDropper;
        const res = await new ED().open();
        const parsed = parseHex(res.sRGBHex);
        if (parsed) applyRgba(parsed.r, parsed.g, parsed.b, parsed.a);
      } catch {
        /* user cancelled — ignore */
      }
    };

    // ── HEX input draft (free typing, commit on blur / Enter) ────────────────
    const [hexDraft, setHexDraft] = useState(hex6);
    const hexFocused = useRef(false);
    useEffect(() => {
      if (!hexFocused.current) setHexDraft(hex6);
    }, [hex6]);
    const commitHex = () => {
      const parsed = parseHex(hexDraft);
      if (parsed) applyRgba(parsed.r, parsed.g, parsed.b, a);
      else setHexDraft(hex6);
    };

    const opacityPct = round(a * 100);

    // The trigger is the caller's child — ColorPicker renders none of its own. An input gets the
    // hex as `value`; anything else gets it as `children` (unless it already has its own).
    const trigger = useMemo(() => {
      const childProps = (children.props ?? {}) as Record<string, unknown>;

      if (isInputLike(children)) {
        return cloneElement(children as ReactElement<Record<string, unknown>>, {
          value: hex,
          // A controlled input with no `onChange` warns in React — commit typed hex instead.
          ...(childProps.onChange
            ? {}
            : {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  const parsed = parseHex(e.target.value);
                  if (parsed) applyRgba(parsed.r, parsed.g, parsed.b, parsed.a);
                },
              }),
        });
      }

      if (childProps.children == null) {
        return cloneElement(children as ReactElement<Record<string, unknown>>, {}, hex);
      }
      return children;
    }, [children, hex, applyRgba]);

    return (
      <Popover>
        <PopoverTrigger asChild disabled={disabled} ref={ref as React.Ref<HTMLButtonElement>}>
          {trigger}
        </PopoverTrigger>

        <PopoverContent
          variant="PresentationStyle"
          theme={theme}
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-[300px] max-h-fit overflow-visible p-0"
        >
          <div className="flex flex-col gap-3 p-3">
            {/* Saturation / value */}
            <div
              ref={svRef}
              onPointerDown={onSVPointerDown}
              onPointerMove={onSVPointerMove}
              className="relative h-[150px] w-full cursor-crosshair touch-none rounded-[6px]"
              style={{ backgroundColor: `hsl(${hsv.h},100%,50%)` }}
            >
              <div
                className="absolute inset-0 rounded-[6px]"
                style={{ backgroundImage: "linear-gradient(to right,#fff,rgba(255,255,255,0))" }}
              />
              <div
                className="absolute inset-0 rounded-[6px]"
                style={{ backgroundImage: "linear-gradient(to top,#000,rgba(0,0,0,0))" }}
              />
              <span
                className="absolute h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_4px_0_rgba(0,0,0,0.45)]"
                style={{
                  left: `${hsv.s}%`,
                  top: `${100 - hsv.v}%`,
                  backgroundColor: hex6,
                }}
              />
            </div>

            {/* Eyedropper + hue (+ alpha) sliders */}
            <div className="flex items-center gap-2">
              {hasEyeDropper && (
                <button
                  type="button"
                  aria-label="Pick color from screen"
                  onClick={pickWithEyeDropper}
                  disabled={disabled}
                  className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] border border-border-presentation-action-primary text-content-presentation-action-light-secondary transition-colors hover:bg-background-presentation-form-field-hover"
                >
                  <i className="ri-sip-line text-[16px]" />
                </button>
              )}

              <div className="flex flex-1 flex-col gap-2">
                <Slider.Root
                  className="relative flex h-[14px] w-full touch-none select-none items-center"
                  min={0}
                  max={360}
                  step={1}
                  value={[hsv.h]}
                  onValueChange={([h]) => applyHsv({ ...hsv, h })}
                  disabled={disabled}
                >
                  <Slider.Track
                    className="relative h-[10px] grow rounded-full"
                    style={{ backgroundImage: HUE_GRADIENT }}
                  >
                    <Slider.Range className="absolute h-full rounded-full bg-transparent" />
                  </Slider.Track>
                  <Slider.Thumb
                    className={THUMB_CLS}
                    style={{ backgroundColor: `hsl(${hsv.h},100%,50%)` }}
                  />
                </Slider.Root>

                {alpha && (
                  <Slider.Root
                    className="relative flex h-[14px] w-full touch-none select-none items-center"
                    min={0}
                    max={1}
                    step={0.01}
                    value={[a]}
                    onValueChange={([na]) => applyHsv(hsv, na)}
                    disabled={disabled}
                  >
                    <Slider.Track
                      className="relative h-[10px] grow overflow-hidden rounded-full"
                      style={CHECKERBOARD}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `linear-gradient(to right,rgba(${rgb.r},${rgb.g},${rgb.b},0),rgb(${rgb.r},${rgb.g},${rgb.b}))`,
                        }}
                      />
                      <Slider.Range className="absolute h-full rounded-full bg-transparent" />
                    </Slider.Track>
                    <Slider.Thumb className={THUMB_CLS} style={{ backgroundColor: hex }} />
                  </Slider.Root>
                )}
              </div>
            </div>

            {/* Model switch + numeric inputs */}
            <div className="flex items-start gap-2">
              <select
                value={mode}
                disabled={disabled}
                onChange={(e) => setMode(e.target.value as Mode)}
                className="h-[30px] w-[54px] shrink-0 rounded-[6px] border border-border-presentation-action-primary bg-background-presentation-form-field-primary px-1 typography-body-small-regular text-content-presentation-action-light-primary outline-none"
              >
                <option value="hex">HEX</option>
                <option value="rgb">RGB</option>
                <option value="hsl">HSL</option>
              </select>

              <div className="flex min-w-0 flex-1 items-center gap-1">
                {mode === "hex" && (
                  <Group size="S" className="min-w-0 flex-1">
                    <Input
                      value={hexDraft}
                      disabled={disabled}
                      onFocus={() => (hexFocused.current = true)}
                      onChange={(e) => setHexDraft(e.target.value)}
                      onBlur={() => {
                        hexFocused.current = false;
                        commitHex();
                      }}
                      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                      className="min-w-0 text-center"
                    />
                  </Group>
                )}

                {mode === "rgb" &&
                  (["r", "g", "b"] as const).map((ch) => (
                    <Group key={ch} size="S" className="min-w-0 flex-1 px-0">
                      <Input
                        type="number"
                        min={0}
                        max={255}
                        disabled={disabled}
                        value={rgb[ch]}
                        onChange={(e) => {
                          const n = clamp(Number(e.target.value) || 0, 0, 255);
                          applyRgba(
                            ch === "r" ? n : rgb.r,
                            ch === "g" ? n : rgb.g,
                            ch === "b" ? n : rgb.b,
                            a,
                          );
                        }}
                        className={NUM_INPUT_CLS}
                      />
                    </Group>
                  ))}

                {mode === "hsl" &&
                  (["h", "s", "l"] as const).map((ch) => (
                    <Group key={ch} size="S" className="min-w-0 flex-1 px-0">
                      <Input
                        type="number"
                        min={0}
                        max={ch === "h" ? 360 : 100}
                        disabled={disabled}
                        value={hsl[ch]}
                        onChange={(e) => {
                          const n = clamp(Number(e.target.value) || 0, 0, ch === "h" ? 360 : 100);
                          const next = { ...hsl, [ch]: n };
                          const r = hslToRgb(next);
                          applyRgba(r.r, r.g, r.b, a);
                        }}
                        className={NUM_INPUT_CLS}
                      />
                    </Group>
                  ))}

                {alpha && (
                  <Group size="S" className="w-[48px] shrink-0 gap-0 px-0">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      disabled={disabled}
                      value={opacityPct}
                      onChange={(e) => {
                        const n = clamp(Number(e.target.value) || 0, 0, 100);
                        applyHsv(hsv, n / 100);
                      }}
                      className={NUM_INPUT_CLS}
                    />
                    <span className="pr-1 typography-body-small-regular text-content-presentation-action-light-secondary">
                      %
                    </span>
                  </Group>
                )}
              </div>
            </div>

            {/* Presets */}
            {presets && presets.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 border-t border-border-presentation-global-primary pt-3">
                {presets.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={c}
                    disabled={disabled}
                    onClick={() => {
                      const parsed = parseHex(c);
                      if (parsed) applyRgba(parsed.r, parsed.g, parsed.b, parsed.a);
                    }}
                    style={{ backgroundColor: c }}
                    className="h-[20px] w-[20px] rounded-[4px] border border-border-presentation-action-primary transition-transform hover:scale-110"
                  />
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  },
);

ColorPicker.displayName = "ColorPicker";
