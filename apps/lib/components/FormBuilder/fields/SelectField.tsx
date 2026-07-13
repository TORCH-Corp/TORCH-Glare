"use client";

import { SearchableSelect } from "../../SearchableSelect";
import { BadgeField } from "../../BadgeField";
import type { Tag } from "../../../hooks/useTagSelection";
import { formatFieldView } from "../viewFormat";
import type { SelectFieldProps, OptionsFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/** `FormBuilder.Select` (client-filtered) and `.SearchableSelect` (async-capable). */
export function SelectField(props: SelectFieldProps & { async?: boolean }) {
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
          filterClientSide={props.filterClientSide ?? !props.async}
          onSearchChange={props.onSearchChange}
          onLoadMore={props.onLoadMore}
          hasMore={props.hasMore}
          loading={props.loading}
          className="w-full"
        />
      )}
    </FieldShell>
  );
}

/** `FormBuilder.MultiSelect` / `.Tags` — BadgeField, value is `string[]`. */
export function MultiSelectField(props: OptionsFieldProps) {
  return (
    <FieldShell
      {...props}
      view={(v) => formatFieldView({ kind: "multi", value: v, options: props.options })}
    >
      {(field, fieldState) => {
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
            errorMessage={fieldState.error?.message}
            className="w-full"
          />
        );
      }}
    </FieldShell>
  );
}
