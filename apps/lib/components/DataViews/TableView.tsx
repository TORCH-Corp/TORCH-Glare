"use client";

import { useMemo, useState } from "react";
import { FilterPanel } from "./FilterPanel";
import type {
  DynamicRecord,
  ViewConfig,
  DynamicColumnConfig,
  DynamicFilterConfig,
  FilterState,
  FilterValue,
  FieldConfig,
} from "./types";
import { Card, CardContent, CardHeader } from "../Card";
import { Checkbox } from "../Checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCheckbox,
} from "../Table";
import {
  getByPath,
  matchesFilterValues,
} from "../../utils/dataViews/pathUtils";
import { renderField } from "./fieldRenderers";
import { visibleFields } from "../../utils/dataViews/fieldUtils";
import { useIsMobile } from "../../hooks/useIsMobile";

export type TableViewProps = {
  data: DynamicRecord[];
  columns?: DynamicColumnConfig[];
  fields: FieldConfig[];
  config: ViewConfig;
  onDataUpdate?: (data: DynamicRecord[]) => void;
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  filters?: DynamicFilterConfig[];
  filterState?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
  showFilters?: boolean;
};

export function TableView({
  data,
  fields,
  config,
  onSortChange,
  filters: filterConfig,
  filterState: externalFilterState,
  onFilterChange,
  showFilters = true,
}: TableViewProps) {
  const isMobile = useIsMobile();
  const [internalFilters, setInternalFilters] = useState<FilterState>({});

  const activeFilters = externalFilterState ?? internalFilters;

  const sortPath = config.sortBy || null;
  const sortDirection: "asc" | "desc" = config.sortOrder ?? "asc";

  const handleSort = (path: string) => {
    if (!onSortChange) return;
    if (sortPath === path) {
      onSortChange(path, sortDirection === "asc" ? "desc" : "asc");
    } else {
      onSortChange(path, "asc");
    }
  };

  const handleFilterChange = (path: string, value: FilterValue) => {
    const newFilters: FilterState = { ...activeFilters, [path]: value };
    if (onFilterChange) onFilterChange(newFilters);
    else setInternalFilters(newFilters);
  };

  const clearAllFilters = () => {
    if (onFilterChange) onFilterChange({});
    else setInternalFilters({});
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((item) =>
      Object.entries(activeFilters).every(([path, filterValues]) =>
        matchesFilterValues(item, path, filterValues),
      ),
    );

    if (sortPath) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = getByPath(a, sortPath);
        const bVal = getByPath(b, sortPath);
        const modifier = sortDirection === "asc" ? 1 : -1;

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (typeof aVal === "string" && typeof bVal === "string") {
          return aVal.localeCompare(bVal) * modifier;
        }
        if (typeof aVal === "number" && typeof bVal === "number") {
          return (aVal - bVal) * modifier;
        }
        return String(aVal).localeCompare(String(bVal)) * modifier;
      });
    }

    return filtered;
  }, [data, activeFilters, sortPath, sortDirection]);

  const displayFields = useMemo(
    () => visibleFields(fields).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [fields],
  );

  const filtersEnabled = showFilters && config.showFilters !== false;

  return (
    <div className="flex h-full bg-background-presentation-form-base">
      {filtersEnabled && !isMobile && (
        <FilterPanel
          data={data}
          fields={fields}
          filters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearAll={clearAllFilters}
          filterConfig={filterConfig}
        />
      )}

      <div className="flex flex-1 flex-col gap-4  overflow-hidden">
        {!isMobile ? (
          <div className="flex-1 overflow-auto rounded-lg">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead isDummy className="w-12">
                    <Checkbox />
                  </TableHead>
                  {displayFields.map((field) => (
                    <TableHead
                      key={field.path}
                      size="M"
                      sortType={
                        sortPath === field.path ? sortDirection : undefined
                      }
                      onSort={() => handleSort(field.path)}
                    >
                      {field.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((item, idx) => (
                  <TableRow key={item.id ?? idx}>
                    <TableCell isDummy className="w-12">
                      <TableCheckbox id={`row-${item.id ?? idx}`} />
                    </TableCell>
                    {displayFields.map((field) => (
                      <TableCell key={field.path}>
                        {/* `isolate` confines the Badge's mix-blend-luminosity
                            to a local stacking context and `transform-gpu`
                            promotes it to its own layer, so the table's
                            post-mount column reflow repaints cleanly instead
                            of leaving a ghosted/doubled badge frame. */}
                        <span className="isolate inline-flex transform-gpu">
                          {renderField(
                            getByPath(item, field.path),
                            field,
                            item,
                          )}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <div className="grid gap-3">
              {filteredAndSortedData.map((item, idx) => (
                <Card key={item.id ?? idx} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox className="mt-1" />
                        <div className="flex-1">
                          {displayFields[0] && (
                            <p className="font-medium">
                              {String(
                                getByPath(item, displayFields[0].path) ?? "",
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    {displayFields.slice(1).map((field) => (
                      <div
                        key={field.path}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-content-presentation-global-tertiary">
                          {field.label}:
                        </span>
                        <span>
                          {renderField(
                            getByPath(item, field.path),
                            field,
                            item,
                          )}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
