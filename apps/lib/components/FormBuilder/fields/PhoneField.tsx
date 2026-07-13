"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../Select";
import { InputField } from "../../InputField";
import { useLoading } from "../context";
import { formatFieldView } from "../viewFormat";
import type { PhoneFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

const COUNTRIES = [
  { value: "+1", label: "🇺🇸 +1" },
  { value: "+44", label: "🇬🇧 +44" },
  { value: "+964", label: "🇮🇶 +964" },
  { value: "+971", label: "🇦🇪 +971" },
  { value: "+966", label: "🇸🇦 +966" },
  { value: "+20", label: "🇪🇬 +20" },
  { value: "+90", label: "🇹🇷 +90" },
  { value: "+49", label: "🇩🇪 +49" },
  { value: "+33", label: "🇫🇷 +33" },
  { value: "+91", label: "🇮🇳 +91" },
];

function splitPhone(value: unknown, defaultDial: string): { dial: string; number: string } {
  const s = typeof value === "string" ? value.trim() : "";
  if (!s) return { dial: defaultDial, number: "" };
  const idx = s.indexOf(" ");
  if (s.startsWith("+") && idx > 0) return { dial: s.slice(0, idx), number: s.slice(idx + 1) };
  const match = s.startsWith("+") ? COUNTRIES.find((c) => s.startsWith(c.value)) : undefined;
  if (match) return { dial: match.value, number: s.slice(match.value.length).trim() };
  return { dial: defaultDial, number: s };
}

/** `FormBuilder.Phone` — country dial-code + number (Glare `SearchableSelect` + `InputField`). */
export function PhoneField(props: PhoneFieldProps) {
  const loading = useLoading();
  const defaultDial = props.defaultCountry ?? "+1";

  return (
    <FieldShell {...props} view={(v) => formatFieldView({ kind: "text", value: v })}>
      {(field, fieldState) => {
        const { dial, number } = splitPhone(field.value, defaultDial);
        const commit = (d: string, n: string) => field.onChange(n ? `${d} ${n}` : d);
        return (
          <div className="flex w-full min-w-0 items-center gap-2">
            <Select
              value={dial}
              onValueChange={(v) => commit(v, number)}
              disabled={props.disabled || loading}
            >
              <SelectTrigger size="XL" className="shrink-0">
                <SelectValue placeholder="+1" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="min-w-0 flex-1">
              <InputField
                type="tel"
                inputMode="tel"
                value={number}
                onChange={(e) => commit(dial, e.target.value.replace(/[^\d\s-]/g, ""))}
                placeholder={props.placeholder ?? "Phone number"}
                disabled={props.disabled || loading}
                errorMessage={fieldState.error?.message}
                className="w-full"
              />
            </div>
          </div>
        );
      }}
    </FieldShell>
  );
}
