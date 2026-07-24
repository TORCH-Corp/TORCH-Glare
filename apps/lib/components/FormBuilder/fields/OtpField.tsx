"use client";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../InputOTP";
import { useLoading } from "../context";
import { formatFieldView } from "../viewFormat";
import type { OtpFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/** `FormBuilder.Otp` — a code / PIN input (Glare `InputOTP`). Value is a string. */
export function OtpField(props: OtpFieldProps) {
  const loading = useLoading();
  const length = props.length ?? 6;

  return (
    <FieldShell {...props} view={(v) => formatFieldView({ kind: "text", value: v })}>
      {(field) => (
        <InputOTP
          maxLength={length}
          value={field.value ?? ""}
          onChange={(v: string) => field.onChange(v)}
          disabled={props.disabled || loading}
        >
          <InputOTPGroup>
            {Array.from({ length }, (_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      )}
    </FieldShell>
  );
}
