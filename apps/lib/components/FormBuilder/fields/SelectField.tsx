"use client";

import { SearchableSelect } from "../../SearchableSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Select";
import { BadgeField } from "../../BadgeField";
import type { Tag } from "../../../hooks/useTagSelection";
import { useLoading, useCell } from "../context";
import { formatFieldView } from "../viewFormat";
import type { SelectFieldProps, SearchableSelectFieldProps, OptionsFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/** `FormBuilder.Select` — the plain `Select` dropdown. */
export function SelectField(props: SelectFieldProps) {
  const loading = useLoading();
  const cell = useCell();

  return (
    <FieldShell
      {...props}
      view={(v) => formatFieldView({ kind: "option", value: v, options: props.options })}
    >
      {(field) => (
        <Select
          value={typeof field.value === "string" ? field.value : ""}
          onValueChange={field.onChange}
          disabled={props.disabled || loading}
        >
          <SelectTrigger size="XL" onTable={cell} className="w-full">
            <SelectValue placeholder={props.placeholder ?? "Select…"} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FieldShell>
  );
}

/**
 * `FormBuilder.SearchableSelect` — the `SearchableSelect` combobox: a search box with
 * client-side filtering, or server-side search + infinite scroll via the async props.
 */
export function SearchableSelectField(props: SearchableSelectFieldProps) {
  const cell = useCell();
  return (
    <FieldShell
      {...props}
      view={(v) => formatFieldView({ kind: "option", value: v, options: props.options })}
    >
      {(field) => (
        <SearchableSelect
          options={props.options}
          value={field.value ?? null}
          onValueChange={(value) => field.onChange(value)}
          placeholder={props.placeholder ?? "Select…"}
          filterClientSide={props.filterClientSide ?? true}
          onSearchChange={props.onSearchChange}
          onLoadMore={props.onLoadMore}
          hasMore={props.hasMore}
          loading={props.loading}
          onTable={cell}
          className="w-full"
        />
      )}
    </FieldShell>
  );
}

/** `FormBuilder.MultiSelect` / `.Tags` — BadgeField, value is `string[]`. */
export function MultiSelectField(props: OptionsFieldProps) {
  const cell = useCell();
  return (
    <FieldShell
      {...props}
      view={(v) => formatFieldView({ kind: "multi", value: v, options: props.options })}
    >
      {(field) => {
        const selected = new Set<string>(Array.isArray(field.value) ? field.value : []);
        const tags: Tag[] = props.options.map((opt) => ({
          id: opt.value,
          name: opt.label,
          value: opt.value,
          isSelected: selected.has(opt.value),
        }));
        return (
          <BadgeField
            tags={tags}
            onValueChange={(picked) => field.onChange(picked.map((t) => t.value ?? t.id))}
            onTable={cell}
            className="w-full"
          />
        );
      }}
    </FieldShell>
  );
}
