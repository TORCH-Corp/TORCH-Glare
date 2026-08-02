"use client";

import { Fragment } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Badge } from "../../Badge";
import { X } from "lucide-react";
import { Checkbox } from "../../Checkbox";
import { DataViewRadio } from "../DataViewRadio";
import {
  optionDivider,
  optionListStyles,
  optionRowStyles,
  panelDivider,
  panelSectionTitle,
} from "../styles";
import type {
  DynamicRecord,
  FieldConfig,
  FieldType,
  FilterState,
  FilterValue,
  NumericRangeFilter,
  DateRangeFilter,
} from "../types";
import { getByPath, formatPathLabel } from "../../../utils/dataViews/pathUtils";
import {
  computeNumericExtremes,
  countActiveFilters,
  inferStep,
  isDateRange,
  isNumericRange,
  resolvePresets,
} from "../../../utils/dataViews/rangeUtils";
import { RangeSliderWithInputs } from "./RangeSliderWithInputs";
import { DatePickerRangeFilter } from "./DatePickerRangeFilter";
import { PresetChips } from "./PresetChips";
import { resolveBadgeVariant } from "../badgeAdapter";
import { SearchableSelect } from "../../SearchableSelect";
import type { SearchableSelectOption } from "../../SearchableSelect";

type FilterPanelProps = {
  data: readonly DynamicRecord[];
  fields: readonly FieldConfig[];
  filters: FilterState;
  onFilterChange: (path: string, value: FilterValue) => void;
  onClearAll: () => void;
};

const NUMERIC_TYPES: FieldType[] = [
  "number",
  "number-format",
  "currency",
  "progress-bar",
  "star-rating",
];

const DATE_TYPES: FieldType[] = ["date", "date-format"];

type FilterKind = "categorical" | "numeric-range" | "date-range";

type Entry = {
  path: string;
  label: string;
  kind: FilterKind;
  field: FieldConfig;
};

/**
 * A field becomes filterable when it opts in explicitly (`filterable: true`),
 * when its type is inherently categorical, or — for plain text — when it has a
 * small enough set of distinct values to be worth a checkbox list.
 */
function buildFilterableEntries(
  data: readonly DynamicRecord[],
  fields: readonly FieldConfig[],
): Entry[] {
  const entries: Entry[] = [];

  for (const f of fields) {
    if (f.type === "hidden") continue;
    if (f.filterable === false) continue;

    const isExplicit = f.filterable === true;
    const isCategoricalAuto =
      f.type === "enum-badge" ||
      f.type === "boolean" ||
      f.type === "badge-array" ||
      f.type === "icon-text";
    const isNumeric = f.type != null && NUMERIC_TYPES.includes(f.type);
    const isDate = f.type != null && DATE_TYPES.includes(f.type);

    let include = isExplicit || isCategoricalAuto;

    if (!include) {
      if (f.type !== "text" && f.type !== undefined) continue;
      const unique = new Set<string>();
      for (const item of data) {
        const v = getByPath(item, f.path);
        if (v == null) continue;
        unique.add(String(v));
        if (unique.size > 10) break;
      }
      include = unique.size > 0 && unique.size <= 10;
    }

    if (!include) continue;

    entries.push({
      path: f.path,
      label: f.filterLabel ?? f.label ?? formatPathLabel(f.path),
      kind: isNumeric ? "numeric-range" : isDate ? "date-range" : "categorical",
      field: f,
    });
  }

  return entries;
}

function getCategoricalOptions(
  data: readonly DynamicRecord[],
  path: string,
  field: FieldConfig,
): string[] {
  if (field.filterOptions && field.filterOptions.length > 0) {
    return normalizeOptions(field.filterOptions);
  }
  if (field.variants) {
    const fromMap = Object.keys(field.variants);
    const fromData = collectUnique(data, path);
    return Array.from(new Set([...fromMap, ...fromData]));
  }
  return collectUnique(data, path);
}

function normalizeOptions(opts: NonNullable<FieldConfig["filterOptions"]>): string[] {
  if (opts.length === 0) return [];
  if (typeof opts[0] === "string") return opts as string[];
  return (opts as { label: string; value: string }[]).map((o) => o.value);
}

function collectUnique(data: readonly DynamicRecord[], path: string): string[] {
  const set = new Set<string>();
  for (const item of data) {
    const v = getByPath(item, path);
    if (v == null) continue;
    if (Array.isArray(v)) {
      for (const x of v) set.add(String(x));
    } else {
      set.add(String(v));
    }
  }
  return Array.from(set).sort();
}

export function FilterPanel({
  data,
  fields,
  filters,
  onFilterChange,
  onClearAll,
}: FilterPanelProps) {
  const entries = buildFilterableEntries(data, fields);

  const setFilter = (path: string, value: FilterValue) => {
    onFilterChange(path, value);
    fields.find((f) => f.path === path)?.onFilterChange?.(value);
  };

  const toggleCategorical = (path: string, option: string) => {
    const current = filters[path];
    const arr = Array.isArray(current) ? current : [];
    const next = arr.includes(option) ? arr.filter((v) => v !== option) : [...arr, option];
    setFilter(path, next);
  };

  const totalFilters = countActiveFilters(filters);

  if (entries.length === 0) return null;

  const countBadge = resolveBadgeVariant("gray");

  return (
    <div className="flex flex-col gap-6 px-3 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className={panelSectionTitle()}>Filters</h3>
          {totalFilters > 0 && (
            <Badge
              {...countBadge}
              label={String(totalFilters)}
              showIcon={false}
              className="h-5 w-5 min-w-0 justify-center rounded-full p-0 text-xs"
              size="XS"
            />
          )}
        </div>
        {totalFilters > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 rounded-[4px] bg-white/[0.15] px-1.5 py-0.5 text-[12px] font-[510] text-content-presentation-global-primary transition-colors hover:bg-white/25"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {entries.map((entry, index) => (
        <Fragment key={entry.path}>
          {index > 0 && <div className={panelDivider()} />}
          <div className="space-y-3">
            <h3 className={panelSectionTitle()}>{entry.label}</h3>
            <FilterBody
              entry={entry}
              data={data}
              value={filters[entry.path]}
              onCategoricalToggle={(opt) => toggleCategorical(entry.path, opt)}
              onSetFilter={(v) => setFilter(entry.path, v)}
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

/** A single option's visible content: a colored Badge when the field declares a
 *  variant for it, the raw string otherwise. */
function OptionLabel({ entry, option }: { entry: Entry; option: string }) {
  const variant = entry.field.variants?.[option];
  if (!variant) return <>{option}</>;
  return <Badge {...resolveBadgeVariant(variant)} label={option} size="XS" />;
}

function FilterBody({
  entry,
  data,
  value,
  onCategoricalToggle,
  onSetFilter,
}: {
  entry: Entry;
  data: readonly DynamicRecord[];
  value: FilterValue | undefined;
  onCategoricalToggle: (option: string) => void;
  onSetFilter: (next: FilterValue) => void;
}) {
  if (entry.kind === "numeric-range") {
    const extremes = computeNumericExtremes(data, entry.path);
    if (!extremes || extremes.min === extremes.max) {
      return (
        <div className="text-xs text-content-presentation-global-tertiary">No range to filter.</div>
      );
    }
    const step = inferStep(entry.field, extremes);
    const presets = resolvePresets(entry.field);
    const numericValue: NumericRangeFilter | undefined = isNumericRange(value) ? value : undefined;
    return (
      <div className="space-y-3">
        {presets.length > 0 && (
          <PresetChips presets={presets} current={value} onSelect={onSetFilter} />
        )}
        <RangeSliderWithInputs
          field={entry.field}
          extremes={extremes}
          step={step}
          value={numericValue}
          onChange={onSetFilter}
        />
      </div>
    );
  }

  if (entry.kind === "date-range") {
    const dateValue: DateRangeFilter | undefined = isDateRange(value) ? value : undefined;
    // Glare DatePicker in range mode — pick a from→to span. (No quick-preset
    // chips: the calendar range selection is the single intended interaction.)
    return <DatePickerRangeFilter value={dateValue} onChange={onSetFilter} />;
  }

  const opts = getCategoricalOptions(data, entry.path, entry.field);
  const selected = Array.isArray(value) ? value : [];

  // Searchable single-select dropdown — for fields with many options. Stores
  // the chosen value as a 1-element array (empty when cleared) to stay
  // consistent with the categorical FilterValue shape.
  if (entry.field.filterVariant === "searchable-select") {
    const selectOptions: SearchableSelectOption[] = opts.map((opt) => ({
      value: opt,
      label: opt,
    }));
    return (
      <SearchableSelect
        options={selectOptions}
        value={selected[0] ?? null}
        onValueChange={(v) => onSetFilter(v ? [v] : [])}
        placeholder={`Select ${entry.label}…`}
        icon={<i className="ri-search-line" />}
      />
    );
  }

  if (entry.field.filterMode === "single") {
    const current = selected[0] ?? "";
    return (
      <RadioGroupPrimitive.Root
        value={current}
        onValueChange={(next: string) => onSetFilter(next ? [next] : [])}
        className={optionListStyles()}
      >
        {opts.map((opt, i) => (
          <div key={opt}>
            {i > 0 && <div className={optionDivider()} />}
            <DataViewRadio value={opt}>
              <OptionLabel entry={entry} option={opt} />
            </DataViewRadio>
          </div>
        ))}
      </RadioGroupPrimitive.Root>
    );
  }

  return (
    <div className={optionListStyles()}>
      {opts.map((opt, i) => (
        <div key={opt}>
          {i > 0 && <div className={optionDivider()} />}
          <label htmlFor={`${entry.path}-${opt}`} className={optionRowStyles()}>
            <Checkbox
              id={`${entry.path}-${opt}`}
              checked={selected.includes(opt)}
              onCheckedChange={() => onCategoricalToggle(opt)}
            />
            <span className="flex-1 leading-none">
              <OptionLabel entry={entry} option={opt} />
            </span>
          </label>
        </div>
      ))}
    </div>
  );
}
