"use client";

import { SearchableSelect } from "../../SearchableSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Select";
import { BadgeField } from "../../BadgeField";
import type { Tag } from "../../../hooks/useTagSelection";
import { useLoading, useOnTable } from "../context";
import type { SelectFieldProps, SearchableSelectFieldProps, OptionsFieldProps } from "../types";
import { FieldShell } from "./FieldShell";

/** `FormBuilder.Select` — the plain `Select` dropdown. */
export function SelectField(props: SelectFieldProps) {
  const loading = useLoading();
  const onTable = useOnTable();

  return (
    <FieldShell {...props}>
      {(field) => (
        <Select
          value={typeof field.value === "string" ? field.value : ""}
          onValueChange={field.onChange}
          disabled={props.disabled || loading}
        >
          <SelectTrigger size="XL" onTable={onTable} className="w-full">
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
  const onTable = useOnTable();
  return (
    <FieldShell {...props}>
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
          onTable={onTable}
          className="w-full"
        />
      )}
    </FieldShell>
  );
}

/**
 * `FormBuilder.MultiSelect` / `.Tags` — BadgeField, value is `string[]`.
 *
 * With `creatable`, the user can type a value that is not in `options` and it becomes a badge —
 * so a free-text list (emails, aliases, tags) is one field rather than a one-column table. Pass
 * `options={[]}` for a pure free-text list.
 */
export function MultiSelectField(props: OptionsFieldProps) {
  const onTable = useOnTable();
  return (
    <FieldShell {...props}>
      {(field) => {
        const values: string[] = Array.isArray(field.value) ? field.value : [];
        const byValue = new Map(props.options.map((opt) => [opt.value, opt]));
        // Selected first, IN VALUE ORDER, then whatever is left to offer. Order matters: the
        // hook re-syncs from this list, so building it in `options` order would reshuffle the
        // user's badges on every keystroke — and drop any created value that is not an option.
        const tags: Tag[] = [
          ...values.map((value) => ({
            id: value,
            name: byValue.get(value)?.label ?? value,
            value,
            isSelected: true,
          })),
          ...props.options
            .filter((opt) => !values.includes(opt.value))
            .map((opt) => ({
              id: opt.value,
              name: opt.label,
              value: opt.value,
              isSelected: false,
            })),
        ];
        return (
          <BadgeField
            tags={tags}
            creatable={props.creatable}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onValueChange={(picked) => field.onChange(picked.map((t) => t.value ?? t.id))}
            onTable={onTable}
            className="w-full"
          />
        );
      }}
    </FieldShell>
  );
}
