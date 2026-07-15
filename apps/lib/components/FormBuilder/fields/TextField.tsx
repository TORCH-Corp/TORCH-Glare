"use client";

import {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

import { InputField } from "../../InputField";
import { Textarea } from "../../Textarea";
import { PasswordLevel } from "../../PasswordLevel";
import { useLoading } from "../context";
import { formatFieldView } from "../viewFormat";
import { formatNumber } from "../numberFormat";
import type { BaseFieldProps, CurrencyFieldProps, PasswordFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

// Run before paint on the client; fall back to useEffect on the server (no SSR warning).
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * A number input that shows a **live** thousands-separated value (e.g. "1,299")
 * while storing the raw `number` in the form. Commas are inserted as you type and
 * the caret is preserved; decimals (and a trailing ".") are kept intact.
 */
function NumberInput({
  field,
  icon,
  placeholder,
  disabled,
}: {
  field: ControllerRenderProps<FieldValues, string>;
  icon?: ReactNode;
  placeholder?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const caretRef = useRef<number | null>(null);
  const [text, setText] = useState<string>(() => formatNumber(field.value));

  // Reflect external value changes (e.g. edit data loading) while not editing.
  useEffect(() => {
    if (document.activeElement === inputRef.current) return;
    setText(formatNumber(field.value));
  }, [field.value]);

  // Restore the caret after a live reformat (commas shift positions).
  useIsoLayoutEffect(() => {
    if (caretRef.current != null && inputRef.current) {
      inputRef.current.setSelectionRange(caretRef.current, caretRef.current);
      caretRef.current = null;
    }
  });

  const setRefs = (el: HTMLInputElement | null) => {
    inputRef.current = el;
    if (typeof field.ref === "function") field.ref(el);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const caret = e.target.selectionStart ?? raw.length;
    const digitsBeforeCaret = raw.slice(0, caret).replace(/\D/g, "").length;

    // Keep digits and a single decimal point.
    let cleaned = raw.replace(/[^\d.]/g, "");
    const dot = cleaned.indexOf(".");
    if (dot !== -1) {
      cleaned = cleaned.slice(0, dot + 1) + cleaned.slice(dot + 1).replace(/\./g, "");
    }

    let formatted = "";
    if (cleaned !== "") {
      const [intPart, decPart] = cleaned.split(".");
      const intFmt = intPart === "" ? "" : Number(intPart).toLocaleString("en-US");
      formatted = decPart !== undefined ? `${intFmt}.${decPart}` : intFmt;
    }

    // Caret goes after the same count of digits, skipping the inserted commas.
    let pos = 0;
    let seen = 0;
    while (pos < formatted.length && seen < digitsBeforeCaret) {
      if (/\d/.test(formatted[pos])) seen++;
      pos++;
    }
    caretRef.current = pos;

    setText(formatted);
    field.onChange(cleaned === "" || cleaned === "." ? undefined : Number(cleaned));
  };

  return (
    <InputField
      name={field.name}
      ref={setRefs}
      type="text"
      inputMode="decimal"
      icon={icon}
      value={text}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full"
      onChange={handleChange}
      onBlur={() => field.onBlur()}
    />
  );
}

function TextLike({ props, type }: { props: BaseFieldProps; type: "text" | "email" | "password" }) {
  const loading = useLoading();
  return (
    <FieldShell {...props} view={(v) => formatFieldView({ kind: "text", value: v })}>
      {(field) => (
        <InputField
          {...field}
          type={type}
          value={field.value ?? ""}
          placeholder={props.placeholder}
          disabled={props.disabled || loading}
          className="w-full"
        />
      )}
    </FieldShell>
  );
}

export function TextField(props: BaseFieldProps) {
  return <TextLike props={props} type="text" />;
}
export function EmailField(props: BaseFieldProps) {
  return <TextLike props={props} type="email" />;
}
export function PasswordField(props: PasswordFieldProps) {
  const loading = useLoading();
  return (
    <FieldShell {...props} view={(v) => formatFieldView({ kind: "text", value: v ? "••••••••" : "" })}>
      {(field) => (
        <div className="flex w-full flex-col gap-2">
          <InputField
            {...field}
            type="password"
            value={field.value ?? ""}
            placeholder={props.placeholder}
            disabled={props.disabled || loading}
            className="w-full"
          />
          {props.strengthMeter && <PasswordLevel value={field.value ?? ""} />}
        </div>
      )}
    </FieldShell>
  );
}

export function NumberField(props: BaseFieldProps) {
  const loading = useLoading();
  return (
    <FieldShell {...props} view={(v) => formatFieldView({ kind: "number", value: v })}>
      {(field) => (
        <NumberInput
          field={field}
          placeholder={props.placeholder}
          disabled={props.disabled || loading}
        />
      )}
    </FieldShell>
  );
}

export function CurrencyField(props: CurrencyFieldProps) {
  const loading = useLoading();
  return (
    <FieldShell
      {...props}
      view={(v) => formatFieldView({ kind: "currency", value: v, currencySymbol: props.currencySymbol })}
    >
      {(field) => (
        <NumberInput
          field={field}
          icon={
            props.currencySymbol ? (
              <span className="typography-body-small-medium">{props.currencySymbol}</span>
            ) : undefined
          }
          placeholder={props.placeholder}
          disabled={props.disabled || loading}
        />
      )}
    </FieldShell>
  );
}

export function TextareaField(props: BaseFieldProps & { rows?: number }) {
  const loading = useLoading();
  return (
    <FieldShell {...props} view={(v) => formatFieldView({ kind: "text", value: v })}>
      {(field, fieldState) => (
        <Textarea
          {...field}
          value={field.value ?? ""}
          rows={props.rows}
          placeholder={props.placeholder}
          disabled={props.disabled || loading}
          state={fieldState.error ? "negative" : undefined}
          className="w-full"
        />
      )}
    </FieldShell>
  );
}
