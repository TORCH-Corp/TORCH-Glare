"use client";

import { useEffect, useRef } from "react";

import { Button } from "../../Button";
import { GroupStyles } from "../../Input";
import { cn } from "../../../utils/cn";
import { useLoading } from "../context";
import type { SignatureFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/**
 * `FormBuilder.Signature` — a freehand signature pad (native `<canvas>` + pointer
 * events, no dependency). Value is a PNG data-URL string (`""` when empty), so it
 * registers/validates/submits/views like any other field via `FieldShell`.
 *
 * Forced to a **vertical, full-width** layout (label on top, pad below spanning the whole
 * section) — like `FormBuilder.RichText`: the canvas needs the full width, not the right column.
 */
export function SignatureField(props: SignatureFieldProps) {
  const loading = useLoading();
  const penColor = props.penColor ?? "#111827";

  return (
    <FieldShell {...props} direction="vertical" fullWidth>
      {(field) => (
        <SignaturePad
          value={typeof field.value === "string" ? field.value : ""}
          onChange={field.onChange}
          disabled={props.disabled || loading}
          penColor={penColor}
        />
      )}
    </FieldShell>
  );
}

interface SignaturePadProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  penColor: string;
}

function SignaturePad({ value, onChange, disabled, penColor }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  // Track whether the canvas currently holds strokes, so Clear can no-op cleanly.
  const dirty = useRef(false);

  // Size the backing store to the element box (accounting for DPR) and seed it
  // from the current value. Runs once on mount; a remount `key` re-seeds on edit.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = penColor;

    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = value;
      dirty.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial-only seed (like date/richtext)
  }, []);

  const pointToCanvas = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pointToCanvas(e);
  };

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || disabled) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !last.current) return;
    const p = pointToCanvas(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    dirty.current = true;
  };

  const handleUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    if (disabled) return;
    const canvas = canvasRef.current;
    if (canvas && dirty.current) onChange(canvas.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
    }
    dirty.current = false;
    onChange("");
  };

  return (
    <div
      className={cn(
        GroupStyles({ size: "M", variant: "PresentationStyle" }),
        "relative h-[440px] w-full overflow-hidden p-0",
        disabled && "opacity-60",
      )}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
        className={cn(
          "h-full w-full touch-none bg-white",
          disabled ? "cursor-not-allowed" : "cursor-crosshair",
        )}
      />
      {!disabled && (
        <Button
          type="button"
          size="S"
          variant="BorderStyle"
          onClick={clear}
          className="absolute right-2 top-2"
        >
          <i className="ri-eraser-line" />
          Clear
        </Button>
      )}
    </div>
  );
}
