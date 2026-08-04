"use client";

import { SearchableSelect } from "../../SearchableSelect";
import { InputField } from "../../InputField";
import { cn } from "../../../utils/cn";
import { useLoading, useCell } from "../context";
import type { PhoneFieldProps } from "../types";
import { FieldShell } from "./FieldShell";
import { COUNTRIES, countryByCode, countryByDial, flagEmoji } from "./countries";

// Dial codes longest-first, so "+1" doesn't shadow "+1…"-style codes when prefix-matching.
const DIALS = [...new Set(COUNTRIES.map((c) => c.dial))].sort((a, b) => b.length - a.length);

// Country picker rows. Keyed by the unique ISO code; the row shows flag + dial, but `searchText`
// makes filtering match the country NAME (typing a dial code won't match).
const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({
  value: c.code,
  label: `${flagEmoji(c.code)} ${c.dial}`,
  searchText: c.name,
}));

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
 * `FormBuilder.Phone` — country dial-code (every country) + number. The picker is a
 * `SearchableSelect` keyed by the unique ISO code (dial codes repeat) — type to filter by
 * country name or dial. The value is stored as a `"+<dial> <number>"` string.
 *
 * **Inside a `FormBuilder.Table` cell** this collapses to a single plain number input: the
 * fixed-width picker imposed a ~155px floor on the column and left the number truncated,
 * and two controls in one cell is not a table column. Add a separate column (e.g. a
 * `FormBuilder.Select` of dial codes) when a table needs the country code.
 */
export function PhoneField(props: PhoneFieldProps) {
  const loading = useLoading();
  const cell = useCell();
  const defaultDial = props.defaultCountry ?? "+964"; // Iraq

  if (cell) {
    return (
      <FieldShell {...props}>
        {(field) => (
          <InputField
            type="tel"
            inputMode="tel"
            value={typeof field.value === "string" ? field.value : ""}
            onChange={(e) => field.onChange(e.target.value.replace(/[^\d\s+-]/g, ""))}
            onBlur={field.onBlur}
            placeholder={props.placeholder ?? "Phone number"}
            disabled={props.disabled || loading}
            onTable
            className="w-full"
          />
        )}
      </FieldShell>
    );
  }

  return (
    <FieldShell {...props}>
      {(field) => {
        const { dial, number } = splitPhone(field.value, defaultDial);
        const country = countryByDial(dial);
        const disabled = props.disabled || loading;
        const commit = (d: string, n: string) => field.onChange(n ? `${d} ${n}` : d);
        return (
          <div className="flex w-full min-w-0 items-center gap-2">
            {/* Searchable country picker — filter by name or dial; rows carry the full country name. */}
            <SearchableSelect
              options={COUNTRY_OPTIONS}
              value={country?.code ?? null}
              onValueChange={(code) => commit(countryByCode(code)?.dial ?? dial, number)}
              placeholder="+964"
              size="M"
              onTable={cell}
              inputClassName="w-[100px] min-w-[0px]"
              className={cn("w-[113px] shrink-0", disabled && "pointer-events-none opacity-60")}
            />
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
