"use client";

import { Select, SelectTrigger, SelectContent, SelectItem } from "../../Select";
import { InputField } from "../../InputField";
import { useLoading, useCell } from "../context";
import { formatFieldView } from "../viewFormat";
import type { PhoneFieldProps } from "../types";
import { FieldShell } from "./FieldShell";
import { COUNTRIES, countryByCode, countryByDial, flagEmoji } from "./countries";

// Dial codes longest-first, so "+1" doesn't shadow "+1…"-style codes when prefix-matching.
const DIALS = [...new Set(COUNTRIES.map((c) => c.dial))].sort((a, b) => b.length - a.length);

function splitPhone(value: unknown, defaultDial: string): { dial: string; number: string } {
  const s = typeof value === "string" ? value.trim() : "";
  if (!s) return { dial: defaultDial, number: "" };
  const idx = s.indexOf(" ");
  if (s.startsWith("+") && idx > 0) {
    return { dial: s.slice(0, idx), number: s.slice(idx + 1).trim() };
  }
  if (s.startsWith("+")) {
    const dial = DIALS.find((d) => s.startsWith(d));
    if (dial) return { dial, number: s.slice(dial.length).trim() };
  }
  return { dial: defaultDial, number: s };
}

/**
 * `FormBuilder.Phone` — country dial-code (every country) + number. The picker is keyed by the
 * unique ISO code (dial codes repeat); the value is stored as a `"+<dial> <number>"` string.
 */
export function PhoneField(props: PhoneFieldProps) {
  const loading = useLoading();
  const cell = useCell();
  const defaultDial = props.defaultCountry ?? "+964"; // Iraq

  return (
    <FieldShell {...props} view={(v) => formatFieldView({ kind: "text", value: v })}>
      {(field) => {
        const { dial, number } = splitPhone(field.value, defaultDial);
        const country = countryByDial(dial);
        const disabled = props.disabled || loading;
        const commit = (d: string, n: string) => field.onChange(n ? `${d} ${n}` : d);
        return (
          <div className="flex w-full min-w-0 items-center gap-2">
            <Select
              value={country?.code ?? ""}
              onValueChange={(code) => commit(countryByCode(code)?.dial ?? dial, number)}
              disabled={disabled}
            >
              {/* Compact trigger — flag + dial. The dropdown rows carry the full country name. */}
              <SelectTrigger size="XL" onTable={cell} className="shrink-0">
                <span className="whitespace-nowrap">
                  {country ? `${flagEmoji(country.code)} ${country.dial}` : dial}
                </span>
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {`${flagEmoji(c.code)} ${c.name} ${c.dial}`}
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
                disabled={disabled}
                onTable={cell}
                className="w-full"
              />
            </div>
          </div>
        );
      }}
    </FieldShell>
  );
}
